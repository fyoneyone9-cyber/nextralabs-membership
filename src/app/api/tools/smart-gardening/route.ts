import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location, modelType = "gemini" } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    // --- Gemini 1.5 Pro 呼び出し ---
    if (modelType === "gemini") {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const result = await model.generateContent([
        { inlineData: { data: base64Data, mimeType } },
        { text: `あなたはAIガーデナーです。写真を分析し、場所(${location})の天気を踏まえて水やり診断をしてください。相談: ${prompt}` }
      ]);

      const response = await result.response;
      return NextResponse.json({ advice: response.text(), model: "Gemini 1.5 Pro" });
    }

    // --- GPT-4o (Vision) 呼び出し（将来の拡張用に枠を確保。現状は別のGeminiモデル等で代用可） ---
    // ここで OpenAI API キーがある場合は GPT-4o を呼び出す処理を実装可能
    
    return NextResponse.json({ advice: "選択されたAIモデルは現在準備中です。Geminiをお使いください。", model: "System" });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'AI解析に失敗しました。モデルを切り替えるか、撮り直してください。' }, { status: 500 });
  }
}
