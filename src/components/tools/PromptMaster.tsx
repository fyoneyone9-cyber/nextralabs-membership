'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, Image as ImageIcon, Sparkles, Wand2, Type
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① イメージ入力', icon: Type },
  { id: 'master', label: '② プロンプト完成', icon: Wand2 },
];

export default function PromptMaster() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [imageConcept, setImageConcept] = useState('');
  const [finalPrompt, setFinalPrompt] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPT_ENGINE = `あなたは世界最高峰のAIプロンプトエンジニアです。
以下の【画像コンセプト】を、MidjourneyやDALL-E 3で最高の成果を出すための「芸術的な英文プロンプト」へ昇華させてください。

【画像コンセプト】:
${imageConcept || '（ここに作りたい画像のイメージを入力してください）'}

【出力形式】:
1. 【日本語解説】: プロンプトに込めたこだわり、ライティング、構図の説明。
2. 【Master Prompt】: コピペで使える詳細な英文プロンプト。

フォトリアル、アニメ、サイバーパンクなど、最適なスタイルを自動で補完してください。`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-orange-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">PROMPT ENGINE v2</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Prompt Master</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3 text-orange-500"><Sparkles /> ① イメージ入力</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={imageConcept} onChange={(e) => setImageConcept(e.target.value)} placeholder="例：夕暮れのサイバーパンクな街並み。サイボーグの少女が雨の中で佇んでいる..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-orange-500 outline-none font-medium shadow-inner" />
                 {imageConcept && (
                    <div className="space-y-4">
                       <Button onClick={() => handleCopy(PROMPT_ENGINE)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-orange-600 text-white'}`}>錬成指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>GPT-4o (DALL-E 3) ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-orange-500" /><h3 className="text-lg font-black text-white italic uppercase">AIのプロンプトを戻す</h3></div>
                 <textarea value={finalPrompt} onChange={(e) => setFinalPrompt(e.target.value)} placeholder="AIが作ったプロンプトをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-orange-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {finalPrompt && <Button onClick={() => setActiveTab('master')} className="w-full h-16 mt-8 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② マスタープロンプトを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'master' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-orange-600 text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><ImageIcon className="w-48 h-48" /></div>
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3 relative z-10"><Wand2 className="text-orange-500 animate-pulse" /> Master Prompt Report</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic relative z-10">{finalPrompt || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setImageConcept(''); setFinalPrompt(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 次の画像を錬成する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
