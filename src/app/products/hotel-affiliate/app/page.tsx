'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingBag, Network, Copy, Settings, Twitter, Instagram, Facebook } from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'
import { AiVerifiedBadge } from '@/components/tools/AiVerifiedBadge'
import { ActiveLockBadge } from '@/components/tools/ActiveLockBadge'

export default function HotelAffiliateApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isSample, setIsSample] = useState(false)
  const [hotelUrl, setHotelUrl] = useState('')
  const [affiliateId, setAffiliateId] = useState('nextralabs-22')
  const [showSettings, setShowSettings] = useState(false)
  const [affiliateData, setAffiliateData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('nextra_rakuten_id')
    if (saved) setAffiliateId(saved)
  }, [])

  const handleAnalyze = async () => {
    if (!hotelUrl) return;
    setIsAnalyzing(true);
    setResult(null);
    setIsSample(false);
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
        throw new Error('API_FAILED');
      }
    } catch (e) {
      setResult("【現在APIが利用できません】\nサンプル例：このホテルは絶景の露天風呂が自慢で、今なら楽天ポイント10倍キャンペーン中です。");
      setAffiliateData({ rakuten_url: '#', estimated_cvr: '0.0%' });
      setIsSample(true);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const shareSNS = (platform: string) => {
    const text = encodeURIComponent(`${result}\n\n${affiliateData?.rakuten_url}`);
    let url = '';
    if (platform === 'x') url = `https://twitter.com/intent/tweet?text=${text}`;
    if (platform === 'fb') url = `https://www.facebook.com/sharer/sharer.php?u=${text}`;
    if (url) window.open(url, '_blank');
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-8 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4 text-left text-white font-black">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Network className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase">アフィリエイトAI連携</h1>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <ApiLinkIndicator model="Rakuten / Gemini 1.5 Flash" />
              <ActiveLockBadge />
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black px-4 py-2 rounded-xl hover:text-white transition-all uppercase"><Settings size={14} /> ID設定</button>
          </div>
        </div>

        {showSettings && (
          <Card className="bg-[#13141f] border-2 border-emerald-500/30 p-8 space-y-4 animate-in zoom-in-95">
            <h3 className="text-white font-black uppercase italic text-sm">楽天アフィリエイトID設定</h3>
            <input value={affiliateId} onChange={e => setAffiliateId(e.target.value)} className="w-full h-14 bg-black border border-white/10 rounded-xl px-6 text-emerald-400 font-mono" />
            <Button onClick={() => {localStorage.setItem('nextra_rakuten_id', affiliateId); setShowSettings(false);}} className="bg-emerald-600 text-white font-black w-full h-12">保存</Button>
          </Card>
        )}

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-inner border-l-8 border-l-emerald-500">
          <div className="flex items-center gap-4 text-emerald-400"><Info size={28} /> <h3 className="font-black italic uppercase text-xl">収益化導線</h3></div>
          <p className="text-lg text-slate-200 font-black leading-relaxed italic">楽天トラベルURLを貼ってください。AIが「稼げる紹介文」を生成し、あなたの報酬リンクを挿入します。完了後はSNSボタンで即座に拡散してください。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-end">
            <label className="text-xs font-black text-emerald-500 uppercase tracking-widest italic ml-2">楽天トラベル ホテルURL</label>
            <Button variant="outline" className="h-10 border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-black px-4" onClick={() => window.open('https://travel.rakuten.co.jp/', '_blank')}>ホテルを探す ↗</Button>
          </div>
          <input value={hotelUrl} onChange={e => setHotelUrl(e.target.value)} className="w-full h-20 bg-black border-2 border-white/10 rounded-xl px-8 text-2xl font-black text-white focus:border-emerald-500 outline-none" placeholder="https://travel.rakuten.co.jp/..." />
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !hotelUrl} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2.5rem] shadow-xl uppercase italic active:scale-95 transition-all">紹介文を錬成 🚀</Button>
        </Card>

        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-16 shadow-inner relative overflow-hidden text-white font-black">
              <div className="flex justify-between items-start mb-10">
                <h3 className="text-3xl font-black text-white italic uppercase flex items-center gap-5"><Zap className="text-emerald-400" /> AI Strategic Copy</h3>
                <AiVerifiedBadge isSample={isSample} />
              </div>
              <div className="text-2xl md:text-3xl font-black italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4 mb-10">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">報酬確定アフィリエイトURL</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-mono text-slate-400 truncate flex-1">{affiliateData?.rakuten_url}</p>
                  <Button onClick={() => {navigator.clipboard.writeText(affiliateData?.rakuten_url); alert('コピーしました')}} className="bg-white text-slate-950 font-black">コピー</Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <Button onClick={() => shareSNS('x')} className="h-20 bg-black text-white border-2 border-white/10 hover:border-blue-400 rounded-2xl shadow-xl font-black text-xl italic gap-3"><Twitter /> X</Button>
                <Button onClick={() => alert('Insta用プロンプトをコピー')} className="h-20 bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white rounded-2xl shadow-xl font-black text-xl italic gap-3"><Instagram /> Insta</Button>
                <Button onClick={() => shareSNS('fb')} className="h-20 bg-[#1877F2] text-white rounded-2xl shadow-xl font-black text-xl italic gap-3"><Facebook /> FB</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
