import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, 
  ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, 
  Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon, Lock, CreditCard, Coins, Sparkles, Archive, UserPlus, Table, Sofa, Play, TrendingUp, LineChart, Scale
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
  { id: 'office-politics-graph', title: '社内政治 AI相関図', subtitle: '人間関係の暗部を可視化', description: '組織図には載らない「本当のパワーバランス」をAIが暴き出します。派閥争いやキーマンの特定、あなたの社内での立ち位置を数値化・相関図化。', priceNote: '無料', tags: ['無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気', isModel: true },
  { id: 'moving-checker', title: 'AI引越し安心チェッカー', subtitle: '治安・物件リスクを徹底分析', description: '住所を入力するだけで、周辺の治安、ハザードマップ、隠れた物件リスクをAIがスコアリング。後悔しない引越しをデータでサポートします。', priceNote: '無料', tags: ['無料'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: 'マスタ', isModel: true },
  { id: 'buy-smart-nav', title: '中古・新品比較ナビ', subtitle: '損得勘定のAI市場判定OS', description: '欲しい商品名をいれるだけ。Google検索・楽天・ラクマから市場価格を一括収集し、AIが「今新品と中古どちらを買うべきか」をズバリ判定。', priceNote: '無料', tags: ['節約'], icon: Scale, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW', isModel: true },
  { id: 'evidence-manager', title: 'エビデンス・マネージャー', subtitle: 'サブスク実績の証拠管理', description: 'デスクトップをスキャンし、Shopifyの出品成功画像などの「本物の証拠」のみを選別・永久保存。不要なゴミを自動消去する実績管理システム。', priceNote: '無料', tags: ['事務'], icon: Archive, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW', isModel: true },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'バズを量産するマルチSNS生成', description: '今のトレンドニュースと強力な投稿戦略を掛け合わせ、X、Instagram、TikTok向けの最適な文章を秒速で錬成。ハッシュタグ提案まで完結。', priceNote: 'スタンダード', tags: ['SNS'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'マスタ', isModel: true },
  { id: 'kdp-guide', title: 'Kindle出版完全ナビ', subtitle: '執筆から出版までの一気通貫ガイド', description: '本のネタ出し、目次構成、原稿執筆支援からKDPの複雑な登録作業まで。最短距離で電子書籍作家デビューを果たすための全工程を可視化。', priceNote: '無料', tags: ['教育'], icon: BookOpen, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '標準', isModel: true },
  { id: 'ai-report-generator', title: 'AIレポートジェネレーター', subtitle: '箇条書きからプロ級の文書を生成', description: '支離滅裂なメモや箇条書きを、論理的で説得力のあるビジネスレポートへ瞬時に変換。会議録、日報、企画書のクオリティを極限まで高めます。', priceNote: '無料', tags: ['事務'], icon: FileText, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: 'マスタ', isModel: true },
  { id: 'shopping-stopper', title: 'AI買い物依存ストッパー', subtitle: '散財の鎖を断ち切る', description: '特定のキーワードやサイトへの接触を制限し、冷静な判断を促す。依存のメカニズムをAIが理解し、あなたの購買行動を健全な方向へと導きます。', priceNote: '無料', tags: ['節約'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: '最強', isModel: true },
]

const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'AI×ホテルDXシステム【Nextra】', subtitle: '宿泊予約・鍵発行を完全同期', description: '遺失物をAI画像解析でスピード特定。Staysee PMSと連携し、フロント業務の負担を激減させる宿泊施設特化型AI。', priceNote: 'プレミアム', tags: ['B2B'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'マスタ', isModel: true },
  { id: 'comp-price-monitor', title: '競合価格監視', subtitle: '楽天API連携 × 価格最適化OS', description: '周辺宿の販売価格をAIが24時間監視。需給バランスを読み取り、Staysee（ステイシー）の最適な販売価格を戦略的に提案します。', priceNote: 'プレミアム', tags: ['B2B'], icon: LineChart, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW', isModel: true },
  { id: 'hotel-affiliate', title: 'アフィリエイト連携', subtitle: '宿紹介 × 楽天収益化OS', description: '宿泊者がSNSで宿を紹介する際、バズる紹介文と楽天アフィリエイトリンクをAIが自動生成。宿の認知拡大と収益化を同時に実現。', priceNote: 'スタンダード', tags: ['SNS'], icon: Share2, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: 'マスタ', isModel: true },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺・悪意を即座に判定', description: '不審なDM、メール、SMSをAIが徹底スキャン。最新の詐欺手口と照らし合わせ、その危険性をリアルタイムで警告。あなたのデジタル資産を守り抜きます。', priceNote: 'プレミアム', tags: ['防犯'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '最強', isModel: true },
  { id: 'money-guard', title: 'AI家計防衛シミュレーター', subtitle: '衝動買いの心理的抑止', description: '支出を単に記録するだけでなく、購入前の迷いをAIが客観的に分析。「今、本当に必要か？」を問いかけ、家計の致命傷を未然に防ぎます。', priceNote: 'スタンダード', tags: ['家計'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'マスタ', isModel: true },
  { id: 'disaster-guard', title: 'AI防災パーソナルガイド', subtitle: '避難ルート × 備蓄最適化', description: '現在地のハザードマップを読み込み、あなた専用の防災・備蓄プランをAIが提案。災害発生時の生存確率を最大化させるためのデジタルガイド。', priceNote: 'スタンダード', tags: ['防災'], icon: Shield, bgColor: 'bg-sky-500/10', iconColor: 'text-sky-400', status: 'マスタ', isModel: true },
  { id: 'shopping-stopper', title: 'AI買い物依存ストッパー', subtitle: '散財の鎖を断ち切る', description: '特定のキーワードやサイトへの接触を制限し、冷静な判断を促す。依存のメカニズムをAIが理解し、あなたの購買行動を健全な方向へと導きます。', priceNote: '無料', tags: ['節約'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: '最強', isModel: true },
  { id: 'ai-konkatsu', title: 'AI婚活コーチ', subtitle: '戦略的成婚支援システム', description: '現在のステータスと相手の希望条件から成婚期待度を算出。データに基づいた「次の一手」を提案し、迷走しがちな婚活に終止符を打ちます。', priceNote: 'スタンダード', tags: ['恋愛'], icon: Heart, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: '注目', isModel: true },
]

const bizTools: Product[] = [
  { id: 'trend-stock', title: 'SNSトレンド自動仕入', subtitle: 'バズ予測 × 楽天商品検索OS', description: 'Google TrendsとSNSのバイブスをAIが解析。「明日バズる」商品を予測し、楽天市場の在庫データと即座に同期して仕入れをサポートします。', priceNote: 'スタンダード', tags: ['物販'], icon: TrendingUp, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: 'NEW', isModel: true },
  { id: 'contact-sync', title: 'Contact Sync', subtitle: '名刺の全自動・連絡先登録OS', description: '名刺の写真をAIがスキャン。名前、会社名、電話番号、メールアドレスを精密に読み取り、あなたの連絡先へ自動で1行ずつ追加します。', priceNote: 'ライト', tags: ['事務'], icon: UserPlus, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'NEW', isModel: true },
  { id: 'interior-coordinator', title: 'Interior Sync', subtitle: '空間分析 × 楽天一括購入OS', description: 'カメラで部屋を映すとAIが今のインテリアを分析。空間に調和する家具を楽天からセット提案し、そのまま丸ごと購入できる次世代コマース体験。', priceNote: 'プレミアム', tags: ['生活'], icon: Sofa, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: 'NEW', isModel: true },
  { id: 'youtube-coordinator', title: 'YouTube Sync', subtitle: '動画解析 × 楽天連動コーデOS', description: 'YouTube動画のURLを入れるだけで、AIが動画内の服を特定・スタイル分類。楽天市場から類似アイテムを即座に提案するファッション特化型エンジン。', priceNote: 'プレミアム', tags: ['生活'], icon: Play, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: 'NEW', isModel: true },
  { id: 'price-tracker', title: '底値監視予測Bot', subtitle: '価格変動 × AI将来予測OS', description: '楽天商品のURLから過去の推移を学習。Google時系列解析AIが「次の底値（セール）」がいつ来るかを秒速予測し、買い時を逃さない次世代Bot。', priceNote: 'ライト', tags: ['節約'], icon: LineChart, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: 'NEW', isModel: true },
  { id: 'expense-sync', title: 'Expense Sync', subtitle: '経費精算の全自動・記帳OS', description: 'Expensesフォルダ内のレシート画像をAIが自動解析。金額・日付・店舗名を読み取り、スプレッドシートへ1行ずつ自動記帳します。', priceNote: 'ライト', tags: ['経理'], icon: Table, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: 'NEW', isModel: true },
  { id: 'ai-select-shop', title: '「在庫ゼロ」AIセレクトショップ', subtitle: 'トレンド分析 × Shopify連携', description: '流行をAIが分析し、売れるデザインを自動生成。そのままShopify経由でオンデマンド生産・出品し、在庫リスクゼロのネットショップを実現。', priceNote: 'プレミアム', tags: ['EC'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気', isModel: true },
  { id: 'youtube-producer', title: 'AI YouTubeプロデューサー', subtitle: '最新ニュースからの全自動台本作成', description: '音声の文字起こしから、最新トレンドを反映した台本生成、サムネイル設計まで。YouTube運用の全工程をAIが代行する「最強の工場」です。', priceNote: 'プレミアム', tags: ['動画'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目', isModel: true },
  { id: 'prompt-master', title: 'AI画像プロンプトマスター', subtitle: '究極の画像生成パーツ工房', description: '1000種類以上のパーツをパズルのように組み合わせ、MidjourneyやStable Diffusionで使える究極の呪文を錬成します。', priceNote: 'ライト', tags: ['画像AI'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須', isModel: true },
  { id: 'inbox-organizer', title: 'Gmail AI Accelerator', subtitle: '未読ゼロを最速で実現', description: '受信メールをAIが瞬時に解析し、重要度別に仕分け。文脈を汲み取った返信案もワンクリックで生成し、メール対応時間を劇的に短縮。', priceNote: 'プレミアム', tags: ['Gmail'], icon: Mail, bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400', status: 'マスタ', isModel: true },
  { id: 'ai-sidejob', title: 'AI副業スタートダッシュ', subtitle: '適性診断 × 収益化ロードマップ', description: 'あなたのスキルと時間に合わせた「稼げるAI副業」を診断。具体的な始め方から収益化までのステップをロードマップ形式で提示します。', priceNote: 'ライト', tags: ['副業'], icon: Briefcase, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'マスタ', isModel: true },
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
        {/* <BookOpen className='w-5 h-5 text-emerald-500' /> 本日のおすすめセクション */}
        <section>
          <SectionTitle emoji="" title="<BookOpen className='w-5 h-5 text-emerald-500' /> 本日のおすすめ" color="border-orange-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todayRecommended.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section><SectionTitle emoji="" title="<Shield className='w-5 h-5 text-slate-400' /> 無料ツール" color="border-emerald-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="" title="ホテル・民泊オーナー様向け" color="border-blue-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="?" title="防犯・ライフ" color="border-red-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="" title="ビジネス・制作" color="border-teal-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
      </div>
    </div>
  )
}
