import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    // 🛠️ どんな環境でも確実にキーを掴むための「最終防衛ロジック」
    // process.env を直接スキャンして、大文字小文字問わず GEMINI_API_KEY を探し出す
    const env = process.env;
    let apiKey = env.GEMINI_API_KEY || env.GEMINI_API_KEY1 || env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // もし上記で見つからない場合、全環境変数をループして検索
    if (!apiKey) {
      const keys = Object.keys(env);
      for (const k of keys) {
        if (k.toUpperCase().includes("GEMINI") && k.toUpperCase().includes("KEY")) {
          apiKey = env[k];
          break;
        }
      }
    }

    if (!apiKey) {
      return NextResponse.json({ 
        error: "サーバーにAPIキーが設定されていません",
        detected_keys: Object.keys(env).filter(k => k.includes("KEY") || k.includes("API")),
        tip: "VercelでRedeployを必ず実行してください"
      }, { status: 500 });
    }

    // 🏆 余計な空白や改行を徹底除去
    const cleanApiKey = apiKey.trim().replace(/[\n\r]/g, "");
    const base64Data = image.split(",")[1] || image;

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${cleanApiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { inline_data: { mime_type: "image/jpeg", data: base64Data } },
          { text: "Analyze this image for hotel lost and found. Respond with JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴\"], \"matchConfidence\": 95 }" }
        ]
      }],
      generationConfig: { response_mime_type: "application/json" }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: "Google API Error", 
        message: data.error?.message,
        status: response.status
      }, { status: response.status });
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ error: "Runtime Error", message: error.message }, { status: 500 });
  }
}
