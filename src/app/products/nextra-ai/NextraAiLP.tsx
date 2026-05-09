'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Building2, Globe, AlertTriangle, Camera, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

const NextraAiLP = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs">宿泊業界特化型 AIソリューション</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          Nextra <span className="text-emerald-500">AI</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
          忘れ物対応を「コスト」から「利益と信頼」へ。<br className="hidden md:block" />
          AIが即座に鑑定・証明書発行・連絡文を生成。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/nextra-ai/app">
            <button className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase ">
              今すぐ試す ➔
            </button>
          </Link>
        </div>
      </section>

      {/* 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center text-left">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">こんな課題、ありませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 客室の忘れ物、持ち主の特定に時間がかかる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 電話での特徴説明が曖昧でミスが起きやすい</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 着払い発送の事務作業が煩雑で工数がかかる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 宿泊者との「言った言わない」のトラブル</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
            <p className="text-red-400 text-lg font-bold text-center leading-loose">
              その「隠れた赤字業務」、<br />
              Nextra AI が完全自動化します。
            </p>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">主要な4つの機能</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {[
            { icon: <Camera size={32} />, title: 'AIプロ鑑定', desc: 'AIが物品の種類、ブランド、状態ランクを詳細に言語化。誰でもプロの鑑定が可能に。' },
            { icon: <Globe size={32} />, title: '予約システム連携', desc: '宿泊管理システムと完全同期。昨日その部屋にいたお客様を瞬時にリストアップ。' },
            { icon: <Shield size={32} />, title: 'AI保管証明書', desc: '公式な管理番号付きの鑑定書を自動発行。宿泊者への送付で圧倒的な信頼を提供。' },
            { icon: <Zap size={32} />, title: '収益化エンジン', desc: 'AIが送料や手数料を自動算出。お土産同梱（アップセル）までAIが提案します。' },
          ].map((f, i) => (
            <div key={i} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all shadow-xl group">
              <div className="w-16 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h4 className="text-2xl font-bold text-white uppercase">{f.title}</h4>
              <p className="text-slate-400 font-bold leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Building2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">最高峰のマスタモデルを。</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4">
              今すぐNextraLabsに参加して、あなたのホテルのホスピタリティをAIでマスタ化しましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/products/nextra-ai/app">
                <button className="h-20 px-16 bg-white text-emerald-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 uppercase leading-none">
                  ツールを使ってみる
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default NextraAiLP
