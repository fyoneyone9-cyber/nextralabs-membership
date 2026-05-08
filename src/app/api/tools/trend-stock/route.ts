import { NextResponse } from 'next/server';

// 楽天APIの実データ（生データ）を取得するエンドポイント
const RAKUTEN_APP_ID = '21a92248-492b-4675-a876-027b5406e558'; // いただいたID
const AFFILIATE_ID = '534e3725.64346793.534e3726.d5412af4';

export async function GET() {
  try {
    // 楽天商品ランキングAPI（生データ取得）
    // ※ApplicationIDが有効であれば、ここから本物のリストが返ります
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${AFFILIATE_ID}&period=realtime`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ 
        error: `楽天APIエラー: ${data.error_description || data.error}`,
        msg: "Application IDを日本版の『数字のみのID』に更新する必要があります。"
      }, { status: 200 });
    }

    const items = data.Items.map((item: any) => ({
      name: item.Item.itemName,
      catchcopy: item.Item.catchcopy,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls[0]?.imageUrl,
      price: item.Item.itemPrice,
      rank: item.Item.rank
    }));

    return NextResponse.json({
      items,
      insight: "【楽天生データ連携中】現在、楽天市場からリアルタイムの売れ筋ランキングを取得しています。",
      mode: 'RAW_DATA'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
