'use client'


import { useState, useCallback, useRef } from 'react'

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
interface ProfileData {
  gender: '逕ｷ諤ｧ' | '螂ｳ諤ｧ'
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
  scene: '蛻昴ョ繝ｼ繝・ | '2蝗樒岼莉･髯・ | '險伜ｿｵ譌･'
  season: '譏･' | '螟・ | '遘・ | '蜀ｬ'
}

interface ActivityStats {
  matchCount: number
  dateCount: number
  messageResponseRate: number
  profileViewCount: number
  period: string
}

// 笏笏笏 Data 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const compatQuestions = [
  { id: 'q1', category: '邨仙ｩ夊ｦｳ', question: '邨仙ｩ壼ｾ後ｂ莉穂ｺ九ｒ邯壹￠縺溘＞・育ｶ壹￠縺ｦ縺ｻ縺励＞・・ },
  { id: 'q2', category: '邨仙ｩ夊ｦｳ', question: '蟄蝉ｾ帙′縺ｻ縺励＞' },
  { id: 'q3', category: '邨仙ｩ夊ｦｳ', question: '荳｡隕ｪ縺ｨ蜷悟ｱ・＠縺ｦ繧ゅ＞縺・ },
  { id: 'q4', category: '萓｡蛟､隕ｳ', question: '莨第律縺ｯ繧｢繧ｦ繝医ラ繧｢縺ｧ驕弱＃縺励◆縺・ },
  { id: 'q5', category: '萓｡蛟､隕ｳ', question: '雋ｯ驥代ｈ繧翫ｂ菴馴ｨ薙↓縺企≡繧剃ｽｿ縺・◆縺・ },
  { id: 'q6', category: '萓｡蛟､隕ｳ', question: '螳ｶ莠九・螳悟・縺ｫ蟷ｳ遲峨↓蛻・球縺吶∋縺阪□' },
  { id: 'q7', category: '繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ', question: '譛晏梛縺ｮ逕滓ｴｻ縺悟･ｽ縺・ },
  { id: 'q8', category: '繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ', question: '蜿倶ｺｺ縺ｨ縺ｮ莉倥″蜷医＞縺ｯ螟壹＞譁ｹ縺後＞縺・ },
  { id: 'q9', category: '繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ', question: '繝壹ャ繝医→證ｮ繧峨＠縺溘＞' },
  { id: 'q10', category: '繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ', question: 'LINE縺ｯ縺吶＄霑比ｿ｡縺励※縺ｻ縺励＞' },
  { id: 'q11', category: '繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ', question: '謔ｩ縺ｿ縺ｯ逶ｸ謇九↓縺吶＄逶ｸ隲・＠縺溘＞' },
  { id: 'q12', category: '繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ', question: '繧ｹ繧ｭ繝ｳ繧ｷ繝・・縺ｯ螟壹＞譁ｹ縺後＞縺・ },
]

const profileTemplates: Record<string, { before: string; after: string }[]> = {
  hobbies: [
    { before: '譏逕ｻ髑題ｳ・, after: '莨第律縺ｯ髫繧後◆蜷堺ｽ懈丐逕ｻ繧呈爾縺吶・縺梧･ｽ縺励∩縲よ怙霑代・髻灘嵜譏逕ｻ縺ｫ繝上・縺｣縺ｦ縺ｾ縺咀沁ｬ' },
    { before: '繧ｫ繝輔ぉ蟾｡繧・, after: '閾ｪ螳ｶ辟咏・縺ｮ繧ｳ繝ｼ繝偵・繧ｷ繝ｧ繝・・繧貞ｷ｡繧九・縺碁ｱ譛ｫ縺ｮ讌ｽ縺励∩縲ゅ♀縺吶☆繧√・縺雁ｺ励∵蕗縺医※縺上□縺輔＞笘・ },
    { before: '譌・｡・, after: '蟷ｴ2蝗槭・譁ｰ縺励＞蝣ｴ謇繧定ｨｪ繧後ｋ繧医≧縺ｫ縺励※縺ｾ縺吶ょ悉蟷ｴ縺ｯ逶ｴ蟲ｶ縺ｮ繧｢繝ｼ繝亥ｷ｡繧翫′譛鬮倥〒縺励◆笨茨ｸ・ },
    { before: '譁咏炊', after: '騾ｱ譛ｫ縺ｯ菴懊ｊ鄂ｮ縺阪♀縺九★繧・蜩∽ｽ懊ｋ縺ｮ縺後Ν繝ｼ繝・ぅ繝ｳ縲よ怙霑代・繧ｹ繝代う繧ｹ繧ｫ繝ｬ繝ｼ縺ｫ繝上・縺｣縺ｦ縺ｾ縺咀沚・ },
    { before: '隱ｭ譖ｸ', after: '繝薙ず繝阪せ譖ｸ縺ｨ蟆剰ｪｬ繧剃ｺ､莠偵↓隱ｭ繧繧ｹ繧ｿ繧､繝ｫ縲よ擲驥主惆蜷ｾ縺ｮ譁ｰ菴懊・逋ｺ螢ｲ譌･縺ｫ雋ｷ縺・ｴｾ縺ｧ縺咀沒・ },
    { before: '繧ｸ繝繝ｻ遲九ヨ繝ｬ', after: '騾ｱ3縺ｧ繧ｸ繝騾壹＞縲ゅ・繝ｳ繝√・繝ｬ繧ｹ80kg縺梧怙霑代・逶ｮ讓咀汳ｪ 蛛･蠎ｷ逧・↑逕滓ｴｻ繧貞､ｧ蛻・↓縺励※縺ｾ縺・ },
    { before: '髻ｳ讌ｽ', after: 'Spotify縺ｮ繝励Ξ繧､繝ｪ繧ｹ繝井ｽ懊ｊ縺瑚ｶ｣蜻ｳ縲・-POP縺九ｉ繧ｸ繝｣繧ｺ縺ｾ縺ｧ菴輔〒繧り・縺阪∪縺咀沁ｵ' },
    { before: '繧ｲ繝ｼ繝', after: '繧ｹ繧､繝・メ縺ｧ蟇ｾ謌ｦ繧ｲ繝ｼ繝繧・ｋ縺ｮ縺悟･ｽ縺阪ゆｸ邱偵↓繝槭Μ繧ｫ繝ｼ縺ｧ縺阪ｋ莠ｺ縺縺ｨ螫峨＠縺・〒縺咀沁ｮ' },
  ],
  intro: [
    { before: '蜆ｪ縺励＞莠ｺ縺悟･ｽ縺阪〒縺・, after: '縺輔ｊ縺偵↑縺・ｰ鈴▲縺・′縺ｧ縺阪ｋ莠ｺ縺ｫ諠ｹ縺九ｌ縺ｾ縺吶ゅさ繝ｳ繝薙ル縺ｧ縲梧ｸｩ縺九＞縺願幻縺・ｋ・溘阪▲縺ｦ閨槭＞縺ｦ縺上ｌ繧九ｈ縺・↑譁ｹ' },
    { before: '逵溷殴縺ｫ蟀壽ｴｻ縺励※縺ｾ縺・, after: '縲御ｸ邱偵↓縺・※閾ｪ辟ｶ菴薙〒縺・ｉ繧後ｋ莠ｺ縲阪ｒ謗｢縺励※縺ｾ縺吶ら┌逅・○縺夂ｬ代＞蜷医∴繧矩未菫ゅ′逅・Φ縺ｧ縺・ },
    { before: '繧医ｍ縺励￥縺企｡倥＞縺励∪縺・, after: '縺ｾ縺壹・繝｡繝・そ繝ｼ繧ｸ縺ｧ繧・▲縺上ｊ縺願ｩｱ縺励〒縺阪◆繧牙ｬ峨＠縺・〒縺吶よｰ苓ｻｽ縺ｫ縺・＞縺ｭ謚ｼ縺励※縺上□縺輔＞・' },
  ],
}

const messageTemplates = {
  first: [
    '縺ｯ縺倥ａ縺ｾ縺励※・√・繝ｭ繝輔ぅ繝ｼ繝ｫ隱ｭ繧薙〒縲＋hobby}縺悟・騾夂せ縺縺ｪ縺ｨ諤昴▲縺ｦ縺・＞縺ｭ縺励∪縺励◆・',
    '{hobby}螂ｽ縺阪↑繧薙〒縺吶・・∝ヵ・育ｧ・ｼ峨ｂ{hobby}縺ｫ繝上・縺｣縺ｦ縺ｦ窶ｦ縺翫☆縺吶ａ縺ゅ▲縺溘ｉ謨吶∴縺ｦ縺ｻ縺励＞縺ｧ縺呻ｼ・,
    '繝励Ο繝輔ぅ繝ｼ繝ｫ縺ｮ蜀咏悄縲＋comment}縺ｧ縺吶・・＋hobby}螂ｽ縺阪↑縺ｨ縺薙ｍ縺梧ｰ励↓縺ｪ縺｣縺ｦ縺・＞縺ｭ縺励∪縺励◆',
  ],
  reply: [
    '縺昴≧縺ｪ繧薙〒縺吶・・＋topic}縺｣縺ｦ螂･縺梧ｷｱ縺・〒縺吶ｈ縺ｭ縲ゅ■縺ｪ縺ｿ縺ｫ{question}・・,
    '繧上°繧翫∪縺呻ｼ＋topic}縺・＞縺ｧ縺吶ｈ縺ｭ縲ょヵ・育ｧ・ｼ峨・{myThing}縺悟･ｽ縺阪〒窶ｦ{name}縺輔ｓ縺ｯ縺ｩ縺・〒縺吶°・・,
  ],
  dateInvite: [
    '繧ゅ＠繧医￠繧後・縲∽ｻ雁ｺｦ{place}縺ゅ◆繧翫〒{activity}縺励∪縺帙ｓ縺具ｼ溟沽・,
    '{topic}縺ｮ隧ｱ繧ゅ▲縺ｨ閨槭″縺溘＞縺ｮ縺ｧ縲√ｈ縺九▲縺溘ｉ縺願幻縺ｧ繧ゅ←縺・〒縺吶°・毬area}縺ゅ◆繧翫□縺ｨ縺贋ｺ偵＞陦後″繧・☆縺・°縺ｪ縺ｨ',
  ],
}

const datePlans: Record<string, { name: string; flow: string; tip: string }[]> = {
  '蛻昴ョ繝ｼ繝・: [
    { name: '繧ｫ繝輔ぉ ﾃ・謨｣豁ｩ繧ｳ繝ｼ繧ｹ', flow: '笘・縺翫＠繧・ｌ繧ｫ繝輔ぉ縺ｧ縺願幻 竊・垳 霑代￥縺ｮ蜈ｬ蝨偵ｒ謨｣豁ｩ 竊・魂 繧ｹ繧､繝ｼ繝・〒邱繧・, tip: '蛻昴ョ繝ｼ繝医・2-3譎る俣縺後・繧ｹ繝医る聞縺吶℃繧九→逍ｲ繧後ｋ' },
    { name: '鄒手｡馴､ｨ繝ｻ螻戊ｦｧ莨壹さ繝ｼ繧ｹ', flow: '耳 鄒手｡馴､ｨ繝ｻ螻戊ｦｧ莨・竊・笘・菴ｵ險ｭ繧ｫ繝輔ぉ縺ｧ諢滓Φ 竊・鎖・・霑代￥縺ｮ繝ｬ繧ｹ繝医Λ繝ｳ', tip: '螻慕､ｺ迚ｩ縺御ｼ夊ｩｱ縺ｮ繝阪ち縺ｫ縺ｪ繧九・縺ｧ豐磯ｻ吶ｒ驕ｿ縺代ｄ縺吶＞' },
    { name: '繝ｩ繝ｳ繝√ョ繝ｼ繝医さ繝ｼ繧ｹ', flow: '鎖・・莠ｺ豌励・繝ｩ繝ｳ繝√せ繝昴ャ繝・竊・笘・鬟溷ｾ後・繧ｫ繝輔ぉ 竊・寫・・蜻ｨ霎ｺ謨｣遲・, tip: '譏ｼ髢薙〒譏弱ｋ縺・・縺ｧ螳牙ｿ・─縺後≠繧九ゅ♀驟偵↑縺励〒閾ｪ辟ｶ菴薙〒隧ｱ縺帙ｋ' },
  ],
  '2蝗樒岼莉･髯・: [
    { name: '菴馴ｨ灘梛繝・・繝医さ繝ｼ繧ｹ', flow: '識 髯ｶ闃ｸ/繝懊Ν繝繝ｪ繝ｳ繧ｰ/譁咏炊謨吝ｮ､ 竊・鎖・・繝・ぅ繝翫・ 竊・激 螟懈勹繧ｹ繝昴ャ繝・, tip: '蜈ｱ蜷御ｽ懈･ｭ縺ｧ霍晞屬縺御ｸ豌励↓邵ｮ縺ｾ繧・ },
    { name: '鬟溘∋豁ｩ縺阪さ繝ｼ繧ｹ', flow: '今 蝠・ｺ苓｡励・讓ｪ荳√ｒ鬟溘∋豁ｩ縺・竊・瑳 豌励↓縺ｪ縺｣縺溘♀蠎励〒繧・▲縺上ｊ 竊・嫌 繝舌・縺ｧ莉穂ｸ翫￡', tip: '遘ｻ蜍輔＠縺ｪ縺後ｉ縺ｪ縺ｮ縺ｧ縲∽ｼ夊ｩｱ縺碁泌・繧後※繧り・辟ｶ' },
    { name: '繧｢繧ｯ繝・ぅ繝悶ョ繝ｼ繝医さ繝ｼ繧ｹ', flow: '垓 繧ｵ繧､繧ｯ繝ｪ繝ｳ繧ｰ/繝上う繧ｭ繝ｳ繧ｰ 竊・笘・繧ｫ繝輔ぉ縺ｧ莨第・ 竊・鎖・・縺碑､堤ｾ弱ョ繧｣繝翫・', tip: '驕句虚蠕後・縺秘｣ｯ縺ｯ譛鬮倥↓鄒主袖縺励＞縲ょ▼蠎ｷ蠢怜髄繧｢繝斐・繝ｫ縺ｫ繧・ },
  ],
  '險伜ｿｵ譌･': [
    { name: '繝励Ξ繝溘い繝繝・ぅ繝翫・繧ｳ繝ｼ繧ｹ', flow: '氏 繧ｵ繝励Λ繧､繧ｺ繝励Ξ繧ｼ繝ｳ繝・竊・鎖・・莠育ｴ・宛繝ｬ繧ｹ繝医Λ繝ｳ 竊・激 螟懈勹繝峨Λ繧､繝・, tip: '莠育ｴ・・1繝ｶ譛亥燕縺後・繧ｹ繝医らｪ馴圀蟶ｭ繧偵Μ繧ｯ繧ｨ繧ｹ繝・ },
    { name: '譌・｡後さ繝ｼ繧ｹ', flow: '囓 繝峨Λ繧､繝・竊・妾 貂ｩ豕画羅鬢ｨ繝√ぉ繝・け繧､繝ｳ 竊・鎖・・驛ｨ螻矩｣溘ョ繧｣繝翫・', tip: '髱樊律蟶ｸ諢溘′諤昴＞蜃ｺ繧堤音蛻･縺ｫ縺吶ｋ' },
    { name: '繧ｵ繝励Λ繧､繧ｺ菴馴ｨ薙さ繝ｼ繧ｹ', flow: '鹿 隕ｳ蜉・繧ｳ繝ｳ繧ｵ繝ｼ繝・竊・魂 繧ｱ繝ｼ繧ｭ莉倥″繝・ぅ繝翫・ 竊・註 闃ｱ譚溘し繝励Λ繧､繧ｺ', tip: '繝√こ繝・ヨ縺ｯ逶ｸ謇九・螂ｽ縺ｿ繧偵Μ繧ｵ繝ｼ繝√＠縺ｦ' },
  ],
}

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
export default function AiKonkatsuCoach() {
  const [activeTab, setActiveTab] = useState<'profile' | 'message' | 'compat' | 'dateplan' | 'strategy'>('profile')

  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    gender: '逕ｷ諤ｧ', age: '', occupation: '', hobbies: '', selfIntro: '', idealPartner: '',
  })
  const [profileResult, setProfileResult] = useState('')

  // Message state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: '縺薙ｓ縺ｫ縺｡縺ｯ・√Γ繝・そ繝ｼ繧ｸ邱ｴ鄙偵す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ縺ｧ縺咀汳ｬ\n\n縺ｾ縺夂ｷｴ鄙偵＠縺溘＞繧ｷ繝ｼ繝ｳ繧帝∈繧薙〒縺上□縺輔＞・喀n\n1・鞘Ε 蛻晏屓繝｡繝・そ繝ｼ繧ｸ縺ｮ邱ｴ鄙箪n2・鞘Ε 霑比ｿ｡縺ｮ邱ｴ鄙箪n3・鞘Ε 繝・・繝医・隱倥＞譁ｹ' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatScene, setChatScene] = useState<'select' | 'first' | 'reply' | 'invite'>('select')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Compat state
  const [compatAnswers, setCompatAnswers] = useState<Record<string, number>>({})
  const [compatResult, setCompatResult] = useState<{ score: number; type: string; description: string; strengths: string[]; advice: string[] } | null>(null)

  // Date plan state
  const [datePlan, setDatePlan] = useState<DatePlanInput>({
    area: '', budget: '3000-5000', partnerHobbies: '', scene: '蛻昴ョ繝ｼ繝・, season: '譏･',
  })

  // Strategy state
  const [stats, setStats] = useState<ActivityStats>({
    matchCount: 0, dateCount: 0, messageResponseRate: 0, profileViewCount: 0, period: '1繝ｶ譛・,
  })
  const [strategyResult, setStrategyResult] = useState('')

  const tabs = [
    { id: 'profile' as const, label: '笨擾ｸ・繝励Ο繝輔ぅ繝ｼ繝ｫ豺ｻ蜑・ },
    { id: 'message' as const, label: '町 繝｡繝・そ繝ｼ繧ｸ邱ｴ鄙・ },
    { id: 'compat' as const, label: '投 逶ｸ諤ｧ險ｺ譁ｭ' },
    { id: 'dateplan' as const, label: '欄・・繝・・繝医・繝ｩ繝ｳ' },
    { id: 'strategy' as const, label: '嶋 蟀壽ｴｻ謌ｦ逡･' },
  ]

  // 笏笏笏 Profile Logic 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
  const analyzeProfile = useCallback(() => {
    const results: string[] = []
    results.push('笏≫煤笏・繝励Ο繝輔ぅ繝ｼ繝ｫ豺ｻ蜑顔ｵ先棡 笏≫煤笏―n')

    // Analyze hobbies
    if (profile.hobbies) {
      results.push('縲占ｶ｣蜻ｳ縺ｮ謾ｹ蝟・署譯医・)
      const hobbies = profile.hobbies.split(/[縲・・珪/).map(h => h.trim())
      hobbies.forEach(hobby => {
        const match = profileTemplates.hobbies.find(t => hobby.includes(t.before.replace(/[繝ｻ]/g, '')))
        if (match) {
          results.push(`笶・Before: 縲・{hobby}縲港)
          results.push(`笨・After:  縲・{match.after}縲構n`)
        } else {
          results.push(`庁縲・{hobby}縲坂・ 蜈ｷ菴鍋噪縺ｪ繧ｨ繝斐た繝ｼ繝峨ｄ謨ｰ蟄励ｒ蜈･繧後ｋ縺ｨ鬲・鴨UP`)
          results.push(`   萓・ 縲・{hobby}縺悟･ｽ縺阪坂・縲碁ｱ譛ｫ縺ｯ${hobby}繧呈･ｽ縺励ｓ縺ｧ縺ｾ縺吶よ怙霑代・笳銀雷縺ｫ繝上・繧贋ｸｭ縲構n`)
        }
      })
    }

    // Analyze self intro
    if (profile.selfIntro) {
      results.push('縲占・蟾ｱ邏ｹ莉九・謾ｹ蝟・署譯医・)
      let improved = false
      profileTemplates.intro.forEach(t => {
        if (profile.selfIntro.includes(t.before)) {
          results.push(`笶・Before: 縲・{t.before}縲港)
          results.push(`笨・After:  縲・{t.after}縲構n`)
          improved = true
        }
      })
      if (!improved) {
        results.push('笨・蝓ｺ譛ｬ逧・↑蜀・ｮｹ縺ｯOK縺ｧ縺呻ｼ√＆繧峨↓濶ｯ縺上☆繧九・繧､繝ｳ繝茨ｼ・)
        results.push('  繝ｻ蜈ｷ菴鍋噪縺ｪ繧ｨ繝斐た繝ｼ繝峨ｒ1縺､霑ｽ蜉縺吶ｋ')
        results.push('  繝ｻ縲御ｸ邱偵↓笳銀雷縺励◆縺・阪〒邱繧√ｋ縺ｨ縲√ョ繝ｼ繝医・繧､繝｡繝ｼ繧ｸ縺梧ｹｧ縺阪ｄ縺吶＞')
        results.push('  繝ｻ邨ｵ譁・ｭ励ｒ1-2蛟区ｷｻ縺医ｋ縺ｨ隕ｪ縺励∩繧・☆縺俵P\n')
      }
    }

    // General tips
    results.push('縲舌・繝ｭ繝輔ぅ繝ｼ繝ｫ蜈ｨ菴薙・繧ｹ繧ｳ繧｢縲・)
    let score = 50
    if (profile.hobbies.length > 10) score += 10
    if (profile.selfIntro.length > 50) score += 15
    if (profile.selfIntro.includes('・・) || profile.selfIntro.includes('・')) score += 5
    if (profile.idealPartner.length > 20) score += 10
    if (profile.occupation) score += 10
    score = Math.min(score, 100)

    const bar = '笆・.repeat(Math.floor(score / 5)) + '笆・.repeat(20 - Math.floor(score / 5))
    results.push(`[${bar}] ${score}/100轤ｹ\n`)

    if (score < 70) {
      results.push('庁 謾ｹ蝟・・繧､繝ｳ繝茨ｼ・)
      if (profile.selfIntro.length < 50) results.push('  繝ｻ閾ｪ蟾ｱ邏ｹ莉九ｒ100譁・ｭ嶺ｻ･荳翫↓・育樟蝨ｨ: ' + profile.selfIntro.length + '譁・ｭ暦ｼ・)
      if (!profile.idealPartner) results.push('  繝ｻ逅・Φ縺ｮ逶ｸ謇句ワ繧呈嶌縺上→繝槭ャ繝√Φ繧ｰ邊ｾ蠎ｦUP')
      if (profile.hobbies.split(/[縲・]/).length < 3) results.push('  繝ｻ雜｣蜻ｳ縺ｯ3縺､莉･荳頑嶌縺上→隧ｱ鬘後′蠎・′繧翫ｄ縺吶＞')
    }

    results.push('\n鋳 繝励Ο縺ｮ豺ｻ蜑翫ｒ蜿励￠縺溘＞譁ｹ縺ｯ 竊・marriage-road.jp')

    setProfileResult(results.join('\n'))
  }, [profile])

  // 笏笏笏 Message Logic 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
  const handleChat = useCallback(() => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')

    const newMessages: ChatMessage[] = [{ role: 'user', text: userMsg }]

    if (chatScene === 'select') {
      if (userMsg.includes('1') || userMsg.includes('蛻晏屓')) {
        newMessages.push({ role: 'ai', text: '蛻晏屓繝｡繝・そ繝ｼ繧ｸ縺ｮ邱ｴ鄙偵〒縺吶・・―n\n逶ｸ謇九・繝励Ο繝輔ぅ繝ｼ繝ｫ縺ｫ縺ゅｋ雜｣蜻ｳ繧・縺､謨吶∴縺ｦ縺上□縺輔＞縲・n・井ｾ・ 繧ｫ繝輔ぉ蟾｡繧翫∵丐逕ｻ髑題ｳ槭∵羅陦・..・・ })
        setChatScene('first')
      } else if (userMsg.includes('2') || userMsg.includes('霑比ｿ｡')) {
        newMessages.push({ role: 'ai', text: '霑比ｿ｡縺ｮ邱ｴ鄙偵〒縺吶・・―n\n逶ｸ謇九°繧画擂縺溘Γ繝・そ繝ｼ繧ｸ繧貞・蜉帙＠縺ｦ縺上□縺輔＞縲・n縺昴ｌ縺ｫ蟇ｾ縺吶ｋ霑比ｿ｡繧偵い繝峨ヰ繧､繧ｹ縺励∪縺呻ｼ・ })
        setChatScene('reply')
      } else if (userMsg.includes('3') || userMsg.includes('繝・・繝・) || userMsg.includes('隱・)) {
        newMessages.push({ role: 'ai', text: '繝・・繝医・隱倥＞譁ｹ縺ｧ縺吶・・―n\n逶ｸ謇九→菴輔・隧ｱ縺ｧ逶帙ｊ荳翫′縺｣縺ｦ縺・∪縺吶°・歃n・井ｾ・ 繧ｫ繝輔ぉ縺ｮ隧ｱ縲∵丐逕ｻ縺ｮ隧ｱ縲∵羅陦後・隧ｱ...・・ })
        setChatScene('invite')
      } else {
        newMessages.push({ role: 'ai', text: '逡ｪ蜿ｷ縺ｧ驕ｸ繧薙〒縺上□縺輔＞・\n\n1・鞘Ε 蛻晏屓繝｡繝・そ繝ｼ繧ｸ縺ｮ邱ｴ鄙箪n2・鞘Ε 霑比ｿ｡縺ｮ邱ｴ鄙箪n3・鞘Ε 繝・・繝医・隱倥＞譁ｹ' })
      }
    } else if (chatScene === 'first') {
      const templates = messageTemplates.first.map(t => t.replace('{hobby}', userMsg).replace('{comment}', '縺吶＃縺乗･ｽ縺励◎縺・))
      const response = `濶ｯ縺・〒縺吶・・√・{userMsg}縲阪ｒ菴ｿ縺｣縺溷・蝗槭Γ繝・そ繝ｼ繧ｸ縺ｮ萓具ｼ喀n\n${templates.map((t, i) => `${i + 1}. 縲・{t}縲港).join('\n\n')}\n\n庁 繝昴う繝ｳ繝茨ｼ喀n繝ｻ蜈ｱ騾夂せ繧偵い繝斐・繝ｫ\n繝ｻ雉ｪ蝠上〒邨ゅｏ繧九→霑比ｿ｡邇ⅡP\n繝ｻ邨ｵ譁・ｭ励・1-2蛟九′笳趣ｼ亥､壹☆縺弱ｋ縺ｨ繝√Ε繝ｩ縺・魂雎｡縺ｫ・噂n\n蛻･縺ｮ雜｣蜻ｳ縺ｧ隧ｦ縺吝ｴ蜷医・縺昴・縺ｾ縺ｾ蜈･蜉帙＠縺ｦ縺上□縺輔＞縲・n譛蛻昴・驕ｸ謚槭↓謌ｻ繧九↓縺ｯ縲梧綾繧九阪→蜈･蜉帙Ａ
      newMessages.push({ role: 'ai', text: response })
      if (userMsg === '謌ｻ繧・) setChatScene('select')
    } else if (chatScene === 'reply') {
      const response = `逶ｸ謇九・繝｡繝・そ繝ｼ繧ｸ・壹・{userMsg}縲構n\n統 霑比ｿ｡縺ｮ繝昴う繝ｳ繝茨ｼ喀n\n1. 蜈ｱ諢・竊・縲後ｏ縺九ｊ縺ｾ縺呻ｼ√阪後＞縺・〒縺吶・・√阪〒蜿励￠豁｢繧√ｋ\n2. 閾ｪ蛻・・隧ｱ繧貞ｰ代＠ 竊・逶ｸ謇九・隧ｱ鬘後↓髢｢騾｣縺励◆閾ｪ蛻・・邨碁ｨ貼n3. 雉ｪ蝠上〒霑斐☆ 竊・莨夊ｩｱ縺ｮ繧ｭ繝｣繝・メ繝懊・繝ｫ繧堤ｶ壹￠繧欺n\n庁 霑比ｿ｡萓具ｼ喀n縲・{userMsg.slice(0, 10)}窶ｦ縺｣縺ｦ邏謨ｵ縺ｧ縺吶・・∝ヵ・育ｧ・ｼ峨ｂ螳溘・闊亥袖縺後≠縺｣縺ｦ窶ｦ縺翫☆縺吶ａ縺ｨ縺九≠繧翫∪縺吶°・溘構n\n笞・・NG繝昴う繝ｳ繝茨ｼ喀n繝ｻ縲後∈繝ｼ縲阪後◎縺・↑繧薙□縲阪□縺代・霑比ｿ｡\n繝ｻ閾ｪ蛻・・隧ｱ縺ｰ縺九ｊ縺吶ｋ\n繝ｻ譌｢隱ｭ縺九ｉ霑比ｿ｡縺ｾ縺ｧ菴墓律繧らｩｺ縺代ｋ\n\n蛻･縺ｮ繝｡繝・そ繝ｼ繧ｸ縺ｧ邱ｴ鄙偵☆繧句ｴ蜷医・縺昴・縺ｾ縺ｾ蜈･蜉幢ｼ―n縲梧綾繧九阪〒譛蛻昴↓謌ｻ繧翫∪縺吶Ａ
      newMessages.push({ role: 'ai', text: response })
      if (userMsg === '謌ｻ繧・) setChatScene('select')
    } else if (chatScene === 'invite') {
      const templates = messageTemplates.dateInvite.map(t =>
        t.replace('{topic}', userMsg).replace('{place}', '鬧・燕').replace('{activity}', '縺願幻').replace('{area}', '縺薙・縺ゅ◆繧・)
      )
      const response = `縲・{userMsg}縲阪〒逶帙ｊ荳翫′縺｣縺ｦ繧九ｓ縺ｧ縺吶・・―n\n繝・・繝医・隱倥＞譁ｹ萓具ｼ喀n\n${templates.map((t, i) => `${i + 1}. 縲・{t}縲港).join('\n\n')}\n\n庁 謌仙粥邇・ｒ荳翫￡繧九・繧､繝ｳ繝茨ｼ喀n繝ｻ蜈ｷ菴鍋噪縺ｪ蝣ｴ謇縺ｨ譌･譎ゅｒ謠先｡医☆繧欺n繝ｻ縲後ｂ縺励ｈ縺代ｌ縺ｰ縲阪〒繝ｯ繝ｳ繧ｯ繝・す繝ｧ繝ｳ\n繝ｻ譁ｭ繧翫ｄ縺吶＞髮ｰ蝗ｲ豌励ｂ螟ｧ蛻・ｼ医悟ｿ吶＠縺九▲縺溘ｉ蜈ｨ辟ｶ螟ｧ荳亥､ｫ縺ｧ縺呻ｼ√搾ｼ噂n繝ｻ譏ｼ繝・・繝医・譁ｹ縺薫K縺輔ｌ繧・☆縺Ыn\n縲梧綾繧九阪〒譛蛻昴↓謌ｻ繧翫∪縺吶Ａ
      newMessages.push({ role: 'ai', text: response })
      if (userMsg === '謌ｻ繧・) setChatScene('select')
    }

    setChatMessages(prev => [...prev, ...newMessages])
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [chatInput, chatScene])

  // 笏笏笏 Compat Logic 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
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
      type = '猪 繧｢繧ｯ繝・ぅ繝悶・繝代・繝医リ繝ｼ繧ｷ繝・・蝙・
      description = '遨肴･ｵ逧・〒縲√ヱ繝ｼ繝医リ繝ｼ縺ｨ螟壹￥縺ｮ縺薙→繧貞・譛峨＠縺溘＞繧ｿ繧､繝励ゆｸ邱偵↓謌宣聞縺励※縺・￥髢｢菫ゅｒ驥崎ｦ悶・
      strengths.push('繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ蜉帙′鬮倥＞', '陦悟虚蜉帙′縺ゅｋ', '逶ｸ謇九∈縺ｮ髢｢蠢・′蠑ｷ縺・)
      advice.push('逶ｸ謇九・繝壹・繧ｹ繧ょｰ企㍾縺吶ｋ', '荳莠ｺ縺ｮ譎る俣繧ょ､ｧ蛻・↓縺吶ｋ')
    } else if (totalAvg >= 3) {
      type = '諺 繝舌Λ繝ｳ繧ｹ繝ｻ繝上・繝｢繝九・蝙・
      description = '繝舌Λ繝ｳ繧ｹ縺ｮ蜿悶ｌ縺溯・∴譁ｹ縺ｮ謖√■荳ｻ縲ゅ♀莠偵＞縺ｮ諢剰ｦ九ｒ蟆企㍾縺励↑縺後ｉ縲∫ｩ上ｄ縺九↑髢｢菫ゅｒ遽峨￠繧九・
      strengths.push('譟碑ｻ滓ｧ縺後≠繧・, '逶ｸ謇九↓蜷医ｏ縺帙ｉ繧後ｋ', '螳牙ｮ壹＠縺滄未菫ゅｒ遽峨￠繧・)
      advice.push('閾ｪ蛻・・諢剰ｦ九ｂ繧ゅ▲縺ｨ莨昴∴繧・, '螯･蜊斐＠縺吶℃縺ｪ縺・ｈ縺・ｳｨ諢・)
    } else {
      type = '諸・・迢ｬ遶九・繝ｪ繧ｹ繝壹け繝亥梛'
      description = '蛟倶ｺｺ縺ｮ譎る俣繧・せ繝壹・繧ｹ繧貞､ｧ蛻・↓縺吶ｋ繧ｿ繧､繝励ゅ♀莠偵＞縺ｮ閾ｪ遶九ｒ蟆企㍾縺吶ｋ髢｢菫ゅ′逅・Φ縲・
      strengths.push('閾ｪ遶九＠縺ｦ縺・ｋ', '逶ｸ謇九↓萓晏ｭ倥＠縺ｪ縺・, '繧ｯ繝ｼ繝ｫ縺ｧ螳牙ｮ壹＠縺ｦ縺・ｋ')
      advice.push('諢滓ュ繧偵ｂ縺・ｰ代＠繧ｪ繝ｼ繝励Φ縺ｫ', '逶ｸ謇九°繧峨・諢帶ュ陦ｨ迴ｾ縺ｫ繧ょｿ懊∴繧・)
    }

    const score = Math.round(totalAvg * 20)

    setCompatResult({ score, type, description, strengths, advice })
  }, [compatAnswers])

  // 笏笏笏 Strategy Logic 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
  const analyzeStrategy = useCallback(() => {
    const results: string[] = []
    results.push('笏≫煤笏・蟀壽ｴｻ謌ｦ逡･蛻・梵繝ｬ繝昴・繝・笏≫煤笏―n')

    const { matchCount, dateCount, messageResponseRate, profileViewCount, period } = stats

    // Match rate analysis
    if (profileViewCount > 0 && matchCount > 0) {
      const matchRate = (matchCount / profileViewCount * 100).toFixed(1)
      results.push(`投 繝槭ャ繝√Φ繧ｰ邇・ ${matchRate}%`)
      if (Number(matchRate) < 5) {
        results.push('  竊・笞・・蟷ｳ蝮・ｻ･荳九ゅ・繝ｭ繝輔ぅ繝ｼ繝ｫ蜀咏悄縺ｨ閾ｪ蟾ｱ邏ｹ莉九・謾ｹ蝟・′諤･蜍・)
        results.push('  竊・庁 繝励Ο繝輔ぅ繝ｼ繝ｫ豺ｻ蜑翫ち繝悶〒謾ｹ蝟・＠縺ｾ縺励ｇ縺・n')
      } else if (Number(matchRate) < 15) {
        results.push('  竊・総 蟷ｳ蝮・噪縲ゅ＆繧峨↓荳翫ｒ逶ｮ謖・☆縺ｪ繧牙・逵溘・雉ｪ繧剃ｸ翫￡縺ｾ縺励ｇ縺・n')
      } else {
        results.push('  竊・脂 蜆ｪ遘・√・繝ｭ繝輔ぅ繝ｼ繝ｫ縺ｮ鬲・鴨縺御ｼ昴ｏ縺｣縺ｦ縺・∪縺兔n')
      }
    }

    // Date conversion
    if (matchCount > 0) {
      const dateRate = (dateCount / matchCount * 100).toFixed(1)
      results.push(`投 繝・・繝亥ｮ溽樟邇・ ${dateRate}%・・{matchCount}繝槭ャ繝・竊・${dateCount}繝・・繝茨ｼ荏)
      if (Number(dateRate) < 10) {
        results.push('  竊・笞・・繝｡繝・そ繝ｼ繧ｸ縺九ｉ繝・・繝医∈縺ｮ隱伜ｰ弱′隱ｲ鬘・)
        results.push('  竊・庁 繝｡繝・そ繝ｼ繧ｸ邱ｴ鄙偵ち繝悶〒縲後ョ繝ｼ繝医・隱倥＞譁ｹ縲阪ｒ邱ｴ鄙抵ｼ・)
        results.push('  竊・庁 繝槭ャ繝∝ｾ・譌･莉･蜀・↓繝・・繝医ｒ謠先｡医☆繧九・縺碁ｻ・≡繝ｫ繝ｼ繝ｫ\n')
      } else if (Number(dateRate) < 30) {
        results.push('  竊・総 謔ｪ縺上↑縺・〒縺吶′謾ｹ蝟・・菴吝慍縺ゅｊ')
        results.push('  竊・庁 蜈ｷ菴鍋噪縺ｪ譌･譎ゅ→蝣ｴ謇繧呈署譯医☆繧九→螳溽樟邇ⅡP\n')
      } else {
        results.push('  竊・脂 邏譎ｴ繧峨＠縺・ｼ√Γ繝・そ繝ｼ繧ｸ蜉帙′鬮倥＞縺ｧ縺兔n')
      }
    }

    // Response rate
    results.push(`投 繝｡繝・そ繝ｼ繧ｸ霑比ｿ｡邇・ ${messageResponseRate}%`)
    if (messageResponseRate < 30) {
      results.push('  竊・笞・・蛻晏屓繝｡繝・そ繝ｼ繧ｸ縺ｮ雉ｪ繧呈隼蝟・＠縺ｾ縺励ｇ縺・)
      results.push('  竊・庁 繝・Φ繝励Ξ諢溘・縺ｪ縺・Γ繝・そ繝ｼ繧ｸ縺碁嵯縲ら嶌謇九・繝励Ο繝輔ぅ繝ｼ繝ｫ縺ｫ隗ｦ繧後ｋ縺薙→\n')
    } else if (messageResponseRate < 60) {
      results.push('  竊・総 蟷ｳ蝮・噪縲ょ句挨蛹悶＠縺溘Γ繝・そ繝ｼ繧ｸ縺ｧ縺輔ｉ縺ｫUP\n')
    } else {
      results.push('  竊・脂 鬮倥＞霑比ｿ｡邇・ｼ√Γ繝・そ繝ｼ繧ｸ縺ｮ繧ｻ繝ｳ繧ｹ縺瑚憶縺・〒縺兔n')
    }

    // Action plan
    results.push('笏≫煤笏・繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝励Λ繝ｳ 笏≫煤笏―n')
    results.push(`套 ${period}縺ｮ豢ｻ蜍暮㍼繧貞渕縺ｫ縺励◆謾ｹ蝟・・繝ｩ繝ｳ・喀n`)

    const actions: string[] = []
    if (profileViewCount < 50) actions.push('1. 繝励Ο繝輔ぅ繝ｼ繝ｫ蜀咏悄繧・譫壻ｻ･荳翫↓蠅励ｄ縺呻ｼ医Γ繧､繝ｳ + 繧ｵ繝・譫夲ｼ・)
    if (matchCount < 5) actions.push('2. 縺・＞縺ｭ謨ｰ繧貞｢励ｄ縺呻ｼ・譌･10莉ｶ逶ｮ讓呻ｼ峨ゅΟ繧ｰ繧､繝ｳ繝懊・繝翫せ繧ょｿ倥ｌ縺壹↓')
    if (messageResponseRate < 50) actions.push('3. 蛻晏屓繝｡繝・そ繝ｼ繧ｸ繧貞句挨蛹悶☆繧具ｼ医ユ繝ｳ繝励Ξ遖∵ｭ｢・・ｼ・)
    if (dateCount === 0) actions.push('4. 繝槭ャ繝∝ｾ・譌･莉･蜀・↓縲後♀闌ｶ縺励∪縺帙ｓ縺具ｼ溘阪ｒ騾√ｋ')

    if (actions.length === 0) {
      actions.push('聡 蜈ｨ菴鍋噪縺ｫ濶ｯ縺・焚蟄励〒縺呻ｼ∽ｻ翫・繝壹・繧ｹ繧堤ｶｭ謖√＠縺ｾ縺励ｇ縺・)
      actions.push('庁 縺輔ｉ縺ｫ荳翫ｒ逶ｮ謖・☆縺ｪ繧峨∫ｵ仙ｩ夂嶌隲・園縺ｨ縺ｮ菴ｵ逕ｨ繧よ､懆ｨ弱ｒ')
    }

    results.push(actions.join('\n'))
    results.push('\n\n鋳 繝励Ο縺ｮ繧｢繝峨ヰ繧､繧ｹ縺悟ｿ・ｦ√↑譁ｹ縺ｯ 竊・marriage-road.jp')

    setStrategyResult(results.join('\n'))
  }, [stats])

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl mb-2">瀦</div>
              <h1 className="text-2xl font-bold">AI蟀壽ｴｻ繧ｳ繝ｼ繝・/h1>
              <p className="text-gray-400 mt-1">繝励Ο繝輔ぅ繝ｼ繝ｫ豺ｻ蜑・ﾃ・繝｡繝・そ繝ｼ繧ｸ邱ｴ鄙・ﾃ・逶ｸ諤ｧ險ｺ譁ｭ</p>
            </div>
            <a
              href="https://www.marriage-road.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-sm font-medium transition-colors"
            >
              鋳 繝槭Ξ繝・ず繝ｭ繝ｼ繝峨ず繝｣繝代Φ
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

        {/* 笏笏笏 Profile Tab 笏笏笏 */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">笨擾ｸ・繝励Ο繝輔ぅ繝ｼ繝ｫ豺ｻ蜑晦I</h2>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">諤ｧ蛻･</label>
                    <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value as any }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                      <option>逕ｷ諤ｧ</option><option>螂ｳ諤ｧ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">蟷ｴ鮨｢</label>
                    <input type="text" placeholder="32" value={profile.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">閨ｷ讌ｭ</label>
                  <input type="text" placeholder="IT莨∵･ｭ蜍､蜍・ value={profile.occupation} onChange={e => setProfile(p => ({ ...p, occupation: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">雜｣蜻ｳ・医き繝ｳ繝槫玄蛻・ｊ・・/label>
                  <input type="text" placeholder="譏逕ｻ髑題ｳ槭√き繝輔ぉ蟾｡繧翫∵羅陦・ value={profile.hobbies} onChange={e => setProfile(p => ({ ...p, hobbies: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">閾ｪ蟾ｱ邏ｹ莉区枚</label>
                  <textarea placeholder="繝励Ο繝輔ぅ繝ｼ繝ｫ縺ｫ譖ｸ縺・※縺・ｋ閾ｪ蟾ｱ邏ｹ莉九ｒ縺昴・縺ｾ縺ｾ雋ｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞" value={profile.selfIntro} onChange={e => setProfile(p => ({ ...p, selfIntro: e.target.value }))} rows={4} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">逅・Φ縺ｮ逶ｸ謇句ワ</label>
                  <textarea placeholder="縺ｩ繧薙↑譁ｹ縺ｨ蜃ｺ莨壹＞縺溘＞縺ｧ縺吶°・・ value={profile.idealPartner} onChange={e => setProfile(p => ({ ...p, idealPartner: e.target.value }))} rows={2} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none resize-none" />
                </div>
                <button onClick={analyzeProfile} className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
                  笨ｨ AI縺ｧ豺ｻ蜑翫☆繧・                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">豺ｻ蜑顔ｵ先棡</h2>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 min-h-[400px]">
                {profileResult ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">{profileResult}</pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    <p>蟾ｦ縺ｮ繝輔か繝ｼ繝縺ｫ蜈･蜉帙＠縺ｦ縲窟I縺ｧ豺ｻ蜑翫☆繧九阪ｒ繧ｯ繝ｪ繝・け</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 笏笏笏 Message Tab 笏笏笏 */}
        {activeTab === 'message' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold">町 繝｡繝・そ繝ｼ繧ｸ邱ｴ鄙偵す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</h2>
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
                placeholder="繝｡繝・そ繝ｼ繧ｸ繧貞・蜉・.."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-pink-500 focus:outline-none"
              />
              <button onClick={handleChat} className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
                騾∽ｿ｡
              </button>
            </div>
          </div>
        )}

        {/* 笏笏笏 Compat Tab 笏笏笏 */}
        {activeTab === 'compat' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">投 逶ｸ諤ｧ險ｺ譁ｭ繝ｻ逅・Φ縺ｮ逶ｸ謇句ワ蛻・梵</h2>
            <p className="text-gray-400 text-sm">莉･荳九・雉ｪ蝠上↓1・亥・縺上◎縺・昴ｏ縺ｪ縺・ｼ峨・・医→縺ｦ繧ゅ◎縺・昴≧・峨〒蝗樒ｭ斐＠縺ｦ縺上□縺輔＞</p>

            {!compatResult ? (
              <>
                {['邨仙ｩ夊ｦｳ', '萓｡蛟､隕ｳ', '繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ', '繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ'].map(category => (
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
                            <span>縺昴≧諤昴ｏ縺ｪ縺・/span><span>縺昴≧諤昴≧</span>
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
                  險ｺ譁ｭ縺吶ｋ・・Object.keys(compatAnswers).length}/{compatQuestions.length}蝠丞屓遲疲ｸ医∩・・                </button>
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
                    <h3 className="font-bold text-green-400 mb-3">笨・縺ゅ↑縺溘・蠑ｷ縺ｿ</h3>
                    <ul className="space-y-2">
                      {compatResult.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2"><span className="text-green-400">窶｢</span> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-amber-500/30 p-6">
                    <h3 className="font-bold text-amber-400 mb-3">庁 繧｢繝峨ヰ繧､繧ｹ</h3>
                    <ul className="space-y-2">
                      {compatResult.advice.map((a, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2"><span className="text-amber-400">窶｢</span> {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button onClick={() => { setCompatResult(null); setCompatAnswers({}) }} className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">
                  繧ゅ≧荳蠎ｦ險ｺ譁ｭ縺吶ｋ
                </button>
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Date Plan Tab 笏笏笏 */}
        {activeTab === 'dateplan' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">欄・・繝・・繝医・繝ｩ繝ｳAI</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">繧ｷ繝ｼ繝ｳ</label>
                  <select value={datePlan.scene} onChange={e => setDatePlan(p => ({ ...p, scene: e.target.value as any }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                    <option>蛻昴ョ繝ｼ繝・/option><option>2蝗樒岼莉･髯・/option><option>險伜ｿｵ譌･</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">繧ｨ繝ｪ繧｢</label>
                  <input type="text" placeholder="讓ｪ豬懊∵ｸ玖ｰｷ縲∵眠螳ｿ..." value={datePlan.area} onChange={e => setDatePlan(p => ({ ...p, area: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">莠育ｮ・/label>
                  <select value={datePlan.budget} onChange={e => setDatePlan(p => ({ ...p, budget: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                    <option value="1000-3000">ﾂ･1,000縲・,000</option>
                    <option value="3000-5000">ﾂ･3,000縲・,000</option>
                    <option value="5000-10000">ﾂ･5,000縲・0,000</option>
                    <option value="10000+">ﾂ･10,000縲・/option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(datePlans[datePlan.scene] || datePlans['蛻昴ョ繝ｼ繝・]).map((plan, i) => (
                <div key={i} className="bg-[#13131e] rounded-xl border border-gray-800 p-6 hover:border-pink-500/30 transition-colors">
                  <div className="text-2xl mb-3">{'・・条氤ｱ・条氤ｲ・・[i] || '桃'}</div>
                  <h3 className="font-bold text-lg mb-3">{plan.name}</h3>
                  <div className="text-sm text-gray-400 mb-4 space-y-1">
                    {plan.flow.split(' 竊・').map((step, j) => (
                      <p key={j}>{j > 0 ? '竊・' : ''}{step}</p>
                    ))}
                  </div>
                  <div className="bg-amber-500/10 rounded-lg p-3 text-xs text-amber-300">
                    庁 {plan.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 笏笏笏 Strategy Tab 笏笏笏 */}
        {activeTab === 'strategy' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">嶋 蟀壽ｴｻ謌ｦ逡･繧ｳ繝ｼ繝・/h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">繝励Ο繝輔ぅ繝ｼ繝ｫ髢ｲ隕ｧ謨ｰ</label>
                  <input type="number" placeholder="100" value={stats.profileViewCount || ''} onChange={e => setStats(s => ({ ...s, profileViewCount: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">繝槭ャ繝∵焚</label>
                  <input type="number" placeholder="10" value={stats.matchCount || ''} onChange={e => setStats(s => ({ ...s, matchCount: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">繝｡繝・そ繝ｼ繧ｸ霑比ｿ｡邇・ｼ・・・/label>
                  <input type="number" placeholder="40" value={stats.messageResponseRate || ''} onChange={e => setStats(s => ({ ...s, messageResponseRate: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">繝・・繝亥ｮ溽樟謨ｰ</label>
                  <input type="number" placeholder="2" value={stats.dateCount || ''} onChange={e => setStats(s => ({ ...s, dateCount: Number(e.target.value) }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">髮・ｨ域悄髢・/label>
                <select value={stats.period} onChange={e => setStats(s => ({ ...s, period: e.target.value }))} className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none">
                  <option>1騾ｱ髢・/option><option>1繝ｶ譛・/option><option>3繝ｶ譛・/option><option>6繝ｶ譛・/option>
                </select>
              </div>
              <button onClick={analyzeStrategy} className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors">
                投 謌ｦ逡･繧貞・譫舌☆繧・              </button>
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
          <p className="text-gray-500 text-sm mb-2">譛ｬ譬ｼ逧・↑繧ｵ繝昴・繝医′蠢・ｦ√↑譁ｹ縺ｸ</p>
          <a
            href="https://www.marriage-road.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium transition-colors"
          >
            鋳 邨仙ｩ夂嶌隲・園 繝槭Ξ繝・ず繝ｭ繝ｼ繝峨ず繝｣繝代Φ 竊・          </a>
        </div>
      </div>
    
      </div>
  )
}




