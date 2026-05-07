'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, Link as LinkIcon, Sparkles, Loader2, ArrowRight, 
  RotateCcw, CheckCircle2, Hotel, Instagram, Twitter, 
  MessageSquare, Copy, Zap, Settings, Globe
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [hotelName, setHotelName] = useState('');
  const [userVibe, setUserVibe] = useState('繧ｨ繝｢縺・・諢溷虚');
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
      setAffiliateId('534e3725.64346793.534e3726.d5412af4');
    }
  }, []);

  if (!isMounted) return null;

  const handleSaveId = () => {
    localStorage.setItem('rakuten_affiliate_id', affiliateId);
    alert('繧｢繝輔ぅ繝ｪ繧ｨ繧､繝・D繧剃ｿ晏ｭ倥＠縺ｾ縺励◆');
  };

  const generateAffiliatePost = async () => {
    if (!hotelName) return;
    setIsGenerating(true);
    setResult(null);
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
      alert('逕滓・繧ｨ繝ｩ繝ｼ');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-pink-600 text-white font-black italic px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Viral Affiliate OS</Badge>
        <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">繧｢繝輔ぅ繝ｪ繧ｨ繧､繝磯｣謳ｺ</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.1-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-600 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left relative overflow-hidden text-left">
          <div className="w-14 h-14 rounded-2xl border border-pink-500/30 flex items-center justify-center shrink-0 text-pink-500 font-bold text-2xl bg-pink-500/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-black text-pink-500 uppercase tracking-[0.3em] italic mb-2">驕狗畑繝励Ο繝医さ繝ｫ / AFFILIATE SYNC</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-pink-500 italic text-2xl">#1</span> 螳ｿ豕翫＠縺溷ｮｿ縺ｮ蜷榊燕縺ｨ謚慕ｨｿ縺ｮ髮ｰ蝗ｲ豌励ｒ驕ｸ謚・/p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-pink-500 italic text-2xl">#2</span> AI縺後後ヰ繧ｺ繧狗ｴｹ莉区枚縲阪→縲後い繝輔ぅ繝ｪ繝ｳ繧ｯ縲阪ｒ閾ｪ蜍暮軒謌・/p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-pink-600 italic text-2xl">#3</span> 繧ｳ繝斐・縺励※SNS縺ｫ謚慕ｨｿ縺吶ｋ縺縺代〒蜿守寢蛹悶′螳御ｺ・/p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">螳ｿ豕翫＠縺溷ｮｿ蜷・/label>
              <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} placeholder="萓具ｼ壽弌驥弱Μ繧ｾ繝ｼ繝・BEB5蝨滓ｵｦ" className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-sm text-white focus:border-pink-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">讌ｽ螟ｩ繧｢繝輔ぅ繝ｪ繧ｨ繧､繝・D</label>
              <div className="flex gap-2">
                <input value={affiliateId} onChange={(e) => setAffiliateId(e.target.value)} placeholder="534e3725.64..." className="flex-1 h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-sm text-white focus:border-emerald-500 outline-none font-mono" />
                <button onClick={handleSaveId} className="h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white"><Settings size={20} /></button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {['繧ｨ繝｢縺・・諢溷虚', '縺翫ｂ縺励ｍ繝ｻ繝阪ち', '譛臥寢繝ｻ繝ｬ繝薙Η繝ｼ', '繧ｷ繝ｳ繝励Ν繝ｻ縺翫＠繧・ｌ'].map(v => (
              <button key={v} onClick={() => setUserVibe(v)} className={`px-6 py-2 rounded-full font-black text-xs transition-all border-2 ${userVibe === v ? 'bg-pink-600 border-white text-white shadow-lg' : 'bg-slate-900 text-slate-500 border-white/5'}`}>{v}</button>
            ))}
          </div>

          <button onClick={generateAffiliatePost} disabled={isGenerating || !hotelName} className={`w-full h-24 ${isGenerating || !hotelName ? 'bg-slate-800 opacity-50' : 'bg-pink-600 hover:bg-pink-500'} text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-pink-900 active:border-b-0`}>
            {isGenerating ? <Loader2 className="animate-spin w-10 h-10" /> : <Sparkles className="w-10 h-10" />}
            <span>邏ｹ莉区枚繧定・蜍暮軒謌・筐・/span>
          </button>
        </div>

        {result && (
          <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 text-left">
            <div className="bg-black/40 border-2 border-white/5 rounded-[3rem] p-8 space-y-6 shadow-inner relative overflow-hidden">
               <div className="flex items-center gap-3 text-pink-400 font-black italic uppercase text-xs mb-2"><Twitter size={16} /> SNS Draft</div>
               <p className="text-lg text-white font-bold leading-relaxed italic whitespace-pre-wrap">{result.postText}</p>
               <button onClick={() => handleCopy(`${result.postText}\n\n隧ｳ邏ｰ縺ｯ縺薙■繧解汨Ⅸn${result.affiliateLink}`)} className={`w-full h-16 rounded-2xl font-black italic uppercase transition-all shadow-xl flex items-center justify-center gap-3 ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-white text-slate-950 hover:bg-pink-500 hover:text-white'}`}>
                 {copied ? <CheckCircle2 /> : <Copy />} 謚慕ｨｿ譁・ｒ繧ｳ繝斐・
               </button>
            </div>
            <div className="space-y-6">
              <div className="bg-[#1a1c2e] p-8 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-2xl">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 italic">Generated Link</p>
                 <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5 mb-4">
                    <LinkIcon className="text-emerald-500 shrink-0" size={18} />
                    <p className="text-[10px] text-slate-400 font-mono truncate">{result.affiliateLink}</p>
                 </div>
                 <div className="bg-emerald-600/5 p-4 rounded-xl border border-emerald-500/20"><p className="text-xs text-slate-300 font-bold italic">縲・{result.strategy} 縲・/p></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 <button onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(result.postText + '\n' + result.affiliateLink)}`, '_blank')} className="h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-400 hover:bg-white/10 transition-all shadow-lg"><Twitter /></button>
                 <button onClick={() => window.open('https://www.instagram.com/', '_blank')} className="h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-pink-500 hover:bg-white/10 transition-all shadow-lg"><Instagram /></button>
                 <button onClick={() => window.open('https://www.threads.net/', '_blank')} className="h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg"><MessageSquare /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-pink-600/5 border-2 border-pink-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-pink-500"><Zap size={20} /><p className="text-xs font-black uppercase tracking-widest">Master Affiliate Protocol</p></div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed">Nextra AI縺悟ｮｿ豕願・・諢溷虚繧偵∵昴ｏ縺壻ｺ育ｴ・＠縺溘￥縺ｪ繧狗ｴｹ莉区枚縺ｸ縺ｨ螟画鋤縺励∪縺吶よ･ｽ螟ｩ繝医Λ繝吶Ν縺ｨ縺ｮ騾｣蜍輔↓繧医ｊ縲√≠縺ｪ縺溘・SNS縺梧怙蠑ｷ縺ｮ莠育ｴ・ｪ灘哨縺ｫ螟峨ｏ繧翫∪縺吶・/p>
      </div>
      <DebugPanel data={{ hotelName }} toolId="hotel-affiliate-master-v2" />
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-pink-500 animate-pulse uppercase tracking-[0.5em]">Initializing Affiliate Node...</div>
})

export default function HotelAffiliateWrapper() {
  return <NoSSRWrapper />;
}
