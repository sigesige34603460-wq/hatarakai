import { NextRequest, NextResponse } from 'next/server';

const DAILY_LIMIT = 10;
const usageMap = new Map();

const SYSTEM_PROMPT = `あなたはHatarakAIの親切な就職・転職アドバイザーです。
ユーザーの仕事探しを、信頼できる友人のようにサポートしてください。

【会話の進め方】
- 一度に1〜2個の質問をしながら、相手の状況を丁寧に聞き出してください
- 聞くべき情報：現在の状況（在職中/求職中）、希望職種・業種、希望勤務地、働き方（正社員/パート/在宅など）、希望年収、経験・資格
- 情報が集まったら、具体的な求人の方向性やアドバイスを提案してください
- 返答は短くわかりやすく、絵文字を適度に使って親しみやすくしてください
- 一度に大量の情報を出さず、会話のキャッチボールを大切にしてください
- 常に日本語で回答してください`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const today = new Date().toISOString().split('T')[0];
  const usage = usageMap.get(ip);

  if (usage && usage.date === today && usage.count >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: '1日の利用上限（10回）に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  if (!usage || usage.date !== today) {
    usageMap.set(ip, { count: 1, date: today });
  } else {
    usageMap.set(ip, { count: usage.count + 1, date: today });
  }

  try {
    const { messages } = await req.json();

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error('Anthropic API error:', errData);
      return NextResponse.json(
        { error: errData.error?.message || 'AIとの通信に失敗しました。' },
        { status: res.status }
      );
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text ?? 'すみません、回答を生成できませんでした。';
    const currentUsage = usageMap.get(ip);
    const remaining = DAILY_LIMIT - (currentUsage?.count || 0);

    return NextResponse.json({ reply, remaining });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'AIとの通信に失敗しました。' },
      { status: 500 }
    );
  }
}
