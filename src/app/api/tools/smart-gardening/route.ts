import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    // AI Engine呼び出し
    const result = await nextraAiEngine({
      prompt: `
以下の「植物の写真」と「地点情報」を元に、水やりとケアのアドバイスをしてください。

【地点情報】: ${location || "海老名市"}の今日の最新天気をGoogleで検索した上で判断してください。
【ユーザーの相談】: ${prompt || "特にありません"}

【重要：画像データ形式】
このプロンプトと一緒に画像が送信されています。画像には植物が写っています。

【診断項目】
1. 写真から植物の種類を特定してください。
2. 葉の様子（枯れ、変色、萎れ）や土の状態（乾燥、湿り気）を視覚的に解析してください。
3. 今日の「${location || "海老名市"}」の天気予報を踏まえ、今すぐ水が必要か、明日まで待つべきか、具体的にアドバイスしてください。
4. 数値（例：500ml）や時間帯（例：夕方17時以降）など、具体的なアクションを示してください。
`,
      systemInstruction: "あなたは最新のGoogle検索とマルチモーダルVision解析（画像解析）を駆使するAIガーデナーです。写真に写っている情報を逃さず、プロの視点で実用的な回答を提供してください。",
      toolId: "smart-gardening",
      quality: "powerful"
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error: any) {
    console.error('SmartGardening API Error:', error);
    return NextResponse.json({ error: 'AI解析に失敗しました。画像形式または通信環境をご確認ください。' }, { status: 500 });
  }
}
