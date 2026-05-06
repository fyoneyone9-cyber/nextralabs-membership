'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 🚀 AI Select Shop: Masterpiece v18.0 (STABLE MASTER)
 * 【修正】ジャンル選択肢の完全復旧
 * 1. ジャンル（和風、ストリート等）を自由に選択可能に。
 * 2. Canvas Engine: トレンド文字を刻印。
 * 3. Triple API Sync: Supabase + Printful + Shopify
 */

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [mockup, setMockup] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const STYLES = [
    { id: 'japanese', name: '和風・日の丸', emoji: '⛩️' },
    { id: 'street', name: 'ストリート', emoji: '🏙️' },
    { id: 'cyber', name: 'ネオン・サイバー', emoji: '🌃' },
    { id: 'minimal', name: 'ミニマル', emoji: '⬜' },
    { id: 'retro', name: 'レトロ', emoji: '📻' },
    { id: 'kawaii', name: 'かわいい', emoji: '🎀' }
  ];

  const TSHIRT_COLORS = [
    { id: 'white', hex: '#FFFFFF', text: '#000000' },
    { id: 'black', hex: '#1a1a1a', text: '#FFFFFF' },
    { id: 'navy', hex: '#1e3a5f', text: '#FFFFFF' },
  ];

  useEffect(() => {
    fetchTrends();
    const saved = localStorage.getItem('ai-select-shop-list-v18');
    if (saved) {
      try { setDesigns(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/trends');
      const d = await r.json();
      if (d.trends && d.trends.length > 0) {
        setTrends(d.trends.map((t: string, i: number) => ({ id: i, name: t })));
      } else { throw new Error(); }
    } catch {
      setTrends([{id:1, name:'丸亀製麺'}, {id:2, name:'陸上自衛隊'}, {id:3, name:'セーラームーン'}]);
    } finally { setIsLoading(false); }
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const tc = TSHIRT_COLORS[1]; // Default Black

    ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = tc.hex;
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1); ctx.lineTo(w*0.9, h*0.3); ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9); ctx.lineTo(w*0.2, h*0.35); ctx.lineTo(w*0.1, h*0.3);
    ctx.closePath(); ctx.fill();

    const cx = w/2, cy = h*0.48;
    if (style === 'japanese') {
      ctx.beginPath(); ctx.arc(cx, cy, w*0.22, 0, Math.PI*2); ctx.fillStyle = '#c0392b'; ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 35px serif'; ctx.textAlign = 'center';
      keyword.split('').forEach((ch, i) => ctx.fillText(ch, cx, cy - 60 + i*40));
    } else {
      ctx.fillStyle = '#000000'; ctx.font = '900 45px Impact'; ctx.textAlign = 'center';
      ctx.fillText(keyword.toUpperCase(), cx, cy);
    }
    setMockup(canvas.toDataURL('image/png'));
  }, [keyword, style]);

  useEffect(() => {
    if (keyword) {
      const timer = setTimeout(() => drawDesign(), 100);
      return () => clearTimeout(timer);
    }
  }, [keyword, style, drawDesign]);

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-product', keyword, style, mockupUrl: mockup }),
      });
      const d = await res.json();
      if (d.success) { 
        alert('Shopify出品完了！');
        const updated = [{ id: Date.now(), keyword, img: mockup }, ...designs];
        setDesigns(updated);
        localStorage.setItem('ai-select-shop-list-v18', JSON.stringify(updated));
        setCurrentStep(3); 
      }
    } catch { alert('エラー'); } finally { setIsPublishing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 text-left">
      <div className="text-center">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none">AI SELECT SHOP</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm mt-4 tracking-widest shadow-2xl">v18.0-MASTER</div>
      </div>

      <div className="flex gap-4 justify-center bg-[#1a1b26]/50 p-2 rounded-3xl border border-white/5 max-w-2xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`flex-1 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white scale-105 shadow-2xl' : 'text-slate-600 hover:text-slate-300'}`}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {trends.map((t) => (
            <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer transition-all" onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
              <div className="border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded text-[10px] font-black w-fit mb-6 italic uppercase tracking-widest">TRENDING NOW</div>
              <p className="text-4xl font-black italic uppercase text-white tracking-tighter">{t.name}</p>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in zoom-in-95">
          <div className="bg-[#13141f] p-10 rounded-[3.5rem] border-2 border-white/5 space-y-10 shadow-2xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Design Keyword</label>
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full h-20 text-4xl font-black italic bg-black border-2 border-white/10 rounded-2xl px-8 text-white outline-none focus:border-[#5845e0]" />
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Select Design Style</label>
               <div className="grid grid-cols-3 gap-2">
                  {STYLES.map(s => <button key={s.id} onClick={() => setStyle(s.id)} className={`py-4 rounded-xl text-[10px] font-black uppercase italic border-2 transition-all ${style === s.id ? 'bg-[#5845e0] text-white border-white' : 'bg-black text-slate-600 border-white/5 hover:border-white/10'}`}>{s.emoji} {s.name}</button>)}
               </div>
            </div>
            <button onClick={handlePublish} disabled={isPublishing} className="w-full h-28 bg-emerald-600 text-white font-black text-4xl italic rounded-[2.5rem] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
               {isPublishing ? "SENDING..." : "SHOPIFY 出品"}
            </button>
          </div>
          <div className="bg-[#13141f] rounded-[3.5rem] border-2 border-white/5 p-12 flex justify-center items-center relative overflow-hidden">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-3xl border border-white/5" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
          {designs.map((d, i) => (
            <div key={i} className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={d.img} className="w-full aspect-[4/5] object-cover bg-black" />
              <div className="p-10"><p className="text-3xl font-black italic uppercase text-white">{d.keyword}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

import { DebugPanel } from '@/components/tools/DebugPanel'

export default function AISelectShop() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden">
      <NoSSRWrapper />
      <DebugPanel data={{ system: "master-restored" }} toolId="ai-select-shop-master" />
    </div>
  );
}
