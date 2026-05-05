'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, ShieldAlert, ShieldCheck, Zap, ChevronRight, Copy, ExternalLink, Sparkles, Download, RotateCcw, Lightbulb, ClipboardPaste, Search, AlertOctagon, EyeOff
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 証拠提出', icon: Search },
  { id: 'defend', label: '② 詐欺判定', icon: ShieldAlert },
];

export default function ScamDefender() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scamReport, setScamReport] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setTimeout(() => setIsProcessing(false), 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const FINAL_PROMPT = `あなたは最新のネット詐欺、フィッシング詐欺に精通したサイバーセキュリティ専門家です。
添付された【怪しい画像のスクリーンショット】を徹底的に分析し、以下の3点を出力してください。

1. 【詐欺危険度】: 0〜100%で判定。
2. 【手口の解説】: どのような心理的トラップや偽装が行われているか。
3. 【防御指示】: リンクを踏んでしまった場合の対処法や、今後同じ被害に遭わないための対策。

ユーザーが実害を被らないよう、最も安全で具体的な指示を優先してください。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-red-600/30 rounded-xl p-4 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-red-500" /></div>
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Defender Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-red-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]">CYBER DEFENSE SYSTEM</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AI 詐欺ディフェンダー</h1>
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
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3 text-red-500"><AlertOctagon /> ① 証拠提出</h3>
            {renderGuide(['怪しいメール、SMS、サイトのスクショをアップ', 'AIへの緊急解析指示をコピー', 'AIの鑑定結果を右のエリアへ戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Scan Scam</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-video max-w-[400px] mx-auto rounded-2xl overflow-hidden border-4 border-red-600/30 shadow-2xl bg-black flex items-center justify-center">
                       <img src={image} alt="Suspect" className="max-h-full max-w-full object-contain" />
                       <div className="absolute inset-0 bg-red-600/10 pointer-events-none animate-pulse"></div>
                       <Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>緊急解析指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT-4o</Button>
                       <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-red-500" /><h3 className="text-lg font-black text-white italic uppercase tracking-tighter">AIの鑑定結果を戻す</h3></div>
                 <textarea value={scamReport} onChange={(e) => setScamReport(e.target.value)} placeholder="AIの分析結果をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-red-600 outline-none font-medium" />
              </div>
            </div>
            {scamReport && (
               <Button onClick={() => setActiveTab('defend')} className="w-full h-16 mt-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">
                  ② 最終警告を確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'defend' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-red-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><EyeOff className="w-48 h-48" /></div>
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3 relative z-10"><ShieldCheck className="text-emerald-500 animate-pulse" /> 専門家による防御レポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10">
                  {scamReport || "鑑定結果がありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setScamReport(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の案件を鑑定する</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Digital Fortress — NextraLabs 2026</p></div>
    </div>
  )
}
