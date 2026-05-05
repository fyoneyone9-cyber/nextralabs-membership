'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, Building2, UserSearch, Camera
} from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 拾得物スキャン', icon: Camera },
  { id: 'match', label: '② 顧客マッチング', icon: UserSearch },
];

export default function StayseeFinderEngine() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState('');
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

  const FINAL_PROMPT = `あなたはホテル管理システム（PMS）と拾得物管理のプロフェッショナルです。
添付された【忘れ物の写真】を分析し、Stayseeの宿泊履歴と突合するための情報を出力してください。

1. 【拾得物プロファイル】: カテゴリ（衣類、電子機器等）、特徴、ブランド。
2. 【宿泊者プロファイル（推論）】: 忘れ物の傾向から推測される宿泊客の属性（ビジネス、観光、家族、外国人等）。
3. 【Staysee検索クエリ】: PMSで検索すべきキーワード、日付範囲、宿泊場所の候補。

宿泊客へのスムーズな返却を実現するための、正確なデータ抽出をお願いします。`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">HOTEL PMS ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Staysee AI Finder</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><PackageSearch className="text-blue-400" /> ① 拾得物スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop Found Item</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[300px] mx-auto rounded-3xl overflow-hidden border-4 border-blue-600/30 shadow-2xl"><img src={image} alt="Found" className="object-cover w-full h-full" /><Button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full h-8 w-8">✕</Button></div>
                    <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white'}`}>照合指示をコピー</Button>
                    <Button variant="outline" className="w-full h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>GPT-4o (Vision) ↗</Button>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-blue-400" /><h3 className="text-lg font-black text-white italic uppercase">照合結果を戻す</h3></div>
                 <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="AIからの照合レポートをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-blue-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {matchResult && <Button onClick={() => setActiveTab('match')} className="w-full h-16 mt-8 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 顧客マッチングを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'match' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-blue-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Building2 className="text-emerald-500 animate-pulse" /> 拾得物・宿泊者 照合レポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{matchResult || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setImage(null); setMatchResult(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 次の拾得物を解析する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
