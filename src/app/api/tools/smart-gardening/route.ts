import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    // 500エラーの真犯人対策: 
    // image は "data:image/jpeg;base64,/9j/..." という形式で届く。
    // nextraAiEngine 内で Gemini に渡す際、この DataURL 形式を正しく扱うための変換を行う。
    // ※今回は prompt 内に Base64 を含め、システムに画像であることを明示する。
    
    const result = await nextraAiEngine({
      prompt: `
以下の「植物の写真」と「地点情報」を元に、今すぐ実行すべき水やりとケアの指示をしてください。

【地点/地域】: ${location || "海老名市"}
【ユーザーの入力】: ${prompt || "植物を診てください。"}

【分析画像データ (Base64)】: 
${image}

【指示】:
1. Google検索で「${location || "海老名市"}」の今日の天気、最高気温、降水確率をまず確認してください。
2. 添付された写真から、植物の状態（萎れ、変色、土の乾き）を視覚的に特定してください。
3. 気象予報と植物の見た目を統合し、「いつ」「どれくらいの量(ml)」の水をやるべきか、プロのガーデナーとして結論をズバリ出してください。
`,
      systemInstruction: "あなたは最新のGoogle検索と高度な画像解析（Vision）を駆使するAIガーデナーです。写真を詳細に読み取り、具体的な数値（気温や水分量）を交えてアドバイスしてください。",
      toolId: "smart-gardening",
      quality: "powerful"
    });

    return NextResponse.json({ advice: result.response, model: result.model });
  } catch (error: any) {
    console.error('SmartGardening API Error:', error);
    return NextResponse.json({ error: 'AIによる画像解析に失敗しました。画像が重すぎるか、形式が不適切です。' }, { status: 500 });
  }
}
