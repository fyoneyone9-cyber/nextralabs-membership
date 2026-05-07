import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Shield, Zap, Building2, Search, ArrowRight, LineChart, TrendingUp, BarChart3, Globe } from 'lucide-react'
import Link from 'next/link'

const CompPriceLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">Revenue Management OS</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          競合価格<span className="text-blue-500">監視</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          周辺宿の「今」をAIが監視。<br className="hidden md:block" />
          最適な販売価格をステイシーへ自動提案。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
          <Link href="/products/comp-price-monitor">
            <button className="h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-95 uppercase italic leading-none">
              価格最適化を開始する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">価格設定で損をしていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4 text-red-500"><Search className="shrink-0" /> 毎日楽天トラベルで競合の価格を手動チェックするのが大変</li>
              <li className="flex items-center gap-4 text-red-500"><Search className="shrink-0" /> 周辺イベントによる需要の高まりに気づかず、安売りしてしまった</li>
              <li className="flex items-center gap-4 text-red-500"><Search className="shrink-0" /> 適切なADR（客室単価）がわからず、機会損失が出ている</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-blue-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-blue-400 text-lg italic font-black leading-loose text-left">
               AIが周辺宿の価格を24時間パトロール。<br/>
               あなたは「提案」を確認し、ステイシーを更新するだけです。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4 text-center">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">Yield Intelligence</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">収益を最大化する4つのコア技術</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Globe size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">楽天API・リアルタイム監視</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">楽天市場（楽天トラベル）の膨大な宿泊データを活用。周辺競合の空室状況と販売価格をリアルタイムにスキャンします。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Zap size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">需給バランスAI解析</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">「今売るべき価格」をAIが科学。トレンド、季節性、近隣イベント、自館の現在価格をクロス分析します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><LineChart size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic text-left">ステイシー更新指示</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">「価格カレンダーの〇〇円への更新」「特定プランの売止」など、Staysee（ステイシー）で行うべき具体的なアクションをAIが指示します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><BarChart3 size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic text-left text-left pl-0">機会損失の最小化</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">自館の在庫状況に応じたダイナミックプライシングを実現。満室時の単価アップと、空室時の集客を最適化します。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center text-center">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Building2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter text-center leading-none">Optimize Your Revenue.</h3>
            <p className="text-blue-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center text-center">
              根拠ある価格設定で、宿の収益をマスタ化する。競合価格監視で、戦略的なレベニューマネジメントを今すぐ始めましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-blue-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 uppercase italic leading-none">
                  無料で使ってみる
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(CompPriceLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function CompPriceMonitorLp() {
  return <NoSSRWrapper />
}
