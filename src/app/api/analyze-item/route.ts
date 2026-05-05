import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "No Data" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    // 🌍 成功率100%を目指すための全パターン網羅
    const attemps = [
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}` },
      { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}` },
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}` }
    ];

    let lastError = "";

    for (const attempt of attemps) {
      try {
        const response = await fetch(attempt.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Analyze this image for hotel lost and found. Respond with JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }" },
                { inline_data: { mime_type: "image/jpeg", data: base64Data } }
              ]
            }]
          })
        });

        const data = await response.json();
        if (response.ok && data.candidates) {
          const text = data.candidates[0].content.parts[0].text;
          const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
          return NextResponse.json(JSON.parse(cleanJson));
        }
        lastError = data.error?.message || "Model Not Found";
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    throw new Error(`全API試行が失敗しました。Google側でAPIが有効化されるのを待つ必要があります。(${lastError})`);

  } catch (error: any) {
    return NextResponse.json({ error: "APIサーバー接続エラー", message: error.message }, { status: 500 });
  }
}
