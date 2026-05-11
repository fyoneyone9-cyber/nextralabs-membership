import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || ''
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || ''

// ─── アフィリエイトタグ（MEMORY.md準拠） ──────────────────────────────────────
const AFFILIATE_TAG = '534e3725-22'

// ─── 楽天商品検索API（失敗時はURL生成フォールバック） ────────────────────────

interface GiftItem {
  name: string
  price: number
  url: string
  imageUrl: string
  shopName: string
  reviewAverage: number
  reviewCount: number
  caption: string
  isFallback?: boolean
}

// 楽天アフィリエイト検索URLを直接生成（APIキー不要）
function generateRakutenSearchUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword)
  return `https://search.rakuten.co.jp/search/mall/${encoded}/?l2-id=ctl_search_pc_searchbox&f=1&aff_id=${AFFILIATE_TAG}`
}

async function searchRakutenItems(
  keyword: string,
  minPrice: number,
  maxPrice: number,
  hits = 6
): Promise<GiftItem[]> {
  // APIキーが設定されていない場合はスキップ
  if (!RAKUTEN_APP_ID || RAKUTEN_APP_ID.length < 8) {
    return []
  }

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
      `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170426?${params}`,
      {
        headers: { 'User-Agent': 'NextraLabs/1.0' },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) {
      console.warn('[gift-advisor] Rakuten API error:', res.status, await res.text())
      return []
    }
    const data = await res.json()
    if (!data.Items?.length) return []

    return data.Items
      .map((i: { Item: { itemName: string; itemPrice: number; affiliateUrl: string; itemUrl: string; mediumImageUrls: { imageUrl: string }[]; shopName: string; reviewAverage: number; reviewCount: number; itemCaption: string } }) => ({
        name: i.Item.itemName,
        price: i.Item.itemPrice,
        url: i.Item.affiliateUrl || i.Item.itemUrl,
        imageUrl: i.Item.mediumImageUrls?.[0]?.imageUrl || '',
        shopName: i.Item.shopName,
        reviewAverage: i.Item.reviewAverage || 0,
        reviewCount: i.Item.reviewCount || 0,
        caption: i.Item.itemCaption?.slice(0, 80) || '',
      }))
      .filter((item: GiftItem) => item.url)
      .slice(0, 5)
  } catch (e) {
    console.warn('[gift-advisor] Rakuten search failed:', e)
    return []
  }
}

// ─── フォールバック商品候補生成（APIなし） ────────────────────────────────────

function generateFallbackItems(
  keywords: string[],
  minPrice: number,
  maxPrice: number
): GiftItem[] {
  return keywords.slice(0, 5).map((kw, i) => ({
    name: `楽天市場で「${kw}」を探す`,
    price: 0,
    url: generateRakutenSearchUrl(`${kw} ${minPrice}円〜${maxPrice}円`),
    imageUrl: '',
    shopName: '楽天市場',
    reviewAverage: 0,
    reviewCount: 0,
    caption: `予算¥${minPrice.toLocaleString()}〜¥${maxPrice.toLocaleString()}で検索`,
    isFallback: true,
  }))
}

// ─── Gemini: 商品選定分析 ──────────────────────────────────────────────────────

interface GeminiAnalysis {
  recommendation: string
  giftKeywords: string[]
  mannerTips: string
  messageTemplate: string
  mannerScore: number
  reason: string[]
}

async function analyzeWithGemini(
  recipientRelation: string,
  occasion: string,
  budgetMin: number,
  budgetMax: number,
  excludes: string[],
  eventDate: string
): Promise<GeminiAnalysis> {
  const prompt = `あなたはギフトマナーのプロアドバイザーです。

## 贈り先情報
- 相手との関係: ${recipientRelation}
- 贈るシーン: ${occasion}
- 予算: ¥${budgetMin.toLocaleString()}〜¥${budgetMax.toLocaleString()}
- 贈る日: ${eventDate || '未定'}
- 除外条件: ${excludes.length ? excludes.join('、') : 'なし'}

以下の形式でJSONを返してください：

{
  "recommendation": "このシーンと関係性に最適なギフトの選定方針（2〜3文、具体的に）",
  "giftKeywords": ["楽天検索キーワード1（〜10文字）", "楽天検索キーワード2", "楽天検索キーワード3", "楽天検索キーワード4", "楽天検索キーワード5"],
  "mannerTips": "この贈り物のマナーポイント（渡し方・タイミング・のしなど、改行区切りで2〜3点）",
  "messageTemplate": "${recipientRelation}への${occasion}に適した添え書きメッセージ（100〜150文字、敬語レベルを関係性に合わせること）",
  "mannerScore": 4,
  "reason": ["このギフトを推薦する理由1", "理由2", "理由3"]
}

重要ルール：
- giftKeywordsは楽天市場で実際に検索できる日本語キーワードを5つ生成すること
- 除外条件に該当する商品カテゴリのキーワードは使わないこと
- messageTemplateは具体的な文章で書くこと（定型句を避ける）
- mannerScoreは1〜5の整数`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(15000),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    console.error('[gift-advisor] Gemini error:', res.status, errText)
    throw new Error('AI分析に失敗しました')
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'

  try {
    // responseMimeType: application/json でもコードブロックが混入する場合がある
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim()
    const parsed = JSON.parse(cleaned)

    // フィールド補完
    return {
      recommendation: parsed.recommendation || 'ギフト分析を完了しました。',
      giftKeywords: Array.isArray(parsed.giftKeywords) && parsed.giftKeywords.length > 0
        ? parsed.giftKeywords
        : buildFallbackKeywords(recipientRelation, occasion),
      mannerTips: parsed.mannerTips || '',
      messageTemplate: parsed.messageTemplate || 'この度はおめでとうございます。心ばかりの品をお贈りします。どうぞお納めください。',
      mannerScore: typeof parsed.mannerScore === 'number'
        ? Math.max(1, Math.min(5, Math.round(parsed.mannerScore)))
        : 4,
      reason: Array.isArray(parsed.reason) ? parsed.reason.slice(0, 3) : ['AI分析完了'],
    }
  } catch (parseErr) {
    console.error('[gift-advisor] JSON parse error:', parseErr, '\nRaw:', text)
    return {
      recommendation: 'AI分析を完了しました。以下のキーワードで楽天市場をご確認ください。',
      giftKeywords: buildFallbackKeywords(recipientRelation, occasion),
      mannerTips: `${occasion}の贈り物には、のし紙（外のし）を使用することをお勧めします。\n価格帯は相手との関係性に合わせた¥${budgetMin.toLocaleString()}〜¥${budgetMax.toLocaleString()}が適切です。`,
      messageTemplate: buildFallbackMessage(recipientRelation, occasion),
      mannerScore: 4,
      reason: [`${recipientRelation}への${occasion}に最適なギフトを選定しました`],
    }
  }
}

function buildFallbackKeywords(relation: string, occasion: string): string[] {
  const occasionMap: Record<string, string[]> = {
    誕生日: ['誕生日プレゼント', 'バースデーギフト', '誕生日 おしゃれギフト', '誕生日 グルメギフト', '誕生日 体験型'],
    結婚記念日: ['記念日ギフト', 'アニバーサリー プレゼント', '記念日 スイーツ', '記念日 体験 カップル', '記念日 花束'],
    '昇進・栄転': ['昇進祝い', '栄転祝い ギフト', '昇進 お祝い 実用的', '昇進祝い グルメ', '昇進 記念品'],
    出産祝い: ['出産祝い', 'ベビーギフト', '出産祝い セット', '赤ちゃん プレゼント', '出産内祝い'],
    結婚祝い: ['結婚祝い', 'ウェディングギフト', '結婚 お祝い カタログ', '新婚 プレゼント', '結婚記念 ギフト'],
    退職祝い: ['退職祝い', '定年退職 プレゼント', '退職記念 ギフト', '退職 お祝い 実用的', '感謝 ギフト'],
    母の日: ['母の日プレゼント', '母の日 花', '母の日 スイーツ', '母の日 コスメ', '母の日 体験'],
    父の日: ['父の日プレゼント', '父の日 グルメ', '父の日 ビール', '父の日 実用的', '父の日 ゴルフ'],
    お中元: ['お中元 ギフト', '御中元 食品', 'お中元 人気 2024', 'お中元 グルメ', 'お中元 飲み物'],
    お歳暮: ['お歳暮 ギフト', '御歳暮 食品', 'お歳暮 人気', 'お歳暮 高級', 'お歳暮 セット'],
  }
  const base = occasionMap[occasion] || [`${occasion} プレゼント`, `${occasion} ギフト`, 'おしゃれ プレゼント', '高品質 ギフト', '人気 プレゼント']
  return base
}

function buildFallbackMessage(relation: string, occasion: string): string {
  const messages: Record<string, string> = {
    '上司・先輩': `この度は${occasion}、誠におめでとうございます。日頃のご指導に感謝の気持ちを込めて、心ばかりの品をお贈りします。お体に気をつけてお過ごしください。`,
    '取引先・ビジネス': `平素は格別のご高配を賜り、誠にありがとうございます。${occasion}をお祝い申し上げますとともに、感謝の印として心ばかりの品をお贈りします。`,
    '同僚・友人': `${occasion}おめでとう！いつもありがとうね。気に入ってもらえたら嬉しいです。これからもよろしく！`,
    '親・義実家': `${occasion}おめでとうございます。いつもお世話になっています。心ばかりですが、お口に合うと嬉しいです。また会いに行きますね。`,
    '恋人・配偶者': `${occasion}おめでとう。いつもありがとう。これからも一緒に楽しい時間を過ごしましょう。`,
    子ども: `${occasion}おめでとう！これからもたくさん笑って、大きく育ってね。大好きだよ。`,
  }
  return messages[relation] || `この度の${occasion}、誠におめでとうございます。心ばかりの品をお贈りします。どうぞお納めください。`
}

// ─── 関係性→楽天検索ベースキーワード ─────────────────────────────────────────

function buildSearchKeyword(relation: string, occasion: string): string {
  const occasionKeywords: Record<string, string> = {
    誕生日: '誕生日 プレゼント',
    結婚記念日: '記念日 ギフト',
    '昇進・栄転': '昇進祝い ギフト',
    出産祝い: '出産祝い',
    結婚祝い: '結婚祝い ギフト',
    退職祝い: '退職祝い ギフト',
    還暦祝い: '還暦 プレゼント',
    母の日: '母の日 プレゼント',
    父の日: '父の日 プレゼント',
    クリスマス: 'クリスマス プレゼント',
    バレンタイン: 'バレンタイン チョコレート',
    お中元: 'お中元 ギフト',
    お歳暮: 'お歳暮 ギフト',
    'その他・感謝': 'お礼 プレゼント ギフト',
  }
  const relKeywords: Record<string, string> = {
    '上司・先輩': '高品質 実用的',
    '取引先・ビジネス': '個包装 のし対応',
    '同僚・友人': 'おしゃれ',
    '親・義実家': '食品 産地',
    '恋人・配偶者': 'サプライズ',
    子ども: '知育 安全 子供',
    その他: '',
  }
  const base = occasionKeywords[occasion] || 'ギフト プレゼント'
  const relKw = relKeywords[relation] || ''
  return `${base} ${relKw}`.trim()
}

// ─── メインハンドラ ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
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

    const { recipientRelation, occasion, budgetMin, budgetMax, excludes, eventDate } =
      await req.json()

    if (!recipientRelation || !occasion || !budgetMin || !budgetMax) {
      return NextResponse.json(
        { error: '必須項目（相手・シーン・予算）を入力してください' },
        { status: 400 }
      )
    }

    // Gemini分析（並列で楽天API も試行）
    const searchKeyword = buildSearchKeyword(recipientRelation, occasion)

    const [analysis, rakutenItems] = await Promise.all([
      analyzeWithGemini(recipientRelation, occasion, budgetMin, budgetMax, excludes || [], eventDate || '未定'),
      searchRakutenItems(searchKeyword, budgetMin, budgetMax, 8),
    ])

    // 楽天API結果がなければ、Geminiが生成したキーワードでフォールバック
    let items: GiftItem[] = rakutenItems
    if (items.length === 0) {
      const fallbackKeywords = analysis.giftKeywords?.length > 0
        ? analysis.giftKeywords
        : buildFallbackKeywords(recipientRelation, occasion)
      items = generateFallbackItems(fallbackKeywords, budgetMin, budgetMax)
    }

    // 使用ログ記録
    await supabase.from('tool_usage_logs').insert({
      user_id: user.id,
      tool_id: 'gift-advisor',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      items,
      analysis,
      searchKeyword,
      hasRealItems: rakutenItems.length > 0,
      remainingToday: 5 - usageCount - 1,
    })
  } catch (e) {
    console.error('[gift-advisor] error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'ギフト提案の生成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}
