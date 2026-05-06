'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Rocket, Lightbulb, CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
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

  const LIFESTYLE_CHECKLIST = [
    { cat: "基盤", q: "週に最低5〜10時間を副業に充てる余裕がある" },
    { cat: "規則", q: "本業の会社で副業が認められている" },
    { cat: "環境", q: "自宅にPCや通信環境など集中できる場所がある" },
    { cat: "体力", q: "本業後や休日に活動できる体力・気力がある" },
    { cat: "武器", q: "人から教えを請われるような得意分野がある" },
    { cat: "独学", q: "分からないことを自分でググって解決できる" },
    { cat: "IT", q: "ドキュメントやZoomなどのツールを抵抗なく使える" },
    { cat: "管理", q: "納期や約束の時間を厳守できる" },
    { cat: "責任", q: "トラブル時に人のせいにせず自分で対処できる" },
    { cat: "自走", q: "誰からも指示されなくても目標を決めて動ける" },
    { cat: "切替", q: "本業と副業のメンタル的な切り替えができる" },
    { cat: "理解", q: "始めた直後は時給0円の期間があることを許容できる" },
    { cat: "税務", q: "年間20万超の利益で確定申告を行う準備がある" },
    { cat: "投資", q: "必要なツールに無理のない範囲で投資できる" }
  ];

  const checkCount = Object.values(checklist).filter(Boolean).length;
  const checkStatus = checkCount >= 12 ? { label: "副業適性バッチリ！", color: "text-emerald-500", desc: "すぐに準備を始めましょう。" } 
                    : checkCount >= 8 ? { label: "準備中...", color: "text-amber-500", desc: "不足項目をクリアしてからスタート。" }
                    : { label: "要注意", color: "text-red-500", desc: "まずは生活習慣の見直しから。" };

  const getAuditPrompt = () => {
    const selected = QUESTIONS.filter((_, i) => answers[i]).join('\n・');
    const checkedItems = LIFESTYLE_CHECKLIST.filter((_, i) => checklist[i]).map(item => item.q).join('\n・');
    return `あなたはプロの副業コンサルタントです。
以下の「成功法則」と私の現状に基づき、最適なAI副業を3つ提案してください。

【副業成功の鉄則】
1. 即金性のある作業で成功体験を積む（1ヶ月目目標：1万円）
2. スキルを蓄積して単価を上げる（2ヶ月目：3万円、3ヶ月目：5万円〜）
3. 無理な高額教材には手を出さず、無料ツールを使い倒す

【私の特性】
・${selected || "特になし（初心者）"}

【ライフスタイル・準備状況】
・${checkedItems || "未確認"}
（現在の適性スコア: ${checkCount}/${LIFESTYLE_CHECKLIST.length}）

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
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-1 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">AI副業スタートダッシュ</h1>
          <div className="inline-block bg-[#5845e0] text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-sm tracking-widest shadow-2xl">MASTER v2.0</div>
        </div>

        <div className="bg-[#13141f] border border-white/5 rounded-3xl p-6 max-w-4xl mx-auto flex items-start gap-6 shadow-inner text-left">
          <div className="w-14 h-14 rounded-2xl border border-[#5845e0]/30 flex items-center justify-center shrink-0 text-[#5845e0] font-bold text-2xl bg-[#5845e0]/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-black text-[#5845e0] uppercase tracking-[0.3em] italic mb-2">Production Protocol / SYSTEM GUIDE</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-[#5845e0] italic text-2xl">#1</span> 適性・生活環境にチェックを入れ「診断指示」をコピー</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-[#5845e0] italic text-2xl">#2</span> 下のAIボタンから貼り付けて、自分に合う副業を特定</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-[#5845e0] italic text-2xl">#3</span> 特定した副業を「②ロードマップ」に入れ、手順を錬成</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-[#1a1b26]/50 p-1.5 rounded-2xl border border-white/5 max-w-4xl mx-auto">
          {[{ id: 'audit', label: '① 適性診断' }, { id: 'roadmap', label: '② ロードマップ' }, { id: 'calc', label: '③ 収益計算' }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all ${activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="mt-4 max-w-5xl mx-auto">
          {activeTab === 'audit' && (
            <div className="space-y-8 animate-in fade-in">
              {/* 生活習慣・環境チェックリスト */}
              <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-6 md:p-12 shadow-2xl relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3"><ShieldCheck className="text-emerald-500" /> <h2 className="text-xl md:text-2xl font-black text-white italic uppercase">生活習慣・環境チェック</h2></div>
                  <div className="text-right leading-none">
                    <p className="text-[10px] font-black text-slate-500 uppercase italic mb-1">Checked Items</p>
                    <p className="text-3xl font-black text-white italic">{checkCount} <span className="text-xs text-slate-500">/ {LIFESTYLE_CHECKLIST.length}</span></p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-3 mb-10 text-left">
                  {LIFESTYLE_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-black border border-white/20 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all group" onClick={() => setChecklist(prev => ({...prev, [i]: !prev[i]}))}>
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${checklist[i] ? 'bg-emerald-500 border-emerald-400' : 'border-white/20'}`}>
                        {checklist[i] && <CheckCircle2 size={16} className="text-slate-950" />}
                      </div>
                      <span className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors"><Badge variant="outline" className="mr-2 text-[10px] text-emerald-500 border-emerald-500/30 px-1 py-0">{item.cat}</Badge>{item.q}</span>
                    </div>
                  ))}
                </div>

                <div className={`p-6 rounded-2xl border-2 flex items-center gap-6 ${checkCount >= 8 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                   <div className="text-3xl">🎯</div>
                   <div>
                      <p className={`text-xl font-black italic ${checkStatus.color}`}>{checkStatus.label}</p>
                      <p className="text-xs text-slate-400 font-bold italic">{checkStatus.desc}</p>
                   </div>
                </div>
              </div>

              {/* 副業特性診断 */}
              <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-6 md:p-12 shadow-2xl relative text-left">
                <div className="flex items-center gap-3 mb-8"><Zap className="text-[#5845e0]" /> <h2 className="text-xl md:text-2xl font-black text-white italic uppercase">副業スキル・特性診断</h2></div>
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
                  <div className="bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 flex flex-col items-center justify-center space-y-6 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5845e0] to-transparent opacity-30" />
                    <button onClick={() => handleCopy(getAuditPrompt())} className={`w-full h-24 text-xl md:text-2xl font-black rounded-3xl transition-all shadow-2xl border-b-8 ${copied ? 'bg-emerald-500 border-emerald-800 scale-95' : 'bg-[#5845e0] border-[#3e2fb1] hover:bg-[#6c5ae6] text-white'}`}>
                        {copied ? '✅ COPY COMPLETE' : '診断指示をコピー'}
                    </button>
                    <div className="grid grid-cols-3 gap-3 w-full">
                        <button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-20 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg">
                          <span className="text-xl">💬</span> CHATGPT
                        </button>
                        <button onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-20 bg-white/5 border-2 border-blue-500/30 rounded-2xl text-[10px] font-black uppercase italic text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg">
                          <span className="text-xl">✨</span> GEMINI
                        </button>
                        <button onClick={() => window.open('https://claude.ai', '_blank')} className="h-20 bg-white/5 border-2 border-orange-500/30 rounded-2xl text-[10px] font-black uppercase italic text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg">
                          <span className="text-xl">❄️</span> CLAUDE
                        </button>
                    </div>
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
                       <p className="text-xs font-bold text-slate-400 italic">選んだ副業名を入れて指示をコピー。AIが具体的手順を教えます。</p>
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
              
              <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 flex items-start gap-5 shadow-inner mb-10">
                <div className="w-12 h-12 rounded-2xl border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-500 font-bold text-xl bg-emerald-500/5">!</div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Profit Calculation Protocol</p>
                  <div className="space-y-2 text-sm md:text-lg font-black text-slate-200">
                    <p className="flex items-center gap-3 leading-snug"><span className="text-emerald-500 italic">#1</span> スライダーを左右に動かして「案件の単価」を決める</p>
                    <p className="flex items-center gap-3 leading-snug"><span className="text-emerald-500 italic">#2</span> 下のスライダーで「1ヶ月にこなす件数」を決める</p>
                    <p className="flex items-center gap-3 leading-snug"><span className="text-emerald-600 italic">#3</span> 下の枠に「あなたの月間予想収益」がリアルタイムで表示されます</p>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-12 text-left">
                 <div className="space-y-6">
                    <div className="flex justify-between items-end px-2">
                       <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">1回あたりの単価 (Unit Price)</span>
                       <span className="text-3xl font-black text-white italic">¥{price.toLocaleString()}</span>
                    </div>
                    <input type="range" min="1000" max="100000" step="500" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full h-3 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer hover:accent-emerald-400 transition-all" />
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-end px-2">
                       <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">1ヶ月の件数 (Monthly Vol.)</span>
                       <span className="text-3xl font-black text-white italic">{count} <span className="text-xs">件</span></span>
                    </div>
                    <input type="range" min="1" max="100" step="1" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full h-3 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer hover:accent-emerald-400 transition-all" />
                 </div>
                 <div className="bg-black p-12 rounded-[3rem] border-4 border-emerald-500/50 text-center relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-50" />
                    <p className="text-[12px] font-black text-emerald-500 mb-4 uppercase tracking-[0.4em] italic">月間予想収益 / MONTHLY REVENUE</p>
                    <p className="text-6xl md:text-8xl font-black text-white italic tracking-tighter drop-shadow-2xl">¥{(price * count).toLocaleString()}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <DebugPanel data={{ activeTab, checkCount, roadmapLen: roadmapResult.length }} toolId="ai-sidejob-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Sidejob Automation OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Master Node...</div>
})

export default function NoSSRWrapperExport() {
  return <NoSSRWrapper />;
}
