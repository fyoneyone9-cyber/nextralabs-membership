'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Utensils, ChefHat, Camera, Loader2, Download, FileImage } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 食材スキャン', icon: Camera },
  { id: 'recipe', label: '② 絶品レシピ', icon: ChefHat },
];

export default function AiRecipeScope() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recipeResult, setRecipeResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const useSample = () => {
    const sampleUrl = "https://membership-site-nextralabos.vercel.app/samples/fridge-sample.jpg";
    setImage(sampleUrl);
    const a = document.createElement("a"); a.href = sampleUrl; a.download = "recipe_sample_image.jpg"; a.click();
    alert("サンプル画像を保存しました。これをAIへ投げて指示を貼り付けてください！");
  };

  const FINAL_PROMPT = `あなたはミシュランシェフです。添付された写真を分析し、食材リスト、3つの提案、詳細レシピを出力してください。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-orange-600/50 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-orange-500 uppercase italic tracking-widest opacity-70">Cooking Protocol</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-lg text-slate-300 font-bold flex items-center gap-2"><span className="text-orange-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-orange-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">GOURMET ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">AI Recipe Scope</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[500px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-orange-500"><Utensils /> ① 食材スキャン</h3>
            {renderGuide(['冷蔵庫の写真をアップロード', '指示をコピーしてAIへ投げ、画像をドロップ', 'AIが作ったレシピを右のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-14 w-14 text-slate-700 group-hover:text-orange-500 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase">Drop Ingredients</p>
                    </div>
                    <Button onClick={useSample} variant="outline" className="w-full border-slate-800 text-slate-400 font-black italic h-16 rounded-2xl hover:bg-slate-800 flex items-center justify-center gap-3 uppercase"><Download className="w-5 h-5" /> サンプルを保存して試す</Button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in zoom-in">
                    <div className="relative aspect-square max-w-[450px] mx-auto rounded-3xl overflow-hidden border-4 border-orange-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Target" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-orange-600 text-white hover:bg-orange-500'}`}>レシピ指示をコピー</Button>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-orange-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">AIのレシピを戻す</h3></div>
                 <textarea value={recipeResult} onChange={(e) => setRecipeResult(e.target.value)} placeholder="AIから届いたレシピをここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:border-orange-500 outline-none font-mono" />
              </div>
            </div>
            {recipeResult && <Button onClick={() => setActiveTab('recipe')} className="w-full h-20 mt-8 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 絶品レシピを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'recipe' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-orange-600 text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><ChefHat className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Sparkles className="text-orange-500 animate-pulse w-12 h-12" /> 魔法のレシピレポート</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10">{recipeResult || "レシピがありません。"}</div>
            </Card>
            <Button onClick={() => { setImage(null); setRecipeResult(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の料理を作る</Button>
          </div>
        )}
      </div>
    </div>
  )
}
