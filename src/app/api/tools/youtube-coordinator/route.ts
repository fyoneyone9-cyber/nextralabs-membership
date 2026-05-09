import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// YouTube動画IDを抽出
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&?/\s]+)/,
    /(?:youtu\.be\/)([^&?/\s]+)/,
    /(?:youtube\.com\/shorts\/)([^&?/\s]+)/,
    /(?:youtube\.com\/embed\/)([^&?/\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// YouTubeサムネイルURLリストを取得
function getThumbnailUrls(videoId: string): string[] {
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  ];
}

// YouTube Data APIで動画情報を取得
async function fetchVideoInfo(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].snippet;
  }
  return null;
}

// サムネイル画像をBase64に変換
async function imageUrlToBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = res.headers.get('content-type') || 'image/jpeg';
    return { data: base64, mimeType };
  } catch {
    return null;
  }
}

// GeminiでファッションアイテムをJSON抽出
async function analyzeFashionWithGemini(
  imageBase64: string,
  mimeType: string,
  videoTitle: string
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `この画像はYouTube動画「${videoTitle}」のサムネイルです。
画像に写っているファッションアイテム（服・靴・バッグ・アクセサリー等）を日本語で列挙してください。
以下のJSON配列形式のみで回答してください（説明不要）：
["アイテム1", "アイテム2", "アイテム3"]

ファッションアイテムが見当たらない場合は空配列 [] を返してください。
必ず有効なJSON配列のみを返してください。`;

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    },
    prompt,
  ]);

  const text = result.response.text().trim();
  // JSON配列を抽出
  const match = text.match(/\[.*\]/s);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      return [];
    }
  }
  return [];
}

// 楽天商品検索API
async function searchRakutenItems(keyword: string) {
  const appId = process.env.RAKUTEN_APP_ID;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  const encodedKeyword = encodeURIComponent(keyword);
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${appId}&affiliateId=${affiliateId}&keyword=${encodedKeyword}&hits=3&sort=-reviewCount&imageFlag=1&formatVersion=2`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.Items || data.Items.length === 0) return [];

  return data.Items.slice(0, 3).map((item: any) => ({
    name: item.itemName?.slice(0, 40) + (item.itemName?.length > 40 ? '…' : ''),
    price: `¥${Number(item.itemPrice).toLocaleString()}`,
    imageUrl: item.mediumImageUrls?.[0]?.imageUrl || item.smallImageUrls?.[0]?.imageUrl || null,
    itemUrl: item.affiliateUrl || item.itemUrl,
    shopName: item.shopName,
    reviewAverage: item.reviewAverage,
    reviewCount: item.reviewCount,
  }));
}

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    if (!videoUrl) {
      return NextResponse.json({ success: false, error: 'URLが必要です' }, { status: 400 });
    }

    // 1. 動画ID抽出
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ success: false, error: '有効なYouTube URLを入力してください' }, { status: 400 });
    }

    // 2. YouTube Data APIで動画情報取得
    let videoTitle = 'YouTube動画';
    try {
      const snippet = await fetchVideoInfo(videoId);
      if (snippet?.title) videoTitle = snippet.title;
    } catch {
      // タイトル取得失敗は無視
    }

    // 3. サムネイル画像をBase64変換（最高画質→フォールバック）
    let imageData: { data: string; mimeType: string } | null = null;
    const thumbnailUrls = getThumbnailUrls(videoId);
    for (const thumbUrl of thumbnailUrls) {
      imageData = await imageUrlToBase64(thumbUrl);
      if (imageData) break;
    }

    if (!imageData) {
      return NextResponse.json({ success: false, error: 'サムネイルの取得に失敗しました' }, { status: 500 });
    }

    // 4. Gemini Visionでファッションアイテム解析
    const fashionItems = await analyzeFashionWithGemini(imageData.data, imageData.mimeType, videoTitle);

    if (fashionItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'この動画のサムネイルからファッションアイテムを検出できませんでした。ファッション系の動画URLをお試しください。',
      });
    }

    // 5. 楽天APIで各アイテムを検索（並列実行）
    const searchResults = await Promise.allSettled(
      fashionItems.slice(0, 4).map(async (item: string) => {
        const products = await searchRakutenItems(item);
        return { keyword: item, products };
      })
    );

    const results = searchResults
      .filter((r) => r.status === 'fulfilled' && r.value.products.length > 0)
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        error: '楽天市場で該当商品が見つかりませんでした',
      });
    }

    return NextResponse.json({
      success: true,
      videoTitle,
      thumbnailUrl: thumbnailUrls[1], // hqdefault
      detectedItems: fashionItems,
      results,
    });
  } catch (error: any) {
    console.error('YouTube Coordinator Error:', error);
    return NextResponse.json({ success: false, error: error.message || '解析中にエラーが発生しました' }, { status: 500 });
  }
}
