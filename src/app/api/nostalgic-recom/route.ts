import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { yearsAgo, genres, description } = await req.json() as {
      yearsAgo: number
      genres: string[]
      description?: string
    }

    const targetYear = 2026 - yearsAgo
    const eraHeiseiOrReiwa = targetYear >= 2019
      ? `令和${targetYear - 2018}年`
      : targetYear >= 1989
        ? `平成${targetYear - 1988}年`
        : `昭和${targetYear - 1925}年`

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY

    // APIキーなし → モックデータ
    if (!apiKey) {
      return NextResponse.json(getMockData(yearsAgo, targetYear, genres, eraHeiseiOrReiwa))
    }

    // Gemini API呼び出し
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const genresText = genres.join('・')
    const userContext = description ? `ユーザーの当時の状況: ${description}` : '追加情報なし'

    const prompt = `${yearsAgo}年前（${targetYear}年頃、${eraHeiseiOrReiwa}）の日本で大ヒットした「${genresText}」ジャンルの名作を10作品教えてください。
${userContext}

以下のJSON形式のみで返答してください（コードブロック・マークダウン不要、純粋なJSONのみ）:
{
  "items": [
    {
      "title": "作品タイトル（日本語）",
      "genre": "ジャンル名",
      "year": 発売または放映年（数値のみ）,
      "description": "この作品が${targetYear}年頃になぜ流行したかの解説（100文字以内）",
      "whyYou": "なぜあなたの青春に響くかのパーソナルメッセージ（50文字以内、温かい口調で）",
      "rakutenUrl": "https://search.rakuten.co.jp/search/mall/タイトルをURLエンコード/",
      "amazonUrl": "https://www.amazon.co.jp/s?k=タイトルをURLエンコード"
    }
  ],
  "era": "${targetYear}年（${eraHeiseiOrReiwa}）頃",
  "eraLabel": "この時代を表すキャッチーな一言ラベル（例: ゆとり世代の青春・バブル景気の輝き）",
  "message": "あの頃へのタイムトラベルを祝う温かい一言（30文字以内）"
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // JSONパース（コードブロックが含まれる場合を除去）
    const jsonText = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '').trim()
    const data = JSON.parse(jsonText)

    return NextResponse.json(data)
  } catch (e: unknown) {
    console.error('[nostalgic-recom] Error:', e)
    const message = e instanceof Error ? e.message : 'AI生成に失敗しました'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function getMockData(yearsAgo: number, targetYear: number, genres: string[], era: string) {
  const MOCK_ITEMS: Record<string, { title: string; genre: string; year: number; desc: string; why: string }[]> = {
    '音楽': [
      { title: 'Can You Celebrate? / 安室奈美恵', genre: '音楽', year: 1997, desc: '結婚式の定番曲として社会現象に。アムラー旋風が日本中を席巻した。', why: 'あの頃、どこに行っても流れていたあの声がきっと蘇ります。' },
      { title: 'Lemon / 米津玄師', genre: '音楽', year: 2018, desc: '朝ドラ主題歌として歴代最高の配信再生数を記録。', why: 'あの哀愁あるメロディは、今も心の奥を揺さぶるはずです。' },
    ],
    '映画': [
      { title: '千と千尋の神隠し', genre: '映画', year: 2001, desc: '日本映画興行収入1位を長年保持。ベルリン国際映画祭金熊賞受賞。', why: 'あの壮大な世界観は、何度見ても新しい発見があります。' },
    ],
    'アニメ': [
      { title: 'ドラゴンボールZ', genre: 'アニメ', year: 1989, desc: '悟空の成長と戦いを描いた国民的アニメ。世界中でファンを獲得。', why: 'かめはめ波を練習したあの日々を、きっと思い出します。' },
    ],
    'ゲーム': [
      { title: 'ドラゴンクエストV 天空の花嫁', genre: 'ゲーム', year: 1992, desc: '3世代にわたるストーリーが感動を呼んだ。花嫁選びが社会現象に。', why: 'あの選択画面で悩んだ夜を、今でも覚えていませんか？' },
    ],
    'マンガ': [
      { title: 'SLAM DUNK', genre: 'マンガ', year: 1990, desc: 'バスケットボールの魅力を日本に広めた伝説的名作。', why: 'あの熱い試合の興奮は、今も色あせていません。' },
    ],
    '本': [
      { title: '海辺のカフカ / 村上春樹', genre: '本', year: 2002, desc: '少年の成長と謎めいた物語が世界中の読者を魅了。', why: 'あの頃の自分と主人公が重なって見えたはずです。' },
    ],
    'ドラマ': [
      { title: 'ロングバケーション', genre: 'ドラマ', year: 1996, desc: '月9の王道として平均視聴率32%超。木村拓哉・山口智子の名コンビ。', why: 'あのテーマ曲を聞くだけで、瞬時に90年代に戻れます。' },
    ],
  }

  const items = genres.flatMap(g => MOCK_ITEMS[g] || []).slice(0, 10).map(item => ({
    ...item,
    description: item.desc,
    whyYou: item.why,
    rakutenUrl: `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.title)}/`,
    amazonUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent(item.title)}`,
  }))

  return {
    items: items.length > 0 ? items : [{
      title: 'サンプル作品',
      genre: genres[0] || '音楽',
      year: targetYear,
      description: 'この時代を代表する名作です。',
      whyYou: 'あなたの青春に響いた作品。',
      rakutenUrl: `https://search.rakuten.co.jp/search/mall/${encodeURIComponent('名作')}/`,
      amazonUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent('名作')}`,
    }],
    era: `${targetYear}年（${era}）頃`,
    eraLabel: `${yearsAgo}年前の青春`,
    message: 'あの頃の名作との再会をお楽しみください。（開発モード）',
  }
}
