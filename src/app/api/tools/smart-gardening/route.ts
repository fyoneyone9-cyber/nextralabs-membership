import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { image, location } = await req.json();

    if (!image) return NextResponse.json({ error: '写真が必要です' }, { status: 400 });

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    // --- Gemini 1.5 Flash による高速・低コストな「プレ解析」 ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { 
        text: `この現場写真を一言で解析してください。以下のJSON形式でのみ返してください。
        {"name": "対象物の名前", "status": "健康状態や劣化具合を一言", "environment": "周辺の気象や状況", "confidence": "確信度%"}` 
      }
    ]);

    const response = await result.response;
    const jsonStr = response.text().replace(/```json|```/g, "");
    const scanResult = JSON.parse(jsonStr);

    return NextResponse.json(scanResult);

  } catch (error: any) {
    console.error('AI Scan Error:', error);
    return NextResponse.json({ name: "解析中...", status: "不明", environment: "未特定", confidence: "0" });
  }
}
