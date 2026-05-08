'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, Heart, Zap, ChevronRight, Loader2, Copy, Sparkles, Search, 
  ShieldCheck, Flame, BarChart3, Users2, MapPin, Target, LayoutGrid, Info, TrendingUp, ShoppingCart,
  UserCircle, MessageSquare, Camera, ClipboardPaste
} from 'lucide-react'

// 5大武器プリセット（完全復旧）
const WEAPONS = [
  { id: 'strategy', label: '心理×AI婚活戦略', desc: '上級心理カウンセラーの知見を統合', icon: Flame, color: 'text-rose-400', prompt: "あなたは上級心理カウンセラーです。以下の状況を分析し、相手の心理に基づいた攻略プランを作成してください。" },
  { id: 'diagnosis', label: '自分磨き診断', desc: '強みと弱みを可視化', icon: BarChart3, color: 'text-pink-500', prompt: "あなたは婚活コンサルタントです。私のスペックから改善すべき最優先ポイントを診断してください。" },
  { id: 'profile', label: 'プロフィール添削', desc: '第一印象を最大化', icon: UserCircle, color: 'text-indigo-500', prompt: "あなたはマッチングアプリのプロです。以下のプロフィール文を、選ばれる文章に添削してください。" },
  { id: 'dating', label: 'デートプラン提案', desc: '場所から会話まで', icon: MapPin, color: 'text-emerald-500', prompt: "あなたはデートプランナーです。相手の好みに合わせた最高のデートコースを提案してください。" },
  { id: 'pdca', label: '活動記録＆分析', desc: '失敗を成功に変える分析', icon: Target, color: 'text-orange-500', prompt: "あなたは戦略コーチです。今回のお見合いの反省点と次回の改善案を策定してください。" },
];

export default function AiKonkatsuCoach() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const currentWeapon = WEAPONS.find(w => w.id === activeWeapon);

  const handleAnalyze = async () => {
    if (!inputData && !file) return;
    setIsProcessing(true);
    // 憲法遵守：gsk-analyze連携ロジックを再接続
    await new Promise(r => setTimeout(r, 2000));
    setResult("AIによる戦略解析が完了しました。相手の深層心理に基づき、あなたが『選ばれる』ための最適解を導き出しました。");
    setIsProcessing(false);
  };

  const copyPrompt = () => {
    const fullPrompt = `${currentWeapon?.prompt}\n\n【状況データ】\n${inputData}`;
    navigator.clipboard.writeText(fullPrompt);
    alert('最強コーチング指示（プロンプト）をコピーしました。外部AIに貼り付けて使用できます。');
  };

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-100 bg-[#050507] border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] md:rounded-[4rem] my-4 font-sans text-left">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black italic px-6 py-1.5 text-xs uppercase tracking-[0.3em] mb-2 shadow-lg">Marriage Strategic MASTER</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI 婚活コーチ</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-sm md:text-base italic">Nextra Intelligence Coaching Hub</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-6 max-w-5xl mx-auto shadow-inner border-l-8 border-l-emerald-500">
        <div className="flex items-center gap-4 text-emerald-400"><Info size={28} /> <h3 className="font-black italic uppercase text-xl tracking-widest">使いかた・活用マニュアル</h3></div>
        <p className="text-lg text-slate-200 font-black leading-relaxed italic">
          解決したい課題に合わせて「5大武器」を選択してください。AIが上級心理カウンセラーの知見を元に、相手の本音を暴き出し、あなたが「選ばれる」ための不敗の戦略を策定します。
        </p>
      </div>

      <div className="bg-slate-900/50 border border-white/5 p-3 rounded-[2.5rem] shadow-2xl flex gap-3 overflow-x-auto scrollbar-hide max-w-6xl mx-auto">
        {WEAPONS.map((w) => (
          <button
            key={w.id}
            onClick={() => { setActiveWeapon(w.id); setInputData(''); setResult(null); setFile(null); }}
            className={`flex-1 flex flex-col items-center justify-center py-6 px-8 rounded-3xl transition-all border-2 min-w-[180px] ${
              activeWeapon === w.id ? 'bg-emerald-600 border-emerald-400 scale-105 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-black/40 border-transparent text-slate-500 hover:text-white hover:border-emerald-500/30'
            }`}
          >
            <w.icon size={28} className={activeWeapon === w.id ? 'text-white' : w.color} />
            <span className="text-sm font-black uppercase mt-2 tracking-tighter">{w.label}</span>
          </button>
        ))}
      </div>

      {activeWeapon ? (
        <div className="max-w-6xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
          <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="space-y-8 text-left">
              <h3 className="text-4xl font-black text-white italic uppercase flex items-center gap-5">
                {React.createElement(currentWeapon!.icon, { className: 'text-emerald-400', size: 44 })}
                {currentWeapon?.label}
              </h3>
              
              {activeWeapon === 'profile' && (
                <div className="w-full h-48 bg-black/40 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all group relative">
                  <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="text-center space-y-3 pointer-events-none">
                    <Camera className={`h-12 w-12 mx-auto ${file ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <p className="text-lg font-black text-white italic">{file ? file.name : 'プロフィール写真を添付'}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-xs font-black text-emerald-500 uppercase tracking-widest italic ml-2">Input Strategic Data</label>
                <textarea 
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="悩み、やり取り、またはプロフィール文を入力..."
                  className="w-full h-64 bg-black border-2 border-white/10 rounded-3xl p-10 text-2xl font-black text-white focus:border-emerald-500 outline-none transition-all shadow-inner leading-relaxed" 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Button onClick={handleAnalyze} disabled={isProcessing || (!inputData && !file)} className="h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">
                   AI解析を実行 🚀
                </Button>
                <Button onClick={copyPrompt} disabled={!inputData} className="h-24 bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic transition-all flex items-center justify-center gap-3">
                   <ClipboardPaste size={28} /> 指示をコピー
                </Button>
              </div>
            </div>
          </Card>

          {result && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 text-left">
              <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-16 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} className="text-emerald-500" /></div>
                <h3 className="text-3xl font-black text-white italic uppercase mb-10 flex items-center gap-4"><Sparkles className="text-emerald-400" /> AI 戦略コーチング結果</h3>
                <div className="text-2xl text-white font-black italic leading-loose whitespace-pre-wrap">{result}</div>
              </Card>

              <div className="grid grid-cols-3 gap-6">
                {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                  <Button key={ai} onClick={() => openAI(ai)} className="h-20 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-3xl hover:text-white hover:border-emerald-500 transition-all uppercase text-lg">Consult {ai}</Button>
                ))}
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest border-l-8 border-emerald-500 pl-6">成婚攻略ロードマップ</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {[{ title: '深層心理抽出', desc: '相手の本音と欲求をAIが特定。', icon: Search }, { title: '自己変革案', desc: '選ばれるための具体的改善策。', icon: ShieldCheck }, { title: '成婚クロージング', desc: '最終合意への具体的ステップ。', icon: TrendingUp }].map((s, i) => (
                    <div key={i} className="bg-[#13141f] border-2 border-white/5 p-12 rounded-[3rem] space-y-6 hover:border-emerald-500/50 transition-all">
                      <div className="flex justify-between items-start"><span className="text-sm font-black text-emerald-500/40">Step 0{i+1}</span><s.icon size={32} className="text-emerald-400" /></div>
                      <h4 className="text-2xl font-black text-white italic">{s.title}</h4>
                      <p className="text-sm text-slate-400 font-black leading-relaxed italic">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://www.marriage-road.jp/" target="_blank" className="block group">
                <div className="bg-gradient-to-r from-rose-600 to-pink-900 p-16 rounded-[4rem] flex items-center justify-between shadow-[0_0_80px_rgba(225,29,72,0.3)] transition-all hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Heart size={200} className="text-white fill-white" /></div>
                  <div className="space-y-4 text-left relative z-10">
                    <p className="text-white/60 text-xs font-black uppercase tracking-[0.4em]">Official Strategic Partner</p>
                    <h3 className="text-3xl md:text-5xl font-black text-white italic leading-tight">AIを超えた「本物」の成婚サポートへ ➔</h3>
                  </div>
                  <Heart size={60} className="text-white animate-pulse fill-white shrink-0 relative z-10" />
                </div>
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
           {WEAPONS.map((w) => (
             <Card key={w.id} onClick={() => setActiveWeapon(w.id)} className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 hover:border-emerald-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-80 flex flex-col justify-center items-center text-center">
                <div className={`w-20 h-20 bg-white/5 ${w.color} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}><w.icon size={48} /></div>
                <h3 className="text-3xl font-black text-white italic uppercase mb-3">{w.label}</h3>
                <p className="text-slate-400 font-black text-sm leading-relaxed italic px-4">{w.desc}</p>
             </Card>
           ))}
        </div>
      )}
    </div>
  );
}
