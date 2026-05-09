import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('ai-recipe', 10);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '写真が必要です' }, { status: 400 });

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 成功実績のあるマルチモーダル形式
    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: "写真の食材から作れる料理名を1つだけ日本語で答えてください。名称のみ出力してください。" }
    ]);

    const dishName = result.response.text().trim().replace(/[#*]/g, "");

    return NextResponse.json({ dishName: dishName || "食材" });
  } catch (error: any) {
    console.error('Recipe Scan Error:', error);
    return NextResponse.json({ dishName: "絶品料理" });
  }
}
