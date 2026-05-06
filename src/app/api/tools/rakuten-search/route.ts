import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * 🛠️ Rakuten Item Search API Engine
 * 憲法：本物の楽天市場データを取得し、中古相場と利益率を算出する。
 */

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();
    
    // 🔑 楽天AppID (NextraLabs 共有マスターキー)
    const RAKUTEN_APP_ID = '1020081822830310242'; 
    
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&keyword=${encodeURIComponent(keyword)}&applicationId=${RAKUTEN_APP_ID}&hits=5&sort=%2BitemPrice&usedFlag=1`;

    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error_description || 'Rakuten API Error');

    // 中古相場の解析
    const items = data.Items || [];
    const prices = items.map((i: any) => i.Item.itemPrice);
    
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgPrice = prices.length > 0 ? Math.floor(prices.reduce((a:number, b:number) => a + b, 0) / prices.length) : 0;

    return NextResponse.json({
      success: true,
      source: 'RAKUTEN_LIVE_DB',
      data: {
        minPrice,
        maxPrice,
        avgPrice,
        items: items.slice(0, 3).map((i: any) => ({
          name: i.Item.itemName,
          price: i.Item.itemPrice,
          url: i.Item.itemUrl,
          img: i.Item.mediumImageUrls[0]?.imageUrl
        }))
      }
    });

  } catch (error: any) {
    console.error('[RAKUTEN_API_ERROR]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
