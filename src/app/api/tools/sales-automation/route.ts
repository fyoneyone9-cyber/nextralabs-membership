import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { domain, targetPerson } = await req.json();

    if (!domain) return NextResponse.json({ error: 'ドメインが必要です' }, { status: 400 });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // AIに企業分析とメール執筆を依頼
    const result = await model.generateContent([
      { 
        text: `
あなたは超一流のインサイドセールス担当者です。
以下のドメインを持つ企業に対し、NextraLabsのAI自動化ソリューションを提案する営業メールの「本文のみ」を執筆してください。

【ターゲット企業ドメイン】: ${domain}
【担当者名】: ${targetPerson || "ご担当者"}様

【執筆ルール】
1. Google検索を駆使し、${domain} の事業内容や最新ニュースを特定した上で、その企業特有の課題に触れてください。
2. NextraLabsが提供するAI技術（画像解析、業務自動化、顧客対応AI等）が、${domain} の事業をどう加速させるか具体的に提案してください。
3. 毎回同じ内容にならないよう、その企業の強みを活かした独自の提案角度（切り口）を1つ選んでください。
4. 構成：挨拶 → 相手企業への賞賛/リサーチ結果 → 課題提起 → NextraLabsによる解決策 → 面談のお願い。
5. 件名は不要です。本文のみを返してください。
`
      }
    ]);

    const response = await result.response;
    const draftEmail = response.text().trim();

    return NextResponse.json({ 
      companyInfo: { name: domain.split('.')[0].toUpperCase() }, 
      draftEmail,
      status: "SUCCESS" 
    });

  } catch (error: any) {
    console.error('Sales AI Error:', error);
    return NextResponse.json({ error: 'メール生成に失敗しました' }, { status: 500 });
  }
}
