'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Flower2, Droplets, Sun, ThermometerSun, Camera, Loader2, Download
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
添付された【植物の写真（葉の表裏、土の状態、周囲の環境）】を分析し、以下の3点を出力してください。

1. 【植物名と健康スコア】: 種類を特定し、現在の健康状態を100点満点で評価。
2. 【水やり・日照判定】: 今すぐ水が必要か、あるいは水のやりすぎか。日当たりの調整が必要か。
3. 【守護神の処方箋】: 枯れや病気の兆候に対する、今すぐ実行すべき具体的アクション。

植物が生き生きと育つための、愛のある専門的なアドバイスをお願いします。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-green-500/30 rounded-xl p-5 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-6 h-6 text-green-500" /></div>
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-green-500 uppercase italic tracking-widest">Gardener Protocol</p>
        {steps.map((s, i) => (
          <p key={i} className="text-sm text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-green-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-green-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">BOTANICAL ENGINE v2</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Smart Gardening</h1>
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
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-green-500"><Flower2 /> ① 植物スキャン</h3>
            {renderGuide(['枯れそうな場所や土の乾き具合を撮影・アップ', 'AIへの診断指示をコピーして投げる', 'AIのアドバイスを右のエリアへ戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-14 w-14 text-slate-700 group-hover:text-green-500 mx-auto mb-6" /><p className="text-2xl text-slate-500 font-black italic uppercase">Drop Plant Photo</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[400px] mx-auto rounded-3xl overflow-hidden border-4 border-green-600/30 shadow-2xl">
                       <img src={image} alt="Target" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-green-600 text-white hover:bg-green-500'}`}>診断指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-green-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">AIの診断結果を戻す</h3></div>
                 <textarea value={gardenAdvice} onChange={(e) => setGardenAdvice(e.target.value)} placeholder="AIから届いた守護神のアドバイスをペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-base text-slate-300 focus:border-green-500 outline-none font-medium leading-relaxed italic" />
              </div>
            </div>
            {gardenAdvice && (
               <Button onClick={() => setActiveTab('advice')} className="w-full h-20 mt-10 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 守護神の助言を確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'advice' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-green-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Sun className="w-80 h-80 text-yellow-500" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Droplets className="text-blue-500 animate-pulse w-12 h-12" /> 守護神のボタニカル・レポート</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10">
                  {gardenAdvice || "助言がありません。"}
               </div>
               <div className="mt-12 flex gap-4 relative z-10 overflow-x-auto pb-2">
                  <Badge className="bg-blue-600 text-white px-6 py-2 rounded-full font-black italic uppercase"><Droplets className="w-3 h-3 mr-2" /> Water: Normal</Badge>
                  <Badge className="bg-orange-600 text-white px-6 py-2 rounded-full font-black italic uppercase"><Sun className="w-3 h-3 mr-2" /> Sun: High</Badge>
                  <Badge className="bg-red-600 text-white px-6 py-2 rounded-full font-black italic uppercase"><ThermometerSun className="w-3 h-3 mr-2" /> Temp: 24°C</Badge>
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setGardenAdvice(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の植物を診る</Button>
          </div>
        )}
      </div>
    </div>
  )
}
