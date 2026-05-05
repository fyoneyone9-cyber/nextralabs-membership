'use client'


import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'diagnosis' | 'roadmap' | 'simulator' | 'templates' | 'tools' | 'log'

interface DiagnosisAnswer {
  questionIdx: number
  optionIdx: number
}

interface JobRecord {
  id: string
  category: string
  title: string
  revenue: number
  expense: number
  hours: number
  date: string
  note: string
}

// ==================== CONSTANTS ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'diagnosis', icon: 'ｧｭ', label: '驕ｩ諤ｧ險ｺ譁ｭ' },
  { id: 'roadmap', icon: '搭', label: '繝ｭ繝ｼ繝峨・繝・・' },
  { id: 'simulator', icon: '腸', label: '蜿守寢繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ' },
  { id: 'templates', icon: '笨搾ｸ・, label: '繝・Φ繝励Ξ繝ｼ繝磯寔' },
  { id: 'tools', icon: '屏・・, label: 'AI繝・・繝ｫ霎槫・' },
  { id: 'log', icon: '投', label: '豢ｻ蜍輔Ο繧ｰ' },
]

interface SidejobCategory {
  id: string
  num: number
  name: string
  icon: string
  level: 'beginner' | 'advanced'
  description: string
  avgRevenue: string
  startCost: string
  timeToFirst: string
  difficulty: number // 1-5
  tags: string[]
  roadmapSteps: string[]
  requiredTools: string[]
  priceRange: { label: string; min: number; max: number }
  tips: string[]
  aiTools: { name: string; desc: string; free: boolean; url: string }[]
}

const CATEGORIES: SidejobCategory[] = [
  {
    id: 'image-design', num: 1, name: '逕ｻ蜒丞宛菴懊・繝舌リ繝ｼ繝ｻ繧ｵ繝繝・, icon: '名・・, level: 'beginner',
    description: 'AI逕ｻ蜒冗函謌舌ヤ繝ｼ繝ｫ縺ｧ繝舌リ繝ｼ繝ｻ繧ｵ繝繝阪う繝ｫ繝ｻSNS邏譚舌ｒ蛻ｶ菴懊＠縺ｦ雋ｩ螢ｲ',
    avgRevenue: '譛・縲・5荳・・', startCost: '0縲・,000蜀・譛・, timeToFirst: '1縲・騾ｱ髢・, difficulty: 2,
    tags: ['Midjourney', 'Canva', 'DALL-E', '繝・じ繧､繝ｳ'],
    roadmapSteps: ['AI繝・・繝ｫ驕ｸ螳夲ｼ・anva辟｡譁・or Midjourney $10/譛茨ｼ・, '繝舌リ繝ｼ10譫壹・邱ｴ鄙偵・繝ｼ繝医ヵ繧ｩ繝ｪ繧ｪ菴懈・', '繧ｳ繧ｳ繝翫Λ/繧ｯ繝ｩ繧ｦ繝峨Ρ繝ｼ繧ｯ繧ｹ縺ｫ蜃ｺ蜩・, '譛蛻昴・1莉ｶ繧剃ｽ惹ｾ｡譬ｼ・按･1,000縲懶ｼ峨〒蜿玲ｳｨ', '繝昴・繝医ヵ繧ｩ繝ｪ繧ｪ諡｡蜈・・蜊倅ｾ｡繧｢繝・・・按･3,000縲慊･10,000・・, '繝ｪ繝斐・繧ｿ繝ｼ迯ｲ蠕冷・譛・0莉ｶ螳牙ｮ・],
    requiredTools: ['Canva', 'Midjourney or DALL-E', 'Photoshop・医≠繧後・蟆壼庄・・],
    priceRange: { label: '繝舌リ繝ｼ1譫・, min: 1000, max: 10000 },
    tips: ['譛蛻昴・縲御ｿｮ豁｣2蝗樒┌譁吶阪〒蟾ｮ蛻･蛹・, '繧ｸ繝｣繝ｳ繝ｫ迚ｹ蛹厄ｼ磯｣ｲ鬟溷ｺ励ヰ繝翫・蟆る摩遲会ｼ峨′蠑ｷ縺・, '繝・Φ繝励Ξ繝ｼ繝郁ｲｩ螢ｲ縺ｧ荳榊感謇蠕怜喧繧ょ庄閭ｽ'],
    aiTools: [
      { name: 'Canva', desc: '繝・Φ繝励Ξ繝ｼ繝郁ｱ雁ｯ後↑繝・じ繧､繝ｳ繝・・繝ｫ縲・I逕ｻ蜒冗函謌仙・阡ｵ', free: true, url: 'https://www.canva.com/' },
      { name: 'Midjourney', desc: '鬮伜刀雉ｪAI逕ｻ蜒冗函謌舌・10/譛医・, free: false, url: 'https://www.midjourney.com/' },
      { name: 'Adobe Firefly', desc: 'Adobe陬ｽAI逕ｻ蜒冗函謌舌ょ膚逕ｨ蛻ｩ逕ｨ螳牙ｿ・, free: true, url: 'https://firefly.adobe.com/' },
      { name: 'Leonardo AI', desc: '辟｡譁呎棧縺ゅｊ縲らｴｰ縺九＞蛻ｶ蠕｡縺悟庄閭ｽ', free: true, url: 'https://leonardo.ai/' },
    ],
  },
  {
    id: 'writing', num: 2, name: '繝ｩ繧､繝・ぅ繝ｳ繧ｰ繝ｻ險倅ｺ狗ｷｨ髮・, icon: '笨搾ｸ・, level: 'beginner',
    description: 'AI豢ｻ逕ｨ縺ｧSEO險倅ｺ九・繝悶Ο繧ｰ繝ｻ蝠・刀隱ｬ譏取枚縺ｪ縺ｩ繧貞濤遲・,
    avgRevenue: '譛・縲・0荳・・', startCost: '0縲・,000蜀・譛・, timeToFirst: '1騾ｱ髢・, difficulty: 2,
    tags: ['ChatGPT', 'Claude', 'SEO', 'WordPress'],
    roadmapSteps: ['ChatGPT/Claude縺ｮ蝓ｺ譛ｬ謫堺ｽ懊ｒ鄙貞ｾ・, 'SEO繝ｩ繧､繝・ぅ繝ｳ繧ｰ縺ｮ蝓ｺ遉主ｭｦ鄙抵ｼ・縲・譌･・・, '繧ｵ繝ｳ繝励Ν險倅ｺ・譛ｬ菴懈・', '繧ｯ繝ｩ繧ｦ繝峨た繝ｼ繧ｷ繝ｳ繧ｰ縺ｧ譁・ｭ怜腰萓｡0.5縲・蜀・・譯井ｻｶ縺ｫ蠢懷供', '螳溽ｸｾ5莉ｶ竊偵・繝ｭ繝輔ぅ繝ｼ繝ｫ蠑ｷ蛹・, '譁・ｭ怜腰萓｡2縲・蜀・↓莠､貂峨い繝・・'],
    requiredTools: ['ChatGPT or Claude', 'Google繝峨く繝･繝｡繝ｳ繝・, 'WordPress・育ｴ榊刀蠖｢蠑上↓繧医ｋ・・],
    priceRange: { label: '3000蟄苓ｨ倅ｺ・, min: 1500, max: 15000 },
    tips: ['AI荳ｸ謚輔￡縺ｯ蠢・★繝舌Ξ繧九よｧ区・竊但I荳区嶌縺坂・莠ｺ髢薙′邱ｨ髮・・繝輔Ο繝ｼ', '蟆る摩繧ｸ繝｣繝ｳ繝ｫ・亥現逋・驥題檮/IT・峨・蜊倅ｾ｡2蛟堺ｻ･荳・, '蜿匁攝險倅ｺ九・繧､繝ｳ繧ｿ繝薙Η繝ｼ險倅ｺ九・AI遶ｶ蜷医′蟆代↑縺城ｫ伜腰萓｡'],
    aiTools: [
      { name: 'ChatGPT', desc: '豎守畑繝ｩ繧､繝・ぅ繝ｳ繧ｰ縲・PT-4o縺ｧ鬮伜刀雉ｪ', free: true, url: 'https://chat.openai.com/' },
      { name: 'Claude', desc: '髟ｷ譁・・讒区・縺ｫ蠑ｷ縺・よ律譛ｬ隱槫刀雉ｪ縺碁ｫ倥＞', free: true, url: 'https://claude.ai/' },
      { name: 'Notion AI', desc: '繝峨く繝･繝｡繝ｳ繝亥・縺ｧAI陬懷ｮ・, free: false, url: 'https://www.notion.so/' },
      { name: 'Perplexity', desc: '繝ｪ繧ｵ繝ｼ繝∫音蛹泡I縲ゅた繝ｼ繧ｹ莉倥″', free: true, url: 'https://www.perplexity.ai/' },
    ],
  },
  {
    id: 'sns-management', num: 3, name: 'SNS驕狗畑', icon: '導', level: 'beginner',
    description: 'AI豢ｻ逕ｨ縺ｧ莨∵･ｭ繝ｻ蛟倶ｺｺ縺ｮSNS謚慕ｨｿ莉｣陦後・繧ｳ繝ｳ繝・Φ繝・ｼ∫判',
    avgRevenue: '譛・縲・0荳・・/繧｢繧ｫ繧ｦ繝ｳ繝・, startCost: '0蜀・, timeToFirst: '2縲・騾ｱ髢・, difficulty: 2,
    tags: ['Instagram', 'X', 'TikTok', '驕狗畑莉｣陦・],
    roadmapSteps: ['閾ｪ蛻・・SNS繧｢繧ｫ繧ｦ繝ｳ繝医〒AI豢ｻ逕ｨ謚慕ｨｿ繧貞ｮ溯ｷｵ', '30譌･髢馴｣邯壽兜遞ｿ縺ｧ繝弱え繝上え闢・ｩ・, '驕狗畑螳溽ｸｾ繧偵・繝ｼ繝医ヵ繧ｩ繝ｪ繧ｪ蛹・, '蛟倶ｺｺ蠎苓・繝ｻ蟆剰ｦ乗ｨ｡莠区･ｭ閠・↓蝟ｶ讌ｭ', '譛磯｡榊･醍ｴ・ｼ・縲・荳・・/繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ峨ｒ謠先｡・, '隍・焚繧｢繧ｫ繧ｦ繝ｳ繝磯°逕ｨ縺ｧ蜿主・螳牙ｮ・],
    requiredTools: ['ChatGPT・域兜遞ｿ譁・函謌撰ｼ・, 'Canva・育判蜒丞宛菴懶ｼ・, '蜷ТNS繧｢繝励Μ'],
    priceRange: { label: '譛磯｡埼°逕ｨ莉｣陦・, min: 30000, max: 100000 },
    tips: ['縺ｾ縺夊・蛻・・繧｢繧ｫ繧ｦ繝ｳ繝医〒謌先棡繧貞・縺吶・縺梧怙螟ｧ縺ｮ蝟ｶ讌ｭ譚先侭', '蝨ｰ蜈・・鬟ｲ鬟溷ｺ励・鄒主ｮｹ螳､縺檎漁縺・岼', '謚慕ｨｿ繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ邂｡逅・∪縺ｧ蜷ｫ繧√ｋ縺ｨ莉伜刈萓｡蛟､UP'],
    aiTools: [
      { name: 'ChatGPT', desc: '謚慕ｨｿ譁・・繧ｭ繝｣繝励す繝ｧ繝ｳ逕滓・', free: true, url: 'https://chat.openai.com/' },
      { name: 'Canva', desc: 'SNS逕ｨ繝・Φ繝励Ξ繝ｼ繝医′雎雁ｯ・, free: true, url: 'https://www.canva.com/' },
      { name: 'CapCut', desc: '繝ｪ繝ｼ繝ｫ/繧ｷ繝ｧ繝ｼ繝亥虚逕ｻ邱ｨ髮・, free: true, url: 'https://www.capcut.com/' },
    ],
  },
  {
    id: 'web-creation', num: 4, name: 'Web蛻ｶ菴・, icon: '倹', level: 'beginner',
    description: 'AI繝弱・繧ｳ繝ｼ繝峨ヤ繝ｼ繝ｫ縺ｧLP繝ｻWeb繧ｵ繧､繝医ｒ蛻ｶ菴・,
    avgRevenue: '譛・縲・0荳・・', startCost: '0縲・,000蜀・譛・, timeToFirst: '2縲・騾ｱ髢・, difficulty: 3,
    tags: ['v0', 'Bolt', '繝弱・繧ｳ繝ｼ繝・, 'LP'],
    roadmapSteps: ['v0/Bolt縺ｧLP蛻ｶ菴懊ｒ邱ｴ鄙抵ｼ・縲・菴懷刀・・, '繝昴・繝医ヵ繧ｩ繝ｪ繧ｪ繧ｵ繧､繝井ｽ懈・', '繧ｳ繧ｳ繝翫Λ縺ｧ縲窟I縺ｧLP蛻ｶ菴懊榊・蜩・, 'LP1繝壹・繧ｸﾂ･30,000縲懊〒蜿玲ｳｨ髢句ｧ・, '菫晏ｮ医・譖ｴ譁ｰ縺ｮ譛磯｡榊･醍ｴ・ｒ謠先｡・, 'WordPress竊但I繝弱・繧ｳ繝ｼ繝臥ｧｻ陦梧｡井ｻｶ繧ら漁縺・],
    requiredTools: ['v0 by Vercel', 'Bolt.new', 'GitHub・亥渕譛ｬ謫堺ｽ懶ｼ・],
    priceRange: { label: 'LP1繝壹・繧ｸ', min: 30000, max: 150000 },
    tips: ['縲窟I縺ｧ譌ｩ縺・・螳峨＞縲阪〒縺ｯ縺ｪ縺上悟刀雉ｪ縺碁ｫ倥＞縺ｮ縺ｫ縺薙・萓｡譬ｼ縲阪〒螢ｲ繧・, '繝ｬ繧ｹ繝昴Φ繧ｷ繝門ｯｾ蠢懊・蠢・・, '菫晏ｮ亥･醍ｴ・ｼ域怦5,000縲・0,000蜀・ｼ峨′螳牙ｮ壼庶蜈･縺ｮ骰ｵ'],
    aiTools: [
      { name: 'v0 by Vercel', desc: '繝励Ο繝ｳ繝励ヨ縺九ｉReact繧ｳ繝ｳ繝昴・繝阪Φ繝育函謌・, free: true, url: 'https://v0.dev/' },
      { name: 'Bolt.new', desc: '繝輔Ν繧ｹ繧ｿ繝・け繧｢繝励Μ繧但I縺ｧ讒狗ｯ・, free: true, url: 'https://bolt.new/' },
      { name: 'Cursor', desc: 'AI繧ｳ繝ｼ繝・ぅ繝ｳ繧ｰ繧ｨ繝・ぅ繧ｿ', free: true, url: 'https://cursor.sh/' },
    ],
  },
  {
    id: 'note-ebook', num: 5, name: 'note繝ｻ髮ｻ蟄先嶌邀・, icon: '統', level: 'beginner',
    description: 'AI縺ｧ蝓ｷ遲・・note譛画侭險倅ｺ九ｄ髮ｻ蟄先嶌邀阪→縺励※雋ｩ螢ｲ',
    avgRevenue: '譛・縲・0荳・・', startCost: '0蜀・, timeToFirst: '1縲・騾ｱ髢・, difficulty: 2,
    tags: ['note', 'Kindle', 'Brain', '譛画侭險倅ｺ・],
    roadmapSteps: ['繝九ャ繝√ず繝｣繝ｳ繝ｫ縺ｮ驕ｸ螳夲ｼ・I豢ｻ逕ｨ/蜑ｯ讌ｭ/繝弱え繝上え邉ｻ・・, 'AI縺ｧ荳区嶌縺坂・莠ｺ髢薙′邱ｨ髮・・菴馴ｨ楢ｫ・ｿｽ蜉', '辟｡譁呵ｨ倅ｺ・譛ｬ縺ｧ髮・ｮ｢', '譛画侭險倅ｺ具ｼ按･500縲慊･1,500・峨ｒ雋ｩ螢ｲ髢句ｧ・, 'Kindle蜃ｺ迚医〒髟ｷ譛溷庶逶雁喧', 'note繝｡繝ｳ繝舌・繧ｷ繝・・縺ｧ譛磯｡崎ｪｲ驥代Δ繝・Ν縺ｸ'],
    requiredTools: ['ChatGPT/Claude', 'note.com', 'Kindle Direct Publishing'],
    priceRange: { label: 'note譛画侭險倅ｺ・, min: 300, max: 3000 },
    tips: ['AI100%縺ｮ險倅ｺ九・螢ｲ繧後↑縺・ょｮ滉ｽ馴ｨ薙・迢ｬ閾ｪ繝・・繧ｿ縺御ｾ｡蛟､', '繧ｿ繧､繝医Ν縺ｨ繧ｵ繝繝阪う繝ｫ縺ｧ8蜑ｲ豎ｺ縺ｾ繧・, '繧ｷ繝ｪ繝ｼ繧ｺ蛹悶＠縺ｦ蝗ｺ螳夊ｪｭ閠・ｒ迯ｲ蠕・],
    aiTools: [
      { name: 'ChatGPT', desc: '讒区・繝ｻ荳区嶌縺阪・謗ｨ謨ｲ', free: true, url: 'https://chat.openai.com/' },
      { name: 'Claude', desc: '髟ｷ譁・濤遲・↓蠑ｷ縺・, free: true, url: 'https://claude.ai/' },
      { name: 'Gamma', desc: '繧ｹ繝ｩ繧､繝・繝峨く繝･繝｡繝ｳ繝郁・蜍慕函謌・, free: true, url: 'https://gamma.app/' },
    ],
  },
  {
    id: 'video-editing', num: 6, name: '蜍慕判蛻ｶ菴懊・邱ｨ髮・, icon: '汐', level: 'beginner',
    description: 'AI蜍慕判繝・・繝ｫ縺ｧYouTube邱ｨ髮・・繧ｷ繝ｧ繝ｼ繝亥虚逕ｻ蛻ｶ菴・,
    avgRevenue: '譛・縲・0荳・・', startCost: '0縲・,000蜀・譛・, timeToFirst: '2縲・騾ｱ髢・, difficulty: 3,
    tags: ['CapCut', 'Runway', 'Kling', 'YouTube'],
    roadmapSteps: ['CapCut/Runway遲峨〒AI邱ｨ髮・ｒ鄙貞ｾ・, '繧ｵ繝ｳ繝励Ν蜍慕判3譛ｬ蛻ｶ菴・, 'YouTuber蜷代￠縺ｫ縲窟I邱ｨ髮・〒邏肴悄蜊雁・縲阪ｒ險ｴ豎・, '1譛ｬﾂ･5,000縲懊〒蜿玲ｳｨ髢句ｧ・, '繝・Φ繝励Ξ繝ｼ繝亥喧縺励※蜉ｹ邇ⅡP', '繧ｷ繝ｧ繝ｼ繝亥虚逕ｻ驥冗肇蝙九・譛磯｡榊･醍ｴ・ｒ迢吶≧'],
    requiredTools: ['CapCut', 'Runway ML or Kling', 'DaVinci Resolve・育┌譁呻ｼ・],
    priceRange: { label: 'YouTube蜍慕判1譛ｬ・・0蛻・ｼ・, min: 5000, max: 30000 },
    tips: ['繝・Ο繝・・繝ｻ繧ｫ繝・ヨ邱ｨ髮・・AI縺梧怙繧ょｾ玲э縺ｪ鬆伜沺', '繧ｷ繝ｧ繝ｼ繝亥虚逕ｻ驥冗肇縺ｯ蜊倅ｾ｡菴弱＞縺御ｻｶ謨ｰ縺ｧ遞ｼ縺偵ｋ', '繧ｸ繝｣繝ｳ繝ｫ迚ｹ蛹厄ｼ医ご繝ｼ繝螳滓ｳ・繝薙ず繝阪せ遲会ｼ峨〒蟾ｮ蛻･蛹・],
    aiTools: [
      { name: 'CapCut', desc: 'AI蟄怜ｹ輔・AI邱ｨ髮・・阡ｵ縲ら┌譁・, free: true, url: 'https://www.capcut.com/' },
      { name: 'Runway ML', desc: 'AI蜍慕判逕滓・繝ｻ邱ｨ髮・・蜈磯ｧ・・, free: true, url: 'https://runwayml.com/' },
      { name: 'Kling', desc: '鬮伜刀雉ｪAI蜍慕判逕滓・', free: true, url: 'https://klingai.com/' },
      { name: 'Descript', desc: '譁・ｭ苓ｵｷ縺薙＠竊貞虚逕ｻ邱ｨ髮・, free: true, url: 'https://www.descript.com/' },
    ],
  },
  {
    id: 'line-stamp', num: 7, name: 'LINE繧ｹ繧ｿ繝ｳ繝苓ｲｩ螢ｲ', icon: '町', level: 'beginner',
    description: 'AI逕ｻ蜒冗函謌舌〒LINE繧ｹ繧ｿ繝ｳ繝励ｒ蛻ｶ菴懊・雋ｩ螢ｲ',
    avgRevenue: '譛・,000縲・荳・・', startCost: '0蜀・, timeToFirst: '2縲・騾ｱ髢難ｼ亥ｯｩ譟ｻ霎ｼ縺ｿ・・, difficulty: 1,
    tags: ['LINE', 'AI逕ｻ蜒冗函謌・, '荳榊感謇蠕・],
    roadmapSteps: ['AI縺ｧ繧ｭ繝｣繝ｩ繧ｯ繧ｿ繝ｼ繝・じ繧､繝ｳ・育ｵｱ荳諢溘′驥崎ｦ・ｼ・, '8/16/24/32/40蛟九そ繝・ヨ繧貞宛菴・, '閭梧勹騾城℃蜃ｦ逅・ｼ・emove.bg遲会ｼ・, 'LINE Creators Market縺ｫ逋ｻ骭ｲ繝ｻ逕ｳ隲・, '蟇ｩ譟ｻ騾夐℃蠕後↓雋ｩ螢ｲ髢句ｧ・, '隍・焚繧ｻ繝・ヨ螻暮幕縺ｧ蜿守寢諡｡螟ｧ'],
    requiredTools: ['Midjourney or DALL-E', 'remove.bg', 'LINE Creators Market'],
    priceRange: { label: '繧ｹ繧ｿ繝ｳ繝・繧ｻ繝・ヨ/譛・, min: 100, max: 5000 },
    tips: ['繧ｭ繝｣繝ｩ縺ｮ荳雋ｫ諤ｧ縺梧怙驥崎ｦ√ょ酔縺・eed/繧ｹ繧ｿ繧､繝ｫ縺ｧ邨ｱ荳', '譌･蟶ｸ縺ゅ＞縺輔▽邉ｻ縺御ｸ逡ｪ螢ｲ繧後ｋ', '40蛟九そ繝・ヨ縺悟｣ｲ荳雁柑邇・怙鬮・, '荳蠎ｦ菴懊ｌ縺ｰ豌ｸ邯夂噪縺ｫ蜿守寢逋ｺ逕滂ｼ井ｸ榊感謇蠕怜梛・・],
    aiTools: [
      { name: 'Midjourney', desc: '繧ｭ繝｣繝ｩ繧ｯ繧ｿ繝ｼ縺ｮ荳雋ｫ諤ｧ縺碁ｫ倥＞', free: false, url: 'https://www.midjourney.com/' },
      { name: 'DALL-E 3', desc: 'ChatGPT蜀・〒逶ｴ謗･逕滓・', free: true, url: 'https://chat.openai.com/' },
      { name: 'remove.bg', desc: '閭梧勹騾城℃・医せ繧ｿ繝ｳ繝怜ｿ・茨ｼ・, free: true, url: 'https://www.remove.bg/' },
    ],
  },
  {
    id: 'audio-content', num: 8, name: '閠ｳ蟄ｦ・磯浹螢ｰ繧ｳ繝ｳ繝・Φ繝・ｼ・, icon: '而', level: 'beginner',
    description: 'AI髻ｳ螢ｰ繝ｻ蜿ｰ譛ｬ逕滓・縺ｧPodcast繝ｻ髻ｳ螢ｰ謨呎攝繧貞宛菴・,
    avgRevenue: '譛・縲・0荳・・', startCost: '0縲・,000蜀・譛・, timeToFirst: '1縲・騾ｱ髢・, difficulty: 2,
    tags: ['Podcast', 'Voicy', 'TTS', '髻ｳ螢ｰ'],
    roadmapSteps: ['繧ｸ繝｣繝ｳ繝ｫ驕ｸ螳夲ｼ医ン繧ｸ繝阪せ/閾ｪ蟾ｱ蝠鍋匱/繝九Η繝ｼ繧ｹ隗｣隱ｬ・・, 'AI縺ｧ蜿ｰ譛ｬ逕滓・竊定・蛻・・螢ｰ縺ｧ蜿朱鹸 or AI髻ｳ螢ｰ', 'Anchor/Spotify縺ｧ驟堺ｿ｡髢句ｧ・, '騾ｱ2縲・繧ｨ繝斐た繝ｼ繝峨ｒ邯咏ｶ・, '繧ｹ繝昴Φ繧ｵ繝ｼ迯ｲ蠕・or 譛画侭繧ｳ繝ｳ繝・Φ繝・喧', 'Audible/audiobook.jp縺ｧ髻ｳ螢ｰ謨呎攝雋ｩ螢ｲ'],
    requiredTools: ['ChatGPT・亥床譛ｬ・・, 'ElevenLabs or VOICEVOX', 'Anchor for Podcasters'],
    priceRange: { label: '繧ｹ繝昴Φ繧ｵ繝ｼ蜿主・/譛・, min: 5000, max: 50000 },
    tips: ['AI髻ｳ螢ｰ縺縺代□縺ｨ蟾ｮ蛻･蛹門峅髮｣縲り・蛻・・螢ｰ+AI繧｢繧ｷ繧ｹ繝医′逅・Φ', '繝九ャ繝√ず繝｣繝ｳ繝ｫ縺ｻ縺ｩ繝ｪ繧ｹ繝翫・縺ｮ辭ｱ驥上′鬮倥＞', '繝・く繧ｹ繝医さ繝ｳ繝・Φ繝・・髻ｳ螢ｰ迚医Μ繝代・繝代せ縺悟柑邇・噪'],
    aiTools: [
      { name: 'ElevenLabs', desc: '鬮伜刀雉ｪAI髻ｳ螢ｰ逕滓・', free: true, url: 'https://elevenlabs.io/' },
      { name: 'VOICEVOX', desc: '辟｡譁吶・譌･譛ｬ隱樣浹螢ｰ蜷域・', free: true, url: 'https://voicevox.hiroshiba.jp/' },
      { name: 'ChatGPT', desc: '蜿ｰ譛ｬ繝ｻ讒区・縺ｮ逕滓・', free: true, url: 'https://chat.openai.com/' },
    ],
  },
  {
    id: 'presentation', num: 9, name: '雉・侭菴懈・', icon: '投', level: 'beginner',
    description: 'AI縺ｧ繝薙ず繝阪せ雉・侭繝ｻ繝励Ξ繧ｼ繝ｳ繝ｻ謠先｡域嶌繧剃ｻ｣陦悟宛菴・,
    avgRevenue: '譛・縲・5荳・・', startCost: '0蜀・, timeToFirst: '1縲・騾ｱ髢・, difficulty: 2,
    tags: ['Gamma', 'PowerPoint', 'Google繧ｹ繝ｩ繧､繝・],
    roadmapSteps: ['Gamma/Beautiful.ai縺ｧAI雉・侭蛻ｶ菴懊ｒ邱ｴ鄙・, '繧ｵ繝ｳ繝励Ν雉・侭5遞ｮ菴懈・・亥霧讌ｭ/莨∫判/蝣ｱ蜻・謠先｡・繧ｻ繝溘リ繝ｼ・・, '繧ｳ繧ｳ繝翫Λ縲窟I雉・侭菴懈・莉｣陦後榊・蜩・, '1雉・侭ﾂ･5,000縲懊〒蜿玲ｳｨ', '繝・Φ繝励Ξ繝ｼ繝郁ｲｩ螢ｲ・按･1,000縲懶ｼ峨ｂ荳ｦ陦・, '豕穂ｺｺ逶ｴ螂醍ｴ・〒譛磯｡肴｡井ｻｶ迯ｲ蠕・],
    requiredTools: ['Gamma', 'PowerPoint or Google繧ｹ繝ｩ繧､繝・, 'Canva'],
    priceRange: { label: '繝励Ξ繧ｼ繝ｳ雉・侭・・0P・・, min: 5000, max: 30000 },
    tips: ['縲後ョ繧ｶ繧､繝ｳ縺後″繧後＞縲阪ｈ繧翫瑚ｫ也炊讒区・縺梧・遒ｺ縲阪′隧穂ｾ｡縺輔ｌ繧・, '繝・Φ繝励Ξ繝ｼ繝郁ｲｩ螢ｲ縺ｯ荳榊感謇蠕怜梛', '闍ｱ隱櫁ｳ・侭縺ｯ蜊倅ｾ｡2縲・蛟・],
    aiTools: [
      { name: 'Gamma', desc: '繝励Ο繝ｳ繝励ヨ竊偵・繝ｬ繧ｼ繝ｳ閾ｪ蜍慕函謌・, free: true, url: 'https://gamma.app/' },
      { name: 'Beautiful.ai', desc: 'AI繝・じ繧､繝ｳ繧ｹ繝ｩ繧､繝・, free: false, url: 'https://www.beautiful.ai/' },
      { name: 'Canva', desc: '繝励Ξ繧ｼ繝ｳ繝・Φ繝励Ξ繝ｼ繝郁ｱ雁ｯ・, free: true, url: 'https://www.canva.com/' },
    ],
  },
  // === Advanced ===
  {
    id: 'online-course', num: 10, name: '繧ｪ繝ｳ繝ｩ繧､繝ｳ謨呎攝雋ｩ螢ｲ', icon: '答', level: 'advanced',
    description: 'AI豢ｻ逕ｨ繝弱え繝上え繧偵が繝ｳ繝ｩ繧､繝ｳ謨呎攝縺ｨ縺励※雋ｩ螢ｲ',
    avgRevenue: '譛・縲・0荳・・', startCost: '0縲・,000蜀・, timeToFirst: '1縲・繝ｶ譛・, difficulty: 4,
    tags: ['Udemy', 'Brain', 'Tips', '謨呎攝'],
    roadmapSteps: ['閾ｪ蛻・・蠕玲э繧ｸ繝｣繝ｳ繝ｫﾃ輸I豢ｻ逕ｨ縺ｮ繧ｫ繝ｪ繧ｭ繝･繝ｩ繝險ｭ險・, 'AI縺ｧ讒区・繝ｻ繝・く繧ｹ繝育函謌絶・蜍慕判謦ｮ蠖ｱ/繧ｹ繝ｩ繧､繝牙宛菴・, 'Udemy/Brain縺ｫ蜃ｺ蜩・, 'SNS縺ｧ髮・ｮ｢竊貞・譛溘Ξ繝薙Η繝ｼ迯ｲ蠕・, '蜿苓ｬ幄・ヵ繧｣繝ｼ繝峨ヰ繝・け縺ｧ謾ｹ蝟・, '繧ｷ繝ｪ繝ｼ繧ｺ蛹悶・荳顔ｴ壹さ繝ｼ繧ｹ霑ｽ蜉'],
    requiredTools: ['ChatGPT/Claude', 'Gamma/Canva', '逕ｻ髱｢骭ｲ逕ｻ繧ｽ繝輔ヨ', 'Udemy/Brain'],
    priceRange: { label: '謨呎攝1繧ｳ繝ｼ繧ｹ', min: 3000, max: 30000 },
    tips: ['縲窟Iﾃ冷雷笳九阪・繝九ャ繝√′迢吶＞逶ｮ・・Iﾃ嶺ｸ榊虚逕｣謚戊ｳ・ｭ会ｼ・, '螳檎挑繧堤岼謖・＆縺壽掠縺上Μ繝ｪ繝ｼ繧ｹ竊呈隼蝟・′驩・援', 'Udemy縺ｯ繧ｻ繝ｼ繝ｫ譎ゅ↓螟ｧ驥剰ｳｼ蜈･縺輔ｌ繧九・縺ｧ謨ｰ縺悟多'],
    aiTools: [
      { name: 'ChatGPT', desc: '繧ｫ繝ｪ繧ｭ繝･繝ｩ繝險ｭ險医・蜿ｰ譛ｬ', free: true, url: 'https://chat.openai.com/' },
      { name: 'Gamma', desc: '謨呎攝繧ｹ繝ｩ繧､繝芽・蜍慕函謌・, free: true, url: 'https://gamma.app/' },
      { name: 'Loom', desc: '逕ｻ髱｢骭ｲ逕ｻ+蜈ｱ譛・, free: true, url: 'https://www.loom.com/' },
    ],
  },
  {
    id: 'prompt-sales', num: 11, name: 'AI繝励Ο繝ｳ繝励ヨ雋ｩ螢ｲ', icon: '､・, level: 'advanced',
    description: '鬮伜刀雉ｪ縺ｪAI繝励Ο繝ｳ繝励ヨ繧貞宛菴懊・雋ｩ螢ｲ',
    avgRevenue: '譛・縲・0荳・・', startCost: '0蜀・, timeToFirst: '1縲・騾ｱ髢・, difficulty: 3,
    tags: ['PromptBase', '繝励Ο繝ｳ繝励ヨ', 'Midjourney'],
    roadmapSteps: ['迚ｹ螳壹ず繝｣繝ｳ繝ｫ縺ｮ鬮伜刀雉ｪ繝励Ο繝ｳ繝励ヨ髢狗匱', '蜃ｺ蜉帙し繝ｳ繝励Ν逕ｻ蜒・繝・く繧ｹ繝医ｒ逕ｨ諢・, 'PromptBase/note/Brain縺ｧ雋ｩ螢ｲ', 'SNS縺ｧ繝励Ο繝ｳ繝励ヨ縺ｮ蜃ｺ蜉帑ｾ九ｒ謚慕ｨｿ竊帝寔螳｢', '繝励Ο繝ｳ繝励ヨ繝代ャ繧ｯ・・0蛟九そ繝・ヨ遲会ｼ峨〒蜊倅ｾ｡UP', '繧ｵ繝悶せ繧ｯ蝙具ｼ域怦鬘阪・繝ｭ繝ｳ繝励ヨ驟堺ｿ｡・峨∈逋ｺ螻・],
    requiredTools: ['蜷БI繝・・繝ｫ・・idjourney/ChatGPT遲会ｼ・, 'PromptBase', 'note・域律譛ｬ蟶ょｴ・・],
    priceRange: { label: '繝励Ο繝ｳ繝励ヨ1蛟・, min: 200, max: 5000 },
    tips: ['縲悟・迴ｾ諤ｧ縲阪′譛驥崎ｦ√りｪｰ縺御ｽｿ縺｣縺ｦ繧ょ酔縺伜刀雉ｪ縺悟・繧九％縺ｨ', '繝薙ヵ繧ｩ繝ｼ繧｢繝輔ち繝ｼ逕ｻ蜒上′譛蠑ｷ縺ｮ雋ｩ菫・, '譌･譛ｬ隱槭・繝ｭ繝ｳ繝励ヨ縺ｯ遶ｶ蜷亥ｰ代↑縺冗漁縺・岼'],
    aiTools: [
      { name: 'PromptBase', desc: '繝励Ο繝ｳ繝励ヨ蟆る摩繝槭・繧ｱ繝・ヨ繝励Ξ繧､繧ｹ', free: true, url: 'https://promptbase.com/' },
      { name: 'Midjourney', desc: '逕ｻ蜒上・繝ｭ繝ｳ繝励ヨ雋ｩ螢ｲ縺ｮ荳ｻ謌ｦ蝣ｴ', free: false, url: 'https://www.midjourney.com/' },
    ],
  },
  {
    id: 'chatbot-build', num: 12, name: 'AI繝√Ε繝・ヨ繝懊ャ繝域ｧ狗ｯ・, icon: '､・, level: 'advanced',
    description: '莨∵･ｭ蜷代￠FAQ閾ｪ蜍募喧繝ｻ繧ｫ繧ｹ繧ｿ繝繝√Ε繝・ヨ繝懊ャ繝医ｒ讒狗ｯ・,
    avgRevenue: '譛・0縲・0荳・・', startCost: '0縲・0,000蜀・譛・, timeToFirst: '1縲・繝ｶ譛・, difficulty: 4,
    tags: ['Dify', 'GPTs', 'FAQ閾ｪ蜍募喧', '豕穂ｺｺ蜷代￠'],
    roadmapSteps: ['Dify/GPTs縺ｧ繝√Ε繝・ヨ繝懊ャ繝域ｧ狗ｯ峨せ繧ｭ繝ｫ鄙貞ｾ・, '繝・Δ繝懊ャ繝・縺､菴懈・・・C/鬟ｲ鬟・繧ｯ繝ｪ繝九ャ繧ｯ・・, '蝨ｰ蜈・ｼ∵･ｭ縺ｫ繝・Δ謠先｡・, '讒狗ｯ芽ｲｻﾂ･100,000縲・譛磯｡堺ｿ晏ｮ按･10,000縲・, '讌ｭ遞ｮ蛻･繝・Φ繝励Ξ繝ｼ繝医〒讓ｪ螻暮幕', '蟆主・螳溽ｸｾ繧剃ｽｿ縺｣縺ｦ譁ｰ隕丞霧讌ｭ'],
    requiredTools: ['Dify', 'OpenAI API', 'GPTs・・hatGPT Plus・・],
    priceRange: { label: '繝懊ャ繝域ｧ狗ｯ・, min: 50000, max: 300000 },
    tips: ['縲悟撫縺・粋繧上○莉ｶ謨ｰ笳・蜑頑ｸ帙阪・謨ｰ蟄励′譛蠑ｷ縺ｮ謠先｡域攝譁・, '譛蛻昴・辟｡譁吶〒1遉ｾ讒狗ｯ俄・螳溽ｸｾ繧剃ｽ懊ｋ', '菫晏ｮ亥･醍ｴ・′譛ｬ蠖薙・蜿守寢貅・],
    aiTools: [
      { name: 'Dify', desc: '繝弱・繧ｳ繝ｼ繝陰I繧｢繝励Μ讒狗ｯ・, free: true, url: 'https://dify.ai/' },
      { name: 'GPTs', desc: '繧ｫ繧ｹ繧ｿ繝ChatGPT繧剃ｽ懈・', free: false, url: 'https://chat.openai.com/' },
      { name: 'Coze', desc: '繝舌う繝医ム繝ｳ繧ｹ陬ｽAI繝懊ャ繝医ン繝ｫ繝繝ｼ', free: true, url: 'https://www.coze.com/' },
    ],
  },
  {
    id: 'ai-consulting', num: 13, name: 'AI豢ｻ逕ｨ繧ｳ繝ｳ繧ｵ繝ｫ', icon: '雌', level: 'advanced',
    description: '莨∵･ｭ繝ｻ蛟倶ｺｺ縺ｫAI蟆主・/豢ｻ逕ｨ縺ｮ繧ｳ繝ｳ繧ｵ繝ｫ繝・ぅ繝ｳ繧ｰ',
    avgRevenue: '譛・0縲・00荳・・', startCost: '0蜀・, timeToFirst: '1縲・繝ｶ譛・, difficulty: 5,
    tags: ['繧ｳ繝ｳ繧ｵ繝ｫ', '豕穂ｺｺ蜷代￠', 'DX', '遐比ｿｮ'],
    roadmapSteps: ['閾ｪ蛻・・AI豢ｻ逕ｨ螳溽ｸｾ繧偵ラ繧ｭ繝･繝｡繝ｳ繝亥喧', 'AI豢ｻ逕ｨ繧ｻ繝溘リ繝ｼ雉・侭菴懈・・育┌譁咏匳螢・畑・・, '蝨ｰ蜈・膚蟾･莨夊ｭｰ謇/繧ｳ繝溘Η繝九ユ繧｣縺ｧ辟｡譁吶そ繝溘リ繝ｼ螳滓命', '蛟句挨逶ｸ隲・・譛画侭繧ｳ繝ｳ繧ｵ繝ｫ螂醍ｴ・, '譛磯｡埼｡ｧ蝠丞･醍ｴ・ｼ按･50,000縲・譛茨ｼ峨ｒ謠先｡・, '莨∵･ｭ遐比ｿｮ・・蝗楪･100,000縲懶ｼ峨↓螻暮幕'],
    requiredTools: ['蜷БI繝・・繝ｫ縺ｮ螳溯ｷｵ遏･隴・, '謠先｡郁ｳ・侭・・amma/PowerPoint・・, 'Zoom/Google Meet'],
    priceRange: { label: '繧ｳ繝ｳ繧ｵ繝ｫ・域怦鬘搾ｼ・, min: 30000, max: 300000 },
    tips: ['縲梧蕗縺医ｋ縲阪ｈ繧翫御ｸ邱偵↓繧・ｋ縲阪せ繧ｿ繧､繝ｫ縺御ｿ｡鬆ｼ縺輔ｌ繧・, '讌ｭ逡檎音蛹厄ｼ磯｣ｲ鬟淌輸I/蛹ｻ逋づ輸I遲会ｼ峨′蜊倅ｾ｡繧剃ｸ翫￡繧・, '閾ｪ蛻・・蜑ｯ讌ｭ螳溽ｸｾ縺後◎縺ｮ縺ｾ縺ｾ蝟ｶ讌ｭ譚先侭縺ｫ縺ｪ繧・],
    aiTools: [
      { name: 'ChatGPT', desc: '謠先｡域嶌繝ｻ雉・侭菴懈・', free: true, url: 'https://chat.openai.com/' },
      { name: 'Gamma', desc: '繝励Ξ繧ｼ繝ｳ雉・侭逕滓・', free: true, url: 'https://gamma.app/' },
      { name: 'Notion', desc: '遏･隴倡ｮ｡逅・・繝峨く繝･繝｡繝ｳ繝・, free: true, url: 'https://www.notion.so/' },
    ],
  },
]

const DIAGNOSIS_QUESTIONS = [
  { q: '縺ゅ↑縺溘・繝代た繧ｳ繝ｳ繧ｹ繧ｭ繝ｫ縺ｯ・・, options: ['縺ｻ縺ｼ蛻晏ｿ・・, '蝓ｺ譛ｬ謫堺ｽ懊・OK', '縺ゅｋ遞句ｺｦ菴ｿ縺・％縺ｪ縺帙ｋ', '繧ｨ繝ｳ繧ｸ繝九い繝ｬ繝吶Ν'] },
  { q: '1譌･縺ｫ蜑ｯ讌ｭ縺ｫ菴ｿ縺医ｋ譎る俣縺ｯ・・, options: ['30蛻・・譎る俣', '1縲・譎る俣', '2縲・譎る俣', '4譎る俣莉･荳・] },
  { q: '蛻晄悄謚戊ｳ・・縺・￥繧峨∪縺ｧOK・・, options: ['0蜀・ｼ亥ｮ悟・辟｡譁吶・縺ｿ・・, '譛・,000蜀・∪縺ｧ', '譛・,000蜀・∪縺ｧ', '譛・0,000蜀・ｻ･荳外K'] },
  { q: '縺ｩ縺｡繧峨′蠕玲э・・, options: ['譁・ｫ繧呈嶌縺上％縺ｨ', '繝薙ず繝･繧｢繝ｫ・育判蜒・蜍慕判・・, '莠ｺ縺ｨ隧ｱ縺吶％縺ｨ', '繝・・繧ｿ蛻・梵繝ｻ隲也炊逧・晁・] },
  { q: '蜑ｯ讌ｭ縺ｮ逶ｮ讓呎怦蜿弱・・・, options: ['譛・縲・荳・・', '譛・縲・0荳・・', '譛・0縲・0荳・・', '譛・0荳・・莉･荳・] },
  { q: '繝ｪ繧ｹ繧ｯ險ｱ螳ｹ蠎ｦ縺ｯ・・, options: ['遒ｺ螳溘↓蟆上＆縺冗ｨｼ縺弱◆縺・, '縺ゅｋ遞句ｺｦ縺ｮ繝ｪ繧ｹ繧ｯ縺ｯOK', '螟ｧ縺阪￥遞ｼ縺舌◆繧√↑繧峨Μ繧ｹ繧ｯ繧ょ叙繧・, '謚戊ｳ・梛繧りｦ夜㍽縺ｫ蜈･繧後◆縺・] },
  { q: '縺吶＄縺ｫ蜿主・縺梧ｬｲ縺励＞・・, options: ['莉翫☆縺撰ｼ・縲・騾ｱ髢謎ｻ･蜀・ｼ・, '1繝ｶ譛井ｻ･蜀・, '3繝ｶ譛井ｻ･蜀・〒OK', '蜊雁ｹｴ縺九￠縺ｦ繧ゅ＞縺・] },
  { q: '闍ｱ隱槫鴨縺ｯ・・, options: ['縺ｾ縺｣縺溘￥繝繝｡', '鄙ｻ險ｳ繝・・繝ｫ縺ｧ隱ｭ繧√ｋ遞句ｺｦ', '譌･蟶ｸ莨夊ｩｱ繝ｬ繝吶Ν', '繝薙ず繝阪せ繝ｬ繝吶Ν'] },
  { q: '鬘泌・縺励・螳溷錐縺ｯ・・, options: ['邨ｶ蟇ｾNG', '縺ｧ縺阪ｌ縺ｰ驕ｿ縺代◆縺・, '蠢・ｦ√↑繧碓K', '遨肴･ｵ逧・↓繧・ｊ縺溘＞'] },
  { q: '闊亥袖縺ｮ縺ゅｋ蛻・㍽縺ｯ・・, options: ['繧ｯ繝ｪ繧ｨ繧､繝・ぅ繝厄ｼ医ョ繧ｶ繧､繝ｳ/蜍慕判・・, '繝ｩ繧､繝・ぅ繝ｳ繧ｰ/諠・ｱ逋ｺ菫｡', '繝薙ず繝阪せ/繧ｳ繝ｳ繧ｵ繝ｫ', '繝・け繝九き繝ｫ・医・繝ｭ繧ｰ繝ｩ繝溘Φ繧ｰ/繝懊ャ繝茨ｼ・] },
]

const PROPOSAL_TEMPLATES = [
  {
    title: '繧ｯ繝ｩ繧ｦ繝峨た繝ｼ繧ｷ繝ｳ繧ｰ蠢懷供繝・Φ繝励Ξ繝ｼ繝・,
    content: `縲仙ｿ懷供譁・ユ繝ｳ繝励Ξ繝ｼ繝医・
笳銀雷讒・
縺ｯ縺倥ａ縺ｾ縺励※縲・蜷榊燕]縺ｨ逕ｳ縺励∪縺吶・[譯井ｻｶ蜷江縺ｫ蠢懷供縺輔○縺ｦ縺・◆縺縺阪∪縺吶・
笆 蟇ｾ蠢懷庄閭ｽ縺ｪ逅・罰
繝ｻ[髢｢騾｣繧ｹ繧ｭ繝ｫ/邨碁ｨ薙ｒ險倩ｼ云
繝ｻAI豢ｻ逕ｨ縺ｫ繧医ｊ鬮伜刀雉ｪ縺九▽霑・溘↑邏榊刀縺悟庄閭ｽ縺ｧ縺・
笆 螳溽ｸｾ
繝ｻ[繝昴・繝医ヵ繧ｩ繝ｪ繧ｪURL or 驕主悉螳溽ｸｾ]
繝ｻ[蜈ｷ菴鍋噪縺ｪ謌先棡迚ｩ縺ｮ隱ｬ譏讃

笆 邏肴悄
縺比ｾ晞ｼ縺九ｉ[笳区律]莉･蜀・↓蛻晉ｨｿ繧偵♀騾√ｊ縺励∪縺吶・菫ｮ豁｣縺ｯ[笳句屓]縺ｾ縺ｧ辟｡譁吶〒蟇ｾ蠢懊＞縺溘＠縺ｾ縺吶・
笆 縺願ｦ狗ｩ阪ｂ繧・[驥鷹｡江・育ｨ手ｾｼ・・
縺疲､懆ｨ弱・縺ｻ縺ｩ縲√ｈ繧阪＠縺上♀鬘倥＞縺・◆縺励∪縺吶Ａ
  },
  {
    title: '繝昴・繝医ヵ繧ｩ繝ｪ繧ｪ閾ｪ蟾ｱ邏ｹ莉九ユ繝ｳ繝励Ξ繝ｼ繝・,
    content: `縲舌・繝ｼ繝医ヵ繧ｩ繝ｪ繧ｪ閾ｪ蟾ｱ邏ｹ莉九・
笆 繝励Ο繝輔ぅ繝ｼ繝ｫ
[蜷榊燕] ・・[閧ｩ譖ｸ縺江
AI豢ｻ逕ｨﾃ夕蟆る摩蛻・㍽]縺ｮ繧ｯ繝ｪ繧ｨ繧､繧ｿ繝ｼ

笆 謠蝉ｾ帙し繝ｼ繝薙せ
1. [繧ｵ繝ｼ繝薙せ1]・按･笳銀雷縲懶ｼ・2. [繧ｵ繝ｼ繝薙せ2]・按･笳銀雷縲懶ｼ・3. [繧ｵ繝ｼ繝薙せ3]・按･笳銀雷縲懶ｼ・
笆 菴ｿ逕ｨ繝・・繝ｫ
[繝・・繝ｫ蜷阪ｒ蛻玲嫌]

笆 螳溽ｸｾ繝ｻ繧ｵ繝ｳ繝励Ν
[逕ｻ蜒・URL/螳溽ｸｾ繧定ｨ倩ｼ云

笆 蠑ｷ縺ｿ
繝ｻAI繧呈ｴｻ逕ｨ縺励◆鬮倬溷宛菴懶ｼ磯壼ｸｸ縺ｮ笳句埼滂ｼ・繝ｻ[迢ｬ閾ｪ縺ｮ蠑ｷ縺ｿ]
繝ｻ菫ｮ豁｣蟇ｾ蠢懊・譟碑ｻ溘＆

笆 騾｣邨｡蜈・[繝｡繝ｼ繝ｫ/SNS/繝励Ο繝輔ぅ繝ｼ繝ｫURL]`
  },
  {
    title: '譁咎≡陦ｨ繝・Φ繝励Ξ繝ｼ繝・,
    content: `縲先侭驥題｡ｨ繝・Φ繝励Ξ繝ｼ繝医・
笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏・[繧ｵ繝ｼ繝薙せ蜷江 譁咎≡陦ｨ
笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏・
縲舌Λ繧､繝医・繝ｩ繝ｳ縲堕･笳銀雷
繝ｻ[蜀・ｮｹ]
繝ｻ菫ｮ豁｣笳句屓縺ｾ縺ｧ
繝ｻ邏肴悄: 笳句霧讌ｭ譌･

縲舌せ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ縲堕･笳銀雷
繝ｻ[蜀・ｮｹ]
繝ｻ菫ｮ豁｣笳句屓縺ｾ縺ｧ
繝ｻ邏肴悄: 笳句霧讌ｭ譌･

縲舌・繝ｬ繝溘い繝繝励Λ繝ｳ縲堕･笳銀雷
繝ｻ[蜀・ｮｹ]
繝ｻ菫ｮ豁｣辟｡蛻ｶ髯・繝ｻ邏肴悄: 笳句霧讌ｭ譌･
繝ｻ[霑ｽ蜉迚ｹ蜈ｸ]

窶ｻ 荳願ｨ倥・遞手ｾｼ萓｡譬ｼ縺ｧ縺・窶ｻ 蜀・ｮｹ縺ｫ繧医ｊ蛻･騾斐♀隕狗ｩ阪ｂ繧・窶ｻ 諤･縺主ｯｾ蠢懊・+笳・`
  },
  {
    title: '隲区ｱよ嶌繝・Φ繝励Ξ繝ｼ繝・,
    content: `縲占ｫ区ｱよ嶌縲・
逋ｺ陦梧律: 20XX蟷ｴXX譛・X譌･
隲区ｱら分蜿ｷ: INV-XXXX

笆 隲区ｱょ・
[繧ｯ繝ｩ繧､繧｢繝ｳ繝亥錐] 蠕｡荳ｭ

笆 隲区ｱょ・
[縺ゅ↑縺溘・蜷榊燕]
[菴乗園]
[騾｣邨｡蜈・

笆 譏守ｴｰ
笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏・蜩∫岼: [菴懈･ｭ蜀・ｮｹ]
謨ｰ驥・ [笳犠 蜊倅ｾ｡: ﾂ･[笳銀雷] 蟆剰ｨ・ ﾂ･[笳銀雷]
笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏・蟆剰ｨ・ ﾂ･[笳銀雷]
豸郁ｲｻ遞・10%): ﾂ･[笳銀雷]
蜷郁ｨ・ ﾂ･[笳銀雷]
笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏・
笆 縺頑険霎ｼ蜈・[驫陦悟錐] [謾ｯ蠎怜錐] [蜿｣蠎ｧ遞ｮ蛻･] [蜿｣蠎ｧ逡ｪ蜿ｷ]
[蜿｣蠎ｧ蜷咲ｾｩ]

笆 縺頑髪謇輔＞譛滄剞
20XX蟷ｴXX譛・X譌･`
  },
  {
    title: 'SNS蝟ｶ讌ｭDM繝・Φ繝励Ξ繝ｼ繝・,
    content: `縲心NS蝟ｶ讌ｭDM繝・Φ繝励Ξ繝ｼ繝医・
[逶ｸ謇九・蜷榊燕]縺輔ｓ

縺・▽繧よ兜遞ｿ諡晁ｦ九＠縺ｦ縺・∪縺呻ｼ・[蜈ｷ菴鍋噪縺ｫ濶ｯ縺・→諤昴▲縺滓兜遞ｿ/豢ｻ蜍輔↓隗ｦ繧後ｋ]

遯∫┯縺ｮDM螟ｱ遉ｼ縺励∪縺吶・[閾ｪ蛻・・閧ｩ譖ｸ縺江縺ｮ[蜷榊燕]縺ｨ逕ｳ縺励∪縺吶・
[逶ｸ謇九・隱ｲ鬘・繝九・繧ｺ縺ｫ隗ｦ繧後ｋ]縺ｫ縺､縺・※縲・AI豢ｻ逕ｨ縺ｧ[蜈ｷ菴鍋噪縺ｪ繝｡繝ｪ繝・ヨ]繧貞ｮ溽樟縺吶ｋ縺頑焔莨昴＞縺後〒縺阪ｌ縺ｰ縺ｨ諤昴＞縺秘｣邨｡縺励∪縺励◆縲・
萓九∴縺ｰ・・繝ｻ[蜈ｷ菴謎ｾ・]
繝ｻ[蜈ｷ菴謎ｾ・]

縺ｾ縺壹・辟｡譁吶〒[笳銀雷]繧・縺､縺願ｩｦ縺励〒菴懈・縺励∪縺吶・縺ｧ縲・縺碑・蜻ｳ縺後≠繧後・縺頑ｰ苓ｻｽ縺ｫ縺碑ｿ比ｿ｡縺上□縺輔＞・・
[蜷榊燕]
[繝昴・繝医ヵ繧ｩ繝ｪ繧ｪURL]`
  },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ==================== COMPONENT ====================
export function AiSidejob() {
  const [tab, setTab] = useState<Tab>('diagnosis')
  // Diagnosis
  const [answers, setAnswers] = useState<DiagnosisAnswer[]>([])
  const [showResult, setShowResult] = useState(false)
  // Roadmap
  const [selectedCatId, setSelectedCatId] = useState(CATEGORIES[0].id)
  // Simulator
  const [simCatId, setSimCatId] = useState(CATEGORIES[0].id)
  const [simCount, setSimCount] = useState(5)
  const [simPrice, setSimPrice] = useState(5000)
  const [simHours, setSimHours] = useState(20)
  // Templates
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  // Tools dictionary
  const [toolFilter, setToolFilter] = useState<'all' | 'beginner' | 'advanced'>('all')
  // Log
  const [logs, setLogs] = useState<JobRecord[]>([])
  const [logForm, setLogForm] = useState({ category: CATEGORIES[0].name, title: '', revenue: 0, expense: 0, hours: 0, date: new Date().toISOString().split('T')[0], note: '' })

  const selectedCat = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0]
  const simCat = CATEGORIES.find(c => c.id === simCatId) || CATEGORIES[0]
  const filteredCats = toolFilter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.level === toolFilter)

  // localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai-sidejob-logs')
      if (saved) setLogs(JSON.parse(saved))
    } catch { /* */ }
  }, [])

  const saveLogs = useCallback((l: JobRecord[]) => {
    setLogs(l)
    localStorage.setItem('ai-sidejob-logs', JSON.stringify(l))
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Diagnosis scoring
  const getDiagnosisResults = () => {
    const scores: Record<string, number> = {}
    CATEGORIES.forEach(c => { scores[c.id] = 0 })

    answers.forEach(a => {
      const qIdx = a.questionIdx
      const oIdx = a.optionIdx

      // Q0: PC skill
      if (qIdx === 0) {
        if (oIdx <= 1) { scores['image-design'] += 3; scores['line-stamp'] += 3; scores['note-ebook'] += 2; scores['sns-management'] += 2 }
        if (oIdx >= 2) { scores['web-creation'] += 3; scores['chatbot-build'] += 3; scores['prompt-sales'] += 2 }
        if (oIdx === 3) { scores['chatbot-build'] += 3; scores['ai-consulting'] += 2 }
      }
      // Q1: Time
      if (qIdx === 1) {
        if (oIdx <= 1) { scores['line-stamp'] += 2; scores['note-ebook'] += 2; scores['prompt-sales'] += 2 }
        if (oIdx >= 2) { scores['video-editing'] += 2; scores['web-creation'] += 2; scores['online-course'] += 2; scores['ai-consulting'] += 2 }
      }
      // Q2: Budget
      if (qIdx === 2) {
        if (oIdx === 0) { scores['writing'] += 3; scores['note-ebook'] += 3; scores['sns-management'] += 2; scores['presentation'] += 2; scores['ai-consulting'] += 2 }
        if (oIdx >= 2) { scores['image-design'] += 2; scores['video-editing'] += 2 }
      }
      // Q3: Strength
      if (qIdx === 3) {
        if (oIdx === 0) { scores['writing'] += 4; scores['note-ebook'] += 3; scores['audio-content'] += 2 }
        if (oIdx === 1) { scores['image-design'] += 4; scores['video-editing'] += 3; scores['line-stamp'] += 3 }
        if (oIdx === 2) { scores['ai-consulting'] += 4; scores['sns-management'] += 3; scores['online-course'] += 2 }
        if (oIdx === 3) { scores['chatbot-build'] += 4; scores['web-creation'] += 3; scores['prompt-sales'] += 2 }
      }
      // Q4: Revenue target
      if (qIdx === 4) {
        if (oIdx <= 1) { scores['line-stamp'] += 2; scores['note-ebook'] += 2; scores['prompt-sales'] += 2 }
        if (oIdx >= 2) { scores['ai-consulting'] += 3; scores['chatbot-build'] += 3; scores['web-creation'] += 2; scores['online-course'] += 2 }
      }
      // Q5: Risk
      if (qIdx === 5) {
        if (oIdx <= 1) { scores['writing'] += 2; scores['presentation'] += 2; scores['line-stamp'] += 2 }
        if (oIdx >= 2) { scores['ai-consulting'] += 2; scores['online-course'] += 2 }
      }
      // Q6: Speed
      if (qIdx === 6) {
        if (oIdx === 0) { scores['writing'] += 3; scores['image-design'] += 2; scores['presentation'] += 2 }
        if (oIdx >= 2) { scores['online-course'] += 2; scores['ai-consulting'] += 2; scores['chatbot-build'] += 2 }
      }
      // Q7: English
      if (qIdx === 7) {
        if (oIdx >= 2) { scores['prompt-sales'] += 2; scores['writing'] += 1 }
      }
      // Q8: Public identity
      if (qIdx === 8) {
        if (oIdx <= 1) { scores['line-stamp'] += 2; scores['writing'] += 2; scores['prompt-sales'] += 2 }
        if (oIdx >= 2) { scores['ai-consulting'] += 3; scores['audio-content'] += 2; scores['online-course'] += 2 }
      }
      // Q9: Interest
      if (qIdx === 9) {
        if (oIdx === 0) { scores['image-design'] += 4; scores['video-editing'] += 3; scores['line-stamp'] += 3 }
        if (oIdx === 1) { scores['writing'] += 4; scores['note-ebook'] += 3; scores['sns-management'] += 2; scores['audio-content'] += 2 }
        if (oIdx === 2) { scores['ai-consulting'] += 4; scores['online-course'] += 3; scores['presentation'] += 2 }
        if (oIdx === 3) { scores['chatbot-build'] += 4; scores['web-creation'] += 3; scores['prompt-sales'] += 3 }
      }
    })

    return CATEGORIES.map(c => ({ ...c, score: scores[c.id] || 0 })).sort((a, b) => b.score - a.score)
  }

  // Revenue simulator
  const monthlyRevenue = simCount * simPrice
  const monthlyHourlyRate = simHours > 0 ? Math.round(monthlyRevenue / simHours) : 0
  const yearlyRevenue = monthlyRevenue * 12

  // Log stats
  const totalRevenue = logs.reduce((s, l) => s + l.revenue, 0)
  const totalExpense = logs.reduce((s, l) => s + l.expense, 0)
  const totalHours = logs.reduce((s, l) => s + l.hours, 0)
  const avgHourlyRate = totalHours > 0 ? Math.round((totalRevenue - totalExpense) / totalHours) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">噫</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">AI蜑ｯ讌ｭ繧ｹ繧ｿ繝ｼ繝医ム繝・す繝･</h1>
            </div>
            <div className="text-xs text-white/40">13繧ｫ繝・ざ繝ｪ蟇ｾ蠢・/div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ==================== DIAGNOSIS ==================== */}
        {tab === 'diagnosis' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">ｧｭ AI蜑ｯ讌ｭ 驕ｩ諤ｧ險ｺ譁ｭ</h2>
              <p className="text-sm text-white/50">10蝠上・雉ｪ蝠上↓遲斐∴縺ｦ縲√≠縺ｪ縺溘↓譛驕ｩ縺ｪAI蜑ｯ讌ｭ繧堤匱隕・/p>
            </div>

            {!showResult ? (
              <div className="space-y-4">
                {DIAGNOSIS_QUESTIONS.map((q, qi) => {
                  const answered = answers.find(a => a.questionIdx === qi)
                  return (
                    <div key={qi} className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm font-medium mb-2">Q{qi + 1}. {q.q}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((o, oi) => (
                          <button key={oi} onClick={() => setAnswers(prev => { const next = prev.filter(a => a.questionIdx !== qi); next.push({ questionIdx: qi, optionIdx: oi }); return next })} className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${answered?.optionIdx === oi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>{o}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
                <div className="text-sm text-white/40 text-center">{answers.length}/10 蝗樒ｭ疲ｸ医∩</div>
                <button onClick={() => setShowResult(true)} disabled={answers.length < 10} className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
                  噫 險ｺ譁ｭ邨先棡繧定ｦ九ｋ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-5">
                  <h3 className="font-bold text-lg mb-2">醇 縺ゅ↑縺溘↓縺翫☆縺吶ａ縺ｮAI蜑ｯ讌ｭ TOP3</h3>
                  {getDiagnosisResults().slice(0, 3).map((cat, i) => (
                    <div key={cat.id} className="flex items-center gap-3 bg-black/20 rounded-xl p-3 mb-2">
                      <span className="text-2xl">{i === 0 ? '･・ : i === 1 ? '･・ : '･・}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{cat.icon} {cat.name}</div>
                        <div className="text-xs text-white/50">{cat.description}</div>
                        <div className="text-xs text-orange-400 mt-1">{cat.avgRevenue} 繝ｻ 髮｣譏灘ｺｦ{'箝・.repeat(cat.difficulty)}</div>
                      </div>
                      <button onClick={() => { setSelectedCatId(cat.id); setTab('roadmap') }} className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30">隧ｳ邏ｰ</button>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-white/60">蜈ｨ繧ｫ繝・ざ繝ｪ繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ</h3>
                <div className="space-y-1">
                  {getDiagnosisResults().slice(3).map((cat, i) => (
                    <div key={cat.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5">
                      <span className="text-xs text-white/30 w-6">{i + 4}菴・/span>
                      <span>{cat.icon}</span>
                      <div className="flex-1 text-xs">{cat.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cat.level === 'beginner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{cat.level === 'beginner' ? '蛻晏ｿ・・髄縺・ : '邨碁ｨ楢・髄縺・}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setShowResult(false); setAnswers([]) }} className="w-full py-2 bg-white/10 rounded-xl text-sm text-white/60 hover:bg-white/15">繧ゅ≧荳蠎ｦ險ｺ譁ｭ縺吶ｋ</button>
              </div>
            )}
          </div>
        )}

        {/* ==================== ROADMAP ==================== */}
        {tab === 'roadmap' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">搭 繝ｭ繝ｼ繝峨・繝・・</h2>
              <p className="text-sm text-white/50">0竊貞庶逶雁喧縺ｾ縺ｧ縺ｮ繧ｹ繝・ャ繝励ぎ繧､繝・/p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setSelectedCatId(c.id)} className={`text-left p-2.5 rounded-xl text-xs transition-all border ${selectedCatId === c.id ? 'bg-orange-500/20 border-orange-500/40 text-white' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>
                  <span className="text-base">{c.icon}</span>
                  <div className="font-medium mt-0.5 leading-tight">{c.name}</div>
                </button>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{selectedCat.icon}</span>
                <div>
                  <h3 className="font-bold">{selectedCat.name}</h3>
                  <p className="text-xs text-white/50">{selectedCat.description}</p>
                </div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${selectedCat.level === 'beginner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{selectedCat.level === 'beginner' ? '蛻晏ｿ・・髄縺・ : '邨碁ｨ楢・髄縺・}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">逶ｮ螳牙庶蜈･</div><div className="text-sm font-bold text-orange-400">{selectedCat.avgRevenue}</div></div>
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">蛻晄悄雋ｻ逕ｨ</div><div className="text-sm font-bold text-green-400">{selectedCat.startCost}</div></div>
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">蛻晏庶逶翫∪縺ｧ</div><div className="text-sm font-bold text-blue-400">{selectedCat.timeToFirst}</div></div>
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">髮｣譏灘ｺｦ</div><div className="text-sm font-bold text-yellow-400">{'箝・.repeat(selectedCat.difficulty)}</div></div>
              </div>

              <h4 className="text-sm font-bold mb-2 text-orange-400">桃 繝ｭ繝ｼ繝峨・繝・・・・繧ｹ繝・ャ繝暦ｼ・/h4>
              <div className="space-y-2 mb-4">
                {selectedCat.roadmapSteps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                    <div className="text-sm text-white/70 pt-1">{step}</div>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-bold mb-2 text-green-400">庁 謌仙粥縺ｮ繧ｳ繝・/h4>
              <div className="space-y-1 mb-4">
                {selectedCat.tips.map((tip, i) => (
                  <div key={i} className="text-xs text-white/60 bg-black/20 rounded-lg px-3 py-2">窶｢ {tip}</div>
                ))}
              </div>

              <h4 className="text-sm font-bold mb-2 text-blue-400">肌 蠢・ｦ√ヤ繝ｼ繝ｫ</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCat.requiredTools.map(t => (
                  <span key={t} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SIMULATOR ==================== */}
        {tab === 'simulator' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">腸 蜿守寢繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</h2>
              <p className="text-sm text-white/50">蜑ｯ讌ｭ繧ｫ繝・ざ繝ｪ蛻･縺ｮ蜿主・繧偵す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ</p>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-2 block">繧ｫ繝・ざ繝ｪ</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => { setSimCatId(c.id); setSimPrice(c.priceRange.min) }} className={`text-left p-2 rounded-lg text-xs border transition-all ${simCatId === c.id ? 'bg-orange-500/20 border-orange-500/40' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>{c.icon} {c.name}</button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm font-bold mb-3">{simCat.icon} {simCat.name}</div>
              <div className="text-xs text-white/40 mb-3">逶ｸ蝣ｴ: {simCat.priceRange.label} ﾂ･{simCat.priceRange.min.toLocaleString()}縲慊･{simCat.priceRange.max.toLocaleString()}</div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50">譛磯俣譯井ｻｶ謨ｰ: {simCount}莉ｶ</label>
                  <input type="range" min={1} max={30} value={simCount} onChange={e => setSimCount(Number(e.target.value))} className="w-full accent-orange-500" />
                </div>
                <div>
                  <label className="text-xs text-white/50">1莉ｶ縺ゅ◆繧翫・蜊倅ｾ｡: ﾂ･{simPrice.toLocaleString()}</label>
                  <input type="range" min={simCat.priceRange.min} max={simCat.priceRange.max} step={Math.max(100, Math.round((simCat.priceRange.max - simCat.priceRange.min) / 20))} value={simPrice} onChange={e => setSimPrice(Number(e.target.value))} className="w-full accent-orange-500" />
                </div>
                <div>
                  <label className="text-xs text-white/50">譛磯俣菴懈･ｭ譎る俣: {simHours}譎る俣</label>
                  <input type="range" min={1} max={160} value={simHours} onChange={e => setSimHours(Number(e.target.value))} className="w-full accent-orange-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">譛亥庶</div>
                <div className="text-xl font-bold text-orange-400">ﾂ･{monthlyRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">蟷ｴ蜿・/div>
                <div className="text-xl font-bold text-green-400">ﾂ･{yearlyRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">譎らｵｦ謠帷ｮ・/div>
                <div className="text-xl font-bold text-blue-400">ﾂ･{monthlyHourlyRate.toLocaleString()}</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">譌･邨ｦ謠帷ｮ・/div>
                <div className="text-xl font-bold text-purple-400">ﾂ･{Math.round(monthlyRevenue / 22).toLocaleString()}</div>
              </div>
            </div>

            {monthlyHourlyRate > 0 && (
              <div className="bg-white/5 rounded-xl p-4 text-sm text-white/60">
                庁 譎らｵｦ ﾂ･{monthlyHourlyRate.toLocaleString()} 縺ｯ{monthlyHourlyRate >= 3000 ? '莨夂､ｾ蜩｡縺ｮ蜑ｯ讌ｭ縺ｨ縺励※縺九↑繧雁━遘・・ : monthlyHourlyRate >= 1500 ? '繧｢繝ｫ繝舌う繝医ｈ繧雁柑邇・噪縲ゅせ繧ｭ繝ｫUP縺ｧ縺輔ｉ縺ｫ荳翫′繧翫∪縺吶・ : '縺ｾ縺謌宣聞谿ｵ髫弱ょｮ溽ｸｾ繧堤ｩ阪ｓ縺ｧ蜊倅ｾ｡UP繧堤岼謖・＠縺ｾ縺励ｇ縺・・}
              </div>
            )}
          </div>
        )}

        {/* ==================== TEMPLATES ==================== */}
        {tab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">笨搾ｸ・繝・Φ繝励Ξ繝ｼ繝磯寔</h2>
              <p className="text-sm text-white/50">蠢懷供譁・・繝昴・繝医ヵ繧ｩ繝ｪ繧ｪ繝ｻ譁咎≡陦ｨ繝ｻ隲区ｱよ嶌繝ｻ蝟ｶ讌ｭDM縺ｮ縺ｲ縺ｪ蠖｢</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {PROPOSAL_TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => setSelectedTemplateIdx(i)} className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedTemplateIdx === i ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{t.title}</button>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{PROPOSAL_TEMPLATES[selectedTemplateIdx].title}</h3>
                <button onClick={() => handleCopy(PROPOSAL_TEMPLATES[selectedTemplateIdx].content)} className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30">{copied ? '笨・繧ｳ繝斐・貂医∩' : '搭 繧ｳ繝斐・'}</button>
              </div>
              <pre className="text-sm text-white/70 whitespace-pre-wrap bg-black/30 rounded-lg p-4 font-mono leading-relaxed">{PROPOSAL_TEMPLATES[selectedTemplateIdx].content}</pre>
            </div>
          </div>
        )}

        {/* ==================== TOOLS DICTIONARY ==================== */}
        {tab === 'tools' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">屏・・AI繝・・繝ｫ霎槫・</h2>
              <p className="text-sm text-white/50">繧ｫ繝・ざ繝ｪ蛻･縺翫☆縺吶ａAI繝・・繝ｫ荳隕ｧ</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'all' as const, label: '縺吶∋縺ｦ (13)' },
                { id: 'beginner' as const, label: '泙 蛻晏ｿ・・(9)' },
                { id: 'advanced' as const, label: '泪 邨碁ｨ楢・(4)' },
              ].map(f => (
                <button key={f.id} onClick={() => setToolFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${toolFilter === f.id ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{f.label}</button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredCats.map(cat => (
                <div key={cat.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-bold text-sm">{cat.name}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${cat.level === 'beginner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{cat.level === 'beginner' ? '蛻晏ｿ・・ : '邨碁ｨ楢・}</span>
                  </div>
                  <div className="space-y-2">
                    {cat.aiTools.map(tool => (
                      <div key={tool.name} className="flex items-center gap-3 bg-black/20 rounded-lg p-2.5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white/80">{tool.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${tool.free ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{tool.free ? '辟｡譁・ : '譛画侭'}</span>
                          </div>
                          <div className="text-xs text-white/40">{tool.desc}</div>
                        </div>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300 shrink-0">迫</a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== ACTIVITY LOG ==================== */}
        {tab === 'log' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">投 豢ｻ蜍輔Ο繧ｰ</h2>
              <p className="text-sm text-white/50">譯井ｻｶ險倬鹸繝ｻ螢ｲ荳顔ｮ｡逅・・譎らｵｦ謠帷ｮ・/p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">邱丞｣ｲ荳・/div><div className="text-lg font-bold text-orange-400">ﾂ･{totalRevenue.toLocaleString()}</div></div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">邱冗ｵ瑚ｲｻ</div><div className="text-lg font-bold text-red-400">ﾂ･{totalExpense.toLocaleString()}</div></div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">邏泌茜逶・/div><div className="text-lg font-bold text-green-400">ﾂ･{(totalRevenue - totalExpense).toLocaleString()}</div></div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">蟷ｳ蝮・凾邨ｦ</div><div className="text-lg font-bold text-blue-400">ﾂ･{avgHourlyRate.toLocaleString()}</div></div>
            </div>

            {/* Add form */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-bold mb-3">統 譯井ｻｶ繧定ｨ倬鹸</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50">繧ｫ繝・ざ繝ｪ</label>
                  <select value={logForm.category} onChange={e => setLogForm({ ...logForm, category: e.target.value })} className="w-full bg-gray-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white [&>option]:bg-gray-900">
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50">譯井ｻｶ蜷・/label>
                  <input value={logForm.title} onChange={e => setLogForm({ ...logForm, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="繝舌リ繝ｼ蛻ｶ菴・ />
                </div>
                <div>
                  <label className="text-xs text-white/50">螢ｲ荳・ﾂ･)</label>
                  <input type="number" value={logForm.revenue || ''} onChange={e => setLogForm({ ...logForm, revenue: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="5000" />
                </div>
                <div>
                  <label className="text-xs text-white/50">邨瑚ｲｻ(ﾂ･)</label>
                  <input type="number" value={logForm.expense || ''} onChange={e => setLogForm({ ...logForm, expense: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs text-white/50">菴懈･ｭ譎る俣(h)</label>
                  <input type="number" value={logForm.hours || ''} onChange={e => setLogForm({ ...logForm, hours: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="3" />
                </div>
                <div>
                  <label className="text-xs text-white/50">譌･莉・/label>
                  <input type="date" value={logForm.date} onChange={e => setLogForm({ ...logForm, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" />
                </div>
              </div>
              <button onClick={() => { if (!logForm.title) return; saveLogs([{ id: generateId(), ...logForm }, ...logs]); setLogForm({ ...logForm, title: '', revenue: 0, expense: 0, hours: 0, note: '' }) }} disabled={!logForm.title} className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-30">險倬鹸縺吶ｋ</button>
            </div>

            {/* Log list */}
            {logs.length === 0 ? (
              <div className="bg-white/5 rounded-xl p-8 text-center text-white/40">
                <p className="text-3xl mb-2">投</p>
                <p className="text-sm">縺ｾ縺險倬鹸縺後≠繧翫∪縺帙ｓ</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map(l => (
                  <div key={l.id} className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white/80">{l.title}</span>
                        <span className="text-xs text-white/30">{l.category}</span>
                      </div>
                      <div className="text-xs text-white/40">{l.date} 繝ｻ {l.hours}h</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-orange-400">ﾂ･{l.revenue.toLocaleString()}</div>
                      {l.expense > 0 && <div className="text-xs text-red-400">-ﾂ･{l.expense.toLocaleString()}</div>}
                    </div>
                    <button onClick={() => saveLogs(logs.filter(r => r.id !== l.id))} className="text-xs text-red-400 hover:text-red-300">卵</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">窶ｻ 縺吶∋縺ｦ縺ｮ繝・・繧ｿ縺ｯ繝悶Λ繧ｦ繧ｶ蜀・↓菫晏ｭ倥＆繧後∪縺吶ゅし繝ｼ繝舌・縺ｸ縺ｮ騾∽ｿ｡縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・/p>
      </div>
    
      </div>
  )
}


