import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "No Data" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 【最終形態】モデル名を最も互換性の高い gemini-pro-vision に変更し、v1 エンドポイントを使用
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze this image. Respond ONLY with JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴\"], \"matchConfidence\": 95 }" },
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
      // Pro Vision もダメな場合、モデル名リストを取得してデバッグする最終情報を出す
      throw new Error(`Google Final Error: ${data.error?.message || "Not found"}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    return NextResponse.json({ error: "全モデル/全URL試行失敗", message: error.message }, { status: 500 });
  }
}
