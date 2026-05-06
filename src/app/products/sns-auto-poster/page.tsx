import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Share2, Zap, Send, TrendingUp, Search, ArrowRight, MessageSquareText, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'SNSオートポスター | トレンド×戦略でバズを量産するマルチSNS生成OS | NextraLabs',
  description: '最新トレンドと10種類の強力な投稿戦略をAIが融合。X、Instagram、TikTok向けの最適なコンテンツを秒速で錬成。インプレッションを科学する最強のSNSエンジン。',
  keywords: ['SNS 自動投稿', 'バズる文章 AI', 'Twitter 運用 AI', 'インスタ キャプション 作成', 'SNS マーケティング AI'],
}

export default function SnsPosterLp() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-6 py-1 rounded-full font-black uppercase text-xs">Viral Engagement OS</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          SNS <span className="text-rose-500">Auto</span> Poster
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed">
          バズは「偶然」ではなく「科学」だ。<br className="hidden md:block" />
          最新トレンド ＋ 10種のバズ戦略エンジン。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/sns-auto-poster/app">
            <button className="h-20 px-12 bg-rose-600 hover:bg-rose-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.3)] transition-all active:scale-95 uppercase italic">
              最強の投稿を錬成する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">SNS運用、疲弊していませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><Send className="text-red-500 shrink-0" /> 毎日投稿するネタが見つからない</li>
              <li className="flex items-center gap-4"><Send className="text-red-500 shrink-0" /> 投稿しても「いいね」や「リポスト」が増えない</li>
              <li className="flex items-center gap-4"><Send className="text-red-500 shrink-0" /> 各媒体の特性に合わせたリライトが重労働</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-rose-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-rose-400 text-lg italic font-black text-center leading-loose">
               AIが「今の流行」と「深層心理」を分析。<br/>
               あなたが寝ている間もバズを設計します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">Buzz Intelligence</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">インプレッションを支配する4つの武器</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500"><TrendingUp /></div>
            <h4 className="text-xl font-black text-white uppercase italic">リアルタイム・トピックス</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">今まさに日本で盛り上がっているトピックスをAIが常時監視。鮮度の高い「今すぐ投稿すべきネタ」を提供します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500"><Zap /></div>
            <h4 className="text-xl font-black text-white uppercase italic">10種の動画戦略パレット</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「暴露」「有益Tips」「エモ」「対立」など、SNS心理学に基づく10種類の戦略パーツを自在に組み合わせて投稿を錬成。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500"><Share2 /></div>
            <h4 className="text-xl font-black text-white uppercase italic">マルチ媒体ワンクリック生成</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">X、Instagram、TikTok、Threads。各SNSのアルゴリズムに最適化された文章・構成案を一括で作成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500"><CheckCircle2 /></div>
            <h4 className="text-xl font-black text-white uppercase italic">バズり期待度スコアリング</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">完成した投稿案をAIが事前審査。バズる確率（Buzz Score）を算出し、公開前の最終チェックを行います。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-rose-600 to-red-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Share2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Dominate the Feed.</h3>
            <p className="text-rose-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              あなたの発信力に、AIという名のブースターを。SNSオートポスターで、影響力の新次元へ。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-rose-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-rose-50 transition-all active:scale-95 uppercase italic">
                  Launch Booster
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
