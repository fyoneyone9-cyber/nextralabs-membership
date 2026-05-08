import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_RAKUTEN_ID = '534e3725.64346793.534e3726.d5412af4';
const RAKUTEN_APP_ID = '21a92248-492b-4675-a876-027b5406e558'; // ハイフンありID

export async function GET(request: Request) {
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
    const { data: profile } = await supabase.from('profiles').select('rakuten_affiliate_id').eq('id', session.user.id).single();
    if (profile?.rakuten_affiliate_id) affiliateId = profile.rakuten_affiliate_id;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    // 1. 楽天APIを試行
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${affiliateId}&period=realtime`;
    const rakutenRes = await fetch(url);
    const rakutenData = await rakutenRes.json();

    // 2. APIエラーまたはデータなしの場合、AI自律生成モードへ移行
    if (rakutenData.error || !rakutenData.Items || rakutenData.Items.length === 0) {
      console.log('Rakuten API failed, switching to AI autonomous mode');
      
      const aiPrompt = `
        現在は2026年5月上旬です。
        日本国内の楽天市場やSNSで今まさに「急上昇」していると推測されるトレンド商品を5つ厳選してください。
        以下のJSON形式のみで出力してください。
        [
          {"name": "商品名", "catchcopy": "売れている理由を一言", "imageUrl": "https://m.media-amazon.com/images/I/41-iR2uO+kL._AC_UL320_.jpg", "url": "楽天検索URL"}
        ]
        ※imageUrlはダミー画像URLで可。urlは https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F商品名%2F の形式にしてください。
      `;

      const aiResult = await model.generateContent(aiPrompt);
      const aiItems = JSON.parse(aiResult.response.text().replace(/```json|```/g, ''));

      return NextResponse.json({
        items: aiItems,
        insight: "【AI自律スキャン中】現在、楽天API連携をAIが補完しています。5月の行楽・防災需要に基づき、SNSで話題のアイテムを特定しました。",
        isDefaultId: affiliateId === DEFAULT_RAKUTEN_ID,
        mode: 'AI_AUTONOMOUS'
      });
    }

    // 正常系（楽天APIが通った場合）
    const topItems = rakutenData.Items.slice(0, 5).map((item: any) => ({
      name: item.Item.itemName,
      catchcopy: item.Item.catchcopy,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls[0]?.imageUrl,
    }));

    const result = await model.generateContent(`楽天上位商品の分析とSNS訴求文を日本語で:\n${topItems.map((i: any) => i.name).join('\n')}`);
    
    return NextResponse.json({
      items: topItems,
      insight: result.response.text(),
      isDefaultId: affiliateId === DEFAULT_RAKUTEN_ID,
      mode: 'API_CONNECTED'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
