'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, Network, ShieldAlert, Target, FileSpreadsheet, Upload, Loader2, Share2, Download, HelpCircle, FileJson, FileText, Camera
} from 'lucide-react'

// 🔴 NO EXTERNAL NPM MODULES (TO AVOID BUILD ERROR)
// Using pure Tailwind and HTML for the "One-Way Pipeline" as per Constitution.

const TABS = [
  { id: 'input', label: '① ログ解析', icon: FileSpreadsheet },
  { id: 'analyze', label: '② 派閥分析', icon: Zap },
  { id: 'graph', label: '③ 相関図表示', icon: Network },
];

export default function OfficePoliticsGraph() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [analysisResult, setAnalyzeResult] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target?.result as string);
        setTimeout(() => setIsProcessing(false), 1200);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSample = () => {
    const sample = "Date,From,To,Action\n2026-05-01,部長A,課長B,Meeting\n2026-05-01,課長B,新人C,Mention\n2026-05-02,部長A,人事D,Private";
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = "sample.csv"; a.click();
  };

  const PROMPTS = {
    analyze: `あなたは組織分析のプロです。以下のログデータを分析し、派閥構造を特定してください。\n\n【データ】:\n${csvData.substring(0, 2000)}`,
    graph: `分析結果を元に、Mermaid.js形式のgraph TDコードを出力してください。`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-indigo-600/30 rounded-xl p-4 md:p-6 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-indigo-500" /></div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-sm text-slate-300 font-bold flex items-center gap-2"><span className="text-indigo-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-1">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">OFFICE LENS AI</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Politics Intelligence</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[600px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-[10px] md:text-xs uppercase italic transition-all flex items-center justify-center gap-1 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-4 h-4 md:w-5 md:h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><FileSpreadsheet className="text-indigo-500" /> ① ログ解析</h3>
            {renderGuide(['ログCSVを準備', 'ファイルをドロップして解析準備完了', '最強プロンプトをAIに投げる'])}
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!file ? (
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 text-center hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" /><Upload className="h-12 w-12 text-slate-700 group-hover:text-indigo-500 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop Log CSV</p>
                    </div>
                    <Button onClick={downloadSample} variant="outline" className="w-full border-slate-800 text-slate-400 font-black italic h-12 rounded-xl">サンプルCSVを取得</Button>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-indigo-600/30 rounded-3xl p-6 space-y-6 text-center shadow-xl">
                    <p className="text-white font-black truncate">{file.name}</p>
                    <Button onClick={() => handleCopy(PROMPTS.analyze)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>解析プロンプトをコピー</Button>
                    <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button><Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button></div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 flex flex-col justify-center space-y-4 shadow-2xl">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-indigo-500" /><h3 className="text-lg font-black text-white italic uppercase tracking-tighter">AIの分析結果を戻す</h3></div>
                 <textarea value={analysisResult} onChange={(e) => setAnalyzeResult(e.target.value)} placeholder="ペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-mono" />
              </div>
            </div>
            {analysisResult && <Button onClick={() => setActiveTab('analyze')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 派閥分析へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}

        {activeTab === 'analyze' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 animate-in fade-in zoom-in text-center">
             <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-3"><Zap className="text-yellow-500" /> ② 派閥・力関係の特定</h3>
             {renderGuide(['図解指示をコピー', 'AIに投げてMermaidコードを取得'])}
             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 whitespace-pre-wrap">{PROMPTS.graph}</div>
             <Button onClick={() => handleCopy(PROMPTS.graph)} className="w-full h-20 bg-indigo-600 text-white font-black rounded-2xl mb-10 shadow-xl">図解指示をコピー</Button>
             <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 space-y-4 shadow-inner text-left">
                <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-emerald-500" /><h3 className="text-lg font-black text-white italic uppercase">Mermaidコードを戻す</h3></div>
                <textarea value={mermaidCode} onChange={(e) => setMermaidCode(e.target.value)} placeholder="graph TD... をペースト" className="w-full h-40 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-emerald-500 outline-none font-mono" />
             </div>
             {mermaidCode && <Button onClick={() => setActiveTab('graph')} className="w-full h-16 mt-10 bg-emerald-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">③ 相関図を表示する <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}

        {activeTab === 'graph' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in text-center">
             <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-3"><Network className="text-emerald-500" /> ③ 組織相関図</h3>
             <div className="bg-white rounded-[3rem] p-10 min-h-[500px] flex items-center justify-center border-8 border-slate-800 shadow-inner relative overflow-hidden overflow-x-auto">
                <div className="text-slate-900 font-black italic uppercase text-center space-y-4">
                  <Network className="w-20 h-20 mx-auto text-indigo-600 animate-pulse" />
                  <p className="text-2xl tracking-tighter">Visual Map Engine Active</p>
                  <p className="text-xs text-slate-500 normal-case font-bold">貼り付けられたMermaidコードに基づき、AI側でのレンダリング準備が整いました。</p>
                  <div className="bg-slate-100 p-6 rounded-2xl text-left font-mono text-[10px] border-2 border-slate-200 mt-4 max-w-md mx-auto overflow-x-auto">{mermaidCode}</div>
                </div>
             </div>
             <div className="grid grid-cols-1 gap-4 mt-12">
                <Button onClick={() => { setFile(null); setCsvData(''); setAnalyzeResult(''); setMermaidCode(''); setActiveTab('input'); }} variant="outline" className="h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl italic uppercase"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
             </div>
          </Card>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Office Lens AI — Visual Politics Intelligence 2026</p></div>
    </div>
  )
}
