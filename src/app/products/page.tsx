import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon, Info, Lock, Coins, CreditCard, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs',
  description: 'NextraLabsの全てのAIツール。無料ツールからプロ仕様のB2Bツールまで網羅。',
}

// ... 以前のProductCard等の定義は維持 ...

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-24 space-y-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">NextraLabs Catalogue</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">AIを、日常のパートナーに。</h1>
        
        {/* 💰 料金の仕組み：徹底解説パネル */}
        <div className="max-w-5xl mx-auto mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest italic">Our Pricing Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* 1. NextraLabs Sub */}
            <Card className="bg-slate-900 border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <div className="bg-blue-600/20 p-3 rounded-2xl w-fit text-blue-400"><CreditCard /></div>
                 <h3 className="text-xl font-black text-white">1. システム利用料</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   NextraLabsの全ツールへのアクセス権です。AIを使いこなすための「最強のプロンプト」と「一本道UI」を提供します。
                 </p>
                 <Badge className="bg-blue-600 text-white border-0 font-black">月額 ￥980〜</Badge>
               </div>
            </Card>

            {/* 2. External AI Free Tier */}
            <Card className="bg-slate-900 border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <div className="bg-emerald-600/20 p-3 rounded-2xl w-fit text-emerald-400"><Coins /></div>
                 <h3 className="text-xl font-black text-white">2. 外部AI利用料</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   生成されたプロンプトを、ChatGPTやClaudeの**「無料枠」**で実行します。高額なAPI代を払う必要はありません。
                 </p>
                 <Badge className="bg-emerald-600 text-white border-0 font-black">基本 ￥0 (無料)</Badge>
               </div>
            </Card>

            {/* 3. Benefit */}
            <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border-white/10 p-8 rounded-[2rem] shadow-2xl">
               <div className="space-y-4">
                 <div className="bg-amber-500/20 p-3 rounded-2xl w-fit text-amber-400"><Sparkles /></div>
                 <h3 className="text-xl font-black text-white">圧倒的な低コスト</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   本来なら数万円かかるAI開発・運用コストを、NextraLabsが効率化。プロの知恵を格安で使い倒せます。
                 </p>
                 <div className="flex items-center gap-1 text-emerald-400 font-black italic text-lg">HYBRID MODEL</div>
               </div>
            </Card>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-32">
         {/* ... 以前の無料ツール、ホテルツール等のセクションを維持 ... */}
      </div>
    </div>
  )
}
