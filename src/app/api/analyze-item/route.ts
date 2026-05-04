import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Key/Image" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    // v1beta がダメなら v1 (正式版) を、Flash がダメなら Pro を試す
    // このURLがGoogle APIの「最終正解」の一つです
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze this image. Return ONLY JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google API (v1/Pro) Error: ${data.error?.message || "Not found"}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    return NextResponse.json({ 
      error: "最終URL/モデル試行失敗", 
      message: error.message 
    }, { status: 500 });
  }
}
