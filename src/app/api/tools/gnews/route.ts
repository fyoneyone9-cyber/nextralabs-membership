import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.GNEWS_API_KEY || '0d64d6796845143fe7f3759f1366bf2f';
  // 日本国内の最新ニュースを「時間順」で検索
  const url = `https://gnews.io/api/v4/search?q=日本&lang=ja&country=jp&max=10&sortby=publishedAt&apikey=${API_KEY}`;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 300 } // 5分キャッシュ
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'GNews API error', status: res.status }, { status: res.status });
    }

    const data = await res.json();
    
    const trends = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      source: 'GNews (Latest)',
      url: article.url,
      publishedAt: article.publishedAt
    }));

    return NextResponse.json({
      source: 'gnews_jp_speed',
      updated: new Date().toISOString(),
      count: trends.length,
      trends: trends
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'GNews Fetch Failed' }, { status: 500 });
  }
}
