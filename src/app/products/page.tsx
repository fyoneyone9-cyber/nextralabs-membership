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

// ... ProductCard定義 ...

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-40 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-24 text-center">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/10 mb-8">Catalogue</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight">AIを、日常のパートナーに。</h1>
        
        {/* 🛠️ 【修正】物理的な巨大空白：h-32 (約128px) を強制挿入 */}
        <div className="h-24 md:h-32" />

        {/* 💰 料金の仕組み（上下にゆとりを持たせた設計） */}
        <div className="max-w-5xl mx-auto space-y-16 py-12">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px bg-white/10 flex-1" />
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] italic">Architecture & Transparency</h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <Card className="bg-[#1a1b23] border border-white/5 p-12 rounded-[3rem] shadow-2xl transition-all hover:border-blue-500/30">
               <div className="space-y-6">
                 <div className="bg-blue-600/20 p-5 rounded-3xl w-fit text-blue-400 shadow-inner"><CreditCard className="h-10 w-10" /></div>
                 <h3 className="text-2xl font-black text-white">1. システム利用料</h3>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">全機能へのアクセス権。最強のプロンプトと、迷わず完遂できる「一本道UI」を提供します。</p>
                 <Badge className="bg-blue-600 text-white border-0 font-black px-5 py-2">月額 ￥980〜</Badge>
               </div>
            </Card>
            <Card className="bg-[#1a1b23] border border-white/5 p-12 rounded-[3rem] shadow-2xl transition-all hover:border-emerald-500/30">
               <div className="space-y-6">
                 <div className="bg-emerald-600/20 p-5 rounded-3xl w-fit text-emerald-400 shadow-inner"><Coins className="h-10 w-10" /></div>
                 <h3 className="text-2xl font-black text-white">2. 外部AI利用料</h3>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">生成されたプロンプトをChatGPT等の「無料枠」で実行。高額なAPI代を上乗せしません。</p>
                 <Badge className="bg-emerald-600 text-white border-0 font-black px-5 py-2">基本 ￥0 (無料)</Badge>
               </div>
            </Card>
            <Card className="bg-gradient-to-br from-indigo-900/40 to-[#1a1b23] border border-white/10 p-12 rounded-[3rem] shadow-2xl">
               <div className="space-y-6">
                 <div className="bg-amber-500/20 p-5 rounded-3xl w-fit text-amber-400 shadow-inner"><Sparkles className="h-10 w-10" /></div>
                 <h3 className="text-2xl font-black text-white">究極のハイブリッド</h3>
                 <p className="text-slate-400 text-base leading-relaxed font-medium">数万円かかる開発コストをNextraLabsが効率化。プロの知恵を格安で使い倒せる革新的モデル。</p>
                 <p className="text-emerald-400 font-black italic tracking-[0.2em] text-lg border-t border-white/5 pt-6 mt-4">HYBRID ARCH</p>
               </div>
            </Card>
          </div>
        </div>

        {/* 🛠️ 【修正】次のセクションまでも大きな空白：h-32 */}
        <div className="h-24 md:h-32" />
      </div>

      {/* ここから全22ツールを配置... */}
      <div className="max-w-7xl mx-auto px-4 space-y-40 mt-20">
         {/* 🆓 FREE TOOLS FIRST... */}
      </div>
    </div>
  )
}
