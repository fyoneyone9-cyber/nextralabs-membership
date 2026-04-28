'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────
interface NewsItem {
  title: string
  link: string
  category: string
  pubDate: string
}

interface BuzzScore {
  total: number
  charScore: number
  hookScore: number
  emotionScore: number
  hashtagScore: number
  readability: number
  tips: string[]
}

// ─── Data ────────────────────────────────────────────────
const templates = [
  {
    id: 'empathy', name: '共感型', icon: '🤝', desc: '「わかる〜！」を誘発',
    format: '【自分も経験】\n\n{ニュースの要約}ってニュース見たけど、\nこれ、まさに{自分の体験}だった。\n\n{共感ポイント}\n\nみんなはどう思う？\n\n{ハッシュタグ}',
    example: 'テレワーク廃止の流れが加速ってニュース見たけど、\nこれ、まさに去年うちの会社で起きたことだった。\n\n通勤復活で可処分時間が2時間減って、副業の時間がゼロに。\nでも「出社したほうがコミュニケーション取れる」って本当にそう？\n\nみんなはどう思う？',
  },
  {
    id: 'question', name: '問題提起型', icon: '🤔', desc: '「考えたことなかった」を引き出す',
    format: '{ニュースの要約}。\n\nでもちょっと待って。\n本当に{問いかけ}なのか？\n\n実は{逆の視点}。\n\n{結論 or 問いかけ}\n\n{ハッシュタグ}',
    example: 'AI規制法案が国会通過。\n\nでもちょっと待って。\n本当に「AIを規制すべき」なのか？\n\n実は規制すべきは「AIを悪用する人間」であって、\n技術そのものを縛ると日本だけ置いていかれる。\n\n規制の本質、もう一度考えません？',
  },
  {
    id: 'experience', name: '体験談型', icon: '📖', desc: 'リアルな体験でエンゲージメント獲得',
    format: '{衝撃の一文}\n\n{背景・きっかけ}\n\n{やったこと}\n\n{結果・学び}\n\n{ハッシュタグ}',
    example: '副業3年目で月収が本業を超えた。\n\n最初は月3000円のWebライターから始めた。\n「こんなので稼げるわけない」と思いながら続けた。\n\n転機はSNS発信を始めたこと。\n記事のノウハウをXで毎日発信→フォロワー5000人→\n企業案件が来るようになった。\n\nコツは「完璧を目指さない」こと。',
  },
  {
    id: 'data', name: 'データ提示型', icon: '📊', desc: '数字の説得力でRT獲得',
    format: '知ってた？\n\n{驚きのデータ}\n\nつまり{データの意味}ということ。\n\n{自分の解釈・意見}\n\n{ハッシュタグ}',
    example: '知ってた？\n\n日本のギャンブル依存症の推定患者数は320万人。\n国民の約40人に1人。\n\nつまりクラスに1人はギャンブル依存の可能性があるということ。\n\nでも相談窓口の利用率はわずか3%。\n「自分は違う」と思ってる人が97%いる現実。',
  },
  {
    id: 'contrary', name: '逆張り型', icon: '🔄', desc: '常識を覆して注目を集める',
    format: '「{常識}」\n\n↑これ、実は間違い。\n\n{逆の事実}\n\n{根拠・理由}\n\n{ハッシュタグ}',
    example: '「早起きは三文の徳」\n\n↑これ、実は間違い。\n\n最新の睡眠研究で、\n人には遺伝的に決まった「クロノタイプ」があり、\n夜型の人が無理に早起きすると\nパフォーマンスが30%低下することが判明。\n\n自分に合った時間帯で生きよう。',
  },
  {
    id: 'listicle', name: 'リスト型', icon: '📝', desc: '保存率が高い「まとめ」形式',
    format: '{テーマ}、知っておくべき{N}つのこと\n\n①{項目1}\n②{項目2}\n③{項目3}\n④{項目4}\n⑤{項目5}\n\nどれが一番意外だった？\n\n{ハッシュタグ}',
    example: '引っ越しで後悔する人の特徴、5つ\n\n①内見を1回しかしていない\n②夜の治安を確認していない\n③ゴミ捨て場を見ていない\n④壁を叩いて遮音性を確認していない\n⑤退去費用の条件を読んでいない\n\nどれが一番意外だった？',
  },
  {
    id: 'before-after', name: 'ビフォーアフター型', icon: '✨', desc: '変化のストーリーで惹きつける',
    format: '【Before】\n{以前の状態}\n\n↓ {きっかけ}\n\n【After】\n{現在の状態}\n\n{学び・メッセージ}\n\n{ハッシュタグ}',
    example: '【Before】\nSNSフォロワー200人。投稿しても「いいね」3件。\n\n↓ バズる投稿の型を学んだ\n\n【After】\nフォロワー8000人。平均「いいね」150件。\n月2件の企業案件。\n\n変えたのは「投稿の型」だけ。内容は同じ。',
  },
  {
    id: 'thread', name: 'スレッド導入型', icon: '🧵', desc: '「続きが気になる」で最後まで読ませる',
    format: '{衝撃の結論}。\n\nでもこれ、理由があるんです。\n\n以下、{テーマ}について{N}つのポイント 🧵👇\n\n{ハッシュタグ}',
    example: '転職して年収が200万円上がった。\n\nでもこれ、スキルは関係なかった。\n\n以下、「年収が上がる転職」について5つのポイント 🧵👇',
  },
  {
    id: 'quote', name: '名言引用型', icon: '💬', desc: '名言×自分の解釈で深みを出す',
    format: '「{名言}」\n— {誰の言葉}\n\n{自分なりの解釈}\n\n{今の時代に当てはめると}\n\n{ハッシュタグ}',
    example: '「未来を予測する最善の方法は、自分で創ることだ」\n— アラン・ケイ\n\nこの言葉、AIの時代にこそ刺さる。\n\nAIに仕事を奪われるか、AIで仕事を創るか。\n違いは「使う側に回れるか」だけ。',
  },
  {
    id: 'hot-take', name: '本音ぶっちゃけ型', icon: '🔥', desc: '率直さで共感と議論を呼ぶ',
    format: '正直に言うと、\n{本音}\n\n理由は{理由}。\n\n{補足・フォロー}\n\n賛否あると思うけど、みんなはどう？\n\n{ハッシュタグ}',
    example: '正直に言うと、\n「石の上にも三年」は害悪だと思ってる。\n\n理由はブラック企業の温存装置になってるから。\n\n合わない環境で3年耐えるより、\n3ヶ月で見切って次に行くほうが\n人生トータルでは得をする。\n\n賛否あると思うけど、みんなはどう？',
  },
]

const hashtagCategories = [
  {
    name: 'ビジネス・副業', tags: ['#副業', '#フリーランス', '#起業', '#独立', '#個人事業主', '#副業初心者', '#稼ぐ力', '#ビジネス', '#マーケティング', '#SNS集客', '#ブランディング', '#コンテンツビジネス'],
  },
  {
    name: 'AI・テクノロジー', tags: ['#AI', '#ChatGPT', '#生成AI', '#AIツール', '#テクノロジー', '#DX', '#プログラミング', '#エンジニア', '#IT', '#デジタル', '#Web3', '#自動化'],
  },
  {
    name: 'ライフハック', tags: ['#ライフハック', '#時短', '#効率化', '#生産性', '#習慣', '#読書', '#自己投資', '#朝活', '#ルーティン', '#ミニマリスト', '#断捨離', '#整理整頓'],
  },
  {
    name: '健康・美容', tags: ['#健康', '#筋トレ', '#ダイエット', '#メンタルヘルス', '#睡眠', '#ストレス', '#ヨガ', '#ランニング', '#食事管理', '#美容', '#スキンケア', '#セルフケア'],
  },
  {
    name: '育児・家族', tags: ['#育児', '#子育て', '#ワーママ', '#パパ育児', '#知育', '#教育', '#家族', '#共働き', '#保活', '#小学生', '#中学受験', '#PTA'],
  },
  {
    name: '料理・グルメ', tags: ['#料理', '#レシピ', '#時短レシピ', '#作り置き', '#お弁当', '#カフェ', '#グルメ', '#おうちごはん', '#料理好き', '#食べ歩き', '#スイーツ', '#ランチ'],
  },
  {
    name: '旅行・おでかけ', tags: ['#旅行', '#国内旅行', '#海外旅行', '#温泉', '#ホテル', '#観光', '#おでかけ', '#カメラ', '#風景', '#旅行好き', '#一人旅', '#週末旅行'],
  },
  {
    name: 'トレンド・話題', tags: ['#今日のニュース', '#トレンド', '#話題', '#注目', '#速報', '#まとめ', '#考察', '#解説', '#わかりやすく', '#知っておきたい', '#拡散希望', '#シェア'],
  },
]

const timingData = [
  { day: '月', slots: [{ time: '7-8時', score: 70 }, { time: '12-13時', score: 85 }, { time: '18-19時', score: 75 }, { time: '21-22時', score: 80 }] },
  { day: '火', slots: [{ time: '7-8時', score: 75 }, { time: '12-13時', score: 90 }, { time: '18-19時', score: 80 }, { time: '21-22時', score: 85 }] },
  { day: '水', slots: [{ time: '7-8時', score: 70 }, { time: '12-13時', score: 85 }, { time: '18-19時', score: 75 }, { time: '21-22時', score: 80 }] },
  { day: '木', slots: [{ time: '7-8時', score: 75 }, { time: '12-13時', score: 85 }, { time: '18-19時', score: 80 }, { time: '21-22時', score: 85 }] },
  { day: '金', slots: [{ time: '7-8時', score: 65 }, { time: '12-13時', score: 80 }, { time: '18-19時', score: 85 }, { time: '21-22時', score: 95 }] },
  { day: '土', slots: [{ time: '9-10時', score: 80 }, { time: '12-13時', score: 75 }, { time: '15-16時', score: 70 }, { time: '21-22時', score: 90 }] },
  { day: '日', slots: [{ time: '9-10時', score: 85 }, { time: '12-13時', score: 80 }, { time: '15-16時', score: 75 }, { time: '20-21時', score: 85 }] },
]

const personas = [
  { id: 'business', name: '副業・ビジネス系', icon: '💼', style: 'プロフェッショナルかつ実践的。数字と結果で語る。' },
  { id: 'engineer', name: 'エンジニア・IT系', icon: '💻', style: '技術的な知見を平易に解説。ユーモアを交えて。' },
  { id: 'lifestyle', name: 'ライフスタイル系', icon: '✨', style: '日常の発見を共有。共感と「いいな」を誘う。' },
  { id: 'mama', name: 'ママ・育児系', icon: '👩‍👧', style: '育児あるあるに共感。時短・効率化のTips多め。' },
  { id: 'health', name: '健康・美容系', icon: '💪', style: '科学的根拠ベース。ストイックすぎない実践的アドバイス。' },
]

// ─── Component ───────────────────────────────────────────
export default function BuzzWriter() {
  const [activeTab, setActiveTab] = useState<'news' | 'template' | 'score' | 'hashtag' | 'image' | 'timing'>('news')

  // News state
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Score state
  const [draftText, setDraftText] = useState('')
  const [buzzScore, setBuzzScore] = useState<BuzzScore | null>(null)

  // Image state
  const [imageText, setImageText] = useState('')
  const [imageStyle, setImageStyle] = useState<'quote' | 'data' | 'compare'>('quote')
  const [imageAuthor, setImageAuthor] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Persona
  const [selectedPersona, setSelectedPersona] = useState('business')

  const tabs = [
    { id: 'news' as const, label: '📰 トレンドニュース' },
    { id: 'template' as const, label: '📝 テンプレート' },
    { id: 'score' as const, label: '🔥 バズ度診断' },
    { id: 'hashtag' as const, label: '#️⃣ ハッシュタグ' },
    { id: 'image' as const, label: '🖼️ 画像生成' },
    { id: 'timing' as const, label: '📊 投稿タイミング' },
  ]

  // Fetch news
  const fetchNews = useCallback(async () => {
    setNewsLoading(true)
    try {
      const res = await fetch('/api/trending-news')
      const data = await res.json()
      setNews(data.news || [])
    } catch {
      setNews([])
    }
    setNewsLoading(false)
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  // Buzz score calculation
  const calcBuzzScore = useCallback(() => {
    if (!draftText.trim()) return
    const text = draftText.trim()
    const charCount = text.length
    const lines = text.split('\n').filter(l => l.trim())
    const hashtags = (text.match(/#\S+/g) || []).length
    const hasEmoji = /[\uD83C-\uD83E]/.test(text)
    const hasQuestion = text.includes('？') || text.includes('?')
    const hasExclamation = text.includes('！') || text.includes('!')
    const hasLineBreaks = lines.length >= 3

    // Character score (sweet spot: 100-200 chars)
    let charScore = 0
    if (charCount >= 100 && charCount <= 200) charScore = 95
    else if (charCount >= 80 && charCount <= 280) charScore = 80
    else if (charCount >= 50 && charCount <= 400) charScore = 60
    else charScore = 40

    // Hook score (first line)
    let hookScore = 50
    const firstLine = lines[0] || ''
    if (firstLine.length <= 30) hookScore += 15 // concise hook
    if (/[！!？?]/.test(firstLine)) hookScore += 10
    if (/[\uD83C-\uD83E]/.test(firstLine)) hookScore += 5
    if (/知ってた|実は|正直|衝撃|ヤバい|驚き|まさか/.test(firstLine)) hookScore += 15
    hookScore = Math.min(100, hookScore)

    // Emotion score
    let emotionScore = 50
    if (hasQuestion) emotionScore += 15
    if (hasExclamation) emotionScore += 10
    if (hasEmoji) emotionScore += 10
    if (/みんな|あなた|共感|わかる/.test(text)) emotionScore += 10
    emotionScore = Math.min(100, emotionScore)

    // Hashtag score
    let hashtagScore = 0
    if (hashtags >= 2 && hashtags <= 5) hashtagScore = 90
    else if (hashtags === 1) hashtagScore = 60
    else if (hashtags > 5) hashtagScore = 50
    else hashtagScore = 30

    // Readability
    let readability = 50
    if (hasLineBreaks) readability += 20
    if (lines.every(l => l.length <= 40)) readability += 15
    if (text.includes('\n\n')) readability += 10
    readability = Math.min(100, readability)

    const total = Math.round((charScore * 0.2 + hookScore * 0.3 + emotionScore * 0.2 + hashtagScore * 0.15 + readability * 0.15))

    const tips: string[] = []
    if (charScore < 70) tips.push(charCount < 100 ? '💡 もう少し内容を追加（100〜200文字が最適）' : '💡 長すぎるかも。最も伝えたいことに絞って')
    if (hookScore < 70) tips.push('💡 1行目をもっとキャッチーに。「知ってた？」「実は」「正直に言うと」で始めてみて')
    if (!hasQuestion) tips.push('💡 最後に「みんなはどう思う？」を追加するとリプが増える')
    if (hashtags === 0) tips.push('💡 ハッシュタグを2〜5個追加しよう（発見されやすくなる）')
    if (!hasLineBreaks) tips.push('💡 改行を増やして読みやすく。3〜4行ごとに空行を入れて')
    if (!hasEmoji) tips.push('💡 絵文字を1〜2個追加すると目を引く')

    setBuzzScore({ total, charScore, hookScore, emotionScore, hashtagScore, readability, tips })
  }, [draftText])

  // Image generation with Canvas
  const generateImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageText.trim()) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 1200
    canvas.height = 675

    if (imageStyle === 'quote') {
      // Quote card style
      const gradient = ctx.createLinearGradient(0, 0, 1200, 675)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1200, 675)

      // Decorative line
      ctx.strokeStyle = '#e94560'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(100, 150)
      ctx.lineTo(300, 150)
      ctx.stroke()

      // Quote mark
      ctx.fillStyle = '#e94560'
      ctx.font = 'bold 80px serif'
      ctx.fillText('❝', 100, 130)

      // Main text
      ctx.fillStyle = '#ffffff'
      ctx.font = '32px sans-serif'
      const words = imageText.split('')
      let line = ''
      let y = 250
      for (const char of words) {
        const testLine = line + char
        if (ctx.measureText(testLine).width > 900 || char === '\n') {
          ctx.fillText(line, 150, y)
          line = char === '\n' ? '' : char
          y += 50
        } else {
          line = testLine
        }
      }
      if (line) ctx.fillText(line, 150, y)

      // Author
      if (imageAuthor) {
        ctx.fillStyle = '#a0a0a0'
        ctx.font = '24px sans-serif'
        ctx.fillText(`— ${imageAuthor}`, 150, y + 80)
      }

      // Branding
      ctx.fillStyle = '#555'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('NextraLabs', 1100, 640)
      ctx.textAlign = 'left'
    } else if (imageStyle === 'data') {
      // Data card style
      const gradient = ctx.createLinearGradient(0, 0, 0, 675)
      gradient.addColorStop(0, '#0f3460')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1200, 675)

      // Title bar
      ctx.fillStyle = '#e94560'
      ctx.fillRect(0, 0, 1200, 80)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText('📊 データで見る事実', 40, 52)

      // Main text
      ctx.fillStyle = '#ffffff'
      ctx.font = '36px sans-serif'
      const lines = imageText.split('\n')
      lines.forEach((l, i) => {
        ctx.fillText(l, 80, 180 + i * 60)
      })

      // Branding
      ctx.fillStyle = '#555'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('NextraLabs', 1100, 640)
      ctx.textAlign = 'left'
    } else {
      // Comparison style
      const gradient = ctx.createLinearGradient(0, 0, 1200, 0)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(0.5, '#16213e')
      gradient.addColorStop(1, '#1a1a2e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1200, 675)

      // Divider
      ctx.strokeStyle = '#e94560'
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(600, 80)
      ctx.lineTo(600, 595)
      ctx.stroke()
      ctx.setLineDash([])

      // VS badge
      ctx.fillStyle = '#e94560'
      ctx.beginPath()
      ctx.arc(600, 337, 35, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('VS', 600, 345)

      // Headers
      ctx.font = 'bold 28px sans-serif'
      ctx.fillStyle = '#4ecca3'
      ctx.fillText('Before', 300, 60)
      ctx.fillStyle = '#e94560'
      ctx.fillText('After', 900, 60)

      // Content
      ctx.font = '24px sans-serif'
      ctx.fillStyle = '#ddd'
      const parts = imageText.split('vs')
      if (parts[0]) {
        parts[0].trim().split('\n').forEach((l, i) => ctx.fillText(l, 300, 160 + i * 45))
      }
      if (parts[1]) {
        parts[1].trim().split('\n').forEach((l, i) => ctx.fillText(l, 900, 160 + i * 45))
      }
      ctx.textAlign = 'left'

      // Branding
      ctx.fillStyle = '#555'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('NextraLabs', 1100, 640)
      ctx.textAlign = 'left'
    }
  }, [imageText, imageStyle, imageAuthor])

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `buzz-image-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">🔥</div>
          <h1 className="text-2xl font-bold">AIバズ文章コーチ</h1>
          <p className="text-gray-400 mt-1">トレンドニュース × テンプレート × 画像生成</p>
          {/* Persona selector */}
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {personas.map(p => (
              <button key={p.id} onClick={() => setSelectedPersona(p.id)}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${selectedPersona === p.id ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-[#1a1a2e] text-gray-500 border border-gray-700'}`}>
                {p.icon} {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ─── News Tab ─── */}
        {activeTab === 'news' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">📰 今日のトレンドニュース</h2>
              <button onClick={fetchNews} disabled={newsLoading}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                {newsLoading ? '取得中...' : '🔄 更新'}
              </button>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-sm text-orange-300">
              💡 ニュースをタップ → テンプレートを選択 → 自分の切り口で投稿文を作成。ネタ元にするだけで、パクリではありません。
            </div>

            {news.length > 0 ? (
              <div className="space-y-3">
                {news.map((item, i) => (
                  <div key={i}
                    onClick={() => { setSelectedNews(item); setActiveTab('template') }}
                    className={`bg-[#13131e] rounded-xl border p-4 cursor-pointer transition-all hover:border-orange-500/50 ${selectedNews?.title === item.title ? 'border-orange-500/50' : 'border-gray-800'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{item.category}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">→ テンプレへ</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-8 text-center text-gray-500">
                {newsLoading ? '⏳ ニュースを取得中...' : 'ニュースを取得できませんでした。「更新」ボタンを押してみてください。'}
              </div>
            )}
          </div>
        )}

        {/* ─── Template Tab ─── */}
        {activeTab === 'template' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📝 バズ投稿テンプレート（10パターン）</h2>
            {selectedNews && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <div className="text-xs text-orange-400 mb-1">📰 選択中のニュース:</div>
                <div className="text-sm font-medium">{selectedNews.title}</div>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {templates.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(selectedTemplate === t.id ? null : t.id)}
                  className={`p-3 rounded-xl border text-center text-sm transition-all ${selectedTemplate === t.id ? 'bg-orange-500/10 border-orange-500/50' : 'bg-[#13131e] border-gray-800 hover:border-gray-600'}`}>
                  <div className="text-xl">{t.icon}</div>
                  <div className="font-medium mt-1">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
            {selectedTemplate && (() => {
              const t = templates.find(x => x.id === selectedTemplate)!
              return (
                <div className="space-y-4">
                  <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                    <h3 className="font-bold mb-3">{t.icon} {t.name}テンプレート</h3>
                    <pre className="text-sm text-amber-300 whitespace-pre-wrap font-sans bg-[#1a1a2e] rounded-lg p-4">{t.format}</pre>
                    <button onClick={() => navigator.clipboard.writeText(t.format)}
                      className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition-colors">📋 テンプレをコピー</button>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-blue-500/30 p-6">
                    <h3 className="font-bold mb-3 text-blue-400">📖 使用例</h3>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-[#1a1a2e] rounded-lg p-4">{t.example}</pre>
                    <button onClick={() => { setDraftText(t.example); setActiveTab('score') }}
                      className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">🔥 この例でバズ度を診断</button>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ─── Score Tab ─── */}
        {activeTab === 'score' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🔥 バズ度診断</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <textarea value={draftText} onChange={e => setDraftText(e.target.value)}
                placeholder="投稿の下書きを入力してください..."
                rows={8}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:outline-none resize-none" />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{draftText.length}文字</span>
                <button onClick={calcBuzzScore} disabled={!draftText.trim()}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 rounded-lg text-sm font-medium transition-colors">診断する</button>
              </div>
            </div>

            {buzzScore && (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${buzzScore.total >= 80 ? 'border-green-500/30' : buzzScore.total >= 60 ? 'border-orange-500/30' : 'border-red-500/30'}`}>
                  <div className="text-sm text-gray-400 mb-2">バズ度スコア</div>
                  <div className={`text-6xl font-bold ${buzzScore.total >= 80 ? 'text-green-400' : buzzScore.total >= 60 ? 'text-orange-400' : 'text-red-400'}`}>{buzzScore.total}点</div>
                  <div className="text-sm mt-2 text-gray-400">{buzzScore.total >= 80 ? '🔥 バズりポテンシャル高！' : buzzScore.total >= 60 ? '👍 いい感じ。もう少しブラッシュアップを' : '📚 改善の余地あり。下のアドバイスを参考に'}</div>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-4">📊 詳細スコア</h3>
                  {[
                    { name: '文字数', score: buzzScore.charScore, desc: '100〜200文字が最適' },
                    { name: 'フック度', score: buzzScore.hookScore, desc: '1行目のインパクト' },
                    { name: '感情喚起', score: buzzScore.emotionScore, desc: '読者の感情を動かす力' },
                    { name: 'ハッシュタグ', score: buzzScore.hashtagScore, desc: '2〜5個が最適' },
                    { name: '読みやすさ', score: buzzScore.readability, desc: '改行・段落の使い方' },
                  ].map((item, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name} <span className="text-xs text-gray-500">({item.desc})</span></span>
                        <span className="text-gray-400">{item.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {buzzScore.tips.length > 0 && (
                  <div className="bg-[#13131e] rounded-xl border border-orange-500/30 p-6">
                    <h3 className="font-bold mb-3">💡 改善アドバイス</h3>
                    <ul className="space-y-2">{buzzScore.tips.map((t, i) => <li key={i} className="text-sm text-gray-400">{t}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Hashtag Tab ─── */}
        {activeTab === 'hashtag' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">#️⃣ ハッシュタグ辞典</h2>
            {hashtagCategories.map((cat, ci) => (
              <div key={ci} className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold mb-3">{cat.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((tag, ti) => (
                    <button key={ti} onClick={() => navigator.clipboard.writeText(tag)}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm hover:bg-blue-500/20 transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Image Tab ─── */}
        {activeTab === 'image' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🖼️ 投稿画像ジェネレーター</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">スタイル</label>
                <div className="flex gap-3">
                  {[
                    { id: 'quote' as const, name: '💬 名言カード' },
                    { id: 'data' as const, name: '📊 データカード' },
                    { id: 'compare' as const, name: '⚡ 比較カード' },
                  ].map(s => (
                    <button key={s.id} onClick={() => setImageStyle(s.id)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${imageStyle === s.id ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-[#1a1a2e] text-gray-500 border border-gray-700'}`}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {imageStyle === 'compare' ? 'テキスト（「vs」で左右を区切る）' : 'テキスト'}
                </label>
                <textarea value={imageText} onChange={e => setImageText(e.target.value)}
                  placeholder={imageStyle === 'compare' ? '努力型の人\n・毎日10時間勉強\n・根性で乗り切る\nvs\n戦略型の人\n・2時間で終わらせる\n・仕組みで解決する' : imageStyle === 'data' ? '日本のギャンブル依存症\n推定患者数：320万人\n国民の約40人に1人\n相談率：わずか3%' : '未来を予測する最善の方法は\n自分で創ることだ'}
                  rows={5}
                  className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:outline-none resize-none" />
              </div>
              {imageStyle === 'quote' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">著者名（任意）</label>
                  <input type="text" value={imageAuthor} onChange={e => setImageAuthor(e.target.value)}
                    placeholder="アラン・ケイ"
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none" />
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={generateImage} disabled={!imageText.trim()}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 rounded-lg text-sm font-medium transition-colors">🖼️ 生成</button>
                <button onClick={downloadImage}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">💾 ダウンロード</button>
              </div>
            </div>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4">
              <canvas ref={canvasRef} className="w-full rounded-lg" style={{ aspectRatio: '16/9' }} />
            </div>
          </div>
        )}

        {/* ─── Timing Tab ─── */}
        {activeTab === 'timing' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📊 投稿タイミングガイド</h2>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-sm text-orange-300">
              💡 一般的なエンゲージメント傾向です。自分のフォロワーの反応を見ながら最適化してください。
            </div>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-4">曜日 × 時間帯 エンゲージメントマップ</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-2 px-3 text-gray-400">曜日</th>
                      {timingData[0].slots.map((s, i) => (
                        <th key={i} className="text-center py-2 px-3 text-gray-400">{s.time}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timingData.map((day, di) => (
                      <tr key={di} className="border-b border-gray-800">
                        <td className="py-3 px-3 font-medium">{day.day}</td>
                        {day.slots.map((slot, si) => (
                          <td key={si} className="text-center py-3 px-3">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-sm font-bold ${
                              slot.score >= 90 ? 'bg-red-500/30 text-red-400' :
                              slot.score >= 80 ? 'bg-orange-500/20 text-orange-400' :
                              slot.score >= 70 ? 'bg-amber-500/15 text-amber-400' :
                              'bg-gray-500/10 text-gray-500'
                            }`}>
                              {slot.score}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500/30" />90+ 最適</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-500/20" />80+ 好適</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-500/15" />70+ 普通</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-500/10" />70未満</span>
              </div>
            </div>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-3">🎯 ペルソナ別おすすめ</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 py-2"><span className="text-lg">💼</span><div><div className="font-medium">ビジネス系</div><div className="text-sm text-gray-400">火・木の12時台、金曜21時がベスト。通勤・昼休み・帰宅後のビジネスマンに刺さる</div></div></div>
                <div className="flex items-start gap-3 py-2"><span className="text-lg">👩‍👧</span><div><div className="font-medium">ママ・育児系</div><div className="text-sm text-gray-400">平日10時台（子供を送り出した後）、21時台（寝かしつけ後）</div></div></div>
                <div className="flex items-start gap-3 py-2"><span className="text-lg">💻</span><div><div className="font-medium">エンジニア系</div><div className="text-sm text-gray-400">土日の午前中、平日22時以降。深夜帯も意外とリーチする</div></div></div>
                <div className="flex items-start gap-3 py-2"><span className="text-lg">✨</span><div><div className="font-medium">ライフスタイル系</div><div className="text-sm text-gray-400">日曜の朝（ゆっくりSNS閲覧タイム）、金曜夜（週末気分）</div></div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
