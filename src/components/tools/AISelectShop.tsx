'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [mockup, setMockup] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState({ supabase: 'idle', printful: 'idle', shopify: 'idle' });
  const [designs, setDesigns] = useState<any[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const STYLES = [
    { id: 'japanese', name: '和風・日の丸' },
    { id: 'street', name: 'ストリート' },
    { id: 'cyber', name: 'サイバーパンク' }
  ];

  useEffect(() => {
    fetchTrends();
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai-select-shop-list-v14');
      if (saved) {
        try { setDesigns(JSON.parse(saved)); } catch (e) { console.error(e); }
      }
    }
  }, []);

  const addLog = (msg: string) => setApiLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]);

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
    setApiLogs([]);
    setSyncStatus({ supabase: 'processing', printful: 'idle', shopify: 'idle' });

    try {
      addLog("画像を同期中...");
      const mockupData = canvasRef.current?.toDataURL('image/png');
      
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-product', keyword, style, mockupUrl: mockupData }),
      });
      
      const d = await res.json();
      
      if (res.ok && d.success) {
        setSyncStatus({ supabase: 'success', printful: 'success', shopify: 'success' });
        addLog("✅ システム連携完了");
        
        // 🚀 クラッシュ防止: 状態更新を少し遅らせて確実にする
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            const newEntry = { id: Date.now(), name: keyword, img: mockupData };
            const updated = [newEntry, ...designs];
            setDesigns(updated);
            localStorage.setItem('ai-select-shop-list-v14', JSON.stringify(updated));
            setCurrentStep(3);
          }
        }, 100);
      } else {
        setSyncStatus({ supabase: 'error', printful: 'error', shopify: 'error' });
        alert('エラー: ' + d.error);
      }
    } catch (e) {
      setSyncStatus({ supabase: 'error', printful: 'error', shopify: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white italic tracking-tighter">AI SELECT SHOP v14.6</h1>
      </div>

      <div className="flex gap-4 justify-center">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`px-10 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white scale-110 shadow-2xl' : 'text-slate-600 border border-white/5'}`}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          {trends.map(t => (
            <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer" onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
              <p className="text-4xl font-black italic uppercase text-white">{t.name}</p>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in zoom-in-95">
          <div className="space-y-8">
            <div className="bg-[#13141f] p-10 rounded-[3rem] border-2 border-white/5 space-y-10 shadow-2xl">
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full h-20 text-4xl font-black italic bg-black border-2 border-white/10 rounded-2xl px-8 text-white outline-none" />
              
              <div className="grid grid-cols-3 gap-2">
                 {['SUPABASE', 'PRINTFUL', 'SHOPIFY'].map((label, idx) => {
                   const id = label.toLowerCase() as keyof typeof syncStatus;
                   const status = syncStatus[id];
                   return (
                    <div key={label} className={`p-3 rounded-xl border-2 text-center transition-all ${status === 'success' ? 'border-emerald-500 bg-emerald-500/10' : status === 'processing' ? 'border-blue-500 bg-blue-500/10 animate-pulse' : 'border-slate-800 bg-black'}`}>
                      <p className="text-[8px] font-black text-slate-500 uppercase">{label}</p>
                      <p className={`text-[10px] font-bold ${status === 'success' ? 'text-emerald-500' : 'text-white'}`}>{status.toUpperCase()}</p>
                    </div>
                   )
                 })}
              </div>

              <div className="bg-black border border-white/5 rounded-2xl p-4 h-24 overflow-y-auto font-mono text-[10px] text-emerald-500/70">
                 {apiLogs.map((log, i) => <div key={i}>{log}</div>)}
              </div>

              <button onClick={handlePublish} disabled={isPublishing} className="w-full h-28 bg-emerald-600 text-white font-black text-4xl italic rounded-[2.5rem] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95">
                {isPublishing ? "SENDING..." : "SHOPIFY 出品"}
              </button>
            </div>
          </div>
          
          <div className="bg-[#13141f] rounded-[3rem] border-2 border-white/5 p-12 flex justify-center items-center">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-3xl border border-white/5" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20 animate-in slide-in-from-bottom-8">
          <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[3rem] p-16 max-w-2xl mx-auto space-y-8">
            <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase">Success</h2>
            <button onClick={() => window.open('https://z5ju1n-vs.myshopify.com/admin/products', '_blank')} className="h-20 px-12 bg-white text-black font-black rounded-2xl text-xl hover:bg-emerald-500 transition-all">Shopifyを確認 ↗</button>
            <p className="text-xs text-slate-500 underline cursor-pointer" onClick={() => setCurrentStep(1)}>次の商品を作る</p>
          </div>
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
