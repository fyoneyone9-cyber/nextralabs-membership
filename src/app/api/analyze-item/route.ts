import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] API_START: /api/analyze-item`);

  try {
    const { image } = await req.json();
    
    // 🔍 LOG 1: リクエストデータのチェック
    if (!image) {
      console.error(`[${timestamp}] ERROR: Image data is missing in request`);
      return NextResponse.json({ error: "画像データがありません" }, { status: 400 });
    }
    console.log(`[${timestamp}] DATA_CHECK: Image size approx ${(image.length / 1024).toFixed(2)} KB`);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    
    // 🔍 LOG 2: APIキーの状態（セキュリティのため伏せつつ確認）
    if (!apiKey) {
      console.error(`[${timestamp}] ERROR: GEMINI_API_KEY is not configured in Vercel`);
      return NextResponse.json({ error: "サーバーにAPIキーが設定されていません" }, { status: 500 });
    }
    console.log(`[${timestamp}] AUTH_CHECK: API Key is present (Ends with: ...${apiKey.substring(apiKey.length - 4)})`);

    const base64Data = image.split(",")[1] || image;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze this image for hotel lost and found. Respond ONLY with raw JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }],
      generationConfig: { temperature: 0.4, topP: 1, topK: 32, maxOutputTokens: 1024 }
    };

    // 🔍 LOG 3: Google API への送信直前
    console.log(`[${timestamp}] GOOGLE_API_CALL: Fetching gemini-1.5-flash...`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // 🔍 LOG 4: Google からの生のレスポンス（これが原因特定の鍵）
    if (!response.ok) {
      console.error(`[${timestamp}] GOOGLE_API_ERROR: HTTP ${response.status}`, JSON.stringify(data));
      return NextResponse.json({ 
        error: "Google APIがエラーを返しました", 
        details: data.error?.message || "不明なAPIエラー",
        code: data.error?.status || response.status,
        raw: data // デバッグ用に生のデータを返す
      }, { status: response.status });
    }

    console.log(`[${timestamp}] GOOGLE_API_SUCCESS: Content received.`);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error(`[${timestamp}] ERROR: AI returned empty response`, JSON.stringify(data));
      return NextResponse.json({ error: "AIが回答を生成できませんでした", raw: data }, { status: 500 });
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log(`[${timestamp}] RAW_AI_TEXT: ${text}`);

    // JSONパースの試行
    try {
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const parsed = JSON.parse(cleanJson);
      return NextResponse.json(parsed);
    } catch (parseErr) {
      console.error(`[${timestamp}] JSON_PARSE_ERROR: Failed to parse AI output as JSON`, text);
      return NextResponse.json({ error: "AIの回答形式が不正です", rawText: text }, { status: 500 });
    }

  } catch (error: any) {
    console.error(`[${timestamp}] CRITICAL_SYSTEM_ERROR:`, error.message);
    return NextResponse.json({ 
      error: "システム内部エラー", 
      message: error.message,
      stack: error.stack?.split("\n")[0]
    }, { status: 500 });
  }
}
