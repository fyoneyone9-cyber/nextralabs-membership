'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Home, ShieldCheck, MapPin, Building2, EyeOff, Info, AlertTriangle, Ruler, Search
} from 'lucide-react'

const TABS = [
  { id: 'area', label: '① 治安スコア', icon: MapPin },
  { id: 'room', label: '② 物件解析', icon: Home },
  { id: 'contract', label: '③ 契約書鑑定', icon: ShieldCheck },
];

export default function MovingChecker() {
  const [activeTab, setActiveTab] = useState('area');
  const [areaName, setAreaInfo] = useState('');
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [contractAdvice, setContractAdvice] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setRoomImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const FINAL_PROMPT = `あなたは不動産鑑定士とOSINTの専門家です。
以下の【物件情報・契約書】を徹底分析し、入居後に後悔しないための鑑定レポートを出力してください。

1. 【隠れたリスク指摘】: 騒音、日当たり、カビ、周辺の特異点。
2. 【契約書トラップ】: 特約事項、退去費用、解約条件の不当性。
3. 【最終鑑定】: この物件に住むべきか、他を当たるべきかの結論。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-xs font-black text-indigo-400 uppercase italic tracking-widest">Resident Shield Guide</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-sm text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-indigo-600 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">RESIDENCE GUARD</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Moving Checker</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[700px] md:min-w-full rounded-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {/* ① 治安スコア */}
        {activeTab === 'area' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4 text-indigo-500"><MapPin /> ① エリア治安分析</h3>
            {renderGuide(['市区町村名を入力する', 'AIにその地域の警察庁データや治安情報を調べさせる', '危険なエリアや注意点を特定する'])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <textarea value={areaName} onChange={(e) => setAreaInfo(e.target.value)} placeholder="例：神奈川県海老名市社家..." className="w-full h-32 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-xl text-slate-200 focus:border-indigo-500 outline-none font-black shadow-inner" />
                  <Button onClick={() => { navigator.clipboard.writeText(`あなたは警察統計に詳しい治安アナリストです。以下の地域名に基づき、直近の犯罪発生傾向、不審者情報、そして住民層の特徴を分析してください：${areaName}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl italic">治安調査指示をコピー</Button>
                  <div className="grid grid-cols-2 gap-4"><Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button><Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button></div>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex items-center justify-center shadow-inner">
                  <div className="text-center space-y-4">
                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Area Risk Score</p>
                     <p className="text-8xl font-black text-slate-800 italic">--</p>
                     <p className="text-xs text-slate-500 font-bold italic">AIによる分析結果を待っています...</p>
                  </div>
               </div>
            </div>
            {areaName && <Button onClick={() => setActiveTab('room')} className="w-full h-16 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl italic uppercase group">② 物件解析へ進む <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}

        {/* ② 物件解析 (IMAGE) */}
        {activeTab === 'room' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4 text-indigo-500"><Home /> ② 室内・設備解析</h3>
            {renderGuide(['内見時に撮影した写真をアップロード', '指示をコピーしてAIに隠れたリスクを指摘させる'])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  {!roomImage ? (
                    <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 text-center hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-14 w-14 text-slate-700 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase">Drop Room Photo</p>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-indigo-600/30 shadow-2xl bg-black flex items-center justify-center">
                       <img src={roomImage} alt="Room" className="max-h-full max-w-full object-contain" />
                       <Button onClick={() => setRoomImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                  )}
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-center space-y-6">
                  <p className="text-white font-black italic uppercase text-xs">AI Vision Analysis</p>
                  <Button onClick={() => { navigator.clipboard.writeText("この部屋の写真を分析し、構造的な欠陥、騒音リスク、日当たりの良し悪し、および管理状態を特定してください。"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-xl rounded-2xl shadow-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>画像解析指示をコピー</Button>
                  <Button variant="outline" className="w-full h-14 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI (画像に強い) ↗</Button>
               </div>
            </div>
            <Button onClick={() => setActiveTab('contract')} className="w-full h-16 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl italic uppercase group">③ 契約書鑑定へ進む <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" /></Button>
          </Card>
        )}

        {/* ③ 契約書鑑定 (PASTE RESULT) */}
        {activeTab === 'contract' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in text-center">
             <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center justify-center gap-4 text-emerald-500"><ShieldCheck /> ③ 安心鑑定レポート</h3>
             <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-emerald-500" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">AIの結論を戻す</h3></div>
                 <textarea value={contractAdvice} onChange={(e) => setContractAdvice(e.target.value)} placeholder="AIから届いた鑑定結果をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-lg text-slate-300 focus:border-emerald-500 outline-none font-medium leading-relaxed italic" />
                 {contractAdvice && <div className="p-6 bg-emerald-600/10 border-2 border-emerald-500 rounded-2xl flex items-center gap-4 text-emerald-500 animate-pulse"><CheckCircle2 className="w-8 h-8" /><p className="text-xl font-black uppercase italic">Safe to Live — Final Report Ready</p></div>}
             </div>
             <Button onClick={() => { setAreaInfo(''); setRoomImage(null); setContractAdvice(''); setActiveTab('area'); }} variant="outline" className="w-full h-16 mt-10 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初から鑑定する</Button>
          </Card>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Safe Living Engine — NextraLabs 2026</p></div>
    </div>
  )
}
