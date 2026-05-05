'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Youtube, FileVideo, FileText, Zap, ChevronRight, Loader2, Copy, ExternalLink, Sparkles, Download, Volume2, Image as ImageIcon, Type, Music, Clapperboard, Scissors, FileCheck, Lock, MessageSquarePlus, ClipboardPaste, RotateCcw, Info, Lightbulb
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
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [scriptResult, setScriptResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessedFileUrl(URL.createObjectURL(selectedFile));
      }, 1200);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPTS = {
    script: `あなたはプロのYouTube放送作家です。以下の文字起こしデータを元に、視聴者を飽きさせない最高に面白い【${selectedGenre}】向けの台本を作成してください。\n\n【文字起こしデータ】:\n${transcriptionResult || '（未入力）'}\n\n構成は、導入・本編（3チャプター）・エンディングの3部構成で。`,
    character: `以下の【YouTube台本】に登場する人物を特定し、DALL-E 3で描画可能な「アニメ風立ち絵」の生成プロンプトを作成して、そのまま画像を1枚ずつ生成してください。表情は豊かに、背景は透過かシンプルな白でお願いします。\n\n【YouTube台本】:\n${scriptResult || transcriptionResult || '（未入力）'}`,
    thumbnail: `以下の【動画内容】に最適な、視聴率を稼げるサムネイルをDALL-E 3で1枚生成してください。文字要素（日本語）を中央に大きく配置し、インパクトのある配色（赤・黄・黒など）を使用してください。比率は16:9です。\n\n【動画内容】:\n${scriptResult || transcriptionResult || '（未入力）'}`,
    seo: `以下の【台本内容】に基づき、YouTube SEOに最適化したタイトル案5つ、タグ15個、タイムスタンプ付き説明文を作成してください。\n\n【台本内容】:\n${scriptResult || '（未入力）'}`,
    bgm: `以下の【動画の雰囲気】に合うBGMの構成案と、Suno AI用の英文プロンプトを3つ作成してください。\n\n【動画の雰囲気】:\n${scriptResult || transcriptionResult || '（未入力）'}`
  };

  // 🟢 MOBILE-OPTIMIZED OPERATION GUIDE
  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-center gap-4 md:gap-8 shadow-xl">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-6 h-6 md:w-10 md:h-10 text-white" /></div>
      <div className="space-y-1 md:space-y-2">
        <p className="text-sm md:text-xl font-black text-white uppercase italic tracking-[0.1em]">OPERATION GUIDE</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight">
              <span className="flex items-center justify-center w-5 h-5 md:w-7 md:h-7 bg-red-600 text-white rounded-full text-[10px] md:text-sm italic shrink-0 font-black">{i+1}</span> {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCopySection = (prompt: string, aiName: string, aiUrl: string, targetTab: string) => (
    <div className="space-y-6 mt-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left h-40 overflow-y-auto text-xs text-slate-500 font-mono italic whitespace-pre-wrap leading-relaxed shadow-inner">{prompt}</div>
          <Button onClick={() => handleCopy(prompt)} className={`w-full h-16 md:h-20 font-black text-lg md:text-2xl rounded-2xl shadow-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950 scale-[1.02]' : 'bg-red-600 text-white hover:bg-red-500'}`}>
            {copied ? '✅ COPIED!' : '指示をコピー'}
          </Button>
        </div>
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-white font-black italic uppercase tracking-widest text-xs opacity-70">Recommended AI</p>
          <Button variant="outline" onClick={() => window.open(aiUrl, '_blank')} className="w-full h-16 md:h-20 border-2 border-slate-800 text-slate-200 font-black text-lg md:text-2xl rounded-2xl hover:bg-slate-900 transition-all uppercase italic flex items-center justify-center gap-2">
             {aiName} ↗
          </Button>
        </div>
      </div>
      <Button onClick={() => setActiveTab(targetTab)} className="w-full h-16 md:h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm md:text-lg group">
        Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-2">
        <Badge className="bg-red-600 text-white mb-2 font-black italic tracking-[0.3em] px-4 py-1 text-[10px] uppercase rounded-full">NEXTRALABS ORIGINAL</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl">YouTube Producer</h1>
      </div>

      {/* RESPONSIVE TABS */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[700px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !processedFileUrl;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-3 md:py-6 px-2 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex flex-col items-center justify-center gap-1 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg scale-[1.03] z-10' : isLocked ? 'text-slate-800 cursor-not-allowed opacity-30' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                <tab.icon className="w-4 h-4 md:w-6 md:h-6" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-2.5 h-2.5 absolute top-2 right-2 opacity-20" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'transcribe' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><Volume2 className="text-red-500 w-6 h-6 md:w-12 md:h-12" /> ① 文字起こし</h3>
            {renderGuide(['動画から音声を抽出・保存', '指示をコピーしてAIへ貼り付け', 'AIの結果を右の欄へペースト'])}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                {!file ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-3xl p-10 md:p-16 text-center hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" /><Upload className="h-10 w-10 md:h-16 md:w-16 text-slate-700 group-hover:text-red-500 mx-auto mb-4" /><p className="text-lg md:text-2xl text-slate-500 font-black italic uppercase">Drop Video</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-red-600/30 rounded-[2rem] p-6 md:p-10 space-y-6 shadow-2xl">
                    <p className="text-white font-black truncate text-sm md:text-lg text-center">{file.name}</p>
                    {processedFileUrl && (
                      <div className="space-y-4 md:space-y-6">
                        <a href={processedFileUrl} download="audio.mp3" className="w-full h-14 md:h-20 bg-white text-black hover:bg-slate-200 font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all uppercase italic text-sm md:text-lg"><Download className="w-4 h-4 md:w-6 md:h-6" /> MP3を保存</a>
                        <div className="p-4 md:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                           <Button onClick={() => handleCopy("以下の音声から一言一句文字起こししてください。")} className={`w-full h-12 md:h-16 font-black rounded-xl transition-all text-xs md:text-sm ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>指示をコピー</Button>
                           <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 md:h-12 border-slate-800 text-[10px] md:text-xs font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button><Button variant="outline" className="h-10 md:h-12 border-slate-800 text-[10px] md:text-xs font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" /><h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">AIの回答を戻す</h3></div>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="結果をここにペースト..." className="w-full h-48 md:h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-200 focus:border-emerald-500 outline-none font-mono" />
              </div>
            </div>
            {transcriptionResult && (
               <Button onClick={() => setActiveTab('script')} className="w-full h-16 md:h-20 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm md:text-lg group">② 台本作成へ進む <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" /></Button>
            )}
          </Card>
        )}

        {/* ... OTHER TABS FOLLOW THE SAME MOBILE-FRIENDLY BALANCED PATTERN ... */}
        {activeTab === 'script' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in fade-in zoom-in">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3"><FileText className="text-red-500 w-6 h-6 md:w-12 md:h-12" /> ② 台本プロンプト</h3>
            {renderGuide(['ジャンル選択', '指示をコピーしてCLAUDEへ', '完成した台本を下のエリアへ貼る'])}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {GENRES.map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)} className={`px-4 py-2 rounded-xl font-black text-[10px] md:text-xs transition-all ${selectedGenre === g ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:bg-slate-800'}`}>{g}</button>
              ))}
            </div>
            {renderCopyAndRedirect(PROMPTS.script, 'CLAUDE', 'https://claude.ai', 'character')}
            <div className="bg-slate-950 rounded-[2rem] p-6 md:p-10 border border-slate-800 space-y-4 mt-10">
               <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 md:h-8 md:w-8 text-orange-500" /><h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter text-left">完成した台本を戻す</h3></div>
               <textarea value={scriptResult} onChange={(e) => setScriptResult(e.target.value)} placeholder="台本をペースト..." className="w-full h-48 md:h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-200 focus:border-orange-500 outline-none font-mono" />
            </div>
          </Card>
        )}

        {/* CHARACTER, THUMBNAIL, SEO, BGM follow same pattern... */}
        {activeTab === 'character' && <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center"><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Scissors className="text-red-500 w-6 h-6 md:w-12 md:h-12" /> ③ 人物イラスト</h3>{renderGuide(['指示をコピーしてGPTへ貼る'])}{renderCopyAndRedirect(PROMPTS.character, 'CHATGPT', 'https://chatgpt.com', 'thumbnail')}</Card>}
        {activeTab === 'thumbnail' && <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center"><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><ImageIcon className="text-red-500 w-6 h-6 md:w-12 md:h-12" /> ④ サムネイル</h3>{renderGuide(['指示をコピーしてGPTへ貼る'])}{renderCopyAndRedirect(PROMPTS.thumbnail, 'CHATGPT', 'https://chatgpt.com', 'seo')}</Card>}
        {activeTab === 'seo' && <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center"><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Type className="text-red-500 w-6 h-6 md:w-12 md:h-12" /> ⑤ SEOタイトル</h3>{renderGuide(['指示をコピーしてGEMINIへ貼る'])}{renderCopyAndRedirect(PROMPTS.seo, 'GEMINI', 'https://gemini.google.com', 'bgm')}</Card>}
        {activeTab === 'bgm' && <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center"><h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Music className="text-red-500 w-6 h-6 md:w-12 md:h-12" /> ⑥ BGM</h3>{renderGuide(['指示をコピーしてSUNOへ貼る'])}{renderCopyAndRedirect(PROMPTS.bgm, 'SUNO AI', 'https://suno.com', 'transcribe')}</Card>}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">NextraLabs — 2026 Creative Automation Hub</p></div>
    </div>
  )
}
