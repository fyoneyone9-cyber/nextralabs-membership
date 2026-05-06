import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, 
  ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, 
  Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon, Lock, CreditCard, Coins, Sparkles, Archive
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs',
  description: 'NextraLabsの全てのAIツール。',
}

interface Product {
  id: string; title: string; subtitle: string; description: string; priceNote: string; tags: string[]; icon: LucideIcon; bgColor: string; iconColor: string; status: string; isModel?: boolean;
}

// モデル化したツールには isModel: true を付与
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係の暗部を可視化', description: '組織図には載らない「本当のパワーバランス」をAIが暴き出します。派閥争いやキーマンの特定、あなたの社内での立ち位置を数値化・相関図化。', priceNote: '無料', tags: ['無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気', isModel: true },
  { id: 'moving-checker', title: 'AI引越し安心チェッカー', subtitle: '治安・物件リスクを徹底分析', description: '住所を入力するだけで、周辺の治安、ハザードマップ、隠れた物件リスクをAIがスコアリング。後悔しない引越しをデータでサポートします。', priceNote: '無料', tags: ['無料'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '注目', isModel: true },
  { id: 'evidence-manager', title: 'Evidence Manager', subtitle: 'サブスク実績の証拠管理', description: 'デスクトップをスキャンし、Shopifyの出品成功画像などの「本物の証拠」のみを選別・永久保存。不要なゴミを自動消去する実績管理システム。', priceNote: '無料', tags: ['事務'], icon: Archive, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW', isModel: true },
  { id: 'pr-command', title: 'PR COMMAND', subtitle: '実績からの全自動PR記事生成', description: 'マスタ機が積み上げた「本物の証拠」を元に、note向けの最強PR記事を自動生成。投稿予約機能で、広報戦略を完全自動化します。', priceNote: '無料', tags: ['広報'], icon: Rocket, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'NEW', isModel: true },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'バズを量産するマルチSNS生成', description: '今のトレンドニュースと強力な投稿戦略を掛け合わせ、X、Instagram、TikTok向けの最適な文章を秒速で錬成。ハッシュタグ提案まで完結。', priceNote: '無料', tags: ['SNS'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'マスタ', isModel: true },
  { id: 'kdp-guide', title: 'Kindle出版完全ナビ', subtitle: '執筆から出版までの一気通貫ガイド', description: '本のネタ出し、目次構成、原稿執筆支援からKDPの複雑な登録作業まで。最短距離で電子書籍作家デビューを果たすための全工程を可視化。', priceNote: '無料', tags: ['教育'], icon: BookOpen, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '標準', isModel: true },
  { id: 'ai-report-generator', title: 'AIレポートジェネレーター', subtitle: '箇条書きからプロ級の文書を生成', description: '支離滅裂なメモや箇条書きを、論理的で説得力のあるビジネスレポートへ瞬時に変換。会議録、日報、企画書のクオリティを極限まで高めます。', priceNote: '無料', tags: ['事務'], icon: FileText, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: 'マスタ', isModel: true },
  { id: 'shopping-stopper', title: 'AI買い物依存ストッパー', subtitle: '散財の鎖を断ち切る', description: '特定のキーワードやサイトへの接触を制限し、冷静な判断を促す。依存のメカニズムをAIが理解し、あなたの購買行動を健全な方向へと導きます。', priceNote: '無料', tags: ['節約'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: '最強', isModel: true },
]

const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像検索 × 忘れ物照合', description: '遺失物をAI画像解析でスピード特定。Staysee PMSと連携し、フロント業務の負担を激減させる宿泊施設特化型AI。', priceNote: 'プレミアム', tags: ['B2B'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '新着' },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺・悪意を即座に判定', description: '不審なDM、メール、SMSをAIが徹底スキャン。最新の詐欺手口と照らし合わせ、その危険性をリアルタイムで警告。あなたのデジタル資産を守り抜きます。', priceNote: 'プレミアム', tags: ['防犯'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '最強', isModel: true },
  { id: 'money-guard', title: 'AI家計防衛シミュレーター', subtitle: '衝動買いの心理的抑止', description: '支出を単に記録するだけでなく、購入前の迷いをAIが客観的に分析。「今、本当に必要か？」を問いかけ、家計の致命傷を未然に防ぎます。', priceNote: 'スタンダード', tags: ['家計'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW' },
  { id: 'disaster-guard', title: 'AI防災パーソナルガイド', subtitle: '避難ルート × 備蓄最適化', description: '現在地のハザードマップを読み込み、あなた専用の防災・備蓄プランをAIが提案。災害発生時の生存確率を最大化させるためのデジタルガイド。', priceNote: 'スタンダード', tags: ['防災'], icon: Shield, bgColor: 'bg-sky-500/10', iconColor: 'text-sky-400', status: 'NEW' },
  { id: 'shopping-stopper', title: 'AI買い物依存ストッパー', subtitle: '散財の鎖を断ち切る', description: '特定のキーワードやサイトへの接触を制限し、冷静な判断を促す。依存のメカニズムをAIが理解し、あなたの購買行動を健全な方向へと導きます。', priceNote: '無料', tags: ['節約'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: '最強', isModel: true },
  { id: 'ai-konkatsu', title: 'AI婚活コーチ', subtitle: '戦略的成婚支援システム', description: '現在のステータスと相手の希望条件から成婚期待度を算出。データに基づいた「次の一手」を提案し、迷走しがちな婚活に終止符を打ちます。', priceNote: 'スタンダード', tags: ['恋愛'], icon: Heart, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: '注目', isModel: true },
]

const bizTools: Product[] = [
  { id: 'vintage-hunter', title: 'AI古着ハンター', subtitle: 'メルカリ24時間自動監視', description: '設定した条件に合う「お宝商品」をAIが常に監視し、出品された瞬間に通知。転売・仕入れのスピードをプロレベルへ引き上げます。', priceNote: 'プレミアム', tags: ['物販'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: '最強', isModel: true },
  { id: 'ai-select-shop', title: '「在庫ゼロ」AIセレクトショップ', subtitle: 'トレンド分析 × Shopify連携', description: '流行をAIが分析し、売れるデザインを自動生成。そのままShopify経由でオンデマンド生産・出品し、在庫リスクゼロのネットショップを実現。', priceNote: 'プレミアム', tags: ['EC'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気', isModel: true },
  { id: 'youtube-producer', title: 'AI YouTubeプロデューサー', subtitle: '最新ニュースからの全自動台本作成', description: '音声の文字起こしから、最新トレンドを反映した台本生成、サムネイル設計まで。YouTube運用の全工程をAIが代行する「最強の工場」です。', priceNote: 'プレミアム', tags: ['動画'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目', isModel: true },
  { id: 'prompt-master', title: 'AI画像プロンプトマスター', subtitle: '究極の画像生成パーツ工房', description: '1000種類以上のパーツをパズルのように組み合わせ、MidjourneyやStable Diffusionで使える究極の呪文を錬成します。', priceNote: 'ライト', tags: ['画像AI'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須', isModel: true },
  { id: 'inbox-organizer', title: 'Gmail AI Accelerator', subtitle: '未読ゼロを最速で実現', description: '受信メールをAIが瞬時に解析し、重要度別に仕分け。文脈を汲み取った返信案もワンクリックで生成し、メール対応時間を劇的に短縮。', priceNote: 'プレミアム', tags: ['Gmail'], icon: Mail, bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400', status: 'NEW' },
  { id: 'ai-sidejob', title: 'AI副業スタートダッシュ', subtitle: '適性診断 × 収益化ロードマップ', description: 'あなたのスキルと時間に合わせた「稼げるAI副業」を診断。具体的な始め方から収益化までのステップをロードマップ形式で提示します。', priceNote: 'ライト', tags: ['副業'], icon: Briefcase, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className={`h-full bg-[#1a1b23] transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-xl relative ${product.isModel ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/10 scale-[1.02]' : 'border-slate-800 hover:border-emerald-500/30'}`}>
      {product.isModel && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-b-xl z-20 uppercase tracking-tighter shadow-lg">
          Master Model
        </div>
      )}
      <CardContent className="p-8 flex flex-col h-full text-left relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform shadow-inner`}><Icon className="h-8 w-8" /></div>
          <Badge className={`${product.isModel ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'} border-0 px-3 py-1 font-bold text-[10px] uppercase`}>{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-medium mb-4 italic">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{product.description}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4 mt-auto">
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className={`w-full h-16 ${product.isModel ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500' : 'bg-emerald-500 hover:bg-emerald-400'} text-slate-950 font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group/btn`}>
              <span>このツールを使う</span>
              <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex justify-between items-center px-2 py-2 bg-slate-950/50 rounded-xl border border-slate-800/50">
            <div className="flex items-center gap-2">
              <CreditCard className="h-3 w-3 text-slate-500" />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${product.priceNote === '無料' ? 'text-emerald-400' : 'text-slate-400'}`}>
                {product.priceNote} PLAN
              </span>
            </div>
            {product.priceNote !== '無料' ? (
              <Lock className="h-3 w-3 text-amber-500/50" />
            ) : (
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ emoji, title, color }: { emoji: string; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-4 mb-10 border-l-8 ${color} pl-6 py-2`}>
      <span className="text-3xl">{emoji}</span>
      <h2 className="text-3xl font-bold text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}

export default function ProductsPage() {
  // マスタ化されたツール（isModel: true）を全て抽出してランダムに3つ選択
  const allTools = [...freeTools, ...hotelTools, ...defenseTools, ...bizTools]
  const masterTools = allTools.filter(p => p.isModel)
  const todayRecommended = masterTools.sort(() => 0.5 - Math.random()).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-16 space-y-6">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">Catalogue</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">AIツール一覧</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">全22種類のNextraLabs AIツール。機能を絞り、直感的なUIで使いやすく設計されています。</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-32">
        {/* 本日のおすすめセクション */}
        <section>
          <SectionTitle emoji="🔥" title="本日のおすすめ" color="border-orange-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todayRecommended.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section><SectionTitle emoji="🎁" title="無料ツール" color="border-emerald-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="🏨" title="オーナー様向け" color="border-blue-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="🛡️" title="防犯・ライフ" color="border-red-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="💼" title="ビジネス・制作" color="border-teal-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
      </div>
    </div>
  )
}
