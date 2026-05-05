'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Scissors, Shirt, Trash2, Sparkles
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 洋服スキャン', icon: Shirt },
  { id: 'coach', label: '② 断捨離コーチ', icon: Trash2 },
];

export default function ClosetCoach() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coachAdvice, setCoachAdvice] = useState('');
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

  const FINAL_PROMPT = `あなたはミニマリズムとファッションに精通したクローゼットコーチです。
添付された【洋服の写真】を分析し、以下の3点を出力してください。

1. 【ときめき判定】: デザイン、状態、流行の観点から「残すべきか」を5段階で評価。
2. 【断捨離の助言】: 手放すべき理由、または使い続けるための手入れ方法。
3. 【着回し提案】: これを活かすための最適なコーディネート案。

不要な服を捨て、あなたの人生を軽量化するためのアドバイスをお願いします。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-emerald-600/30 rounded-xl p-4 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 bg-emerald-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-emerald-500" /></div>
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-emerald-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-emerald-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">MINIMALIST ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AI 断捨離コーチ</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Shirt className="text-emerald-500" /> ① 洋服スキャン</h3>
            {renderGuide(['洋服を撮影・アップロードする', 'AIに渡すコーチング指示をコピー', 'AIの診断結果を右のエリアへ戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Scan Item</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[300px] mx-auto rounded-3xl overflow-hidden border-4 border-emerald-600/30 shadow-2xl">
                       <img src={image} alt="Uploaded Item" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>コーチング指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>GPT-4o</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-emerald-500" /><h3 className="text-lg font-black text-white italic uppercase tracking-tighter text-left">AIの診断を戻す</h3></div>
                 <textarea value={coachAdvice} onChange={(e) => setCoachAdvice(e.target.value)} placeholder="AIのアドバイスをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-emerald-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {coachAdvice && (
               <Button onClick={() => setActiveTab('coach')} className="w-full h-16 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">
                  ② 断捨離の決断へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'coach' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-emerald-600">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Sparkles className="text-emerald-500 animate-pulse" /> AI 断捨離コーチの結論</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed text-left whitespace-pre-wrap italic">
                  {coachAdvice || "診断がありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setCoachAdvice(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の服を診断する</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Minimalist Lifestyle — NextraLabs 2026</p></div>
    </div>
  )
}
