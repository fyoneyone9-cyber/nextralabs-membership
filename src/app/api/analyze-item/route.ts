import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Key or Image" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // SDKを完全に捨て、Googleの生のエンドポイントに直接アクセス
    // これによりモデル名の404バグを物理的に回避します
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze the object in this image for a hotel lost and found system. Respond ONLY with a raw JSON object: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\", \"特徴2\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }],
      generationConfig: {
        response_mime_type: "application/json"
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google API Direct Error: ${data.error?.message || "Status " + response.status}`);
    }

    // 正常レスポンスからテキストを抽出
    const responseText = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("STAYSEE_CRITICAL_ERROR:", error);
    return NextResponse.json({ 
      error: "直接通信モード失敗", 
      message: error.message 
    }, { status: 500 });
  }
}
