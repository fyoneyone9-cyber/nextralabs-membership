import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) return NextResponse.json({ error: "No image" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey) return NextResponse.json({ error: "No API Key" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 最も確実なモデル名を指定。models/ をつける形式も試す
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    const prompt = "画像内のアイテムを分析し、以下のJSONのみ返して: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\"], \"matchConfidence\": 90 }";

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
    
    const cleanText = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanText));
  } catch (error: any) {
    // 404が出た場合、モデル名を「gemini-pro-vision」など旧名でリトライするロジックも検討できますが、
    // まずはエラー詳細をより正確に出力
    return NextResponse.json({ 
      error: "AI解析エラー", 
      message: error.message 
    }, { status: 500 });
  }
}
