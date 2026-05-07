'use client'
import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, Zap, Star, Crown, Shield, TrendingUp, Share2, ShieldCheck, 
  Mail, Briefcase, Wallet, Building2, Youtube, User, HeartHandshake, 
  Sofa, Network, LayoutGrid, Heart, Search, ShoppingCart, MessageSquare, 
  Smartphone, FileText, Lock, Image as ImageIcon, Activity, FolderSearch,
  CloudRain, Wind, AlertTriangle, Printer
} from 'lucide-react'

// ツール全データの定義
const ALL_TOOLS = [
  // 本日のおすすめ (recommend)
  { id: 'staysee-ai-finder', name: 'AI×ホテルDXシステム【Nextra】', desc: '宿泊予約・鍵発行を完全同期', icon: Building2, plan: 'premium', category: 'recommend', badge: 'マスタ' },
  { id: 'sns-auto-poster', name: 'AI SNSオートポスター', desc: 'バズる投稿をAIが自動生成', icon: Share2, plan: 'light', category: 'recommend', badge: 'マスタ' },
  { id: 'hotel-affiliate', name: 'アフィリエイト連携', desc: '宿紹介 × 楽天収益化OS', icon: Network, plan: 'standard', category: 'recommend', badge: 'マスタ' },

  // 無料ツール (free)
  { id: 'office-politics-graph', name: '社内政治 AI相関図', desc: '人間関係の暗部を可視化', icon: Share2, plan: 'free', category: 'free', badge: '人気' },
  { id: 'moving-checker', name: 'AI引越し安心チェッカー', desc: '治安・物件リスクを徹底分析', icon: CloudRain, plan: 'free', category: 'free', badge: 'マスタ' },
  { id: 'buy-smart-nav', name: '中古・新品比較ナビ', desc: '損得勘定のAI市場判定OS', icon: Search, plan: 'free', category: 'free', badge: 'NEW' },
  { id: 'evidence-manager', name: 'AI エビデンス・マネージャー', desc: 'サブスク実績の証拠管理', icon: ShieldCheck, plan: 'free', category: 'free', badge: 'NEW' },
  { id: 'kdp-guide', name: 'Kindle出版完全ナビ', desc: '執筆から出版までの一気通貫', icon: FileText, plan: 'free', category: 'free', badge: '標準' },
  { id: 'ai-report-generator', name: 'AIレポートジェネレーター', desc: '箇条書きからプロ級文書生成', icon: FileText, plan: 'free', category: 'free', badge: 'マスタ' },
  { id: 'shopping-stopper', name: 'AI買い物依存ストッパー', desc: '散財の鎖を断ち切る', icon: AlertTriangle, plan: 'free', category: 'free', badge: '最強' },

  // ライトプラン (light)
  { id: 'contact-sync', name: 'Contact Sync', desc: '名刺の全自動・連絡先登録OS', icon: User, plan: 'light', category: 'light', badge: 'NEW' },
  { id: 'price-tracker', name: '底値監視予測Bot', desc: '価格変動 × AI将来予測OS', icon: TrendingUp, plan: 'light', category: 'light', badge: 'NEW' },
  { id: 'expense-sync', name: 'Expense Sync', desc: '経費精算の全自動・記帳OS', icon: Wallet, plan: 'light', category: 'light', badge: 'NEW' },
  { id: 'prompt-master', name: 'AI画像プロンプトマスター', desc: '究極の画像生成パーツ工房', icon: ImageIcon, plan: 'light', category: 'light', badge: '必須' },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', desc: '適性診断 × 収益ロードマップ', icon: Briefcase, plan: 'light', category: 'light', badge: 'マスタ' },

  // スタンダードプラン (standard)
  { id: 'trend-stock', name: 'SNSトレンド自動仕入', desc: 'バズ予測 × 楽天商品検索OS', icon: TrendingUp, plan: 'standard', category: 'standard', badge: 'NEW' },
  { id: 'ai-konkatsu', name: 'AI婚活コーチ', desc: '戦略的成婚支援システム', icon: HeartHandshake, plan: 'standard', category: 'standard', badge: '注目' },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', desc: '衝動買いの心理的抑止', icon: Wallet, plan: 'standard', category: 'standard', badge: 'マスタ' },
  { id: 'disaster-guard', name: 'AI防災パーソナルガイド', desc: '避難ルート × 備蓄最適化', icon: Shield, plan: 'standard', category: 'standard', badge: 'マスタ' },

  // プレミアムプラン (premium)
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', desc: '最新ニュースからの全自動台本', icon: Youtube, plan: 'premium', category: 'premium', badge: '注目' },
  { id: 'inbox-organizer', name: 'Gmail AI Accelerator', desc: '未読ゼロを最速で実現', icon: Mail, plan: 'premium', category: 'premium', badge: 'マスタ' },
  { id: 'comp-price-monitor', name: '競合価格監視', desc: '楽天API連携 × 価格最適化OS', icon: TrendingUp, plan: 'premium', category: 'premium', badge: 'NEW' },
  { id: 'interior-coordinator', name: 'Interior Sync', desc: '空間分析 × 楽天一括購入OS', icon: Sofa, plan: 'premium', category: 'premium', badge: 'NEW' },
  { id: 'youtube-coordinator', name: 'YouTube Sync', desc: '動画解析 × 楽天連動コーデ', icon: Youtube, plan: 'premium', category: 'premium', badge: 'NEW' },
  { id: 'ai-select-shop', name: '「在庫ゼロ」AIセレクトショップ', desc: 'トレンド分析 × Shopify連携', icon: ShoppingCart, plan: 'premium', category: 'premium', badge: '人気' },
  { id: 'scam-defender', name: 'AI詐欺ディフェンダー', desc: '詐欺・悪意を即座に判定', icon: ShieldCheck, plan: 'premium', category: 'premium', badge: '最強' },
]

export default function ProductsPage() {
  const categories = [
    { id: 'recommend', title: '本日のおすすめ', icon: BookOpen, color: 'text-emerald-500' },
    { id: 'free', title: '無料ツール', icon: Shield, color: 'text-slate-400' },
    { id: 'light', title: 'ライトプラン', icon: Zap, color: 'text-blue-500' },
    { id: 'standard', title: 'スタンダードプラン', icon: Star, color: 'text-amber-500' },
    { id: 'premium', title: 'プレミアムプラン', icon: Crown, color: 'text-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-6 py-1 text-xs font-black text-emerald-500 border-emerald-500/20 uppercase tracking-widest">Master Intelligence Catalogue</Badge>
          <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">AI Tool Store</h1>
        </div>

        {categories.map((cat) => (
          <div key={cat.id} className="space-y-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-orange-500 font-black">|</span>
              <cat.icon className={"w-5 h-5 " + cat.color} />
              {cat.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_TOOLS.filter(t => t.category === cat.id).map((tool) => (
                <Link key={tool.id} href={"/products/" + tool.id}>
                  <Card className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group shadow-xl h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                          <tool.icon className="text-emerald-500" size={24} />
                        </div>
                        <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 px-3 py-0.5 text-[10px] font-black">{tool.badge}</Badge>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white italic uppercase leading-tight group-hover:text-emerald-400">{tool.name}</h3>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed mt-2">{tool.desc}</p>
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                      <Badge variant="outline" className="text-[8px] uppercase border-white/10 opacity-50">{tool.plan} PLAN</Badge>
                      <span className="text-[10px] font-black text-emerald-500 italic uppercase">View Details ➔</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}