'use client'

import { useState, useCallback, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────
interface ProfileData {
  gender: '男性' | '女性'
  age: string
  occupation: string
  hobbies: string
  selfIntro: string
  idealPartner: string
}

interface ChatMessage {
  role: 'user' | 'ai'
  text: string
}

interface CompatAnswer {
  category: string
  value: number // 1-5
}

interface DatePlanInput {
  area: string
  budget: string
  partnerHobbies: string
  scene: '初デート' | '2回目以降' | '記念日'
  season: '春' | '夏' | '秋' | '冬'
}

interface ActivityStats {
  matchCount: number
  dateCount: number
  messageResponseRate: number
  profileViewCount: number
  period: string
}

// ─── Data ────────────────────────────────────────────────
const compatQuestions = [
  { id: 'q1', category: '結婚観', question: '結婚後も仕事を続けたい（続けてほしい）' },
  { id: 'q2', category: '結婚観', question: '子供がほしい' },
  { id: 'q3', category: '結婚観', question: '両親と同居してもいい' },
  { id: 'q4', category: '価値観', question: '休日はアウトドアで過ごしたい' },
  { id: 'q5', category: '価値観', question: '貯金よりも体験にお金を使いたい' },
  { id: 'q6', category: '価値観', question: '家事は完全に平等に分担すべきだ' },
  { id: 'q7', category: 'ライフスタイル', question: '朝型の生活が好き' },
  { id: 'q8', category: 'ライフスタイル', question: '友人との付き合いは多い方がいい' },
  { id: 'q9', category: 'ライフスタイル', question: 'ペットと暮らしたい' },
  { id: 'q10', category: 'コミュニケーション', question: 'LINEはすぐ返信してほしい' },
  { id: 'q11', category: 'コミュニケーション', question: '悩みは相手にすぐ相談したい' },
  { id: 'q12', category: 'コミュニケーション', question: 'スキンシップは多い方がいい' },
]

const profileTemplates: Record<string, { before: string; after: string }[]> = {
  hobbies: [
    { before: '映画鑑賞', after: '休日は隠れた名作映画を探すのが楽しみ。最近は韓国映画にハマってます🎬' },
    { before: 'カフェ巡り', after: '自家焙煎のコーヒーショップを巡るのが週末の楽しみ。おすすめのお店、教えてください☕' },
    { before: '旅行', after: '年2回は新しい場所を訪れるようにしてます。去年は直島のアート巡りが最高でした✈️' },
    { before: '料理', after: '週末は作り置きおかずを5品作るのがルーティン。最近はスパイスカレーにハマってます🍛' },
    { before: '読書', after: 'ビジネス書と小説を交互に読むスタイル。東野圭吾の新作は発売日に買う派です📚' },
    { before: 'ジム・筋トレ', after: '週3でジム通い。ベンチプレス80kgが最近の目標💪 健康的な生活を大切にしてます' },
    { before: '音楽', after: 'Spotifyのプレイリスト作りが趣味。J-POPからジャズまで何でも聴きます🎵' },
    { before: 'ゲーム', after: 'スイッチで対戦ゲームやるのが好き。一緒にマリカーできる人だと嬉しいです🎮' },
  ],
  intro: [
    { before: '優しい人が好きです', after: 'さりげない気遣いができる人に惹かれます。コンビニで「温かいお茶いる？」って聞いてくれるような方' },
    { before: '真剣に婚活してます', after: '「一緒にいて自然体でいられる人」を探してます。無理せず笑い合える関係が理想です' },
    { before: 'よろしくお願いします', after: 'まずはメッセージでゆっくりお話しできたら嬉しいです。気軽にいいね押してください😊' },
  ],
}

const messageTemplates = {
  first: [
    'はじめまして！プロフィール読んで、{hobby}が共通点だなと思っていいねしました😊',
    '{hobby}好きなんですね！僕（私）も{hobby}にハマってて…おすすめあったら教えてほしいです！',
    'プロフィールの写真、{comment}ですね！{hobby}好きなところが気になっていいねしました',
  ],
  reply: [
    'そうなんですね！{topic}って奥が深いですよね。ちなみに{question}？',
    'わかります！{topic}いいですよね。僕（私）は{myThing}が好きで…{name}さんはどうですか？',
  ],
  dateInvite: [
    'もしよければ、今度{place}あたりで{activity}しませんか？😊',
    '{topic}の話もっと聞きたいので、よかったらお茶でもどうですか？{area}あたりだとお互い行きやすいかなと',
  ],
}

const datePlans: Record<string, { name: string; flow: string; tip: string }[]> = {
  '初デート': [
    { name: 'カフェ × 散歩コース', flow: '☕ おしゃれカフェでお茶 → 🚶 近くの公園を散歩 → 🍰 スイーツで締め', tip: '初デートは2-3時間がベスト。長すぎると疲れる' },
    { name: '美術館・展覧会コース', flow: '🎨 美術館・展覧会 → ☕ 併設カフェで感想 → 🍽️ 近くのレストラン', tip: '展示物が会話のネタになるので沈黙を避けやすい' },
    { name: 'ランチデートコース', flow: '🍽️ 人気のランチスポット → ☕ 食後のカフェ → 🛍️ 周辺散策', tip: '昼間で明るいので安心感がある。お酒なしで自然体で話せる' },
  ],
  '2回目以降': [
    { name: '体験型デートコース', flow: '🎯 陶芸/ボルダリング/料理教室 → 🍽️ ディナー → 🌃 夜景スポット', tip: '共同作業で距離が一気に縮まる' },
    { name: '食べ歩きコース', flow: '🍡 商店街・横丁を食べ歩き → 🍺 気になったお店でゆっくり → 🌙 バーで仕上げ', tip: '移動しながらなので、会話が途切れても自然' },
    { name: 'アクティブデートコース', flow: '🚴 サイクリング/ハイキング → ☕ カフェで休憩 → 🍽️ ご褒美ディナー', tip: '運動後のご飯は最高に美味しい。健康志向アピールにも' },
  ],
  '記念日': [
    { name: 'プレミアムディナーコース', flow: '🎁 サプライズプレゼント → 🍽️ 予約制レストラン → 🌃 夜景ドライブ', tip: '予約は1ヶ月前がベスト。窓際席をリクエスト' },
    { name: '旅行コース', flow: '🚗 ドライブ → 🏨 温泉旅館チェックイン → 🍽️ 部屋食ディナー', tip: '非日常感が思い出を特別にする' },
    { name: 'サプライズ体験コース', flow: '🎭 観劇/コンサート → 🍰 ケーキ付きディナー → 💐 花束サプライズ', tip: 'チケットは相手の好みをリサーチして' },
  ],
}

// ─── Component ───────────────────────────────────────────
export default function AiKonkatsuCoach() {
  const [activeTab, setActiveTab] = useState<'profile' | 'message' | 'compat' | 'dateplan' | 'strategy'>('profile')

  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    gender: '男性', age: '', occupation: '', hobbies: '', selfIntro: '', idealPartner: '',
  })
  const [profileResult, setProfileResult] = useState('')

  // Message state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'こんにちは！メッセージ練習シミュレーターです💬\n\nまず練習したいシーンを選んでください：\n\n1️⃣ 初回メッセージの練習\n2️⃣ 返信の練習\n3️⃣ デートの誘い方' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatScene, setChatScene] = useState<'select' | 'first' | 'reply' | 'invite'>('select')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Compat state
  const [compatAnswers, setCompatAnswers] = useState<Record<string, number>>({})
  const [compatResult, setCompatResult] = useState<{ score: number; type: string; description: string; strengths: string[]; advice: string[] } | null>(null)

  // Date plan state
  const [datePlan, setDatePlan] = useState<DatePlanInput>({
    area: '', budget: '3000-5000', partnerHobbies: '', scene: '初デート', season: '春',
  })

  // Strategy state
  const [stats, setStats] = useState<ActivityStats>({
    matchCount: 0, dateCount: 0, messageResponseRate: 0, profileViewCount: 0, period: '1ヶ月',
  })
  const [strategyResult, setStrategyResult] = useState('')

  const tabs = [
    { id: 'profile' as const, label: '✏️ プロフィール添削' },
    { id: 'message' as const, label: '💬 メッセージ練習' },
    { id: 'compat' as const, label: '📊 相性診断' },
    { id: 'dateplan' as const, label: '🗓️ デートプラン' },
    { id: 'strategy' as const, label: '📈 婚活戦略' },
  ]

  // ─── Profile Logic ─────────────────────────────────
  const analyzeProfile = useCallback(() => {
    const results: string[] = []
    results.push('━━━ プロフィール添削結果 ━━━\n')

    // Analyze hobbies
    if (profile.hobbies) {
      results.push('【趣味の改善提案】')
      const hobbies = profile.hobbies.split(/[、,，]/).map(h => h.trim())
      hobbies.forEach(hobby => {
        const match = profileTemplates.hobbies.find(t => hobby.includes(t.before.replace(/[・]/g, '')))
        if (match) {
          results.push(`❌ Before: 「${hobby}」`)
          results.push(`✅ After:  「${match.after}」\n`)
        } else {
          results.push(`💡「${hobby}」→ 具体的なエピソードや数字を入れると魅力UP`)
          results.push(`   例: 「${hobby}が好き」→「週末は${hobby}を楽しんでます。最近は○○にハマり中」\n`)
        }
      })
    }

    // Analyze self intro
    if (profile.selfIntro) {
      results.push('【自己紹介の改善提案】')
      let improved = false
      profileTemplates.intro.forEach(t => {
        if (profile.selfIntro.includes(t.before)) {
          results.push(`❌ Before: 「${t.before}」`)
          results.push(`✅ After:  「${t.after}」\n`)
          improved = true
        }
      })
      if (!improved) {
        results.push('✅ 基本的な内容はOKです！さらに良くするポイント：')
        results.push('  ・具体的なエピソードを1つ追加する')
        results.push('  ・「一緒に○○したい」で締めると、デートのイメージが湧きやすい')
        results.push('  ・絵文字を1-2個添えると親しみやすさUP\n')
      }
    }

    // General tips
    results.push('【プロフィール全体のスコア】')
    let score = 50
    if (profile.hobbies.length > 10) score += 10
    if (profile.selfIntro.length > 50) score += 15
    if (profile.selfIntro.includes('！') || profile.selfIntro.includes('😊')) score += 5
    if (profile.idealPartner.length > 20) score += 10
    if (profile.occupation) score += 10
    score = Math.min(score, 100)

    const bar = '█'.repeat(Math.floor(score / 5)) + '░'.repeat(20 - Math.floor(score / 5))
    results.push(`[${bar}] ${score}/100点\n`)

    if (score < 70) {
      results.push('💡 改善ポイント：')
      if (profile.selfIntro.length < 50) results.push('  ・自己紹介を100文字以上に（現在: ' + profile.selfIntro.length + '文字）')
      if (!profile.idealPartner) results.push('  ・理想の相手像を書くとマッチング精度UP')
      if (profile.hobbies.split(/[、,]/).length < 3) results.push('  ・趣味は3つ以上書くと話題が広がりやすい')
    }

    results.push('\n💒 プロの添削を受けたい方は → marriage-road.jp')

    setProfileResult(results.join('\n'))
  }, [profile])

  // ─── Message Logic ─────────────────────────────────
  const handleChat = useCallback(() => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')

    const newMessages: ChatMessage[] = [{ role: 'user', text: userMsg }]

    if (chatScene === 'select') {
      if (userMsg.includes('1') || userMsg.includes('初回')) {
        newMessages.push({ role: 'ai', text: '初回メッセージの練習ですね！\n\n相手のプロフィールにある趣味を1つ教えてください。\n（例: カフェ巡り、映画鑑賞、旅行...）' })
        setChatScene('first')
      } else if (userMsg.includes('2') || userMsg.includes('返信')) {
        newMessages.push({ role: 'ai', text: '返信の練習ですね！\n\n相手から来たメッセージを入力してください。\nそれに対する返信をアドバイスします！' })
        setChatScene('reply')
      } else if (userMsg.includes('3') || userMsg.includes('デート') || userMsg.includes('誘')) {
        newMessages.push({ role: 'ai', text: 'デートの誘い方ですね！\n\n相手と何の話で盛り上がっていますか？\n（例: カフェの話、映画の話、旅行の話...）' })
        setChatScene('invite')
      } else {
        newMessages.push({ role: 'ai', text: '番号で選んでください😊\n\n1️⃣ 初回メッセージの練習\n2️⃣ 返信の練習\n3️⃣ デートの誘い方' })
      }
    } else if (chatScene === 'first') {
      const templates = messageTemplates.first.map(t => t.replace('{hobby}', userMsg).replace('{comment}', 'すごく楽しそう'))
      const response = `良いですね！「${userMsg}」を使った初回メッセージの例：\n\n${templates.map((t, i) => `${i + 1}. 「${t}」`).join('\n\n')}\n\n💡 ポイント：\n・共通点をアピール\n・質問で終わると返信率UP\n・絵文字は1-2個が◎（多すぎるとチャラい印象に）\n\n別の趣味で試す場合はそのまま入力してください。\n最初の選択に戻るには「戻る」と入力。`
      newMessages.push({ role: 'ai', text: response })
      if (userMsg === '戻る') setChatScene('select')
    } else if (chatScene === 'reply') {
      const response = `相手のメッセージ：「${userMsg}」\n\n📝 返信のポイント：\n\n1. 共感 → 「わかります！」「いいですね！」で受け止める\n2. 自分の話を少し → 相手の話題に関連した自分の経験\n3. 質問で返す → 会話のキャッチボールを続ける\n\n💡 返信例：\n「${userMsg.slice(0, 10)}…って素敵ですね！僕（私）も実は興味があって…おすすめとかありますか？」\n\n⚠️ NGポイント：\n・「へー」「そうなんだ」だけの返信\n・自分の話ばかりする\n・既読から返信まで何日も空ける\n\n別のメッセージで練習する場合はそのまま入力！\n「戻る」で最初に戻ります。`
      newMessages.push({ role: 'ai', text: response })
      if (userMsg === '戻る') setChatScene('select')
    } else if (chatScene === 'invite') {
      const templates = messageTemplates.dateInvite.map(t =>
        t.replace('{topic}', userMsg).replace('{place}', '駅前').replace('{activity}', 'お茶').replace('{area}', 'このあたり')
      )
      const response = `「${userMsg}」で盛り上がってるんですね！\n\nデートの誘い方例：\n\n${templates.map((t, i) => `${i + 1}. 「${t}」`).join('\n\n')}\n\n💡 成功率を上げるポイント：\n・具体的な場所と日時を提案する\n・「もしよければ」でワンクッション\n・断りやすい雰囲気も大切（「忙しかったら全然大丈夫です！」）\n・昼デートの方がOKされやすい\n\n「戻る」で最初に戻ります。`
      newMessages.push({ role: 'ai', text: response })
      if (userMsg === '戻る') setChatScene('select')
    }

    setChatMessages(prev => [...prev, ...newMessages])
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [chatInput, chatScene])

  // ─── Compat Logic ──────────────────────────────────
  const calcCompat = useCallback(() => {
    const answered = Object.keys(compatAnswers).length
    if (answered < compatQuestions.length) return

    const categories: Record<string, number[]> = {}
    compatQuestions.forEach(q => {
      if (!categories[q.category]) categories[q.category] = []
      categories[q.category].push(compatAnswers[q.id] || 3)
    })

    const avgByCategory = Object.entries(categories).map(([cat, vals]) => ({
      category: cat,
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
    }))

    // Determine personality type
    const totalAvg = avgByCategory.reduce((a, b) => a + b.avg, 0) / avgByCategory.length
    let type = ''
    let description = ''
    const strengths: string[] = []
    const advice: string[] = []

    if (totalAvg >= 4) {
      type = '💖 アクティブ・パートナーシップ型'
      description = '積極的で、パートナーと多くのことを共有したいタイプ。一緒に成長していく関係を重視。'
      strengths.push('コミュニケーション力が高い', '行動力がある', '相手への関心が強い')
      advice.push('相手のペースも尊重する', '一人の時間も大切にする')
    } else if (totalAvg >= 3) {
      type = '🌿 バランス・ハーモニー型'
      description = 'バランスの取れた考え方の持ち主。お互いの意見を尊重しながら、穏やかな関係を築ける。'
      strengths.push('柔軟性がある', '相手に合わせられる', '安定した関係を築ける')
      advice.push('自分の意見ももっと伝える', '妥協しすぎないよう注意')
    } else {
      type = '🏔️ 独立・リスペクト型'
      description = '個人の時間やスペースを大切にするタイプ。お互いの自立を尊重する関係が理想。'
      strengths.push('自立している', '相手に依存しない', 'クールで安定している')
      advice.push('感情をもう少しオープンに', '相手からの愛情表現にも応える')
    }

    const score = Math.round(totalAvg * 20)

    setCompatResult({ score, type, description, strengths, advice })
  }, [compatAnswers])

  // ─── Strategy Logic ────────────────────────────────
  const analyzeStrategy = useCallback(() => {
    const results: string[] = []
    results.push('━━━ 婚活戦略分析レポート ━━━\n')

    const { matchCount, dateCount, messageResponseRate, profileViewCount, period } = stats

    // Match rate analysis
    if (profileViewCount > 0 && matchCount > 0) {
      const matchRate = (matchCount / profileViewCount * 100).toFixed(1)
      results.push(`📊 マッチング率: ${matchRate}%`)
      if (Number(matchRate) < 5) {
        results.push('  → ⚠️ 平均以下。プロフィール写真と自己紹介の改善が急務')
        results.push('  → 💡 プロフィール添削タブで改善しましょう\n')
      } else if (Number(matchRate) < 15) {
        results.push('  → 👍 平均的。さらに上を目指すなら写真の質を上げましょう\n')
      } else {
        results.push('  → 🎉 優秀！プロフィールの魅力が伝わっています\n')
      }
    }

    // Date conversion
    if (matchCount > 0) {
      const dateRate = (dateCount / matchCount * 100).toFixed(1)
      results.push(`📊 デート実現率: ${dateRate}%（${matchCount}マッチ → ${dateCount}デート）`)
      if (Number(dateRate) < 10) {
        results.push('  → ⚠️ メッセージからデートへの誘導が課題')
        results.push('  → 💡 メッセージ練習タブで「デートの誘い方」を練習！')
        results.push('  → 💡 マッチ後3日以内にデートを提案するのが黄金ルール\n')
      } else if (Number(dateRate) < 30) {
        results.push('  → 👍 悪くないですが改善の余地あり')
        results.push('  → 💡 具体的な日時と場所を提案すると実現率UP\n')
      } else {
        results.push('  → 🎉 素晴らしい！メッセージ力が高いです\n')
      }
    }

    // Response rate
    results.push(`📊 メッセージ返信率: ${messageResponseRate}%`)
    if (messageResponseRate < 30) {
      results.push('  → ⚠️ 初回メッセージの質を改善しましょう')
      results.push('  → 💡 テンプレ感のないメッセージが鍵。相手のプロフィールに触れること\n')
    } else if (messageResponseRate < 60) {
      results.push('  → 👍 平均的。個別化したメッセージでさらにUP\n')
    } else {
      results.push('  → 🎉 高い返信率！メッセージのセンスが良いです\n')
    }

    // Action plan
    results.push('━━━ アクションプラン ━━━\n')
    results.push(`📅 ${period}の活動量を基にした改善プラン：\n`)

    const actions: string[] = []
    if (profileViewCount < 50) actions.push('1. プロフィール写真を3枚以上に増やす（メイン + サブ2枚）')
    if (matchCount < 5) actions.push('2. いいね数を増やす（1日10件目標）。ログインボーナスも忘れずに')
    if (messageResponseRate < 50) actions.push('3. 初回メッセージを個別化する（テンプレ禁止！）')
    if (dateCount === 0) actions.push('4. マッチ後3日以内に「お茶しませんか？」を送る')

    if (actions.length === 0) {
      actions.push('👏 全体的に良い数字です！今のペースを維持しましょう')
      actions.push('💡 さらに上を目指すなら、結婚相談所との併用も検討を')
    }

    results.push(actions.join('\n'))
    results.push('\n\n💒 プロのアドバイスが必要な方は → marriage-road.jp')

    setStrategyResult(results.join('\n'))
  }, [stats])

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl mb-2">💕</div>
              <h1 className="text-2xl font-bold">AI婚活コーチ</h1>
              <p className="text-gray-400 mt-1">プロフィール添削 × メッセージ練習 × 相性診断</p>
            </div>
            <a
              href="https://www.marriage-road.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-sm font-medium transition-colors"
            >
              💒 マレッジロードジャパン
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ─── Profile Tab ─── */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">✏️ プロフィール添削AI</h2>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">性別</label>
                    <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value as any }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                      <option>男性</option><option>女性</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">年齢</label>
                    <input type="text" placeholder="32" value={profile.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">職業</label>
                  <input type="text" placeholder="IT企業勤務" value={profile.occupation} onChange={e => setProfile(p => ({ ...p, occupation: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">趣味（カンマ区切り）</label>
                  <input type="text" placeholder="映画鑑賞、カフェ巡り、旅行" value={profile.hobbies} onChange={e => setProfile(p => ({ ...p, hobbies: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">自己紹介文</label>
                  <textarea placeholder="プロフィールに書いている自己紹介をそのまま貼り付けてください" value={profile.selfIntro} onChange={e => setProfile(p => ({ ...p, selfIntro: e.target.value }))} rows={4} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">理想の相手像</label>
                  <textarea placeholder="どんな方と出会いたいですか？" value={profile.idealPartner} onChange={e => setProfile(p => ({ ...p, idealPartner: e.target.value }))} rows={2} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none resize-none" />
                </div>
                <button onClick={analyzeProfile} className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
                  ✨ AIで添削する
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">添削結果</h2>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 min-h-[400px]">
                {profileResult ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">{profileResult}</pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    <p>左のフォームに入力して「AIで添削する」をクリック</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Message Tab ─── */}
        {activeTab === 'message' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold">💬 メッセージ練習シミュレーター</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 h-[500px] overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-pink-600 text-white rounded-br-none'
                      : 'bg-[#1a1a2e] text-gray-300 rounded-bl-none'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="メッセージを入力..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-pink-500 focus:outline-none"
              />
              <button onClick={handleChat} className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
                送信
              </button>
            </div>
          </div>
        )}

        {/* ─── Compat Tab ─── */}
        {activeTab === 'compat' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📊 相性診断・理想の相手像分析</h2>
            <p className="text-gray-400 text-sm">以下の質問に1（全くそう思わない）〜5（とてもそう思う）で回答してください</p>

            {!compatResult ? (
              <>
                {['結婚観', '価値観', 'ライフスタイル', 'コミュニケーション'].map(category => (
                  <div key={category}>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h3>
                    <div className="space-y-3">
                      {compatQuestions.filter(q => q.category === category).map(q => (
                        <div key={q.id} className="bg-[#13131e] rounded-xl border border-gray-800 p-4">
                          <p className="text-sm mb-3">{q.question}</p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(n => (
                              <button
                                key={n}
                                onClick={() => setCompatAnswers(prev => ({ ...prev, [q.id]: n }))}
                                className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                                  compatAnswers[q.id] === n
                                    ? 'bg-pink-600 text-white scale-110'
                                    : 'bg-[#1a1a2e] text-gray-500 hover:bg-gray-700'
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
                            <span>そう思わない</span><span>そう思う</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={calcCompat}
                  disabled={Object.keys(compatAnswers).length < compatQuestions.length}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    Object.keys(compatAnswers).length >= compatQuestions.length
                      ? 'bg-pink-600 hover:bg-pink-700'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  診断する（{Object.keys(compatAnswers).length}/{compatQuestions.length}問回答済み）
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#13131e] rounded-xl border border-pink-500/30 p-8 text-center">
                  <div className="text-6xl font-bold text-pink-400 mb-2">{compatResult.score}%</div>
                  <div className="text-2xl font-bold mb-2">{compatResult.type}</div>
                  <p className="text-gray-400">{compatResult.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#13131e] rounded-xl border border-green-500/30 p-6">
                    <h3 className="font-bold text-green-400 mb-3">✅ あなたの強み</h3>
                    <ul className="space-y-2">
                      {compatResult.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2"><span className="text-green-400">•</span> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-amber-500/30 p-6">
                    <h3 className="font-bold text-amber-400 mb-3">💡 アドバイス</h3>
                    <ul className="space-y-2">
                      {compatResult.advice.map((a, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2"><span className="text-amber-400">•</span> {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button onClick={() => { setCompatResult(null); setCompatAnswers({}) }} className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">
                  もう一度診断する
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Date Plan Tab ─── */}
        {activeTab === 'dateplan' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">🗓️ デートプランAI</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">シーン</label>
                  <select value={datePlan.scene} onChange={e => setDatePlan(p => ({ ...p, scene: e.target.value as any }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                    <option>初デート</option><option>2回目以降</option><option>記念日</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">エリア</label>
                  <input type="text" placeholder="横浜、渋谷、新宿..." value={datePlan.area} onChange={e => setDatePlan(p => ({ ...p, area: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">予算</label>
                  <select value={datePlan.budget} onChange={e => setDatePlan(p => ({ ...p, budget: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                    <option value="1000-3000">¥1,000〜3,000</option>
                    <option value="3000-5000">¥3,000〜5,000</option>
                    <option value="5000-10000">¥5,000〜10,000</option>
                    <option value="10000+">¥10,000〜</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(datePlans[datePlan.scene] || datePlans['初デート']).map((plan, i) => (
                <div key={i} className="bg-[#13131e] rounded-xl border border-gray-800 p-6 hover:border-pink-500/30 transition-colors">
                  <div className="text-2xl mb-3">{'🅰️🅱️🅲️'[i] || '📍'}</div>
                  <h3 className="font-bold text-lg mb-3">{plan.name}</h3>
                  <div className="text-sm text-gray-400 mb-4 space-y-1">
                    {plan.flow.split(' → ').map((step, j) => (
                      <p key={j}>{j > 0 ? '↓ ' : ''}{step}</p>
                    ))}
                  </div>
                  <div className="bg-amber-500/10 rounded-lg p-3 text-xs text-amber-300">
                    💡 {plan.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Strategy Tab ─── */}
        {activeTab === 'strategy' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📈 婚活戦略コーチ</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">プロフィール閲覧数</label>
                  <input type="number" placeholder="100" value={stats.profileViewCount || ''} onChange={e => setStats(s => ({ ...s, profileViewCount: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">マッチ数</label>
                  <input type="number" placeholder="10" value={stats.matchCount || ''} onChange={e => setStats(s => ({ ...s, matchCount: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">メッセージ返信率（%）</label>
                  <input type="number" placeholder="40" value={stats.messageResponseRate || ''} onChange={e => setStats(s => ({ ...s, messageResponseRate: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">デート実現数</label>
                  <input type="number" placeholder="2" value={stats.dateCount || ''} onChange={e => setStats(s => ({ ...s, dateCount: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">集計期間</label>
                <select value={stats.period} onChange={e => setStats(s => ({ ...s, period: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                  <option>1週間</option><option>1ヶ月</option><option>3ヶ月</option><option>6ヶ月</option>
                </select>
              </div>
              <button onClick={analyzeStrategy} className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
                📊 戦略を分析する
              </button>
            </div>

            {strategyResult && (
              <div className="bg-[#13131e] rounded-xl border border-pink-500/30 p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">{strategyResult}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-800 bg-[#0f0f1a] py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-2">本格的なサポートが必要な方へ</p>
          <a
            href="https://www.marriage-road.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium transition-colors"
          >
            💒 結婚相談所 マレッジロードジャパン →
          </a>
        </div>
      </div>
    </div>
  )
}
