import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
import { unstable_noStore as noStore } from 'next/cache'
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType
} from 'docx'
import { checkApiLimit } from '@/lib/api-limit'

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    // 認証 + 1日3回制限（Kindle原稿生成は重いため厳しめに設定）
    const limitCheck = await checkApiLimit('kindle-generate', 3)
    if (!limitCheck.allowed) {
      if (limitCheck.reason === 'unauthenticated') {
        return NextResponse.json({ success: false, error: 'ログインが必要です' }, { status: 401 })
      }
      return NextResponse.json({ success: false, error: '本日の利用上限（3回）に達しました。明日またお試しください。' }, { status: 429 })
    }

    const { theme, genre, maxChars = 5000, includeCoverPrompt = false } = await req.json()

    if (!theme || !genre) {
      return NextResponse.json({ success: false, error: 'テーマとジャンルは必須です' }, { status: 400 })
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!geminiKey) {
      return NextResponse.json({ success: false, error: 'AI APIキーが設定されていません' }, { status: 500 })
    }

    // ========================
    // Gemini 2.5 Flash で原稿生成
    // ========================
    const genAI = new GoogleGenerativeAI(geminiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const manuscriptPrompt = `
あなたはKindle電子書籍の専門ライターです。以下の条件で電子書籍の原稿を執筆してください。

【テーマ】${theme}
【ジャンル】${genre}
【文字数】${maxChars}字程度（最低${Math.floor(maxChars * 0.8)}字以上）
【対象読者】日本人の一般読者
【出力形式】以下の構成で出力してください：

---TITLE---
（魅力的なタイトルを1行で）

---BODY---
（本文。章立てして、読みやすく実践的な内容を書いてください。
見出しは「## 第○章：タイトル」形式で。
各章は500〜800字程度。合計${maxChars}字程度。）
${includeCoverPrompt ? `
---COVER_PROMPT---
（この本の表紙をAI画像生成ツール（Midjourney/DALL-E）で作るための英語プロンプトを1文で）
` : ''}
---END---

日本語で執筆してください。読者が実際に役立つ具体的な内容にしてください。
`

    const result = await model.generateContent(manuscriptPrompt)
    const raw = result.response.text()

    // ========================
    // パース
    // ========================
    const titleMatch = raw.match(/---TITLE---\s*([\s\S]*?)(?=---BODY---)/)
    const bodyMatch = raw.match(/---BODY---\s*([\s\S]*?)(?=---COVER_PROMPT---|---END---)/)
    const coverMatch = raw.match(/---COVER_PROMPT---\s*([\s\S]*?)(?=---END---)/)

    const title = (titleMatch?.[1] || theme).trim().replace(/\n/g, '')
    const body = (bodyMatch?.[1] || raw).trim()
    const coverPrompt = coverMatch?.[1]?.trim() || undefined
    const charCount = body.length
    const preview = body.slice(0, 1000)

    // ========================
    // KDPメタデータ生成
    // ========================
    const kdpMetaPrompt = `
以下の電子書籍のKDP（Kindle Direct Publishing）入稿用メタデータをJSON形式で生成してください。

タイトル: ${title}
テーマ: ${theme}
ジャンル: ${genre}

以下のJSON形式で出力してください（日本語で）：
{
  "title": "本のタイトル",
  "subtitle": "サブタイトル（40字以内）",
  "description": "本の説明文（400字程度。読者の悩みから始め、ベネフィットを伝える）",
  "keywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5", "キーワード6", "キーワード7"],
  "categories": ["カテゴリ1", "カテゴリ2"],
  "language": "Japanese",
  "price_jpy": 250,
  "royalty_plan": "70%",
  "kdp_select": true
}
JSONのみ出力してください。`

    let kdpMetadata: Record<string, unknown> = {}
    try {
      const metaResult = await model.generateContent(kdpMetaPrompt)
      const metaRaw = metaResult.response.text()
      const jsonMatch = metaRaw.match(/\{[\s\S]*\}/)
      if (jsonMatch) kdpMetadata = JSON.parse(jsonMatch[0])
    } catch {
      kdpMetadata = {
        title,
        subtitle: `${genre}の完全ガイド`,
        description: `${theme}について詳しく解説した実践的な電子書籍です。`,
        keywords: [theme, genre, 'Kindle', '電子書籍', '実践', 'ガイド', '入門'],
        categories: [genre],
        language: 'Japanese',
        price_jpy: 250,
        royalty_plan: '70%',
        kdp_select: true,
      }
    }

    // ========================
    // DOCX 生成
    // ========================
    const lines = body.split('\n')
    const docChildren: Paragraph[] = []

    // タイトルページ
    docChildren.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        text: `ジャンル: ${genre}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        children: [new TextRun({ text: `ジャンル: ${genre}`, color: '888888', size: 20 })],
      }),
      new Paragraph({ text: '', pageBreakBefore: true })
    )

    // 本文パース
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        docChildren.push(new Paragraph({ text: '' }))
      } else if (trimmed.startsWith('## ')) {
        docChildren.push(new Paragraph({
          text: trimmed.replace(/^## /, ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }))
      } else if (trimmed.startsWith('### ')) {
        docChildren.push(new Paragraph({
          text: trimmed.replace(/^### /, ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }))
      } else {
        docChildren.push(new Paragraph({
          children: [new TextRun({ text: trimmed, size: 24 })],
          spacing: { after: 100, line: 360 },
        }))
      }
    }

    const doc = new Document({
      sections: [{ children: docChildren }],
      creator: 'NextraLabs Kindle Factory',
      title,
    })

    const docxBuffer = await Packer.toBuffer(doc)
    const docxBase64 = Buffer.from(docxBuffer).toString('base64')

    return NextResponse.json({
      success: true,
      title,
      preview,
      docxBase64,
      kdpMetadata,
      charCount,
      ...(includeCoverPrompt && coverPrompt ? { coverPrompt } : {}),
    })

  } catch (error: unknown) {
    console.error('Generate API Error:', error)
    const message = error instanceof Error ? error.message : '原稿生成中にエラーが発生しました'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
