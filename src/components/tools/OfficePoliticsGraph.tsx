'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, Network, ShieldAlert, Target, FileSpreadsheet, Upload, Loader2, Share2, Download, HelpCircle, FileText
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 解析依頼', icon: FileSpreadsheet },
  { id: 'graph', label: '② 相関図表示', icon: Network },
];

export default function OfficePoliticsGraph() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [mermaidCode, setMermaidCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'graph' && mermaidCode) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
      script.async = true;
      script.onload = () => {
        const m = (window as any).mermaid;
        m.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
        m.contentLoaded();
      };
      document.body.appendChild(script);
    }
  }, [activeTab, mermaidCode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target?.result as string);
        setTimeout(() => setIsProcessing(false), 1000);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたは組織政治のプロコンサルタントです。
以下の【ログデータ】を分析し、次の2点を出力してください。

1. 【分析レポート】: 主要な派閥、キーマン、立ち回り方を辛辣に。
2. 【Mermaidコード】: graph TD形式で視覚化したコード（派閥はsubgraph）。

【ログデータ】:
${csvData.substring(0, 3000)}`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-indigo-600/30 rounded-xl p-4 md:p-6 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-indigo-500" /></div>
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
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><FileSpreadsheet className="text-indigo-500" /> ① 解析依頼</h3>
            {renderGuide(['ログCSVを準備', 'ファイルをドロップ', '最強プロンプトをAIに投げる'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!file ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 text-center hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop CSV</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-indigo-600/30 rounded-3xl p-6 space-y-6 text-center shadow-xl">
                    <p className="text-white font-black truncate text-sm">{file.name}</p>
                    <Button onClick={() => handleCopy(FINAL_PROMPT)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>最強プロンプトをコピー</Button>
                    
                    {/* 🔴 CONSTITUTIONAL 3-AI SYSTEM */}
                    <div className="space-y-2">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Open Preferred AI</p>
                       <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-emerald-500" /><h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Mermaidコードを戻す</h3></div>
                 <textarea value={mermaidCode} onChange={(e) => setMermaidCode(e.target.value)} placeholder="graph TD... をペースト" className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-mono" />
              </div>
            </div>
            {mermaidCode && (
               <Button onClick={() => setActiveTab('graph')} className="w-full h-16 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic group">
                  ② 相関図を今すぐ描画する <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'graph' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in text-center">
             <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-3"><Network className="text-emerald-500" /> ② 組織相関図</h3>
             <div className="bg-slate-950 rounded-[3rem] p-10 min-h-[500px] flex items-center justify-center border-4 border-slate-800 shadow-inner relative overflow-hidden overflow-x-auto">
                <div ref={mermaidRef} className="mermaid w-full text-center">
                  {mermaidCode || "graph TD\n  A[No Data] --> B[Check Step 1]"}
                </div>
             </div>
             <Button onClick={() => { setFile(null); setCsvData(''); setMermaidCode(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 mt-10 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </Card>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Office Lens AI — Visual Politics Intelligence 2026</p></div>
    </div>
  )
}
