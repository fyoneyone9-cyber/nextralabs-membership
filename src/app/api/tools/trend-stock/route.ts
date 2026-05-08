import { NextResponse } from 'next/server';

// 以前のプロジェクトで使用実績のあるIDを適用します
const RAKUTEN_APP_ID = '1014902194600644342'; 
const AFFILIATE_ID = '534e3725.64346793.534e3726.d5412af4';

export async function GET() {
  try {
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${AFFILIATE_ID}&period=realtime`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.Items) {
      return NextResponse.json({ 
        error: `楽天APIエラー: ${data.error_description || data.error || 'データなし'}`,
        msg: "楽天デベロッパーで『楽天市場API』の利用申請が承認されているか確認してください。"
      }, { status: 200 });
    }

    const items = data.Items.map((item: any) => ({
      name: item.Item.itemName,
      catchcopy: item.Item.catchcopy,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls[0]?.imageUrl.replace('thumbnail.image.rakuten.co.jp/@0_mall', 'tshop.r10s.jp'),
      price: item.Item.itemPrice,
      rank: item.Item.rank
    }));

    return NextResponse.json({
      items,
      insight: "【楽天生データ連携中】現在、楽天市場からリアルタイムの売れ筋ランキングを直接取得しています。",
      mode: 'RAW_DATA'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
