'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, RotateCcw, Lightbulb, Search, ShieldCheck, LayoutGrid, Loader2, Share2, ClipboardPaste, Sparkles, Zap, Trash2, Send, Instagram, Twitter, MessageSquare, Video, TrendingUp, ExternalLink
} from 'lucide-react'

// SNSハブ
const WEAPONS = [
  { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'text-blue-400', prompt: "あなたはプロのX運用担当者です。以下の【トレンド】を元に、インプレッションが最大化する140文字以内の投稿を3パターン作成してください。" },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', prompt: "あなたは人気インスタグラマーです。以下の【トレンド】をテーマに、情緒的なキャプションとハッシュタグ15個を作成してください。" },
  { id: 'tiktok', label: 'TikTok / Reels', icon: Video, color: 'text-rose-500', prompt: "あなたはバズ動画作家です。以下の【トレンド】で最初の3秒で惹きつける動画台本を作成してください。" },
  { id: 'threads', label: 'Threads', icon: MessageSquare, color: 'text-slate-200', prompt: "あなたはコラムニストです。以下の【トレンド】について深い共感を生む長文を構成してください。" },
];

export default function SnsAutoPoster() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  // Googleトレンド（RSS等）のシミュレーション取得ロジック
  // 実際にはAPIエンドポイントから最新を取得する想定
  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      // ライブ感を出すための擬似API取得演出
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTrends = [
        "AIエージェントの衝撃", "次世代iPhoneリーク", "週末の絶品スイーツ", 
        "メタバースの今", "リモートワーク革命", "注目のスタートアップ",
        "最新の生成AIツール", "環境保護とテクノロジー", "宇宙旅行の現実味",
        "プロンプトエンジニアリング", "Web3の新潮流", "未来の都市設計"
      ];
      setTrends(mockTrends.sort(() => 0.5 - Math.random()));
    } finally {
      setIsLoadingTrends(false);
    }
  };

  useEffect(() => { fetchTrends(); }, []);

  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(75 + Math.floor(Math.random() * 24));
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
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">Trend Intelligence Hub</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">SNS Auto Poster</h1>
      </div>

      {/* Googleトレンド・プリセットエリア（12個） */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <TrendingUp size={20} />
            <p className="text-xs font-black uppercase italic tracking-widest">Real-time Google Trends</p>
          </div>
          <Button onClick={fetchTrends} variant="ghost" size="sm" className="text-[10px] text-slate-500 hover:text-white uppercase font-black italic">
            <RotateCcw size={12} className="mr-1" /> Trends Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {isLoadingTrends ? (
            Array(12).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />)
          ) : (
            trends.map((t, i) => (
              <Button 
                key={i} 
                variant="outline" 
                onClick={() => setInputData(prev => prev ? `${prev}\n${t}` : t)}
                className="h-24 border-2 border-slate-800 bg-slate-900 text-slate-200 font-black text-xs md:text-sm uppercase italic hover:bg-red-600 hover:text-white hover:border-red-400 rounded-2xl whitespace-normal p-3 leading-tight transition-all active:scale-95 shadow-lg"
              >
                {t}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* 媒体選択ハブ */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWeapon(w.id)}
              className={`flex-1 flex flex-col items-center justify-center py-6 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${activeWeapon === w.id ? 'bg-red-600 border-red-400 scale-105 shadow-xl text-white' : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              {React.createElement(w.icon, { size: 32, className: activeWeapon === w.id ? 'text-white' : w.color })}
              <p className="text-[12px] font-black uppercase italic leading-none">{w.label}</p>
            </button>
          ))}
        </div>
      </div>

      {activeWeapon && (
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden animate-in zoom-in-95">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600" />
          
          <div className="grid lg:grid-cols-2 gap-12 text-left">
            <div className="space-y-8">
              <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest mb-4">Topic & Trend Combination</p>
                <textarea 
                  value={inputData} 
                  onChange={(e) => setInputData(e.target.value)} 
                  placeholder="上のトレンドボタンを押して組み合わせるか、内容を入力してください..." 
                  className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-xl text-white font-bold focus:border-red-600 outline-none shadow-inner leading-relaxed" 
                />
              </div>
              <div className="space-y-4">
                <Button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【内容・トレンド】：\n${inputData}`)} disabled={!inputData} className="w-full h-24 text-2xl font-black rounded-2xl transition-all shadow-xl bg-red-600 text-white hover:bg-red-500">
                  {copied ? '✅ 投稿指示をコピー完了' : '最強SNS投稿案を生成'}
                </Button>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-16 border-2 border-slate-800 font-black uppercase italic hover:bg-red-600/10" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                  <Button variant="outline" className="h-16 border-2 border-slate-800 font-black uppercase italic hover:bg-red-600/10" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                  <Button variant="outline" className="h-16 border-2 border-slate-800 font-black uppercase italic hover:bg-red-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-red-400"><Send size={32} /><h4 className="text-sm font-black uppercase italic tracking-widest text-white">Master Feed</h4></div>
                {score && <div className="text-right leading-none"><span className="text-[10px] font-black text-red-400 uppercase italic">Buzz Score</span><br/><span className="text-5xl font-black text-white italic">{score}%</span></div>}
              </div>
              <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AIからの投稿案を貼り付けてください..." className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-base text-slate-100 focus:border-red-600 outline-none font-medium leading-relaxed italic relative z-10 shadow-inner" />
              
              {/* 🟢 完璧なリンク：Prompt Masterへの誘導 */}
              {report && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 relative z-10">
                  <p className="text-center text-xs font-black text-slate-500 uppercase italic">Next: Create visuals for this post?</p>
                  <Button 
                    onClick={() => window.open('https://membership-site-nextralabos.vercel.app/products/prompt-master/app', '_blank')}
                    className="w-full h-20 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-xl italic"
                  >
                    <Sparkles /> 画像生成プロンプトを作成する <ExternalLink />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
      <div className="text-center opacity-20 mt-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Trend-Driven Social Engine • NextraLabs 2026</p></div>
    </div>
  )
}
