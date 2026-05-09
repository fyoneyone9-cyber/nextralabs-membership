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
    "人の悩みを聞いて解決策を考えるのが得意だ",
    "動画編集や映像制作に興味がある",
    "語学（英語など）が得意、または勉強中だ",
    "数字やデータを分析・整理するのが得意だ",
    "人に何かを教えることが好きだ",
    "ものを売ること、交渉することが得意だ",
    "音楽・ナレーション・声の仕事に興味がある",
    "アイデアを考え、企画を立てることが好きだ"
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
                    : checkCount >= 8 ? { label: "準備中...", color: "text-emerald-500", desc: "不足項目をクリアしてからスタート。" }
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
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left rounded-2xl my-1 md:my-4">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">AI副業スタートダッシュ</h1>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 font-medium px-3 py-1 rounded-full text-xs border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MASTER v2.0
          </div>
        </div>

        <div className="bg-[#13141f] border border-white/5 rounded-xl p-5 max-w-4xl mx-auto flex items-start gap-4 shadow-inner text-left">
          <div className="w-10 h-10 rounded-lg border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-semibold text-sm bg-emerald-500/5">i</div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-400 mb-1">使いかた・活用マニュアル</p>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-3 leading-relaxed"><span className="text-emerald-400 font-semibold">#1</span> 適性・生活環境にチェックを入れ「診断指示」をコピー</p>
              <p className="flex items-center gap-3 leading-relaxed"><span className="text-emerald-400 font-semibold">#2</span> 下のAIボタンから貼り付けて、自分に合う副業を特定</p>
              <p className="flex items-center gap-3 leading-relaxed"><span className="text-emerald-400 font-semibold">#3</span> 特定した副業を「②ロードマップ」に入れ、手順を錬成</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-[#1a1b26]/50 p-1.5 rounded-xl border border-white/5 max-w-4xl mx-auto">
          {[{ id: 'audit', label: '① 適性診断' }, { id: 'roadmap', label: '② ロードマップ' }, { id: 'calc', label: '③ 収益計算' }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 px-2 rounded-lg font-semibold text-xs md:text-sm transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="mt-4 max-w-5xl mx-auto">
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-in fade-in">
              {/* 生活習慣・環境チェックリスト */}
              <div className="bg-[#13141f] border border-white/10 rounded-xl p-5 md:p-8 shadow-lg relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2"><ShieldCheck className="text-emerald-500" size={18} /> <h2 className="text-lg font-semibold text-white">生活習慣・環境チェック</h2></div>
                  <div className="text-right leading-none">
                    <p className="text-xs text-slate-500 mb-1">チェック済み</p>
                    <p className="text-2xl font-bold text-white">{checkCount} <span className="text-xs text-slate-500">/ {LIFESTYLE_CHECKLIST.length}</span></p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-6 text-left">
                  {LIFESTYLE_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-all group" onClick={() => setChecklist(prev => ({...prev, [i]: !prev[i]}))}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${checklist[i] ? 'bg-emerald-500 border-emerald-400' : 'border-white/20'}`}>
                        {checklist[i] && <CheckCircle2 size={13} className="text-slate-950" />}
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-emerald-400 transition-colors"><Badge variant="outline" className="mr-2 text-[10px] text-emerald-500 border-emerald-500/30 px-1 py-0">{item.cat}</Badge>{item.q}</span>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-4 ${checkCount >= 8 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                   <div className="text-2xl">🎯</div>
                   <div>
                      <p className={`text-base font-semibold ${checkStatus.color}`}>{checkStatus.label}</p>
                      <p className="text-xs text-slate-400">{checkStatus.desc}</p>
                   </div>
                </div>
              </div>

              {/* 副業特性診断 */}
              <div className="bg-[#13141f] border border-white/10 rounded-xl p-5 md:p-8 shadow-lg relative text-left">
                <div className="flex items-center gap-2 mb-6"><Zap className="text-emerald-400" size={18} /> <h2 className="text-lg font-semibold text-white">副業スタイルを選択</h2></div>
                <p className="text-sm text-slate-400 mb-4">理想の「稼ぎ方」を直感で選べ →</p>
                <div className="grid lg:grid-cols-2 gap-8 text-left">
                  <div className="space-y-2">
                    {QUESTIONS.map((q, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-[#0a0b14] border border-white/5 rounded-xl cursor-pointer hover:border-emerald-500/40 transition-all group" onClick={() => setAnswers(prev => ({...prev, [i]: !prev[i]}))}>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors leading-relaxed">{q}</span>
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ml-3 ${answers[i] ? 'bg-emerald-500 border-emerald-400' : 'border-white/10'}`}>
                          {answers[i] && <CheckCircle2 size={14} className="text-slate-950" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#0a0b14] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center space-y-4 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />
                    <button onClick={() => handleCopy(getAuditPrompt())} className={`w-full h-12 text-base font-semibold rounded-lg transition-all shadow-lg ${copied ? 'bg-emerald-500 scale-95 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
                        {copied ? '✓ コピー完了' : '診断指示をコピー →'}
                    </button>
                    <p className="text-xs text-slate-500 text-center">コピーして下のAIに貼り付けてください</p>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        <button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-12 bg-white/5 border border-emerald-500/20 rounded-lg text-xs font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                          ChatGPT
                        </button>
                        <button onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-12 bg-white/5 border border-emerald-500/20 rounded-lg text-xs font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                          Gemini
                        </button>
                        <button onClick={() => window.open('https://claude.ai', '_blank')} className="h-12 bg-white/5 border border-emerald-500/20 rounded-lg text-xs font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                          Claude
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-[#13141f] border border-white/10 rounded-xl p-5 md:p-10 animate-in fade-in space-y-6 text-left">
              <div className="flex items-center gap-2 mb-2"><Rocket className="text-emerald-400" size={18} /> <h2 className="text-lg font-semibold text-white">0→1ロードマップ</h2></div>
              <div className="grid lg:grid-cols-2 gap-8 text-left">
                 <div className="space-y-4">
                    <div className="bg-[#0a0b14] border border-white/5 rounded-xl p-4 flex items-start gap-3 shadow-inner">
                       <Lightbulb className="text-emerald-400 shrink-0" size={16} />
                       <p className="text-xs text-slate-400 leading-relaxed">選んだ副業名を入れて指示をコピー。AIが具体的手順を教えます。</p>
                    </div>
                    <textarea value={roadmapInput} onChange={(e) => setRoadmapInput(e.target.value)} placeholder="例: AI画像生成によるSNS運用代行" className="w-full h-40 bg-[#0a0b14] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-emerald-500 shadow-inner leading-relaxed" />
                    <button onClick={() => handleCopy(getRoadmapPrompt())} className={`w-full h-12 text-sm font-semibold rounded-lg transition-all shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
                      {copied ? '✓ コピー完了' : '作成指示をコピー →'}
                    </button>
                 </div>
                 <textarea value={roadmapResult} onChange={(e) => setRoadmapResult(e.target.value)} placeholder="AIが教えてくれた具体的な手順をここに保存..." className="w-full h-72 bg-[#0a0b14] border border-white/10 rounded-xl p-4 text-sm text-slate-300 focus:border-emerald-500 outline-none shadow-inner leading-relaxed" />
              </div>
            </div>
          )}

          {activeTab === 'calc' && (
            <div className="bg-[#13141f] border border-white/10 rounded-xl p-5 md:p-10 animate-in fade-in space-y-8 text-left">
              <div className="flex items-center gap-2 mb-2"><span className="text-emerald-400 text-lg">¥</span> <h2 className="text-lg font-semibold text-white">収益シミュレーター</h2></div>
              
              <div className="bg-[#0a0b14] border border-white/5 rounded-xl p-4 flex items-start gap-4 shadow-inner">
                <div className="w-8 h-8 rounded-lg border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 text-xs bg-emerald-500/5">i</div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-emerald-400">収益計算の使い方</p>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-medium">#1</span> スライダーを動かして「案件の単価」を決める</p>
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-medium">#2</span> 下のスライダーで「1ヶ月にこなす件数」を決める</p>
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-medium">#3</span> 月間予想収益がリアルタイム表示されます</p>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-8 text-left">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                       <span className="text-sm font-medium text-slate-400">1回あたりの単価</span>
                       <span className="text-2xl font-bold text-white">¥{price.toLocaleString()}</span>
                    </div>
                    <input type="range" min="1000" max="100000" step="500" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                       <span className="text-sm font-medium text-slate-400">1ヶ月の件数</span>
                       <span className="text-2xl font-bold text-white">{count} <span className="text-sm font-normal">件</span></span>
                    </div>
                    <input type="range" min="1" max="100" step="1" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer" />
                 </div>
                 <div className="bg-black p-8 rounded-xl border-2 border-emerald-500 text-center relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 opacity-60" />
                    <p className="text-xs font-medium text-emerald-400 mb-3 tracking-wide">月間予想収益</p>
                    <p className="text-5xl md:text-6xl font-bold text-white tracking-tight">¥{(price * count).toLocaleString()}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <DebugPanel data={{ activeTab, checkCount, roadmapLen: roadmapResult.length }} toolId="ai-sidejob-master" />
      <div className="text-center opacity-20 mt-8 text-xs text-slate-500">Sidejob Automation OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center text-emerald-500 text-sm animate-pulse">読み込み中...</div>
})

export default function NoSSRWrapperExport() {
  return <NoSSRWrapper />;
}
