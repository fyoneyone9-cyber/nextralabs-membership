'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Briefcase, Rocket, TrendingUp, Target, ListChecks, CheckCircle2, DollarSign, Clock, BarChart3
} from 'lucide-react'

const TABS = [
  { id: 'diagnosis', label: '① 適性診断', icon: Target },
  { id: 'roadmap', label: '② ロードマップ', icon: Briefcase },
  { id: 'simulator', label: '③ 収益計算', icon: DollarSign },
];

const QUESTIONS = [
  { id: 1, text: "コツコツと文章を書くのが苦ではない", cat: "writing" },
  { id: 2, text: "デザインや美しいものを作るのが好きだ", cat: "design" },
  { id: 3, text: "SNSで発信することに抵抗がない", cat: "sns" },
  { id: 4, text: "プログラミングやITツールを触るのが好きだ", cat: "it" },
  { id: 5, text: "人の悩みを聞いて解決策を考えるのが得意だ", cat: "consulting" },
];

export default function AiSidejob() {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [skillInfo, setSkillInfo] = useState('');
  const [sidejobPlan, setSidejobPlan] = useState('');
  const [unitPrice, setUnitPrice] = useState(5000);
  const [quantity, setQuantity] = useState(10);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDiagnosisPrompt = () => {
    const answeredPositives = QUESTIONS.filter(q => answers[q.id]).map(q => q.text).join('、');
    return `あなたは起業コンサルタントです。私の適性は「${answeredPositives}」です。今すぐ参入すべきAI副業TOP3と目標金額を提示してください。`;
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white"><Lightbulb /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-indigo-400 uppercase italic tracking-widest">Startup Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2"><span className="text-indigo-500 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">BUSINESS INCUBATOR</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl leading-tight">AI 副業スタートダッシュ</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[700px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'diagnosis' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><Target /> ① 副業適性診断</h3>
            {renderGuide(['質問に答えて強みを可視化する', '指示をコピーしてAI三台体制（Claude/Gemini/ChatGPT）へ投げる', 'AIの診断結果をロードマップ画面へ戻す'])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  {QUESTIONS.map(q => (
                    <div key={q.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-colors">
                       <p className="text-sm md:text-lg font-bold text-slate-300">{q.text}</p>
                       <button onClick={() => setAnswers({...answers, [q.id]: !answers[q.id]})} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${answers[q.id] ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-800 text-slate-700'}`}>
                         {answers[q.id] ? <CheckCircle2 /> : null}
                       </button>
                    </div>
                  ))}
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-center space-y-6 shadow-2xl">
                  <Button onClick={() => handleCopy(getDiagnosisPrompt())} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>診断指示をコピー</Button>
                  <div className="grid grid-cols-3 gap-2">
                     <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                     <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                     <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                  </div>
               </div>
            </div>
            <Button onClick={() => setActiveTab('roadmap')} className="w-full h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">② ロードマップへ進む <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" /></Button>
          </Card>
        )}

        {activeTab === 'roadmap' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-indigo-500"><Rocket /> ② 0→1ロードマップ</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <textarea value={skillInfo} onChange={(e) => setSkillInfo(e.target.value)} placeholder="AIから返ってきたTOP3ジャンル等を入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-indigo-500 outline-none font-medium shadow-inner leading-relaxed" />
                 <Button onClick={() => handleCopy(`副業ジャンル「${skillInfo}」で初月で1円を稼ぐための具体的ステップをAIで作成してください。`)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>計画指示をコピー</Button>
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-indigo-500" /><h3 className="text-xl font-black text-white italic uppercase">AIの回答を戻す</h3></div>
                 <textarea value={sidejobPlan} onChange={(e) => setSidejobPlan(e.target.value)} placeholder="AIが作ったロードマップをペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-indigo-500 outline-none font-mono" />
              </div>
            </div>
            <Button onClick={() => setActiveTab('simulator')} className="w-full h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic group">③ 収益計算へ進む <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" /></Button>
          </Card>
        )}

        {activeTab === 'simulator' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in">
             <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-indigo-500"><DollarSign /> ③ 収益シミュレーター</h3>
             <div className="grid lg:grid-cols-2 gap-12 text-center">
                <div className="space-y-8">
                   <div className="space-y-4 text-left"><p className="text-sm font-black text-slate-400 uppercase italic">単価: ¥{unitPrice.toLocaleString()}</p><input type="range" min="1000" max="50000" step="500" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} className="w-full accent-indigo-600" /></div>
                   <div className="space-y-4 text-left"><p className="text-sm font-black text-slate-400 uppercase italic">月間件数: {quantity} 件</p><input type="range" min="1" max="50" step="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full accent-indigo-600" /></div>
                   <div className="bg-slate-950 p-10 rounded-3xl border border-indigo-600/30 shadow-2xl">
                      <p className="text-xs text-slate-500 font-black uppercase mb-2 italic">Monthly Income</p>
                      <p className="text-7xl font-black text-white italic tracking-tighter">¥{(unitPrice * quantity).toLocaleString()}</p>
                   </div>
                </div>
                <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-center space-y-6 shadow-2xl">
                   <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto shadow-lg"><BarChart3 className="w-10 h-10 text-indigo-500" /></div>
                   <h4 className="text-2xl font-black text-white italic uppercase">Reality Check</h4>
                   <p className="text-slate-400 font-bold italic">副業の目標金額を設定し、実現に向けた第一歩を踏み出しましょう。</p>
                   <Button onClick={() => setActiveTab('diagnosis')} variant="outline" className="h-16 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic">最初からやり直す</Button>
                </div>
             </div>
          </Card>
        )}
      </div>
    </div>
  )
}
