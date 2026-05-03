import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '写真が必要です' }, { status: 400 });

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    // 1. Gemini Flash で一瞬で食材を特定し、最適な料理名を1つ決める
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: "写真に写っている食材から作れる、最も人気で美味しい料理名を1つだけ日本語で答えてください。例：肉じゃが、オムライス。余計な説明は不要です。名称のみ出力してください。" }
    ]);

    const dishName = result.response.text().trim();

    // 2. YouTube Data API でその料理の動画を検索 (本来はAPIキーを使用。今回はモック/将来用として構成)
    // ※ 開発環境では dishName に基づいたYouTube検索URLを返す。
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName + " 作り方")}`;

    return NextResponse.json({ 
      dishName, 
      youtubeSearchUrl,
      // 本格実装時はここに動画IDリストを配列で返してフロントで埋め込む
      videos: [
        { id: "mock1", title: `${dishName}の基本レシピ` },
        { id: "mock2", title: `【時短】10分で作る${dishName}` }
      ]
    });

  } catch (error: any) {
    console.error('Recipe API Error:', error);
    return NextResponse.json({ error: '解析失敗' }, { status: 500 });
  }
}
