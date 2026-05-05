'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Share2, Send, Hash, Calendar, Clock, CheckCircle2
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたはSNS運用代行のプロです。以下の【投稿案】を元に、インプレッションと保存数を最大化するためのセットを出力してください。

1. 【プラットフォーム別最適化】: X(140字フック)、Instagram(改行・共感)、TikTok(台本)への書き換え。
2. 【最強タグ・ハッシュタグ】: 関連度の高い15個のタグと、検索で見つかるキーワード。
3. 【投稿予約アドバイス】: 最もエンゲージメントが高まる曜日・時間帯。

【投稿案】:
${contentDraft || '（未入力）'}`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-red-600 uppercase italic tracking-widest opacity-70">Auto Posting Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight"><span className="flex items-center justify-center w-5 h-5 md:w-7 md:h-7 bg-red-600 text-white rounded-full text-[10px] md:text-sm italic shrink-0 font-black">{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">SOCIAL AUTOMATION</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">SNS Auto Poster</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[500px] md:min-w-full rounded-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-red-500"><Share2 /> ① 投稿内容案</h3>
            {renderGuide(['投稿したい内容のメモを入力する', '最適化指示をコピーしてAIに投げる', 'AIが返した最強の投稿セットを右に戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <textarea value={contentDraft} onChange={(e) => setContentDraft(e.target.value)} placeholder="思いついた投稿ネタをペースト..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-red-600 outline-none font-medium shadow-inner leading-relaxed" />
                 {contentDraft && (
                    <div className="space-y-4">
                       <Button onClick={() => handleCopy(FINAL_PROMPT)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>最適化指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                          <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button>
                       </div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-red-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">最適化セットを戻す</h3></div>
                 <textarea value={optimizedResult} onChange={(e) => setOptimizedResult(e.target.value)} placeholder="AIから届いた投稿セットをここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-red-600 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {optimizedResult && (
               <Button onClick={() => setActiveTab('optimize')} className="w-full h-20 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 投稿最適化セットを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'optimize' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-red-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Send className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse w-12 h-12" /> Final Posting Set</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10 font-medium">
                  {optimizedResult || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setContentDraft(''); setOptimizedResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の投稿を準備する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
