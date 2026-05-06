import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Rocket, Zap, Target, Briefcase, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const SidejobLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-[#5845e0]/10 text-[#5845e0] border-[#5845e0]/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">Sidejob Automation OS</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          AI副業<span className="text-[#5845e0]">スタートダッシュ</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          「稼げる自分」への最短ルート。<br className="hidden md:block" />
          AI診断 ＋ 成功ロードマップ作成システム。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/ai-sidejob/app">
            <button className="h-20 px-12 bg-[#5845e0] hover:bg-[#6c5ae6] text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(88,69,224,0.3)] transition-all active:scale-95 uppercase italic">
              無料で副業を診断する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">副業、何から始めればいいか迷っていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 自分に何のスキルがあるか分からない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 始めてみたが、1円も稼げずに挫折した</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 高額なスクールや教材を買うのが怖い</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 会社にバレないか、税金はどうすればいいか不安</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-[#5845e0]/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-[#5845e0] text-lg italic font-black leading-loose">
               AIがあなたの現状を精密に分析し、<br/>
               迷いなき一本道のロードマップを引きます。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Success Framework</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">収益化を科学する4つのインテリジェンス</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0]"><Target size={32} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">特性・生活環境スキャン</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">スキルだけでなく、週に取れる時間や本業の規則、PC環境までをAIが把握。現実的に継続可能な副業を導き出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0]"><Zap size={32} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">即金アクション提案</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「まず今週1万円稼ぐ」ための即金性のある作業を具体的に指示。成功体験を最速で積むことが挫折を防ぎます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0]"><Rocket size={32} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">0→1ロードマップ錬成</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">目標月収に向けた3ヶ月の手順書をAIが作成。どのツールを使い、どう単価を上げるか、一歩ずつ導きます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0]"><ShieldCheck size={32} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">マネー・ディフェンス知識</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">確定申告の20万円ルール、住民税の注意点、会社にバレない対策など、稼ぐ前に知っておくべき防御策を網羅。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-[#5845e0] to-[#2d1b94] border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Briefcase size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Launch Your Career.</h3>
            <p className="text-indigo-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4">
              AIはあなたの仕事を奪うものではなく、あなたの収入を増やすための最強の「武器」です。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-[#5845e0] font-black text-2xl rounded-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-95 uppercase italic leading-none">
                  Start Dash Now
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(SidejobLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function SidejobLp() {
  return <NoSSRWrapper />
}
