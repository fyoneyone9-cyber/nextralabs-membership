'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, Image as ImageIcon, Sparkles, Wand2, Type, LayoutGrid, Palette, Target
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

  const FINAL_PROMPT = `あなたは世界一のAIプロンプトエンジニアです。
以下の【画像コンセプト】を、【${selectedCat}】の用途で最高のクオリティになる「詳細な英文プロンプト」へ昇華してください。

【画像コンセプト】:
${concept || '（作りたいイメージ）'}

【出力要件】:
1. 【Master Prompt】: DALL-E 3やMidjourneyでそのまま使える、4k, masterpieceタグ付きの英文。
2. 【日本語解説】: プロンプトに込めた意図、構図、ライティングの説明。`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-orange-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">PROMPT ENGINE v2.0</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl text-shadow-orange">Prompt Master</h1>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-950 border border-orange-600/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-orange-500"><Lightbulb /></div>
              <div className="space-y-1">
                <p className="text-xs font-black text-orange-500 uppercase italic tracking-widest">How to Play</p>
                <p className="text-sm font-bold text-slate-300">1. カテゴリを選んでイメージを入力する</p>
                <p className="text-sm font-bold text-slate-300">2. 指示をコピーしてAIに最高のプロンプトを作らせる</p>
                <p className="text-sm font-bold text-slate-300">3. 完成したプロンプトを持ち帰る</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCat(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${selectedCat === cat ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>{cat}</button>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <textarea value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="日本語で作りたい画像のイメージを入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-200 focus:border-orange-500 outline-none font-medium shadow-inner" />
                   <Button onClick={() => handleCopy(FINAL_PROMPT)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-orange-600 text-white hover:bg-orange-500'}`}>錬成指示をコピー</Button>
                   <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini ↗</Button></div>
                </div>
                <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                   <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-orange-500" /><h3 className="text-lg font-black text-white italic uppercase">完成プロンプトを戻す</h3></div>
                   <textarea value={resultPrompt} onChange={(e) => setResultPrompt(e.target.value)} placeholder="AIが作った英文プロンプトをここにペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-[10px] text-slate-300 focus:border-orange-500 outline-none font-mono leading-relaxed" />
                </div>
              </div>
            </div>
            {resultPrompt && <Button onClick={() => setActiveTab('master')} className="w-full h-16 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② マスタープロンプトを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}

        {activeTab === 'master' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-orange-600 text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 text-white"><ImageIcon className="w-64 h-64" /></div>
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3 relative z-10"><Wand2 className="text-orange-500 animate-pulse" /> Mastered AI Prompt</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic relative z-10">{resultPrompt || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setConcept(''); setResultPrompt(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
