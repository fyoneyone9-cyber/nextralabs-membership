import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// 楽天API 2026年新仕様対応ヘルパー
const RAKUTEN_APP_ID = '5b11580f-bdb5-4659-b89a-63db8ef20abf';
const RAKUTEN_ACCESS_KEY = 'pk_FfxUYuFakO3oY9BEo0YxLAyRlMP6oeiwFk2lHMGwNiB';
const RAKUTEN_BASE_URL = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401';
// ※ 2026年新APIエンドポイント（applicationId + accessKey + Referer 必須）

async function rakutenSearch(keyword: string, usedFlag: 0 | 1, hits: number) {
  const params = new URLSearchParams({
    format: 'json',
    keyword,
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    hits: String(hits),
    sort: '+itemPrice',
    usedFlag: String(usedFlag),
  });

  const res = await fetch(`${RAKUTEN_BASE_URL}?${params.toString()}`, {
    headers: {
      'Origin': 'https://membership-site-nextralabos.vercel.app',
      'Referer': 'https://membership-site-nextralabos.vercel.app/',
      'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/1.0)',
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`楽天API error ${res.status}: ${errText}`);
  }

  return res.json();
}

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('buy-smart-nav', 10);
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
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');

    // 1. 楽天API (新品検索)
    const newData = await rakutenSearch(keyword, 0, 5);
    const newItems = newData.Items || [];
    const newPrice = newItems.length > 0 ? newItems[0].Item.itemPrice : 0;

    // 2. 楽天API (中古検索)
    const usedData = await rakutenSearch(keyword, 1, 10);
    const usedItems = usedData.Items || [];
    const usedPrices = usedItems.map((i: any) => i.Item.itemPrice);
    const avgUsedPrice = usedPrices.length > 0
      ? Math.floor(usedPrices.reduce((a: number, b: number) => a + b, 0) / usedPrices.length)
      : 0;

    // 3. Geminiによる解析
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
あなたはプロの買い出しアドバイザーです。以下の楽天市場のリアルタイムデータを元に、「新品」と「中古」のどちらを買うべきか150文字以内でズバリ回答してください。

商品キーワード: ${keyword}
新品最安値: ¥${newPrice.toLocaleString()}
中古平均相場: ¥${avgUsedPrice.toLocaleString()}

【指示】
1. 価格差、リセールバリュー、状態のリスクを考慮してください。
2. 「新品購入を推奨」または「中古購入を推奨」のどちらかを決めてください。
3. その理由を、具体的かつ説得力のある言葉で述べてください。
4. Markdown記号は含めず、プレーンな日本語で出力してください。
    `;

    const result = await model.generateContent(prompt);
    const reason = (await result.response).text().trim();

    // 判定
    const verdict = (newPrice > 0 && avgUsedPrice > 0 && avgUsedPrice < newPrice * 0.7) ? 'used' : 'new';
    const status = verdict === 'used' ? '中古購入を推奨' : '新品購入を推奨';

    const mergedItems = [...newItems, ...usedItems].slice(0, 6).map((i: any) => ({
      name: i.Item.itemName,
      price: i.Item.itemPrice,
      url: i.Item.itemUrl,
      img: i.Item.mediumImageUrls?.[0]?.imageUrl ?? '',
    }));

    return NextResponse.json({
      success: true,
      verdict,
      status,
      reason,          // Gemini解析テキスト
      data: {
        minPrice: newPrice,
        avgPrice: avgUsedPrice,
        items: mergedItems,
      },
    });

  } catch (error: any) {
    console.error('BuySmartNav API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
