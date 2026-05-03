import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location, modelType } = await req.json();

    if (!image) return NextResponse.json({ error: '写真が必要です' }, { status: 400 });

    const result = await nextraAiEngine({
      prompt: `[植物写真解析]\n画像データ: ${image}\n地点: ${location}\n相談: ${prompt}`,
      systemInstruction: "あなたはプロのAIガーデナーです。写真を詳細に読み取り、天気を踏まえたアドバイスをしてください。",
      toolId: "smart-gardening",
      preferredModel: modelType === 'claude' ? 'claude' : 'gemini'
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error: any) {
    console.error('SmartGardening API Error:', error);
    return NextResponse.json({ error: 'AI解析に失敗しました。' }, { status: 500 });
  }
}
