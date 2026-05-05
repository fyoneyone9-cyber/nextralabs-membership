'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Heart, Camera, MessageCircle, Zap, ChevronRight, Loader2, Copy, ExternalLink, Sparkles, Download, RotateCcw, Lightbulb, ClipboardPaste, FileSearch
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 状況取り込み', icon: Camera },
  { id: 'report', label: '② 改善レポート', icon: FileSearch },
];

export default function AiKonkatsuCoach() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalyzeResult] = useState('');
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたは恋愛心理学とマッチングアプリのアルゴリズムに精通した婚活アドバイザーです。
添付された【画像データ】を分析し、以下の3点を出力してください。

1. 【現状分析】: 相手に与えている印象（ポジティブ・ネガティブ両面）
2. 【改善案】: 写真の撮り方、または返信内容の具体的な修正案。
3. 【次の一手】: 成功率を最大化するための具体的アクション。

忖度なしで、最短ルートの戦略を提示してください。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-center gap-4 md:gap-8 shadow-xl">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-6 h-6 md:w-10 md:h-10 text-white" /></div>
      <div className="space-y-1 md:space-y-2">
        <p className="text-sm md:text-xl font-black text-white uppercase italic tracking-[0.1em]">OPERATION GUIDE</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight">
              <span className="flex items-center justify-center w-5 h-5 md:w-7 md:h-7 bg-red-600 text-white rounded-full text-[10px] md:text-sm italic shrink-0 font-black">{i+1}</span> {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">MATCHING ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl">AI 婚活コーチ</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[500px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><Camera className="text-pink-500" /> ① 状況取り込み</h3>
            {renderGuide(['プロフ写真やトーク画面をアップロード', '指示をコピーしてAIへ投げ、画像をドロップ', 'AIのアドバイス結果を右のエリアへ戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 group-hover:text-red-500 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop Situation Photo</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[300px] mx-auto rounded-3xl overflow-hidden border-4 border-red-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Target" className="object-contain w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => handleCopy(FINAL_PROMPT)} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>分析指示をコピー</Button>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="h-12 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-8 w-8 text-red-500" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">AIのアドバイスを戻す</h3></div>
                 <textarea value={analysisResult} onChange={(e) => setAnalyzeResult(e.target.value)} placeholder="分析結果をここにペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:border-emerald-500 outline-none font-mono" />
              </div>
            </div>
            {analysisResult && (
               <Button onClick={() => setActiveTab('report')} className="w-full h-20 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">
                  ② 改善レポートを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'report' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-red-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Heart className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Sparkles className="text-pink-500 animate-pulse w-12 h-12" /> 戦略的改善レポート</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10">
                  {analysisResult || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setAnalyzeResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
