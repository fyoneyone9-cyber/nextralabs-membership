'use client'


import { useState, useCallback, useEffect, useRef } from 'react'

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
interface BetRecord {
  id: string
  date: string
  type: string
  betAmount: number
  returnAmount: number
  note: string
}

interface BiasQuiz {
  id: string
  name: string
  scenario: string
  options: { text: string; isBias: boolean; explanation: string }[]
}

// 笏笏笏 Data 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const gamblingTypes = [
  { name: '遶ｶ鬥ｬ', returnRate: 0.75, icon: '順' },
  { name: '遶ｶ濶・, returnRate: 0.75, icon: '圖' },
  { name: '遶ｶ霈ｪ', returnRate: 0.75, icon: '垓' },
  { name: '繧ｪ繝ｼ繝医Ξ繝ｼ繧ｹ', returnRate: 0.70, icon: '庶・・ },
  { name: '繝代メ繝ｳ繧ｳ', returnRate: 0.85, icon: '鴫' },
  { name: '繝代メ繧ｹ繝ｭ', returnRate: 0.85, icon: '鴫' },
  { name: '螳昴￥縺・, returnRate: 0.46, icon: '辞' },
  { name: 'toto/BIG', returnRate: 0.50, icon: '笞ｽ' },
  { name: '繧ｫ繧ｸ繝・BJ)', returnRate: 0.985, icon: 'ワ' },
  { name: '繧ｫ繧ｸ繝・繝ｫ繝ｼ繝ｬ繝・ヨ)', returnRate: 0.947, icon: '治' },
  { name: '繧ｫ繧ｸ繝・繧ｹ繝ｭ繝・ヨ)', returnRate: 0.90, icon: '鴫' },
  { name: '繧ｪ繝ｳ繝ｩ繧､繝ｳ繧ｫ繧ｸ繝・, returnRate: 0.95, icon: '捗' },
]

const sogsQuestions = [
  { id: 's1', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｧ雋縺代◆縺ｨ縺阪∬ｲ縺代◆蛻・ｒ蜿悶ｊ謌ｻ縺昴≧縺ｨ縺励※蜀榊ｺｦ繧ｮ繝｣繝ｳ繝悶Ν繧偵＠縺ｾ縺励◆縺具ｼ・, weight: 1 },
  { id: 's2', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｧ蜍昴▲縺溘→縺阪√ｂ縺｣縺ｨ蜍昴■縺溘＞縺ｨ諤昴▲縺ｦ邯壹￠縺ｾ縺励◆縺具ｼ・, weight: 1 },
  { id: 's3', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｫ菴ｿ縺・♀驥代ｒ蠅励ｄ縺励※縺・▲縺溽ｵ碁ｨ薙′縺ゅｊ縺ｾ縺吶°・・, weight: 1 },
  { id: 's4', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｮ縺薙→繧定・∴繧九→關ｽ縺｡逹縺九↑縺・√う繝ｩ繧､繝ｩ縺吶ｋ縺薙→縺後≠繧翫∪縺吶°・・, weight: 1 },
  { id: 's5', text: '繧ｹ繝医Ξ繧ｹ繧・ｫ後↑縺薙→縺九ｉ騾・￡繧九◆繧√↓繧ｮ繝｣繝ｳ繝悶Ν繧偵＠縺溘％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 1 },
  { id: 's6', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｮ縺溘ａ縺ｫ蝌倥ｒ縺､縺・◆縺薙→縺後≠繧翫∪縺吶°・・, weight: 2 },
  { id: 's7', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｮ縺溘ａ縺ｫ縺企≡繧貞溘ｊ縺溘％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 2 },
  { id: 's8', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｮ縺溘ａ縺ｫ螟ｧ蛻・↑莠ｺ髢馴未菫ゅｒ螟ｱ縺｣縺溘ｊ縲∝些縺・￥縺ｪ縺｣縺溘％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 2 },
  { id: 's9', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｮ縺溘ａ縺ｫ莉穂ｺ九ｄ蟄ｦ讌ｭ縺ｫ謾ｯ髫懊′蜃ｺ縺溘％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 2 },
  { id: 's10', text: '繧ｮ繝｣繝ｳ繝悶Ν繧偵ｄ繧√ｈ縺・→諤昴▲縺ｦ繧ゅ√ｄ繧√ｉ繧後↑縺九▲縺溘％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 2 },
  { id: 's11', text: '逕滓ｴｻ雋ｻ繧・滄≡縺ｮ霑疲ｸ医↓菴ｿ縺・∋縺阪♀驥代ｒ繧ｮ繝｣繝ｳ繝悶Ν縺ｫ菴ｿ縺｣縺溘％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 2 },
  { id: 's12', text: '繧ｮ繝｣繝ｳ繝悶Ν縺ｮ縺薙→縺ｧ螳ｶ譌上ｄ蜿倶ｺｺ縺ｫ蠢・・繧偵°縺代◆縺薙→縺後≠繧翫∪縺吶°・・, weight: 1 },
  { id: 's13', text: '繧ｮ繝｣繝ｳ繝悶Ν繧偵＠縺ｦ縺・↑縺・→縺阪∵ｬ｡縺ｫ縺・▽繧ｮ繝｣繝ｳ繝悶Ν縺後〒縺阪ｋ縺玖・∴縺ｦ縺・∪縺吶°・・, weight: 1 },
  { id: 's14', text: '1蝗槭・繧ｮ繝｣繝ｳ繝悶Ν縺ｫ菴ｿ縺・≡鬘阪′縲∬・蛻・・譛亥庶縺ｮ10%繧定ｶ・∴繧九％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 2 },
  { id: 's15', text: '繧ｮ繝｣繝ｳ繝悶Ν雉・≡縺ｮ縺溘ａ縺ｫ繧ｯ繝ｬ繧ｸ繝・ヨ繧ｫ繝ｼ繝峨・繧ｭ繝｣繝・す繝ｳ繧ｰ繧剃ｽｿ縺｣縺溘％縺ｨ縺後≠繧翫∪縺吶°・・, weight: 2 },
]

const biasQuizzes: BiasQuiz[] = [
  {
    id: 'b1', name: '繧ｮ繝｣繝ｳ繝悶Λ繝ｼ縺ｮ隱､隰ｬ',
    scenario: '繝ｫ繝ｼ繝ｬ繝・ヨ縺ｧ5蝗樣｣邯壹瑚ｵ､縲阪′蜃ｺ縺ｾ縺励◆縲よｬ｡縺ｫ雉ｭ縺代ｋ縺ｪ繧会ｼ・,
    options: [
      { text: '縲碁ｻ偵阪↓雉ｭ縺代ｋ縲・蝗槭ｂ襍､縺檎ｶ壹＞縺溘°繧峨∵ｬ｡縺ｯ鮟偵′蜃ｺ繧九・縺・, isBias: true, explanation: '縲後ぐ繝｣繝ｳ繝悶Λ繝ｼ縺ｮ隱､隰ｬ縲阪〒縺吶ゅΝ繝ｼ繝ｬ繝・ヨ縺ｮ蜷・屓縺ｯ迢ｬ遶九＠縺滉ｺ玖ｱ｡縲る℃蜴ｻ縺ｮ邨先棡縺ｯ谺｡縺ｮ邨先棡縺ｫ蠖ｱ髻ｿ縺励∪縺帙ｓ縲りｵ､縺悟・繧狗｢ｺ邇・・蟶ｸ縺ｫ邏・7.4%縺ｧ縺吶・ },
      { text: '襍､縺ｧ繧るｻ偵〒繧ら｢ｺ邇・・蜷後§縲ゅ←縺｡繧峨〒繧ゅ＞縺・, isBias: false, explanation: '豁｣隗｣縺ｧ縺呻ｼ∝推蝗槭・迢ｬ遶倶ｺ玖ｱ｡縺ｪ縺ｮ縺ｧ縲・℃蜴ｻ縺ｮ邨先棡縺ｫ髢｢菫ゅ↑縺冗｢ｺ邇・・荳螳壹〒縺吶・ },
    ],
  },
  {
    id: 'b2', name: '繝九い繝溘せ蜉ｹ譫・,
    scenario: '繝代メ繧ｹ繝ｭ縺ｧ縲・77縲阪ｒ迢吶＞縲√・76縲阪〒豁｢縺ｾ繧翫∪縺励◆縲ゅ←縺・─縺倥ｋ・・,
    options: [
      { text: '諠懊＠縺・ｼ√ｂ縺・ｰ代＠縺ｧ蠖薙◆繧翫□縺｣縺溘よｬ｡縺薙◎蠖薙◆繧九°繧・, isBias: true, explanation: '縲後ル繧｢繝溘せ蜉ｹ譫懊阪〒縺吶ゅ梧・縺励°縺｣縺溘阪→諢溘§縺ｾ縺吶′縲・76縺ｨ700縺ｯ謨ｰ蟄ｦ逧・↓蜷後§縲後ワ繧ｺ繝ｬ縲阪〒縺吶ゅせ繝ｭ繝・ヨ縺ｯ豈主屓繝ｪ繧ｻ繝・ヨ縺輔ｌ繧九・縺ｧ縲√梧ｬ｡縺薙◎縲阪・譬ｹ諡縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・ },
      { text: '繝上ぜ繝ｬ縺ｯ繝上ぜ繝ｬ縲・77莉･螟悶・蜈ｨ縺ｦ蜷後§邨先棡', isBias: false, explanation: '豁｣隗｣・√ル繧｢繝溘せ縺ｫ迚ｹ蛻･縺ｪ諢丞袖縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲らｵ先棡縺ｯ縲悟ｽ薙◆繧翫阪°縲後ワ繧ｺ繝ｬ縲阪・2縺､縺縺代〒縺吶・ },
    ],
  },
  {
    id: 'b3', name: '繧ｵ繝ｳ繧ｯ繧ｳ繧ｹ繝磯険隱､',
    scenario: '莉頑律繝代メ繝ｳ繧ｳ縺ｧ3荳・・雋縺代※縺・∪縺吶ゅ≠縺ｨ1荳・・縺ゅｌ縺ｰ蜿悶ｊ謌ｻ縺帙◎縺・↑豌励′縺吶ｋ窶ｦ',
    options: [
      { text: '縺薙％縺ｧ豁｢繧√◆繧・荳・・縺後Β繝縺ｫ縺ｪ繧九ゅｂ縺・荳・・縺縺鯛ｦ', isBias: true, explanation: '縲後し繝ｳ繧ｯ繧ｳ繧ｹ繝磯険隱､縲阪〒縺吶ゅ☆縺ｧ縺ｫ螟ｱ縺｣縺・荳・・縺ｯ謌ｻ繧翫∪縺帙ｓ縲りｿｽ蜉縺ｮ1荳・・繧定ｳｭ縺代ｋ縺九←縺・°縺ｯ縲√◎縺ｮ1荳・・縺縺代〒蛻､譁ｭ縺吶∋縺阪〒縺吶ゅ悟叙繧頑綾縺吶阪◆繧√↓霑ｽ蜉謚募・縺吶ｋ縺ｮ縺梧怙繧ょ些髯ｺ縺ｪ繝代ち繝ｼ繝ｳ縺ｧ縺吶・ },
      { text: '螟ｱ縺｣縺・荳・・縺ｯ謌ｻ繧峨↑縺・ゅ％繧御ｻ･荳翫・謳榊､ｱ繧帝亟縺舌◆繧√↓豁｢繧√ｋ', isBias: false, explanation: '豁｣隗｣・√梧錐蛻・ｊ縲阪・謚戊ｳ・〒繧ゅぐ繝｣繝ｳ繝悶Ν縺ｧ繧よ怙繧る㍾隕√↑繧ｹ繧ｭ繝ｫ縺ｧ縺吶・ },
    ],
  },
  {
    id: 'b4', name: '遒ｺ險ｼ繝舌う繧｢繧ｹ',
    scenario: '蜿倶ｺｺ縺後後≠縺ｮ鬥ｬ縺ｯ髮ｨ縺ｮ譌･縺ｫ蠑ｷ縺・阪→險縺｣縺ｦ縺・∪縺吶ょｮ滄圀縺ｫ髮ｨ縺ｮ譌･縺ｮ繝ｬ繝ｼ繧ｹ縺ｧ蜍昴■縺ｾ縺励◆縲・,
    options: [
      { text: '繧・▲縺ｱ繧企岑縺ｫ蠑ｷ縺・ｦｬ縺・∵ｬ｡縺ｮ髮ｨ縺ｮ繝ｬ繝ｼ繧ｹ縺ｧ繧りｳｭ縺代ｈ縺・, isBias: true, explanation: '縲檎｢ｺ險ｼ繝舌う繧｢繧ｹ縲阪〒縺吶る岑縺ｮ譌･縺ｫ蜍昴▲縺溯ｨ俶・縺ｯ谿九ｊ繧・☆縺・〒縺吶′縲・岑縺ｮ譌･縺ｫ雋縺代◆繝ｬ繝ｼ繧ｹ縺ｯ蠢倥ｌ縺後■縲ょ・繝ｬ繝ｼ繧ｹ縺ｮ邨ｱ險医ｒ隕九↑縺・→蛻､譁ｭ縺ｧ縺阪∪縺帙ｓ縲・ },
      { text: '1蝗槭□縺代〒縺ｯ蛻､譁ｭ縺ｧ縺阪↑縺・ょ・繝ｬ繝ｼ繧ｹ縺ｮ繝・・繧ｿ繧定ｦ九ｋ蠢・ｦ√′縺ゅｋ', isBias: false, explanation: '豁｣隗｣・∝ｰ代↑縺・し繝ｳ繝励Ν縺九ｉ豕募援繧定ｦ句・縺吶・縺ｯ蜊ｱ髯ｺ縺ｧ縺吶・ },
    ],
  },
  {
    id: 'b5', name: '繧ｳ繝ｳ繝医Ο繝ｼ繝ｫ骭ｯ隕・,
    scenario: '遶ｶ鬥ｬ縺ｧ閾ｪ蛻・↑繧翫・縲悟ｿ・享豕輔阪ｒ隕九▽縺代◆豌励′縺励∪縺吶る℃蜴ｻ5繝ｬ繝ｼ繧ｹ荳ｭ4蝗槫ｽ薙◆繧翫∪縺励◆縲・,
    options: [
      { text: '閾ｪ蛻・・蛻・梵蜉帙〒蜍昴※繧九ゅ％縺ｮ譁ｹ豕輔ｒ邯壹￠繧後・螳牙ｮ壹＠縺ｦ遞ｼ縺偵ｋ', isBias: true, explanation: '縲後さ繝ｳ繝医Ο繝ｼ繝ｫ骭ｯ隕壹阪〒縺吶・蝗樔ｸｭ4蝗槭・逧・ｸｭ縺ｯ邨ｱ險育噪縺ｫ蛛ｶ辟ｶ縺ｮ遽・峇蜀・らｫｶ鬥ｬ縺ｮ謗ｧ髯､邇・5%縺ｯ髟ｷ譛溽噪縺ｫ蠢・★蜉ｹ縺・※縺阪∪縺吶ゅ・繝ｭ縺ｮ莠域Φ蟶ｫ縺ｧ繧ょｹｴ髢灘庶謾ｯ縺後・繝ｩ繧ｹ縺ｮ莠ｺ縺ｯ縺斐￥繧上★縺九〒縺吶・ },
      { text: '5蝗槭・蟆代↑縺吶℃繧九し繝ｳ繝励Ν縲よ而髯､邇・5%縺後≠繧倶ｻ･荳翫・聞譛溽噪縺ｫ縺ｯ雋縺代ｋ', isBias: false, explanation: '豁｣隗｣・∫洒譛溘・蜍昴■縺ｫ諠代ｏ縺輔ｌ縺壹∵焚蟄ｦ逧・↑譛溷ｾ・､縺ｧ蛻､譁ｭ縺吶ｋ縺薙→縺悟､ｧ蛻・〒縺吶・ },
    ],
  },
  {
    id: 'b6', name: '謳榊､ｱ蝗樣∩繝舌う繧｢繧ｹ',
    scenario: 'A: 遒ｺ螳溘↓5,000蜀・ｂ繧峨∴繧九・: 50%縺ｮ遒ｺ邇・〒15,000蜀・ｂ繧峨∴繧九′縲・0%縺ｮ遒ｺ邇・〒0蜀・・,
    options: [
      { text: 'A繧帝∈縺ｶ・育｢ｺ螳溘↑5,000蜀・ｼ・, isBias: false, explanation: 'A縺ｮ譛溷ｾ・､縺ｯ5,000蜀・。縺ｮ譛溷ｾ・､縺ｯ7,500蜀・よ焚蟄ｦ逧・↓縺ｯB縺梧怏蛻ｩ縺ｧ縺吶′縲、繧帝∈縺ｶ縺ｮ縺ｯ縲梧錐螟ｱ蝗樣∩縲阪→縺励※蜷育炊逧・↑蛻､譁ｭ縺ｧ繧ゅ≠繧翫∪縺吶ゅぐ繝｣繝ｳ繝悶Ν縺ｧ縺ｯ縺薙・蠢・炊縺後瑚ｲ縺代ｒ蜿悶ｊ謌ｻ縺吶◆繧√↓螟ｧ縺阪￥雉ｭ縺代ｋ縲肴婿蜷代↓謔ｪ逕ｨ縺輔ｌ縺ｾ縺吶・ },
      { text: 'B繧帝∈縺ｶ・域悄蠕・､縺ｯB縺碁ｫ倥＞・・, isBias: false, explanation: '謨ｰ蟄ｦ逧・↓縺ｯ豁｣縺励＞蛻､譁ｭ縺ｧ縺吶ゅ◆縺縺励√ぐ繝｣繝ｳ繝悶Ν縺ｧ縺ｯ縲梧悄蠕・､縺碁ｫ倥＞・晉｢ｺ螳溘↓蜍昴※繧九阪〒縺ｯ縺ｪ縺・％縺ｨ縺ｫ豕ｨ諢上・ },
    ],
  },
]

const consultationGuide = [
  { name: '繧ｮ繝｣繝ｳ繝悶Ν萓晏ｭ倡裸縺ｮ蜈ｨ蝗ｽ逶ｸ隲・ム繧､繝､繝ｫ', phone: '0120-977-556', desc: '辟｡譁吶・遘伜ｯ・宍螳医よ悽莠ｺ縺縺代〒縺ｪ縺丞ｮｶ譌上°繧峨・逶ｸ隲・ｂOK', hours: '譛医憺≡ 10:00縲・7:00', icon: '到' },
  { name: '邊ｾ逾樔ｿ晏▼遖冗･峨そ繝ｳ繧ｿ繝ｼ', phone: '蜷・・驕灘ｺ懃恁縺ｮ逡ｪ蜿ｷ', desc: '驛ｽ驕灘ｺ懃恁縺斐→縺ｮ逶ｸ隲・ｪ灘哨縲ょｯｾ髱｢逶ｸ隲・ｂ蜿ｯ閭ｽ', hours: '蟷ｳ譌･ 9:00縲・7:00', icon: '唱' },
  { name: 'GA・医ぐ繝｣繝ｳ繝悶Λ繝ｼ繧ｺ繝ｻ繧｢繝弱ル繝槭せ・・, phone: 'https://www.gajapan.jp/', desc: '蠖謎ｺ玖・酔螢ｫ縺ｮ繝溘・繝・ぅ繝ｳ繧ｰ縲ょ・蝗ｽ蜷・慍縺ｧ髢句ぎ縲ょ諺蜷榊盾蜉OK', hours: '蜷・慍蝓溘↓繧医ｋ', icon: '､・ },
  { name: '繧ｮ繝｣繝槭ヮ繝ｳ・亥ｮｶ譌上・莨夲ｼ・, phone: 'https://www.gam-anon.jp/', desc: '繧ｮ繝｣繝ｳ繝悶Ν萓晏ｭ倡裸閠・・螳ｶ譌上・縺溘ａ縺ｮ閾ｪ蜉ｩ繧ｰ繝ｫ繝ｼ繝・, hours: '蜷・慍蝓溘↓繧医ｋ', icon: '捉窶昨汨ｩ窶昨汨ｦ' },
  { name: '譌･譛ｬ蜿ｸ豕墓髪謠ｴ繧ｻ繝ｳ繧ｿ繝ｼ・域ｳ輔ユ繝ｩ繧ｹ・・, phone: '0570-078374', desc: '蛟滄≡蝠城｡後・豕慕噪逶ｸ隲・り・蟾ｱ遐ｴ逕｣繝ｻ蛯ｵ蜍呎紛逅・・繧｢繝峨ヰ繧､繧ｹ', hours: '蟷ｳ譌･ 9:00縲・1:00 / 蝨・9:00縲・7:00', icon: '笞厄ｸ・ },
  { name: '繧医ｊ縺昴＞繝帙ャ繝医Λ繧､繝ｳ', phone: '0120-279-338', desc: '逕滓ｴｻ蜈ｨ闊ｬ縺ｮ蝗ｰ繧翫＃縺ｨ逶ｸ隲・・4譎る俣蟇ｾ蠢・, hours: '24譎る俣', icon: '町' },
]

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
export default function MoneyGuard() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'expected' | 'sogs' | 'ifsaved' | 'bias' | 'help'>('tracker')

  // Tracker state
  const [records, setRecords] = useState<BetRecord[]>([])
  const [newRecord, setNewRecord] = useState({ type: '遶ｶ鬥ｬ', betAmount: '', returnAmount: '', note: '' })

  // SOGS state
  const [sogsAnswers, setSogsAnswers] = useState<Record<string, boolean>>({})
  const [sogsResult, setSogsResult] = useState<{ score: number; level: string; description: string; advice: string[] } | null>(null)

  // If-saved state
  const [savedInput, setSavedInput] = useState({ monthly: '', years: '' })

  // Bias state
  const [biasIndex, setBiasIndex] = useState(0)
  const [biasAnswered, setBiasAnswered] = useState(false)
  const [biasScore, setBiasScore] = useState(0)
  const [biasComplete, setBiasComplete] = useState(false)

  const tabs = [
    { id: 'tracker' as const, label: '投 蜿取髪繝医Λ繝・き繝ｼ' },
    { id: 'expected' as const, label: 'ｧｮ 譛溷ｾ・､險育ｮ玲ｩ・ },
    { id: 'sogs' as const, label: 'ｧ 萓晏ｭ伜ｺｦ繝√ぉ繝・け' },
    { id: 'ifsaved' as const, label: '腸 繧ゅ＠雋ｯ驥代＠縺ｦ縺溘ｉ' },
    { id: 'bias' as const, label: '識 隱咲衍繝舌う繧｢繧ｹ險ｺ譁ｭ' },
    { id: 'help' as const, label: '唱 逶ｸ隲・ｪ灘哨' },
  ]

  // Load records from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('moneyguard-records')
      if (saved) setRecords(JSON.parse(saved))
    } catch {}
  }, [])

  // Save records
  useEffect(() => {
    if (records.length > 0) localStorage.setItem('moneyguard-records', JSON.stringify(records))
  }, [records])

  // Tracker logic
  const addRecord = useCallback(() => {
    const bet = Number(newRecord.betAmount)
    const ret = Number(newRecord.returnAmount)
    if (!bet) return
    const record: BetRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newRecord.type,
      betAmount: bet,
      returnAmount: ret || 0,
      note: newRecord.note,
    }
    setRecords(prev => [record, ...prev])
    setNewRecord({ type: newRecord.type, betAmount: '', returnAmount: '', note: '' })
  }, [newRecord])

  const totalBet = records.reduce((s, r) => s + r.betAmount, 0)
  const totalReturn = records.reduce((s, r) => s + r.returnAmount, 0)
  const totalProfit = totalReturn - totalBet
  const winRate = records.length > 0 ? Math.round(records.filter(r => r.returnAmount > r.betAmount).length / records.length * 100) : 0

  // SOGS logic
  const calcSogs = useCallback(() => {
    let score = 0
    sogsQuestions.forEach(q => {
      if (sogsAnswers[q.id]) score += q.weight
    })
    let level = '', description = '', advice: string[] = []
    if (score <= 2) {
      level = '泙 蝠城｡後↑縺・; description = '迴ｾ譎らせ縺ｧ繧ｮ繝｣繝ｳ繝悶Ν縺ｫ髢｢縺吶ｋ蝠城｡後・隕九ｉ繧後∪縺帙ｓ縲・
      advice = ['莉翫・迥ｶ諷九ｒ邯ｭ謖√＠縺ｾ縺励ｇ縺・, '莠育ｮ励ｒ豎ｺ繧√※讌ｽ縺励・遞句ｺｦ縺ｫ']
    } else if (score <= 5) {
      level = '泯 隕∵ｳｨ諢・; description = '繧ｮ繝｣繝ｳ繝悶Ν縺ｨ縺ｮ莉倥″蜷医＞譁ｹ縺ｫ蟆代＠豕ｨ諢上′蠢・ｦ√〒縺吶・
      advice = ['繧ｮ繝｣繝ｳ繝悶Ν縺ｫ菴ｿ縺・ｺ育ｮ励・荳企剞繧呈ｱｺ繧√ｋ', '雋縺代ｒ蜿悶ｊ謌ｻ縺昴≧縺ｨ縺励↑縺・, '1繝ｶ譛医・蜿取髪繧定ｨ倬鹸縺励※縺ｿ繧・]
    } else if (score <= 10) {
      level = '泛 蜊ｱ髯ｺ蝓・; description = '繧ｮ繝｣繝ｳ繝悶Ν萓晏ｭ倥・蛯ｾ蜷代′隕九ｉ繧後∪縺吶ょｰる摩螳ｶ縺ｸ縺ｮ逶ｸ隲・ｒ縺翫☆縺吶ａ縺励∪縺吶・
      advice = ['邊ｾ逾樔ｿ晏▼遖冗･峨そ繝ｳ繧ｿ繝ｼ縺ｫ逶ｸ隲・☆繧・, '菫｡鬆ｼ縺ｧ縺阪ｋ莠ｺ縺ｫ迴ｾ迥ｶ繧定ｩｱ縺・, '繧ｮ繝｣繝ｳ繝悶Ν雉・≡縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ繧貞宛髯舌☆繧・, 'GA縺ｮ繝溘・繝・ぅ繝ｳ繧ｰ縺ｫ蜿ょ刈縺励※縺ｿ繧・]
    } else {
      level = '閥 豺ｱ蛻ｻ'; description = '繧ｮ繝｣繝ｳ繝悶Ν萓晏ｭ倡裸縺ｮ蜿ｯ閭ｽ諤ｧ縺碁ｫ倥＞縺ｧ縺吶ゅ〒縺阪ｋ縺縺第掠縺丞ｰる摩螳ｶ縺ｫ逶ｸ隲・＠縺ｦ縺上□縺輔＞縲・
      advice = ['莉翫☆縺千嶌隲・ム繧､繝､繝ｫ・・120-977-556・峨↓髮ｻ隧ｱ縺吶ｋ', '邊ｾ逾樒ｧ代・蠢・凾蜀・ｧ代ｒ蜿苓ｨｺ縺吶ｋ', '繧ｯ繝ｬ繧ｸ繝・ヨ繧ｫ繝ｼ繝峨ｄ繧ｭ繝｣繝・す繝･繧ｫ繝ｼ繝峨ｒ螳ｶ譌上↓鬆舌￠繧・, '蛟滄≡縺後≠繧句ｴ蜷医・豕輔ユ繝ｩ繧ｹ・・570-078374・峨↓逶ｸ隲・]
    }
    setSogsResult({ score, level, description, advice })
  }, [sogsAnswers])

  // If-saved calculation
  const monthlySaved = Number(savedInput.monthly) || 0
  const yearsSaved = Number(savedInput.years) || 0
  const totalSaved = monthlySaved * yearsSaved * 12
  const investReturn3 = Math.round(monthlySaved * 12 * yearsSaved * 1.05) // 蟷ｴ蛻ｩ5%縺ｮ邁｡譏楢ｨ育ｮ・  const investReturn5 = Math.round(monthlySaved * 12 * yearsSaved * 1.07) // 蟷ｴ蛻ｩ7%

  // More accurate compound interest
  const compoundCalc = (monthly: number, years: number, rate: number) => {
    let total = 0
    const monthlyRate = rate / 12
    const months = years * 12
    for (let i = 0; i < months; i++) {
      total = (total + monthly) * (1 + monthlyRate)
    }
    return Math.round(total)
  }
  const compound5 = compoundCalc(monthlySaved, yearsSaved, 0.05)
  const compound7 = compoundCalc(monthlySaved, yearsSaved, 0.07)

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">腸</div>
          <h1 className="text-2xl font-bold">AI螳ｶ險磯亟陦帙す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</h1>
          <p className="text-gray-400 mt-1">蜿取髪繝医Λ繝・き繝ｼ ﾃ・譛溷ｾ・､險育ｮ・ﾃ・萓晏ｭ伜ｺｦ繝√ぉ繝・け</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* 笏笏笏 Tracker Tab 笏笏笏 */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">投 繧ｮ繝｣繝ｳ繝悶Ν蜿取髪繝医Λ繝・き繝ｼ</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">邏ｯ險域兜蜈･</div>
                <div className="text-xl font-bold text-amber-400">ﾂ･{totalBet.toLocaleString()}</div>
              </div>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">邏ｯ險亥屓蜿・/div>
                <div className="text-xl font-bold text-blue-400">ﾂ･{totalReturn.toLocaleString()}</div>
              </div>
              <div className={`bg-[#13131e] rounded-xl border p-4 text-center ${totalProfit >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <div className="text-xs text-gray-500 mb-1">邏ｯ險域錐逶・/div>
                <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}ﾂ･{totalProfit.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">蜍晉紫</div>
                <div className="text-xl font-bold text-gray-300">{winRate}%</div>
              </div>
            </div>

            {/* Add Record */}
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-4">統 險倬鹸繧定ｿｽ蜉</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">遞ｮ鬘・/label>
                  <select value={newRecord.type} onChange={e => setNewRecord(r => ({ ...r, type: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                    {gamblingTypes.map(g => <option key={g.name}>{g.icon} {g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">雉ｭ縺代◆鬘・/label>
                  <input type="number" placeholder="10000" value={newRecord.betAmount} onChange={e => setNewRecord(r => ({ ...r, betAmount: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">謌ｻ縺｣縺ｦ縺阪◆鬘・/label>
                  <input type="number" placeholder="0" value={newRecord.returnAmount} onChange={e => setNewRecord(r => ({ ...r, returnAmount: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="flex items-end">
                  <button onClick={addRecord} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors">霑ｽ蜉</button>
                </div>
              </div>
            </div>

            {/* Records */}
            {records.length > 0 && (
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold mb-4">搭 險倬鹸荳隕ｧ・育峩霑・0莉ｶ・・/h3>
                <div className="space-y-2">
                  {records.slice(0, 20).map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{r.date}</span>
                        <span>{r.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-400">-ﾂ･{r.betAmount.toLocaleString()}</span>
                        <span className="text-blue-400">+ﾂ･{r.returnAmount.toLocaleString()}</span>
                        <span className={`font-bold ${r.returnAmount - r.betAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {r.returnAmount - r.betAmount >= 0 ? '+' : ''}ﾂ･{(r.returnAmount - r.betAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Expected Value Tab 笏笏笏 */}
        {activeTab === 'expected' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">ｧｮ 譛溷ｾ・､險育ｮ玲ｩ・/h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              笞・・譛溷ｾ・､縺ｨ縺ｯ縲悟､ｧ驥上↓郢ｰ繧願ｿ斐＠縺溘→縺阪∝ｹｳ蝮・噪縺ｫ縺・￥繧画綾縺｣縺ｦ縺上ｋ縺九阪・謨ｰ蟄ｦ逧・↑蛟､縺ｧ縺吶・br />
              驍・・邇・′100%譛ｪ貅 = 髟ｷ譛溽噪縺ｫ縺ｯ蠢・★雋縺代ｋ縺薙→繧呈э蜻ｳ縺励∪縺吶・            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gamblingTypes.map(g => {
                const loss = Math.round((1 - g.returnRate) * 10000)
                return (
                  <div key={g.name} className={`bg-[#13131e] rounded-xl border p-5 ${g.returnRate < 0.6 ? 'border-red-500/30' : g.returnRate < 0.8 ? 'border-amber-500/30' : 'border-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{g.icon}</span>
                      <h3 className="font-bold">{g.name}</h3>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>驍・・邇・/span>
                        <span>{(g.returnRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div className={`h-3 rounded-full ${g.returnRate >= 0.9 ? 'bg-green-500' : g.returnRate >= 0.75 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${g.returnRate * 100}%` }} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      10,000蜀・ｳｭ縺代ｋ縺ｨ 竊・蟷ｳ蝮・<span className="text-white font-bold">ﾂ･{Math.round(g.returnRate * 10000).toLocaleString()}</span> 謌ｻ繧・                    </p>
                    <p className="text-xs text-red-400 mt-1">
                      竊・豈主屓 <span className="font-bold">ﾂ･{loss.toLocaleString()}</span> 縺壹▽螟ｱ縺・ｨ育ｮ・                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 笏笏笏 SOGS Tab 笏笏笏 */}
        {activeTab === 'sogs' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">ｧ 繧ｮ繝｣繝ｳ繝悶Ν萓晏ｭ伜ｺｦ繧ｻ繝ｫ繝輔メ繧ｧ繝・け</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
              邃ｹ・・SOGS・・outh Oaks Gambling Screen・峨ｒ蜿り・↓縺励◆繧ｹ繧ｯ繝ｪ繝ｼ繝九Φ繧ｰ繝・せ繝医〒縺吶ょ現蟄ｦ逧・↑險ｺ譁ｭ縺ｧ縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲らｵ先棡縺ｫ荳榊ｮ峨′縺ゅｋ蝣ｴ蜷医・蟆る摩讖滄未縺ｫ縺皮嶌隲・￥縺縺輔＞縲・            </div>

            {!sogsResult ? (
              <>
                <div className="space-y-3">
                  {sogsQuestions.map(q => (
                    <div key={q.id}
                      onClick={() => setSogsAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        sogsAnswers[q.id] ? 'bg-red-500/10 border-red-500/30' : 'bg-[#13131e] border-gray-800 hover:border-gray-600'
                      }`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${sogsAnswers[q.id] ? 'bg-red-500 border-red-500' : 'border-gray-600'}`}>
                        {sogsAnswers[q.id] && <span className="text-xs text-white">笨・/span>}
                      </div>
                      <span className="text-sm">{q.text}</span>
                    </div>
                  ))}
                </div>
                <button onClick={calcSogs} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                  險ｺ譁ｭ邨先棡繧定ｦ九ｋ・・Object.values(sogsAnswers).filter(Boolean).length}蝠上↓縲後・縺・搾ｼ・                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-8 text-center ${
                  sogsResult.score <= 2 ? 'border-green-500/30' : sogsResult.score <= 5 ? 'border-yellow-500/30' : sogsResult.score <= 10 ? 'border-orange-500/30' : 'border-red-500/30'
                }`}>
                  <div className="text-4xl font-bold mb-2">{sogsResult.level}</div>
                  <div className="text-lg text-gray-400 mb-2">繧ｹ繧ｳ繧｢: {sogsResult.score}轤ｹ</div>
                  <p className="text-sm text-gray-400">{sogsResult.description}</p>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">庁 繧｢繝峨ヰ繧､繧ｹ</h3>
                  <ul className="space-y-2">
                    {sogsResult.advice.map((a, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-emerald-400 flex-shrink-0">竊・/span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => { setSogsResult(null); setSogsAnswers({}) }} className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">繧ゅ≧荳蠎ｦ繝√ぉ繝・け</button>
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 If Saved Tab 笏笏笏 */}
        {activeTab === 'ifsaved' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">腸 縲後ｂ縺苓ｲｯ驥代＠縺ｦ縺溘ｉ縲阪す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">譛医・・繧ｮ繝｣繝ｳ繝悶Ν謾ｯ蜃ｺ鬘・/label>
                  <input type="number" placeholder="50000" value={savedInput.monthly} onChange={e => setSavedInput(s => ({ ...s, monthly: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">譛滄俣・亥ｹｴ・・/label>
                  <input type="number" placeholder="5" value={savedInput.years} onChange={e => setSavedInput(s => ({ ...s, years: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>
            </div>

            {monthlySaved > 0 && yearsSaved > 0 && (
              <div className="space-y-4">
                <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-6 text-center">
                  <div className="text-sm text-gray-400 mb-1">繧ｮ繝｣繝ｳ繝悶Ν縺ｫ菴ｿ縺｣縺溽ｷ城｡搾ｼ域耳螳夲ｼ・/div>
                  <div className="text-5xl font-bold text-red-400">ﾂ･{totalSaved.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-2">譛・monthlySaved.toLocaleString()}蜀・ﾃ・{yearsSaved}蟷ｴ = {yearsSaved * 12}繝ｶ譛亥・</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#13131e] rounded-xl border border-green-500/30 p-5 text-center">
                    <div className="text-sm text-gray-400 mb-1">嘗 譎ｮ騾壹↓雋ｯ驥代＠縺ｦ縺溘ｉ</div>
                    <div className="text-3xl font-bold text-green-400">ﾂ･{totalSaved.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">驥大茜0%縺ｧ繧ら｢ｺ螳溘↓縺薙・驥鷹｡・/div>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-emerald-500/30 p-5 text-center">
                    <div className="text-sm text-gray-400 mb-1">嶋 蟷ｴ蛻ｩ5%縺ｧ驕狗畑縺励※縺溘ｉ</div>
                    <div className="text-3xl font-bold text-emerald-400">ﾂ･{compound5.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">+ﾂ･{(compound5 - totalSaved).toLocaleString()} 縺ｮ驕狗畑逶・/div>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-cyan-500/30 p-5 text-center">
                    <div className="text-sm text-gray-400 mb-1">噫 蟷ｴ蛻ｩ7%縺ｧ驕狗畑縺励※縺溘ｉ</div>
                    <div className="text-3xl font-bold text-cyan-400">ﾂ･{compound7.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">+ﾂ･{(compound7 - totalSaved).toLocaleString()} 縺ｮ驕狗畑逶・/div>
                  </div>
                </div>

                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">庁 縺薙・縺企≡縺後≠繧後・窶ｦ</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                    {totalSaved >= 300000 && <div>鎖・・鬮倡ｴ壹Ξ繧ｹ繝医Λ繝ｳ {Math.floor(totalSaved / 30000)}蝗槫・</div>}
                    {totalSaved >= 500000 && <div>笨茨ｸ・豬ｷ螟匁羅陦・{Math.floor(totalSaved / 200000)}蝗槫・</div>}
                    {totalSaved >= 1000000 && <div>囓 譁ｰ霆翫・鬆ｭ驥代↓縺ｪ繧矩｡・/div>}
                    {totalSaved >= 2000000 && <div>匠 繝槭Φ繧ｷ繝ｧ繝ｳ鬆ｭ驥代・荳驛ｨ</div>}
                    {totalSaved >= 3000000 && <div>注 邨仙ｩ夊ｳ・≡縺ｫ蜊∝・縺ｪ鬘・/div>}
                    {totalSaved >= 5000000 && <div>雌 蟄蝉ｾ帙・螟ｧ蟄ｦ雋ｻ逕ｨ繧偵き繝舌・</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Bias Tab 笏笏笏 */}
        {activeTab === 'bias' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">識 隱咲衍繝舌う繧｢繧ｹ險ｺ譁ｭ</h2>
            {!biasComplete ? (
              <>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>蝠城｡・{biasIndex + 1} / {biasQuizzes.length}</span>
                  <span>豁｣隗｣: {biasScore}/{biasIndex + (biasAnswered ? 1 : 0)}</span>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <div className="text-xs text-amber-400 font-bold mb-2">東 {biasQuizzes[biasIndex].name}</div>
                  <p className="text-lg mb-6">{biasQuizzes[biasIndex].scenario}</p>
                  {!biasAnswered ? (
                    <div className="space-y-3">
                      {biasQuizzes[biasIndex].options.map((opt, i) => (
                        <button key={i} onClick={() => {
                          setBiasAnswered(true)
                          if (!opt.isBias) setBiasScore(s => s + 1)
                        }} className="w-full text-left p-4 bg-[#1a1a2e] hover:bg-[#252540] border border-gray-700 rounded-xl text-sm transition-colors">
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {biasQuizzes[biasIndex].options.map((opt, i) => (
                        <div key={i} className={`p-4 rounded-xl text-sm border ${opt.isBias ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                          <p className="font-bold">{opt.isBias ? '笶・繝舌う繧｢繧ｹ縺ゅｊ' : '笨・蜷育炊逧・↑蛻､譁ｭ'}</p>
                          <p className="text-gray-400 mt-1">{opt.explanation}</p>
                        </div>
                      ))}
                      <button onClick={() => {
                        if (biasIndex + 1 >= biasQuizzes.length) { setBiasComplete(true) }
                        else { setBiasIndex(i => i + 1); setBiasAnswered(false) }
                      }} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                        {biasIndex + 1 >= biasQuizzes.length ? '邨先棡繧定ｦ九ｋ' : '谺｡縺ｮ蝠城｡・竊・}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-[#13131e] rounded-xl border border-emerald-500/30 p-8 text-center">
                <div className="text-6xl mb-4">{biasScore >= 5 ? '醇' : biasScore >= 3 ? '総' : '答'}</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">{biasScore} / {biasQuizzes.length}</div>
                <p className="text-gray-400 mb-6">
                  {biasScore >= 5 ? '邏譎ｴ繧峨＠縺・ｼ∬ｪ咲衍繝舌う繧｢繧ｹ繧堤炊隗｣縺励※縺・∪縺吶・ :
                   biasScore >= 3 ? '縺ｾ縺壹∪縺壹ょｼ輔▲縺九°縺｣縺溘ヰ繧､繧｢繧ｹ繧貞ｾｩ鄙偵＠縺ｾ縺励ｇ縺・・ :
                   '隱咲衍繝舌う繧｢繧ｹ縺ｫ隕∵ｳｨ諢擾ｼ√ぐ繝｣繝ｳ繝悶Ν縺ｧ縲檎峩諢溘阪ｒ菫｡縺倥ｋ縺ｮ縺ｯ蜊ｱ髯ｺ縺ｧ縺吶・}
                </p>
                <button onClick={() => { setBiasIndex(0); setBiasScore(0); setBiasAnswered(false); setBiasComplete(false) }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors">繧ゅ≧荳蠎ｦ謖第姶</button>
              </div>
            )}
          </div>
        )}

        {/* 笏笏笏 Help Tab 笏笏笏 */}
        {activeTab === 'help' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">唱 逶ｸ隲・ｪ灘哨繧ｬ繧､繝・/h2>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-sm text-emerald-300">
              庁 逶ｸ隲・・辟｡譁吶・遘伜ｯ・宍螳医〒縺吶ゅ檎嶌隲・☆繧九⊇縺ｩ縺ｧ縺ｯ縺ｪ縺・阪→諤昴▲縺ｦ繧ゅ∬ｩｱ繧定◇縺・※繧ゅｉ縺・□縺代〒豌玲戟縺｡縺梧･ｽ縺ｫ縺ｪ繧九％縺ｨ縺後≠繧翫∪縺吶・            </div>
            <div className="space-y-4">
              {consultationGuide.map((c, i) => (
                <div key={i} className="bg-[#13131e] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{c.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{c.desc}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {c.phone.startsWith('http') ? (
                          <a href={c.phone} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">迫 {c.phone}</a>
                        ) : (
                          <span className="text-lg font-bold text-emerald-400">到 {c.phone}</span>
                        )}
                        <span className="text-sm text-gray-500">武 {c.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    
      </div>
  )
}


