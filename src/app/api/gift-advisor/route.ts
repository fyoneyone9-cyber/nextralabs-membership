import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID!

// ─── 楽天商品検索API ──────────────────────────────────────────────────────────

interface RakutenItem {
  Item: {
    itemName: string
    itemPrice: number
    itemUrl: string
    affiliateUrl: string
    mediumImageUrls: { imageUrl: string }[]
    shopName: string
    reviewAverage: number
    reviewCount: number
    itemCaption: string
    genreId: string
  }
}

async function searchRakutenItems(
  keyword: string,
  minPrice: number,
  maxPrice: number,
  hits = 6
): Promise<RakutenItem['Item'][]> {
  try {
    const params = new URLSearchParams({
      applicationId: RAKUTEN_APP_ID,
      affiliateId: RAKUTEN_AFFILIATE_ID,
      format: 'json',
      keyword,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      hits: hits.toString(),
      sort: '-reviewCount',
      imageFlag: '1',
    })

    const res = await fetch(
      `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params}`,
      { headers: { 'User-Agent': 'NextraLabs/1.0' } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!data.Items) return []

    return data.Items.map((i: RakutenItem) => i.Item).filter(
      (item: RakutenItem['Item']) =>
        item.mediumImageUrls?.length > 0 && item.itemUrl
    )
  } catch {
    return []
  }
}

// ─── Gemini: 商品選定とメッセージ代筆 ────────────────────────────────────────

async function analyzeWithGemini(
  recipientRelation: string,
  occasion: string,
  budget: number,
  budgetMax: number,
  excludes: string[],
  eventDate: string,
  items: RakutenItem['Item'][]
): Promise<{
  recommendation: string
  searchKeyword: string
  mannerTips: string
  messageTemplate: string
  mannerScore: number
  reason: string[]
}> {
  const itemSummary = items
    .map(
      (item, i) =>
        `[${i + 1}] ${item.itemName}（¥${item.itemPrice.toLocaleString()}）ショップ: ${item.shopName} 評価: ${item.reviewAverage}/5.0（${item.reviewCount}件）`
    )
    .join('\n')

  const prompt = `あなたはギフトマナーのプロアドバイザーです。以下の条件で最適なギフト選定とメッセージを提案してください。

## 贈り先情報
- 相手との関係: ${recipientRelation}
- 贈るシーン・機会: ${occasion}
- 予算: ¥${budget.toLocaleString()}〜¥${budgetMax.toLocaleString()}
- 贈る日: ${eventDate}
- 除外条件: ${excludes.length ? excludes.join('、') : 'なし'}

## 楽天市場の検索結果商品
${itemSummary || '（商品データなし）'}

---

## 出力フォーマット（JSONのみ、他のテキスト不要）

{
  "recommendation": "おすすめ商品の選定理由と推薦コメント（2〜3文、具体的に）",
  "searchKeyword": "楽天商品検索に使った最適キーワード（日本語、10文字以内）",
  "mannerTips": "この贈り物のマナーポイント（渡し方・タイミング・のしの有無など2〜3点をリスト形式）",
  "messageTemplate": "贈り物に添えるメッセージ文例（${recipientRelation}に適した敬語レベルで100〜150文字）",
  "mannerScore": マナー適合度（5段階、数値のみ）,
  "reason": ["商品を選んだ理由1", "商品を選んだ理由2", "商品を選んだ理由3"]
}

## 絶対に守るルール
1. JSONのみ出力すること（```jsonや説明文不要）
2. messageTemplateは${recipientRelation}の関係性に合った文体・敬語レベルで書くこと
3. 除外条件に該当する商品は絶対に推薦しないこと
4. mannerScoreは1〜5の整数で出力すること
5. reasonは必ず3つ書くこと`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  )
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'

  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return {
      recommendation: 'ギフト選定に失敗しました。再度お試しください。',
      searchKeyword: keyword_fallback(recipientRelation),
      mannerTips: 'マナー情報の取得に失敗しました。',
      messageTemplate: 'この度はおめでとうございます。心ばかりの品をお贈りします。どうぞお納めください。',
      mannerScore: 4,
      reason: ['AI分析中にエラーが発生しました'],
    }
  }
}

function keyword_fallback(relation: string): string {
  const map: Record<string, string> = {
    上司・先輩: '実用的 高品質 ギフト',
    取引先・ビジネス: '御礼 ギフト 個包装',
    同僚・友人: 'おしゃれ プレゼント',
    親・義実家: '食品 ギフト 産地直送',
    恋人・配偶者: 'サプライズ プレゼント',
    子ども: '知育 おもちゃ 安全',
  }
  return map[relation] || 'ギフト プレゼント'
}

// ─── 関係性→検索キーワードマッピング ────────────────────────────────────────

function buildSearchKeyword(
  relation: string,
  occasion: string,
  excludes: string[]
): string {
  const occasionKeywords: Record<string, string> = {
    誕生日: '誕生日 プレゼント',
    結婚記念日: '記念日 ギフト',
    昇進・栄転: '昇進祝い ギフト',
    出産祝い: '出産祝い',
    結婚祝い: '結婚祝い ギフト',
    退職祝い: '退職祝い ギフト',
    還暦祝い: '還暦 プレゼント',
    母の日: '母の日 プレゼント',
    父の日: '父の日 プレゼント',
    クリスマス: 'クリスマス プレゼント',
    バレンタイン: 'バレンタイン チョコレート',
    お中元: 'お中元 ギフト 御中元',
    お歳暮: 'お歳暮 ギフト',
    'その他・感謝': 'お礼 プレゼント',
  }

  const relationKeywords: Record<string, string> = {
    '上司・先輩': '高品質 実用的',
    '取引先・ビジネス': '個包装 のし対応',
    '同僚・友人': 'おしゃれ',
    '親・義実家': '食品 産地',
    '恋人・配偶者': 'サプライズ',
    子ども: '知育 安全 子供',
    その他: '',
  }

  const base = occasionKeywords[occasion] || 'ギフト プレゼント'
  const relKw = relationKeywords[relation] || ''
  const excludeFilter = excludes.includes('食べ物NG') ? ' 雑貨' : ''
  return `${base} ${relKw}${excludeFilter}`.trim()
}

// ─── メインハンドラ ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // 1日5回制限
    const today = new Date().toISOString().split('T')[0]
    const { data: usageLogs } = await supabase
      .from('tool_usage_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', 'gift-advisor')
      .gte('created_at', `${today}T00:00:00.000Z`)

    const usageCount = usageLogs?.length ?? 0
    if (usageCount >= 5) {
      return NextResponse.json(
        { error: '本日の利用上限（1日5回）に達しました。明日またお試しください。' },
        { status: 429 }
      )
    }

    // リクエスト解析
    const { recipientRelation, occasion, budgetMin, budgetMax, excludes, eventDate } =
      await req.json()

    if (!recipientRelation || !occasion || !budgetMin || !budgetMax) {
      return NextResponse.json(
        { error: '必須項目（相手・シーン・予算）を入力してください' },
        { status: 400 }
      )
    }

    const searchKeyword = buildSearchKeyword(recipientRelation, occasion, excludes || [])

    // 楽天商品検索
    const items = await searchRakutenItems(searchKeyword, budgetMin, budgetMax, 8)

    // Gemini分析
    const analysis = await analyzeWithGemini(
      recipientRelation,
      occasion,
      budgetMin,
      budgetMax,
      excludes || [],
      eventDate || '未定',
      items
    )

    // 使用ログ記録
    await supabase.from('tool_usage_logs').insert({
      user_id: user.id,
      tool_id: 'gift-advisor',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      items: items.slice(0, 5).map((item) => ({
        name: item.itemName,
        price: item.itemPrice,
        url: item.affiliateUrl || item.itemUrl,
        imageUrl: item.mediumImageUrls?.[0]?.imageUrl || '',
        shopName: item.shopName,
        reviewAverage: item.reviewAverage,
        reviewCount: item.reviewCount,
        caption: item.itemCaption?.slice(0, 80),
      })),
      analysis,
      searchKeyword,
      remainingToday: 5 - usageCount - 1,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'ギフト提案の生成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}
