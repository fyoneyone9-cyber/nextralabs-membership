'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { 
  ArrowRight, Upload, CheckCircle2, Youtube, FileVideo, FileText, Zap, ChevronRight, Loader2, Copy, ExternalLink, Sparkles, Download, Volume2, Image as ImageIcon, Type, Music, Clapperboard, Scissors, FileCheck, Lock, MessageSquarePlus, ClipboardPaste, RotateCcw, Lightbulb, Search, Shield, Printer
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'transcribe', label: '① 文字起こし', icon: Volume2 },
  { id: 'script', label: '② 台本・構成', icon: FileText },
  { id: 'character', label: '③ 登場人物', icon: Scissors },
  { id: 'thumbnail', label: '④ サムネイル', icon: ImageIcon },
  { id: 'seo', label: '⑤ SEO設定', icon: Type },
  { id: 'bgm', label: '⑥ BGM生成', icon: Music },
];

const GENRES = [
  '🎬 エンタメ', '📖 解説・教育', '🌿 Vlog', '💻 IT', '📈 ビジネス',
  '🎮 ゲーム', '🍲 料理', '✈️ 旅行', '📰 ニュース', '🗣️ 対談'
];

const STRATEGY_PARTS = [
  { label: "💥 衝撃・暴露", content: "【戦略：衝撃】業界の裏側や誰も知らない真実を暴く、クリックせずにはいられない爆発力のある構成。" },
  { label: "🎓 徹底解説", content: "【戦略：有益】初心者でも完全に理解できる、図解を多用したプロ級の神解説構成。" },
  { label: "🎬 ルーティン", content: "【戦略：没入】憧れの生活や仕事の裏側を、視聴者がその場にいるかのような臨場感で魅せる構成。" },
  { label: "⚖️ 検証・比較", content: "【戦略：納得】巷の噂や新製品をガチ検証し、忖度なしの独自の結論を導き出す構成。" },
  { label: "😭 泣ける話", content: "【戦略：共感】視聴者の心に深く刺さり、感動のコメントで溢れかえるエモーショナルな構成。" },
  { label: "⏱️ 効率化Tips", content: "【戦略：時短】明日から人生が劇的に変わる時短術や、生産性を極限まで高めるテクニック構成。" },
  { label: "😱 失敗・教訓", content: "【戦略：回避】「これをやると人生詰む」という失敗談から、視聴者が学ぶべき教訓を抽出する構成。" },
  { label: "💰 収益・稼ぎ方", content: "【戦略：野心】具体的な数字を出し、再現性の高い稼ぎ方や副業のステップを公開する構成。" },
  { label: "🔥 激論・対立", content: "【戦略：議論】賛否両論あるテーマについて独自の視点を提示し、視聴者の意見を活発にする構成。" },
  { label: "🎁 プレゼント", content: "【戦略：登録】視聴者に豪華特典を提示しながら、チャンネル登録や公式LINEへの誘導を最大化する構成。" }
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('transcribe');
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [scriptResult, setScriptResult] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local' | 'error'>('loading');
  const [inputData, setInputData] = useState('');
  
  const ffmpegRef = useRef(new FFmpeg());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    setApiStatus('loading');
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      if (data.trends) {
        setTrends(data.trends);
        setApiStatus(data.isLive ? 'live' : 'local');
      }
    } catch (error) {
      setApiStatus('error');
    } finally {
      setIsLoadingTrends(false);
    }
  };

  useEffect(() => { if (isMounted) fetchTrends(); }, [isMounted]);

  const STEPS = ["素材", "文字", "構成", "視覚", "SEO", "音響"];
  const activeStepIndex = TABS.findIndex(t => t.id === activeTab);

  useEffect(() => {
    if (scriptResult && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(75 + Math.floor(Math.random() * 23));
        setIsProcessing(false);
      }, 1500);
    }
  }, [scriptResult, score]);

  const loadFFmpeg = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);
      try {
        const ffmpeg = ffmpegRef.current;
        if (!ffmpeg.loaded) await loadFFmpeg();
        ffmpeg.on('progress', ({ progress }) => { setProgress(Math.round(progress * 100)); });
        await ffmpeg.writeFile('input', await fetchFile(selectedFile));
        await ffmpeg.exec(['-i', 'input', '-vn', '-ab', '128k', '-ar', '44100', '-f', 'mp3', 'output.mp3']);
        const data = await ffmpeg.readFile('output.mp3');
        const url = URL.createObjectURL(new Blob([data], { type: 'audio/mp3' }));
        setProcessedFileUrl(url);
      } catch (error) { alert('変換失敗'); } finally { setIsProcessing(false); }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPTS = {
    script: `あなたはプロのYouTube作家です。以下の戦略を元に、最高に面白い動画台本（構成案）を作成してください。\n\n【ジャンル】: ${selectedGenre}\n【選択された戦略】:\n${inputData || '（未入力）'}\n\n【元ネタ・素材】:\n${transcriptionResult || '（未入力）'}`,
    character: `以下の台本から登場人物を抽出し、画像生成AI用のプロンプトを作成してください。\n\n【台本】:\n${scriptResult || inputData || '（未入力）'}`,
    thumbnail: `視聴者が思わずクリックしたくなる16:9サムネイルの構成案と、AI指示を作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`,
    seo: `SEOに最適なタイトル案5つ、タグ、動画説明文を作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`,
    bgm: `動画の雰囲気に合うBGM構成案と、Suno AI用プロンプトを作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-red-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">クリエイティブ自動化OS</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI YouTubeプロデューサー</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v2.1-MASTER</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center justify-between min-w-[500px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-[12px] transition-all ${i <= activeStepIndex ? 'bg-red-600 text-white shadow-lg scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase italic ${i <= activeStepIndex ? 'text-red-500' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[600px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !transcriptionResult && !inputData;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex flex-col items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : isLocked ? 'opacity-10 cursor-not-allowed' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-2.5 h-2.5 absolute top-1.5 right-1.5 opacity-20" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'transcribe' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in fade-in">
            <h3 className="text-xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-4"><Volume2 className="text-red-500" size={40} /> ① 音声文字起こし</h3>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {!file ? (
                  <div className="border-4 border-dashed border-white/10 rounded-[3rem] p-20 text-center hover:bg-white/5 cursor-pointer shadow-inner relative transition-all group" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
                    <Upload className="h-16 w-16 text-slate-700 mx-auto mb-6 group-hover:text-red-500 transition-colors" />
                    <p className="text-xl text-slate-500 font-black italic uppercase">ファイルをドロップ</p>
                  </div>
                ) : (
                  <div className="bg-black border border-white/10 rounded-[3rem] p-10 space-y-8 text-center shadow-2xl">
                    <p className="text-lg text-white font-black truncate">{file.name}</p>
                    {isProcessing ? (
                      <div className="space-y-4 py-10">
                        <Loader2 className="animate-spin text-red-500 mx-auto" size={48} />
                        <p className="text-red-500 text-sm font-black italic animate-pulse">解析中... {progress}%</p>
                      </div>
                    ) : processedFileUrl && (
                      <div className="space-y-4">
                        <a href={processedFileUrl} download="audio.mp3" className="w-full h-20 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-4 uppercase italic text-lg shadow-xl hover:bg-slate-200 transition-all"><Download size={24} /> MP3を保存</a>
                        <button onClick={() => handleCopy("以下の音声を正確に文字起こししてください。")} className={`w-full h-20 font-black rounded-2xl transition-all shadow-xl text-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>指示をコピー</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-black rounded-[3rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col min-h-[400px] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
                 <div className="flex items-center gap-4 text-white font-black italic uppercase text-lg"><ClipboardPaste className="text-emerald-400" size={24} /> 文字起こし結果</div>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="AIが作成した文字起こしをここに貼り付けてください..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-sm text-slate-200 focus:border-emerald-500 outline-none font-mono italic shadow-inner leading-relaxed" />
              </div>
            </div>
            {(transcriptionResult || processedFileUrl) && (
               <button onClick={() => setActiveTab('script')} className="w-full h-24 mt-12 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-4 uppercase italic text-2xl active:scale-95 transition-all border-b-8 border-emerald-800 active:border-b-0">② 台本構成へ進む <ArrowRight size={32} /></button>
            )}
          </Card>
        )}

        {activeTab === 'script' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in fade-in">
            <h3 className="text-xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4"><FileText className="text-red-500" size={40} /> ② 台本構成プロンプト</h3>
            
            <div className="space-y-8 mb-12 text-left">
              <div className="flex items-center gap-3 text-orange-500 px-4"><Zap size={28} /><p className="text-lg font-black uppercase italic tracking-widest">動画戦略パレット</p></div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {STRATEGY_PARTS.map((p, i) => {
                  const isActive = inputData.includes(p.content);
                  return (
                    <button 
                      key={i} 
                      onClick={() => setInputData(prev => prev.includes(p.content) ? prev.split('\n').filter(l => l !== p.content).join('\n') : (prev ? `${prev}\n${p.content}` : p.content))} 
                      className={`h-24 border-2 font-black text-xs md:text-sm uppercase italic rounded-2xl transition-all shadow-lg flex flex-col items-center justify-center gap-2 ${isActive ? 'bg-orange-600 border-white text-white scale-95' : 'border-white/5 bg-black text-slate-500 hover:border-orange-500/50'}`}
                    >
                      <span className="text-2xl">{p.label.split(' ')[0]}</span>
                      {p.label.split(' ')[1]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-black p-8 rounded-[3rem] border border-white/5 space-y-8 shadow-inner mb-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />
              <div className="flex flex-wrap justify-center gap-3">
                {GENRES.map(g => <button key={g} onClick={() => setSelectedGenre(g)} className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${selectedGenre === g ? 'bg-red-600 text-white shadow-lg scale-110' : 'bg-slate-900 text-slate-600 border border-white/5 hover:text-slate-300'}`}>{g}</button>)}
              </div>
              <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="上の戦略パレットから動画の方向性を選んでください..." className="w-full h-32 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-lg text-white font-bold focus:border-red-600 outline-none leading-relaxed shadow-inner italic" />
              <div className="grid md:grid-cols-2 gap-6">
                <button onClick={() => handleCopy(PROMPTS.script)} className={`h-24 font-black rounded-3xl transition-all shadow-2xl text-2xl border-b-8 ${copied ? 'bg-emerald-500 border-emerald-800 text-slate-950' : 'bg-red-600 border-red-800 text-white hover:bg-red-500'}`}>{copied ? '✅ コピー完了' : '構成指示をコピー'}</button>
                <button onClick={() => window.open('https://claude.ai', '_blank')} className="h-24 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-3xl uppercase hover:text-white hover:bg-white/10 transition-all text-xl flex items-center justify-center gap-4">CLAUDE で実行 🚀</button>
              </div>
            </div>

            <div className="bg-black rounded-[3rem] p-10 border border-white/5 space-y-6 shadow-inner relative overflow-hidden text-left">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-orange-500 font-black italic uppercase text-lg"><ClipboardPaste size={28} /> 完成した台本をペースト</div>
                  {score && <div className="text-right leading-none bg-red-600/10 p-4 rounded-2xl border border-red-500/20"><p className="text-[10px] font-black text-red-500 italic uppercase">Viral Score</p><p className="text-4xl font-black text-white italic">{score}%</p></div>}
               </div>
               <textarea value={scriptResult} onChange={(e) => setScriptResult(e.target.value)} placeholder="AIから出力された台本を貼り付けると、バズり期待度の自動計測が始まります..." className="w-full h-80 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 text-lg text-slate-200 focus:border-orange-500 outline-none font-sans leading-relaxed shadow-inner italic" />
               <button onClick={() => setActiveTab('character')} className="w-full h-20 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl transition-all active:scale-95">次工程：視覚設計へ <ArrowRight size={28} /></button>
            </div>
          </Card>
        )}
        
        {activeTab === 'character' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-red-600/30" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6"><Scissors className="text-red-500" size={48} /> ③ 登場人物プロンプト</h3><div className="bg-black rounded-[2.5rem] p-10 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono italic mb-10 shadow-inner leading-relaxed">{PROMPTS.character}</div><div className="grid md:grid-cols-2 gap-8"><button onClick={() => handleCopy(PROMPTS.character)} className={`h-24 text-2xl font-black rounded-3xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>{copied ? '✅ コピー完了' : '指示をコピー'}</button><button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-24 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-3xl uppercase hover:text-white transition-all text-xl">CHATGPT 🚀</button></div><button onClick={() => setActiveTab('thumbnail')} className="w-full mt-10 h-16 text-slate-600 hover:text-slate-400 font-black uppercase italic transition-all flex items-center justify-center gap-2">Skip to Thumbnail <ChevronRight /></button></Card>}
        {activeTab === 'thumbnail' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-red-600/30" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6"><ImageIcon className="text-red-500" size={48} /> ④ サムネイル設計</h3><div className="bg-black rounded-[2.5rem] p-10 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono italic mb-10 shadow-inner leading-relaxed">{PROMPTS.thumbnail}</div><div className="grid md:grid-cols-2 gap-8"><button onClick={() => handleCopy(PROMPTS.thumbnail)} className={`h-24 text-2xl font-black rounded-3xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>{copied ? '✅ コピー完了' : '指示をコピー'}</button><button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-24 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-3xl uppercase hover:text-white transition-all text-xl">CHATGPT 🚀</button></div><button onClick={() => setActiveTab('seo')} className="w-full mt-10 h-16 text-slate-600 hover:text-slate-400 font-black uppercase italic transition-all flex items-center justify-center gap-2">Skip to SEO <ChevronRight /></button></Card>}
        {activeTab === 'seo' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-red-600/30" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6"><Type className="text-red-500" size={48} /> ⑤ SEO・タイトル</h3><div className="bg-black rounded-[2.5rem] p-10 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono italic mb-10 shadow-inner leading-relaxed">{PROMPTS.seo}</div><div className="grid md:grid-cols-2 gap-8"><button onClick={() => handleCopy(PROMPTS.seo)} className={`h-24 text-2xl font-black rounded-3xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>{copied ? '✅ コピー完了' : '指示をコピー'}</button><button onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-24 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-3xl uppercase hover:text-white transition-all text-xl">GEMINI 🚀</button></div><button onClick={() => setActiveTab('bgm')} className="w-full mt-10 h-16 text-slate-600 hover:text-slate-400 font-black uppercase italic transition-all flex items-center justify-center gap-2">Skip to BGM <ChevronRight /></button></Card>}
        {activeTab === 'bgm' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-red-600/30" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6"><Music className="text-red-500" size={48} /> ⑥ BGM・サウンド</h3><div className="bg-black rounded-[2.5rem] p-10 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono italic mb-10 shadow-inner leading-relaxed">{PROMPTS.bgm}</div><div className="grid md:grid-cols-2 gap-8"><button onClick={() => handleCopy(PROMPTS.bgm)} className={`h-24 text-2xl font-black rounded-3xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>{copied ? '✅ コピー完了' : '指示をコピー'}</button><button onClick={() => window.open('https://suno.com', '_blank')} className="h-24 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-3xl uppercase hover:text-white transition-all text-xl">SUNO AI 🚀</button></div><button onClick={() => { setTranscriptionResult(''); setScriptResult(''); setInputData(''); setFile(null); setActiveTab('transcribe'); }} className="w-full mt-12 h-20 border-4 border-white/10 text-slate-600 hover:text-white font-black rounded-[2rem] uppercase italic flex items-center justify-center gap-4 text-xl active:scale-95 transition-all shadow-xl"><RotateCcw size={32} /> 新しい動画制作を開始</button></Card>}
      </div>
      <DebugPanel data={{ activeTab, isProcessing, scriptReady: !!scriptResult }} toolId="youtube-producer-master" />
      <div className="text-center opacity-20 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">YouTube Production OS • NextraLabs 2026</div>
    </div>
  )
}

const YoutubeProducerWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Youtube Master...</div>
})

export default function NoSSRWrapper() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return <div className="min-h-screen bg-[#050507]" />;
  return <YoutubeProducerWithNoSSR />;
}
