import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { domain, targetPerson, prompt: userPrompt } = await req.json();

    if (!domain) return NextResponse.json({ error: 'ドメインが必要です' }, { status: 400 });

    let companyData = null;
    const clearbitKey = process.env.CLEARBIT_API_KEY;

    // 1. Clearbit Enrichment API の呼び出し
    if (clearbitKey) {
      try {
        const response = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, {
          headers: {
            'Authorization': `Bearer ${clearbitKey}`
          }
        });
        if (response.ok) {
          companyData = await response.json();
        }
      } catch (err) {
        console.error('Clearbit API Fetch Error:', err);
      }
    }

    // 2. 取得した企業情報をプロンプトに統合
    const infoContext = companyData ? `
【Clearbit 解析データ】
・企業名: ${companyData.name}
・業種: ${companyData.category?.industryGroup || companyData.category?.industry}
・規模: 従業員数 ${companyData.metrics?.employeesRange || companyData.metrics?.employees}名
・所在地: ${companyData.geo?.city}, ${companyData.geo?.country}
・使用技術: ${companyData.tech?.join(', ')}
・概要: ${companyData.description}
` : "企業データ取得中（ドメインから推測してください）";

    // 3. AIによる戦略執筆
    const result = await nextraAiEngine({
      prompt: `
以下の企業データを分析し、NextraLabsのAIソリューションを提案する最高の営業メールを執筆してください。

${infoContext}

【ターゲット】: ${targetPerson || "ご担当者"}様
【追加コンテクスト】: ${userPrompt || "特になし"}

【指示】
1. 解析された業種や使用技術に触れ、NextraLabsの技術がいかに貴社に貢献できるか具体的に提案してください。
2. 相手の事業規模に合わせたトーンで、信頼感のある文章を作成してください。
3. 件名は不要です。本文のみを返してください。
`,
      systemInstruction: "あなたはB2Bセールスのプロフェッショナルです。Clearbitのデータを読み解き、パーソナライズされた強力な提案文を作成してください。",
      toolId: "sales-automation",
      quality: "powerful"
    });

    return NextResponse.json({ 
      companyInfo: companyData || { name: domain.split('.')[0].toUpperCase() }, 
      draftEmail: result.response,
      status: "SUCCESS" 
    });

  } catch (error: any) {
    console.error('Sales AI Error:', error);
    return NextResponse.json({ error: 'メール生成に失敗しました' }, { status: 500 });
  }
}
