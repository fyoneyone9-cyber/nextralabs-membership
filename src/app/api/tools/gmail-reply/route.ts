import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit } from "@/lib/api-limit";
import { unstable_noStore as noStore } from 'next/cache'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    // クレジット保護：1日10回制限
    const limitCheck = await checkApiLimit('gmail-reply', 10);
    if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

    const { subject, from, body, sentMessages } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ── 送信済みメールを文体RAGコンテキストとして整形 ──
    const ragContext = (sentMessages && sentMessages.length > 0)
      ? `【あなたの過去の送信メール（文体・口調の参考）】\n` +
        sentMessages.map((m: any, i: number) => `例${i + 1}: ${m.body}`).join('\n\n')
      : '';

    // ── メルマガ・広告判定ヒント ──
    const isLikelyAd = /unsubscribe|配信停止|newsletter|no-reply|noreply|@mail\.|@news\.|@info\.|@notification/i.test(from + body);

    const prompt = `あなたは有能なビジネス秘書です。以下の指示に従ってください。

${ragContext ? ragContext + '\n\n' : ''}【受信メール情報】
件名: ${subject}
差出人: ${from}
本文:
${body.slice(0, 1500)}

---
【タスク1: 返信案の作成】
${isLikelyAd
  ? 'このメールはメルマガ・広告・自動通知の可能性があります。該当する場合は「このメールは自動送信・広告のため返信不要と思われます。ゴミ箱への移動をお勧めします。」と出力してください。'
  : '上記の過去送信メール（文体・口調の参考）をもとに、同じ文体・口調で自然な返信案を作成してください。過去メールがない場合は丁寧なビジネス日本語で作成してください。'}
返信本文のみを出力してください（件名・宛名・余計な解説は不要）。

【タスク2: 重要度分類】
このメールを以下の4つのカテゴリのうち1つに分類し、JSONキーで返してください。
- urgent_important（緊急かつ重要: 今すぐ対応）
- urgent_not_important（緊急だが重要でない: 早めに対応）
- not_urgent_important（緊急でないが重要: 計画対応）
- not_urgent_not_important（緊急でも重要でもない: 整理対象）

【出力フォーマット（必ずこの形式で）】
REPLY:
（返信本文またはアドバイス）
QUADRANT:
（カテゴリキーのみ）`;

    const result = await model.generateContent(prompt);
    if (!result.response) {
      throw new Error('Geminiからの応答が空です。APIキーの制限または安全フィルターの可能性があります。');
    }

    const raw = result.response.text();

    // ── レスポンスをパース ──
    const replyMatch = raw.match(/REPLY:\s*([\s\S]*?)(?=QUADRANT:|$)/);
    const quadrantMatch = raw.match(/QUADRANT:\s*(\S+)/);

    const reply = replyMatch ? replyMatch[1].trim() : raw.trim();
    const quadrant = quadrantMatch
      ? quadrantMatch[1].trim()
      : 'not_urgent_not_important';

    const validQuadrants = ['urgent_important', 'urgent_not_important', 'not_urgent_important', 'not_urgent_not_important'];
    const safeQuadrant = validQuadrants.includes(quadrant) ? quadrant : 'not_urgent_not_important';

    return NextResponse.json({ reply, quadrant: safeQuadrant });

  } catch (error: any) {
    console.error('[AI_REPLY_ERROR]', error);
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
