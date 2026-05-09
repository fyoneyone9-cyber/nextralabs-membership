import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit } from "@/lib/api-limit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // クレジット保護：1日10回制限
    const limitCheck = await checkApiLimit('gmail-reply', 10);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: '本日の生成上限に達しました。明日またご利用ください。' },
        { status: 429 }
      );
    }

    const { subject, from, body } = await req.json();
    
    // 🚀 Gemini 1.5 Flash を使用して爆速生成
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたは有能なビジネス秘書です。以下のメール内容を解析し、状況に合わせた最適な返信案を作成してください。
相手に失礼がなく、かつ簡潔で分かりやすい内容を心がけてください。
また、もし送られてきたメールが「メルマガ」「広告」「通知のみで返信不要なもの」である場合は、無理に返信文を作らず、「このメールは自動送信または広告のため、返信は不要と思われます。ゴミ箱へ移動することをお勧めします。」といった旨のメッセージを出力してください。

【メール情報】
件名: ${subject}
差出人: ${from}
内容: ${body}

出力は「返信本文のみ」または「アドバイスのみ」としてください。余計な挨拶や解説は不要です。`;

    const result = await model.generateContent(prompt);
    
    if (!result.response) {
      throw new Error('Geminiからの応答が空です。APIキーの制限または安全フィルターの可能性があります。');
    }

    const replyText = result.response.text();

    if (!replyText) {
      throw new Error('生成されたテキストが空です。');
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('[AI_REPLY_ERROR]', error);
    // 詳細なエラーをクライアントに返す
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
