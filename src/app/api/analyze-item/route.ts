import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Data" }, { status: 400 });

    const base64Data = image.split(",")[1] || image;

    // 🏆 正解のエンドポイント (v1beta)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { inline_data: { mime_type: "image/jpeg", data: base64Data } },
          { text: "Analyze this item for a hotel lost and found system. Respond ONLY with a raw JSON object: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴1\", \"特徴2\"], \"matchConfidence\": 95 }" }
        ]
      }],
      generationConfig: {
        // 🛠️ 修正: エラーの原因だった response_mime_type を responseMimeType に変更（または削除してプロンプトで制御）
        // 確実に通るプロンプト重視の構成にします
        temperature: 0.2,
        topP: 0.8,
        topK: 40
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Google API Error");
    }

    const text = data.candidates[0].content.parts[0].text;
    // Markdownの装飾（```json ... ```）を剥ぎ取る
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    return NextResponse.json({ 
      error: "AI解析の最終処理中", 
      message: error.message 
    }, { status: 500 });
  }
}
