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
  { id: 'result', label: '② 翻訳結果', icon: MessageCircle },
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
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setTimeout(() => setIsProcessing(false), 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const FINAL_PROMPT = `あなたはアニマル・コミュニケーションの第一人者です。
添付された【ペットの写真・動画】から、以下の「7種類の感情（幸せ、寂しい、空腹、甘えたい、警戒、退屈、眠い）」のどれに該当するかを特定し、以下の3点を出力してください。

1. 【翻訳された言葉】: ペットが今あなたに伝えたがっている「人間の言葉」でのメッセージ。
2. 【感情の根拠】: 耳、瞳、しっぽ、毛並みの状態から読み取れる心理的サイン。
3. 【今すぐしてあげること】: ペットの幸福度を最大にするための具体的なアクション。

愛する家族の心の声を、優しく専門的に代弁してください。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
      <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-6 h-6 text-yellow-500" /></div>
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-yellow-500 uppercase italic tracking-widest">Animal Communication Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-sm text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-yellow-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-yellow-500 text-black font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">PET EMOTION SCANNER</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Pet Translator</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-yellow-500 text-black shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-yellow-500"><Camera className="w-10 h-10" /> ① 感情スキャン</h3>
            {renderGuide(['ペットの今現在の様子を撮影してアップロード', 'AIへの翻訳指示をコピーして投げる', 'AIから返ってきた「ペットの言葉」を右に戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" /><Upload className="h-14 w-14 text-slate-700 group-hover:text-yellow-500 mx-auto mb-6" /><p className="text-2xl text-slate-500 font-black italic uppercase">Scan My Pet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[400px] mx-auto rounded-3xl overflow-hidden border-4 border-yellow-500/30 shadow-2xl bg-black flex items-center justify-center">
                       <img src={image} alt="Pet" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}>翻訳指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-yellow-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">翻訳結果を戻す</h3></div>
                 <textarea value={translationResult} onChange={(e) => setTranslationResult(e.target.value)} placeholder="AIから届いた心の声をペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-base text-slate-300 focus:border-yellow-500 outline-none font-medium leading-relaxed italic" />
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
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-yellow-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Heart className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><MessageCircle className="text-red-500 animate-pulse w-12 h-12" /> ペットからの手紙</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10">
                  {translationResult || "メッセージがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setTranslationResult(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別のシーンを翻訳する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
