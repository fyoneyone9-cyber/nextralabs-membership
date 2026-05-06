'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Rocket, Lightbulb, CheckCircle2 } from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [roadmapInput, setRoadmapInput] = useState('');
  const [roadmapResult, setRoadmapResult] = useState('');
  const [price, setPrice] = useState(5000);
  const [count, setCount] = useState(10);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const QUESTIONS = [
    "コツコツと文章を書くのが苦ではない",
    "デザインや美しいものを作るのが好きだ",
    "SNSで発信することに抵抗がない",
    "プログラミングやITツールを触るのが好きだ",
    "人の悩みを聞いて解決策を考えるのが得意だ"
  ];

  const getAuditPrompt = () => {
    const selected = QUESTIONS.filter((_, i) => answers[i]).join('\n・');
    return `あなたはプロの副業コンサルタントです。
以下の「成功法則」に基づき、私の特性に最適なAI副業を3つ提案してください。

【副業成功の鉄則】
1. 即金性のある作業で成功体験を積む（1ヶ月目目標：1万円）
2. スキルを蓄積して単価を上げる（2ヶ月目：3万円、3ヶ月目：5万円〜）
3. 無理な高額教材には手を出さず、無料ツールを使い倒す

【私の特性】
・${selected || "特になし（初心者）"}

【回答フォーマット】
■提案1：[副業名]
・なぜ向いているか：
・即金アクション（今週やること）：
・3ヶ月の収益ロードマップ：
・注意すべきお金のルール（確定申告等）：`;
  };

  const getRoadmapPrompt = () => {
    return `「${roadmapInput}」という副業で月10万円稼ぐための、初心者向け「0→1ロードマップ」を作成してください。
以下の具体的アクションを含めてステップバイステップで教えてください。

1. 【準備】専用口座の開設、クラウドソーシング登録
2. 【初動】まずは低単価でも「実績作り」と割り切り、具体的な方法を
3. 【加速】AIツールを駆使して作業効率を3倍にする手順
4. 【防御】確定申告の20万円ルール、住民税の申告、会社にバレない対策`;
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        <div className="text-center space-y-1 md:space-y-3">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">AI副業スタートダッシュ</h1>
          <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-[8px] md:text-sm tracking-widest shadow-2xl">MASTER v2.0</div>
        </div>

        <div className="bg-[#13141f] border border-white/5 rounded-3xl p-8 max-w-4xl mx-auto flex items-start gap-6 shadow-inner">
          <div className="w-10 h-10 rounded-full border border-[#5845e0]/30 flex items-center justify-center shrink-0 text-[#5845e0] font-bold">!</div>
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-black text-[#5845e0]/70 uppercase tracking-[0.2em] italic mb-2 text-left">Production Protocol</p>
            <div className="space-y-1 text-xs md:text-sm font-bold text-slate-400 text-left">
              <p className="flex items-center gap-3"><span className="text-[#5845e0] italic">#1</span> 適性診断にチェックを入れ「診断指示」をコピー</p>
              <p className="flex items-center gap-3"><span className="text-[#5845e0] italic">#2</span> 下のAIボタンから貼り付けて、即金性のある副業を特定</p>
              <p className="flex items-center gap-3"><span className="text-[#5845e0] italic">#3</span> 特定した副業を「②ロードマップ」に入れ、0→1の手順を錬成</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-[#1a1b26]/50 p-1.5 rounded-2xl border border-white/5 max-w-4xl mx-auto">
          {[
            { id: 'audit', label: '① 適性診断' },
            { id: 'roadmap', label: '② ロードマップ' },
            { id: 'calc', label: '③ 収益計算' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all ${activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 max-w-5xl mx-auto">
          {activeTab === 'audit' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-6 md:p-16 shadow-2xl relative animate-in fade-in text-left">
              <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase text-center mb-10 flex items-center justify-center gap-3"><Zap className="text-[#5845e0]" /> 副業適性診断</h2>
              <div className="grid lg:grid-cols-2 gap-12 text-left">
                <div className="space-y-4">
                  {QUESTIONS.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-[#0a0b14] border border-white/5 rounded-2xl cursor-pointer hover:border-[#5845e0]/50 transition-all group" onClick={() => setAnswers(prev => ({...prev, [i]: !prev[i]}))}>
                      <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{q}</span>
                      <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${answers[i] ? 'bg-[#5845e0] border-white' : 'border-white/10'}`}>
                        {answers[i] && <span className="text-white font-bold">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0a0b14] rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center justify-center space-y-8 shadow-inner relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5845e0] to-transparent opacity-30" />
                   <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Ready to Analyze</p>
                      <p className="text-slate-400 text-xs font-bold italic">チェックを入れたら指示をコピー</p>
                   </div>
                   <button onClick={() => handleCopy(getAuditPrompt())} className={`w-full h-24 text-xl md:text-2xl font-black rounded-3xl transition-all shadow-2xl border-b-8 ${copied ? 'bg-emerald-500 border-emerald-800 scale-95' : 'bg-[#5845e0] border-[#3e2fb1] hover:bg-[#6c5ae6] text-white'}`}>
                      {copied ? '✅ COPY COMPLETE' : '診断指示をコピー'}
                   </button>
                   <div className="grid grid-cols-3 gap-3 w-full">
                      {['CHATGPT', 'GEMINI', 'CLAUDE'].map(ai => (
                        <button key={ai} onClick={() => window.open(ai === 'CHATGPT' ? 'https://chatgpt.com' : ai === 'GEMINI' ? 'https://gemini.google.com' : 'https://claude.ai', '_blank')} className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase italic">{ai}</button>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-6 md:p-16 animate-in fade-in space-y-10 text-left">
              <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase text-center mb-10 flex items-center justify-center gap-3"><Rocket className="text-emerald-400" /> 0→1ロードマップ</h2>
              <div className="grid lg:grid-cols-2 gap-12 text-left">
                 <div className="space-y-6">
                    <div className="bg-[#0a0b14] border border-white/5 rounded-[2rem] p-6 flex items-start gap-4 shadow-inner">
                       <Lightbulb className="text-emerald-400 shrink-0" />
                       <p className="text-xs font-bold text-slate-400 italic">選んだ副業名を入れて「作成指示」をコピー。AIが具体的手順を教えます。</p>
                    </div>
                    <textarea value={roadmapInput} onChange={(e) => setRoadmapInput(e.target.value)} placeholder="例: AI画像生成によるSNS運用代行" className="w-full h-48 bg-[#0a0b14] border-2 border-white/10 rounded-[2rem] p-8 text-lg text-white outline-none focus:border-emerald-500 shadow-inner leading-relaxed italic" />
                    <button onClick={() => handleCopy(getRoadmapPrompt())} className={`w-full h-20 text-xl font-black rounded-3xl transition-all shadow-xl border-b-8 ${copied ? 'bg-emerald-500 border-emerald-800' : 'bg-emerald-600 border-emerald-800 hover:bg-emerald-500 text-white'}`}>
                      {copied ? '✅ COPY COMPLETE' : '作成指示をコピー'}
                    </button>
                 </div>
                 <textarea value={roadmapResult} onChange={(e) => setRoadmapResult(e.target.value)} placeholder="AIが教えてくれた具体的な手順をここに保存..." className="w-full h-[360px] bg-[#0a0b14] border-2 border-white/10 rounded-[2.5rem] p-8 text-sm text-slate-300 focus:border-emerald-500 outline-none shadow-inner leading-relaxed italic" />
              </div>
            </div>
          )}

          {activeTab === 'calc' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-6 md:p-16 animate-in fade-in space-y-12 text-left">
              <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase text-center mb-8 flex items-center justify-center gap-3">💰 収益シミュレーター</h2>
              <div className="max-w-md mx-auto space-y-12 text-left">
                 <div className="space-y-6">
                    <div className="flex justify-between items-end px-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Unit Price</span>
                       <span className="text-2xl font-black text-white italic">¥{price.toLocaleString()}</span>
                    </div>
                    <input type="range" min="1000" max="50000" step="500" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-[#5845e0] cursor-pointer" />
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-end px-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Monthly Vol.</span>
                       <span className="text-2xl font-black text-white italic">{count} <span className="text-xs">UNITS</span></span>
                    </div>
                    <input type="range" min="1" max="100" step="1" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-[#5845e0] cursor-pointer" />
                 </div>
                 <div className="bg-black p-12 rounded-[3rem] border-2 border-emerald-500/30 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-20" />
                    <p className="text-[10px] font-black text-emerald-500 mb-4 uppercase tracking-[0.4em] italic">Monthly Revenue</p>
                    <p className="text-6xl md:text-7xl font-black text-white italic tracking-tighter shadow-emerald-500/20 drop-shadow-2xl">¥{(price * count).toLocaleString()}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <DebugPanel data={{ activeTab, hasAnswers: Object.keys(answers).length > 0 }} toolId="ai-sidejob-master" />
    </div>
  )
}

const AiSidejobWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Master Node...</div>
})

export default function NoSSRWrapper() {
  return <AiSidejobWithNoSSR />;
}
