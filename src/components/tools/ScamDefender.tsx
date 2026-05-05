'use client'


import { useState, useCallback, useRef } from 'react'

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
interface QuizQuestion {
  id: string
  scenario: string
  isScam: boolean
  explanation: string
  category: string
  difficulty: '蛻晉ｴ・ | '荳ｭ邏・ | '荳顔ｴ・
}

interface SimMessage {
  role: 'scammer' | 'user' | 'coach'
  text: string
}

interface CheckItem {
  id: string
  label: string
  category: string
  description: string
  done: boolean
  priority: '蠢・・ | '謗ｨ螂ｨ' | '莉ｻ諢・
}

interface ScamPattern {
  id: string
  name: string
  category: string
  description: string
  keywords: string[]
  examples: string[]
  prevention: string
  damage: string
}

// 笏笏笏 Data 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1', category: '繧ｪ繝ｬ繧ｪ繝ｬ隧先ｬｺ', difficulty: '蛻晉ｴ・,
    scenario: '縲後♀豈阪＆繧薙∽ｿｺ縺縺代←窶ｦ縲ゆｼ夂､ｾ縺ｮ縺企≡繧剃ｽｿ縺・ｾｼ繧薙〒縺励∪縺｣縺ｦ縲∽ｻ頑律荳ｭ縺ｫ200荳・・蠢・ｦ√↑繧薙□縲りｪｰ縺ｫ繧りｨ繧上↑縺・〒縲ゅ・,
    isScam: true,
    explanation: '蜈ｸ蝙狗噪縺ｪ繧ｪ繝ｬ繧ｪ繝ｬ隧先ｬｺ縺ｧ縺吶ゅ瑚ｪｰ縺ｫ繧りｨ繧上↑縺・〒縲阪・隧先ｬｺ縺ｮ蟶ｸ螂怜唱縲ょｿ・★譛ｬ莠ｺ縺ｮ謳ｺ蟶ｯ縺ｫ謚倥ｊ霑斐＠遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・,
  },
  {
    id: 'q2', category: '驍・ｻ倬≡隧先ｬｺ', difficulty: '蛻晉ｴ・,
    scenario: '縲娯雷笳句ｸょｽｹ謇縺ｮ蛛･蠎ｷ菫晞匱隱ｲ縺ｧ縺吶ょ現逋りｲｻ縺ｮ驍・ｻ倬≡縺・5,000蜀・≠繧翫∪縺吶・TM縺ｧ謇狗ｶ壹″縺ｧ縺阪∪縺吶・縺ｧ縲∬ｿ代￥縺ｮATM縺ｫ陦後▲縺ｦ縺・◆縺縺代∪縺吶°・溘・,
    isScam: true,
    explanation: '驍・ｻ倬≡隧先ｬｺ縺ｧ縺吶ょｽｹ謇縺碁崕隧ｱ縺ｧATM謫堺ｽ懊ｒ謖・､ｺ縺吶ｋ縺薙→縺ｯ邨ｶ蟇ｾ縺ｫ縺ゅｊ縺ｾ縺帙ｓ縲るｄ莉倬≡縺ｯ蜿｣蠎ｧ謖ｯ霎ｼ縺狗ｪ灘哨縺ｧ縺ｮ謇狗ｶ壹″縺ｧ縺吶・,
  },
  {
    id: 'q3', category: '譫ｶ遨ｺ隲区ｱ・, difficulty: '蛻晉ｴ・,
    scenario: '縲梧怙邨る壼相・壹＃蛻ｩ逕ｨ譁咎≡縺ｮ譛ｪ邏阪′遒ｺ隱阪＆繧後∪縺励◆縲よ悽譌･荳ｭ縺ｫ縺秘｣邨｡縺ｪ縺榊ｴ蜷医∵ｳ慕噪謇狗ｶ壹″縺ｫ遘ｻ陦後＠縺ｾ縺吶る｣邨｡蜈茨ｼ・90-XXXX-XXXX縲・,
    isScam: true,
    explanation: '譫ｶ遨ｺ隲区ｱりｩ先ｬｺ縺ｮSMS縺ｧ縺吶りｺｫ縺ｫ隕壹∴縺ｮ縺ｪ縺・ｫ区ｱゅ↓縺ｯ邨ｶ蟇ｾ縺ｫ騾｣邨｡縺励↑縺・〒縺上□縺輔＞縲よｭ｣隕上・隲区ｱゅ・譖ｸ髱｢縺ｧ螻翫″縺ｾ縺吶・,
  },
  {
    id: 'q4', category: '繝輔ぅ繝・す繝ｳ繧ｰ', difficulty: '荳ｭ邏・,
    scenario: '縲後植mazon縲代♀螳｢讒倥・繧｢繧ｫ繧ｦ繝ｳ繝医↓逡ｰ蟶ｸ縺ｪ繝ｭ繧ｰ繧､繝ｳ縺梧､懷・縺輔ｌ縺ｾ縺励◆縲・4譎る俣莉･蜀・↓縺薙■繧峨・繝ｪ繝ｳ繧ｯ縺九ｉ遒ｺ隱阪＠縺ｦ縺上□縺輔＞・喇ttps://amaz0n-security.xyz/verify縲・,
    isScam: true,
    explanation: '繝輔ぅ繝・す繝ｳ繧ｰ隧先ｬｺ縺ｧ縺吶６RL縺後径maz0n縲・謨ｰ蟄励・繧ｼ繝ｭ)縺ｧ縲√ラ繝｡繧､繝ｳ繧ゅ・xyz縲阪〒縺吶・mazon縺ｯ縲径mazon.co.jp縲阪ラ繝｡繧､繝ｳ縺ｮ縺ｿ菴ｿ逕ｨ縺励∪縺吶・,
  },
  {
    id: 'q5', category: '謚戊ｳ・ｩ先ｬｺ', difficulty: '荳ｭ邏・,
    scenario: '縲悟・譛ｬ菫晁ｨｼ縺ｧ蟷ｴ蛻ｩ20%縺ｮ謚戊ｳ・｡井ｻｶ縺ｧ縺吶ゆｻ翫↑繧蛾剞螳・0蜷阪・縺ｿ蜿ょ刈蜿ｯ閭ｽ縲り送蜷堺ｺｺ縺ｮ笳銀雷縺輔ｓ繧ょ盾蜉縺励※縺・∪縺吶ゅ・,
    isScam: true,
    explanation: '謚戊ｳ・ｩ先ｬｺ縺ｮ蜈ｸ蝙九ヱ繧ｿ繝ｼ繝ｳ縺ｧ縺吶ょ・譛ｬ菫晁ｨｼ縺ｧ鬮伜茜蝗槭ｊ縺ｯ驥題檮蝠・刀蜿門ｼ墓ｳ暮＆蜿阪り送蜷堺ｺｺ縺ｮ蜷榊燕繧貞享謇九↓菴ｿ縺・・繧りｩ先ｬｺ縺ｮ迚ｹ蠕ｴ縺ｧ縺吶・,
  },
  {
    id: 'q6', category: '髣・ヰ繧､繝・, difficulty: '荳ｭ邏・,
    scenario: '縲碁ｫ伜庶蜈･繝舌う繝茨ｼ・譌･縺ｧ5荳・・莉･荳雁庄閭ｽ・∽ｻ穂ｺ句・螳ｹ縺ｯ闕ｷ迚ｩ縺ｮ蜿励￠蜿悶ｊ縺ｨ霆｢騾√□縺代る擇謗･縺ｪ縺励∝叉譌･蜍､蜍儖K縲りｺｫ蛻・ｨｼ縺ｮ繧ｳ繝斐・繧帝√▲縺ｦ縺上□縺輔＞縲ゅ・,
    isScam: true,
    explanation: '髣・ヰ繧､繝茨ｼ亥女縺大ｭ舌・蜃ｺ縺怜ｭ撰ｼ峨・蜍ｧ隱倥〒縺吶ゅ瑚差迚ｩ縺ｮ蜿励￠蜿悶ｊ繝ｻ霆｢騾√阪・隧先ｬｺ縺ｮ蜿励￠蟄舌〒縺吶りｺｫ蛻・ｨｼ繧帝√ｋ縺ｨ閼・ｿｫ縺ｫ菴ｿ繧上ｌ縺ｾ縺吶るｮ謐輔＆繧後ｋ縺ｮ縺ｯ螳溯｡檎官・医≠縺ｪ縺滂ｼ峨〒縺吶・,
  },
  {
    id: 'q7', category: '繝ｭ繝槭Φ繧ｹ隧先ｬｺ', difficulty: '荳顔ｴ・,
    scenario: '縲後・繝・メ繝ｳ繧ｰ繧｢繝励Μ縺ｧ遏･繧雁粋縺｣縺溷､門嵜莠ｺ縺九ｉ縲後≠縺ｪ縺溘↓莨壹＞縺ｫ陦後″縺溘＞縲ゅ〒繧よｸ｡闊ｪ雋ｻ逕ｨ縺瑚ｶｳ繧翫↑縺・・荳・・縺縺鷹√▲縺ｦ縺上ｌ縺溘ｉ蠢・★霑斐☆縲阪→險繧上ｌ縺溘ゅ・,
    isScam: true,
    explanation: '繝ｭ繝槭Φ繧ｹ隧先ｬｺ縺ｧ縺吶ゆｼ壹▲縺溘％縺ｨ縺ｮ縺ｪ縺・嶌謇九∈縺ｮ騾・≡縺ｯ邨ｶ蟇ｾNG縺ｧ縺吶ゅ悟ｰ鷹｡阪°繧牙ｧ九ａ縺ｦ蠕舌・↓蠅鈴｡阪阪′蟶ｸ螂玲焔谿ｵ縲・,
  },
  {
    id: 'q8', category: '繧ｵ繝昴・繝郁ｩ先ｬｺ', difficulty: '荳顔ｴ・,
    scenario: '縲訓C縺ｮ逕ｻ髱｢縺ｫ遯∫┯縲後え繧､繝ｫ繧ｹ縺ｫ諢滓沒縺励∪縺励◆・∽ｻ翫☆縺・50-XXXX-XXXX縺ｫ髮ｻ隧ｱ縺励※縺上□縺輔＞縲阪→隴ｦ蜻翫′陦ｨ遉ｺ縺輔ｌ縲∝､ｧ縺阪↑隴ｦ蜻企浹縺碁ｳｴ繧顔ｶ壹￠縺ｦ縺・ｋ縲ゅ・,
    isScam: true,
    explanation: '繧ｵ繝昴・繝郁ｩ先ｬｺ・医ユ繧ｯ繝九き繝ｫ繧ｵ繝昴・繝郁ｩ先ｬｺ・峨〒縺吶ゅヶ繝ｩ繧ｦ繧ｶ繧帝哩縺倥ｋ縺縺代〒隗｣豎ｺ縺励∪縺呻ｼ・trl+W or Alt+F4・峨り｡ｨ遉ｺ縺輔ｌ縺溽分蜿ｷ縺ｫ縺ｯ邨ｶ蟇ｾ縺ｫ髮ｻ隧ｱ縺励↑縺・〒縺上□縺輔＞縲・,
  },
  {
    id: 'q9', category: '豁｣隕・, difficulty: '荳ｭ邏・,
    scenario: '縲娯雷笳矩橿陦後〒縺吶ゅ♀螳｢讒倥・蜿｣蠎ｧ縺九ｉ荳榊ｯｩ縺ｪ蠑輔″關ｽ縺ｨ縺励′縺ゅｊ縺ｾ縺励◆縲ら｢ｺ隱阪・縺溘ａ縲∵怙蟇・ｊ縺ｮ謾ｯ蠎励↓縺願ｶ翫＠縺・◆縺縺上°縲√き繧ｹ繧ｿ繝槭・繧ｻ繝ｳ繧ｿ繝ｼ(0120-XXX-XXX)縺ｫ縺秘｣邨｡縺上□縺輔＞縲ゅ・,
    isScam: false,
    explanation: '驫陦後°繧峨・豁｣隕城｣邨｡縺ｮ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺吶ゅ◆縺縺励√％縺ｮ髮ｻ隧ｱ閾ｪ菴薙′隧先ｬｺ縺ｮ蜿ｯ閭ｽ諤ｧ繧ゅ≠繧九◆繧√・橿陦後・蜈ｬ蠑上し繧､繝医↓險倩ｼ峨・逡ｪ蜿ｷ縺ｫ閾ｪ蛻・°繧峨°縺醍峩縺励※遒ｺ隱阪＠縺ｾ縺励ｇ縺・・,
  },
  {
    id: 'q10', category: '豁｣隕・, difficulty: '荳顔ｴ・,
    scenario: '縲悟ｮ・・萓ｿ縺ｮ荳榊惠騾夂衍縺後・繧ｹ繝医↓蜈･縺｣縺ｦ縺・◆縲りｨ倩ｼ峨・髮ｻ隧ｱ逡ｪ蜿ｷ縺ｫ謚倥ｊ霑斐＠縺溘→縺薙ｍ縲∝・驟埼＃縺ｮ譌･譎ゅｒ閨槭°繧後◆縲ゅ・,
    isScam: false,
    explanation: '豁｣隕上・荳榊惠騾夂衍縺ｧ縺吶ゅ◆縺縺祐MS繧・Γ繝ｼ繝ｫ縺ｧ縺ｮ荳榊惠騾夂衍縺ｯ隧先ｬｺ縺ｮ蜿ｯ閭ｽ諤ｧ縺碁ｫ倥＞縺ｧ縺吶らｴ吶・荳榊惠逾ｨ縺ｯ蝓ｺ譛ｬ逧・↓螳牙・縺ｧ縺吶′縲∫分蜿ｷ縺ｯ蜈ｬ蠑上し繧､繝医〒辣ｧ蜷医☆繧九→螳牙ｿ・〒縺吶・,
  },
]

const scamPatterns: ScamPattern[] = [
  {
    id: 's1', name: '繧ｪ繝ｬ繧ｪ繝ｬ隧先ｬｺ', category: '髮ｻ隧ｱ隧先ｬｺ',
    description: '諱ｯ蟄舌ｄ蟄ｫ繧定｣・＞縲後♀驥代′蠢・ｦ√阪→邱頑･諤ｧ繧堤・繧・,
    keywords: ['菫ｺ縺縺代←', '莠区腐', '遉ｺ隲・≡', '莨夂､ｾ縺ｮ縺企≡', '莉頑律荳ｭ縺ｫ', '隱ｰ縺ｫ繧りｨ繧上↑縺・〒'],
    examples: ['縲御ｿｺ縺縺代←縲∽ｺ区腐繧定ｵｷ縺薙＠縺｡繧・▲縺ｦ窶ｦ縲・, '縲御ｼ夂､ｾ縺ｮ驥代ｒ菴ｿ縺・ｾｼ繧薙〒縲√け繝薙↓縺ｪ繧銀ｦ縲・],
    prevention: '蠢・★譛ｬ莠ｺ縺ｮ謳ｺ蟶ｯ縺ｫ謚倥ｊ霑斐☆縲ょｮｶ譌上〒蜷郁ｨ闡峨ｒ豎ｺ繧√※縺翫￥縲・,
    damage: '蟷ｳ蝮・｢ｫ螳ｳ鬘・ 邏・00荳・・',
  },
  {
    id: 's2', name: '驍・ｻ倬≡隧先ｬｺ', category: '髮ｻ隧ｱ隧先ｬｺ',
    description: '蟶ょｽｹ謇繧・ｹｴ驥台ｺ句漁謇繧定｣・＞縲、TM謫堺ｽ懊ｒ謖・､ｺ',
    keywords: ['驍・ｻ倬≡', 'ATM', '謇狗ｶ壹″', '譛滄剞', '蛛･蠎ｷ菫晞匱', '蟶ょｽｹ謇'],
    examples: ['縲悟現逋りｲｻ縺ｮ驍・ｻ倬≡縺後≠繧翫∪縺吶・, '縲窟TM縺ｧ謇狗ｶ壹″縺励※縺上□縺輔＞縲・],
    prevention: '蠖ｹ謇縺窟TM謫堺ｽ懊ｒ髮ｻ隧ｱ縺ｧ謖・､ｺ縺吶ｋ縺薙→縺ｯ邨ｶ蟇ｾ縺ｫ縺ｪ縺・・,
    damage: '蟷ｳ蝮・｢ｫ螳ｳ鬘・ 邏・00荳・・',
  },
  {
    id: 's3', name: '譫ｶ遨ｺ隲区ｱりｩ先ｬｺ', category: 'SMS/繝｡繝ｼ繝ｫ隧先ｬｺ',
    description: '霄ｫ縺ｫ隕壹∴縺ｮ縺ｪ縺・ｫ区ｱゅ〒辟ｦ繧峨○縺ｦ騾｣邨｡縺輔○繧・,
    keywords: ['譛邨る壼相', '譛ｪ邏・, '豕慕噪謇狗ｶ壹″', '陬∝愛', '譛ｬ譌･荳ｭ縺ｫ'],
    examples: ['縲悟茜逕ｨ譁咎≡縺ｮ譛ｪ邏阪′遒ｺ隱阪＆繧後∪縺励◆縲・, '縲梧ｳ慕噪謗ｪ鄂ｮ繧貞叙繧翫∪縺吶・],
    prevention: '霄ｫ縺ｫ隕壹∴縺ｮ縺ｪ縺・ｫ区ｱゅ・辟｡隕悶よｭ｣隕上・隲区ｱゅ・譖ｸ髱｢縺ｧ螻翫￥縲・,
    damage: '蟷ｳ蝮・｢ｫ螳ｳ鬘・ 邏・0荳・・',
  },
  {
    id: 's4', name: '繝輔ぅ繝・す繝ｳ繧ｰ隧先ｬｺ', category: 'SMS/繝｡繝ｼ繝ｫ隧先ｬｺ',
    description: '螳溷惠莨∵･ｭ繧定｣・▲縺溷⊃繧ｵ繧､繝医〒ID/繝代せ繝ｯ繝ｼ繝峨ｒ逶励・',
    keywords: ['繧｢繧ｫ繧ｦ繝ｳ繝育焚蟶ｸ', '繝ｭ繧ｰ繧､繝ｳ遒ｺ隱・, '24譎る俣莉･蜀・, '縺薙■繧峨・繝ｪ繝ｳ繧ｯ', '譛ｬ莠ｺ遒ｺ隱・],
    examples: ['縲御ｸ肴ｭ｣繧｢繧ｯ繧ｻ繧ｹ縺梧､懷・縺輔ｌ縺ｾ縺励◆縲・, '縲後い繧ｫ繧ｦ繝ｳ繝医′繝ｭ繝・け縺輔ｌ縺ｾ縺吶・],
    prevention: '繝｡繝ｼ繝ｫ蜀・・繝ｪ繝ｳ繧ｯ縺ｯ邨ｶ蟇ｾ縺ｫ繧ｯ繝ｪ繝・け縺励↑縺・ょ・蠑上い繝励Μ縺九ヶ繝・け繝槭・繧ｯ縺九ｉ繧｢繧ｯ繧ｻ繧ｹ縲・,
    damage: '繧ｯ繝ｬ繧ｸ繝・ヨ繧ｫ繝ｼ繝我ｸ肴ｭ｣蛻ｩ逕ｨ縲∝倶ｺｺ諠・ｱ貍乗ｴｩ',
  },
  {
    id: 's5', name: '謚戊ｳ・ｩ先ｬｺ', category: '謚戊ｳ・・蜑ｯ讌ｭ隧先ｬｺ',
    description: '鬮伜茜蝗槭ｊ繝ｻ蜈・悽菫晁ｨｼ繧偵≧縺溘≧譫ｶ遨ｺ縺ｮ謚戊ｳ・ｩｱ',
    keywords: ['蜈・悽菫晁ｨｼ', '蟷ｴ蛻ｩ20%', '髯仙ｮ・, '闡怜錐莠ｺ', '蠢・★蜆ｲ縺九ｋ', '莉翫□縺・],
    examples: ['縲悟・譛ｬ菫晁ｨｼ縺ｧ蟷ｴ蛻ｩ20%縲・, '縲梧怏蜷堺ｺｺ繧ょ盾蜉縺励※縺・ｋ縲・],
    prevention: '縲悟ｿ・★蜆ｲ縺九ｋ縲肴兜雉・・蟄伜惠縺励↑縺・る≡陞榊ｺ√・逋ｻ骭ｲ讌ｭ閠・°遒ｺ隱阪・,
    damage: '謨ｰ逋ｾ荳・懈焚蜊・ｸ・・縺ｮ陲ｫ螳ｳ萓句､壽焚',
  },
  {
    id: 's6', name: '髣・ヰ繧､繝・, category: '迥ｯ鄂ｪ蜉諡・梛',
    description: 'SNS縺ｧ鬮倬｡榊ｱ驟ｬ繧偵≧縺溘＞縲∫官鄂ｪ縺ｮ螳溯｡悟ｽｹ縺ｫ縺輔○繧・,
    keywords: ['蜊ｳ譌･迴ｾ驥・, '鬮伜庶蜈･', '邁｡蜊倅ｽ懈･ｭ', '髱｢謗･縺ｪ縺・, '闕ｷ迚ｩ縺ｮ蜿励￠蜿悶ｊ', '霄ｫ蛻・ｨｼ', '繝・Ξ繧ｰ繝ｩ繝'],
    examples: ['縲・譌･5荳・ｻ･荳雁庄閭ｽ縲・, '縲瑚差迚ｩ繧貞女縺大叙縺｣縺ｦ霆｢騾√☆繧九□縺代・],
    prevention: '鬮倬｡催礼ｰ｡蜊佚怜諺蜷・= 100%髣・ヰ繧､繝医ょｿ懷供縺励◆譎らせ縺ｧ閼・ｿｫ縺輔ｌ繧九・,
    damage: '騾ｮ謐輔・螳溷・・亥ｮ溯｡檎官縺ｨ縺励※蜃ｦ鄂ｰ縺輔ｌ繧具ｼ・,
  },
  {
    id: 's7', name: '繝ｭ繝槭Φ繧ｹ隧先ｬｺ', category: '諱区・隧先ｬｺ',
    description: '繝槭ャ繝√Φ繧ｰ繧｢繝励Μ繧ТNS縺ｧ諱区・諢滓ュ繧貞茜逕ｨ縺励※驥鷹姦繧定ｦ∵ｱ・,
    keywords: ['莨壹＞縺ｫ陦後″縺溘＞', '貂｡闊ｪ雋ｻ', '蟆代＠縺縺題ｲｸ縺励※', '證怜捷雉・肇', '謚戊ｳ・ｒ荳邱偵↓'],
    examples: ['縲後≠縺ｪ縺溘↓莨壹≧縺溘ａ縺ｫ貂｡闊ｪ雋ｻ縺悟ｿ・ｦ√・, '縲御ｸ邱偵↓謚戊ｳ・＠繧医≧縲・],
    prevention: '莨壹▲縺溘％縺ｨ縺ｮ縺ｪ縺・嶌謇九↓騾・≡縺励↑縺・よ兜雉・・隧ｱ縺悟・縺溘ｉ100%隧先ｬｺ縲・,
    damage: '蟷ｳ蝮・｢ｫ螳ｳ鬘・ 邏・00荳・・',
  },
  {
    id: 's8', name: '繧ｵ繝昴・繝郁ｩ先ｬｺ', category: 'PC隧先ｬｺ',
    description: '蛛ｽ縺ｮ繧ｦ繧､繝ｫ繧ｹ隴ｦ蜻顔判髱｢縺ｧ髮ｻ隧ｱ繧偵°縺代＆縺帙・□髫疲桃菴懊〒驥鷹姦繧帝ｨ吶＠蜿悶ｋ',
    keywords: ['繧ｦ繧､繝ｫ繧ｹ諢滓沒', '莉翫☆縺宣崕隧ｱ', '驕髫疲桃菴・, '繧ｵ繝昴・繝域侭驥・, '繧ｮ繝輔ヨ繧ｫ繝ｼ繝・],
    examples: ['縲後え繧､繝ｫ繧ｹ縺ｫ諢滓沒縺励∪縺励◆・√・, '縲勲icrosoft繧ｵ繝昴・繝医〒縺吶る□髫疲桃菴懊〒菫ｮ蠕ｩ縺励∪縺吶・],
    prevention: '繝悶Λ繧ｦ繧ｶ繧帝哩縺倥ｋ縺縺代〒隗｣豎ｺ・・trl+W・峨り｡ｨ遉ｺ縺輔ｌ縺溽分蜿ｷ縺ｫ髮ｻ隧ｱ縺励↑縺・・,
    damage: '謨ｰ荳・懈焚蜊∽ｸ・・・医ぐ繝輔ヨ繧ｫ繝ｼ繝芽ｳｼ蜈･縺輔○繧九こ繝ｼ繧ｹ縺悟､壹＞・・,
  },
]

const defaultChecklist: CheckItem[] = [
  { id: 'c1', label: '霑ｷ諠鷹崕隧ｱ繝輔ぅ繝ｫ繧ｿ繧｢繝励Μ縺ｮ險ｭ螳・, category: '繧ｹ繝槭・險ｭ螳・, description: 'Whoscall遲峨・霑ｷ諠鷹崕隧ｱ蟇ｾ遲悶い繝励Μ繧偵う繝ｳ繧ｹ繝医・繝ｫ繝ｻ險ｭ螳・, done: false, priority: '蠢・・ },
  { id: 'c2', label: '遏･繧峨↑縺・分蜿ｷ縺ｫ蜃ｺ縺ｪ縺・ｨｭ螳・, category: '繧ｹ繝槭・險ｭ螳・, description: '騾｣邨｡蜈医↓逋ｻ骭ｲ縺輔ｌ縺ｦ縺・↑縺・分蜿ｷ縺ｯ逡吝ｮ磯崕縺ｫ蝗槭☆險ｭ螳・, done: false, priority: '蠢・・ },
  { id: 'c3', label: '莠梧ｮｵ髫手ｪ崎ｨｼ縺ｮ險ｭ螳・, category: '繧｢繧ｫ繧ｦ繝ｳ繝・, description: 'LINE縲√Γ繝ｼ繝ｫ縲・橿陦後い繝励Μ縺ｫ莠梧ｮｵ髫手ｪ崎ｨｼ繧定ｨｭ螳・, done: false, priority: '蠢・・ },
  { id: 'c4', label: 'LINE縺ｮ蜿九□縺｡霑ｽ蜉險ｭ螳・, category: 'SNS', description: '縲悟暑縺縺｡閾ｪ蜍戊ｿｽ蜉縲阪悟暑縺縺｡縺ｸ縺ｮ霑ｽ蜉繧定ｨｱ蜿ｯ縲阪ｒOFF', done: false, priority: '蠢・・ },
  { id: 'c5', label: '繝代せ繝ｯ繝ｼ繝峨・螟画峩', category: '繧｢繧ｫ繧ｦ繝ｳ繝・, description: '驫陦後√Γ繝ｼ繝ｫ縲ヾNS縺ｮ繝代せ繝ｯ繝ｼ繝峨ｒ蠑ｷ蜉帙↑繧ゅ・縺ｫ螟画峩', done: false, priority: '蠢・・ },
  { id: 'c6', label: '螳ｶ譌上・蜷郁ｨ闡峨ｒ豎ｺ繧√ｋ', category: '繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ', description: '縲後♀驥代・隧ｱ縺悟・縺溘ｉ蜷郁ｨ闡峨ｒ遒ｺ隱阪☆繧九阪Ν繝ｼ繝ｫ繧呈ｱｺ繧√ｋ', done: false, priority: '蠢・・ },
  { id: 'c7', label: '邱頑･騾｣邨｡蜈医Μ繧ｹ繝医・菴懈・', category: '繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ', description: '隴ｦ蟇・#9110)縲∵ｶ郁ｲｻ閠・・繝・ヨ繝ｩ繧､繝ｳ(188)縲∝ｮｶ譌上・逡ｪ蜿ｷ繧堤ｴ吶〒蜀ｷ阡ｵ蠎ｫ縺ｫ雋ｼ繧・, done: false, priority: '蠢・・ },
  { id: 'c8', label: 'SMS繝輔ぅ繝ｫ繧ｿ險ｭ螳・, category: '繧ｹ繝槭・險ｭ螳・, description: 'SMS蜀・・繝ｪ繝ｳ繧ｯ繧定・蜍輔ヶ繝ｭ繝・け or 隴ｦ蜻願｡ｨ遉ｺ縺吶ｋ險ｭ螳・, done: false, priority: '謗ｨ螂ｨ' },
  { id: 'c9', label: '繝｡繝ｼ繝ｫ縺ｮ霑ｷ諠代Γ繝ｼ繝ｫ繝輔ぅ繝ｫ繧ｿ', category: '繝｡繝ｼ繝ｫ', description: '繝輔ぅ繝・す繝ｳ繧ｰ繝｡繝ｼ繝ｫ繧定・蜍墓険繧雁・縺代ｋ繝輔ぅ繝ｫ繧ｿ繧堤｢ｺ隱・, done: false, priority: '謗ｨ螂ｨ' },
  { id: 'c10', label: '繧ｯ繝ｬ繧ｸ繝・ヨ繧ｫ繝ｼ繝峨・蛻ｩ逕ｨ騾夂衍', category: '驥題檮', description: '蛻ｩ逕ｨ譎ゅ↓蜊ｳ譎る夂衍縺悟ｱ翫￥險ｭ螳壹ｒON', done: false, priority: '謗ｨ螂ｨ' },
  { id: 'c11', label: '驫陦後い繝励Μ縺ｮ謖ｯ霎ｼ髯仙ｺｦ鬘・, category: '驥題檮', description: '1譌･縺ｮ謖ｯ霎ｼ髯仙ｺｦ鬘阪ｒ蠢・ｦ∵怙菴朱剞縺ｫ險ｭ螳・, done: false, priority: '謗ｨ螂ｨ' },
  { id: 'c12', label: 'SNS縺ｮ蜈ｬ髢狗ｯ・峇遒ｺ隱・, category: 'SNS', description: 'Facebook縲！nstagram縺ｮ謚慕ｨｿ蜈ｬ髢狗ｯ・峇繧偵悟暑驕斐・縺ｿ縲阪↓', done: false, priority: '莉ｻ諢・ },
]

const emergencySteps = [
  { step: 1, title: '關ｽ縺｡逹縺・, description: '豺ｱ蜻ｼ蜷ｸ縺励※蜀ｷ髱吶↓縺ｪ繧九りｩ先ｬｺ迥ｯ縺ｯ縲檎┬繧峨○繧九阪・縺梧焔蜿｣縲・, icon: 'ｧ・ },
  { step: 2, title: '髮ｻ隧ｱ繧貞・繧・/ 逕ｻ髱｢繧帝哩縺倥ｋ', description: '諤ｪ縺励＞髮ｻ隧ｱ縺ｯ縺吶＄蛻・ｋ縲１C隴ｦ蜻顔判髱｢縺ｯCtrl+W縺ｧ髢峨§繧九・, icon: '瞳' },
  { step: 3, title: '螳ｶ譌上↓逶ｸ隲・, description: '荳莠ｺ縺ｧ蛻､譁ｭ縺励↑縺・ょｿ・★螳ｶ譌上ｄ菫｡鬆ｼ縺ｧ縺阪ｋ莠ｺ縺ｫ逶ｸ隲・☆繧九・, icon: '捉窶昨汨ｩ窶昨汨ｦ' },
  { step: 4, title: '隴ｦ蟇溘↓逶ｸ隲・, description: '隴ｦ蟇溽嶌隲・ｪ灘哨 #9110・育ｷ頑･縺ｮ蝣ｴ蜷医・110逡ｪ・峨↓髮ｻ隧ｱ縲・, icon: '属' },
  { step: 5, title: '謖ｯ霎ｼ貂医∩縺ｮ蝣ｴ蜷・, description: '驫陦後↓騾｣邨｡縺励※蜿｣蠎ｧ蜃咲ｵ舌ｒ萓晞ｼ縲よ険繧願ｾｼ繧∬ｩ先ｬｺ謨第ｸ域ｳ輔〒霑秘≡縺ｮ蜿ｯ閭ｽ諤ｧ縺ゅｊ縲・, icon: '嘗' },
  { step: 6, title: '險ｼ諡繧剃ｿ晏・', description: 'SMS縲√Γ繝ｼ繝ｫ縲・夊ｩｱ螻･豁ｴ縲∫判髱｢縺ｮ繧ｹ繧ｯ繝ｪ繝ｼ繝ｳ繧ｷ繝ｧ繝・ヨ繧剃ｿ晏ｭ倥・, icon: '萄' },
]

// 笏笏笏 Danger keyword analysis 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
// 笏笏笏 Enhanced Danger Keyword DB 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
// Each entry has: words (variants), level, category, weight (for scoring)
const dangerKeywordGroups: { words: string[]; level: 'critical' | 'warning' | 'suspicious'; category: string; weight: number }[] = [
  // 笏笏 髣・ヰ繧､繝医・迥ｯ鄂ｪ蜉諡・(譛驥崎ｦ・ 笏笏
  { words: ['蜿励￠蟄・, '縺・￠縺・], level: 'critical', category: '髣・ヰ繧､繝茨ｼ亥女縺大ｭ撰ｼ・, weight: 25 },
  { words: ['蜃ｺ縺怜ｭ・, '縺縺励％'], level: 'critical', category: '髣・ヰ繧､繝茨ｼ亥・縺怜ｭ撰ｼ・, weight: 25 },
  { words: ['謗帙￠蟄・, '縺九￠縺・], level: 'critical', category: '髣・ヰ繧､繝茨ｼ域寺縺大ｭ撰ｼ・, weight: 25 },
  { words: ['陬上ヰ繧､繝・, '髣・ヰ繧､繝・, '繧・∩縺ｰ縺・→', '繧ｦ繝ｩ繝舌う繝・], level: 'critical', category: '髣・ヰ繧､繝・, weight: 25 },
  { words: ['鬟帙・縺・, '鬟帙・縺玲声蟶ｯ', '鬟帙・縺励せ繝槭・'], level: 'critical', category: '迥ｯ鄂ｪ繝・・繝ｫ', weight: 25 },
  { words: ['繧ｿ繧ｿ繧ｭ', '縺溘◆縺・, '蜿ｩ縺・], level: 'critical', category: '蠑ｷ逶暦ｼ磯裸繝舌う繝育畑隱橸ｼ・, weight: 25 },
  { words: ['闕ｷ迚ｩ縺ｮ蜿励￠蜿悶ｊ', '闕ｷ迚ｩ繧貞女縺大叙', '闕ｷ迚ｩ蜿怜叙', '闕ｷ蜿励￠'], level: 'critical', category: '蜿励￠蟄・, weight: 20 },
  { words: ['闕ｷ迚ｩ繧貞ｱ翫￠繧・, '闕ｷ迚ｩ縺ｮ霆｢騾・, '闕ｷ迚ｩ霆｢騾・], level: 'critical', category: '蜿励￠蟄・, weight: 20 },
  { words: ['迴ｾ驥代・蝗槫庶', '迴ｾ驥大屓蜿・, '縺企≡繧貞女縺大叙'], level: 'critical', category: '蜿励￠蟄・蜃ｺ縺怜ｭ・, weight: 22 },
  { words: ['蜿｣蠎ｧ繧定ｲｸ縺・, '蜿｣蠎ｧ雋ｸ縺・, '蜿｣蠎ｧ螢ｲ雋ｷ', '蜿｣蠎ｧ繧貞｣ｲ'], level: 'critical', category: '蜿｣蠎ｧ隧先ｬｺ', weight: 25 },
  { words: ['蜷咲ｾｩ雋ｸ縺・, '蜷咲ｾｩ繧定ｲｸ'], level: 'critical', category: '迥ｯ鄂ｪ蜉諡・, weight: 22 },
  { words: ['繧ｭ繝｣繝・す繝･繧ｫ繝ｼ繝峨ｒ騾・, '繧ｫ繝ｼ繝峨ｒ驛ｵ騾・, '繧ｫ繝ｼ繝峨ｒ鬆・], level: 'critical', category: '蜿｣蠎ｧ隧先ｬｺ', weight: 25 },
  { words: ['telegram', '繝・Ξ繧ｰ繝ｩ繝', '繝・Ξ繧ｰ繝ｩ'], level: 'warning', category: '蛹ｿ蜷埼壻ｿ｡・育官鄂ｪ騾｣邨｡縺ｫ螟夂畑・・, weight: 12 },
  { words: ['signal', '繧ｷ繧ｰ繝翫Ν'], level: 'warning', category: '蛹ｿ蜷埼壻ｿ｡', weight: 8 },
  { words: ['遘伜ｯ・宍螳・, '莉冶ｨ辟｡逕ｨ', '隱ｰ縺ｫ繧りｨ縺・↑', '隱ｰ縺ｫ繧りｨ繧上↑縺・〒', '蜀・ｯ・↓'], level: 'critical', category: '蜿｣豁｢繧・ｼ郁ｩ先ｬｺ縺ｮ蟶ｸ螂怜唱・・, weight: 18 },

  // 笏笏 鬮倬｡榊ｱ驟ｬ邉ｻ 笏笏
  { words: ['蜊ｳ譌･迴ｾ驥・, '蜊ｳ驥・, '蜊ｳ譌･謇輔＞', '蜊ｳ譌･蜈･驥・, '蠖捺律謇輔＞', '蠖捺律迴ｾ驥・], level: 'critical', category: '髣・ヰ繧､繝・, weight: 18 },
  { words: ['鬮伜庶蜈･', '鬮倬｡榊ｱ驟ｬ', '鬮倬｡阪ヰ繧､繝・, '鬮倬｡肴｡井ｻｶ', '譛亥庶100荳・, '譌･邨ｦ5荳・, '譌･邨ｦ10荳・, '1譌･縺ｧ5荳・, '1譌･縺ｧ10荳・], level: 'critical', category: '鬮倬｡榊ｱ驟ｬ・磯裸繝舌う繝茨ｼ・, weight: 15 },
  { words: ['邁｡蜊倅ｽ懈･ｭ', '邁｡蜊倥↑縺贋ｻ穂ｺ・, '繧ｫ繝ｳ繧ｿ繝ｳ菴懈･ｭ', '隱ｰ縺ｧ繧ゅ〒縺阪ｋ', '譛ｪ邨碁ｨ登k', '譛ｪ邨碁ｨ捺ｭ楢ｿ・], level: 'warning', category: '邁｡蜊佚鈴ｫ倬｡阪・蜊ｱ髯ｺ', weight: 10 },
  { words: ['髱｢謗･縺ｪ縺・, '髱｢謗･荳崎ｦ・, '螻･豁ｴ譖ｸ荳崎ｦ・, '邨梧ｭｴ荳榊撫'], level: 'warning', category: '蛹ｿ蜷肴ｧ・磯裸繝舌う繝育音蠕ｴ・・, weight: 10 },
  { words: ['譌･謇輔＞', '騾ｱ謇輔＞', '迴ｾ驥第焔貂｡縺・], level: 'warning', category: '蜊ｳ驥第ｧ', weight: 8 },

  // 笏笏 霄ｫ蛻・ｨｼ隕∵ｱ・笏笏
  { words: ['霄ｫ蛻・ｨｼ', '蜈崎ｨｱ險ｼ縺ｮ繧ｳ繝斐・', '蜈崎ｨｱ險ｼ縺ｮ蜀咏悄', '霄ｫ蛻・ｨｼ譏取嶌繧帝・, '譛ｬ莠ｺ遒ｺ隱肴嶌鬘槭ｒ騾・, '蜈崎ｨｱ險ｼ繧呈聴蠖ｱ', '繝槭う繝翫Φ繝舌・繧ｫ繝ｼ繝・], level: 'critical', category: '蛟倶ｺｺ諠・ｱ謳ｾ蜿厄ｼ郁у霑ｫ譚先侭蛹厄ｼ・, weight: 18 },
  { words: ['鬘泌・逵溘ｒ騾・, '閾ｪ謦ｮ繧翫ｒ騾・, '鬘泌・逵滉ｻ倥″'], level: 'critical', category: '蛟倶ｺｺ諠・ｱ謳ｾ蜿・, weight: 15 },

  // 笏笏 謚戊ｳ・ｩ先ｬｺ 笏笏
  { words: ['蜈・悽菫晁ｨｼ', '蜈・悽蜑ｲ繧後↑縺・], level: 'critical', category: '謚戊ｳ・ｩ先ｬｺ', weight: 20 },
  { words: ['蠢・★蜆ｲ縺九ｋ', '邨ｶ蟇ｾ蜆ｲ縺九ｋ', '100%蛻ｩ逶・, '謳阪＠縺ｪ縺・, '繝弱・繝ｪ繧ｹ繧ｯ'], level: 'critical', category: '謚戊ｳ・ｩ先ｬｺ', weight: 20 },
  { words: ['蟷ｴ蛻ｩ20', '蟷ｴ蛻ｩ30', '譛亥茜10', '譛亥茜5%莉･荳・], level: 'critical', category: '謚戊ｳ・ｩ先ｬｺ・育焚蟶ｸ蛻ｩ蝗槭ｊ・・, weight: 18 },
  { words: ['證怜捷雉・肇', '莉ｮ諠ｳ騾夊ｲｨ', '繝薙ャ繝医さ繧､繝ｳ', 'FX閾ｪ蜍募｣ｲ雋ｷ'], level: 'warning', category: '謚戊ｳ・ｩ先ｬｺ縺ｮ謇区ｮｵ', weight: 8 },
  { words: ['繝槭う繝九Φ繧ｰ', 'NFT謚戊ｳ・, '繝舌う繝翫Μ繝ｼ繧ｪ繝励す繝ｧ繝ｳ'], level: 'warning', category: '謚戊ｳ・ｩ先ｬｺ縺ｮ謇区ｮｵ', weight: 10 },
  { words: ['闡怜錐莠ｺ繧ょ盾蜉', '譛牙錐莠ｺ繧・, '闃ｸ閭ｽ莠ｺ繧・], level: 'critical', category: '讓ｩ螽√▼縺托ｼ郁ｩ先ｬｺ縺ｮ蟶ｸ螂怜唱・・, weight: 15 },
  { words: ['髯仙ｮ・0蜷・, '髯仙ｮ壼供髮・, '谿九ｊ繧上★縺・, '莉翫□縺・, '譛ｬ譌･髯舌ｊ', '蜈育捩'], level: 'suspicious', category: '辟ｦ繧峨○謇句哨', weight: 6 },

  // 笏笏 譫ｶ遨ｺ隲区ｱゅ・繝輔ぅ繝・す繝ｳ繧ｰ 笏笏
  { words: ['譛邨る壼相', '譛邨りｭｦ蜻・, '豕慕噪謇狗ｶ壹″', '豕慕噪謗ｪ鄂ｮ', '陬∝愛謇', '蟾ｮ縺玲款縺輔∴'], level: 'warning', category: '譫ｶ遨ｺ隲区ｱ・, weight: 12 },
  { words: ['譛ｪ邏・, '譛ｪ謇輔＞', '貊樒ｴ・, '蟒ｶ貊・], level: 'suspicious', category: '譫ｶ遨ｺ隲区ｱ・, weight: 6 },
  { words: ['譛ｬ譌･荳ｭ縺ｫ', '24譎る俣莉･蜀・, '48譎る俣莉･蜀・, '閾ｳ諤･', '邱頑･'], level: 'warning', category: '辟ｦ繧峨○謇句哨', weight: 8 },
  { words: ['繧｢繧ｫ繧ｦ繝ｳ繝育焚蟶ｸ', '繧｢繧ｫ繧ｦ繝ｳ繝医Ο繝・け', '荳肴ｭ｣繧｢繧ｯ繧ｻ繧ｹ', '荳肴ｭ｣繝ｭ繧ｰ繧､繝ｳ', '繧ｻ繧ｭ繝･繝ｪ繝・ぅ隴ｦ蜻・], level: 'warning', category: '繝輔ぅ繝・す繝ｳ繧ｰ', weight: 10 },
  { words: ['縺薙■繧峨・繝ｪ繝ｳ繧ｯ', '莉･荳九・url繧・, '繝ｪ繝ｳ繧ｯ繧偵け繝ｪ繝・け', '譛ｬ莠ｺ遒ｺ隱阪・縺薙■繧・], level: 'warning', category: '繝輔ぅ繝・す繝ｳ繧ｰ', weight: 10 },

  // 笏笏 繧ｪ繝ｬ繧ｪ繝ｬ隧先ｬｺ 笏笏
  { words: ['遉ｺ隲・≡', '諷ｰ隰晄侭', '雉蜆滄≡', '蜥瑚ｧ｣驥・], level: 'critical', category: '繧ｪ繝ｬ繧ｪ繝ｬ隧先ｬｺ', weight: 18 },
  { words: ['莨夂､ｾ縺ｮ縺企≡', '讓ｪ鬆・, '菴ｿ縺・ｾｼ縺ｿ'], level: 'critical', category: '繧ｪ繝ｬ繧ｪ繝ｬ隧先ｬｺ', weight: 15 },

  // 笏笏 驍・ｻ倬≡隧先ｬｺ 笏笏
  { words: ['驍・ｻ倬≡', '驕取鴛縺・≡', '謇輔＞謌ｻ縺・], level: 'warning', category: '驍・ｻ倬≡隧先ｬｺ', weight: 10 },
  { words: ['atm縺ｧ謇狗ｶ壹″', 'atm縺ｫ陦後▲縺ｦ', '繧ｳ繝ｳ繝薙ルatm'], level: 'critical', category: '驍・ｻ倬≡隧先ｬｺ', weight: 20 },

  // 笏笏 繧ｵ繝昴・繝郁ｩ先ｬｺ 笏笏
  { words: ['繧ｦ繧､繝ｫ繧ｹ縺ｫ諢滓沒', '繧ｦ繧､繝ｫ繧ｹ諢滓沒', '繝槭Ν繧ｦ繧ｧ繧｢', 'pc縺悟些髯ｺ'], level: 'warning', category: '繧ｵ繝昴・繝郁ｩ先ｬｺ', weight: 10 },
  { words: ['莉翫☆縺宣崕隧ｱ', '繧ｵ繝昴・繝医↓髮ｻ隧ｱ', '050-', '0570-'], level: 'warning', category: '繧ｵ繝昴・繝郁ｩ先ｬｺ', weight: 10 },
  { words: ['驕髫疲桃菴・, '繝ｪ繝｢繝ｼ繝域桃菴・, '繝√・繝繝薙Η繝ｼ繧｢繝ｼ', 'teamviewer', 'anydesk'], level: 'critical', category: '繧ｵ繝昴・繝郁ｩ先ｬｺ', weight: 15 },

  // 笏笏 繝ｭ繝槭Φ繧ｹ隧先ｬｺ 笏笏
  { words: ['莨壹＞縺ｫ陦後″縺溘＞', '貂｡闊ｪ雋ｻ', '鬟幄｡梧ｩ滉ｻ｣', '繝薙じ莉｣'], level: 'warning', category: '繝ｭ繝槭Φ繧ｹ隧先ｬｺ', weight: 12 },
  { words: ['蟆代＠縺縺題ｲｸ縺励※', '縺企≡繧定ｲｸ縺励※', '騾・≡縺励※縺ｻ縺励＞', '遶九※譖ｿ縺医※'], level: 'critical', category: '繝ｭ繝槭Φ繧ｹ隧先ｬｺ/驥鷹姦隕∵ｱ・, weight: 15 },

  // 笏笏 謾ｯ謇輔＞謇区ｮｵ・郁ｩ先ｬｺ縺ｫ螟夂畑・・笏笏
  { words: ['繧ｮ繝輔ヨ繧ｫ繝ｼ繝・, 'amazon繧ｮ繝輔ヨ', 'itunes繧ｫ繝ｼ繝・, 'googleplay繧ｫ繝ｼ繝・, '繝励Μ繝壹う繝峨き繝ｼ繝・], level: 'critical', category: '荳榊庄騾・↑謾ｯ謇輔＞謇区ｮｵ', weight: 18 },
  { words: ['謖ｯ霎ｼ蜈・, '謖ｯ繧願ｾｼ繧薙〒', '蜿｣蠎ｧ縺ｫ騾・≡', '蜿｣蠎ｧ逡ｪ蜿ｷ'], level: 'warning', category: '驥鷹姦隕∵ｱ・, weight: 8 },

  // 笏笏 SNS蜍ｧ隱倥ヱ繧ｿ繝ｼ繝ｳ 笏笏
  { words: ['dm', '繝繧､繝ｬ繧ｯ繝医Γ繝・そ繝ｼ繧ｸ', 'dm縺上□縺輔＞', 'dm騾√▲縺ｦ'], level: 'suspicious', category: 'SNS蜍ｧ隱・, weight: 4 },
  { words: ['#蜑ｯ讌ｭ', '#鬮伜庶蜈･', '#邁｡蜊・, '#遞ｼ縺偵ｋ', '蜑ｯ讌ｭ邏ｹ莉・], level: 'suspicious', category: 'SNS蜍ｧ隱假ｼ磯裸繝舌う繝・謚戊ｳ・ｩ先ｬｺ・・, weight: 6 },
  { words: ['繧ｹ繝槭・縺縺代〒', '繧ｹ繝槭・1蜿ｰ', '蝨ｨ螳・〒譛亥庶', '繧ｳ繝斐・縺縺・, '繧ｳ繝斐・縺吶ｋ縺縺・], level: 'warning', category: '諠・ｱ蝠・攝/髣・ヰ繧､繝・, weight: 10 },

  // 笏笏 蛟倶ｺｺ諠・ｱ隕∵ｱ・笏笏
  { words: ['菴乗園繧呈蕗縺医※', '菴乗園繧帝・, '閾ｪ螳・・菴乗園'], level: 'critical', category: '蛟倶ｺｺ諠・ｱ謳ｾ蜿・, weight: 15 },
  { words: ['繧ｯ繝ｬ繧ｸ繝・ヨ繧ｫ繝ｼ繝臥分蜿ｷ', '繧ｫ繝ｼ繝臥分蜿ｷ', '證苓ｨｼ逡ｪ蜿ｷ', '繝代せ繝ｯ繝ｼ繝峨ｒ蜈･蜉・], level: 'critical', category: '繝輔ぅ繝・す繝ｳ繧ｰ', weight: 20 },
]

// Flatten for display: create a flat keyword array from groups
const dangerKeywords = dangerKeywordGroups.flatMap(group =>
  group.words.map(word => ({ word, level: group.level, category: group.category, weight: group.weight }))
)

// 笏笏笏 Simulation scenarios 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const simScenarios = [
  {
    id: 'oreore',
    name: '繧ｪ繝ｬ繧ｪ繝ｬ隧先ｬｺ',
    icon: '到',
    messages: [
      { role: 'scammer' as const, text: '繧ゅ＠繧ゅ＠縲√♀豈阪＆繧難ｼ滉ｿｺ縺縺代←窶ｦ' },
      { role: 'coach' as const, text: '庁 繝昴う繝ｳ繝茨ｼ壹御ｿｺ縲阪→縺励°蜷堺ｹ励ｊ縺ｾ縺帙ｓ縲ょ錐蜑阪ｒ閨槭″霑斐＠縺ｦ縺上□縺輔＞縲・ },
    ],
    responses: [
      { text: '縲瑚ｪｰ・溷錐蜑阪ｒ險縺｣縺ｦ縲・, next: [
        { role: 'scammer' as const, text: '縺遺ｦ菫ｺ縺繧医≫雷笳九ゅ■繧・▲縺ｨ鬚ｨ驍ｪ縺ｲ縺・※螢ｰ縺悟､峨↑繧薙□窶ｦ' },
        { role: 'coach' as const, text: '庁 縲碁｢ｨ驍ｪ縺ｧ螢ｰ縺悟､峨阪・蜈ｸ蝙狗噪縺ｪ險縺・ｨｳ縺ｧ縺吶ゅ後§繧・≠笳銀雷縺ｮ謳ｺ蟶ｯ縺ｫ縺九￠逶ｴ縺吶・縲阪′豁｣隗｣・・ },
      ]},
      { text: '縲後←縺・＠縺溘・・溷､ｧ荳亥､ｫ・溘・, next: [
        { role: 'scammer' as const, text: '螳溘・莨夂､ｾ縺ｮ縺企≡繧剃ｽｿ縺・ｾｼ繧薙〒縺励∪縺｣縺ｦ窶ｦ莉頑律荳ｭ縺ｫ200荳・・蠢・ｦ√↑繧薙□縲りｪｰ縺ｫ繧りｨ繧上↑縺・〒窶ｦ' },
        { role: 'coach' as const, text: '笞・・蜊ｱ髯ｺ・√御ｻ頑律荳ｭ縲阪瑚ｪｰ縺ｫ繧りｨ繧上↑縺・〒縲阪・隧先ｬｺ縺ｮ2螟ｧ繧ｭ繝ｼ繝ｯ繝ｼ繝峨〒縺吶ゅ☆縺舌↓髮ｻ隧ｱ繧貞・縺｣縺ｦ縲∵悽莠ｺ縺ｮ謳ｺ蟶ｯ縺ｫ謚倥ｊ霑斐＠縺ｦ縺上□縺輔＞縲・ },
      ]},
      { text: '縲碁崕隧ｱ蛻・ｋ縺ｭ縲よ悽莠ｺ縺ｮ謳ｺ蟶ｯ縺ｫ縺九￠逶ｴ縺吶・, next: [
        { role: 'coach' as const, text: '脂 螳檎挑縺ｪ蟇ｾ蠢懊〒縺呻ｼ√％繧後′譛繧ょｮ牙・縺ｪ蟇ｾ蜃ｦ豕輔よ釜繧願ｿ斐＠縺ｦ譛ｬ莠ｺ縺ｫ遒ｺ隱阪☆繧後・縲∬ｩ先ｬｺ繧・00%隕狗ｴ繧後∪縺吶・ },
      ]},
    ],
  },
  {
    id: 'kanpu',
    name: '驍・ｻ倬≡隧先ｬｺ',
    icon: '召',
    messages: [
      { role: 'scammer' as const, text: '笳銀雷蟶ょｽｹ謇縺ｮ蛛･蠎ｷ菫晞匱隱ｲ縺ｮ逕ｰ荳ｭ縺ｨ逕ｳ縺励∪縺吶ょ現逋りｲｻ縺ｮ驕取鴛縺・・縲・5,000蜀・・驍・ｻ倬≡縺後＃縺悶＞縺ｾ縺吶・ },
      { role: 'coach' as const, text: '庁 蟶ょｽｹ謇繧貞錐荵励▲縺ｦ縺・∪縺吶るｄ莉倬≡縺ｮ隧ｱ縺悟・縺溘ｉ隕∵ｳｨ諢上・ },
    ],
    responses: [
      { text: '縲窟TM縺ｧ謇狗ｶ壹″縺ｧ縺阪∪縺吶°・溘・, next: [
        { role: 'scammer' as const, text: '縺ｯ縺・√♀霑代￥縺ｮATM縺ｫ陦後▲縺ｦ謫堺ｽ懊＠縺ｦ縺・◆縺縺代ｌ縺ｰ謖ｯ繧願ｾｼ縺ｾ繧後∪縺吶ゆｻ頑律縺梧悄髯舌〒縺吶・縺ｧ窶ｦ' },
        { role: 'coach' as const, text: '笞・・蜊ｱ髯ｺ・、TM縺ｧ縲碁ｄ莉倬≡繧貞女縺大叙繧九肴桃菴懊・蟄伜惠縺励∪縺帙ｓ縲・TM縺ｧ縺ｧ縺阪ｋ縺ｮ縺ｯ縲碁・≡縲阪□縺代〒縺吶ゅ％繧後・100%隧先ｬｺ縺ｧ縺吶・ },
      ]},
      { text: '縲悟ｸょｽｹ謇縺ｫ逶ｴ謗･陦後▲縺ｦ遒ｺ隱阪＠縺ｾ縺吶・, next: [
        { role: 'coach' as const, text: '脂 豁｣隗｣・∬・蛻・〒蟶ょｽｹ謇縺ｫ陦後￥縺九∝・蠑上し繧､繝医↓霈峨▲縺ｦ縺・ｋ逡ｪ蜿ｷ縺ｫ髮ｻ隧ｱ縺吶ｋ縺ｮ縺悟ｮ牙・縺ｧ縺吶・ },
      ]},
      { text: '縲梧球蠖楢・・蜷榊燕縺ｨ驛ｨ鄂ｲ繧呈蕗縺医※縺上□縺輔＞縲よ釜繧願ｿ斐＠縺ｾ縺吶・, next: [
        { role: 'scammer' as const, text: '縺遺ｦ縺ゅ・縲∵悽譌･荳ｭ縺ｫ謇狗ｶ壹″縺励↑縺・→譛滄剞蛻・ｌ縺ｫ縺ｪ繧翫∪縺吶′窶ｦ' },
        { role: 'coach' as const, text: '庁 縲梧釜繧願ｿ斐☆縲阪→險縺｣縺滄皮ｫｯ縺ｫ辟ｦ繧雁・縺吶・縺ｯ隧先ｬｺ縺ｮ險ｼ諡縲ょｸょｽｹ謇縺ｮ蜈ｬ蠑冗分蜿ｷ縺ｫ縺九￠逶ｴ縺励∪縺励ｇ縺・・ },
      ]},
    ],
  },
  {
    id: 'yami',
    name: '髣・ヰ繧､繝亥匡隱假ｼ・NS・・,
    icon: '町',
    messages: [
      { role: 'scammer' as const, text: '縲宣ｫ倬｡肴｡井ｻｶ縲第律邨ｦ5荳・・0荳・ｼ・ｼ∬差迚ｩ繧貞女縺大叙縺｣縺ｦ謖・ｮ壹・蝣ｴ謇縺ｫ螻翫￠繧九□縺代・邁｡蜊倥↑縺贋ｻ穂ｺ九〒縺吮惠 髱｢謗･縺ｪ縺励・蜊ｳ譌･蜍､蜍儖K・∬・蜻ｳ縺ゅｋ譁ｹ縺ｯDM縺上□縺輔＞腸' },
      { role: 'coach' as const, text: '笞・・縲瑚差迚ｩ縺ｮ蜿励￠蜿悶ｊ繝ｻ霆｢騾√阪・迚ｹ谿願ｩ先ｬｺ縺ｮ蜿励￠蟄撰ｼ磯＆豕包ｼ峨〒縺吶ゅ％繧後↓蠢懷供縺吶ｋ縺ｨ縺ｩ縺・↑繧九°隕九※縺ｿ縺ｾ縺励ｇ縺・・ },
    ],
    responses: [
      { text: '縲瑚・蜻ｳ縺ゅｊ縺ｾ縺呻ｼ∬ｩｳ縺励￥謨吶∴縺ｦ縺上□縺輔＞縲・, next: [
        { role: 'scammer' as const, text: '蠢懷供縺ゅｊ縺後→縺・ｼ√∪縺夊ｺｫ蛻・ｨｼ・亥・險ｱ險ｼ縺ｮ蜀咏悄・峨→蜿｣蠎ｧ諠・ｱ繧帝√▲縺ｦ縺上□縺輔＞縲ゅ☆縺舌↓莉穂ｺ九ｒ邏ｹ莉九＠縺ｾ縺吶・ },
        { role: 'coach' as const, text: '圷 雜・些髯ｺ・∬ｺｫ蛻・ｨｼ繧帝√▲縺滓凾轤ｹ縺ｧ・喀n1. 閼・ｿｫ譚先侭縺ｫ縺輔ｌ繧具ｼ医後ｄ繧√◆繧芽ｺｫ蛻・ｨｼ繧偵・繧峨∪縺上搾ｼ噂n2. 蛟倶ｺｺ諠・ｱ縺檎官鄂ｪ縺ｫ菴ｿ繧上ｌ繧欺n3. 縺ゅ↑縺溘′騾ｮ謐輔＆繧後ｋ・亥ｮ溯｡檎官縺ｨ縺励※・噂n\n邨ｶ蟇ｾ縺ｫ霄ｫ蛻・ｨｼ繧帝√ｉ縺ｪ縺・〒縺上□縺輔＞縲・ },
      ]},
      { text: '縲梧ｪ縺励＞縺ｮ縺ｧ辟｡隕悶☆繧九・, next: [
        { role: 'coach' as const, text: '脂 豁｣隗｣・・ｫ倬｡催礼ｰ｡蜊佚怜諺蜷・= 100%髣・ヰ繧､繝医〒縺吶ら┌隕悶′譛蝟・〒縺吶ょ庄閭ｽ縺ｪ繧唄NS縺ｮ騾壼ｱ讖溯・縺ｧ蝣ｱ蜻翫＠縺ｦ縺上□縺輔＞縲・ },
      ]},
      { text: '縲碁壼ｱ縺吶ｋ縲・, next: [
        { role: 'coach' as const, text: '脂 譛鬮倥・蟇ｾ蠢懶ｼヾNS縺ｮ騾壼ｱ讖溯・繧剃ｽｿ縺・°縲∬ｭｦ蟇溘・髣・ヰ繧､繝育嶌隲・ｪ灘哨・・9110・峨↓諠・ｱ謠蝉ｾ帙＠縺ｦ縺上□縺輔＞縲ゅ≠縺ｪ縺溘・騾壼ｱ縺瑚ｪｰ縺九ｒ謨代＞縺ｾ縺吶・ },
      ]},
    ],
  },
]

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
export default function ScamDefender() {
  const [activeTab, setActiveTab] = useState<'mailcheck' | 'quiz' | 'sim' | 'checklist' | 'database' | 'emergency' | 'yamicheck'>('mailcheck')

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null)
  const [quizComplete, setQuizComplete] = useState(false)

  // Sim state
  const [simScenario, setSimScenario] = useState<typeof simScenarios[0] | null>(null)
  const [simMessages, setSimMessages] = useState<SimMessage[]>([])
  const [simStep, setSimStep] = useState(0)

  // Checklist state
  const [checklist, setChecklist] = useState<CheckItem[]>(defaultChecklist)

  // Yami check state
  const [yamiInput, setYamiInput] = useState('')
  const [yamiResult, setYamiResult] = useState<{ score: number; found: typeof dangerKeywords; analysis: string } | null>(null)

  // Mail check state
  const [mailInput, setMailInput] = useState('')
  const [mailSender, setMailSender] = useState('')
  const [mailSubject, setMailSubject] = useState('')
  const [mailCopied, setMailCopied] = useState(false)

  const buildMailPrompt = useCallback(() => {
    let header = ''
    if (mailSender.trim()) header += `騾∽ｿ｡蜈・い繝峨Ξ繧ｹ: ${mailSender.trim()}\n`
    if (mailSubject.trim()) header += `莉ｶ蜷・ ${mailSubject.trim()}\n`
    return `莉･荳九・繝｡繝ｼ繝ｫ縺瑚ｩ先ｬｺ繝ｻ繝輔ぅ繝・す繝ｳ繧ｰ繝ｻ繧ｹ繝代Β縺九←縺・°繧貞愛螳壹＠縺ｦ縺上□縺輔＞縲・
縲舌Γ繝ｼ繝ｫ諠・ｱ縲・${header}${header ? '\n' : ''}縲舌Γ繝ｼ繝ｫ譛ｬ譁・・${mailInput}

縲仙愛螳壹＠縺ｦ縺ｻ縺励＞繝昴う繝ｳ繝医・1. 蛻､螳夂ｵ先棡: 隧先ｬｺ縺ｮ蜿ｯ閭ｽ諤ｧ・磯ｫ・荳ｭ/菴・螳牙・・・2. 隧先ｬｺ縺ｮ遞ｮ鬘・ ・医ヵ繧｣繝・す繝ｳ繧ｰ/譫ｶ遨ｺ隲区ｱ・謚戊ｳ・ｩ先ｬｺ/繝ｭ繝槭Φ繧ｹ隧先ｬｺ/縺ｪ繧翫☆縺ｾ縺・縺昴・莉・螳牙・・・3. 騾∽ｿ｡蜈・い繝峨Ξ繧ｹ縺ｮ蛻・梵:
   - 繝峨Γ繧､繝ｳ縺ｯ豁｣隕上・繧ゅ・縺具ｼ井ｾ・ amazon.co.jp vs amaz0n-security.xyz・・   - 繝輔Μ繝ｼ繝｡繝ｼ繝ｫ・・mail/yahoo遲会ｼ峨°繧我ｼ∵･ｭ繧貞錐荵励▲縺ｦ縺・↑縺・°
   - 繝峨Γ繧､繝ｳ縺ｮ繧ｹ繝壹Ν縺ｫ荳榊ｯｩ縺ｪ轤ｹ縺ｯ縺ｪ縺・°
4. 蜊ｱ髯ｺ縺ｪ繝昴う繝ｳ繝・
   - ・・RL繝ｻ繝ｪ繝ｳ繧ｯ繝ｻ豺ｻ莉倥ヵ繧｡繧､繝ｫ繝ｻ譁・擇縺ｮ荳榊ｯｩ轤ｹ繧貞・菴鍋噪縺ｫ蛻玲嫌・・5. 隕句・縺代ｋ繝昴う繝ｳ繝・
   - ・域ｭ｣隕上Γ繝ｼ繝ｫ縺ｨ縺ｮ驕輔＞縲∫｢ｺ隱肴婿豕包ｼ・6. 謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ: ・育┌隕・蜑企勁/騾壼ｱ蜈・豁｣隕上し繧､繝医〒逶ｴ謗･遒ｺ隱・縺ｪ縺ｩ・・7. 邱丞粋繧ｳ繝｡繝ｳ繝・`
  }, [mailInput, mailSender, mailSubject])

  const copyMailPrompt = useCallback(() => {
    navigator.clipboard.writeText(buildMailPrompt())
    setMailCopied(true)
    setTimeout(() => setMailCopied(false), 2000)
  }, [buildMailPrompt])

  const tabs = [
    { id: 'mailcheck' as const, label: '透 隧先ｬｺ繝｡繝ｼ繝ｫ蛻､螳・ },
    { id: 'yamicheck' as const, label: '笞・・髣・ヰ繧､繝亥愛螳・ },
    { id: 'quiz' as const, label: '剥 隧先ｬｺ繧ｯ繧､繧ｺ' },
    { id: 'sim' as const, label: '到 髮ｻ隧ｱ繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ' },
    { id: 'database' as const, label: '投 隧先ｬｺ謇句哨DB' },
    { id: 'checklist' as const, label: '笨・隕句ｮ医ｊ繝√ぉ繝・け' },
    { id: 'emergency' as const, label: '圷 邱頑･騾壼ｱ繧ｬ繧､繝・ },
  ]

  // Quiz logic
  const currentQ = quizQuestions[quizIndex]
  const answerQuiz = useCallback((answer: boolean) => {
    if (quizAnswered) return
    const correct = answer === currentQ.isScam
    if (correct) setQuizScore(s => s + 1)
    setQuizCorrect(correct)
    setQuizAnswered(true)
  }, [quizAnswered, currentQ])

  const nextQuiz = useCallback(() => {
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizComplete(true)
    } else {
      setQuizIndex(i => i + 1)
      setQuizAnswered(false)
      setQuizCorrect(null)
    }
  }, [quizIndex])

  const resetQuiz = useCallback(() => {
    setQuizIndex(0)
    setQuizScore(0)
    setQuizAnswered(false)
    setQuizCorrect(null)
    setQuizComplete(false)
  }, [])

  // Sim logic
  const startSim = useCallback((scenario: typeof simScenarios[0]) => {
    setSimScenario(scenario)
    setSimMessages(scenario.messages)
    setSimStep(0)
  }, [])

  const simRespond = useCallback((responseIndex: number) => {
    if (!simScenario) return
    const response = simScenario.responses[responseIndex]
    const newMsgs: SimMessage[] = [
      { role: 'user', text: response.text },
      ...response.next,
    ]
    setSimMessages(prev => [...prev, ...newMsgs])
    setSimStep(s => s + 1)
  }, [simScenario])

  // Checklist logic
  const toggleCheck = useCallback((id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }, [])
  const completedChecks = checklist.filter(c => c.done).length

  // Yami check logic 窶・enhanced scoring
  const analyzeYami = useCallback(() => {
    if (!yamiInput.trim()) return
    const text = yamiInput.toLowerCase()

    // Match against keyword groups (deduplicate by group)
    const matchedGroups: { words: string[]; matchedWord: string; level: 'critical' | 'warning' | 'suspicious'; category: string; weight: number }[] = []
    const seenCategories = new Set<string>()

    for (const group of dangerKeywordGroups) {
      for (const word of group.words) {
        if (text.includes(word.toLowerCase())) {
          const catKey = group.category + '|' + group.level
          if (!seenCategories.has(catKey)) {
            seenCategories.add(catKey)
            matchedGroups.push({ ...group, matchedWord: word })
          }
          break // one match per group is enough
        }
      }
    }

    // Base score from weights
    let rawScore = matchedGroups.reduce((sum, g) => sum + g.weight, 0)

    // 笏笏 Combo bonuses (multiple risk signals = exponentially more dangerous) 笏笏
    const matchedCats = new Set(matchedGroups.map(g => g.category))
    const hasCrimeTool = matchedGroups.some(g => ['髣・ヰ繧､繝茨ｼ亥女縺大ｭ撰ｼ・, '髣・ヰ繧､繝茨ｼ亥・縺怜ｭ撰ｼ・, '髣倥ヰ繧､繝茨ｼ域寺縺大ｭ撰ｼ・, '蜿励￠蟄・, '蜿励￠蟄・蜃ｺ縺怜ｭ・, '蜿｣蠎ｧ隧先ｬｺ', '迥ｯ鄂ｪ蜉諡・, '迥ｯ鄂ｪ繝・・繝ｫ', '蠑ｷ逶暦ｼ磯裸繝舌う繝育畑隱橸ｼ・, '髣・ヰ繧､繝・].includes(g.category))
    const hasHighPay = matchedGroups.some(g => g.category.includes('鬮倬｡榊ｱ驟ｬ') || g.category.includes('蜊ｳ驥・))
    const hasEasy = matchedGroups.some(g => g.category.includes('邁｡蜊・))
    const hasAnon = matchedGroups.some(g => g.category.includes('蛹ｿ蜷・) || g.category.includes('蜿｣豁｢繧・))
    const hasIdRequest = matchedGroups.some(g => g.category.includes('蛟倶ｺｺ諠・ｱ謳ｾ蜿・))
    const hasUrgency = matchedGroups.some(g => g.category.includes('辟ｦ繧峨○'))

    // "鬮倬｡・ﾃ・邁｡蜊・ﾃ・蛹ｿ蜷・ triple = classic yami-baito pattern
    if (hasHighPay && hasEasy && hasAnon) rawScore += 25
    // "鬮倬｡・ﾃ・邁｡蜊・ = very suspicious
    else if (hasHighPay && hasEasy) rawScore += 15
    // Crime tool + any other signal
    if (hasCrimeTool && (hasHighPay || hasIdRequest)) rawScore += 20
    // ID request + high pay = likely extortion trap
    if (hasIdRequest && hasHighPay) rawScore += 15
    // Urgency amplifier
    if (hasUrgency && matchedGroups.length >= 2) rawScore += 10

    // Normalize to 0-100
    const score = Math.min(100, Math.round(rawScore * 100 / 120))

    // Convert matched groups to flat found array for display
    const found = matchedGroups.map(g => ({
      word: g.matchedWord,
      level: g.level,
      category: g.category,
      weight: g.weight,
    }))

    // Detailed analysis
    let analysis = ''
    const details: string[] = []

    if (score >= 80) {
      analysis = '圷 讌ｵ繧√※蜊ｱ髯ｺ 窶・髣・ヰ繧､繝医・隧先ｬｺ縺ｮ蜿ｯ閭ｽ諤ｧ縺碁撼蟶ｸ縺ｫ鬮倥＞縺ｧ縺吶・n邨ｶ蟇ｾ縺ｫ蠢懷供縺励↑縺・〒縺上□縺輔＞縲４NS縺ｮ騾壼ｱ讖溯・縺ｧ蝣ｱ蜻翫☆繧九％縺ｨ繧貞ｼｷ縺上♀縺吶☆繧√＠縺ｾ縺吶・
      if (hasCrimeTool) details.push('竊・迥ｯ鄂ｪ縺ｮ螳溯｡悟ｽｹ縺ｫ縺輔ｌ繧句庄閭ｽ諤ｧ縺後≠繧翫∪縺呻ｼ磯ｮ謐輔・螳溷・縺ｮ繝ｪ繧ｹ繧ｯ・・)
      if (hasIdRequest) details.push('竊・霄ｫ蛻・ｨｼ繧帝√ｋ縺ｨ閼・ｿｫ譚先侭縺ｫ縺輔ｌ縲∵栢縺代ｉ繧後↑縺上↑繧翫∪縺・)
    } else if (score >= 60) {
      analysis = '笞・・縺九↑繧雁些髯ｺ 窶・隧先ｬｺ繝ｻ髣・ヰ繧､繝医・迚ｹ蠕ｴ縺瑚､・焚隕九ｉ繧後∪縺吶・n縺薙・繧医≧縺ｪ蜍滄寔縺ｫ縺ｯ邨ｶ蟇ｾ縺ｫ蠢懊§縺ｪ縺・〒縺上□縺輔＞縲・
      if (hasHighPay && hasEasy) details.push('竊・縲碁ｫ倬｡阪催励檎ｰ｡蜊倥阪・邨・∩蜷医ｏ縺帙・髣・ヰ繧､繝医・蜈ｸ蝙九ヱ繧ｿ繝ｼ繝ｳ')
    } else if (score >= 40) {
      analysis = '噺 隕∵ｳｨ諢・窶・隍・焚縺ｮ諤ｪ縺励＞繧ｭ繝ｼ繝ｯ繝ｼ繝峨′讀懷・縺輔ｌ縺ｾ縺励◆縲・n螳牙・縺ｪ莉穂ｺ九°縺ｩ縺・°縲∵・驥阪↓遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・
    } else if (score >= 20) {
      analysis = '蛤 繧・ｄ豕ｨ諢・窶・荳驛ｨ豌励↓縺ｪ繧九く繝ｼ繝ｯ繝ｼ繝峨′縺ゅｊ縺ｾ縺吶・n莨夂､ｾ蜷阪・謇蝨ｨ蝨ｰ繝ｻ莠区･ｭ蜀・ｮｹ繧貞ｿ・★遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・
    } else if (matchedGroups.length > 0) {
      analysis = '泯 霆ｽ蠕ｮ縺ｪ豕ｨ諢冗せ縺ゅｊ 窶・逶ｴ縺｡縺ｫ蜊ｱ髯ｺ縺ｨ縺ｯ險縺医∪縺帙ｓ縺後∵ｳｨ諢上・蠢・ｦ√〒縺吶・
    } else {
      analysis = '泙 譏守｢ｺ縺ｪ蜊ｱ髯ｺ繧ｭ繝ｼ繝ｯ繝ｼ繝峨・讀懷・縺輔ｌ縺ｾ縺帙ｓ縺ｧ縺励◆縲・n縺溘□縺励√ユ繧ｭ繧ｹ繝亥・譫舌□縺代〒縺ｯ蛻､譁ｭ縺ｧ縺阪↑縺・こ繝ｼ繧ｹ繧ゅ≠繧翫∪縺吶・n\n庁 隕句・縺代ｋ繝昴う繝ｳ繝・\n繝ｻ莨夂､ｾ蜷・謇蝨ｨ蝨ｰ縺梧・險倥＆繧後※縺・ｋ縺欺n繝ｻ莉穂ｺ句・螳ｹ縺悟・菴鍋噪縺欺n繝ｻ蝣ｱ驟ｬ縺檎嶌蝣ｴ縺ｨ豈斐∋縺ｦ鬮倥☆縺弱↑縺・°\n繝ｻ縲碁ｫ倬｡催礼ｰ｡蜊佚怜諺蜷阪阪・3隕∫ｴ縺梧純縺｣縺ｦ縺・↑縺・°'
    }

    if (details.length > 0) {
      analysis += '\n\n' + details.join('\n')
    }

    setYamiResult({ score, found, analysis })
  }, [yamiInput])

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">孱・・/div>
          <h1 className="text-2xl font-bold">AI隧先ｬｺ繝・ぅ繝輔ぉ繝ｳ繝繝ｼ</h1>
          <p className="text-gray-400 mt-1">隧先ｬｺ繝｡繝ｼ繝ｫ蛻､螳・ﾃ・髣・ヰ繧､繝亥愛螳・ﾃ・隧先ｬｺ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ ﾃ・螳ｶ譌剰ｦ句ｮ医ｊ</p>
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
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* 笏笏笏 Quiz Tab 笏笏笏 */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">剥 隧先ｬｺ繝代ち繝ｼ繝ｳ讀懃衍繧ｯ繧､繧ｺ</h2>
            {!quizComplete ? (
              <>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>蝠城｡・{quizIndex + 1} / {quizQuestions.length}</span>
                  <span>繧ｹ繧ｳ繧｢: {quizScore}/{quizIndex + (quizAnswered ? 1 : 0)}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${((quizIndex + (quizAnswered ? 1 : 0)) / quizQuestions.length) * 100}%` }} />
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <div className="flex gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${currentQ.difficulty === '蛻晉ｴ・ ? 'bg-green-500/20 text-green-400' : currentQ.difficulty === '荳ｭ邏・ ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{currentQ.difficulty}</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-400">{currentQ.category}</span>
                  </div>
                  <p className="text-lg leading-relaxed mb-6">{currentQ.scenario}</p>
                  {!quizAnswered ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => answerQuiz(true)} className="py-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-xl font-bold text-lg transition-colors">圷 隧先ｬｺ縺・・/button>
                      <button onClick={() => answerQuiz(false)} className="py-4 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 rounded-xl font-bold text-lg transition-colors">笨・螳牙・</button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl ${quizCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      <p className="font-bold text-lg mb-2">{quizCorrect ? '脂 豁｣隗｣・・ : '笶・荳肴ｭ｣隗｣窶ｦ'}</p>
                      <p className="text-sm text-gray-300">{currentQ.explanation}</p>
                      <button onClick={nextQuiz} className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors">
                        {quizIndex + 1 >= quizQuestions.length ? '邨先棡繧定ｦ九ｋ' : '谺｡縺ｮ蝠城｡・竊・}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-[#13131e] rounded-xl border border-amber-500/30 p-8 text-center">
                <div className="text-6xl mb-4">{quizScore >= 8 ? '醇' : quizScore >= 5 ? '総' : '答'}</div>
                <div className="text-4xl font-bold text-amber-400 mb-2">{quizScore} / {quizQuestions.length}</div>
                <p className="text-gray-400 mb-2">豁｣隗｣邇・ {Math.round(quizScore / quizQuestions.length * 100)}%</p>
                <p className="text-lg mb-6">
                  {quizScore >= 8 ? '邏譎ｴ繧峨＠縺・ｼ∬ｩ先ｬｺ繧定ｦ区栢縺丞鴨縺碁ｫ倥＞縺ｧ縺吶・ :
                   quizScore >= 5 ? '縺ｾ縺壹∪縺壹り協謇九↑繝代ち繝ｼ繝ｳ繧貞ｾｩ鄙偵＠縺ｾ縺励ｇ縺・・ :
                   '隕∵ｳｨ諢擾ｼ∬ｩ先ｬｺ謇句哨繝・・繧ｿ繝吶・繧ｹ縺ｧ蟄ｦ鄙偵ｒ縺翫☆縺吶ａ縺励∪縺吶・}
                </p>
                <button onClick={resetQuiz} className="px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-bold transition-colors">繧ゅ≧荳蠎ｦ謖第姶</button>
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Sim Tab 笏笏笏 */}
        {activeTab === 'sim' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">到 隧先ｬｺ髮ｻ隧ｱ繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</h2>
            {!simScenario ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {simScenarios.map(s => (
                  <button
                    key={s.id}
                    onClick={() => startSim(s)}
                    className="bg-[#13131e] rounded-xl border border-gray-800 p-6 text-left hover:border-amber-500/50 transition-colors"
                  >
                    <div className="text-4xl mb-3">{s.icon}</div>
                    <h3 className="font-bold text-lg">{s.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">繧ｯ繝ｪ繝・け縺励※邱ｴ鄙帝幕蟋・/p>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 min-h-[400px] space-y-3">
                  {simMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === 'scammer' ? 'bg-red-500/20 text-red-200 rounded-bl-none' :
                        msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' :
                        'bg-amber-500/10 text-amber-200 rounded-bl-none border border-amber-500/30'
                      }`}>
                        <div className="text-xs mb-1 opacity-60">
                          {msg.role === 'scammer' ? '側 隧先ｬｺ迥ｯ' : msg.role === 'user' ? '刹 縺ゅ↑縺・ : '孱・・繧ｳ繝ｼ繝・}
                        </div>
                        <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                      </div>
                    </div>
                  ))}
                </div>
                {simStep === 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">縺ゅ↑縺溘・蟇ｾ蠢懊ｒ驕ｸ繧薙〒縺上□縺輔＞・・/p>
                    {simScenario.responses.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => simRespond(i)}
                        className="w-full text-left p-4 bg-[#1a1a2e] hover:bg-[#252540] border border-gray-700 rounded-xl text-sm transition-colors"
                      >
                        {r.text}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => { setSimScenario(null); setSimMessages([]); setSimStep(0) }} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                  竊・繧ｷ繝翫Μ繧ｪ驕ｸ謚槭↓謌ｻ繧・                </button>
              </>
            )}
          </div>
        )}

        {/* 笏笏笏 Checklist Tab 笏笏笏 */}
        {activeTab === 'checklist' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">笨・螳ｶ譌剰ｦ句ｮ医ｊ繧ｻ繧ｭ繝･繝ｪ繝・ぅ繝√ぉ繝・け</h2>
              <span className="text-sm text-gray-400">{completedChecks}/{checklist.length} 螳御ｺ・/span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div className="bg-gradient-to-r from-amber-500 to-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(completedChecks / checklist.length) * 100}%` }} />
            </div>
            <p className="text-sm text-gray-400">谺｡縺ｮ蟶ｰ逵∵凾縺ｫ縲∬ｦｪ蠕｡縺輔ｓ縺ｨ荳邱偵↓繝√ぉ繝・け縺励∪縺励ｇ縺・捉窶昨汨ｩ窶昨汨ｦ</p>

            {['繧ｹ繝槭・險ｭ螳・, '繧｢繧ｫ繧ｦ繝ｳ繝・, 'SNS', '繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ', '繝｡繝ｼ繝ｫ', '驥題檮'].map(category => {
              const items = checklist.filter(c => c.category === category)
              if (items.length === 0) return null
              return (
                <div key={category}>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h3>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          item.done ? 'bg-green-500/10 border-green-500/30' : 'bg-[#13131e] border-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                          {item.done && <span className="text-xs text-white">笨・/span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${item.done ? 'line-through text-gray-500' : ''}`}>{item.label}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${item.priority === '蠢・・ ? 'bg-red-500/20 text-red-400' : item.priority === '謗ｨ螂ｨ' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-700 text-gray-500'}`}>{item.priority}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 笏笏笏 Database Tab 笏笏笏 */}
        {activeTab === 'database' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">投 譛譁ｰ隧先ｬｺ謇句哨繝・・繧ｿ繝吶・繧ｹ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scamPatterns.map(pattern => (
                <div key={pattern.id} className="bg-[#13131e] rounded-xl border border-gray-800 p-5 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{pattern.name}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-400">{pattern.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{pattern.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-red-400 font-bold mb-1">圷 蜊ｱ髯ｺ繧ｭ繝ｼ繝ｯ繝ｼ繝・</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.keywords.map((kw, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    {pattern.examples.map((ex, i) => (
                      <p key={i}>町 {ex}</p>
                    ))}
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-2 text-xs text-green-400">
                    孱・・{pattern.prevention}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">腸 {pattern.damage}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 笏笏笏 Emergency Tab 笏笏笏 */}
        {activeTab === 'emergency' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">圷 邱頑･騾壼ｱ繧ｬ繧､繝・/h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-red-400 mb-4">隧先ｬｺ陲ｫ螳ｳ縺ｫ驕ｭ縺｣縺溘・驕ｭ縺・◎縺・↑蝣ｴ蜷・/p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#13131e] rounded-xl p-4">
                  <div className="text-3xl mb-2">属</div>
                  <p className="font-bold text-lg">隴ｦ蟇溽嶌隲・/p>
                  <p className="text-3xl font-bold text-amber-400 mt-2">#9110</p>
                  <p className="text-xs text-gray-500 mt-1">邱頑･縺ｧ縺ｪ縺・嶌隲・/p>
                </div>
                <div className="bg-[#13131e] rounded-xl p-4">
                  <div className="text-3xl mb-2">囈</div>
                  <p className="font-bold text-lg">邱頑･騾壼ｱ</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">110</p>
                  <p className="text-xs text-gray-500 mt-1">莉翫∪縺輔↓陲ｫ螳ｳ逋ｺ逕滉ｸｭ</p>
                </div>
                <div className="bg-[#13131e] rounded-xl p-4">
                  <div className="text-3xl mb-2">到</div>
                  <p className="font-bold text-lg">豸郁ｲｻ閠・・繝・ヨ繝ｩ繧､繝ｳ</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">188</p>
                  <p className="text-xs text-gray-500 mt-1">豸郁ｲｻ閠・ヨ繝ｩ繝悶Ν蜈ｨ闊ｬ</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">蟇ｾ蜃ｦ繧ｹ繝・ャ繝・/h3>
              {emergencySteps.map(step => (
                <div key={step.step} className="flex items-start gap-4 bg-[#13131e] rounded-xl border border-gray-800 p-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Step {step.step}: {step.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 笏笏笏 Yami Check Tab 笏笏笏 */}
        {activeTab === 'yamicheck' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">笞・・髣・ヰ繧､繝亥愛螳壹メ繧ｧ繝・き繝ｼ</h2>
            <p className="text-sm text-gray-400">SNS繧・Γ繝・そ繝ｼ繧ｸ縺ｧ隕九°縺代◆繝舌う繝亥供髮・枚繧定ｲｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞縲ょ些髯ｺ蠎ｦ繧但I縺悟愛螳壹＠縺ｾ縺吶・/p>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <textarea
                placeholder="縺薙％縺ｫ繝舌う繝亥供髮・枚繧定ｲｼ繧贋ｻ倥￠...&#10;&#10;萓・ 縲碁ｫ伜庶蜈･繝舌う繝茨ｼ∵律邨ｦ5荳・懶ｼ∬差迚ｩ繧貞女縺大叙縺｣縺ｦ螻翫￠繧九□縺托ｼ・擇謗･縺ｪ縺怜叉譌･OK縲・
                value={yamiInput}
                onChange={e => setYamiInput(e.target.value)}
                rows={6}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
              />
              <button onClick={analyzeYami} className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors">
                剥 蜊ｱ髯ｺ蠎ｦ繧貞愛螳壹☆繧・              </button>
            </div>

            {yamiResult && (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${
                  yamiResult.score >= 80 ? 'border-red-500/50' :
                  yamiResult.score >= 50 ? 'border-amber-500/50' :
                  yamiResult.score >= 20 ? 'border-yellow-500/50' :
                  'border-green-500/50'
                }`}>
                  <div className="text-sm text-gray-400 mb-2">蜊ｱ髯ｺ蠎ｦ繧ｹ繧ｳ繧｢</div>
                  <div className={`text-6xl font-bold ${
                    yamiResult.score >= 80 ? 'text-red-500' :
                    yamiResult.score >= 50 ? 'text-amber-500' :
                    yamiResult.score >= 20 ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {yamiResult.score}%
                  </div>
                  <pre className="text-sm mt-4 whitespace-pre-wrap font-sans text-left max-w-lg mx-auto">{yamiResult.analysis}</pre>
                </div>

                {yamiResult.found.length > 0 && (
                  <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                    <h3 className="font-bold mb-3">讀懷・縺輔ｌ縺溷些髯ｺ繧ｭ繝ｼ繝ｯ繝ｼ繝・</h3>
                    <div className="space-y-2">
                      {yamiResult.found.map((kw, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            kw.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                            kw.level === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {kw.level === 'critical' ? '圷 蜊ｱ髯ｺ' : kw.level === 'warning' ? '笞・・豕ｨ諢・ : '噺 隕∫｢ｺ隱・}
                          </span>
                          <span className="text-sm font-mono text-red-300">縲鶏kw.word}縲・/span>
                          <span className="text-xs text-gray-500">竊・{kw.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Mail Check Tab 笏笏笏 */}
        {activeTab === 'mailcheck' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">透 隧先ｬｺ繝｡繝ｼ繝ｫ蛻､螳・/h2>
            <p className="text-sm text-gray-400">螻翫＞縺溘Γ繝ｼ繝ｫ縺ｮ蜀・ｮｹ繧定ｲｼ繧贋ｻ倥￠縺ｦ縲、I縺ｫ隧先ｬｺ縺九←縺・°蛻､螳壹＠縺ｦ繧ゅｉ縺・∪縺励ｇ縺・ゅ・繝ｭ繝ｳ繝励ヨ繧定・蜍慕函謌絶・螟夜ΚAI縺ｫ繧ｳ繝斐・縺吶ｋ縺縺代・/p>

            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">鐙 騾∽ｿ｡蜈・Γ繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ</label>
                  <input
                    type="text"
                    placeholder="萓・ support@amaz0n-security.xyz"
                    value={mailSender}
                    onChange={e => setMailSender(e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">搭 莉ｶ蜷・/label>
                  <input
                    type="text"
                    placeholder="萓・ 縲宣㍾隕√代い繧ｫ繧ｦ繝ｳ繝亥●豁｢縺ｮ縺顔衍繧峨○"
                    value={mailSubject}
                    onChange={e => setMailSubject(e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">笨会ｸ・繝｡繝ｼ繝ｫ譛ｬ譁・/label>
                <textarea
                  placeholder={"縺薙％縺ｫ繝｡繝ｼ繝ｫ譛ｬ譁・ｒ雋ｼ繧贋ｻ倥￠...\n\n萓・ 縲後♀螳｢讒倥・繧｢繧ｫ繧ｦ繝ｳ繝医↓逡ｰ蟶ｸ縺ｪ繝ｭ繧ｰ繧､繝ｳ縺梧､懷・縺輔ｌ縺ｾ縺励◆縲・4譎る俣莉･蜀・↓縺薙■繧峨・繝ｪ繝ｳ繧ｯ縺九ｉ遒ｺ隱阪＠縺ｦ縺上□縺輔＞...縲・}
                  value={mailInput}
                  onChange={e => setMailInput(e.target.value)}
                  rows={8}
                  className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={copyMailPrompt}
                disabled={mailInput.trim().length === 0}
                className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                  mailInput.trim().length === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : mailCopied
                      ? 'bg-green-600 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                {mailCopied ? '笨・繧ｳ繝斐・縺励∪縺励◆・・竊・荳九・AI縺ｫ雋ｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞' : '搭 繝励Ο繝ｳ繝励ヨ繧偵さ繝斐・'}
              </button>

              {mailInput.trim().length > 0 && (
                <details className="text-xs">
                  <summary className="text-gray-500 cursor-pointer hover:text-gray-300">逕滓・縺輔ｌ縺溘・繝ｭ繝ｳ繝励ヨ繧堤｢ｺ隱・笆ｼ</summary>
                  <pre className="mt-2 text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto font-sans bg-[#1a1a2e] rounded-lg p-3 border border-gray-700">{buildMailPrompt()}</pre>
                </details>
              )}
            </div>

            {/* 螟夜ΚAI繝ｪ繝ｳ繧ｯ 窶・蟶ｸ縺ｫ陦ｨ遉ｺ */}
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-2">､・AI縺ｧ蛻､螳壹☆繧・/h3>
              <p className="text-xs text-gray-500 mb-4">荳翫・繝輔か繝ｼ繝縺ｫ蜈･蜉・竊・繝励Ο繝ｳ繝励ヨ繧偵さ繝斐・ 竊・荳九・AI縺ｫ雋ｼ繧贋ｻ倥￠繧九□縺代ら┌譁吶〒菴ｿ縺医∪縺吶・/p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors">
                  <span className="text-2xl">虫</span>
                  <div>
                    <div className="font-bold text-sm">Gemini</div>
                    <div className="text-xs text-gray-400">Google AI 窶・辟｡譁・/div>
                  </div>
                </a>
                <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors">
                  <span className="text-2xl">泙</span>
                  <div>
                    <div className="font-bold text-sm">ChatGPT</div>
                    <div className="text-xs text-gray-400">OpenAI 窶・辟｡譁・/div>
                  </div>
                </a>
                <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-orange-600/20 border border-orange-500/30 rounded-lg hover:bg-orange-600/30 transition-colors">
                  <span className="text-2xl">泛</span>
                  <div>
                    <div className="font-bold text-sm">Claude</div>
                    <div className="text-xs text-gray-400">Anthropic 窶・辟｡譁・/div>
                  </div>
                </a>
              </div>
            </div>

            {/* 豕ｨ諢丈ｺ矩・窶・蟶ｸ縺ｫ陦ｨ遉ｺ */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h4 className="font-bold text-amber-400 text-sm mb-2">笞・・縺疲ｳｨ諢・/h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>繝ｻ繝｡繝ｼ繝ｫ蜀・・繝ｪ繝ｳ繧ｯ縺ｯ<strong className="text-amber-300">邨ｶ蟇ｾ縺ｫ繧ｯ繝ｪ繝・け縺励↑縺・〒</strong>縺上□縺輔＞</li>
                <li>繝ｻAI蛻､螳壹・蜿り・ュ蝣ｱ縺ｧ縺吶ら｢ｺ螳溘↓隧先ｬｺ縺ｨ蛻・°縺｣縺溷ｴ蜷医・隴ｦ蟇滂ｼ・9110・峨∈逶ｸ隲・ｒ</li>
                <li>繝ｻ蛟倶ｺｺ諠・ｱ・医ヱ繧ｹ繝ｯ繝ｼ繝臥ｭ会ｼ峨・繝｡繝ｼ繝ｫ蜀・ｮｹ縺ｫ蜷ｫ繧√◆縺ｾ縺ｾ雋ｼ繧贋ｻ倥￠縺ｪ縺・〒縺上□縺輔＞</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    
      </div>
  )
}




