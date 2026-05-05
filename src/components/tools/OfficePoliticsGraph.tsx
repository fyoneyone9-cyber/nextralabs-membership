'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, Network, ShieldAlert, Target, FileSpreadsheet, Upload, Loader2, Share2, Download, HelpCircle, FileText, FileSearch, Camera, Monitor
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

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
          // 🔴 OPTIMIZED CONTRAST FOR DARK MODE (BLACK TEXT ON BRIGHT NODES)
          m.initialize({ 
            startOnLoad: false, 
            theme: 'base', 
            securityLevel: 'loose',
            themeVariables: {
              primaryColor: '#818cf8', // Node background
              primaryTextColor: '#000', // 🔴 FORCE BLACK TEXT FOR NODES
              primaryBorderColor: '#312e81',
              lineColor: '#6366f1',
              secondaryColor: '#f472b6',
              tertiaryColor: '#fb923c',
              mainBkg: '#020617',
              nodeBorder: '#1e293b',
              textColor: '#fff', // Arrows/Label text
              edgeLabelBackground: '#1e293b'
            }
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
      canvas.width = img.width + 100;
      canvas.height = img.height + 100;
      if (ctx) {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50);
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

  const FINAL_PROMPT = `あなたは組織政治のプロコンサルタントです。\n以下の【ログデータ】を分析し、主要派閥、キーマン、立ち回り方をリアルに詳しく出力し、最後にMermaid.js形式のgraph TDコード（日本語ノードは A["名前"] の形式）を作成してください。\n\n【データ】:\n${csvData.substring(0, 2000)}`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)]">INTELLIGENCE TERMINAL</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Office Lens AI</h1>
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
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3 relative z-10"><FileSpreadsheet className="text-indigo-500" /> ① 解析依頼</h3>
            <div className="grid lg:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-6">
                {!file ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop CSV</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-indigo-600/30 rounded-3xl p-6 space-y-6 text-center shadow-xl">
                    <p className="text-white font-black truncate">{file.name}</p>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>解析指示をコピー</Button>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-6 shadow-2xl">
                 <textarea value={analysisReport} onChange={(e) => setAnalysisReport(e.target.value)} placeholder="分析レポートを貼る..." className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none" />
                 <textarea value={mermaidCode} onChange={(e) => setMermaidCode(e.target.value)} placeholder="Mermaidコードを貼る..." className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-4 text-[10px] text-slate-300 focus:border-emerald-500 outline-none font-mono" />
              </div>
            </div>
            {mermaidCode && <Button onClick={() => setActiveTab('graph')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 相関図を表示する <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}

        {activeTab === 'graph' && (
          <div className="space-y-8 animate-in fade-in zoom-in">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl h-fit border-l-4 border-l-indigo-500">
                 <h3 className="text-xl font-black text-white uppercase italic mb-6">分析レポート</h3>
                 <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 h-[550px] overflow-y-auto text-xs text-slate-300 leading-relaxed whitespace-pre-wrap italic shadow-inner">
                    {analysisReport || "（レポート未入力）"}
                 </div>
              </Card>

              <Card className="lg:col-span-2 bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl relative border-l-4 border-l-emerald-500">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-2"><Network className="text-emerald-500" /> 組織相関図</h3>
                    <Button onClick={handleDownloadImage} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl h-10 px-4 text-xs italic flex items-center gap-2 shadow-lg"><Download className="w-4 h-4" /> PNG保存</Button>
                 </div>
                 <div className="bg-slate-950 rounded-[2.5rem] p-10 min-h-[550px] flex items-center justify-center border-4 border-slate-800 shadow-inner overflow-x-auto relative">
                    {/* 🔴 FORCE BLACK TEXT FOR RENDERED NODES */}
                    <div key={mermaidCode} ref={mermaidRef} className="mermaid w-full text-center relative z-10 text-black">
                      {mermaidCode}
                    </div>
                 </div>
              </Card>
            </div>
            <Button onClick={() => { setMermaidCode(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 解析し直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
