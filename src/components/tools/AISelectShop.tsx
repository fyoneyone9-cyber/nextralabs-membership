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
  
  // 🚀 API監視ステート
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState({ supabase: 'idle', printful: 'idle', shopify: 'idle' });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const STYLES = [
    { id: 'japanese', name: '和風・日の丸' },
    { id: 'street', name: 'ストリート' },
    { id: 'cyber', name: 'サイバーパンク' }
  ];

  useEffect(() => {
    fetchTrends();
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
      addLog("クラウドストレージ(Supabase)へ画像を同期中...");
      const mockupData = canvasRef.current?.toDataURL('image/png');
      
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-product', keyword, style, mockupUrl: mockupData }),
      });
      
      const d = await res.json();
      
      if (res.ok && d.success) {
        setSyncStatus({ supabase: 'success', printful: 'success', shopify: 'success' });
        addLog("✅ Supabase同期完了");
        addLog("✅ Printful製造ライン登録完了");
        addLog("✅ Shopifyストア出品完了");
        alert('全てのシステム連携が完了しました！');
        setCurrentStep(3);
      } else {
        setSyncStatus({ supabase: 'error', printful: 'error', shopify: 'error' });
        addLog(`❌ エラー発生: ${d.error}`);
        alert('連携に失敗しました: ' + d.error);
      }
    } catch (e) {
      setSyncStatus({ supabase: 'error', printful: 'error', shopify: 'error' });
      addLog("❌ 通信エラーが発生しました");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white italic tracking-tighter">AI SELECT SHOP v14.5</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-6 py-1 rounded-full uppercase italic text-xs mt-4">Triple-API Surveillance</div>
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
              
              {/* 📊 API Surveillance Monitoring */}
              <div className="grid grid-cols-3 gap-2">
                 {[
                   { id: 'supabase', label: 'SUPABASE', status: syncStatus.supabase },
                   { id: 'printful', label: 'PRINTFUL', status: syncStatus.printful },
                   { id: 'shopify', label: 'SHOPIFY', status: syncStatus.shopify }
                 ].map(s => (
                   <div key={s.id} className={`p-3 rounded-xl border-2 text-center transition-all ${s.status === 'success' ? 'border-emerald-500 bg-emerald-500/10' : s.status === 'processing' ? 'border-blue-500 bg-blue-500/10 animate-pulse' : s.status === 'error' ? 'border-red-500 bg-red-500/10' : 'border-slate-800 bg-black'}`}>
                      <p className="text-[8px] font-black text-slate-500 uppercase">{s.label}</p>
                      <p className={`text-[10px] font-bold ${s.status === 'success' ? 'text-emerald-500' : 'text-white'}`}>{s.status.toUpperCase()}</p>
                   </div>
                 ))}
              </div>

              <div className="bg-black border border-white/5 rounded-2xl p-4 h-24 overflow-y-auto font-mono text-[10px] text-emerald-500/70">
                 {apiLogs.map((log, i) => <div key={i}>{log}</div>)}
                 {apiLogs.length === 0 && <div className="opacity-30">Awaiting execution...</div>}
              </div>

              <button onClick={handlePublish} disabled={isPublishing} className="w-full h-28 bg-emerald-600 text-white font-black text-4xl italic rounded-[2.5rem] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95">
                {isPublishing ? <Loader2 className="animate-spin" size={40}/> : "SHOPIFY 出品"}
              </button>
            </div>
          </div>
          
          <div className="bg-[#13141f] rounded-[3rem] border-2 border-white/5 p-12 flex justify-center items-center shadow-2xl relative">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-3xl border border-white/5" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20 animate-in slide-in-from-bottom-8">
          <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[3rem] p-16 max-w-2xl mx-auto space-y-8">
            <h2 className="text-6xl font-black text-white italic tracking-tighter">ALL SYNCED!</h2>
            <div className="flex justify-center gap-4">
              <Badge className="bg-emerald-500 text-black px-4 py-1">SUPABASE: OK</Badge>
              <Badge className="bg-emerald-500 text-black px-4 py-1">PRINTFUL: OK</Badge>
              <Badge className="bg-emerald-500 text-black px-4 py-1">SHOPIFY: OK</Badge>
            </div>
            <p className="text-slate-400 font-bold">全てのAPIが正常に承認されました。Shopifyストアに商品が公開されています。</p>
            <button onClick={() => window.open('https://z5ju1n-vs.myshopify.com/admin/products', '_blank')} className="h-20 px-12 bg-white text-black font-black rounded-2xl text-xl hover:bg-emerald-500 transition-all">Shopifyストアを確認 ↗</button>
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
