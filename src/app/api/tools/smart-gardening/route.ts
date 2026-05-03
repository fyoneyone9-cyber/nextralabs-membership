import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, image, location } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '写真が必要です' }, { status: 400 });
    }

    // 1. Base64データからヘッダーを除去し、純粋なデータとMIMEタイプを抽出
    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    // 2. Gemini 1.5 Pro (Vision) を直接呼び出し（確実性を優先）
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // 3. 画像とテキストを「マルチモーダル」として構築
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      {
        text: `
あなたはプロのAIガーデナーです。添付された写真を詳細に分析してください。

【状況】
・現在の場所: ${location || "海老名市"}
・ユーザーの相談: ${prompt || "植物を診てください。"}

【分析指示】
1. 写真から植物の種類を特定してください。
2. 葉の色、萎れ、土の乾燥具合を視覚的に判断してください。
3. あなたの持つ検索機能で「${location || "海老名市"}」の今日の最新天気を調べ、その天気を踏まえた「水やりタイミング」と「量（ml）」をズバリ回答してください。
`
      }
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ advice: text, model: "gemini-1.5-pro" });
  } catch (error: any) {
    console.error('Gemini Vision Error:', error);
    return NextResponse.json({ error: '画像解析に失敗しました。もう少し明るい場所で撮り直すか、画像サイズを小さくしてください。' }, { status: 500 });
  }
}
