'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Dog, Cat, MessageCircle, Heart, Camera, Loader2, Download
} from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 感情スキャン', icon: Camera },
  { id: 'result', label: '② 翻訳レポート', icon: MessageCircle },
];

export default function PetTranslator() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translationResult, setTranslationResult] = useState('');
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

  const FINAL_PROMPT = `あなたはアニマル・コミュニケーションの専門家です。
添付された【ペットの写真・動画】を分析し、ペットの「7種類の感情（幸せ、寂しい、空腹、甘えたい、警戒、退屈、眠い）」を特定した上で、以下の3点を出力してください。

1. 【翻訳された心の声】: ペットが今あなたに伝えたい言葉。
2. 【心理的サイン】: 表情、耳、瞳から読み取れる感情の根拠。
3. 【最高の接し方】: ペットのストレスを解消し、幸福度を最大化する具体的アクション。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-white uppercase italic tracking-widest opacity-70">Pet Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 leading-tight"><span className="text-red-500 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-yellow-500 text-black font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">ANIMAL INTELLIGENCE</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Pet Translator</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[600px] md:min-w-full rounded-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-yellow-500 text-black shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-yellow-500"><Camera /> ① 感情スキャン</h3>
            {renderGuide(['ペットの様子を撮影してアップロード', '指示をコピーしてAIへ投げ、画像をドロップ', 'AIが翻訳した「ペットの言葉」を右側に戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" /><Upload className="h-14 w-14 text-slate-700 group-hover:text-yellow-500 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase">Drop Pet Image</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[450px] mx-auto rounded-3xl overflow-hidden border-4 border-yellow-500/30 shadow-2xl bg-black flex items-center justify-center">
                       {isProcessing ? <Loader2 className="animate-spin text-yellow-500 h-10 w-10" /> : <img src={image} alt="Pet" className="object-cover w-full h-full" />}
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}>翻訳指示をコピー</Button>
                    <Button variant="outline" className="h-12 border-slate-800 font-black uppercase italic w-full" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT (GPT-4o) ↗</Button>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-yellow-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">翻訳結果を戻す</h3></div>
                 <textarea value={translationResult} onChange={(e) => setTranslationResult(e.target.value)} placeholder="AIから届いたペットの言葉をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-lg text-slate-300 focus:border-yellow-500 outline-none font-medium italic font-mono" />
              </div>
            </div>
            {translationResult && (
               <Button onClick={() => setActiveTab('result')} className="w-full h-20 mt-10 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 翻訳メッセージを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'result' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-yellow-500 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Heart className="w-80 h-80 fill-white opacity-20" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><MessageCircle className="text-red-500 animate-pulse w-12 h-12" /> ペットからの手紙</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-xl text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10 font-medium">
                  {translationResult || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setTranslationResult(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初から翻訳する</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500 font-black uppercase italic tracking-widest text-xs opacity-20">Animal Intelligence Hub — NextraLabs 2026</div>
    </div>
  )
}
