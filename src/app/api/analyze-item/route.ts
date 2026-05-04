import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Key or Image" }, { status: 400 });

    // 🏆 不要なヘッダー（data:image/jpeg;base64, 等）を完全に除去
    const base64Data = image.split(",")[1] || image;

    // 🚀 v1 安定版エンドポイント
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 📦 Google公式ドキュメント準拠の厳格なリクエスト構造
    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze the item in this image for a hotel lost and found system. Respond ONLY with a clean JSON object: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴\"], \"matchConfidence\": 95 }" },
          { 
            inline_data: { 
              mime_type: "image/jpeg", 
              data: base64Data 
            } 
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topP: 1,
        topK: 32,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Google API Error ${response.status}`);
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("AIが適切な回答を生成できませんでした。別の画像でお試しください。");
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    return NextResponse.json({ 
      error: "AI解析失敗", 
      message: error.message 
    }, { status: 500 });
  }
}
