import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Scale, Zap, ShoppingBag, Search, ArrowRight, ShieldCheck, AlertTriangle, TrendingDown } from 'lucide-react'
import Link from 'next/link'

const BuySmartLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">Market Value Intelligence</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          中古・新品<br/><span className="text-emerald-500">比較ナビ</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          損得勘定の「正解」をAIが出す。<br className="hidden md:block" />
          楽天・ラクマ・Google検索を瞬時に一括照合。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
          <Link href="/products/buy-smart-nav/app">
            <button className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all active:scale-95 uppercase leading-none">
              損得を判定する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">「もっと安く買えたかも」と後悔したことは？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 新品を買った直後に、極美品の中古が半額で出ているのを見つけた</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> ポイント還元を含めた「実質価格」の計算が面倒</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> フリマサイトの相場が分からず、高い買い物をした</li>
            </ul>
          </div>
          <div className="bg-black/50 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-emerald-400 text-lg font-bold leading-loose text-left">
               AIが複数の市場を同時にパトロール。<br/>
               あなたが今選ぶべき「本物の賢い選択」を提示します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">Smart Purchase OS</h3>
          <p className="text-slate-500 font-bold uppercase text-center">買い物を科学する4つのインテリジェンス</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Search size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">全市場一括クロール</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">Google検索、楽天市場、楽天ラクマ。主要な購入チャネルをAIが瞬時に横断検索。隠れた最安値を逃しません。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Scale size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">損得勘定 AI JUDGMENT</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">単なる価格比較ではなく「状態・送料・ポイント・将来価値」を総合的にスコアリング。今どちらを買うべきか結論を出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><TrendingDown size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left">将来価値リセール予測</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">「今買っておけば、半年後でも〇〇円で売れる」というリセールバリューまで考慮した、投資的な買い物をサポート。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><ShieldCheck size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left text-left pl-0">フリマ・リスク判定</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">中古品のコンディションや出品者の評価をAIがスキャン。安さの裏にあるリスクを事前に警告します。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center text-center">
        <Card className="bg-gradient-to-br from-emerald-600 to-slate-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Scale size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter text-center leading-none">Smart Used or New?</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center text-center">
              買い物の「失敗」を、AIでゼロに。中古・新品比較ナビで、あなたの資産価値を最大化させましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-emerald-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 uppercase leading-none">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(BuySmartLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function BuySmartNavLp() {
  return <NoSSRWrapper />
}
