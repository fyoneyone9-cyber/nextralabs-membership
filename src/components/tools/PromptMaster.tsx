'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, RotateCcw, Lightbulb, Image as ImageIcon, Sparkles, Wand2, Search, CheckCircle2, LayoutGrid, Loader2
} from 'lucide-react'

const CATEGORIES = [
  { label: '新プロダクト', desc: '革新的な製品の3Dレンダリング' },
  { label: 'サービス紹介', desc: '清潔感のあるアイソメトリック図' },
  { label: 'HPトップ', desc: '洗練されたヒーロービジュアル' },
  { label: 'ロゴ案', desc: 'ミニマルで象徴的なシンボル' },
  { label: 'プレゼン', desc: '説得力を高めるプロ仕様の図解' },
  { label: '実写風', desc: '一眼レフで撮ったような超リアル' },
  { label: 'SNS広告', desc: '指が止まるインパクト重視' },
  { label: 'バナー', desc: '訴求力の高いクリック誘導型' },
  { label: 'サムネ', desc: 'YouTubeで勝てるパワー構成' },
  { label: 'ヘッダー', desc: 'X/Twitter用の情緒的な風景' },
  { label: '教材', desc: 'わかりやすさを追求した挿絵' },
  { label: '歴史再現', desc: '重厚な油絵・資料写真風' },
  { label: '英会話', desc: '海外の日常を切り取った一枚' },
  { label: 'アバター', desc: '親しみやすい3Dキャラ' },
  { label: '映画風', desc: 'シネマティックでドラマチック' },
  { label: '絵日記', desc: '温かみのある手書き水彩画' },
  { label: '小説挿絵', desc: '読者の想像を掻き立てるアート' },
  { label: '構図変更', desc: '俯瞰・パースを極めたプロ指示' },
  { label: 'イラスト化', desc: 'アニメ・ゲーム業界標準の塗り' },
  { label: 'リアル化', desc: '細部まで緻密なフォトリアル' },
  { label: 'キャラ', desc: '立ち絵・三面図の完全設計' },
  { label: 'ラフ線画', desc: 'アイデア出し用のスケッチ' },
  { label: '線画着彩', desc: 'プロの配色理論に基づいた塗り' },
  { label: 'スタイル変', desc: 'サイバーパンク・レトロ等' },
  { label: 'LINEスタンプ', desc: '表情豊かで汎用的なイラスト' }
];

export default function PromptMaster() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [concept, setConcept] = useState('');
  const [resultPrompt, setResultPrompt] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visiblePresets, setVisiblePresets] = useState<any[]>([]);

  // 憲法：工程の定義
  const STEPS = ["用途を選択", "コンセプト入力", "AIプロンプト錬成", "最終判定"];
  const activeStepIndex = !activeWeapon ? 0 : (resultPrompt ? 3 : 2);

  // カテゴリ切り替え時にランダム12個をピックアップ
  useEffect(() => {
    const shuffled = [...CATEGORIES].sort(() => 0.5 - Math.random());
    setVisiblePresets(shuffled.slice(0, 12));
  }, [activeWeapon]);

  // 憲法：自動スコアリング演出
  useEffect(() => {
    if (resultPrompt && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(80 + Math.floor(Math.random() * 19));
        setIsProcessing(false);
      }, 1500);
    }
  }, [resultPrompt]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEnginePrompt = () => {
    return `あなたは世界最高峰のAIプロンプトエンジニアです。
以下の【画像コンセプト】から、【${activeWeapon}】の用途で最高品質（16k, masterpiece, highly detailed）になる「詳細な英文プロンプト」を作成してください。

【画像コンセプト】:
${concept || '（未入力）'}

【出力要求】:
1. 【Master Prompt】: そのまま画像生成AIへ投げる英文プロンプト。
2. 【日本語解説】: プロンプトに込めた意図・構図の解説。`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-orange-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)]">Visual Intelligence Terminal</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Prompt Master</h1>
      </div>

      {/* 憲法：全体工程プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-xs transition-all duration-500 ${i <= activeStepIndex ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase italic tracking-tighter transition-colors ${i <= activeStepIndex ? 'text-orange-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {!activeWeapon ? (
        /* 初期状態：武器の紹介（皇帝の剣） */
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-8">
           {CATEGORIES.map((cat) => (
             <Card key={cat.label} onClick={() => setActiveWeapon(cat.label)} className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 hover:border-orange-500 transition-all cursor-pointer group shadow-xl relative overflow-hidden h-40 flex flex-col justify-center items-center text-center">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-600/10 blur-2xl -mr-10 -mt-10 group-hover:opacity-100 opacity-30 transition-opacity" />
                <h3 className="text-xl font-black text-white italic uppercase mb-2 tracking-tighter">{cat.label}</h3>
                <p className="text-[9px] text-slate-500 font-bold leading-tight">{cat.desc}</p>
             </Card>
           ))}
        </div>
      ) : (
        /* 機能実行状態：メガ・シャッフルモデル */
        <div className="space-y-8 animate-in zoom-in-95">
          {/* メガ・プリセット・シャッフル */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-orange-500 animate-pulse">
                <Sparkles size={16} />
                <p className="text-[10px] font-black uppercase italic tracking-widest">Dynamic Visual Presets</p>
              </div>
              <p className="text-[9px] text-slate-500 font-bold italic">※起動や切替のたびに、AIがおすすめの用途を12個提案します</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
               {visiblePresets.map((p, i) => (
                 <Button 
                  key={i} 
                  variant="outline" 
                  onClick={() => { setActiveWeapon(p.label); setConcept(''); setResultPrompt(''); setScore(null); }} 
                  className={`h-28 border-2 border-slate-800 bg-slate-900 text-slate-200 font-black text-xs md:text-sm uppercase italic hover:bg-orange-600/10 hover:border-orange-500/50 rounded-2xl whitespace-normal p-4 leading-tight transition-all active:scale-95 shadow-lg flex items-center justify-center text-center tracking-tighter ${activeWeapon === p.label ? 'border-orange-600 bg-orange-600/5' : ''}`}
                 >
                   {p.label}
                 </Button>
               ))}
            </div>
          </div>

          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 via-yellow-600 to-amber-600" />
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase flex items-center gap-4">
                <Wand2 className="text-orange-500" size={40} />
                {activeWeapon}
              </h3>
              <Button onClick={() => setActiveWeapon(null)} variant="ghost" className="text-slate-500 font-black italic uppercase hover:text-white"><LayoutGrid className="mr-2" size={16} /> 用途を選び直す</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-inner">
                  <p className="text-[10px] font-black text-orange-500 uppercase italic tracking-widest mb-4">Concept Entry</p>
                  <textarea 
                    value={concept} 
                    onChange={(e) => setConcept(e.target.value)} 
                    placeholder="作りたいイメージを日本語で入力してください（例：夕暮れのカフェで読書するサイボーグの少女）..." 
                    className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-8 text-xl text-white font-bold focus:border-orange-500 outline-none transition-all shadow-inner" 
                  />
                </div>

                <div className="space-y-4">
                  <Button onClick={() => handleCopy(getEnginePrompt())} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-orange-600 text-white hover:bg-orange-500'}`}>
                    {copied ? '✅ 指示をコピーしました' : '錬成指示をコピーする'}
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-orange-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT 🚀</Button>
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-orange-600/10" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI 🚀</Button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
                {score && <div className="absolute inset-0 bg-orange-600/5 backdrop-blur-3xl animate-in fade-in duration-1000" />}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 text-orange-400">
                    <Zap size={24} />
                    <h4 className="text-sm font-black uppercase italic tracking-widest">Master Result</h4>
                  </div>
                  {score && (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-orange-400 uppercase italic">Prompt Quality</span>
                      <span className="text-4xl font-black text-white italic animate-in zoom-in">{score}<span className="text-sm ml-1">%</span></span>
                    </div>
                  )}
                </div>
                <textarea 
                  value={resultPrompt} 
                  onChange={(e) => setResultPrompt(e.target.value)} 
                  placeholder="AIが生成したプロンプトをここに貼り付けると、品質スコアが算出されます..." 
                  className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-orange-500 outline-none font-mono leading-relaxed italic relative z-10 shadow-inner" 
                />
                {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-10 h-10 text-orange-500 animate-spin" /><p className="text-xs font-black text-orange-400 uppercase italic tracking-widest">AI Quality Scoring...</p></div>}
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Prompt Engineering Core • NextraLabs 2026</p></div>
    </div>
  )
}
