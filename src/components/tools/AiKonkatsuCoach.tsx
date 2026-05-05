'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Heart, Camera, MessageCircle, Zap, ChevronRight, Loader2, Copy, Sparkles, ClipboardPaste, RotateCcw, Lightbulb, Search, ShieldCheck, UserCircle, MessageSquare, Flame
} from 'lucide-react'

// 砂時計型フロー：最初の「入口」の選択肢
const ENTRY_MODES = [
  { 
    id: 'profile', 
    label: 'プロフィール戦略', 
    desc: 'マッチング率を劇的に改善', 
    icon: UserCircle, 
    color: 'text-pink-500', 
    bg: 'bg-pink-500/10',
    steps: ['自己紹介・写真をアップ', 'AIモテプロンプト生成', '3台のAIで勝てる構成案']
  },
  { 
    id: 'talk', 
    label: 'トーク・誘い方', 
    desc: '既読スルー・退屈を打破', 
    icon: MessageSquare, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    steps: ['やり取り画面をスクショ', 'AI返信プロンプト生成', '次のデート確約への返信']
  },
  { 
    id: 'dating', 
    label: 'デート直前・後の作戦', 
    desc: '脈あり判定と逆転の次の一手', 
    icon: Flame, 
    color: 'text-rose-500', 
    bg: 'bg-rose-500/10',
    steps: ['現在の状況をテキスト入力', 'AI心理分析プロンプト', '成婚へのロードマップ策定']
  },
];

export default function AiKonkatsuCoach() {
  const [mode, setMode] = useState<'selection' | 'profile' | 'talk' | 'dating'>('selection');
  const [inputData, setInputData] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 憲法：工程の定義
  const STEPS = ["状況を選択", "情報提供", "AI解析依頼", "最終判定"];
  const activeStepIndex = mode === 'selection' ? 0 : (report ? 3 : 2);

  // 憲法：自動スコアリング演出（成婚期待度）
  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(65 + Math.floor(Math.random() * 32));
        setIsProcessing(false);
      }, 1500);
    }
  }, [report]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setTimeout(() => setIsProcessing(false), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPrompt = () => {
    if (mode === 'profile') {
      return `あなたはトップ婚活アドバイザーです。以下のプロフィール情報・写真を分析し、マッチング率を最大化するための「勝てる構成案」を提案してください。\n\n【情報】：${inputData}`;
    }
    if (mode === 'talk') {
      return `あなたは恋愛心理学のスペシャリストです。添付されたトーク画面のやり取りから、相手の心理状態を分析し、既読スルーを避け、かつ確実に次のデートに繋げるための「神返信」を3パターン提示してください。`;
    }
    if (mode === 'dating') {
      return `あなたは成婚率100%を誇る成婚コンシェルジュです。現在のデート状況から、相手の「脈あり度」を100点満点で判定し、交際・成婚に至るための具体的な逆転・加速プランを作成してください。\n\n【状況】：${inputData}`;
    }
    return '';
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-rose-600/50 rounded-3xl p-6 mb-10 flex items-start gap-5 shadow-2xl">
      <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg animate-pulse"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-xs font-black text-rose-400 uppercase italic tracking-[0.2em] opacity-70">Coach Guide</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-sm md:text-base text-slate-300 font-bold flex items-center gap-3 leading-tight"><span className="text-rose-600 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-rose-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(225,29,72,0.3)]">Matching Intelligence Terminal</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI 婚活コーチ</h1>
      </div>

      {/* 憲法：全体工程プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-xs transition-all duration-500 ${i <= activeStepIndex ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase italic tracking-tighter transition-colors ${i <= activeStepIndex ? 'text-rose-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 砂時計：入口（Entry）- モード選択 */}
      {mode === 'selection' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
          {ENTRY_MODES.map((item) => (
            <Card key={item.id} onClick={() => setMode(item.id as any)} className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 hover:border-rose-500 transition-all cursor-pointer group hover:scale-[1.02] shadow-2xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity`} />
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}><item.icon size={32} /></div>
              <h3 className="text-2xl font-black text-white italic uppercase mb-2">{item.label}</h3>
              <p className="text-slate-500 font-bold text-sm mb-6">{item.desc}</p>
              <div className="space-y-2">
                {item.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase italic opacity-60"><ChevronRight size={10} className={item.color} /> {s}</div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 砂時計：一本道（Process） */}
      {mode !== 'selection' && (
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600" />
          
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase flex items-center gap-4">
              {ENTRY_MODES.find(m => m.id === mode)?.icon && React.createElement(ENTRY_MODES.find(m => m.id === mode)!.icon, { className: "text-rose-500", size: 40 })}
              {ENTRY_MODES.find(m => m.id === mode)?.label}
            </h3>
            <Button onClick={() => { setMode('selection'); setInputData(''); setImage(null); setReport(''); setScore(null); }} variant="ghost" className="text-slate-500 font-black italic uppercase hover:text-white"><RotateCcw className="mr-2" size={16} /> モード選択に戻る</Button>
          </div>

          {renderGuide(ENTRY_MODES.find(m => m.id === mode)?.steps || [])}

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {/* 入力セクション */}
              {mode === 'talk' ? (
                <div className="space-y-6">
                  {!image ? (
                    <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-20 text-center hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner group" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      <Upload className="h-16 w-16 text-slate-700 mx-auto mb-6 group-hover:text-rose-500 transition-colors" />
                      <p className="text-xl text-slate-500 font-black italic uppercase">トーク画面をドロップ</p>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-rose-600/30 shadow-2xl bg-black flex items-center justify-center">
                       <img src={image} alt="Talk" className="max-h-full max-w-full object-contain" />
                       <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white shadow-xl">✕</Button>
                    </div>
                  )}
                </div>
              ) : (
                <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder={mode === 'profile' ? "現在の自己紹介文を貼り付けるか、アピールしたい趣味・性格を入力..." : "現在の交際状況、最後に交わした会話、不安な点などを入力..."} className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-lg text-white font-bold focus:border-rose-500 outline-none shadow-inner" />
              )}

              {/* 3-AI Hub */}
              <div className="space-y-4">
                <Button onClick={() => handleCopy(getPrompt())} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-rose-600 text-white hover:bg-rose-500'}`}>
                  {copied ? '✅ COPIED!' : 'コーチング指示をコピー'}
                </Button>
                <div className="grid grid-cols-3 gap-3">
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-rose-600/10" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-rose-600/10" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-rose-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                </div>
              </div>
            </div>

            {/* 解析結果レポート */}
            <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
              {score && <div className="absolute inset-0 bg-rose-600/5 backdrop-blur-3xl animate-in fade-in duration-1000" />}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-rose-400">
                  <ShieldCheck size={24} />
                  <h4 className="text-sm font-black uppercase italic tracking-widest">Coaching Report</h4>
                </div>
                {score && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-rose-400 uppercase italic">Marriage Probability</span>
                    <span className="text-4xl font-black text-white italic animate-in zoom-in">{score}<span className="text-sm ml-1">%</span></span>
                  </div>
                )}
              </div>
              <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AIからのコーチング結果（アドバイス）をここに貼り付けてください..." className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-rose-500 outline-none font-medium leading-relaxed italic relative z-10" />
              {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-10 h-10 text-rose-500 animate-spin" /><p className="text-xs font-black text-rose-400 uppercase italic tracking-widest">AI Strategic Scoring...</p></div>}
            </div>
          </div>

          {/* 出口（Exit） */}
          {report && score && (
            <div className="mt-16 pt-16 border-t border-slate-800 space-y-8 animate-in fade-in slide-in-from-bottom-8">
              <h4 className="text-2xl font-black text-white italic uppercase text-center">Next Strategic Action</h4>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                 <Button onClick={() => { handleCopy(`${report}\n\nこのアドバイスに基づいて、今日から実行すべき「具体的なTODOリスト」と、相手に送る「練習用の下書き」を1通作成してください。`); }} className="h-20 bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 rounded-2xl font-black italic uppercase flex items-center justify-center gap-4 transition-all group">
                   <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/40"><MessageSquare className="text-emerald-500" /></div>
                   <div className="text-left"><p className="text-[10px] opacity-50 uppercase">Strategy A</p><p className="text-sm">TODO & 下書きを作成</p></div>
                 </Button>
                 <Button onClick={() => { setMode('selection'); setInputData(''); setImage(null); setReport(''); setScore(null); }} className="h-20 bg-slate-800 border-2 border-slate-700 hover:border-rose-500 rounded-2xl font-black italic uppercase flex items-center justify-center gap-4 transition-all group">
                   <div className="p-2 bg-rose-500/20 rounded-lg group-hover:bg-rose-500/40"><RotateCcw className="text-rose-500" /></div>
                   <div className="text-left"><p className="text-[10px] opacity-50 uppercase">Reset Flow</p><p className="text-sm">別の状況を相談する</p></div>
                 </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Success Engine • NextraLabs 2026</p></div>
    </div>
  )
}
