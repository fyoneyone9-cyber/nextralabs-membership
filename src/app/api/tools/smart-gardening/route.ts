import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    // 地点情報の構築
    const locationInfo = location 
      ? `現在地の座標: 緯度 ${location.lat}, 経度 ${location.lng}`
      : "現在地不明（日本の一般的な天気で判断）";

    const result = await nextraAiEngine({
      prompt: `
以下の「植物の写真」と「地点情報」から、水やりのタイミングを診断してください。

【地点情報】: ${locationInfo}
【ユーザーの相談】: ${prompt}

【実行指示】:
1. Google検索を使用し、上記座標（または日本）の現在の天気、最高気温、および今日・明日の降水確率を確認してください。
2. 植物の種類を特定し、写真から読み取れる葉の萎れ具合や土の乾き具合を分析してください。
3. 天気予報を踏まえ、「今すぐ水やりが必要か」「何時頃に、どれくらいの量（ml）が良いか」を論理的に結論づけてください。
`,
      systemInstruction: "あなたは最新のGoogle天気情報を駆使するAIガーデナーです。位置情報を元にリアルタイムな気象状況を把握し、植物の視覚データと統合してアドバイスしてください。",
      toolId: "smart-gardening",
      quality: "powerful"
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error) {
    console.error('Gardening API Error:', error);
    return NextResponse.json({ error: '診断失敗' }, { status: 500 });
  }
}
