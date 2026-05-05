import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { subject, from, snippet } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `あなたは有能な秘書です。以下のメールへの返信案を2パターン（丁寧・簡潔）作成してください。
件名: ${subject}
差出人: ${from}
内容: ${snippet}

出力は純粋に返信本文のみ、パターン間は「---」で区切ってください。`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
