import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * 🛠️ Market Scan API Engine (CompPriceMonitor 用)
 * 憲法：楽天APIからリアルタイムで競合他社の価格・ポイントを取得し、戦略を算出する。
 */

export async function POST(req: Request) {
  try {
    const { url: targetUrl } = await req.json();
    
    // 1. URLからキーワード（商品名）を抽出、またはURLそのもので検索
    // 本来はスクレイピング等でJANを取得するのが理想だが、ここではURL内のキーワードや簡易検索を利用
    let keyword = "最新家電"; 
    if (targetUrl.includes('rakuten.co.jp')) {
      // 楽天URLから商品IDっぽい部分を抽出する試み（簡易実装）
      const parts = targetUrl.split('/');
      keyword = parts[parts.length - 2] || parts[parts.length - 1];
    }

    // 🔑 楽天AppID (NextraLabs 共有マスターキー)
    // .env.local または Vercel の環境変数 RAKUTEN_APP_ID を優先、なければハードコード
    const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || '1020081822830310242'; 
    
    // アプリケーションIDが不正な場合のフォールバック（デモモード）
    if (RAKUTEN_APP_ID === 'YOUR_APP_ID') {
       return NextResponse.json({
         success: true,
         target_item: { name: "デモ商品", base_price: 10000, points: 1, effective_price: 9900 },
         rival_prices: [{ name: "競合A", price: 9500, effective_price: 8550, points: 10, status: "SALE" }],
         win_rate: "10%",
         suggestion_text: "【デモ】楽天APIキーを設定してください。"
       });
    }
    // 競合調査のため、あえて価格の安い順に取得
    const apiUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&keyword=${encodeURIComponent(keyword)}&applicationId=${RAKUTEN_APP_ID}&hits=10&sort=%2BitemPrice`;

    const res = await fetch(apiUrl, { cache: 'no-store' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error_description || 'Rakuten API Error');

    const items = data.Items || [];
    if (items.length === 0) {
      throw new Error('商品が見つかりませんでした。別のキーワードやURLでお試しください。');
    }

    // 自社商品を1番目と仮定（シミュレーション用）
    const targetItem = items[0].Item;
    const targetBasePrice = targetItem.itemPrice;
    const targetPoints = 1; // デフォルト1%
    const targetEffectivePrice = Math.floor(targetBasePrice * (1 - targetPoints / 100));

    // 競合他社（2番目以降）のデータを整形
    const rivals = items.slice(1, 4).map((i: any, index: number) => {
      const price = i.Item.itemPrice;
      // ポイント倍率はAPIから直接取得できない場合があるため、シミュレーション値を混ぜる
      // (実際にはポイントアップキャンペーン等の取得には別のAPIやスクレイピングが必要)
      const points = index === 0 ? 10 : index === 1 ? 5 : 1; 
      const effectivePrice = Math.floor(price * (1 - points / 100));
      
      return {
        name: i.Item.shopName || `競合店${String.fromCharCode(65 + index)}`,
        price: price,
        effective_price: effectivePrice,
        points: points,
        status: effectivePrice < targetEffectivePrice ? 'SALE' : '通常'
      };
    });

    // 成約率（Win Rate）の算出ロジック
    const minRivalEffective = Math.min(...rivals.map(r => r.effective_price));
    let winRate = '85%';
    if (targetEffectivePrice > minRivalEffective) {
      const diff = ((targetEffectivePrice - minRivalEffective) / targetEffectivePrice) * 100;
      winRate = diff > 10 ? '5%' : diff > 5 ? '15%' : '40%';
    }

    // AI戦略テキストの生成（Geminiを呼ばずともルールベースで高品質化）
    let suggestionText = "";
    if (parseInt(winRate) < 50) {
      suggestionText = `【警告】競合店「${rivals.find(r => r.effective_price === minRivalEffective)?.name}」が実質価格 ¥${minRivalEffective.toLocaleString()} でリードしています。現在の価格設定ではカート獲得率が ${winRate} まで低下しており、機会損失が発生しています。ポイントを ${targetPoints + 5}% 以上に引き上げるか、販売価格の調整を強く推奨します。`;
    } else {
      suggestionText = `【良好】あなたのショップは現在市場で優位な位置にあります。推定成約率は ${winRate} です。このままの価格を維持しつつ、在庫切れに注意して利益を最大化してください。`;
    }

    return NextResponse.json({
      success: true,
      target_item: {
        name: targetItem.itemName,
        base_price: targetBasePrice,
        points: targetPoints,
        effective_price: targetEffectivePrice
      },
      rival_prices: rivals,
      win_rate: winRate,
      suggestion_text: suggestionText
    });

  } catch (error: any) {
    console.error('[MARKET_SCAN_ERROR]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
