'use client'

import { useState, useEffect } from 'react'

// ==================== TYPES ====================
type Tab = 'review' | 'psychology' | 'diagnosis' | 'planner' | 'examples' | 'support'
type Scene = 'romance' | 'business' | 'friend' | 'sns'

interface DiagnosisAnswer {
  questionIndex: number
  value: number
}

// ==================== DATA ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'review', icon: '💬', label: 'メッセージ添削' },
  { id: 'psychology', icon: '🧠', label: '心理学講座' },
  { id: 'diagnosis', icon: '📊', label: 'コミュ診断' },
  { id: 'planner', icon: '🗓️', label: '会話プランナー' },
  { id: 'examples', icon: '📖', label: 'NG集＆OK集' },
  { id: 'support', icon: '🏥', label: '相談窓口' },
]

const SCENES: { id: Scene; label: string; emoji: string }[] = [
  { id: 'romance', label: '恋愛', emoji: '💑' },
  { id: 'business', label: 'ビジネス', emoji: '💼' },
  { id: 'friend', label: '友人', emoji: '🤝' },
  { id: 'sns', label: 'SNS', emoji: '📱' },
]

// ==================== MESSAGE REVIEW DATA ====================
interface ToneResult {
  label: string
  score: number
  color: string
  advice: string
}

function analyzeMessage(text: string, scene: Scene): { tones: ToneResult[]; overall: string; suggestions: string[] } {
  const len = text.length
  const hasExclamation = text.includes('！') || text.includes('!')
  const hasQuestion = text.includes('？') || text.includes('?')
  const hasEmoji = /[\uD83C-\uD83E]|[😀-🙏]|[♥️❤️💕💗💖✨🎉👍🙇]/.test(text)
  const hasLineBreak = text.includes('\n')
  const hasFormalWords = /です|ます|ございます|いたします|存じます/.test(text)
  const hasCasualWords = /だよ|だね|じゃん|っしょ|笑|ｗ|ww|草/.test(text)
  const hasApology = /すみません|ごめん|申し訳|すいません/.test(text)
  const hasThanks = /ありがとう|感謝|助かり/.test(text)
  const hasNegative = /嫌い|うざい|むかつく|死ね|消えろ|キモい|ウザい/.test(text)
  const hasSelfDeprecating = /どうせ|私なんか|僕なんて|無理だ|ダメな/.test(text)

  // Warmth (温かさ)
  let warmth = 50
  if (hasEmoji) warmth += 10
  if (hasExclamation) warmth += 8
  if (hasThanks) warmth += 15
  if (hasCasualWords) warmth += 5
  if (hasNegative) warmth -= 25
  if (hasSelfDeprecating) warmth -= 10
  if (hasFormalWords && scene === 'romance') warmth -= 5

  // Clarity (明確さ)
  let clarity = 50
  if (len > 10 && len < 200) clarity += 15
  if (hasLineBreak && len > 50) clarity += 10
  if (hasQuestion) clarity += 5
  if (len > 300) clarity -= 10
  if (len < 5) clarity -= 20

  // Weight (重さ — lower is better)
  let weight = 30
  if (len > 200) weight += 15
  if (len > 400) weight += 20
  if (hasApology && !hasThanks) weight += 10
  if (hasSelfDeprecating) weight += 20
  if (text.split('？').length > 3 || text.split('?').length > 3) weight += 15
  if (hasNegative) weight += 15

  // Appropriateness (場面適合度)
  let appropriate = 60
  if (scene === 'business' && hasFormalWords) appropriate += 20
  if (scene === 'business' && hasCasualWords) appropriate -= 20
  if (scene === 'romance' && hasCasualWords) appropriate += 10
  if (scene === 'romance' && hasFormalWords && len > 100) appropriate -= 10
  if (scene === 'friend' && (hasCasualWords || hasEmoji)) appropriate += 15
  if (scene === 'sns' && hasEmoji) appropriate += 10
  if (scene === 'sns' && len < 140) appropriate += 10

  // Engagement (引き込み力)
  let engagement = 40
  if (hasQuestion) engagement += 15
  if (hasExclamation) engagement += 5
  if (hasEmoji) engagement += 5
  if (len > 20 && len < 150) engagement += 10
  if (hasThanks || hasQuestion) engagement += 10

  const clamp = (v: number) => Math.max(0, Math.min(100, v))

  const tones: ToneResult[] = [
    { label: '温かさ', score: clamp(warmth), color: 'bg-pink-500', advice: warmth < 40 ? '絵文字や感謝の言葉を加えると温かみが増します' : '温かい印象を与えています' },
    { label: '明確さ', score: clamp(clarity), color: 'bg-blue-500', advice: clarity < 40 ? '要点を整理して、改行を入れると読みやすくなります' : 'メッセージの意図が伝わりやすいです' },
    { label: '軽さ', score: clamp(100 - weight), color: 'bg-green-500', advice: weight > 60 ? 'メッセージが重くなっています。シンプルにまとめましょう' : '適度な軽さがあります' },
    { label: '場面適合度', score: clamp(appropriate), color: 'bg-purple-500', advice: appropriate < 50 ? '場面に合った言葉遣いを意識しましょう' : 'シーンに合った表現です' },
    { label: '引き込み力', score: clamp(engagement), color: 'bg-amber-500', advice: engagement < 40 ? '質問を入れると会話が続きやすくなります' : '相手が返信しやすい内容です' },
  ]

  const avgScore = tones.reduce((sum, t) => sum + t.score, 0) / tones.length
  const overall = avgScore >= 75 ? '✨ とても良いメッセージです！' : avgScore >= 55 ? '👍 おおむね良いですが、改善の余地があります' : avgScore >= 35 ? '⚠️ いくつかの点で改善が必要です' : '🔴 大幅な見直しをおすすめします'

  const suggestions: string[] = []
  if (weight > 60) suggestions.push('📝 文を短く区切り、1メッセージ1トピックにしましょう')
  if (!hasQuestion && scene !== 'business') suggestions.push('❓ 質問を1つ加えると、会話のキャッチボールが生まれます')
  if (!hasEmoji && (scene === 'romance' || scene === 'friend' || scene === 'sns')) suggestions.push('😊 絵文字を1〜2個添えると親しみやすくなります')
  if (hasSelfDeprecating) suggestions.push('💪 自己卑下は避けましょう。自信を持った表現に置き換えて')
  if (hasNegative) suggestions.push('🌱 ネガティブな言葉は関係を壊します。ポジティブな表現に言い換えましょう')
  if (len > 300) suggestions.push('✂️ 長すぎます。相手の読む負担を減らすため、150文字以内を目標に')
  if (hasApology && !hasThanks) suggestions.push('🙏 「すみません」を「ありがとう」に言い換えてみましょう')
  if (scene === 'business' && !hasFormalWords) suggestions.push('👔 ビジネスシーンでは敬語を使いましょう')
  if (suggestions.length === 0) suggestions.push('🎯 バランスの良いメッセージです。自信を持って送りましょう！')

  return { tones, overall, suggestions }
}

// ==================== PSYCHOLOGY DATA ====================
const PSYCHOLOGY_TOPICS = [
  {
    id: 'attachment',
    title: 'アタッチメント理論',
    emoji: '🔗',
    category: '基礎理論',
    summary: '幼少期の経験が大人の対人関係スタイルを決める',
    content: `**アタッチメント理論**とは、心理学者ジョン・ボウルビィが提唱した理論で、幼少期の養育者との関係が、大人になってからの対人関係パターンを形作るというものです。

**4つのタイプ：**
• **安定型（Secure）** — 親密さと自立のバランスが取れている。相手を信頼でき、自分の感情も表現できる
• **不安型（Anxious）** — 相手に依存しやすい。返信がないと不安になり、確認の連絡を何度もしてしまう
• **回避型（Avoidant）** — 親密さを避ける傾向。距離を置きたがり、感情表現が苦手
• **恐れ型（Fearful）** — 親密さを求めつつ恐れる。近づきたいけど傷つくのが怖い

**実践ポイント：**
1. まず自分のタイプを知ることが重要
2. 不安型の人は「連絡頻度」で関係を測りがち → 質で考える
3. 回避型の人は「一人の時間」を悪いことと思わない → 伝え方を工夫する
4. どのタイプでも意識次第で安定型に近づける`,
  },
  {
    id: 'nvc',
    title: '非暴力コミュニケーション（NVC）',
    emoji: '🕊️',
    category: '話し方',
    summary: '「観察→感情→ニーズ→リクエスト」の4ステップで伝える',
    content: `**NVC（Non-Violent Communication）**は、マーシャル・ローゼンバーグが開発したコミュニケーション手法です。

**4つのステップ：**
1. **観察（Observation）** — 評価せず事実だけ述べる
   ❌「いつも遅い」→ ✅「今日は30分遅れて来た」
2. **感情（Feeling）** — 自分の気持ちを正直に伝える
   ❌「ひどい」→ ✅「心配だった」「寂しかった」
3. **ニーズ（Need）** — その感情の背景にある願いを伝える
   ✅「一緒の時間を大切にしたいから」
4. **リクエスト（Request）** — 具体的なお願いをする
   ❌「もっとちゃんとして」→ ✅「待ち合わせの10分前に着くようにしてほしい」

**NG例 → OK例：**
❌「なんで連絡くれないの？冷たいよね」
✅「3日間連絡がなかったとき（観察）、不安に感じた（感情）。つながりを感じたいから（ニーズ）、1日1回はメッセージくれると嬉しい（リクエスト）」`,
  },
  {
    id: 'active-listening',
    title: 'アクティブリスニング（傾聴）',
    emoji: '👂',
    category: '聞き方',
    summary: '「聞く」だけでなく「聴く」ことで信頼関係を築く',
    content: `**アクティブリスニング**は、カウンセリングの基本技法で、相手の話を能動的に聴く姿勢のことです。

**5つの技法：**
1. **うなずき・あいづち** — 「うんうん」「なるほど」「それで？」
2. **オウム返し（反射）** — 相手の言葉をそのまま繰り返す
   相手「最近仕事がつらいんだ」→ 「仕事がつらいんだね…」
3. **要約** — 相手の話を短くまとめて返す
   「つまり、上司との関係で悩んでいるということ？」
4. **感情の反射** — 言葉の裏にある感情を言語化する
   「それは悔しかったよね」「心細かったんじゃない？」
5. **開いた質問** — Yes/Noで終わらない質問をする
   ❌「楽しかった？」→ ✅「どんなところが印象に残った？」

**やってはいけないこと：**
• すぐにアドバイスする（相手は聞いてほしいだけかも）
• 自分の話にすり替える（「私もね〜」）
• スマホを見ながら聞く`,
  },
  {
    id: 'assertive',
    title: 'アサーティブ・コミュニケーション',
    emoji: '🎯',
    category: '話し方',
    summary: '自分も相手も大切にする自己表現の方法',
    content: `**アサーティブ**とは、自分の意見・気持ちを率直に、かつ相手を尊重しながら伝えるコミュニケーションスタイルです。

**3つのタイプ：**
• **攻撃型（アグレッシブ）** — 自分の意見を押し付ける。相手を否定する
• **受身型（パッシブ）** — 自分の意見を言えない。相手に合わせすぎる
• **アサーティブ型** — 自分も相手も尊重。率直かつ丁寧

**DESC法（アサーティブに伝える4ステップ）：**
1. **D（Describe）** 事実を描写する
   「先週の会議で、私の提案が議題に入っていなかった」
2. **E（Express）** 気持ちを表現する
   「準備していたので残念に思った」
3. **S（Specify）** 具体的な提案をする
   「次回は事前にアジェンダを共有してもらえると助かる」
4. **C（Consequences）** プラスの結果を伝える
   「そうすれば、もっと効率的に議論できると思う」

**断り方のテンプレート：**
「誘ってくれてありがとう（感謝）。今回は予定があって参加できない（事実）。次の機会にぜひ声かけてほしい（代替案）」`,
  },
  {
    id: 'mirror',
    title: 'ミラーリング＆ペーシング',
    emoji: '🪞',
    category: '技法',
    summary: '相手に合わせることで無意識の親近感を生む',
    content: `**ミラーリング**は相手の動作や表現を自然に真似すること、**ペーシング**は相手のペースに合わせることです。

**ミラーリングの方法：**
• 相手が腕を組んだら、しばらくして自分も組む
• 相手がコーヒーを飲んだら、自分も飲む
• 相手の姿勢（前傾・後傾）を合わせる

**テキストでのミラーリング：**
• 相手が絵文字を使うなら自分も使う
• 相手が短文なら自分も短文で返す
• 相手が「！」を多用するなら自分も少し使う
• 返信の速度を相手に合わせる

**注意点：**
• わざとらしくやると逆効果（バレると信頼を失う）
• あくまで「自然に」「少し遅れて」真似する
• テキストの場合、文体や絵文字の頻度を寄せる程度でOK`,
  },
  {
    id: 'love-languages',
    title: '5つの愛の言語',
    emoji: '💝',
    category: '恋愛',
    summary: '愛情表現の「言語」が違うとすれ違いが起きる',
    content: `ゲーリー・チャップマンが提唱した**「5つの愛の言語」**理論。人にはそれぞれ愛情を感じやすい「言語」がある。

**5つのタイプ：**
1. **肯定の言葉（Words of Affirmation）**
   「好き」「かっこいい」「すごいね」→ 言葉で愛情を感じる
2. **クオリティタイム（Quality Time）**
   一緒にいる時間そのものが愛情。スマホを置いて向き合うこと
3. **贈り物（Gifts）**
   プレゼントの金額ではなく「自分のことを考えてくれた」事実が嬉しい
4. **奉仕の行為（Acts of Service）**
   料理を作る、掃除する、荷物を持つ → 行動で示す愛情
5. **身体的タッチ（Physical Touch）**
   手をつなぐ、ハグ、肩に触れる → スキンシップで安心する

**ポイント：**
• 自分の言語と相手の言語は違うことが多い
• 自分の言語で愛情を示しても、相手には伝わらないことがある
• 相手の言語を知り、その言語で表現することが大切`,
  },
  {
    id: 'cognitive-distortion',
    title: '認知の歪み',
    emoji: '🔮',
    category: '基礎理論',
    summary: '思い込みが対人関係を壊すメカニズム',
    content: `**認知の歪み**とは、現実を正しく認識できず、偏った解釈をしてしまう思考パターンです。

**対人関係でよくある歪み：**
1. **心のフィルター** — 悪い部分だけに注目する
   「10回褒められても、1回の批判だけ気になる」
2. **読心術** — 相手の気持ちを勝手に決めつける
   「既読スルー = 嫌われた」（本当は忙しいだけかも）
3. **全か無か思考** — 白黒で考える
   「完璧に好かれないなら嫌われている」
4. **過度の一般化** — 一度のことを「いつも」と考える
   「この人は1回約束を破った = 信用できない人」
5. **感情的推論** — 感情を事実と混同する
   「不安を感じる = 本当に危険なことが起きている」

**対処法：**
• 「本当にそう？」と自問する
• 証拠を探す（10回中何回？）
• 別の解釈を3つ考える
• 信頼できる人に「客観的にどう思う？」と聞く`,
  },
  {
    id: 'boundary',
    title: '健全な境界線（バウンダリー）',
    emoji: '🚧',
    category: '基礎理論',
    summary: '自分と相手の間に適切な線を引く方法',
    content: `**バウンダリー（境界線）**とは、自分と他者の間に引く心理的な線のこと。健全な関係には不可欠です。

**3つの境界線タイプ：**
• **物理的** — 身体的な距離感、持ち物、プライベート空間
• **感情的** — 自分の感情と相手の感情を分けて考える
• **デジタル** — SNS、既読、返信頻度、位置共有

**境界線が弱い人のサイン：**
• 相手の機嫌に振り回される
• 「No」が言えない
• 相手の問題を自分の問題として抱え込む
• 「嫌われたくない」が行動原理になっている

**境界線の引き方：**
1. 自分にとって「ここは譲れない」を明確にする
2. 相手に穏やかに、しかし明確に伝える
3. 境界線を超えられたら、結果を示す（距離を置くなど）

**伝え方の例：**
「あなたのことは大切だけど、夜10時以降の連絡は控えてほしい。翌朝返信するね」`,
  },
  {
    id: 'first-impression',
    title: '初対面の心理学',
    emoji: '👋',
    category: '技法',
    summary: '第一印象は7秒で決まり、変えるには半年かかる',
    content: `**メラビアンの法則**（よく誤解される法則ですが）が示すのは、矛盾した情報を受け取ったとき、人は視覚55%・聴覚38%・言葉7%で判断するということ。

**初対面で好印象を与える5つのコツ：**
1. **アイコンタクト** — 3秒見て→1秒外す のリズム
2. **名前を呼ぶ** — 自己紹介後すぐに「〇〇さん、よろしく」
3. **共通点を探す** — 出身地、趣味、仕事の分野
4. **相手に話させる** — 自分70%話す人より、70%聞く人が好かれる
5. **最後の印象** — 「今日は楽しかった。また話したい」で締める

**テキストでの初対面（マッチングアプリ等）：**
• 最初のメッセージは短く（3行以内）
• 相手のプロフィールに触れる（コピペ感ゼロに）
• 質問を1つだけ入れる
• 返信しやすい内容にする`,
  },
  {
    id: 'conflict',
    title: '建設的な喧嘩の仕方',
    emoji: '⚡',
    category: '話し方',
    summary: '衝突を関係強化のチャンスに変える方法',
    content: `心理学者ジョン・ゴットマンの研究によると、**喧嘩しないカップルより、上手に喧嘩するカップルの方が長続きする**。

**ゴットマンの「末日の四騎士」（関係を壊す4つのパターン）：**
1. **批判（Criticism）** — 人格を攻撃する
   ❌「あなたはいつも自分勝手」
2. **軽蔑（Contempt）** — 見下す態度
   ❌ 皮肉、目を回す、バカにした笑い
3. **防御（Defensiveness）** — 言い訳で返す
   ❌「だって忙しかったんだから」
4. **石壁（Stonewalling）** — 無視・シャットダウン
   ❌ 返事しない、部屋を出る

**建設的な喧嘩のルール：**
• 「あなたは〜」ではなく「私は〜」で始める
• 過去を持ち出さない（「あの時も〜」はNG）
• 1つの議題に絞る
• 感情が高ぶったら20分休憩する（生理的に冷静になるのに20分必要）
• 解決策を一緒に考える姿勢を持つ`,
  },
]

// ==================== DIAGNOSIS DATA ====================
const DIAGNOSIS_QUESTIONS = [
  { text: '初対面の人と話すとき、自分から話しかけることが多い', category: 'E' },
  { text: '相手の話を聞くとき、つい自分の意見を言いたくなる', category: 'D' },
  { text: '友人からの相談を受けることが多い', category: 'S' },
  { text: '計画を立ててから行動するタイプだ', category: 'C' },
  { text: '大人数の集まりよりも少人数が好きだ', category: 'S' },
  { text: '意見が対立したとき、自分の意見を通そうとする', category: 'D' },
  { text: '人を笑わせるのが好きだ', category: 'E' },
  { text: '相手の表情や声のトーンの変化に気づきやすい', category: 'S' },
  { text: 'メールやメッセージは簡潔に書く方だ', category: 'D' },
  { text: '新しい人間関係を作ることに積極的だ', category: 'E' },
  { text: 'データや根拠に基づいて判断する方だ', category: 'C' },
  { text: '人に頼るより自分でやる方が好きだ', category: 'D' },
  { text: '相手の気持ちに共感しやすい', category: 'S' },
  { text: '感情よりも論理を重視する', category: 'C' },
  { text: '場の雰囲気を明るくするのが得意だ', category: 'E' },
]

interface CommType {
  id: string
  name: string
  emoji: string
  color: string
  strengths: string[]
  weaknesses: string[]
  tips: string[]
  compatible: string
  challenging: string
}

const COMM_TYPES: Record<string, CommType> = {
  E: {
    id: 'E',
    name: 'ムードメーカー型',
    emoji: '🌟',
    color: 'from-yellow-500 to-orange-500',
    strengths: ['場を盛り上げるのが得意', '初対面でもすぐに打ち解けられる', 'ポジティブなエネルギーを周囲に与える'],
    weaknesses: ['話しすぎて相手の話を聞けないことがある', '深い話題を避けがち', 'テンションの波が激しい'],
    tips: ['相手が話している間は3秒待ってから返す', '1対1の深い会話の時間を意識的に作る', '聞く:話す = 6:4を目標に'],
    compatible: 'サポーター型',
    challenging: '分析型',
  },
  D: {
    id: 'D',
    name: 'リーダー型',
    emoji: '🦁',
    color: 'from-red-500 to-rose-500',
    strengths: ['決断力があり頼りになる', '物事を前に進める力がある', '明確で分かりやすいコミュニケーション'],
    weaknesses: ['相手の気持ちを置き去りにしがち', '「正しさ」にこだわりすぎる', '高圧的に映ることがある'],
    tips: ['「あなたはどう思う？」を口癖にする', '正しさより関係性を優先する場面を増やす', '感謝の言葉を意識的に伝える'],
    compatible: '分析型',
    challenging: 'サポーター型',
  },
  S: {
    id: 'S',
    name: 'サポーター型',
    emoji: '🤗',
    color: 'from-green-500 to-emerald-500',
    strengths: ['共感力が高く、相手に安心感を与える', '聞き上手で信頼される', '人間関係を大切にする'],
    weaknesses: ['自分の意見を言えないことがある', '相手に合わせすぎて疲れる', 'Noが言えない'],
    tips: ['「私はこう思う」を1日3回は言う練習', '自分の時間を確保するルールを作る', 'すぐ返事せず「考えさせて」と言う練習'],
    compatible: 'ムードメーカー型',
    challenging: 'リーダー型',
  },
  C: {
    id: 'C',
    name: '分析型',
    emoji: '🔬',
    color: 'from-blue-500 to-indigo-500',
    strengths: ['論理的で正確なコミュニケーション', '問題解決能力が高い', '感情に流されず冷静に判断できる'],
    weaknesses: ['冷たい印象を与えることがある', '感情表現が苦手', '完璧主義で相手にも高い基準を求めがち'],
    tips: ['感情の言葉を意識して使う（嬉しい、楽しい、残念）', '相手の話に「それ大変だったね」と共感を入れる', '正確さより関係性を優先する場面を選ぶ'],
    compatible: 'リーダー型',
    challenging: 'ムードメーカー型',
  },
}

// ==================== PLANNER DATA ====================
interface ConversationPlan {
  scene: string
  emoji: string
  flow: { phase: string; duration: string; topics: string[] }[]
  tips: string[]
}

const PLANS: Record<Scene, ConversationPlan[]> = {
  romance: [
    {
      scene: '初デート（カフェ）',
      emoji: '☕',
      flow: [
        { phase: '挨拶〜注文', duration: '5分', topics: ['「今日は来てくれてありがとう」', '飲み物の好みを聞く', '最近のおすすめカフェ'] },
        { phase: '自己紹介', duration: '10分', topics: ['仕事の話（深入りしすぎない）', '休日の過ごし方', '最近ハマっていること'] },
        { phase: '共通点探し', duration: '15分', topics: ['出身地・旅行', '好きな食べ物', '映画・音楽・漫画'] },
        { phase: '深い話題', duration: '15分', topics: ['将来の夢', '価値観（何を大切にしているか）', '最近感動したこと'] },
        { phase: '締め', duration: '5分', topics: ['「今日は楽しかった」', '次のプランを軽く提案', '「また会いたい」と素直に伝える'] },
      ],
      tips: ['スマホはカバンに入れる', '相手の話:自分の話 = 6:4', '沈黙を恐れない（自然なペースで）'],
    },
    {
      scene: '告白・気持ちを伝える',
      emoji: '💌',
      flow: [
        { phase: '前置き', duration: '—', topics: ['「大切な話があるんだけど」', '2人きりの落ち着いた場所で'] },
        { phase: '気持ちを伝える', duration: '—', topics: ['「〇〇のこういうところが好き」（具体的に）', '「一緒にいると楽しい」「もっと知りたい」'] },
        { phase: 'リクエスト', duration: '—', topics: ['「付き合ってほしい」とシンプルに', '回りくどい言い方はNG'] },
        { phase: '相手の反応', duration: '—', topics: ['すぐに答えを求めない', '「考えてくれてもいいよ」と余裕を持つ'] },
      ],
      tips: ['LINEより対面がベスト', '相手が忙しい時・疲れている時は避ける', '「OK」以外の返事も受け入れる覚悟を持つ'],
    },
  ],
  business: [
    {
      scene: '商談・プレゼン',
      emoji: '📊',
      flow: [
        { phase: 'アイスブレイク', duration: '3分', topics: ['天気・最近の業界ニュース', '相手の会社の最近のニュースに触れる'] },
        { phase: '課題のヒアリング', duration: '10分', topics: ['「現在どのような課題がありますか？」', '「理想の状態は？」', 'メモを取る姿勢'] },
        { phase: '提案', duration: '15分', topics: ['課題 → 解決策 → 効果 の順で説明', '数字・事例を交える', '相手の反応を見ながら調整'] },
        { phase: 'クロージング', duration: '5分', topics: ['次のステップを具体的に', '期限を切る', '「ご不明点はありますか？」'] },
      ],
      tips: ['相手の名前を3回以上呼ぶ', '「御社の〇〇が素晴らしい」から入る', 'PREP法（結論→理由→具体例→結論）'],
    },
    {
      scene: '1on1ミーティング',
      emoji: '🤝',
      flow: [
        { phase: 'チェックイン', duration: '3分', topics: ['「最近どう？」「体調は？」', '仕事以外の話から入る'] },
        { phase: '相手の話を聞く', duration: '15分', topics: ['「最近うまくいっていることは？」', '「困っていることはある？」', '傾聴に徹する'] },
        { phase: 'フィードバック', duration: '10分', topics: ['良い点を先に伝える（SBI法）', '改善点は「提案」として伝える', '「どう思う？」と意見を聞く'] },
        { phase: 'アクション決め', duration: '5分', topics: ['次回までにやること', '必要なサポート', '「何か他に聞きたいことは？」'] },
      ],
      tips: ['PCを閉じる', '8割聞いて2割話す', 'アドバイスは求められてからする'],
    },
  ],
  friend: [
    {
      scene: '久しぶりの再会',
      emoji: '🎉',
      flow: [
        { phase: '再会の喜び', duration: '5分', topics: ['「元気だった？変わらないね！」', '見た目の変化を褒める', '懐かしい話'] },
        { phase: '近況報告', duration: '15分', topics: ['仕事・プライベートの変化', '共通の知人の話', '最近ハマっていること'] },
        { phase: '思い出話', duration: '10分', topics: ['「あの時おもしろかったよね」', '共有している体験', '当時の写真を見せ合う'] },
        { phase: 'これから', duration: '10分', topics: ['「また集まろう」', '具体的な次の予定を決める', '共通の趣味で繋がる'] },
      ],
      tips: ['自慢話は控えめに', '相手の近況に興味を持って深掘りする', '連絡先を交換し直す'],
    },
  ],
  sns: [
    {
      scene: 'SNSでのやり取り',
      emoji: '📱',
      flow: [
        { phase: '投稿への反応', duration: '—', topics: ['具体的な感想を1行で', '「いいね」だけでなくコメントも', '質問を1つ添える'] },
        { phase: 'DM の始め方', duration: '—', topics: ['共通の話題から入る', '投稿の内容に触れて自然に', '「〇〇の投稿見て聞きたかったんだけど」'] },
        { phase: '会話の継続', duration: '—', topics: ['返信速度を相手に合わせる', '長文を送りすぎない', '写真や画像を活用'] },
        { phase: 'オフラインへ', duration: '—', topics: ['「今度実際に会えたら嬉しい」', '共通イベントを提案', '無理に誘わない'] },
      ],
      tips: ['深夜の連投は避ける', 'ネガティブな反応は時間を置いてから', '公開の場で意見が対立したらDMに移行する'],
    },
  ],
}

// ==================== EXAMPLES DATA ====================
interface Example {
  scene: string
  ng: string
  ngReason: string
  ok: string
  okReason: string
  category: Scene
}

const EXAMPLES: Example[] = [
  // Romance
  { scene: '初めてのLINE', ng: 'こんにちは！今日はありがとうございました！楽しかったです！また会いたいです！いつ空いてますか？', ngReason: '感嘆符の連打が重い。質問攻めで相手にプレッシャー', ok: '今日はありがとう😊 〇〇の話おもしろかった！また美味しいもの食べに行こう', okReason: '感謝+具体的な感想+軽い提案。返信しやすい', category: 'romance' },
  { scene: '既読スルーされた後', ng: '読んだ？忙しいのかな？嫌だったら言ってくれていいよ。ごめんね何かあった？', ngReason: '追い詰めている。不安を全部ぶつけている', ok: '（2〜3日待って何もなかったら）元気？最近見つけたカフェがおすすめだよ🍰', okReason: '自然な話題転換。相手を責めず新しい会話のきっかけを作る', category: 'romance' },
  { scene: '喧嘩した後の仲直り', ng: 'もういいよ。私が悪いんでしょ。好きにして。', ngReason: '受動的攻撃（パッシブ・アグレッシブ）。本心が伝わらない', ok: '昨日はお互いヒートアップしちゃったね。私も言い方がきつかった。落ち着いて話したいな', okReason: '自分の非を認めつつ、建設的な提案をしている', category: 'romance' },
  { scene: 'デートの誘い方', ng: '今度ご飯行きませんか？いつでもいいです。どこでもいいです。', ngReason: '丸投げ。相手に考える負担を押し付けている', ok: '来週の土曜、渋谷に新しくできたイタリアン行かない？パスタが美味しいらしい🍝', okReason: '日時・場所・理由が具体的。相手はYes/Noを選ぶだけ', category: 'romance' },
  // Business
  { scene: 'メールの書き出し', ng: 'お疲れ様です。先日の件ですが、確認をお願いしたいと思いまして、ご連絡させていただきました。', ngReason: '前置きが長く、要件がわからない', ok: 'お疲れ様です。先日の〇〇案件について2点確認です。', okReason: '要件と数が冒頭でわかる。読む側の心理的負担が少ない', category: 'business' },
  { scene: '依頼の断り方', ng: 'ちょっと無理ですね。他の人に頼んでもらっていいですか。', ngReason: '冷たい印象。代替案がない', ok: '今週は〇〇の対応で厳しい状況です。来週月曜以降であれば対応できますが、いかがでしょうか？', okReason: '理由+代替案を提示。相手への配慮がある', category: 'business' },
  { scene: 'フィードバック', ng: 'この資料、全然ダメだね。やり直して。', ngReason: '人格否定。具体的な改善点がない', ok: 'データの整理がしっかりしてて良いね。3ページ目のグラフを棒グラフに変えると比較が伝わりやすくなると思う', okReason: '良い点→具体的改善案。SBI法（Situation-Behavior-Impact）', category: 'business' },
  // Friend
  { scene: '悩み相談を受けた時', ng: 'そんなの気にしなくていいよ！考えすぎだって！元気出して！', ngReason: '感情を否定している。「気にするな」は相手を否定する言葉', ok: 'そっか、それはつらかったね…。どうしたいとか、考えてることある？', okReason: '共感→開いた質問。相手のペースで話せる', category: 'friend' },
  { scene: '約束のドタキャン', ng: 'ごめん！今日無理になった！また今度ね！', ngReason: '軽い。相手の予定を空けてくれた配慮がない', ok: 'ごめん、急な仕事が入ってしまって今日行けなくなった…。本当に楽しみにしてたのに申し訳ない。来週の〇曜日はどう？', okReason: '理由+申し訳なさ+具体的な代替案', category: 'friend' },
  // SNS
  { scene: 'コメントの仕方', ng: 'いいね👍', ngReason: '「いいね」ボタンと変わらない。印象に残らない', ok: 'この構図すごい！〇〇のあたりの光の入り方が特に好き。どこで撮ったの？', okReason: '具体的な感想+質問で会話が生まれる', category: 'sns' },
  { scene: '炎上しそうな時', ng: 'それは違うと思います。〇〇の方が正しいです。以下、その理由を述べます…（長文）', ngReason: 'SNSで長文反論は逆効果。公開の場でのバトルは双方にダメージ', ok: '（公開の場では反応しない。どうしても伝えたいならDMで「〇〇の件、少し気になったんだけど話せる？」）', okReason: '公開バトルを避ける。冷静にプライベートで対話', category: 'sns' },
]

// ==================== SUPPORT DATA ====================
const SUPPORT_ORGS = [
  { name: 'よりそいホットライン', tel: '0120-279-338', desc: '24時間無料の相談窓口。人間関係、生活、心の悩み全般', url: 'https://www.since2011.net/yorisoi/', emoji: '📞' },
  { name: 'いのちの電話', tel: '0120-783-556', desc: '孤独や対人関係の悩みを聴くボランティア電話相談', url: 'https://www.inochinodenwa.org/', emoji: '🕯️' },
  { name: 'DV相談ナビ', tel: '#8008', desc: 'DV（配偶者暴力）の相談窓口。全国の最寄り相談センターにつながる', url: 'https://www.gender.go.jp/policy/no_violence/dv_navi/', emoji: '🛡️' },
  { name: 'デートDV相談', tel: '050-3204-0404', desc: '10代〜20代の恋愛関係でのDV相談', url: 'https://notalone-ddv.org/', emoji: '💔' },
  { name: '精神保健福祉センター', tel: '—', desc: '各都道府県に設置。メンタルヘルスの専門相談窓口', url: 'https://www.mhlw.go.jp/kokoro/support/mhcenter.html', emoji: '🏥' },
  { name: 'カウンセリング検索', tel: '—', desc: '全国のカウンセラーを探せるサイト。対面・オンライン対応', url: 'https://www.counselor.or.jp/', emoji: '🔍' },
]

// ==================== MAIN COMPONENT ====================
export function CommCoach() {
  const [tab, setTab] = useState<Tab>('review')
  const [scene, setScene] = useState<Scene>('romance')

  // Review state
  const [reviewText, setReviewText] = useState('')
  const [reviewResult, setReviewResult] = useState<ReturnType<typeof analyzeMessage> | null>(null)

  // Diagnosis state
  const [diagAnswers, setDiagAnswers] = useState<DiagnosisAnswer[]>([])
  const [diagResult, setDiagResult] = useState<CommType | null>(null)

  // Psychology state
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  // Planner state
  const [selectedPlan, setSelectedPlan] = useState(0)

  // Examples filter
  const [exampleFilter, setExampleFilter] = useState<Scene | 'all'>('all')

  // Load saved diagnosis
  useEffect(() => {
    const saved = localStorage.getItem('comm-coach-diagnosis')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setDiagResult(COMM_TYPES[data.type] || null)
        setDiagAnswers(data.answers || [])
      } catch { /* ignore */ }
    }
  }, [])

  const handleReview = () => {
    if (!reviewText.trim()) return
    setReviewResult(analyzeMessage(reviewText.trim(), scene))
  }

  const handleDiagnosisAnswer = (qIndex: number, value: number) => {
    setDiagAnswers(prev => {
      const next = prev.filter(a => a.questionIndex !== qIndex)
      next.push({ questionIndex: qIndex, value })
      return next
    })
  }

  const calculateDiagnosis = () => {
    const scores: Record<string, number> = { E: 0, D: 0, S: 0, C: 0 }
    for (const a of diagAnswers) {
      const q = DIAGNOSIS_QUESTIONS[a.questionIndex]
      if (q) scores[q.category] += a.value
    }
    const maxType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    const result = COMM_TYPES[maxType]
    setDiagResult(result)
    localStorage.setItem('comm-coach-diagnosis', JSON.stringify({ type: maxType, answers: diagAnswers, scores }))
  }

  const currentPlans = PLANS[scene] || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                AIコミュニケーション改善コーチ
              </h1>
            </div>
            {/* Scene selector */}
            <div className="flex gap-1">
              {SCENES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setScene(s.id); setSelectedPlan(0) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    scene === s.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  tab === t.id
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ==================== TAB: MESSAGE REVIEW ==================== */}
        {tab === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">💬 メッセージ添削AI</h2>
              <p className="text-sm text-white/50">送りたいメッセージを入力すると、トーンを5段階で診断し改善案を提案します</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-white/60">シーン:</span>
                <span className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-3 py-1 rounded-full text-xs">
                  {SCENES.find(s => s.id === scene)?.emoji} {SCENES.find(s => s.id === scene)?.label}
                </span>
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="送りたいメッセージを入力してください..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/40">{reviewText.length} 文字</span>
                <button
                  onClick={handleReview}
                  disabled={!reviewText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
                >
                  添削する
                </button>
              </div>
            </div>

            {reviewResult && (
              <div className="space-y-4">
                {/* Overall */}
                <div className="bg-white/5 rounded-2xl p-5 text-center">
                  <p className="text-lg font-bold mb-1">{reviewResult.overall}</p>
                  <p className="text-xs text-white/50">
                    総合スコア: {Math.round(reviewResult.tones.reduce((s, t) => s + t.score, 0) / reviewResult.tones.length)}点
                  </p>
                </div>

                {/* Tone bars */}
                <div className="bg-white/5 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm">トーン分析</h3>
                  {reviewResult.tones.map((t, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t.label}</span>
                        <span className="text-white/60">{t.score}点</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${t.color} rounded-full transition-all duration-500`} style={{ width: `${t.score}%` }} />
                      </div>
                      <p className="text-xs text-white/40 mt-1">{t.advice}</p>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-3">💡 改善アドバイス</h3>
                  <div className="space-y-2">
                    {reviewResult.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0">{s.slice(0, 2)}</span>
                        <span className="text-white/80">{s.slice(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: PSYCHOLOGY ==================== */}
        {tab === 'psychology' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">🧠 心理学ミニ講座</h2>
              <p className="text-sm text-white/50">対人関係に役立つ心理学理論を実践的に解説。全{PSYCHOLOGY_TOPICS.length}テーマ</p>
            </div>

            {!selectedTopic ? (
              <div className="grid gap-3">
                {PSYCHOLOGY_TOPICS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopic(t.id)}
                    className="bg-white/5 rounded-2xl p-5 text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{t.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm">{t.title}</h3>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{t.category}</span>
                        </div>
                        <p className="text-xs text-white/50">{t.summary}</p>
                      </div>
                      <span className="text-white/30">→</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setSelectedTopic(null)} className="text-sm text-pink-400 hover:text-pink-300 mb-4 flex items-center gap-1">
                  ← テーマ一覧に戻る
                </button>
                {(() => {
                  const topic = PSYCHOLOGY_TOPICS.find(t => t.id === selectedTopic)
                  if (!topic) return null
                  return (
                    <div className="bg-white/5 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{topic.emoji}</span>
                        <div>
                          <h3 className="text-lg font-bold">{topic.title}</h3>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{topic.category}</span>
                        </div>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none">
                        {topic.content.split('\n\n').map((para, i) => (
                          <div key={i} className="mb-4 text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                            {para.split('**').map((part, j) =>
                              j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : <span key={j}>{part}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: DIAGNOSIS ==================== */}
        {tab === 'diagnosis' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">📊 コミュニケーションスタイル診断</h2>
              <p className="text-sm text-white/50">15問に答えて、あなたのコミュスタイルを4タイプに分類</p>
            </div>

            {!diagResult ? (
              <>
                <div className="space-y-3">
                  {DIAGNOSIS_QUESTIONS.map((q, qi) => (
                    <div key={qi} className="bg-white/5 rounded-xl p-4">
                      <p className="text-sm mb-3">Q{qi + 1}. {q.text}</p>
                      <div className="flex gap-2">
                        {[
                          { v: 1, label: '全く当てはまらない' },
                          { v: 2, label: 'あまり' },
                          { v: 3, label: 'どちらとも' },
                          { v: 4, label: 'やや当てはまる' },
                          { v: 5, label: 'とても当てはまる' },
                        ].map(opt => {
                          const selected = diagAnswers.find(a => a.questionIndex === qi)?.value === opt.v
                          return (
                            <button
                              key={opt.v}
                              onClick={() => handleDiagnosisAnswer(qi, opt.v)}
                              className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                                selected
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                  : 'bg-white/5 text-white/50 hover:bg-white/10'
                              }`}
                            >
                              {opt.v}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/40 mb-3">{diagAnswers.length}/{DIAGNOSIS_QUESTIONS.length} 問回答済み</p>
                  <button
                    onClick={calculateDiagnosis}
                    disabled={diagAnswers.length < DIAGNOSIS_QUESTIONS.length}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
                  >
                    診断する
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className={`bg-gradient-to-r ${diagResult.color} rounded-2xl p-6 text-center`}>
                  <span className="text-4xl block mb-2">{diagResult.emoji}</span>
                  <h3 className="text-2xl font-bold mb-1">あなたは「{diagResult.name}」</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-sm mb-3 text-green-400">💪 強み</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      {diagResult.strengths.map((s, i) => <li key={i}>✅ {s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-sm mb-3 text-amber-400">⚠️ 注意点</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      {diagResult.weaknesses.map((w, i) => <li key={i}>⚡ {w}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-5">
                  <h4 className="font-bold text-sm mb-3 text-pink-400">🎯 改善アドバイス</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    {diagResult.tips.map((t, i) => <li key={i}>💡 {t}</li>)}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-2xl p-5 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs text-white/40 mb-1">相性が良いタイプ</h4>
                    <p className="text-sm font-medium text-green-400">💚 {diagResult.compatible}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/40 mb-1">衝突しやすいタイプ</h4>
                    <p className="text-sm font-medium text-amber-400">⚡ {diagResult.challenging}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setDiagResult(null); setDiagAnswers([]); localStorage.removeItem('comm-coach-diagnosis') }}
                  className="w-full py-2 bg-white/5 rounded-xl text-sm text-white/50 hover:bg-white/10 transition-colors"
                >
                  もう一度診断する
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: PLANNER ==================== */}
        {tab === 'planner' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">🗓️ 会話プランナー</h2>
              <p className="text-sm text-white/50">場面に合わせた会話の流れと話題リストを自動生成</p>
            </div>

            {currentPlans.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40">
                このシーンのプランは準備中です
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  {currentPlans.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPlan(i)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${
                        selectedPlan === i
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {p.emoji} {p.scene}
                    </button>
                  ))}
                </div>

                {currentPlans[selectedPlan] && (
                  <div className="space-y-4">
                    {/* Flow */}
                    <div className="bg-white/5 rounded-2xl p-5">
                      <h3 className="font-bold text-sm mb-4">📋 会話フロー</h3>
                      <div className="space-y-4">
                        {currentPlans[selectedPlan].flow.map((f, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                {i + 1}
                              </div>
                              {i < currentPlans[selectedPlan].flow.length - 1 && (
                                <div className="w-0.5 h-full bg-white/10 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-sm">{f.phase}</h4>
                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{f.duration}</span>
                              </div>
                              <ul className="space-y-1">
                                {f.topics.map((t, j) => (
                                  <li key={j} className="text-sm text-white/60 flex gap-1.5">
                                    <span className="text-pink-400">•</span> {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-white/5 rounded-2xl p-5">
                      <h3 className="font-bold text-sm mb-3">💡 ポイント</h3>
                      <ul className="space-y-2">
                        {currentPlans[selectedPlan].tips.map((t, i) => (
                          <li key={i} className="text-sm text-white/70 flex gap-2">
                            <span>⭐</span> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ==================== TAB: EXAMPLES ==================== */}
        {tab === 'examples' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">📖 NG集＆OK集</h2>
              <p className="text-sm text-white/50">シーン別のよくある失敗パターンと改善例</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setExampleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${exampleFilter === 'all' ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50'}`}
              >
                すべて
              </button>
              {SCENES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setExampleFilter(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${exampleFilter === s.id ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50'}`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {EXAMPLES.filter(e => exampleFilter === 'all' || e.category === exampleFilter).map((ex, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {SCENES.find(s => s.id === ex.category)?.emoji} {SCENES.find(s => s.id === ex.category)?.label}
                    </span>
                    <h3 className="font-bold text-sm">{ex.scene}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="text-xs font-bold text-red-400 mb-2">❌ NG例</div>
                      <p className="text-sm text-white/80 mb-2">{ex.ng}</p>
                      <p className="text-xs text-red-300/70">→ {ex.ngReason}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <div className="text-xs font-bold text-green-400 mb-2">✅ OK例</div>
                      <p className="text-sm text-white/80 mb-2">{ex.ok}</p>
                      <p className="text-xs text-green-300/70">→ {ex.okReason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: SUPPORT ==================== */}
        {tab === 'support' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">🏥 相談窓口ガイド</h2>
              <p className="text-sm text-white/50">対人関係の悩みが深刻な場合は、専門家に相談しましょう</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-sm">
              <p className="font-bold text-amber-400 mb-1">💡 一人で抱え込まないで</p>
              <p className="text-white/60">
                対人関係の悩みは、自分だけで解決しようとすると悪化することがあります。
                少しでも「つらい」と感じたら、専門家に相談することをおすすめします。
              </p>
            </div>

            <div className="space-y-3">
              {SUPPORT_ORGS.map((org, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{org.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{org.name}</h3>
                      <p className="text-xs text-white/50 mb-2">{org.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {org.tel !== '—' && (
                          <a
                            href={`tel:${org.tel.replace(/-/g, '')}`}
                            className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs hover:bg-green-500/30 transition-colors"
                          >
                            📞 {org.tel}
                          </a>
                        )}
                        <a
                          href={org.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs hover:bg-blue-500/30 transition-colors"
                        >
                          🔗 Webサイト
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-5 text-center">
              <p className="text-sm text-white/60 mb-2">緊急の場合</p>
              <a href="tel:110" className="text-2xl font-bold text-red-400 hover:text-red-300">
                🚨 110（警察）
              </a>
              <p className="text-xs text-white/40 mt-1">DV・ストーカー被害など身の危険を感じたら迷わず通報</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">
          ※ このツールは心理学の一般的な知見に基づく参考情報です。深刻な対人問題については専門家にご相談ください。
          <br />すべてのデータはブラウザ内に保存され、外部に送信されることはありません。
        </p>
      </div>
    </div>
  )
}
