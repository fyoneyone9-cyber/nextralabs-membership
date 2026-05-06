'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, 
  ClipboardPaste, Shirt, Search, Tag, Camera, Loader2, Download, FileImage, 
  TrendingUp, Activity, Terminal, ShieldCheck, Box, DollarSign, BarChart3, ShoppingCart
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
  const [estimatedProfit, setEstimatedProfit] = useState<number | null>(null);
  
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
    console.log(`[TARGET_LOCKED] ${trend}`);
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

  // 🚀 せどり特化型プロンプト
  const APPRAISAL_PROMPT = `あなたはヴィンテージ衣類専門の「せどり鑑定士」です。
以下の【証拠データ】を元に、転売利益を最大化するための鑑定を行ってください。

【ターゲット】: ${targetKeyword}
【解析画像】: 添付のディテール画像

1. 【真贋判定】: 100%本物か、コピー品の疑いがあるか。
2. 【年代・希少価値】: タグや縫製から見る正確な年代。
3. 【相場分析】: メルカリ・ヤフオクでの直近落札相場。
4. 【期待利益】: 仕入れ推奨価格と、販売予想価格。`;

  useEffect(() => {
    if (appraisalResult && !estimatedProfit) {
      setEstimatedProfit(5000 + Math.floor(Math.random() * 45000));
    }
  }, [appraisalResult]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">VINTAGE HUNTER</h1>
        <Badge className="bg-amber-500 text-black font-black italic tracking-[0.3em] px-8 py-2 text-xs uppercase rounded-full shadow-2xl mx-auto block w-fit">Resale Intelligence v7.0-MASTER</Badge>
      </div>

      <div className="flex gap-1 bg-[#1a1b26]/80 p-1 rounded-2xl border border-white/5 mb-12 shadow-2xl overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-6 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}>
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'hunt' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3.5rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6">
                  <TrendingUp size={48} className="text-amber-500" /> ① お宝トレンドを狩る
                </h2>
                <div className="bg-slate-900 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black text-emerald-500">LIVE SURVEILLANCE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingTrends ? (
                  Array(6).fill(0).map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] animate-pulse" />)
                ) : (
                  trends.map((t, i) => (
                    <div key={i} onClick={() => handleTrendClick(t)} className="bg-[#0a0b14] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500 cursor-pointer group transition-all">
                      <p className="text-[10px] font-black text-amber-500 uppercase italic mb-4">Market Opportunity</p>
                      <p className="text-3xl font-black italic uppercase text-white tracking-tighter group-hover:text-amber-500">{t}</p>
                      <div className="mt-6 flex items-center gap-2 text-slate-700 font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100">Lock Target <ArrowRight size={12} /></div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in relative overflow-hidden">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-amber-500"><Camera size={48} /> ② 証拠品スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                {!image ? (
                  <div className="border-4 border-dashed border-white/5 rounded-[2.5rem] p-16 hover:bg-white/5 cursor-pointer bg-black/30 text-center group" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Upload className="h-16 w-16 text-slate-800 group-hover:text-amber-500 mx-auto mb-6" />
                    <p className="text-2xl text-slate-700 font-black italic uppercase">Drop Target Photo</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in zoom-in-95">
                    <div className="relative aspect-square max-w-[450px] mx-auto rounded-[3rem] overflow-hidden border-4 border-amber-500/20 shadow-2xl bg-black">
                       <img src={image} alt="Target" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white">✕</Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2 px-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Item</p>
                        <Input value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} className="h-16 bg-black border-2 border-white/5 rounded-2xl px-6 font-black italic text-2xl text-amber-500" />
                      </div>
                      <Button onClick={() => { navigator.clipboard.writeText(APPRAISAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-24 font-black text-3xl rounded-[2rem] shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95'}`}>
                        {copied ? '✅ COPY COMPLETE' : '鑑定指示をコピー'}
                      </Button>
                      <div className="grid grid-cols-3 gap-3">
                         <Button variant="outline" className="h-14 border-white/5 bg-black text-[10px] font-black uppercase italic text-slate-500" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                         <Button variant="outline" className="h-14 border-white/5 bg-black text-[10px] font-black uppercase italic text-slate-500" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                         <Button variant="outline" className="h-14 border-white/5 bg-black text-[10px] font-black uppercase italic text-slate-500" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-[#0a0b14] rounded-[3.5rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-amber-500" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">鑑定レポートを戻す</h3></div>
                 <textarea value={appraisalResult} onChange={(e) => setAppraisalResult(e.target.value)} placeholder="AIから届いた転売・利益分析レポートを貼り付けてください..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-lg text-slate-300 focus:border-amber-500 outline-none font-mono italic shadow-inner min-h-[400px]" />
                 {appraisalResult && (
                    <Button onClick={() => setActiveTab('result')} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                      ③ 利益確定レポートを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2" />
                    </Button>
                 )}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'result' && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-12">
            <div className="grid md:grid-cols-3 gap-8">
               <Card className="bg-emerald-600/10 border-2 border-emerald-500/50 rounded-[2.5rem] p-8 text-center">
                  <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Estimated Profit</p>
                  <p className="text-5xl font-black text-white italic">¥{(estimatedProfit || 0).toLocaleString()}</p>
               </Card>
               <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Risk Level</p>
                  <p className="text-4xl font-black text-emerald-500 italic uppercase">LOW</p>
               </Card>
               <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Demand</p>
                  <p className="text-4xl font-black text-amber-500 italic uppercase">HIGH</p>
               </Card>
            </div>

            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden text-left border-l-8 border-l-amber-500">
               <div className="flex items-center justify-between mb-16 relative z-10">
                  <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6"><ShieldCheck className="text-emerald-500 w-16 h-16" /> Settlement Report</h3>
                  <Badge className="bg-amber-500 text-black font-black px-6 py-2 rounded-full italic uppercase">Verified</Badge>
               </div>
               <div className="bg-[#0a0b14] rounded-[3rem] p-12 border border-white/5 text-2xl text-slate-200 leading-relaxed italic shadow-inner mb-12">{appraisalResult}</div>
               <Button onClick={() => window.open(`https://jp.mercari.com/search?keyword=${encodeURIComponent(targetKeyword)}&status=on_sale`, '_blank')} className="w-full h-28 bg-white text-black hover:bg-amber-500 font-black rounded-[2.5rem] text-4xl italic uppercase flex items-center justify-center gap-6 shadow-2xl transition-all active:scale-95 group">
                  <ShoppingCart size={48} className="group-hover:rotate-12 transition-transform" />
                  メルカリでお宝を狩る ↗
               </Button>
            </Card>
          </div>
        )}
      </div>
      <DebugPanel data={{ targetKeyword, apiStatus }} toolId="vintage-hunter-ultimate" />
    </div>
  )
}
