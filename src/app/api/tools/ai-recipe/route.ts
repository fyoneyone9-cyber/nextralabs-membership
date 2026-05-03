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

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: "写真に写っている主要な食材を1つ特定し、それを使った代表的な料理名を1つだけ日本語で答えてください。例：バナナなら『バナナケーキ』。名称のみ、装飾なしで出力してください。" }
    ]);

    const dishName = result.response.text().trim().replace(/[#*]/g, "");

    return NextResponse.json({ 
      dishName, 
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName + " 作り方")}`
    });
  } catch (error: any) {
    console.error('Recipe API Error:', error);
    return NextResponse.json({ dishName: "絶品レシピ" });
  }
}
