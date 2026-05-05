'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, FileText, Layout, FileSearch, Send
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 素材入力', icon: FileText },
  { id: 'report', label: '② レポート完成', icon: Layout },
];

export default function AiReportGenerator() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [rawNotes, setRawNotes] = useState('');
  const [finalReport, setFinalReport] = useState('');

  const FINAL_PROMPT = `あなたはビジネスドキュメンテーションのプロフェッショナルです。
以下の【会議メモ・断片的な情報】を元に、そのまま提出可能な高品質なビジネスレポートを作成してください。

【出力構成】:
1. 【エグゼクティブサマリー】: 結論を1行で。
2. 【現状と課題】: 分析結果をロジカルに整理。
3. 【解決策・ネクストアクション】: 具体的な行動計画と期限。

【会議メモ・断片的な情報】:
${rawNotes || '（ここにメモや録音の文字起こしを入力してください）'}

読みやすく、説得力のあるフォーマルな文章でお願いします。`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-slate-700 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">BUSINESS DOCUMENT ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI レポート作成</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-slate-200 text-slate-950 shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><FileSearch className="text-slate-400" /> ① 素材入力</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={rawNotes} onChange={(e) => setRawNotes(e.target.value)} placeholder="会議のメモや、録音した内容の文字起こしをペースト..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-slate-500 outline-none font-medium shadow-inner" />
                 {rawNotes && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-950 hover:bg-white'}`}>レポート指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-slate-400" /><h3 className="text-lg font-black text-white italic uppercase">完成レポートを戻す</h3></div>
                 <textarea value={finalReport} onChange={(e) => setFinalReport(e.target.value)} placeholder="AIが作成したレポートをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-slate-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {finalReport && <Button onClick={() => setActiveTab('report')} className="w-full h-16 mt-8 bg-slate-200 hover:bg-white text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 完成レポートを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'report' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-slate-400 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Layout className="text-slate-400 animate-pulse" /> 提出用ビジネスレポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{finalReport || "レポートがありません。"}</div>
            </Card>
            <Button onClick={() => { setRawNotes(''); setFinalReport(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
