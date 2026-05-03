import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    const result = await nextraAiEngine({
      prompt: `
以下の「植物の写真」と「地点情報」から、最適な水やりの指示をしてください。

【地点/天気情報】: ${location || "日本全国"}の最新の天気をGoogle検索して判断してください。
【ユーザーの相談】: ${prompt || "特にありません"}

【指示】:
1. Google検索で${location || "ユーザー周辺"}の現在の気温と降水確率をチェックしてください。
2. 写真から植物の健康状態と土の乾燥具合を読み取ってください。
3. 今後の予報を踏まえ、具体的な「水やりのタイミング」と「量（ml）」を結論づけてください。
`,
      systemInstruction: "あなたは最新のGoogle検索と視覚解析を使いこなすプロのAIガーデナーです。簡潔かつ実用的なアドバイスを提供してください。",
      toolId: "smart-gardening",
      quality: "powerful"
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error: any) {
    console.error('SmartGardening API Error:', error);
    return NextResponse.json({ error: 'AI解析に失敗しました。画像のサイズを小さくしてお試しください。' }, { status: 500 });
  }
}
