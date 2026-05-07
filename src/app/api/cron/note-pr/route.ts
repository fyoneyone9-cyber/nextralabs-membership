import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const trendsRes = await fetch((process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/api/trends', { cache: 'no-store' });
    const { trends } = await trendsRes.json();
    const topTrend = trends?.[0] || 'AIによる業務効率化';
    const now = new Date();
    const hour = now.getHours();
    
    let timeSlot = "朝の業務ハック";
    if (hour >= 11 && hour <= 14) timeSlot = "お昼のAI活用術";
    if (hour >= 16) timeSlot = "夕方の戦略アップデート";

    const RECOMMENDATIONS = [
      {
        topic: "Nextra：宿泊予約と鍵発行の完全同期",
        insight: "Staysee等のPMSと錠デバイスをAPIで直結。予約確定の瞬間にゲスト専用パスコードが自律的に発行される次世代フロント体験。",
        image: "A minimalist digital gate glowing in emerald green, integrated with a smartphone key."
      },
      {
        topic: "SNSトレンドAI分析：収益のタネを自動抽出",
        insight: "Google Trendsを楽天在庫データに同期。AIが明日バズる商品を特定し、仕入れ判断までを自動化する物販戦略。",
        image: "A digital terminal displaying trending keywords and neon highlights."
      },
      {
        topic: "心理×AI婚活戦略：選ばれる理由を構築",
        insight: "上級心理カウンセラーの知見を統合。深層心理を解析して具体的なアクションを提案する唯一無二のメソッド。",
        image: "Abstract human connection nodes forming a heart shape, digital grid lines."
      }
    ];

    const pick = RECOMMENDATIONS[hour % RECOMMENDATIONS.length];
    
    return NextResponse.json({
      success: true,
      article: {
        title: "【" + timeSlot + "】" + pick.topic + "で圧倒的優位に。",
        content: pick.topic + "の重要性と" + topTrend + "を掛け合わせた最新戦略を公開。",
        imagePrompt: "Cinematic 8k render, " + pick.image
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}