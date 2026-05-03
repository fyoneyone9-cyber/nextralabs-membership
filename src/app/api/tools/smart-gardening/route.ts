import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { image, location } = await req.json();

    if (!image) return NextResponse.json({ error: '写真が必要です' }, { status: 400 });

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { 
        text: `この現場写真を一言で解析してください。必ず以下のJSON形式でのみ返してください。
        {"name": "対象の名前", "status": "状態を一言", "environment": "周辺状況", "confidence": "95"}` 
      }
    ]);

    const response = await result.response;
    let text = response.text();
    
    // JSON以外のゴミ（```json 等）を正規表現で完全に除去
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) throw new Error("JSON not found in response");
    
    const scanResult = JSON.parse(jsonMatch[0]);

    return NextResponse.json(scanResult);

  } catch (error: any) {
    console.error('AI Scan Error:', error);
    // 失敗時はデフォルト値を返してUIを止めない
    return NextResponse.json({ 
      name: "不明な対象", 
      status: "要詳細解析", 
      environment: location || "未特定", 
      confidence: "50" 
    });
  }
}
