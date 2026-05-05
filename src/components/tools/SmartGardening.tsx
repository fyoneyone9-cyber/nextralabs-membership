'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, ClipboardPaste, Flower2, Droplets, Sun, ThermometerSun
} from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 植物スキャン', icon: Flower2 },
  { id: 'advice', label: '② 水やり診断', icon: Droplets },
];

export default function SmartGardening() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gardenAdvice, setGardenAdvice] = useState('');
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

  const FINAL_PROMPT = `あなたは植物学と園芸に精通したボタニカルアドバイザーです。
添付された【植物の写真】を分析し、以下の3点を出力してください。

1. 【植物の種類と元気度】: 植物名を特定し、現在の健康状態を100点満点で評価。
2. 【水やり判定】: 写真の土の状態や葉の様子から、今すぐ水が必要か、数日後で良いか判定。
3. 【トラブルシューティング】: 葉の変色や害虫の兆候があれば指摘し、改善策を提示してください。

植物が生き生きと育つための、愛のあるアドバイスをお願いします。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-green-600/30 rounded-xl p-4 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-green-500" /></div>
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest italic">Gardener Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-green-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-green-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">BOTANICAL ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI 水やり守護神</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-green-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Flower2 className="text-green-500" /> ① 植物スキャン</h3>
            {renderGuide(['植物（土の状態含む）を撮影・アップロード', 'AIへの診断指示をコピーして投げる', 'AIのアドバイスを右のエリアへ戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 group-hover:text-green-500 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop Plant Photo</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[300px] mx-auto rounded-3xl overflow-hidden border-4 border-green-600/30 shadow-2xl">
                       <img src={image} alt="Target Plant" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full h-8 w-8">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-green-600 text-white'}`}>診断指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>GPT-4o</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-green-500" /><h3 className="text-lg font-black text-white italic uppercase">AIの診断結果を戻す</h3></div>
                 <textarea value={gardenAdvice} onChange={(e) => setGardenAdvice(e.target.value)} placeholder="AIからのアドバイスをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-green-500 outline-none font-medium shadow-inner" />
              </div>
            </div>
            {gardenAdvice && (
               <Button onClick={() => setActiveTab('advice')} className="w-full h-16 mt-8 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">
                  ② 守護神の助言を確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'advice' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-green-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Sun className="text-yellow-500 animate-pulse" /> 守護神のボタニカル・レポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">
                  {gardenAdvice || "助言がありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setGardenAdvice(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の植物を診る</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Green Guardian — NextraLabs 2026</p></div>
    </div>
  )
}
