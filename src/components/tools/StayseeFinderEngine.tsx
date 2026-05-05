'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, Building2, UserSearch, Camera, Loader2, Download } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 拾得物スキャン', icon: Camera },
  { id: 'match', label: '② 顧客マッチング', icon: UserSearch },
];

export default function StayseeFinderEngine() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const FINAL_PROMPT = `あなたはホテル管理システム（PMS）と拾得物管理の専門家です。
添付された【忘れ物の写真】を分析し、Stayseeの宿泊履歴と照合するためのデータを出力してください。

1. 【拾得物プロファイル】: カテゴリ、特徴、ブランド、色、状態。
2. 【宿泊者予測】: 忘れ物の特性から推測される宿泊客の属性（ビジネス、観光、外国人等）。
3. 【Staysee検索指示】: PMSで検索すべき具体的なキーワード、日付、部屋番号の候補。

スムーズな返却を実現するための、正確なデータ抽出をお願いします。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-blue-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-blue-500 uppercase italic tracking-widest">Hotel PMS Protocol</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2 leading-tight"><span className="text-blue-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">HOTEL DX ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Staysee AI Finder</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[500px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-blue-400"><PackageSearch /> ① 拾得物スキャン</h3>
            {renderGuide(['忘れ物を撮影してアップロード', '照合指示をコピーしてAI（ChatGPT推奨）へ画像を投げ込む', 'AIから届いた検索キーワードを右に戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 group-hover:text-blue-500 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase">Drop Found Item</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[400px] mx-auto rounded-3xl overflow-hidden border-4 border-blue-600/30 shadow-2xl bg-black flex items-center justify-center">
                       {isProcessing ? <Loader2 className="animate-spin text-blue-500 h-10 w-10" /> : <img src={image} alt="Found" className="object-contain w-full h-full" />}
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white'}`}>照合指示をコピー</Button>
                    <Button variant="outline" onClick={() => window.open('https://chatgpt.com', '_blank')} className="w-full h-12 border-slate-800 font-black uppercase italic">ChatGPT (GPT-4o) ↗</Button>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-blue-400" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">照合結果を戻す</h3></div>
                 <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="AIから届いたStaysee検索キーワード等をペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-blue-500 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {matchResult && (
               <Button onClick={() => setActiveTab('match')} className="w-full h-20 mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 顧客マッチングを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'match' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-blue-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Building2 className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><UserSearch className="text-emerald-500 animate-pulse w-12 h-12" /> Staysee 照合レポート</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic relative z-10">
                  {matchResult || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setMatchResult(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
