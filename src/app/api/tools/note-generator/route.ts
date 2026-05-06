import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { toolName, toolDescription, updateInfo } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `あなたはNextraLabsの広報担当AIです。
最新AIツール「${toolName}」のPR記事をnote向けに作成してください。

【ツールの概要】: ${toolDescription}
【今回のアップデート内容】: ${updateInfo || "新規リリース"}

【記事構成ルール】:
1. あるある共感（冒頭）
2. ツール紹介（ワクワクする表現で）
3. 使い方・技術の凄さ（本物であることの強調）
4. NextraLabsへのリンク
5. 記事トーンはポジティブでワクワク系に統一してください。

出力はMarkdown形式でお願いします。`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ article: result.response.text() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
