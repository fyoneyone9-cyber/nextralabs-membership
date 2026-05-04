import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Google側の凍結が解除された際に、最もコストパフォーマンスが良い1.5-flashを使用
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Analyze the item in this image for a hotel lost and found system. Respond with ONLY JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      // 凍結中の場合はここで詳細を表示
      throw new Error(`Google API Message: ${data.error?.message || "Wait for payment sync"}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    return NextResponse.json({ 
      error: "Google側のお支払い反映待ちです", 
      details: error.message 
    }, { status: 500 });
  }
}
