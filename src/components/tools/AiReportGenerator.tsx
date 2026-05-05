'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, RotateCcw, LayoutGrid, Loader2, ClipboardPaste, ShieldCheck, MessageSquare, BarChart3, Briefcase, Target, ShieldAlert
} from 'lucide-react'

const WEAPONS = [
  { 
    id: 'meeting', 
    label: '会議・議事録', 
    desc: '決定事項とTODOを即座に抽出', 
    icon: MessageSquare, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10',
    prompt: "あなたはプロの書記・議事録作成者です。以下の会議メモから「議題」「決定事項」「保留事項」「次回までのTODO」を整理し、ビジネス報告書形式で出力してください。",
    presets: [
      { label: "定例会議のまとめ", content: "【議題】今期の売上報告と来期の施策。【状況】A案は承認、B案は予算の都合で再検討。次回までに各担当が見積もりを出すこと。" },
      { label: "ブレスト・アイデア出し", content: "新商品のネーミング案。10個以上の候補が出たが、最終的に『NextraCore』が有力候補。ターゲットは30代ビジネスマン。" }
    ]
  },
  { 
    id: 'sales', 
    label: '営業・商談報告', 
    desc: '顧客の温度感と成約への一手を分析', 
    icon: Briefcase, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    prompt: "あなたはトップセールスマンです。商談の内容から「顧客の課題（BANT）」「競合状況」「懸念点」を分析し、成約率を最大化するための次の一手を提案する報告書を作成してください。",
    presets: [
      { label: "初回訪問のヒアリング", content: "顧客は現在のシステムに不満。予算は100万程度。導入時期は3ヶ月以内を希望。決裁権者は部長だが、現場の反対がある。" },
      { label: "クロージング直前の商談", content: "価格面での最終調整。競合他社より2割高いと指摘あり。機能面での優位性は理解されているが、保守サポートに不安を感じている。" }
    ]
  },
  { 
    id: 'daily', 
    label: '日報・週報作成', 
    desc: '成果と課題をスマートに言語化', 
    icon: BarChart3, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    prompt: "あなたは管理職・メンターです。断片的な業務ログから、今日の成果、発生した課題、成長に繋がる学びを整理した、上司が納得するプロ仕様の日報を作成してください。",
    presets: [
      { label: "多忙な1日のログ", content: "午前：資料作成。午後：外回り3件、トラブル対応1件。残業2時間。明日は企画書の締め切り。疲労困憊だが収穫はあった。" },
      { label: "トラブル・反省の週報", content: "顧客へのメール返信が遅れ、クレーム一歩手前に。原因はタスク管理不足。対策として朝一のタスク整理を徹底する。" }
    ]
  },
  { 
    id: 'plan', 
    label: '企画・提案書骨子', 
    desc: '説得力のあるロジックを構成', 
    icon: Target, 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10',
    prompt: "あなたは戦略プランナーです。以下の企画の断片を、PREP法やピラミッドストラクチャーを用いて、論理的で説得力のある提案書・レポート構成案に仕上げてください。",
    presets: [
      { label: "新規事業の種", content: "AIを使った家事代行マッチング。共働き夫婦がターゲット。安心感をどう出すかが鍵。サブスクモデルを検討中。" },
      { label: "社内改善の提案", content: "リモートワークの効率化。コミュニケーションツールを見直したい。無駄な会議を減らし、成果物ベースの評価制度を導入したい。" }
    ]
  },
  { 
    id: 'apology', 
    label: '謝罪・始末書案', 
    desc: '誠意を伝え信頼を回復する', 
    icon: ShieldAlert, 
    color: 'text-rose-500', 
    bg: 'bg-rose-500/10',
    prompt: "あなたは危機管理の専門家です。発生したミス・不祥事の事実関係から、誠意が伝わり、再発防止策が明確な謝罪文・始末書のドラフトを作成してください。",
    presets: [
      { label: "納期遅延の謝罪", content: "システムバグにより納品が3日遅れる。原因は検証漏れ。多大な損害を与えた。今後はテスト工程をダブルチェック体制にする。" },
      { label: "誤送信・情報漏洩（軽微）", content: "宛先を間違えてメール送信。すぐに気づいて取り消し依頼。幸い機密情報は含まれていなかったが、信頼を損ねた。" }
    ]
  },
];

export default function AiReportGenerator() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visiblePresets, setVisiblePresets] = useState<any[]>([]);

  const STEPS = ["用途を選択", "素材を入力", "AI解析依頼", "最終判定"];
  const activeStepIndex = !activeWeapon ? 0 : (report ? 3 : 2);

  useEffect(() => {
    if (activeWeapon) {
      const weapon = WEAPONS.find(w => w.id === activeWeapon);
      if (weapon) setVisiblePresets(weapon.presets || []);
    }
  }, [activeWeapon]);

  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(85 + Math.floor(Math.random() * 14));
        setIsProcessing(false);
      }, 1500);
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
        <Badge className="bg-slate-700 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]">Business Document Engine</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI レポート作成</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic text-sm transition-all duration-500 ${i <= activeStepIndex ? 'bg-slate-200 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span className={`text-[11px] font-black uppercase italic tracking-tighter ${i <= activeStepIndex ? 'text-slate-200' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => { setActiveWeapon(w.id); setInputData(''); setReport(''); setScore(null); }}
              className={`flex-1 flex flex-col items-center justify-center py-5 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${activeWeapon === w.id ? 'bg-slate-200 border-white scale-105 shadow-xl text-slate-950' : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              {React.createElement(w.icon, { size: 24 })}
              <div className="text-center">
                <p className="text-[10px] font-black uppercase italic leading-none mb-1">{w.label}</p>
                <p className={`text-[8px] font-bold opacity-60 ${activeWeapon === w.id ? 'text-slate-800' : ''}`}>{w.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!activeWeapon ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
           {WEAPONS.map((w) => (
             <Card key={w.id} onClick={() => setActiveWeapon(w.id)} className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 hover:border-slate-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                <div className={`absolute top-0 right-0 w-32 h-32 ${w.bg} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-30 transition-opacity`} />
                <div className={`w-16 h-16 ${w.bg} ${w.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>{React.createElement(w.icon, { size: 32 })}</div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-2">{w.label}</h3>
                <p className="text-slate-500 font-bold text-sm">{w.desc}</p>
             </Card>
           ))}
        </div>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {visiblePresets.map((p, i) => (
               <Button key={i} variant="outline" onClick={() => setInputData(p.content)} className="h-24 border-2 border-slate-800 bg-slate-900 text-slate-300 font-black text-xs uppercase italic hover:bg-slate-200 hover:text-slate-950 rounded-3xl whitespace-normal p-4 shadow-lg transition-all active:scale-95 leading-tight">{p.label}</Button>
             ))}
          </div>

          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500" />
            
            <div className="flex justify-between items-center mb-10 text-left">
              <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase flex items-center gap-4">{React.createElement(currentWeapon!.icon, { size: 40, className: "text-slate-400" })} {currentWeapon?.label}</h3>
              <Button onClick={() => setActiveWeapon(null)} variant="ghost" className="text-slate-500 font-black italic uppercase hover:text-white"><LayoutGrid size={16} className="mr-2" /> 用途を選び直す</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-8">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                  <p className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest mb-4">Draft Materials</p>
                  <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="会議の断片メモや、報告したい事実関係を入力してください..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-lg text-white font-bold focus:border-slate-500 outline-none shadow-inner" />
                </div>
                <div className="space-y-4">
                  <Button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【素材データ】：\n${inputData}`)} className={`w-full h-16 font-black rounded-xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-950 hover:bg-white'}`}>
                    {copied ? '✅ 指示をコピーしました' : '最強解析指示をコピー'}
                  </Button>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-slate-200 hover:text-slate-950 rounded-xl" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-slate-200 hover:text-slate-950 rounded-xl" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-slate-200 hover:text-slate-950 rounded-xl" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
                {score && <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl animate-in fade-in duration-1000" />}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 text-slate-400"><ShieldCheck size={24} /><h4 className="text-sm font-black uppercase italic tracking-widest">Master Report</h4></div>
                  {score && <div className="text-right leading-none"><span className="text-[10px] font-black text-slate-400 uppercase italic">Document Quality</span><br/><span className="text-4xl font-black text-white italic animate-in zoom-in">{score}<span className="text-sm ml-1">%</span></span></div>}
                </div>
                <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AIが生成した清書レポートをここに貼り付けると、品質スコアが算出されます..." className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-sm text-slate-300 focus:border-slate-500 outline-none font-medium leading-relaxed italic relative z-10 shadow-inner" />
                {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-10 h-10 text-white animate-spin" /><p className="text-xs font-black text-slate-400 uppercase italic tracking-widest">Evaluating Documentation...</p></div>}
              </div>
            </div>
          </Card>
        </div>
      )}
      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Business Efficiency Engine • NextraLabs 2026</p></div>
    </div>
  )
}
