'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, MessageSquare, Send, Ghost, CheckCircle2
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 相談入力', icon: MessageSquare },
  { id: 'result', label: '② 塩対応生成', icon: Ghost },
];

export default function ShioTaiou() {
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
  const [trouble, setTrouble] = useState('');
  const [shioResult, setShioResult] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたは「塩対応」のプロフェッショナルです。
以下の【相手からのメッセージや状況】に対し、相手の期待を適当にいなしつつ、これ以上踏み込ませない「完璧な塩対応」を出力してください。

【状況】:
${trouble || '（未入力）'}

【出力形式】:
1. 【心の声】: あなたが本当に思っている毒舌な本音。
2. 【塩対応の返信案】: 短く、素っ気なく、しかし拒絶は明確な3パターン。
3. 【フェードアウトのコツ】: 今後どうやってこの相手をいなすべきか。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Salty Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2 leading-tight"><span className="text-slate-500 ">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-[#050507]">
      <div className="text-center space-y-2">
        <Badge className="bg-slate-800 text-white font-bold tracking-tight px-4 py-1 text-[10px] uppercase rounded-full">INTERPERSONAL DEFENSE</Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl">塩対応 AI</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-slate-200 text-slate-950 shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-bold text-white uppercase mb-8 flex items-center gap-3"><MessageSquare className="text-slate-400" /> ① 状況入力</h3>
            {renderGuide(['しつこい誘いや面倒な相談内容を入力', '塩対応指示をコピーしてAIへ投げ、いなさせる', 'AIの冷徹な回答を右のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={trouble} onChange={(e) => setTrouble(e.target.value)} placeholder="例：あまり仲良くない知人から、週末の強引な誘いメールが来た..." className="w-full h-64 bg-[#050507] border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-slate-500 outline-none font-medium shadow-inner" />
                 {trouble && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-12 font-bold rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-950 hover:bg-white'}`}>塩対応指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-bold uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                       </div>
                    </div>
                 )}
              </div>
              <div className="bg-[#050507] rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-slate-400" /><h3 className="text-lg font-bold text-white uppercase">AIのいなしを戻す</h3></div>
                 <textarea value={shioResult} onChange={(e) => setShioResult(e.target.value)} placeholder="AIからの塩対応案をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-slate-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {shioResult && <Button onClick={() => setActiveTab('result')} className="w-full h-12 mt-8 bg-slate-200 hover:bg-white text-slate-950 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase group">② 最終回答を確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'result' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-slate-400 text-left">
               <h3 className="text-3xl font-bold text-white uppercase mb-8 flex items-center justify-center gap-3"><Ghost className="text-slate-400 animate-pulse" /> 塩対応・撃退レポート</h3>
               <div className="bg-[#050507] rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner ">{shioResult || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setTrouble(''); setShioResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-12 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-bold rounded-2xl uppercase "><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
