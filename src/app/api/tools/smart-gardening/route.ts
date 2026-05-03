import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt, image, weatherData } = await req.json();
    
    // 植物の状態と天気情報を統合したプロンプト
    const fullPrompt = `
以下の植物の写真（解析結果）と天気情報を元に、水やりのアドバイスをしてください。
【現在の天気・予報】
${JSON.stringify(weatherData)}

【ユーザーの相談】
${prompt}

【指示】
1. 写真から植物の種類と、土・葉の乾燥具合を推測してください。
2. 天気予報（雨の確率など）を考慮し、「今すぐ水やりが必要か」「何時ごろが良いか」を明快に回答してください。
3. 節約のため、雨が降る場合は「自然の恵みに任せましょう」とポジティブに伝えてください。
`;

    // Guardian Engine呼び出し
    // 写真解析が含まれるため quality: "auto" で必要に応じて高品質モデルを選択
    const result = await nextraAiEngine({
      prompt: fullPrompt,
      systemInstruction: "あなたは熟練のガーデナーであり、植物と対話できるAIです。専門的かつ温かい口調でアドバイスしてください。",
      toolId: "smart-gardening",
      quality: "auto"
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Gardening AI Error:', error);
    return NextResponse.json({ error: '診断に失敗しました' }, { status: 500 });
  }
}
