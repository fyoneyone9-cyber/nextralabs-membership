import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('sales-automation', 10);
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
    const { domain, targetPerson, prompt: userPrompt } = await req.json();

    if (!domain) return NextResponse.json({ error: 'ドメインが必要です' }, { status: 400 });

    let companyData: any = null;
    const clearbitKey = process.env.CLEARBIT_API_KEY;

    // 1. Clearbit Enrichment API (存在時のみ実行し、失敗しても継続)
    if (clearbitKey && clearbitKey !== 'placeholder-service-role-key') {
      try {
        const response = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, {
          headers: { 'Authorization': `Bearer ${clearbitKey}` },
          next: { revalidate: 3600 } // 1時間キャッシュ
        });
        if (response.ok) {
          companyData = await response.json();
        }
      } catch (err) {
        console.warn('Clearbit Fetch Failed - Falling back to AI Inference:', err);
      }
    }

    // 2. プロンプト用コンテクスト構築
    const infoContext = companyData ? `
【Clearbit 解析データ】
・企業名: ${companyData.name}
・業種: ${companyData.category?.industryGroup || companyData.category?.industry}
・規模: ${companyData.metrics?.employeesRange || companyData.metrics?.employees}名
・所在地: ${companyData.geo?.city}, ${companyData.geo?.country}
・使用技術: ${companyData.tech?.join(', ')}
・概要: ${companyData.description}
` : `【ドメイン推論モード】
・ターゲットドメイン: ${domain}
※最新のGoogle検索を活用して事業内容を把握してください。`;

    // 3. AI（Guardian Engine）による戦略執筆
    const result = await nextraAiEngine({
      prompt: `以下のデータを分析し、NextraLabsのAIソリューションを提案する最高の営業メールを執筆してください。\n\n${infoContext}\n\n【ターゲット】: ${targetPerson || "ご担当者"}様\n【追加情報】: ${userPrompt || "特になし"}\n\n【指示】\n1. 企業の業種や技術スタックに触れ、NextraLabsがいかに貢献できるか具体的に提案してください。\n2. 件名は含めず、本文のみを返してください。`,
      systemInstruction: "あなたはB2Bセールスのプロフェッショナルです。相手を尊重し、かつ技術的な説得力のある提案をしてください。",
      toolId: "sales-automation",
      quality: "powerful"
    });

    return NextResponse.json({ 
      companyInfo: { name: companyData?.name || domain.split('.')[0].toUpperCase() }, 
      draftEmail: result.response,
      status: "SUCCESS" 
    });

  } catch (error: any) {
    console.error('Sales AI Critical Error:', error);
    return NextResponse.json({ 
      error: 'メールの生成中にエラーが発生しました。', 
      draftEmail: "申し訳ありません。現在サーバーが混み合っているか、API設定を調整中です。時間をおいて再度「生成」ボタンを押してください。" 
    }, { status: 500 });
  }
}
