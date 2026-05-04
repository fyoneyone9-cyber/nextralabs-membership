import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Data" }, { status: 400 });

    // 🛠️ 400エラー対策: 確実にBase64データのみを抽出する正規表現
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 試行するモデル候補
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro-vision"];
    let lastError = "";

    for (const modelName of models) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const requestBody = {
        contents: [{
          parts: [
            { text: "Analyze this lost item image. Return ONLY JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴\"], \"matchConfidence\": 95 }" },
            { inline_data: { mime_type: "image/jpeg", data: base64Data } }
          ]
        }]
      };

      try {
        const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody) });
        const data = await response.json();
        
        if (response.ok) {
          const text = data.candidates[0].content.parts[0].text;
          const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
          return NextResponse.json(JSON.parse(cleanJson));
        } else {
          lastError = data.error?.message || "Not Found";
        }
      } catch (e: any) { lastError = e.message; }
    }

    throw new Error(`全モデル試行失敗: ${lastError}`);
  } catch (error: any) {
    return NextResponse.json({ error: "AI解析失敗", message: error.message }, { status: 500 });
  }
}
