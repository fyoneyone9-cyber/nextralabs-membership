import { NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCMbtu9IJIGbml2KOv1Yjit9QP7TkmIgiA'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.8 }
    })
  })
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function GET(req: Request) {
  try {
    // トレンド取得
    let topTrend = 'AIツール活用'
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const trendsRes = await fetch(`${siteUrl}/api/trends`, { cache: 'no-store' })
      const { trends } = await trendsRes.json()
      if (trends?.[0]) topTrend = trends[0]
    } catch {}

    const now = new Date()
    const hour = now.getHours()
    const dateStr = now.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })

    // 時間帯に合わせたコンテキスト
    let context = '朝の情報収集タイム'
    if (hour >= 11 && hour <= 14) context = 'ランチタイムの学習'
    if (hour >= 16 && hour <= 19) context = '夕方の仕事効率化'
    if (hour >= 20) context = '夜の副業・収益化'

    // ── Note記事生成 ──
    const notePrompt = `あなたはNextraLabsというAIツール会員制サービスのNote記事ライターです。
以下の条件でNote向けの記事を日本語で書いてください。

【今日のトレンドキーワード】${topTrend}
【時間帯コンテキスト】${context}
【日付】${dateStr}

以下の構成で2000字程度の記事を書いてください：

# （キャッチーなタイトル）

## はじめに
（読者の悩みに共感する導入。100字程度）

## （本題セクション1）
（具体的な内容。300字程度）

## （本題セクション2）
（実践的なアドバイス。300字程度）

## NextraLabsで解決できること
（AIツールを使った具体的な解決策。200字程度。自然な形でNextraLabsのツールに言及）

## まとめ
（行動を促す締め。100字程度）

---
※読者が「スキ」を押したくなるような実用的で共感できる内容にしてください。
※トレンドキーワードを自然に盛り込んでください。`

    // ── Kindle記事生成 ──
    const kindlePrompt = `あなたはKindle電子書籍の企画・マーケティングの専門家です。
以下の条件でKindle本の企画案を1つ、日本語で作成してください。

【今日のトレンドキーワード】${topTrend}
【ジャンル文脈】${context}
【日付】${dateStr}

以下の形式で出力してください：

# タイトル案
（売れるKindle本のタイトル。具体的な数字や便益を含める）

## サブタイトル
（補足説明。20字以内）

## ターゲット読者
（具体的なペルソナ。2〜3行）

## 目次（全6章）
1. はじめに
2. 第1章：（具体的な章タイトル）
3. 第2章：（具体的な章タイトル）
4. 第3章：（具体的な章タイトル）
5. 第4章：（具体的な章タイトル）
6. おわりに

## KDP向けキーワード（7個）
（検索されやすいキーワードをカンマ区切りで）

## 内容紹介文（400字）
（KDPダッシュボードにそのまま貼れる内容紹介）

## 推奨価格
（¥〇〇 ＋ 理由）

## 表紙デザイン指示（英語）
（Midjourney/DALL-E用プロンプト。シンプルで伝わりやすく）`

    // 並行生成
    const [noteText, kindleText] = await Promise.all([
      callGemini(notePrompt),
      callGemini(kindlePrompt)
    ])

    return NextResponse.json({
      success: true,
      generatedAt: now.toISOString(),
      trend: topTrend,
      context,
      note: {
        content: noteText,
        charCount: noteText.length,
        platform: 'Note',
        tip: 'Note → 新しい記事 → 本文に貼り付けて投稿'
      },
      kindle: {
        content: kindleText,
        charCount: kindleText.length,
        platform: 'Kindle KDP',
        tip: 'KindleFactory で原稿を生成 → DOCXをKDPにアップロード'
      }
    })

  } catch (error: any) {
    console.error('[NOTE_PR_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
