'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Shirt, Trash2, Sparkles, Download, Camera } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 洋服スキャン', icon: Shirt },
  { id: 'coach', label: '② 断捨離コーチ', icon: Trash2 },
];

export default function ClosetCoach() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [coachAdvice, setCoachAdvice] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const FINAL_PROMPT = `あなたはミニマリズムとファッションに精通したクローゼットコーチです。
添付された【洋服の写真】を分析し、以下の3点を出力してください。

1. 【ときめき判定】: デザイン、状態、流行の観点から「残すべきか」を評価。
2. 【断捨離の助言】: 手放すべき理由、または使い続けるための手入れ方法。
3. 【着回し提案】: これを活かすための最適なコーディネート案。

不要な服を捨て、人生を軽量化するためのアドバイスをお願いします。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-center gap-4 shadow-xl">
      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-white uppercase tracking-tight">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2"><span className="text-red-500 ">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-[#050507]">
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-600 text-white font-bold px-4 py-1 text-[10px] uppercase rounded-full">MINIMALIST ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-bold text-white uppercase tracking-tighter leading-tight drop-shadow-xl">AI 断捨離コーチ</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-bold text-white uppercase mb-10 flex items-center gap-3"><Shirt className="text-emerald-500" /> ① 洋服スキャン</h3>
            {renderGuide(['洋服を撮影・アップロード', '指示をコピーしてAIへ投げ、画像をドロップ', 'AIの診断結果を右のエリアへ戻す'])}
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-[#050507] cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" /><p className="text-lg text-slate-500 font-bold uppercase">Drop Item Photo</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[300px] mx-auto rounded-3xl overflow-hidden border-4 border-emerald-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Target" className="object-contain w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-12 font-bold rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-white text-black'}`}>コーチング指示をコピー</Button>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase " onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase " onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase " onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-[#050507] rounded-[3rem] p-10 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-8 w-8 text-emerald-500" /><h3 className="text-2xl font-bold text-white uppercase tracking-tighter">AIの診断を戻す</h3></div>
                 <textarea value={coachAdvice} onChange={(e) => setCoachAdvice(e.target.value)} placeholder="AIのアドバイスをここにペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:border-emerald-500 outline-none font-mono" />
              </div>
            </div>
            {coachAdvice && (
               <Button onClick={() => setActiveTab('coach')} className="w-full h-20 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase text-xl group">
                  ② コーチの結論を確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'coach' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-emerald-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Trash2 className="w-80 h-80" /></div>
               <h3 className="text-4xl font-bold text-white uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Sparkles className="text-emerald-500 animate-pulse w-12 h-12" /> AI断捨離レポート</h3>
               <div className="bg-[#050507] rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner relative z-10">
                  {coachAdvice || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setCoachAdvice(''); setActiveTab('input'); }} variant="outline" className="w-full h-12 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-bold rounded-2xl uppercase "><RotateCcw className="mr-2 h-5 w-5" /> 別の服を診断する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
