import React from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Sofa, Zap, Search, ArrowRight, ShoppingCart, Palette, Box, Globe, Smartphone, Play } from 'lucide-react'
import Link from 'next/link'

const InteriorLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">Spatial AI Coordinator</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          Interior <span className="text-teal-500">Sync</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          空間をAIがプロファイリング。<br className="hidden md:block" />
          「今の部屋」に調和する家具を楽天からセット提案。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/interior-coordinator/app">
            <button className="h-20 px-12 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(20,184,166,0.3)] transition-all active:scale-95 uppercase ">
              空間をスキャンする ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">家具選び、疲れていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><Box className="text-red-500 shrink-0" /> ショップで見るといいのに、家に置くと「何かが違う」</li>
              <li className="flex items-center gap-4"><Box className="text-red-500 shrink-0" /> 今の壁紙や床の色に合う家具を一つずつ探すのが大変</li>
              <li className="flex items-center gap-4"><Box className="text-red-500 shrink-0" /> サイズ感がわからず、購入に踏み切れない</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-teal-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-teal-400 text-lg font-bold leading-loose">
               AIが「空間のバイブス」を数値化。<br/>
               一瞬で完璧なコーディネートを完成させます。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">Spatial Intelligence</h3>
          <p className="text-slate-500 font-bold uppercase text-center">理想の部屋を叶える4つのマスタ技術</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-teal-500/30 transition-all group">
            <div className="w-16 h-12 bg-teal-600/10 rounded-2xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><Smartphone size={32} /></div>
            <h4 className="text-2xl font-bold text-white uppercase">リアルタイムARスキャン</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm">スマホをかざすだけ。AIが部屋の広さ、既存家具の色調、照明の状態を視覚的にプロファイリングします。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-teal-500/30 transition-all group">
            <div className="w-16 h-12 bg-teal-600/10 rounded-2xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><Palette size={32} /></div>
            <h4 className="text-2xl font-bold text-white uppercase">スタイル適合エンジニアリング</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm">「北欧モダン」「サイバーパンク」など、空間の方向性をAIが決定。適合率90%以上のアイテムを厳選します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-teal-500/30 transition-all group">
            <div className="w-16 h-12 bg-teal-600/10 rounded-2xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><ShoppingCart size={32} /></div>
            <h4 className="text-2xl font-bold text-white uppercase">楽天市場・一括同期</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm">楽天のリアルな在庫データからアイテムを抽出。そのまま丸ごとセットで購入可能なシームレス動線を構築。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-teal-500/30 transition-all group">
            <div className="w-16 h-12 bg-teal-600/10 rounded-2xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform"><Globe size={32} /></div>
            <h4 className="text-xl font-bold text-white uppercase">マルチデバイス対応</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm">スマホ、タブレット、PC。どの環境からも同じ精度で空間分析が可能。あなたの「今」をマスタ化します。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-teal-600 to-emerald-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Sofa size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter text-center leading-none">Sync Your Living.</h3>
            <p className="text-teal-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              家具選びに「失敗」という言葉はもういりません。Interior Syncで、あなたの空間に究極の調和を。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-teal-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-teal-50 transition-all active:scale-95 uppercase leading-none">
                  Activate Sync Node
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(InteriorLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function InteriorCoordinatorLp() {
  return <NoSSRWrapper />
}
