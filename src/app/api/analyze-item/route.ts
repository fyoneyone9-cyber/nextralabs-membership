import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Data" }, { status: 400 });

    const base64Data = image.split(",")[1] || image;

    // 🚀 【2026年最新仕様】エンドポイント
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze this image for a hotel lost and found system. Respond ONLY with a clean JSON object: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\", \"特徴2\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }],
      generationConfig: {
        // 🛠️ 修正: response_mime_type を最新仕様の responseMimeType に変更
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google API Error: ${data.error?.message || "Invalid Field"}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ 
      error: "AI解析の最終調整完了", 
      message: error.message 
    }, { status: 500 });
  }
}
