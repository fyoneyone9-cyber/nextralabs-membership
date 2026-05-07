import { NextRequest, NextResponse } from 'next/server'

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
    const { theme, genre, maxChars = 5000, includeCoverPrompt = false } = await req.json()

    if (!theme || !genre) {
      return NextResponse.json({ success: false, error: 'テーマとジャンルは必須です。' }, { status: 400 })
    }

    const charLimit = Math.min(maxChars, 10000)

    // 本文生成プロンプト
    const prompt = `あなたはKindle電子書籍の専門ライターです。以下の条件でKindle本の原稿を日本語で執筆してください。

【テーマ】${theme}
【ジャンル】${genre}
【文字数目標】約${charLimit}字

以下の構成で書いてください：
1. はじめに（導入・この本で得られること）
2. 第1章（メインテーマの基礎知識）
3. 第2章（具体的な方法・ステップ）
4. 第3章（実践例・ケーススタディ）
5. 第4章（よくある失敗と対策）
6. おわりに（まとめ・次のアクション）

※Kindleで実際に販売できる品質で、読者に価値ある内容を書いてください。
※各章は ## で始めてください。
※合計${charLimit}字程度になるよう各章を充実させてください。${includeCoverPrompt ? '\n※最後に「【表紙プロンプト】」として英語でMidjourney/DALL-E用の表紙画像生成プロンプトを1つ書いてください。' : ''}`

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 }
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
