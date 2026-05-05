'use client'


import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Upload,
  Star,
  AlertCircle,
  ExternalLink,
  Lightbulb,
  Lock,
} from 'lucide-react'

// ===================== Types =====================
interface CheckItem {
  id: string
  label: string
  detail?: string
  warning?: string
  link?: { text: string; url: string }
  coverTools?: boolean
}

const COVER_AI_TOOLS = [
  {
    name: 'Canva',
    desc: '譛ｬ縺ｮ陦ｨ邏吶ユ繝ｳ繝励Ξ繝ｼ繝郁ｱ雁ｯ後・譌･譛ｬ隱朧K繝ｻ螳悟・辟｡譁・,
    url: 'https://www.canva.com/create/book-covers/',
    emoji: '耳',
    badge: '繝・Φ繝励Ξ縺ゅｊ',
  },
  {
    name: 'Adobe Firefly',
    desc: 'AI逕ｻ蜒冗函謌舌・蝠・畑繝ｩ繧､繧ｻ繝ｳ繧ｹOK繝ｻ辟｡譁呎棧縺ゅｊ',
    url: 'https://firefly.adobe.com',
    emoji: '櫨',
    badge: '蝠・畑OK',
  },
  {
    name: 'Leonardo.ai',
    desc: '鬮伜刀雉ｪAI逕滓・繝ｻ辟｡譁・50繧ｯ繝ｬ繧ｸ繝・ヨ/譌･',
    url: 'https://leonardo.ai',
    emoji: '鹿',
    badge: '150譫・譌･辟｡譁・,
  },
  {
    name: 'Microsoft Designer',
    desc: 'Bing Image Creator謳ｭ霈峨・螳悟・辟｡譁吶・Microsoft繧｢繧ｫ繧ｦ繝ｳ繝医・縺ｿ',
    url: 'https://designer.microsoft.com',
    emoji: '帳',
    badge: '螳悟・辟｡譁・,
  },
]

interface StepData {
  stepNumber: number
  title: string
  icon: React.ElementType
  color: string
  bg: string
  items: CheckItem[]
  hints: { color: 'blue' | 'yellow' | 'green' | 'orange'; text: string }[]
}

// ===================== Step Data =====================
const steps: StepData[] = [
  {
    stepNumber: 1,
    title: 'KDP繧｢繧ｫ繧ｦ繝ｳ繝医・蛻晄悄險ｭ螳・,
    icon: BookOpen,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    items: [
      {
        id: 's1-1',
        label: 'KDP蜈ｬ蠑上し繧､繝医↓Amazon繧｢繧ｫ繧ｦ繝ｳ繝医〒繝ｭ繧ｰ繧､繝ｳ縺吶ｋ',
        detail: 'kdp.amazon.co.jp 縺ｫ繧｢繧ｯ繧ｻ繧ｹ縺励∵里蟄倥・Amazon繧｢繧ｫ繧ｦ繝ｳ繝医〒繧ｵ繧､繝ｳ繧､繝ｳ縲ゅい繧ｫ繧ｦ繝ｳ繝医′縺ｪ縺・ｴ蜷医・譁ｰ隕丈ｽ懈・縺悟ｿ・ｦ√〒縺吶・,
        link: { text: 'KDP蜈ｬ蠑上し繧､繝医ｒ髢九￥', url: 'https://kdp.amazon.co.jp' },
      },
      {
        id: 's1-2',
        label: '闡苓・ュ蝣ｱ・域悽蜷阪∪縺溘・繝壹Φ繝阪・繝・峨ｒ逋ｻ骭ｲ縺吶ｋ',
        detail: '繝ｭ繧ｰ繧､繝ｳ蠕後∝承荳翫・繧｢繧ｫ繧ｦ繝ｳ繝医Γ繝九Η繝ｼ縺九ｉ縲後い繧ｫ繧ｦ繝ｳ繝域ュ蝣ｱ縲阪∈縲ゅ瑚送閠・蜃ｺ迚育､ｾ諠・ｱ縲阪↓蜷榊燕繧貞・蜉帙＠縺ｾ縺吶ゅ・繝ｳ繝阪・繝縺ｯ譛ｬ縺ｮ逋ｻ骭ｲ譎ゅ↓縲瑚送閠・錐縲阪→縺励※蛻･騾碑ｨｭ螳壹〒縺阪∪縺吶・,
        warning: '繝壹Φ繝阪・繝縺ｧ蜃ｺ迚医☆繧句ｴ蜷医ｂ縲√い繧ｫ繧ｦ繝ｳ繝域ュ蝣ｱ縺ｫ縺ｯ譛ｬ蜷阪〒逋ｻ骭ｲ縺励∪縺吶ゅ・繝ｳ繝阪・繝縺ｯ譛ｬ縺ｮ逋ｻ骭ｲ譎ゅ↓縲瑚送閠・錐縲阪→縺励※險ｭ螳壹〒縺阪∪縺吶・,
      },
      {
        id: 's1-3',
        label: '謖ｯ霎ｼ蜈茨ｼ磯橿陦悟哨蠎ｧ・峨ｒ逋ｻ骭ｲ縺吶ｋ',
        detail: '繧｢繧ｫ繧ｦ繝ｳ繝域ュ蝣ｱ縺九ｉ縲梧髪謇輔＞諠・ｱ縺ｮ蜿門ｾ励阪ｒ繧ｯ繝ｪ繝・け縲る橿陦悟錐繝ｻ謾ｯ蠎励・蜿｣蠎ｧ逡ｪ蜿ｷ繝ｻ蜿｣蠎ｧ蜷咲ｾｩ・医き繧ｿ繧ｫ繝奇ｼ峨ｒ蜈･蜉帙＠縺ｾ縺吶ょ渚譏縺ｾ縺ｧ1縲・蝟ｶ讌ｭ譌･縺九°繧翫∪縺吶・,
        warning: '蜿｣蠎ｧ蜷咲ｾｩ縺ｯ繧ｫ繧ｿ繧ｫ繝翫〒逋ｻ骭ｲ縺励※縺上□縺輔＞縲よｼ｢蟄励□縺ｨ逋ｻ骭ｲ繧ｨ繝ｩ繝ｼ縺ｫ縺ｪ繧句ｴ蜷医′縺ゅｊ縺ｾ縺吶・,
      },
      {
        id: 's1-4',
        label: '遞主漁繧､繝ｳ繧ｿ繝薙Η繝ｼ縺ｫ蝗樒ｭ斐☆繧・,
        detail: '繧｢繧ｫ繧ｦ繝ｳ繝域ュ蝣ｱ縺九ｉ縲檎ｨ主漁諠・ｱ縲坂・縲後う繝ｳ繧ｿ繝薙Η繝ｼ繧帝幕蟋九阪ｒ繧ｯ繝ｪ繝・け縲る比ｸｭ縺ｧ險隱槭′闍ｱ隱槭↓縺ｪ繧九％縺ｨ縺後≠繧翫∪縺吶′縲√栗ndividual・亥倶ｺｺ・峨阪繰apan縲阪ｒ驕ｸ縺ｹ縺ｰOK縺ｧ縺吶ょ・鬆・岼縺ｫ蝗樒ｭ斐＠縺ｦ騾∽ｿ｡縺励∪縺吶・,
        warning: '遞主漁繧､繝ｳ繧ｿ繝薙Η繝ｼ繧貞ｮ御ｺ・＠縺ｪ縺・→螢ｲ荳翫・謾ｯ謇輔＞縺悟女縺大叙繧後∪縺帙ｓ縲ょｿ・★螳御ｺ・＆縺帙∪縺励ｇ縺・・,
      },
      {
        id: 's1-5',
        label: '繝槭う繝翫Φ繝舌・繧貞・蜉帙＠縺ｦ貅先ｳ臥ｨ守紫繧・%縺ｫ縺吶ｋ',
        detail: '遞主漁繧､繝ｳ繧ｿ繝薙Η繝ｼ縺ｮ騾比ｸｭ縲√梧律譛ｬ縺ｮ邏咲ｨ手・分蜿ｷ・医・繧､繝翫Φ繝舌・・峨ｒ縺頑戟縺｡縺ｧ縺吶°・溘阪・雉ｪ蝠上〒縲後・縺・阪ｒ驕ｸ謚槭＠縲・2譯√・繝槭う繝翫Φ繝舌・繧貞・蜉帙＠縺ｾ縺吶・,
        link: { text: '繝槭う繝翫・繝ｼ繧ｿ繝ｫ縺ｧ繝槭う繝翫Φ繝舌・繧堤｢ｺ隱・, url: 'https://myna.go.jp' },
        warning: '繧ｹ繧ｭ繝・・縺吶ｋ縺ｨ邀ｳ蝗ｽ蜷代￠雋ｩ螢ｲ蜿守寢縺ｮ30%縺梧ｺ先ｳ牙ｾｴ蜿弱＆繧後∪縺吶ょｿ・★蜈･蜉帙＠縺ｾ縺励ｇ縺・・,
      },
    ],
    hints: [
      { color: 'blue', text: '庁 繝槭う繝翫Φ繝舌・繧貞・蜉帙☆繧九→縲∫ｱｳ蝗ｽ蜷代￠雋ｩ螢ｲ縺ｧ縺九°繧区ｺ先ｳ臥ｨ趣ｼ磯壼ｸｸ30%・峨′0%縺ｫ縺ｪ繧翫∪縺吶ら衍繧峨↑縺・→謳阪☆繧矩㍾隕√↑險ｭ螳壹〒縺吶・ },
      { color: 'blue', text: '笨・繧｢繧ｫ繧ｦ繝ｳ繝郁ｨｭ螳壹・蛻晏屓縺ｮ縺ｿ縲ゆｸ蠎ｦ逋ｻ骭ｲ縺吶ｌ縺ｰ2蜀顔岼莉･髯阪・縺吶＄蜃ｺ迚医〒縺阪∪縺吶・ },
    ],
  },
  {
    stepNumber: 2,
    title: '蜴溽ｨｿ繝ｻ陦ｨ邏吶・菴懈・',
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    items: [
      {
        id: 's2-1',
        label: '蜴溽ｨｿ繧淡ord・・docx・牙ｽ｢蠑上〒菴懈・縺吶ｋ',
        detail: 'Word縺ｮ縲瑚ｦ句・縺・縲阪瑚ｦ句・縺・縲阪せ繧ｿ繧､繝ｫ繧剃ｽｿ縺｣縺ｦ遶繧ｿ繧､繝医Ν繧定ｨｭ螳壹＠縺ｦ縺翫￥縺ｨ縲゜indle Create縺ｧ閾ｪ蜍慕噪縺ｫ逶ｮ谺｡縺檎函謌舌＆繧後∪縺吶ゅヵ繧ｩ繝ｳ繝医・繝・ヵ繧ｩ繝ｫ繝医・縺ｾ縺ｾ縺ｧOK縲・,
        link: { text: 'Kindle逕ｨWord繝・Φ繝励Ξ繝ｼ繝茨ｼ・mazon蜈ｬ蠑擾ｼ・, url: 'https://kdp.amazon.co.jp/ja_JP/help/topic/G200645680' },
        warning: '逕ｻ蜒上ｒ螟夂畑縺吶ｋ蝣ｴ蜷医・繝輔ぃ繧､繝ｫ繧ｵ繧､繧ｺ縺ｫ豕ｨ諢上・繝輔ぃ繧､繝ｫ650MB莉･蜀・↓蜿弱ａ繧句ｿ・ｦ√′縺ゅｊ縺ｾ縺吶・,
      },
      {
        id: 's2-2',
        label: 'Kindle Create縺ｫ.docx繧定ｪｭ縺ｿ霎ｼ繧',
        detail: 'Kindle Create繧定ｵｷ蜍輔＠縲√後◎縺ｮ莉悶・譛ｬ縺ｮ繧ｿ繧､繝励坂・縲軍eflowable・医Μ繝輔Ο繝ｼ蝙具ｼ峨阪ｒ驕ｸ謚槭＠縺ｦ.docx繝輔ぃ繧､繝ｫ繧帝幕縺阪∪縺吶りｪｭ縺ｿ霎ｼ縺ｿ蠕後∝ｷｦ繧ｵ繧､繝峨ヰ繝ｼ縺ｫ遶縺ｮ荳隕ｧ縺瑚・蜍戊｡ｨ遉ｺ縺輔ｌ縺ｾ縺吶・,
        link: { text: 'Kindle Create繧偵ム繧ｦ繝ｳ繝ｭ繝ｼ繝会ｼ育┌譁呻ｼ・, url: 'https://www.amazon.co.jp/b?node=24423771051' },
      },
      {
        id: 's2-3',
        label: '蟾ｦ繧ｵ繧､繝峨ヰ繝ｼ縺ｮ遶繝ｪ繧ｹ繝医ｒ遒ｺ隱阪・菫ｮ豁｣縺吶ｋ',
        detail: '蟾ｦ蛛ｴ縺ｫ遶繧ｿ繧､繝医Ν縺ｮ荳隕ｧ縺瑚｡ｨ遉ｺ縺輔ｌ縺ｾ縺吶ゅ％繧後′縺昴・縺ｾ縺ｾKindle縺ｮ繧､繝ｳ繧ｿ繝ｩ繧ｯ繝・ぅ繝也岼谺｡縺ｫ縺ｪ繧翫∪縺吶・n\n縲千ｫ縺瑚ｶｳ繧翫↑縺・ｴ蜷医第悽譁・判髱｢縺ｧ遶繧ｿ繧､繝医Ν縺ｫ縺励◆縺・枚蟄励ｒ驕ｸ謚・竊・蜿ｳ蛛ｴ縺ｮ縲窪lements縲阪ち繝悶°繧峨靴hapter Title縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け 竊・閾ｪ蜍輔〒繝ｪ繧ｹ繝医↓霑ｽ蜉縺輔ｌ縺ｾ縺吶・n\n縲蝉ｽ呵ｨ医↑繧ゅ・縺悟・縺｣縺ｦ縺・ｋ蝣ｴ蜷医大ｷｦ蛛ｴ繝ｪ繧ｹ繝医〒蟇ｾ雎｡繧貞承繧ｯ繝ｪ繝・け 竊・縲碁勁螟悶阪ｒ驕ｸ謚槭＠縺ｦ繝ｪ繧ｹ繝医°繧牙炎髯､縺ｧ縺阪∪縺吶・,
        warning: '遶繝ｪ繧ｹ繝医′豁｣縺励￥險ｭ螳壹＆繧後※縺・↑縺・→縲∫岼谺｡縺九ｉ繧ｸ繝｣繝ｳ繝励〒縺阪↑縺・崕蟄先嶌邀阪↓縺ｪ繧翫∪縺吶ょｿ・★遒ｺ隱阪＠縺ｾ縺励ｇ縺・・,
      },
      {
        id: 's2-4',
        label: '逶ｮ谺｡繝壹・繧ｸ・・TML逶ｮ谺｡・峨ｒ譛ｬ譁・ｸｭ縺ｫ謖ｿ蜈･縺吶ｋ',
        detail: '荳企Κ繝｡繝九Η繝ｼ縺ｮ縲窪dit縲阪∪縺溘・蟾ｦ荳翫・縲鯉ｼ・Insert縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け 竊・縲卦able of Contents・育岼谺｡・峨阪ｒ驕ｸ謚槭ら樟蝨ｨ縺ｮ遶繝ｪ繧ｹ繝医ｒ縺ｾ縺ｨ繧√◆逶ｮ谺｡繝壹・繧ｸ縺瑚・蜍慕函謌舌＆繧後∵悽縺ｮ蜀帝ｭ縺ｫ謖ｿ蜈･縺輔ｌ縺ｾ縺吶・,
      },
      {
        id: 's2-5',
        label: 'Preview縺ｧ逶ｮ谺｡縺ｨ蜷・ｫ繧ｸ繝｣繝ｳ繝励ｒ遒ｺ隱阪☆繧・,
        detail: '蜿ｳ荳翫・縲訓review縲阪・繧ｿ繝ｳ繧呈款縺・竊・繧ｹ繝槭・繝ｻKindle遶ｯ譛ｫ繧呈ｨ｡縺励◆繧ｦ繧｣繝ｳ繝峨え縺碁幕縺・竊・繝｡繝九Η繝ｼ繝懊ち繝ｳ縺九ｉ縲檎岼谺｡・・ontents・峨阪ｒ驕ｸ謚・竊・蜷・ｫ繧ｿ繧､繝医Ν繧偵ち繝・・縺励※豁｣縺励￥繧ｸ繝｣繝ｳ繝励〒縺阪ｋ縺狗｢ｺ隱阪＠縺ｾ縺吶・,
        warning: '繝励Ξ繝薙Η繝ｼ縺ｧ遒ｺ隱阪○縺壹↓蜃ｺ迚医☆繧九→縲∫岼谺｡縺梧ｩ溯・縺励↑縺・悽縺ｫ縺ｪ繧句庄閭ｽ諤ｧ縺後≠繧翫∪縺吶ょｿ・★蜍穂ｽ懃｢ｺ隱阪＠縺ｾ縺励ｇ縺・・,
      },
      {
        id: 's2-6',
        label: 'Export縺ｧ.kpf繝輔ぃ繧､繝ｫ繧呈嶌縺榊・縺・,
        detail: '蜿ｳ荳翫・縲郡ave縲阪〒菴懈･ｭ繝・・繧ｿ繧剃ｿ晏ｭ・竊・縲窪xport縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け 竊・.kpf繝輔ぃ繧､繝ｫ縺御ｿ晏ｭ倥＆繧後∪縺吶・DP縺ｮ蜴溽ｨｿ繧｢繝・・繝ｭ繝ｼ繝峨↓縺ｯ縺薙・.kpf繝輔ぃ繧､繝ｫ繧剃ｽｿ縺・∪縺吶・,
        warning: '.kpf繝輔ぃ繧､繝ｫ縺梧怙繧ょ刀雉ｪ縺悟ｮ牙ｮ壹＠縺ｾ縺吶・docx縺ｧ繧ょ・迚亥庄閭ｽ縺ｧ縺吶′縲∬｡ｨ遉ｺ蟠ｩ繧後・繝ｪ繧ｹ繧ｯ縺後≠繧翫∪縺吶・,
      },
      {
        id: 's2-7',
        label: '陦ｨ邏咏判蜒上ｒJPEG縺ｾ縺溘・TIFF蠖｢蠑上〒逕ｨ諢上☆繧・,
        detail: '謗ｨ螂ｨ繧ｵ繧､繧ｺ縺ｯ1,600ﾃ・,560px・育ｸｦ髟ｷ2:3豈皮紫・峨よ怙菴弱〒繧・,000ﾃ・25px莉･荳翫′蠢・ｦ√〒縺吶１NG縺ｯ菴ｿ逕ｨ荳榊庄縺ｪ縺ｮ縺ｧ蠢・★JPEG縺ｾ縺溘・TIFF縺ｫ螟画鋤縺励※縺上□縺輔＞縲・n\n縲千┌譁吶〒陦ｨ邏吶ｒ菴懊ｌ繧帰I繝・・繝ｫ縲曾n莉･荳九・繧ｵ繝ｼ繝薙せ縺ｯ辟｡譁吶〒鬮伜刀雉ｪ縺ｪ陦ｨ邏吶′菴懊ｌ縺ｾ縺吶・,
        warning: 'PNG縺ｯKDP縺ｫ繧｢繝・・繝ｭ繝ｼ繝峨〒縺阪∪縺帙ｓ縲ゆｺ句燕縺ｫJPEG縺ｾ縺溘・TIFF縺ｫ螟画鋤縺励※縺翫″縺ｾ縺励ｇ縺・り｡ｨ邏吶・螢ｲ荳翫↓逶ｴ邨舌☆繧九・縺ｧ縲√ち繧､繝医Ν繝ｻ闡苓・錐縺瑚ｪｭ縺ｿ繧・☆縺丞・縺｣縺ｦ縺・ｋ縺狗｢ｺ隱阪＠縺ｾ縺励ｇ縺・・,
        coverTools: true,
      },
      {
        id: 's2-8',
        label: '蜀・ｮｹ邏ｹ莉具ｼ亥膚蜩∬ｪｬ譏趣ｼ峨ｒ4,000蟄嶺ｻ･蜀・〒貅門ｙ縺吶ｋ',
        detail: '竭隱ｭ閠・・蜈ｱ諢溘ヵ繝・け 竊・竭｡闡苓・ｴｹ莉・竊・竭｢蜷・ｫ縺ｮ蜀・ｮｹ邏ｹ莉・竊・竭｣縺薙ｓ縺ｪ莠ｺ縺ｫ隱ｭ繧薙〒縺ｻ縺励＞ 竊・竭､闡苓・Γ繝・そ繝ｼ繧ｸ縲√→縺・≧讒区・縺悟柑譫懃噪縺ｧ縺吶・mazon縺ｮ蝠・刀繝壹・繧ｸ縺ｫ陦ｨ遉ｺ縺輔ｌ繧九・縺ｧ雉ｼ雋ｷ繧貞ｷｦ蜿ｳ縺励∪縺吶・TML繧ｿ繧ｰ・・b>螟ｪ蟄・/b>縲・br>謾ｹ陦鯉ｼ峨ｂ菴ｿ縺医∪縺吶・,
      },
    ],
    hints: [
      { color: 'blue', text: '庁 Word縺ｮ繝倥ャ繝繝ｼ繧ｹ繧ｿ繧､繝ｫ繧狸indle Create縺瑚ｪｭ縺ｿ蜿悶▲縺ｦ遶繝ｪ繧ｹ繝医ｒ閾ｪ蜍慕函謌舌＠縺ｾ縺吶８ord縺ｧ縲瑚ｦ句・縺・縲阪瑚ｦ句・縺・縲阪ｒ豁｣縺励￥險ｭ螳壹＠縺ｦ縺翫￥縺ｨ菴懈･ｭ縺梧･ｽ縺ｫ縺ｪ繧翫∪縺吶・ },
      { color: 'yellow', text: '笞・・陦ｨ邏吶・Kindle縺ｮ讀懃ｴ｢邨先棡縺ｫ蟆上＆縺・し繝繝阪う繝ｫ縺ｧ陦ｨ遉ｺ縺輔ｌ縺ｾ縺吶らｸｮ蟆上＆繧後※繧りｪｭ繧√ｋ縺狗｢ｺ隱阪＠縺ｾ縺励ｇ縺・・ },
      { color: 'orange', text: '耳 陦ｨ邏吶・Canva繝ｻAdobe Firefly繝ｻLeonardo.ai繝ｻMicrosoft Designer縺ｪ縺ｩ縺ｮ辟｡譁僊I繝・・繝ｫ縺ｧ菴懊ｌ縺ｾ縺吶ゅ瑚ｩｳ邏ｰ繧定ｦ九ｋ縲阪°繧峨Μ繝ｳ繧ｯ縺ｫ鬟帙∋縺ｾ縺吶・ },
      { color: 'green', text: '笨・蜀・ｮｹ邏ｹ莉九・HTML繧ｿ繧ｰ縺御ｽｿ縺医∪縺吶・b>螟ｪ蟄・/b>繧・隼陦後ｒ菴ｿ縺・→隱ｭ縺ｿ繧・☆縺上↑繧翫∪縺吶・ },
    ],
  },
  {
    stepNumber: 3,
    title: '譛ｬ縺ｮ諠・ｱ繧狸DP縺ｫ逋ｻ骭ｲ縺吶ｋ',
    icon: FileText,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    items: [
      {
        id: 's3-1',
        label: 'KDP繝繝・す繝･繝懊・繝峨°繧峨鯉ｼ倶ｽ懈・縲坂・縲桑indle髮ｻ蟄先嶌邀阪阪ｒ驕ｸ謚槭☆繧・,
        detail: 'KDP縺ｫ繝ｭ繧ｰ繧､繝ｳ蠕後√梧悽譽壹阪ち繝悶°繧峨鯉ｼ倶ｽ懈・縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け竊偵桑indle髮ｻ蟄先嶌邀阪阪ｒ驕ｸ謚槭＠縺ｾ縺吶・,
        link: { text: 'KDP譛ｬ譽壹ｒ髢九￥', url: 'https://kdp.amazon.co.jp/bookshelf' },
      },
      {
        id: 's3-2',
        label: '險隱槭・繧ｿ繧､繝医Ν繝ｻ繧ｵ繝悶ち繧､繝医Ν繝ｻ闡苓・錐繝ｻ繝輔Μ繧ｬ繝翫ｒ蜈･蜉帙☆繧・,
        detail: '險隱橸ｼ壽律譛ｬ隱・/ 繧ｿ繧､繝医Ν・壽悽縺ｮ繧ｿ繧､繝医Ν / 闡苓・錐・壽悽蜷阪∪縺溘・繝壹Φ繝阪・繝・医％縺薙〒繝壹Φ繝阪・繝繧定ｨｭ螳壹〒縺阪∪縺呻ｼ峨ゅヵ繝ｪ繧ｬ繝翫・蜈ｨ隗偵き繧ｿ繧ｫ繝翫〒蜈･蜉帙＠縺ｾ縺吶・n\n窶ｻ繧ｿ繧､繝医Ν縺ｨ闡苓・錐縺ｮ繝輔ぅ繝ｼ繝ｫ繝峨↓HTML繧ｿ繧ｰ縺ｯ菴ｿ逕ｨ縺ｧ縺阪∪縺帙ｓ縲・,
        warning: '繧ｿ繧､繝医Ν縺ｯ蜃ｺ迚亥ｾ後↓螟画峩縺碁屮縺励＞鬆・岼縺ｧ縺吶りｪ､蟄励′縺ｪ縺・°繧医￥遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・,
      },
      {
        id: 's3-3',
        label: '蜀・ｮｹ邏ｹ莉九ｒ蜈･蜉帙☆繧・,
        detail: '貅門ｙ縺励◆蝠・刀隱ｬ譏取枚繧偵さ繝斐・&繝壹・繧ｹ繝医＠縺ｾ縺吶・b>螟ｪ蟄・/b>繧・br>謾ｹ陦後↑縺ｩ縺ｮHTML繧ｿ繧ｰ縺御ｽｿ縺医∪縺吶ゅせ繝槭・繝医ヵ繧ｩ繝ｳ縺ｧ隱ｭ縺ｾ繧後ｋ縺薙→繧呈Φ螳壹＠縺ｦ縲・縲・陦後＃縺ｨ縺ｫ謾ｹ陦後ｒ蜈･繧後ｋ縺ｨ隱ｭ縺ｿ繧・☆縺上↑繧翫∪縺吶・,
      },
      {
        id: 's3-4',
        label: '繧ｭ繝ｼ繝ｯ繝ｼ繝峨ｒ7譫縺吶∋縺ｦ蜈･蜉帙☆繧・,
        detail: '1譫縺ｫ繧ｹ繝壹・繧ｹ蛹ｺ蛻・ｊ縺ｧ隍・焚縺ｮ蜊倩ｪ槭ｒ蜈･繧後ｉ繧後∪縺呻ｼ井ｾ具ｼ壹悟憶讌ｭ AI縲搾ｼ峨ゅち繧､繝医Ν縺ｫ蜷ｫ縺ｾ繧後ｋ蜊倩ｪ槭・郢ｰ繧願ｿ斐＠縺ｯ驕ｿ縺代・未騾｣縺吶ｋ縺悟挨縺ｮ讀懃ｴ｢繝ｯ繝ｼ繝峨ｒ驕ｸ縺ｳ縺ｾ縺励ｇ縺・・譫縺吶∋縺ｦ蝓九ａ繧九％縺ｨ縺ｧ讀懃ｴ｢縺ｫ蠑輔▲縺九°繧翫ｄ縺吶￥縺ｪ繧翫∪縺吶・,
        warning: '繧ｭ繝ｼ繝ｯ繝ｼ繝峨ｒ遨ｺ谺・↓縺吶ｋ縺ｨ讀懃ｴ｢縺ｫ陦ｨ遉ｺ縺輔ｌ縺ｫ縺上￥縺ｪ繧翫∪縺吶・譫縺吶∋縺ｦ蝓九ａ縺ｾ縺励ｇ縺・・,
      },
      {
        id: 's3-5',
        label: '繧ｫ繝・ざ繝ｪ繧・縺､驕ｸ謚槭☆繧・,
        detail: '譛ｬ縺ｮ蜀・ｮｹ縺ｫ譛繧りｿ代＞繧ｫ繝・ざ繝ｪ繧・縺､驕ｸ謚槭＠縺ｾ縺吶ゅき繝・ざ繝ｪ縺ｯ蜃ｺ迚亥ｾ後〒繧ょ､画峩蜿ｯ閭ｽ縺ｧ縺吶・,
      },
      {
        id: 's3-6',
        label: 'KDP Select縺ｫ逋ｻ骭ｲ縺吶ｋ・・indle Unlimited蟇ｾ蠢懶ｼ・,
        detail: 'KDP Select縺ｫ逋ｻ骭ｲ縺吶ｋ縺ｨ縲゜indle Unlimited・域怦鬘崎ｪｭ縺ｿ謾ｾ鬘鯉ｼ峨・蟇ｾ雎｡縺ｫ縺ｪ繧翫∪縺吶・0譌･髢薙・Amazon迢ｬ蜊雋ｩ螢ｲ縺梧擅莉ｶ縺ｧ縺吶′縲∬ｪｭ閠・↓逋ｺ隕九＆繧後ｄ縺吶￥縺ｪ繧九Γ繝ｪ繝・ヨ縺後≠繧翫∪縺吶・0譌･蠕後・隗｣髯､縺励※note縺ｪ縺ｩ莉悶・繝励Λ繝・ヨ繝輔か繝ｼ繝縺ｧ繧りｲｩ螢ｲ縺ｧ縺阪∪縺吶・,
      },
      {
        id: 's3-7',
        label: '繝壹・繧ｸ縺ｮ隱ｭ縺ｿ譁ｹ蜷代ｒ驕ｸ謚槭☆繧・,
        detail: '譌･譛ｬ隱槭・讓ｪ譖ｸ縺榊次遞ｿ縺ｮ蝣ｴ蜷医・縲悟ｷｦ縺九ｉ蜿ｳ縲阪ｒ驕ｸ謚槭＠縺ｾ縺吶らｸｦ譖ｸ縺榊次遞ｿ縺ｮ蝣ｴ蜷医・縲悟承縺九ｉ蟾ｦ縲阪ｒ驕ｸ謚槭＠縺ｦ縺上□縺輔＞縲・,
      },
    ],
    hints: [
      { color: 'orange', text: '泊 繧ｭ繝ｼ繝ｯ繝ｼ繝峨・7譫縺吶∋縺ｦ蝓九ａ縺ｾ縺励ｇ縺・よ､懃ｴ｢髴ｲ蜃ｺ縺ｫ逶ｴ邨舌☆繧矩㍾隕√↑險ｭ螳壹〒縺吶・ },
      { color: 'blue', text: '套 KDP Select縺ｯ90譌･縺斐→縺ｫ閾ｪ蜍墓峩譁ｰ縺輔ｌ縺ｾ縺吶ゆｸ崎ｦ√↓縺ｪ縺｣縺溘ｉ90譌･蠕後↓隗｣髯､縺ｧ縺阪∪縺吶・ },
    ],
  },
  {
    stepNumber: 4,
    title: '蜴溽ｨｿ繝ｻ陦ｨ邏吶ｒ繧｢繝・・繝ｭ繝ｼ繝峨＠縺ｦ蜃ｺ迚育筏隲・,
    icon: Upload,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    items: [
      {
        id: 's4-1',
        label: '蜴溽ｨｿ繝輔ぃ繧､繝ｫ・・kpf縺ｾ縺溘・.docx・峨ｒ繧｢繝・・繝ｭ繝ｼ繝峨☆繧・,
        detail: '縲碁崕蟄先嶌邀阪・蜴溽ｨｿ縲肴ｬ・°繧・kpf縺ｾ縺溘・.docx繧偵い繝・・繝ｭ繝ｼ繝峨＠縺ｾ縺吶・indle Create縺ｧ蜃ｺ蜉帙＠縺・kpf縺梧怙繧ょｮ牙ｮ壹＠縺ｾ縺吶ゅい繝・・繝ｭ繝ｼ繝牙ｾ後∬・蜍輔〒螟画鋤蜃ｦ逅・′陦後ｏ繧後∪縺呻ｼ域焚蛻・°縺九ｋ蝣ｴ蜷医′縺ゅｊ縺ｾ縺呻ｼ峨・,
      },
      {
        id: 's4-2',
        label: '陦ｨ邏咏判蜒擾ｼ・PEG縺ｾ縺溘・TIFF・峨ｒ繧｢繝・・繝ｭ繝ｼ繝峨☆繧・,
        detail: '縲桑indle譛ｬ縺ｮ陦ｨ邏吶肴ｬ・°繧雨PEG縺ｾ縺溘・TIFF蠖｢蠑上・逕ｻ蜒上ｒ繧｢繝・・繝ｭ繝ｼ繝峨＠縺ｾ縺吶よ耳螂ｨ繧ｵ繧､繧ｺ・・,600ﾃ・,560px・・:3豈皮紫・峨１NG縺ｯ菴ｿ逕ｨ縺ｧ縺阪∪縺帙ｓ縲・,
        warning: 'PNG縺ｯ繧｢繝・・繝ｭ繝ｼ繝峨〒縺阪∪縺帙ｓ縲ょｿ・★JPEG縺ｾ縺溘・TIFF縺ｫ螟画鋤縺励※縺九ｉ繧｢繝・・繝ｭ繝ｼ繝峨＠縺ｾ縺励ｇ縺・・,
      },
      {
        id: 's4-3',
        label: '繧ｪ繝ｳ繝ｩ繧､繝ｳ繝励Ξ繝薙Η繧｢繝ｼ縺ｧ陦ｨ遉ｺ繧堤｢ｺ隱阪☆繧・,
        detail: '縲後が繝ｳ繝ｩ繧､繝ｳ繝励Ξ繝薙Η繧｢繝ｼ繧定ｵｷ蜍輔阪〒繧ｹ繝槭・繝ｻ繧ｿ繝悶Ξ繝・ヨ繝ｻKindle遶ｯ譛ｫ縺昴ｌ縺槭ｌ縺ｮ陦ｨ遉ｺ繧堤｢ｺ隱阪＠縺ｾ縺吶ら岼谺｡縺梧ｭ｣縺励￥讖溯・縺吶ｋ縺九∵枚蟄励′蟠ｩ繧後※縺・↑縺・°繝√ぉ繝・け縺励∪縺励ｇ縺・・,
        warning: '繝励Ξ繝薙Η繝ｼ縺ｧ蝠城｡後ｒ隕九▽縺代◆蝣ｴ蜷医・縲∝次遞ｿ繧剃ｿｮ豁｣縺励※蜀阪い繝・・繝ｭ繝ｼ繝峨＠縺ｾ縺励ｇ縺・・,
      },
      {
        id: 's4-4',
        label: '繝ｭ繧､繝､繝ｪ繝・ぅ繧・0%縺ｫ險ｭ螳壹☆繧・,
        detail: '70%繝ｭ繧､繝､繝ｪ繝・ぅ縺ｯﾂ･250縲慊･1,250縺ｮ萓｡譬ｼ遽・峇縺ｧ險ｭ螳壹〒縺阪∪縺吶ゅ％縺ｮ遽・峇蜀・〒縺ゅｌ縺ｰ閾ｪ蜍慕噪縺ｫ70%縺碁←逕ｨ縺輔ｌ縺ｾ縺吶・,
        warning: 'ﾂ･250譛ｪ貅縺ｾ縺溘・ﾂ･1,251莉･荳翫↓險ｭ螳壹☆繧九→閾ｪ蜍慕噪縺ｫ35%繝ｭ繧､繝､繝ｪ繝・ぅ縺ｫ縺ｪ繧翫∪縺吶つ･499縺ｪ縺ｩﾂ･250縲慊･1,250縺ｮ遽・峇縺ｧ險ｭ螳壹＠縺ｾ縺励ｇ縺・・,
      },
      {
        id: 's4-5',
        label: '蟶梧悍蟆丞｣ｲ萓｡譬ｼ繧定ｨｭ螳壹☆繧・,
        detail: '70%繝ｭ繧､繝､繝ｪ繝・ぅ繧貞ｾ励ｋ縺ｫ縺ｯﾂ･250縲慊･1,250縺ｮ遽・峇縺ｧ險ｭ螳壹＠縺ｾ縺吶つ･499縺ｯ謇九↓蜿悶ｊ繧・☆縺・ｾ｡譬ｼ蟶ｯ縺ｧ縲・蜀雁｣ｲ繧後ｋ縺溘・縺ｫ邏・･349縺ｮ蜿守寢縺ｫ縺ｪ繧翫∪縺吶ゆｾ｡譬ｼ縺ｯ蜃ｺ迚亥ｾ後〒繧ゅ＞縺､縺ｧ繧ょ､画峩縺ｧ縺阪∪縺吶・,
      },
      {
        id: 's4-6',
        label: 'KDP蛻ｩ逕ｨ隕冗ｴ・↓蜷梧э縺励※縲桑indle譛ｬ繧貞・迚医阪・繧ｿ繝ｳ繧呈款縺・,
        detail: '縺吶∋縺ｦ縺ｮ險ｭ螳壹ｒ遒ｺ隱榊ｾ後∝茜逕ｨ隕冗ｴ・↓蜷梧э縺励※縲桑indle譛ｬ繧貞・迚医阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け縺励∪縺吶ょｯｩ譟ｻ螳御ｺ・∪縺ｧ騾壼ｸｸ24縲・2譎る俣縺九°繧翫∪縺吶ょｯｩ譟ｻ騾夐℃蠕後、mazon縺ｮ繧ｹ繝医い縺ｫ閾ｪ蜍慕噪縺ｫ謗ｲ霈峨＆繧後∪縺吶ょｮ御ｺ・☆繧九→繝｡繝ｼ繝ｫ縺ｧ騾夂衍縺悟ｱ翫″縺ｾ縺吶・,
      },
    ],
    hints: [
      { color: 'green', text: '笨・蟇ｩ譟ｻ縺ｯ騾壼ｸｸ24縲・2譎る俣莉･蜀・↓螳御ｺ・＠縺ｾ縺吶ょｮ御ｺ・☆繧九→繝｡繝ｼ繝ｫ縺ｧ騾夂衍縺悟ｱ翫″縺ｾ縺吶・ },
      { color: 'yellow', text: '腸 萓｡譬ｼ縺ｯ蜃ｺ迚亥ｾ後〒繧ょ､画峩蜿ｯ閭ｽ縺ｧ縺吶ゅ∪縺堋･499縺ｧ蜃ｺ縺励※縺ｿ縺ｦ縲∝渚蠢懊ｒ隕九↑縺後ｉ隱ｿ謨ｴ縺励∪縺励ｇ縺・・ },
    ],
  },
]

// ===================== Component =====================
export default function KdpGuide() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [currentStep, setCurrentStep] = useState(1)

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getStepProgress = (step: StepData) => {
    const total = step.items.length
    const done = step.items.filter(i => checked.has(i.id)).length
    return { done, total, percent: Math.round((done / total) * 100) }
  }

  const isStepComplete = (stepNumber: number) => {
    const step = steps.find(s => s.stepNumber === stepNumber)
    if (!step) return false
    return step.items.every(i => checked.has(i.id))
  }

  const isStepUnlocked = (stepNumber: number) => {
    if (stepNumber === 1) return true
    return isStepComplete(stepNumber - 1)
  }

  const totalItems = steps.flatMap(s => s.items).length
  const totalChecked = steps.flatMap(s => s.items).filter(i => checked.has(i.id)).length
  const totalPercent = Math.round((totalChecked / totalItems) * 100)

  const hintColors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    green: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* 繝倥ャ繝繝ｼ */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">答 Kindle蜃ｺ迚・謇矩・リ繝・/h1>
        <p className="text-muted-foreground text-sm">
          Amazon KDP縺ｧ縺ｮ髮ｻ蟄先嶌邀榊・迚医ｒ4繧ｹ繝・ャ繝励〒繧ｬ繧､繝峨＠縺ｾ縺吶ょ推繧ｹ繝・ャ繝励ｒ蜈ｨ驛ｨ繝√ぉ繝・け縺吶ｋ縺ｨ谺｡縺ｸ騾ｲ繧√∪縺吶・        </p>
      </div>

      {/* 蜈ｨ菴馴ｲ謐・*/}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">蜈ｨ菴薙・騾ｲ謐・/span>
            <span className="text-sm font-bold text-orange-500">{totalChecked}/{totalItems} 螳御ｺ・/span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">{totalPercent}%</p>
        </CardContent>
      </Card>

      {/* 繧ｹ繝・ャ繝励リ繝・*/}
      <div className="grid grid-cols-4 gap-2">
        {steps.map(step => {
          const { done, total } = getStepProgress(step)
          const complete = isStepComplete(step.stepNumber)
          const unlocked = isStepUnlocked(step.stepNumber)
          const isActive = currentStep === step.stepNumber

          return (
            <button
              key={step.stepNumber}
              onClick={() => unlocked && setCurrentStep(step.stepNumber)}
              disabled={!unlocked}
              className={`p-3 rounded-xl border text-center transition-all ${
                !unlocked
                  ? 'border-border opacity-40 cursor-not-allowed'
                  : isActive
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-border hover:border-orange-500/50 cursor-pointer'
              }`}
            >
              <div className="text-lg font-bold">
                {!unlocked ? '白' : complete ? '笨・ : `${step.stepNumber}`}
              </div>
              <div className="text-xs text-muted-foreground mt-1 leading-tight">
                {unlocked ? `${done}/${total}` : '繝ｭ繝・け荳ｭ'}
              </div>
            </button>
          )
        })}
      </div>

      {/* 迴ｾ蝨ｨ縺ｮ繧ｹ繝・ャ繝・*/}
      {steps
        .filter(step => step.stepNumber === currentStep)
        .map(step => {
          const { done, total, percent } = getStepProgress(step)
          const unlocked = isStepUnlocked(step.stepNumber)

          return (
            <div key={step.stepNumber} className="space-y-4">
              {/* 繧ｹ繝・ャ繝励・繝・ム繝ｼ */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg">STEP {step.stepNumber}・嘴step.title}</h2>
                    {done === total && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">螳御ｺ・笨・/Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{done}/{total}</span>
                  </div>
                </div>
              </div>

              {/* 繝√ぉ繝・け繝ｪ繧ｹ繝・*/}
              <div className="space-y-3">
                {step.items.map(item => {
                  const isChecked = checked.has(item.id)
                  const isExpanded = expandedItems.has(item.id)
                  const hasDetail = !!(item.detail || item.warning || item.link)

                  return (
                    <Card
                      key={item.id}
                      className={`transition-all ${isChecked ? 'opacity-60' : ''}`}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleCheck(item.id)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {isChecked
                              ? <CheckSquare className="h-5 w-5 text-green-500" />
                              : <Square className="h-5 w-5 text-muted-foreground" />
                            }
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium leading-relaxed ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                              {item.label}
                            </p>
                            {hasDetail && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 mt-1"
                              >
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {isExpanded ? '髢峨§繧・ : '隧ｳ邏ｰ繧定ｦ九ｋ'}
                              </button>
                            )}
                            {isExpanded && hasDetail && (
                              <div className="mt-3 space-y-2">
                                {item.detail && (
                                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3 whitespace-pre-line">
                                    {item.detail}
                                  </p>
                                )}
                                {item.warning && (
                                  <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">{item.warning}</p>
                                  </div>
                                )}
                                {item.link && (
                                  <a
                                    href={item.link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 underline"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {item.link.text}
                                  </a>
                                )}
                                {item.coverTools && (
                                  <div className="mt-3 space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground">名・・辟｡譁吶〒陦ｨ邏吶ｒ菴懊ｌ繧帰I繝・・繝ｫ</p>
                                    {COVER_AI_TOOLS.map(tool => (
                                      <a
                                        key={tool.name}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between gap-3 bg-muted/60 hover:bg-muted rounded-lg p-3 transition-colors group"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="text-lg flex-shrink-0">{tool.emoji}</span>
                                          <div className="min-w-0">
                                            <p className="text-xs font-bold group-hover:text-orange-500 transition-colors">{tool.name}</p>
                                            <p className="text-[11px] text-muted-foreground leading-tight">{tool.desc}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                          <span className="text-[10px] bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">{tool.badge}</span>
                                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* 繝偵Φ繝・*/}
              {step.hints.length > 0 && (
                <div className="space-y-2">
                  {step.hints.map((hint, i) => (
                    <div key={i} className={`flex items-start gap-2 border rounded-lg p-3 ${hintColors[hint.color]}`}>
                      <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">{hint.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 繝翫ン繝懊ち繝ｳ */}
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                >
                  竊・蜑阪・繧ｹ繝・ャ繝・                </Button>

                {currentStep < steps.length && (
                  <div className="flex flex-col items-end gap-1">
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40"
                      onClick={() => {
                        if (isStepComplete(currentStep)) {
                          setCurrentStep(s => s + 1)
                        }
                      }}
                      disabled={!isStepComplete(currentStep)}
                    >
                      {isStepComplete(currentStep) ? '谺｡縺ｮ繧ｹ繝・ャ繝・竊・ : (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          蜈ｨ鬆・岼繝√ぉ繝・け縺ｧ隗｣髯､
                        </span>
                      )}
                    </Button>
                    {!isStepComplete(currentStep) && (
                      <p className="text-xs text-muted-foreground">
                        縺ゅ→ {total - done} 鬆・岼繝√ぉ繝・け縺ｧ谺｡縺ｸ騾ｲ繧√∪縺・                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

      {/* 螳御ｺ・Γ繝・そ繝ｼ繧ｸ */}
      {totalChecked === totalItems && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="text-4xl">脂</div>
            <h3 className="font-bold text-lg text-green-600 dark:text-green-400">蜈ｨ繧ｹ繝・ャ繝怜ｮ御ｺ・ｼ√♀繧√〒縺ｨ縺・＃縺悶＞縺ｾ縺呻ｼ・/h3>
            <p className="text-sm text-muted-foreground">
              蜃ｺ迚育筏隲九′螳御ｺ・＠縺ｾ縺励◆縲ょｯｩ譟ｻ騾夐℃蠕後・4縲・2譎る俣莉･蜀・↓Amazon縺ｧ雋ｩ螢ｲ髢句ｧ九＆繧後∪縺吶・            </p>
            <div className="flex justify-center gap-2 flex-wrap pt-2">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">笨・蜈ｨ4繧ｹ繝・ャ繝怜ｮ御ｺ・/Badge>
              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">竢ｳ 蟇ｩ譟ｻ蠕・■・・4縲・2譎る俣・・/Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KDP繝ｪ繝ｳ繧ｯ */}
      <Card className="border-dashed">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Amazon KDP 繝繝・す繝･繝懊・繝・/span>
            </div>
            <a
              href="https://kdp.amazon.co.jp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                KDP繧帝幕縺・              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    
      </div>
  )
}




