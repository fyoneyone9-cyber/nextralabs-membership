import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, type LucideIcon } from 'lucide-react'

// ==================== Product Type ====================
interface Product {
  id: string
  title: string
  subtitle: string
  description: string
  price: string
  priceNote: string
  tags: string[]
  icon: LucideIcon
  color: string
  bgColor: string
  iconColor: string
  status: string
}

// ==================== Product Data ====================
const freeTools: Product[] = [
  {
    id: 'office-politics-graph',
    title: '遉ｾ蜀・帆豐ｻ 逶ｸ髢｢蝗ｳ',
    subtitle: 'Slack ﾃ・繧ｫ繝ｬ繝ｳ繝繝ｼ髢｢菫よｧ蜿ｯ隕門喧繝・・繝ｫ',
    description:
      '邨・ｹ泌峙縺ｫ縺ｯ霈峨ｉ縺ｪ縺・梧悽蠖薙・莠ｺ髢馴未菫ゅ阪ｒ蜿ｯ隕門喧縲４lack繝｡繝ｳ繧ｷ繝ｧ繝ｳ蛯ｾ蜷代→繧ｫ繝ｬ繝ｳ繝繝ｼ莨夊ｭｰ繝・・繧ｿ縺九ｉ縲・國繧後◆繧ｭ繝ｼ繝槭Φ繧・ヶ繝ｪ繝・ず蠖ｹ繧定・蜍墓､懷・縲・,
    price: '辟｡譁・,
    priceNote: '繧｢繧ｫ繧ｦ繝ｳ繝井ｸ崎ｦ・,
    tags: ['D3.js', 'PageRank', '繝・・繧ｿ蛻・梵', '辟｡譁吶し繝ｳ繝励Ν'],
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    status: '・ 辟｡譁・,
  },
  {
    id: 'moving-checker',
    title: 'AI蠑輔▲雜翫＠螳牙ｿ・メ繧ｧ繝・き繝ｼ',
    subtitle: '繧ｨ繝ｪ繧｢螳牙・蠎ｦ ﾃ・鬨帝浹繝ｪ繧ｹ繧ｯ ﾃ・繝医Λ繝悶Ν莠磯亟',
    description:
      '迚ｩ莉ｶ縺ｮ縲瑚ｦ九∴縺ｪ縺・Μ繧ｹ繧ｯ縲阪ｒ莠句燕縺ｫ繧ｹ繧ｳ繧｢蛹悶よｲｻ螳峨・鬨帝浹繝ｻ迚ｩ莉ｶ繝√ぉ繝・け30鬆・岼繝ｻ繝医Λ繝悶Ν蟇ｾ蜃ｦ繝・Φ繝励Ξ繝ｼ繝医・蠑輔▲雜翫＠繧ｳ繧ｹ繝郁ｨ育ｮ励∪縺ｧ縲・,
    price: '辟｡譁・,
    priceNote: '逋ｻ骭ｲ荳崎ｦ√〒莉翫☆縺蝉ｽｿ縺医ｋ',
    tags: ['繧ｨ繝ｪ繧｢螳牙・蠎ｦ', '鬨帝浹繝ｪ繧ｹ繧ｯ', '30鬆・岼繝√ぉ繝・け', '繝医Λ繝悶Ν蟇ｾ蜃ｦ'],
    icon: Home,
    color: 'from-blue-500 to-green-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '・ 辟｡譁・,
  },
  {
    id: 'sns-auto-poster',
    title: 'SNS繧ｪ繝ｼ繝医・繧ｹ繧ｿ繝ｼ',
    subtitle: 'AI ﾃ・繝槭Ν繝√・繝ｩ繝・ヨ繝輔か繝ｼ繝SNS謚慕ｨｿ逕滓・',
    description:
      '繝医ヴ繝・け繧貞・蜉帙☆繧九□縺代〒縲ゝwitter繝ｻInstagram繝ｻFacebook繝ｻLinkedIn蜷代￠縺ｮ謚慕ｨｿ譁・ｒ閾ｪ蜍慕函謌舌ゅワ繝・す繝･繧ｿ繧ｰ謠先｡井ｻ倥″縲・,
    price: '辟｡譁・,
    priceNote: '繧｢繧ｫ繧ｦ繝ｳ繝井ｸ崎ｦ・,
    tags: ['SNS', '繝槭・繧ｱ繝・ぅ繝ｳ繧ｰ', '繧ｳ繝斐・繝ｩ繧､繝・ぅ繝ｳ繧ｰ', '辟｡譁・],
    icon: Share2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '・ 辟｡譁・,
  },
  {
    id: 'ai-report-generator',
    title: 'AI繝ｬ繝昴・繝医ず繧ｧ繝阪Ξ繝ｼ繧ｿ繝ｼ',
    subtitle: '邂・擅譖ｸ縺・竊・繝薙ず繝阪せ繝ｬ繝昴・繝郁・蜍慕函謌・,
    description:
      '邂・擅譖ｸ縺阪・繝｡繝｢縺九ｉ繝励Ο繝輔ぉ繝・す繝ｧ繝翫Ν縺ｪ繝薙ず繝阪せ繝ｬ繝昴・繝医ｒ閾ｪ蜍慕函謌舌るｱ谺｡蝣ｱ蜻翫・譛域ｬ｡蝣ｱ蜻翫・繝励Ο繧ｸ繧ｧ繧ｯ繝亥ｱ蜻翫↓蟇ｾ蠢懊・,
    price: '辟｡譁・,
    priceNote: '繧｢繧ｫ繧ｦ繝ｳ繝井ｸ崎ｦ・,
    tags: ['繝ｬ繝昴・繝・, '繝薙ず繝阪せ譁・嶌', '閾ｪ蜍慕函謌・, '辟｡譁・],
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-500',
    status: '・ 辟｡譁・,
  },
]

// 孱・・髦ｲ陦帙す繝ｪ繝ｼ繧ｺ 窶・證ｮ繧峨＠繧貞ｮ医ｋ
const defenseTools: Product[] = [
  {
    id: 'scam-defender',
    title: 'AI隧先ｬｺ繝・ぅ繝輔ぉ繝ｳ繝繝ｼ',
    subtitle: '隧先ｬｺ繝｡繝ｼ繝ｫ蛻､螳・ﾃ・髣・ヰ繧､繝亥愛螳・ﾃ・隧先ｬｺ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ ﾃ・螳ｶ譌剰ｦ句ｮ医ｊ',
    description:
      '荳榊ｯｩ繝｡繝ｼ繝ｫ繧但I縺ｧ蜊ｳ蛻､螳壹・裸繝舌う繝亥愛螳壹メ繧ｧ繝・き繝ｼ縺ｧ蜊ｱ髯ｺ蠎ｦ繧ｹ繧ｳ繧｢蛹悶∬ｩ先ｬｺ髮ｻ隧ｱ繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ縺ｧ譁ｭ繧頑婿繧堤ｷｴ鄙偵・縺､縺ｮ讖溯・縺ｧ螳ｶ譌上ｒ螳医ｋ縲・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['隧先ｬｺ繝｡繝ｼ繝ｫAI蛻､螳・, '髣・ヰ繧､繝亥愛螳・, '隧先ｬｺ繧ｯ繧､繧ｺ', '螳ｶ譌剰ｦ句ｮ医ｊ'],
    icon: ShieldCheck,
    color: 'from-amber-500 to-red-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '莠ｺ豌・,
  },
  {
    id: 'money-guard',
    title: 'AI螳ｶ險磯亟陦帙す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ',
    subtitle: '蜿取髪繝医Λ繝・き繝ｼ ﾃ・譛溷ｾ・､險育ｮ・ﾃ・萓晏ｭ伜ｺｦ繝√ぉ繝・け',
    description:
      '繧ｮ繝｣繝ｳ繝悶Ν蜿取髪繧貞庄隕門喧縺励∵悄蠕・､繧呈焚蟄ｦ逧・↓隗｣隱ｬ縲ゅ後ｂ縺苓ｲｯ驥代＠縺ｦ縺溘ｉ縲阪す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ縲∬ｪ咲衍繝舌う繧｢繧ｹ險ｺ譁ｭ縲∫嶌隲・ｪ灘哨繧ｬ繧､繝峨∪縺ｧ縲・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['蜿取髪繝医Λ繝・き繝ｼ', '譛溷ｾ・､險育ｮ・, '萓晏ｭ伜ｺｦ繝√ぉ繝・け', '隱咲衍繝舌う繧｢繧ｹ'],
    icon: Wallet,
    color: 'from-emerald-500 to-amber-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
  {
    id: 'disaster-guard',
    title: 'AI髦ｲ轣ｽ繝代・繧ｽ繝翫Ν繧ｬ繧､繝・,
    subtitle: 'GPS驕ｿ髮｣謇讀懃ｴ｢ ﾃ・螳ｶ譌城亟轣ｽ繝励Λ繝ｳ ﾃ・豌苓ｱ｡隴ｦ蝣ｱAPI',
    description:
      '迴ｾ蝨ｨ蝨ｰ縺九ｉ譛蟇・ｊ驕ｿ髮｣謇繧定・蜍墓､懃ｴ｢縲∝ｮｶ譌上・驕ｿ髮｣繝励Λ繝ｳ繧剃ｺ句燕菴懈・縲∵ｰ苓ｱ｡蠎、PI縺ｧ隴ｦ蝣ｱ繧偵Μ繧｢繝ｫ繧ｿ繧､繝遒ｺ隱阪る亟轣ｽ繝√ぉ繝・け繝ｪ繧ｹ繝茨ｼ・衍隴倥け繧､繧ｺ繧ゅ・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['GPS', '豌苓ｱ｡蠎、PI', '髦ｲ轣ｽ', '驕ｿ髮｣謇讀懃ｴ｢'],
    icon: Shield,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    status: 'NEW',
  },
  {
    id: 'shopping-stopper',
    title: 'AI雋ｷ縺・黄萓晏ｭ倥せ繝医ャ繝代・',
    subtitle: '繧ｫ繝｡繝ｩ陦ｨ諠・ｧ｣譫・ﾃ・陦晏虚雋ｷ縺・亟豁｢AI',
    description: '繧ｫ繝ｼ繝育判髱｢縺ｧ縲碁ｫ俶恕諢溘阪ｒ讀懃衍縺吶ｋ縺ｨAI縺悟・髱吶↑蛻､譁ｭ繧剃ｿ・＠豎ｺ貂医ｒ荳螳壽凾髢薙Ο繝・け縲り｡晏虚雋ｷ縺・ョ繝ｼ繧ｿ縺九ｉ蠕梧ｔ縺吶ｋ遒ｺ邇・ｒ莠域ｸｬ縲・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['TensorFlow.js', 'Canvas API', 'AI', '陦悟虚蛻・梵'],
    icon: ShieldAlert,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
]

// 町 繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ 窶・莠ｺ髢馴未菫ゅｒ逎ｨ縺・
const commTools: Product[] = [
  {
    id: 'comm-coach',
    title: 'AI繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ謾ｹ蝟・さ繝ｼ繝・,
    subtitle: '蠢・炊蟄ｦ繝吶・繧ｹ ﾃ・繝｡繝・そ繝ｼ繧ｸ豺ｻ蜑・ﾃ・閾ｪ蟾ｱ險ｺ譁ｭ',
    description:
      '蠢・炊蟄ｦ逅・ｫ悶↓蝓ｺ縺･縺・※繝｡繝・そ繝ｼ繧ｸ繧呈ｷｻ蜑翫√さ繝溘Η繧ｹ繧ｿ繧､繝ｫ繧・繧ｿ繧､繝苓ｨｺ譁ｭ縲∝ｴ髱｢蛻･縺ｮ莨夊ｩｱ繝励Λ繝ｳ繝翫・縺ｧ繧ｹ繧ｭ繝ｫ繧｢繝・・縲よ°諢帙ｂ繝薙ず繝阪せ繧ょ暑莠ｺ髢｢菫ゅｂ縲・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['繝｡繝・そ繝ｼ繧ｸ豺ｻ蜑・, '繧ｳ繝溘Η險ｺ譁ｭ', '蠢・炊蟄ｦ隰帛ｺｧ', 'NG・・K髮・],
    icon: MessageCircleHeart,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
  {
    id: 'ai-konkatsu',
    title: 'AI蟀壽ｴｻ繧ｳ繝ｼ繝・,
    subtitle: '繝励Ο繝輔ぅ繝ｼ繝ｫ豺ｻ蜑・ﾃ・繝｡繝・そ繝ｼ繧ｸ邱ｴ鄙・ﾃ・逶ｸ諤ｧ險ｺ譁ｭ',
    description:
      '繝槭ャ繝√Φ繧ｰ繧｢繝励Μ縺ｮ繝励Ο繝輔ぅ繝ｼ繝ｫ繧但I縺梧ｷｻ蜑翫√Γ繝・そ繝ｼ繧ｸ縺ｮ邱ｴ鄙偵す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ縲∽ｾ｡蛟､隕ｳ險ｺ譁ｭ縲√ョ繝ｼ繝医・繝ｩ繝ｳ謠先｡医∝ｩ壽ｴｻ謌ｦ逡･蛻・梵縺ｾ縺ｧ縲・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['繝励Ο繝輔ぅ繝ｼ繝ｫ豺ｻ蜑・, '繝｡繝・そ繝ｼ繧ｸ邱ｴ鄙・, '逶ｸ諤ｧ險ｺ譁ｭ', '繝・・繝医・繝ｩ繝ｳ'],
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
  {
    id: 'buzz-writer',
    title: 'AI繝舌ぜ譁・ｫ繧ｳ繝ｼ繝・,
    subtitle: '繝医Ξ繝ｳ繝峨ル繝･繝ｼ繧ｹ ﾃ・繝・Φ繝励Ξ繝ｼ繝・ﾃ・逕ｻ蜒冗函謌・,
    description:
      '莉頑律縺ｮ繝九Η繝ｼ繧ｹ繧偵ロ繧ｿ縺ｫ縲∬・蛻・・險闡峨〒繝舌ぜ繧峨○繧九・0遞ｮ鬘槭・繝・Φ繝励Ξ繝ｼ繝医√ヰ繧ｺ蠎ｦ險ｺ譁ｭ縲∵兜遞ｿ逕ｻ蜒上ず繧ｧ繝阪Ξ繝ｼ繧ｿ繝ｼ縲√ワ繝・す繝･繧ｿ繧ｰ霎槫・縲・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['繝医Ξ繝ｳ繝峨ル繝･繝ｼ繧ｹ', '繝舌ぜ蠎ｦ險ｺ譁ｭ', '逕ｻ蜒冗函謌・, '繝上ャ繧ｷ繝･繧ｿ繧ｰ'],
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
  {
    id: 'shio-taiou',
    title: '蝪ｩ蟇ｾ蠢應ｻ｣陦窟I',
    subtitle: '鄒ｩ螳溷ｮｶ繝ｻ隕ｪ謌壹・荳雁昇縺九ｉ縺ｮ驥阪＞騾｣邨｡繧定ｧ偵′遶九◆縺壹↓譁ｭ繧・,
    description:
      '6縺､縺ｮ繧ｷ繝√Η繧ｨ繝ｼ繧ｷ繝ｧ繝ｳﾃ・谿ｵ髫弱・繝医・繝ｳ縺ｧ譛驕ｩ縺ｪ譁ｭ繧頑枚繧剃ｸ迸ｬ逕滓・縲よ里隱ｭ繧ｿ繧､繝溘Φ繧ｰ謠先｡医→繝励Ο縺ｮ繧ｳ繝・ｻ倥″縲ょｮ悟・繧ｪ繝輔Λ繧､繝ｳ縲・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['霑比ｿ｡逕滓・', '譌｢隱ｭ繧ｿ繧､繝溘Φ繧ｰ', '繝・Φ繝励Ξ繝ｼ繝・, '莠ｺ髢馴未菫・],
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: 'NEW',
  },
]

// 召 繧ｭ繝｣繝ｪ繧｢繝ｻ繝ｩ繧､繝・窶・莠ｺ逕溘・霆｢讖溘ｒ繧ｵ繝昴・繝・
const lifeTools: Product[] = [
  {
    id: 'resignation-assistant',
    title: '騾閨ｷ縺ゅｓ縺励ｓAI',
    subtitle: '騾閨ｷ螻顔函謌・ﾃ・谿区･ｭ莉｣險育ｮ・ﾃ・螳悟・繝√ぉ繝・け繝ｪ繧ｹ繝・,
    description:
      'AI縺碁閨ｷ螻翫ｒ閾ｪ蜍穂ｽ懈・縲∵悴謇輔＞谿区･ｭ莉｣繧定ｨ育ｮ励∵怏邨ｦ繝ｻ遉ｾ菫昴・蟷ｴ驥代・謇狗ｶ壹″縺ｾ縺ｧ螳悟・繧ｬ繧､繝峨る閨ｷ莉｣陦後し繝ｼ繝薙せ縺ｮ豈碑ｼ・ｄ讓ｩ蛻ｩQ&A繧よ政霈峨・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['騾閨ｷ螻晦I逕滓・', '谿区･ｭ莉｣險育ｮ・, '繝√ぉ繝・け繝ｪ繧ｹ繝・, '讓ｩ蛻ｩQ&A'],
    icon: ClipboardCheck,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
  {
    id: 'closet-coach',
    title: 'AI繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ譁ｭ謐ｨ髮｢繧ｳ繝ｼ繝・,
    subtitle: '繝ｯ繝ｼ繝峨Ο繝ｼ繝也ｮ｡逅・ﾃ・繧ｳ繧ｹ繝大・譫・ﾃ・螢ｲ蜊ｴ繧ｬ繧､繝・,
    description:
      '謖√▲縺ｦ繧区恪縺ｮ繧ｳ繧ｹ繝代ｒ蜿ｯ隕門喧縲∵妙謐ｨ髮｢蛟呵｣懊ｒAI蛻､螳壹ょ｣ｲ蜊ｴ諠ｳ螳壻ｾ｡譬ｼ・・・繝ｩ繝・ヨ繝輔か繝ｼ繝豈碑ｼ・√さ繝ｼ繝・署譯医∪縺ｧ縲ゅけ繝ｭ繝ｼ繧ｼ繝・ヨ繧呈怙驕ｩ蛹悶・,
    price: 'ﾂ･980/譛・,
    priceNote: '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ',
    tags: ['繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ邂｡逅・, '繧ｳ繧ｹ繝大・譫・, '譁ｭ謐ｨ髮｢AI', '螢ｲ蜊ｴ繧ｬ繧､繝・],
    icon: Shirt,
    color: 'from-violet-500 to-fuchsia-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
]

// 寫・・繝薙ず繝阪せ繝ｻ蜑ｯ讌ｭ 窶・AI縺ｧ遞ｼ縺・
const bizTools: Product[] = [
  {
    id: 'vintage-hunter',
    title: 'AI蜿､逹縺願ｲｷ縺・ｾ励ワ繝ｳ繧ｿ繝ｼ',
    subtitle: 'AI謳ｭ霈峨Γ繝ｫ繧ｫ繝ｪ閾ｪ蜍慕屮隕悶・繝・ヨ',
    description:
      '繝｡繝ｫ繧ｫ繝ｪ縺ｮ譁ｰ逹蜃ｺ蜩√ｒ24譎る俣閾ｪ蜍慕屮隕悶＠縲、I縺後後♀雋ｷ縺・ｾ励阪→蛻､譁ｭ縺励◆迸ｬ髢薙↓Discord縺ｸ騾夂衍縲ょｯ昴※繧矩俣縺ｫ縺雁ｮ晏商逹繧定ｦ矩・＆縺ｪ縺・・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['Python', 'AWS Lambda', 'AI', 'Discord'],
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
  {
    id: 'ai-select-shop',
    title: '縲悟惠蠎ｫ繧ｼ繝ｭ縲喉I繧ｻ繝ｬ繧ｯ繝医す繝ｧ繝・・',
    subtitle: '繝医Ξ繝ｳ繝牙・譫・ﾃ・AI閾ｪ蜍輔ョ繧ｶ繧､繝ｳ ﾃ・繧ｪ繝ｳ繝・・繝ｳ繝牙・蜩・,
    description:
      'AI縺後ヰ繧ｺ繝ｯ繝ｼ繝峨ｒ蛻・梵縺裕繧ｷ繝｣繝・ョ繧ｶ繧､繝ｳ繧定・蜍慕函謌舌よｳｨ譁・凾縺ｫ繧ｪ繝ｳ繝・・繝ｳ繝芽｣ｽ騾繝ｻ驟埼√ょ惠蠎ｫ繝ｪ繧ｹ繧ｯ繧ｼ繝ｭ縺ｮAI繝輔ぃ繝・す繝ｧ繝ｳ繝薙ず繝阪せ縲・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['AI Design', 'Printful API', '繝医Ξ繝ｳ繝牙・譫・, 'Shopify'],
    icon: Store,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
  {
    id: 'ai-sidejob',
    title: 'AI蜑ｯ讌ｭ繧ｹ繧ｿ繝ｼ繝医ム繝・す繝･',
    subtitle: '13繧ｫ繝・ざ繝ｪ ﾃ・驕ｩ諤ｧ險ｺ譁ｭ ﾃ・繝ｭ繝ｼ繝峨・繝・・ ﾃ・蜿守寢繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ',
    description:
      'AI蜑ｯ讌ｭ縺ｮ縲御ｽ輔°繧牙ｧ九ａ繧後・縺・＞・溘阪°繧峨梧怦10荳・・驕疲・縲阪∪縺ｧ螳悟・繧ｵ繝昴・繝医・0+縺ｮAI繝・・繝ｫ霎槫・縲√ユ繝ｳ繝励Ξ繝ｼ繝磯寔縲∵ｴｻ蜍輔Ο繧ｰ謳ｭ霈峨・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['13繧ｫ繝・ざ繝ｪ', '驕ｩ諤ｧ險ｺ譁ｭ', '繝・Φ繝励Ξ繝ｼ繝・, '蜿守寢險育ｮ・],
    icon: Briefcase,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: 'NEW',
  },
  {
    id: 'inbox-organizer',
    title: 'Gmail AI Accelerator',
    subtitle: 'Gmail騾｣謳ｺ ﾃ・閾ｪ蜍募・鬘・ﾃ・AI霑比ｿ｡ ﾃ・繧ｴ繝溽ｮｱ謨ｴ逅・,
    description:
      'Gmail縺ｨ繝ｯ繝ｳ繧ｯ繝ｪ繝・け謗･邯壹ょ女菫｡繝｡繝ｼ繝ｫ繧堤ｷ頑･ﾃ鈴㍾隕√〒閾ｪ蜍募・鬘槭、I縺瑚ｿ比ｿ｡譁・ｒ逕滓・縲∽ｸ崎ｦ√Γ繝ｼ繝ｫ縺ｯ繝ｯ繝ｳ繧ｯ繝ｪ繝・け縺ｧ繧ｴ繝溽ｮｱ縺ｸ縲・蛻・〒Inbox Zero縲・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['Gmail騾｣謳ｺ', 'AI霑比ｿ｡', '閾ｪ蜍募・鬘・, 'Inbox Zero'],
    icon: Mail,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
    status: 'NEW',
  },
]

// 耳 繧ｯ繝ｪ繧ｨ繧､繝・ぅ繝・窶・AI縺ｧ蜑ｵ菴懊ｒ蜉騾・
const creativeTools: Product[] = [
  {
    id: 'prompt-master',
    title: 'AI逕ｻ蜒上・繝ｭ繝ｳ繝励ヨ繝槭せ繧ｿ繝ｼ',
    subtitle: '26繧ｫ繝・ざ繝ｪ ﾃ・譌･譛ｬ隱樞・闍ｱ隱槫､画鋤 ﾃ・繝代Λ繝｡繝ｼ繧ｿ霎槫・',
    description:
      '譌･譛ｬ隱槭〒蜈･蜉帙☆繧九□縺代〒逕ｻ蜒冗函謌植I逕ｨ縺ｮ譛驕ｩ繝励Ο繝ｳ繝励ヨ繧定・蜍慕函謌舌・idjourney/DALL-E/Stable Diffusion蟇ｾ蠢懊・00+繝・Φ繝励Ξ繝ｼ繝域政霈峨・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['26繧ｫ繝・ざ繝ｪ', '繝励Ο繝ｳ繝励ヨ逕滓・', '繝・Φ繝励Ξ繝ｼ繝・, '逕ｻ蜒就I'],
    icon: Wand2,
    color: 'from-purple-500 to-fuchsia-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    status: 'NEW',
  },
  {
    id: 'youtube-producer',
    title: 'AI YouTube繝励Ο繝・Η繝ｼ繧ｵ繝ｼ',
    subtitle: '譁・ｭ苓ｵｷ縺薙＠竊貞床譛ｬ竊剃ｺｺ迚ｩ逕ｻ蜒鞘・繧ｵ繝繝阪う繝ｫ竊偵ち繧､繝医Ν竊達GM',
    description:
      '蜍慕判繝ｻ髻ｳ螢ｰ繝ｻ繝・く繧ｹ繝医ｒ蜿悶ｊ霎ｼ繧薙〒6繧ｹ繝・ャ繝励〒YouTube謚慕ｨｿ邏譚舌ｒ蜈ｨ閾ｪ蜍慕函謌舌・0繧ｸ繝｣繝ｳ繝ｫ蟇ｾ蠢懊・蜿ｰ譛ｬ縲、I莠ｺ迚ｩ繧､繝ｩ繧ｹ繝医√し繝繝阪う繝ｫ縲ヾEO繧ｿ繧､繝医Ν縲。GM菴懈峇縲・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['6繧ｹ繝・ャ繝・, '10繧ｸ繝｣繝ｳ繝ｫ', '譁・ｭ苓ｵｷ縺薙＠', '繧ｵ繝繝阪う繝ｫ'],
    icon: Clapperboard,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: 'NEW',
  },
  {
    id: 'location-finder',
    title: 'YouTuber謦ｮ蠖ｱ蝣ｴ謇迚ｹ螳哂I',
    subtitle: '繧ｵ繝繝阪う繝ｫ繧歎ision AI縺ｧ隗｣譫・竊・Google Maps縺ｫ繝斐Φ陦ｨ遉ｺ',
    description:
      'YouTube URL繧定ｲｼ繧九□縺代〒縲√し繝繝阪う繝ｫ3譫壹ｒGemini AI縺瑚ｧ｣譫舌＠縲∵聴蠖ｱ蝣ｴ謇繧竪oogle Maps縺ｫ繝斐Φ繝昴う繝ｳ繝郁｡ｨ遉ｺ縲ょｻｺ迚ｩ繝ｻ逵区攸繝ｻ蝨ｰ蠖｢縺九ｉ蝣ｴ謇繧呈耳螳壹・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['Gemini Vision', 'Google Maps', '蝣ｴ謇迚ｹ螳・, '1譌･1蝗・],
    icon: MapPin,
    color: 'from-blue-500 to-violet-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: 'NEW',
  },
]

// 誓 繧ｨ繝ｳ繧ｿ繝｡繝ｻ雜｣蜻ｳ
const funTools: Product[] = [
  {
    id: 'pet-translator',
    title: 'AI繝壹ャ繝育ｿｻ險ｳ繝｢繝九ち繝ｼ',
    subtitle: 'AI謳ｭ霈峨・繝・ヨ諢滓ュ繝ｪ繧｢繝ｫ繧ｿ繧､繝鄙ｻ險ｳ繧ｷ繧ｹ繝・Β',
    description:
      '逡吝ｮ井ｸｭ縺ｮ繝壹ャ繝医・蜍輔″縺ｨ魑ｴ縺榊｣ｰ繧但I縺後Μ繧｢繝ｫ繧ｿ繧､繝隗｣譫舌ゅ悟ｯゅ＠縺後▲縺ｦ縺・∪縺吶阪後♀閻ｹ縺檎ｩｺ縺阪∪縺励◆縲阪→諢滓ュ繧呈律譛ｬ隱槭〒鄙ｻ險ｳ縺励※騾夂衍縲・,
    price: 'ﾂ･1,980/譛・,
    priceNote: '繝励Ξ繝溘い繝繝励Λ繝ｳ',
    tags: ['HTML5', 'Web Audio API', 'AI', 'LINE騾夂衍'],
    icon: PawPrint,
    color: 'from-violet-500 to-pink-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: '雋ｩ螢ｲ荳ｭ',
  },
]

// ==================== Section Component ====================
interface SectionProps {
  emoji: string
  title: string
  subtitle: string
  accentColor: string
  products: Product[]
}

function ProductSection({ emoji, title, subtitle, accentColor, products }: SectionProps) {
  if (products.length === 0) return null
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${accentColor}`}>
          {products.length}繝・・繝ｫ
        </span>
      </div>
      <p className="text-muted-foreground mb-6 ml-10">{subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// ==================== Product Card ====================
function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${product.bgColor}`}>
            <Icon className={`h-6 w-6 ${product.iconColor}`} />
          </div>
          <Badge className={
            product.status === '・ 辟｡譁・ ? 'bg-blue-500 text-white border-0' :
            product.status === 'NEW' ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white border-0' :
            product.status === '莠ｺ豌・ ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0' :
            'bg-green-500 text-white border-0'
          }>
            {product.status}
          </Badge>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-xl font-bold mb-1 hover:text-primary transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3">{product.subtitle}</p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{product.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-end justify-between pt-4 border-t">
          <div>
            <span className="text-2xl font-bold">{product.price}</span>
            <span className="text-xs text-muted-foreground ml-1">{product.priceNote}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}/app`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 transition-opacity"
            >
              <Rocket className="h-3 w-3" />
              菴ｿ縺・
            </Link>
            <Link href={`/products/${product.id}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                隧ｳ邏ｰ
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Coming Soon ====================
const comingSoon: { title: string; description: string; icon: any; color: string; bgColor: string; iconColor: string }[] = []

// ==================== Page ====================
export default function ProductsPage() {
  const totalTools = freeTools.length + defenseTools.length + commTools.length + lifeTools.length + bizTools.length + creativeTools.length + funTools.length

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          繧ｵ繝悶せ繧ｯAI 繝・・繝ｫ
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            荳隕ｧ
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          縺ゅｉ繧・ｋ讌ｭ蜍吶ｒ蜉騾溘☆繧帰I繝・・繝ｫ繧・繝励Λ繝ｳ縺ｧ謠蝉ｾ・
        </p>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{totalTools}</span>
            <span className="text-muted-foreground">繝・・繝ｫ</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl text-blue-500">{freeTools.length}</span>
            <span className="text-muted-foreground">辟｡譁吶ヤ繝ｼ繝ｫ</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl text-violet-500">7</span>
            <span className="text-muted-foreground">繝励Ξ繝溘い繝</span>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <a href="#free" className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">・ 辟｡譁吩ｽ馴ｨ・/a>
        <a href="#defense" className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors">孱・・髦ｲ陦帙す繝ｪ繝ｼ繧ｺ</a>
        <a href="#comm" className="px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-medium hover:bg-pink-500/20 transition-colors">町 繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ</a>
        <a href="#life" className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors">召 繧ｭ繝｣繝ｪ繧｢繝ｻ繝ｩ繧､繝・/a>
        <a href="#biz" className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">寫・・繝薙ず繝阪せ繝ｻ蜑ｯ讌ｭ</a>
        <a href="#creative" className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors">耳 繧ｯ繝ｪ繧ｨ繧､繝・ぅ繝・/a>
        <a href="#fun" className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors">誓 繧ｨ繝ｳ繧ｿ繝｡繝ｻ雜｣蜻ｳ</a>
      </div>

      {/* FREE */}
      <div id="free">
        <ProductSection
          emoji="・"
          title="辟｡譁吶ヤ繝ｼ繝ｫ"
          subtitle="繧｢繧ｫ繧ｦ繝ｳ繝井ｸ崎ｦ√・莉翫☆縺蝉ｽｿ縺医ｋ辟｡譁僊I繝・・繝ｫ"
          accentColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          products={freeTools}
        />
      </div>

      {/* DEFENSE SERIES */}
      <div id="defense">
        <ProductSection
          emoji="孱・・
          title="髦ｲ陦帙す繝ｪ繝ｼ繧ｺ"
          subtitle="隧先ｬｺ繝ｻ縺企≡繝ｻ菴上∪縺・・轣ｽ螳ｳ窶ｦ證ｮ繧峨＠縺ｮ繝ｪ繧ｹ繧ｯ縺九ｉ縺ゅ↑縺溘ｒ螳医ｋ"
          accentColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          products={defenseTools}
        />
      </div>

      {/* COMMUNICATION */}
      <div id="comm">
        <ProductSection
          emoji="町"
          title="繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ"
          subtitle="諱区・繝ｻ蟀壽ｴｻ繝ｻSNS窶ｦ莠ｺ髢馴未菫ゅ・繧ｹ繧ｭ繝ｫ繧堤｣ｨ縺・
          accentColor="bg-pink-500/10 text-pink-600 dark:text-pink-400"
          products={commTools}
        />
      </div>

      {/* CAREER & LIFE */}
      <div id="life">
        <ProductSection
          emoji="召"
          title="繧ｭ繝｣繝ｪ繧｢繝ｻ繝ｩ繧､繝・
          subtitle="騾閨ｷ繝ｻ譁ｭ謐ｨ髮｢窶ｦ莠ｺ逕溘・霆｢讖溘ｒAI縺後し繝昴・繝・
          accentColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          products={lifeTools}
        />
      </div>

      {/* BUSINESS */}
      <div id="biz">
        <ProductSection
          emoji="寫・・
          title="繝薙ず繝阪せ繝ｻ蜑ｯ讌ｭ"
          subtitle="AI繧剃ｽｿ縺｣縺ｦ蜉ｹ邇・ｈ縺冗ｨｼ縺・
          accentColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          products={bizTools}
        />
      </div>

      {/* CREATIVE */}
      <div id="creative">
        <ProductSection
          emoji="耳"
          title="繧ｯ繝ｪ繧ｨ繧､繝・ぅ繝・
          subtitle="逕ｻ蜒冗函謌植I繝ｻ繝・じ繧､繝ｳ窶ｦ蜑ｵ菴懊ｒ蜉騾溘☆繧・
          accentColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          products={creativeTools}
        />
      </div>

      {/* FUN */}
      <div id="fun">
        <ProductSection
          emoji="誓"
          title="繧ｨ繝ｳ繧ｿ繝｡繝ｻ雜｣蜻ｳ"
          subtitle="AI縺ｧ豈取律繧偵■繧・▲縺ｨ讌ｽ縺励￥"
          accentColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          products={funTools}
        />
      </div>

      {/* Plan CTA */}
      <div className="my-16 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">2縺､縺ｮ繝励Λ繝ｳ縺ｧ蜈ｨ繝・・繝ｫ隗｣謾ｾ</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
          <div>
            <span className="text-amber-500 font-bold">繧ｹ繧ｿ繝ｳ繝繝ｼ繝・/span>
            <span className="text-3xl font-bold text-amber-500 ml-2">ﾂ･980</span>
            <span className="text-muted-foreground">/譛茨ｼ・totalTools - 7}繝・・繝ｫ・・/span>
          </div>
          <div>
            <span className="text-violet-500 font-bold">繝励Ξ繝溘い繝</span>
            <span className="text-3xl font-bold text-violet-500 ml-2">ﾂ･1,980</span>
            <span className="text-muted-foreground">/譛茨ｼ亥・{totalTools}繝・・繝ｫ・・/span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">縺・▽縺ｧ繧りｧ｣邏ОK 笨ｨ 辟｡譁吶ヤ繝ｼ繝ｫ縺ｯ繧｢繧ｫ繧ｦ繝ｳ繝井ｸ崎ｦ・/p>
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl text-lg font-bold hover:opacity-90">
            繝励Λ繝ｳ繧定ｦ九ｋ 竊・
          </Button>
        </Link>
      </div>

      {/* Coming Soon 窶・遨ｺ縺ｪ繧蛾撼陦ｨ遉ｺ */}
      {comingSoon.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            圦 髢狗匱荳ｭ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoon.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="h-full opacity-60 cursor-default">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.bgColor}`}>
                        <Icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

