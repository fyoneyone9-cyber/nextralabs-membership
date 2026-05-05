import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const env = process.env;
    let apiKey = env.GEMINI_API_KEY || env.GEMINI_API_KEY1 || env.NEXT_PUBLIC_GEMINI_API_KEY;

    // 🛠️ 詳細診断: キーの状態を私(AI)に伝える
    const keyDiagnostic = {
      found_name: apiKey ? "GEMINI_API_KEY" : "NONE",
      value_length: apiKey ? apiKey.length : 0, // 0なら「空文字」が登録されている証拠
      is_empty: !apiKey || apiKey.trim() === "",
      available_keys: Object.keys(env).filter(k => k.includes("KEY"))
    };

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ 
        error: "サーバーにAPIキーが設定されていません(EMPTY_OR_MISSING)",
        diagnostic: keyDiagnostic,
        tip: "Vercelで一度キーを消して、全環境にチェックを入れて再登録してください"
      }, { status: 500 });
    }

    const base64Data = image.split(",")[1] || image;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: base64Data } },
            { text: "Analyze this image. Respond with JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }" }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Google API Error");

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ error: "Analysis Failed", message: error.message }, { status: 500 });
  }
}
