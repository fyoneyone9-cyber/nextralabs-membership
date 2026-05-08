import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 動作確認済みの楽天テスト用アプリIDに戻します
const DEFAULT_RAKUTEN_ID = '534e3725.64346793.534e3726.d5412af4';
const RAKUTEN_APP_ID = '1014902194600644342'; 

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
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('rakuten_affiliate_id')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.rakuten_affiliate_id) {
        affiliateId = profile.rakuten_affiliate_id;
      }
    } catch (e) {
      console.log('Profile query skipped');
    }
  }

  try {
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${affiliateId}&period=realtime`;
    const rakutenRes = await fetch(url);
    const rakutenData = await rakutenRes.json();

    // 楽天APIのエラー内容を具体的にキャッチ
    if (rakutenData.error) {
      return NextResponse.json({ 
        error: `楽天APIエラー: ${rakutenData.error_description || rakutenData.error}`,
        debug_id: RAKUTEN_APP_ID
      }, { status: 200 }); // 500にせず情報を返す
    }

    if (!rakutenData.Items || rakutenData.Items.length === 0) {
      return NextResponse.json({ error: '現在トレンドデータが空です。' }, { status: 200 });
    }

    const topItems = rakutenData.Items.slice(0, 5).map((item: any) => ({
      name: item.Item.itemName,
      catchcopy: item.Item.catchcopy,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls[0]?.imageUrl,
    }));

    // AI解析（APIキーがない場合も考慮）
    let insight = 'トレンド解析中...';
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `楽天ランキング上位商品を分析し、売れている理由とSNS訴求文を日本語で回答して:\n${topItems.map((i: any) => i.name).join('\n')}`;
      const result = await model.generateContent(prompt);
      insight = result.response.text();
    } else {
      insight = 'AI解析にはGEMINI_API_KEYの設定が必要です。';
    }

    return NextResponse.json({
      items: topItems,
      insight,
      isDefaultId: affiliateId === DEFAULT_RAKUTEN_ID
    });

  } catch (error: any) {
    return NextResponse.json({ error: `システムエラー: ${error.message}` }, { status: 200 });
  }
}
