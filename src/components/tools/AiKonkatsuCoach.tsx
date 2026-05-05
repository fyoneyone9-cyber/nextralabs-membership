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
添付された【画像データ（プロフィール写真またはトーク履歴）】を分析し、以下の3点を出力してください。

1. 【現状分析】: 相手に与えている印象（ポジティブ・ネガティブ両面）
2. 【改善案】: 写真の撮り方、または返信内容の具体的な修正案。
3. 【次の一手】: 成功率を最大化するための具体的なアクション。

忖度なしで、成婚に向けた最短ルートを提示してください。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-pink-600/30 rounded-xl p-4 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 bg-pink-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-pink-500" /></div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest italic">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-pink-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-pink-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">MATCHING ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AI 婚活コーチ</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Camera className="text-pink-500" /> ① 状況取り込み</h3>
            {renderGuide(['プロフ写真やトーク画面をアップロード', '指示をコピーしてAI三台体制へ投げる', 'AIの回答を右のエリアへ戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-lg text-slate-500 font-black italic uppercase">Drop Photo</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[300px] mx-auto rounded-3xl overflow-hidden border-4 border-pink-600/30 shadow-2xl">
                       <img src={image} alt="Target" className="object-cover w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 p-2 rounded-full h-8 w-8">✕</Button>
                    </div>
                    <Button onClick={() => { handleCopy(FINAL_PROMPT); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-pink-600 text-white'}`}>指示をコピー</Button>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>GPT-4o</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-pink-500" /><h3 className="text-lg font-black text-white italic uppercase tracking-tighter">AIのアドバイスを戻す</h3></div>
                 <textarea value={analysisResult} onChange={(e) => setAnalyzeResult(e.target.value)} placeholder="AIからの改善案をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-pink-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {analysisResult && (
               <Button onClick={() => setActiveTab('report')} className="w-full h-16 mt-8 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">
                  ② 改善レポートを表示 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'report' && (
          <div className="animate-in fade-in zoom-in space-y-8">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-pink-600">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Heart className="text-pink-600 animate-pulse" /> 戦略的改善レポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">
                  {analysisResult || "レポートがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setAnalyzeResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の状況を相談する</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Love Strategy Engine — NextraLabs 2026</p></div>
    </div>
  )
}
