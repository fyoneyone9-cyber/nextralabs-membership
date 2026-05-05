'use client'


import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'gmail' | 'sort' | 'reply' | 'tasks' | 'schedule' | 'checklist' | 'habits'

interface EmailEntry {
  id: string
  from: string
  subject: string
  summary: string
  urgency: 'high' | 'medium' | 'low'
  importance: 'high' | 'medium' | 'low'
  category: string
  addedAt: string
}

interface CheckItem { id: string; label: string; done: boolean; category: string }

interface GmailMessage {
  id: string
  threadId: string
  subject: string
  from: string
  date: string
  snippet: string
  labelIds: string[]
  isUnread: boolean
}

interface GmailAuth {
  accessToken: string
  refreshToken: string
  expiresAt: number
  email: string
}

// ==================== DATA ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'gmail', icon: '迫', label: 'Gmail騾｣謳ｺ' },
  { id: 'sort', icon: '踏', label: '莉募・縺代Ν繝ｼ繝ｫ' },
  { id: 'reply', icon: '笨会ｸ・, label: '霑比ｿ｡繝・Φ繝励Ξ' },
  { id: 'tasks', icon: '搭', label: '繧ｿ繧ｹ繧ｯ謨ｴ逅・ },
  { id: 'schedule', icon: '套', label: '譌･遞玖ｪｿ謨ｴ' },
  { id: 'checklist', icon: 'ｧｹ', label: 'Inbox Zero' },
  { id: 'habits', icon: '投', label: '鄙呈・險ｺ譁ｭ' },
]

const FILTER_TEMPLATES = [
  { name: '繝九Η繝ｼ繧ｹ繝ｬ繧ｿ繝ｼ閾ｪ蜍輔い繝ｼ繧ｫ繧､繝・, provider: 'gmail', rule: 'from:(newsletter OR noreply OR news@) 竊・繝ｩ繝吶Ν縲後ル繝･繝ｼ繧ｹ繝ｬ繧ｿ繝ｼ縲坂・ 繧｢繝ｼ繧ｫ繧､繝・竊・譌｢隱ｭ縺ｫ縺吶ｋ', keywords: ['newsletter', 'noreply', 'news@', '驟堺ｿ｡蛛懈ｭ｢'] },
  { name: 'EC繧ｵ繧､繝磯夂衍', provider: 'gmail', rule: 'from:(amazon.co.jp OR rakuten.co.jp OR yahoo-corp.jp) subject:(逋ｺ騾・OR 豕ｨ譁・｢ｺ隱・OR 驟埼・ 竊・繝ｩ繝吶Ν縲瑚ｲｷ縺・黄縲坂・ 繧｢繝ｼ繧ｫ繧､繝・, keywords: ['amazon', 'rakuten', '逋ｺ騾・, '豕ｨ譁・｢ｺ隱・] },
  { name: 'SNS騾夂衍縺ｾ縺ｨ繧・, provider: 'gmail', rule: 'from:(twitter.com OR facebook.com OR instagram.com OR linkedin.com) 竊・繝ｩ繝吶Ν縲郡NS縲坂・ 繧｢繝ｼ繧ｫ繧､繝・竊・譌｢隱ｭ', keywords: ['twitter', 'facebook', 'notification'] },
  { name: '隲区ｱよ嶌繝ｻ鬆伜庶譖ｸ', provider: 'gmail', rule: 'subject:(隲区ｱよ嶌 OR 鬆伜庶譖ｸ OR invoice OR receipt) 竊・繝ｩ繝吶Ν縲檎ｵ檎炊縲坂・ 繧ｹ繧ｿ繝ｼ莉倥″', keywords: ['隲区ｱよ嶌', '鬆伜庶譖ｸ', 'invoice'] },
  { name: '驥崎ｦ√け繝ｩ繧､繧｢繝ｳ繝亥━蜈・, provider: 'gmail', rule: 'from:(client1@example.com OR client2@example.com) 竊・繝ｩ繝吶Ν縲碁㍾隕√坂・ 蜿嶺ｿ｡繝医Ξ繧､縺ｫ谿九☆ 竊・繧ｹ繧ｿ繝ｼ莉倥″', keywords: ['驥崎ｦ・, '繧ｯ繝ｩ繧､繧｢繝ｳ繝・] },
  { name: '繧ｫ繝ｬ繝ｳ繝繝ｼ諡帛ｾ・, provider: 'gmail', rule: 'filename:invite.ics OR subject:(諡帛ｾ・OR invitation OR 莨夊ｭｰ) 竊・繝ｩ繝吶Ν縲御ｺ亥ｮ壹・, keywords: ['invite', '諡帛ｾ・, '莨夊ｭｰ'] },
  { name: '蝟ｶ讌ｭ繝｡繝ｼ繝ｫ閾ｪ蜍募炎髯､', provider: 'gmail', rule: 'subject:(辟｡譁吶ヨ繝ｩ繧､繧｢繝ｫ OR 髯仙ｮ壹が繝輔ぃ繝ｼ OR 繧ｻ繝ｼ繝ｫ) from:(-known_contacts) 竊・繧ｴ繝溽ｮｱ', keywords: ['辟｡譁・, '繧ｪ繝輔ぃ繝ｼ', '繧ｻ繝ｼ繝ｫ', '髯仙ｮ・] },
  { name: '遉ｾ蜀・Γ繝ｼ繝ｫ蛻・｡・, provider: 'gmail', rule: 'from:(@yourcompany.co.jp) 竊・繝ｩ繝吶Ν縲檎､ｾ蜀・坂・ 蜿嶺ｿ｡繝医Ξ繧､縺ｫ谿九☆', keywords: ['遉ｾ蜀・, '@company'] },
]

const REPLY_CATEGORIES = [
  { id: 'thanks', label: '剌 縺顔､ｼ', templates: [
    { title: '謇薙■蜷医ｏ縺帛ｾ後・縺顔､ｼ', body: '{{逶ｸ謇句錐}}讒禄n\n縺顔夢繧梧ｧ倥〒縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n譛ｬ譌･縺ｯ縺雁ｿ吶＠縺・ｸｭ縲√♀譎る俣繧偵＞縺溘□縺阪≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺励◆縲・n\n{{莨夊ｭｰ蜀・ｮｹ}}縺ｫ縺､縺・※縲∝､ｧ螟牙盾閠・↓縺ｪ繧翫∪縺励◆縲・n縺・◆縺縺・◆縺疲э隕九ｒ繧ゅ→縺ｫ縲＋{谺｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ}}繧帝ｲ繧√※縺ｾ縺・ｊ縺ｾ縺吶・n\n蠑輔″邯壹″繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
    { title: '邏ｹ莉九・縺顔､ｼ', body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n縺薙・蠎ｦ縺ｯ{{邏ｹ莉句・}}讒倥ｒ縺皮ｴｹ莉九＞縺溘□縺阪∬ｪ縺ｫ縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶・n\n譌ｩ騾溘＃騾｣邨｡繧貞叙繧峨○縺ｦ縺・◆縺縺阪∪縺励◆縲・n{{逶ｸ謇句錐}}讒倥・縺翫°縺偵〒螟ｧ螟峨せ繝繝ｼ繧ｺ縺ｫ隧ｱ縺碁ｲ縺ｿ縺昴≧縺ｧ縺吶・n\n莉雁ｾ後→繧ゅｈ繧阪＠縺上♀鬘倥＞縺・◆縺励∪縺吶・ },
  ]},
  { id: 'decline', label: '刔 縺頑妙繧・, templates: [
    { title: '荳∝ｯｧ縺ｪ縺頑妙繧・, body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n縺薙・蠎ｦ縺ｯ{{萓晞ｼ蜀・ｮｹ}}縺ｮ縺比ｾ晞ｼ繧偵＞縺溘□縺阪√≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶・n\n螟ｧ螟画＄邵ｮ縺ｧ縺吶′縲∫樟蝨ｨ{{逅・罰}}縺ｮ縺溘ａ縲√♀蜿励￠縺吶ｋ縺薙→縺碁屮縺励＞迥ｶ豕√〒縺吶・n縺帙▲縺九￥縺雁｣ｰ縺後￠縺・◆縺縺・◆縺ｫ繧る未繧上ｉ縺壹∫筏縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縲・n\n縺ｾ縺溘・讖滉ｼ壹′縺斐＊縺・∪縺励◆繧峨√●縺ｲ縺雁｣ｰ縺後￠縺上□縺輔＞縲・n菴募穀繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
    { title: '蝟ｶ讌ｭ繝｡繝ｼ繝ｫ縺ｸ縺ｮ譁ｭ繧・, body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n繧ｵ繝ｼ繝薙せ縺ｮ縺疲｡亥・繧偵＞縺溘□縺阪√≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶・n\n遉ｾ蜀・〒讀懆ｨ弱＞縺溘＠縺ｾ縺励◆縺後∫樟譎らせ縺ｧ縺ｯ蟆主・縺ｮ莠亥ｮ壹′縺斐＊縺・∪縺帙ｓ縲・n莉雁ｾ後ル繝ｼ繧ｺ縺檎函縺倥◆髫帙↓縺ｯ謾ｹ繧√※縺皮嶌隲・＆縺帙※縺・◆縺縺代ｌ縺ｰ蟷ｸ縺・〒縺吶・n\n繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
  ]},
  { id: 'schedule', label: '套 譌･遞玖ｪｿ謨ｴ', templates: [
    { title: '蛟呵｣懈律謠先｡・, body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n{{莉ｶ蜷閤}縺ｮ謇薙■蜷医ｏ縺帙↓縺､縺・※縲∽ｻ･荳九・譌･遞九〒縺秘・蜷医＞縺九′縺ｧ縺励ｇ縺・°縲・n\n竭 {{譌･譎・}}\n竭｡ {{譌･譎・}}\n竭｢ {{譌･譎・}}\n\n謇隕∵凾髢薙・{{譎る俣}}遞句ｺｦ繧呈Φ螳壹＠縺ｦ縺翫ｊ縺ｾ縺吶・n繧ｪ繝ｳ繝ｩ繧､繝ｳ/蟇ｾ髱｢縺ｮ縺ｩ縺｡繧峨〒繧ょｯｾ蠢懷庄閭ｽ縺ｧ縺吶・n\n縺疲､懆ｨ弱・縺ｻ縺ｩ縲√ｈ繧阪＠縺上♀鬘倥＞縺・◆縺励∪縺吶・ },
    { title: '譌･遞狗｢ｺ螳壹・霑比ｿ｡', body: '{{逶ｸ謇句錐}}讒禄n\n縺碑ｿ比ｿ｡縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶・n縺昴ｌ縺ｧ縺ｯ縲＋{遒ｺ螳壽律譎・}縺ｧ縺企｡倥＞縺・◆縺励∪縺吶・n\n{{蝣ｴ謇/URL}}縺ｫ縺ｦ縺雁ｾ・■縺励※縺翫ｊ縺ｾ縺吶・n蠖捺律縺ｯ繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
  ]},
  { id: 'followup', label: '売 蛯ｬ菫・・繝輔か繝ｭ繝ｼ', templates: [
    { title: '荳∝ｯｧ縺ｪ蛯ｬ菫・, body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n蜈域律縺秘｣邨｡縺輔○縺ｦ縺・◆縺縺・◆{{莉ｶ蜷閤}縺ｮ莉ｶ縺ｫ縺､縺・※縲√◎縺ｮ蠕後・縺皮憾豕√・縺・°縺後〒縺励ｇ縺・°縲・n\n縺雁ｿ吶＠縺・→縺薙ｍ諱千ｸｮ縺ｧ縺吶′縲＋{譛滄剞}}縺ｾ縺ｧ縺ｫ縺泌屓遲斐＞縺溘□縺代∪縺吶→蟷ｸ縺・〒縺吶・n菴輔°縺比ｸ肴・轤ｹ遲峨＃縺悶＞縺ｾ縺励◆繧峨√♀豌苓ｻｽ縺ｫ縺秘｣邨｡縺上□縺輔＞縲・n\n繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
    { title: '騾ｲ謐礼｢ｺ隱・, body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n{{繝励Ο繧ｸ繧ｧ繧ｯ繝亥錐}}縺ｮ騾ｲ謐励↓縺､縺・※遒ｺ隱阪＆縺帙※縺上□縺輔＞縲・n\n迴ｾ蝨ｨ縺ｮ迥ｶ豕√→縲∵ｬ｡縺ｮ繝槭う繝ｫ繧ｹ繝医・繝ｳ縺ｮ隕矩壹＠繧貞・譛峨＞縺溘□縺代∪縺吶〒縺励ｇ縺・°縲・n迚ｹ縺ｫ{{遒ｺ隱堺ｺ矩・}縺ｫ縺､縺・※謚頑升縺励※縺翫″縺溘＞縺ｧ縺吶・n\n繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
  ]},
  { id: 'apology', label: '刧 縺願ｩｫ縺ｳ', templates: [
    { title: '霑比ｿ｡驕・ｻｶ縺ｮ縺願ｩｫ縺ｳ', body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n縺碑ｿ比ｿ｡縺碁≦縺上↑繧翫∝､ｧ螟臥筏縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縲・n\n{{逅・罰}}縺ｫ繧医ｊ蟇ｾ蠢懊′驕・ｌ縺ｦ縺翫ｊ縺ｾ縺励◆縲・n{{譛ｬ鬘後・蝗樒ｭ媒}\n\n莉雁ｾ後・縺薙・繧医≧縺ｪ縺薙→縺後↑縺・ｈ縺・ｳｨ諢上＞縺溘＠縺ｾ縺吶・n蠑輔″邯壹″繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
    { title: '繝溘せ縺ｮ縺願ｩｫ縺ｳ', body: '{{逶ｸ謇句錐}}讒禄n\n縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{閾ｪ蛻・錐}}縺ｧ縺吶・n縺薙・蠎ｦ縺ｯ{{繝溘せ蜀・ｮｹ}}縺ｫ縺､縺阪∪縺励※縲∝､壼､ｧ縺ｪ縺碑ｿｷ諠代ｒ縺翫°縺代＠縲∵ｷｱ縺上♀隧ｫ縺ｳ逕ｳ縺嶺ｸ翫￡縺ｾ縺吶・n\n蜴溷屏繧堤｢ｺ隱阪＠縺溘→縺薙ｍ縲＋{蜴溷屏}}縺ｧ縺ゅｋ縺薙→縺悟愛譏弱＞縺溘＠縺ｾ縺励◆縲・n蜀咲匱髦ｲ豁｢縺ｨ縺励※{{蟇ｾ遲凡}繧貞ｮ滓命縺・◆縺励∪縺吶・n\n菫ｮ豁｣迚医ｒ{{譛滓律}}縺ｾ縺ｧ縺ｫ縺企√ｊ縺・◆縺励∪縺吶・n驥阪・縺ｦ縺願ｩｫ縺ｳ逕ｳ縺嶺ｸ翫￡縺ｾ縺吶・ },
  ]},
  { id: 'intro', label: '､・邏ｹ莉九・閾ｪ蟾ｱ邏ｹ莉・, templates: [
    { title: '閾ｪ蟾ｱ邏ｹ莉九Γ繝ｼ繝ｫ', body: '{{逶ｸ謇句錐}}讒禄n\n蛻昴ａ縺ｾ縺励※縲・{邏ｹ莉玖・}讒倥°繧峨＃邏ｹ莉九＞縺溘□縺阪∪縺励◆縲＋{閾ｪ蛻・錐}}縺ｨ逕ｳ縺励∪縺吶・n{{閾ｪ蛻・・閧ｩ譖ｸ縺・莨夂､ｾ蜷閤}縺ｫ縺ｦ{{讌ｭ蜍吝・螳ｹ}}繧呈球蠖薙＠縺ｦ縺翫ｊ縺ｾ縺吶・n\n{{邏ｹ莉玖・}讒倥°繧閲{逶ｸ謇句錐}}讒倥・{{隧ｱ鬘迎}縺ｫ縺､縺・※莨ｺ縺・√●縺ｲ縺願ｩｱ縺励＆縺帙※縺・◆縺縺阪◆縺上＃騾｣邨｡縺・◆縺励∪縺励◆縲・n\n縺秘・蜷医・濶ｯ縺・律譎ゅ′縺斐＊縺・∪縺励◆繧峨√♀豌苓ｻｽ縺ｫ縺秘｣邨｡縺上□縺輔＞縲・n菴募穀繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・ },
  ]},
]

const INBOX_ZERO_CHECKLIST: CheckItem[] = [
  { id: 'iz1', label: '譛ｪ隱ｭ繝｡繝ｼ繝ｫ繧貞・莉ｶ遒ｺ隱阪☆繧具ｼ郁ｪｭ繧縺縺代りｿ比ｿ｡縺ｯ蠕鯉ｼ・, done: false, category: '竭 蜈ｨ莉ｶ繧ｹ繧ｭ繝｣繝ｳ' },
  { id: 'iz2', label: '2蛻・ｻ･蜀・↓霑比ｿ｡縺ｧ縺阪ｋ繝｡繝ｼ繝ｫ縺ｯ縺昴・蝣ｴ縺ｧ霑比ｿ｡', done: false, category: '竭｡ 蜊ｳ蜃ｦ逅・ },
  { id: 'iz3', label: '閾ｪ蛻・′繧｢繧ｯ繧ｷ繝ｧ繝ｳ荳崎ｦ√↑繝｡繝ｼ繝ｫ繧偵い繝ｼ繧ｫ繧､繝・, done: false, category: '竭｡ 蜊ｳ蜃ｦ逅・ },
  { id: 'iz4', label: '繝九Η繝ｼ繧ｹ繝ｬ繧ｿ繝ｼ繝ｻ騾夂衍繝｡繝ｼ繝ｫ繧剃ｸ諡ｬ繧｢繝ｼ繧ｫ繧､繝・, done: false, category: '竭｡ 蜊ｳ蜃ｦ逅・ },
  { id: 'iz5', label: '霑比ｿ｡縺悟ｿ・ｦ√□縺梧凾髢薙′縺九°繧九Γ繝ｼ繝ｫ縺ｫ繧ｹ繧ｿ繝ｼ莉倥￠', done: false, category: '竭｢ 莉募・縺・ },
  { id: 'iz6', label: '繧ｿ繧ｹ繧ｯ縺檎匱逕溘☆繧九Γ繝ｼ繝ｫ繧探oDo繝ｪ繧ｹ繝医↓霆｢險・, done: false, category: '竭｢ 莉募・縺・ },
  { id: 'iz7', label: '蜿ら・逕ｨ繝｡繝ｼ繝ｫ縺ｫ繝ｩ繝吶Ν繧剃ｻ倥￠縺ｦ繧｢繝ｼ繧ｫ繧､繝・, done: false, category: '竭｢ 莉募・縺・ },
  { id: 'iz8', label: '荳崎ｦ√↑驟堺ｿ｡繝｡繝ｼ繝ｫ縺ｮ縲碁・菫｡蛛懈ｭ｢縲阪ｒ繧ｯ繝ｪ繝・け・・莉ｶ莉･荳奇ｼ・, done: false, category: '竭｣ 蜑頑ｸ・ },
  { id: 'iz9', label: '繝輔ぅ繝ｫ繧ｿ繝ｼ繝ｫ繝ｼ繝ｫ繧・縺､莉･荳頑眠隕丈ｽ懈・', done: false, category: '竭｣ 蜑頑ｸ・ },
  { id: 'iz10', label: '繧ｹ繧ｿ繝ｼ莉倥″繝｡繝ｼ繝ｫ縺ｮ霑比ｿ｡繧貞・縺ｦ螳御ｺ・, done: false, category: '竭､ 螳御ｺ・ },
  { id: 'iz11', label: '蜿嶺ｿ｡繝医Ξ繧､縺ｮ繝｡繝ｼ繝ｫ謨ｰ縺・縺ｫ縺ｪ縺｣縺・, done: false, category: '竭､ 螳御ｺ・ },
  { id: 'iz12', label: '譏取律縺ｮ縲後Γ繝ｼ繝ｫ蜃ｦ逅・ち繧､繝縲阪ｒ繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｫ30蛻・ヶ繝ｭ繝・け', done: false, category: '竭･ 鄙呈・蛹・ },
]

const SCHEDULE_SITUATIONS = [
  { id: 'meeting', label: '召 遉ｾ蜀・Α繝ｼ繝・ぅ繝ｳ繧ｰ', duration: '30蛻・・譎る俣', format: '繧ｪ繝ｳ繝ｩ繧､繝ｳ or 莨夊ｭｰ螳､' },
  { id: 'client', label: '､・繧ｯ繝ｩ繧､繧｢繝ｳ繝域遠縺｡蜷医ｏ縺・, duration: '1譎る俣', format: '繧ｪ繝ｳ繝ｩ繧､繝ｳ or 險ｪ蝠・ },
  { id: 'interview', label: '痔 髱｢謗･繝ｻ髱｢隲・, duration: '30蛻・・譎る俣', format: '繧ｪ繝ｳ繝ｩ繧､繝ｳ or 蟇ｾ髱｢' },
  { id: 'lunch', label: '鎖・・繝ｩ繝ｳ繝√Α繝ｼ繝・ぅ繝ｳ繧ｰ', duration: '1譎る俣', format: '蟇ｾ髱｢・医Ξ繧ｹ繝医Λ繝ｳ・・ },
  { id: 'casual', label: '笘・繧ｫ繧ｸ繝･繧｢繝ｫ髱｢隲・, duration: '30蛻・, format: '繧ｪ繝ｳ繝ｩ繧､繝ｳ or 繧ｫ繝輔ぉ' },
]

// ==================== COMPONENT ====================
export default function InboxOrganizer() {
  const [tab, setTab] = useState<Tab>('gmail')
  const [copied, setCopied] = useState('')
  
  // Gmail API state
  const [gmailAuth, setGmailAuth] = useState<GmailAuth | null>(null)
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([])
  const [gmailLoading, setGmailLoading] = useState(false)
  const [gmailError, setGmailError] = useState('')
  const [gmailClassified, setGmailClassified] = useState<Map<string, { urgency: string; importance: string; category: string; action: string }>>(new Map())
  const [draftStatus, setDraftStatus] = useState<Map<string, string>>(new Map())
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiError, setAiError] = useState(false)
  const [messageBody, setMessageBody] = useState('')
  const [loadingBody, setLoadingBody] = useState(false)
  
  // Reply tab
  const [replyCategory, setReplyCategory] = useState('thanks')
  
  // Tasks tab
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [newEmail, setNewEmail] = useState({ from: '', subject: '', summary: '' })
  
  // Schedule tab
  const [scheduleForm, setScheduleForm] = useState({
    situation: 'meeting',
    partnerName: '',
    myName: '',
    topic: '',
    date1: '',
    date2: '',
    date3: '',
    duration: '1譎る俣',
    location: '繧ｪ繝ｳ繝ｩ繧､繝ｳ・・oom・・,
  })
  
  // Checklist
  const [checklist, setChecklist] = useState<CheckItem[]>(INBOX_ZERO_CHECKLIST)
  
  // Habits
  const [habits, setHabits] = useState({
    dailyEmails: 50,
    unreadCount: 30,
    processTimeMin: 60,
    avgReplyHours: 24,
    checkFrequency: 10,
    subscriptions: 20,
  })
  const [habitsResult, setHabitsResult] = useState<null | { score: number; level: string; tips: string[] }>(null)

  // Gmail: classify messages client-side
  const classifyMessage = useCallback((msg: GmailMessage) => {
    const text = (msg.subject + ' ' + msg.from + ' ' + msg.snippet).toLowerCase()
    const urgencyKeywords = ['閾ｳ諤･', '諤･縺・, '莉頑律荳ｭ', '譛ｬ譌･', 'asap', '邱頑･', '邱蛻・, 'deadline', 'urgent']
    const importanceKeywords = ['螂醍ｴ・, '隲区ｱ・, '豎ｺ邂・, '遉ｾ髟ｷ', '蠖ｹ蜩｡', 'ceo', '驥崎ｦ・, '蠢・・, '遒ｺ隱榊ｿ・・, 'invoice', '隕狗ｩ・]
    
    const urgency = urgencyKeywords.some(k => text.includes(k)) ? '閥 鬮・ : '泯 荳ｭ'
    const importance = importanceKeywords.some(k => text.includes(k)) ? '閥 鬮・ : '泯 荳ｭ'
    
    let category = '刀 縺昴・莉・
    let action = '繧｢繝ｼ繧ｫ繧､繝門呵｣・
    if (/隲区ｱ・鬆伜庶|invoice|隕狗ｩ鋼receipt/.test(text)) { category = '腸 邨檎炊'; action = '遒ｺ隱阪＠縺ｦ菫晏ｭ・ }
    else if (/謇薙■蜷医ｏ縺斈莨夊ｭｰ|繝溘・繝・ぅ繝ｳ繧ｰ|mtg|譌･遞弓meeting|calendar/.test(text)) { category = '套 莠亥ｮ・; action = '繧ｫ繝ｬ繝ｳ繝繝ｼ遒ｺ隱・ }
    else if (/繧ｿ繧ｹ繧ｯ|萓晞ｼ|縺企｡倥＞|蟇ｾ蠢忿todo/.test(text)) { category = '搭 繧ｿ繧ｹ繧ｯ'; action = 'ToDo縺ｫ霑ｽ蜉' }
    else if (/蝣ｱ蜻掛蜈ｱ譛榎fyi|蜻ｨ遏･|newsletter|繝九Η繝ｼ繧ｹ繝ｬ繧ｿ繝ｼ/.test(text)) { category = '討 諠・ｱ蜈ｱ譛・; action = '蠕後〒隱ｭ繧' }
    else if (/遒ｺ隱鋼謇ｿ隱鋼繝ｬ繝薙Η繝ｼ|繝√ぉ繝・け|approve|review/.test(text)) { category = '笨・謇ｿ隱・; action = '莉翫☆縺仙ｯｾ蠢・ }
    else if (/noreply|no-reply|驟堺ｿ｡蛛懈ｭ｢|unsubscribe/.test(text)) { category = '舶 閾ｪ蜍暮夂衍'; action = '繧｢繝ｼ繧ｫ繧､繝・ }
    
    if (urgency === '閥 鬮・ && importance === '閥 鬮・) action = '櫨 莉翫☆縺仙ｯｾ蠢懶ｼ・
    else if (urgency === '閥 鬮・) action = '笞｡ 譌ｩ繧√↓蟇ｾ蠢・
    
    return { urgency, importance, category, action }
  }, [])

  // Gmail: fetch messages
  const fetchGmailMessages = useCallback(async () => {
    if (!gmailAuth) return
    setGmailLoading(true)
    setGmailError('')
    try {
      const res = await fetch('/api/gmail/messages?maxResults=30&q=in:inbox', {
        headers: { Authorization: `Bearer ${gmailAuth.accessToken}` },
      })
      if (!res.ok) {
        if (res.status === 401) {
          setGmailAuth(null)
          sessionStorage.removeItem('gmail-auth')
          setGmailError('繧ｻ繝・す繝ｧ繝ｳ縺悟・繧後∪縺励◆縲ょ・繝ｭ繧ｰ繧､繝ｳ縺励※縺上□縺輔＞縲・)
          return
        }
        throw new Error('Failed to fetch')
      }
      const data = await res.json()
      setGmailMessages(data.messages || [])
      
      // Classify all messages
      const classified = new Map<string, { urgency: string; importance: string; category: string; action: string }>()
      for (const msg of (data.messages || [])) {
        classified.set(msg.id, classifyMessage(msg))
      }
      setGmailClassified(classified)
    } catch {
      setGmailError('繝｡繝ｼ繝ｫ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆縲・)
    } finally {
      setGmailLoading(false)
    }
  }, [gmailAuth, classifyMessage])

  // Gmail: create draft
  const createDraft = async (msg: GmailMessage, body: string) => {
    if (!gmailAuth || !body.trim()) return
    setDraftStatus(prev => new Map(prev).set(msg.id, 'saving...'))
    try {
      const fromMatch = msg.from.match(/<(.+?)>/)
      const to = fromMatch ? fromMatch[1] : msg.from
      const res = await fetch('/api/gmail/draft', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gmailAuth.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject: `Re: ${msg.subject}`,
          body,
          threadId: msg.threadId,
        }),
      })
      if (!res.ok) throw new Error('Draft creation failed')
      setDraftStatus(prev => new Map(prev).set(msg.id, '笨・荳区嶌縺堺ｿ晏ｭ俶ｸ医∩'))
      setDraftBody('')
    } catch {
      setDraftStatus(prev => new Map(prev).set(msg.id, '笶・螟ｱ謨・))
    }
  }

  // Fetch full message body when opening draft modal
  const openDraftModal = async (msg: GmailMessage) => {
    setSelectedMessage(msg)
    setDraftBody('')
    setAiError(false)
    setMessageBody('')
    setLoadingBody(true)
    try {
      const res = await fetch(`/api/gmail/message?id=${msg.id}`, {
        headers: { Authorization: `Bearer ${gmailAuth?.accessToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessageBody(data.body || msg.snippet || '')
      } else {
        setMessageBody(msg.snippet || '')
      }
    } catch {
      setMessageBody(msg.snippet || '')
    } finally {
      setLoadingBody(false)
    }
  }

  // Build prompt for AI reply (reusable for copy-to-clipboard fallback)
  const buildReplyPrompt = (msg: GmailMessage) => {
    const content = messageBody || msg.snippet
    return `莉･荳九・繝｡繝ｼ繝ｫ縺ｫ蟇ｾ縺吶ｋ荳∝ｯｧ縺ｪ譌･譛ｬ隱槭ン繧ｸ繝阪せ繝｡繝ｼ繝ｫ縺ｮ霑比ｿ｡譛ｬ譁・ｒ菴懈・縺励※縺上□縺輔＞縲・

縲仙ｷｮ蜃ｺ莠ｺ縲・{msg.from}
縲蝉ｻｶ蜷阪・{msg.subject}
縲舌Γ繝ｼ繝ｫ譛ｬ譁・・
${content}

繝ｫ繝ｼ繝ｫ・・
- 縲後♀荳冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶ゅ阪°繧牙ｧ九ａ繧・
- 莉ｶ蜷阪→蜀・ｮｹ縺ｫ蜈ｷ菴鍋噪縺ｫ險蜿翫☆繧・
- 5縲・0陦檎ｨ句ｺｦ
- 譛蠕後・縲後ｈ繧阪＠縺上♀鬘倥＞縺・◆縺励∪縺吶ゅ阪〒邱繧√ｋ
- 鄂ｲ蜷阪・蜷ｫ繧√↑縺・
- 霑比ｿ｡譛ｬ譁・・縺ｿ蜃ｺ蜉嫣
  }

  // AI auto-generate reply
  const generateAiReply = async (msg: GmailMessage) => {
    setAiGenerating(true)
    setAiError(false)
    setDraftBody('')
    try {
      const res = await fetch('/api/gmail/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: msg.subject,
          from: msg.from,
          snippet: messageBody || msg.snippet,
        }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'AI generation failed')
      }
      const data = await res.json()
      if (data.reply) {
        setDraftBody(data.reply)
      } else {
        setAiError(true)
      }
    } catch (err) {
      console.error('AI reply error:', err)
      setAiError(true)
    } finally {
      setAiGenerating(false)
    }
  }

  // Gmail: trash message
  const trashMessage = async (msg: GmailMessage) => {
    if (!gmailAuth) return
    if (!confirm(`縲・{msg.subject}縲阪ｒ繧ｴ繝溽ｮｱ縺ｫ遘ｻ蜍輔＠縺ｾ縺吶°・歔)) return
    try {
      const res = await fetch('/api/gmail/trash', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gmailAuth.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId: msg.id }),
      })
      if (!res.ok) throw new Error('Trash failed')
      // Remove from local list
      setGmailMessages(prev => prev.filter(m => m.id !== msg.id))
      setGmailClassified(prev => {
        const next = new Map(prev)
        next.delete(msg.id)
        return next
      })
    } catch (err) {
      console.error('Trash error:', err)
      alert('繧ｴ繝溽ｮｱ縺ｸ縺ｮ遘ｻ蜍輔↓螟ｱ謨励＠縺ｾ縺励◆縲・mail縺ｫ蜀阪Ο繧ｰ繧､繝ｳ縺励※縺上□縺輔＞縲・)
    }
  }

  // Load/save + Gmail auth from URL hash
  useEffect(() => {
    try {
      const saved = localStorage.getItem('inbox-organizer-emails')
      if (saved) setEmails(JSON.parse(saved))
      const savedChecklist = localStorage.getItem('inbox-organizer-checklist')
      if (savedChecklist) setChecklist(JSON.parse(savedChecklist))
    } catch {}

    // Check for Gmail OAuth callback in URL hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash.startsWith('#gmail_auth=')) {
        const params = new URLSearchParams(hash.slice('#gmail_auth='.length))
        const accessToken = params.get('access_token')
        const email = params.get('email')
        const expiresIn = parseInt(params.get('expires_in') || '3600')
        if (accessToken) {
          const auth: GmailAuth = {
            accessToken,
            refreshToken: params.get('refresh_token') || '',
            expiresAt: Date.now() + expiresIn * 1000,
            email: email || '',
          }
          setGmailAuth(auth)
          sessionStorage.setItem('gmail-auth', JSON.stringify(auth))
          // Clean URL hash
          window.history.replaceState(null, '', window.location.pathname)
        }
      }

      // Check URL for error
      const urlParams = new URLSearchParams(window.location.search)
      const gmailErr = urlParams.get('gmail_error')
      if (gmailErr) {
        setGmailError(`Gmail隱崎ｨｼ繧ｨ繝ｩ繝ｼ: ${gmailErr}`)
        window.history.replaceState(null, '', window.location.pathname)
      }

      // Restore session
      try {
        const savedAuth = sessionStorage.getItem('gmail-auth')
        if (savedAuth) {
          const auth = JSON.parse(savedAuth) as GmailAuth
          if (auth.expiresAt > Date.now()) {
            setGmailAuth(auth)
          } else {
            sessionStorage.removeItem('gmail-auth')
          }
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('inbox-organizer-emails', JSON.stringify(emails)) } catch {}
  }, [emails])

  useEffect(() => {
    try { localStorage.setItem('inbox-organizer-checklist', JSON.stringify(checklist)) } catch {}
  }, [checklist])

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  // Task categorization
  const addEmail = () => {
    if (!newEmail.subject.trim()) return
    const urgencyKeywords = ['閾ｳ諤･', '諤･縺・, '莉頑律荳ｭ', '譛ｬ譌･', 'ASAP', '邱頑･', '邱蛻・, 'deadline']
    const importanceKeywords = ['螂醍ｴ・, '隲区ｱ・, '豎ｺ邂・, '遉ｾ髟ｷ', '蠖ｹ蜩｡', 'CEO', '驥崎ｦ・, '蠢・・, '遒ｺ隱榊ｿ・・]
    const urgency: EmailEntry['urgency'] = urgencyKeywords.some(k => (newEmail.subject + newEmail.summary).includes(k)) ? 'high' : 'medium'
    const importance: EmailEntry['importance'] = importanceKeywords.some(k => (newEmail.subject + newEmail.summary).includes(k)) ? 'high' : 'medium'
    
    let category = '刀 縺昴・莉・
    if (/隲区ｱ・鬆伜庶|invoice|隕狗ｩ・.test(newEmail.subject + newEmail.summary)) category = '腸 邨檎炊'
    else if (/謇薙■蜷医ｏ縺斈莨夊ｭｰ|繝溘・繝・ぅ繝ｳ繧ｰ|MTG|譌･遞・.test(newEmail.subject + newEmail.summary)) category = '套 莠亥ｮ・
    else if (/繧ｿ繧ｹ繧ｯ|萓晞ｼ|縺企｡倥＞|蟇ｾ蠢・.test(newEmail.subject + newEmail.summary)) category = '搭 繧ｿ繧ｹ繧ｯ'
    else if (/蝣ｱ蜻掛蜈ｱ譛榎FYI|蜻ｨ遏･/.test(newEmail.subject + newEmail.summary)) category = '討 諠・ｱ蜈ｱ譛・
    else if (/遒ｺ隱鋼謇ｿ隱鋼繝ｬ繝薙Η繝ｼ|繝√ぉ繝・け/.test(newEmail.subject + newEmail.summary)) category = '笨・謇ｿ隱・
    
    const entry: EmailEntry = {
      id: Date.now().toString(),
      ...newEmail,
      urgency,
      importance,
      category,
      addedAt: new Date().toLocaleString('ja-JP'),
    }
    setEmails(prev => [entry, ...prev])
    setNewEmail({ from: '', subject: '', summary: '' })
  }

  // Schedule email generator
  const generateScheduleEmail = () => {
    const f = scheduleForm
    const sit = SCHEDULE_SITUATIONS.find(s => s.id === f.situation)
    return `${f.partnerName || '笳銀雷'}讒・

縺贋ｸ冶ｩｱ縺ｫ縺ｪ縺｣縺ｦ縺翫ｊ縺ｾ縺吶・{f.myName || '笳銀雷'}縺ｧ縺吶・
${f.topic ? `${f.topic}縺ｫ縺､縺・※縲～ : ''}縺頑遠縺｡蜷医ｏ縺帙・縺頑凾髢薙ｒ縺・◆縺縺代↑縺・〒縺励ｇ縺・°縲・

莉･荳九・譌･遞九〒縺秘・蜷医＞縺九′縺ｧ縺励ｇ縺・°縲・

竭 ${f.date1 || '笳区怦笳区律・遺雷・・0:00縲・}
竭｡ ${f.date2 || '笳区怦笳区律・遺雷・・0:00縲・}
竭｢ ${f.date3 || '笳区怦笳区律・遺雷・・0:00縲・}

謇隕∵凾髢難ｼ・{f.duration || sit?.duration || '1譎る俣'}遞句ｺｦ
蠖｢蠑擾ｼ・{f.location || sit?.format || '繧ｪ繝ｳ繝ｩ繧､繝ｳ'}

荳願ｨ倅ｻ･螟悶〒繧ゅ＃驛ｽ蜷医・濶ｯ縺・律譎ゅ′縺斐＊縺・∪縺励◆繧峨√♀豌苓ｻｽ縺ｫ縺疲欠螳壹￥縺縺輔＞縲・
縺雁ｿ吶＠縺・→縺薙ｍ諱千ｸｮ縺ｧ縺吶′縲√＃讀懆ｨ弱・縺ｻ縺ｩ繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶Ａ
  }

  // Habits diagnosis
  const diagnoseHabits = () => {
    let score = 100
    const tips: string[] = []
    const h = habits

    if (h.unreadCount > 50) { score -= 25; tips.push('閥 譛ｪ隱ｭ50莉ｶ莉･荳翫・蜊ｱ髯ｺ縲ゅ∪縺壹・蛻・Ν繝ｼ繝ｫ縲阪〒蜊ｳ霑比ｿ｡縺ｧ縺阪ｋ繧ゅ・繧堤援莉倥￠縺ｾ縺励ｇ縺・) }
    else if (h.unreadCount > 20) { score -= 15; tips.push('泯 譛ｪ隱ｭ20莉ｶ雜・・譌･縺ｮ邨ゅｏ繧翫↓蜿嶺ｿ｡繝医Ξ繧､繧堤ｩｺ縺ｫ縺吶ｋ鄙呈・繧偵▽縺代∪縺励ｇ縺・) }
    else if (h.unreadCount <= 5) { tips.push('泙 譛ｪ隱ｭ5莉ｶ莉･荳九・蜆ｪ遘・！nbox Zero縺ｫ霑代＞迥ｶ諷九〒縺・) }

    if (h.processTimeMin > 120) { score -= 20; tips.push('閥 繝｡繝ｼ繝ｫ蜃ｦ逅・↓2譎る俣莉･荳翫ゅヵ繧｣繝ｫ繧ｿ繝ｼ繝ｫ繝ｼ繝ｫ縺ｧ閾ｪ蜍穂ｻ募・縺代ｒ蠑ｷ蛹悶＠縺ｾ縺励ｇ縺・) }
    else if (h.processTimeMin > 60) { score -= 10; tips.push('泯 1譎る俣莉･荳翫・繝｡繝ｼ繝ｫ蜃ｦ逅・ゅユ繝ｳ繝励Ξ繝ｼ繝域ｴｻ逕ｨ縺ｧ霑比ｿ｡譎る俣繧堤洒邵ｮ縺ｧ縺阪∪縺・) }

    if (h.checkFrequency > 15) { score -= 15; tips.push('閥 1譌･15蝗樔ｻ･荳翫Γ繝ｼ繝ｫ繝√ぉ繝・け縺ｯ髮・ｸｭ蜉帙・螟ｧ謨ｵ縲・譌･3縲・蝗槭・繝舌ャ繝∝・逅・↓蛻・ｊ譖ｿ縺医∪縺励ｇ縺・) }
    else if (h.checkFrequency > 8) { score -= 8; tips.push('泯 繝｡繝ｼ繝ｫ繝√ぉ繝・け蝗樊焚縺悟､壹ａ縲る夂衍繧丹FF縺ｫ縺励※豎ｺ縺ｾ縺｣縺滓凾髢薙↓縺縺醍｢ｺ隱阪☆繧狗ｿ呈・繧・) }

    if (h.avgReplyHours > 48) { score -= 15; tips.push('閥 霑比ｿ｡縺ｫ48譎る俣莉･荳翫ゅ悟女鬆倥＠縺ｾ縺励◆縲阪・荳谺｡霑比ｿ｡縺縺代〒繧・4譎る俣莉･蜀・↓騾√ｊ縺ｾ縺励ｇ縺・) }
    else if (h.avgReplyHours > 24) { score -= 5; tips.push('泯 霑比ｿ｡縺ｯ24譎る俣莉･蜀・′逅・Φ縲ゅせ繧ｿ繝ｼ讖溯・縺ｧ隕∬ｿ比ｿ｡繝｡繝ｼ繝ｫ繧定ｦ句､ｱ繧上↑縺・ｷ･螟ｫ繧・) }

    if (h.subscriptions > 30) { score -= 15; tips.push('閥 雉ｼ隱ｭ30莉ｶ雜・・繝弱う繧ｺ縺ｮ蜈・ゆｻ翫☆縺蝉ｸ崎ｦ√↑繝九Η繝ｼ繧ｹ繝ｬ繧ｿ繝ｼ繧・0莉ｶ隗｣髯､縺励∪縺励ｇ縺・) }
    else if (h.subscriptions > 15) { score -= 5; tips.push('泯 雉ｼ隱ｭ縺悟､壹ａ縲よ怦1縺ｧ縲碁・菫｡蛛懈ｭ｢繝・・縲阪ｒ險ｭ縺代※譽壼査縺励ｒ') }

    if (h.dailyEmails > 100) { score -= 10; tips.push('庁 1譌･100騾夊ｶ・・蜿嶺ｿ｡縺ｯ讒矩逧・↑蝠城｡後４lack遲峨∈縺ｮ繝√Ε繝阪Ν遘ｻ陦後ｒ讀懆ｨ弱＠縺ｾ縺励ｇ縺・) }

    if (tips.length === 0) tips.push('脂 邏譎ｴ繧峨＠縺・ｼ√≠縺ｪ縺溘・繝｡繝ｼ繝ｫ邂｡逅・・髱槫ｸｸ縺ｫ蛛･蜈ｨ縺ｧ縺・)

    const level = score >= 80 ? '泙 蜆ｪ遘' : score >= 60 ? '泯 謾ｹ蝟・・菴吝慍縺ゅｊ' : score >= 40 ? '泛 隕∵ｳｨ諢・ : '閥 蜊ｱ髯ｺ'
    setHabitsResult({ score: Math.max(0, score), level, tips })
  }

  const checklistProgress = checklist.filter(c => c.done).length
  const checklistCategories = Array.from(new Set(checklist.map(c => c.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">闘</span>
              <h1 className="text-lg font-bold">Gmail AI Accelerator</h1>
            </div>
            <span className="text-xs text-white/30">繝悶Λ繧ｦ繧ｶ蜀・・逅・・繝・・繧ｿ騾∽ｿ｡縺ｪ縺・/span>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* 笂ｪ Gmail騾｣謳ｺ */}
        {tab === 'gmail' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">迫 Gmail騾｣謳ｺ</h2>
              <p className="text-sm text-white/50">Google繧｢繧ｫ繧ｦ繝ｳ繝医〒繝ｭ繧ｰ繧､繝ｳ縺励※蜿嶺ｿ｡繝医Ξ繧､繧定・蜍募・鬘・/p>
            </div>

            {!gmailAuth ? (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-6 text-center space-y-4">
                  <div className="text-5xl">闘</div>
                  <h3 className="text-lg font-bold">Gmail縺ｫ謗･邯・/h3>
                  <p className="text-sm text-white/50 max-w-md mx-auto">
                    Google繧｢繧ｫ繧ｦ繝ｳ繝医〒繝ｭ繧ｰ繧､繝ｳ縺吶ｋ縺ｨ縲∝女菫｡繝医Ξ繧､縺ｮ繝｡繝ｼ繝ｫ繧定・蜍輔〒
                    <strong className="text-teal-400">邱頑･蠎ｦﾃ鈴㍾隕∝ｺｦ繝槭ヨ繝ｪ繧ｯ繧ｹ</strong>縺ｧ蛻・｡槭＠縺ｾ縺吶・
                  </p>
                  <a
                    href="/api/auth/gmail"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Google縺ｧ繝ｭ繧ｰ繧､繝ｳ
                  </a>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300/70 max-w-md mx-auto">
                    笞・・隱ｭ縺ｿ蜿悶ｊ蟆ら畑・井ｻｶ蜷阪・蟾ｮ蜃ｺ莠ｺ・・ 荳区嶌縺堺ｽ懈・ + 繧ｴ繝溽ｮｱ遘ｻ蜍輔ゅΓ繝ｼ繝ｫ縺ｮ騾∽ｿ｡縺ｯ陦後＞縺ｾ縺帙ｓ縲・
                  </div>
                </div>

                {gmailError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                    笶・{gmailError}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Connected status */}
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">笨・/span>
                    <div>
                      <p className="text-sm font-bold text-teal-400">Gmail謗･邯壽ｸ医∩</p>
                      <p className="text-xs text-white/50">{gmailAuth.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchGmailMessages}
                      disabled={gmailLoading}
                      className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-xs font-medium hover:bg-teal-500/30 disabled:opacity-50"
                    >
                      {gmailLoading ? '竢ｳ 蜿門ｾ嶺ｸｭ...' : '踏 繝｡繝ｼ繝ｫ蜿門ｾ・}
                    </button>
                    <button
                      onClick={() => { setGmailAuth(null); sessionStorage.removeItem('gmail-auth'); setGmailMessages([]); setGmailClassified(new Map()) }}
                      className="px-3 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10"
                    >
                      繝ｭ繧ｰ繧｢繧ｦ繝・
                    </button>
                  </div>
                </div>

                {gmailError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                    笶・{gmailError}
                  </div>
                )}

                {/* Draft modal */}
                {selectedMessage && (
                  <div className="bg-white/5 border border-teal-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold">笨擾ｸ・荳区嶌縺堺ｽ懈・</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { trashMessage(selectedMessage); setSelectedMessage(null); setDraftBody('') }}
                          className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                          title="繧ｴ繝溽ｮｱ縺ｫ遘ｻ蜍・
                        >
                          卵・・蜑企勁
                        </button>
                        <button onClick={() => { setSelectedMessage(null); setDraftBody('') }} className="text-xs text-white/30 hover:text-white/60">笨・髢峨§繧・/button>
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-xs space-y-1.5">
                      <p className="text-white/40">From: {selectedMessage.from}</p>
                      <p className="text-white/40">Subject: {selectedMessage.subject}</p>
                      <p className="text-white/40">Date: {selectedMessage.date}</p>
                      <div className="border-t border-white/10 pt-1.5 mt-1.5">
                        {loadingBody ? (
                          <p className="text-white/40 animate-pulse">鐙 繝｡繝ｼ繝ｫ譛ｬ譁・ｒ隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</p>
                        ) : (
                          <pre className="text-white/70 leading-relaxed whitespace-pre-wrap font-sans max-h-[60vh] overflow-y-auto">{(messageBody || selectedMessage.snippet).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')}</pre>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => generateAiReply(selectedMessage)}
                      disabled={aiGenerating}
                      className="w-full py-2 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {aiGenerating ? (
                        <><span className="animate-spin">竢ｳ</span> AI縺瑚ｿ比ｿ｡譁・ｒ逕滓・荳ｭ...</>
                      ) : (
                        <>､・AI縺ｧ霑比ｿ｡譁・ｒ閾ｪ蜍慕函謌・/>
                      )}
                    </button>

                    {/* AI error fallback: copy prompt + external links */}
                    {aiError && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 space-y-2">
                        <p className="text-xs text-amber-300">笞・・AI繧ｵ繝ｼ繝舌・縺梧ｷｷ髮台ｸｭ縺ｧ縺吶ゆｻ･荳九・譁ｹ豕輔〒霑比ｿ｡譁・ｒ菴懈・縺ｧ縺阪∪縺呻ｼ・/p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(buildReplyPrompt(selectedMessage))
                            alert('繝励Ο繝ｳ繝励ヨ繧偵さ繝斐・縺励∪縺励◆・・)
                          }}
                          className="w-full py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-200 hover:bg-amber-500/30"
                        >
                          搭 繝励Ο繝ｳ繝励ヨ繧偵さ繝斐・
                        </button>
                        <div className="flex gap-2">
                          <a
                            href="https://gemini.google.com/app"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => navigator.clipboard.writeText(buildReplyPrompt(selectedMessage))}
                            className="flex-1 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-200 hover:bg-blue-500/30 text-center"
                          >
                            笨ｨ Gemini縺ｧ菴懈・
                          </a>
                          <a
                            href="https://chatgpt.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => navigator.clipboard.writeText(buildReplyPrompt(selectedMessage))}
                            className="flex-1 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-xs font-bold text-green-200 hover:bg-green-500/30 text-center"
                          >
                            町 ChatGPT縺ｧ菴懈・
                          </a>
                        </div>
                        <p className="text-[10px] text-white/30">竊・繝励Ο繝ｳ繝励ヨ縺瑚・蜍輔さ繝斐・縺輔ｌ縺ｾ縺・竊・螟夜ΚAI縺ｫ雋ｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞</p>
                      </div>
                    )}

                    <textarea
                      value={draftBody}
                      onChange={e => setDraftBody(e.target.value)}
                      placeholder="霑比ｿ｡譛ｬ譁・ｒ蜈･蜉・..&#10;・芋洟・荳翫・繝懊ち繝ｳ縺ｧAI縺瑚・蜍慕函謌舌√∪縺溘・謇句虚蜈･蜉幢ｼ・
                      className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white/80 placeholder-white/30 resize-none focus:outline-none focus:border-teal-500/30"
                    />
                    <button
                      onClick={() => createDraft(selectedMessage, draftBody)}
                      disabled={!draftBody.trim()}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-30"
                    >
                      統 Gmail縺ｮ荳区嶌縺阪↓菫晏ｭ假ｼ磯∽ｿ｡縺ｯ縺励∪縺帙ｓ・・
                    </button>
                    {draftStatus.get(selectedMessage.id)?.includes('菫晏ｭ俶ｸ医∩') && (
                      <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-xs text-teal-300">笨・荳区嶌縺堺ｿ晏ｭ伜ｮ御ｺ・ｼ；mail縺ｧ遒ｺ隱阪・騾∽ｿ｡縺励※縺上□縺輔＞</span>
                        <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-bold hover:bg-blue-500/30"
                        >陶 Gmail縺ｮ荳区嶌縺阪ｒ髢九￥</a>
                      </div>
                    )}
                  </div>
                )}

                {/* Messages list (hidden when draft modal is open) */}
                {gmailMessages.length > 0 && !selectedMessage && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold">闘 蜿嶺ｿ｡繝医Ξ繧､・・gmailMessages.length}莉ｶ・・/h3>
                      <div className="flex gap-2 text-xs text-white/30">
                        <span>閥鬮・泯荳ｭ</span>
                      </div>
                    </div>

                    {/* Eisenhower summary */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: '櫨 莉翫☆縺仙ｯｾ蠢・, count: Array.from(gmailClassified.values()).filter(c => c.urgency === '閥 鬮・ && c.importance === '閥 鬮・).length, bg: 'bg-red-500/10 border-red-500/20' },
                        { label: '笞｡ 譌ｩ繧√↓蟇ｾ蠢・, count: Array.from(gmailClassified.values()).filter(c => c.urgency === '閥 鬮・ && c.importance !== '閥 鬮・).length, bg: 'bg-orange-500/10 border-orange-500/20' },
                        { label: '東 險育判縺励※蟇ｾ蠢・, count: Array.from(gmailClassified.values()).filter(c => c.urgency !== '閥 鬮・ && c.importance === '閥 鬮・).length, bg: 'bg-amber-500/10 border-amber-500/20' },
                        { label: '唐 蠕悟屓縺涌K', count: Array.from(gmailClassified.values()).filter(c => c.urgency !== '閥 鬮・ && c.importance !== '閥 鬮・).length, bg: 'bg-white/5 border-white/10' },
                      ].map(q => (
                        <div key={q.label} className={`rounded-lg p-3 border ${q.bg}`}>
                          <div className="text-xs font-bold">{q.label}</div>
                          <div className="text-2xl font-bold mt-1">{q.count}</div>
                        </div>
                      ))}
                    </div>

                    {/* Message rows */}
                    <div className="space-y-1.5">
                      {gmailMessages.map(msg => {
                        const cls = gmailClassified.get(msg.id)
                        const status = draftStatus.get(msg.id)
                        return (
                          <div key={msg.id} className={`bg-white/5 rounded-lg p-3 space-y-1.5 cursor-pointer hover:bg-white/10 ${msg.isUnread ? 'border-l-2 border-teal-500' : ''}`} onClick={() => openDraftModal(msg)}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  {msg.isUnread && <span className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0" />}
                                  <span className="text-xs text-white/40 truncate">{msg.from.replace(/<.*>/, '').trim()}</span>
                                </div>
                                <p className={`text-sm truncate ${msg.isUnread ? 'font-bold text-white/90' : 'text-white/70'}`}>{msg.subject || '(莉ｶ蜷阪↑縺・'}</p>
                                <p className="text-xs text-white/30 truncate mt-0.5">{msg.snippet}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <span className="text-xs text-white/30">{new Date(msg.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
                                {cls && <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/50">{cls.category}</span>}
                              </div>
                            </div>
                            {cls && (
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2 text-xs">
                                  <span>邱頑･{cls.urgency}</span>
                                  <span>驥崎ｦ＋cls.importance}</span>
                                  <span className="text-teal-400 font-medium">竊・{cls.action}</span>
                                </div>
                                <div className="flex gap-1.5">
                                  {status ? (
                                    <span className="flex items-center gap-1.5">
                                      <span className="text-xs text-white/40">{status}</span>
                                      {status.includes('菫晏ｭ俶ｸ医∩') && (
                                        <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noopener noreferrer"
                                          onClick={e => e.stopPropagation()}
                                          className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 font-medium"
                                        >陶 Gmail</a>
                                      )}
                                    </span>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); openDraftModal(msg) }}
                                      className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs hover:bg-teal-500/30"
                                    >
                                      笨擾ｸ・荳区嶌縺・
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); trashMessage(msg) }}
                                    className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                                    title="繧ｴ繝溽ｮｱ縺ｫ遘ｻ蜍・
                                  >
                                    卵・・
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {!gmailLoading && gmailMessages.length === 0 && (
                  <div className="bg-white/5 rounded-xl p-8 text-center">
                    <p className="text-3xl mb-2">闘</p>
                    <p className="text-sm text-white/50">縲後Γ繝ｼ繝ｫ蜿門ｾ励阪・繧ｿ繝ｳ繧呈款縺励※蜿嶺ｿ｡繝医Ξ繧､繧貞叙蠕・/p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 竭 莉募・縺代Ν繝ｼ繝ｫ */}
        {tab === 'sort' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">踏 Gmail繝輔ぅ繝ｫ繧ｿ繝ｼ繝ｫ繝ｼ繝ｫ髮・/h2>
              <p className="text-sm text-white/50">繧ｳ繝斐・縺励※ Gmail 險ｭ螳・竊・繝輔ぅ繝ｫ繧ｿ 竊・譁ｰ隕丈ｽ懈・ 縺ｧ驕ｩ逕ｨ</p>
            </div>
            
            <div className="space-y-3">
              {FILTER_TEMPLATES.map((f, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{f.name}</h3>
                    <button onClick={() => copyText(f.rule, `filter-${i}`)} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                      {copied === `filter-${i}` ? '笨・繧ｳ繝斐・貂医∩' : '搭 繧ｳ繝斐・'}
                    </button>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 text-xs text-white/70 font-mono">{f.rule}</div>
                  <div className="flex flex-wrap gap-1">
                    {f.keywords.map(k => (
                      <span key={k} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/40">{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-teal-400 mb-2">庁 繧ｫ繧ｹ繧ｿ繝繝ｫ繝ｼ繝ｫ菴懈・縺ｮ繧ｳ繝・/h3>
              <ul className="text-xs text-white/60 space-y-1">
                <li>窶｢ <strong>from:</strong> 縺ｧ騾∽ｿ｡閠・ｒ謖・ｮ夲ｼ・R 縺ｧ隍・焚蜿ｯ・・/li>
                <li>窶｢ <strong>subject:</strong> 縺ｧ莉ｶ蜷阪・繧ｭ繝ｼ繝ｯ繝ｼ繝峨ｒ謖・ｮ・/li>
                <li>窶｢ <strong>has:attachment</strong> 縺ｧ豺ｻ莉倥ヵ繧｡繧､繝ｫ莉倥″繝｡繝ｼ繝ｫ繧呈歓蜃ｺ</li>
                <li>窶｢ <strong>larger:5M</strong> 縺ｧ螟ｧ縺阪＞繝｡繝ｼ繝ｫ縺縺代ヵ繧｣繝ｫ繧ｿ</li>
                <li>窶｢ 繝輔ぅ繝ｫ繧ｿ縺ｯ縲悟女菫｡貂医∩繝｡繝ｼ繝ｫ縺ｫ繧る←逕ｨ縲阪↓繝√ぉ繝・け繧貞ｿ倥ｌ縺壹↓</li>
              </ul>
            </div>
          </div>
        )}

        {/* 竭｡ 霑比ｿ｡繝・Φ繝励Ξ繝ｼ繝・*/}
        {tab === 'reply' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">笨会ｸ・霑比ｿ｡繝・Φ繝励Ξ繝ｼ繝磯寔</h2>
              <p className="text-sm text-white/50">{'{{螟画焚}}'} 繧定・蛻・・蜀・ｮｹ縺ｫ鄂ｮ縺肴鋤縺医※菴ｿ逕ｨ</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {REPLY_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setReplyCategory(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${replyCategory === c.id ? 'bg-teal-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {REPLY_CATEGORIES.find(c => c.id === replyCategory)?.templates.map((t, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{t.title}</h3>
                    <button onClick={() => copyText(t.body, `reply-${replyCategory}-${i}`)} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                      {copied === `reply-${replyCategory}-${i}` ? '笨・繧ｳ繝斐・貂医∩' : '搭 繧ｳ繝斐・'}
                    </button>
                  </div>
                  <pre className="bg-black/30 rounded-lg p-3 text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{t.body}</pre>
                </div>
              ))}
            </div>

            <button onClick={() => {
              const allTemplates = REPLY_CATEGORIES.flatMap(c => c.templates.map(t => `縲・{c.label} 窶・${t.title}縲曾n\n${t.body}`)).join('\n\n' + '='.repeat(40) + '\n\n')
              copyText(allTemplates, 'all-templates')
            }} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-sm font-bold hover:opacity-90">
              {copied === 'all-templates' ? '笨・蜈ｨ繝・Φ繝励Ξ繝ｼ繝医さ繝斐・貂医∩' : '搭 蜈ｨ繝・Φ繝励Ξ繝ｼ繝医ｒ荳諡ｬ繧ｳ繝斐・'}
            </button>
          </div>
        )}

        {/* 竭｢ 繧ｿ繧ｹ繧ｯ謨ｴ逅・*/}
        {tab === 'tasks' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">搭 繧ｿ繧ｹ繧ｯ謨ｴ逅・ｼ育ｷ頑･ﾃ鈴㍾隕√・繝医Μ繧ｯ繧ｹ・・/h2>
              <p className="text-sm text-white/50">繝｡繝ｼ繝ｫ縺ｮ莉ｶ蜷阪・隕∫ｴ・ｒ蜈･蜉帙☆繧九→閾ｪ蜍募・鬘・/p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <input value={newEmail.from} onChange={e => setNewEmail(p => ({ ...p, from: e.target.value }))} placeholder="蟾ｮ蜃ｺ莠ｺ・井ｾ・ 逕ｰ荳ｭ縺輔ｓ・・ className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <input value={newEmail.subject} onChange={e => setNewEmail(p => ({ ...p, subject: e.target.value }))} placeholder="莉ｶ蜷搾ｼ井ｾ・ 縲占・諤･縲第擂騾ｱ縺ｮ隕狗ｩ肴嶌遒ｺ隱搾ｼ・ className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <textarea value={newEmail.summary} onChange={e => setNewEmail(p => ({ ...p, summary: e.target.value }))} placeholder="隕∫ｴ・ｼ井ｻｻ諢擾ｼ・ className="w-full h-16 bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white/70 resize-none placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <button onClick={addEmail} className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-sm font-bold hover:opacity-90">踏 霑ｽ蜉縺励※閾ｪ蜍募・鬘・/button>
            </div>

            {emails.length > 0 && (
              <>
                {/* Eisenhower Matrix */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '閥 邱頑･ ﾃ・驥崎ｦ・, filter: (e: EmailEntry) => e.urgency === 'high' && e.importance === 'high', bg: 'bg-red-500/10 border-red-500/20', desc: '莉翫☆縺仙ｯｾ蠢・ },
                    { label: '泯 髱樒ｷ頑･ ﾃ・驥崎ｦ・, filter: (e: EmailEntry) => e.urgency !== 'high' && e.importance === 'high', bg: 'bg-amber-500/10 border-amber-500/20', desc: '險育判縺励※蟇ｾ蠢・ },
                    { label: '泛 邱頑･ ﾃ・髱樣㍾隕・, filter: (e: EmailEntry) => e.urgency === 'high' && e.importance !== 'high', bg: 'bg-orange-500/10 border-orange-500/20', desc: '蟋比ｻｻ繧呈､懆ｨ・ },
                    { label: '笞ｪ 髱樒ｷ頑･ ﾃ・髱樣㍾隕・, filter: (e: EmailEntry) => e.urgency !== 'high' && e.importance !== 'high', bg: 'bg-white/5 border-white/10', desc: '繧｢繝ｼ繧ｫ繧､繝門呵｣・ },
                  ].map((q, qi) => (
                    <div key={qi} className={`rounded-xl p-3 border ${q.bg}`}>
                      <div className="text-xs font-bold mb-1">{q.label}</div>
                      <div className="text-xs text-white/30 mb-2">{q.desc}</div>
                      {emails.filter(q.filter).map(e => (
                        <div key={e.id} className="bg-black/20 rounded-lg p-2 mb-1.5 text-xs">
                          <div className="font-medium text-white/80 truncate">{e.subject}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/30">{e.from}</span>
                            <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/40">{e.category}</span>
                          </div>
                        </div>
                      ))}
                      {emails.filter(q.filter).length === 0 && <div className="text-xs text-white/20 text-center py-2">縺ｪ縺・/div>}
                    </div>
                  ))}
                </div>

                <button onClick={() => { setEmails([]); localStorage.removeItem('inbox-organizer-emails') }} className="text-xs text-white/30 hover:text-red-400">卵・・蜈ｨ莉ｶ繧ｯ繝ｪ繧｢</button>
              </>
            )}
          </div>
        )}

        {/* 竭｣ 譌･遞玖ｪｿ謨ｴ */}
        {tab === 'schedule' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">套 譌･遞玖ｪｿ謨ｴ繝｡繝ｼ繝ｫ逕滓・</h2>
              <p className="text-sm text-white/50">蜈･蜉帙☆繧九□縺代〒荳∝ｯｧ縺ｪ譌･遞玖ｪｿ謨ｴ繝｡繝ｼ繝ｫ縺悟ｮ梧・</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SCHEDULE_SITUATIONS.map(s => (
                <button key={s.id} onClick={() => setScheduleForm(p => ({ ...p, situation: s.id }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${scheduleForm.situation === s.id ? 'bg-teal-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={scheduleForm.partnerName} onChange={e => setScheduleForm(p => ({ ...p, partnerName: e.target.value }))} placeholder="逶ｸ謇九・蜷榊燕" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                <input value={scheduleForm.myName} onChange={e => setScheduleForm(p => ({ ...p, myName: e.target.value }))} placeholder="閾ｪ蛻・・蜷榊燕" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              </div>
              <input value={scheduleForm.topic} onChange={e => setScheduleForm(p => ({ ...p, topic: e.target.value }))} placeholder="謇薙■蜷医ｏ縺帙・逶ｮ逧・ｼ井ｻｻ諢擾ｼ・ className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <div className="space-y-2">
                <label className="text-xs text-white/40">蛟呵｣懈律譎ゑｼ・縺､・・/label>
                {['date1', 'date2', 'date3'].map((key, i) => (
                  <input key={key} value={scheduleForm[key as keyof typeof scheduleForm]} onChange={e => setScheduleForm(p => ({ ...p, [key]: e.target.value }))} placeholder={`蛟呵｣・{i + 1}: 萓具ｼ・譛・0譌･・域怦・・4:00縲彖} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={scheduleForm.duration} onChange={e => setScheduleForm(p => ({ ...p, duration: e.target.value }))} placeholder="謇隕∵凾髢・ className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                <input value={scheduleForm.location} onChange={e => setScheduleForm(p => ({ ...p, location: e.target.value }))} placeholder="蝣ｴ謇繝ｻ蠖｢蠑・ className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">逕滓・邨先棡</h3>
                <button onClick={() => copyText(generateScheduleEmail(), 'schedule-email')} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                  {copied === 'schedule-email' ? '笨・繧ｳ繝斐・貂医∩' : '搭 繧ｳ繝斐・'}
                </button>
              </div>
              <pre className="bg-black/30 rounded-lg p-4 text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{generateScheduleEmail()}</pre>
            </div>
          </div>
        )}

        {/* 竭､ Inbox Zero 繝√ぉ繝・け繝ｪ繧ｹ繝・*/}
        {tab === 'checklist' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">ｧｹ Inbox Zero繝√ぉ繝・け繝ｪ繧ｹ繝・/h2>
              <p className="text-sm text-white/50">GTD蠑・ﾃ・Inbox Zero 窶・豈取律縺ｮ繝ｫ繝ｼ繝・ぅ繝ｳ</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">{checklistProgress} / {checklist.length} 螳御ｺ・/span>
                <span className="text-xs text-white/40">{Math.round(checklistProgress / checklist.length * 100)}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all" style={{ width: `${checklistProgress / checklist.length * 100}%` }} />
              </div>
            </div>

            {checklistCategories.map(cat => (
              <div key={cat} className="space-y-2">
                <h3 className="text-sm font-bold text-teal-400">{cat}</h3>
                {checklist.filter(c => c.category === cat).map(item => (
                  <button key={item.id} onClick={() => setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, done: !c.done } : c))} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${item.done ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-white/5 hover:bg-white/10'}`}>
                    <span className="text-lg">{item.done ? '笨・ : '筮・}</span>
                    <span className={`text-sm ${item.done ? 'text-white/40 line-through' : 'text-white/80'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}

            {checklistProgress === checklist.length && (
              <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-6 text-center">
                <p className="text-3xl mb-2">脂</p>
                <p className="font-bold text-lg">Inbox Zero 驕疲・・・/p>
                <p className="text-sm text-white/50 mt-1">邏譎ｴ繧峨＠縺・ｼ∵・譌･繧ょ酔縺倥Ν繝ｼ繝・ぅ繝ｳ繧堤ｶ壹￠縺ｾ縺励ｇ縺・/p>
              </div>
            )}

            <button onClick={() => setChecklist(INBOX_ZERO_CHECKLIST)} className="text-xs text-white/30 hover:text-amber-400">売 繝ｪ繧ｻ繝・ヨ</button>
          </div>
        )}

        {/* 竭･ 鄙呈・險ｺ譁ｭ */}
        {tab === 'habits' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">投 繝｡繝ｼ繝ｫ鄙呈・險ｺ譁ｭ</h2>
              <p className="text-sm text-white/50">縺ゅ↑縺溘・繝｡繝ｼ繝ｫ鄙呈・繧・謖・ｨ吶〒繧ｹ繧ｳ繧｢蛹・/p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-4">
              {[
                { key: 'dailyEmails', label: '1譌･縺ｮ蜿嶺ｿ｡繝｡繝ｼ繝ｫ謨ｰ', min: 0, max: 300, step: 10, unit: '騾・ },
                { key: 'unreadCount', label: '迴ｾ蝨ｨ縺ｮ譛ｪ隱ｭ繝｡繝ｼ繝ｫ謨ｰ', min: 0, max: 500, step: 5, unit: '莉ｶ' },
                { key: 'processTimeMin', label: '1譌･縺ｮ繝｡繝ｼ繝ｫ蜃ｦ逅・凾髢・, min: 0, max: 240, step: 15, unit: '蛻・ },
                { key: 'avgReplyHours', label: '蟷ｳ蝮・ｿ比ｿ｡譎る俣', min: 1, max: 72, step: 1, unit: '譎る俣' },
                { key: 'checkFrequency', label: '1譌･縺ｮ繝｡繝ｼ繝ｫ繝√ぉ繝・け蝗樊焚', min: 1, max: 30, step: 1, unit: '蝗・ },
                { key: 'subscriptions', label: '雉ｼ隱ｭ荳ｭ縺ｮ繝九Η繝ｼ繧ｹ繝ｬ繧ｿ繝ｼ謨ｰ', min: 0, max: 100, step: 1, unit: '莉ｶ' },
              ].map(s => (
                <div key={s.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{s.label}</span>
                    <span className="font-bold text-teal-400">{habits[s.key as keyof typeof habits]}{s.unit}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={habits[s.key as keyof typeof habits]} onChange={e => setHabits(p => ({ ...p, [s.key]: Number(e.target.value) }))} className="w-full accent-teal-500" />
                </div>
              ))}
            </div>

            <button onClick={diagnoseHabits} className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-sm font-bold hover:opacity-90">投 險ｺ譁ｭ縺吶ｋ</button>

            {habitsResult && (
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{habitsResult.score}<span className="text-lg text-white/40">/100</span></div>
                  <div className="text-lg font-bold">{habitsResult.level}</div>
                </div>
                <div className="space-y-2">
                  {habitsResult.tips.map((tip, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-3 text-sm text-white/70">{tip}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
          <p className="text-xs text-white/20">
            {gmailAuth ? 'Gmail騾｣謳ｺ: 繝｡繝ｼ繝ｫ繝・・繧ｿ縺ｯ繧ｻ繝・す繝ｧ繝ｳ荳ｭ縺ｮ縺ｿ菫晄戟縲ゅΟ繧ｰ繧｢繧ｦ繝医〒蜈ｨ豸亥悉縲・ : '縺吶∋縺ｦ縺ｮ繝・・繧ｿ縺ｯ繝悶Λ繧ｦ繧ｶ蜀・↓菫晏ｭ倥＆繧後∪縺吶ゅし繝ｼ繝舌・縺ｫ騾∽ｿ｡縺輔ｌ縺ｾ縺帙ｓ縲・}
          </p>
        </div>
      </div>
    
      </div>
  )
}


