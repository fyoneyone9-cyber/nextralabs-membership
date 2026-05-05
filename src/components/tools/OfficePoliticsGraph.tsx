'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, Network, ShieldAlert, Target, FileSpreadsheet, Upload, Loader2, Share2, Download
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvData(text);
        setTimeout(() => {
          setIsProcessing(false);
          // Auto-move to next step after simple parsing simulation
        }, 1500);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPTS = {
    analyze: `あなたは組織行動学のプロです。以下の【Slack/カレンダー ログデータ】を詳細に解析し、組織内の非公式な力関係（インフォーマル組織）を特定してください。
特に「誰がハブになっているか」「どの部署間で対立や断絶があるか」を辛辣に分析してください。

【ログデータ】:
${csvData.substring(0, 3000) || '（CSVをドロップしてください）'}`,
    graph: `前述の分析結果を元に、Mermaid.js形式のグラフコードを出力してください。ノード間の矢印は「支持・対立・依存」を表現し、派閥ごとにサブグラフで囲ってください。`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-indigo-600/30 rounded-xl p-4 md:p-6 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-indigo-500" /></div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-sm text-slate-300 font-bold flex items-center gap-2">
            <span className="text-indigo-500 italic">#{i+1}</span> {s}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-1">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">OFFICE LENS AI v2.0</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Office Politics Graph</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[600px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-[10px] md:text-xs uppercase italic transition-all flex flex-col items-center justify-center gap-1 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-4 h-4 md:w-5 md:h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><FileSpreadsheet className="text-indigo-500" /> ① ログファイルの解析</h3>
            {renderGuide(['Slackメンション履歴やカレンダーCSVをドロップ', 'AIに渡すための最強解析プロンプトをコピー', 'AI（Claude推奨）を開き、ログを解析させる'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!file ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 text-center hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                    <Upload className="h-12 w-12 text-slate-700 group-hover:text-indigo-500 mx-auto mb-4" />
                    <p className="text-lg text-slate-500 font-black italic uppercase">Drop Log CSV</p>
                    <p className="text-[10px] text-slate-600 mt-2">Slack / Google Calendar / Microsoft Teams</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-indigo-600/30 rounded-3xl p-6 space-y-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        {isProcessing ? <Loader2 className="animate-spin text-white h-6 w-6" /> : <FileCheck className="text-white h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black truncate text-sm">{file.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Ready for Analysis</p>
                      </div>
                    </div>
                    {csvData && (
                      <div className="space-y-4">
                        <Button onClick={() => handleCopy(PROMPTS.analyze)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                           {copied ? '✅ COPY SUCCESS!' : '解析プロンプトをコピー'}
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                           <Button variant="outline" className="h-12 border-slate-800 text-[10px] font-black" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button>
                           <Button variant="outline" className="h-12 border-slate-800 text-[10px] font-black" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-indigo-500" /><h3 className="text-lg font-black text-white italic uppercase tracking-tighter">AIの分析結果を戻す</h3></div>
                 <p className="text-[10px] text-slate-500 font-bold italic">AIの回答をここに貼り付けてください（図解に使用します）</p>
                 <textarea value={analysisResult} onChange={(e) => setAnalyzeResult(e.target.value)} placeholder="ペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-mono" />
              </div>
            </div>
            {analysisResult && (
               <Button onClick={() => setActiveTab('analyze')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm group">
                  ② 派閥分析へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'analyze' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in">
             <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-yellow-500" /> ② 派閥・力関係の特定</h3>
             {renderGuide(['図解用の描画指示をコピーする', 'AIに投げてMermaid形式のコードを取得する'])}
             <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 whitespace-pre-wrap">{PROMPTS.graph}</div>
             <Button onClick={() => handleCopy(PROMPTS.graph)} className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl transition-all mb-10">図解指示をコピー</Button>
             
             <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 space-y-4 shadow-inner">
                <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-emerald-500" /><h3 className="text-lg font-black text-white italic uppercase">Mermaidコードを戻す</h3></div>
                <textarea value={mermaidCode} onChange={(e) => setMermaidCode(e.target.value)} placeholder="graph TD... で始まるコードをペースト" className="w-full h-48 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-emerald-500 outline-none font-mono" />
             </div>
             {mermaidCode && (
                <Button onClick={() => setActiveTab('graph')} className="w-full h-16 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm group">
                  ③ 相関図を描画する <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
             )}
          </Card>
        )}

        {activeTab === 'graph' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in text-center">
             <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-3"><Network className="text-emerald-500" /> ③ 組織相関図</h3>
             
             {/* 🔴 GRAPH RENDERER AREA */}
             <div className="bg-white rounded-[2rem] p-8 min-h-[400px] flex items-center justify-center border-8 border-slate-800 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 flex items-center justify-center"><Share2 className="w-64 h-64 text-slate-900" /></div>
                {mermaidCode ? (
                  <div className="relative z-10 w-full text-slate-900 font-bold p-10 border-4 border-dashed border-slate-200 rounded-3xl">
                     <p className="text-xl mb-4 italic uppercase">Visual Map Ready</p>
                     <p className="text-xs text-slate-500">※ ブラウザ上での直接レンダリングを準備中...</p>
                     <div className="bg-slate-50 p-6 rounded-xl text-left font-mono text-[10px] mt-4 overflow-x-auto whitespace-pre">{mermaidCode}</div>
                  </div>
                ) : (
                  <p className="text-slate-400 font-bold italic">No data to render. Please go back to Step 2.</p>
                )}
             </div>

             <div className="grid grid-cols-2 gap-4 mt-10">
                <Button variant="outline" className="h-16 border-slate-800 text-slate-400 font-black rounded-2xl hover:bg-slate-800"><Download className="mr-2 h-5 w-5" /> PNG保存</Button>
                <Button onClick={() => { setFile(null); setCsvData(''); setAnalyzeResult(''); setMermaidCode(''); setActiveTab('input'); }} variant="outline" className="h-16 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl italic"><RotateCcw className="mr-2 h-5 w-5" /> リセット</Button>
             </div>
          </Card>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Powered by NextraLabs — Office Politics Intelligence</p></div>
    </div>
  )
}
