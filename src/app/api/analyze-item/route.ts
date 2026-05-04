import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY1 || "");

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "画像データが必要です" }, { status: 400 });
    }

    // Base64から純粋なデータ部分を抽出
    const base64Data = image.split(",")[1];
    
    // Gemini 1.5 Flash モデルの取得
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      この画像に写っている「忘れ物（拾得物）」を詳細に分析してください。
      以下のJSON形式のみで回答してください。余計な解説は不要です。

      {
        "item": "品目（例：折りたたみ傘、財布、スマホ等）",
        "color": "主要な色",
        "brand": "ブランド名（不明なら「不明」）",
        "features": ["特徴1", "特徴2", "特徴3（目立つ傷やシールなど）"],
        "matchConfidence": 0から100の数値（確信度）
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // JSON部分のみを抽出してパース
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AIからのレスポンスが不正です");
    
    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return NextResponse.json({ error: "AI解析に失敗しました" }, { status: 500 });
  }
}
