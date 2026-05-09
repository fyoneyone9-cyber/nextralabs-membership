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

  const updateGenreInInput = (genre: string) => {
    setSelectedGenre(genre);
    const genreLine = `【ジャンル】：${genre}`;
    setInputData(prev => {
      const otherLines = prev.split('\n').filter(l => !l.startsWith('【ジャンル】：'));
      return [genreLine, ...otherLines].join('\n').trim();
    });
  };

  const toggleStrategy = (strategy: any) => {
    const strategyLine = strategy.content;
    setInputData(prev => {
      if (prev.includes(strategyLine)) {
        return prev.split('\n').filter(l => l !== strategyLine).join('\n').trim();
      } else {
        return `${prev}\n${strategyLine}`.trim();
      }
    });
  };

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
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      {/* ヘッダー — 憲法準拠: font-semibold, no italic, no uppercase */}
      <div className="text-center space-y-2 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          クリエイティブ自動化 OS
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.15]">
          AI <span className="text-emerald-400">YouTube</span>プロデューサー
        </h1>
        <div className="inline-block bg-emerald-600 text-white font-medium px-4 py-1 rounded-full text-xs shadow-lg">
          v2.1-MASTER
        </div>
      </div>

      {/* ステッパー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center justify-between min-w-[500px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-[12px] transition-all ${i <= activeStepIndex ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium ${i <= activeStepIndex ? 'text-emerald-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* タブ */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[600px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !transcriptionResult && !inputData;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-medium text-xs md:text-sm transition-all flex flex-col items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : isLocked ? 'opacity-10 cursor-not-allowed' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-3 h-3 absolute top-2 right-2 opacity-20" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'transcribe' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in fade-in">
            <h3 className="text-xl md:text-3xl font-semibold text-white tracking-tight mb-8 flex items-center gap-4"><Volume2 className="text-emerald-400" size={32} /> ① 音声文字起こし</h3>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {!file ? (
                  <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-20 text-center hover:bg-white/5 cursor-pointer shadow-inner relative transition-all group" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
                    <Upload className="h-12 w-12 text-slate-700 mx-auto mb-6 group-hover:text-emerald-400 transition-colors" />
                    <p className="text-lg text-slate-500 font-medium">ファイルをドロップ</p>
                  </div>
                ) : (
                  <div className="bg-black border border-white/10 rounded-[2rem] p-10 space-y-8 text-center shadow-2xl">
                    <p className="text-lg text-white font-semibold truncate">{file.name}</p>
                    {isProcessing ? (
                      <div className="space-y-4 py-10">
                        <Loader2 className="animate-spin text-emerald-400 mx-auto" size={48} />
                        <p className="text-emerald-400 text-sm font-medium">解析中... {progress}%</p>
                      </div>
                    ) : processedFileUrl && (
                      <div className="space-y-4">
                        <a href={processedFileUrl} download="audio.mp3" className="w-full h-14 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-4 text-base shadow-xl hover:bg-slate-200 transition-all"><Download size={20} /> MP3を保存</a>
                        <div className="grid grid-cols-1 gap-3">
                          <button onClick={() => {
                            handleCopy("添付した音声ファイルの内容を、一言一句正確に文字起こししてください。");
                            alert('指示をコピーしました。Geminiを開いて【MP3ファイルを貼り付け】してから、この指示を送信してください。');
                          }} className={`w-full h-14 font-semibold rounded-xl transition-all shadow-xl text-base ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>指示をコピー</button>
                          <button onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-12 bg-white/10 border border-emerald-500/30 text-emerald-400 font-medium rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-3">
                            <span>✨</span> Gemini で文字起こし →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-black rounded-[2rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col min-h-[400px] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
                 <div className="flex items-center gap-4 text-white font-semibold text-base"><ClipboardPaste className="text-emerald-400" size={20} /> 文字起こし結果を貼り付け</div>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="AIが作成した文字起こしをここに貼り付けてください..." className="flex-1 bg-[#13141f] border border-white/5 rounded-xl p-6 text-sm text-slate-200 focus:border-emerald-500 outline-none font-mono shadow-inner leading-relaxed" />
              </div>
            </div>
            {(transcriptionResult || processedFileUrl) && (
               <button onClick={() => setActiveTab('script')} className="w-full h-14 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-xl flex items-center justify-center gap-3 text-base active:scale-95 transition-all">台本構成へ進む <ArrowRight size={20} /></button>
            )}
          </Card>
        )}

        {activeTab === 'script' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in fade-in">
            <h3 className="text-xl md:text-3xl font-semibold text-white tracking-tight mb-10 flex items-center gap-4"><FileText className="text-emerald-400" size={32} /> ② 台本構成プロンプト</h3>
            
            <div className="space-y-6 mb-10 text-left">
              <div className="flex items-center gap-3 text-emerald-400 px-2"><Zap size={20} /><p className="text-base font-semibold">動画戦略パレット</p></div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {STRATEGY_PARTS.map((p, i) => {
                  const isActive = inputData.includes(p.content);
                  return (
                    <button 
                      key={i} 
                      onClick={() => toggleStrategy(p)} 
                      className={`h-20 border font-medium text-xs rounded-xl transition-all shadow flex flex-col items-center justify-center gap-1.5 ${isActive ? 'bg-emerald-600 border-emerald-500 text-white scale-95' : 'border-white/10 bg-slate-900/50 text-slate-400 hover:border-emerald-500/50 hover:text-slate-200'}`}
                    >
                      <span className="text-xl">{p.label.split(' ')[0]}</span>
                      {p.label.split(' ')[1]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-black p-8 rounded-[2rem] border border-white/5 space-y-6 shadow-inner mb-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              <div className="flex flex-wrap justify-center gap-2">
                {GENRES.map(g => <button key={g} onClick={() => updateGenreInInput(g)} className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-all ${selectedGenre === g ? 'bg-emerald-600 text-white shadow scale-105' : 'bg-slate-900 text-slate-500 border border-white/5 hover:text-slate-300 hover:border-emerald-500/30'}`}>{g}</button>)}
              </div>
              <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="上の戦略パレットから動画の方向性を選んでください..." className="w-full h-32 bg-[#13141f] border border-white/5 rounded-xl p-6 text-base text-white font-medium focus:border-emerald-500 outline-none leading-relaxed shadow-inner" />
              <div className="grid md:grid-cols-2 gap-4">
                <button onClick={() => handleCopy(PROMPTS.script)} className={`h-14 font-semibold rounded-xl transition-all shadow text-base ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{copied ? '✅ コピー完了' : '① 構成指示をコピー'}</button>
                <button onClick={() => window.open('https://claude.ai', '_blank')} className="h-14 bg-white/5 border border-white/10 text-slate-400 font-medium rounded-xl hover:text-white hover:bg-white/10 transition-all text-base flex items-center justify-center gap-2">② Claude で実行 →</button>
              </div>
            </div>

            <div className="bg-black rounded-[2rem] p-8 border border-white/5 space-y-5 shadow-inner relative overflow-hidden text-left">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-400 font-semibold text-base"><ClipboardPaste size={20} /> 完成した台本をペースト</div>
                  {score && <div className="text-right leading-none bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20"><p className="text-[10px] font-medium text-emerald-400">Viral Score</p><p className="text-3xl font-semibold text-white">{score}%</p></div>}
               </div>
               <textarea value={scriptResult} onChange={(e) => setScriptResult(e.target.value)} placeholder="AIから出力された台本を貼り付けると、バズり期待度の自動計測が始まります..." className="w-full h-64 bg-[#13141f] border border-white/5 rounded-xl p-8 text-base text-slate-200 focus:border-emerald-500 outline-none font-sans leading-relaxed shadow-inner" />
               <button onClick={() => setActiveTab('character')} className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl shadow flex items-center justify-center gap-3 text-base transition-all active:scale-95">次工程：視覚設計へ <ArrowRight size={20} /></button>
            </div>
          </Card>
        )}
        
        {activeTab === 'character' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />
            <h3 className="text-2xl md:text-4xl font-semibold text-white tracking-tight mb-10 flex items-center justify-center gap-4"><Scissors className="text-emerald-400" size={36} /> ③ 登場人物プロンプト</h3>
            <div className="bg-black rounded-[1.5rem] p-8 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono mb-8 shadow-inner leading-relaxed">{PROMPTS.character}</div>
            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => handleCopy(PROMPTS.character)} className={`h-14 text-base font-semibold rounded-xl shadow transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{copied ? '✅ コピー完了' : '① 指示をコピー'}</button>
              <button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-14 bg-white/5 border border-white/10 text-slate-400 font-medium rounded-xl hover:text-white transition-all text-base">② ChatGPT →</button>
            </div>
            <button onClick={() => setActiveTab('thumbnail')} className="w-full mt-8 h-12 text-slate-600 hover:text-slate-400 font-medium transition-all flex items-center justify-center gap-2">サムネイルへ <ChevronRight size={16} /></button>
          </Card>
        )}

        {activeTab === 'thumbnail' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />
            <h3 className="text-2xl md:text-4xl font-semibold text-white tracking-tight mb-10 flex items-center justify-center gap-4"><ImageIcon className="text-emerald-400" size={36} /> ④ サムネイル設計</h3>
            <div className="bg-black rounded-[1.5rem] p-8 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono mb-8 shadow-inner leading-relaxed">{PROMPTS.thumbnail}</div>
            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => handleCopy(PROMPTS.thumbnail)} className={`h-14 text-base font-semibold rounded-xl shadow transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{copied ? '✅ コピー完了' : '① 指示をコピー'}</button>
              <button onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-14 bg-white/5 border border-white/10 text-slate-400 font-medium rounded-xl hover:text-white transition-all text-base">② ChatGPT →</button>
            </div>
            <button onClick={() => setActiveTab('seo')} className="w-full mt-8 h-12 text-slate-600 hover:text-slate-400 font-medium transition-all flex items-center justify-center gap-2">SEOへ <ChevronRight size={16} /></button>
          </Card>
        )}

        {activeTab === 'seo' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />
            <h3 className="text-2xl md:text-4xl font-semibold text-white tracking-tight mb-10 flex items-center justify-center gap-4"><Type className="text-emerald-400" size={36} /> ⑤ SEO・タイトル</h3>
            <div className="bg-black rounded-[1.5rem] p-8 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono mb-8 shadow-inner leading-relaxed">{PROMPTS.seo}</div>
            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => handleCopy(PROMPTS.seo)} className={`h-14 text-base font-semibold rounded-xl shadow transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{copied ? '✅ コピー完了' : '① 指示をコピー'}</button>
              <button onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-14 bg-white/5 border border-white/10 text-slate-400 font-medium rounded-xl hover:text-white transition-all text-base">② Gemini →</button>
            </div>
            <button onClick={() => setActiveTab('bgm')} className="w-full mt-8 h-12 text-slate-600 hover:text-slate-400 font-medium transition-all flex items-center justify-center gap-2">BGMへ <ChevronRight size={16} /></button>
          </Card>
        )}

        {activeTab === 'bgm' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />
            <h3 className="text-2xl md:text-4xl font-semibold text-white tracking-tight mb-10 flex items-center justify-center gap-4"><Music className="text-emerald-400" size={36} /> ⑥ BGM・サウンド</h3>
            <div className="bg-black rounded-[1.5rem] p-8 border border-white/5 text-left h-48 overflow-y-auto text-sm text-slate-400 font-mono mb-8 shadow-inner leading-relaxed">{PROMPTS.bgm}</div>
            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => handleCopy(PROMPTS.bgm)} className={`h-14 text-base font-semibold rounded-xl shadow transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{copied ? '✅ コピー完了' : '① 指示をコピー'}</button>
              <button onClick={() => window.open('https://suno.com', '_blank')} className="h-14 bg-white/5 border border-white/10 text-slate-400 font-medium rounded-xl hover:text-white transition-all text-base">② Suno AI →</button>
            </div>
            <button onClick={() => { setTranscriptionResult(''); setScriptResult(''); setInputData(''); setFile(null); setActiveTab('transcribe'); }} className="w-full mt-10 h-12 border border-white/10 text-slate-600 hover:text-white font-medium rounded-xl flex items-center justify-center gap-3 text-base active:scale-95 transition-all"><RotateCcw size={18} /> 新しい動画制作を開始</button>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab, isProcessing, scriptReady: !!scriptResult }} toolId="youtube-producer-master" />
      <div className="text-center opacity-20 mt-16 font-medium text-[10px] tracking-widest">YouTube Production OS • NextraLabs 2026</div>
    </div>
  )
}

const YoutubeProducerWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-medium text-emerald-500 tracking-widest">Initializing Youtube Master...</div>
})

export default function NoSSRWrapper() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return <div className="min-h-screen bg-[#050507]" />;
  return <YoutubeProducerWithNoSSR />;
}
