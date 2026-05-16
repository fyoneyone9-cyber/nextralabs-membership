import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

/**
 * BuySmartNav API
 * 楽天市場の公開RSSフィードから価格データを取得し、Geminiで損得判定する。
 * 楽天APIキー不要（RSS経由）
 */

// 楽天市場 公開RSS（APIキー不要）
async function fetchRakutenRSS(keyword: string, sort: string = '-reviewCount'): Promise<any[]> {
  const encoded = encodeURIComponent(keyword);
  // 楽天市場の検索RSS（公開・認証不要）
  const url = `https://rss.rakuten.co.jp/?term=${encoded}&sort=${sort}&v=2`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const xml = await res.text();

  // XMLから商品情報をパース
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
    const block = match[1];
    const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/))?.[1] || '';
    const link = (block.match(/<link>(.*?)<\/link>/))?.[1] || '';
    const priceStr = (block.match(/<r:price>([\d,]+)<\/r:price>/) || block.match(/price[^>]*>([\d,]+)/))?.[1] || '0';
    const price = parseInt(priceStr.replace(/,/g, ''), 10) || 0;
    const imgUrl = (block.match(/<media:thumbnail[^>]*url="([^"]+)"/) || block.match(/<enclosure[^>]*url="([^"]+)"/))?.[1] || '';

    if (title && price > 0) {
      items.push({ name: title, price, url: link, img: imgUrl });
    }
  }

  return items;
}

// Yahoo!ショッピング 公開RSS（APIキー不要）
async function fetchYahooRSS(keyword: string): Promise<any[]> {
  const encoded = encodeURIComponent(keyword);
  const url = `https://shopping.yahoo.co.jp/search?p=${encoded}&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=shp_pc_search_searchBox_vAll&view=rss`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const xml = await res.text();
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
    const block = match[1];
    const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/))?.[1] || '';
    const link = (block.match(/<link>(.*?)<\/link>/))?.[1] || '';
    const priceStr = (block.match(/(\d{3,8})円/) || block.match(/price.*?(\d{3,8})/))?.[1] || '0';
    const price = parseInt(priceStr.replace(/,/g, ''), 10) || 0;

    if (title && price > 0) {
      items.push({ name: title, price, url: link, img: '' });
    }
  }

  return items;
}

// Geminiで価格推定（RSSが取れない場合のフォールバック）
async function estimatePriceWithGemini(keyword: string, genAI: GoogleGenerativeAI): Promise<{
  newPrice: number;
  usedPrice: number;
  items: any[];
  source: string;
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
あなたは日本の中古市場・新品市場に詳しいAIアドバイザーです。

「${keyword}」について、2025〜2026年現在の日本市場での価格を推定してください。

以下のJSON形式のみで回答してください（マークダウン不要）:
{
  "newPrice": 新品の相場価格（円、整数）,
  "usedPrice": 中古の平均相場（円、整数）,
  "items": [
    {"name": "商品名（具体的なモデル・グレード）", "price": 価格（整数）, "condition": "新品" or "中古"}
  ]
}

注意:
- 実際の市場相場に近い現実的な数値を出すこと
- itemsは3〜5件
- JSONのみ出力（説明文不要）
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  
  // JSONを抽出
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini price estimation failed');
  
  const parsed = JSON.parse(jsonMatch[0]);
  
  return {
    newPrice: parsed.newPrice || 0,
    usedPrice: parsed.usedPrice || 0,
    items: (parsed.items || []).map((i: any) => ({
      name: i.name,
      price: i.price,
      url: `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}`,
      img: '',
    })),
    source: 'AI_ESTIMATE',
  };
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

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    let newPrice = 0;
    let avgUsedPrice = 0;
    let allItems: any[] = [];
    let dataSource = 'RSS';

    // 1. 楽天RSS から価格取得を試みる
    const [rakutenItems, yahooItems] = await Promise.allSettled([
      fetchRakutenRSS(keyword, '+itemPrice'),
      fetchYahooRSS(keyword),
    ]);

    const rakuten = rakutenItems.status === 'fulfilled' ? rakutenItems.value : [];
    const yahoo = yahooItems.status === 'fulfilled' ? yahooItems.value : [];

    allItems = [...rakuten, ...yahoo];

    if (allItems.length > 0) {
      const prices = allItems.map(i => i.price).filter(p => p > 0).sort((a, b) => a - b);
      newPrice = prices[0] || 0;
      avgUsedPrice = prices.length > 1
        ? Math.floor(prices.slice(1).reduce((a, b) => a + b, 0) / (prices.length - 1))
        : prices[0] || 0;
    }

    // 2. RSSで価格が取れない場合はGeminiで推定
    if (newPrice === 0) {
      const estimated = await estimatePriceWithGemini(keyword, genAI);
      newPrice = estimated.newPrice;
      avgUsedPrice = estimated.usedPrice;
      allItems = estimated.items;
      dataSource = estimated.source;
    }

    // 3. Geminiで損得判定
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
あなたはプロの買い出しアドバイザーです。以下のデータを元に「新品」と「中古」のどちらを買うべきか150文字以内でズバリ回答してください。

商品: ${keyword}
新品最安値: ¥${newPrice.toLocaleString()}
中古平均相場: ¥${avgUsedPrice.toLocaleString()}
データ取得方法: ${dataSource === 'AI_ESTIMATE' ? 'AI市場推定' : '楽天・Yahoo!リアルタイム'}

【指示】
1. 価格差・リセールバリュー・状態リスクを考慮してください
2. 「新品購入を推奨」または「中古購入を推奨」のどちらかを明示してください
3. 具体的かつ説得力ある理由を述べてください
4. Markdown記号なし、プレーンな日本語で出力してください
${dataSource === 'AI_ESTIMATE' ? '5. 価格はAI推定値であることを一言添えてください' : ''}
`;

    const result = await model.generateContent(prompt);
    const reason = result.response.text().trim();

    // 判定ロジック
    const verdict = (newPrice > 0 && avgUsedPrice > 0 && avgUsedPrice < newPrice * 0.75) ? 'used' : 'new';
    const status = verdict === 'used' ? '中古購入を推奨' : '新品購入を推奨';

    const displayItems = allItems.slice(0, 5).map((i: any) => ({
      name: i.name?.substring(0, 60) || keyword,
      price: i.price,
      url: i.url || `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}`,
      img: i.img || '',
    }));

    return NextResponse.json({
      success: true,
      verdict,
      status,
      reason,
      dataSource,
      data: {
        minPrice: newPrice,
        avgPrice: avgUsedPrice,
        items: displayItems,
      },
    });

  } catch (error: any) {
    console.error('BuySmartNav API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
