'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, Link as LinkIcon, Sparkles, Loader2, ArrowRight, 
  RotateCcw, CheckCircle2, Hotel, Instagram, Twitter, 
  MessageSquare, Copy, Zap, Settings, Globe
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [hotelName, setHotelName] = useState('');
  const [userVibe, setUserVibe] = useState('エモい・感動');
  const [affiliateId, setAffiliateId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedId = localStorage.getItem('rakuten_affiliate_id');
    if (savedId) {
      setAffiliateId(savedId);
    } else {
      // 🚀 【本物化】デフォルトの楽天アフィリエイトIDを設定
      setAffiliateId('534e3725.64346793.534e3726.d5412af4');
    }
  }, []);

  const handleSaveId = () => {
    localStorage.setItem('rakuten_affiliate_id', affiliateId);
    alert('アフィリエイトIDを保存しました。');
  };

  const generateAffiliatePost = async () => {
    if (!hotelName) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tools/hotel-affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelName, userVibe, affiliateId }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      alert('生成エラーが発生しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-pink-600 text-white font-black italic px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Viral Affiliate OS</Badge>
        <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">アフィリエイト連携</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-600 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl border border-pink-500/30 flex items-center justify-center shrink-0 text-pink-500 font-bold text-2xl bg-pink-500/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-black text-pink-500 uppercase tracking-[0.3em] italic mb-2">運用プロトコル / AFFILIATE SYNC</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-pink-500 italic text-2xl">#1</span> 宿泊した宿の名前と投稿の雰囲気を選択</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-pink-500 italic text-2xl">#2</span> AIが「バズる紹介文」と「アフィリンク」を自動錬成</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-pink-600 italic text-2xl">#3</span> コピーしてSNSに投稿するだけで収益化が完了</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">宿泊した宿名</label>
              <input 
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="例：星野リゾート BEB5土浦"
                className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-sm text-white focus:border-pink-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">楽天アフィリエイトID（任意）</label>
              <div className="flex gap-2">
                <input 
                  value={affiliateId}
                  onChange={(e) => setAffiliateId(e.target.value)}
                  placeholder="例：1234abcd.5678efgh..."
                  className="flex-1 h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                />
                <button onClick={handleSaveId} className="h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Settings size={20} /></button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {['エモい・感動', 'おもしろ・ネタ', '有益・レビュー', 'シンプル・おしゃれ'].map(v => (
              <button key={v} onClick={() => setUserVibe(v)} className={`px-6 py-2 rounded-full font-black text-xs transition-all border-2 ${userVibe === v ? 'bg-pink-600 border-white text-white shadow-lg' : 'bg-slate-900 text-slate-500 border-white/5'}`}>{v}</button>
            ))}
          </div>

          <button 
            onClick={generateAffiliatePost}
            disabled={isGenerating || !hotelName}
            className={`w-full h-24 ${isGenerating || !hotelName ? 'bg-slate-800 opacity-50' : 'bg-pink-600 hover:bg-pink-500'} text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-pink-900 active:border-b-0`}
          >
            {isGenerating ? <Loader2 className="animate-spin w-10 h-10" /> : <Sparkles className="w-10 h-10" />}
            <span>紹介文を自動錬成 ➔</span>
          </button>

          <div className="grid grid-cols-3 gap-3">
             <button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-16 bg-white/5 border-2 border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"><span className="text-xl">💬</span> <span className="ml-2 text-[10px] font-black uppercase">ChatGPT</span></button>
             <button onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-16 bg-white/5 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg"><span className="text-xl">✨</span> <span className="ml-2 text-[10px] font-black uppercase">Gemini</span></button>
             <button onClick={() => window.open('https://claude.ai', '_blank')} className="h-16 bg-white/5 border-2 border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400 hover:bg-orange-500 hover:text-white transition-all shadow-lg"><span className="text-xl">❄️</span> <span className="ml-2 text-[10px] font-black uppercase">Claude</span></button>
          </div>
        </div>

        {result && (
          <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8">
            <div className="bg-black/40 border-2 border-white/5 rounded-[3rem] p-8 space-y-6 shadow-inner relative overflow-hidden text-left">
               <div className="absolute top-0 left-0 w-full h-1 bg-pink-500/30" />
               <div className="flex items-center gap-3 text-pink-400 font-black italic uppercase text-xs mb-2">
                 <Twitter size={16} /> SNS Draft
               </div>
               <p className="text-lg text-white font-bold leading-relaxed italic whitespace-pre-wrap">
                 {result.postText}
               </p>
               <button 
                onClick={() => handleCopy(`${result.postText}\n\n詳細はこちら👇\n${result.affiliateLink}`)}
                className={`w-full h-16 rounded-2xl font-black italic uppercase transition-all shadow-xl flex items-center justify-center gap-3 ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-white text-slate-950 hover:bg-pink-500 hover:text-white'}`}
               >
                 {copied ? <CheckCircle2 /> : <Copy />} 投稿文をコピー
               </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1a1c2e] p-8 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-2xl text-left">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 italic">Generated Link</p>
                 <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5 mb-4">
                    <LinkIcon className="text-emerald-500 shrink-0" size={18} />
                    <p className="text-[10px] text-slate-400 font-mono truncate">{result.affiliateLink}</p>
                 </div>
                 <div className="bg-emerald-600/5 p-4 rounded-xl border border-emerald-500/20">
                    <p className="text-xs text-slate-300 font-bold leading-relaxed italic">「 {result.strategy} 」</p>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 <button onClick={() => window.open('https://x.com/intent/tweet', '_blank')} className="h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-400 hover:bg-white/10 transition-all shadow-lg"><Twitter /></button>
                 <button onClick={() => window.open('https://www.instagram.com/', '_blank')} className="h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-pink-500 hover:bg-white/10 transition-all shadow-lg"><Instagram /></button>
                 <button onClick={() => window.open('https://www.threads.net/', '_blank')} className="h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg"><MessageSquare /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-pink-600/5 border-2 border-pink-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-pink-500">
            <Zap size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Master Affiliate Protocol</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            良い宿体験を「収益」へ。Nextra AIが宿泊者の感動を、思わず予約したくなる最高級の紹介文へと変換します。楽天トラベルとのシームレスな連動により、あなたのSNSが最強の予約窓口に変わります。
         </p>
      </div>

      <DebugPanel data={{ hotelName, vibe: userVibe }} toolId="hotel-affiliate-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Viral Commerce OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-pink-500 animate-pulse uppercase tracking-[0.5em]">Syncing Affiliate Node...</div>
})

export default function HotelAffiliateSystem() {
  return <NoSSRWrapper />;
}
