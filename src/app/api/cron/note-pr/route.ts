import { NextResponse } from 'next/server';

/**
 * 📝 NOTE PR記事自動生成エンジン (NextraLabs Automation)
 * 9時・12時・17時に実行され、その日のトレンドに基づいた
 * オススメ記事とアイキャッチ画像を生成する。
 */
export async function GET(req: Request) {
  // Vercel Cron Secretの検証（セキュリティ）
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 1. 最新トレンドの取得
    const trendsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/trends`, { cache: 'no-store' });
    const { trends } = await trendsRes.json();
    const topTrend = trends?.[0] || 'AIによる業務効率化';

    // 2. 記事構成の自動生成 (NextraLabs AI Assistant - リアル対話反映)
    const now = new Date();
    const hour = now.getHours();
    
    let timeSlot = "朝の業務ハック";
    if (hour >= 11 && hour <= 14) timeSlot = "お昼のAI活用術";
    if (hour >= 16) timeSlot = "夕方の戦略アップデート";

    // 💡 あなた(AI)との対話から「本当におすすめしたい」トピックを選出
    const RECOMMENDATIONS = [
      {
        topic: "PMSと錠デバイスのAPI自動連携",
        insight: "宿泊予約から鍵の発行までを完全自動化。人の手を介さない究極のホスピタリティ。",
        image: "A futuristic hotel door with digital lock, syncing with cloud data, emerald green neon."
      },
      {
        topic: "SNSトレンドから「収益のタネ」を自動仕入れ",
        insight: "Google Trendsを楽天在庫に同期。バズる前に仕入れる、データ駆動型の物販戦略。",
        image: "A cyber ship carrying parcels in a digital data sea, orange and teal lighting."
      },
      {
        topic: "上級心理カウンセラー×AIによる婚活戦略",
        insight: "データ解析に深層心理を掛け合わせる。SNS発信を「本質を突く」武器に変える方法。",
        image: "Two glowing human connection nodes, heart shape in digital grid, soft rose and white."
      }
    ];

    const pick = RECOMMENDATIONS[hour % RECOMMENDATIONS.length];

    const articleData = {
      title: `【${timeSlot}】AIアシスタントが提案する「今」やるべき施策：${pick.topic}`,
      content: `本日の対話から導き出した最適解は「${pick.topic}」です。${pick.insight}\n最新トレンド「${topTrend}」との親和性も高く、今すぐNextraLabsツールで実行可能です。`,
      tags: ["AI対話", "NextraLabs", "自動化", "ビジネス戦略"],
      imagePrompt: `High-quality cinematic 3D render, ${pick.image}, cyber punk aesthetic, high contrast, 16:9.`
    };

    // 3. 画像生成命令のシミュレーション
    // 本来は gsk img または DALL-E APIを叩く
    const imageUrl = `https://www.genspark.ai/api/files/s/mock-image-${Date.now()}.png`;

    console.log(`[CRON NOTE-PR] Article generated for ${hour}:00`);

    return NextResponse.json({
      success: true,
      article: articleData,
      imageUrl,
      scheduledTime: `${hour}:00`,
      status: "READY_FOR_POST"
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
