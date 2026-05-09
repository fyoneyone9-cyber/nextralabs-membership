'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, Heart, Zap, ChevronRight, Loader2, Copy, Sparkles, Search, ShieldCheck, Flame, BarChart3, Users2, MapPin, Target, LayoutGrid, Info, TrendingUp, ShoppingCart
} from 'lucide-react'

const WEAPONS = [
  { id: 'strategy', label: '心理×AI婚活戦略', desc: '上級心理カウンセラーの知見を統合', icon: Flame, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'diagnosis', label: '自分磨き診断', desc: '30問で強みと弱みを可視化', icon: BarChart3, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'profile', label: 'プロフィール添削', desc: '第一印象の9割をAIが変える', icon: UserCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'dating', label: 'デートプラン提案', desc: '場所から会話ネタまで網羅', icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

import { UserCircle } from 'lucide-react';

export default function AiKonkatsuCoach() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentWeapon = WEAPONS.find(w => w.id === activeWeapon);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-100 bg-[#050507] rounded-[3rem] md:rounded-[4rem] my-4">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-bold px-4 py-0.5 text-[10px] uppercase tracking-tight mb-2">Marriage Strategic MASTER</Badge>
        <h1 className="text-4xl md:text-8xl font-bold text-white uppercase tracking-tighter">AI 婚活コーチ</h1>
        <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-xs ">Nextra Intelligence Coaching Hub</p>
      </div>

      {/* 活用マニュアル */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-bold uppercase text-sm">使いかた・活用マニュアル</h3></div>
        <p className="text-sm text-slate-300 font-bold leading-relaxed ">
          相談したい悩みや、現在の状況を入力してください。上級心理カウンセラーの知見を学習したAIが、相手の深層心理を読み解き、あなたが「選ばれる」ための最短成婚ロードマップを策定します。
        </p>
      </div>

      <div className="bg-slate-900/50 border border-white/5 p-2 rounded-[2rem] shadow-2xl flex gap-2 overflow-x-auto scrollbar-hide max-w-5xl mx-auto">
        {WEAPONS.map((w) => (
          <button key={w.id} onClick={() => setActiveWeapon(w.id)} className={`flex-1 flex flex-col items-center justify-center py-4 px-4 rounded-2xl transition-all border-2 ${activeWeapon === w.id ? 'bg-emerald-600 border-emerald-400 scale-105 text-white' : 'bg-black/40 border-transparent text-slate-500 hover:text-white'}`}>
            <w.icon size={20} className={activeWeapon === w.id ? 'text-white' : w.color} />
            <span className="text-[10px] font-bold uppercase mt-1">{w.label}</span>
          </button>
        ))}
      </div>

      {activeWeapon && (
        <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
          <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white uppercase flex items-center gap-4">
                {currentWeapon && React.createElement(currentWeapon.icon, { className: 'text-emerald-400', size: 32 })}
                {currentWeapon?.label}
              </h3>
              <textarea 
                value={inputData} 
                onChange={(e) => setInputData(e.target.value)} 
                placeholder="悩みや現在の状況を入力してください..." 
                className="w-full h-48 bg-black border-2 border-white/10 rounded-2xl p-6 text-lg text-white font-bold focus:border-emerald-500 outline-none transition-all" 
              />
              <Button onClick={() => setIsProcessing(true)} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-2xl rounded-2xl shadow-xl uppercase ">
                {isProcessing ? <Loader2 className="animate-spin h-8 w-8" /> : 'AIコーチングを開始する 🚀'}
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight border-l-4 border-emerald-500 pl-4">Success Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', title: '深層心理分析', desc: '相手の行動の裏にある「本音」と「欲求」をAIが特定。', icon: Search },
                { step: '02', title: '自己改革', desc: '選ばれるための外見・内面・マインドの改善点を策定。', icon: Sparkles },
                { step: '03', title: '成婚アプローチ', desc: '次のデート、または告白に向けた具体的セリフと立ち回り。', icon: TrendingUp },
              ].map((s, i) => (
                <div key={i} className="bg-[#13141f] border border-white/10 p-8 rounded-3xl space-y-4">
                  <div className="flex justify-between items-start"><span className="text-xs font-bold text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                  <h4 className="text-lg font-bold text-white ">{s.title}</h4>
                  <p className="text-xs text-slate-400 font-bold ">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
              <Button key={ai} variant="outline" className="h-12 border-2 border-white/10 text-slate-400 font-bold uppercase hover:bg-white/5">{ai}</Button>
            ))}
          </div>

          <a href="https://www.marriage-road.jp/" target="_blank" className="block group">
            <div className="bg-gradient-to-r from-rose-600 to-pink-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-tight">Master Partner</p>
                <h3 className="text-2xl font-bold text-white ">AIを超えた「本物」の成婚サポート。マリッジロードジャパン ➔</h3>
              </div>
              <Heart size={40} className="text-white animate-pulse fill-white" />
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
