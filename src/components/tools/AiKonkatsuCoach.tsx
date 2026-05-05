'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Heart, Camera, MessageCircle, Zap, ChevronRight, Loader2, Copy, Sparkles, ClipboardPaste, RotateCcw, Lightbulb, Search, ShieldCheck, UserCircle, MessageSquare, Flame, BarChart3, Users2, MapPin, Target, LayoutGrid
} from 'lucide-react'

// 皇帝の剣：5大武器（機能ハブ）の定義
const WEAPONS = [
  { 
    id: 'diagnosis', 
    label: '自分磨き診断', 
    desc: '30問で強みと弱みを可視化', 
    icon: BarChart3, 
    color: 'text-pink-500', 
    bg: 'bg-pink-500/10',
    prompt: "あなたは婚活コンサルタントです。以下のチェックリスト結果から、レーダーチャートを分析するように私の『外見・会話・経済・教養・メンタル』を評価し、最優先の改善ポイントを提案してください。",
    presets: [
      { label: "今の自分の課題を知りたい", content: "【外見：清潔感はあるが地味、会話：聞き役になりがち、経済：安定、教養：読書好き、メンタル：消極的】この状態で、何を最優先で磨くべきか具体的に教えて。" },
      { label: "30代・年収別診断", content: "30代前半、年収500万、趣味はアニメと筋トレ。マッチングアプリで勝つために、同年代と差別化できるポイントを診断して。" }
    ]
  },
  { 
    id: 'profile', 
    label: 'プロフィール添削', 
    desc: '第一印象の9割をAIが変える', 
    icon: UserCircle, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    prompt: "あなたはマッチングアプリのプロです。以下の自己紹介文を読み、具体的なエピソードの追加、ポジティブな言い換え、そしてターゲットに刺さるキャッチコピーを提案してください。",
    presets: [
      { label: "短すぎる文章を強化", content: "「趣味は旅行と映画です。よろしくお願いします。」このプロフィールを、優しくて誠実そうなイメージに膨らませて。" },
      { label: "真剣度を伝える（婚活仕様）", content: "仕事が忙しくてつい「休みは家でゴロゴロ」と書いてしまいます。自立していて、かつパートナーとの時間を大切にする印象に変えて。" }
    ]
  },
  { 
    id: 'dating', 
    label: 'デートプラン提案', 
    desc: '場所から会話ネタまで網羅', 
    icon: MapPin, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    prompt: "あなたはデートプランナーです。相手の趣味、デート回数、季節を踏まえて、最適な待ち合わせ場所、会話のフック、避けるべき話題、次へ繋げるクロージングを提案してください。",
    presets: [
      { label: "初対面のお茶デート", content: "週末の午後、銀座付近。相手はカフェ巡りが趣味。緊張せずに話せる静かすぎない場所と、沈黙を怖がらないための会話ネタを3つ教えて。" },
      { label: "3回目勝負のディナー", content: "相手はイタリアンが好き。告白を視野に入れたい。雰囲気の良いレストランの選び方と、切り出すタイミングのヒントを。" }
    ]
  },
  { 
    id: 'compatibility', 
    label: '相性シミュレーション', 
    desc: '価値観の不一致を数値化', 
    icon: Users2, 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10',
    prompt: "あなたは心理学者です。私と相手の『金銭感覚・休日・家事・将来ビジョン』のデータを比較し、致命的な不一致リスクと、それを乗り越えるための対話方法を教えてください。",
    presets: [
      { label: "金銭感覚のズレを確認", content: "自分：貯金重視、相手：趣味（旅行）に惜しみなく使う。結婚後に家計を共にする際、もめないための妥協点を探って。" },
      { label: "休日の過ごし方の違い", content: "自分：インドア派、相手：キャンプ大好きアウトドア派。無理せず一緒に楽しめる「中間地点の休日」を提案して。" }
    ]
  },
  { 
    id: 'pdca', 
    label: '活動記録＆分析', 
    desc: '失敗を成功に変えるログ分析', 
    icon: Target, 
    color: 'text-rose-500', 
    bg: 'bg-rose-500/10',
    prompt: "あなたは戦略コーチです。今回のお見合い・デートの記録から、成功要因と失敗要因を特定し、次のアクションで修正すべき具体的な行動ログを出力してください。",
    presets: [
      { label: "2回目に繋がらなかった反省", content: "「話は盛り上がったはずなのに、LINEがそっけない。」会話の比率や、最後の別れ際の挨拶など、どこに盲点があったか分析して。" },
      { label: "成功パターンを再現化", content: "初めて交際まで発展しそう。今回の成功パターンを言語化して、自信を確信に変えたい。何が相手に刺さったのか整理して。" }
    ]
  },
];

export default function AiKonkatsuCoach() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 憲法：自動スコアリング演出
  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(60 + Math.floor(Math.random() * 38));
        setIsProcessing(false);
      }, 1200);
    }
  }, [report]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentWeapon = WEAPONS.find(w => w.id === activeWeapon);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-pink-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(219,39,119,0.3)]">Konkatsu Strategic Hub</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI 婚活コーチ</h1>
      </div>

      {/* 皇帝の剣：マルチツール・ハブ（武器選択ナビ） */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => { setActiveWeapon(w.id); setInputData(''); setReport(''); setScore(null); }}
              className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${activeWeapon === w.id ? 'bg-pink-600 border-pink-400 scale-105 shadow-xl text-white' : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              <w.icon size={24} className={activeWeapon === w.id ? 'text-white' : w.color} />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase italic leading-none mb-1">{w.label}</p>
                <p className={`text-[8px] font-bold opacity-60 ${activeWeapon === w.id ? 'text-white' : ''}`}>{w.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!activeWeapon ? (
        /* 初期状態：武器の紹介 */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
           {WEAPONS.map((w) => (
             <Card key={w.id} onClick={() => setActiveWeapon(w.id)} className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 hover:border-pink-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                <div className={`absolute top-0 right-0 w-32 h-32 ${w.bg} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-30 transition-opacity`} />
                <div className={`w-16 h-16 ${w.bg} ${w.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}><w.icon size={32} /></div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-2">{w.label}</h3>
                <p className="text-slate-500 font-bold text-sm">{w.desc}</p>
             </Card>
           ))}
        </div>
      ) : (
        /* 機能実行状態：憲法準拠の一本道 */
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 bg-pink-600`} />
          
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase flex items-center gap-4">
              {currentWeapon && React.createElement(currentWeapon.icon, { className: currentWeapon.color, size: 40 })}
              {currentWeapon?.label}
            </h3>
            <Button onClick={() => setActiveWeapon(null)} variant="ghost" className="text-slate-500 font-black italic uppercase hover:text-white"><LayoutGrid className="mr-2" size={16} /> 武器を選択し直す</Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                   <p className="text-[10px] font-black text-pink-500 uppercase italic tracking-widest">Input Information</p>
                   {/* 🟢 プリセット選択肢の追加 */}
                   <div className="flex gap-2">
                      {currentWeapon?.presets.map((p, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => setInputData(p.content)} className="h-7 border-slate-800 text-[8px] font-black uppercase italic hover:bg-pink-600/10 text-slate-400">
                          {p.label}
                        </Button>
                      ))}
                   </div>
                </div>
                <textarea 
                  value={inputData} 
                  onChange={(e) => setInputData(e.target.value)} 
                  placeholder={`${currentWeapon?.label}に必要な情報を入力、またはプリセットから選んでください...`} 
                  className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-lg text-white font-bold focus:border-pink-500 outline-none" 
                />
              </div>

              <div className="space-y-4">
                <Button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【提供された情報】：\n${inputData}`)} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-pink-600 text-white hover:bg-pink-500'}`}>
                  {copied ? '✅ 指示をコピーしました' : '最強コーチング指示をコピー'}
                </Button>
                <div className="grid grid-cols-3 gap-3">
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-pink-600/10" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-pink-600/10" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-pink-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
              {score && <div className="absolute inset-0 bg-pink-600/5 backdrop-blur-3xl animate-in fade-in duration-1000" />}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-pink-400">
                  <ShieldCheck size={24} />
                  <h4 className="text-sm font-black uppercase italic tracking-widest">Coaching Report</h4>
                </div>
                {score && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-pink-400 uppercase italic">Marriage Probability</span>
                    <span className="text-4xl font-black text-white italic animate-in zoom-in">{score}<span className="text-sm ml-1">%</span></span>
                  </div>
                )}
              </div>
              <textarea 
                value={report} 
                onChange={(e) => setReport(e.target.value)} 
                placeholder="AIからのアドバイスをここに貼り付けると、成婚期待度が算出されます..." 
                className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-pink-500 outline-none font-medium leading-relaxed italic relative z-10" 
              />
              {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-10 h-10 text-pink-500 animate-spin" /><p className="text-xs font-black text-pink-400 uppercase italic tracking-widest">AI Strategic Scoring...</p></div>}
            </div>
          </div>
        </Card>
      )}

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Marriage Road Japan 知見継承エンジン • NextraLabs 2026</p></div>
    </div>
  )
}
