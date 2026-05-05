'use client'


import { useState, useCallback, useEffect } from 'react'

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
interface AreaScore {
  total: number
  categories: { name: string; score: number; icon: string; desc: string }[]
  level: string
  advice: string[]
}

interface NoiseResult {
  score: number
  level: string
  factors: { name: string; impact: string; detail: string }[]
  tips: string[]
}

// 笏笏笏 Data 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const checklistCategories = [
  {
    name: '召 蟒ｺ迚ｩ縺ｮ螟冶ｦｳ', items: [
      { id: 'c1', text: '螟門｣√↓縺ｲ縺ｳ蜑ｲ繧後ｄ蝪苓｣・・蜑･縺後ｌ縺後↑縺・°', priority: '蠢・・ },
      { id: 'c2', text: '繧ｨ繝ｳ繝医Λ繝ｳ繧ｹ縺ｮ繧ｪ繝ｼ繝医Ο繝・け繝ｻ髦ｲ迥ｯ繧ｫ繝｡繝ｩ縺ｮ譛臥┌', priority: '蠢・・ },
      { id: 'c3', text: '蜈ｱ逕ｨ蟒贋ｸ九・髫取ｮｵ縺ｮ辣ｧ譏弱′蛻・ｌ縺ｦ縺・↑縺・°', priority: '謗ｨ螂ｨ' },
      { id: 'c4', text: '繧ｴ繝滓昏縺ｦ蝣ｴ縺梧紛逅・＆繧後※縺・ｋ縺具ｼ井ｽ乗ｰ代・繝｢繝ｩ繝ｫ縺悟・縺九ｋ・・, priority: '蠢・・ },
      { id: 'c5', text: '鬧占ｼｪ蝣ｴ繝ｻ鬧占ｻ雁ｴ縺梧紛鬆薙＆繧後※縺・ｋ縺・, priority: '謗ｨ螂ｨ' },
    ],
  },
  {
    name: '搭 謗ｲ遉ｺ譚ｿ繝ｻ邂｡逅・, items: [
      { id: 'c6', text: '謗ｲ遉ｺ譚ｿ縺ｫ縲碁ｨ帝浹豕ｨ諢上阪後ざ繝溷・縺励Ν繝ｼ繝ｫ縲阪・蠑ｵ繧顔ｴ吶′螟壹☆縺弱↑縺・°', priority: '蠢・・ },
      { id: 'c7', text: '邂｡逅・ｼ夂､ｾ繝ｻ邂｡逅・ｺｺ縺ｮ騾｣邨｡蜈医′謗ｲ遉ｺ縺輔ｌ縺ｦ縺・ｋ縺・, priority: '謗ｨ螂ｨ' },
      { id: 'c8', text: '邂｡逅・ｺｺ蟶ｸ鬧舌°縲∝ｷ｡蝗槭°縲∫┌莠ｺ縺・, priority: '謗ｨ螂ｨ' },
      { id: 'c9', text: '螳・・繝懊ャ繧ｯ繧ｹ縺ｮ譛臥┌縺ｨ謨ｰ', priority: '莉ｻ諢・ },
    ],
  },
  {
    name: '矧 鬨帝浹迺ｰ蠅・, items: [
      { id: 'c10', text: '蟷ｹ邱夐％霍ｯ繝ｻ邱夊ｷｯ繝ｻ鬮倬滄％霍ｯ縺瑚ｿ代￥縺ｫ縺ｪ縺・°', priority: '蠢・・ },
      { id: 'c11', text: '鬟ｲ鬟溷ｺ励・繧ｫ繝ｩ繧ｪ繧ｱ繝ｻ繝代メ繝ｳ繧ｳ蠎励′霑代￥縺ｫ縺ｪ縺・°', priority: '蠢・・ },
      { id: 'c12', text: '蟾･蝣ｴ繝ｻ蟾･莠狗樟蝣ｴ縺瑚ｿ代￥縺ｫ縺ｪ縺・°', priority: '謗ｨ螂ｨ' },
      { id: 'c13', text: '蟄ｦ譬｡繝ｻ蟷ｼ遞壼恍繝ｻ蜈ｬ蝨偵′霑代￥縺ｫ縺ゅｋ縺具ｼ亥ｭ蝉ｾ帙・螢ｰ・・, priority: '莉ｻ諢・ },
      { id: 'c14', text: '譖懈律繝ｻ譎る俣蟶ｯ繧貞､峨∴縺ｦ隍・焚蝗槫・隕九＠縺溘°', priority: '蠢・・ },
    ],
  },
  {
    name: '匠 螳､蜀・メ繧ｧ繝・け', items: [
      { id: 'c15', text: '螢√ｒ蜿ｩ縺・※髫｣螳､縺ｨ縺ｮ驕ｮ髻ｳ諤ｧ繧堤｢ｺ隱阪＠縺溘°', priority: '蠢・・ },
      { id: 'c16', text: '荳企嚴縺ｮ雜ｳ髻ｳ縺瑚◇縺薙∴繧九°遒ｺ隱阪＠縺溘°', priority: '蠢・・ },
      { id: 'c17', text: '豌ｴ蝗槭ｊ・医く繝・メ繝ｳ繝ｻ鬚ｨ蜻ゅ・繝医う繝ｬ・峨・豌ｴ蝨ｧ繧堤｢ｺ隱阪＠縺溘°', priority: '謗ｨ螂ｨ' },
      { id: 'c18', text: '遯薙・邨宣愆霍｡繝ｻ繧ｫ繝薙′縺ｪ縺・°', priority: '謗ｨ螂ｨ' },
      { id: 'c19', text: '謳ｺ蟶ｯ髮ｻ隧ｱ縺ｮ髮ｻ豕｢縺悟・繧九°', priority: '謗ｨ螂ｨ' },
      { id: 'c20', text: '繧ｳ繝ｳ繧ｻ繝ｳ繝医・謨ｰ繝ｻ菴咲ｽｮ繧堤｢ｺ隱阪＠縺溘°', priority: '莉ｻ諢・ },
    ],
  },
  {
    name: '桃 蜻ｨ霎ｺ迺ｰ蠅・, items: [
      { id: 'c21', text: '繧ｹ繝ｼ繝代・繝ｻ繧ｳ繝ｳ繝薙ル縺ｮ霍晞屬縺ｨ蝟ｶ讌ｭ譎る俣', priority: '謗ｨ螂ｨ' },
      { id: 'c22', text: '譛蟇・ｊ鬧・∪縺ｧ縺ｮ螳滄圀縺ｮ蠕呈ｭｩ譎る俣・井ｸ榊虚逕｣陦ｨ險倥・菫｡蜿ｷ辟｡隕厄ｼ・, priority: '蠢・・ },
      { id: 'c23', text: '螟憺％縺ｮ譏弱ｋ縺輔・莠ｺ騾壹ｊ・亥､懊↓迴ｾ蝨ｰ繧呈ｭｩ縺・◆縺具ｼ・, priority: '蠢・・ },
      { id: 'c24', text: '逞・劼繝ｻ繧ｯ繝ｪ繝九ャ繧ｯ縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ', priority: '謗ｨ螂ｨ' },
      { id: 'c25', text: '繝上じ繝ｼ繝峨・繝・・縺ｧ豢ｪ豌ｴ繝ｻ蝨溽ら⊃螳ｳ繝ｪ繧ｹ繧ｯ繧堤｢ｺ隱阪＠縺溘°', priority: '蠢・・ },
    ],
  },
  {
    name: '塘 螂醍ｴ・・邂｡逅・ｼ夂､ｾ', items: [
      { id: 'c26', text: '騾蜴ｻ譎ゅ・蜴溽憾蝗槫ｾｩ雋ｻ逕ｨ縺ｮ譚｡莉ｶ繧堤｢ｺ隱阪＠縺溘°', priority: '蠢・・ },
      { id: 'c27', text: '譖ｴ譁ｰ譁吶・譖ｴ譁ｰ莠句漁謇区焚譁吶・驥鷹｡・, priority: '謗ｨ螂ｨ' },
      { id: 'c28', text: '邂｡逅・ｼ夂､ｾ縺ｮ蜿｣繧ｳ繝溘・隧募愛繧定ｪｿ縺ｹ縺溘°', priority: '謗ｨ螂ｨ' },
      { id: 'c29', text: '繝医Λ繝悶Ν譎ゅ・蟇ｾ蠢懊ヵ繝ｭ繝ｼ・磯崕隧ｱ・溘Γ繝ｼ繝ｫ・・4譎る俣・滂ｼ・, priority: '謗ｨ螂ｨ' },
      { id: 'c30', text: '迚ｹ邏・ｺ矩・ｼ域･ｽ蝎ｨ荳榊庄繝ｻ繝壹ャ繝井ｸ榊庄遲会ｼ峨ｒ遒ｺ隱阪＠縺溘°', priority: '蠢・・ },
    ],
  },
]

const troubleTemplates = [
  {
    id: 'noise',
    icon: '矧',
    title: '鬨帝浹繝医Λ繝悶Ν',
    desc: '髫｣莠ｺ縺ｮ髻ｳ讌ｽ繝ｻ雜ｳ髻ｳ繝ｻ逕滓ｴｻ髻ｳ',
    steps: [
      { step: '竭險倬鹸', action: '譌･譎ゅ・髻ｳ縺ｮ遞ｮ鬘槭・邯咏ｶ壽凾髢薙ｒ繧ｹ繝槭・縺ｮ繝｡繝｢繧・・繧､繧ｹ繝ｬ繧ｳ繝ｼ繝繝ｼ縺ｧ險倬鹸縲よ怙菴・騾ｱ髢灘・', detail: '縲娯雷譛遺雷譌･ 23:15縲・:30 荳企嚴縺九ｉ驥堺ｽ朱浹縺ｮ髻ｳ讌ｽ縲阪・繧医≧縺ｫ蜈ｷ菴鍋噪縺ｫ' },
      { step: '竭｡邂｡逅・ｼ夂､ｾ縺ｫ騾｣邨｡', action: '險倬鹸繧偵ｂ縺ｨ縺ｫ邂｡逅・ｼ夂､ｾ縺ｸ譖ｸ髱｢・医Γ繝ｼ繝ｫ・峨〒騾｣邨｡', detail: '髮ｻ隧ｱ縺縺ｨ險倬鹸縺梧ｮ九ｉ縺ｪ縺・ょｿ・★繝｡繝ｼ繝ｫ縺祈AX縺ｧ縲ゅユ繝ｳ繝励Ξ繝ｼ繝遺・' },
      { step: '竭｢蜀・ｮｹ險ｼ譏朱Ψ萓ｿ', action: '謾ｹ蝟・＆繧後↑縺・ｴ蜷医∫嶌謇区婿縺ｫ蜀・ｮｹ險ｼ譏弱ｒ騾∽ｻ・, detail: '豕輔ユ繝ｩ繧ｹ(0570-078374)縺ｧ譁・擇縺ｮ逶ｸ隲・庄縲りｲｻ逕ｨ縺ｯ邏・,500蜀・ },
      { step: '竭｣豌台ｺ玖ｪｿ蛛・, action: '邁｡譏楢｣∝愛謇縺ｫ隱ｿ蛛懊ｒ逕ｳ縺礼ｫ九※', detail: '雋ｻ逕ｨ縺ｯ謨ｰ蜊・・縲ょｼ∬ｭｷ螢ｫ荳崎ｦ√りｪｿ蛛懷ｧ泌藤縺碁俣縺ｫ蜈･縺｣縺ｦ縺上ｌ繧・ },
    ],
    template: '縲宣ｨ帝浹縺ｫ髢｢縺吶ｋ縺秘｣邨｡縲曾n\n邂｡逅・ｼ夂､ｾ 笳銀雷荳榊虚逕｣ 縺疲球蠖楢・ｧ禄n\n笳銀雷繝槭Φ繧ｷ繝ｧ繝ｳ 笳銀雷笳句捷螳､縺ｮ笳銀雷縺ｧ縺吶・n\n笳区怦笳区律鬆・ｈ繧翫ー荳企嚴/髫｣螳､]縺九ｉ[髻ｳ讌ｽ/雜ｳ髻ｳ/逕滓ｴｻ髻ｳ]縺圭n豺ｱ螟懷ｸｯ・遺雷譎ゅ懌雷譎る・ｼ峨↓邯咏ｶ夂噪縺ｫ逋ｺ逕溘＠縺ｦ縺翫ｊ縺ｾ縺吶・n\n險倬鹸・喀n繝ｻ笳区怦笳区律 笳区凾縲懌雷譎・[蜈ｷ菴鍋噪縺ｪ髻ｳ縺ｮ遞ｮ鬘枉\n繝ｻ笳区怦笳区律 笳区凾縲懌雷譎・[蜈ｷ菴鍋噪縺ｪ髻ｳ縺ｮ遞ｮ鬘枉\n\n譌･蟶ｸ逕滓ｴｻ縺ｫ謾ｯ髫懊ｒ縺阪◆縺励※縺翫ｊ縺ｾ縺吶・縺ｧ縲―n隧ｲ蠖謎ｽ乗虻縺ｸ縺ｮ豕ｨ諢丞繭襍ｷ繧偵♀鬘倥＞縺ｧ縺阪∪縺吶〒縺励ｇ縺・°縲・n\n縺雁ｿ吶＠縺・→縺薙ｍ諱舌ｌ蜈･繧翫∪縺吶′縲―n縺泌ｯｾ蠢懊・縺ｻ縺ｩ繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・n\n笳銀雷笳句捷螳､ 笳銀雷',
  },
  {
    id: 'garbage',
    icon: '卵・・,
    title: '繧ｴ繝溷・縺励ヨ繝ｩ繝悶Ν',
    desc: '蛻・挨驕募渚繝ｻ蜿朱寔譌･辟｡隕・,
    steps: [
      { step: '竭險倬鹸', action: '驕募渚繧ｴ繝溘・蜀咏悄繧呈律譎ゆｻ倥″縺ｧ謦ｮ蠖ｱ', detail: '閾ｪ蛻・′迥ｯ莠ｺ謇ｱ縺・＆繧後↑縺・ｈ縺・∝・逵溘・隍・焚譌･蛻・聴縺｣縺ｦ縺翫￥' },
      { step: '竭｡邂｡逅・ｼ夂､ｾ縺ｫ騾｣邨｡', action: '蜀咏悄繧呈ｷｻ縺医※邂｡逅・ｼ夂､ｾ縺ｫ蝣ｱ蜻・, detail: '蜈ｨ謌ｸ蜷代￠縺ｮ豕ｨ諢丞繭襍ｷ繧剃ｾ晞ｼ' },
      { step: '竭｢閾ｪ豐ｻ菴薙↓逶ｸ隲・, action: '謾ｹ蝟・＠縺ｪ縺・ｴ蜷医∝ｸょ玄逕ｺ譚代・縺斐∩諡・ｽ楢ｪｲ縺ｫ逶ｸ隲・, detail: '謔ｪ雉ｪ縺ｪ蝣ｴ蜷医・陦梧帆謖・ｰ弱・蟇ｾ雎｡縺ｫ縺ｪ繧九％縺ｨ繧・ },
      { step: '竭｣髦ｲ迥ｯ繧ｫ繝｡繝ｩ險ｭ鄂ｮ隕∵悍', action: '邂｡逅・ｵ・粋繧・ｮ｡逅・ｼ夂､ｾ縺ｫ髦ｲ迥ｯ繧ｫ繝｡繝ｩ險ｭ鄂ｮ繧呈署譯・, detail: '雋ｻ逕ｨ縺ｯ邂｡逅・ｲｻ縺九ｉ縺ｮ謾ｯ蜃ｺ繧呈署譯・ },
    ],
    template: '縲舌ざ繝溷・縺励Ν繝ｼ繝ｫ驕募渚縺ｫ縺､縺・※縲曾n\n邂｡逅・ｼ夂､ｾ 笳銀雷荳榊虚逕｣ 縺疲球蠖楢・ｧ禄n\n笳銀雷繝槭Φ繧ｷ繝ｧ繝ｳ 笳銀雷笳句捷螳､縺ｮ笳銀雷縺ｧ縺吶・n\n繧ｴ繝滓昏縺ｦ蝣ｴ縺ｫ縺ｦ縲∝・蛻･縺後＆繧後※縺・↑縺・ざ繝溘ｄ\n蜿朱寔譌･莉･螟悶↓蜃ｺ縺輔ｌ縺溘ざ繝溘′謨｣隕九＆繧後∪縺吶・n\n遒ｺ隱肴律・喀n繝ｻ笳区怦笳区律 [蜈ｷ菴鍋噪縺ｪ迥ｶ豕‐\n繝ｻ笳区怦笳区律 [蜈ｷ菴鍋噪縺ｪ迥ｶ豕‐\n\n陦帷函髱｢縺悟ｿ・・縺ｧ縺吶・縺ｧ縲∝・謌ｸ縺ｸ縺ｮ\n繧ｴ繝溷・縺励Ν繝ｼ繝ｫ縺ｮ蜀榊捉遏･繧偵♀鬘倥＞縺ｧ縺阪∪縺吶〒縺励ｇ縺・°縲・n\n繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・n\n笳銀雷笳句捷螳､ 笳銀雷',
  },
  {
    id: 'parking',
    icon: '囓',
    title: '鬧占ｻ雁ｴ繝ｻ鬧占ｼｪ蝣ｴ繝医Λ繝悶Ν',
    desc: '辟｡譁ｭ鬧占ｻ翫・蝣ｴ謇蜿悶ｊ',
    steps: [
      { step: '竭險倬鹸', action: '繝翫Φ繝舌・繝励Ξ繝ｼ繝医・譌･譎ゅ・蝣ｴ謇繧定ｨ倬鹸', detail: '蜀咏悄繧ょｿ倥ｌ縺壹↓縲る｣譌･邯壹￥蝣ｴ蜷医・險倬鹸縺碁㍾隕・ },
      { step: '竭｡邂｡逅・ｼ夂､ｾ縺ｫ騾｣邨｡', action: '險倬鹸繧偵ｂ縺ｨ縺ｫ邂｡逅・ｼ夂､ｾ縺ｫ蝣ｱ蜻・, detail: '豕ｨ諢乗嶌縺阪・謗ｲ遉ｺ繧・ｩｲ蠖楢ｻ贋ｸ｡縺ｸ縺ｮ隴ｦ蜻翫ｒ萓晞ｼ' },
      { step: '竭｢隴ｦ蟇溘↓逶ｸ隲・, action: '遘∵怏蝨ｰ縺ｮ蝣ｴ蜷医〒繧ゅ・9110・郁ｭｦ蟇溽嶌隲・ｼ峨↓逶ｸ隲・庄', detail: '蜈ｬ驕薙・蝣ｴ蜷医・鬧占ｻ企＆蜿阪→縺励※騾壼ｱ蜿ｯ閭ｽ(110逡ｪ)' },
      { step: '竭｣豕慕噪謇区ｮｵ', action: '髟ｷ譛滄俣謾ｹ蝟・＠縺ｪ縺・ｴ蜷医・蠑∬ｭｷ螢ｫ縺ｫ逶ｸ隲・, detail: '謳榊ｮｳ雉蜆溯ｫ区ｱゅｄ莉ｮ蜃ｦ蛻・・讀懆ｨ・ },
    ],
    template: '縲千┌譁ｭ鬧占ｻ翫↓縺､縺・※縲曾n\n邂｡逅・ｼ夂､ｾ 笳銀雷荳榊虚逕｣ 縺疲球蠖楢・ｧ禄n\n笳銀雷繝槭Φ繧ｷ繝ｧ繝ｳ 笳銀雷笳句捷螳､縺ｮ笳銀雷縺ｧ縺吶・n\n遘√・螂醍ｴ・玄逕ｻ・・o.笳銀雷・峨↓辟｡譁ｭ鬧占ｻ翫′\n郢ｰ繧願ｿ斐＠逋ｺ逕溘＠縺ｦ縺翫ｊ縺ｾ縺吶・n\n險倬鹸・喀n繝ｻ笳区怦笳区律 霆顔ｨｮ: 笳銀雷 繝翫Φ繝舌・: 笳銀雷笳銀雷\n繝ｻ笳区怦笳区律 霆顔ｨｮ: 笳銀雷 繝翫Φ繝舌・: 笳銀雷笳銀雷\n\n隧ｲ蠖楢ｻ贋ｸ｡縺ｸ縺ｮ隴ｦ蜻頑嶌雋ｼ莉倥ｄ縲―n謗ｲ遉ｺ譚ｿ縺ｧ縺ｮ豕ｨ諢丞繭襍ｷ繧偵♀鬘倥＞縺・◆縺励∪縺吶・n\n繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・n\n笳銀雷笳句捷螳､ 笳銀雷',
  },
  {
    id: 'smell',
    icon: '址',
    title: '繧ｿ繝舌さ繝ｻ謔ｪ閾ｭ繝医Λ繝悶Ν',
    desc: '繝吶Λ繝ｳ繝蝟ｫ辣吶・譁咏炊閾ｭ',
    steps: [
      { step: '竭險倬鹸', action: '譌･譎ゅ・閾ｭ縺・・遞ｮ鬘槭・閾ｪ蛻・・陲ｫ螳ｳ・亥諜縲∵ｴ玲ｿｯ迚ｩ縺ｸ縺ｮ莉倡捩遲会ｼ峨ｒ險倬鹸', detail: '蛹ｻ蟶ｫ縺ｮ險ｺ譁ｭ譖ｸ縺後≠繧九→蜉ｹ譫懃噪' },
      { step: '竭｡邂｡逅・ｼ夂､ｾ縺ｫ騾｣邨｡', action: '蜿怜虚蝟ｫ辣咎亟豁｢縺ｮ隕ｳ轤ｹ縺九ｉ邂｡逅・ｼ夂､ｾ縺ｫ謾ｹ蝟・ｒ萓晞ｼ', detail: '邂｡逅・ｦ冗ｴ・↓繝吶Λ繝ｳ繝蝟ｫ辣咏ｦ∵ｭ｢縺ｮ譚｡鬆・′縺ゅｋ縺狗｢ｺ隱・ },
      { step: '竭｢陦梧帆讖滄未縺ｫ逶ｸ隲・, action: '蜿怜虚蝟ｫ辣咎亟豁｢譚｡萓九・縺ゅｋ閾ｪ豐ｻ菴薙↑繧臥嶌隲・ｪ灘哨縺ゅｊ', detail: '蛛･蠎ｷ蠅鈴ｲ豕・2020謾ｹ豁｣)縺ｧ繧ょ女蜍募稔辣吝ｯｾ遲悶′蠑ｷ蛹悶＆繧後※縺・ｋ' },
      { step: '竭｣豌台ｺ玖ｪｿ蛛・, action: '蛛･蠎ｷ陲ｫ螳ｳ縺後≠繧句ｴ蜷医・豌台ｺ玖ｪｿ蛛懊ｂ隕夜㍽縺ｫ', detail: '陬∝愛萓・ 繝吶Λ繝ｳ繝蝟ｫ辣吶↓蟇ｾ縺吶ｋ謳榊ｮｳ雉蜆溘ｒ隱阪ａ縺溷愛萓九≠繧・讓ｪ豬懷慍陬・012蟷ｴ)' },
    ],
    template: '縲舌・繝ｩ繝ｳ繝蝟ｫ辣吶↓繧医ｋ蜿怜虚蝟ｫ辣呵｢ｫ螳ｳ縺ｫ縺､縺・※縲曾n\n邂｡逅・ｼ夂､ｾ 笳銀雷荳榊虚逕｣ 縺疲球蠖楢・ｧ禄n\n笳銀雷繝槭Φ繧ｷ繝ｧ繝ｳ 笳銀雷笳句捷螳､縺ｮ笳銀雷縺ｧ縺吶・n\n[荳企嚴/髫｣螳､]縺ｮ繝吶Λ繝ｳ繝縺九ｉ縺ｮ繧ｿ繝舌さ縺ｮ辣吶′\n螳､蜀・↓豬∝・縺励∝▼蠎ｷ陲ｫ螳ｳ繧貞女縺代※縺翫ｊ縺ｾ縺吶・n\n迥ｶ豕・ｼ喀n繝ｻ笳区怦笳区律 笳区凾鬆・[蜈ｷ菴鍋噪縺ｪ陲ｫ螳ｳ]\n繝ｻ豢玲ｿｯ迚ｩ縺ｸ縺ｮ繧ｿ繝舌さ閾ｭ縺ｮ莉倡捩\n繝ｻ[蜥ｳ/鬆ｭ逞嫋遲峨・菴楢ｪｿ荳崎憶\n\n邂｡逅・ｦ冗ｴ・・遒ｺ隱阪♀繧医・隧ｲ蠖謎ｽ乗虻縺ｸ縺ｮ\n豕ｨ諢丞繭襍ｷ繧偵♀鬘倥＞縺ｧ縺阪∪縺吶〒縺励ｇ縺・°縲・n\n繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・n\n笳銀雷笳句捷螳､ 笳銀雷',
  },
  {
    id: 'pet',
    icon: '枢',
    title: '繝壹ャ繝医ヨ繝ｩ繝悶Ν',
    desc: '魑ｴ縺榊｣ｰ繝ｻ閾ｭ縺・・蜈ｱ逕ｨ驛ｨ縺ｧ縺ｮ謗呈ｳ・,
    steps: [
      { step: '竭險倬鹸', action: '魑ｴ縺榊｣ｰ縺ｮ譎る俣蟶ｯ繝ｻ鬆ｻ蠎ｦ繝ｻ蜈ｱ逕ｨ驛ｨ縺ｮ豎壹ｌ繧定ｨ倬鹸繝ｻ謦ｮ蠖ｱ', detail: '蜍慕判縺ｧ險倬鹸縺吶ｋ縺ｨ鬨帝浹繝ｬ繝吶Ν縺悟・縺九ｊ繧・☆縺・ },
      { step: '竭｡邂｡逅・ｼ夂､ｾ縺ｫ騾｣邨｡', action: '繝壹ャ繝磯｣ｼ閧ｲ隕冗ｴ・・遒ｺ隱阪→邂｡逅・ｼ夂､ｾ縺ｸ縺ｮ蝣ｱ蜻・, detail: '繝壹ャ繝井ｸ榊庄迚ｩ莉ｶ縺ｧ縺ｮ鬟ｼ閧ｲ縺ｪ繧牙･醍ｴ・＆蜿阪ｒ謖・遭' },
      { step: '竭｢陦梧帆讖滄未縺ｫ逶ｸ隲・, action: '蜍慕黄諢幄ｭｷ繧ｻ繝ｳ繧ｿ繝ｼ繧・ｿ晏▼謇縺ｫ逶ｸ隲・, detail: '螟夐ｭ鬟ｼ閧ｲ蟠ｩ螢翫ｄ陌仙ｾ・′逍代ｏ繧後ｋ蝣ｴ蜷医・騾壼ｱ鄒ｩ蜍吶≠繧・ },
      { step: '竭｣豕慕噪謇区ｮｵ', action: '謾ｹ蝟・＆繧後↑縺・ｴ蜷医・蠑∬ｭｷ螢ｫ縺ｫ逶ｸ隲・, detail: '鬟ｼ閧ｲ遖∵ｭ｢縺ｮ莉ｮ蜃ｦ蛻・筏隲九ｂ蜿ｯ閭ｽ' },
    ],
    template: '縲舌・繝・ヨ縺ｮ魑ｴ縺榊｣ｰ繝ｻ繝槭リ繝ｼ縺ｫ縺､縺・※縲曾n\n邂｡逅・ｼ夂､ｾ 笳銀雷荳榊虚逕｣ 縺疲球蠖楢・ｧ禄n\n笳銀雷繝槭Φ繧ｷ繝ｧ繝ｳ 笳銀雷笳句捷螳､縺ｮ笳銀雷縺ｧ縺吶・n\n[荳企嚴/髫｣螳､]縺ｮ繝壹ャ繝茨ｼ育堪/迪ｫ・峨・魑ｴ縺榊｣ｰ縺圭n豺ｱ螟懈掠譛昴ｂ蜷ｫ繧・ｻ郢√↓逋ｺ逕溘＠縺ｦ縺翫ｊ縺ｾ縺吶・n\n險倬鹸・喀n繝ｻ笳区怦笳区律 笳区凾縲懌雷譎・[魑ｴ縺榊｣ｰ縺ｮ迥ｶ豕‐\n繝ｻ蜈ｱ逕ｨ蟒贋ｸ九〒縺ｮ謗呈ｳ・ｷ｡繧堤｢ｺ隱搾ｼ亥・逵溘≠繧奇ｼ噂n\n邂｡逅・ｦ冗ｴ・↓蝓ｺ縺･縺城←蛻・↑蟇ｾ蠢懊ｒ\n縺企｡倥＞縺ｧ縺阪∪縺吶〒縺励ｇ縺・°縲・n\n繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・n\n笳銀雷笳句捷螳､ 笳銀雷',
  },
]

const movingCosts = [
  { category: '蛻晄悄雋ｻ逕ｨ', items: [
    { name: '謨ｷ驥・, typical: '螳ｶ雉・縲・繝ｶ譛・, note: '騾蜴ｻ譎ゅ↓荳驛ｨ霑秘≡' },
    { name: '遉ｼ驥・, typical: '螳ｶ雉・縲・繝ｶ譛・, note: '霑秘≡縺ｪ縺励よ怙霑代・遉ｼ驥代ぞ繝ｭ迚ｩ莉ｶ繧ょ｢怜刈' },
    { name: '莉ｲ莉区焔謨ｰ譁・, typical: '螳ｶ雉・.5縲・繝ｶ譛・遞・, note: '豕募ｾ倶ｸ翫・荳企剞縺ｯ螳ｶ雉・繝ｶ譛亥・+遞・ },
    { name: '蜑榊ｮｶ雉・, typical: '螳ｶ雉・繝ｶ譛・, note: '蜈･螻・怦縺ｮ螳ｶ雉・ｒ蜈域鴛縺・ },
    { name: '轣ｫ轣ｽ菫晞匱', typical: '1.5縲・荳・・/2蟷ｴ', note: '雉・ｲｸ螂醍ｴ・凾縺ｫ蜉蜈･蠢・・ },
    { name: '骰ｵ莠､謠幄ｲｻ逕ｨ', typical: '1縲・荳・・', note: '蜈･螻・・ｲ諡・′荳闊ｬ逧・ },
    { name: '菫晁ｨｼ莨夂､ｾ蛻ｩ逕ｨ譁・, typical: '螳ｶ雉・.5縲・繝ｶ譛・, note: '騾｣蟶ｯ菫晁ｨｼ莠ｺ荳崎ｦ√・蝣ｴ蜷医↓蠢・ｦ・ },
  ]},
  { category: '蠑戊ｶ翫＠雋ｻ逕ｨ', items: [
    { name: '蠑戊ｶ翫＠讌ｭ閠・ｼ亥腰霄ｫ繝ｻ霑題ｷ晞屬・・, typical: '3縲・荳・・', note: '郢∝ｿ呎悄(3-4譛・縺ｯ1.5縲・蛟・ },
    { name: '蠑戊ｶ翫＠讌ｭ閠・ｼ亥腰霄ｫ繝ｻ驕霍晞屬・・, typical: '6縲・5荳・・', note: '霍晞屬縺ｨ闕ｷ迚ｩ驥上〒螟牙虚螟ｧ' },
    { name: '蠑戊ｶ翫＠讌ｭ閠・ｼ亥ｮｶ譌上・霑題ｷ晞屬・・, typical: '8縲・5荳・・', note: '3-4譛医・譌ｩ繧√↓莠育ｴ・ｿ・・ },
    { name: '蠑戊ｶ翫＠讌ｭ閠・ｼ亥ｮｶ譌上・驕霍晞屬・・, typical: '15縲・0荳・・', note: '豺ｷ霈我ｾｿ縺ｧ遽邏・庄閭ｽ' },
  ]},
  { category: '隕玖誠縺ｨ縺励′縺｡縺ｪ雋ｻ逕ｨ', items: [
    { name: '繧ｨ繧｢繧ｳ繝ｳ遘ｻ險ｭ', typical: '1縲・荳・・/蜿ｰ', note: '蜿門､悶＠+蜿紋ｻ倥￠+驟咲ｮ｡' },
    { name: '繧､繝ｳ繧ｿ繝ｼ繝阪ャ繝磯幕騾・, typical: '0縲・荳・・', note: '蟾･莠玖ｲｻ縲ゅく繝｣繝ｳ繝壹・繝ｳ縺ｧ辟｡譁吶↓縺ｪ繧九％縺ｨ繧・ },
    { name: '菴乗園螟画峩謇狗ｶ壹″・磯Ψ萓ｿ霆｢騾∫ｭ会ｼ・, typical: '辟｡譁・, note: '蠢倥ｌ繧九→螻翫°縺ｪ縺・Ψ萓ｿ迚ｩ縺檎匱逕・ },
    { name: '繧ｫ繝ｼ繝・Φ繝ｻ辣ｧ譏・, typical: '1縲・荳・・', note: '遯薙し繧､繧ｺ縺悟粋繧上↑縺・％縺ｨ縺悟､壹＞' },
    { name: '邊怜､ｧ繧ｴ繝溷・蛻・, typical: '200縲・,000蜀・轤ｹ', note: '莠句燕莠育ｴ・′蠢・ｦ√↑閾ｪ豐ｻ菴薙′螟壹＞' },
  ]},
]

const consultGuide = [
  { name: '豕輔ユ繝ｩ繧ｹ・域律譛ｬ蜿ｸ豕墓髪謠ｴ繧ｻ繝ｳ繧ｿ繝ｼ・・, phone: '0570-078374', desc: '辟｡譁呎ｳ募ｾ狗嶌隲・りｿ鷹團繝医Λ繝悶Ν蜈ｨ闊ｬ縺ｮ逶ｸ隲・庄', hours: '蟷ｳ譌･ 9:00縲・1:00 / 蝨・9:00縲・7:00', icon: '笞厄ｸ・ },
  { name: '隴ｦ蟇溽嶌隲・ム繧､繝､繝ｫ', phone: '#9110', desc: '迥ｯ鄂ｪ縺ｫ閾ｳ繧峨↑縺・ヨ繝ｩ繝悶Ν縺ｮ逶ｸ隲・るｨ帝浹繝ｻ縺､縺阪∪縺ｨ縺・ｭ・, hours: '蟷ｳ譌･ 8:30縲・7:15', icon: '属' },
  { name: '蝗ｽ豌醍函豢ｻ繧ｻ繝ｳ繧ｿ繝ｼ', phone: '188', desc: '豸郁ｲｻ閠・ヨ繝ｩ繝悶Ν蜈ｨ闊ｬ縲りｳ・ｲｸ螂醍ｴ・・蝠城｡後ｂ逶ｸ隲・庄', hours: '蟷ｳ譌･ 10:00縲・6:00', icon: '到' },
  { name: '閾ｪ豐ｻ菴薙・辟｡譁呎ｳ募ｾ狗嶌隲・, phone: '蜷・ｸょ玄逕ｺ譚代・逡ｪ蜿ｷ', desc: '蠑∬ｭｷ螢ｫ縺ｫ繧医ｋ辟｡譁咏嶌隲・ｼ郁ｦ∽ｺ育ｴ・ｼ峨よ怦1縲・蝗樣幕蛯ｬ縺悟､壹＞', hours: '閾ｪ豐ｻ菴薙↓繧医ｋ', icon: '鋤・・ },
  { name: '荳榊虚逕｣驕ｩ豁｣蜿門ｼ墓耳騾ｲ讖滓ｧ・, phone: '0570-021-030', desc: '荳榊虚逕｣蜿門ｼ輔↓髢｢縺吶ｋ邏帑ｺ芽ｧ｣豎ｺ縲ゆｻｲ莉区焔謨ｰ譁吶ｄ螂醍ｴ・ヨ繝ｩ繝悶Ν', hours: '蟷ｳ譌･ 10:00縲・6:00', icon: '匠' },
  { name: '隴ｦ蟇・邱頑･騾壼ｱ', phone: '110', desc: '證ｴ蜉帙・閼・ｿｫ遲峨・迥ｯ鄂ｪ陦檎ぜ縺後≠繧句ｴ蜷医・霑ｷ繧上★110逡ｪ', hours: '24譎る俣', icon: '圷' },
]

// 笏笏笏 Area scoring logic 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const areaTypes: Record<string, { label: string; scores: Record<string, number> }> = {
  residential: { label: '序・・髢鷹撕縺ｪ菴丞ｮ・｡・, scores: { theft: 85, violent: 90, fraud: 80, traffic: 85 } },
  suburban: { label: '升 驛雁､悶・繝九Η繝ｼ繧ｿ繧ｦ繝ｳ', scores: { theft: 90, violent: 95, fraud: 85, traffic: 80 } },
  station: { label: '嚔 鬧・燕繝ｻ郢∬庄陦・, scores: { theft: 55, violent: 60, fraud: 50, traffic: 65 } },
  urban: { label: '徐・・驛ｽ蠢・Κ・医が繝輔ぅ繧ｹ陦暦ｼ・, scores: { theft: 65, violent: 75, fraud: 55, traffic: 70 } },
  industrial: { label: '少 蟾･讌ｭ蝨ｰ蟶ｯ', scores: { theft: 70, violent: 80, fraud: 75, traffic: 60 } },
  rural: { label: '言 逕ｰ闊弱・霎ｲ譚鷹Κ', scores: { theft: 95, violent: 95, fraud: 70, traffic: 90 } },
}

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
export default function MovingChecker() {
  const [activeTab, setActiveTab] = useState<'area' | 'noise' | 'checklist' | 'trouble' | 'cost' | 'help'>('area')

  // Area state
  const [selectedArea, setSelectedArea] = useState('')
  const [areaResult, setAreaResult] = useState<AreaScore | null>(null)

  // Noise state
  const [noiseInput, setNoiseInput] = useState({ structure: 'rc', floor: '5', age: '10', road: 'far', shops: 'none' })
  const [noiseResult, setNoiseResult] = useState<NoiseResult | null>(null)

  // Checklist state
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Trouble state
  const [selectedTrouble, setSelectedTrouble] = useState<string | null>(null)

  // Cost state
  const [costInput, setCostInput] = useState({ rent: '', deposit: '1', key: '1', agent: '1' })

  const tabs = [
    { id: 'area' as const, label: '桃 繧ｨ繝ｪ繧｢螳牙・蠎ｦ' },
    { id: 'noise' as const, label: '矧 鬨帝浹繝ｪ繧ｹ繧ｯ' },
    { id: 'checklist' as const, label: '笨・30鬆・岼繝√ぉ繝・け' },
    { id: 'trouble' as const, label: '笞厄ｸ・繝医Λ繝悶Ν蟇ｾ蜃ｦ' },
    { id: 'cost' as const, label: '腸 繧ｳ繧ｹ繝郁ｨ育ｮ・ },
    { id: 'help' as const, label: '到 逶ｸ隲・ｪ灘哨' },
  ]

  // Load checklist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('movingchecker-checklist')
      if (saved) setChecked(JSON.parse(saved))
    } catch {}
  }, [])
  useEffect(() => {
    if (Object.keys(checked).length > 0) localStorage.setItem('movingchecker-checklist', JSON.stringify(checked))
  }, [checked])

  // Area scoring
  const calcArea = useCallback(() => {
    if (!selectedArea) return
    const area = areaTypes[selectedArea]
    const cats = [
      { name: '遯・尢迥ｯ鄂ｪ', score: area.scores.theft, icon: '箔', desc: '遨ｺ縺榊ｷ｣繝ｻ閾ｪ霆｢霆顔尢繝ｻ荳・ｼ輔″遲・ },
      { name: '邊玲垓迥ｯ鄂ｪ', score: area.scores.violent, icon: '相', desc: '證ｴ陦後・蛯ｷ螳ｳ繝ｻ諱仙慢遲・ },
      { name: '隧先ｬｺ繝ｻ遏･閭ｽ迥ｯ', score: area.scores.fraud, icon: '鹿', desc: '謖ｯ繧願ｾｼ繧∬ｩ先ｬｺ繝ｻ繧ｵ繧､繝舌・迥ｯ鄂ｪ遲・ },
      { name: '莠､騾壼ｮ牙・', score: area.scores.traffic, icon: '囓', desc: '莠､騾壻ｺ区腐繝ｻ蜊ｱ髯ｺ驕玖ｻ｢遲・ },
    ]
    const total = Math.round(cats.reduce((s, c) => s + c.score, 0) / cats.length)
    let level = '', advice: string[] = []
    if (total >= 85) { level = '笘・・笘・・笘・髱槫ｸｸ縺ｫ螳牙・'; advice = ['螳牙ｿ・＠縺ｦ菴上ａ繧九お繝ｪ繧｢縺ｧ縺・, '蝓ｺ譛ｬ逧・↑謌ｸ邱縺ｾ繧翫・鄙呈・繧堤ｶｭ謖√＠縺ｾ縺励ｇ縺・] }
    else if (total >= 70) { level = '笘・・笘・・笘・螳牙・'; advice = ['讎ゅ・螳牙・縺ｧ縺吶′縲∝､憺俣縺ｮ荳莠ｺ豁ｩ縺阪・豕ｨ諢・, '閾ｪ霆｢霆翫・莠碁㍾繝ｭ繝・け繧偵♀縺吶☆繧・] }
    else if (total >= 55) { level = '笘・・笘・・笘・譎ｮ騾・; advice = ['髦ｲ迥ｯ諢剰ｭ倥ｒ鬮倥ａ縺ｾ縺励ｇ縺・, '蝨ｨ螳・凾縺ｧ繧よ命骭繧・, '螟憺％縺ｯ譏弱ｋ縺・％繧帝∈縺ｶ'] }
    else { level = '笘・・笘・・笘・豕ｨ諢上′蠢・ｦ・; advice = ['髦ｲ迥ｯ繧ｫ繝｡繝ｩ莉倥″迚ｩ莉ｶ繧帝∈縺ｶ', '1髫弱・驕ｿ縺代ｋ', '蟶ｰ螳・凾髢灘ｸｯ縺ｮ莠ｺ騾壹ｊ繧堤｢ｺ隱・, '雋ｴ驥榊刀縺ｮ邂｡逅・ｒ蠕ｹ蠎・] }
    setAreaResult({ total, categories: cats, level, advice })
  }, [selectedArea])

  // Noise scoring
  const calcNoise = useCallback(() => {
    let score = 0
    const factors: { name: string; impact: string; detail: string }[] = []
    // Structure
    if (noiseInput.structure === 'rc') { score += 10; factors.push({ name: 'RC騾・磯延遲九さ繝ｳ繧ｯ繝ｪ繝ｼ繝茨ｼ・, impact: '笨・菴弱Μ繧ｹ繧ｯ', detail: '驕ｮ髻ｳ諤ｧ縺梧怙繧るｫ倥＞讒矩' }) }
    else if (noiseInput.structure === 'src') { score += 15; factors.push({ name: 'SRC騾・磯延鬪ｨ驩・ｭ具ｼ・, impact: '笨・菴弱Μ繧ｹ繧ｯ', detail: 'RC縺ｨ蜷檎ｭ我ｻ･荳翫・驕ｮ髻ｳ諤ｧ' }) }
    else if (noiseInput.structure === 'steel') { score += 40; factors.push({ name: '驩・ｪｨ騾・・騾・・, impact: '笞・・荳ｭ繝ｪ繧ｹ繧ｯ', detail: '霆ｽ驥城延鬪ｨ縺ｯ迚ｹ縺ｫ髻ｳ縺御ｼ昴ｏ繧翫ｄ縺吶＞' }) }
    else { score += 60; factors.push({ name: '譛ｨ騾', impact: '閥 鬮倥Μ繧ｹ繧ｯ', detail: '驕ｮ髻ｳ諤ｧ縺梧怙繧ゆｽ弱＞縲ら函豢ｻ髻ｳ縺檎ｭ呈栢縺代・蜿ｯ閭ｽ諤ｧ' }) }
    // Floor
    const floor = Number(noiseInput.floor)
    if (floor >= 5) { factors.push({ name: `${floor}髫餐, impact: '笨・菴弱Μ繧ｹ繧ｯ', detail: '螟夜Κ鬨帝浹縺悟ｱ翫″縺ｫ縺上＞鬮倥＆' }) }
    else if (floor >= 3) { score += 10; factors.push({ name: `${floor}髫餐, impact: '噺 繧・ｄ豕ｨ諢・, detail: '驕楢ｷｯ鬨帝浹縺ｯ繧・ｄ閨槭％縺医ｋ蜿ｯ閭ｽ諤ｧ' }) }
    else { score += 25; factors.push({ name: `${floor}髫趣ｼ井ｽ主ｱ､・荏, impact: '笞・・荳ｭ繝ｪ繧ｹ繧ｯ', detail: '驕楢ｷｯ鬨帝浹繝ｻ騾夊｡御ｺｺ縺ｮ螢ｰ縺瑚◇縺薙∴繧・☆縺・ }) }
    // Age
    const age = Number(noiseInput.age)
    if (age <= 10) { factors.push({ name: `遽・{age}蟷ｴ`, impact: '笨・濶ｯ螂ｽ', detail: '2015蟷ｴ莉･髯阪・蟒ｺ遽牙渕貅悶る・髻ｳ遲臥ｴ壹′鬮倥＞' }) }
    else if (age <= 25) { score += 10; factors.push({ name: `遽・{age}蟷ｴ`, impact: '噺 譎ｮ騾・, detail: '驕ｮ髻ｳ諤ｧ閭ｽ縺ｯ荳ｭ遞句ｺｦ' }) }
    else { score += 20; factors.push({ name: `遽・{age}蟷ｴ`, impact: '笞・・豕ｨ諢・, detail: '蜿､縺・ｻｺ遽牙渕貅悶る・髻ｳ諤ｧ閭ｽ縺御ｽ弱＞蜿ｯ閭ｽ諤ｧ' }) }
    // Road
    if (noiseInput.road === 'far') { factors.push({ name: '蟷ｹ邱夐％霍ｯ縺九ｉ驕縺・, impact: '笨・濶ｯ螂ｽ', detail: '莠､騾夐ｨ帝浹縺ｮ蠢・・縺ｪ縺・ }) }
    else if (noiseInput.road === 'mid') { score += 15; factors.push({ name: '蟷ｹ邱夐％霍ｯ縺後ｄ繧・ｿ代＞', impact: '噺 豕ｨ諢・, detail: '遯薙ｒ髢九￠繧九→鬨帝浹縺悟・繧句庄閭ｽ諤ｧ' }) }
    else { score += 30; factors.push({ name: '蟷ｹ邱夐％霍ｯ豐ｿ縺・, impact: '閥 鬮倥Μ繧ｹ繧ｯ', detail: '莠碁㍾繧ｵ繝・す縺ｧ繧よｷｱ螟懊・繝医Λ繝・け髻ｳ縺梧ｰ励↓縺ｪ繧句ｴ蜷医≠繧・ }) }
    // Shops
    if (noiseInput.shops === 'none') { factors.push({ name: '鬟ｲ鬟溷ｺ励↑縺・, impact: '笨・濶ｯ螂ｽ', detail: '螟憺俣縺ｮ鬨帝浹繝ｪ繧ｹ繧ｯ縺ｪ縺・ }) }
    else if (noiseInput.shops === 'some') { score += 10; factors.push({ name: '鬟ｲ鬟溷ｺ励′繧・ｄ霑代＞', impact: '噺 豕ｨ諢・, detail: '騾ｱ譛ｫ縺ｮ豺ｱ螟懊↓鬨偵′縺励＞蜿ｯ閭ｽ諤ｧ' }) }
    else { score += 25; factors.push({ name: '鬟ｲ鬟溷ｺ励・鬟ｲ縺ｿ螻玖｡励′霑代＞', impact: '閥 鬮倥Μ繧ｹ繧ｯ', detail: '豺ｱ螟懊・驟泌ｮ｢縺ｮ螢ｰ繝ｻ繧ｫ繝ｩ繧ｪ繧ｱ髻ｳ縺悟撫鬘後↓縺ｪ繧翫ｄ縺吶＞' }) }

    const normalizedScore = Math.min(100, score)
    let level = ''
    const tips: string[] = []
    if (normalizedScore <= 20) { level = '泙 菴弱Μ繧ｹ繧ｯ 窶・鬨帝浹縺ｮ蠢・・縺ｯ縺ｻ縺ｼ縺ｪ縺・; tips.push('蠢ｫ驕ｩ縺ｪ菴冗腸蠅・′譛溷ｾ・〒縺阪∪縺・) }
    else if (normalizedScore <= 40) { level = '泯 繧・ｄ豕ｨ諢・窶・譚｡莉ｶ莉倥″縺ｧ蠢ｫ驕ｩ'; tips.push('蜀・ｦ区凾縺ｫ遯薙ｒ髢九￠縺ｦ鬨帝浹繧堤｢ｺ隱・, '譎る俣蟶ｯ繧貞､峨∴縺ｦ隍・焚蝗槫・隕九☆繧九％縺ｨ繧呈耳螂ｨ') }
    else if (normalizedScore <= 60) { level = '泛 豕ｨ諢・窶・鬨帝浹蟇ｾ遲悶′蠢・ｦ・; tips.push('髦ｲ髻ｳ繧ｫ繝ｼ繝・Φ繝ｻ莠碁㍾繧ｵ繝・す縺ｮ譛臥┌繧堤｢ｺ隱・, '閠ｳ譬薙・繝帙Ρ繧､繝医ヮ繧､繧ｺ繝槭す繝ｳ縺ｮ貅門ｙ繧・, '隗帝Κ螻九・譛荳企嚴繧貞━蜈育噪縺ｫ讀懆ｨ・) }
    else { level = '閥 鬮倥Μ繧ｹ繧ｯ 窶・鬨帝浹蝠城｡後′襍ｷ縺阪ｄ縺吶＞'; tips.push('莉悶・迚ｩ莉ｶ繧よ､懆ｨ弱☆繧九％縺ｨ繧貞ｼｷ縺上♀縺吶☆繧・, '縺ｩ縺・＠縺ｦ繧ゅ％縺ｮ迚ｩ莉ｶ縺ｪ繧蛾亟髻ｳ蟾･莠九・蜿ｯ蜷ｦ繧堤｢ｺ隱・, '1繝ｶ譛医□縺台ｽ上ｓ縺ｧ縺ｿ繧九・繝ｳ繧ｹ繝ｪ繝ｼ螂醍ｴ・ｂ驕ｸ謚櫁い') }

    setNoiseResult({ score: normalizedScore, level, factors, tips })
  }, [noiseInput])

  // Checklist stats
  const totalItems = checklistCategories.reduce((s, c) => s + c.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  // Cost calc
  const rent = Number(costInput.rent) || 0
  const deposit = Number(costInput.deposit) || 0
  const keyMoney = Number(costInput.key) || 0
  const agentFee = Number(costInput.agent) || 0
  const initialCost = rent * deposit + rent * keyMoney + rent * agentFee + rent + 20000 + 15000 + rent * 0.5

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">匠</div>
          <h1 className="text-2xl font-bold">AI蠑輔▲雜翫＠螳牙ｿ・メ繧ｧ繝・き繝ｼ</h1>
          <p className="text-gray-400 mt-1">繧ｨ繝ｪ繧｢螳牙・蠎ｦ ﾃ・鬨帝浹繝ｪ繧ｹ繧ｯ ﾃ・繝医Λ繝悶Ν莠磯亟</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* 笏笏笏 Area Tab 笏笏笏 */}
        {activeTab === 'area' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">桃 繧ｨ繝ｪ繧｢螳牙・蠎ｦ繧ｹ繧ｳ繧｢</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
              邃ｹ・・隴ｦ蟇溷ｺ√・蜈ｬ髢狗官鄂ｪ邨ｱ險医・蛯ｾ蜷代ｒ蜿り・↓縺励◆繧ｹ繧ｳ繧｢縺ｧ縺吶ょｮ滄圀縺ｮ螳牙・蠎ｦ縺ｯ蛟句挨縺ｮ繧ｨ繝ｪ繧｢縺ｫ繧医ｊ逡ｰ縺ｪ繧翫∪縺吶・            </div>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-4">繧ｨ繝ｪ繧｢縺ｮ遞ｮ鬘槭ｒ驕ｸ謚・/h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(areaTypes).map(([key, val]) => (
                  <button key={key} onClick={() => setSelectedArea(key)}
                    className={`p-4 rounded-xl border text-left transition-all ${selectedArea === key ? 'bg-blue-500/10 border-blue-500/50' : 'bg-[#1a1a2e] border-gray-700 hover:border-gray-500'}`}>
                    <div className="text-lg">{val.label}</div>
                  </button>
                ))}
              </div>
              <button onClick={calcArea} disabled={!selectedArea}
                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors">
                螳牙・蠎ｦ繧定ｨｺ譁ｭ
              </button>
            </div>

            {areaResult && (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${areaResult.total >= 80 ? 'border-green-500/30' : areaResult.total >= 60 ? 'border-blue-500/30' : 'border-amber-500/30'}`}>
                  <div className="text-sm text-gray-400 mb-2">邱丞粋螳牙・蠎ｦ</div>
                  <div className={`text-5xl font-bold ${areaResult.total >= 80 ? 'text-green-400' : areaResult.total >= 60 ? 'text-blue-400' : 'text-amber-400'}`}>{areaResult.total}轤ｹ</div>
                  <div className="text-lg mt-2">{areaResult.level}</div>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-4">繧ｫ繝・ざ繝ｪ蛻･繧ｹ繧ｳ繧｢</h3>
                  <div className="space-y-4">
                    {areaResult.categories.map((cat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cat.icon} {cat.name}</span>
                          <span className="text-gray-400">{cat.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${cat.score}%` }} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">庁 繧｢繝峨ヰ繧､繧ｹ</h3>
                  <ul className="space-y-2">{areaResult.advice.map((a, i) => <li key={i} className="text-sm text-gray-400 flex items-start gap-2"><span className="text-blue-400">竊・/span>{a}</li>)}</ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Noise Tab 笏笏笏 */}
        {activeTab === 'noise' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">矧 鬨帝浹繝ｪ繧ｹ繧ｯ繝√ぉ繝・き繝ｼ</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">蟒ｺ迚ｩ讒矩</label>
                  <select value={noiseInput.structure} onChange={e => setNoiseInput(n => ({ ...n, structure: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="src">SRC騾・磯延鬪ｨ驩・ｭ具ｼ・/option>
                    <option value="rc">RC騾・磯延遲九さ繝ｳ繧ｯ繝ｪ繝ｼ繝茨ｼ・/option>
                    <option value="steel">驩・ｪｨ騾・・騾・・/option>
                    <option value="wood">譛ｨ騾</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">髫取焚</label>
                  <input type="number" value={noiseInput.floor} onChange={e => setNoiseInput(n => ({ ...n, floor: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">遽牙ｹｴ謨ｰ</label>
                  <input type="number" value={noiseInput.age} onChange={e => setNoiseInput(n => ({ ...n, age: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">蟷ｹ邱夐％霍ｯ</label>
                  <select value={noiseInput.road} onChange={e => setNoiseInput(n => ({ ...n, road: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="far">驕縺・ｼ亥ｾ呈ｭｩ5蛻・ｻ･荳奇ｼ・/option>
                    <option value="mid">繧・ｄ霑代＞・亥ｾ呈ｭｩ1縲・蛻・ｼ・/option>
                    <option value="near">豐ｿ縺・ｼ育岼縺ｮ蜑搾ｼ・/option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">鬟ｲ鬟溷ｺ励・螽ｯ讌ｽ譁ｽ險ｭ</label>
                <select value={noiseInput.shops} onChange={e => setNoiseInput(n => ({ ...n, shops: e.target.value }))}
                  className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="none">蜻ｨ霎ｺ縺ｫ縺ｪ縺・/option>
                  <option value="some">蟆代＠縺ゅｋ</option>
                  <option value="many">鬟ｲ縺ｿ螻玖｡励′霑代＞</option>
                </select>
              </div>
              <button onClick={calcNoise} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">鬨帝浹繝ｪ繧ｹ繧ｯ繧定ｨｺ譁ｭ</button>
            </div>

            {noiseResult && (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${noiseResult.score <= 20 ? 'border-green-500/30' : noiseResult.score <= 40 ? 'border-yellow-500/30' : noiseResult.score <= 60 ? 'border-amber-500/30' : 'border-red-500/30'}`}>
                  <div className="text-sm text-gray-400 mb-2">鬨帝浹繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢</div>
                  <div className={`text-5xl font-bold ${noiseResult.score <= 20 ? 'text-green-400' : noiseResult.score <= 40 ? 'text-yellow-400' : noiseResult.score <= 60 ? 'text-amber-400' : 'text-red-400'}`}>{noiseResult.score}%</div>
                  <div className="text-sm mt-2">{noiseResult.level}</div>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">搭 蛻､螳夊ｦ∝屏</h3>
                  <div className="space-y-3">
                    {noiseResult.factors.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
                        <span className="text-sm font-bold whitespace-nowrap">{f.impact}</span>
                        <div><div className="text-sm">{f.name}</div><div className="text-xs text-gray-500">{f.detail}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                {noiseResult.tips.length > 0 && (
                  <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                    <h3 className="font-bold mb-3">庁 繧｢繝峨ヰ繧､繧ｹ</h3>
                    <ul className="space-y-2">{noiseResult.tips.map((t, i) => <li key={i} className="text-sm text-gray-400 flex items-start gap-2"><span className="text-blue-400">竊・/span>{t}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Checklist Tab 笏笏笏 */}
        {activeTab === 'checklist' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">笨・迚ｩ莉ｶ繝医Λ繝悶Ν莠磯亟繝√ぉ繝・け・・0鬆・岼・・/h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">繝√ぉ繝・け貂医∩: {checkedCount}/{totalItems}</span>
                <span className="text-sm font-bold text-blue-400">{totalItems > 0 ? Math.round(checkedCount / totalItems * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${totalItems > 0 ? checkedCount / totalItems * 100 : 0}%` }} />
              </div>
            </div>

            {checklistCategories.map((cat, ci) => (
              <div key={ci} className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold mb-4">{cat.name}</h3>
                <div className="space-y-2">
                  {cat.items.map(item => (
                    <div key={item.id} onClick={() => setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${checked[item.id] ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-[#1a1a2e]'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${checked[item.id] ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                        {checked[item.id] && <span className="text-xs text-white">笨・/span>}
                      </div>
                      <span className={`text-sm flex-1 ${checked[item.id] ? 'line-through text-gray-500' : ''}`}>{item.text}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.priority === '蠢・・ ? 'bg-red-500/20 text-red-400' : item.priority === '謗ｨ螂ｨ' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>{item.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 笏笏笏 Trouble Tab 笏笏笏 */}
        {activeTab === 'trouble' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">笞厄ｸ・繝医Λ繝悶Ν蟇ｾ蜃ｦ繝・Φ繝励Ξ繝ｼ繝・/h2>
            {!selectedTrouble ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {troubleTemplates.map(t => (
                  <button key={t.id} onClick={() => setSelectedTrouble(t.id)}
                    className="bg-[#13131e] rounded-xl border border-gray-800 p-6 text-left hover:border-blue-500/50 transition-colors">
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <h3 className="font-bold text-lg">{t.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            ) : (() => {
              const t = troubleTemplates.find(x => x.id === selectedTrouble)!
              return (
                <div className="space-y-4">
                  <button onClick={() => setSelectedTrouble(null)} className="text-sm text-blue-400 hover:text-blue-300">竊・繝医Λ繝悶Ν荳隕ｧ縺ｫ謌ｻ繧・/button>
                  <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                    <h3 className="text-2xl mb-1">{t.icon} {t.title}</h3>
                    <p className="text-gray-400 mb-6">谿ｵ髫守噪縺ｪ蟇ｾ蜃ｦ繝輔Ο繝ｼ</p>
                    <div className="space-y-4">
                      {t.steps.map((s, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">{i + 1}</div>
                            {i < t.steps.length - 1 && <div className="w-0.5 flex-1 bg-gray-800 mt-1" />}
                          </div>
                          <div className="pb-4">
                            <div className="font-bold text-sm text-blue-400">{s.step}</div>
                            <div className="font-medium">{s.action}</div>
                            <div className="text-sm text-gray-400 mt-1">{s.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-blue-500/30 p-6">
                    <h3 className="font-bold mb-3">統 邂｡逅・ｼ夂､ｾ縺ｸ縺ｮ騾｣邨｡繝・Φ繝励Ξ繝ｼ繝・/h3>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-[#1a1a2e] rounded-lg p-4">{t.template}</pre>
                    <button onClick={() => navigator.clipboard.writeText(t.template)}
                      className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">搭 繧ｳ繝斐・</button>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* 笏笏笏 Cost Tab 笏笏笏 */}
        {activeTab === 'cost' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">腸 蠑輔▲雜翫＠繧ｳ繧ｹ繝郁ｨ育ｮ玲ｩ・/h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-4">螳ｶ雉・°繧牙・譛溯ｲｻ逕ｨ繧定ｨ育ｮ・/h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">螳ｶ雉・ｼ井ｸ・・・・/label>
                  <input type="number" placeholder="7" value={costInput.rent} onChange={e => setCostInput(c => ({ ...c, rent: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">謨ｷ驥托ｼ医Ω譛茨ｼ・/label>
                  <select value={costInput.deposit} onChange={e => setCostInput(c => ({ ...c, deposit: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="0">0繝ｶ譛・/option><option value="1">1繝ｶ譛・/option><option value="2">2繝ｶ譛・/option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">遉ｼ驥托ｼ医Ω譛茨ｼ・/label>
                  <select value={costInput.key} onChange={e => setCostInput(c => ({ ...c, key: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="0">0繝ｶ譛・/option><option value="1">1繝ｶ譛・/option><option value="2">2繝ｶ譛・/option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">莉ｲ莉区焔謨ｰ譁呻ｼ医Ω譛茨ｼ・/label>
                  <select value={costInput.agent} onChange={e => setCostInput(c => ({ ...c, agent: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="0.5">0.5繝ｶ譛・/option><option value="1">1繝ｶ譛・/option>
                  </select>
                </div>
              </div>
              {rent > 0 && (
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 text-center">
                  <div className="text-sm text-gray-400 mb-1">蛻晄悄雋ｻ逕ｨ縺ｮ隕狗ｩ阪ｂ繧・/div>
                  <div className="text-4xl font-bold text-blue-400">邏・･{Math.round(initialCost * 10000).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-2">謨ｷ驥・+ 遉ｼ驥・+ 莉ｲ莉区焔謨ｰ譁・+ 蜑榊ｮｶ雉・+ 轣ｫ轣ｽ菫晞匱 + 骰ｵ莠､謠・+ 菫晁ｨｼ莨夂､ｾ</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {movingCosts.map((cat, ci) => (
                <div key={ci} className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-4">{cat.category}</h3>
                  <div className="space-y-3">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="flex justify-between items-start py-2 border-b border-gray-800 last:border-0">
                        <div><div className="text-sm">{item.name}</div><div className="text-xs text-gray-500">{item.note}</div></div>
                        <span className="text-sm font-bold text-amber-400 whitespace-nowrap ml-4">{item.typical}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 笏笏笏 Help Tab 笏笏笏 */}
        {activeTab === 'help' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">到 逶ｸ隲・ｪ灘哨繧ｬ繧､繝・/h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
              庁 霑鷹團繝医Λ繝悶Ν縺ｯ謌第・縺礼ｶ壹￠繧九→謔ｪ蛹悶＠縺ｾ縺吶よ掠繧√↓逶ｸ隲・☆繧九％縺ｨ縺瑚ｧ｣豎ｺ縺ｮ隨ｬ荳豁ｩ縺ｧ縺吶ら嶌隲・・辟｡譁吶・遘伜ｯ・宍螳医〒縺吶・            </div>
            <div className="space-y-4">
              {consultGuide.map((c, i) => (
                <div key={i} className="bg-[#13131e] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{c.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{c.desc}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="text-lg font-bold text-blue-400">到 {c.phone}</span>
                        <span className="text-sm text-gray-500">武 {c.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Affiliate */}
      <div className="mt-8 border rounded-xl p-4 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <span className="text-[10px] text-muted-foreground font-medium mr-2">PR</span>
          <span className="text-sm">匠 譁ｰ逕滓ｴｻ縺ｧ雋ｷ縺｣縺ｦ繧医°縺｣縺溘ｂ縺ｮ繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ繧定ｦ九ｋ</span>
          <p className="text-xs text-muted-foreground mt-0.5">蠑輔▲雜翫＠貅門ｙ縺梧紛縺｣縺溘ｉ谺｡縺ｯ縲碁Κ螻九▼縺上ｊ縲阪よ眠逕滓ｴｻ繧ｰ繝・ぜ縺ｮ繝吶せ繝医そ繝ｩ繝ｼ繧定ｦ九※縺ｿ繧医≧縲・/p>
        </div>
        <a href="https://www.amazon.co.jp/s?k=譁ｰ逕滓ｴｻ+蠑輔▲雜翫＠+繧ｰ繝・ぜ&tag=nextralabs-22" target="_blank" rel="noopener noreferrer sponsored"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
          繝√ぉ繝・け縺吶ｋ 竊・        </a>
      </div>
      </div>
    
      </div>
  )
}


