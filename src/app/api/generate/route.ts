import { NextRequest, NextResponse } from 'next/server'

// Vercel Hobby plan max duration
export const maxDuration = 10
export const dynamic = 'force-dynamic'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCMbtu9IJIGbml2KOv1Yjit9QP7TkmIgiA'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

// DOCX生成（簡易HTML→DOCX変換）
function generateSimpleDocx(title: string, content: string): string {
  // Word XML形式の簡易DOCX
  const paragraphs = content.split('\n').filter(l => l.trim()).map(line => {
    const isHeading = line.startsWith('#')
    const text = line.replace(/^#+\s*/, '').replace(/\*\*/g, '')
    if (isHeading) {
      return `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${escapeXml(text)}</w:t></w:r></w:p>`
    }
    return `<w:p><w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>${escapeXml(title)}</w:t></w:r></w:p>
    ${paragraphs}
    <w:sectPr/>
  </w:body>
</w:document>`

  return Buffer.from(xml).toString('base64')
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  try {
    const { theme, genre, maxChars = 5000, includeCoverPrompt = false, isAdmin = false } = await req.json()

    if (!theme || !genre) {
      return NextResponse.json({ success: false, error: 'テーマとジャンルは必須です。' }, { status: 400 })
    }

    // 管理者は制限なし。それ以外はVercel Hobby plan 10秒タイムアウト対策
    const charLimit = isAdmin ? Math.min(maxChars, 10000) : Math.min(maxChars, 3000)
    const maxTokens = isAdmin ? 8192 : 2048

    const prompt = isAdmin
      ? `あなたはKindle電子書籍の専門ライターです。以下の条件でKindle本の原稿を日本語で執筆してください。

【テーマ】${theme}
【ジャンル】${genre}
【文字数目標】約${charLimit}字

以下の構成で書いてください：
## はじめに
## 第1章：基礎知識
## 第2章：具体的な方法・ステップ
## 第3章：実践例・ケーススタディ
## 第4章：よくある失敗と対策
## おわりに

各章を充実させ、Kindleで販売できる品質で書いてください。${includeCoverPrompt ? '\n最後に【表紙プロンプト】として英語でMidjourney/DALL-E用プロンプトを書いてください。' : ''}`
      : `Kindle電子書籍の原稿を日本語で書いてください。

テーマ：${theme}
ジャンル：${genre}
文字数：約${charLimit}字

構成：
## はじめに
## 第1章：基礎知識
## 第2章：具体的な方法
## 第3章：実践・まとめ

各章300〜500字で簡潔に。${includeCoverPrompt ? '\n最後に【表紙プロンプト】として英語で画像生成プロンプトを1行書いてください。' : ''}`

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[GENERATE_API_ERROR]', errText)
      return NextResponse.json({ success: false, error: 'AI生成に失敗しました。しばらく後に再試行してください。' }, { status: 500 })
    }

    const data = await res.json()
    const fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!fullText) {
      return NextResponse.json({ success: false, error: 'AIからの応答が空でした。' }, { status: 500 })
    }

    // 表紙プロンプト抽出
    let mainText = fullText
    let coverPrompt: string | undefined
    if (includeCoverPrompt) {
      const coverMatch = fullText.match(/【表紙プロンプト】\s*([\s\S]+)$/)
      if (coverMatch) {
        coverPrompt = coverMatch[1].trim()
        mainText = fullText.replace(/【表紙プロンプト】[\s\S]+$/, '').trim()
      }
    }

    // タイトル抽出（最初の行 or テーマから生成）
    const firstLine = mainText.split('\n').find(l => l.trim())?.replace(/^#+\s*/, '') || theme
    const title = firstLine.length > 40 ? theme : firstLine

    // KDPメタデータ生成
    const kdpMetadata = {
      title,
      subtitle: `${genre}で成果を出すための完全ガイド`,
      author: 'NextraLabs著',
      genre,
      keywords: [theme, genre, 'AI', '副業', 'ガイド'].slice(0, 7),
      description: `${theme}について、具体的な方法と実践例を交えて解説します。${genre}に興味がある方必読の一冊。`,
      language: '日本語',
      category: genre,
      price_jp: 250,
      kdp_select: true,
      publishing_tips: [
        'カバー画像は2560×1600pxで作成してください',
        'タイトルは検索キーワードを含めると効果的です',
        '内容紹介文は400字程度が理想的です',
        '価格は¥250〜¥350が売れやすい価格帯です',
      ]
    }

    // プレビュー（最初の1000字）
    const preview = mainText.slice(0, 1000)
    const charCount = mainText.length

    // DOCX生成
    const docxBase64 = generateSimpleDocx(title, mainText)

    return NextResponse.json({
      success: true,
      title,
      preview,
      docxBase64,
      kdpMetadata,
      charCount,
      coverPrompt,
    })

  } catch (err) {
    console.error('[GENERATE_ROUTE_ERROR]', err)
    return NextResponse.json({ success: false, error: '予期しないエラーが発生しました。' }, { status: 500 })
  }
}
