import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Youtube, FileVideo, FileText, Zap, Sparkles, ArrowRight, Play, Scissors, Type, Music, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'AI YouTubeプロデューサー | 戦略パーツでバズる動画台本を全自動生成 | NextraLabs',
  description: '10種類の最強「動画戦略パレット」を搭載。AIが動画のヒットを科学し、台本構成からサムネイル設計、SEO、BGM指示までを一本道UIで完結させます。',
  keywords: ['YouTube 台本 AI', '動画制作 効率化', 'YouTube 運用 代行', 'バズる動画 構成', 'AI 動画プロデューサー'],
}

export default function YoutubeProducerLp() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-red-600/10 text-red-500 border-red-500/20 px-6 py-1 rounded-full font-black uppercase text-xs">Viral Content OS</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          AI YouTube<br/><span className="text-red-600">Producer</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed">
          「なんとなく」で動画を作る時代は終わった。<br className="hidden md:block" />
          プロの戦略をAIで完全自動化。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/youtube-producer/app">
            <button className="h-20 px-12 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all active:scale-95 uppercase italic">
              最強の台本を錬成する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">動画が伸びない「本当の理由」</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 企画と台本構成が「自己満足」になっている</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 視聴者が離脱しない「勝ちパターン」を知らない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 制作に時間がかかりすぎて継続できない</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-red-500 text-lg italic font-black text-center leading-loose">
               YouTubeの「科学」をAIが代行。<br/>
               あなたはポチポチ選ぶだけです。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Master Production OS</h3>
          <p className="text-slate-500 font-bold uppercase italic">バズを量産するための4大機能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Zap /></div>
            <h4 className="text-xl font-black text-white uppercase italic">10種の動画戦略パレット</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「衝撃・暴露」「徹底解説」「ルーティン」等、YouTubeの歴史が証明した勝てる戦略をボタン一つで適用。AIが離脱されない構成を組み上げます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Scissors /></div>
            <h4 className="text-xl font-black text-white uppercase italic">視覚・サウンド一括設計</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">台本から「登場人物プロンプト」や「BGM指示文」を自動抽出。クリエイティブの指示出し工数をゼロにします。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Play /></div>
            <h4 className="text-xl font-black text-white uppercase italic">一本道UI（ステップ・バイ・ステップ）</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">①文字起こし ➔ ②台本作成 ➔ ③視覚設計 ➔ ④SEO。番号順に進めるだけで、プロレベルの企画書が完成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Sparkles /></div>
            <h4 className="text-xl font-black text-white uppercase italic">Viral Score 自動計測</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">完成した台本をAIが即座に採点。バズる可能性をパーセンテージで可視化し、公開前の企画をブラッシュアップします。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-red-600 to-orange-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Youtube size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Dominate the Algorithm.</h3>
            <p className="text-orange-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              個人の時代だからこそ、AIプロデューサーを。あなたの才能を、最大効率で世界へ届けます。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-red-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 uppercase italic">
                  Launch Command Center
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
