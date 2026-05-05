import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    
    if (!apiKey || !image) return NextResponse.json({ error: "No Data" }, { status: 400 });

    // 🏆 不要なヘッダーを除去し、純粋なBase64データのみを抽出
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    // 🚀 【2026年最新】v1 正式版エンドポイント ＋ gemini-1.5-flash
    // 404を回避するため、モデル名の前に /models/ を付けない「純粋な指定」で行います
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze this image for a hotel lost and found system. Respond ONLY with raw JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\", \"特徴2\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }],
      generationConfig: {
        // AIの出力をJSONに固定。これによりパースエラーを防ぎます
        response_mime_type: "application/json",
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
      throw new Error(`Google API Error: ${data.error?.message || "Internal Access Error"}`);
    }

    // AIからの回答テキストを取得
    const text = data.candidates[0].content.parts[0].text;
    
    // JSONとしてクライアントへ返却
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("STAYSEE_FINAL_CRASH:", error.message);
    return NextResponse.json({ 
      error: "AI解析の最終同期中", 
      message: error.message 
    }, { status: 500 });
  }
}
