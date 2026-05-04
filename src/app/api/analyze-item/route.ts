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
    
    /**
     * 【重要】404 Not Found 対策
     * SDKの内部で URL が /v1beta/models/models/xxx と重複するのを防ぐため、
     * バージョン指定付きの最新名称を使用します。
     */
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    const prompt = "Analyze the item in this image (Lost and Found). Return ONLY JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\"], \"matchConfidence\": 95 }";

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    
    // JSONのパース（Markdown等のノイズ除去）
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("CRITICAL API ERROR:", error);
    // 404エラーが出た場合に、画面に詳細なURL情報を出してデバッグできるようにします
    return NextResponse.json({ 
      error: "AI解析エラー(404対策版)", 
      message: error.message,
      tip: "Google AI Studioで1.5 Flashが有効か確認してください"
    }, { status: 500 });
  }
}
