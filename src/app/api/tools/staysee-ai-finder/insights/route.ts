import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { historyData } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたはホテルの「経営コンサルタント兼ホスピタリティ・スペシャリスト」です。
    提供された過去の拾得物データおよび宿泊状況の傾向（historyData）を分析し、ホテルの品質改善と経営効率化のための「ホスピタリティ・インサイト」レポートを作成してください。

    【分析・提案の観点】
    1. 忘れ物発生の傾向分析（例：特定の客室タイプ、特定の位置での頻発）
    2. 改善アドバイス（例：案内板の設置、清掃チェックリストの更新、客室レイアウトの変更）
    3. スタッフの工数削減効果の試算
    4. 顧客満足度（NPS）向上への寄与

    【出力フォーマット（JSON）】
    {
      "summary": "分析の全体要約",
      "findings": [
        { "room": "部屋番号またはタイプ", "trend": "発生傾向の解説", "action": "具体的な改善アクション" }
      ],
      "roi": "AI導入による月間工数削減の見込み",
      "executiveMessage": "経営層への提言"
    }

    必ず純粋なJSON形式で返してください。`;

    const result = await model.generateContent(prompt + "\n\n【データ】\n" + JSON.stringify(historyData));
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const insightData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, insightData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
