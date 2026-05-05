'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, MessageSquare, Smile, ShieldCheck, Camera, Loader2, Download } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① トーク解析', icon: Camera },
  { id: 'coach', label: '② 伝え方改善', icon: Smile },
];

export default function CommCoach() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commAdvice, setCommAdvice] = useState('');
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

  const FINAL_PROMPT = `あなたは対人心理学とアサーティブ・トレーニングのプロです。
添付された【トーク画面のスクショ】を分析し、より円滑でポジティブな関係を築くための改善案を出力してください。

1. 【意図の解析】: 相手の発言の背後にある心理状態と、今のやり取りの問題点。
2. 【ベスト返信案】: 角を立てず、かつ自分の意思を明確に伝える3つの返信例文。
3. 【信頼の鍵】: この相手と今後接する際に意識すべき最重要ポイント。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1 text-left">
        <p className="text-sm font-black text-indigo-400 uppercase italic tracking-widest opacity-70">Social Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight"><span className="text-indigo-600 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">SOCIAL INTELLIGENCE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI コミュ改善コーチ</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[500px] md:min-w-full rounded-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-indigo-500"><MessageSquare /> ① トーク解析</h3>
            {renderGuide(['悩んでいるトーク画面のスクショをアップロード', '指示をコピーしてAI三台体制へ投げ、画像をドロップ', 'AIからの処方箋を右のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-14 w-14 text-slate-700 group-hover:text-indigo-500 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase tracking-widest">Drop Screenshot</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-auto max-w-[450px] mx-auto rounded-3xl overflow-hidden border-4 border-indigo-600/30 shadow-2xl bg-black flex items-center justify-center">
                       {isProcessing ? <Loader2 className="animate-spin text-indigo-500 h-10 w-10" /> : <img src={image} alt="Talk" className="object-contain w-full h-auto" />}
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>改善指示をコピー</Button>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="h-12 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-indigo-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">AIの改善案を戻す</h3></div>
                 <textarea value={commAdvice} onChange={(e) => setCommAdvice(e.target.value)} placeholder="AIから届いた処方箋をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:border-indigo-500 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {commAdvice && (
               <Button onClick={() => setActiveTab('coach')} className="w-full h-20 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 言葉の処方箋を確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'coach' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-indigo-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Smile className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><ShieldCheck className="text-emerald-500 animate-pulse w-12 h-12" /> 言葉の処方箋レポート</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10">
                  {commAdvice || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setCommAdvice(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別のトークを相談する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
