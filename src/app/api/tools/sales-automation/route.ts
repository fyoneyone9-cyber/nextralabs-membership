import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { domain, targetPerson } = await req.json();

    if (!domain) return NextResponse.json({ error: 'ドメインが必要です' }, { status: 400 });

    // 成功実績のある nextraAiEngine (Guardian) を使用
    const result = await nextraAiEngine({
      prompt: `
あなたは超一流のインサイドセールス担当者です。
ドメイン: ${domain} / 担当者: ${targetPerson || "ご担当者"}様

NextraLabsのAIソリューションを提案する営業メールの本文を執筆してください。
その企業の事業内容を考慮し、毎回異なる「独自の提案角度」から刺さる文章を書いてください。
件名は不要です。本文のみを返してください。
`,
      systemInstruction: "あなたはB2B営業に特化したAIライターです。相手企業の価値を尊重し、技術的な裏付けのある提案メールを作成してください。",
      toolId: "sales-automation",
      quality: "powerful" // 1.5 Pro を使用して高品質なメールを生成
    });

    return NextResponse.json({ 
      companyInfo: { name: domain.split('.')[0].toUpperCase() }, 
      draftEmail: result.response,
      status: "SUCCESS" 
    });

  } catch (error: any) {
    console.error('Sales AI Error:', error);
    return NextResponse.json({ error: 'サーバー接続に失敗しました。時間をおいて再度お試しください。' }, { status: 500 });
  }
}
