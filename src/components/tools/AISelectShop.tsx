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
  const [isPublishing, setIsPublishing] = useState(false);
  
  // 🚀 憲法：APIステータスの可視化
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const STYLES = [
    { id: 'japanese', name: '和風・日の丸', emoji: '⛩️', colors: ['#c0392b', '#ffffff'] },
    { id: 'street', name: 'ストリート', emoji: '🏙️', colors: ['#ffdd00', '#000000'] },
    { id: 'retro', name: 'レトロ', emoji: '📻', colors: ['#ff6b35', '#f7c59f'] },
    { id: 'cyberpunk', name: 'サイバー', emoji: '🌃', colors: ['#00ffff', '#ff00ff'] },
    { id: 'kawaii', name: 'かわいい', emoji: '🎀', colors: ['#ffb7c5', '#fff0f5'] },
    { id: 'minimal', name: 'ミニマル', emoji: '⬜', colors: ['#ffffff', '#000000'] },
  ];

  const TSHIRT_COLORS = [
    { id: 'white', name: '白', hex: '#FFFFFF', text: '#000000' },
    { id: 'black', name: '黒', hex: '#1a1a1a', text: '#FFFFFF' },
    { id: 'navy', name: '紺', hex: '#1e3a5f', text: '#FFFFFF' },
  ];

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    setApiStatus('loading');
    try {
      const r = await fetch('/api/trends');
      const d = await r.json();
      if (d.trends && d.trends.length > 0) {
        setTrends(d.trends.map((t: string, i: number) => ({ id: i, name: t })));
        setApiStatus(d.isLive ? 'live' : 'local');
      } else { throw new Error(); }
    } catch {
      setApiStatus('local');
      setTrends([{id:1, name:'トレンド取得失敗'}, {id:2, name:'API再接続中...'}]);
    } finally { setIsLoading(false); }
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    
    ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, w, h);
    
    const currentTColor = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1];
    ctx.fillStyle = currentTColor.hex; 
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1); ctx.lineTo(w*0.95, h*0.3); ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9); ctx.lineTo(w*0.2, h*0.35); ctx.lineTo(w*0.05, h*0.3);
    ctx.closePath(); ctx.fill();

    const cx = w/2, cy = h*0.48;
    const currentStyle = STYLES.find(s => s.id === style) || STYLES[0];
    const colors = currentStyle.colors;

    ctx.save();
    ctx.beginPath(); ctx.rect(w*0.22, h*0.15, w*0.56, h*0.65); ctx.clip();

    let fontSize = 42;
    if (keyword.length > 5) fontSize = 32;

    switch(style) {
      case 'kawaii':
        ctx.font = "24px serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = "#ffb347"; ctx.fillText("✨", cx - 40, cy - 60);
        ctx.fillStyle = "#ff69b4"; ctx.fillText("💖", cx, cy - 60);
        ctx.fillStyle = "#ffb347"; ctx.fillText("✨", cx + 40, cy - 60);
        ctx.font = `bold ${fontSize + 8}px sans-serif`;
        ctx.fillStyle = '#ffc0cb'; ctx.fillText(keyword, cx, cy);
        ctx.font = "24px serif";
        ctx.fillStyle = "#ffb7c5"; ctx.fillText("🌸", cx - 40, cy + 50);
        ctx.fillStyle = "#ff69b4"; ctx.fillText("💗", cx, cy + 50);
        ctx.fillStyle = "#ffb7c5"; ctx.fillText("🌸", cx + 40, cy + 50);
        break;
      case 'japanese':
        ctx.beginPath(); ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2); ctx.fillStyle = colors[0]; ctx.fill();
        ctx.fillStyle = colors[1];
        const chars = keyword.split('');
        const vFontSize = Math.min(36, Math.floor(h * 0.4 / chars.length));
        ctx.font = `900 ${vFontSize}px serif`; ctx.textAlign = 'center';
        chars.forEach((ch, i) => ctx.fillText(ch, cx, cy - (chars.length * (vFontSize/2)) + i*(vFontSize*1.2)));
        break;
      default:
        ctx.fillStyle = colors[0];
        ctx.font = `900 ${fontSize}px Impact`; ctx.textAlign = 'center';
        ctx.fillText(keyword.toUpperCase(), cx, cy);
    }
    ctx.restore();
    setMockup(canvas.toDataURL('image/png'));
  }, [keyword, style, tshirtColor]);

  useEffect(() => {
    if (keyword) {
      const timer = setTimeout(() => drawDesign(), 50);
      return () => clearTimeout(timer);
    }
  }, [keyword, style, tshirtColor, drawDesign]);

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
      if (d.success) { alert('Shopify出品完了！'); setCurrentStep(3); }
    } catch { alert('通信エラー'); } finally { setIsPublishing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 text-left">
      <div className="text-center">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none">AI SELECT SHOP</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm mt-4 tracking-widest shadow-2xl">v23.0-MASTER</div>
      </div>

      <div className="flex gap-4 justify-center bg-[#1a1b26]/50 p-2 rounded-3xl border border-white/5 max-w-2xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`flex-1 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white shadow-2xl scale-105' : 'text-slate-600 hover:text-slate-300'}`}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-2 text-indigo-400 font-black italic uppercase tracking-widest text-xs">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" /> Market Pulse
             </div>
             {/* 🚀 APIステータスインジケーターの復活 */}
             <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${apiStatus === 'live' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-amber-500/10 border-amber-500/50 text-amber-400'}`}>
                <div className={`w-2 h-2 rounded-full ${apiStatus === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-tighter">API: {apiStatus.toUpperCase()}</span>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {trends.map((t) => (
              <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer transition-all shadow-xl" onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
                <p className="text-4xl font-black italic uppercase text-white tracking-tighter">{t.name}</p>
              </div>
            ))}
          </div>
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
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Ultimate Style Palette</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                     {STYLES.map(s => <button key={s.id} onClick={() => setStyle(s.id)} className={`py-4 rounded-xl text-[9px] font-black uppercase italic border-2 transition-all ${style === s.id ? 'bg-[#5845e0] text-white border-white shadow-lg' : 'bg-black text-slate-600 border-white/5 hover:border-white/10'}`}>{s.emoji}<br/>{s.name}</button>)}
                  </div>
               </div>
            </div>

            <button onClick={handlePublish} disabled={isGenerating || isPublishing} className="w-full h-28 bg-emerald-600 text-white font-black text-4xl italic rounded-[2.5rem] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
               {isPublishing ? "SENDING..." : "SHOPIFY 出品"}
            </button>
          </div>
          <div className="bg-[#13141f] rounded-[3rem] border-2 border-white/5 p-12 flex justify-center items-center relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-3xl border border-white/5 shadow-inner" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20 animate-in slide-in-from-bottom-8">
           <h2 className="text-6xl font-black text-white italic mb-10 tracking-tighter">SUCCESSFUL PUBLISHED</h2>
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
      <DebugPanel data={{ system: "master-surveillance" }} toolId="ai-select-shop-ultimate" />
    </div>
  );
}
