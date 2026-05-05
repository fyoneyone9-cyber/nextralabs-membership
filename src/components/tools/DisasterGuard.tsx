'use client'


import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'map' | 'family' | 'checklist' | 'weather' | 'emergency' | 'quiz'

interface Shelter {
  name: string
  address: string
  types: string[]
  lat: number
  lng: number
  distance?: number
}

interface FamilyMember {
  id: string
  name: string
  location: string
  locationLat?: number
  locationLng?: number
  nearestShelter?: string
  notes: string
}

interface CheckItem {
  id: string
  category: string
  text: string
  checked: boolean
}

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface WeatherAlert {
  title: string
  area: string
  severity: string
  status: string
  description: string
}

// ==================== CONSTANTS ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'map', icon: '亮・・, label: '驕ｿ髮｣繝槭ャ繝・ },
  { id: 'family', icon: '捉窶昨汨ｩ窶昨汨ｧ', label: '螳ｶ譌上・繝ｩ繝ｳ' },
  { id: 'checklist', icon: '搭', label: '繝√ぉ繝・け繝ｪ繧ｹ繝・ },
  { id: 'weather', icon: '笞・・, label: '豌苓ｱ｡隴ｦ蝣ｱ' },
  { id: 'emergency', icon: '・', label: '邱頑･騾｣邨｡' },
  { id: 'quiz', icon: '当', label: '髦ｲ轣ｽ繧ｯ繧､繧ｺ' },
]

const PREFECTURES = [
  '蛹玲ｵｷ驕・,'髱呈｣ｮ逵・,'蟯ｩ謇狗恁','螳ｮ蝓守恁','遘狗伐逵・,'螻ｱ蠖｢逵・,'遖丞ｳｶ逵・,
  '闌ｨ蝓守恁','譬・惠逵・,'鄒､鬥ｬ逵・,'蝓ｼ邇臥恁','蜊・痩逵・,'譚ｱ莠ｬ驛ｽ','逾槫･亥ｷ晉恁',
  '譁ｰ貎溽恁','蟇悟ｱｱ逵・,'遏ｳ蟾晉恁','遖丈ｺ慕恁','螻ｱ譴ｨ逵・,'髟ｷ驥守恁','蟯宣・逵・,
  '髱吝ｲ｡逵・,'諢帷衍逵・,'荳蛾㍾逵・,'貊玖ｳ逵・,'莠ｬ驛ｽ蠎・,'螟ｧ髦ｪ蠎・,'蜈ｵ蠎ｫ逵・,
  '螂郁憶逵・,'蜥梧ｭ悟ｱｱ逵・,'魑･蜿也恁','蟲ｶ譬ｹ逵・,'蟯｡螻ｱ逵・,'蠎・ｳｶ逵・,'螻ｱ蜿｣逵・,
  '蠕ｳ蟲ｶ逵・,'鬥吝ｷ晉恁','諢帛ｪ帷恁','鬮倡衍逵・,'遖丞ｲ｡逵・,'菴占ｳ逵・,'髟ｷ蟠守恁',
  '辭頑悽逵・,'螟ｧ蛻・恁','螳ｮ蟠守恁','鮖ｿ蜈仙ｳｶ逵・,'豐也ｸ・恁'
]

// Sample shelters (Kanagawa / Ebina area + major ones)
const SAMPLE_SHELTERS: Shelter[] = [
  { name: '豬ｷ閠∝錐蟶らｫ区ｵｷ閠∝錐蟆丞ｭｦ譬｡', address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ょ嵜蛻・漉1-1-1', types: ['蝨ｰ髴・,'豢ｪ豌ｴ'], lat: 35.4455, lng: 139.3906 },
  { name: '豬ｷ閠∝錐蟶らｫ区怏鬥ｬ荳ｭ蟄ｦ譬｡', address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ゆｸｭ譁ｰ逕ｰ1-1-1', types: ['蝨ｰ髴・,'豢ｪ豌ｴ','蝨溽・], lat: 35.4522, lng: 139.3811 },
  { name: '豬ｷ閠∝錐蟶よ枚蛹紋ｼ夐､ｨ', address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ゅａ縺舌∩逕ｺ6-1', types: ['蝨ｰ髴・], lat: 35.4513, lng: 139.3925 },
  { name: '豬ｷ閠∝錐驕句虚蜈ｬ蝨・, address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ら､ｾ螳ｶ4032-1', types: ['蝨ｰ髴・,'蠎・沺驕ｿ髮｣'], lat: 35.4395, lng: 139.3730 },
  { name: '豬ｷ閠∝錐蟶らｫ区沛繧ｱ隹ｷ蟆丞ｭｦ譬｡', address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶よ沛繧ｱ隹ｷ573', types: ['蝨ｰ髴・,'豢ｪ豌ｴ'], lat: 35.4578, lng: 139.4001 },
  { name: '豬ｷ閠∝錐蟶らｷ丞粋遖冗･我ｼ夐､ｨ', address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ゅ＆縺､縺咲伴41-1', types: ['蝨ｰ髴・,'遖冗･蛾∩髮｣謇'], lat: 35.4468, lng: 139.3888 },
  { name: '豬ｷ閠∝錐蟶らｫ句､ｧ隹ｷ蟆丞ｭｦ譬｡', address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ょ､ｧ隹ｷ蜊・-1-1', types: ['蝨ｰ髴・,'豢ｪ豌ｴ'], lat: 35.4345, lng: 139.3850 },
  { name: '豬ｷ閠∝錐荳ｭ螟ｮ蜈ｬ蝨・, address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ゆｸｭ螟ｮ1-1', types: ['蠎・沺驕ｿ髮｣','蝨ｰ髴・], lat: 35.4480, lng: 139.3920 },
  { name: 'ViNA GARDENS・医ン繝翫ぎ繝ｼ繝・Φ繧ｺ・・, address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ゅａ縺舌∩逕ｺ3-1', types: ['荳譎る∩髮｣'], lat: 35.4500, lng: 139.3930 },
  { name: '豬ｷ閠∝錐蟶らｫ区ｵｷ閠∝錐荳ｭ蟄ｦ譬｡', address: '逾槫･亥ｷ晉恁豬ｷ閠∝錐蟶ょ嵜蛻・漉3-1-1', types: ['蝨ｰ髴・,'豢ｪ豌ｴ'], lat: 35.4430, lng: 139.3880 },
]

const DEFAULT_CHECKLIST: Omit<CheckItem, 'checked'>[] = [
  { id: 'w1', category: '豌ｴ繝ｻ鬟滓侭', text: '鬟ｲ譁呎ｰｴ・・莠ｺ1譌･3L ﾃ・3譌･蛻・ｼ・ },
  { id: 'w2', category: '豌ｴ繝ｻ鬟滓侭', text: '髱槫ｸｸ鬟滂ｼ育ｼｶ隧ｰ縲√Ξ繝医Ν繝医∽ｹｾ繝代Φ遲会ｼ・譌･蛻・ },
  { id: 'w3', category: '豌ｴ繝ｻ鬟滓侭', text: '邨ｦ豌ｴ逕ｨ繝昴Μ繧ｿ繝ｳ繧ｯ' },
  { id: 'm1', category: '蛹ｻ逋ゅ・陦帷函', text: '蟶ｸ蛯呵脈繝ｻ蜃ｦ譁ｹ阮ｬ・・騾ｱ髢灘・・・ },
  { id: 'm2', category: '蛹ｻ逋ゅ・陦帷函', text: '謨第･繧ｻ繝・ヨ・育ｵ・卸閹上∵ｶ域ｯ呈ｶｲ縲∝桁蟶ｯ・・ },
  { id: 'm3', category: '蛹ｻ逋ゅ・陦帷函', text: '邁｡譏薙ヨ繧､繝ｬ・・莠ｺ1譌･5蝗・ﾃ・3譌･蛻・ｼ・ },
  { id: 'm4', category: '蛹ｻ逋ゅ・陦帷函', text: '繝槭せ繧ｯ繝ｻ繧ｦ繧ｧ繝・ヨ繝・ぅ繝・す繝･' },
  { id: 't1', category: '諠・ｱ繝ｻ騾｣邨｡', text: '繝｢繝舌う繝ｫ繝舌ャ繝・Μ繝ｼ・域ｺ蜈・崕・・ },
  { id: 't2', category: '諠・ｱ繝ｻ騾｣邨｡', text: '謳ｺ蟶ｯ繝ｩ繧ｸ繧ｪ・磯崕豎蠑・or 謇句屓縺暦ｼ・ },
  { id: 't3', category: '諠・ｱ繝ｻ騾｣邨｡', text: '螳ｶ譌上・騾｣邨｡蜈医Γ繝｢・育ｴ呻ｼ・ },
  { id: 't4', category: '諠・ｱ繝ｻ騾｣邨｡', text: '轣ｽ螳ｳ莨晁ｨ繝繧､繝､繝ｫ(171)縺ｮ菴ｿ縺・婿遒ｺ隱・ },
  { id: 'g1', category: '逕滓ｴｻ逕ｨ蜩・, text: '諛蝉ｸｭ髮ｻ轣ｯ繝ｻ繝ｩ繝ｳ繧ｿ繝ｳ' },
  { id: 'g2', category: '逕滓ｴｻ逕ｨ蜩・, text: '豈帛ｸ・・蟇晁｢九・繧｢繝ｫ繝溘ヶ繝ｩ繝ｳ繧ｱ繝・ヨ' },
  { id: 'g3', category: '逕滓ｴｻ逕ｨ蜩・, text: '髮ｨ蜈ｷ・医Ξ繧､繝ｳ繧ｳ繝ｼ繝茨ｼ・ },
  { id: 'g4', category: '逕滓ｴｻ逕ｨ蜩・, text: '霆肴焔繝ｻ繧ｹ繝ｪ繝・ヱ' },
  { id: 'g5', category: '逕滓ｴｻ逕ｨ蜩・, text: '迴ｾ驥托ｼ亥ｰ城姦蜷ｫ繧・・ },
  { id: 'd1', category: '譖ｸ鬘・, text: '霄ｫ蛻・ｨｼ譏取嶌縺ｮ繧ｳ繝斐・' },
  { id: 'd2', category: '譖ｸ鬘・, text: '菫晞匱險ｼ縺ｮ繧ｳ繝斐・' },
  { id: 'd3', category: '譖ｸ鬘・, text: '騾壼ｸｳ繝ｻ繧ｫ繝ｼ繝臥分蜿ｷ縺ｮ繝｡繝｢' },
  { id: 'p1', category: '繝壹ャ繝・, text: '繝壹ャ繝医ヵ繝ｼ繝会ｼ・譌･蛻・ｼ・ },
  { id: 'p2', category: '繝壹ャ繝・, text: '繝壹ャ繝育畑繧ｭ繝｣繝ｪ繝ｼ繧ｱ繝ｼ繧ｹ' },
]

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: '蝨ｰ髴・匱逕滓凾縲√∪縺壽怙蛻昴↓縺吶∋縺阪％縺ｨ縺ｯ・・,
    options: ['轣ｫ繧呈ｶ医☆', '譛ｺ縺ｮ荳九↓髫繧後ｋ', '螟悶↓騾・￡繧・, '髱槫ｸｸ鬟溘ｒ蜿悶ｊ縺ｫ陦後￥'],
    correct: 1,
    explanation: '縺ｾ縺壹・霄ｫ縺ｮ螳牙・繧堤｢ｺ菫昴よ昭繧後′蜿弱∪繧九∪縺ｧ譛ｺ縺ｮ荳九↑縺ｩ荳亥､ｫ縺ｪ繧ゅ・縺ｮ霑代￥縺ｫ驕ｿ髮｣縺励∪縺励ｇ縺・ら↓縺ｮ蟋区忰縺ｯ謠ｺ繧後′蜿弱∪縺｣縺ｦ縺九ｉ縲・,
  },
  {
    question: '豢･豕｢隴ｦ蝣ｱ縺悟・縺滓凾縲√←縺薙↓驕ｿ髮｣縺吶∋縺搾ｼ・,
    options: ['豬ｷ蟯ｸ霑代￥縺ｮ鬆台ｸ医↑繝薙Ν', '縺ｧ縺阪ｋ縺縺鷹ｫ倥＞蝣ｴ謇繝ｻ鬮伜床', '蝨ｰ荳句ｮ､', '閾ｪ螳・・2髫・],
    correct: 1,
    explanation: '豢･豕｢縺九ｉ縺ｮ驕ｿ髮｣縺ｯ縲後ｈ繧企ｫ倥￥縲√ｈ繧企□縺上阪′蜴溷援縲よｵｷ蟯ｸ縺九ｉ髮｢繧後◆鬮伜床繧堤岼謖・＠縺ｾ縺励ｇ縺・りｿ代￥縺ｫ鬮伜床縺後↑縺・ｴ蜷医・縲・延遲九さ繝ｳ繧ｯ繝ｪ繝ｼ繝医・3髫惹ｻ･荳翫↓縲・,
  },
  {
    question: '豢ｪ豌ｴ縺ｧ霆翫′豌ｴ豐｡縲よｰｴ豺ｱ菴苗m縺ｧ霆翫・繝峨い縺碁幕縺九↑縺上↑繧具ｼ・,
    options: ['10cm', '30cm', '50cm', '100cm'],
    correct: 1,
    explanation: '豌ｴ豺ｱ30cm遞句ｺｦ縺ｧ繝峨い縺碁幕縺阪↓縺上￥縺ｪ繧翫∪縺吶よｰｴ豺ｱ50cm繧定ｶ・∴繧九→繧ｨ繝ｳ繧ｸ繝ｳ縺悟●豁｢縺励∬ｻ雁・縺ｫ髢峨§霎ｼ繧√ｉ繧後ｋ蜊ｱ髯ｺ縺後≠繧翫∪縺吶よ掠繧√・驕ｿ髮｣繧偵・,
  },
  {
    question: '轣ｽ螳ｳ莨晁ｨ繝繧､繝､繝ｫ縺ｮ逡ｪ蜿ｷ縺ｯ・・,
    options: ['110', '119', '171', '188'],
    correct: 2,
    explanation: '171・医＞縺ｪ縺・ｼ峨〒隕壹∴縺ｾ縺励ｇ縺・ゆｼ晁ｨ縺ｮ骭ｲ髻ｳ縺ｯ縲・71 竊・1 竊・閾ｪ螳・・髮ｻ隧ｱ逡ｪ蜿ｷ縲阪∝・逕溘・縲・71 竊・2 竊・逶ｸ謇九・髮ｻ隧ｱ逡ｪ蜿ｷ縲阪〒縺吶・,
  },
  {
    question: '轣ｫ轣ｽ譎ゅ∫・縺ｮ荳ｭ繧堤ｧｻ蜍輔☆繧区ｭ｣縺励＞蟋ｿ蜍｢縺ｯ・・,
    options: ['遶九▲縺ｦ襍ｰ繧・, '荳ｭ閻ｰ縺ｧ豁ｩ縺・, '蟋ｿ蜍｢繧剃ｽ弱￥縺励※騾吶≧', '蠕後ｍ蜷代″縺ｫ騾ｲ繧'],
    correct: 2,
    explanation: '辣吶・荳翫↓貅懊∪繧九◆繧√√〒縺阪ｋ縺縺大ｧｿ蜍｢繧剃ｽ弱￥縺励※蠎願ｿ代￥縺ｮ遨ｺ豌励ｒ蜷ｸ縺・↑縺後ｉ遘ｻ蜍輔＠縺ｾ縺吶よｿ｡繧後ち繧ｪ繝ｫ縺ｧ蜿｣鮠ｻ繧定ｦ・≧縺ｨ縺輔ｉ縺ｫ蜉ｹ譫懃噪縲・,
  },
  {
    question: '髱槫ｸｸ逕ｨ謖√■蜃ｺ縺苓｢九・驥阪＆縺ｮ逶ｮ螳峨・・・,
    options: ['菴馴㍾縺ｮ5%莉･荳・, '菴馴㍾縺ｮ10%莉･荳・, '菴馴㍾縺ｮ15%莉･荳・, '菴馴㍾縺ｮ20%莉･荳・],
    correct: 2,
    explanation: '菴馴㍾縺ｮ15%莉･荳九′逶ｮ螳峨〒縺吶る㍾縺吶℃繧九→驕ｿ髮｣縺ｮ螯ｨ縺偵↓縺ｪ繧翫∪縺吶ら塙諤ｧ縺ｧ10-15kg縲∝･ｳ諤ｧ縺ｧ5-10kg遞句ｺｦ繧堤岼螳峨↓縲・,
  },
  {
    question: '蝨ｰ髴・・譎ゅ√お繝ｬ繝吶・繧ｿ繝ｼ縺ｫ荵励▲縺ｦ縺・◆繧峨←縺・☆縺ｹ縺搾ｼ・,
    options: ['髱槫ｸｸ繝懊ち繝ｳ繧呈款縺・, '蜈ｨ髫弱・繝懊ち繝ｳ繧呈款縺・, '謇峨ｒ縺薙§髢九￠繧・, '縺倥▲縺ｨ蠕・▽'],
    correct: 1,
    explanation: '蜈ｨ髫弱・繝懊ち繝ｳ繧呈款縺励∵怙蛻昴↓蛛懈ｭ｢縺励◆髫弱〒髯阪ｊ縺ｾ縺励ｇ縺・る哩縺倩ｾｼ繧√ｉ繧後◆蝣ｴ蜷医・髱槫ｸｸ繝懊ち繝ｳ繧・う繝ｳ繧ｿ繝ｼ繝帙Φ縺ｧ騾｣邨｡繧偵り・蜉帙〒縺薙§髢九￠繧九・縺ｯ蜊ｱ髯ｺ縺ｧ縺吶・,
  },
  {
    question: '蜿ｰ鬚ｨ謗･霑第凾縲∫ｪ薙ぎ繝ｩ繧ｹ縺ｮ鬟帶淵髦ｲ豁｢縺ｫ譛繧ょ柑譫懃噪縺ｪ縺ｮ縺ｯ・・,
    options: ['繧ｫ繝ｼ繝・Φ繧帝哩繧√ｋ', '鬢顔函繝・・繝励ｒ雋ｼ繧・, '髮ｨ謌ｸ繧・す繝｣繝・ち繝ｼ繧帝哩繧√ｋ', '遯薙ｒ蟆代＠髢九￠繧・],
    correct: 2,
    explanation: '髮ｨ謌ｸ繧・す繝｣繝・ち繝ｼ縺梧怙繧ょ柑譫懃噪縺ｧ縺吶ゅ↑縺・ｴ蜷医・鬟帶淵髦ｲ豁｢繝輔ぅ繝ｫ繝繧・ム繝ｳ繝懊・繝ｫ縺ｧ蜀・・縺九ｉ陬懷ｼｷ縲る､顔函繝・・繝励□縺代〒縺ｯ鬟帶淵髦ｲ豁｢蜉ｹ譫懊・髯仙ｮ夂噪縺ｧ縺吶・,
  },
  {
    question: '驕ｿ髮｣謇縺ｫ謖√▲縺ｦ縺・￥縺ｹ縺阪ｂ縺ｮ縺ｨ縺励※荳埼←蛻・↑縺ｮ縺ｯ・・,
    options: ['繧ｹ繝ｪ繝・ヱ', '迴ｾ驥托ｼ亥ｰ城姦・・, '螟ｧ驥上・逹譖ｿ縺茨ｼ医せ繝ｼ繝・こ繝ｼ繧ｹ・・, '繝｢繝舌う繝ｫ繝舌ャ繝・Μ繝ｼ'],
    correct: 2,
    explanation: '驕ｿ髮｣謇縺ｮ繧ｹ繝壹・繧ｹ縺ｯ髯舌ｉ繧後※縺・∪縺吶よ怙菴朱剞縺ｮ逹譖ｿ縺茨ｼ・-2邨・ｼ峨↓縺ｨ縺ｩ繧√∝､ｧ縺阪↑闕ｷ迚ｩ縺ｯ驕ｿ縺代∪縺励ｇ縺・・,
  },
  {
    question: '縲檎音蛻･隴ｦ蝣ｱ縲阪′逋ｺ陦ｨ縺輔ｌ縺滓凾縺ｮ陦悟虚縺ｯ・・,
    options: ['騾壼ｸｸ騾壹ｊ陦悟虚縺吶ｋ', '諠・ｱ蜿朱寔縺励※蛯吶∴繧・, '逶ｴ縺｡縺ｫ蜻ｽ繧貞ｮ医ｋ陦悟虚繧貞叙繧・, '莨夂､ｾ縺ｫ逶ｸ隲・☆繧・],
    correct: 2,
    explanation: '迚ｹ蛻･隴ｦ蝣ｱ縺ｯ縲梧焚蜊∝ｹｴ縺ｫ荳蠎ｦ縺ｮ驥榊､ｧ縺ｪ蜊ｱ髯ｺ縲阪ｒ遉ｺ縺励∪縺吶ゅ◆繧√ｉ繧上★逶ｴ縺｡縺ｫ蜻ｽ繧貞ｮ医ｋ陦悟虚繧貞叙縺｣縺ｦ縺上□縺輔＞縲・,
  },
]

// ==================== HELPERS ====================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ==================== COMPONENT ====================
export function DisasterGuard() {
  const [tab, setTab] = useState<Tab>('map')
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [shelters, setShelters] = useState<Shelter[]>(SAMPLE_SHELTERS)
  const [filterType, setFilterType] = useState('縺吶∋縺ｦ')
  const [family, setFamily] = useState<FamilyMember[]>([])
  const [showFamilyForm, setShowFamilyForm] = useState(false)
  const [familyForm, setFamilyForm] = useState({ name: '', location: '', notes: '' })
  const [checklist, setChecklist] = useState<CheckItem[]>([])
  const [prefecture, setPrefecture] = useState('逾槫･亥ｷ晉恁')
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null)
  const [quizDone, setQuizDone] = useState(false)
  const [meetingPoint, setMeetingPoint] = useState('')

  // Load from localStorage
  useEffect(() => {
    try {
      const savedFamily = localStorage.getItem('disaster-guard-family')
      if (savedFamily) setFamily(JSON.parse(savedFamily))
      const savedChecklist = localStorage.getItem('disaster-guard-checklist')
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist))
      } else {
        setChecklist(DEFAULT_CHECKLIST.map(c => ({ ...c, checked: false })))
      }
      const savedMeeting = localStorage.getItem('disaster-guard-meeting')
      if (savedMeeting) setMeetingPoint(savedMeeting)
      const savedPref = localStorage.getItem('disaster-guard-prefecture')
      if (savedPref) setPrefecture(savedPref)
    } catch { /* ignore */ }
  }, [])

  const saveFamily = useCallback((f: FamilyMember[]) => {
    setFamily(f)
    localStorage.setItem('disaster-guard-family', JSON.stringify(f))
  }, [])

  const saveChecklist = useCallback((c: CheckItem[]) => {
    setChecklist(c)
    localStorage.setItem('disaster-guard-checklist', JSON.stringify(c))
  }, [])

  const saveMeetingPoint = useCallback((m: string) => {
    setMeetingPoint(m)
    localStorage.setItem('disaster-guard-meeting', m)
  }, [])

  // GPS
  const getLocation = () => {
    setGpsLoading(true)
    setGpsError('')
    if (!navigator.geolocation) {
      setGpsError('縺贋ｽｿ縺・・繝悶Λ繧ｦ繧ｶ縺ｯGPS縺ｫ蟇ｾ蠢懊＠縺ｦ縺・∪縺帙ｓ')
      setGpsLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude)
        setUserLng(pos.coords.longitude)
        setGpsLoading(false)
        // Sort shelters by distance
        const sorted = SAMPLE_SHELTERS.map(s => ({
          ...s,
          distance: calcDistance(pos.coords.latitude, pos.coords.longitude, s.lat, s.lng)
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0))
        setShelters(sorted)
      },
      (err) => {
        setGpsError(err.code === 1 ? '菴咲ｽｮ諠・ｱ縺ｮ險ｱ蜿ｯ縺悟ｿ・ｦ√〒縺・ : '菴咲ｽｮ諠・ｱ繧貞叙蠕励〒縺阪∪縺帙ｓ縺ｧ縺励◆')
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Weather alerts (豌苓ｱ｡蠎、PI)
  const fetchWeatherAlerts = async () => {
    setWeatherLoading(true)
    try {
      const res = await fetch('/api/weather-alerts?prefecture=' + encodeURIComponent(prefecture))
      if (res.ok) {
        const data = await res.json()
        setWeatherAlerts(data.alerts || [])
      } else {
        // Fallback: show no alerts
        setWeatherAlerts([])
      }
    } catch {
      setWeatherAlerts([])
    }
    setWeatherLoading(false)
    localStorage.setItem('disaster-guard-prefecture', prefecture)
  }

  // Checklist helpers
  const checklistCategories = Array.from(new Set(checklist.map(c => c.category)))
  const checkedCount = checklist.filter(c => c.checked).length
  const checkProgress = checklist.length > 0 ? Math.round((checkedCount / checklist.length) * 100) : 0

  // Quiz
  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered !== null) return
    setQuizAnswered(idx)
    if (idx === QUIZ_QUESTIONS[quizIndex].correct) {
      setQuizScore(s => s + 1)
    }
  }

  const nextQuestion = () => {
    if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
      setQuizDone(true)
    } else {
      setQuizIndex(i => i + 1)
      setQuizAnswered(null)
    }
  }

  const resetQuiz = () => {
    setQuizIndex(0)
    setQuizScore(0)
    setQuizAnswered(null)
    setQuizDone(false)
  }

  // Filtered shelters
  const filteredShelters = filterType === '縺吶∋縺ｦ' ? shelters : shelters.filter(s => s.types.includes(filterType))
  const shelterTypes = ['縺吶∋縺ｦ'].concat(Array.from(new Set(SAMPLE_SHELTERS.flatMap(s => s.types))))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">孱・・/span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                AI髦ｲ轣ｽ繝代・繧ｽ繝翫Ν繧ｬ繧､繝・              </h1>
            </div>
            <div className="text-xs text-white/40">髦ｲ陦帙す繝ｪ繝ｼ繧ｺ</div>
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

        {/* ==================== MAP TAB ==================== */}
        {tab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">亮・・繝槭う驕ｿ髮｣繝槭ャ繝・/h2>
                <p className="text-sm text-white/50">GPS縺ｧ譛蟇・ｊ縺ｮ驕ｿ髮｣謇繧呈､懃ｴ｢</p>
              </div>
              <button onClick={getLocation} disabled={gpsLoading} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                {gpsLoading ? '蜿門ｾ嶺ｸｭ...' : '桃 迴ｾ蝨ｨ蝨ｰ繧貞叙蠕・}
              </button>
            </div>

            {gpsError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">{gpsError}</div>
            )}

            {userLat && userLng && (
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 text-sm">
                <span className="text-sky-400">桃 迴ｾ蝨ｨ蝨ｰ:</span> {userLat.toFixed(4)}, {userLng.toFixed(4)}
              </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {shelterTypes.map(type => (
                <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === type ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {type}
                </button>
              ))}
            </div>

            {/* Shelter list */}
            <div className="space-y-2">
              {filteredShelters.map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        <span className="text-sky-400">鋤・・/span>
                        {s.name}
                      </div>
                      <div className="text-xs text-white/40 mt-1">{s.address}</div>
                      <div className="flex gap-1.5 mt-2">
                        {s.types.map(t => (
                          <span key={t} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                    {s.distance !== undefined && (
                      <div className="text-right shrink-0">
                        <div className={`text-lg font-bold ${s.distance < 1 ? 'text-green-400' : s.distance < 2 ? 'text-yellow-400' : 'text-white/60'}`}>
                          {s.distance < 1 ? `${Math.round(s.distance * 1000)}m` : `${s.distance.toFixed(1)}km`}
                        </div>
                        <div className="text-xs text-white/40">
                          蠕呈ｭｩ{Math.round(s.distance * 1000 / 80)}蛻・                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-400">
              笞・・驕ｿ髮｣謇繝・・繧ｿ縺ｯ繧ｵ繝ｳ繝励Ν縺ｧ縺吶よ怙譁ｰ諠・ｱ縺ｯ豬ｷ閠∝錐蟶ょ・蠑上し繧､繝医〒縺皮｢ｺ隱阪￥縺縺輔＞縲・            </div>
          </div>
        )}

        {/* ==================== FAMILY TAB ==================== */}
        {tab === 'family' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">捉窶昨汨ｩ窶昨汨ｧ 螳ｶ譌城亟轣ｽ繝励Λ繝ｳ</h2>
                <p className="text-sm text-white/50">螳ｶ譌上◎繧後◇繧後・驕ｿ髮｣險育判繧剃ｽ懈・</p>
              </div>
              <button onClick={() => setShowFamilyForm(true)} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium hover:opacity-90">+ 霑ｽ蜉</button>
            </div>

            {/* Meeting point */}
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-xs text-white/50 mb-1 block">匠 髮・粋蝣ｴ謇</label>
              <input value={meetingPoint} onChange={e => saveMeetingPoint(e.target.value)} placeholder="萓・ 豬ｷ閠∝錐荳ｭ螟ｮ蜈ｬ蝨偵・譎りｨ亥｡泌燕" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
            </div>

            {showFamilyForm && (
              <div className="bg-white/5 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm">側 螳ｶ譌上Γ繝ｳ繝舌・霑ｽ蜉</h3>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">蜷榊燕 *</label>
                  <input value={familyForm.name} onChange={e => setFamilyForm(f => ({ ...f, name: e.target.value }))} placeholder="縺顔宛縺輔ｓ" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">譎ｮ谿ｵ縺・ｋ蝣ｴ謇</label>
                  <input value={familyForm.location} onChange={e => setFamilyForm(f => ({ ...f, location: e.target.value }))} placeholder="萓・ 豬ｷ閠∝錐鬧・燕縺ｮ莨夂､ｾ" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">繝｡繝｢・域戟逞・・驟肴・莠矩・↑縺ｩ・・/label>
                  <input value={familyForm.notes} onChange={e => setFamilyForm(f => ({ ...f, notes: e.target.value }))} placeholder="萓・ 雜ｳ縺御ｸ崎・逕ｱ" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowFamilyForm(false); setFamilyForm({ name: '', location: '', notes: '' }) }} className="px-4 py-2 bg-white/5 rounded-lg text-sm">繧ｭ繝｣繝ｳ繧ｻ繝ｫ</button>
                  <button onClick={() => {
                    if (!familyForm.name.trim()) return
                    saveFamily([...family, { id: generateId(), ...familyForm }])
                    setFamilyForm({ name: '', location: '', notes: '' })
                    setShowFamilyForm(false)
                  }} disabled={!familyForm.name.trim()} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium disabled:opacity-30">菫晏ｭ・/button>
                </div>
              </div>
            )}

            {family.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center text-white/40">
                <p className="text-4xl mb-3">捉窶昨汨ｩ窶昨汨ｧ</p>
                <p className="text-sm">螳ｶ譌上Γ繝ｳ繝舌・繧堤匳骭ｲ縺励※縺上□縺輔＞</p>
                <p className="text-xs mt-1">轣ｽ螳ｳ譎ゅ・驕ｿ髮｣繝励Λ繝ｳ繧剃ｺ句燕縺ｫ菴懊▲縺ｦ縺翫″縺ｾ縺励ｇ縺・/p>
              </div>
            ) : (
              <div className="space-y-2">
                {family.map(m => (
                  <div key={m.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">側 {m.name}</div>
                        {m.location && <div className="text-xs text-white/40 mt-1">桃 {m.location}</div>}
                        {m.notes && <div className="text-xs text-amber-400 mt-1">笞・・{m.notes}</div>}
                      </div>
                      <button onClick={() => {
                        if (confirm(`${m.name}繧貞炎髯､縺励∪縺吶°・歔)) saveFamily(family.filter(f => f.id !== m.id))
                      }} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">卵</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Disaster-specific plans */}
            {family.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3">純 轣ｽ螳ｳ蛻･陦悟虚繝励Λ繝ｳ</h3>
                <div className="space-y-3">
                  {['蝨ｰ髴・, '豢ｪ豌ｴ繝ｻ蜿ｰ鬚ｨ', '轣ｫ轣ｽ'].map(disaster => (
                    <div key={disaster} className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm font-medium text-sky-400 mb-2">{disaster === '蝨ｰ髴・ ? '恕・・ : disaster === '豢ｪ豌ｴ繝ｻ蜿ｰ鬚ｨ' ? '穴' : '櫨'} {disaster}縺ｮ蝣ｴ蜷・/div>
                      {family.map(m => (
                        <div key={m.id} className="text-xs text-white/60 ml-4 mb-1">
                          窶｢ <strong>{m.name}</strong>: {m.location || '閾ｪ螳・}縺九ｉ 竊・{meetingPoint || '(髮・粋蝣ｴ謇繧定ｨｭ螳壹＠縺ｦ縺上□縺輔＞)'} 縺ｫ驕ｿ髮｣
                          {m.notes && <span className="text-amber-400"> [{m.notes}]</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== CHECKLIST TAB ==================== */}
        {tab === 'checklist' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">搭 髦ｲ轣ｽ繝√ぉ繝・け繝ｪ繧ｹ繝・/h2>
              <p className="text-sm text-white/50">蛯呵塘蜩√・謖√■蜃ｺ縺苓｢九・遒ｺ隱搾ｼ・checkedCount}/{checklist.length}・・/p>
            </div>

            {/* Progress */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>貅門ｙ騾ｲ謐・/span>
                <span className={checkProgress >= 80 ? 'text-green-400' : checkProgress >= 50 ? 'text-yellow-400' : 'text-red-400'}>{checkProgress}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${checkProgress >= 80 ? 'bg-green-500' : checkProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${checkProgress}%` }} />
              </div>
              <div className="text-xs text-white/40 mt-2">
                {checkProgress >= 80 ? '笨・蜊∝・縺ｪ貅門ｙ縺後〒縺阪※縺・∪縺呻ｼ・ : checkProgress >= 50 ? '笞・・繧ゅ≧蟆代＠蛯吶∴縺ｾ縺励ｇ縺・ : '圷 縺ｾ縺貅門ｙ縺御ｸ榊香蛻・〒縺・}
              </div>
            </div>

            {/* Checklist by category */}
            {checklistCategories.map(cat => (
              <div key={cat} className="bg-white/5 rounded-xl p-4">
                <h3 className="font-bold text-sm text-sky-400 mb-3">
                  {cat === '豌ｴ繝ｻ鬟滓侭' ? '甑' : cat === '蛹ｻ逋ゅ・陦帷函' ? '抽' : cat === '諠・ｱ繝ｻ騾｣邨｡' ? '導' : cat === '逕滓ｴｻ逕ｨ蜩・ ? '幡' : cat === '譖ｸ鬘・ ? '塘' : '誓'} {cat}
                </h3>
                <div className="space-y-2">
                  {checklist.filter(c => c.category === cat).map(item => (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={item.checked} onChange={() => {
                        saveChecklist(checklist.map(c => c.id === item.id ? { ...c, checked: !c.checked } : c))
                      }} className="w-5 h-5 rounded border-white/20 accent-sky-500" />
                      <span className={`text-sm ${item.checked ? 'text-white/30 line-through' : 'text-white/70 group-hover:text-white'}`}>{item.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== WEATHER TAB ==================== */}
        {tab === 'weather' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">笞・・豌苓ｱ｡隴ｦ蝣ｱ繝｢繝九ち繝ｼ</h2>
              <p className="text-sm text-white/50">豌苓ｱ｡蠎√・譛譁ｰ隴ｦ蝣ｱ繝ｻ豕ｨ諢丞ｱ繧堤｢ｺ隱・/p>
            </div>

            <div className="flex gap-2">
              <select value={prefecture} onChange={e => setPrefecture(e.target.value)} className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white [&>option]:bg-gray-900 [&>option]:text-white">
                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button onClick={fetchWeatherAlerts} disabled={weatherLoading} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 shrink-0">
                {weatherLoading ? '蜿門ｾ嶺ｸｭ...' : '剥 遒ｺ隱・}
              </button>
            </div>

            {weatherAlerts.length === 0 && !weatherLoading && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                <p className="text-2xl mb-2">笨・/p>
                <p className="text-sm text-green-400">迴ｾ蝨ｨ縲＋prefecture}縺ｫ逋ｺ陦ｨ荳ｭ縺ｮ隴ｦ蝣ｱ繝ｻ豕ｨ諢丞ｱ縺ｯ縺ゅｊ縺ｾ縺帙ｓ</p>
                <p className="text-xs text-white/40 mt-2">縲檎｢ｺ隱阪阪・繧ｿ繝ｳ縺ｧ譛譁ｰ諠・ｱ繧貞叙蠕励〒縺阪∪縺・/p>
              </div>
            )}

            {weatherAlerts.length > 0 && (
              <div className="space-y-2">
                {weatherAlerts.map((a, i) => (
                  <div key={i} className={`rounded-xl p-4 ${a.severity === '迚ｹ蛻･隴ｦ蝣ｱ' ? 'bg-red-500/20 border border-red-500/40' : a.severity === '隴ｦ蝣ｱ' ? 'bg-amber-500/15 border border-amber-500/30' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.severity === '迚ｹ蛻･隴ｦ蝣ｱ' ? 'bg-red-500 text-white' : a.severity === '隴ｦ蝣ｱ' ? 'bg-amber-500 text-white' : 'bg-yellow-500 text-gray-900'}`}>{a.severity}</span>
                      <span className="font-medium text-sm">{a.title}</span>
                    </div>
                    <div className="text-xs text-white/50">{a.area}</div>
                    {a.description && <div className="text-xs text-white/40 mt-1">{a.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">迫 蜈ｬ蠑乗ュ蝣ｱ繝ｪ繝ｳ繧ｯ</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.jma.go.jp/bosai/warning/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  倹 豌苓ｱ｡蠎・髦ｲ轣ｽ諠・ｱ 竊・                </a>
                <a href="https://www.river.go.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  穴 蟾昴・髦ｲ轣ｽ諠・ｱ 竊・                </a>
                <a href="https://disaportal.gsi.go.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  亮・・繝上じ繝ｼ繝峨・繝・・繝昴・繧ｿ繝ｫ 竊・                </a>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EMERGENCY TAB ==================== */}
        {tab === 'emergency' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">・ 邱頑･騾｣邨｡繧ｬ繧､繝・/h2>
              <p className="text-sm text-white/50">轣ｽ螳ｳ譎ゅ・騾｣邨｡蜈医→謇矩・/p>
            </div>

            {/* Emergency numbers */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: '110', label: '隴ｦ蟇・, color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
                { num: '119', label: '豸磯亟繝ｻ謨第･', color: 'bg-red-500/20 border-red-500/30 text-red-400' },
                { num: '171', label: '轣ｽ螳ｳ莨晁ｨ繝繧､繝､繝ｫ', color: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
                { num: '188', label: '豸郁ｲｻ閠・・繝・ヨ繝ｩ繧､繝ｳ', color: 'bg-green-500/20 border-green-500/30 text-green-400' },
              ].map(e => (
                <div key={e.num} className={`rounded-xl p-4 border ${e.color} text-center`}>
                  <div className="text-3xl font-bold">{e.num}</div>
                  <div className="text-xs mt-1">{e.label}</div>
                </div>
              ))}
            </div>

            {/* 171 Usage */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">到 轣ｽ螳ｳ莨晁ｨ繝繧､繝､繝ｫ(171)縺ｮ菴ｿ縺・婿</h3>
              <div className="space-y-3">
                <div className="bg-sky-500/10 rounded-lg p-3">
                  <div className="text-xs text-sky-400 font-bold mb-1">閥 莨晁ｨ繧帝鹸髻ｳ縺吶ｋ</div>
                  <div className="text-sm text-white/70">171 竊・1 竊・閾ｪ螳・・髮ｻ隧ｱ逡ｪ蜿ｷ 竊・莨晁ｨ繧帝鹸髻ｳ・・0遘抵ｼ・/div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <div className="text-xs text-green-400 font-bold mb-1">泙 莨晁ｨ繧貞・逕溘☆繧・/div>
                  <div className="text-sm text-white/70">171 竊・2 竊・逶ｸ謇九・髮ｻ隧ｱ逡ｪ蜿ｷ 竊・莨晁ｨ繧貞・逕・/div>
                </div>
              </div>
            </div>

            {/* Safety confirmation services */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">剥 螳牙凄遒ｺ隱阪し繝ｼ繝薙せ</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.web171.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10">
                  <div>
                    <div className="font-medium">web171</div>
                    <div className="text-xs text-white/40">NTT轣ｽ螳ｳ逕ｨ莨晁ｨ譚ｿ・・eb迚茨ｼ・/div>
                  </div>
                  <span className="text-sky-400">竊・/span>
                </a>
                <a href="https://anpi.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10">
                  <div>
                    <div className="font-medium">J-anpi</div>
                    <div className="text-xs text-white/40">螳牙凄諠・ｱ縺ｾ縺ｨ繧√※讀懃ｴ｢</div>
                  </div>
                  <span className="text-sky-400">竊・/span>
                </a>
              </div>
            </div>

            {/* Earthquake action steps */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">恕・・蝨ｰ髴・匱逕滓凾縺ｮ繧ｹ繝・ャ繝・/h3>
              <div className="space-y-2">
                {[
                  { step: '1', text: '霄ｫ縺ｮ螳牙・繧堤｢ｺ菫晢ｼ域惻縺ｮ荳九↓驕ｿ髮｣・・, time: '謠ｺ繧後※縺・ｋ髢・ },
                  { step: '2', text: '轣ｫ縺ｮ蟋区忰繝ｻ繧ｬ繧ｹ縺ｮ蜈・薙ｒ髢峨ａ繧・, time: '謠ｺ繧後′蜿弱∪縺｣縺溘ｉ' },
                  { step: '3', text: '蜃ｺ蜿｣繧堤｢ｺ菫晢ｼ医ラ繧｢繧帝幕縺代ｋ・・, time: '逶ｴ蠕・ },
                  { step: '4', text: '螳ｶ譌上・螳牙凄遒ｺ隱搾ｼ・71遲会ｼ・, time: '5蛻・ｻ･蜀・ },
                  { step: '5', text: '豁｣遒ｺ縺ｪ諠・ｱ繧貞庶髮・ｼ医Λ繧ｸ繧ｪ遲会ｼ・, time: '10蛻・ｻ･蜀・ },
                  { step: '6', text: '蠢・ｦ√↓蠢懊§縺ｦ驕ｿ髮｣謇縺ｸ遘ｻ蜍・, time: '迥ｶ豕∝愛譁ｭ' },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
                    <div className="flex-1 text-sm text-white/70">{s.text}</div>
                    <div className="text-xs text-white/30 shrink-0">{s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== QUIZ TAB ==================== */}
        {tab === 'quiz' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">当 髦ｲ轣ｽ遏･隴倥け繧､繧ｺ</h2>
              <p className="text-sm text-white/50">蜈ｨ{QUIZ_QUESTIONS.length}蝠・窶・豁｣縺励＞陦悟虚繧貞ｭｦ縺ｼ縺・/p>
            </div>

            {quizDone ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">{quizScore >= 8 ? '醇' : quizScore >= 5 ? '総' : '答'}</div>
                <h3 className="text-2xl font-bold mb-2">{quizScore} / {QUIZ_QUESTIONS.length} 蝠乗ｭ｣隗｣</h3>
                <p className="text-sm text-white/50 mb-6">
                  {quizScore >= 8 ? '邏譎ｴ繧峨＠縺・ｼ・亟轣ｽ遏･隴倥・蜊∝・縺ｧ縺吶・ : quizScore >= 5 ? '縺ｾ縺壹∪縺壹〒縺吶る俣驕輔∴縺溷撫鬘後ｒ蠕ｩ鄙偵＠縺ｾ縺励ｇ縺・・ : '髦ｲ轣ｽ遏･隴倥ｒ隕狗峩縺励∪縺励ｇ縺・ゅ％縺ｮ繧ｯ繧､繧ｺ繧堤ｹｰ繧願ｿ斐☆縺薙→縺悟､ｧ莠九〒縺吶・}
                </p>
                <button onClick={resetQuiz} className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium">繧ゅ≧荳蠎ｦ繝√Ε繝ｬ繝ｳ繧ｸ</button>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-white/40">{quizIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                </div>

                {/* Question */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Q{quizIndex + 1}. {QUIZ_QUESTIONS[quizIndex].question}</h3>
                  <div className="space-y-2">
                    {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => {
                      let style = 'bg-white/5 border border-white/10 hover:border-sky-500/50'
                      if (quizAnswered !== null) {
                        if (i === QUIZ_QUESTIONS[quizIndex].correct) style = 'bg-green-500/20 border border-green-500/50'
                        else if (i === quizAnswered) style = 'bg-red-500/20 border border-red-500/50'
                        else style = 'bg-white/5 border border-white/5 opacity-50'
                      }
                      return (
                        <button key={i} onClick={() => handleQuizAnswer(i)} disabled={quizAnswered !== null} className={`w-full text-left p-3 rounded-xl text-sm transition-all ${style}`}>
                          <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                          {opt}
                          {quizAnswered !== null && i === QUIZ_QUESTIONS[quizIndex].correct && <span className="float-right">笨・/span>}
                          {quizAnswered === i && i !== QUIZ_QUESTIONS[quizIndex].correct && <span className="float-right">笶・/span>}
                        </button>
                      )
                    })}
                  </div>

                  {quizAnswered !== null && (
                    <div className="mt-4 bg-sky-500/10 border border-sky-500/30 rounded-xl p-3">
                      <div className="text-xs text-sky-400 font-bold mb-1">庁 隗｣隱ｬ</div>
                      <div className="text-sm text-white/70">{QUIZ_QUESTIONS[quizIndex].explanation}</div>
                    </div>
                  )}

                  {quizAnswered !== null && (
                    <button onClick={nextQuestion} className="mt-4 w-full py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium">
                      {quizIndex + 1 >= QUIZ_QUESTIONS.length ? '邨先棡繧定ｦ九ｋ' : '谺｡縺ｮ蝠城｡後∈ 竊・}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">
          窶ｻ 譛ｬ繝・・繝ｫ縺ｯ髦ｲ轣ｽ縺ｮ莠句燕貅門ｙ繝ｻ蟄ｦ鄙呈髪謠ｴ繧堤岼逧・→縺励※縺・∪縺吶ら⊃螳ｳ逋ｺ逕滓凾縺ｯ閾ｪ豐ｻ菴薙・豌苓ｱ｡蠎√・蜈ｬ蠑乗ュ蝣ｱ縺ｫ蠕薙▲縺ｦ縺上□縺輔＞縲・        </p>
      </div>
    
      </div>
  )
}


