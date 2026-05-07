import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.GNEWS_API_KEY || '0d64d6796845143fe7f3759f1366bf2f';
  // 日本のトップニュースを取得
  const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=ja&country=jp&max=10&apikey=${API_KEY}`;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 3600 } // 1時間キャッシュ
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'GNews API error', status: res.status }, { status: res.status });
    }

    const data = await res.json();
    
    // TrendStockSystemで扱いやすい形式に整形
    const trends = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt
    }));

    return NextResponse.json({
      source: 'gnews_jp',
      updated: new Date().toISOString(),
      count: trends.length,
      trends: trends
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
