import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  const rateCheck = await checkRateLimit(req, 'staysee-ai-finder');
  if (!rateCheck.allowed) return rateCheck.response!;
  try {
    const { image, matchResult } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたはホテルの「拾得物管理責任者」です。忘れ物の写真と宿泊者データを元に、公式な「AI保管証明書」のJSONを生成してください。
    
    【出力項目】
    1. certId: NEXTRA-から始まる8桁
    2. itemName: 物品名
    3. status: 状態ランク(S〜C)
    4. description: 詳細特徴
    5. expiry: 保管期限(3ヶ月後)
    6. message: お客様への安心メッセージ

    必ず純粋なJSON形式で返してください。`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image.split(',')[1], mimeType: "image/png" } }
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const certData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, certData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
