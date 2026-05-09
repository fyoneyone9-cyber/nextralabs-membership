import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * 🛠️ Rakuten Item Search API Engine
 * 憲法：本物の楽天市場データを取得し、中古相場と利益率を算出する。
 */

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('rakuten-search', 10);
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
    const { keyword } = await req.json();
    
    // 🔑 楽天AppID (NextraLabs 共有マスターキー)
    const RAKUTEN_APP_ID = '5b11580f-bdb5-4659-b89a-63db8ef20abf'; 
    
    const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?format=json&keyword=${encodeURIComponent(keyword)}&applicationId=5b11580f-bdb5-4659-b89a-63db8ef20abf&accessKey=pk_FfxUYuFakO3oY9BEo0YxLAyRlMP6oeiwFk2lHMGwNiB&accessKey=pk_FfxUYuFakO3oY9BEo0YxLAyRlMP6oeiwFk2lHMGwNiB&hits=5&sort=%2BitemPrice&usedFlag=1`;

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
