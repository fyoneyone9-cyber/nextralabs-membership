import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    // 🛠️ どんな名前のキーでも探し出す執念のロジック
    const apiKey = 
      process.env.GEMINI_API_KEY || 
      process.env.GEMINI_API_KEY1 || 
      process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
      process.env.API_KEY;

    // デバッグ用に、現在サーバーが「認識している」環境変数の名前リストを作成
    const detectedEnvKeys = Object.keys(process.env).filter(k => k.includes("KEY") || k.includes("API") || k.includes("GEMINI"));

    if (!apiKey) {
      return NextResponse.json({ 
        error: "サーバーにAPIキーが設定されていません",
        detected_keys: detectedEnvKeys, // 何が見えているか教えてもらう
        tip: "VercelのSettingsで GEMINI_API_KEY が登録されているか、Redeployしたか確認してください"
      }, { status: 500 });
    }

    const base64Data = image.split(",")[1] || image;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { inline_data: { mime_type: "image/jpeg", data: base64Data } },
          { text: "Analyze this image for hotel lost and found. Respond with JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }" }
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
        details: data.error?.message,
        detected_keys: detectedEnvKeys 
      }, { status: response.status });
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ error: "System Error", message: error.message }, { status: 500 });
  }
}
