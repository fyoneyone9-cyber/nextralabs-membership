'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'

// ==================== Constants ====================
const STYLES = [
  { id: 'japanese', name: '和風・日の丸', emoji: '⛩️' },
  { id: 'street', name: 'ストリート', emoji: '🏙️' },
  { id: 'cyber', name: 'ネオン・サイバー', emoji: '🌃' },
];

const TSHIRT_COLORS = [
  { id: 'white', hex: '#FFFFFF', text: '#000000' },
  { id: 'black', hex: '#1a1a1a', text: '#FFFFFF' },
];

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [mockup, setMockup] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/trends');
      const d = await r.json();
      if (d.trends) setTrends(d.trends.map((t: string, i: number) => ({ id: i, name: t })));
      else throw new Error();
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
    
    ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF'; 
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
    if (keyword) drawDesign();
  }, [keyword, style, drawDesign]);

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const mockupData = canvasRef.current?.toDataURL('image/png');
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create-product', 
          keyword, 
          style, 
          mockupUrl: mockupData // base64
        }),
      });
      const d = await res.json();
      if (d.success) { alert('Shopify出品完了！'); setCurrentStep(3); }
      else { alert('APIエラー: ' + (d.error || '不明なエラー')); }
    } catch { alert('通信失敗'); } finally { setIsPublishing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white italic tracking-tighter">AI SELECT SHOP v14.1</h1>
      </div>

      <div className="flex gap-4 justify-center">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`px-10 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white' : 'text-slate-600 border border-white/5'}`}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trends.map(t => (
            <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer" onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
              <p className="text-4xl font-black italic uppercase text-white">{t.name}</p>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-[#13141f] p-10 rounded-[3rem] border-2 border-white/5 space-y-10">
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full h-20 text-4xl font-black italic bg-black border-2 border-white/10 rounded-2xl px-8 text-white outline-none" />
            <div className="grid grid-cols-2 gap-4">
              {STYLES.map(s => <button key={s.id} onClick={() => setStyle(s.id)} className={`py-4 rounded-xl font-black uppercase italic border-2 ${style === s.id ? 'bg-[#5845e0] text-white border-white' : 'bg-black text-slate-600 border-white/5'}`}>{s.name}</button>)}
            </div>
            <button onClick={handlePublish} disabled={isPublishing} className="w-full h-28 bg-emerald-600 text-white font-black text-4xl italic rounded-[2.5rem] flex items-center justify-center gap-4">
              {isPublishing ? "SENDING..." : "SHOPIFY 出品"}
            </button>
          </div>
          <div className="bg-[#13141f] rounded-[3rem] border-2 border-white/5 p-12 flex justify-center">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-3xl border border-white/5" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20">
          <h2 className="text-5xl font-black text-white italic mb-10">SUCCESS!</h2>
          <button onClick={() => window.open('https://z5ju1n-vs.myshopify.com/admin/products', '_blank')} className="h-20 px-12 bg-white text-black font-black rounded-2xl text-xl">管理画面を確認</button>
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
