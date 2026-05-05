import fs from 'fs';
import path from 'path';

const toolsDir = 'C:/Users/fyone/Desktop/membership-site-fix/src/components/tools';

const toolsInfo = [
  { name: 'MovingChecker', label: 'AI引っ越し安心チェッカー', icon: '🏠', what: '物件リスクの数値化', how: '物件情報や住所を入力。AIが治安・騒音・利便性を多角的に分析しスコア化します。', result: '失敗しない住まい選びの指標' },
  { name: 'OfficePoliticsGraph', label: '社内政治 相関図', icon: '👑', what: '非公式組織図の可視化', how: 'Slack等のメンション履歴や会議データを入力。AIが実質的なキーマンと影響力を暴き出します。', result: '組織のパワーバランス・マップ' },
  { name: 'SnsAutoPoster', label: 'SNSオートポスター', icon: '📱', what: 'マルチSNS投稿の一括生成', how: '発信したいトピックを入力。AIがXやInstagramに最適なハッシュタグ付き投稿文を自動作成します。', result: '拡散力の高い投稿案' },
  { name: 'StayseeFinderEngine', label: 'Staysee AI Finder', icon: '🏨', what: '忘れ物特定AI', how: '拾得物の写真をアップロード。AIが特徴を抽出し、宿泊台帳から持ち主を特定します。', result: '宿泊客の特定と連絡用メール案' },
  { name: 'KdpGuide', label: 'Kindle出版手順ナビ', icon: '📚', what: '電子書籍出版の全工程ガイド', how: '現在の執筆状況を入力。AIがKDP登録から出版までの最短ステップとプロンプトを作成します。', result: '個人出版完全ロードマップ' },
  { name: 'AiReportGenerator', label: 'AIレポートジェネレーター', icon: '📑', what: 'ビジネスレポート自動生成', how: '箇条書きのメモを入力。AIがプロフェッショナルな週報や企画書へ整形します。', result: '高品質なドキュメント完成' },
  { name: 'ShoppingStopper', label: 'AI買い物依存ストッパー', icon: '🚫', what: '衝動買いの心理ブレーキ', how: '購入を迷っている商品名と価格を入力。AIが期待値と後悔率を冷徹に算出し、決断を助けます。', result: '冷静な家計判断データ' },
  { name: 'RealTimeScope', label: 'AI万能リアルタイム・スコープ', icon: '🔍', what: '視覚情報の全方位診断', how: 'カメラで見ている状況を説明。AIが環境・用途・目的を統合的に解析しアドバイスします。', result: '目の前の状況への最適解' }
];

toolsInfo.forEach(t => {
  const code = `'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Copy, HelpCircle, Zap, CheckCircle2, Globe } from 'lucide-react'

export default function ${t.name}() {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("スプレッドシート形式不要、詳細に漏れのないように抜き出して下さい。:" + inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl text-5xl">${t.icon}</div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">${t.label}</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-full shadow-lg">STEP 01</Badge>
            <h3 className="text-3xl font-black italic uppercase">${t.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">${t.how}</p>
          <div className="bg-black/20 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
             <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg"><Zap className="h-8 w-8 text-slate-950 fill-current" /></div>
             <div>
               <p className="text-emerald-300 font-black text-xl italic uppercase tracking-widest leading-none mb-1">Expected Success:</p>
               <p className="text-white font-bold text-lg">${t.result}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto">
          <div className="space-y-12 text-center">
             <div className="space-y-6">
                <Label className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 italic"><Zap className="h-5 w-5" /> 1. Input Source Data</Label>
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="ここに情報を貼り付け..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-2xl font-medium focus:border-indigo-600 text-white shadow-inner" />
             </div>
             <Button onClick={handleCopy} className={"w-full h-32 font-black text-4xl rounded-[2.5rem] shadow-2xl transition-all " + (copied ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100')}>
                {copied ? '✅ COPIED!' : '指示をコピー'}
             </Button>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                <a href="https://gemini.google.com" target="_blank" className="p-10 rounded-[2.5rem] border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                  <span className="text-5xl">💎</span><span className="font-black text-white text-2xl tracking-tighter">GEMINI</span>
                </a>
                <a href="https://chatgpt.com" target="_blank" className="p-10 rounded-[2.5rem] border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                  <span className="text-5xl">🟢</span><span className="font-black text-white text-2xl tracking-tighter">GPT</span>
                </a>
                <a href="https://claude.ai" target="_blank" className="p-10 rounded-[2.5rem] border-2 border-orange-500/50 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                  <Badge className="bg-orange-600 text-white border-0 font-black mb-1">Recommended</Badge>
                  <span className="text-5xl">🟠</span><span className="font-black text-orange-400 text-2xl tracking-tighter">CLAUDE</span>
                </a>
             </div>
          </div>
        </Card>
      </div>

      <DebugPanel data={null} toolId="${t.name.toLowerCase()}" />
    </div>
  )
}
`;
  fs.writeFileSync(path.join(toolsDir, t.name + '.tsx'), code, 'utf8');
});
console.log('✅ SURGICAL RESTORATION OF ALL TOOLS COMPLETE.');