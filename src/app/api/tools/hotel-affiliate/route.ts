import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { hotelName, userVibe, affiliateId } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたはSNSマーケティングのプロです。
    宿泊者が以下の宿をSNS（X, Instagram, Threads）で紹介する際に、思わず予約したくなるような「バズる紹介文」を作成してください。
    また、提供された楽天アフィリエイトIDを組み込んだ「楽天トラベル」のリンクを生成する体裁にしてください。

    【入力情報】
    宿名: ${hotelName}
    投稿の雰囲気: ${userVibe}
    アフィリエイトID: ${affiliateId || "未設定"}

    【制約】
    ・絵文字を効果的に使い、スマホで読みやすい改行を行うこと。
    ・アフィリエイトリンクは https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/... という形式を模倣してください。
    ・ハッシュタグを3〜5個含めること。

    出力はJSON形式で返してください。
    {
      "postText": "SNS投稿本文",
      "affiliateLink": "生成されたリンクURL",
      "strategy": "この文章の狙い（一言）"
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
