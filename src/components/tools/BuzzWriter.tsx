'use client'


import { useState, useCallback, useEffect } from 'react'

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
interface NewsItem {
  title: string
  link: string
  category: string
  pubDate: string
  traffic?: string
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

// 笏笏笏 Data 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const templates = [
  {
    id: 'empathy', name: '蜈ｱ諢溷梛', icon: '､・, desc: '縲後ｏ縺九ｋ縲懶ｼ√阪ｒ隱倡匱',
    format: '縲占・蛻・ｂ邨碁ｨ薙曾n\n{繝九Η繝ｼ繧ｹ縺ｮ隕∫ｴм縺｣縺ｦ繝九Η繝ｼ繧ｹ隕九◆縺代←縲―n縺薙ｌ縲√∪縺輔↓{閾ｪ蛻・・菴馴ｨ党縺縺｣縺溘・n\n{蜈ｱ諢溘・繧､繝ｳ繝・\n\n縺ｿ繧薙↑縺ｯ縺ｩ縺・昴≧・歃n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '繝・Ξ繝ｯ繝ｼ繧ｯ蟒・ｭ｢縺ｮ豬√ｌ縺悟刈騾溘▲縺ｦ繝九Η繝ｼ繧ｹ隕九◆縺代←縲―n縺薙ｌ縲√∪縺輔↓蜴ｻ蟷ｴ縺・■縺ｮ莨夂､ｾ縺ｧ襍ｷ縺阪◆縺薙→縺縺｣縺溘・n\n騾壼共蠕ｩ豢ｻ縺ｧ蜿ｯ蜃ｦ蛻・凾髢薙′2譎る俣貂帙▲縺ｦ縲∝憶讌ｭ縺ｮ譎る俣縺後ぞ繝ｭ縺ｫ縲・n縺ｧ繧ゅ悟・遉ｾ縺励◆縺ｻ縺・′繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ蜿悶ｌ繧九阪▲縺ｦ譛ｬ蠖薙↓縺昴≧・歃n\n縺ｿ繧薙↑縺ｯ縺ｩ縺・昴≧・・,
  },
  {
    id: 'question', name: '蝠城｡梧署襍ｷ蝙・, icon: '､・, desc: '縲瑚・∴縺溘％縺ｨ縺ｪ縺九▲縺溘阪ｒ蠑輔″蜃ｺ縺・,
    format: '{繝九Η繝ｼ繧ｹ縺ｮ隕∫ｴм縲・n\n縺ｧ繧ゅ■繧・▲縺ｨ蠕・▲縺ｦ縲・n譛ｬ蠖薙↓{蝠上＞縺九￠}縺ｪ縺ｮ縺具ｼ歃n\n螳溘・{騾・・隕也せ}縲・n\n{邨占ｫ・or 蝠上＞縺九￠}\n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: 'AI隕丞宛豕墓｡医′蝗ｽ莨夐夐℃縲・n\n縺ｧ繧ゅ■繧・▲縺ｨ蠕・▲縺ｦ縲・n譛ｬ蠖薙↓縲窟I繧定ｦ丞宛縺吶∋縺阪阪↑縺ｮ縺具ｼ歃n\n螳溘・隕丞宛縺吶∋縺阪・縲窟I繧呈が逕ｨ縺吶ｋ莠ｺ髢薙阪〒縺ゅ▲縺ｦ縲―n謚陦薙◎縺ｮ繧ゅ・繧堤ｸ帙ｋ縺ｨ譌･譛ｬ縺縺醍ｽｮ縺・※縺・°繧後ｋ縲・n\n隕丞宛縺ｮ譛ｬ雉ｪ縲√ｂ縺・ｸ蠎ｦ閠・∴縺ｾ縺帙ｓ・・,
  },
  {
    id: 'experience', name: '菴馴ｨ楢ｫ・梛', icon: '当', desc: '繝ｪ繧｢繝ｫ縺ｪ菴馴ｨ薙〒繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝育佐蠕・,
    format: '{陦晄茶縺ｮ荳譁・\n\n{閭梧勹繝ｻ縺阪▲縺九￠}\n\n{繧・▲縺溘％縺ｨ}\n\n{邨先棡繝ｻ蟄ｦ縺ｳ}\n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '蜑ｯ讌ｭ3蟷ｴ逶ｮ縺ｧ譛亥庶縺梧悽讌ｭ繧定ｶ・∴縺溘・n\n譛蛻昴・譛・000蜀・・Web繝ｩ繧､繧ｿ繝ｼ縺九ｉ蟋九ａ縺溘・n縲後％繧薙↑縺ｮ縺ｧ遞ｼ縺偵ｋ繧上￠縺ｪ縺・阪→諤昴＞縺ｪ縺後ｉ邯壹￠縺溘・n\n霆｢讖溘・SNS逋ｺ菫｡繧貞ｧ九ａ縺溘％縺ｨ縲・n險倅ｺ九・繝弱え繝上え繧湛縺ｧ豈取律逋ｺ菫｡竊偵ヵ繧ｩ繝ｭ繝ｯ繝ｼ5000莠ｺ竊箪n莨∵･ｭ譯井ｻｶ縺梧擂繧九ｈ縺・↓縺ｪ縺｣縺溘・n\n繧ｳ繝・・縲悟ｮ檎挑繧堤岼謖・＆縺ｪ縺・阪％縺ｨ縲・,
  },
  {
    id: 'data', name: '繝・・繧ｿ謠千､ｺ蝙・, icon: '投', desc: '謨ｰ蟄励・隱ｬ蠕怜鴨縺ｧRT迯ｲ蠕・,
    format: '遏･縺｣縺ｦ縺滂ｼ歃n\n{鬩壹″縺ｮ繝・・繧ｿ}\n\n縺､縺ｾ繧顎繝・・繧ｿ縺ｮ諢丞袖}縺ｨ縺・≧縺薙→縲・n\n{閾ｪ蛻・・隗｣驥医・諢剰ｦ急\n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '遏･縺｣縺ｦ縺滂ｼ歃n\n譌･譛ｬ縺ｮ繧ｮ繝｣繝ｳ繝悶Ν萓晏ｭ倡裸縺ｮ謗ｨ螳壽ぅ閠・焚縺ｯ320荳・ｺｺ縲・n蝗ｽ豌代・邏・0莠ｺ縺ｫ1莠ｺ縲・n\n縺､縺ｾ繧翫け繝ｩ繧ｹ縺ｫ1莠ｺ縺ｯ繧ｮ繝｣繝ｳ繝悶Ν萓晏ｭ倥・蜿ｯ閭ｽ諤ｧ縺後≠繧九→縺・≧縺薙→縲・n\n縺ｧ繧ら嶌隲・ｪ灘哨縺ｮ蛻ｩ逕ｨ邇・・繧上★縺・%縲・n縲瑚・蛻・・驕輔≧縲阪→諤昴▲縺ｦ繧倶ｺｺ縺・7%縺・ｋ迴ｾ螳溘・,
  },
  {
    id: 'contrary', name: '騾・ｼｵ繧雁梛', icon: '売', desc: '蟶ｸ隴倥ｒ隕・＠縺ｦ豕ｨ逶ｮ繧帝寔繧√ｋ',
    format: '縲鶏蟶ｸ隴・縲構n\n竊代％繧後∝ｮ溘・髢馴＆縺・・n\n{騾・・莠句ｮ毳\n\n{譬ｹ諡繝ｻ逅・罰}\n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '縲梧掠襍ｷ縺阪・荳画枚縺ｮ蠕ｳ縲構n\n竊代％繧後∝ｮ溘・髢馴＆縺・・n\n譛譁ｰ縺ｮ逹｡逵遐皮ｩｶ縺ｧ縲―n莠ｺ縺ｫ縺ｯ驕ｺ莨晉噪縺ｫ豎ｺ縺ｾ縺｣縺溘後け繝ｭ繝弱ち繧､繝励阪′縺ゅｊ縲―n螟懷梛縺ｮ莠ｺ縺檎┌逅・↓譌ｩ襍ｷ縺阪☆繧九→\n繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺・0%菴惹ｸ九☆繧九％縺ｨ縺悟愛譏弱・n\n閾ｪ蛻・↓蜷医▲縺滓凾髢灘ｸｯ縺ｧ逕溘″繧医≧縲・,
  },
  {
    id: 'listicle', name: '繝ｪ繧ｹ繝亥梛', icon: '統', desc: '菫晏ｭ倡紫縺碁ｫ倥＞縲後∪縺ｨ繧√榊ｽ｢蠑・,
    format: '{繝・・繝栲縲∫衍縺｣縺ｦ縺翫￥縺ｹ縺砿N}縺､縺ｮ縺薙→\n\n竭{鬆・岼1}\n竭｡{鬆・岼2}\n竭｢{鬆・岼3}\n竭｣{鬆・岼4}\n竭､{鬆・岼5}\n\n縺ｩ繧後′荳逡ｪ諢丞､悶□縺｣縺滂ｼ歃n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '蠑輔▲雜翫＠縺ｧ蠕梧ｔ縺吶ｋ莠ｺ縺ｮ迚ｹ蠕ｴ縲・縺､\n\n竭蜀・ｦ九ｒ1蝗槭＠縺九＠縺ｦ縺・↑縺Ыn竭｡螟懊・豐ｻ螳峨ｒ遒ｺ隱阪＠縺ｦ縺・↑縺Ыn竭｢繧ｴ繝滓昏縺ｦ蝣ｴ繧定ｦ九※縺・↑縺Ыn竭｣螢√ｒ蜿ｩ縺・※驕ｮ髻ｳ諤ｧ繧堤｢ｺ隱阪＠縺ｦ縺・↑縺Ыn竭､騾蜴ｻ雋ｻ逕ｨ縺ｮ譚｡莉ｶ繧定ｪｭ繧薙〒縺・↑縺Ыn\n縺ｩ繧後′荳逡ｪ諢丞､悶□縺｣縺滂ｼ・,
  },
  {
    id: 'before-after', name: '繝薙ヵ繧ｩ繝ｼ繧｢繝輔ち繝ｼ蝙・, icon: '笨ｨ', desc: '螟牙喧縺ｮ繧ｹ繝医・繝ｪ繝ｼ縺ｧ諠ｹ縺阪▽縺代ｋ',
    format: '縲殖efore縲曾n{莉･蜑阪・迥ｶ諷急\n\n竊・{縺阪▲縺九￠}\n\n縲植fter縲曾n{迴ｾ蝨ｨ縺ｮ迥ｶ諷急\n\n{蟄ｦ縺ｳ繝ｻ繝｡繝・そ繝ｼ繧ｸ}\n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '縲殖efore縲曾nSNS繝輔か繝ｭ繝ｯ繝ｼ200莠ｺ縲よ兜遞ｿ縺励※繧ゅ後＞縺・・縲・莉ｶ縲・n\n竊・繝舌ぜ繧区兜遞ｿ縺ｮ蝙九ｒ蟄ｦ繧薙□\n\n縲植fter縲曾n繝輔か繝ｭ繝ｯ繝ｼ8000莠ｺ縲ょｹｳ蝮・後＞縺・・縲・50莉ｶ縲・n譛・莉ｶ縺ｮ莨∵･ｭ譯井ｻｶ縲・n\n螟峨∴縺溘・縺ｯ縲梧兜遞ｿ縺ｮ蝙九阪□縺代ょ・螳ｹ縺ｯ蜷後§縲・,
  },
  {
    id: 'thread', name: '繧ｹ繝ｬ繝・ラ蟆主・蝙・, icon: 'ｧｵ', desc: '縲檎ｶ壹″縺梧ｰ励↓縺ｪ繧九阪〒譛蠕後∪縺ｧ隱ｭ縺ｾ縺帙ｋ',
    format: '{陦晄茶縺ｮ邨占ｫ凡縲・n\n縺ｧ繧ゅ％繧後∫炊逕ｱ縺後≠繧九ｓ縺ｧ縺吶・n\n莉･荳九＋繝・・繝栲縺ｫ縺､縺・※{N}縺､縺ｮ繝昴う繝ｳ繝・ｧｵ燥\n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '霆｢閨ｷ縺励※蟷ｴ蜿弱′200荳・・荳翫′縺｣縺溘・n\n縺ｧ繧ゅ％繧後√せ繧ｭ繝ｫ縺ｯ髢｢菫ゅ↑縺九▲縺溘・n\n莉･荳九√悟ｹｴ蜿弱′荳翫′繧玖ｻ｢閨ｷ縲阪↓縺､縺・※5縺､縺ｮ繝昴う繝ｳ繝・ｧｵ燥',
  },
  {
    id: 'quote', name: '蜷崎ｨ蠑慕畑蝙・, icon: '町', desc: '蜷崎ｨﾃ苓・蛻・・隗｣驥医〒豺ｱ縺ｿ繧貞・縺・,
    format: '縲鶏蜷崎ｨ}縲構n窶・{隱ｰ縺ｮ險闡厭\n\n{閾ｪ蛻・↑繧翫・隗｣驥・\n\n{莉翫・譎ゆｻ｣縺ｫ蠖薙※縺ｯ繧√ｋ縺ｨ}\n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '縲梧悴譚･繧剃ｺ域ｸｬ縺吶ｋ譛蝟・・譁ｹ豕輔・縲∬・蛻・〒蜑ｵ繧九％縺ｨ縺縲構n窶・繧｢繝ｩ繝ｳ繝ｻ繧ｱ繧､\n\n縺薙・險闡峨、I縺ｮ譎ゆｻ｣縺ｫ縺薙◎蛻ｺ縺輔ｋ縲・n\nAI縺ｫ莉穂ｺ九ｒ螂ｪ繧上ｌ繧九°縲、I縺ｧ莉穂ｺ九ｒ蜑ｵ繧九°縲・n驕輔＞縺ｯ縲御ｽｿ縺・・縺ｫ蝗槭ｌ繧九°縲阪□縺代・,
  },
  {
    id: 'hot-take', name: '譛ｬ髻ｳ縺ｶ縺｣縺｡繧・￠蝙・, icon: '櫨', desc: '邇・峩縺輔〒蜈ｱ諢溘→隴ｰ隲悶ｒ蜻ｼ縺ｶ',
    format: '豁｣逶ｴ縺ｫ險縺・→縲―n{譛ｬ髻ｳ}\n\n逅・罰縺ｯ{逅・罰}縲・n\n{陬懆ｶｳ繝ｻ繝輔か繝ｭ繝ｼ}\n\n雉帛凄縺ゅｋ縺ｨ諤昴≧縺代←縲√∩繧薙↑縺ｯ縺ｩ縺・ｼ歃n\n{繝上ャ繧ｷ繝･繧ｿ繧ｰ}',
    example: '豁｣逶ｴ縺ｫ險縺・→縲―n縲檎浹縺ｮ荳翫↓繧ゆｸ牙ｹｴ縲阪・螳ｳ謔ｪ縺縺ｨ諤昴▲縺ｦ繧九・n\n逅・罰縺ｯ繝悶Λ繝・け莨∵･ｭ縺ｮ貂ｩ蟄倩｣・ｽｮ縺ｫ縺ｪ縺｣縺ｦ繧九°繧峨・n\n蜷医ｏ縺ｪ縺・腸蠅・〒3蟷ｴ閠舌∴繧九ｈ繧翫―n3繝ｶ譛医〒隕句・縺｣縺ｦ谺｡縺ｫ陦後￥縺ｻ縺・′\n莠ｺ逕溘ヨ繝ｼ繧ｿ繝ｫ縺ｧ縺ｯ蠕励ｒ縺吶ｋ縲・n\n雉帛凄縺ゅｋ縺ｨ諤昴≧縺代←縲√∩繧薙↑縺ｯ縺ｩ縺・ｼ・,
  },
]

const hashtagCategories = [
  {
    name: '繝薙ず繝阪せ繝ｻ蜑ｯ讌ｭ', tags: ['#蜑ｯ讌ｭ', '#繝輔Μ繝ｼ繝ｩ繝ｳ繧ｹ', '#襍ｷ讌ｭ', '#迢ｬ遶・, '#蛟倶ｺｺ莠区･ｭ荳ｻ', '#蜑ｯ讌ｭ蛻晏ｿ・・, '#遞ｼ縺仙鴨', '#繝薙ず繝阪せ', '#繝槭・繧ｱ繝・ぅ繝ｳ繧ｰ', '#SNS髮・ｮ｢', '#繝悶Λ繝ｳ繝・ぅ繝ｳ繧ｰ', '#繧ｳ繝ｳ繝・Φ繝・ン繧ｸ繝阪せ'],
  },
  {
    name: 'AI繝ｻ繝・け繝弱Ο繧ｸ繝ｼ', tags: ['#AI', '#ChatGPT', '#逕滓・AI', '#AI繝・・繝ｫ', '#繝・け繝弱Ο繧ｸ繝ｼ', '#DX', '#繝励Ο繧ｰ繝ｩ繝溘Φ繧ｰ', '#繧ｨ繝ｳ繧ｸ繝九い', '#IT', '#繝・ず繧ｿ繝ｫ', '#Web3', '#閾ｪ蜍募喧'],
  },
  {
    name: '繝ｩ繧､繝輔ワ繝・け', tags: ['#繝ｩ繧､繝輔ワ繝・け', '#譎ら洒', '#蜉ｹ邇・喧', '#逕溽肇諤ｧ', '#鄙呈・', '#隱ｭ譖ｸ', '#閾ｪ蟾ｱ謚戊ｳ・, '#譛晄ｴｻ', '#繝ｫ繝ｼ繝・ぅ繝ｳ', '#繝溘ル繝槭Μ繧ｹ繝・, '#譁ｭ謐ｨ髮｢', '#謨ｴ逅・紛鬆・],
  },
  {
    name: '蛛･蠎ｷ繝ｻ鄒主ｮｹ', tags: ['#蛛･蠎ｷ', '#遲九ヨ繝ｬ', '#繝繧､繧ｨ繝・ヨ', '#繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ', '#逹｡逵', '#繧ｹ繝医Ξ繧ｹ', '#繝ｨ繧ｬ', '#繝ｩ繝ｳ繝九Φ繧ｰ', '#鬟滉ｺ狗ｮ｡逅・, '#鄒主ｮｹ', '#繧ｹ繧ｭ繝ｳ繧ｱ繧｢', '#繧ｻ繝ｫ繝輔こ繧｢'],
  },
  {
    name: '閧ｲ蜈舌・螳ｶ譌・, tags: ['#閧ｲ蜈・, '#蟄占ご縺ｦ', '#繝ｯ繝ｼ繝槭・', '#繝代ヱ閧ｲ蜈・, '#遏･閧ｲ', '#謨呵ご', '#螳ｶ譌・, '#蜈ｱ蜒阪″', '#菫晄ｴｻ', '#蟆丞ｭｦ逕・, '#荳ｭ蟄ｦ蜿鈴ｨ・, '#PTA'],
  },
  {
    name: '譁咏炊繝ｻ繧ｰ繝ｫ繝｡', tags: ['#譁咏炊', '#繝ｬ繧ｷ繝・, '#譎ら洒繝ｬ繧ｷ繝・, '#菴懊ｊ鄂ｮ縺・, '#縺雁ｼ∝ｽ・, '#繧ｫ繝輔ぉ', '#繧ｰ繝ｫ繝｡', '#縺翫≧縺｡縺斐・繧・, '#譁咏炊螂ｽ縺・, '#鬟溘∋豁ｩ縺・, '#繧ｹ繧､繝ｼ繝・, '#繝ｩ繝ｳ繝・],
  },
  {
    name: '譌・｡後・縺翫〒縺九￠', tags: ['#譌・｡・, '#蝗ｽ蜀・羅陦・, '#豬ｷ螟匁羅陦・, '#貂ｩ豕・, '#繝帙ユ繝ｫ', '#隕ｳ蜈・, '#縺翫〒縺九￠', '#繧ｫ繝｡繝ｩ', '#鬚ｨ譎ｯ', '#譌・｡悟･ｽ縺・, '#荳莠ｺ譌・, '#騾ｱ譛ｫ譌・｡・],
  },
  {
    name: '繝医Ξ繝ｳ繝峨・隧ｱ鬘・, tags: ['#莉頑律縺ｮ繝九Η繝ｼ繧ｹ', '#繝医Ξ繝ｳ繝・, '#隧ｱ鬘・, '#豕ｨ逶ｮ', '#騾溷ｱ', '#縺ｾ縺ｨ繧・, '#閠・ｯ・, '#隗｣隱ｬ', '#繧上°繧翫ｄ縺吶￥', '#遏･縺｣縺ｦ縺翫″縺溘＞', '#諡｡謨｣蟶梧悍', '#繧ｷ繧ｧ繧｢'],
  },
]

const timingData = [
  { day: '譛・, slots: [{ time: '7-8譎・, score: 70 }, { time: '12-13譎・, score: 85 }, { time: '18-19譎・, score: 75 }, { time: '21-22譎・, score: 80 }] },
  { day: '轣ｫ', slots: [{ time: '7-8譎・, score: 75 }, { time: '12-13譎・, score: 90 }, { time: '18-19譎・, score: 80 }, { time: '21-22譎・, score: 85 }] },
  { day: '豌ｴ', slots: [{ time: '7-8譎・, score: 70 }, { time: '12-13譎・, score: 85 }, { time: '18-19譎・, score: 75 }, { time: '21-22譎・, score: 80 }] },
  { day: '譛ｨ', slots: [{ time: '7-8譎・, score: 75 }, { time: '12-13譎・, score: 85 }, { time: '18-19譎・, score: 80 }, { time: '21-22譎・, score: 85 }] },
  { day: '驥・, slots: [{ time: '7-8譎・, score: 65 }, { time: '12-13譎・, score: 80 }, { time: '18-19譎・, score: 85 }, { time: '21-22譎・, score: 95 }] },
  { day: '蝨・, slots: [{ time: '9-10譎・, score: 80 }, { time: '12-13譎・, score: 75 }, { time: '15-16譎・, score: 70 }, { time: '21-22譎・, score: 90 }] },
  { day: '譌･', slots: [{ time: '9-10譎・, score: 85 }, { time: '12-13譎・, score: 80 }, { time: '15-16譎・, score: 75 }, { time: '20-21譎・, score: 85 }] },
]

const personas = [
  { id: 'business', name: '蜑ｯ讌ｭ繝ｻ繝薙ず繝阪せ邉ｻ', icon: '直', style: '繝励Ο繝輔ぉ繝・す繝ｧ繝翫Ν縺九▽螳溯ｷｵ逧・よ焚蟄励→邨先棡縺ｧ隱槭ｋ縲・ },
  { id: 'engineer', name: '繧ｨ繝ｳ繧ｸ繝九い繝ｻIT邉ｻ', icon: '捗', style: '謚陦鍋噪縺ｪ遏･隕九ｒ蟷ｳ譏薙↓隗｣隱ｬ縲ゅΘ繝ｼ繝｢繧｢繧剃ｺ､縺医※縲・ },
  { id: 'lifestyle', name: '繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ邉ｻ', icon: '笨ｨ', style: '譌･蟶ｸ縺ｮ逋ｺ隕九ｒ蜈ｱ譛峨ょ・諢溘→縲後＞縺・↑縲阪ｒ隱倥≧縲・ },
  { id: 'mama', name: '繝槭・繝ｻ閧ｲ蜈千ｳｻ', icon: '束窶昨汨ｧ', style: '閧ｲ蜈舌≠繧九≠繧九↓蜈ｱ諢溘よ凾遏ｭ繝ｻ蜉ｹ邇・喧縺ｮTips螟壹ａ縲・ },
  { id: 'health', name: '蛛･蠎ｷ繝ｻ鄒主ｮｹ邉ｻ', icon: '潮', style: '遘大ｭｦ逧・ｹ諡繝吶・繧ｹ縲ゅせ繝医う繝・け縺吶℃縺ｪ縺・ｮ溯ｷｵ逧・い繝峨ヰ繧､繧ｹ縲・ },
]

const fallbackNews: NewsItem[] = [
  { title: 'AI縺御ｻ穂ｺ九ｒ螟峨∴繧具ｼ滓怙譁ｰ縺ｮ豢ｻ逕ｨ莠倶ｾ・, link: '', category: 'IT繝ｻ繝・け繝弱Ο繧ｸ繝ｼ', pubDate: '', traffic: '' },
  { title: '蜑ｯ讌ｭ縺ｧ譛・0荳・・繧帝＃謌舌☆繧九◆繧√・譛遏ｭ繝ｫ繝ｼ繝・, link: '', category: '繝薙ず繝阪せ', pubDate: '', traffic: '' },
  { title: 'SNS繝輔か繝ｭ繝ｯ繝ｼ繧貞柑邇・ｈ縺丞｢励ｄ縺呎婿豕・, link: '', category: '繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ', pubDate: '', traffic: '' },
  { title: '譎ら洒譁咏炊縺ｧ豈取律縺ｮ雋諡・ｒ貂帙ｉ縺吶さ繝・, link: '', category: '繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ', pubDate: '', traffic: '' },
  { title: '繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ繧貞ｮ医ｋ縺溘ａ縺ｮ5縺､縺ｮ鄙呈・', link: '', category: '蛛･蠎ｷ', pubDate: '', traffic: '' },
]

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
export default function BuzzWriter() {
  // News state
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [customTopic, setCustomTopic] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Edited post / prompt state
  const [editedPost, setEditedPost] = useState('')

  // Score state
  const [draftText, setDraftText] = useState('')
  const [buzzScore, setBuzzScore] = useState<BuzzScore | null>(null)

  // Accordion state
  const [showHashtag, setShowHashtag] = useState(false)
  const [showTiming, setShowTiming] = useState(false)
  const [showBuzz, setShowBuzz] = useState(false)

  // Copy state
  const [copied, setCopied] = useState(false)

  // Persona
  const [selectedPersona, setSelectedPersona] = useState('business')

  // Fetch news
  const fetchNews = useCallback(async () => {
    setNewsLoading(true)
    try {
      const res = await fetch('/api/trending-news')
      const data = await res.json()
      const fetched = data.news || []
      if (fetched.length > 0) {
        setNews(fetched)
      } else {
        setNews(fallbackNews)
      }
    } catch {
      setNews(fallbackNews)
    }
    setNewsLoading(false)
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  // Handle news selection
  const handleNewsSelect = (item: NewsItem) => {
    setSelectedNews(item)
    setTimeout(() => {
      document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Handle template selection 窶・generate AI prompt
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const t = templates.find(x => x.id === templateId)!
    const persona = personas.find(p => p.id === selectedPersona)!

    const newsContext = selectedNews
      ? `莉頑律縺ｮ繝医Ξ繝ｳ繝峨ル繝･繝ｼ繧ｹ・壹・{selectedNews.title}縲構n\n`
      : ''

    const prompt = `${newsContext}莉･荳九・SNS謚慕ｨｿ繝・Φ繝励Ξ繝ｼ繝医ｒ菴ｿ縺｣縺ｦ縲・{persona.name}蜷代￠縺ｮ繝舌ぜ繧区兜遞ｿ譁・ｒ1縺､菴懈・縺励※縺上□縺輔＞縲・
縲舌ユ繝ｳ繝励Ξ繝ｼ繝育ｨｮ鬘槭・{t.name}・・{t.desc}・・
縲舌ユ繝ｳ繝励Ξ繝ｼ繝医・${t.format}

縲先兜遞ｿ繧ｹ繧ｿ繧､繝ｫ縲・${persona.style}

縲先擅莉ｶ縲・- 100縲・00譁・ｭ礼ｨ句ｺｦ
- 繝上ャ繧ｷ繝･繧ｿ繧ｰ繧・縲・蛟句性繧√ｋ
- 邨ｵ譁・ｭ励ｒ驕ｩ蠎ｦ縺ｫ菴ｿ縺・- 閾ｪ蛻・・諢剰ｦ九・菴馴ｨ薙ｒ蜈･繧後※繧ｪ繝ｪ繧ｸ繝翫Μ繝・ぅ繧貞・縺・
謚慕ｨｿ譁・・縺ｿ蜃ｺ蜉帙＠縺ｦ縺上□縺輔＞縲Ａ

    setEditedPost(prompt)
    setTimeout(() => {
      document.getElementById('step3')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Buzz score calculation
  const calcBuzzScore = useCallback(() => {
    if (!draftText.trim()) return
    const text = draftText.trim()
    const charCount = text.length
    const lines = text.split('\n').filter(l => l.trim())
    const hashtags = (text.match(/#\S+/g) || []).length
    const hasEmoji = /[\uD83C-\uD83E]/.test(text)
    const hasQuestion = text.includes('・・) || text.includes('?')
    const hasExclamation = text.includes('・・) || text.includes('!')
    const hasLineBreaks = lines.length >= 3

    let charScore = 0
    if (charCount >= 100 && charCount <= 200) charScore = 95
    else if (charCount >= 80 && charCount <= 280) charScore = 80
    else if (charCount >= 50 && charCount <= 400) charScore = 60
    else charScore = 40

    let hookScore = 50
    const firstLine = lines[0] || ''
    if (firstLine.length <= 30) hookScore += 15
    if (/[・・・・]/.test(firstLine)) hookScore += 10
    if (/[\uD83C-\uD83E]/.test(firstLine)) hookScore += 5
    if (/遏･縺｣縺ｦ縺毫螳溘・|豁｣逶ｴ|陦晄茶|繝､繝舌＞|鬩壹″|縺ｾ縺輔°/.test(firstLine)) hookScore += 15
    hookScore = Math.min(100, hookScore)

    let emotionScore = 50
    if (hasQuestion) emotionScore += 15
    if (hasExclamation) emotionScore += 10
    if (hasEmoji) emotionScore += 10
    if (/縺ｿ繧薙↑|縺ゅ↑縺毫蜈ｱ諢毫繧上°繧・.test(text)) emotionScore += 10
    emotionScore = Math.min(100, emotionScore)

    let hashtagScore = 0
    if (hashtags >= 2 && hashtags <= 5) hashtagScore = 90
    else if (hashtags === 1) hashtagScore = 60
    else if (hashtags > 5) hashtagScore = 50
    else hashtagScore = 30

    let readability = 50
    if (hasLineBreaks) readability += 20
    if (lines.every(l => l.length <= 40)) readability += 15
    if (text.includes('\n\n')) readability += 10
    readability = Math.min(100, readability)

    const total = Math.round((charScore * 0.2 + hookScore * 0.3 + emotionScore * 0.2 + hashtagScore * 0.15 + readability * 0.15))

    const tips: string[] = []
    if (charScore < 70) tips.push(charCount < 100 ? '庁 繧ゅ≧蟆代＠蜀・ｮｹ繧定ｿｽ蜉・・00縲・00譁・ｭ励′譛驕ｩ・・ : '庁 髟ｷ縺吶℃繧九°繧ゅよ怙繧ゆｼ昴∴縺溘＞縺薙→縺ｫ邨槭▲縺ｦ')
    if (hookScore < 70) tips.push('庁 1陦檎岼繧偵ｂ縺｣縺ｨ繧ｭ繝｣繝・メ繝ｼ縺ｫ縲ゅ檎衍縺｣縺ｦ縺滂ｼ溘阪悟ｮ溘・縲阪梧ｭ｣逶ｴ縺ｫ險縺・→縲阪〒蟋九ａ縺ｦ縺ｿ縺ｦ')
    if (!hasQuestion) tips.push('庁 譛蠕後↓縲後∩繧薙↑縺ｯ縺ｩ縺・昴≧・溘阪ｒ霑ｽ蜉縺吶ｋ縺ｨ繝ｪ繝励′蠅励∴繧・)
    if (hashtags === 0) tips.push('庁 繝上ャ繧ｷ繝･繧ｿ繧ｰ繧・縲・蛟玖ｿｽ蜉縺励ｈ縺・ｼ育匱隕九＆繧後ｄ縺吶￥縺ｪ繧具ｼ・)
    if (!hasLineBreaks) tips.push('庁 謾ｹ陦後ｒ蠅励ｄ縺励※隱ｭ縺ｿ繧・☆縺上・縲・陦後＃縺ｨ縺ｫ遨ｺ陦後ｒ蜈･繧後※')
    if (!hasEmoji) tips.push('庁 邨ｵ譁・ｭ励ｒ1縲・蛟玖ｿｽ蜉縺吶ｋ縺ｨ逶ｮ繧貞ｼ輔￥')

    setBuzzScore({ total, charScore, hookScore, emotionScore, hashtagScore, readability, tips })
  }, [draftText])

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">櫨</div>
          <h1 className="text-2xl font-bold">AI繝舌ぜ譁・ｫ繧ｳ繝ｼ繝・/h1>
          <p className="text-gray-400 mt-1">繝医Ξ繝ｳ繝峨ル繝･繝ｼ繧ｹ ﾃ・繝・Φ繝励Ξ繝ｼ繝・ﾃ・AI繝励Ο繝ｳ繝励ヨ逕滓・</p>
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

      {/* Main vertical flow */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        {/* 笏笏笏 Step 1: 繝阪ち繧帝∈縺ｶ 笏笏笏 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm">1</span>
            <h2 className="text-xl font-bold">繝阪ち繧帝∈縺ｶ</h2>
            <button onClick={fetchNews} disabled={newsLoading}
              className="ml-auto px-3 py-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 rounded-lg text-xs font-medium transition-colors">
              {newsLoading ? '蜿門ｾ嶺ｸｭ...' : '売 譖ｴ譁ｰ'}
            </button>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-xs text-orange-300 mb-4">
            庁 繝九Η繝ｼ繧ｹ繧偵ち繝・・縺励※驕ｸ謚槭☆繧九°縲∽ｸ九・縲瑚・蛻・・繝阪ち縲阪↓逶ｴ謗･蜈･蜉帙＠縺ｦ縺上□縺輔＞縲・          </div>

          {/* News list */}
          {news.length > 0 ? (
            <div className="space-y-2 mb-4">
              {news.map((item, i) => (
                <div key={i}
                  onClick={() => handleNewsSelect(item)}
                  className={`bg-[#13131e] rounded-xl border p-4 cursor-pointer transition-all hover:border-orange-500/50 ${selectedNews?.title === item.title ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{item.category}</span>
                        {item.traffic && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">櫨 {item.traffic}</span>
                        )}
                      </div>
                    </div>
                    {selectedNews?.title === item.title
                      ? <span className="text-xs text-orange-400 whitespace-nowrap">笨・驕ｸ謚樔ｸｭ</span>
                      : <span className="text-xs text-gray-500 whitespace-nowrap">繧ｿ繝・・縺ｧ驕ｸ謚・/span>
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 text-center text-gray-500 text-sm mb-4">
              {newsLoading ? '竢ｳ 繝九Η繝ｼ繧ｹ繧貞叙蠕嶺ｸｭ...' : '縲梧峩譁ｰ縲阪・繧ｿ繝ｳ繧呈款縺励※縺上□縺輔＞縲・}
            </div>
          )}

          {/* Custom topic */}
          <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4">
            <label className="block text-sm text-gray-400 mb-2">笨擾ｸ・閾ｪ蛻・・繝阪ち繧貞・蜉帙☆繧具ｼ医ル繝･繝ｼ繧ｹ荳崎ｦ√・蝣ｴ蜷茨ｼ・/label>
            <textarea
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="萓具ｼ壹悟憶讌ｭ縺ｧ譛・0荳・ｒ驕疲・縺励◆隧ｱ縲阪窟I繝・・繝ｫ繧剃ｽｿ縺・ｧ九ａ縺ｦ螟峨ｏ縺｣縺溘％縺ｨ縲・
              rows={3}
              className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:outline-none resize-none"
            />
          </div>
        </section>

        {/* 笏笏笏 Step 2: 繝・Φ繝励Ξ繝ｼ繝医ｒ驕ｸ縺ｶ 笏笏笏 */}
        {(selectedNews || customTopic.trim()) && (
          <section id="step2">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm">2</span>
              <h2 className="text-xl font-bold">繝・Φ繝励Ξ繝ｼ繝医ｒ驕ｸ縺ｶ</h2>
            </div>

            {/* Selected news display */}
            {selectedNews && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 mb-4">
                <div className="text-xs text-orange-400 mb-1">堂 驕ｸ謚樔ｸｭ縺ｮ繝阪ち:</div>
                <div className="text-sm font-medium">{selectedNews.title}</div>
              </div>
            )}
            {!selectedNews && customTopic.trim() && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-4">
                <div className="text-xs text-blue-400 mb-1">笨擾ｸ・蜈･蜉帑ｸｭ縺ｮ繝阪ち:</div>
                <div className="text-sm font-medium">{customTopic.trim()}</div>
              </div>
            )}

            {/* Template grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {templates.map(t => (
                <button key={t.id} onClick={() => handleTemplateSelect(t.id)}
                  className={`p-3 rounded-xl border text-left text-sm transition-all ${selectedTemplate === t.id ? 'bg-orange-500/10 border-orange-500' : 'bg-[#13131e] border-gray-800 hover:border-gray-600'}`}>
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 笏笏笏 Step 3: AI縺ｧ謚慕ｨｿ譁・ｒ逕滓・ 笏笏笏 */}
        {editedPost && (
          <section id="step3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">3</div>
              <h2 className="text-lg font-bold">AI縺ｧ謚慕ｨｿ譁・ｒ逕滓・</h2>
            </div>

            {/* 繝励Ο繝ｳ繝励ヨ陦ｨ遉ｺ繧ｨ繝ｪ繧｢ */}
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="text-sm text-orange-300 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                庁 荳九・繝励Ο繝ｳ繝励ヨ繧偵さ繝斐・縺励※縲，hatGPT繧Гlaude縺ｫ雋ｼ繧贋ｻ倥￠繧九→謚慕ｨｿ譁・′逕滓・縺輔ｌ縺ｾ縺・              </div>

              <textarea
                value={editedPost}
                readOnly
                rows={12}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 resize-none"
              />

              {/* 繧ｳ繝斐・繝懊ち繝ｳ */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(editedPost)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {copied ? '笨・繧ｳ繝斐・縺励∪縺励◆・・ : '搭 繝励Ο繝ｳ繝励ヨ繧偵さ繝斐・'}
              </button>

              {/* 螟夜ΚAI繝ｪ繝ｳ繧ｯ */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://chat.openai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#1a1a2e] border border-gray-700 hover:border-green-500/50 rounded-lg text-sm transition-colors"
                >
                  <span>､・/span> ChatGPT縺ｧ髢九￥
                </a>
                <a
                  href="https://claude.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#1a1a2e] border border-gray-700 hover:border-violet-500/50 rounded-lg text-sm transition-colors"
                >
                  <span>笨ｨ</span> Claude縺ｧ髢九￥
                </a>
              </div>
            </div>

            {/* 繝舌ぜ蠎ｦ險ｺ譁ｭ・医さ繝斐・縺励◆蠕後↓菴ｿ縺・ｼ・*/}
            <div className="mt-6">
              <button
                onClick={() => setShowBuzz(!showBuzz)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#13131e] border border-gray-800 rounded-xl text-sm font-medium"
              >
                <span>櫨 繝舌ぜ蠎ｦ險ｺ譁ｭ・・I縺ｧ逕滓・縺励◆譁・ｫ繧定ｲｼ繧贋ｻ倥￠縺ｦ險ｺ譁ｭ・・/span>
                <span>{showBuzz ? '笆ｲ' : '笆ｼ'}</span>
              </button>
              {showBuzz && (
                <div className="mt-2 bg-[#13131e] border border-gray-800 rounded-xl p-6 space-y-4">
                  <textarea
                    value={draftText}
                    onChange={e => setDraftText(e.target.value)}
                    placeholder="AI縺檎函謌舌＠縺滓兜遞ｿ譁・ｒ縺薙％縺ｫ雋ｼ繧贋ｻ倥￠縺ｦ險ｺ譁ｭ..."
                    rows={6}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:outline-none resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{draftText.length}譁・ｭ・/span>
                    <button onClick={calcBuzzScore} disabled={!draftText.trim()}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 rounded-lg text-sm font-medium">
                      險ｺ譁ｭ縺吶ｋ
                    </button>
                  </div>

                  {buzzScore && (
                    <div className="space-y-4">
                      <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${buzzScore.total >= 80 ? 'border-green-500/30' : buzzScore.total >= 60 ? 'border-orange-500/30' : 'border-red-500/30'}`}>
                        <div className="text-sm text-gray-400 mb-2">繝舌ぜ蠎ｦ繧ｹ繧ｳ繧｢</div>
                        <div className={`text-6xl font-bold ${buzzScore.total >= 80 ? 'text-green-400' : buzzScore.total >= 60 ? 'text-orange-400' : 'text-red-400'}`}>{buzzScore.total}轤ｹ</div>
                        <div className="text-sm mt-2 text-gray-400">{buzzScore.total >= 80 ? '櫨 繝舌ぜ繧翫・繝・Φ繧ｷ繝｣繝ｫ鬮假ｼ・ : buzzScore.total >= 60 ? '総 縺・＞諢溘§縲ゅｂ縺・ｰ代＠繝悶Λ繝・す繝･繧｢繝・・繧・ : '答 謾ｹ蝟・・菴吝慍縺ゅｊ縲ゆｸ九・繧｢繝峨ヰ繧､繧ｹ繧貞盾閠・↓'}</div>
                      </div>
                      <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                        <h3 className="font-bold mb-4">投 隧ｳ邏ｰ繧ｹ繧ｳ繧｢</h3>
                        {[
                          { name: '譁・ｭ玲焚', score: buzzScore.charScore, desc: '100縲・00譁・ｭ励′譛驕ｩ' },
                          { name: '繝輔ャ繧ｯ蠎ｦ', score: buzzScore.hookScore, desc: '1陦檎岼縺ｮ繧､繝ｳ繝代け繝・ },
                          { name: '諢滓ュ蝟夊ｵｷ', score: buzzScore.emotionScore, desc: '隱ｭ閠・・諢滓ュ繧貞虚縺九☆蜉・ },
                          { name: '繝上ャ繧ｷ繝･繧ｿ繧ｰ', score: buzzScore.hashtagScore, desc: '2縲・蛟九′譛驕ｩ' },
                          { name: '隱ｭ縺ｿ繧・☆縺・, score: buzzScore.readability, desc: '謾ｹ陦後・谿ｵ關ｽ縺ｮ菴ｿ縺・婿' },
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
                          <h3 className="font-bold mb-3">庁 謾ｹ蝟・い繝峨ヰ繧､繧ｹ</h3>
                          <ul className="space-y-2">{buzzScore.tips.map((t, i) => <li key={i} className="text-sm text-gray-400">{t}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion: 繝上ャ繧ｷ繝･繧ｿ繧ｰ霎槫・ */}
            <div className="mt-6 mb-3">
              <button
                onClick={() => setShowHashtag(v => !v)}
                className="w-full flex items-center justify-between bg-[#13131e] border border-gray-800 rounded-xl px-5 py-4 text-left hover:border-gray-600 transition-colors">
                <span className="font-medium">#・鞘Ε 繝上ャ繧ｷ繝･繧ｿ繧ｰ霎槫・</span>
                <span className="text-gray-400 text-lg">{showHashtag ? '笆ｲ' : '笆ｼ'}</span>
              </button>
              {showHashtag && (
                <div className="bg-[#13131e] border border-t-0 border-gray-800 rounded-b-xl px-5 py-4 space-y-5">
                  {hashtagCategories.map((cat, ci) => (
                    <div key={ci}>
                      <h3 className="font-bold mb-2 text-sm">{cat.name}</h3>
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
            </div>

            {/* Accordion: 謚慕ｨｿ繧ｿ繧､繝溘Φ繧ｰ */}
            <div className="mb-3">
              <button
                onClick={() => setShowTiming(v => !v)}
                className="w-full flex items-center justify-between bg-[#13131e] border border-gray-800 rounded-xl px-5 py-4 text-left hover:border-gray-600 transition-colors">
                <span className="font-medium">投 謚慕ｨｿ繧ｿ繧､繝溘Φ繧ｰ繧ｬ繧､繝・/span>
                <span className="text-gray-400 text-lg">{showTiming ? '笆ｲ' : '笆ｼ'}</span>
              </button>
              {showTiming && (
                <div className="bg-[#13131e] border border-t-0 border-gray-800 rounded-b-xl px-5 py-4 space-y-5">
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-xs text-orange-300">
                    庁 荳闊ｬ逧・↑繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝亥だ蜷代〒縺吶り・蛻・・繝輔か繝ｭ繝ｯ繝ｼ縺ｮ蜿榊ｿ懊ｒ隕九↑縺後ｉ譛驕ｩ蛹悶＠縺ｦ縺上□縺輔＞縲・                  </div>
                  <div>
                    <h3 className="font-bold mb-3 text-sm">譖懈律 ﾃ・譎る俣蟶ｯ 繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医・繝・・</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="text-left py-2 px-3 text-gray-400">譖懈律</th>
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
                      <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500/30" />90+ 譛驕ｩ</span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-500/20" />80+ 螂ｽ驕ｩ</span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-500/15" />70+ 譎ｮ騾・/span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-500/10" />70譛ｪ貅</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3 text-sm">識 繝壹Ν繧ｽ繝雁挨縺翫☆縺吶ａ</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 py-2"><span className="text-lg">直</span><div><div className="font-medium">繝薙ず繝阪せ邉ｻ</div><div className="text-sm text-gray-400">轣ｫ繝ｻ譛ｨ縺ｮ12譎ょ床縲・≡譖・1譎ゅ′繝吶せ繝医る壼共繝ｻ譏ｼ莨代∩繝ｻ蟶ｰ螳・ｾ後・繝薙ず繝阪せ繝槭Φ縺ｫ蛻ｺ縺輔ｋ</div></div></div>
                      <div className="flex items-start gap-3 py-2"><span className="text-lg">束窶昨汨ｧ</span><div><div className="font-medium">繝槭・繝ｻ閧ｲ蜈千ｳｻ</div><div className="text-sm text-gray-400">蟷ｳ譌･10譎ょ床・亥ｭ蝉ｾ帙ｒ騾√ｊ蜃ｺ縺励◆蠕鯉ｼ峨・1譎ょ床・亥ｯ昴°縺励▽縺大ｾ鯉ｼ・/div></div></div>
                      <div className="flex items-start gap-3 py-2"><span className="text-lg">捗</span><div><div className="font-medium">繧ｨ繝ｳ繧ｸ繝九い邉ｻ</div><div className="text-sm text-gray-400">蝨滓律縺ｮ蜊亥燕荳ｭ縲∝ｹｳ譌･22譎ゆｻ･髯阪よｷｱ螟懷ｸｯ繧よэ螟悶→繝ｪ繝ｼ繝√☆繧・/div></div></div>
                      <div className="flex items-start gap-3 py-2"><span className="text-lg">笨ｨ</span><div><div className="font-medium">繝ｩ繧､繝輔せ繧ｿ繧､繝ｫ邉ｻ</div><div className="text-sm text-gray-400">譌･譖懊・譛晢ｼ医ｆ縺｣縺上ｊSNS髢ｲ隕ｧ繧ｿ繧､繝・峨・≡譖懷､懶ｼ磯ｱ譛ｫ豌怜・・・/div></div></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </section>
        )}
      </div>
    
      </div>
  )
}




