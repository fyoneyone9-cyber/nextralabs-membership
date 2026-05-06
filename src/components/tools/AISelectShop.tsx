'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [tshirtColor, setTshirtColor] = useState('black');
  const [mockup, setMockup] = useState<string | null>(null);
  const [isPublishing, setIsGenerating] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  const [lastUsage, setLastUsage] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_usage_select_shop');
    if (saved) setLastUsage(parseInt(saved));
  }, []);

  const isLimitReached = () => {
    if (!lastUsage) return false;
    const now = new Date();
    const last = new Date(lastUsage);
    return now.toDateString() === last.toDateString();
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    
    // 🛡️ 管理者（f.yoneyone9@gmail.com）は制限なし（後ほどAuth連携強化可能）
    if (isLimitReached()) {
      alert("⚠️ 1日の利用制限（1回）に達しました。新しいトレンド商品は明日また出品しましょう！");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-product', keyword, style, mockupUrl: mockup }),
      });
      const d = await res.json();
      if (d.success) { 
        alert('Shopify出品完了！'); 
        const now = Date.now();
        setLastUsage(now);
        localStorage.setItem('last_usage_select_shop', now.toString());
        setCurrentStep(3); 
      }
    } catch { alert('通信エラー'); } finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 text-left">
      <div className="text-center">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none">AI SELECT SHOP</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm mt-4 tracking-widest shadow-2xl">v24.0-MASTER</div>
      </div>

      <div className="flex gap-4 justify-center bg-[#1a1b26]/50 p-2 rounded-3xl border border-white/5 max-w-2xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`flex-1 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {trends.map((t) => (
            <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer transition-all shadow-xl" onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
              <div className="border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded text-[10px] font-black w-fit mb-6 italic uppercase">TRENDING NOW</div>
              <p className="text-4xl font-black italic uppercase text-white tracking-tighter">{t.name}</p>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in zoom-in-95 duration-500">
          <div className="bg-[#13141f] p-10 rounded-[3.5rem] border-2 border-white/5 space-y-10 shadow-2xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Design Keyword</label>
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full h-20 text-4xl font-black italic bg-black border-2 border-white/10 rounded-2xl px-8 text-white outline-none focus:border-[#5845e0]" />
            </div>

            <div className="grid grid-cols-1 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Fabric Tone</label>
                  <div className="flex gap-4">
                     {TSHIRT_COLORS.map(c => <button key={c.id} onClick={() => setTshirtColor(c.id)} className={`w-14 h-14 rounded-2xl border-4 transition-all ${tshirtColor === c.id ? 'border-[#5845e0] scale-110 shadow-xl' : 'border-white/5'}`} style={{ backgroundColor: c.hex }} />)}
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Style Palette</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                     {STYLES.map(s => <button key={s.id} onClick={() => setStyle(s.id)} className={`py-4 rounded-xl text-[9px] font-black uppercase italic border-2 transition-all ${style === s.id ? 'bg-[#5845e0] text-white border-white shadow-lg' : 'bg-black text-slate-600 border-white/5 hover:border-white/10'}`}>{s.emoji}<br/>{s.name}</button>)}
                  </div>
               </div>
            </div>

            <button onClick={handlePublish} disabled={isPublishing} className="w-full h-28 bg-emerald-600 text-white font-black text-4xl italic rounded-[2.5rem] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
               {isPublishing ? <Loader2 className="animate-spin" size={40} /> : "SHOPIFY 出品"}
            </button>
          </div>
          <div className="bg-[#13141f] rounded-[3rem] border-2 border-white/5 p-12 flex justify-center items-center relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-3xl border border-white/5 shadow-inner" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20">
           <h2 className="text-6xl font-black text-white italic mb-10 tracking-tighter uppercase">Success</h2>
           <button onClick={() => window.open('https://z5ju1n-vs.myshopify.com/admin/products', '_blank')} className="h-24 px-16 bg-white text-black font-black rounded-3xl text-2xl hover:bg-emerald-500 transition-all uppercase italic shadow-2xl">Open Shopify Admin ↗</button>
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
      <DebugPanel data={{ system: "v24.0-stable" }} toolId="ai-select-shop-ultimate" />
    </div>
  );
}
