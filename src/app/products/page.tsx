import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon, Info, Lock, CreditCard, Coins, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs',
  description: 'NextraLabsの全てのAIツール。無料ツールからプロ仕様のB2Bツールまで網羅。',
}

// ... ProductCardコンポーネント定義などは維持 ...

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-24 space-y-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/10">NextraLabs Catalog</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight">AIを、日常のパートナーに。</h1>
        
        {/* 🛠️ 修正：タイトルの下に「大きな呼吸（余白）」を追加 */}
        <div className="h-16 md:h-24" />

        {/* 💰 料金の仕組み：徹底解説パネル (アイコン拡大 & 具体的文言) */}
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-white/10 flex-1" />
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] italic">System Architecture & Pricing</h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* 1. NextraLabs Sub (Icon 拡大) */}
            <Card className="bg-[#1a1b23] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-500/30 group">
               <div className="space-y-6">
                 <div className="bg-blue-600/20 p-5 rounded-3xl w-fit text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                   <CreditCard className="h-10 w-10" /> {/* アイコン拡大 */}
                 </div>
                 <h3 className="text-2xl font-black text-white">1. システム利用料</h3>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">
                   NextraLabsの全機能へのパス。最強のプロンプトと、**初心者でも迷わず完遂できる「一本道UI」**を提供します。
                 </p>
                 <Badge className="bg-blue-600 text-white border-0 font-black px-4 py-1 text-sm">月額 ￥980〜</Badge>
               </div>
            </Card>

            {/* 2. External AI Free Tier (Icon 拡大) */}
            <Card className="bg-[#1a1b23] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl transition-all hover:border-emerald-500/30 group">
               <div className="space-y-6">
                 <div className="bg-emerald-600/20 p-5 rounded-3xl w-fit text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
                   <Coins className="h-10 w-10" /> {/* アイコン拡大 */}
                 </div>
                 <h3 className="text-2xl font-black text-white">2. 外部AI利用料</h3>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">
                   生成されたプロンプトを、ChatGPT等の**「無料枠」**で実行します。高額なAPI代をツール代金に上乗せしません。
                 </p>
                 <Badge className="bg-emerald-600 text-white border-0 font-black px-4 py-1 text-sm">基本 ￥0 (無料)</Badge>
               </div>
            </Card>

            {/* 3. Benefit (Icon 拡大) */}
            <Card className="bg-gradient-to-br from-indigo-900/40 to-[#1a1b23] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl group">
               <div className="space-y-6">
                 <div className="bg-amber-500/20 p-5 rounded-3xl w-fit text-amber-400 group-hover:scale-110 transition-transform shadow-inner">
                   <Sparkles className="h-10 w-10" /> {/* アイコン拡大 */}
                 </div>
                 <h3 className="text-2xl font-black text-white">究極のハイブリッド</h3>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">
                   数万円かかるAI開発を、NextraLabsがワンコイン価格で効率化。プロの知恵を格安で使い倒せる革新的なモデルです。
                 </p>
                 <p className="text-emerald-400 font-black italic tracking-widest text-lg border-t border-white/10 pt-4 mt-4">HYBRID ARCHITECTURE</p>
               </div>
            </Card>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-32">
         {/* ... ツールセクションは維持 ... */}
      </div>
    </div>
  )
}
