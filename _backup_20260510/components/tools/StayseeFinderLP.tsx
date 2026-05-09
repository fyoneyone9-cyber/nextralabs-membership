'use client'
import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Building2, Globe, AlertTriangle, Camera, Shield, Zap, Search, TrendingUp, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'

const StayseeFinderLP = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans pb-32 selection:bg-emerald-500/30 text-left">
      {/* ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 border-b border-emerald-500/20">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-[10px] tracking-widest italic">💎 MASTERMODEL</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
          Staysee <span className="text-emerald-500">AI</span> Finder
        </h1>
        <p className="text-xl md:text-2xl text-emerald-400 font-bold italic">宿泊予約・鍵発行を完全同期</p>
        <h2 className="text-lg md:text-xl font-bold text-slate-400 max-w-4xl mx-auto leading-relaxed px-4 italic">
          フロント業務を「ゼロ」にする、最強のホテルDXエンジン。<br className="hidden md:block" />
          PMS(Staysee)とスマートロックをAIで神経接続し、無人化・省人化を極限まで加速させます。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <ToolLaunchButton productId="staysee-ai-finder" className="h-24 px-16 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-[0_0_60px_rgba(16,185,129,0.4)] transition-all active:scale-95 uppercase italic" />
        </div>
      </section>

      {/* 悩み訴求セクション (本物化) */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight border-l-4 border-emerald-500 pl-6">現場の「不都合な真実」</h3>
            <ul className="space-y-4 text-slate-300 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 手動での鍵番号発行ミスと深夜の呼び出し</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 宿泊名簿の未記入・不鮮明な本人確認リスク</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> チェックイン待ちによるゲストの満足度低下</li>
            </ul>
          </div>
          <div className="bg-emerald-500/5 border-4 border-emerald-500/20 rounded-[3rem] p-12 shadow-inner">
            <p className="text-emerald-400 text-xl italic font-black text-center leading-loose">
              その「隠れた人件費」、<br />
              Nextra AI が完全自動化します。
            </p>
          </div>
        </div>
      </section>

      {/* 主要機能 (実務API連携の証明) */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">真のホテルDXを司る4機能</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {[
            { icon: <Globe size={32} />, title: 'PMSリアルタイム同期', desc: 'Staysee等の予約データをAIが監視。予約確定と同時にチェックイン用QRを自動発行。' },
            { icon: <Shield size={32} />, title: 'AI本人確認プロトコル', desc: '身分証のスキャンから顔認証までをAIが完結。法的な宿泊名簿をデジタルで即座に作成。' },
            { icon: <Zap size={32} />, title: 'スマートロック自動連携', desc: 'RemoteLockやSwitchBotへ解錠コードを自動転送。ゲストへ鍵番号を自動通知。' },
            { icon: <ShoppingCart size={32} />, title: '収益最大化エンジン', desc: 'チェックイン時の追加オプション購入や、周辺店舗のアフィリエイト提案をAIが自動化。' },
          ].map((f, i) => (
            <div key={i} className="bg-[#13141f] border-2 border-white/5 p-12 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all shadow-xl group">
              <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h4 className="text-2xl font-black text-white italic uppercase">{f.title}</h4>
              <p className="text-slate-400 font-bold leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 導入ロードマップ (憲法遵守) */}
      <section className="py-24 bg-black/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-black text-white italic uppercase tracking-widest text-center mb-16">Implementation Roadmap</h3>
          <div className="grid md:grid-cols-3 gap-8">
             {[{ step: '01', title: 'システム連結', desc: 'Staysee APIキーを登録し、予約データの同期設定を完了。', icon: Search }, { step: '02', title: 'デバイス接続', desc: 'スマートロックを認証。解錠コードの自動発行プロトコルを起動。', icon: Shield }, { step: '03', title: 'フロント完全無人化', desc: 'タブレット一台でチェックインから鍵受け渡しまでを完全自動化。', icon: TrendingUp }].map((s, i) => (
              <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4">
                <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                <h4 className="text-xl font-black text-white italic">{s.title}</h4>
                <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 外部リンク (憲法遵守) */}
      <section className="max-w-4xl mx-auto px-4 py-20 space-y-8">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center italic">Strategic External Partners</p>
        <div className="grid grid-cols-3 gap-4">
          {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
            <Button key={ai} variant="outline" className="h-16 border-2 border-white/5 bg-[#13141f] text-slate-400 font-black italic rounded-2xl hover:text-white hover:border-emerald-500 transition-all uppercase" onClick={() => window.open(`https://${ai.toLowerCase()}.com`)}>Analyze with {ai}</Button>
          ))}
        </div>
      </section>

      {/* 収益化CTA */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="relative z-10 space-y-8">
            <h3 className="text-4xl md:text-7xl font-black text-white italic uppercase leading-none tracking-tighter">現場をAIに任せ、<br/>あなたは「おもてなし」へ。</h3>
            <ToolLaunchButton productId="staysee-ai-finder" className="h-24 px-16 bg-white text-emerald-900 font-black text-3xl rounded-[2rem] shadow-xl hover:scale-105 transition-all active:scale-95" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default StayseeFinderLP
