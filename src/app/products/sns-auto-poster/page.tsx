import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Share2, Zap, Send, TrendingUp, Search, ArrowRight, MessageSquareText, ShieldCheck, AlertTriangle, HeartHandshake } from 'lucide-react'
import Link from 'next/link'

const SnsPosterLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">SNSバズ量産エンジン</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          SNS <span className="text-rose-500">Auto</span> Poster
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          バズは「偶然」ではなく「科学」だ。<br className="hidden md:block" />
          最新トレンド ＋ 10種のバズ戦略エンジン。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/sns-auto-poster/app">
            <button className="h-20 px-12 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.3)] transition-all active:scale-95 uppercase leading-none">
              最強の投稿を錬成する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">SNS運用、疲弊していませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 毎日投稿するネタが見つからない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 投稿しても「いいね」や「リポスト」が増えない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 各媒体の特性に合わせたリライトが重労働</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-rose-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-rose-400 text-lg font-bold leading-loose text-center">
               AIが「今の流行」と「深層心理」を分析。<br/>
               あなたが寝ている間もバズを設計します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">インプレッションを支配する技術</h3>
          <p className="text-slate-500 font-bold uppercase text-center">SNSの影響力を最大化する4つの武器</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><TrendingUp size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">リアルタイム・トピックス</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">今まさに日本で盛り上がっているトピックスをAIが常時監視。鮮度の高い「今すぐ投稿すべきネタ」を提供します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Zap size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">10種のバズ戦略パレット</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">「暴露」「有益Tips」「エモ」「対立」など、SNS心理学に基づく10種類の戦略パーツを自在に組み合わせて投稿を錬成。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Share2 size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left">マルチ媒体一括生成</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left">X、Instagram、TikTok、Threads。各SNSのアルゴリズムに最適化された文章・構成案を一括で作成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><HeartHandshake size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left text-left">結婚相談所特化モード</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left">マリッジロードジャパンの知見を完全同期。心理学に基づいた成婚戦略・婚活Tips投稿を瞬時に生成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><CheckCircle2 size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left text-left">AIバズ期待度計測</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left">完成した投稿案をAIが事前審査。バズる確率（Buzz Score）を算出し、公開前の最終チェックを行います。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-rose-600 to-red-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Share2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none">影響力の、新次元へ。</h3>
            <p className="text-rose-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              あなたの発信力に、AIという名のブースターを。SNSオートポスターで、あなたの声を世界へ届けましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-rose-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-rose-50 transition-all active:scale-95 uppercase leading-none">
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

const NoSSRWrapper = dynamic(() => Promise.resolve(SnsPosterLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function SnsAutoPosterLp() {
  return <NoSSRWrapper />
}
