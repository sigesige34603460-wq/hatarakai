import { NextRequest, NextResponse } from 'next/server';

const DAILY_LIMIT = 10;
const usageMap = new Map();

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
        max_tokens: 1024,
        system: 'あなたはHatarakAIの求人アドバイザーです。ユーザーの仕事探しや転職相談に親切丁寧に日本語でお答えください。',
        messages,
      }),
    });

    const data = await res.json();
    const currentUsage = usageMap.get(ip);
    const remaining = DAILY_LIMIT - (currentUsage?.count || 0);

    // デバッグ：レスポンス全体を返す
    return NextResponse.json({ debug: data, remaining });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'AIとの通信に失敗しました。' },
      { status: 500 }
    );
  }
}
