'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Briefcase, Rocket, TrendingUp, Target } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① スキル・状況', icon: Briefcase },
  { id: 'plan', label: '② 副業プラン', icon: Rocket },
];

export default function AiSidejob() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [skillInfo, setSkillInfo] = useState('');
  const [sidejobPlan, setSidejobPlan] = useState('');

  const FINAL_PROMPT = `あなたは副業とスモールビジネスの立ち上げに精通した起業コンサルタントです。
以下の【現在のスキル・利用可能な時間】を元に、月5〜10万円を最速で稼ぐための副業プランを出力してください。

1. 【おすすめの副業ジャンル】: ユーザーの強みを活かせる、今参入すべき市場。
2. 【初月のアクションプラン】: 最初の1円を稼ぐまでの具体的な0→1ステップ。
3. 【AI活用による効率化】: AIを使って作業時間を1/10にするための具体的なツールとプロンプト活用法。

リスクを抑え、着実に収益化するための「スタートダッシュ計画」をお願いします。

【スキル・状況】:
${skillInfo || '（ここに現在のスキル、得意なこと、副業に使える時間を入力してください）'}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">BUSINESS STARTUP</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI 副業スタートダッシュ</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Briefcase className="text-indigo-500" /> ① スキル・状況入力</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={skillInfo} onChange={(e) => setSkillInfo(e.target.value)} placeholder="得意なこと、資格、趣味、1日に使える時間などを入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-indigo-500 outline-none font-medium shadow-inner" />
                 {skillInfo && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>計画指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-indigo-500" /><h3 className="text-lg font-black text-white italic uppercase">AIのプランを戻す</h3></div>
                 <textarea value={sidejobPlan} onChange={(e) => setSidejobPlan(e.target.value)} placeholder="AIからの副業案をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {sidejobPlan && <Button onClick={() => setActiveTab('plan')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 副業プランを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'plan' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-indigo-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Rocket className="text-emerald-500 animate-pulse" /> 収益化スタートダッシュ計画</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{sidejobPlan || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setSkillInfo(''); setSidejobPlan(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の条件で計画する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
