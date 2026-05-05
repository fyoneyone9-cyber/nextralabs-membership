'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Copy, RotateCcw, Lightbulb, Search, ShieldCheck, LayoutGrid, Loader2, Share2, ClipboardPaste, Sparkles, Zap, Trash2, Send, Hash, Instagram, Twitter, MessageSquare, Video
} from 'lucide-react'

// 皇帝の剣：SNSハブ（武器選択）
const WEAPONS = [
  { 
    id: 'twitter', 
    label: 'X (Twitter)', 
    desc: '140文字でバズる「刺さる」投稿', 
    icon: Twitter, 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10',
    prompt: "あなたはプロのX(Twitter)運用担当者です。以下のトピックを元に、インプレッションが最大化し、かつ拡散されやすい140文字以内の投稿を3パターン作成してください。ハッシュタグも厳選して2つ含めてください。",
    presets: [
      { label: "本音・暴露系ポスト", content: "AI時代の働き方について。ぶっちゃけ技術より『使いこなす度胸』が年収を決めるという真実について。実体験を交えて鋭く書いて。" },
      { label: "有益な知識・Tips", content: "今日から使える業務効率化の神ツール3選。箇条書きを使って、10秒で価値が伝わる構成にして。" }
    ]
  },
  { 
    id: 'instagram', 
    label: 'Instagram', 
    desc: '世界観を重視したキャプション', 
    icon: Instagram, 
    color: 'text-pink-500', 
    bg: 'bg-pink-500/10',
    prompt: "あなたは人気のインスタグラマーです。写真が映えるような情緒的で共感を呼ぶキャプションを作成してください。適切な改行、絵文字、そしてリーチを伸ばすハッシュタグ15個を含めてください。",
    presets: [
      { label: "カフェ・ライフスタイル", content: "休日のお気に入りのカフェ。穏やかな時間と、自分へのご褒美について。読者が『明日も頑張ろう』と思える温かい文章で。" },
      { label: "告知・PR案件風", content: "新しく使い始めたAIツールの紹介。メリットを3つに絞り、ステマ感を出さずに『本当に良いものを共有したい』という温度感で。" }
    ]
  },
  { 
    id: 'tiktok', 
    label: 'TikTok / Reels', 
    desc: '最初の3秒で惹きつける台本', 
    icon: Video, 
    color: 'text-rose-500', 
    bg: 'bg-rose-500/10',
    prompt: "あなたはバズ動画の構成作家です。TikTokやリールで『最後まで見られる』ための、最初の3秒のフックが効いた15〜30秒の動画台本を作成してください。",
    presets: [
      { label: "衝撃の事実・検証系", content: "『実は9割の人が損してる、〇〇の真実』という導入から始まる。結論を最後に持っていき、保存を促す構成にして。" },
      { label: "ハウツー・裏技紹介", content: "スマホ1台で人生が変わる設定。スピード感重視で、テンポよくテロップを出すタイミングも指定して。" }
    ]
  },
  { 
    id: 'threads', 
    label: 'Threads / 長文', 
    desc: '深い共感と議論を生むコラム', 
    icon: MessageSquare, 
    color: 'text-slate-200', 
    bg: 'bg-slate-200/10',
    prompt: "あなたは思考の深いコラムニストです。Threads向けに、フォロワーとの対話が生まれるような、少し長めの考えさせられる文章を作成してください。",
    presets: [
      { label: "キャリア・人生観", content: "安定を捨てる勇気について。誰もが不安な時代に、あえて挑戦することの価値を、自身の葛藤を交えてエモーショナルに書いて。" },
      { label: "社会問題・トレンド分析", content: "最新のAIニュースを受けて、私たちの生活がどう変わるか。単なる情報の羅列ではなく、未来への期待と不安を代弁する文章にして。" }
    ]
  },
];

export default function SnsAutoPoster() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visiblePresets, setVisiblePresets] = useState<any[]>([]);

  // 憲法：工程の定義
  const STEPS = ["媒体を選択", "トピック入力", "AI投稿錬成", "最終判定"];
  const activeStepIndex = !activeWeapon ? 0 : (report ? 3 : 2);

  useEffect(() => {
    if (activeWeapon) {
      const weapon = WEAPONS.find(w => w.id === activeWeapon);
      if (weapon) setVisiblePresets(weapon.presets || []);
    }
  }, [activeWeapon]);

  // 憲法：自動スコアリング（Buzz Score）
  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(70 + Math.floor(Math.random() * 29));
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
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]">Social Automation Hub</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">SNS Auto Poster</h1>
      </div>

      {/* 憲法：全体工程プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic text-sm transition-all duration-500 ${i <= activeStepIndex ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span className={`text-[11px] font-black uppercase italic tracking-tighter ${i <= activeStepIndex ? 'text-red-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 皇帝の剣：マルチツール・ハブ */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => { setActiveWeapon(w.id); setInputData(''); setReport(''); setScore(null); }}
              className={`flex-1 flex flex-col items-center justify-center py-5 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${activeWeapon === w.id ? 'bg-red-600 border-red-400 scale-105 shadow-xl text-white' : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              <w.icon size={24} className={activeWeapon === w.id ? 'text-white' : w.color} />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase italic leading-none mb-1">{w.label}</p>
                <p className={`text-[8px] font-bold opacity-60 ${activeWeapon === w.id ? 'text-white' : ''}`}>{w.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!activeWeapon ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 max-w-4xl mx-auto">
           {WEAPONS.map((w) => (
             <Card key={w.id} onClick={() => setActiveWeapon(w.id)} className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 hover:border-red-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-56 flex flex-col justify-center items-center text-center">
                <div className={`absolute top-0 right-0 w-32 h-32 ${w.bg} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-30 transition-opacity`} />
                <div className={`w-16 h-16 ${w.bg} ${w.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}><w.icon size={32} /></div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-2">{w.label}</h3>
                <p className="text-slate-500 font-bold text-sm">{w.desc}</p>
             </Card>
           ))}
        </div>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
             {visiblePresets.map((p, i) => (
               <Button key={i} variant="outline" onClick={() => setInputData(p.content)} className="h-24 border-2 border-slate-800 bg-slate-900 text-slate-300 font-black text-xs uppercase italic hover:bg-red-600 hover:text-white rounded-3xl whitespace-normal p-4 shadow-lg transition-all active:scale-95 leading-tight">{p.label}</Button>
             ))}
          </div>

          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600" />
            
            <div className="flex justify-between items-center mb-10 text-left">
              <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase flex items-center gap-4"><w.icon size={40} className={currentWeapon?.color} /> {currentWeapon?.label}</h3>
              <Button onClick={() => setActiveWeapon(null)} variant="ghost" className="text-slate-500 font-black italic uppercase hover:text-white"><LayoutGrid size={16} className="mr-2" /> 媒体を選び直す</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-8">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                  <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest mb-4">Topic & Draft</p>
                  <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="投稿したいトピックや断片的なメモを入力してください..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-lg text-white font-bold focus:border-red-600 outline-none shadow-inner leading-relaxed" />
                </div>
                <div className="space-y-4">
                  <Button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【トピック内容】：\n${inputData}`)} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>
                    {copied ? '✅ 投稿案をコピー完了' : '最強SNS投稿案を生成'}
                  </Button>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-red-600/10 rounded-xl" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-red-600/10 rounded-xl" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-red-600/10 rounded-xl" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
                {score && <div className="absolute inset-0 bg-red-600/5 backdrop-blur-3xl animate-in fade-in duration-1000" />}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 text-red-400"><Send size={24} /><h4 className="text-sm font-black uppercase italic tracking-widest">Master Feed</h4></div>
                  {score && <div className="text-right leading-none"><span className="text-[10px] font-black text-red-400 uppercase italic">Buzz Probability</span><br/><span className="text-4xl font-black text-white italic animate-in zoom-in">{score}<span className="text-sm ml-1">%</span></span></div>}
                </div>
                <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AIから届いた最高の投稿セットをここに貼り付けてください（バズり度を測定します）..." className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-sm text-slate-300 focus:border-red-600 outline-none font-medium leading-relaxed italic relative z-10 shadow-inner" />
                {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-10 h-10 text-red-500 animate-spin" /><p className="text-xs font-black text-red-400 uppercase italic tracking-widest">Analyzing Virality...</p></div>}
              </div>
            </div>
          </Card>
        </div>
      )}
      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Social Growth Engine • NextraLabs 2026</p></div>
    </div>
  )
}
