import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 🛠️ Nextra Master AI Reply Engine
 * 憲法：外部連携を介さず、このAPI単体でGeminiを叩き、返信案を生成して返す。
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { subject, from, body } = await req.json();
    
    // 🚀 Gemini 1.5 Flash を使用して爆速生成
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `あなたは有能なビジネス秘書です。以下のメール内容を解析し、状況に合わせた最適な返信案を作成してください。
相手に失礼がなく、かつ簡潔で分かりやすい内容を心がけてください。

【メール情報】
件名: ${subject}
差出人: ${from}
内容: ${body}

出力は「返信本文のみ」としてください。余計な挨拶や解説は不要です。`;

    const result = await model.generateContent(prompt);
    const replyText = result.response.text();

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('[AI_REPLY_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
