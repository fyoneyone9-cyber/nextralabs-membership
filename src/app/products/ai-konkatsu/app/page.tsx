'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, Heart, Zap, ChevronRight, Loader2, Copy, Sparkles, Search, 
  ShieldCheck, Flame, BarChart3, Users2, MapPin, Target, LayoutGrid, Info, TrendingUp, ShoppingCart,
  UserCircle, MessageSquare
} from 'lucide-react'

const WEAPONS = [
  { id: 'strategy', label: '心理×AI婚活戦略', desc: '深層心理を解析', icon: Flame, color: 'text-rose-400' },
  { id: 'diagnosis', label: '自分磨き診断', desc: '強みと弱みを可視化', icon: BarChart3, color: 'text-pink-500' },
  { id: 'profile', label: 'プロフィール添削', desc: '第一印象を最大化', icon: UserCircle, color: 'text-indigo-500' },
  { id: 'dating', label: 'デートプラン提案', desc: '場所から会話まで', icon: MapPin, color: 'text-emerald-500' },
  { id: 'pdca', label: '活動記録＆分析', desc: '次の一手を策定', icon: Target, color: 'text-orange-500' },
];

export default function AiKonkatsuCoach() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const currentWeapon = WEAPONS.find(w => w.id === activeWeapon);

  const handleAnalyze = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("AIによる戦略解析が完了しました。現在のあなたの状況と心理学的アプローチを統合し、相手に安心感を与えつつ、特別な存在として認識させるための最適解を導き出しました。");
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-100 bg-[#050507] border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] md:rounded-[4rem] my-4 font-sans">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black italic px-4 py-0.5 text-[10px] uppercase tracking-widest mb-2">Marriage Strategic MASTER</Badge>
        <h1 className="text-4xl md:text-8xl font-black text-white uppercase italic tracking-tighter">AI 婚活コーチ</h1>
        <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-xs italic">Nextra Intelligence Coaching Hub</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
        <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
          解決したい課題に合わせて「5大武器」から一つを選択してください。上級心理カウンセラーの知見を学習したAIが、相手の深層心理とあなたのポテンシャルを掛け合わせ、最短成婚への道筋を策定します。
        </p>
      </div>

      {/* 5大武器ハブ (復旧) */}
      <div className="bg-slate-900/50 border border-white/5 p-2 rounded-[2rem] shadow-2xl flex gap-2 overflow-x-auto scrollbar-hide max-w-5xl mx-auto">
        {WEAPONS.map((w) => (
          <button
            key={w.id}
            onClick={() => { setActiveWeapon(w.id); setInputData(''); setResult(null); }}
            className={`flex-1 flex flex-col items-center justify-center py-4 px-6 rounded-2xl transition-all border-2 min-w-[140px] ${
              activeWeapon === w.id ? 'bg-emerald-600 border-emerald-400 scale-105 text-white' : 'bg-black/40 border-transparent text-slate-500 hover:text-white'
            }`}
          >
            <w.icon size={20} className={activeWeapon === w.id ? 'text-white' : w.color} />
            <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">{w.label}</span>
          </button>
        ))}
      </div>

      {activeWeapon ? (
        <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
          <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="space-y-8">
              <h3 className="text-3xl font-black text-white italic uppercase flex items-center gap-4">
                {currentWeapon && React.createElement(currentWeapon.icon, { className: 'text-emerald-400', size: 32 })}
                {currentWeapon?.label}
              </h3>
              <textarea 
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={`${currentWeapon?.label}に必要な情報を入力してください...`}
                className="w-full h-48 bg-black border-2 border-white/10 rounded-2xl p-6 text-lg text-white font-bold focus:border-emerald-500 outline-none transition-all" 
              />
              <Button onClick={handleAnalyze} disabled={isProcessing || !inputData} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">
                {isProcessing ? <Loader2 className="animate-spin h-10 w-10" /> : 'AIコーチングを開始する 🚀'}
              </Button>
            </div>
          </Card>

          {result && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
                <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Strategic Advice</h3>
                <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap">{result}</div>
              </Card>

              {/* 成婚ロードマップ */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Success Roadmap</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { step: '01', title: '深層心理抽出', desc: '相手の言葉や行動の裏にある「本音」と「欲求」をAIが特定。', icon: Search },
                    { step: '02', title: '自己変革', desc: '選ばれるための外見・内面・コミュニケーションの改善。', icon: Sparkles },
                    { step: '03', title: '成婚クロージング', desc: '真剣交際、またはプロポーズへ向けた具体的アクション。', icon: TrendingUp },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#13141f] border border-white/10 p-8 rounded-3xl space-y-4">
                      <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                      <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                      <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                  <Button key={ai} variant="outline" className="h-16 border-2 border-white/10 text-slate-400 font-black uppercase italic hover:bg-white/5" onClick={() => window.open(`https://${ai.toLowerCase()}.com`)}>{ai}</Button>
                ))}
              </div>

              <a href="https://www.marriage-road.jp/" target="_blank" className="block group">
                <div className="bg-gradient-to-r from-rose-600 to-pink-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Master Partner</p>
                    <h3 className="text-2xl font-black text-white italic">AIを超えた「本物」の成婚サポート。マリッジロードジャパン ➔</h3>
                  </div>
                  <Heart size={40} className="text-white animate-pulse fill-white" />
                </div>
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8">
           {WEAPONS.map((w) => (
             <Card key={w.id} onClick={() => setActiveWeapon(w.id)} className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                <div className={`w-16 h-16 bg-white/5 ${w.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}><w.icon size={32} /></div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-2">{w.label}</h3>
                <p className="text-slate-500 font-bold text-sm">{w.desc}</p>
             </Card>
           ))}
        </div>
      )}
    </div>
  );
}
