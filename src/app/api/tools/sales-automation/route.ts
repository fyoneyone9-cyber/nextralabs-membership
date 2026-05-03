import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { domain, targetPerson } = await req.json();

    // Clearbit API連携 (現在は骨組みとしてシミュレート)
    const companyInfo = {
      name: "サンプル株式会社",
      industry: "IT / SaaS",
      size: "100-500人",
      tech: ["Next.js", "Supabase", "AWS"]
    };

    // TODO: Gemini 1.5 Pro によるパーソナライズメール執筆
    const draftEmail = `
件名: ${companyInfo.name}様の${companyInfo.industry}事業におけるAI活用のご提案

${targetPerson}様

突然のご連絡失礼いたします。
NextraLabsのAIコンサルタントでございます。

貴社の${companyInfo.industry}における先進的な取り組みを拝見し、
特に${companyInfo.tech.join(', ')}をご活用の貴社であれば、
弊社の最新AIオートメーションが大きく貢献できると考えご連絡いたしました...
    `;

    return NextResponse.json({ 
      companyInfo, 
      draftEmail,
      status: "SUCCESS" 
    });

  } catch (error) {
    console.error('Sales Automation Error:', error);
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
