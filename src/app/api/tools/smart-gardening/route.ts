import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, weatherData } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    // AI Engine呼び出し（画像解析を依頼）
    const result = await nextraAiEngine({
      prompt: `[植物写真の解析依頼]\nユーザーの入力: ${prompt}\n天気情報: ${JSON.stringify(weatherData)}\n\n写真に写っている植物の状態を詳しく分析し、水やりのタイミングやケア方法をプロの視点でアドバイスしてください。`,
      systemInstruction: "あなたは熟練のAIガーデナーです。写真から植物の種類、葉の色、土の乾き具合を読み取り、親切かつ具体的にアドバイスしてください。",
      toolId: "smart-gardening",
      quality: "powerful" // 画像解析のため高品質モデルを使用
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error) {
    console.error('Gardening API Error:', error);
    return NextResponse.json({ error: '診断に失敗しました' }, { status: 500 });
  }
}
