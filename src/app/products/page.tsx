import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, 
  ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, 
  Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon, Lock, CreditCard, Coins, Sparkles 
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs',
  description: 'NextraLabsの全てのAIツール。全22種類の強力なAIを一本道UIで提供。',
}

interface Product {
  id: string; title: string; subtitle: string; description: string; priceNote: string; tags: string[]; icon: LucideIcon; bgColor: string; iconColor: string; status: string;
}

// ==================== 🛠️ 全22ツールのデータ完全復元 ====================
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係の可視化', description: '組織図に載らない本当の関係をAIが分析。キーマンを見抜きます。', priceNote: '無料', tags: ['分析', '無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気' },
  { id: 'moving-checker', title: '引っ越し安心AI', subtitle: '治安・騒音スコア', description: '物件のリスクをAIが数値化。後悔しない引っ越しをサポート。', priceNote: '無料', tags: ['治安', '騒音'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '定番' },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'マルチSNS投稿生成', description: 'トピックから投稿文を自動生成。ハッシュタグ案も。', priceNote: '無料', tags: ['SNS', '自動化'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '無料' },
  { id: 'kdp-guide', title: 'Kindle出版ナビ', subtitle: '電子書籍出版ガイド', description: 'KDPアカウント設定から出版申請まで、ステップ式で迷わず完了。', priceNote: '無料', tags: ['副業', 'Kindle'], icon: BookOpen, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '無料' },
  { id: 'ai-report-generator', title: 'AIレポート作成', subtitle: 'ビジネス文書自動化', description: '箇条書きからプロ級のレポートを生成。報告業務を効率化。', priceNote: '無料', tags: ['事務', '効率化'], icon: FileText, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: '無料' },
]

const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像解析 × 宿泊者照合', description: '忘れ物を撮影しAIが持ち主を特定。フロント業務を劇的に効率化します。', priceNote: 'プレミアム', tags: ['B2B', 'Staysee'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '新着' },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺・闇バイト判定', description: '不審な連絡をAIが即判定。最新の詐欺手口から家族を守ります。', priceNote: 'プレミアム', tags: ['防犯', '家族'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
  { id: 'money-guard', title: 'AI家計防衛', subtitle: '依存防止シミュレーター', description: '収支を数学的に分析し依存を予防。認知バイアスを診断します。', priceNote: 'スタンダード', tags: ['家計', '数学'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW' },
  { id: 'disaster-guard', title: 'AI防災ガイド', subtitle: '避難所検索 × 警報', description: '現在地の避難所を検索、家族の避難プランをAIが提案。', priceNote: 'スタンダード', tags: ['防災', 'GPS'], icon: Shield, bgColor: 'bg-sky-500/10', iconColor: 'text-sky-400', status: 'NEW' },
  { id: 'shopping-stopper', title: '買い物依存ストッパー', subtitle: '表情解析 × 衝動買い防止', description: 'カート画面で冷静な判断を促す。後悔する確率を予測します。', priceNote: 'スタンダード', tags: ['メンタル', '節約'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: 'NEW' },
]

const commTools: Product[] = [
  { id: 'comm-coach', title: 'AIコミュ改善コーチ', subtitle: '心理学ベースの添削', description: 'メッセージを心理学で分析。人間関係をスムーズにします。', priceNote: 'ライト', tags: ['心理学', '添削'], icon: MessageCircleHeart, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: 'NEW' },
  { id: 'ai-konkatsu', title: 'AI婚活コーチ', subtitle: 'プロフィール添削', description: '魅力的なプロフィールを作成。相性診断とメッセージ練習も。', priceNote: 'ライト', tags: ['婚活', '添削'], icon: Heart, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: 'NEW' },
  { id: 'shio-taiou', title: '塩対応代行AI', subtitle: '角が立たない断り文', description: '義実家や上司からの重い連絡を、適切なトーンで代行。', priceNote: 'ライト', tags: ['人間関係', '自動化'], icon: Shield, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '便利' },
  { id: 'buzz-writer', title: 'AIバズ文章コーチ', subtitle: 'トレンド × 画像生成', description: '今日のニュースからバズる文章を生成。ハッシュタグ案付き。', priceNote: 'スタンダード', tags: ['SNS', 'ライティング'], icon: Flame, bgColor: 'bg-orange-600/10', iconColor: 'text-orange-500', status: 'NEW' },
]

const lifeTools: Product[] = [
  { id: 'resignation-assistant', title: '退職あんしんAI', subtitle: '退職届・権利Q&A', description: 'AIが退職届を自動生成。残業代計算や法的な権利もサポート。', priceNote: 'ライト', tags: ['キャリア', '法律'], icon: ClipboardCheck, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: '安心' },
  { id: 'exam-scheduler', title: '試験 AIスケジューラー', subtitle: '学習計画自動生成', description: '試験日から逆算してカレンダーに登録。最短合格を支援。', priceNote: 'スタンダード', tags: ['学習', 'Google'], icon: BookOpen, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'NEW' },
  { id: 'closet-coach', title: 'クローゼット断捨離', subtitle: 'コスパ分析 × 売却', description: '持ってる服の価値を可視化。効率的な断捨離を提案。', priceNote: 'ライト', tags: ['整理', 'ファッション'], icon: Shirt, bgColor: 'bg-violet-500/10', iconColor: 'text-violet-400', status: 'NEW' },
]

const bizTools: Product[] = [
  { id: 'vintage-hunter', title: '古着お買い得ハンター', subtitle: 'メルカリ自動監視', description: '24時間監視しお宝品をAIが即通知。副業速度を最大化。', priceNote: 'プレミアム', tags: ['副業', '監視'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: '最強' },
  { id: 'ai-select-shop', title: 'AIセレクトショップ', subtitle: '在庫ゼロの物販AI', description: 'トレンドからデザイン生成・出品まで。物販を一本道で。', priceNote: 'プレミアム', tags: ['物販', 'Shopify'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気' },
  { id: 'inbox-organizer', title: 'Gmail AI Accelerator', subtitle: 'Inbox Zeroを実現', description: '受信メールを自動分類・返信案生成。瞬時に整理します。', priceNote: 'プレミアム', tags: ['Gmail', '効率化'], icon: Mail, bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400', status: 'NEW' },
  { id: 'ai-sidejob', title: 'AI副業ダッシュ', subtitle: '適性診断 × ロードマップ', description: 'あなたに最適なAI副業を診断。月10万への最短ルート。', priceNote: 'ライト', tags: ['副業', 'ロードマップ'], icon: Briefcase, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW' },
]

const creativeTools: Product[] = [
  { id: 'prompt-master', title: 'AIプロンプトマスター', subtitle: '画像生成用英語変換', description: '日本語のイメージを高品質な英語プロンプトへ変換します。', priceNote: 'ライト', tags: ['画像AI', '変換'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須' },
  { id: 'youtube-producer', title: 'AI YouTube', subtitle: '投稿素材の全自動生成', description: '文字起こしから台本、サムネイル案まで。制作を一本道で。', priceNote: 'プレミアム', tags: ['動画', '一本道UI'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
]

const funTools: Product[] = [
  { id: 'location-finder', title: 'AI Location Scout', subtitle: '動画の場所を特定', description: 'YouTube URLから撮影場所を特定。Google Mapsにピン表示。', priceNote: 'プレミアム', tags: ['旅行', '調査'], icon: MapPin, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '驚き' },
  { id: 'pet-translator', title: 'AIペット翻訳', subtitle: '鳴き声リアルタイム解析', description: '留守中のペットの声を解析し、感情を日本語で通知します。', priceNote: 'プレミアム', tags: ['エンタメ', '癒し'], icon: PawPrint, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: 'NEW' },
  { id: 'smart-gardening', title: 'AI万能スコープ', subtitle: '視覚解析 × 環境', description: 'カメラで対象を捉えるだけで、環境と視覚情報を統合分析。', priceNote: 'プレミアム', tags: ['調査', '万能'], icon: Zap, bgColor: 'bg-yellow-500/10', iconColor: 'text-yellow-400', status: '万能' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/30 transition-all duration-300 rounded-[2.5rem] overflow-hidden group shadow-xl">
      <CardContent className="p-8 flex flex-col h-full text-left">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform shadow-inner`}><Icon className="h-8 w-8" /></div>
          <Badge className="bg-slate-800 text-slate-400 border-0 px-3 py-1 font-bold text-[10px] uppercase">{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-medium mb-4">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4 mt-auto">
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group/btn">
              <span>このツールを使う</span>
              <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Plan: {product.priceNote}</span>
            {product.priceNote !== '無料' && <Lock className="h-3 w-3 text-slate-600" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ emoji, title, color }: { emoji: string; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-4 mb-8 border-l-8 ${color} pl-6 py-2`}>
      <span className="text-3xl">{emoji}</span>
      <h2 className="text-3xl font-bold text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-24 space-y-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">NextraLabs Catalog</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">AIを、日常のパートナーに。</h1>
        
        {/* 📋 料金の仕組み（日本語解説版） */}
        <div className="max-w-5xl mx-auto bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left shadow-2xl">
          <div className="space-y-3">
            <div className="bg-blue-600/20 p-3 rounded-2xl w-fit text-blue-400"><CreditCard /></div>
            <h3 className="text-xl font-bold text-white">1. システム利用料</h3>
            <p className="text-slate-400 text-sm leading-relaxed">全ツールへのアクセス権です。最強のプロンプトと一本道UIを提供します。</p>
            <Badge className="bg-blue-600 text-white border-0">月額 ￥980〜</Badge>
          </div>
          <div className="space-y-3">
            <div className="bg-emerald-600/20 p-3 rounded-2xl w-fit text-emerald-400"><Coins /></div>
            <h3 className="text-xl font-bold text-white">2. 外部AI利用料</h3>
            <p className="text-slate-400 text-sm leading-relaxed">生成されたプロンプトを、ChatGPT等の「無料枠」で実行します。API代は不要です。</p>
            <Badge className="bg-emerald-600 text-white border-0">基本 ￥0 (無料)</Badge>
          </div>
          <div className="space-y-3">
            <div className="bg-amber-500/20 p-3 rounded-2xl w-fit text-amber-400"><Sparkles /></div>
            <h3 className="text-xl font-bold text-white">圧倒的な低コスト</h3>
            <p className="text-slate-400 text-sm leading-relaxed">数万円かかるAI開発コストをNextraLabsが効率化。プロの知恵を格安で使い倒せます。</p>
            <p className="text-emerald-400 font-black italic">HYBRID MODEL</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-32">
        <section>
          <SectionTitle emoji="🆓" title="無料ツール体験" color="border-emerald-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🏨" title="ホテル・民泊オーナー向け" color="border-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🛡️" title="防衛・ライフ" color="border-red-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="💬" title="コミュニケーション" color="border-pink-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{commTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🏢" title="キャリア・ライフ" color="border-slate-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{lifeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🛍️" title="ビジネス・副業" color="border-teal-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🎨" title="クリエイティブ" color="border-purple-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{creativeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🐾" title="エンタメ・趣味" color="border-rose-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{funTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      </div>
    </div>
  )
}
