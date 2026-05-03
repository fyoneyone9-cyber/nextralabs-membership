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

    // 画像と指示を同時に渡すマルチモーダル形式
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      { text: "写真に写っている主要な食材を1つだけ特定し、その名称を日本語で答えてください。バナナなら「バナナ」とだけ出力してください。装飾や説明は一切不要です。" }
    ]);

    const dishName = result.response.text().trim().replace(/[#*]/g, "");

    return NextResponse.json({ 
      dishName: dishName || "食材不明", 
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName)}+作り方`
    });
  } catch (error: any) {
    console.error('Recipe API Error:', error);
    return NextResponse.json({ dishName: "解析エラー" });
  }
}
