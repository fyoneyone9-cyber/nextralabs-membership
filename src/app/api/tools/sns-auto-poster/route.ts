import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('sns-auto-poster', 10);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: '本日の利用上限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCMbtu9IJIGbml2KOv1Yjit9QP7TkmIgiA';

  try {
    const { topic, sns, trend } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const snsGuide = sns === 'X'
      ? 'X(Twitter)向け: 140文字以内、ハッシュタグ2〜3個、改行で読みやすく'
      : 'Instagram向け: 感情に訴える文章、絵文字を適度に使用、ハッシュタグ5〜10個';

    const prompt = `あなたはSNSマーケティングのプロです。
ターゲットSNS: ${sns}
投稿テーマ: ${topic}
直近のトレンド要素: ${trend || 'なし'}
形式ガイド: ${snsGuide}

上記の情報に基づいて、${sns}でバズる投稿を作成してください。

以下のJSON形式のみで返答してください（マークダウンや説明文は不要）:
{
  "content": "投稿本文（ハッシュタグ含む）",
  "strategy": "この投稿がバズる理由（2〜3文）",
  "bestTime": "おすすめ投稿時間帯（例: 19:00〜21:00）"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // JSON部分だけ抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSONの解析に失敗しました');
    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, ...data });

  } catch (error: any) {
    console.error('SNS Poster API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '生成に失敗しました',
    }, { status: 500 });
  }
}
