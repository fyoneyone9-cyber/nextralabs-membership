'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Image as ImageIcon, Sparkles, Wand2, Type, LayoutGrid, Palette, Target, CheckCircle2
} from 'lucide-react'

const CATEGORIES = [
  '仮プロダクト', 'サービス匁', 'HPトップ', 'ロゴ案', 'プレゼン', '図解', 'SNS広告', 'バナー', 'サムネ', 'ヘッダー', '教材', '歴史再現', '英会話', 'アバター', '映え画', '絵日記', '小説挿絵', '構図変更', 'イラスト化', 'リアル化', 'キャラ', 'ラフ線画', '線画着彩', 'スタイル変', 'LINEスタンプ'
];

export default function PromptMaster() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [concept, setConcept] = useState('');
  const [resultPrompt, setResultPrompt] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPT_ENGINE = `あなたは世界最高峰のAIプロンプトエンジニアです。
以下の【画像コンセプト】を、【${selectedCat}】の用途で最高のクオリティになる「詳細な英文プロンプト」へ昇華してください。

【画像コンセプト】:
${concept || '（未入力）'}

【出力要件】:
1. 【Master Prompt】: DALL-E 3やMidjourneyでそのまま使える英文。
2. 【日本語解説】: プロンプトに込めた意図、構図の説明。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-orange-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-orange-500"><Lightbulb /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-orange-500 uppercase italic tracking-widest opacity-70">Master Protocol</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2 leading-tight"><span className="text-orange-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-orange-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">PROMPT ENGINE v2.0</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Prompt Master</h1>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-orange-500"><Sparkles /> ① イメージ入力</h3>
            {renderGuide(['用途カテゴリを選択する', '作りたいイメージを日本語で入力', '指示をコピーしてAIへ投げ、プロンプトを右に戻す'])}
            <div className="space-y-8">
              <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCat(cat)} className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all ${selectedCat === cat ? 'bg-orange-600 text-white scale-105' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:bg-slate-800'}`}>{cat}</button>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <textarea value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="例：夕暮れのサイバーパンクな街並み。サイボーグの少女が雨の中で佇んでいる..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-orange-500 outline-none font-medium shadow-inner" />
                   <Button onClick={() => handleCopy(PROMPT_ENGINE)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-orange-600 text-white hover:bg-orange-500'}`}>錬成指示をコピー</Button>
                   <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT ↗</Button>
                      <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini ↗</Button>
                   </div>
                </div>
                <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center text-left">
                   <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-orange-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">完成プロンプトを戻す</h3></div>
                   <textarea value={resultPrompt} onChange={(e) => setResultPrompt(e.target.value)} placeholder="AIが作った英文プロンプトをここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-orange-500 outline-none font-mono leading-relaxed" />
                </div>
              </div>
            </div>
            {resultPrompt && (
               <Button onClick={() => setActiveTab('master')} className="w-full h-20 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[1.5rem] shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② マスタープロンプトを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'master' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-orange-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><ImageIcon className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Wand2 className="text-orange-500 animate-pulse w-12 h-12" /> Mastered AI Prompt</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-base text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic relative z-10 font-mono">
                  {resultPrompt || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setConcept(''); setResultPrompt(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
