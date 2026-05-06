'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, RotateCcw, Lightbulb, Search, ShieldCheck, 
  LayoutGrid, Loader2, Share2, ClipboardPaste, Sparkles, Zap, Trash2, 
  Send, Instagram, Twitter, MessageSquare, Video, TrendingUp, ExternalLink, HeartHandshake
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const WEAPONS = [
  { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'text-blue-400', prompt: "あなたはプロのX運用担当者です。以下の【トレンド】と【戦略パーツ】を元に、インプレッションが最大化する140文字以内の投稿を3パターン作成してください。\n\n【制約条件】:\n・余計な挨拶や解説は一切省き、投稿本文のみを出力してください。\n・各パターンは「---」で区切ってください。" },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', prompt: "あなたは人気インスタグラマーです。以下の【トレンド】と【戦略パーツ】を組み合わせて、情緒的なキャプションとハッシュタグ15個を作成してください。\n\n【制約条件】:\n・余計な挨拶や解説は一切省き、投稿本文とハッシュタグのみを出力してください。\n・各パターンは「---」で区切ってください。" },
  { id: 'tiktok', label: 'TikTok / Reels', icon: Video, color: 'text-rose-500', prompt: "あなたはバズ動画作家です。以下の【トレンド】と【戦略パーツ】を元に、最初の3秒で惹きつける動画台本を作成してください。\n\n【制約条件】:\n・余計な解説は省き、台本の内容のみを出力してください。" },
  { id: 'threads', label: 'Threads', icon: MessageSquare, color: 'text-slate-200', prompt: "あなたはコラムニストです。以下の【トレンド】と【戦略パーツ】について、深い共感を生む長文を構成してください。\n\n【制約条件】:\n・余計な挨拶は省き、本文のみを出力してください。" },
  { id: 'konkatsu', label: '結婚相談所モード', icon: HeartHandshake, color: 'text-rose-400', prompt: "あなたは「マリッジロードジャパン」を運営するプロの婚活カウンセラーです。上級心理カウンセラーの知見を活かし、読者の成婚意欲を高め、相談所に繋げる投稿を3パターン作成してください。\n\n【制約条件】:\n・ターゲット：20代〜40代の本気で結婚したい男女\n・トーン：信頼感がありつつ、時に鋭く本質を突く語り口\n・各パターンは「---」で区切ってください。" },
];

const STRATEGY_PARTS = [
  { label: "💥 本音・暴露系", content: "【戦略：本音・暴露】業界の当たり前に疑問を呈し、皆が言いにくいことを代弁する鋭い言葉で。" },
  { label: "🎓 有益Tips", content: "【戦略：有益Tips】今日から使える業務効率化の神知識を、箇条書きを使って10秒で伝わる構成に。" },
  { label: "😭 共感・エモ", content: "【戦略：共感・エモ】深夜の独り言のような、挑戦の孤独と希望に寄り添うエモーショナルな文章。" },
  { label: "🧵 図解スレッド", content: "【戦略：スレッド誘導】続きが読みたくなる仕掛けを施し、深い知識へ誘導する導入文。" },
  { label: "⚖️ 比較・検証", content: "【戦略：比較検証】AとBの違いを明確にし、独自の視点で結論を出すプロのレビュー。" },
  { label: "📰 ニュース要約", content: "【戦略：要約】複雑な時事ネタを中学生でもわかるレベルに噛み砕き、一言解説を添えて。" },
  { label: "❓ 質問・対話", content: "【戦略：エンゲージメント】フォロワーが回答しやすい二択や質問を投げかけ、交流を生む。" },
  { label: "🔥 モチベーション", content: "【戦略：鼓舞】やる気が出ない人の背中を強力に押す、力強いメッセージとマインドセット。" },
  { label: "💍 婚活・成婚", content: "【戦略：婚活戦略】成婚のプロが教える、婚活の「残酷な真実」と「選ばれるための具体的アクション」。" },
  { label: "💑 心理・相性", content: "【戦略：心理分析】上級心理カウンセラーの知見から、長く続くカップルの共通点と心理的安全性。" },
  { label: "📅 婚活ルーティン", content: "【戦略：ライフスタイル】週末の婚活パーティーやデートの準備など、成婚者が実践しているルーティン。" }
];

const MasterEngine = () => {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const response = await fetch('/api/trends', { cache: 'no-store' });
      const data = await response.json();
      if (data.trends) setTrends(data.trends);
    } catch (error) {
      setTrends(["AI革命", "最新ガジェット", "働き方改革", "メタバース", "Web3"]);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted) return null;

  const currentWeapon = WEAPONS.find(w => w.id === activeWeapon);

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-red-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full shadow-lg">Social Intelligence Hub</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">SNSオートポスター</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v2.0-MASTER</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-in fade-in duration-700">
        <div className="space-y-6">
          <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />
             
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest">① SUBJECT (TRENDS)</p>
                   <Badge variant="outline" className="text-red-500 border-red-500/20 uppercase italic text-[8px]">Real-time Feed</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   {isLoadingTrends ? Array(4).fill(0).map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />) : trends.map((t, i) => {
                     const line = `【トレンド】：${t}`;
                     const isActive = inputData.includes(line);
                     return <button key={i} onClick={() => setInputData(prev => prev.includes(line) ? prev.split('\n').filter(l => l !== line).join('\n') : (prev ? `${prev}\n${line}` : line))} className={`h-14 border-2 font-black text-[10px] uppercase italic rounded-xl transition-all ${isActive ? 'bg-red-600 border-white text-white scale-95 shadow-lg' : 'border-white/5 bg-black text-slate-500'}`}>{t}</button>;
                   })}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-500 px-2"><Zap size={20} /><p className="text-[10px] font-black uppercase italic tracking-widest">② STRATEGY PARTS</p></div>
                <div className="grid grid-cols-2 gap-3">
                   {STRATEGY_PARTS.map((p, i) => {
                     const isActive = inputData.includes(p.content);
                     return <button key={i} onClick={() => setInputData(prev => prev.includes(p.content) ? prev.split('\n').filter(l => l !== p.content).join('\n') : (prev ? `${prev}\n${p.content}` : p.content))} className={`h-14 border-2 font-black text-[10px] uppercase italic rounded-xl transition-all ${isActive ? 'bg-orange-600 border-white text-white scale-95 shadow-lg' : 'border-white/5 bg-black text-slate-500'}`}>{p.label}</button>;
                   })}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center text-left">
           <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-8 md:p-12 relative shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              
              <div className="space-y-6 mb-8">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Generation Terminal</p>
                 <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="トレンドと戦略を組み合わせてください..." className="w-full h-32 bg-black border-2 border-white/5 rounded-[2rem] p-6 text-lg text-white font-bold focus:border-red-600 outline-none leading-relaxed shadow-inner italic" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                 {WEAPONS.map(w => <button key={w.id} onClick={() => setActiveWeapon(w.id)} className={`py-4 rounded-xl transition-all border-2 flex flex-col items-center justify-center gap-2 ${activeWeapon === w.id ? 'bg-red-600 border-white text-white scale-105 shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:text-white'}`}><w.icon size={20} /><span className="text-[8px] font-black uppercase italic">{w.label}</span></button>)}
              </div>

              {activeWeapon && (
                <div className="space-y-4 animate-in zoom-in-95">
                  <button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【データ】：\n${inputData}`)} className={`w-full h-24 text-2xl font-black rounded-3xl transition-all shadow-2xl border-b-8 ${copied ? 'bg-emerald-500 border-emerald-800 text-slate-950' : 'bg-red-600 border-red-800 text-white hover:bg-red-500'}`}>{copied ? '✅ COPY COMPLETE' : '③ 指示をコピーして実行'}</button>
                  <div className="grid grid-cols-3 gap-3">
                     {['CHATGPT', 'GEMINI', 'CLAUDE'].map(ai => <button key={ai} onClick={() => window.open(ai === 'CHATGPT' ? 'https://chatgpt.com' : ai === 'GEMINI' ? 'https://gemini.google.com' : 'https://claude.ai', '_blank')} className="h-14 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-xl uppercase hover:text-white transition-all text-xs">{ai}</button>)}
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-emerald-500">
            <Zap size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Master Protocol Sync</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            最新トレンド（本物）とSNS心理学（戦略）をAIが融合。バズを「偶然」から「科学」へ変える最強の投稿錬成OSです。
         </p>
      </div>

      <DebugPanel data={{ activeWeapon, trendCount: trends.length }} toolId="sns-auto-poster-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Social Automation OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Social Master...</div>
})

export default function SnsAutoPosterWrapper() {
  return <NoSSRWrapper />;
}
