import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function GET() {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('gnews', 10);
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

  const API_KEY = process.env.GNEWS_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'GNEWS_API_KEY が設定されていません' }, { status: 500 });
  }
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
