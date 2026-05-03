import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    // 共通エンジン(Guardian)を使い、画像解析を依頼
    // nextraAiEngine内部で安全にGeminiを呼び出します
    const result = await nextraAiEngine({
      prompt: `
以下の写真を解析し、植物の状態を診断してください。
地点情報: ${location || "海老名市"}
相談内容: ${prompt || "植物を診てください。"}

【分析指示】
1. 写真から植物を特定し、健康状態（葉・土）を詳しく読み取ってください。
2. 最新の天気を考慮し、「いつ」「どれくらいの」水をやるべきか、具体的なケア方法を結論づけてください。
`,
      systemInstruction: "あなたはマルチモーダル解析が得意なプロのAIガーデナーです。写真の視覚情報と気象データを統合してアドバイスしてください。",
      toolId: "smart-gardening",
      quality: "powerful" // 画像解析のためProモデルを強制
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error: any) {
    console.error('SmartGardening API Error:', error);
    return NextResponse.json({ error: 'AIエンジンの接続に失敗しました。APIキーまたは画像形式を確認してください。' }, { status: 500 });
  }
}
