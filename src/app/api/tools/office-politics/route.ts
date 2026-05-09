import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    if (!input || typeof input !== 'string' || input.trim().length < 10) {
      return NextResponse.json({ error: '入力が短すぎます。もう少し詳しく教えてください。' }, { status: 400 })
    }

    const prompt = `あなたは組織心理学と社内政治のプロフェッショナルです。
以下のユーザーが提供した職場状況を分析し、以下の3点を日本語で回答してください。

【職場状況】
${input.trim()}

---

## 1. 現在のパワーバランス
誰が実質的な権力を持っているか、表の権力者と裏の権力者を分析してください。

## 2. 派閥・人間関係の構造
主要な派閥や人間関係のグループを整理し、それぞれの特徴と思惑を解説してください。

## 3. 最適な立ち回り戦略
この状況でユーザーが取るべき具体的な行動プランを3〜5ステップで提示してください。

---
※ 冷静かつ実践的な視点で、感情論は排除して分析してください。`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'APIキーが設定されていません' }, { status: 500 })
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.error('Gemini API error:', errData)
      return NextResponse.json({ error: 'AI解析に失敗しました。しばらく後でお試しください。' }, { status: 500 })
    }

    const data = await res.json()
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!result) {
      return NextResponse.json({ error: '解析結果を取得できませんでした' }, { status: 500 })
    }

    return NextResponse.json({ result })
  } catch (e) {
    console.error('Office politics API error:', e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
