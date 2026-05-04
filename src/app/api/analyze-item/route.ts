import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "画像データが空です" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey) {
      return NextResponse.json({ error: "APIキー未設定(ENV_MISSING)" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Base64データをクリーンアップ（プレフィックス除去）
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    const prompt = `
      画像内の「忘れ物」を分析し、以下のJSON形式でのみ答えてください。
      {
        "item": "品目名",
        "color": "色",
        "brand": "ブランド（不明なら不明）",
        "features": ["特徴1", "特徴2"],
        "matchConfidence": 90
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // JSONのパース（Markdownの囲み等を除去）
    const cleanText = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanText);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ 
      error: "AI解析に失敗しました", 
      message: error.message 
    }, { status: 500 });
  }
}
