import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit } from '@/lib/rateLimit';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('smart-gardening', 10);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: '本日の利用上限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  const rateLimitResult = await checkRateLimit(req, 'smart-gardening');
  if (!rateLimitResult.allowed) return rateLimitResult.response!;

  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '画像が必要です' }, { status: 400 });

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      {
        text: `あなたは植物学と園芸に精通したボタニカルアドバイザーです。
添付された植物の写真を分析し、以下のJSON形式のみで回答してください（余分なテキスト不要）:

{
  "plantName": "植物の名前（不明な場合は「不明な植物」）",
  "healthScore": 85,
  "healthLabel": "健康",
  "waterStatus": "適切",
  "waterComment": "水やりの状態の説明（1〜2文）",
  "sunStatus": "十分",
  "diagnosis": "現在の健康状態の説明（2〜3文）",
  "actions": [
    "今すぐできる具体的なアクション1",
    "今すぐできる具体的なアクション2",
    "今後1週間のケア"
  ],
  "tip": "この植物を元気に保つためのプロのワンポイントアドバイス"
}`
      }
    ]);

    const raw = result.response.text().trim();
    // JSON部分を抽出
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Smart Gardening Error:', error);
    return NextResponse.json({ error: '解析に失敗しました。もう一度お試しください。' }, { status: 500 });
  }
}
