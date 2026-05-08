import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_RAKUTEN_ID = '534e3725.64346793.534e3726.d5412af4';
const RAKUTEN_APP_ID = '21a92248-492b-4675-a876-027b5406e558';

export async function GET(request: Request) {
  // if (!RAKUTEN_APP_ID) { ... } は削除またはコメントアウト

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

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
    const rakutenRes = await fetch(
      `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${affiliateId}&period=realtime`
    );
    const rakutenData = await rakutenRes.json();

    if (!rakutenData.Items) {
      throw new Error('Failed to fetch Rakuten data');
    }

    const topItems = rakutenData.Items.slice(0, 5).map((item: any) => ({
      name: item.Item.itemName,
      catchcopy: item.Item.catchcopy,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls[0]?.imageUrl,
    }));

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
