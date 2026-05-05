'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, Network, ShieldAlert, Target, FileSpreadsheet, Upload, Loader2, Share2, Download, HelpCircle, FileText, FileSearch, Camera, Monitor, CheckCircle2, Search, ShieldCheck
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
  const [analysisReport, setAnalysisReport] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  // 憲法：工程の定義
  const STEPS = ["データ準備", "AI解析依頼", "相関図生成", "最終判定"];
  const activeStepIndex = activeTab === 'input' ? (file ? 1 : 0) : (mermaidCode ? 3 : 2);

  // 憲法：自動スコアリング演出
  useEffect(() => {
    if (analysisReport && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(60 + Math.floor(Math.random() * 35));
        setIsProcessing(false);
      }, 1500);
    }
  }, [analysisReport]);

  useEffect(() => {
    if (activeTab === 'graph' && mermaidCode) {
      const renderGraph = async () => {
        const scriptId = 'mermaid-cdn-script';
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
          script.async = true;
          document.body.appendChild(script);
          await new Promise(resolve => script.onload = resolve);
        }

        const m = (window as any).mermaid;
        if (m) {
          m.initialize({ 
            startOnLoad: false, 
            theme: 'default', 
            securityLevel: 'loose',
            fontFamily: 'sans-serif'
          });
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = mermaidCode;
            mermaidRef.current.removeAttribute('data-processed');
            try { await m.run({ nodes: [mermaidRef.current] }); } catch (e) { console.error(e); }
          }
        }
      };
      renderGraph();
    }
  }, [activeTab, mermaidCode]);

  const handleDownloadImage = () => {
    if (!mermaidRef.current) return;
    const svg = mermaidRef.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a"); a.href = pngUrl; a.download = "politics_map.png"; a.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => { setCsvData(event.target?.result as string); setTimeout(() => setIsProcessing(false), 800); };
      reader.readAsText(selectedFile);
    }
  };

  const useSample = () => {
    setIsProcessing(true);
    const sample = "Date,From,To,Action\n2026-05-01,部長A,課長B,Meeting\n2026-05-01,課長B,新人C,Mention\n2026-05-02,部長A,人事D,Private";
    setCsvData(sample);
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "office_politics_sample.csv";
    a.click();
    setTimeout(() => {
      setFile(new File([blob], "sample_log.csv", { type: "text/csv" }));
      setIsProcessing(false);
    }, 800);
  };

    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-indigo-400 uppercase italic tracking-widest opacity-70">Operation Guide</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2 md:gap-4 leading-tight"><span className="text-indigo-600 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  const FINAL_PROMPT = `あなたは組織心理学と社内政治のプロコンサルタントです。\n以下の【ログデータ】を分析し、派閥・キーマン・裏の力関係をリアルに出力し、最後にMermaid.js形式のgraph TDコード（日本語ノード名 A["名前"] の形式）を作成してください。\n\n【データ】:\n${csvData.substring(0, 2000)}`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)]">ORGANIZATION INTELLIGENCE TERMINAL</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Office Lens AI</h1>
      </div>

      {/* 憲法：全体工程プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-xs transition-all duration-500 ${i <= activeStepIndex ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase italic tracking-tighter transition-colors ${i <= activeStepIndex ? 'text-indigo-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
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
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><FileSpreadsheet className="text-indigo-500" /> ① 解析依頼</h3>
            {renderGuide(['ログCSVを準備（下のボタンでサンプル保存可能）', 'ファイルをドロップして解析準備完了', '最強プロンプトをAI三台体制へ投げよう'])}
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!file ? (
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner group" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4 group-hover:text-indigo-500" /><p className="text-lg text-slate-500 font-black italic uppercase">ログCSVをドロップ</p>
                    </div>
                    <Button onClick={useSample} variant="outline" className="w-full h-16 border-slate-800 text-slate-400 font-black italic rounded-2xl hover:bg-slate-800 flex items-center justify-center gap-3 uppercase">
                      <Download size={20} /> サンプルCSVを保存して試す
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-indigo-600/30 rounded-3xl p-6 space-y-6 text-center shadow-xl">
                    <p className="text-white font-black truncate">{file.name}</p>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white shadow-lg'}`}>解析指示をコピー</Button>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                       <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-6 shadow-inner flex flex-col justify-center relative overflow-hidden">
                 {score && <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-3xl animate-in fade-in" />}
                 <div className="flex justify-between items-center relative z-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase italic tracking-widest">Intelligence Report</p>
                    {score && <div className="text-right leading-none"><span className="text-[8px] font-black text-indigo-400 uppercase italic">Politics Score</span><br/><span className="text-3xl font-black text-white italic">{score}%</span></div>}
                 </div>
                 <textarea value={analysisReport} onChange={(e) => setAnalysisReport(e.target.value)} placeholder="解析レポートを貼る.." className="w-full h-32 bg-slate-900 border-2 border-slate-800 rounded-xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-medium relative z-10 italic" />
                 <textarea value={mermaidCode} onChange={(e) => setMermaidCode(e.target.value)} placeholder="Mermaidコードを貼る.." className="w-full h-32 bg-slate-900 border-2 border-slate-800 rounded-xl p-4 text-[10px] text-slate-300 focus:border-emerald-500 outline-none font-mono relative z-10" />
                 {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-20"><Loader2 className="animate-spin text-indigo-500" /></div>}
              </div>
            </div>
            {mermaidCode && <Button onClick={() => setActiveTab('graph')} className="w-full h-20 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group text-xl">② 相関図を表示する <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></Button>}
          </Card>
        )}

        {activeTab === 'graph' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl h-fit border-l-4 border-l-indigo-500">
                 <h3 className="text-xl font-black text-white uppercase italic mb-6 flex justify-between items-center">解析レポート {score && <span className="text-indigo-400">{score}%</span>}</h3>
                 <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 h-[550px] overflow-y-auto text-xs text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner italic">
                    {analysisReport || "（レポート未入力）"}
                 </div>
              </Card>

              <Card className="lg:col-span-2 bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl relative border-l-4 border-l-emerald-500">
                 <div className="flex justify-between items-center mb-6 px-4">
                    <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-2"><Network className="text-emerald-500" /> 組織相関図</h3>
                    <Button onClick={handleDownloadImage} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl h-12 px-6 text-sm italic flex items-center gap-2 shadow-lg transition-all active:scale-95"><Download className="w-5 h-5" /> PNG保存</Button>
                 </div>
                 <div className="bg-white rounded-[2.5rem] p-10 min-h-[550px] flex items-center justify-center border-8 border-slate-800 shadow-inner overflow-x-auto relative">
                    <div key={mermaidCode} ref={mermaidRef} className="mermaid w-full text-center text-black">
                      {mermaidCode}
                    </div>
                 </div>
              </Card>
            </div>

            {/* 出口（Next Action） */}
            <div className="pt-16 mt-16 border-t border-slate-800 space-y-8 animate-in slide-in-from-bottom-8">
              <h4 className="text-2xl font-black text-white italic uppercase text-center tracking-tighter">Next Strategic Action</h4>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                 <Button onClick={() => { navigator.clipboard.writeText(`${analysisReport}\n\nこの分析結果を踏まえて、今後の立ち回り方や、特定人物への効果的なアプローチ方法を具体的に提案してください。`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="h-24 bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 rounded-3xl font-black italic uppercase flex items-center justify-center gap-5 transition-all group">
                   <div className="p-3 bg-indigo-500/20 rounded-xl group-hover:bg-indigo-500/40"><Target className="text-indigo-500" /></div>
                   <div className="text-left"><p className="text-[10px] opacity-50 uppercase font-black">Strategy A</p><p className="text-lg">攻略プランを練る</p></div>
                 </Button>
                 <Button onClick={() => { setMermaidCode(''); setAnalysisReport(''); setScore(null); setFile(null); setCsvData(''); setActiveTab('input'); }} className="h-24 bg-slate-800 border-2 border-slate-700 hover:border-slate-500 rounded-3xl font-black italic uppercase flex items-center justify-center gap-5 transition-all group">
                   <div className="p-3 bg-slate-500/20 rounded-xl group-hover:bg-slate-500/40"><RotateCcw className="text-slate-500" /></div>
                   <div className="text-left"><p className="text-[10px] opacity-50 uppercase font-black">Reset Flow</p><p className="text-lg">別のログを解析</p></div>
                 </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Organizational Strategy Engine • NextraLabs 2026</p></div>
    </div>
  )
}
