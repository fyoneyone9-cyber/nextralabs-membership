'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  Repeat, Brain, ListChecks, ShieldAlert, FileText, FileDown, Plus
} from 'lucide-react'

const PRESETS = [
  { id: 'itpass', label: 'ITパスポート', icon: Brain, content: 'ITパスポート試験のシラバスに沿って、テクノロジ・マネジメント・ストラテジの全分野からバランスよく問題を生成してください。' },
  { id: 'fe', label: '基本情報技術者', icon: Zap, content: '基本情報技術者試験（科目A）の過去問傾向を分析し、計算問題とアルゴリズムを中心に問題を生成してください。' },
  { id: 'security', label: '情報安全確保', icon: ShieldAlert, content: '情報処理安全確保支援士試験向けに、最新の脆弱性と攻撃手法に基づいた応用問題を生成してください。' }
];

export default function AiExamGeneratorApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [inputData, setInputData] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [docUrl, setDocUrl] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!inputData) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    setResult("ITパスポート試験のシラバスに基づき、あなたが苦手とする『ネットワーク・セキュリティ』分野の予想問題を30問生成しました。解説付きでGoogleドキュメントへ出力可能です。");
    setIsAnalyzing(false);
  }

  const handleExportDocs = async () => {
    setIsExporting(true);
    // gsk-google-docs 連携シミュレーション
    await new Promise(r => setTimeout(r, 3000));
    setDocUrl('https://docs.google.com/document/d/example');
    setIsExporting(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Brain className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI Exam Generator</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Weakness Analysis & Problem Generation</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg text-[10px]">MASTERMODEL v2.2</Badge>
        </div>

        {/* 活用マニュアル */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            学習したい科目や苦手な分野を入力、または下の雛形から選択してください。AIが試験の出題傾向を分析し、あなたの弱点を克服するための専用問題を無限に生成します。結果は直接Googleドキュメントへ書き出し可能です。
          </p>
        </div>

        {/* 雛形クイック選択 (復旧) */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Exam Template Presets</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setInputData(p.content)}
                className="flex items-center gap-4 bg-[#13141f] border-2 border-white/5 hover:border-emerald-500/50 p-6 rounded-2xl transition-all group text-left"
              >
                <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-emerald-400"><p.icon size={20} /></div>
                <span className="font-black text-sm text-white uppercase italic">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <Card className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden shadow-xl p-8 space-y-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Learning Target / Mock Exam Results</label>
          <textarea 
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full h-48 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all text-lg" 
            placeholder="ここに具体的な悩みや試験名を入力..." 
          />
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !inputData} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10" /> : 'AI弱点分析を開始する 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Diagnostic Insight</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              
              {/* Google Docs 連携ボタン (復活) */}
              <div className="border-t border-emerald-500/20 pt-8 text-center">
                {!docUrl ? (
                  <Button 
                    onClick={handleExportDocs} 
                    disabled={isExporting}
                    className="h-16 px-10 bg-white text-slate-950 font-black text-lg rounded-xl shadow-xl hover:bg-slate-100 transition-all uppercase italic"
                  >
                    {isExporting ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2" />}
                    問題をGoogleドキュメントへ保存
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.open(docUrl)} 
                    className="h-16 px-10 bg-blue-600 text-white font-black text-lg rounded-xl shadow-xl hover:bg-blue-500 transition-all uppercase italic"
                  >
                    <FileDown className="mr-2" /> Googleドキュメントを開く
                  </Button>
                )}
              </div>
            </Card>

            {/* AI Road Map */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Learning Roadmap</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: '弱点特定', desc: '入力データから、合格を妨げている真の「穴」をAIが暴き出します。', icon: Search },
                  { step: '02', title: '特訓問題', desc: '弱点エリアに特化した、試験に出やすい予想問題を自動生成。', icon: ListChecks },
                  { step: '03', title: '克服・合格', desc: 'AIの解説で理解を深め、同類問題の正答率100%を目指します。', icon: TrendingUp },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all group">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400 group-hover:animate-bounce" /></div>
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3大AI外部リンク */}
            <div className="grid grid-cols-3 gap-4">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => window.open(`https://${ai.toLowerCase()}.com`)} className="h-16 bg-white/5 border border-white/10 hover:border-blue-500/50 text-slate-400 hover:text-white font-black italic rounded-2xl transition-all uppercase text-[10px]">Deep Study with {ai}</Button>
              ))}
            </div>

            {/* Amazon収益化 */}
            <a href="https://www.amazon.co.jp/s?k=資格試験+参考書&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">Reference Study Materials</p>
                  <h3 className="text-2xl font-black text-white italic leading-tight">AIが選んだ、あなたの弱点を補完する最強の参考書。</h3>
                </div>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
