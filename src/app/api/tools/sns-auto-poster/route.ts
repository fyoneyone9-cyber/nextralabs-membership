import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCMbtu9IJIGbml2KOv1Yjit9QP7TkmIgiA';
  
  try {
    const { topic, sns, trend } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `あなたはSNSマーケティングのプロです。
ターゲットSNS: ${sns}
テーマ: ${topic}
直近のトレンド要素: ${trend || 'なし'}

上記の情報に基づき、${sns}でバズるための投稿案を作成してください。
以下の内容を含めてください：
1. 投稿本文（ハッシュタグ含む）
2. この投稿がバズる理由（戦略解説）
3. おすすめの投稿時間

必ず以下のJSON形式で返してください：
{
  "content": "投稿本文...",
  "strategy": "バズる理由...",
  "bestTime": "おすすめ時間..."
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const data = JSON.parse(text);

    return NextResponse.json({ success: true, ...data });

  } catch (error: any) {
    console.error('SNS Poster API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: '生成に失敗しました。',
      content: '【エラー】AIとの通信に失敗しました。手動で投稿を作成してください。',
      strategy: 'システムエラーにより戦略を表示できません。',
      bestTime: '19:00 - 21:00'
    }, { status: 500 });
  }
}
