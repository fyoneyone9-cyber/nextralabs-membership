import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image, matchResult } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたはホテルの「拾得物管理責任者」です。添付された忘れ物の写真と、照合された宿泊者データを元に、公式な「AI保管証明書」のコンテンツを生成してください。
    
    【出力項目】
    1. 管理番号（NEXTRA-から始まるランダムな8桁）
    2. 品目名称（AIが詳細に言語化）
    3. 状態ランク（S:新品同様〜C:使用感あり）
    4. 特記事項（汚れ、破損、特徴的な装飾など）
    5. 保管期限（本日より3ヶ月後）
    6. お客様への一言メッセージ（丁寧かつ安心感を与える内容）

    出力は必ず以下のJSON形式で返してください。
    {
      "certId": "...",
      "itemName": "...",
      "status": "...",
      "description": "...",
      "expiry": "...",
      "message": "..."
    }`;

    // 画像付き生成
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image.split(',')[1],
          mimeType: "image/png"
        }
      }
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const certData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, certData });
  } catch (error: any) {
    console.error('[GENERATE_CERT_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
