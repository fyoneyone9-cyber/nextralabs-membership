'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, 
  ClipboardPaste, Shirt, Search, Tag, Camera, Loader2, Download, FileImage, 
  TrendingUp, Activity, Terminal, ShieldCheck, Box
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'hunt', label: '① トレンド狩り', icon: TrendingUp },
  { id: 'scan', label: '② 古着スキャン', icon: Camera },
  { id: 'result', label: '③ 鑑定レポート', icon: Tag },
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

  const handleTrendClick = (trend: string) => {
    setTargetKeyword(trend);
    setActiveTab('scan');
    console.log(`[SYNC] Trend locked to Vintage Search: ${trend}`);
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

  const APPRAISAL_PROMPT = `あなたはヴィンテージ衣類鑑定のプロです。以下の【証拠データ】を分析し、年代、ブランド、市場価値、真贋を鑑定してください。
【検索キーワード】: ${targetKeyword}
【解析画像】: 添付のディテール画像を参照`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">VINTAGE HUNTER</h1>
        <Badge className="bg-amber-500 text-black font-black italic tracking-[0.3em] px-8 py-2 text-xs uppercase rounded-full shadow-2xl mx-auto block w-fit">Market Watch Engine v6.0-MASTER</Badge>
      </div>

      <div className="flex gap-1 bg-[#1a1b26]/80 p-1 rounded-2xl border border-white/5 mb-12 shadow-2xl overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-6 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}>
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* ① トレンド狩り（API連携） */}
        {activeTab === 'hunt' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6">
                  <TrendingUp size={48} className="text-amber-500" /> ① トレンド狩り
                </h2>
                <Badge variant="outline" className={`text-xs font-black ${apiStatus === 'live' ? 'text-green-500 border-green-500/30 animate-pulse' : 'text-amber-500 border-amber-500/30'}`}>
                  API: {apiStatus.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingTrends ? (
                  Array(6).fill(0).map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] animate-pulse" />)
                ) : (
                  trends.map((t, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleTrendClick(t)}
                      className="bg-[#0a0b14] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500 cursor-pointer group transition-all shadow-xl"
                    >
                      <p className="text-[10px] font-black text-amber-500 uppercase italic mb-4">Buzz Item Found</p>
                      <p className="text-3xl font-black italic uppercase text-white tracking-tighter group-hover:text-amber-500 transition-colors">{t}</p>
                      <div className="mt-6 flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Lock on Item <ArrowRight size={14} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ② 古着スキャン */}
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-amber-500"><Camera size={48} /> ② 古着スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                {!image ? (
                  <div className="border-4 border-dashed border-white/5 rounded-[2.5rem] p-16 hover:bg-white/5 transition-all cursor-pointer bg-black/30 shadow-inner text-center group" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Upload className="h-16 w-16 text-slate-800 group-hover:text-amber-500 mx-auto mb-6 transition-colors" />
                    <p className="text-2xl text-slate-700 font-black italic uppercase tracking-widest group-hover:text-slate-500">Drop Evidence</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in zoom-in-95">
                    <div className="relative aspect-square max-w-[450px] mx-auto rounded-[3rem] overflow-hidden border-4 border-amber-500/20 shadow-2xl bg-black">
                       <img src={image} alt="Target" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white transition-all">✕</Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2 px-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Locked Keyword</p>
                        <Input value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} className="h-14 bg-black border-2 border-white/5 rounded-xl px-6 font-black italic text-xl text-amber-500" />
                      </div>
                      <Button onClick={() => { navigator.clipboard.writeText(APPRAISAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-black' : 'bg-amber-600 text-black hover:bg-amber-500'}`}>鑑定指示をコピー</Button>
                      <div className="grid grid-cols-3 gap-2">
                         <Button variant="outline" className="h-12 border-white/5 bg-black text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                         <Button variant="outline" className="h-12 border-white/5 bg-black text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                         <Button variant="outline" className="h-12 border-white/5 bg-black text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-[#0a0b14] rounded-[3.5rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-amber-500" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">鑑定レポートを戻す</h3></div>
                 <textarea value={appraisalResult} onChange={(e) => setAppraisalResult(e.target.value)} placeholder="AIから届いた査定結果をここにペースト..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-lg text-slate-300 focus:border-amber-500 outline-none font-mono italic shadow-inner min-h-[400px]" />
                 {appraisalResult && (
                    <Button onClick={() => setActiveTab('result')} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group transition-all animate-in slide-in-from-bottom-4">
                      ③ 最終査定書を確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </Button>
                 )}
              </div>
            </div>
          </Card>
        )}

        {/* ③ 鑑定レポート */}
        {activeTab === 'result' && (
          <div className="animate-in fade-in zoom-in space-y-12 pb-20">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden text-left border-l-8 border-l-amber-500">
               <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 text-white"><Search size={300} className="fill-white opacity-20" /></div>
               <div className="flex items-center justify-between mb-16 relative z-10">
                  <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6"><CheckCircle2 className="text-emerald-500 w-16 h-16" /> Appraisal Report</h3>
                  <Badge className="bg-amber-500 text-black font-black px-6 py-2 rounded-full italic uppercase">Authentic</Badge>
               </div>
               <div className="bg-[#0a0b14] rounded-[3rem] p-12 border border-white/5 text-2xl text-slate-200 leading-relaxed italic shadow-inner relative z-10 font-medium">
                  {appraisalResult || "No Data Captured."}
               </div>
               <div className="mt-12 flex justify-between items-center relative z-10 border-t border-white/5 pt-8">
                  <div className="space-y-1"><p className="text-[10px] font-black text-slate-600 uppercase">Verification Engine</p><p className="text-sm font-black text-amber-500 italic uppercase">NextraLabs Cyber IQ v6.0</p></div>
                  <Button onClick={() => window.open(`https://jp.mercari.com/search?keyword=${encodeURIComponent(targetKeyword)}&status=on_sale`, '_blank')} className="h-16 px-12 bg-white text-black font-black rounded-2xl italic uppercase flex items-center gap-4 hover:bg-amber-500 transition-all shadow-xl"><Search size={20}/> メルカリでお宝を狩る ↗</Button>
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setAppraisalResult(''); setActiveTab('hunt'); }} variant="ghost" className="w-full text-slate-600 hover:text-white font-black uppercase italic underline tracking-widest">Restart Hunting Protocol</Button>
          </div>
        )}
      </div>
      
      <DebugPanel data={{ trends, targetKeyword, appraisalResult }} toolId="vintage-hunter-master" />
      <div className="text-center opacity-20 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">Market Watch Command • NextraLabs 2026</div>
    </div>
  )
}
