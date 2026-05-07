import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Shield, Zap, Wallet, Camera, AlertTriangle, ArrowRight, Brain } from 'lucide-react'
import Link from 'next/link'

const MoneyLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-6 py-1 rounded-full font-black uppercase text-xs">Psychological Defense OS</Badge>
        <h1 className="text-4xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          AI家計防衛<span className="text-red-600">シミュレーター</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
          「今、本当に必要ですか？」<br className="hidden md:block" />
          AIがあなたのドーパミンを抑止する。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/money-guard">
            <button className="h-20 px-12 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all active:scale-95 uppercase italic">
              家計を防衛する ➔
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight text-left text-left">その買い物、後悔しませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> ストレス解消のために「ポチる」のが癖になっている</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> セールの文字を見ると、必要ないものまで買ってしまう</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 月末になると何にお金を使ったか分からなくなる</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-red-500 text-lg italic font-black text-center leading-loose">
               AIが「客観的な第三者」として<br/>
               あなたの財布の紐を締め直します。
             </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">Defense Technology</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">心理学とAIが融合した3つの防衛線</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Camera size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">ビジュアル・スキャン</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">レシートや商品画像をAIが即座に解析。何にいくら払おうとしているかを視覚的に把握します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Brain size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">心理的弱点の特定</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「なぜこれを欲しいと思ったのか」という心理的要因をAIが分析。衝動の裏側を言語化します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Shield size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">強力な抑止アラート</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">無駄遣いの可能性が高い場合、画面が「警告モード」へ移行。冷静さを取り戻すまで購入を許可しません。</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-red-600 to-rose-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Wallet size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Secure Your Future.</h3>
            <p className="text-red-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4">
              一時的な快楽よりも、将来の資産を。Nextra AIがあなたの資産防衛をサポートします。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-red-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 uppercase italic">
                  Start Defense Sequence
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MoneyLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function MoneyLp() {
  return <NoSSRWrapper />
}
