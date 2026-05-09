import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('disaster-agent', 10);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: '本日の利用上限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    const { lat, lng, familyEmail } = await req.json();

    // 1. USGS API等の地震速報シミュレーション
    const disasterInfo = {
      event: "地震発生 (震度想定: 5強)",
      location: "神奈川県近海",
      time: new Date().toISOString()
    };

    // 2. 現在地周辺の避難所検索 (Google Places APIシミュレート)
    const shelters = [
      { name: "海老名市立第一中学校", distance: "800m", type: "広域避難場所" },
      { name: "海老名運動公園", distance: "1.2km", type: "総合避難所" }
    ];

    // 3. 家族への送信メッセージ構築
    const emergencyMessage = `
【緊急通知】AI防災エージェントより
現在地付近で${disasterInfo.event}を検知しました。
私は現在無事です。これから以下の避難所へ向かいます。

現在地: https://www.google.com/maps?q=${lat},${lng}
向かう場所: ${shelters[0].name}

自動送信時刻: ${disasterInfo.time}
`;

    return NextResponse.json({ 
      disasterInfo, 
      shelters, 
      emergencyMessage,
      status: "READY" 
    });

  } catch (error) {
    console.error('Disaster Agent Error:', error);
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
