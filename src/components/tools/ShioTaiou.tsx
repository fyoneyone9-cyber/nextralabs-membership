'use client'


import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check, ArrowLeft, RefreshCw, Shield, Clock, MessageSquare } from 'lucide-react'
import Link from 'next/link'

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
type Relationship = 'in-laws' | 'relatives' | 'boss' | 'neighbor' | 'other'
type Tone = 'gentle' | 'firm' | 'iron'
type Situation = 'visit' | 'event' | 'money' | 'lifestyle' | 'child' | 'other'

interface Reply {
  text: string
  readDelay: string
  tip: string
}

// 笏笏笏 Data 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const RELATIONSHIPS: Record<Relationship, string> = {
  'in-laws': '鄒ｩ辷ｶ豈・,
  'relatives': '隕ｪ謌・,
  'boss': '荳雁昇繝ｻ蜈郁ｼｩ',
  'neighbor': '霑第園繝ｻ縺碑ｿ第園',
  'other': '縺昴・莉・,
}

const TONES: Record<Tone, { label: string; desc: string }> = {
  gentle: { label: '繧・ｓ繧上ｊ', desc: '譟斐ｉ縺九￥縲√〒繧よ妙繧・ },
  firm: { label: '縺励▲縺九ｊ', desc: '逅・罰繧呈・遒ｺ縺ｫ縺励※譁ｭ繧・ },
  iron: { label: '驩・｣・, desc: '荳蛻・・髫吶ｒ荳弱∴縺ｪ縺・ },
}

const SITUATIONS: Record<Situation, string> = {
  visit: '險ｪ蝠上・蟶ｰ逵√・隕∵ｱ・,
  event: '豕穂ｺ九・陦御ｺ九∈縺ｮ蜿ょ刈',
  money: '縺企≡縺ｮ辟｡蠢・・謠ｴ蜉ｩ',
  lifestyle: '逕滓ｴｻ縺ｸ縺ｮ蟷ｲ貂峨・隱ｬ謨・,
  child: '蟄蝉ｾ帙・蟄ｫ繝ｻ邨仙ｩ壹・蛯ｬ菫・,
  other: '縺昴・莉悶・驥阪＞鬆ｼ縺ｿ',
}

const TEMPLATES: Record<Situation, Record<Tone, string[]>> = {
  visit: {
    gentle: [
      '縺頑ｰ玲戟縺｡縺ｯ縺ｨ縺ｦ繧ょｬ峨＠縺・〒縺吶ゅ◆縺縲∵怙霑代■繧・▲縺ｨ繝舌ち繝舌ち縺励※縺翫ｊ縺ｾ縺励※窶ｦ關ｽ縺｡逹縺・◆繧峨％縺｡繧峨°繧峨＃騾｣邨｡縺輔○縺ｦ縺上□縺輔＞ 刧',
      '縺・▽繧ゅ♀豌鈴▲縺・≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶ゆｻ翫・縺｡繧・▲縺ｨ莠亥ｮ壹′遶九※縺･繧峨＞迥ｶ豕√〒縺励※縲√∪縺滓隼繧√※縺皮嶌隲・＆縺帙※縺上□縺輔＞縲・,
      '縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺呻ｼ∝ｰ代＠菴楢ｪｿ繧呈紛縺医※縺九ｉ縺ｫ縺励◆縺・・縺ｧ縲√∪縺滓凾譛溘′譚･縺溘ｉ縺薙■繧峨°繧峨♀螢ｰ縺後￠縺励∪縺吶・縲・,
    ],
    firm: [
      '縺願ｪ倥＞縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶ら筏縺苓ｨｳ縺ゅｊ縺ｾ縺帙ｓ縺後∝ｽ馴擇縺ｯ莉穂ｺ九・驛ｽ蜷医〒縺贋ｼｺ縺・☆繧九・縺碁屮縺励＞迥ｶ豕√〒縺吶り誠縺｡逹縺阪∪縺励◆繧峨＃騾｣邨｡縺・◆縺励∪縺吶・,
      '縺ゅｊ縺後◆縺・♀隧ｱ縺ｧ縺吶′縲∫樟蝨ｨ縺ｮ逕滓ｴｻ繝ｪ繧ｺ繝逧・↓騾ｱ譛ｫ縺ｮ螟門・縺悟宍縺励￥縲√♀邏・據縺ｧ縺阪°縺ｭ縺ｾ縺吶ら筏縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縲・,
      '縺頑ｰ玲戟縺｡縺ｯ驥阪・価遏･縺励※縺翫ｊ縺ｾ縺吶′縲√＠縺ｰ繧峨￥縺ｯ螳ｶ蠎ｭ縺ｮ莠区ュ縺ｧ驕蜃ｺ繧呈而縺医※縺翫ｊ縺ｾ縺吶ゅ＃逅・ｧ｣縺・◆縺縺代∪縺吶→蟷ｸ縺・〒縺吶・,
    ],
    iron: [
      '縺秘｣邨｡縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶よ＄繧悟・繧翫∪縺吶′縲∬ｨｪ蝠上・莠亥ｮ壹・蠖馴擇縺斐＊縺・∪縺帙ｓ縲ゅ％縺｡繧峨・驛ｽ蜷医′縺､縺阪∪縺励◆繧峨♀遏･繧峨○縺・◆縺励∪縺吶・,
      '莉雁ｾ後・險ｪ蝠上↓縺､縺・※縺ｯ縲√％縺｡繧峨°繧画隼繧√※縺秘｣邨｡蟾ｮ縺嶺ｸ翫￡縺ｾ縺吶ゅ♀豌鈴▲縺・↑縺上♀驕弱＃縺励￥縺縺輔＞縲・,
      '逕ｳ縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縺後∝ｽ灘・縺ｮ髢薙♀莨ｺ縺・☆繧九％縺ｨ縺ｯ蜿ｶ縺・∪縺帙ｓ縲ゆｽ募穀縺比ｺ・価縺上□縺輔＞縲・,
    ],
  },
  event: {
    gentle: [
      '螟ｧ蛻・↑陦御ｺ九↑縺ｮ縺ｫ逕ｳ縺苓ｨｳ縺ゅｊ縺ｾ縺帙ｓ縲ゅ≠縺・↓縺上◎縺ｮ譎よ悄縺ｯ螟悶○縺ｪ縺・畑莠九′縺ゅｊ縺ｾ縺励※窶ｦ縺頑ｰ玲戟縺｡縺縺代〒繧ょｱ翫￠縺輔○縺ｦ縺上□縺輔＞縲・,
      '縺疲｡亥・縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶よｮ句ｿｵ縺ｪ縺後ｉ驛ｽ蜷医′縺､縺九★窶ｦ縲ょｿ・・縺九ｊ縺ｧ縺吶′縺贋ｾ帙∴・医♀鬥吝・・峨ｒ縺企√ｊ縺輔○縺ｦ縺・◆縺縺阪∪縺吶・,
      '陦御ｺ九・縺顔衍繧峨○縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶ゆｻ雁屓縺ｯ蜿ょ刈縺碁屮縺励◎縺・〒縺吶よｬ｡縺ｮ讖滉ｼ壹↓縺ｯ縺懊・縲・,
    ],
    firm: [
      '縺疲｡亥・縺・◆縺縺阪≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶りｪ縺ｫ逕ｳ縺苓ｨｳ縺ゅｊ縺ｾ縺帙ｓ縺後∽ｻ穂ｺ九・髢｢菫ゅ〒蜿ょ刈縺碁屮縺励＞迥ｶ豕√〒縺吶ょ挨騾斐♀豌玲戟縺｡繧偵♀騾√ｊ縺輔○縺ｦ縺・◆縺縺阪∪縺吶・,
      '螟ｧ螟画＄邵ｮ縺ｧ縺吶′縲√せ繧ｱ繧ｸ繝･繝ｼ繝ｫ縺ｮ驛ｽ蜷井ｸ翫∽ｻ雁屓縺ｯ谺蟶ｭ縺ｨ縺輔○縺ｦ縺・◆縺縺阪∪縺吶ゅ＃莠・価縺上□縺輔＞縲・,
      '譌･遞九ｒ遒ｺ隱阪＞縺溘＠縺ｾ縺励◆縺後∵ｮ句ｿｵ縺ｪ縺後ｉ隱ｿ謨ｴ縺後▽縺阪∪縺帙ｓ縺ｧ縺励◆縲ら筏縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縲・,
    ],
    iron: [
      '縺秘｣邨｡縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶ゆｻ雁屓縺ｮ陦御ｺ九∈縺ｮ蜿ょ刈縺ｯ隕矩√ｉ縺帙※縺・◆縺縺阪∪縺吶ゅ＃莠・価縺上□縺輔＞縲・,
      '諱舌ｌ蜈･繧翫∪縺吶′縲∽ｻ雁屓縺ｯ谺蟶ｭ縺・◆縺励∪縺吶ゆｻ雁ｾ後・陦御ｺ九↓縺､縺・※繧ゅ∝盾蜉蜿ｯ閭ｽ縺ｪ蝣ｴ蜷医・縺薙■繧峨°繧峨＃騾｣邨｡縺・◆縺励∪縺吶・,
      '逕ｳ縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縺後∝・蟶ｭ縺ｯ蜿ｶ縺・∪縺帙ｓ縲ゆｽ募穀繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・,
    ],
  },
  money: {
    gentle: [
      '縺雁鴨縺ｫ縺ｪ繧翫◆縺・ｰ玲戟縺｡縺ｯ縺ゅｋ縺ｮ縺ｧ縺吶′縲∵・縺悟ｮｶ繧ゆｻ翫■繧・▲縺ｨ菴呵｣輔′縺ｪ縺上※窶ｦ縲ゅ♀蠖ｹ縺ｫ遶九※縺夂筏縺苓ｨｳ縺ゅｊ縺ｾ縺帙ｓ縲・,
      '縺比ｺ区ュ縺ｯ縺雁ｯ溘＠縺励∪縺吶′縲√％縺｡繧峨ｂ螳ｶ險医′蜴ｳ縺励＞譎よ悄縺ｧ縺励※窶ｦ縲よ悽蠖薙↓逕ｳ縺苓ｨｳ縺ｪ縺・・縺ｧ縺吶′縲∽ｻ雁屓縺ｯ縺疲悄蠕・↓豐ｿ縺医◎縺・↓縺ゅｊ縺ｾ縺帙ｓ縲・,
      '縺頑ｰ玲戟縺｡縺ｯ繧上°繧翫∪縺吶ゅ◆縺縲√≧縺｡繧ゅΟ繝ｼ繝ｳ縺ｪ縺ｩ縺後≠縺｣縺ｦ驥鷹姦逧・↑謠ｴ蜉ｩ縺ｯ髮｣縺励＞迥ｶ豕√〒縺吶ゆｻ悶・蠖｢縺ｧ縺雁鴨縺ｫ縺ｪ繧後ｋ縺薙→縺後≠繧後・縲・,
    ],
    firm: [
      '螟ｧ螟画＄繧悟・繧翫∪縺吶′縲・≡驫ｭ逧・↑縺疲抄蜉ｩ縺ｯ謌代′螳ｶ縺ｮ譁ｹ驥昴→縺励※縺雁女縺代＠縺ｦ縺翫ｊ縺ｾ縺帙ｓ縲ゅ＃逅・ｧ｣縺・◆縺縺代∪縺吶→蟷ｸ縺・〒縺吶・,
      '縺願ｩｱ縺ｯ謇ｿ繧翫∪縺励◆縺後∝ｮｶ險医・莠区ュ縺ｫ繧医ｊ驥鷹姦髱｢縺ｧ縺ｮ縺泌鵠蜉帙・閾ｴ縺励°縺ｭ縺ｾ縺吶ゆｽ募穀縺比ｺ・価縺上□縺輔＞縲・,
      '逕ｳ縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縺後∫ｵ梧ｸ育噪縺ｪ謾ｯ謠ｴ縺ｫ縺､縺・※縺ｯ蟇ｾ蠢懊＞縺溘＠縺九・縺ｾ縺吶ゆｻ悶↓縺頑焔莨昴＞縺ｧ縺阪ｋ縺薙→縺後≠繧後・縺顔筏縺嶺ｻ倥￠縺上□縺輔＞縲・,
    ],
    iron: [
      '驥鷹姦縺ｮ縺皮嶌隲・↓縺､縺・※縺ｯ縲∽ｸ蛻・♀蜿励￠縺励※縺翫ｊ縺ｾ縺帙ｓ縲ゅ＃莠・価縺上□縺輔＞縲・,
      '諱舌ｌ蜈･繧翫∪縺吶′縲・≡驫ｭ髱｢縺ｧ縺ｮ縺碑ｦ∵悍縺ｫ縺ｯ縺雁ｿ懊∴縺ｧ縺阪∪縺帙ｓ縲ゆｻ雁ｾ悟酔讒倥・縺皮嶌隲・・縺秘□諷ｮ縺・◆縺縺代∪縺吶ｈ縺・♀鬘倥＞縺・◆縺励∪縺吶・,
      '逕ｳ縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縺後√♀驥代↓髢｢縺吶ｋ縺願ｩｱ縺ｯ縺雁女縺代＞縺溘＠縺九・縺ｾ縺吶ゅ＃逅・ｧ｣縺ｮ縺ｻ縺ｩ繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・,
    ],
  },
  lifestyle: {
    gentle: [
      '繧｢繝峨ヰ繧､繧ｹ縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶ょ盾閠・↓縺輔○縺ｦ縺・◆縺縺阪∪縺吶・縲ょ､ｫ蟀ｦ縺ｧ逶ｸ隲・＠縺ｪ縺後ｉ繧・▲縺ｦ縺・″縺ｾ縺吶・縺ｧ縲∬ｦ句ｮ医▲縺ｦ縺・◆縺縺代ｋ縺ｨ螫峨＠縺・〒縺・・',
      '縺泌ｿ・・縺・◆縺縺阪≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶ゅ＞繧阪＞繧崎ｩｦ陦碁険隱､荳ｭ縺ｧ縺吶′縲∽ｺ御ｺｺ縺ｧ鬆大ｼｵ縺｣縺ｦ縺・∪縺吶・縺ｧ螟ｧ荳亥､ｫ縺ｧ縺呻ｼ・,
      '縺頑ｰ鈴▲縺・≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶ゆｻ翫・逕滓ｴｻ繧ｹ繧ｿ繧､繝ｫ縺檎ｧ√◆縺｡縺ｫ縺ｯ蜷医▲縺ｦ縺・ｋ縺ｮ縺ｧ縲√％縺ｮ縺ｾ縺ｾ邯壹￠縺ｦ縺・％縺・→諤昴▲縺ｦ縺・∪縺吶・,
    ],
    firm: [
      '縺疲э隕九≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶ゅ◆縺縲∫函豢ｻ縺ｮ縺薙→縺ｫ縺､縺・※縺ｯ螟ｫ蟀ｦ縺ｧ隧ｱ縺怜粋縺｣縺ｦ豎ｺ繧√※縺翫ｊ縺ｾ縺吶・縺ｧ縲√＃逅・ｧ｣縺・◆縺縺代∪縺吶→蜉ｩ縺九ｊ縺ｾ縺吶・,
      '縺頑ｰ玲戟縺｡縺ｯ蜊∝・莨昴ｏ縺｣縺ｦ縺翫ｊ縺ｾ縺吶ゅ〒縺吶′縲∝推螳ｶ蠎ｭ縺ｫ縺ｯ縺昴ｌ縺槭ｌ縺ｮ莠区ュ縺後≠繧翫∪縺吶・縺ｧ縲∫ｧ√◆縺｡縺ｮ繧・ｊ譁ｹ繧貞ｰ企㍾縺励※縺・◆縺縺代ｋ縺ｨ蟷ｸ縺・〒縺吶・,
      '繧｢繝峨ヰ繧､繧ｹ繧偵＞縺溘□縺上・縺ｯ縺ゅｊ縺後◆縺・・縺ｧ縺吶′縲∫函豢ｻ髱｢縺ｮ縺薙→縺ｯ遘√◆縺｡縺ｧ蛻､譁ｭ縺輔○縺ｦ縺・◆縺縺・※縺翫ｊ縺ｾ縺吶・,
    ],
    iron: [
      '逕滓ｴｻ縺ｫ髢｢縺吶ｋ縺薙→縺ｯ遘√◆縺｡螟ｫ蟀ｦ縺ｧ豎ｺ繧√※縺翫ｊ縺ｾ縺吶ゅ＃諢剰ｦ九・謇ｿ繧翫∪縺吶′縲∝愛譁ｭ縺ｯ縺薙■繧峨〒縺・◆縺励∪縺吶・,
      '諱舌ｌ蜈･繧翫∪縺吶′縲∫ｧ√◆縺｡縺ｮ逕滓ｴｻ譁ｹ驥昴↓縺､縺・※縺ｯ縺薙■繧峨〒邂｡逅・＠縺ｦ縺翫ｊ縺ｾ縺吶ゅ＃蟷ｲ貂峨・縺頑而縺医＞縺溘□縺代∪縺吶ｈ縺・♀鬘倥＞縺・◆縺励∪縺吶・,
      '繝励Λ繧､繝吶・繝医↑莠区氛縺ｫ縺､縺・※縺ｯ縲√＃蜉ｩ險縺ｯ荳崎ｦ√〒縺吶ゆｽ募穀縺皮炊隗｣縺上□縺輔＞縲・,
    ],
  },
  child: {
    gentle: [
      '縺・▽繧よｰ励↓縺九￠縺ｦ縺上□縺輔▲縺ｦ縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶ょｭ蝉ｾ帙・縺薙→縺ｯ遘√◆縺｡縺ｮ繝壹・繧ｹ縺ｧ閠・∴縺ｦ縺・″縺溘＞縺ｨ諤昴▲縺ｦ縺・∪縺吶・縺ｧ縲∵ｸｩ縺九￥隕句ｮ医▲縺ｦ縺・◆縺縺代ｋ縺ｨ螫峨＠縺・〒縺・・',
      '縺雁ｭｫ縺輔ｓ縺ｮ鬘斐′隕九◆縺・♀豌玲戟縺｡縺ｯ繧医￥蛻・°繧翫∪縺吶ゅ〒繧ら┬繧峨★縲∫ｧ√◆縺｡縺ｮ繧ｿ繧､繝溘Φ繧ｰ縺ｧ窶ｦ縺ｨ諤昴▲縺ｦ縺翫ｊ縺ｾ縺吶・縺ｧ縲√ｂ縺・ｰ代＠縺雁ｾ・■縺上□縺輔＞縺ｭ縲・,
      '縺ゅｊ縺後◆縺・♀險闡峨〒縺吶らｵ仙ｩ夲ｼ亥ｭ蝉ｾ幢ｼ峨↓縺､縺・※縺ｯ莠御ｺｺ縺ｧ縺倥▲縺上ｊ閠・∴縺ｦ縺・∪縺吶・縺ｧ縲∵ｱｺ縺ｾ縺｣縺溘ｉ縺顔衍繧峨○縺励∪縺吶・縲・,
    ],
    firm: [
      '蟄蝉ｾ幢ｼ育ｵ仙ｩ夲ｼ峨↓縺､縺・※縺ｯ縲∫ｧ√◆縺｡閾ｪ霄ｫ縺ｮ繧ｿ繧､繝溘Φ繧ｰ縺ｧ豎ｺ繧√◆縺・→閠・∴縺ｦ縺翫ｊ縺ｾ縺吶ゅ♀豌玲戟縺｡縺ｯ縺ゅｊ縺後◆縺・・縺ｧ縺吶′縲√％縺ｮ莉ｶ縺ｫ縺､縺・※縺ｯ縺昴▲縺ｨ縺励※縺翫＞縺ｦ縺・◆縺縺代ｋ縺ｨ蜉ｩ縺九ｊ縺ｾ縺吶・,
      '螟ｧ螟峨ョ繝ｪ繧ｱ繝ｼ繝医↑隧ｱ鬘後〒縺吶・縺ｧ縲∫ｧ√◆縺｡縺ｮ蛻､譁ｭ縺ｫ縺贋ｻｻ縺帙＞縺溘□縺代∪縺吶°縲よ凾縺梧擂縺ｾ縺励◆繧峨♀莨昴∴縺・◆縺励∪縺吶・,
      '縺疲悄蠕・＆繧後ｋ縺頑ｰ玲戟縺｡縺ｯ謇ｿ遏･縺励※縺翫ｊ縺ｾ縺吶′縲√％縺ｮ莉ｶ縺ｫ縺､縺・※縺ｯ莠御ｺｺ縺ｧ隧ｱ縺怜粋縺｣縺ｦ縺翫ｊ縺ｾ縺吶ゅ＃逅・ｧ｣繧偵♀鬘倥＞縺・◆縺励∪縺吶・,
    ],
    iron: [
      '蟄蝉ｾ幢ｼ育ｵ仙ｩ夲ｼ峨↓髢｢縺励※縺ｯ縲∫ｧ√◆縺｡縺ｮ蝠城｡後〒縺吶・縺ｧ縲∽ｻ雁ｾ後％縺ｮ隧ｱ鬘後↓縺ｯ隗ｦ繧後↑縺・〒縺・◆縺縺代∪縺吶ｈ縺・♀鬘倥＞縺・◆縺励∪縺吶・,
      '諱舌ｌ蜈･繧翫∪縺吶′縲∝ｮｶ譌剰ｨ育判縺ｫ縺､縺・※縺ｯ荳蛻・♀遲斐∴縺・◆縺励°縺ｭ縺ｾ縺吶ゅ＃莠・価縺上□縺輔＞縲・,
      '縺薙・莉ｶ縺ｫ縺､縺・※縺ｯ蝗樒ｭ斐ｒ謗ｧ縺医＆縺帙※縺・◆縺縺阪∪縺吶らｧ√◆縺｡縺ｮ蛻､譁ｭ縺ｧ縺斐＊縺・∪縺吶・縺ｧ縲∽ｽ募穀縺皮炊隗｣縺上□縺輔＞縲・,
    ],
  },
  other: {
    gentle: [
      '縺雁｣ｰ縺後￠縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶ゅ■繧・▲縺ｨ莉翫・菴呵｣輔′縺ｪ縺上※窶ｦ縲ゅ∪縺溯誠縺｡逹縺・◆繧峨％縺｡繧峨°繧峨＃騾｣邨｡縺励∪縺吶・縲・,
      '縺ゅｊ縺後◆縺・♀隧ｱ縺ｪ縺ｮ縺ｧ縺吶′縲∽ｻ雁屓縺ｯ縺秘□諷ｮ縺輔○縺ｦ縺・◆縺縺阪∪縺吶ら筏縺苓ｨｳ縺ゅｊ縺ｾ縺帙ｓ縲・,
      '縺頑ｰ玲戟縺｡縺ｯ螫峨＠縺・・縺ｧ縺吶′縲√■繧・▲縺ｨ莠区ュ縺後≠繧翫∪縺励※窶ｦ縲ゅ∪縺溘・讖滉ｼ壹↓縺企｡倥＞縺ｧ縺阪ｌ縺ｰ蟷ｸ縺・〒縺吶・,
    ],
    firm: [
      '諱舌ｌ蜈･繧翫∪縺吶′縲∽ｻ雁屓縺ｮ縺願ｩｱ縺ｫ縺､縺・※縺ｯ縺雁女縺代☆繧九％縺ｨ縺碁屮縺励＞迥ｶ豕√〒縺吶ゅ＃逅・ｧ｣縺・◆縺縺代∪縺吶→蟷ｸ縺・〒縺吶・,
      '隱縺ｫ逕ｳ縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縺後√％縺｡繧峨・莠区ュ縺ｫ繧医ｊ縺雁ｼ輔″蜿励￠縺・◆縺励°縺ｭ縺ｾ縺吶ゆｽ募穀縺比ｺ・価縺上□縺輔＞縲・,
      '螟ｧ螟画＄邵ｮ縺ｧ縺吶′縲√♀譁ｭ繧翫＆縺帙※縺・◆縺縺阪∪縺吶ょ挨縺ｮ蠖｢縺ｧ縺雁鴨縺ｫ縺ｪ繧後ｋ縺薙→縺後≠繧後・縲√♀逕ｳ縺嶺ｻ倥￠縺上□縺輔＞縲・,
    ],
    iron: [
      '縺秘｣邨｡縺ゅｊ縺後→縺・＃縺悶＞縺ｾ縺吶よ＄繧悟・繧翫∪縺吶′縲√♀譁ｭ繧翫＞縺溘＠縺ｾ縺吶ゅ＃莠・価縺上□縺輔＞縲・,
      '逕ｳ縺苓ｨｳ縺斐＊縺・∪縺帙ｓ縺後√♀蜿励￠縺吶ｋ縺薙→縺ｯ縺ｧ縺阪∪縺帙ｓ縲ゆｻ雁ｾ悟酔讒倥・縺比ｾ晞ｼ縺ｯ縺秘□諷ｮ縺・◆縺縺代∪縺吶ｈ縺・♀鬘倥＞縺・◆縺励∪縺吶・,
      '縺薙■繧峨・莉ｶ縺ｫ縺､縺・※縺ｯ縲∝ｯｾ蠢懊＞縺溘＠縺九・縺ｾ縺吶ゆｽ募穀繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶・,
    ],
  },
}

const READ_DELAYS: Record<Tone, string[]> = {
  gentle: [
    '30蛻・・譎る俣蠕後↓譌｢隱ｭ縺ｫ縺励∪縺励ｇ縺・ゅ悟ｿ吶＠縺九▲縺溘ｓ縺縺ｪ縲阪→諤昴ｏ縺帙ｋ縺｡繧・≧縺ｩ縺・＞繧ｿ繧､繝溘Φ繧ｰ縺ｧ縺吶・,
    '1譎る俣蠕後↓譌｢隱ｭ 竊・縺輔ｉ縺ｫ30蛻・ｾ後↓霑比ｿ｡縲ゅ後■繧・ｓ縺ｨ閠・∴縺ｦ縺上ｌ縺溘肴─縺悟・縺ｾ縺吶・,
    '譏ｼ莨代∩繧・､墓婿縺ｪ縺ｩ縲御ｸ蛹ｺ蛻・ｊ縺､縺・◆縲阪ち繧､繝溘Φ繧ｰ縺ｧ霑斐☆縺ｨ閾ｪ辟ｶ縺ｧ縺吶・,
  ],
  firm: [
    '2縲・譎る俣蠕後↓譌｢隱ｭ縺ｫ縺励∪縺励ｇ縺・ゅ後☆縺舌↓縺ｯ鬟帙・縺､縺九↑縺・阪→縺・≧蟋ｿ蜍｢繧堤､ｺ縺帙∪縺吶・,
    '蜊頑律蠕後↓霑比ｿ｡縲よ･縺後↑縺・％縺ｨ縺ｧ縲後％縺｡繧峨・繝壹・繧ｹ縺ｧ蟇ｾ蠢懊☆繧九肴э蠢励′莨昴ｏ繧翫∪縺吶・,
    '鄙梧律縺ｮ蜊亥燕荳ｭ縺ｫ霑比ｿ｡縲ゆｸ譎ｩ鄂ｮ縺上％縺ｨ縺ｧ縲檎・閠・＠縺溘榊魂雎｡繧剃ｸ弱∴繧峨ｌ縺ｾ縺吶・,
  ],
  iron: [
    '鄙梧律莉･髯阪↓霑比ｿ｡縲ょ叉繝ｬ繧ｹ縺励↑縺・％縺ｨ縺ｧ縲後％縺ｮ隧ｱ鬘後・蜆ｪ蜈亥ｺｦ縺ｯ菴弱＞縲阪→辟｡險縺ｧ莨昴∴縺ｾ縺吶・,
    '24譎る俣莉･荳顔ｩｺ縺代※縺九ｉ遏ｭ譁・〒霑比ｿ｡縲ゅ◎繧御ｻ･荳翫・繧・ｊ蜿悶ｊ縺ｯ荳崎ｦ√〒縺吶・,
    '48譎る俣蠕後↓荳險縺縺題ｿ比ｿ｡縲りｿｽ謦・′譚･縺ｦ繧ょ酔縺倥・繝ｼ繧ｹ繧貞ｴｩ縺輔↑縺・％縺ｨ縲・,
  ],
}

const TIPS: Record<Situation, string[]> = {
  visit: [
    '縲後∪縺滄｣邨｡縺励∪縺吶阪・鬲疲ｳ輔・險闡峨ゅ％縺｡繧峨′荳ｻ蟆取ｨｩ繧呈升繧後∪縺吶・,
    '蜈ｷ菴鍋噪縺ｪ譌･遞九ｒ邨ｶ蟇ｾ縺ｫ蜃ｺ縺輔↑縺・％縺ｨ縲ゅ瑚ｿ代＞縺・■縺ｫ縲阪〒豼√＠縺ｾ縺励ｇ縺・・,
    '繝代・繝医リ繝ｼ縺ｨ蜿｣陬上ｒ蜷医ｏ縺帙※縺翫￥縺ｨ驩・｣√〒縺吶・,
  ],
  event: [
    '縲御ｻ穂ｺ九阪・譛蠑ｷ縺ｮ譁ｭ繧頑枚蜿･縲りｩｳ邏ｰ繧定◇縺九ｌ縺ｦ繧ゅ悟ｮ育ｧ倡ｾｩ蜍吶〒窶ｦ縲阪〒蛻・ｌ縺ｾ縺吶・,
    '縺贋ｾ帙∴繧・♀闃ｱ繧帝√ｋ縺ｨ縲∵ｬ蟶ｭ縺ｮ鄂ｪ謔ｪ諢溘ｒ霆ｽ貂帙〒縺阪∪縺吶・,
    '荳蠎ｦ譁ｭ縺｣縺溘ｉ霑ｽ蜉縺ｮ隱ｬ譏弱・荳崎ｦ√ら炊逕ｱ繧帝㍾縺ｭ繧九→蝌倥▲縺ｽ縺上↑繧翫∪縺吶・,
  ],
  money: [
    '荳蠎ｦ縺ｧ繧りｲｸ縺吶→蜑堺ｾ九↓縺ｪ繧翫∪縺吶よ怙蛻昴°繧峨後≧縺｡縺ｯ縺昴≧縺・≧縺薙→縺ｯ縺励↑縺・阪〒邨ｱ荳縲・,
    '縲後Ο繝ｼ繝ｳ縺後≠縺｣縺ｦ縲阪梧蕗閧ｲ雋ｻ縺後°縺九▲縺ｦ縲阪・蜈ｷ菴鍋噪縺吶℃縺壽歓雎｡逧・☆縺弱★縲√・繧ｹ繝医↑譁ｭ繧頑婿縲・,
    '驟榊・閠・ｒ逶ｾ縺ｫ縺励※繧０K縲ゅ後ヱ繝ｼ繝医リ繝ｼ縺ｨ逶ｸ隲・＠縺溘￠縺ｩ髮｣縺励＞縺ｨ窶ｦ縲・,
  ],
  lifestyle: [
    '蜿崎ｫ悶☆繧九→隴ｰ隲悶↓縺ｪ繧翫∪縺吶ゅ後≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶阪〒蜿励￠豬√＠縺ｦ螳溯｡後＠縺ｪ縺・・縺後・繧ｹ繝医・,
    '縲悟盾閠・↓縺励∪縺吶阪・譌･譛ｬ隱槭・縲君o縲阪〒縺吶ら嶌謇九ｂ縺ｪ繧薙→縺ｪ縺丞ｯ溘＠縺ｾ縺吶・,
    '隧ｱ鬘後ｒ螟峨∴繧九・繧よ怏蜉ｹ縲ゅ後◎縺・＞縺医・縲・・・縺雁・豌励〒縺吶°・溘・,
  ],
  child: [
    '縺薙・隧ｱ鬘後・縲檎ｭ斐∴縺ｪ縺・阪′譛蠑ｷ縲ゆｽ輔ｒ險縺｣縺ｦ繧よｬ｡縺ｮ雉ｪ蝠上ｒ逕溘∩縺ｾ縺吶・,
    '縲御ｺ御ｺｺ縺ｧ豎ｺ繧√∪縺吶阪・荳險繧貞ｴｩ縺輔↑縺・％縺ｨ縲ら炊逕ｱ縺ｯ荳崎ｦ√・,
    '郢ｰ繧願ｿ斐＠閨槭°繧後◆繧峨悟燕縺ｫ繧ゅ♀莨昴∴縺励∪縺励◆縺娯ｦ縲阪〒繝励Ξ繝・す繝｣繝ｼ繧偵°縺題ｿ斐☆縲・,
  ],
  other: [
    '譁ｭ繧狗炊逕ｱ縺ｯ遏ｭ縺・⊇縺ｩ蠑ｷ縺・る聞縲・→隱ｬ譏弱☆繧九→遯√▲霎ｼ縺ｾ繧後∪縺吶・,
    '縲梧､懆ｨ弱＠縺ｾ縺吶坂・ 謨ｰ譌･蠕後↓縲後ｄ縺ｯ繧企屮縺励＞縺ｧ縺吶阪・2谿ｵ髫取妙繧翫ｂ譛牙柑縲・,
    '荳蠎ｦ譁ｭ縺｣縺溘ｉ蜷後§雉ｪ蝠上↓縺ｯ蜷後§霑比ｺ九ｒ縲ゅヶ繝ｬ繧九→縲梧款縺帙・縺・￠繧九阪→諤昴ｏ繧後∪縺吶・,
  ],
}

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
export default function ShioTaiou() {
  const [relationship, setRelationship] = useState<Relationship>('in-laws')
  const [situation, setSituation] = useState<Situation>('visit')
  const [tone, setTone] = useState<Tone>('gentle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<Reply | null>(null)
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const templates = TEMPLATES[situation][tone]
    const text = templates[Math.floor(Math.random() * templates.length)]
    const delays = READ_DELAYS[tone]
    const readDelay = delays[Math.floor(Math.random() * delays.length)]
    const tips = TIPS[situation]
    const tip = tips[Math.floor(Math.random() * tips.length)]
    setResult({ text, readDelay, tip })
    setCopied(false)
  }

  const copyToClipboard = () => {
    if (!result) return
    navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/products/shio-taiou">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              謌ｻ繧・            </Button>
          </Link>
          <h1 className="text-lg font-bold">ｧ・蝪ｩ蟇ｾ蠢應ｻ｣陦窟I</h1>
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">繧ｹ繧ｿ繝ｳ繝繝ｼ繝・/Badge>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            逶ｸ謇九→縺ｮ髢｢菫・          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(RELATIONSHIPS) as [Relationship, string][]).map(([key, label]) => (
              <Button
                key={key}
                variant={relationship === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRelationship(key)}
                className={relationship === key ? 'bg-amber-500 hover:bg-amber-600 text-white border-0' : 'border-gray-700 text-gray-300'}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Situation */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Shield className="inline h-4 w-4 mr-1" />
            繧ｷ繝√Η繧ｨ繝ｼ繧ｷ繝ｧ繝ｳ
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(SITUATIONS) as [Situation, string][]).map(([key, label]) => (
              <Button
                key={key}
                variant={situation === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSituation(key)}
                className={situation === key ? 'bg-amber-500 hover:bg-amber-600 text-white border-0' : 'border-gray-700 text-gray-300'}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">譁ｭ繧翫・蠑ｷ縺・/label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(TONES) as [Tone, { label: string; desc: string }][]).map(([key, { label, desc }]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${tone === key ? 'border-amber-500 bg-amber-500/10' : 'border-gray-800 bg-gray-900 hover:border-gray-600'}`}
                onClick={() => setTone(key)}
              >
                <CardContent className="p-3 text-center">
                  <div className={`font-bold ${tone === key ? 'text-amber-400' : 'text-gray-300'}`}>{label}</div>
                  <div className="text-xs text-gray-500 mt-1">{desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Input (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            逶ｸ謇九・繝｡繝・そ繝ｼ繧ｸ・井ｻｻ諢上・蜿り・畑・・          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="萓具ｼ壻ｻ雁ｺｦ縺ｮ譌･譖懊∝ｭｫ縺ｮ鬘碑ｦ九○縺ｫ譚･縺ｪ縺輔＞繧・
            className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 min-h-[80px]"
          />
        </div>

        {/* Generate */}
        <Button
          onClick={generate}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-lg py-6"
        >
          ｧ・蝪ｩ蟇ｾ蠢懊ｒ逕滓・縺吶ｋ
        </Button>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Reply */}
            <Card className="border-amber-500/30 bg-gray-900">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">町 霑比ｿ｡譁・/Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={generate} className="text-gray-400 hover:text-white">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-gray-400 hover:text-white">
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-white leading-relaxed whitespace-pre-wrap">{result.text}</p>
              </CardContent>
            </Card>

            {/* Read Timing */}
            <Card className="border-blue-500/30 bg-gray-900">
              <CardContent className="p-5">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-3">
                  <Clock className="h-3 w-3 mr-1 inline" />
                  譌｢隱ｭ繧ｿ繧､繝溘Φ繧ｰ
                </Badge>
                <p className="text-gray-300 text-sm leading-relaxed">{result.readDelay}</p>
              </CardContent>
            </Card>

            {/* Tip */}
            <Card className="border-purple-500/30 bg-gray-900">
              <CardContent className="p-5">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-3">
                  <Shield className="h-3 w-3 mr-1 inline" />
                  繝励Ο縺ｮ繧ｳ繝・                </Badge>
                <p className="text-gray-300 text-sm leading-relaxed">{result.tip}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    
      </div>
  )
}




