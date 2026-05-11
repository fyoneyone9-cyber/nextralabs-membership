'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, TrendingUp, Send, PenTool, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 下書き入力', icon: PenTool },
  { id: 'report', label: '② バズ添削', icon: TrendingUp },
];

export default function BuzzWriter() {
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
  const [draft, setDraft] = useState('');
  const [buzzResult, setBuzzResult] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたはSNSマーケティングの天才です。以下の【投稿の下書き】を分析し、バズるための改善案を出力してください。

1. 【フックの強化】: 1行目でスクロールを止めるための、強烈な書き出し案。
2. 【共感の設計】: 読み手が思わず「保存」したくなる心理的トリガー。
3. 【バズる完成稿】: 拡散されやすい形式に整えた最終稿。

【投稿の下書き】:
${draft || '（未入力）'}`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4">
      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-white uppercase tracking-tight opacity-70">Viral Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight"><span className="text-red-500 ">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-[#050507]">
      <div className="text-center space-y-2">
        <Badge className="bg-red-600 text-white font-bold tracking-tight px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">VIRAL ENGINE</Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter drop-shadow-xl leading-tight">AI バズ文章コーチ</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[500px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-bold text-white uppercase mb-10 flex items-center justify-center gap-4 text-red-500"><PenTool /> ① 下書き入力</h3>
            {renderGuide(['SNS投稿の下書きやネタを入力する', '分析指示をコピーしてAI三台体制へ投げる', 'AIが作成したバズる文章を右のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="SNS投稿案をペースト..." className="w-full h-64 bg-[#050507] border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-red-600 outline-none font-medium shadow-inner leading-relaxed" />
                 {draft && (
                    <div className="space-y-4">
                       <Button onClick={() => { handleCopy(FINAL_PROMPT); }} className={`w-full h-12 font-bold rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>バズ指示をコピー</Button>
                       <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase " onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase " onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase " onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       </div>
                    </div>
                 )}
              </div>
              <div className="bg-[#050507] rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-red-500" /><h3 className="text-xl font-bold text-white uppercase tracking-tighter">AIの添削を戻す</h3></div>
                 <textarea value={buzzResult} onChange={(e) => setBuzzResult(e.target.value)} placeholder="AIからの回答をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-red-600 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {buzzResult && (
               <Button onClick={() => setActiveTab('report')} className="w-full h-20 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase text-xl group">
                  ② バズ文章を確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'report' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-red-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><TrendingUp className="w-80 h-80" /></div>
               <h3 className="text-4xl font-bold text-white uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Sparkles className="text-yellow-500 animate-pulse w-12 h-12" /> バズ文章完成レポート</h3>
               <div className="bg-[#050507] rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner relative z-10 font-medium">
                  {buzzResult || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setDraft(''); setBuzzResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-12 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-bold rounded-2xl uppercase "><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
