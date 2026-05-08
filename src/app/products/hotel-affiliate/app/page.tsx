'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingBag, Network, Copy, Settings, Twitter, Instagram, Facebook } from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'
import { AiVerifiedBadge } from '@/components/tools/AiVerifiedBadge'

export default function HotelAffiliateApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isSample, setIsSample] = useState(false)
  const [hotelUrl, setHotelUrl] = useState('')
  const [affiliateId, setAffiliateId] = useState('nextralabs-22')
  const [showSettings, setShowSettings] = useState(false)
  const [affiliateData, setAffiliateData] = useState<any>(null)

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
        setIsSample(false); // 本物
      } else {
        throw new Error();
      }
    } catch (e) {
      // APIエラー時は偽物を隠さず「SAMPLE」として表示する
      setResult("【現在APIが利用できません】\nサンプル例：このホテルは露天風呂が最高で、今ならポイント10倍でお得に予約できます。");
      setAffiliateData({ rakuten_url: '#', estimated_cvr: '0.0%' });
      setIsSample(true);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-8 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Network className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white">アフィリエイトAI連携</h1>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ApiLinkIndicator model="Rakuten API / Gemini 2.5 Flash" />
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black px-4 py-2 rounded-xl hover:text-white transition-all uppercase tracking-widest"><Settings size={14} /> 報酬ID設定</button>
          </div>
        </div>

        {showSettings && (
          <div className="bg-[#13141f] border-2 border-emerald-500/30 rounded-3xl p-8 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-white font-black uppercase italic">楽天アフィリエイトID設定</h3>
            <input value={affiliateId} onChange={e => setAffiliateId(e.target.value)} className="w-full h-14 bg-black border border-white/10 rounded-xl px-6 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none" />
            <Button onClick={() => setShowSettings(false)} className="bg-emerald-600 text-white font-black rounded-xl px-8 h-12">保存</Button>
          </div>
        )}

        <Card className="bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative">
          <label className="text-xs font-black text-emerald-500 uppercase tracking-widest italic ml-2">楽天トラベル ホテルURL</label>
          <input value={hotelUrl} onChange={e => setHotelUrl(e.target.value)} className="w-full h-20 bg-black border-2 border-white/10 rounded-[2rem] px-8 text-2xl font-black text-white focus:border-emerald-500 outline-none transition-all shadow-inner" placeholder="https://travel.rakuten.co.jp/..." />
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !hotelUrl} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2.5rem] shadow-xl uppercase italic active:scale-95">紹介文を錬成 🚀</Button>
        </Card>

        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-16 shadow-inner relative overflow-hidden text-white font-black">
              <div className="flex justify-between items-start mb-10">
                <h3 className="text-3xl font-black text-white italic uppercase flex items-center gap-5"><Zap className="text-emerald-400" /> AI Strategic Copywriting</h3>
                {/* 🚨 真贋判定ラベル（見える化） */}
                <AiVerifiedBadge isSample={isSample} />
              </div>
              <div className="text-2xl md:text-3xl font-black italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
