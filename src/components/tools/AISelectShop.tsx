'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 🚀 AI Select Shop: Masterpiece v21.0 (ULTIMATE MASTER)
 * 【修正】装飾の豪華化・バリエーション拡充
 * 1. 日の丸、エンブレム、ボックス、スラッシュ等の豪華装飾を実装。
 * 2. ジャンルごとに「背景＋文字」のレイヤー構造を精密化。
 * 3. 文字サイズと配置の黄金比を再計算。
 */

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [tshirtColor, setTshirtColor] = useState('black');
  const [mockup, setMockup] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const STYLES = [
    { id: 'japanese', name: '和風・日の丸', emoji: '⛩️', colors: ['#c0392b', '#ffffff'] },
    { id: 'street', name: 'ストリート', emoji: '🏙️', colors: ['#ffdd00', '#000000'] },
    { id: 'retro', name: 'レトロ', emoji: '📻', colors: ['#ff6b35', '#f7c59f'] },
    { id: 'cyberpunk', name: 'サイバー', emoji: '🌃', colors: ['#00ffff', '#ff00ff'] },
    { id: 'kawaii', name: 'かわいい', emoji: '🎀', colors: ['#ffb7c5', '#fff0f5'] },
    { id: 'typography', name: '文字装飾', emoji: '🔤', colors: ['#ffffff', '#00ff88'] },
    { id: 'graffiti', name: 'グラフィティ', emoji: '🎨', colors: ['#ff003c', '#00ffff'] },
    { id: 'minimal', name: 'ミニマル', emoji: '⬜', colors: ['#ffffff', '#000000'] },
    { id: 'sports', name: 'スポーツ', emoji: '⚡', colors: ['#0077b6', '#90e0ef'] },
    { id: 'vintage', name: 'ビンテージ', emoji: '🏺', colors: ['#c8a96e', '#f5e6be'] },
    { id: 'neon_sign', name: 'ネオン', emoji: '💡', colors: ['#39ff14', '#00ff00'] },
    { id: 'abstract', name: '抽象画', emoji: '🔮', colors: ['#7b2cbf', '#e0aaff'] },
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
    try {
      const r = await fetch('/api/trends');
      const d = await r.json();
      if (d.trends) setTrends(d.trends.map((t: string, i: number) => ({ id: i, name: t })));
    } catch {
      setTrends([{id:1, name:'丸亀製麺'}, {id:2, name:'自衛隊'}, {id:3, name:'福島'}]);
    } finally { setIsLoading(false); }
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    
    // 背景
    ctx.fillStyle = '#0f0f1a'; ctx.fillRect(0, 0, w, h);
    
    // T-shirt Body
    const currentTColor = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1];
    ctx.fillStyle = currentTColor.hex; 
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1); ctx.lineTo(w*0.95, h*0.3); ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9); ctx.lineTo(w*0.2, h*0.35); ctx.lineTo(w*0.05, h*0.3);
    ctx.closePath(); ctx.fill();

    const cx = w/2, cy = h*0.48;
    const currentStyle = STYLES.find(s => s.id === style);
    const colors = currentStyle?.colors || ['#ffffff', '#000000'];

    ctx.save();
    // クリッピング
    ctx.beginPath(); ctx.rect(w*0.22, h*0.15, w*0.56, h*0.65); ctx.clip();

    let fontSize = 42;
    if (keyword.length > 5) fontSize = 32;
    if (keyword.length > 10) fontSize = 22;

    switch(style) {
      case 'japanese':
        // 🇯🇵 豪華な日の丸装飾
        ctx.beginPath();
        ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = colors[0];
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 10; ctx.stroke();
        // 縦書き
        ctx.fillStyle = colors[1];
        ctx.font = `900 ${fontSize}px "Hiragino Mincho ProN", serif`;
        ctx.textAlign = 'center';
        const chars = keyword.split('');
        chars.forEach((ch, i) => ctx.fillText(ch, cx, cy - (chars.length * (fontSize/2)) + i*(fontSize*1.1)));
        break;

      case 'street':
        // 🏙️ 豪華なストリートエンブレム
        ctx.fillStyle = colors[0];
        ctx.fillRect(cx - w*0.25, cy - fontSize*0.8, w*0.5, fontSize*1.6);
        ctx.strokeStyle = colors[1]; ctx.lineWidth = 3;
        ctx.strokeRect(cx - w*0.26, cy - fontSize*0.9, w*0.52, fontSize*1.8);
        ctx.fillStyle = colors[1];
        ctx.font = `900 ${fontSize}px Impact`;
        ctx.fillText(keyword.toUpperCase(), cx, cy + fontSize*0.35);
        break;

      case 'minimal':
        // ⬜ ミニマル・ダブルフレーム
        ctx.strokeStyle = colors[0]; ctx.lineWidth = 4;
        ctx.strokeRect(cx - w*0.25, cy - fontSize, w*0.5, fontSize*2);
        ctx.strokeRect(cx - w*0.22, cy - fontSize*0.8, w*0.44, fontSize*1.6);
        ctx.fillStyle = colors[0];
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillText(keyword, cx, cy + fontSize*0.3);
        break;

      case 'cyberpunk':
        // 🌃 サイバー・グリッチ装飾
        ctx.shadowColor = colors[0]; ctx.shadowBlur = 20;
        ctx.fillStyle = colors[0];
        ctx.font = `900 ${fontSize*1.3}px monospace`;
        ctx.fillText(keyword.toUpperCase(), cx, cy);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = colors[1]; ctx.lineWidth = 1;
        for(let i=-2; i<=2; i++) {
          ctx.beginPath(); ctx.moveTo(cx-80, cy + i*15); ctx.lineTo(cx+80, cy + i*15); ctx.stroke();
        }
        break;

      case 'sports':
        // ⚡ スポーツ・スラッシュ背景
        ctx.fillStyle = colors[0];
        ctx.beginPath();
        ctx.moveTo(cx-100, cy-50); ctx.lineTo(cx+100, cy-30); ctx.lineTo(cx+80, cy+50); ctx.lineTo(cx-120, cy+30);
        ctx.fill();
        ctx.fillStyle = colors[1];
        ctx.font = `900 ${fontSize*1.2}px Impact`;
        ctx.rotate(-0.05);
        ctx.fillText(keyword.toUpperCase(), cx, cy + 15);
        break;

      default:
        ctx.fillStyle = colors[0];
        ctx.font = `900 ${fontSize*1.2}px Impact`;
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
        <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm mt-4 tracking-widest shadow-2xl">v21.0-ULTIMATE MASTER</div>
      </div>

      <div className="flex gap-4 justify-center bg-[#1a1b26]/50 p-2 rounded-3xl border border-white/5 max-w-2xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`flex-1 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white shadow-2xl scale-105' : 'text-slate-600 hover:text-slate-300'}`}>Step {s}</button>
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
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Ultimate Style Palette</label>
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
        <div className="text-center py-20 animate-in slide-in-from-bottom-8">
           <h2 className="text-6xl font-black text-white italic mb-10 tracking-tighter">SUCCESSFUL PUBLISHED</h2>
           <button onClick={() => window.open('https://z5ju1n-vs.myshopify.com/admin/products', '_blank')} className="h-24 px-16 bg-white text-black font-black rounded-3xl text-2xl hover:bg-emerald-500 transition-all uppercase italic shadow-2xl">Open Shopify Admin ↗</button>
        </div>
      )}
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

export default function AISelectShop() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden">
      <NoSSRWrapper />
    </div>
  );
}
