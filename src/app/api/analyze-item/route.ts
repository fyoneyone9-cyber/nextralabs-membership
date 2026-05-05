import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "No Data" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 🚀 【真の最終形態】v1betaではなく v1 を使用。
    // URLの models/ の後に直接 ID を書くことで、Google側のURL組み立てミスを物理的に防ぎます。
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze this lost item image. Return ONLY a clean JSON object: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }],
      generationConfig: {
        // v1仕様では responseMimeType が正解
        responseMimeType: "application/json",
        temperature: 0.1
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google Critical Error: ${data.error?.message || "Access Denied"}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ 
      error: "AI解析エンジン最終同期中", 
      message: error.message 
    }, { status: 500 });
  }
}
