import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '写真が必要です' }, { status: 400 });

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // バナナ等の食材を確実に1つ特定させる指示
    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: "写真に写っている主要な食材を1つだけ特定し、その名称を日本語で答えてください。余計な言葉（「写っているのは〜」など）は一切不要です。食材名のみ出力してください。" }
    ]);

    const dishName = result.response.text().trim().replace(/[#*]/g, "");

    return NextResponse.json({ 
      dishName: dishName || "不明な食材", 
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName)}+作り方`
    });
  } catch (error: any) {
    console.error('Recipe API Error:', error);
    return NextResponse.json({ error: '解析失敗' }, { status: 500 });
  }
}
