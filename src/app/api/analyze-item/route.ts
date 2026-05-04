import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    
    if (!apiKey || !image) return NextResponse.json({ error: "No Data" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 【重要】v1beta ではなく v1 を使用し、モデル名に models/ を含めない形式でリクエスト
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze the item in this image for a hotel lost and found system. Respond with ONLY JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\", \"特徴2\"], \"matchConfidence\": 95 }" },
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
      // もしv1でもダメな場合の詳細エラーを出力
      throw new Error(data.error?.message || `Status: ${response.status}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    return NextResponse.json({ 
      error: "API接続エラー", 
      message: error.message 
    }, { status: 500 });
  }
}
