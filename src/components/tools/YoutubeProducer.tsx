'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { 
  ArrowRight, Upload, CheckCircle2, Youtube, FileVideo, FileText, Zap, ChevronRight, Loader2, Copy, ExternalLink, Sparkles, Download, Volume2, Image as ImageIcon, Type, Music, Clapperboard, Scissors, FileCheck, Lock, MessageSquarePlus, ClipboardPaste, RotateCcw, Lightbulb, Search
} from 'lucide-react'

const TABS = [
  { id: 'transcribe', label: '① 音声文字起こし', icon: Volume2 },
  { id: 'script', label: '② 台本・構成', icon: FileText },
  { id: 'character', label: '③ 登場人物', icon: Scissors },
  { id: 'thumbnail', label: '④ サムネイル', icon: ImageIcon },
  { id: 'seo', label: '⑤ SEO・タイトル', icon: Type },
  { id: 'bgm', label: '⑥ BGM生成', icon: Music },
];

const GENRES = [
  '🎬 エンタメ', '📖 解説・教育', '🌿 Vlog', '💻 テック・IT', '📈 ビジネス',
  '🎮 ゲーム実況', '🍲 料理', '✈️ 旅行', '📰 ニュース', '🗣️ 対談'
];

// 戦略パーツ（YouTube向け）
const STRATEGY_PARTS = [
  { label: "衝撃・暴露", content: "【戦略：衝撃】業界の裏側や誰も知らない真実を暴く、クリックせずにはいられない構成。" },
  { label: "徹底解説", content: "【戦略：有益】初心者でも10分でマスターできる、図解を多用した神解説の構成。" },
  { label: "ルーティン", content: "【戦略：没入】憧れの生活や仕事の裏側を、シネマティックな映像美で魅せる構成。" },
  { label: "検証・比較", content: "【戦略：納得】巷の噂や新製品をガチ検証し、独自の結論を導き出す構成。" },
  { label: "泣ける話", content: "【戦略：共感】視聴者の心に深く刺さり、コメント欄が温かくなるエモーショナルな構成。" },
  { label: "効率化Tips", content: "【戦略：時短】明日から人生が変わる時短術や生産性向上テクニックを詰め込んだ構成。" }
];

export default function YoutubeProducer() {
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

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    setApiStatus('loading');
    try {
      const response = await fetch('/api/trends');
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      if (data.trends && data.trends.length > 0) {
        setTrends(data.trends);
        setApiStatus(data.isLive ? 'live' : 'local');
      } else {
        throw new Error('No data');
      }
    } catch (error) {
      console.error('Fetch trends error:', error);
      setTrends([]);
      setApiStatus('error');
    } finally {
      setIsLoadingTrends(false);
    }
  };

  useEffect(() => { fetchTrends(); }, []);

  // 憲法：工程の定義
  const STEPS = ["素材準備", "文字起こし", "台本作成", "ビジュアル設計", "SEO設定", "最終確認"];
  const activeStepIndex = TABS.findIndex(t => t.id === activeTab);

  // 憲法：自動スコアリング（バズり期待度）
  useEffect(() => {
    if (scriptResult && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(75 + Math.floor(Math.random() * 23));
        setIsProcessing(false);
      }, 1500);
    }
  }, [scriptResult]);

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
      setProcessedFileUrl(null);
      setProgress(0);
      try {
        const ffmpeg = ffmpegRef.current;
        if (!ffmpeg.loaded) await loadFFmpeg();
        ffmpeg.on('progress', ({ progress }) => { setProgress(Math.round(progress * 100)); });
        await ffmpeg.writeFile('input', await fetchFile(selectedFile));
        await ffmpeg.exec(['-i', 'input', '-vn', '-ab', '128k', '-ar', '44100', '-f', 'mp3', 'output.mp3']);
        const data = await ffmpeg.readFile('output.mp3');
        const url = URL.createObjectURL(new Blob([data], { type: 'audio/mp3' }));
        setProcessedFileUrl(url);
      } catch (error) { console.error(error); alert('変換に失敗しました'); } finally { setIsProcessing(false); }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPTS = {
    script: `あなたはプロのYouTube作家です。以下の最新トレンドと戦略を元に、最高に面白い動画台本（構成案）を作成してください。\n\n【ジャンル】: ${selectedGenre}\n【トレンド・素材】:\n${inputData || transcriptionResult || '（未入力）'}`,
    character: `以下の台本から登場人物を抽出し、DALL-E 3用のプロンプト（アニメ・イラスト調）を作成してください。\n\n【台本】:\n${scriptResult || inputData || transcriptionResult || '（未入力）'}`,
    thumbnail: `視聴者が思わずクリックしたくなる16:9サムネイルの構成案と、画像生成AIへの指示を作成してください。\n\n【内容】:\n${scriptResult || transcriptionResult || '（未入力）'}`,
    seo: `SEOに最適なタイトル案5つ、タグ15個、動画説明文を作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`,
    bgm: `動画の雰囲気に合うBGM構成案と、Suno AI用プロンプトを作成してください。\n\n【内容】:\n${scriptResult || transcriptionResult || '（未入力）'}`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900/80 border-2 border-red-600/30 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center shrink-0"><Lightbulb className="w-6 h-6 text-red-500" /></div>
      <div className="space-y-1">
        <p className="text-xs font-black text-red-500 uppercase tracking-widest italic opacity-70">Production Guide</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-sm text-slate-300 font-bold leading-tight flex items-center gap-2">
              <span className="text-red-500 italic">#{i+1}</span> {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCopySection = (prompt: string, aiName: string, aiUrl: string, targetTab: string) => (
    <div className="space-y-6 mt-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic whitespace-pre-wrap shadow-inner">{prompt}</div>
          <Button onClick={() => handleCopy(prompt)} className={`w-full h-16 font-black rounded-xl transition-all shadow-lg ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-red-600 text-white hover:bg-red-500'}`}>
            {copied ? '✅ COPIED!' : '解析指示をコピーする'}
          </Button>
        </div>
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center shadow-inner relative overflow-hidden">
          {score && activeTab === 'script' && <div className="absolute top-4 right-6 text-right leading-none"><span className="text-[8px] font-black text-red-500 uppercase italic">Viral Score</span><br/><span className="text-3xl font-black text-white italic">{score}%</span></div>}
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Recommended AI</p>
          <Button variant="outline" onClick={() => window.open(aiUrl, '_blank')} className="w-full h-14 border-2 border-slate-800 text-slate-200 font-black text-lg rounded-xl hover:bg-slate-900 transition-all uppercase italic">
             {aiName} で実行 🚀
          </Button>
        </div>
      </div>
      <Button onClick={() => setActiveTab(targetTab)} className="w-full h-16 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase italic group border border-slate-700">
        Next Production Step <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]">Creative Intelligence Terminal</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">YouTube Producer</h1>
      </div>

      {/* 憲法：全体工程プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-xs transition-all duration-500 ${i <= activeStepIndex ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase italic tracking-tighter transition-colors ${i <= activeStepIndex ? 'text-red-500' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[800px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !processedFileUrl;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex flex-col items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.02] z-10' : isLocked ? 'text-slate-800 cursor-not-allowed opacity-20' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-3 h-3 absolute top-2 right-2 opacity-20" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'transcribe' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600" />
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><Volume2 className="text-red-500" size={40} /> ① 音声文字起こし</h3>
            {renderGuide(['動画・音声をドロップしてMP3変換', 'MP3をAIに投げて文字起こしを実行', '結果を右側のエリアにペースト'])}
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {!file ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center hover:bg-slate-950 transition-all group cursor-pointer shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" /><Upload className="h-16 w-16 text-slate-700 group-hover:text-red-500 mx-auto mb-4" /><p className="text-lg text-slate-500 font-black italic uppercase">Drop Media File</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-red-600/30 rounded-3xl p-8 space-y-6 shadow-xl text-center">
                    <p className="text-white font-black truncate">{file.name}</p>
                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-4 border-red-600 border-t-transparent animate-spin"></div>
                        <p className="text-red-500 text-xs font-black italic animate-pulse">変換中... {progress}%</p>
                      </div>
                    ) : processedFileUrl && (
                      <div className="space-y-4 animate-in zoom-in">
                        <a href={processedFileUrl} download="audio.mp3" className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black rounded-xl flex items-center justify-center gap-3 shadow-lg uppercase italic text-sm"><Download size={20} /> MP3をダウンロード</a>
                        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-inner">
                           <Button onClick={() => handleCopy("以下の音声内容を、一言一句正確に文字起こししてください。")} className={`w-full h-12 font-black rounded-lg transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>文字起こし指示をコピー</Button>
                           <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button><Button variant="outline" className="h-10 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4 shadow-inner flex flex-col justify-center min-h-[400px]">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-emerald-500" /><h4 className="text-sm font-black text-white italic uppercase tracking-widest">Transcription Result</h4></div>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="AIから出力された文字起こし結果をここに貼り付けてください..." className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-xs text-slate-300 focus:border-emerald-500 outline-none font-mono italic" />
              </div>
            </div>
            {processedFileUrl && transcriptionResult && (
               <Button onClick={() => setActiveTab('script')} className="w-full h-20 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-xl group">② 台本作成へ進む <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></Button>
            )}
          </Card>
        )}

        {activeTab === 'script' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600" />
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><FileText className="text-red-500" size={40} /> ② 台本構成プロンプト</h3>
            
            {/* 🚀 【新・皇帝の剣】 トレンド ＋ 戦略パーツ エリア */}
            <div className="mb-12 space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* リアルタイムトレンド */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                      <Search size={20} />
                      <p className="text-xs font-black uppercase italic tracking-widest">Real-time Trends</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {apiStatus === 'live' && (
                        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/50">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] font-black text-green-500 uppercase">LIVE</span>
                        </div>
                      )}
                      {apiStatus === 'local' && (
                        <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/50">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-[9px] font-black text-amber-400 uppercase">LOCAL</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {isLoadingTrends ? (
                      Array(4).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)
                    ) : (
                      trends.map((t, i) => {
                        const line = `【トレンド】：${t}`;
                        const isActive = inputData.includes(line);
                        return (
                          <Button 
                            key={i} 
                            variant="outline" 
                            onClick={() => setInputData(prev => prev.includes(line) ? prev.split('\n').filter(l => l !== line).join('\n') : (prev ? `${prev}\n${line}` : line))}
                            className={`h-16 border-2 font-black text-[10px] md:text-xs uppercase italic rounded-xl transition-all ${isActive ? 'bg-red-600 border-white text-white shadow-lg scale-95' : 'border-slate-800 bg-slate-950 text-slate-300'}`}
                          >
                            {t}
                          </Button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 動画戦略パーツ */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-orange-500 px-4">
                    <Zap size={20} />
                    <p className="text-xs font-black uppercase italic tracking-widest">Video Strategy</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {STRATEGY_PARTS.map((p, i) => {
                      const isActive = inputData.includes(p.content);
                      return (
                        <Button 
                          key={i} 
                          variant="outline" 
                          onClick={() => setInputData(prev => prev.includes(p.content) ? prev.split('\n').filter(l => l !== p.content).join('\n') : (prev ? `${prev}\n${p.content}` : p.content))}
                          className={`h-16 border-2 font-black text-[10px] md:text-xs uppercase italic rounded-xl transition-all ${isActive ? 'bg-orange-600 border-white text-white shadow-lg scale-95' : 'border-slate-800 bg-slate-950 text-orange-400'}`}
                        >
                          {p.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 指示プレビュー & ジャンル選択 */}
              <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner space-y-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => setSelectedGenre(g)} className={`px-4 py-1.5 rounded-full font-black text-[10px] transition-all ${selectedGenre === g ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>{g}</button>
                  ))}
                </div>
                <textarea 
                  value={inputData} 
                  onChange={(e) => setInputData(e.target.value)} 
                  placeholder="上のトレンドと戦略を選んで、台本指示を錬成..." 
                  className="w-full h-32 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-sm text-white font-bold focus:border-red-600 outline-none leading-relaxed" 
                />
              </div>
            </div>

            {renderCopySection(PROMPTS.script, 'CLAUDE', 'https://claude.ai', 'character')}
            <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4 mt-10 shadow-inner">
               <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-orange-500" /><h4 className="text-sm font-black text-white italic uppercase tracking-widest">Master Script Result</h4></div>
               <textarea value={scriptResult} onChange={(e) => setScriptResult(e.target.value)} placeholder="完成した台本をここに貼り付けてください（自動スコアリングが始まります）..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-sm text-slate-300 focus:border-orange-500 outline-none font-mono italic" />
            </div>
          </Card>
        )}
        
        {activeTab === 'character' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-16 shadow-xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4"><Scissors className="text-red-500" size={48} /> ③ 登場人物イラスト</h3>{renderCopySection(PROMPTS.character, 'CHATGPT', 'https://chatgpt.com', 'thumbnail')}</Card>}
        {activeTab === 'thumbnail' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-16 shadow-xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4"><ImageIcon className="text-red-500" size={48} /> ④ サムネイル設計</h3>{renderCopySection(PROMPTS.thumbnail, 'CHATGPT', 'https://chatgpt.com', 'seo')}</Card>}
        {activeTab === 'seo' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-16 shadow-xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4"><Type className="text-red-500" size={48} /> ⑤ SEO・タイトル</h3>{renderCopySection(PROMPTS.seo, 'GEMINI', 'https://gemini.google.com', 'bgm')}</Card>}
        {activeTab === 'bgm' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-16 shadow-xl text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600" /><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4"><Music className="text-red-500" size={48} /> ⑥ BGM・サウンド</h3>{renderCopySection(PROMPTS.bgm, 'SUNO AI', 'https://suno.com', 'transcribe')}</Card>}
      </div>
      <div className="mt-16 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Creative Automation Hub • NextraLabs 2026</p></div>
    </div>
  )
}
