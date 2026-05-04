import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Data" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 🏆 あらゆるプロジェクトで動く可能性のあるモデル名を全網羅
    const models = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro-vision",
      "gemini-1.0-pro-vision-latest"
    ];

    let lastError = "";
    for (const modelName of models) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Analyze this lost item image. Return ONLY JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }" },
                { inline_data: { mime_type: "image/jpeg", data: base64Data } }
              ]
            }]
          })
        });

        const data = await response.json();
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = data.candidates[0].content.parts[0].text;
          const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
          return NextResponse.json(JSON.parse(cleanJson));
        }
        lastError = data.error?.message || "Not Found";
      } catch (e: any) {
        lastError = e.message;
      }
    }

    throw new Error(`Google APIの有効化待ち、またはキーの制限です。(${lastError})`);
  } catch (error: any) {
    return NextResponse.json({ error: "解析システム準備中", message: error.message }, { status: 500 });
  }
}
