import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Store, Shirt, Zap, Rocket, ShoppingCart, ArrowRight, TrendingUp, Palette, Box, Package, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const SelectShopLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">次世代EC・無在庫物販OS</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          AI <span className="text-teal-500">Select</span> Shop
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          リスクを捨て、センスを売る。<br className="hidden md:block" />
          トレンド分析 ＋ 自動出品システム。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/ai-select-shop/app">
            <button className="h-20 px-12 bg-teal-600 hover:bg-teal-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(20,184,166,0.3)] transition-all active:scale-95 uppercase italic">
              自分のショップを立ち上げる ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">物販ビジネス、諦めていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 大量の在庫を抱えるのが怖い（赤字リスク）</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> デザインのスキルがなく、外注費も高い</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 梱包や発送作業が面倒で続けられない</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-teal-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-teal-400 text-lg italic font-black text-center leading-loose">
               Nextra AIが流行を読み、<br/>
               1クリックで世界中へ販売します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">自動化を支える4つの技術</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">在庫ゼロ物販を実現するテクノロジー</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">リアルタイム・トレンド解析</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">今、日本で何が検索され、何が売れているのか。Googleトレンドから「売れるキーワード」をAIが自動抽出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><Palette size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">AIスタイル・ジェネレーター</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">和風、ストリート、サイバーパンクなど多彩なスタイルから選択。AIがキーワードに合わせた独自のグラフィックを生成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><Rocket size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">Shopify 1クリック出品</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">デザインから出品までをNextraLabs内で完結。ボタン一つでShopifyストアへ掲載され、すぐに販売を開始できます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><Package size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">完全自動の注文・発送連携</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">注文が入ったら自動で印刷・梱包・発送。あなたは在庫を持つ必要も、伝票を書く必要もありません。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-teal-600 to-emerald-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Store size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">あなたのブランドを、今ここから。</h3>
            <p className="text-teal-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              あなたのアイデアが、価値ある商品に変わる瞬間。AIセレクトショップで、新しい物販の形を始めましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-teal-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-teal-50 transition-all active:scale-95 uppercase italic leading-none">
                  無料で始めてみる
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(SelectShopLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function SelectShopLp() {
  return <NoSSRWrapper />
}
