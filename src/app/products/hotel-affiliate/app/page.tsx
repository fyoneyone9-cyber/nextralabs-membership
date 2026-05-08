'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingBag, 
  Network, Globe, Copy, Settings, Share2, Facebook, Twitter, Instagram
} from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'

export default function HotelAffiliateApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [hotelUrl, setHotelUrl] = useState('')
  const [affiliateId, setAffiliateId] = useState('nextralabs-22') // デフォルトID固定
  const [showSettings, setShowSettings] = useState(false)
  const [affiliateData, setAffiliateData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('nextra_rakuten_id')
    if (saved) setAffiliateId(saved)
  }, [])

  const saveSettings = () => {
    localStorage.setItem('nextra_rakuten_id', affiliateId)
    setShowSettings(false)
    alert('ID設定を更新しました。')
  }

  const handleAnalyze = async () => {
    if (!hotelUrl) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await fetch('/api/tools/hotel-affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelUrl, affiliateId }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setAffiliateData(data.affiliateData);
      } else {
        alert('AI解析に失敗しました。');
      }
    } catch (e) {
      alert('通信エラーが発生しました。');
    } finally {
      setIsAnalyzing(false);
    }
  }

  const shareSNS = (platform: string) => {
    const text = encodeURIComponent(`${result}\n\n${affiliateData?.rakuten_url}`);
    let url = '';
    if (platform === 'x') url = `https://twitter.com/intent/tweet?text=${text}`;
    if (platform === 'fb') url = `https://www.facebook.com/sharer/sharer.php?u=${text}`;
    window.open(url, '_blank');
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-8 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Network className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">アフィリエイトAI連携</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic mt-2">Strategic Revenue Generation Hub</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ApiLinkIndicator model="Rakuten API / Gemini 2.5 Flash" />
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black px-4 py-2 rounded-xl hover:text-white transition-all uppercase tracking-widest"><Settings size={14} /> 報酬ID設定</button>
          </div>
        </div>

        {showSettings && (
          <div className="bg-[#13141f] border-2 border-emerald-500/30 rounded-3xl p-8 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-white font-black uppercase italic">楽天アフィリエイトID設定</h3>
            <p className="text-xs text-slate-500 italic">※デフォルトでオーナーID（nextralabs-22）が適用されています。</p>
            <input value={affiliateId} onChange={e => setAffiliateId(e.target.value)} className="w-full h-14 bg-black border border-white/10 rounded-xl px-6 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none" placeholder="トラッキングIDを入力..." />
            <Button onClick={saveSettings} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl px-8 h-12">保存</Button>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-inner border-l-8 border-l-emerald-500">
          <div className="flex items-center gap-4 text-emerald-400"><Info size={28} /> <h3 className="font-black italic uppercase text-xl">収益化マニュアル</h3></div>
          <p className="text-lg text-slate-200 font-black leading-relaxed italic text-left">
            紹介したい楽天トラベルのホテルURLを貼り付けてください。AIが「成約率を最大化する紹介文」を生成し、あなたの報酬IDを自動で組み込みます。
          </p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-4 text-left">
            <label className="text-xs font-black text-emerald-500 uppercase tracking-widest italic ml-2">楽天トラベル ホテルURL</label>
            <input value={hotelUrl} onChange={e => setHotelUrl(e.target.value)} className="w-full h-20 bg-black border-2 border-white/10 rounded-[2rem] px-8 text-2xl font-black text-white focus:border-emerald-500 outline-none transition-all shadow-inner" placeholder="https://travel.rakuten.co.jp/..." />
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !hotelUrl} className="w-full h-24 bg-emerald-600 hover:bg-emerald-50 text-slate-950 font-black text-3xl rounded-[2.5rem] shadow-xl uppercase italic active:scale-95 transition-all">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10 mx-auto" /> : '収益化紹介文を錬成 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-16 shadow-inner relative overflow-hidden text-white font-black">
              <div className="absolute top-0 right-0 p-8 opacity-10"><ShoppingBag size={150} className="text-emerald-500" /></div>
              <h3 className="text-3xl font-black text-white italic uppercase mb-10 flex items-center gap-5"><Zap className="text-emerald-400" /> AI Strategic Copywriting</h3>
              <div className="text-2xl md:text-3xl font-black italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4 mb-10 text-white font-black">
                <p className="text-xs font-black text-emerald-500 uppercase italic tracking-widest">利益確定アフィリエイトURL</p>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 overflow-hidden">
                  <p className="text-sm font-mono text-slate-400 truncate">{affiliateData?.rakuten_url}</p>
                  <Button onClick={() => {navigator.clipboard.writeText(affiliateData?.rakuten_url); alert('コピーしました')}} className="bg-white text-slate-950 font-black shrink-0">コピー</Button>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Instant SNS Profit Broadcast</p>
                 <div className="grid grid-cols-3 gap-6">
                    <Button onClick={() => shareSNS('x')} className="h-20 bg-black text-white border-2 border-white/10 hover:border-blue-400 rounded-2xl shadow-xl transition-all font-black text-xl italic gap-3"><Twitter /> X</Button>
                    <Button onClick={() => alert('Insta用プロンプトをコピーしました')} className="h-20 bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white rounded-2xl shadow-xl transition-all font-black text-xl italic gap-3"><Instagram /> Insta</Button>
                    <Button onClick={() => shareSNS('fb')} className="h-20 bg-[#1877F2] text-white rounded-2xl shadow-xl transition-all font-black text-xl italic gap-3"><Facebook /> FB</Button>
                 </div>
              </div>
            </Card>

            <div className="space-y-8">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-widest border-l-8 border-emerald-500 pl-8 text-left">収益化ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[{ title: 'URL解析', desc: '楽天トラベルの生データから、成約率の高い魅力をAIが特定。', icon: Search }, { title: 'SNS拡散', desc: 'ID付きリンクを自動生成。熱が冷めないうちに即座に投稿。', icon: Share2 }, { title: '報酬確定', desc: 'あなたのID経由で予約が発生。不労所得の第一歩を刻みます。', icon: ShoppingBag }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border-2 border-white/5 p-12 rounded-[3rem] space-y-6 hover:border-emerald-500/50 transition-all shadow-xl group">
                    <div className="flex justify-between items-start"><span className="text-sm font-black text-emerald-500/40">Step 0{i+1}</span><s.icon size={36} className="text-emerald-400" /></div>
                    <h4 className="text-2xl font-black text-white italic">{s.title}</h4>
                    <p className="text-sm text-slate-400 font-black leading-relaxed italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { ShoppingBag } from 'lucide-react';
