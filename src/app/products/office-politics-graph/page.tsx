import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  Network,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Layout,
  Users,
  Eye,
  TrendingUp
} from 'lucide-react'

export const metadata: Metadata = {
  title: '社内政治 AI相関図 | 組織の歪みを可視化し、最適な立ち回りをプランニング - NextraLabs',
  description: '組織内のパワーバランス、派閥、深層心理の繋がりをAIが可視化。NextraLabsの社内政治AIが、あなたが損をしないための戦略ロードマップを即座に生成します。',
}

const features = [
  {
    icon: Eye,
    title: '見えない派閥を可視化',
    description: '入力されたパワーバランスから、水面下の派閥構造をAIが独自のアルゴリズムで特定。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: TrendingUp,
    title: '戦略ロードマップ',
    description: '単なる図解ではなく、現状分析から地雷回避、影響力掌握までの具体的行動指針を提示。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: ShieldCheck,
    title: '不敗の立ち回り',
    description: '組織心理学に基づいたAIのアドバイスにより、人間関係のリスクを最小化し、利益を最大化。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  }
]

export default function OfficePoliticsPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-20 font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
        <div className="container mx-auto px-4 relative text-center max-w-5xl">
          <Link href="/products" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> ツール一覧に戻る
          </Link>

          <div className="space-y-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-black tracking-widest uppercase">💎 MASTERMODEL</Badge>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-none">OFFICE POLITICS AI</h1>
            <p className="text-xl md:text-2xl text-emerald-400 font-bold italic">組織の歪みを可視化 × 不敗の戦略</p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
              「誰が本当の権力者か」「どこに地雷があるのか」。
              組織内の複雑な人間関係をAIが冷徹に分析し、あなたの<span className="text-white font-bold">最短攻略ロードマップ</span>を策定します。
            </p>

            <div className="flex justify-center gap-6 pt-6">
              <ToolLaunchButton productId="office-politics-graph" className="h-24 px-16 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.4)] transition-all uppercase italic active:scale-95" />
            </div>
          </div>
        </div>
      </section>

      {/* Constraints */}
      <section className="py-16 bg-black/40 border-b border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Info className="h-6 w-6 text-emerald-500" />
            <h2 className="text-2xl font-black text-white italic uppercase">Nextra利用規約に基づく制限</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[{ p: '無料', c: '会員登録必須', d: '体験利用' }, { p: 'ライト', c: '1回/日', d: '全ツール合計' }, { p: 'スタンダード', c: '2回/日', d: '全ツール合計' }, { p: 'プレミアム', c: '3回/日', d: '全ツール合計' }].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{item.p} Plan</p>
                <p className="text-xl font-black text-white italic">{item.c}</p>
                <p className="text-[8px] text-emerald-400 font-bold uppercase">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-[#13141f] border border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/50 transition-all shadow-xl">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${f.color}`}><f.icon size={28} /></div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{f.title}</h3>
              <p className="text-slate-400 font-bold text-sm leading-relaxed italic">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-8 text-center flex flex-col items-center">
            <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase leading-none tracking-tighter">不敗の立ち回りを、<br/>今すぐAIと。</h2>
            <ToolLaunchButton productId="office-politics-graph" className="h-20 px-12 bg-white text-emerald-900 font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all" />
          </div>
        </div>
      </section>
    </div>
  )
}
