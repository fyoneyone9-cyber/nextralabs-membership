import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "画像データがありません" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey) {
      console.error("Critical: GEMINI_API_KEY is not set in environment variables.");
      return NextResponse.json({ error: "APIキーが設定されていません。Vercelの環境変数を確認してください。" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Base64からデータ部分のみを抽出
    const base64Data = image.split(",")[1];
    
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
    
    // JSONのパース（バックティックなどの余計な文字を除去）
    const cleanText = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanText);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Staysee AI Analysis Error:", error);
    return NextResponse.json({ 
      error: "AI解析に失敗しました", 
      details: error.message 
    }, { status: 500 });
  }
}
