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
  { id: 'review', icon: '町', label: '繝｡繝・そ繝ｼ繧ｸ豺ｻ蜑・ },
  { id: 'psychology', icon: 'ｧ', label: '蠢・炊蟄ｦ隰帛ｺｧ' },
  { id: 'diagnosis', icon: '投', label: '繧ｳ繝溘Η險ｺ譁ｭ' },
  { id: 'planner', icon: '欄・・, label: '莨夊ｩｱ繝励Λ繝ｳ繝翫・' },
  { id: 'examples', icon: '当', label: 'NG髮・ｼ・K髮・ },
  { id: 'support', icon: '唱', label: '逶ｸ隲・ｪ灘哨' },
]

const SCENES: { id: Scene; label: string; emoji: string }[] = [
  { id: 'romance', label: '諱区・', emoji: '酎' },
  { id: 'business', label: '繝薙ず繝阪せ', emoji: '直' },
  { id: 'friend', label: '蜿倶ｺｺ', emoji: '､・ },
  { id: 'sns', label: 'SNS', emoji: '導' },
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
  const hasExclamation = text.includes('・・) || text.includes('!')
  const hasQuestion = text.includes('・・) || text.includes('?')
  const hasEmoji = /[\uD83C-\uD83E]/.test(text)
  const hasLineBreak = text.includes('\n')
  const hasFormalWords = /縺ｧ縺處縺ｾ縺處縺斐＊縺・∪縺處縺・◆縺励∪縺處蟄倥§縺ｾ縺・.test(text)
  const hasCasualWords = /縺繧・縺縺ｭ|縺倥ｃ繧倒縺｣縺励ｇ|隨掃・慾ww|闕・.test(text)
  const hasApology = /縺吶∩縺ｾ縺帙ｓ|縺斐ａ繧倒逕ｳ縺苓ｨｳ|縺吶＞縺ｾ縺帙ｓ/.test(text)
  const hasThanks = /縺ゅｊ縺後→縺・諢溯ｬ掟蜉ｩ縺九ｊ/.test(text)
  const hasNegative = /雖後＞|縺・＊縺л繧縺九▽縺楯豁ｻ縺ｭ|豸医∴繧鋼繧ｭ繝｢縺л繧ｦ繧ｶ縺・.test(text)
  const hasSelfDeprecating = /縺ｩ縺・○|遘√↑繧薙°|蜒輔↑繧薙※|辟｡逅・□|繝繝｡縺ｪ/.test(text)

  // Warmth (貂ｩ縺九＆)
  let warmth = 50
  if (hasEmoji) warmth += 10
  if (hasExclamation) warmth += 8
  if (hasThanks) warmth += 15
  if (hasCasualWords) warmth += 5
  if (hasNegative) warmth -= 25
  if (hasSelfDeprecating) warmth -= 10
  if (hasFormalWords && scene === 'romance') warmth -= 5

  // Clarity (譏守｢ｺ縺・
  let clarity = 50
  if (len > 10 && len < 200) clarity += 15
  if (hasLineBreak && len > 50) clarity += 10
  if (hasQuestion) clarity += 5
  if (len > 300) clarity -= 10
  if (len < 5) clarity -= 20

  // Weight (驥阪＆ 窶・lower is better)
  let weight = 30
  if (len > 200) weight += 15
  if (len > 400) weight += 20
  if (hasApology && !hasThanks) weight += 10
  if (hasSelfDeprecating) weight += 20
  if (text.split('・・).length > 3 || text.split('?').length > 3) weight += 15
  if (hasNegative) weight += 15

  // Appropriateness (蝣ｴ髱｢驕ｩ蜷亥ｺｦ)
  let appropriate = 60
  if (scene === 'business' && hasFormalWords) appropriate += 20
  if (scene === 'business' && hasCasualWords) appropriate -= 20
  if (scene === 'romance' && hasCasualWords) appropriate += 10
  if (scene === 'romance' && hasFormalWords && len > 100) appropriate -= 10
  if (scene === 'friend' && (hasCasualWords || hasEmoji)) appropriate += 15
  if (scene === 'sns' && hasEmoji) appropriate += 10
  if (scene === 'sns' && len < 140) appropriate += 10

  // Engagement (蠑輔″霎ｼ縺ｿ蜉・
  let engagement = 40
  if (hasQuestion) engagement += 15
  if (hasExclamation) engagement += 5
  if (hasEmoji) engagement += 5
  if (len > 20 && len < 150) engagement += 10
  if (hasThanks || hasQuestion) engagement += 10

  const clamp = (v: number) => Math.max(0, Math.min(100, v))

  const tones: ToneResult[] = [
    { label: '貂ｩ縺九＆', score: clamp(warmth), color: 'bg-pink-500', advice: warmth < 40 ? '邨ｵ譁・ｭ励ｄ諢溯ｬ昴・險闡峨ｒ蜉縺医ｋ縺ｨ貂ｩ縺九∩縺悟｢励＠縺ｾ縺・ : '貂ｩ縺九＞蜊ｰ雎｡繧剃ｸ弱∴縺ｦ縺・∪縺・ },
    { label: '譏守｢ｺ縺・, score: clamp(clarity), color: 'bg-blue-500', advice: clarity < 40 ? '隕∫せ繧呈紛逅・＠縺ｦ縲∵隼陦後ｒ蜈･繧後ｋ縺ｨ隱ｭ縺ｿ繧・☆縺上↑繧翫∪縺・ : '繝｡繝・そ繝ｼ繧ｸ縺ｮ諢丞峙縺御ｼ昴ｏ繧翫ｄ縺吶＞縺ｧ縺・ },
    { label: '霆ｽ縺・, score: clamp(100 - weight), color: 'bg-green-500', advice: weight > 60 ? '繝｡繝・そ繝ｼ繧ｸ縺碁㍾縺上↑縺｣縺ｦ縺・∪縺吶ゅす繝ｳ繝励Ν縺ｫ縺ｾ縺ｨ繧√∪縺励ｇ縺・ : '驕ｩ蠎ｦ縺ｪ霆ｽ縺輔′縺ゅｊ縺ｾ縺・ },
    { label: '蝣ｴ髱｢驕ｩ蜷亥ｺｦ', score: clamp(appropriate), color: 'bg-purple-500', advice: appropriate < 50 ? '蝣ｴ髱｢縺ｫ蜷医▲縺溯ｨ闡蛾▲縺・ｒ諢剰ｭ倥＠縺ｾ縺励ｇ縺・ : '繧ｷ繝ｼ繝ｳ縺ｫ蜷医▲縺溯｡ｨ迴ｾ縺ｧ縺・ },
    { label: '蠑輔″霎ｼ縺ｿ蜉・, score: clamp(engagement), color: 'bg-amber-500', advice: engagement < 40 ? '雉ｪ蝠上ｒ蜈･繧後ｋ縺ｨ莨夊ｩｱ縺檎ｶ壹″繧・☆縺上↑繧翫∪縺・ : '逶ｸ謇九′霑比ｿ｡縺励ｄ縺吶＞蜀・ｮｹ縺ｧ縺・ },
  ]

  const avgScore = tones.reduce((sum, t) => sum + t.score, 0) / tones.length
  const overall = avgScore >= 75 ? '笨ｨ 縺ｨ縺ｦ繧り憶縺・Γ繝・そ繝ｼ繧ｸ縺ｧ縺呻ｼ・ : avgScore >= 55 ? '総 縺翫♀繧縺ｭ濶ｯ縺・〒縺吶′縲∵隼蝟・・菴吝慍縺後≠繧翫∪縺・ : avgScore >= 35 ? '笞・・縺・￥縺､縺九・轤ｹ縺ｧ謾ｹ蝟・′蠢・ｦ√〒縺・ : '閥 螟ｧ蟷・↑隕狗峩縺励ｒ縺翫☆縺吶ａ縺励∪縺・

  const suggestions: string[] = []
  if (weight > 60) suggestions.push('統 譁・ｒ遏ｭ縺丞玄蛻・ｊ縲・繝｡繝・そ繝ｼ繧ｸ1繝医ヴ繝・け縺ｫ縺励∪縺励ｇ縺・)
  if (!hasQuestion && scene !== 'business') suggestions.push('笶・雉ｪ蝠上ｒ1縺､蜉縺医ｋ縺ｨ縲∽ｼ夊ｩｱ縺ｮ繧ｭ繝｣繝・メ繝懊・繝ｫ縺檎函縺ｾ繧後∪縺・)
  if (!hasEmoji && (scene === 'romance' || scene === 'friend' || scene === 'sns')) suggestions.push('・ 邨ｵ譁・ｭ励ｒ1縲・蛟区ｷｻ縺医ｋ縺ｨ隕ｪ縺励∩繧・☆縺上↑繧翫∪縺・)
  if (hasSelfDeprecating) suggestions.push('潮 閾ｪ蟾ｱ蜊台ｸ九・驕ｿ縺代∪縺励ｇ縺・り・菫｡繧呈戟縺｣縺溯｡ｨ迴ｾ縺ｫ鄂ｮ縺肴鋤縺医※')
  if (hasNegative) suggestions.push('験 繝阪ぎ繝・ぅ繝悶↑險闡峨・髢｢菫ゅｒ螢翫＠縺ｾ縺吶ゅ・繧ｸ繝・ぅ繝悶↑陦ｨ迴ｾ縺ｫ險縺・鋤縺医∪縺励ｇ縺・)
  if (len > 300) suggestions.push('笨ゑｸ・髟ｷ縺吶℃縺ｾ縺吶ら嶌謇九・隱ｭ繧雋諡・ｒ貂帙ｉ縺吶◆繧√・50譁・ｭ嶺ｻ･蜀・ｒ逶ｮ讓吶↓')
  if (hasApology && !hasThanks) suggestions.push('剌 縲後☆縺ｿ縺ｾ縺帙ｓ縲阪ｒ縲後≠繧翫′縺ｨ縺・阪↓險縺・鋤縺医※縺ｿ縺ｾ縺励ｇ縺・)
  if (scene === 'business' && !hasFormalWords) suggestions.push('藻 繝薙ず繝阪せ繧ｷ繝ｼ繝ｳ縺ｧ縺ｯ謨ｬ隱槭ｒ菴ｿ縺・∪縺励ｇ縺・)
  if (suggestions.length === 0) suggestions.push('識 繝舌Λ繝ｳ繧ｹ縺ｮ濶ｯ縺・Γ繝・そ繝ｼ繧ｸ縺ｧ縺吶り・菫｡繧呈戟縺｣縺ｦ騾√ｊ縺ｾ縺励ｇ縺・ｼ・)

  return { tones, overall, suggestions }
}

// ==================== PSYCHOLOGY DATA ====================
const PSYCHOLOGY_TOPICS = [
  {
    id: 'attachment',
    title: '繧｢繧ｿ繝・メ繝｡繝ｳ繝育炊隲・,
    emoji: '迫',
    category: '蝓ｺ遉守炊隲・,
    summary: '蟷ｼ蟆第悄縺ｮ邨碁ｨ薙′螟ｧ莠ｺ縺ｮ蟇ｾ莠ｺ髢｢菫ゅせ繧ｿ繧､繝ｫ繧呈ｱｺ繧√ｋ',
    content: `**繧｢繧ｿ繝・メ繝｡繝ｳ繝育炊隲・*縺ｨ縺ｯ縲∝ｿ・炊蟄ｦ閠・ず繝ｧ繝ｳ繝ｻ繝懊え繝ｫ繝薙ぅ縺梧署蜚ｱ縺励◆逅・ｫ悶〒縲∝ｹｼ蟆第悄縺ｮ鬢願ご閠・→縺ｮ髢｢菫ゅ′縲∝､ｧ莠ｺ縺ｫ縺ｪ縺｣縺ｦ縺九ｉ縺ｮ蟇ｾ莠ｺ髢｢菫ゅヱ繧ｿ繝ｼ繝ｳ繧貞ｽ｢菴懊ｋ縺ｨ縺・≧繧ゅ・縺ｧ縺吶・
**4縺､縺ｮ繧ｿ繧､繝暦ｼ・*
窶｢ **螳牙ｮ壼梛・・ecure・・* 窶・隕ｪ蟇・＆縺ｨ閾ｪ遶九・繝舌Λ繝ｳ繧ｹ縺悟叙繧後※縺・ｋ縲ら嶌謇九ｒ菫｡鬆ｼ縺ｧ縺阪∬・蛻・・諢滓ュ繧り｡ｨ迴ｾ縺ｧ縺阪ｋ
窶｢ **荳榊ｮ牙梛・・nxious・・* 窶・逶ｸ謇九↓萓晏ｭ倥＠繧・☆縺・りｿ比ｿ｡縺後↑縺・→荳榊ｮ峨↓縺ｪ繧翫∫｢ｺ隱阪・騾｣邨｡繧剃ｽ募ｺｦ繧ゅ＠縺ｦ縺励∪縺・窶｢ **蝗樣∩蝙具ｼ・voidant・・* 窶・隕ｪ蟇・＆繧帝∩縺代ｋ蛯ｾ蜷代りｷ晞屬繧堤ｽｮ縺阪◆縺後ｊ縲∵─諠・｡ｨ迴ｾ縺瑚協謇・窶｢ **諱舌ｌ蝙具ｼ・earful・・* 窶・隕ｪ蟇・＆繧呈ｱゅａ縺､縺､諱舌ｌ繧九りｿ代▼縺阪◆縺・￠縺ｩ蛯ｷ縺､縺上・縺梧悶＞

**螳溯ｷｵ繝昴う繝ｳ繝茨ｼ・*
1. 縺ｾ縺夊・蛻・・繧ｿ繧､繝励ｒ遏･繧九％縺ｨ縺碁㍾隕・2. 荳榊ｮ牙梛縺ｮ莠ｺ縺ｯ縲碁｣邨｡鬆ｻ蠎ｦ縲阪〒髢｢菫ゅｒ貂ｬ繧翫′縺｡ 竊・雉ｪ縺ｧ閠・∴繧・3. 蝗樣∩蝙九・莠ｺ縺ｯ縲御ｸ莠ｺ縺ｮ譎る俣縲阪ｒ謔ｪ縺・％縺ｨ縺ｨ諤昴ｏ縺ｪ縺・竊・莨昴∴譁ｹ繧貞ｷ･螟ｫ縺吶ｋ
4. 縺ｩ縺ｮ繧ｿ繧､繝励〒繧よэ隴俶ｬ｡隨ｬ縺ｧ螳牙ｮ壼梛縺ｫ霑代▼縺代ｋ`,
  },
  {
    id: 'nvc',
    title: '髱樊垓蜉帙さ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ・・VC・・,
    emoji: '賦・・,
    category: '隧ｱ縺玲婿',
    summary: '縲瑚ｦｳ蟇溪・諢滓ュ竊偵ル繝ｼ繧ｺ竊偵Μ繧ｯ繧ｨ繧ｹ繝医阪・4繧ｹ繝・ャ繝励〒莨昴∴繧・,
    content: `**NVC・・on-Violent Communication・・*縺ｯ縲√・繝ｼ繧ｷ繝｣繝ｫ繝ｻ繝ｭ繝ｼ繧ｼ繝ｳ繝舌・繧ｰ縺碁幕逋ｺ縺励◆繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ謇区ｳ輔〒縺吶・
**4縺､縺ｮ繧ｹ繝・ャ繝暦ｼ・*
1. **隕ｳ蟇滂ｼ・bservation・・* 窶・隧穂ｾ｡縺帙★莠句ｮ溘□縺題ｿｰ縺ｹ繧・   笶後後＞縺､繧る≦縺・坂・ 笨・御ｻ頑律縺ｯ30蛻・≦繧後※譚･縺溘・2. **諢滓ュ・・eeling・・* 窶・閾ｪ蛻・・豌玲戟縺｡繧呈ｭ｣逶ｴ縺ｫ莨昴∴繧・   笶後後・縺ｩ縺・坂・ 笨・悟ｿ・・縺縺｣縺溘阪悟ｯゅ＠縺九▲縺溘・3. **繝九・繧ｺ・・eed・・* 窶・縺昴・諢滓ュ縺ｮ閭梧勹縺ｫ縺ゅｋ鬘倥＞繧剃ｼ昴∴繧・   笨・御ｸ邱偵・譎る俣繧貞､ｧ蛻・↓縺励◆縺・°繧峨・4. **繝ｪ繧ｯ繧ｨ繧ｹ繝茨ｼ・equest・・* 窶・蜈ｷ菴鍋噪縺ｪ縺企｡倥＞繧偵☆繧・   笶後後ｂ縺｣縺ｨ縺｡繧・ｓ縺ｨ縺励※縲坂・ 笨・悟ｾ・■蜷医ｏ縺帙・10蛻・燕縺ｫ逹縺上ｈ縺・↓縺励※縺ｻ縺励＞縲・
**NG萓・竊・OK萓具ｼ・*
笶後後↑繧薙〒騾｣邨｡縺上ｌ縺ｪ縺・・・溷・縺溘＞繧医・縲・笨・・譌･髢馴｣邨｡縺後↑縺九▲縺溘→縺搾ｼ郁ｦｳ蟇滂ｼ峨∽ｸ榊ｮ峨↓諢溘§縺滂ｼ域─諠・ｼ峨ゅ▽縺ｪ縺後ｊ繧呈─縺倥◆縺・°繧会ｼ医ル繝ｼ繧ｺ・峨・譌･1蝗槭・繝｡繝・そ繝ｼ繧ｸ縺上ｌ繧九→螫峨＠縺・ｼ医Μ繧ｯ繧ｨ繧ｹ繝茨ｼ峨港,
  },
  {
    id: 'active-listening',
    title: '繧｢繧ｯ繝・ぅ繝悶Μ繧ｹ繝九Φ繧ｰ・亥だ閨ｴ・・,
    emoji: '曹',
    category: '閨槭″譁ｹ',
    summary: '縲瑚◇縺上阪□縺代〒縺ｪ縺上瑚・縺上阪％縺ｨ縺ｧ菫｡鬆ｼ髢｢菫ゅｒ遽峨￥',
    content: `**繧｢繧ｯ繝・ぅ繝悶Μ繧ｹ繝九Φ繧ｰ**縺ｯ縲√き繧ｦ繝ｳ繧ｻ繝ｪ繝ｳ繧ｰ縺ｮ蝓ｺ譛ｬ謚豕輔〒縲∫嶌謇九・隧ｱ繧定・蜍慕噪縺ｫ閨ｴ縺丞ｧｿ蜍｢縺ｮ縺薙→縺ｧ縺吶・
**5縺､縺ｮ謚豕包ｼ・*
1. **縺・↑縺壹″繝ｻ縺ゅ＞縺･縺｡** 窶・縲後≧繧薙≧繧薙阪後↑繧九⊇縺ｩ縲阪後◎繧後〒・溘・2. **繧ｪ繧ｦ繝霑斐＠・亥渚蟆・ｼ・* 窶・逶ｸ謇九・險闡峨ｒ縺昴・縺ｾ縺ｾ郢ｰ繧願ｿ斐☆
   逶ｸ謇九梧怙霑台ｻ穂ｺ九′縺､繧峨＞繧薙□縲坂・ 縲御ｻ穂ｺ九′縺､繧峨＞繧薙□縺ｭ窶ｦ縲・3. **隕∫ｴ・* 窶・逶ｸ謇九・隧ｱ繧堤洒縺上∪縺ｨ繧√※霑斐☆
   縲後▽縺ｾ繧翫∽ｸ雁昇縺ｨ縺ｮ髢｢菫ゅ〒謔ｩ繧薙〒縺・ｋ縺ｨ縺・≧縺薙→・溘・4. **諢滓ュ縺ｮ蜿榊ｰ・* 窶・險闡峨・陬上↓縺ゅｋ諢滓ュ繧定ｨ隱槫喧縺吶ｋ
   縲後◎繧後・謔斐＠縺九▲縺溘ｈ縺ｭ縲阪悟ｿ・ｴｰ縺九▲縺溘ｓ縺倥ｃ縺ｪ縺・ｼ溘・5. **髢九＞縺溯ｳｪ蝠・* 窶・Yes/No縺ｧ邨ゅｏ繧峨↑縺・ｳｪ蝠上ｒ縺吶ｋ
   笶後梧･ｽ縺励°縺｣縺滂ｼ溘坂・ 笨・後←繧薙↑縺ｨ縺薙ｍ縺悟魂雎｡縺ｫ谿九▲縺滂ｼ溘・
**繧・▲縺ｦ縺ｯ縺・￠縺ｪ縺・％縺ｨ・・*
窶｢ 縺吶＄縺ｫ繧｢繝峨ヰ繧､繧ｹ縺吶ｋ・育嶌謇九・閨槭＞縺ｦ縺ｻ縺励＞縺縺代°繧ゑｼ・窶｢ 閾ｪ蛻・・隧ｱ縺ｫ縺吶ｊ譖ｿ縺医ｋ・医檎ｧ√ｂ縺ｭ縲懊搾ｼ・窶｢ 繧ｹ繝槭・繧定ｦ九↑縺後ｉ閨槭￥`,
  },
  {
    id: 'assertive',
    title: '繧｢繧ｵ繝ｼ繝・ぅ繝悶・繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ',
    emoji: '識',
    category: '隧ｱ縺玲婿',
    summary: '閾ｪ蛻・ｂ逶ｸ謇九ｂ螟ｧ蛻・↓縺吶ｋ閾ｪ蟾ｱ陦ｨ迴ｾ縺ｮ譁ｹ豕・,
    content: `**繧｢繧ｵ繝ｼ繝・ぅ繝・*縺ｨ縺ｯ縲∬・蛻・・諢剰ｦ九・豌玲戟縺｡繧堤紫逶ｴ縺ｫ縲√°縺､逶ｸ謇九ｒ蟆企㍾縺励↑縺後ｉ莨昴∴繧九さ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ繧ｹ繧ｿ繧､繝ｫ縺ｧ縺吶・
**3縺､縺ｮ繧ｿ繧､繝暦ｼ・*
窶｢ **謾ｻ謦・梛・医い繧ｰ繝ｬ繝・す繝厄ｼ・* 窶・閾ｪ蛻・・諢剰ｦ九ｒ謚ｼ縺嶺ｻ倥￠繧九ら嶌謇九ｒ蜷ｦ螳壹☆繧・窶｢ **蜿苓ｺｫ蝙具ｼ医ヱ繝・す繝厄ｼ・* 窶・閾ｪ蛻・・諢剰ｦ九ｒ險縺医↑縺・ら嶌謇九↓蜷医ｏ縺帙☆縺弱ｋ
窶｢ **繧｢繧ｵ繝ｼ繝・ぅ繝門梛** 窶・閾ｪ蛻・ｂ逶ｸ謇九ｂ蟆企㍾縲ら紫逶ｴ縺九▽荳∝ｯｧ

**DESC豕包ｼ医い繧ｵ繝ｼ繝・ぅ繝悶↓莨昴∴繧・繧ｹ繝・ャ繝暦ｼ会ｼ・*
1. **D・・escribe・・* 莠句ｮ溘ｒ謠丞・縺吶ｋ
   縲悟・騾ｱ縺ｮ莨夊ｭｰ縺ｧ縲∫ｧ√・謠先｡医′隴ｰ鬘後↓蜈･縺｣縺ｦ縺・↑縺九▲縺溘・2. **E・・xpress・・* 豌玲戟縺｡繧定｡ｨ迴ｾ縺吶ｋ
   縲梧ｺ門ｙ縺励※縺・◆縺ｮ縺ｧ谿句ｿｵ縺ｫ諤昴▲縺溘・3. **S・・pecify・・* 蜈ｷ菴鍋噪縺ｪ謠先｡医ｒ縺吶ｋ
   縲梧ｬ｡蝗槭・莠句燕縺ｫ繧｢繧ｸ繧ｧ繝ｳ繝繧貞・譛峨＠縺ｦ繧ゅｉ縺医ｋ縺ｨ蜉ｩ縺九ｋ縲・4. **C・・onsequences・・* 繝励Λ繧ｹ縺ｮ邨先棡繧剃ｼ昴∴繧・   縲後◎縺・☆繧後・縲√ｂ縺｣縺ｨ蜉ｹ邇・噪縺ｫ隴ｰ隲悶〒縺阪ｋ縺ｨ諤昴≧縲・
**譁ｭ繧頑婿縺ｮ繝・Φ繝励Ξ繝ｼ繝茨ｼ・*
縲瑚ｪ倥▲縺ｦ縺上ｌ縺ｦ縺ゅｊ縺後→縺・ｼ域─隰晢ｼ峨ゆｻ雁屓縺ｯ莠亥ｮ壹′縺ゅ▲縺ｦ蜿ょ刈縺ｧ縺阪↑縺・ｼ井ｺ句ｮ滂ｼ峨よｬ｡縺ｮ讖滉ｼ壹↓縺懊・螢ｰ縺九￠縺ｦ縺ｻ縺励＞・井ｻ｣譖ｿ譯茨ｼ峨港,
  },
  {
    id: 'mirror',
    title: '繝溘Λ繝ｼ繝ｪ繝ｳ繧ｰ・・・繝ｼ繧ｷ繝ｳ繧ｰ',
    emoji: 'ｪ・,
    category: '謚豕・,
    summary: '逶ｸ謇九↓蜷医ｏ縺帙ｋ縺薙→縺ｧ辟｡諢剰ｭ倥・隕ｪ霑第─繧堤函繧',
    content: `**繝溘Λ繝ｼ繝ｪ繝ｳ繧ｰ**縺ｯ逶ｸ謇九・蜍穂ｽ懊ｄ陦ｨ迴ｾ繧定・辟ｶ縺ｫ逵滉ｼｼ縺吶ｋ縺薙→縲・*繝壹・繧ｷ繝ｳ繧ｰ**縺ｯ逶ｸ謇九・繝壹・繧ｹ縺ｫ蜷医ｏ縺帙ｋ縺薙→縺ｧ縺吶・
**繝溘Λ繝ｼ繝ｪ繝ｳ繧ｰ縺ｮ譁ｹ豕包ｼ・*
窶｢ 逶ｸ謇九′閻輔ｒ邨・ｓ縺繧峨√＠縺ｰ繧峨￥縺励※閾ｪ蛻・ｂ邨・・
窶｢ 逶ｸ謇九′繧ｳ繝ｼ繝偵・繧帝｣ｲ繧薙□繧峨∬・蛻・ｂ鬟ｲ繧
窶｢ 逶ｸ謇九・蟋ｿ蜍｢・亥燕蛯ｾ繝ｻ蠕悟だ・峨ｒ蜷医ｏ縺帙ｋ

**繝・く繧ｹ繝医〒縺ｮ繝溘Λ繝ｼ繝ｪ繝ｳ繧ｰ・・*
窶｢ 逶ｸ謇九′邨ｵ譁・ｭ励ｒ菴ｿ縺・↑繧芽・蛻・ｂ菴ｿ縺・窶｢ 逶ｸ謇九′遏ｭ譁・↑繧芽・蛻・ｂ遏ｭ譁・〒霑斐☆
窶｢ 逶ｸ謇九′縲鯉ｼ√阪ｒ螟夂畑縺吶ｋ縺ｪ繧芽・蛻・ｂ蟆代＠菴ｿ縺・窶｢ 霑比ｿ｡縺ｮ騾溷ｺｦ繧堤嶌謇九↓蜷医ｏ縺帙ｋ

**豕ｨ諢冗せ・・*
窶｢ 繧上＊縺ｨ繧峨＠縺上ｄ繧九→騾・柑譫懶ｼ医ヰ繝ｬ繧九→菫｡鬆ｼ繧貞､ｱ縺・ｼ・窶｢ 縺ゅ￥縺ｾ縺ｧ縲瑚・辟ｶ縺ｫ縲阪悟ｰ代＠驕・ｌ縺ｦ縲咲悄莨ｼ縺吶ｋ
窶｢ 繝・く繧ｹ繝医・蝣ｴ蜷医∵枚菴薙ｄ邨ｵ譁・ｭ励・鬆ｻ蠎ｦ繧貞ｯ・○繧狗ｨ句ｺｦ縺ｧOK`,
  },
  {
    id: 'love-languages',
    title: '5縺､縺ｮ諢帙・險隱・,
    emoji: '喋',
    category: '諱区・',
    summary: '諢帶ュ陦ｨ迴ｾ縺ｮ縲瑚ｨ隱槭阪′驕輔≧縺ｨ縺吶ｌ驕輔＞縺瑚ｵｷ縺阪ｋ',
    content: `繧ｲ繝ｼ繝ｪ繝ｼ繝ｻ繝√Ε繝・・繝槭Φ縺梧署蜚ｱ縺励◆**縲・縺､縺ｮ諢帙・險隱槭・*逅・ｫ悶ゆｺｺ縺ｫ縺ｯ縺昴ｌ縺槭ｌ諢帶ュ繧呈─縺倥ｄ縺吶＞縲瑚ｨ隱槭阪′縺ゅｋ縲・
**5縺､縺ｮ繧ｿ繧､繝暦ｼ・*
1. **閧ｯ螳壹・險闡会ｼ・ords of Affirmation・・*
   縲悟･ｽ縺阪阪後°縺｣縺薙＞縺・阪後☆縺斐＞縺ｭ縲坂・ 險闡峨〒諢帶ュ繧呈─縺倥ｋ
2. **繧ｯ繧ｪ繝ｪ繝・ぅ繧ｿ繧､繝・・uality Time・・*
   荳邱偵↓縺・ｋ譎る俣縺昴・繧ゅ・縺梧・諠・ゅせ繝槭・繧堤ｽｮ縺・※蜷代″蜷医≧縺薙→
3. **雍医ｊ迚ｩ・・ifts・・*
   繝励Ξ繧ｼ繝ｳ繝医・驥鷹｡阪〒縺ｯ縺ｪ縺上瑚・蛻・・縺薙→繧定・∴縺ｦ縺上ｌ縺溘堺ｺ句ｮ溘′螫峨＠縺・4. **螂我ｻ輔・陦檎ぜ・・cts of Service・・*
   譁咏炊繧剃ｽ懊ｋ縲∵祉髯､縺吶ｋ縲∬差迚ｩ繧呈戟縺､ 竊・陦悟虚縺ｧ遉ｺ縺呎・諠・5. **霄ｫ菴鍋噪繧ｿ繝・メ・・hysical Touch・・*
   謇九ｒ縺､縺ｪ縺舌√ワ繧ｰ縲∬か縺ｫ隗ｦ繧後ｋ 竊・繧ｹ繧ｭ繝ｳ繧ｷ繝・・縺ｧ螳牙ｿ・☆繧・
**繝昴う繝ｳ繝茨ｼ・*
窶｢ 閾ｪ蛻・・險隱槭→逶ｸ謇九・險隱槭・驕輔≧縺薙→縺悟､壹＞
窶｢ 閾ｪ蛻・・險隱槭〒諢帶ュ繧堤､ｺ縺励※繧ゅ∫嶌謇九↓縺ｯ莨昴ｏ繧峨↑縺・％縺ｨ縺後≠繧・窶｢ 逶ｸ謇九・險隱槭ｒ遏･繧翫√◎縺ｮ險隱槭〒陦ｨ迴ｾ縺吶ｋ縺薙→縺悟､ｧ蛻㌔,
  },
  {
    id: 'cognitive-distortion',
    title: '隱咲衍縺ｮ豁ｪ縺ｿ',
    emoji: '醗',
    category: '蝓ｺ遉守炊隲・,
    summary: '諤昴＞霎ｼ縺ｿ縺悟ｯｾ莠ｺ髢｢菫ゅｒ螢翫☆繝｡繧ｫ繝九ぜ繝',
    content: `**隱咲衍縺ｮ豁ｪ縺ｿ**縺ｨ縺ｯ縲∫樟螳溘ｒ豁｣縺励￥隱崎ｭ倥〒縺阪★縲∝￥縺｣縺溯ｧ｣驥医ｒ縺励※縺励∪縺・晁・ヱ繧ｿ繝ｼ繝ｳ縺ｧ縺吶・
**蟇ｾ莠ｺ髢｢菫ゅ〒繧医￥縺ゅｋ豁ｪ縺ｿ・・*
1. **蠢・・繝輔ぅ繝ｫ繧ｿ繝ｼ** 窶・謔ｪ縺・Κ蛻・□縺代↓豕ｨ逶ｮ縺吶ｋ
   縲・0蝗櫁､偵ａ繧峨ｌ縺ｦ繧ゅ・蝗槭・謇ｹ蛻､縺縺第ｰ励↓縺ｪ繧九・2. **隱ｭ蠢・｡・* 窶・逶ｸ謇九・豌玲戟縺｡繧貞享謇九↓豎ｺ繧√▽縺代ｋ
   縲梧里隱ｭ繧ｹ繝ｫ繝ｼ = 雖後ｏ繧後◆縲搾ｼ域悽蠖薙・蠢吶＠縺・□縺代°繧ゑｼ・3. **蜈ｨ縺狗┌縺区晁・* 窶・逋ｽ鮟偵〒閠・∴繧・   縲悟ｮ檎挑縺ｫ螂ｽ縺九ｌ縺ｪ縺・↑繧牙ｫ後ｏ繧後※縺・ｋ縲・4. **驕主ｺｦ縺ｮ荳闊ｬ蛹・* 窶・荳蠎ｦ縺ｮ縺薙→繧偵後＞縺､繧ゅ阪→閠・∴繧・   縲後％縺ｮ莠ｺ縺ｯ1蝗樒ｴ・據繧堤ｴ縺｣縺・= 菫｡逕ｨ縺ｧ縺阪↑縺・ｺｺ縲・5. **諢滓ュ逧・耳隲・* 窶・諢滓ュ繧剃ｺ句ｮ溘→豺ｷ蜷後☆繧・   縲御ｸ榊ｮ峨ｒ諢溘§繧・= 譛ｬ蠖薙↓蜊ｱ髯ｺ縺ｪ縺薙→縺瑚ｵｷ縺阪※縺・ｋ縲・
**蟇ｾ蜃ｦ豕包ｼ・*
窶｢ 縲梧悽蠖薙↓縺昴≧・溘阪→閾ｪ蝠上☆繧・窶｢ 險ｼ諡繧呈爾縺呻ｼ・0蝗樔ｸｭ菴募屓・滂ｼ・窶｢ 蛻･縺ｮ隗｣驥医ｒ3縺､閠・∴繧・窶｢ 菫｡鬆ｼ縺ｧ縺阪ｋ莠ｺ縺ｫ縲悟ｮ｢隕ｳ逧・↓縺ｩ縺・昴≧・溘阪→閨槭￥`,
  },
  {
    id: 'boundary',
    title: '蛛･蜈ｨ縺ｪ蠅・阜邱夲ｼ医ヰ繧ｦ繝ｳ繝繝ｪ繝ｼ・・,
    emoji: '圦',
    category: '蝓ｺ遉守炊隲・,
    summary: '閾ｪ蛻・→逶ｸ謇九・髢薙↓驕ｩ蛻・↑邱壹ｒ蠑輔￥譁ｹ豕・,
    content: `**繝舌え繝ｳ繝繝ｪ繝ｼ・亥｢・阜邱夲ｼ・*縺ｨ縺ｯ縲∬・蛻・→莉冶・・髢薙↓蠑輔￥蠢・炊逧・↑邱壹・縺薙→縲ょ▼蜈ｨ縺ｪ髢｢菫ゅ↓縺ｯ荳榊庄谺縺ｧ縺吶・
**3縺､縺ｮ蠅・阜邱壹ち繧､繝暦ｼ・*
窶｢ **迚ｩ逅・噪** 窶・霄ｫ菴鍋噪縺ｪ霍晞屬諢溘∵戟縺｡迚ｩ縲√・繝ｩ繧､繝吶・繝育ｩｺ髢・窶｢ **諢滓ュ逧・* 窶・閾ｪ蛻・・諢滓ュ縺ｨ逶ｸ謇九・諢滓ュ繧貞・縺代※閠・∴繧・窶｢ **繝・ず繧ｿ繝ｫ** 窶・SNS縲∵里隱ｭ縲∬ｿ比ｿ｡鬆ｻ蠎ｦ縲∽ｽ咲ｽｮ蜈ｱ譛・
**蠅・阜邱壹′蠑ｱ縺・ｺｺ縺ｮ繧ｵ繧､繝ｳ・・*
窶｢ 逶ｸ謇九・讖溷ｫ後↓謖ｯ繧雁屓縺輔ｌ繧・窶｢ 縲君o縲阪′險縺医↑縺・窶｢ 逶ｸ謇九・蝠城｡後ｒ閾ｪ蛻・・蝠城｡後→縺励※謚ｱ縺郁ｾｼ繧
窶｢ 縲悟ｫ後ｏ繧後◆縺上↑縺・阪′陦悟虚蜴溽炊縺ｫ縺ｪ縺｣縺ｦ縺・ｋ

**蠅・阜邱壹・蠑輔″譁ｹ・・*
1. 閾ｪ蛻・↓縺ｨ縺｣縺ｦ縲後％縺薙・隴ｲ繧後↑縺・阪ｒ譏守｢ｺ縺ｫ縺吶ｋ
2. 逶ｸ謇九↓遨上ｄ縺九↓縲√＠縺九＠譏守｢ｺ縺ｫ莨昴∴繧・3. 蠅・阜邱壹ｒ雜・∴繧峨ｌ縺溘ｉ縲∫ｵ先棡繧堤､ｺ縺呻ｼ郁ｷ晞屬繧堤ｽｮ縺上↑縺ｩ・・
**莨昴∴譁ｹ縺ｮ萓具ｼ・*
縲後≠縺ｪ縺溘・縺薙→縺ｯ螟ｧ蛻・□縺代←縲∝､・0譎ゆｻ･髯阪・騾｣邨｡縺ｯ謗ｧ縺医※縺ｻ縺励＞縲らｿ梧悃霑比ｿ｡縺吶ｋ縺ｭ縲港,
  },
  {
    id: 'first-impression',
    title: '蛻晏ｯｾ髱｢縺ｮ蠢・炊蟄ｦ',
    emoji: '窓',
    category: '謚豕・,
    summary: '隨ｬ荳蜊ｰ雎｡縺ｯ7遘偵〒豎ｺ縺ｾ繧翫∝､峨∴繧九↓縺ｯ蜊雁ｹｴ縺九°繧・,
    content: `**繝｡繝ｩ繝薙い繝ｳ縺ｮ豕募援**・医ｈ縺剰ｪ､隗｣縺輔ｌ繧区ｳ募援縺ｧ縺吶′・峨′遉ｺ縺吶・縺ｯ縲∫泝逶ｾ縺励◆諠・ｱ繧貞女縺大叙縺｣縺溘→縺阪∽ｺｺ縺ｯ隕冶ｦ・5%繝ｻ閨ｴ隕・8%繝ｻ險闡・%縺ｧ蛻､譁ｭ縺吶ｋ縺ｨ縺・≧縺薙→縲・
**蛻晏ｯｾ髱｢縺ｧ螂ｽ蜊ｰ雎｡繧剃ｸ弱∴繧・縺､縺ｮ繧ｳ繝・ｼ・*
1. **繧｢繧､繧ｳ繝ｳ繧ｿ繧ｯ繝・* 窶・3遘定ｦ九※竊・遘貞､悶☆ 縺ｮ繝ｪ繧ｺ繝
2. **蜷榊燕繧貞他縺ｶ** 窶・閾ｪ蟾ｱ邏ｹ莉句ｾ後☆縺舌↓縲後・・＆繧薙√ｈ繧阪＠縺上・3. **蜈ｱ騾夂せ繧呈爾縺・* 窶・蜃ｺ霄ｫ蝨ｰ縲∬ｶ｣蜻ｳ縲∽ｻ穂ｺ九・蛻・㍽
4. **逶ｸ謇九↓隧ｱ縺輔○繧・* 窶・閾ｪ蛻・0%隧ｱ縺吩ｺｺ繧医ｊ縲・0%閨槭￥莠ｺ縺悟･ｽ縺九ｌ繧・5. **譛蠕後・蜊ｰ雎｡** 窶・縲御ｻ頑律縺ｯ讌ｽ縺励°縺｣縺溘ゅ∪縺溯ｩｱ縺励◆縺・阪〒邱繧√ｋ

**繝・く繧ｹ繝医〒縺ｮ蛻晏ｯｾ髱｢・医・繝・メ繝ｳ繧ｰ繧｢繝励Μ遲会ｼ会ｼ・*
窶｢ 譛蛻昴・繝｡繝・そ繝ｼ繧ｸ縺ｯ遏ｭ縺擾ｼ・陦御ｻ･蜀・ｼ・窶｢ 逶ｸ謇九・繝励Ο繝輔ぅ繝ｼ繝ｫ縺ｫ隗ｦ繧後ｋ・医さ繝斐・諢溘ぞ繝ｭ縺ｫ・・窶｢ 雉ｪ蝠上ｒ1縺､縺縺大・繧後ｋ
窶｢ 霑比ｿ｡縺励ｄ縺吶＞蜀・ｮｹ縺ｫ縺吶ｋ`,
  },
  {
    id: 'conflict',
    title: '蟒ｺ險ｭ逧・↑蝟ｧ蝌ｩ縺ｮ莉墓婿',
    emoji: '笞｡',
    category: '隧ｱ縺玲婿',
    summary: '陦晉ｪ√ｒ髢｢菫ょｼｷ蛹悶・繝√Ε繝ｳ繧ｹ縺ｫ螟峨∴繧区婿豕・,
    content: `蠢・炊蟄ｦ閠・ず繝ｧ繝ｳ繝ｻ繧ｴ繝・ヨ繝槭Φ縺ｮ遐皮ｩｶ縺ｫ繧医ｋ縺ｨ縲・*蝟ｧ蝌ｩ縺励↑縺・き繝・・繝ｫ繧医ｊ縲∽ｸ頑焔縺ｫ蝟ｧ蝌ｩ縺吶ｋ繧ｫ繝・・繝ｫ縺ｮ譁ｹ縺碁聞邯壹″縺吶ｋ**縲・
**繧ｴ繝・ヨ繝槭Φ縺ｮ縲梧忰譌･縺ｮ蝗幃ｨ主｣ｫ縲搾ｼ磯未菫ゅｒ螢翫☆4縺､縺ｮ繝代ち繝ｼ繝ｳ・会ｼ・*
1. **謇ｹ蛻､・・riticism・・* 窶・莠ｺ譬ｼ繧呈判謦・☆繧・   笶後後≠縺ｪ縺溘・縺・▽繧り・蛻・享謇九・2. **霆ｽ阡托ｼ・ontempt・・* 窶・隕倶ｸ九☆諷句ｺｦ
   笶・逧ｮ閧峨∫岼繧貞屓縺吶√ヰ繧ｫ縺ｫ縺励◆隨代＞
3. **髦ｲ蠕｡・・efensiveness・・* 窶・險縺・ｨｳ縺ｧ霑斐☆
   笶後後□縺｣縺ｦ蠢吶＠縺九▲縺溘ｓ縺縺九ｉ縲・4. **遏ｳ螢・ｼ・tonewalling・・* 窶・辟｡隕悶・繧ｷ繝｣繝・ヨ繝繧ｦ繝ｳ
   笶・霑比ｺ九＠縺ｪ縺・・Κ螻九ｒ蜃ｺ繧・
**蟒ｺ險ｭ逧・↑蝟ｧ蝌ｩ縺ｮ繝ｫ繝ｼ繝ｫ・・*
窶｢ 縲後≠縺ｪ縺溘・縲懊阪〒縺ｯ縺ｪ縺上檎ｧ√・縲懊阪〒蟋九ａ繧・窶｢ 驕主悉繧呈戟縺｡蜃ｺ縺輔↑縺・ｼ医後≠縺ｮ譎ゅｂ縲懊阪・NG・・窶｢ 1縺､縺ｮ隴ｰ鬘後↓邨槭ｋ
窶｢ 諢滓ュ縺碁ｫ倥・縺｣縺溘ｉ20蛻・ｼ第・縺吶ｋ・育函逅・噪縺ｫ蜀ｷ髱吶↓縺ｪ繧九・縺ｫ20蛻・ｿ・ｦ・ｼ・窶｢ 隗｣豎ｺ遲悶ｒ荳邱偵↓閠・∴繧句ｧｿ蜍｢繧呈戟縺､`,
  },
]

// ==================== DIAGNOSIS DATA ====================
const DIAGNOSIS_QUESTIONS = [
  { text: '蛻晏ｯｾ髱｢縺ｮ莠ｺ縺ｨ隧ｱ縺吶→縺阪∬・蛻・°繧芽ｩｱ縺励°縺代ｋ縺薙→縺悟､壹＞', category: 'E' },
  { text: '逶ｸ謇九・隧ｱ繧定◇縺上→縺阪√▽縺・・蛻・・諢剰ｦ九ｒ險縺・◆縺上↑繧・, category: 'D' },
  { text: '蜿倶ｺｺ縺九ｉ縺ｮ逶ｸ隲・ｒ蜿励￠繧九％縺ｨ縺悟､壹＞', category: 'S' },
  { text: '險育判繧堤ｫ九※縺ｦ縺九ｉ陦悟虚縺吶ｋ繧ｿ繧､繝励□', category: 'C' },
  { text: '螟ｧ莠ｺ謨ｰ縺ｮ髮・∪繧翫ｈ繧翫ｂ蟆台ｺｺ謨ｰ縺悟･ｽ縺阪□', category: 'S' },
  { text: '諢剰ｦ九′蟇ｾ遶九＠縺溘→縺阪∬・蛻・・諢剰ｦ九ｒ騾壹◎縺・→縺吶ｋ', category: 'D' },
  { text: '莠ｺ繧堤ｬ代ｏ縺帙ｋ縺ｮ縺悟･ｽ縺阪□', category: 'E' },
  { text: '逶ｸ謇九・陦ｨ諠・ｄ螢ｰ縺ｮ繝医・繝ｳ縺ｮ螟牙喧縺ｫ豌励▼縺阪ｄ縺吶＞', category: 'S' },
  { text: '繝｡繝ｼ繝ｫ繧・Γ繝・そ繝ｼ繧ｸ縺ｯ邁｡貎斐↓譖ｸ縺乗婿縺', category: 'D' },
  { text: '譁ｰ縺励＞莠ｺ髢馴未菫ゅｒ菴懊ｋ縺薙→縺ｫ遨肴･ｵ逧・□', category: 'E' },
  { text: '繝・・繧ｿ繧・ｹ諡縺ｫ蝓ｺ縺･縺・※蛻､譁ｭ縺吶ｋ譁ｹ縺', category: 'C' },
  { text: '莠ｺ縺ｫ鬆ｼ繧九ｈ繧願・蛻・〒繧・ｋ譁ｹ縺悟･ｽ縺阪□', category: 'D' },
  { text: '逶ｸ謇九・豌玲戟縺｡縺ｫ蜈ｱ諢溘＠繧・☆縺・, category: 'S' },
  { text: '諢滓ュ繧医ｊ繧りｫ也炊繧帝㍾隕悶☆繧・, category: 'C' },
  { text: '蝣ｴ縺ｮ髮ｰ蝗ｲ豌励ｒ譏弱ｋ縺上☆繧九・縺悟ｾ玲э縺', category: 'E' },
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
    name: '繝繝ｼ繝峨Γ繝ｼ繧ｫ繝ｼ蝙・,
    emoji: '検',
    color: 'from-yellow-500 to-orange-500',
    strengths: ['蝣ｴ繧堤屁繧贋ｸ翫￡繧九・縺悟ｾ玲э', '蛻晏ｯｾ髱｢縺ｧ繧ゅ☆縺舌↓謇薙■隗｣縺代ｉ繧後ｋ', '繝昴ず繝・ぅ繝悶↑繧ｨ繝阪Ν繧ｮ繝ｼ繧貞捉蝗ｲ縺ｫ荳弱∴繧・],
    weaknesses: ['隧ｱ縺励☆縺弱※逶ｸ謇九・隧ｱ繧定◇縺代↑縺・％縺ｨ縺後≠繧・, '豺ｱ縺・ｩｱ鬘後ｒ驕ｿ縺代′縺｡', '繝・Φ繧ｷ繝ｧ繝ｳ縺ｮ豕｢縺梧ｿ縺励＞'],
    tips: ['逶ｸ謇九′隧ｱ縺励※縺・ｋ髢薙・3遘貞ｾ・▲縺ｦ縺九ｉ霑斐☆', '1蟇ｾ1縺ｮ豺ｱ縺・ｼ夊ｩｱ縺ｮ譎る俣繧呈э隴倡噪縺ｫ菴懊ｋ', '閨槭￥:隧ｱ縺・= 6:4繧堤岼讓吶↓'],
    compatible: '繧ｵ繝昴・繧ｿ繝ｼ蝙・,
    challenging: '蛻・梵蝙・,
  },
  D: {
    id: 'D',
    name: '繝ｪ繝ｼ繝繝ｼ蝙・,
    emoji: 'ｦ・,
    color: 'from-red-500 to-rose-500',
    strengths: ['豎ｺ譁ｭ蜉帙′縺ゅｊ鬆ｼ繧翫↓縺ｪ繧・, '迚ｩ莠九ｒ蜑阪↓騾ｲ繧√ｋ蜉帙′縺ゅｋ', '譏守｢ｺ縺ｧ蛻・°繧翫ｄ縺吶＞繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ'],
    weaknesses: ['逶ｸ謇九・豌玲戟縺｡繧堤ｽｮ縺榊悉繧翫↓縺励′縺｡', '縲梧ｭ｣縺励＆縲阪↓縺薙□繧上ｊ縺吶℃繧・, '鬮伜悸逧・↓譏繧九％縺ｨ縺後≠繧・],
    tips: ['縲後≠縺ｪ縺溘・縺ｩ縺・昴≧・溘阪ｒ蜿｣逋悶↓縺吶ｋ', '豁｣縺励＆繧医ｊ髢｢菫よｧ繧貞━蜈医☆繧句ｴ髱｢繧貞｢励ｄ縺・, '諢溯ｬ昴・險闡峨ｒ諢剰ｭ倡噪縺ｫ莨昴∴繧・],
    compatible: '蛻・梵蝙・,
    challenging: '繧ｵ繝昴・繧ｿ繝ｼ蝙・,
  },
  S: {
    id: 'S',
    name: '繧ｵ繝昴・繧ｿ繝ｼ蝙・,
    emoji: '､・,
    color: 'from-green-500 to-emerald-500',
    strengths: ['蜈ｱ諢溷鴨縺碁ｫ倥￥縲∫嶌謇九↓螳牙ｿ・─繧剃ｸ弱∴繧・, '閨槭″荳頑焔縺ｧ菫｡鬆ｼ縺輔ｌ繧・, '莠ｺ髢馴未菫ゅｒ螟ｧ蛻・↓縺吶ｋ'],
    weaknesses: ['閾ｪ蛻・・諢剰ｦ九ｒ險縺医↑縺・％縺ｨ縺後≠繧・, '逶ｸ謇九↓蜷医ｏ縺帙☆縺弱※逍ｲ繧後ｋ', 'No縺瑚ｨ縺医↑縺・],
    tips: ['縲檎ｧ√・縺薙≧諤昴≧縲阪ｒ1譌･3蝗槭・險縺・ｷｴ鄙・, '閾ｪ蛻・・譎る俣繧堤｢ｺ菫昴☆繧九Ν繝ｼ繝ｫ繧剃ｽ懊ｋ', '縺吶＄霑比ｺ九○縺壹瑚・∴縺輔○縺ｦ縲阪→險縺・ｷｴ鄙・],
    compatible: '繝繝ｼ繝峨Γ繝ｼ繧ｫ繝ｼ蝙・,
    challenging: '繝ｪ繝ｼ繝繝ｼ蝙・,
  },
  C: {
    id: 'C',
    name: '蛻・梵蝙・,
    emoji: '溌',
    color: 'from-blue-500 to-indigo-500',
    strengths: ['隲也炊逧・〒豁｣遒ｺ縺ｪ繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ', '蝠城｡瑚ｧ｣豎ｺ閭ｽ蜉帙′鬮倥＞', '諢滓ュ縺ｫ豬√＆繧後★蜀ｷ髱吶↓蛻､譁ｭ縺ｧ縺阪ｋ'],
    weaknesses: ['蜀ｷ縺溘＞蜊ｰ雎｡繧剃ｸ弱∴繧九％縺ｨ縺後≠繧・, '諢滓ュ陦ｨ迴ｾ縺瑚協謇・, '螳檎挑荳ｻ鄒ｩ縺ｧ逶ｸ謇九↓繧るｫ倥＞蝓ｺ貅悶ｒ豎ゅａ縺後■'],
    tips: ['諢滓ュ縺ｮ險闡峨ｒ諢剰ｭ倥＠縺ｦ菴ｿ縺・ｼ亥ｬ峨＠縺・∵･ｽ縺励＞縲∵ｮ句ｿｵ・・, '逶ｸ謇九・隧ｱ縺ｫ縲後◎繧悟､ｧ螟峨□縺｣縺溘・縲阪→蜈ｱ諢溘ｒ蜈･繧後ｋ', '豁｣遒ｺ縺輔ｈ繧企未菫よｧ繧貞━蜈医☆繧句ｴ髱｢繧帝∈縺ｶ'],
    compatible: '繝ｪ繝ｼ繝繝ｼ蝙・,
    challenging: '繝繝ｼ繝峨Γ繝ｼ繧ｫ繝ｼ蝙・,
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
      scene: '蛻昴ョ繝ｼ繝茨ｼ医き繝輔ぉ・・,
      emoji: '笘・,
      flow: [
        { phase: '謖ｨ諡ｶ縲懈ｳｨ譁・, duration: '5蛻・, topics: ['縲御ｻ頑律縺ｯ譚･縺ｦ縺上ｌ縺ｦ縺ゅｊ縺後→縺・・, '鬟ｲ縺ｿ迚ｩ縺ｮ螂ｽ縺ｿ繧定◇縺・, '譛霑代・縺翫☆縺吶ａ繧ｫ繝輔ぉ'] },
        { phase: '閾ｪ蟾ｱ邏ｹ莉・, duration: '10蛻・, topics: ['莉穂ｺ九・隧ｱ・域ｷｱ蜈･繧翫＠縺吶℃縺ｪ縺・ｼ・, '莨第律縺ｮ驕弱＃縺玲婿', '譛霑代ワ繝槭▲縺ｦ縺・ｋ縺薙→'] },
        { phase: '蜈ｱ騾夂せ謗｢縺・, duration: '15蛻・, topics: ['蜃ｺ霄ｫ蝨ｰ繝ｻ譌・｡・, '螂ｽ縺阪↑鬟溘∋迚ｩ', '譏逕ｻ繝ｻ髻ｳ讌ｽ繝ｻ貍ｫ逕ｻ'] },
        { phase: '豺ｱ縺・ｩｱ鬘・, duration: '15蛻・, topics: ['蟆・擂縺ｮ螟｢', '萓｡蛟､隕ｳ・井ｽ輔ｒ螟ｧ蛻・↓縺励※縺・ｋ縺具ｼ・, '譛霑第─蜍輔＠縺溘％縺ｨ'] },
        { phase: '邱繧・, duration: '5蛻・, topics: ['縲御ｻ頑律縺ｯ讌ｽ縺励°縺｣縺溘・, '谺｡縺ｮ繝励Λ繝ｳ繧定ｻｽ縺乗署譯・, '縲後∪縺滉ｼ壹＞縺溘＞縲阪→邏逶ｴ縺ｫ莨昴∴繧・] },
      ],
      tips: ['繧ｹ繝槭・縺ｯ繧ｫ繝舌Φ縺ｫ蜈･繧後ｋ', '逶ｸ謇九・隧ｱ:閾ｪ蛻・・隧ｱ = 6:4', '豐磯ｻ吶ｒ諱舌ｌ縺ｪ縺・ｼ郁・辟ｶ縺ｪ繝壹・繧ｹ縺ｧ・・],
    },
    {
      scene: '蜻顔區繝ｻ豌玲戟縺｡繧剃ｼ昴∴繧・,
      emoji: '柱',
      flow: [
        { phase: '蜑咲ｽｮ縺・, duration: '窶・, topics: ['縲悟､ｧ蛻・↑隧ｱ縺後≠繧九ｓ縺縺代←縲・, '2莠ｺ縺阪ｊ縺ｮ關ｽ縺｡逹縺・◆蝣ｴ謇縺ｧ'] },
        { phase: '豌玲戟縺｡繧剃ｼ昴∴繧・, duration: '窶・, topics: ['縲後・・・縺薙≧縺・≧縺ｨ縺薙ｍ縺悟･ｽ縺阪搾ｼ亥・菴鍋噪縺ｫ・・, '縲御ｸ邱偵↓縺・ｋ縺ｨ讌ｽ縺励＞縲阪後ｂ縺｣縺ｨ遏･繧翫◆縺・・] },
        { phase: '繝ｪ繧ｯ繧ｨ繧ｹ繝・, duration: '窶・, topics: ['縲御ｻ倥″蜷医▲縺ｦ縺ｻ縺励＞縲阪→繧ｷ繝ｳ繝励Ν縺ｫ', '蝗槭ｊ縺上←縺・ｨ縺・婿縺ｯNG'] },
        { phase: '逶ｸ謇九・蜿榊ｿ・, duration: '窶・, topics: ['縺吶＄縺ｫ遲斐∴繧呈ｱゅａ縺ｪ縺・, '縲瑚・∴縺ｦ縺上ｌ縺ｦ繧ゅ＞縺・ｈ縲阪→菴呵｣輔ｒ謖√▽'] },
      ],
      tips: ['LINE繧医ｊ蟇ｾ髱｢縺後・繧ｹ繝・, '逶ｸ謇九′蠢吶＠縺・凾繝ｻ逍ｲ繧後※縺・ｋ譎ゅ・驕ｿ縺代ｋ', '縲薫K縲堺ｻ･螟悶・霑比ｺ九ｂ蜿励￠蜈･繧後ｋ隕壽ぁ繧呈戟縺､'],
    },
  ],
  business: [
    {
      scene: '蝠・ｫ・・繝励Ξ繧ｼ繝ｳ',
      emoji: '投',
      flow: [
        { phase: '繧｢繧､繧ｹ繝悶Ξ繧､繧ｯ', duration: '3蛻・, topics: ['螟ｩ豌励・譛霑代・讌ｭ逡後ル繝･繝ｼ繧ｹ', '逶ｸ謇九・莨夂､ｾ縺ｮ譛霑代・繝九Η繝ｼ繧ｹ縺ｫ隗ｦ繧後ｋ'] },
        { phase: '隱ｲ鬘後・繝偵い繝ｪ繝ｳ繧ｰ', duration: '10蛻・, topics: ['縲檎樟蝨ｨ縺ｩ縺ｮ繧医≧縺ｪ隱ｲ鬘後′縺ゅｊ縺ｾ縺吶°・溘・, '縲檎炊諠ｳ縺ｮ迥ｶ諷九・・溘・, '繝｡繝｢繧貞叙繧句ｧｿ蜍｢'] },
        { phase: '謠先｡・, duration: '15蛻・, topics: ['隱ｲ鬘・竊・隗｣豎ｺ遲・竊・蜉ｹ譫・縺ｮ鬆・〒隱ｬ譏・, '謨ｰ蟄励・莠倶ｾ九ｒ莠､縺医ｋ', '逶ｸ謇九・蜿榊ｿ懊ｒ隕九↑縺後ｉ隱ｿ謨ｴ'] },
        { phase: '繧ｯ繝ｭ繝ｼ繧ｸ繝ｳ繧ｰ', duration: '5蛻・, topics: ['谺｡縺ｮ繧ｹ繝・ャ繝励ｒ蜈ｷ菴鍋噪縺ｫ', '譛滄剞繧貞・繧・, '縲後＃荳肴・轤ｹ縺ｯ縺ゅｊ縺ｾ縺吶°・溘・] },
      ],
      tips: ['逶ｸ謇九・蜷榊燕繧・蝗樔ｻ･荳雁他縺ｶ', '縲悟ｾ｡遉ｾ縺ｮ縲・・′邏譎ｴ繧峨＠縺・阪°繧牙・繧・, 'PREP豕包ｼ育ｵ占ｫ問・逅・罰竊貞・菴謎ｾ銀・邨占ｫ厄ｼ・],
    },
    {
      scene: '1on1繝溘・繝・ぅ繝ｳ繧ｰ',
      emoji: '､・,
      flow: [
        { phase: '繝√ぉ繝・け繧､繝ｳ', duration: '3蛻・, topics: ['縲梧怙霑代←縺・ｼ溘阪御ｽ楢ｪｿ縺ｯ・溘・, '莉穂ｺ倶ｻ･螟悶・隧ｱ縺九ｉ蜈･繧・] },
        { phase: '逶ｸ謇九・隧ｱ繧定◇縺・, duration: '15蛻・, topics: ['縲梧怙霑代≧縺ｾ縺上＞縺｣縺ｦ縺・ｋ縺薙→縺ｯ・溘・, '縲悟峅縺｣縺ｦ縺・ｋ縺薙→縺ｯ縺ゅｋ・溘・, '蛯ｾ閨ｴ縺ｫ蠕ｹ縺吶ｋ'] },
        { phase: '繝輔ぅ繝ｼ繝峨ヰ繝・け', duration: '10蛻・, topics: ['濶ｯ縺・せ繧貞・縺ｫ莨昴∴繧具ｼ・BI豕包ｼ・, '謾ｹ蝟・せ縺ｯ縲梧署譯医阪→縺励※莨昴∴繧・, '縲後←縺・昴≧・溘阪→諢剰ｦ九ｒ閨槭￥'] },
        { phase: '繧｢繧ｯ繧ｷ繝ｧ繝ｳ豎ｺ繧・, duration: '5蛻・, topics: ['谺｡蝗槭∪縺ｧ縺ｫ繧・ｋ縺薙→', '蠢・ｦ√↑繧ｵ繝昴・繝・, '縲御ｽ輔°莉悶↓閨槭″縺溘＞縺薙→縺ｯ・溘・] },
      ],
      tips: ['PC繧帝哩縺倥ｋ', '8蜑ｲ閨槭＞縺ｦ2蜑ｲ隧ｱ縺・, '繧｢繝峨ヰ繧､繧ｹ縺ｯ豎ゅａ繧峨ｌ縺ｦ縺九ｉ縺吶ｋ'],
    },
  ],
  friend: [
    {
      scene: '荵・＠縺ｶ繧翫・蜀堺ｼ・,
      emoji: '脂',
      flow: [
        { phase: '蜀堺ｼ壹・蝟懊・', duration: '5蛻・, topics: ['縲悟・豌励□縺｣縺滂ｼ溷､峨ｏ繧峨↑縺・・・√・, '隕九◆逶ｮ縺ｮ螟牙喧繧定､偵ａ繧・, '諛舌°縺励＞隧ｱ'] },
        { phase: '霑第ｳ∝ｱ蜻・, duration: '15蛻・, topics: ['莉穂ｺ九・繝励Λ繧､繝吶・繝医・螟牙喧', '蜈ｱ騾壹・遏･莠ｺ縺ｮ隧ｱ', '譛霑代ワ繝槭▲縺ｦ縺・ｋ縺薙→'] },
        { phase: '諤昴＞蜃ｺ隧ｱ', duration: '10蛻・, topics: ['縲後≠縺ｮ譎ゅ♀繧ゅ＠繧阪°縺｣縺溘ｈ縺ｭ縲・, '蜈ｱ譛峨＠縺ｦ縺・ｋ菴馴ｨ・, '蠖捺凾縺ｮ蜀咏悄繧定ｦ九○蜷医≧'] },
        { phase: '縺薙ｌ縺九ｉ', duration: '10蛻・, topics: ['縲後∪縺滄寔縺ｾ繧阪≧縲・, '蜈ｷ菴鍋噪縺ｪ谺｡縺ｮ莠亥ｮ壹ｒ豎ｺ繧√ｋ', '蜈ｱ騾壹・雜｣蜻ｳ縺ｧ郢九′繧・] },
      ],
      tips: ['閾ｪ諷｢隧ｱ縺ｯ謗ｧ縺医ａ縺ｫ', '逶ｸ謇九・霑第ｳ√↓闊亥袖繧呈戟縺｣縺ｦ豺ｱ謗倥ｊ縺吶ｋ', '騾｣邨｡蜈医ｒ莠､謠帙＠逶ｴ縺・],
    },
  ],
  sns: [
    {
      scene: 'SNS縺ｧ縺ｮ繧・ｊ蜿悶ｊ',
      emoji: '導',
      flow: [
        { phase: '謚慕ｨｿ縺ｸ縺ｮ蜿榊ｿ・, duration: '窶・, topics: ['蜈ｷ菴鍋噪縺ｪ諢滓Φ繧・陦後〒', '縲後＞縺・・縲阪□縺代〒縺ｪ縺上さ繝｡繝ｳ繝医ｂ', '雉ｪ蝠上ｒ1縺､豺ｻ縺医ｋ'] },
        { phase: 'DM 縺ｮ蟋九ａ譁ｹ', duration: '窶・, topics: ['蜈ｱ騾壹・隧ｱ鬘後°繧牙・繧・, '謚慕ｨｿ縺ｮ蜀・ｮｹ縺ｫ隗ｦ繧後※閾ｪ辟ｶ縺ｫ', '縲後・・・謚慕ｨｿ隕九※閨槭″縺溘°縺｣縺溘ｓ縺縺代←縲・] },
        { phase: '莨夊ｩｱ縺ｮ邯咏ｶ・, duration: '窶・, topics: ['霑比ｿ｡騾溷ｺｦ繧堤嶌謇九↓蜷医ｏ縺帙ｋ', '髟ｷ譁・ｒ騾√ｊ縺吶℃縺ｪ縺・, '蜀咏悄繧・判蜒上ｒ豢ｻ逕ｨ'] },
        { phase: '繧ｪ繝輔Λ繧､繝ｳ縺ｸ', duration: '窶・, topics: ['縲御ｻ雁ｺｦ螳滄圀縺ｫ莨壹∴縺溘ｉ螫峨＠縺・・, '蜈ｱ騾壹う繝吶Φ繝医ｒ謠先｡・, '辟｡逅・↓隱倥ｏ縺ｪ縺・] },
      ],
      tips: ['豺ｱ螟懊・騾｣謚輔・驕ｿ縺代ｋ', '繝阪ぎ繝・ぅ繝悶↑蜿榊ｿ懊・譎る俣繧堤ｽｮ縺・※縺九ｉ', '蜈ｬ髢九・蝣ｴ縺ｧ諢剰ｦ九′蟇ｾ遶九＠縺溘ｉDM縺ｫ遘ｻ陦後☆繧・],
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
  { scene: '蛻昴ａ縺ｦ縺ｮLINE', ng: '縺薙ｓ縺ｫ縺｡縺ｯ・∽ｻ頑律縺ｯ縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺励◆・∵･ｽ縺励°縺｣縺溘〒縺呻ｼ√∪縺滉ｼ壹＞縺溘＞縺ｧ縺呻ｼ√＞縺､遨ｺ縺・※縺ｾ縺吶°・・, ngReason: '諢溷・隨ｦ縺ｮ騾｣謇薙′驥阪＞縲りｳｪ蝠乗判繧√〒逶ｸ謇九↓繝励Ξ繝・す繝｣繝ｼ', ok: '莉頑律縺ｯ縺ゅｊ縺後→縺・沽・縲・・・隧ｱ縺翫ｂ縺励ｍ縺九▲縺滂ｼ√∪縺溽ｾ主袖縺励＞繧ゅ・鬟溘∋縺ｫ陦後％縺・, okReason: '諢溯ｬ・蜈ｷ菴鍋噪縺ｪ諢滓Φ+霆ｽ縺・署譯医りｿ比ｿ｡縺励ｄ縺吶＞', category: 'romance' },
  { scene: '譌｢隱ｭ繧ｹ繝ｫ繝ｼ縺輔ｌ縺溷ｾ・, ng: '隱ｭ繧薙□・溷ｿ吶＠縺・・縺九↑・溷ｫ後□縺｣縺溘ｉ險縺｣縺ｦ縺上ｌ縺ｦ縺・＞繧医ゅ＃繧√ｓ縺ｭ菴輔°縺ゅ▲縺滂ｼ・, ngReason: '霑ｽ縺・ｩｰ繧√※縺・ｋ縲ゆｸ榊ｮ峨ｒ蜈ｨ驛ｨ縺ｶ縺､縺代※縺・ｋ', ok: '・・縲・譌･蠕・▲縺ｦ菴輔ｂ縺ｪ縺九▲縺溘ｉ・牙・豌暦ｼ滓怙霑題ｦ九▽縺代◆繧ｫ繝輔ぉ縺後♀縺吶☆繧√□繧芋沚ｰ', okReason: '閾ｪ辟ｶ縺ｪ隧ｱ鬘瑚ｻ｢謠帙ら嶌謇九ｒ雋ｬ繧√★譁ｰ縺励＞莨夊ｩｱ縺ｮ縺阪▲縺九￠繧剃ｽ懊ｋ', category: 'romance' },
  { scene: '蝟ｧ蝌ｩ縺励◆蠕後・莉ｲ逶ｴ繧・, ng: '繧ゅ≧縺・＞繧医らｧ√′謔ｪ縺・ｓ縺ｧ縺励ｇ縲ょ･ｽ縺阪↓縺励※縲・, ngReason: '蜿怜虚逧・判謦・ｼ医ヱ繝・す繝悶・繧｢繧ｰ繝ｬ繝・す繝厄ｼ峨よ悽蠢・′莨昴ｏ繧峨↑縺・, ok: '譏ｨ譌･縺ｯ縺贋ｺ偵＞繝偵・繝医い繝・・縺励■繧・▲縺溘・縲らｧ√ｂ險縺・婿縺後″縺､縺九▲縺溘り誠縺｡逹縺・※隧ｱ縺励◆縺・↑', okReason: '閾ｪ蛻・・髱槭ｒ隱阪ａ縺､縺､縲∝ｻｺ險ｭ逧・↑謠先｡医ｒ縺励※縺・ｋ', category: 'romance' },
  { scene: '繝・・繝医・隱倥＞譁ｹ', ng: '莉雁ｺｦ縺秘｣ｯ陦後″縺ｾ縺帙ｓ縺具ｼ溘＞縺､縺ｧ繧ゅ＞縺・〒縺吶ゅ←縺薙〒繧ゅ＞縺・〒縺吶・, ngReason: '荳ｸ謚輔￡縲ら嶌謇九↓閠・∴繧玖ｲ諡・ｒ謚ｼ縺嶺ｻ倥￠縺ｦ縺・ｋ', ok: '譚･騾ｱ縺ｮ蝨滓屆縲∵ｸ玖ｰｷ縺ｫ譁ｰ縺励￥縺ｧ縺阪◆繧､繧ｿ繝ｪ繧｢繝ｳ陦後°縺ｪ縺・ｼ溘ヱ繧ｹ繧ｿ縺檎ｾ主袖縺励＞繧峨＠縺・沚・, okReason: '譌･譎ゅ・蝣ｴ謇繝ｻ逅・罰縺悟・菴鍋噪縲ら嶌謇九・Yes/No繧帝∈縺ｶ縺縺・, category: 'romance' },
  // Business
  { scene: '繝｡繝ｼ繝ｫ縺ｮ譖ｸ縺榊・縺・, ng: '縺顔夢繧梧ｧ倥〒縺吶ょ・譌･縺ｮ莉ｶ縺ｧ縺吶′縲∫｢ｺ隱阪ｒ縺企｡倥＞縺励◆縺・→諤昴＞縺ｾ縺励※縲√＃騾｣邨｡縺輔○縺ｦ縺・◆縺縺阪∪縺励◆縲・, ngReason: '蜑咲ｽｮ縺阪′髟ｷ縺上∬ｦ∽ｻｶ縺後ｏ縺九ｉ縺ｪ縺・, ok: '縺顔夢繧梧ｧ倥〒縺吶ょ・譌･縺ｮ縲・・｡井ｻｶ縺ｫ縺､縺・※2轤ｹ遒ｺ隱阪〒縺吶・, okReason: '隕∽ｻｶ縺ｨ謨ｰ縺悟・鬆ｭ縺ｧ繧上°繧九りｪｭ繧蛛ｴ縺ｮ蠢・炊逧・ｲ諡・′蟆代↑縺・, category: 'business' },
  { scene: '萓晞ｼ縺ｮ譁ｭ繧頑婿', ng: '縺｡繧・▲縺ｨ辟｡逅・〒縺吶・縲ゆｻ悶・莠ｺ縺ｫ鬆ｼ繧薙〒繧ゅｉ縺｣縺ｦ縺・＞縺ｧ縺吶°縲・, ngReason: '蜀ｷ縺溘＞蜊ｰ雎｡縲ゆｻ｣譖ｿ譯医′縺ｪ縺・, ok: '莉企ｱ縺ｯ縲・・・蟇ｾ蠢懊〒蜴ｳ縺励＞迥ｶ豕√〒縺吶よ擂騾ｱ譛域屆莉･髯阪〒縺ゅｌ縺ｰ蟇ｾ蠢懊〒縺阪∪縺吶′縲√＞縺九′縺ｧ縺励ｇ縺・°・・, okReason: '逅・罰+莉｣譖ｿ譯医ｒ謠千､ｺ縲ら嶌謇九∈縺ｮ驟肴・縺後≠繧・, category: 'business' },
  { scene: '繝輔ぅ繝ｼ繝峨ヰ繝・け', ng: '縺薙・雉・侭縲∝・辟ｶ繝繝｡縺縺ｭ縲ゅｄ繧顔峩縺励※縲・, ngReason: '莠ｺ譬ｼ蜷ｦ螳壹ょ・菴鍋噪縺ｪ謾ｹ蝟・せ縺後↑縺・, ok: '繝・・繧ｿ縺ｮ謨ｴ逅・′縺励▲縺九ｊ縺励※縺ｦ濶ｯ縺・・縲・繝壹・繧ｸ逶ｮ縺ｮ繧ｰ繝ｩ繝輔ｒ譽偵げ繝ｩ繝輔↓螟峨∴繧九→豈碑ｼ・′莨昴ｏ繧翫ｄ縺吶￥縺ｪ繧九→諤昴≧', okReason: '濶ｯ縺・せ竊貞・菴鍋噪謾ｹ蝟・｡医４BI豕包ｼ・ituation-Behavior-Impact・・, category: 'business' },
  // Friend
  { scene: '謔ｩ縺ｿ逶ｸ隲・ｒ蜿励￠縺滓凾', ng: '縺昴ｓ縺ｪ縺ｮ豌励↓縺励↑縺上※縺・＞繧茨ｼ∬・∴縺吶℃縺縺｣縺ｦ・∝・豌怜・縺励※・・, ngReason: '諢滓ュ繧貞凄螳壹＠縺ｦ縺・ｋ縲ゅ梧ｰ励↓縺吶ｋ縺ｪ縲阪・逶ｸ謇九ｒ蜷ｦ螳壹☆繧玖ｨ闡・, ok: '縺昴▲縺九√◎繧後・縺､繧峨°縺｣縺溘・窶ｦ縲ゅ←縺・＠縺溘＞縺ｨ縺九∬・∴縺ｦ繧九％縺ｨ縺ゅｋ・・, okReason: '蜈ｱ諢溪・髢九＞縺溯ｳｪ蝠上ら嶌謇九・繝壹・繧ｹ縺ｧ隧ｱ縺帙ｋ', category: 'friend' },
  { scene: '邏・據縺ｮ繝峨ち繧ｭ繝｣繝ｳ', ng: '縺斐ａ繧難ｼ∽ｻ頑律辟｡逅・↓縺ｪ縺｣縺滂ｼ√∪縺滉ｻ雁ｺｦ縺ｭ・・, ngReason: '霆ｽ縺・ら嶌謇九・莠亥ｮ壹ｒ遨ｺ縺代※縺上ｌ縺滄・諷ｮ縺後↑縺・, ok: '縺斐ａ繧薙∵･縺ｪ莉穂ｺ九′蜈･縺｣縺ｦ縺励∪縺｣縺ｦ莉頑律陦後￠縺ｪ縺上↑縺｣縺溪ｦ縲よ悽蠖薙↓讌ｽ縺励∩縺ｫ縺励※縺溘・縺ｫ逕ｳ縺苓ｨｳ縺ｪ縺・よ擂騾ｱ縺ｮ縲・屆譌･縺ｯ縺ｩ縺・ｼ・, okReason: '逅・罰+逕ｳ縺苓ｨｳ縺ｪ縺・蜈ｷ菴鍋噪縺ｪ莉｣譖ｿ譯・, category: 'friend' },
  // SNS
  { scene: '繧ｳ繝｡繝ｳ繝医・莉墓婿', ng: '縺・＞縺ｭ総', ngReason: '縲後＞縺・・縲阪・繧ｿ繝ｳ縺ｨ螟峨ｏ繧峨↑縺・ょ魂雎｡縺ｫ谿九ｉ縺ｪ縺・, ok: '縺薙・讒句峙縺吶＃縺・ｼ√・・・縺ゅ◆繧翫・蜈峨・蜈･繧頑婿縺檎音縺ｫ螂ｽ縺阪ゅ←縺薙〒謦ｮ縺｣縺溘・・・, okReason: '蜈ｷ菴鍋噪縺ｪ諢滓Φ+雉ｪ蝠上〒莨夊ｩｱ縺檎函縺ｾ繧後ｋ', category: 'sns' },
  { scene: '轤惹ｸ翫＠縺昴≧縺ｪ譎・, ng: '縺昴ｌ縺ｯ驕輔≧縺ｨ諤昴＞縺ｾ縺吶ゅ・・・譁ｹ縺梧ｭ｣縺励＞縺ｧ縺吶ゆｻ･荳九√◎縺ｮ逅・罰繧定ｿｰ縺ｹ縺ｾ縺吮ｦ・磯聞譁・ｼ・, ngReason: 'SNS縺ｧ髟ｷ譁・渚隲悶・騾・柑譫懊ょ・髢九・蝣ｴ縺ｧ縺ｮ繝舌ヨ繝ｫ縺ｯ蜿梧婿縺ｫ繝繝｡繝ｼ繧ｸ', ok: '・亥・髢九・蝣ｴ縺ｧ縺ｯ蜿榊ｿ懊＠縺ｪ縺・ゅ←縺・＠縺ｦ繧ゆｼ昴∴縺溘＞縺ｪ繧吋M縺ｧ縲後・・・莉ｶ縲∝ｰ代＠豌励↓縺ｪ縺｣縺溘ｓ縺縺代←隧ｱ縺帙ｋ・溘搾ｼ・, okReason: '蜈ｬ髢九ヰ繝医Ν繧帝∩縺代ｋ縲ょ・髱吶↓繝励Λ繧､繝吶・繝医〒蟇ｾ隧ｱ', category: 'sns' },
]

// ==================== SUPPORT DATA ====================
const SUPPORT_ORGS = [
  { name: '繧医ｊ縺昴＞繝帙ャ繝医Λ繧､繝ｳ', tel: '0120-279-338', desc: '24譎る俣辟｡譁吶・逶ｸ隲・ｪ灘哨縲ゆｺｺ髢馴未菫ゅ∫函豢ｻ縲∝ｿ・・謔ｩ縺ｿ蜈ｨ闊ｬ', url: 'https://www.since2011.net/yorisoi/', emoji: '到' },
  { name: '縺・・縺｡縺ｮ髮ｻ隧ｱ', tel: '0120-783-556', desc: '蟄､迢ｬ繧・ｯｾ莠ｺ髢｢菫ゅ・謔ｩ縺ｿ繧定・縺上・繝ｩ繝ｳ繝・ぅ繧｢髮ｻ隧ｱ逶ｸ隲・, url: 'https://www.inochinodenwa.org/', emoji: '扮・・ },
  { name: 'DV逶ｸ隲・リ繝・, tel: '#8008', desc: 'DV・磯・蛛ｶ閠・垓蜉幢ｼ峨・逶ｸ隲・ｪ灘哨縲ょ・蝗ｽ縺ｮ譛蟇・ｊ逶ｸ隲・そ繝ｳ繧ｿ繝ｼ縺ｫ縺､縺ｪ縺後ｋ', url: 'https://www.gender.go.jp/policy/no_violence/dv_navi/', emoji: '孱・・ },
  { name: '繝・・繝・V逶ｸ隲・, tel: '050-3204-0404', desc: '10莉｣縲・0莉｣縺ｮ諱区・髢｢菫ゅ〒縺ｮDV逶ｸ隲・, url: 'https://notalone-ddv.org/', emoji: '樗' },
  { name: '邊ｾ逾樔ｿ晏▼遖冗･峨そ繝ｳ繧ｿ繝ｼ', tel: '窶・, desc: '蜷・・驕灘ｺ懃恁縺ｫ險ｭ鄂ｮ縲ゅΓ繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ縺ｮ蟆る摩逶ｸ隲・ｪ灘哨', url: 'https://www.mhlw.go.jp/kokoro/support/mhcenter.html', emoji: '唱' },
  { name: '繧ｫ繧ｦ繝ｳ繧ｻ繝ｪ繝ｳ繧ｰ讀懃ｴ｢', tel: '窶・, desc: '蜈ｨ蝗ｽ縺ｮ繧ｫ繧ｦ繝ｳ繧ｻ繝ｩ繝ｼ繧呈爾縺帙ｋ繧ｵ繧､繝医ょｯｾ髱｢繝ｻ繧ｪ繝ｳ繝ｩ繧､繝ｳ蟇ｾ蠢・, url: 'https://www.counselor.or.jp/', emoji: '剥' },
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
              <span className="text-2xl">町</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                AI繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ謾ｹ蝟・さ繝ｼ繝・              </h1>
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
              <h2 className="text-xl font-bold mb-1">町 繝｡繝・そ繝ｼ繧ｸ豺ｻ蜑晦I</h2>
              <p className="text-sm text-white/50">騾√ｊ縺溘＞繝｡繝・そ繝ｼ繧ｸ繧貞・蜉帙☆繧九→縲√ヨ繝ｼ繝ｳ繧・谿ｵ髫弱〒險ｺ譁ｭ縺玲隼蝟・｡医ｒ謠先｡医＠縺ｾ縺・/p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-white/60">繧ｷ繝ｼ繝ｳ:</span>
                <span className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-3 py-1 rounded-full text-xs">
                  {SCENES.find(s => s.id === scene)?.emoji} {SCENES.find(s => s.id === scene)?.label}
                </span>
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="騾√ｊ縺溘＞繝｡繝・そ繝ｼ繧ｸ繧貞・蜉帙＠縺ｦ縺上□縺輔＞..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/40">{reviewText.length} 譁・ｭ・/span>
                <button
                  onClick={handleReview}
                  disabled={!reviewText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
                >
                  豺ｻ蜑翫☆繧・                </button>
              </div>
            </div>

            {reviewResult && (
              <div className="space-y-4">
                {/* Overall */}
                <div className="bg-white/5 rounded-2xl p-5 text-center">
                  <p className="text-lg font-bold mb-1">{reviewResult.overall}</p>
                  <p className="text-xs text-white/50">
                    邱丞粋繧ｹ繧ｳ繧｢: {Math.round(reviewResult.tones.reduce((s, t) => s + t.score, 0) / reviewResult.tones.length)}轤ｹ
                  </p>
                </div>

                {/* Tone bars */}
                <div className="bg-white/5 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm">繝医・繝ｳ蛻・梵</h3>
                  {reviewResult.tones.map((t, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t.label}</span>
                        <span className="text-white/60">{t.score}轤ｹ</span>
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
                  <h3 className="font-bold text-sm mb-3">庁 謾ｹ蝟・い繝峨ヰ繧､繧ｹ</h3>
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
              <h2 className="text-xl font-bold mb-1">ｧ 蠢・炊蟄ｦ繝溘ル隰帛ｺｧ</h2>
              <p className="text-sm text-white/50">蟇ｾ莠ｺ髢｢菫ゅ↓蠖ｹ遶九▽蠢・炊蟄ｦ逅・ｫ悶ｒ螳溯ｷｵ逧・↓隗｣隱ｬ縲ょ・{PSYCHOLOGY_TOPICS.length}繝・・繝・/p>
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
                      <span className="text-white/30">竊・/span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setSelectedTopic(null)} className="text-sm text-pink-400 hover:text-pink-300 mb-4 flex items-center gap-1">
                  竊・繝・・繝樔ｸ隕ｧ縺ｫ謌ｻ繧・                </button>
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
              <h2 className="text-xl font-bold mb-1">投 繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ繧ｹ繧ｿ繧､繝ｫ險ｺ譁ｭ</h2>
              <p className="text-sm text-white/50">15蝠上↓遲斐∴縺ｦ縲√≠縺ｪ縺溘・繧ｳ繝溘Η繧ｹ繧ｿ繧､繝ｫ繧・繧ｿ繧､繝励↓蛻・｡・/p>
            </div>

            {!diagResult ? (
              <>
                <div className="space-y-3">
                  {DIAGNOSIS_QUESTIONS.map((q, qi) => (
                    <div key={qi} className="bg-white/5 rounded-xl p-4">
                      <p className="text-sm mb-3">Q{qi + 1}. {q.text}</p>
                      <div className="flex gap-2">
                        {[
                          { v: 1, label: '蜈ｨ縺丞ｽ薙※縺ｯ縺ｾ繧峨↑縺・ },
                          { v: 2, label: '縺ゅ∪繧・ },
                          { v: 3, label: '縺ｩ縺｡繧峨→繧・ },
                          { v: 4, label: '繧・ｄ蠖薙※縺ｯ縺ｾ繧・ },
                          { v: 5, label: '縺ｨ縺ｦ繧ょｽ薙※縺ｯ縺ｾ繧・ },
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
                  <p className="text-xs text-white/40 mb-3">{diagAnswers.length}/{DIAGNOSIS_QUESTIONS.length} 蝠丞屓遲疲ｸ医∩</p>
                  <button
                    onClick={calculateDiagnosis}
                    disabled={diagAnswers.length < DIAGNOSIS_QUESTIONS.length}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
                  >
                    險ｺ譁ｭ縺吶ｋ
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className={`bg-gradient-to-r ${diagResult.color} rounded-2xl p-6 text-center`}>
                  <span className="text-4xl block mb-2">{diagResult.emoji}</span>
                  <h3 className="text-2xl font-bold mb-1">縺ゅ↑縺溘・縲鶏diagResult.name}縲・/h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-sm mb-3 text-green-400">潮 蠑ｷ縺ｿ</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      {diagResult.strengths.map((s, i) => <li key={i}>笨・{s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-sm mb-3 text-amber-400">笞・・豕ｨ諢冗せ</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      {diagResult.weaknesses.map((w, i) => <li key={i}>笞｡ {w}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-5">
                  <h4 className="font-bold text-sm mb-3 text-pink-400">識 謾ｹ蝟・い繝峨ヰ繧､繧ｹ</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    {diagResult.tips.map((t, i) => <li key={i}>庁 {t}</li>)}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-2xl p-5 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs text-white/40 mb-1">逶ｸ諤ｧ縺瑚憶縺・ち繧､繝・/h4>
                    <p className="text-sm font-medium text-green-400">丁 {diagResult.compatible}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/40 mb-1">陦晉ｪ√＠繧・☆縺・ち繧､繝・/h4>
                    <p className="text-sm font-medium text-amber-400">笞｡ {diagResult.challenging}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setDiagResult(null); setDiagAnswers([]); localStorage.removeItem('comm-coach-diagnosis') }}
                  className="w-full py-2 bg-white/5 rounded-xl text-sm text-white/50 hover:bg-white/10 transition-colors"
                >
                  繧ゅ≧荳蠎ｦ險ｺ譁ｭ縺吶ｋ
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: PLANNER ==================== */}
        {tab === 'planner' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">欄・・莨夊ｩｱ繝励Λ繝ｳ繝翫・</h2>
              <p className="text-sm text-white/50">蝣ｴ髱｢縺ｫ蜷医ｏ縺帙◆莨夊ｩｱ縺ｮ豬√ｌ縺ｨ隧ｱ鬘後Μ繧ｹ繝医ｒ閾ｪ蜍慕函謌・/p>
            </div>

            {currentPlans.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40">
                縺薙・繧ｷ繝ｼ繝ｳ縺ｮ繝励Λ繝ｳ縺ｯ貅門ｙ荳ｭ縺ｧ縺・              </div>
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
                      <h3 className="font-bold text-sm mb-4">搭 莨夊ｩｱ繝輔Ο繝ｼ</h3>
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
                                    <span className="text-pink-400">窶｢</span> {t}
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
                      <h3 className="font-bold text-sm mb-3">庁 繝昴う繝ｳ繝・/h3>
                      <ul className="space-y-2">
                        {currentPlans[selectedPlan].tips.map((t, i) => (
                          <li key={i} className="text-sm text-white/70 flex gap-2">
                            <span>箝・/span> {t}
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
              <h2 className="text-xl font-bold mb-1">当 NG髮・ｼ・K髮・/h2>
              <p className="text-sm text-white/50">繧ｷ繝ｼ繝ｳ蛻･縺ｮ繧医￥縺ゅｋ螟ｱ謨励ヱ繧ｿ繝ｼ繝ｳ縺ｨ謾ｹ蝟・ｾ・/p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setExampleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${exampleFilter === 'all' ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50'}`}
              >
                縺吶∋縺ｦ
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
                      <div className="text-xs font-bold text-red-400 mb-2">笶・NG萓・/div>
                      <p className="text-sm text-white/80 mb-2">{ex.ng}</p>
                      <p className="text-xs text-red-300/70">竊・{ex.ngReason}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <div className="text-xs font-bold text-green-400 mb-2">笨・OK萓・/div>
                      <p className="text-sm text-white/80 mb-2">{ex.ok}</p>
                      <p className="text-xs text-green-300/70">竊・{ex.okReason}</p>
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
              <h2 className="text-xl font-bold mb-1">唱 逶ｸ隲・ｪ灘哨繧ｬ繧､繝・/h2>
              <p className="text-sm text-white/50">蟇ｾ莠ｺ髢｢菫ゅ・謔ｩ縺ｿ縺梧ｷｱ蛻ｻ縺ｪ蝣ｴ蜷医・縲∝ｰる摩螳ｶ縺ｫ逶ｸ隲・＠縺ｾ縺励ｇ縺・/p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-sm">
              <p className="font-bold text-amber-400 mb-1">庁 荳莠ｺ縺ｧ謚ｱ縺郁ｾｼ縺ｾ縺ｪ縺・〒</p>
              <p className="text-white/60">
                蟇ｾ莠ｺ髢｢菫ゅ・謔ｩ縺ｿ縺ｯ縲∬・蛻・□縺代〒隗｣豎ｺ縺励ｈ縺・→縺吶ｋ縺ｨ謔ｪ蛹悶☆繧九％縺ｨ縺後≠繧翫∪縺吶・                蟆代＠縺ｧ繧ゅ後▽繧峨＞縲阪→諢溘§縺溘ｉ縲∝ｰる摩螳ｶ縺ｫ逶ｸ隲・☆繧九％縺ｨ繧偵♀縺吶☆繧√＠縺ｾ縺吶・              </p>
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
                        {org.tel !== '窶・ && (
                          <a
                            href={`tel:${org.tel.replace(/-/g, '')}`}
                            className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs hover:bg-green-500/30 transition-colors"
                          >
                            到 {org.tel}
                          </a>
                        )}
                        <a
                          href={org.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs hover:bg-blue-500/30 transition-colors"
                        >
                          迫 Web繧ｵ繧､繝・                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-5 text-center">
              <p className="text-sm text-white/60 mb-2">邱頑･縺ｮ蝣ｴ蜷・/p>
              <a href="tel:110" className="text-2xl font-bold text-red-400 hover:text-red-300">
                圷 110・郁ｭｦ蟇滂ｼ・              </a>
              <p className="text-xs text-white/40 mt-1">DV繝ｻ繧ｹ繝医・繧ｫ繝ｼ陲ｫ螳ｳ縺ｪ縺ｩ霄ｫ縺ｮ蜊ｱ髯ｺ繧呈─縺倥◆繧芽ｿｷ繧上★騾壼ｱ</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">
          窶ｻ 縺薙・繝・・繝ｫ縺ｯ蠢・炊蟄ｦ縺ｮ荳闊ｬ逧・↑遏･隕九↓蝓ｺ縺･縺丞盾閠・ュ蝣ｱ縺ｧ縺吶よｷｱ蛻ｻ縺ｪ蟇ｾ莠ｺ蝠城｡後↓縺､縺・※縺ｯ蟆る摩螳ｶ縺ｫ縺皮嶌隲・￥縺縺輔＞縲・          <br />縺吶∋縺ｦ縺ｮ繝・・繧ｿ縺ｯ繝悶Λ繧ｦ繧ｶ蜀・↓菫晏ｭ倥＆繧後∝､夜Κ縺ｫ騾∽ｿ｡縺輔ｌ繧九％縺ｨ縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・        </p>
      </div>
    
      </div>
  )
}




