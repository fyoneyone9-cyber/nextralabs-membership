'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Share2, Send, Hash, Calendar, Clock
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 投稿内容案', icon: Share2 },
  { id: 'optimize', label: '② 投稿最適化', icon: Zap },
];

export default function SnsAutoPoster() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [contentDraft, setContentDraft] = useState('');
  const [optimizedResult, setOptimizedResult] = useState('');

  const FINAL_PROMPT = `あなたはSNS運用代行のプロフェッショナルです。
以下の【投稿案】を元に、インプレッションとエンゲージメントを最大化するためのセットを作成してください。

1. 【最適化された本文】: X(Twitter)なら140字以内、Instagramなら改行を活かした長文など、プラットフォームに合わせた最適化。
2. 【最強ハッシュタグ】: 検索ボリュームと関連性を考慮した15個のタグ。
3. 【投稿予約アドバイス】: ターゲット層が最も反応する曜日と時間帯の指定。

【投稿案】:
${contentDraft || '（ここに投稿したい内容のメモを入力してください）'}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">SOCIAL AUTOMATION</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">SNS 自動投稿支援</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Share2 className="text-red-500" /> ① 投稿内容案</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={contentDraft} onChange={(e) => setContentDraft(e.target.value)} placeholder="投稿したい内容のメモを入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-red-500 outline-none font-medium shadow-inner" />
                 {contentDraft && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>最適化指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-red-500" /><h3 className="text-lg font-black text-white italic uppercase">最適化結果を戻す</h3></div>
                 <textarea value={optimizedResult} onChange={(e) => setOptimizedResult(e.target.value)} placeholder="AIからの回答をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-red-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {optimizedResult && <Button onClick={() => setActiveTab('optimize')} className="w-full h-16 mt-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 投稿最適化セットを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'optimize' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-red-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Send className="text-emerald-500 animate-pulse" /> 最強SNS投稿セット</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{optimizedResult || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setContentDraft(''); setOptimizedResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 次の投稿を準備する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
