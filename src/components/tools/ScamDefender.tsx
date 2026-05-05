'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, ShieldAlert, ShieldCheck, Zap, ChevronRight, Copy, ExternalLink, Sparkles, Download, RotateCcw, Lightbulb, ClipboardPaste, Search, AlertOctagon, EyeOff, AlertTriangle
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 証拠提出', icon: Search },
  { id: 'defend', label: '② 詐欺鑑定', icon: ShieldAlert },
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

  const FINAL_PROMPT = `あなたはサイバー犯罪とフィッシング詐欺に精通したセキュリティ専門家です。
添付された【怪しい画像のスクリーンショット】を「120以上の危険キーワード」と「46パターンの犯罪手法」に基づき、以下の3点を出力してください。

1. 【詐欺危険度スコア】: 0〜100%で判定。
2. 【手口の徹底解説】: ドメイン偽装、緊急性の煽り、不自然な日本語、PayPay送金トラップ等の特定。
3. 【鉄壁の防御指示】: リンクを踏んだ場合の即時アクション、および警察への通報手順。

一般ユーザーが最も安全に身を守れるための指示をお願いします。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-red-600/30 rounded-xl p-5 mb-8 flex items-start gap-4">
      <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-6 h-6 text-red-500" /></div>
      <div className="space-y-1 text-left">
        <p className="text-xs font-black text-red-500 uppercase italic tracking-widest">Defense Protocol</p>
        {steps.map((s, i) => (
          <p key={i} className="text-sm text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-red-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]">CYBER DEFENSE v2.0</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Scam Defender</h1>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-red-500"><AlertOctagon className="w-10 h-10" /> ① 証拠提出</h3>
            {renderGuide(['不審なメール、SNS、サイトのスクショをアップロード', '指示をコピーしてAI（Gemini/GPT）に緊急解析を依頼', 'AIの鑑定結果を右側のエリアに戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-16 w-16 text-slate-700 group-hover:text-red-500 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase tracking-widest">Scan Suspect Image</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-video max-w-[450px] mx-auto rounded-3xl overflow-hidden border-4 border-red-600/30 shadow-2xl bg-black flex items-center justify-center">
                       <img src={image} alt="Suspect" className="max-h-full max-w-full object-contain" />
                       <div className="absolute inset-0 bg-red-600/10 pointer-events-none animate-pulse"></div>
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>緊急鑑定指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT (GPT-4o) ↗</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini (Vision) ↗</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-red-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">AIの鑑定結果を戻す</h3></div>
                 <textarea value={scamReport} onChange={(e) => setScamReport(e.target.value)} placeholder="AIからの警告内容をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-red-600 outline-none font-medium" />
              </div>
            </div>
            {scamReport && (
               <Button onClick={() => setActiveTab('defend')} className="w-full h-20 mt-10 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 最終警告を確認する <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'defend' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-red-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 text-white"><ShieldAlert className="w-80 h-84" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><ShieldCheck className="text-emerald-500 animate-pulse w-12 h-12" /> 防御指示書</h3>
               <div className="bg-slate-950 rounded-[2rem] p-10 border border-slate-800 text-base text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10">
                  {scamReport || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setImage(null); setScamReport(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の案件を鑑定する</Button>
          </div>
        )}
      </div>
      <div className="mt-20 text-center opacity-30 text-[10px] font-black italic tracking-widest uppercase">Protecting your digital assets — NextraLabs 2026</div>
    </div>
  )
}
