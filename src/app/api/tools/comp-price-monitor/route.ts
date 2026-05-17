import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { unstable_noStore as noStore } from 'next/cache'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('comp-price-monitor', 10);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    const { targetArea, currentPrice } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたはホテルの「レベニューマネジメント（収益管理）専門家」です。
    楽天トラベルの周辺宿価格データ（擬似）と、あなたの提供する現在の販売価格を元に、
    Staysee（ステイシー）での販売価格をどう調整すべきか、戦略的なアドバイスをJSONで回答してください。

    【入力情報】
    監視エリア: ${targetArea}
    現在の自館価格: ${currentPrice}円

    【出力項目】
    1. compAverage: 周辺競合の平均価格（AIがエリア特性から推測）
    2. marketTrend: 市場の需給状況（例：イベント開催による高騰、閑散期など）
    3. recommendedPrice: 推奨する新販売価格
    4. strategicAdvice: なぜその価格にすべきかの論理的根拠
    5. stayseeAction: ステイシーで行うべき具体的な操作指示（例：プランの売止、価格カレンダーの更新）

    必ず以下のJSON形式で返してください。
    {
      "compAverage": 0,
      "marketTrend": "...",
      "recommendedPrice": 0,
      "strategicAdvice": "...",
      "stayseeAction": "..."
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
