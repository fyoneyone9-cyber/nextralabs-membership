import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  const rateCheck = await checkRateLimit(req, 'staysee-ai-finder');
  if (!rateCheck.allowed) return rateCheck.response!;
  try {
    const { image, stayseeData } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたはホテルの「顧客行動分析専門家」です。
    拾得物の写真（画像）と、Stayseeから取得した「宿泊者属性データ（車ナンバーの有無、プラン名、家族構成等）」をクロス分析し、持ち主を特定するための【AIプロファイリング】を実行してください。

    【分析の鉄則】
    1. 「お車ナンバー」連動：車関連の忘れ物（芳香剤、鍵、サンシェード等）なら、車両登録のあるゲストの確信度を最大化。
    2. 「宿泊目的」連動：高級品や記念品なら、記念日プラン等の高単価ゲストとの相関を分析。
    3. 「行動予測」：物品の種類から、そのゲストが昨日ホテルでどう過ごしたかを予測し、データと照合。

    出力は必ず以下のJSON形式で返してください。
    {
      "matchScore": 0-100,
      "reasoning": "なぜこのゲストだと言い切れるのかの論理的根拠",
      "profileTags": ["車移動", "記念日ゲスト", "高LTV客"など],
      "certaintyLevel": "確信度（99% / 80%など）",
      "actionAdvise": "フロントスタッフへの声掛けアドバイス"
    }

    必ず純粋なJSON形式で返してください。`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image.split(',')[1],
          mimeType: "image/png"
        }
      },
      `【Stayseeデータ】: ${JSON.stringify(stayseeData)}`
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const profileData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, profileData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
