import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('ai-stylist', 10);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: '本日の利用上限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    return NextResponse.json({ message: "Stylist API Initialized" });
  } catch (error) {
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
