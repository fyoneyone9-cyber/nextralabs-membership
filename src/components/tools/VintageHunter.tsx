'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('hunt');
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appraisalResult, setAppraisalResult] = useState('');
  const [rakutenData, setRakutenData] = useState<any>(null);
  const [isRakutenLoading, setIsRakutenLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      if (data.trends) {
        setTrends(data.trends);
        setApiStatus(data.isLive ? 'live' : 'local');
      }
    } catch (e) { setApiStatus('local'); } finally { setIsLoadingTrends(false); }
  };

  const fetchRakutenPrice = async (keyword: string) => {
    setIsRakutenLoading(true);
    try {
      const res = await fetch('/api/tools/rakuten-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      const d = await res.json();
      if (d.success) setRakutenData(d.data);
    } catch (e) { console.error(e); } finally { setIsRakutenLoading(false); }
  };

  const handleTrendClick = (trend: string) => {
    setTargetKeyword(trend);
    setActiveTab('scan');
    fetchRakutenPrice(trend);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
      setTimeout(() => setIsProcessing(false), 1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">VINTAGE HUNTER</h1>
        <div className="bg-amber-500 text-black font-black italic tracking-[0.3em] px-8 py-2 text-xs uppercase rounded-full shadow-2xl mx-auto block w-fit">v8.0-MASTER</div>
      </div>

      <div className="flex gap-1 bg-[#1a1b26]/80 p-1 rounded-2xl border border-white/5 mb-12 shadow-2xl overflow-x-auto scrollbar-hide">
        {[
          { id: 'hunt', label: '① トレンド狩り' },
          { id: 'scan', label: '② 古着スキャン' },
          { id: 'result', label: '③ 鑑定レポート' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-6 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'hunt' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6">① トレンド狩り</h2>
                <div className="flex gap-3">
                   <div className="border border-emerald-500/30 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">RAKUTEN: LIVE</div>
                   <div className="border border-amber-500/30 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">API: {apiStatus.toUpperCase()}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingTrends ? (
                  [1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] animate-pulse" />)
                ) : (
                  trends.map((t, i) => (
                    <div key={i} onClick={() => handleTrendClick(t)} className="bg-[#0a0b14] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500 cursor-pointer group transition-all shadow-xl">
                      <p className="text-[10px] font-black text-amber-500 uppercase italic mb-4">Item Target</p>
                      <p className="text-3xl font-black italic uppercase text-white tracking-tighter">{t}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
            <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">② 証拠品スキャン</h3>
               {!image ? (
                 <div className="border-4 border-dashed border-white/5 rounded-[2.5rem] p-20 hover:bg-white/5 cursor-pointer bg-black/30 text-center" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <p className="text-2xl text-slate-700 font-black italic uppercase">Drop Target Photo</p>
                 </div>
               ) : (
                 <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-amber-500/20 bg-black">
                    <img src={image} alt="Target" className="object-cover w-full h-full" />
                    <button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 p-2 rounded-full text-white">✕</button>
                 </div>
               )}
            </div>
            <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8">
               <h4 className="text-xl font-black text-white italic uppercase tracking-widest">Rakuten Market Data</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0b14] p-6 rounded-2xl border border-white/5 text-center">
                     <p className="text-[10px] font-bold text-slate-600 uppercase">最安値</p>
                     <p className="text-3xl font-black text-white italic">¥{(rakutenData?.minPrice || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0a0b14] p-6 rounded-2xl border border-white/5 text-center">
                     <p className="text-[10px] font-bold text-slate-600 uppercase">最高値</p>
                     <p className="text-3xl font-black text-emerald-500 italic">¥{(rakutenData?.maxPrice || 0).toLocaleString()}</p>
                  </div>
               </div>
               <button onClick={() => { navigator.clipboard.writeText(`鑑定依頼: ${targetKeyword}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full h-20 bg-amber-500 text-black font-black text-xl rounded-2xl transition-all shadow-xl">
                  {copied ? '✅ COPY COMPLETE' : '鑑定プロンプトをコピー'}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const DynamicEngine = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

import { DebugPanel } from '@/components/tools/DebugPanel'

export default function VintageHunter() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden">
      <DynamicEngine />
      <DebugPanel data={{ status: "stable" }} toolId="vintage-hunter-v8" />
    </div>
  );
}
