import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    
    if (!apiKey || !image) return NextResponse.json({ error: "No Data" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 試行するエンドポイントとモデルの全パターン
    const configs = [
      { v: "v1beta", model: "gemini-1.5-flash" },
      { v: "v1", model: "gemini-1.5-flash" },
      { v: "v1beta", model: "gemini-pro-vision" },
      { v: "v1", model: "gemini-pro-vision" }
    ];

    let lastErrorMessage = "";

    for (const config of configs) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${config.v}/models/${config.model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Analyze this image for hotel lost and found. Respond ONLY with raw JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }" },
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
        } else {
          lastErrorMessage = data.error?.message || "Not found";
          continue; // 次の構成へ
        }
      } catch (e: any) {
        lastErrorMessage = e.message;
        continue;
      }
    }

    throw new Error(`利用可能なモデルが見つかりません。Google AI Studioで「Pay-as-you-go」を有効にするか、別のキーを試してください。最後のエラー: ${lastErrorMessage}`);

  } catch (error: any) {
    return NextResponse.json({ error: "全自動試行失敗", message: error.message }, { status: 500 });
  }
}
