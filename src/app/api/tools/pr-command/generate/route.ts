import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { toolName, toolDescription, updateInfo, evidenceData } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const prompt = `あなたはNextraLabsの広報担当AI「PR-Command」です。
マスタ機「${toolName}」の最新実績に基づいた、note向けの最強PR記事を日本語で作成してください。

【対象ツール】: ${toolName}
【概要】: ${toolDescription}
【最新の実績・証拠】: ${JSON.stringify(evidenceData)}
【今回のアップデート】: ${updateInfo}

【記事構成テンプレート】:
1. 🔴 衝撃の事実から開始（現状の課題をAIがどう破壊したか）
2. 🚀 実績の証明（具体的な成功数値やAPI連携の事実を提示）
3. 🛠️ 開発秘話（NextraLabs憲法「本物への執念」を語る）
4. 🔗 今すぐこの「兵器」を手に入れる（会員登録への強固な導線）

トーン: 圧倒的なプロフェッショナル感、自信に満ちたワクワク系。
出力形式: noteにそのまま貼れるMarkdown。
必ず日本語で出力してください。`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ article: result.response.text() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
