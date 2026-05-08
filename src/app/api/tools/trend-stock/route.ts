import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 運営（米山様）のデフォルトID
const DEFAULT_RAKUTEN_ID = '3e86f8a8.55831969.3e86f8a9.423985ee'; // 仮。環境変数推奨
const RAKUTEN_APP_ID = '1014902194600644342'; // 仮。環境変数推奨

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // 1. ユーザー設定の取得
  let affiliateId = DEFAULT_RAKUTEN_ID;
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('rakuten_affiliate_id')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.rakuten_affiliate_id) {
      affiliateId = profile.rakuten_affiliate_id;
    }
  }

  try {
    // 2. 楽天リアルタイムランキングの取得
    const rakutenRes = await fetch(
      `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${affiliateId}&period=realtime`
    );
    const rakutenData = await rakutenRes.json();

    if (!rakutenData.Items) {
      throw new Error('Failed to fetch Rakuten data');
    }

    // 上位5件を抽出してAI解析
    const topItems = rakutenData.Items.slice(0, 5).map((item: any) => ({
      name: item.Item.itemName,
      catchcopy: item.Item.catchcopy,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls[0]?.imageUrl,
    }));

    // 3. Geminiによるトレンド分析
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      以下の楽天リアルタイムランキング上位商品のリストを分析し、
      1. なぜ今これらが売れているのか（季節、SNS、ニュース等の背景）
      2. どのような層にSNSで訴求すべきか
      3. バズりやすいSNS投稿文案（1つ）
      を日本語で簡潔に回答してください。
      
      商品リスト:
      ${topItems.map((i: any) => i.name).join('\n')}
    `;

    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    return NextResponse.json({
      items: topItems,
      insight,
      isDefaultId: affiliateId === DEFAULT_RAKUTEN_ID
    });

  } catch (error: any) {
    console.error('Trend Stock API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
