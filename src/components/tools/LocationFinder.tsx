'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, MapPin, Globe, Search, Camera } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 現場スキャン', icon: Camera },
  { id: 'result', label: '② 特定レポート', icon: MapPin },
];

export default function LocationFinder() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [findResult, setFindResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setTimeout(() => setIsProcessing(false), 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const FINAL_PROMPT = `あなたはOSINT（オープンソース・インテリジェンス）と地理情報に精通したロケーション・アナリストです。
添付された【場所を特定したい写真】を分析し、以下の3点を出力してください。

1. 【推定エリア】: 建物、植生、標識、太陽の角度などから導き出される国・地域・都市。
2. 【特定ポイント】: 画面内に映る決定的なランドマークや特定の手がかり。
3. 【詳細座標・URL】: Google Mapsで表示可能な座標、または周辺の店舗情報など。

正確性と論理的推論に基づいた、場所特定レポートをお願いします。`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">GEO INTELLIGENCE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI ロケーション探偵</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><MapPin className="text-indigo-400" /> ① 現場スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop Photo to Find</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-video max-w-[400px] mx-auto rounded-3xl overflow-hidden border-4 border-indigo-600/30 shadow-2xl bg-black flex items-center justify-center"><img src={image} alt="Target" className="max-h-full max-w-full object-contain" /><Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full h-8 w-8">✕</Button></div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>特定指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI (画像解析に強い) ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button></div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-indigo-400" /><h3 className="text-lg font-black text-white italic uppercase">特定結果を戻す</h3></div>
                 <textarea value={findResult} onChange={(e) => setFindResult(e.target.value)} placeholder="AIからの特定レポートをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {findResult && <Button onClick={() => setActiveTab('result')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 特定場所を確定 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'result' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-indigo-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Globe className="text-emerald-500 animate-pulse" /> 場所特定完了レポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{findResult || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setImage(null); setFindResult(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 次の場所を探偵する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
