'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, 
  ClipboardPaste, Shirt, Search, Tag, Camera, Loader2, Download, FileImage, 
  TrendingUp, Activity, Terminal, ShieldCheck, Box, DollarSign, BarChart3, ShoppingCart, Globe
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'hunt', label: '① トレンド狩り', icon: TrendingUp },
  { id: 'scan', label: '② 古着スキャン', icon: Camera },
  { id: 'result', label: '③ 利益確定レポート', icon: DollarSign },
];

export default function VintageHunter() {
  const [activeTab, setActiveTab] = useState('hunt');
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appraisalResult, setAppraisalResult] = useState('');
  
  // 🚀 楽天API連動ステート
  const [rakutenData, setRakutenData] = useState<any>(null);
  const [isRakutenLoading, setIsRakutenLoading] = useState(false);

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
    fetchRakutenPrice(trend); // トレンド選択時に楽天相場を裏で取得
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

  const APPRAISAL_PROMPT = `あなたはヴィンテージ衣類専門の「せどり鑑定士」です。
以下の【証拠データ】を元に、転売利益を最大化するための鑑定を行ってください。

【ターゲット】: ${targetKeyword}
【楽天市場の中古相場】: ¥${rakutenData?.minPrice || '---'} 〜 ¥${rakutenData?.maxPrice || '---'}

1. 【真贋判定】: 100%本物か、コピー品の疑いがあるか。
2. 【年代・希少価値】: タグや縫製から見る正確な年代。
3. 【利益シミュレーション】: 楽天相場を基準にした仕入れ判断。`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">VINTAGE HUNTER</h1>
        <Badge className="bg-amber-500 text-black font-black italic tracking-[0.3em] px-8 py-2 text-xs uppercase rounded-full shadow-2xl mx-auto block w-fit">Market Watch Engine v8.0-MASTER</Badge>
      </div>

      <div className="flex gap-1 bg-[#1a1b26]/80 p-1 rounded-2xl border border-white/5 mb-12 shadow-2xl overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-6 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-xl scale-[1.02]' : 'text-slate-500'}`}>
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'hunt' && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3.5rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6">
                <TrendingUp size={48} className="text-amber-500" /> ① トレンド狩り
              </h2>
              <div className="flex gap-3">
                 <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 animate-pulse">RAKUTEN_API: LIVE</Badge>
                 <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500">TREND: {apiStatus.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map((t, i) => (
                <div key={i} onClick={() => handleTrendClick(t)} className="bg-[#0a0b14] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500 cursor-pointer group transition-all">
                  <p className="text-[10px] font-black text-amber-500 uppercase italic mb-4">Buzz Item Found</p>
                  <p className="text-3xl font-black italic uppercase text-white tracking-tighter">{t}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'scan' && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
          <div className="space-y-8">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4"><Camera className="text-amber-500"/> ② 証拠品スキャン</h3>
               {!image ? (
                 <div className="border-4 border-dashed border-white/5 rounded-[2.5rem] p-20 hover:bg-white/5 cursor-pointer bg-black/30 text-center" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Upload className="h-16 w-16 text-slate-800 mx-auto mb-6" />
                    <p className="text-2xl text-slate-700 font-black italic uppercase">Drop Target Photo</p>
                 </div>
               ) : (
                 <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-amber-500/20 bg-black">
                    <img src={image} alt="Target" className="object-cover w-full h-full" />
                    <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white">✕</Button>
                 </div>
               )}
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8">
               <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h4 className="text-xl font-black text-white italic uppercase tracking-widest flex items-center gap-3"><Globe className="text-emerald-500"/> Rakuten Market Data</h4>
                  {isRakutenLoading && <Loader2 className="animate-spin text-emerald-500" />}
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0b14] p-6 rounded-2xl border border-white/5 text-center">
                     <p className="text-[10px] font-bold text-slate-600 uppercase">楽天 最安値</p>
                     <p className="text-3xl font-black text-white italic">¥{(rakutenData?.minPrice || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0a0b14] p-6 rounded-2xl border border-white/5 text-center">
                     <p className="text-[10px] font-bold text-slate-600 uppercase">楽天 最高値</p>
                     <p className="text-3xl font-black text-emerald-500 italic">¥{(rakutenData?.maxPrice || 0).toLocaleString()}</p>
                  </div>
               </div>
               <div className="bg-black/50 rounded-2xl p-6 border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Latest Rakuten Items</p>
                  <div className="space-y-3">
                     {rakutenData?.items?.map((item: any, i: number) => (
                       <div key={i} className="flex items-center justify-between text-xs group cursor-pointer" onClick={() => window.open(item.url, '_blank')}>
                          <span className="text-slate-400 truncate w-40 group-hover:text-white transition-colors">{item.name}</span>
                          <span className="text-emerald-500 font-bold whitespace-nowrap">¥{item.price.toLocaleString()} ↗</span>
                       </div>
                     ))}
                  </div>
               </div>
               <Button onClick={() => { navigator.clipboard.writeText(APPRAISAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full h-20 bg-amber-500 text-black font-black text-xl rounded-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-xl">
                  {copied ? '✅ COPY COMPLETE' : '鑑定プロンプトをコピー'}
               </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'result' && (
        <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-12 pb-20">
           <Card className="bg-[#13141f] border-2 border-white/5 rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden text-left">
              <div className="flex items-center gap-4 mb-12"><div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500"><Tag size={32}/></div><h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">利益確定レポートを戻す</h3></div>
              <textarea value={appraisalResult} onChange={(e) => setAppraisalResult(e.target.value)} placeholder="AIから届いた鑑定レポートをここにペースト..." className="w-full h-96 bg-[#0a0b14] border-2 border-white/5 rounded-[3rem] p-12 text-xl text-slate-200 focus:border-amber-500 outline-none font-mono italic shadow-inner leading-relaxed" />
              <div className="mt-12 grid grid-cols-2 gap-6">
                 <Button onClick={() => window.open(`https://jp.mercari.com/search?keyword=${encodeURIComponent(targetKeyword)}&status=on_sale`, '_blank')} className="h-24 bg-white text-black font-black text-2xl rounded-3xl hover:bg-amber-500 transition-all shadow-2xl flex items-center justify-center gap-4">
                    <ShoppingCart size={32} /> メルカリで狩る ↗
                 </Button>
                 <Button onClick={() => window.open(`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(targetKeyword)}/`, '_blank')} variant="outline" className="h-24 border-white/10 bg-black text-white font-black text-2xl rounded-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4">
                    <Globe size={32} className="text-emerald-500"/> 楽天相場を確認 ↗
                 </Button>
              </div>
           </Card>
        </div>
      )}
      <DebugPanel data={{ targetKeyword, rakutenData }} toolId="vintage-hunter-ultimate" />
    </div>
  )
}
