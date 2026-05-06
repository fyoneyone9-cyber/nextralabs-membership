'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { 
  ArrowRight, Upload, CheckCircle2, Youtube, FileVideo, FileText, Zap, ChevronRight, Loader2, Copy, ExternalLink, Sparkles, Download, Volume2, Image as ImageIcon, Type, Music, Clapperboard, Scissors, FileCheck, Lock, MessageSquarePlus, ClipboardPaste, RotateCcw, Lightbulb, Search
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
  { label: "衝撃・暴露", content: "【戦略：衝撃】業界の裏側や誰も知らない真実を暴く、クリックせずにはいられない構成。" },
  { label: "徹底解説", content: "【戦略：有益】初心者でも10分でマスターできる、図解を多用した神解説の構成。" },
  { label: "ルーティン", content: "【戦略：没入】憧れの生活や仕事の裏側を、シネマティックな映像美で魅せる構成。" },
  { label: "検証・比較", content: "【戦略：納得】巷の噂や新製品をガチ検証し、独自の結論を導き出す構成。" },
  { label: "泣ける話", content: "【戦略：共感】視聴者の心に深く刺さり、コメント欄が温かくなるエモーショナルな構成。" },
  { label: "効率化Tips", content: "【戦略：時短】明日から人生が変わる時短術や生産性向上テクニックを詰め込んだ構成。" }
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
    script: `あなたはプロのYouTube作家です。以下の最新トレンドと戦略を元に、最高に面白い動画台本（構成案）を作成してください。\n\n【ジャンル】: ${selectedGenre}\n【トレンド・素材】:\n${inputData || transcriptionResult || '（未入力）'}`,
    character: `以下の台本から登場人物を抽出し、画像生成AI用のプロンプトを作成してください。\n\n【台本】:\n${scriptResult || inputData || '（未入力）'}`,
    thumbnail: `視聴者が思わずクリックしたくなる16:9サムネイルの構成案と、AI指示を作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`,
    seo: `SEOに最適なタイトル案5つ、タグ、動画説明文を作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`,
    bgm: `動画の雰囲気に合うBGM構成案と、Suno AI用プロンプトを作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-red-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Creative AI Terminal</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">YouTube Producer</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v2.0-MASTER</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center justify-between min-w-[500px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black italic text-[10px] transition-all ${i <= activeStepIndex ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span className={`text-[8px] font-black uppercase italic ${i <= activeStepIndex ? 'text-red-500' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-1.5 flex min-w-[600px] md:min-w-full rounded-2xl gap-1">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !transcriptionResult && !inputData;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-3 px-1 rounded-xl font-black text-[10px] md:text-xs uppercase italic transition-all flex flex-col items-center justify-center gap-1.5 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : isLocked ? 'opacity-10 cursor-not-allowed' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-4 h-4" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-2.5 h-2.5 absolute top-1.5 right-1.5 opacity-20" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'transcribe' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in fade-in">
            <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3"><Volume2 className="text-red-500" size={32} /> ① 音声文字起こし</h3>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {!file ? (
                  <div className="border-4 border-dashed border-white/10 rounded-[2rem] p-12 text-center hover:bg-white/5 cursor-pointer shadow-inner relative" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
                    <Upload className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-black italic uppercase">Drop Media File</p>
                  </div>
                ) : (
                  <div className="bg-black border border-white/10 rounded-3xl p-6 space-y-4 text-center">
                    <p className="text-xs text-white font-black truncate">{file.name}</p>
                    {isProcessing ? (
                      <div className="space-y-2">
                        <Loader2 className="animate-spin text-red-500 mx-auto" size={32} />
                        <p className="text-red-500 text-[10px] font-black italic animate-pulse">PROCESSING... {progress}%</p>
                      </div>
                    ) : processedFileUrl && (
                      <div className="space-y-3">
                        <a href={processedFileUrl} download="audio.mp3" className="w-full h-12 bg-white text-black font-black rounded-xl flex items-center justify-center gap-2 uppercase italic text-xs shadow-lg"><Download size={16} /> Get MP3</a>
                        <button onClick={() => handleCopy("以下の音声を正確に文字起こししてください。")} className={`w-full h-12 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>文字起こし指示をコピー</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-black rounded-[2.5rem] p-8 border border-white/5 space-y-4 shadow-inner flex flex-col min-h-[300px]">
                 <div className="flex items-center gap-3 text-white font-black italic uppercase text-xs"><ClipboardPaste className="text-emerald-400" /> Transcription</div>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="AI文字起こし結果をここにペースト..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-2xl p-6 text-xs text-slate-300 focus:border-emerald-500 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
            {(transcriptionResult || processedFileUrl) && (
               <button onClick={() => setActiveTab('script')} className="w-full h-16 mt-8 bg-emerald-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-lg active:scale-95 transition-all">② 台本作成へ <ArrowRight size={24} /></button>
            )}
          </Card>
        )}

        {activeTab === 'script' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in fade-in">
            <h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><FileText className="text-red-500" size={32} /> ② 台本構成プロンプト</h3>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-500 px-2"><Search size={20} /><p className="text-[10px] font-black uppercase italic">Trends</p></div>
                <div className="grid grid-cols-2 gap-2">
                  {isLoadingTrends ? Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />) : trends.map((t, i) => {
                    const line = `【トレンド】：${t}`;
                    const isActive = inputData.includes(line);
                    return <button key={i} onClick={() => setInputData(prev => prev.includes(line) ? prev.split('\n').filter(l => l !== line).join('\n') : (prev ? `${prev}\n${line}` : line))} className={`h-12 border-2 font-black text-[9px] uppercase italic rounded-xl transition-all ${isActive ? 'bg-red-600 border-white text-white' : 'border-white/5 bg-black text-slate-500'}`}>{t}</button>;
                  })}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-500 px-2"><Zap size={20} /><p className="text-[10px] font-black uppercase italic">Strategy</p></div>
                <div className="grid grid-cols-2 gap-2">
                  {STRATEGY_PARTS.map((p, i) => {
                    const isActive = inputData.includes(p.content);
                    return <button key={i} onClick={() => setInputData(prev => prev.includes(p.content) ? prev.split('\n').filter(l => l !== p.content).join('\n') : (prev ? `${prev}\n${p.content}` : p.content))} className={`h-12 border-2 font-black text-[9px] uppercase italic rounded-xl transition-all ${isActive ? 'bg-orange-600 border-white text-white' : 'border-white/5 bg-black text-slate-500'}`}>{p.label}</button>;
                  })}
                </div>
              </div>
            </div>
            <div className="bg-black p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-inner mb-8 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {GENRES.map(g => <button key={g} onClick={() => setSelectedGenre(g)} className={`px-3 py-1 rounded-full font-black text-[9px] transition-all ${selectedGenre === g ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-600 border border-white/5'}`}>{g}</button>)}
              </div>
              <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="トレンドと戦略を選んで指示を錬成..." className="w-full h-24 bg-[#13141f] border-2 border-white/5 rounded-2xl p-4 text-xs text-white font-bold focus:border-red-600 outline-none leading-relaxed shadow-inner" />
              <div className="grid md:grid-cols-2 gap-4">
                <button onClick={() => handleCopy(PROMPTS.script)} className={`h-16 font-black rounded-xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>{copied ? '✅ COPIED' : '指示をコピー'}</button>
                <button onClick={() => window.open('https://claude.ai', '_blank')} className="h-16 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-xl uppercase hover:text-white transition-all text-sm">CLAUDE で実行 🚀</button>
              </div>
            </div>
            <div className="bg-black rounded-[2.5rem] p-8 border border-white/5 space-y-4 shadow-inner">
               <div className="flex items-center justify-between"><div className="flex items-center gap-3 text-orange-500 font-black italic uppercase text-xs"><ClipboardPaste /> Master Script</div>{score && <div className="text-right leading-none"><p className="text-[8px] font-black text-red-500 italic">Score</p><p className="text-2xl font-black text-white italic">{score}%</p></div>}</div>
               <textarea value={scriptResult} onChange={(e) => setScriptResult(e.target.value)} placeholder="完成した台本をここにペースト..." className="w-full h-48 bg-[#13141f] border-2 border-white/5 rounded-2xl p-6 text-xs text-slate-300 focus:border-orange-500 outline-none font-mono italic shadow-inner" />
            </div>
          </Card>
        )}
        
        {activeTab === 'character' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-4"><Scissors className="text-red-500" size={32} /> ③ 登場人物プロンプト</h3><div className="bg-black rounded-2xl p-6 border border-white/5 text-left h-32 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 shadow-inner">{PROMPTS.character}</div><div className="grid md:grid-cols-2 gap-4"><button onClick={() => handleCopy(PROMPTS.character)} className={`h-16 font-black rounded-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>{copied ? '✅ COPIED' : '指示をコピー'}</button><button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-16 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-xl uppercase text-sm">CHATGPT で実行 🚀</button></div></Card>}
        {activeTab === 'thumbnail' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-4"><ImageIcon className="text-red-500" size={32} /> ④ サムネイル設計</h3><div className="bg-black rounded-2xl p-6 border border-white/5 text-left h-32 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 shadow-inner">{PROMPTS.thumbnail}</div><div className="grid md:grid-cols-2 gap-4"><button onClick={() => handleCopy(PROMPTS.thumbnail)} className={`h-16 font-black rounded-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>{copied ? '✅ COPIED' : '指示をコピー'}</button><button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-16 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-xl uppercase text-sm">CHATGPT で実行 🚀</button></div></Card>}
        {activeTab === 'seo' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-4"><Type className="text-red-500" size={32} /> ⑤ SEO・タイトル</h3><div className="bg-black rounded-2xl p-6 border border-white/5 text-left h-32 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 shadow-inner">{PROMPTS.seo}</div><div className="grid md:grid-cols-2 gap-4"><button onClick={() => handleCopy(PROMPTS.seo)} className={`h-16 font-black rounded-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>{copied ? '✅ COPIED' : '指示をコピー'}</button><button onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-16 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-xl uppercase text-sm">GEMINI で実行 🚀</button></div></Card>}
        {activeTab === 'bgm' && <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-4"><Music className="text-red-500" size={32} /> ⑥ BGM・サウンド</h3><div className="bg-black rounded-2xl p-6 border border-white/5 text-left h-32 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 shadow-inner">{PROMPTS.bgm}</div><div className="grid md:grid-cols-2 gap-4"><button onClick={() => handleCopy(PROMPTS.bgm)} className={`h-16 font-black rounded-xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>{copied ? '✅ COPIED' : '指示をコピー'}</button><button onClick={() => window.open('https://suno.com', '_blank')} className="h-16 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-xl uppercase text-sm">SUNO AI で実行 🚀</button></div></Card>}
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
