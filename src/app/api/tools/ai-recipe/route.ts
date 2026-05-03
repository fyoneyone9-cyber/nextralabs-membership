import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '写真が必要です' }, { status: 400 });

    // 成功実績のある nextraAiEngine (Guardian) を使用してプレ解析
    const result = await nextraAiEngine({
      prompt: `[画像解析依頼]\nこの写真に写っている食材を特定し、それを使った代表的な料理名を1つだけ日本語で答えてください。例：バナナなら「バナナ」。名称のみ、装飾なしで出力してください。`,
      systemInstruction: "あなたは視覚解析が得意なAIアシスタントです。写真の中身を正確に一言で特定してください。",
      toolId: "ai-recipe-scan",
      quality: "powerful" // 画像解析のためProモデルを強制
    });

    const dishName = result.response.trim().replace(/[#*]/g, "");

    return NextResponse.json({ 
      dishName: dishName || "食材", 
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName)}+作り方`
    });
  } catch (error: any) {
    console.error('Recipe API Error:', error);
    return NextResponse.json({ dishName: "解析エラー" }, { status: 500 });
  }
}
