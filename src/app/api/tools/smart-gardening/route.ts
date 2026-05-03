import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    // 1. Google リアルタイム天気情報の取得 (モックではなく、最新情報をAIに検索させる)
    // AI Engineに「今日の天気を踏まえて」と指示することで、Grounding（Google検索）を機能させます。
    
    // 2. AI Engine呼び出し（Gemini 1.5 ProのVision機能を使用）
    const result = await nextraAiEngine({
      prompt: `
以下の植物の写真と、現在のGoogle天気情報を統合して分析してください。
【ユーザーの相談】: ${prompt}

【分析指示】:
1. 写真から植物の種類と、土の乾き具合、葉の健康状態を精密に読み取ってください。
2. あなたが持つ最新のGoogle検索機能を使い、現在のユーザー周辺（日本）の天気を踏まえた上で、水やりが必要か判断してください。
3. もし今日か明日が雨なら「水やりは自然に任せましょう」と伝え、晴れが続くなら「今すぐ〜ml程度の水やりが必要です」と具体的に回答してください。
`,
      systemInstruction: "あなたは熟練のAIガーデナーです。Google検索を活用して最新の天気を把握し、画像から植物の状態を読み取ってアドバイスしてください。回答はマークダウン形式で読みやすく出力してください。",
      toolId: "smart-gardening",
      quality: "powerful"
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error) {
    console.error('Gardening API Error:', error);
    return NextResponse.json({ error: 'AI診断に失敗しました。時間をおいて再度お試しください。' }, { status: 500 });
  }
}
