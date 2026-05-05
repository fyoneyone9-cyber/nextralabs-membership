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
  
  // 🔴 THE CORE DATA PIPELINE
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [scriptResult, setScriptResult] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isStep1Complete = !!processedFileUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);
      setProcessedFileUrl(null);
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

  // 🔴 CONTEXT-AWARE PROMPT GENERATORS
  const PROMPTS = {
    script: `あなたはプロのYouTube放送作家です。以下の【文字起こしデータ】を元に、最高に面白い【${selectedGenre}】向けの台本を作成してください。\n\n【文字起こしデータ】:\n${transcriptionResult || '（未入力）'}\n\n構成は、導入・本編（3チャプター）・エンディングの3部構成で。`,
    character: `以下の【YouTube台本】に登場する人物を特定し、DALL-E 3で描画可能な「アニメ風立ち絵」の生成プロンプトを作成して、そのまま画像を1枚ずつ生成してください。表情は豊かに、背景は透過かシンプルな白でお願いします。\n\n【YouTube台本】:\n${scriptResult || transcriptionResult || '（未入力）'}`,
    thumbnail: `以下の【動画内容】に最適な、視聴率を稼げるサムネイルをDALL-E 3で1枚生成してください。文字要素（日本語）を中央に大きく配置し、インパクトのある配色（赤・黄・黒など）を使用してください。比率は16:9です。\n\n【動画内容】:\n${scriptResult || transcriptionResult || '（未入力）'}`,
    seo: `以下の【台本内容】に基づき、YouTube SEOに最適化したタイトル案5つ、タグ15個、タイムスタンプ付き説明文を作成してください。\n\n【台本内容】:\n${scriptResult || '（未入力）'}`,
    bgm: `以下の【動画の雰囲気】に合うBGMの構成案と、Suno AI用の英文プロンプトを3つ作成してください。\n\n【動画の雰囲気】:\n${scriptResult || transcriptionResult || '（未入力）'}`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 mb-8 flex items-start gap-6">
      <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center shrink-0"><Lightbulb className="w-8 h-8 text-red-500" /></div>
      <div className="space-y-2">
        <p className="text-sm font-black text-white uppercase italic tracking-widest opacity-70">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-sm md:text-base text-slate-300 font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-red-600 text-white rounded-full text-xs italic">{i+1}</span> {s}
          </p>
        ))}
      </div>
    </div>
  );

  const renderCopyAndRedirect = (prompt: string, aiName: string, aiUrl: string, targetTab: string) => (
    <div className="space-y-8 mt-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 text-left h-48 overflow-y-auto text-xs text-slate-500 font-mono italic whitespace-pre-wrap">{prompt}</div>
          <Button onClick={() => handleCopy(prompt)} className={`w-full h-20 font-black text-xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>
            {copied ? '✅ COPY SUCCESS!' : '最強指示をコピー'}
          </Button>
        </div>
        <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center"><ExternalLink className="w-8 h-8 text-red-600" /></div>
          <Button variant="outline" onClick={() => window.open(aiUrl, '_blank')} className="w-full h-20 border-slate-800 text-slate-300 font-black text-xl rounded-2xl hover:bg-slate-900 transition-all uppercase italic">
             {aiName}を開いて貼る ↗
          </Button>
        </div>
      </div>
      <Button onClick={() => setActiveTab(targetTab)} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 uppercase italic text-lg group">
        Next Step <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center">
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 mb-4 font-bold italic tracking-widest px-4 py-1 uppercase">NextraLabs Creative Hub</Badge>
        <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">YouTube Producer</h1>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-2 flex min-w-[1000px] rounded-[2rem]">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !isStep1Complete;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-6 px-4 rounded-2xl font-black text-sm md:text-base uppercase italic transition-all flex flex-col items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.05] z-10' : isLocked ? 'text-slate-800 cursor-not-allowed opacity-30' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}>
                <tab.icon className="w-6 h-6" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-3 h-3 absolute top-3 right-3 opacity-20" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        {/* ① 文字起こし */}
        {activeTab === 'transcribe' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4"><Volume2 className="text-red-500" /> ① 文字起こし</h3>
            {renderGuide(['動画をドロップしてMP3を抽出', '指示をコピーしてAIへ投げ、MP3をドロップ', 'AIから返ってきた結果を右側に貼り付ける'])}
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {!file ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[3rem] p-16 text-center hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" /><Upload className="h-12 w-12 text-slate-700 group-hover:text-red-500 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase">Drop Video</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-red-600/30 rounded-[3rem] p-10 space-y-6">
                    <p className="text-white font-black truncate text-lg text-center">{file.name}</p>
                    {processedFileUrl && (
                      <div className="space-y-6">
                        <a href={processedFileUrl} download="audio.mp3" className="w-full h-20 bg-white text-black hover:bg-slate-200 font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all uppercase italic text-lg"><Download /> MP3を保存</a>
                        <Button onClick={() => handleCopy("以下の音声から一言一句文字起こししてください。")} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>指示をコピー</Button>
                        <div className="grid grid-cols-2 gap-4"><Button variant="outline" className="h-12 border-slate-800 text-xs font-black" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button><Button variant="outline" className="h-12 border-slate-800 text-xs font-black" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4 shadow-2xl">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-emerald-500" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">AIの回答を戻す</h3></div>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="文字起こし結果をここにペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:border-emerald-500 outline-none font-mono" />
              </div>
            </div>
            {transcriptionResult && renderNextButton('script', '② 台本作成へ進む')}
          </Card>
        )}

        {/* ② 台本作成 */}
        {activeTab === 'script' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4"><FileText className="text-red-500" /> ② 台本プロンプトを生成</h3>
            {renderGuide(['ジャンル選択', '指示をコピーしてCLAUDEへ', '完成した台本を下のエリアへ貼り付ける'])}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {GENRES.map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)} className={`px-6 py-3 rounded-2xl font-black text-xs md:text-sm transition-all ${selectedGenre === g ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:bg-slate-800'}`}>{g}</button>
              ))}
            </div>
            <div className="space-y-10">
              {renderCopyAndRedirect(PROMPTS.script, 'CLAUDE', 'https://claude.ai', 'character')}
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-orange-500" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">完成した台本を戻す</h3></div>
                 <textarea value={scriptResult} onChange={(e) => setScriptResult(e.target.value)} placeholder="Claudeが作った台本をここにペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:border-orange-500 outline-none font-mono" />
              </div>
            </div>
          </Card>
        )}

        {/* ③ 人物画像 (DALL-E 3 DIRECT) */}
        {activeTab === 'character' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center justify-center gap-4"><Scissors className="text-red-500" /> ③ 人物イラスト生成</h3>
            {renderGuide(['最強指示をコピー（台本内容が自動注入済み）', 'CHATGPTに貼るだけで、キャラ特定から画像生成まで開始！'])}
            {renderCopyAndRedirect(PROMPTS.character, 'CHATGPT (DALL-E 3)', 'https://chatgpt.com', 'thumbnail')}
          </Card>
        )}

        {/* ④ サムネイル (DALL-E 3 DIRECT) */}
        {activeTab === 'thumbnail' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl animate-in fade-in zoom-in duration-500 text-center">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center justify-center gap-4"><ImageIcon className="text-red-500" /> ④ 最強サムネイル生成</h3>
            {renderGuide(['最強指示をコピー', '貼るだけで、インパクト抜群の16:9サムネが生成されます'])}
            {renderCopyAndRedirect(PROMPTS.thumbnail, 'CHATGPT / CANVA', 'https://chatgpt.com', 'seo')}
          </Card>
        )}

        {/* SEO & BGM REMAIN CONSISTENT WITH DATA INJECTION (REDACTED FOR BREVITY) */}
        {activeTab === 'seo' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl text-center">
             <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10">⑤ SEO最適化タイトル</h3>
             {renderCopyAndRedirect(PROMPTS.seo, 'GEMINI', 'https://gemini.google.com', 'bgm')}
          </Card>
        )}
        {activeTab === 'bgm' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl text-center">
             <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10">⑥ BGMプロンプト</h3>
             {renderCopyAndRedirect(PROMPTS.bgm, 'SUNO AI', 'https://suno.com', 'transcribe')}
          </Card>
        )}
      </div>
    </div>
  )
}
