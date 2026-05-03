import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt, image } = await req.json();
    
    // 写真解析の重要性を加味し、自動判定に任せる
    const result = await nextraAiEngine({
      prompt: `[植物写真の解析を含むリクエスト]\n${prompt}`,
      systemInstruction: "あなたは植物に詳しいAIガーデナーです。写真の状態と一般的な天気を踏まえ、水やりの要否をアドバイスしてください。",
      toolId: "smart-gardening",
      quality: "auto"
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
