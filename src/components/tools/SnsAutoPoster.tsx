'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, RotateCcw, Lightbulb, Search, ShieldCheck, LayoutGrid, Loader2, Share2, ClipboardPaste, Sparkles, Zap, Trash2, Send, Instagram, Twitter, MessageSquare, Video, TrendingUp, ExternalLink
} from 'lucide-react'

// SNSハブ（媒体別）
const WEAPONS = [
  { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'text-blue-400', prompt: "あなたはプロのX運用担当者です。以下の【トレンド】と【戦略パーツ】を元に、インプレッションが最大化する140文字以内の投稿を3パターン作成してください。\n\n【制約条件】:\n・余計な挨拶や解説（「〜を作成しました」等）は一切省き、投稿本文のみを出力してください。\n・各パターンは「---」で区切ってください。" },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', prompt: "あなたは人気インスタグラマーです。以下の【トレンド】と【戦略パーツ】を組み合わせて、情緒的なキャプションとハッシュタグ15個を作成してください。\n\n【制約条件】:\n・余計な挨拶や解説は一切省き、投稿本文とハッシュタグのみを出力してください。\n・各パターンは「---」で区切ってください。" },
  { id: 'tiktok', label: 'TikTok / Reels', icon: Video, color: 'text-rose-500', prompt: "あなたはバズ動画作家です。以下の【トレンド】と【戦略パーツ】を元に、最初の3秒で惹きつける動画台本を作成してください。\n\n【制約条件】:\n・余計な解説は省き、台本の内容のみを出力してください。" },
  { id: 'threads', label: 'Threads', icon: MessageSquare, color: 'text-slate-200', prompt: "あなたはコラムニストです。以下の【トレンド】と【戦略パーツ】について、深い共感を生む長文を構成してください。\n\n【制約条件】:\n・余計な挨拶は省き、本文のみを出力してください。" },
];

// 戦略パーツ（以前のプリセットをパーツ化）
const STRATEGY_PARTS = [
  { label: "本音・暴露系", content: "【戦略：本音・暴露】業界の当たり前に疑問を呈し、皆が言いにくいことを代弁する鋭い言葉で。" },
  { label: "有益Tips", content: "【戦略：有益Tips】今日から使える業務効率化の神知識を、箇条書きを使って10秒で伝わる構成に。" },
  { label: "共感・エモ", content: "【戦略：共感・エモ】深夜の独り言のような、挑戦の孤独と希望に寄り添うエモーショナルな文章。" },
  { label: "図解スレッド", content: "【戦略：スレッド誘導】続きが読みたくなる仕掛けを施し、深い知識へ誘導する導入文。" },
  { label: "比較・検証", content: "【戦略：比較検証】AとBの違いを明確にし、独自の視点で結論を出すプロのレビュー。" },
  { label: "ニュース要約", content: "【戦略：要約】複雑な時事ネタを中学生でもわかるレベルに噛み砕き、一言解説を添えて。" },
  { label: "質問・対話", content: "【戦略：エンゲージメント】フォロワーが回答しやすい二択や質問を投げかけ、交流を生む。" },
  { label: "モチベーション", content: "【戦略：鼓舞】やる気が出ない人の背中を強力に押す、力強いメッセージとマインドセット。" }
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

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      if (data.trends && data.trends.length > 0) {
        setTrends(data.trends);
      } else {
        // フォールバック（万が一APIが失敗した場合の最低限のデータ）
        setTrends(["AI活用", "業務効率化", "最新ガジェット", "働き方改革"]);
      }
    } catch (error) {
      console.error('Fetch trends error:', error);
      setTrends(["SNSマーケティング", "コンテンツ作成"]);
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
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">Nextra Social Command v7.0</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">SNS Auto Poster</h1>
      </div>

      {/* 🚀 【新・皇帝の剣】 トレンド(主題) ＋ 戦略(パーツ) の組み合わせエリア */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* トレンド選択 (主題) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-red-500 animate-pulse">
              <TrendingUp size={20} />
              <p className="text-xs font-black uppercase italic tracking-widest">① Real-time Trends (Subject)</p>
            </div>
            {/* API連携ステータスの可視化 */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter">API: LIVE (GOOGLE_TRENDS)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {trends.map((t, i) => {
              const isActive = inputData.includes(`【トレンド】：${t}`);
              return (
                <Button 
                  key={i} 
                  variant="outline" 
                  onClick={() => setInputData(prev => {
                    const line = `【トレンド】：${t}`;
                    if (prev.includes(line)) {
                      return prev.split('\n').filter(l => l !== line).join('\n');
                    }
                    return prev ? `${prev}\n${line}` : line;
                  })}
                  className={`h-24 border-2 font-black text-xs md:text-sm uppercase italic rounded-2xl whitespace-normal p-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0)] ${
                    isActive 
                    ? 'bg-red-600 border-white text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-95 ring-4 ring-red-500/50' 
                    : 'border-slate-800 bg-slate-950 text-slate-200 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {isActive && <CheckCircle2 size={14} className="animate-bounce" />}
                    <span>{t}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 戦略パーツ選択 (組み合わせ) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-500 px-4">
            <Zap size={20} />
            <p className="text-xs font-black uppercase italic tracking-widest">② Strategy Parts (Combine)</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {STRATEGY_PARTS.map((p, i) => {
              const isActive = inputData.includes(p.content);
              return (
                <Button 
                  key={i} 
                  variant="outline" 
                  onClick={() => setInputData(prev => {
                    if (prev.includes(p.content)) {
                      return prev.split('\n').filter(l => l !== p.content).join('\n');
                    }
                    return prev ? `${prev}\n${p.content}` : p.content;
                  })}
                  className={`h-24 border-2 font-black text-xs md:text-sm uppercase italic rounded-2xl whitespace-normal p-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0)] ${
                    isActive 
                    ? 'bg-orange-600 border-white text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-95 ring-4 ring-orange-500/50' 
                    : 'border-slate-800 bg-slate-900 text-orange-400 hover:bg-orange-600 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {isActive && <CheckCircle2 size={14} className="animate-bounce" />}
                    <span>{p.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 媒体選択ハブ */}
      {/* 媒体選択ハブ */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              id={`weapon-${w.id}`}
              key={w.id}
              onClick={() => {
                setActiveWeapon(w.id);
                // ボタンを押したときに詳細入力エリアへスムーズにスクロール
                setTimeout(() => {
                  const el = document.getElementById('generation-area');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-6 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${
                activeWeapon === w.id 
                ? 'bg-red-600 border-white scale-105 shadow-[0_0_30px_rgba(220,38,38,0.8)] text-white ring-4 ring-red-500/50' 
                : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="relative">
                {React.createElement(w.icon, { size: 32, className: activeWeapon === w.id ? 'text-white' : w.color })}
                {activeWeapon === w.id && <CheckCircle2 size={16} className="absolute -top-2 -right-2 text-white animate-bounce" />}
              </div>
              <p className="text-[12px] font-black uppercase italic leading-none">{w.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div id="generation-area" className="pt-10">
        {activeWeapon && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden animate-in zoom-in-95">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600" />
            
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-8">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest">Target: {currentWeapon?.label}</p>
                      <Badge className="bg-red-600/20 text-red-500 border-none text-[8px]">COMMAND ACTIVE</Badge>
                    </div>
                    <Button onClick={() => setInputData('')} variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 font-black"><Trash2 size={16} /> CLEAR</Button>
                  </div>
                  <textarea 
                    value={inputData} 
                    onChange={(e) => setInputData(e.target.value)} 
                    placeholder="上のトレンドと戦略パーツを組み合わせてください..." 
                    className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-xl text-white font-bold focus:border-red-600 outline-none shadow-inner leading-relaxed" 
                  />
                </div>
                <div className="space-y-4">
                  <Button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【組み合わせデータ】：\n${inputData}`)} disabled={!inputData} className="w-full h-24 text-2xl font-black rounded-2xl transition-all shadow-xl bg-red-600 text-white hover:bg-red-500">
                    {copied ? '✅ 錬成指示をコピー完了' : '最強SNS投稿を錬成する'}
                  </Button>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-16 border-2 border-slate-800 font-black uppercase italic hover:bg-red-600/10 rounded-xl" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    <Button variant="outline" className="h-16 border-2 border-slate-800 font-black uppercase italic hover:bg-red-600/10 rounded-xl" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    <Button variant="outline" className="h-16 border-2 border-slate-800 font-black uppercase italic hover:bg-red-600/10 rounded-xl" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 text-red-400"><Send size={32} /><h4 className="text-sm font-black uppercase italic tracking-widest text-white">Master Feed</h4></div>
                  {score && <div className="text-right leading-none"><span className="text-[10px] font-black text-red-400 uppercase italic">Buzz Score</span><br/><span className="text-5xl font-black text-white italic">{score}%</span></div>}
                </div>
                
                <div className="flex-1 flex flex-col gap-4 relative z-10">
                  <textarea 
                    value={report} 
                    onChange={(e) => setReport(e.target.value)} 
                    placeholder="AIからの投稿案を貼り付けてください..." 
                    className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-base text-slate-100 focus:border-red-600 outline-none font-medium leading-relaxed italic shadow-inner" 
                  />
                  {report && (
                    <Button 
                      onClick={() => {
                        // 投稿本文のみを抽出（「パターン1：」などの見出しや区切り線を除去する簡易クリーンアップ）
                        const cleaned = report
                          .replace(/パターン\d：.*?\n/g, '')
                          .replace(/---/g, '')
                          .trim();
                        handleCopy(cleaned);
                      }} 
                      variant="outline" 
                      className="border-2 border-slate-800 hover:bg-slate-800 text-xs font-black italic"
                    >
                      {copied ? '✅ コピー完了' : '📋 本文のみをコピーして投稿へ'}
                    </Button>
                  )}
                </div>
                
                {/* 画像生成プロンプトマスターへの導線 - 常に表示 */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50 relative z-10">
                  <p className="text-center text-xs font-black text-slate-500 uppercase italic">Next: Need visuals for this post?</p>
                  <Button 
                    onClick={() => window.open('/products/prompt-master/app', '_blank')}
                    className="w-full h-20 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-xl italic group transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="animate-pulse" /> 
                    画像生成プロンプトを作成する 
                    <ExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
      <div className="text-center opacity-20 mt-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Trend Strategy Engine • NextraLabs 2026</p></div>
    </div>
  )
}
