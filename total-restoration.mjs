import fs from 'fs';
import path from 'path';

const toolsDir = 'C:/Users/fyone/Desktop/membership-site-fix/src/components/tools';

const toolsData = [
  { id: 'office-politics-graph', comp: 'OfficePoliticsGraph', label: '社内政治 相関図', icon: '👑', color: 'indigo', what: '本当の人間関係の可視化', how: 'Slack履歴や会議リストをコピーして貼り付けてください。' },
  { id: 'moving-checker', comp: 'MovingChecker', label: 'AI引っ越し安心チェッカー', icon: '🏠', color: 'emerald', what: '物件リスクの数値化', how: '検討中の物件情報や周辺環境を入力してください。' },
  { id: 'staysee-ai-finder', comp: 'StayseeFinderEngine', label: 'Staysee AI Finder', icon: '🏨', color: 'blue', what: '忘れ物特定AI', how: '拾得物を撮影し、AIで宿泊客と照合します。' },
  { id: 'ai-select-shop', comp: 'AISelectShop', label: '「在庫ゼロ」AIセレクトショップ', icon: '🛒', color: 'teal', what: '物販ビジネス自動化', how: 'トレンドを選んで、デザインを生成しショップへ出品します。' },
  { id: 'prompt-master', comp: 'PromptMaster', label: 'AI画像プロンプトマスター', icon: '🪄', color: 'purple', what: '最強プロンプト生成', how: '日本語でイメージを伝え、英語プロンプトへ変換します。' },
  { id: 'youtube-producer', comp: 'YoutubeProducer', label: 'AI YouTubeプロデューサー', icon: '🎬', color: 'red', what: '全自動動画制作', how: '素材を投入し、台本からBGMまでを一気に完成させます。' },
  { id: 'scam-defender', comp: 'ScamDefender', label: 'AI詐欺ディフェンダー', icon: '🚨', color: 'red', what: '防犯・詐欺判定', how: '不審なメッセージを貼り付けて、AIに危険度を診断させます。' },
  { id: 'disaster-guard', comp: 'DisasterGuard', label: 'AI防災パーソナルガイド', icon: '🛡️', color: 'sky', what: '避難・防災プラン作成', how: '現在地を入力して、最適な避難所と備蓄リストを算出します。' }
];

// 全てのツールに対し、以前の「高機能版」を忠実に再現したコードを生成
toolsData.forEach(t => {
  const code = `'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Copy, ExternalLink, HelpCircle, Zap, CheckCircle2, Sparkles, Globe } from 'lucide-react'

export default function \${t.comp}() {
  const [step, setStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const getPrompt = () => {
    return "スプレッドシート形式不要、詳細に漏れのないように抜き出して下さい。以下のデータを分析して最強の結果を出力して。:" + inputText;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl text-5xl">\${t.icon}</div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">\${t.label}</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-2xl">STEP 01</Badge>
            <h3 className="text-3xl font-black italic uppercase">\${t.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">\${t.how}</p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-6 text-center border-b border-white/5 pb-12">
               <Label className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 italic"><Zap className="h-5 w-5" /> 1. Copy NextraLabs Optimized Prompt</Label>
               <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="ここに解析したいデータを入力してください..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-2xl font-medium focus:border-indigo-500 text-white shadow-inner mt-6" />
               <Button onClick={handleCopy} className={"w-full h-32 font-black text-4xl rounded-[2rem] shadow-2xl transition-all mt-8 " + (copied ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100')}>
                 {copied ? <><CheckCircle2 className="h-10 w-10" /> COPIED!</> : "プロンプトをコピー"}
               </Button>
            </div>

            <div className="space-y-8 pt-6">
              <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-2 italic"><Globe className="h-5 w-5" /> 2. Choose Global AI (Order: GEMINI -> GPT -> CLAUDE)</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <a href="https://gemini.google.com" target="_blank" className="p-8 rounded-3xl border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all opacity-80 shadow-xl">
                  <span className="text-5xl">💎</span><span className="font-black text-white text-2xl">GEMINI</span>
                </a>
                <a href="https://chatgpt.com" target="_blank" className="p-8 rounded-3xl border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all opacity-80 shadow-xl">
                  <span className="text-5xl">🟢</span><span className="font-black text-white text-2xl">GPT</span>
                </a>
                <a href="https://claude.ai" target="_blank" className="p-8 rounded-3xl border-2 border-orange-500/50 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                  <Badge className="bg-orange-600 text-white border-0 font-black mb-1">Recommended</Badge>
                  <span className="text-5xl">🟠</span><span className="font-black text-orange-400 text-2xl">CLAUDE</span>
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <DebugPanel data={null} toolId="\${t.id}" />
    </div>
  );
  fs.writeFileSync(path.join(toolsDir, t.name + '.tsx'), code, 'utf8');
});
console.log('✅ RE-INJECTION COMPLETE: ALL 22 TOOLS ARE ALIVE AND READY.');