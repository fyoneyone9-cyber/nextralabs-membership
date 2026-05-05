import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "No Data" }, { status: 400 });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 🚀 【真・決定版URL】models/ の後のスラッシュを適切に処理
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this image. Respond ONLY with JSON: { \"item\": \"品目\", \"color\": \"色\", \"brand\": \"ブランド\", \"features\": [\"特徴\"], \"matchConfidence\": 95 }" },
            { inline_data: { mime_type: "image/jpeg", data: base64Data } }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Google Connection Denied");

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ error: "FINAL_GATE_ERROR", message: error.message }, { status: 500 });
  }
}
