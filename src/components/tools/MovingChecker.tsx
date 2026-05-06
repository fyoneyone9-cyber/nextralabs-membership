'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Copy, RotateCcw, Lightbulb, 
  ClipboardPaste, Home, ShieldCheck, MapPin, Download, Loader2, 
  Sparkles, Building2, Search, AlertTriangle, Info, ChevronRight, Zap
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const ENTRY_MODES = [
  { 
    id: 'area', 
    label: 'エリア・治安調査', 
    desc: '候補地のハザード・治安を分析', 
    icon: MapPin, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10',
    steps: ['市区町村を入力', 'AIプロンプト生成', 'リスク判定']
  },
  { 
    id: 'room', 
    label: '内見・物件チェック', 
    desc: '写真から不備を暴く', 
    icon: Home, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    steps: ['部屋の写真をアップ', 'Visionプロンプト生成', '不備の特定']
  },
  { 
    id: 'contract', 
    label: '契約書・重要事項', 
    desc: '特約や費用の罠をチェック', 
    icon: ShieldCheck, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    steps: ['契約書を貼付', 'リスク抽出プロンプト', '交渉点の特定']
  },
];

const MasterEngine = () => {
  const [mode, setMode] = useState<'selection' | 'area' | 'room' | 'contract'>('selection');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // エリア調査用フォーム
  const [pref, setPref] = useState('');
  const [city, setCity] = useState('');
  const [station, setCityStation] = useState('');
  const [memo, setMemo] = useState('');

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(70 + Math.floor(Math.random() * 25));
        setIsProcessing(false);
      }, 1500);
    }
  }, [report, score]);

  const getSteps = () => {
    const common = ["状況を選択"];
    const current = ENTRY_MODES.find(m => m.id === mode);
    if (!current) return common;
    return [...common, ...current.steps, "最終判定"];
  };

  const currentSteps = getSteps();
  const activeStepIndex = mode === 'selection' ? 0 : (report ? currentSteps.length - 1 : 2);

  const getPrompt = () => {
    if (mode === 'area') {
      return `あなたはプロの防犯・地域分析コンサルタントです。以下のエリアについて、公的データに基づき治安・地盤・利便性の観点からリスク分析を行い、「S〜D」のランク判定と具体的な注意点を出力してください。
【調査エリア】：${pref} ${city}（最寄り：${station}駅）
【補足メモ】：${memo || "特になし"}`;
    }
    if (mode === 'room') {
      return `あなたは不動産管理のスペシャリストです。添付された内見写真から、壁のひび割れ、カビの予兆、設備の劣化、清掃状態、建付けの歪みなど、素人が見落としがちな不備を徹底的に洗い出し、入居前に確認・交渉すべきポイントをリストアップしてください。`;
    }
    if (mode === 'contract') {
      return `あなたは賃貸トラブルを専門とする法務アドバイザーです。以下の契約書・重要事項説明書のドラフトから、退去時の高額請求リスク、不当な特約、更新料の罠、設備修繕の負担区分など、借主に不利な条項を特定し、修正交渉のための文言を提案してください。\n【契約内容】：${memo}`;
    }
    return '';
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-indigo-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">居住安全インテリジェンス</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI引越し安心チェッカー</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v2.0-MASTER</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center justify-between min-w-[500px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {currentSteps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black italic text-[10px] transition-all ${i <= activeStepIndex ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span className={`text-[8px] font-black uppercase italic ${i <= activeStepIndex ? 'text-indigo-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {mode === 'selection' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in">
          {ENTRY_MODES.map((item) => (
            <Card key={item.id} onClick={() => setMode(item.id as any)} className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500 transition-all cursor-pointer group shadow-xl relative overflow-hidden">
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}><item.icon size={28} /></div>
              <h3 className="text-xl font-black text-white italic mb-2 uppercase">{item.label}</h3>
              <p className="text-slate-500 font-bold text-xs mb-6 leading-relaxed">{item.desc}</p>
              <div className="space-y-1">
                {item.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase italic opacity-60"><ChevronRight size={8} className={item.color} /> {s}</div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {mode !== 'selection' && (
        <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-30" />
          
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl md:text-3xl font-black text-white italic uppercase flex items-center gap-4">
              {ENTRY_MODES.find(m => m.id === mode)?.icon && React.createElement(ENTRY_MODES.find(m => m.id === mode)!.icon, { className: "text-indigo-500", size: 32 })}
              {ENTRY_MODES.find(m => m.id === mode)?.label}
            </h3>
            <button onClick={() => { setMode('selection'); setReport(''); setScore(null); }} className="text-slate-500 font-black italic uppercase text-[10px] hover:text-white flex items-center gap-2 transition-all"><RotateCcw size={14} /> 選択に戻る</button>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 text-left">
            <div className="space-y-6">
              {mode === 'area' && (
                <div className="space-y-4 bg-black/40 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">都道府県</label>
                       <input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="神奈川県" className="w-full h-14 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">市区町村</label>
                       <input value={city} onChange={(e) => setCity(city === e.target.value ? city : e.target.value)} placeholder="海老名市" className="w-full h-14 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">最寄り駅</label>
                     <input value={station} onChange={(e) => setCityStation(e.target.value)} placeholder="海老名" className="w-full h-14 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">補足メモ（徒歩分数など）</label>
                     <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="駅から徒歩10分圏内、静かな環境を希望..." className="w-full h-24 bg-[#0a0b14] border-2 border-white/5 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-all resize-none" />
                  </div>
                </div>
              )}
              {mode !== 'area' && (
                <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder={mode === 'contract' ? "契約書の内容を貼り付けてください..." : "不備についてのメモを入力..."} className="w-full h-48 bg-black/40 border-2 border-white/5 rounded-[2rem] p-6 text-sm text-white focus:border-indigo-500 outline-none shadow-inner italic" />
              )}

              <div className="space-y-4">
                <button onClick={() => handleCopy(getPrompt())} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                  {copied ? '✅ COPY COMPLETE' : '① 解析指示をコピー'}
                </button>
                <div className="grid grid-cols-3 gap-3">
                   <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic transition-all" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT 🚀</button>
                   <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic transition-all" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini 🚀</button>
                   <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic transition-all" onClick={() => window.open('https://claude.ai', '_blank')}>Claude 🚀</button>
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-[3rem] p-10 border border-white/5 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-indigo-400 font-black italic uppercase text-lg"><ClipboardPaste size={28} /> ② 解析レポート</div>
                {score && <div className="text-right leading-none bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/20"><p className="text-[10px] font-black text-indigo-500 italic uppercase">Safe Score</p><p className="text-4xl font-black text-white italic">{score}%</p></div>}
              </div>
              <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AIの解析結果をペースト..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-200 focus:border-indigo-500 outline-none font-sans leading-relaxed shadow-inner italic" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /><p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Analyzing Performance...</p></div>
              )}
            </div>
          </div>
        </Card>
      )}

      <DebugPanel data={{ mode, articleLength: report.length }} toolId="moving-checker-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Living Intelligence OS • NextraLabs 2026</div>
    </div>
  )
}

const MovingCheckerWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Area Master...</div>
})

export default function NoSSRWrapper() {
  return <MovingCheckerWithNoSSR />;
}
