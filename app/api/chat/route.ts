import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DAILY_LIMIT = 10;
const usageMap = new Map();

function getClientIP(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req) {
  const ip = getClientIP(req);
  const today = getTodayString();

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

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: 'あなたはHatarakAIの求人アドバイザーです。ユーザーの仕事探しや転職相談に親切丁寧に日本語でお答えください。医療・福祉・介護・IT・事務など幅広い職種に対応しています。給与・待遇・働き方・資格取得など、求職者が知りたい情報を具体的にアドバイスしてください。回答は簡潔にまとめ、箇条書きを活用してわかりやすくしてください。',
      messages: messages,
    });

    const currentUsage = usageMap.get(ip);
    const remaining = DAILY_LIMIT - (currentUsage?.count || 0);

    return NextResponse.json({
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      remaining: remaining,
    });
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'AIとの通信に失敗しました。しばらく後でもう一度お試しください。' },
      { status: 500 }
    );
  }
}
