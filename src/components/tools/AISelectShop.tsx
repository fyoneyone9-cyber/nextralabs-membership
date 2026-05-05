'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'

// ==================== Constants (Outer to avoid hook issues) ====================
const STYLES = [
  { id: 'japanese', name: '和風・日の丸', emoji: '⛩️' },
  { id: 'street', name: 'ストリート', emoji: '🏙️' },
  { id: 'cyber', name: 'ネオン・サイバー', emoji: '🌃' },
  { id: 'minimal', name: 'ミニマル', emoji: '⬜' },
];

const TSHIRT_COLORS = [
  { id: 'white', hex: '#FFFFFF', text: '#000000' },
  { id: 'black', hex: '#1a1a1a', text: '#FFFFFF' },
  { id: 'navy', hex: '#1e3a5f', text: '#FFFFFF' },
];

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

// ==================== Client Side Engine ====================
const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [designKeyword, setDesignKeyword] = useState('');
  const [designStyle, setDesignStyle] = useState('japanese');
  const [designTshirtColor, setDesignTshirtColor] = useState('black');
  const [designGenerated, setDesignGenerated] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchTrends();
    const saved = localStorage.getItem('ai-select-shop-list-v13');
    if (saved) {
      try { setDesigns(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const r = await fetch('/api/trends');
      const d = await r.json();
      if (d.trends && d.trends.length > 0) {
        setTrends(d.trends.map((t: string, i: number) => ({ id: `t-${i}`, name: t })));
      } else { throw new Error(); }
    } catch (e) {
      setTrends([
        { id: '1', name: '丸亀製麺' }, { id: '2', name: '陸上自衛隊' },
        { id: '3', name: 'セーラームーン' }, { id: '4', name: 'ザ!鉄腕!DASH!!' }
      ]);
    } finally { setIsLoadingTrends(false); }
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !designKeyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const tc = TSHIRT_COLORS.find(c => c.id === designTshirtColor) || TSHIRT_COLORS[1];

    ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = tc.hex;
    ctx.beginPath();
    ctx.moveTo(w*0.15, h*0.12); ctx.lineTo(w*0.05, h*0.28); ctx.lineTo(w*0.2, h*0.35);
    ctx.lineTo(w*0.2, h*0.9); ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.95, h*0.28); ctx.lineTo(w*0.85, h*0.12); ctx.lineTo(w*0.6, h*0.08);
    ctx.quadraticCurveTo(w*0.5, h*0.15, w*0.4, h*0.08);
    ctx.closePath(); ctx.fill();

    const cx = w/2, cy = h*0.48;
    if (designStyle === 'japanese') {
      ctx.beginPath(); ctx.arc(cx, cy, w*0.22, 0, Math.PI*2); ctx.fillStyle = '#c0392b'; ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px serif'; ctx.textAlign = 'center';
      const chars = designKeyword.split('');
      chars.forEach((ch, i) => ctx.fillText(ch, cx, cy - (chars.length*18) + (i*45)));
    } else {
      ctx.fillStyle = tc.text; ctx.font = '900 45px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(designKeyword.toUpperCase(), cx, cy);
    }
    setDesignGenerated(true);
  }, [designKeyword, designStyle, designTshirtColor]);

  useEffect(() => {
    if (designKeyword) {
      const timer = setTimeout(() => drawDesign(), 100);
      return () => clearTimeout(timer);
    }
  }, [designKeyword, designStyle, designTshirtColor, drawDesign]);

  const publishFlow = async () => {
    if (!designGenerated || isPublishing) return;
    setIsPublishing(true);
    try {
      const mockup = canvasRef.current?.toDataURL('image/png');
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-product', keyword: designKeyword, style: designStyle, mockupUrl: mockup }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = [{ id: Date.now(), keyword: designKeyword, img: mockup }, ...designs];
        setDesigns(updated);
        localStorage.setItem('ai-select-shop-list-v13', JSON.stringify(updated));
        alert('出品完了！');
        setCurrentStep(3);
      }
    } catch (e) { alert('エラー'); } finally { setIsPublishing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none">AI SELECT SHOP</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm">Master v13.5-STABLE</div>
      </div>

      <div className="flex gap-2 bg-[#1a1b26] p-2 rounded-3xl border border-white/5 max-w-2xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`flex-1 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white scale-105 shadow-2xl' : 'text-slate-600'}`}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {isLoadingTrends ? <div className="col-span-full text-center py-20 text-slate-500 animate-pulse font-black italic">SCANNING MARKET...</div> : 
           trends.map((t) => (
            <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer transition-all" onClick={() => { setDesignKeyword(t.name); setCurrentStep(2); }}>
              <div className="border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded text-[10px] font-black w-fit mb-6">TRENDING</div>
              <p className="text-4xl font-black italic uppercase text-white tracking-tighter">{t.name}</p>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in zoom-in-95">
          <div className="bg-[#13141f] p-10 rounded-[3.5rem] border-2 border-white/5 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Keyword</label>
              <input value={designKeyword} onChange={(e) => setDesignKeyword(e.target.value)} className="w-full h-20 text-4xl font-black italic bg-black border-2 border-white/10 rounded-2xl px-8 text-white outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Style</label>
                  <div className="grid grid-cols-2 gap-2">
                     {STYLES.map(s => <button key={s.id} onClick={() => setDesignStyle(s.id)} className={`py-4 rounded-xl text-[10px] font-black uppercase italic border-2 transition-all ${designStyle === s.id ? 'bg-[#5845e0] text-white border-white' : 'bg-black text-slate-600 border-white/5'}`}>{s.name}</button>)}
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Tone</label>
                  <div className="flex gap-4">
                     {TSHIRT_COLORS.map(c => <button key={c.id} onClick={() => setDesignTshirtColor(c.id)} className={`w-14 h-14 rounded-2xl border-4 transition-all ${designTshirtColor === c.id ? 'border-[#5845e0] scale-110' : 'border-white/5'}`} style={{ backgroundColor: c.hex }} />)}
                  </div>
               </div>
            </div>
            <button onClick={publishFlow} disabled={!designGenerated || isPublishing} className="w-full h-28 bg-emerald-600 text-white font-black text-4xl italic uppercase rounded-[2.5rem] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
               {isPublishing ? "SENDING..." : "SHOPIFY 出品"}
            </button>
          </div>
          <div className="bg-[#13141f] rounded-[3.5rem] border-2 border-white/5 p-12 flex flex-col items-center justify-center">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-[2.5rem] shadow-2xl border border-white/5" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

// 🛠️ 究極の回避策: コンポーネントを完全に隔離
const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

import { DebugPanel } from '@/components/tools/DebugPanel'

export default function AISelectShop() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden">
      <NoSSRWrapper />
      <DebugPanel data={{ status: "v13.5-fixed" }} toolId="ai-select-shop-ultimate" />
    </div>
  );
}
