'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, Network, ShieldAlert, Target, FileSpreadsheet, Upload, Loader2, Share2, Download, HelpCircle, FileJson, FileText
} from 'lucide-react'

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
    const sample = "Date,From,To,Action\n2026-05-01,部長A,課長B,Meeting\n2026-05-01,課長B,新人C,Mention\n2026-05-02,部長A,人事D,Private\n2026-05-02,新人C,課長B,Ask";
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "nextralabs_politics_sample.csv";
    a.click();
  };

  const PROMPTS = {
    analyze: `あなたは組織行動学のプロです。以下の【ログデータ】を分析し、組織のインフォーマルな構造（派閥・ハブ・断絶）を特定してください。\n\n【ログデータ】:\n${csvData.substring(0, 2000)}`,
    graph: `分析結果に基づき、Mermaid.js形式のグラフコードを出力してください。`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-indigo-600/30 rounded-xl p-4 md:p-6 mb-6 flex items-start gap-4 shadow-xl">
      <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-indigo-500" /></div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic flex items-center gap-2">Operation Guide <Button variant="ghost" onClick={() => setShowManual(!showManual)} className="h-4 p-0 text-indigo-400 hover:text-white underline text-[8px]">CSVの出し方はこちら</Button></p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-sm text-slate-300 font-bold flex items-center gap-2"><span className="text-indigo-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-1">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">OFFICE LENS AI</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Politics Intelligence</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[600px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-[10px] md:text-xs uppercase italic transition-all flex flex-col items-center justify-center gap-1 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-4 h-4 md:w-5 md:h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔴 CSV MANUAL OVERLAY */}
      {showManual && (
        <div className="bg-indigo-950/90 border-2 border-indigo-500 rounded-3xl p-6 md:p-10 animate-in zoom-in shadow-2xl space-y-6 mb-8">
           <div className="flex justify-between items-center"><h4 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2"><HelpCircle /> ログCSVの書き出し方法</h4><Button variant="ghost" onClick={() => setShowManual(false)} className="text-white hover:bg-white/10">✕ 閉じる</Button></div>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <p className="font-black text-indigo-300 uppercase text-sm border-b border-indigo-800 pb-2">Slackの場合</p>
                 <ol className="text-xs text-slate-300 space-y-2 list-decimal ml-4 font-bold">
                    <li>左上のワークスペース名をクリック</li>
                    <li>「ツールと設定」→「ワークスペースをカスタマイズ」</li>
                    <li>「アナリティクス」タブからメッセージ数をエクスポート</li>
                 </ol>
              </div>
              <div className="space-y-3">
                 <p className="font-black text-indigo-300 uppercase text-sm border-b border-indigo-800 pb-2">Googleカレンダーの場合</p>
                 <ol className="text-xs text-slate-300 space-y-2 list-decimal ml-4 font-bold">
                    <li>PCでカレンダーの右上「設定（⚙️）」をクリック</li>
                    <li>「インポート/エクスポート」を選択</li>
                    <li>「エクスポート」をクリックしてZIPを取得（中の.icsも読み込めます）</li>
                 </ol>
              </div>
           </div>
        </div>
      )}

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><FileSpreadsheet className="text-indigo-500" /> ① ログファイルの解析</h3>
            {renderGuide(['ログCSVを準備（下のボタンでサンプル取得可）', 'ファイルをドロップして解析準備完了', '最強プロンプトをAIに投げる'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!file ? (
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 text-center hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                      <Upload className="h-12 w-12 text-slate-700 group-hover:text-indigo-500 mx-auto mb-4" />
                      <p className="text-lg text-slate-500 font-black italic uppercase">Drop Log CSV</p>
                    </div>
                    <Button onClick={downloadSample} variant="outline" className="w-full border-slate-800 text-slate-400 font-black italic rounded-xl h-12 hover:bg-slate-800 flex items-center justify-center gap-2">
                       <Download className="w-4 h-4" /> サンプルCSVを取得
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-indigo-600/30 rounded-3xl p-6 space-y-6 shadow-xl text-center">
                    <p className="text-white font-black truncate text-sm">{file.name}</p>
                    <Button onClick={() => handleCopy(PROMPTS.analyze)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>解析プロンプトをコピー</Button>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                    </div>
                    <Button variant="ghost" onClick={() => setFile(null)} className="text-slate-600 text-[10px] uppercase font-black">ファイルを変更</Button>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-indigo-500" /><h3 className="text-lg font-black text-white italic uppercase tracking-tighter">AIの分析結果を戻す</h3></div>
                 <textarea value={analysisResult} onChange={(e) => setAnalyzeResult(e.target.value)} placeholder="ペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-mono" />
              </div>
            </div>
            {analysisResult && (
               <Button onClick={() => setActiveTab('analyze')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic group">
                  ② 派閥分析へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {/* ... ANALYZE & GRAPH TABS REMAIN CONSISTENT (REDACTED) ... */}
        {activeTab === 'analyze' && <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 animate-in fade-in zoom-in text-center"><h3 className="text-4xl font-black text-white italic uppercase mb-10">② 派閥・力関係の特定</h3><div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 whitespace-pre-wrap">{PROMPTS.graph}</div><Button onClick={() => handleCopy(PROMPTS.graph)} className="w-full h-20 bg-indigo-600 text-white font-black rounded-2xl mb-10 shadow-xl">図解指示をコピー</Button><textarea value={mermaidCode} onChange={(e) => setMermaidCode(e.target.value)} placeholder="Mermaidコードをペースト..." className="w-full h-40 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-emerald-500 outline-none font-mono" />{mermaidCode && <Button onClick={() => setActiveTab('graph')} className="w-full h-16 mt-10 bg-emerald-600 text-white font-black rounded-2xl">③ 相関図を描画する →</Button>}</Card>}
        {activeTab === 'graph' && <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center"><h3 className="text-4xl font-black text-white italic uppercase mb-10">③ 組織相関図</h3><div className="bg-white rounded-[2rem] p-8 min-h-[400px] flex items-center justify-center border-8 border-slate-800 shadow-inner"><p className="text-slate-900 font-black italic uppercase text-2xl">Map Displayed Here</p></div><Button onClick={() => setActiveTab('input')} variant="outline" className="w-full h-16 mt-10 border-slate-800 text-slate-500 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2" /> 最初から</Button></Card>}
      </div>
    </div>
  )
}
