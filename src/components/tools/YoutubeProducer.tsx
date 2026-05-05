'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { 
  ArrowRight, Upload, CheckCircle2, Youtube, FileVideo, FileText, Zap, ChevronRight, Loader2, Copy, ExternalLink, Sparkles, Download, Volume2, Image as ImageIcon, Type, Music, Clapperboard, Scissors, FileCheck, Lock, MessageSquarePlus, ClipboardPaste, RotateCcw, Lightbulb
} from 'lucide-react'

const TABS = [
  { id: 'transcribe', label: '① 文字起こし', icon: Volume2 },
  { id: 'script', label: '② 台本作成', icon: FileText },
  { id: 'character', label: '③ 人物画像', icon: Scissors },
  { id: 'thumbnail', label: '④ サムネイル', icon: ImageIcon },
  { id: 'seo', label: '⑤ タイトル/SEO', icon: Type },
  { id: 'bgm', label: '⑥ BGM', icon: Music },
];

const GENRES = [
  '🎭 エンタメ', '📚 教育・解説', '📷 Vlog', '💻 テック・IT', '💼 ビジネス',
  '🎮 ゲーム実況', '🍳 料理', '✈️ 旅行', '📰 ニュース', '🎤 対談'
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
  
  const ffmpegRef = useRef(new FFmpeg());
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    script: `あなたはプロのYouTube放送作家です。以下のデータを元に最高に面白い台本を作成してください。\n\n【ジャンル】: ${selectedGenre}\n【素材】:\n${transcriptionResult || '（未入力）'}`,
    character: `以下の台本から人物を抽出しDALL-E 3用アニメ風イラストプロンプトを作成してください。\n\n【台本】:\n${scriptResult || transcriptionResult || '（未入力）'}`,
    thumbnail: `視聴率を稼げる16:9サムネイルを生成してください。\n\n【内容】:\n${scriptResult || transcriptionResult || '（未入力）'}`,
    seo: `SEO最適化タイトル案5つ、タグ15個、説明文を作成してください。\n\n【内容】:\n${scriptResult || '（未入力）'}`,
    bgm: `動画の雰囲気に合うBGM構成案とSuno AIプロンプトを作成してください。\n\n【内容】:\n${scriptResult || transcriptionResult || '（未入力）'}`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900/50 border border-red-600/30 rounded-xl p-4 md:p-6 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-red-500" /></div>
      <div className="space-y-1">
        <p className="text-[10px] md:text-xs font-black text-red-500 uppercase tracking-widest italic">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-sm text-slate-300 font-bold leading-tight flex items-center gap-2">
            <span className="text-red-500 italic">#{i+1}</span> {s}
          </p>
        ))}
      </div>
    </div>
  );

  const renderCopySection = (prompt: string, aiName: string, aiUrl: string, targetTab: string) => (
    <div className="space-y-4 mt-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left h-32 overflow-y-auto text-[10px] text-slate-500 font-mono italic whitespace-pre-wrap">{prompt}</div>
          <Button onClick={() => handleCopy(prompt)} className={`w-full h-12 md:h-14 font-black text-sm md:text-base rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>
            {copied ? '✅ COPIED!' : '指示をコピー'}
          </Button>
        </div>
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center space-y-2 text-center">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Recommended AI</p>
          <Button variant="outline" onClick={() => window.open(aiUrl, '_blank')} className="w-full h-12 border-slate-800 text-slate-300 font-black text-sm rounded-xl hover:bg-slate-900 transition-all uppercase italic">
             {aiName} ↗
          </Button>
        </div>
      </div>
      <Button onClick={() => setActiveTab(targetTab)} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase italic text-xs group">
        Next Step <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-1">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-3 py-0.5 text-[8px] uppercase rounded-full">ORIGINAL</Badge>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">YouTube Producer</h1>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="bg-slate-900/80 border border-slate-800 p-1 flex min-w-[600px] md:min-w-full rounded-xl shadow-xl">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !processedFileUrl;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-3 px-1 rounded-lg font-black text-[9px] md:text-xs uppercase italic transition-all flex flex-col items-center justify-center gap-1 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-md scale-[1.02] z-10' : isLocked ? 'text-slate-800 cursor-not-allowed opacity-30' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-2 h-2 absolute top-1.5 right-1.5 opacity-20" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'transcribe' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-2"><Volume2 className="text-red-500 w-5 h-5 md:w-8 md:h-8" /> ① 文字起こし</h3>
            {renderGuide(['動画から音声を抽出・軽量化(MP3)', '軽量MP3をAIに投げ指示を貼る', 'AIの結果を右の欄へペースト'])}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                {!file ? (
                  <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 md:p-12 text-center hover:bg-slate-950 transition-all group cursor-pointer shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" /><Upload className="h-8 w-8 md:h-12 md:w-12 text-slate-700 group-hover:text-red-500 mx-auto mb-2" /><p className="text-sm md:text-lg text-slate-500 font-black italic uppercase">Drop File</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-red-600/30 rounded-xl p-4 md:p-6 space-y-4 shadow-lg text-center">
                    <p className="text-white font-black truncate text-xs md:text-sm">{file.name}</p>
                    {isProcessing ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-red-600 border-t-transparent animate-spin"></div>
                        <p className="text-red-500 text-[10px] font-black italic animate-pulse">軽量化中... {progress}%</p>
                      </div>
                    ) : processedFileUrl && (
                      <div className="space-y-3 animate-in zoom-in">
                        <a href={processedFileUrl} download="audio.mp3" className="w-full h-12 bg-white text-black hover:bg-slate-200 font-black rounded-lg flex items-center justify-center gap-2 shadow-md uppercase italic text-xs"><Download className="w-3.5 h-3.5" /> MP3保存</a>
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                           <Button onClick={() => handleCopy("以下の音声から一言一句文字起こししてください。")} className={`w-full h-10 font-black rounded-lg transition-all text-[10px] ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>指示コピー</Button>
                           <div className="grid grid-cols-2 gap-2"><Button variant="outline" className="h-8 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button><Button variant="outline" className="h-8 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-center">
                 <div className="flex items-center gap-2"><ClipboardPaste className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" /><h3 className="text-sm md:text-lg font-black text-white italic uppercase tracking-tighter">AIの回答を戻す</h3></div>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="結果ペースト..." className="w-full h-40 md:h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-[10px] text-slate-200 focus:border-emerald-500 outline-none font-mono" />
              </div>
            </div>
            {processedFileUrl && (
               <Button onClick={() => setActiveTab('script')} className="w-full h-12 md:h-14 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase italic text-[10px] md:text-xs group">② 台本作成へ進む <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></Button>
            )}
          </Card>
        )}

        {activeTab === 'script' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8 shadow-xl animate-in fade-in zoom-in">
            <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-2"><FileText className="text-red-500 w-5 h-5 md:w-8 md:h-8" /> ② 台本プロンプト</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {GENRES.map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)} className={`px-3 py-1.5 rounded-lg font-black text-[9px] md:text-[10px] transition-all ${selectedGenre === g ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:bg-slate-800'}`}>{g}</button>
              ))}
            </div>
            {renderCopySection(PROMPTS.script, 'CLAUDE', 'https://claude.ai', 'character')}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 mt-6">
               <div className="flex items-center gap-2"><ClipboardPaste className="h-4 w-4 text-orange-500" /><h3 className="text-sm md:text-lg font-black text-white italic uppercase tracking-tighter">完成した台本を戻す</h3></div>
               <textarea value={scriptResult} onChange={(e) => setScriptResult(e.target.value)} placeholder="台本ペースト..." className="w-full h-40 bg-slate-900 border border-slate-800 rounded-xl p-4 text-[10px] text-slate-200 focus:border-orange-500 outline-none font-mono" />
            </div>
          </Card>
        )}
        
        {/* CHARACTER, THUMBNAIL, SEO, BGM follow same smart-scaling pattern... */}
        {activeTab === 'character' && <Card className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-6 flex items-center justify-center gap-2"><Scissors className="text-red-500 w-5 h-5 md:w-8 md:h-8" /> ③ 人物イラスト</h3>{renderCopySection(PROMPTS.character, 'CHATGPT', 'https://chatgpt.com', 'thumbnail')}</Card>}
        {activeTab === 'thumbnail' && <Card className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-6 flex items-center justify-center gap-2"><ImageIcon className="text-red-500 w-5 h-5 md:w-8 md:h-8" /> ④ サムネイル</h3>{renderCopySection(PROMPTS.thumbnail, 'CHATGPT', 'https://chatgpt.com', 'seo')}</Card>}
        {activeTab === 'seo' && <Card className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-6 flex items-center justify-center gap-2"><Type className="text-red-500 w-5 h-5 md:w-8 md:h-8" /> ⑤ SEOタイトル</h3>{renderCopySection(PROMPTS.seo, 'GEMINI', 'https://gemini.google.com', 'bgm')}</Card>}
        {activeTab === 'bgm' && <Card className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center"><h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-6 flex items-center justify-center gap-2"><Music className="text-red-500 w-5 h-5 md:w-8 md:h-8" /> ⑥ BGM</h3>{renderCopySection(PROMPTS.bgm, 'SUNO AI', 'https://suno.com', 'transcribe')}</Card>}
      </div>
      <div className="mt-12 text-center text-slate-500"><p className="text-[8px] font-black uppercase tracking-widest italic opacity-20">NextraLabs — 2026 Creative Automation Hub</p></div>
    </div>
  )
}
