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
  '🎭 エンタメ', '📚 教育・解説', '📷 Vlog', '💻 テック・IT', '💼 ビジネス', '🎮 ゲーム実況', '🍳 料理', '✈️ 旅行', '📰 ニュース', '🎤 対談'
];

export default function YoutubeProducer() {
  const [activeTab, setActiveTab] = useState('transcribe');
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState('');
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

  const PROMPTS = {
    script: `あなたはプロのYouTube放送作家です。以下の文字起こしデータを元に、視聴者を飽きさせない最高に面白い【${selectedGenre}】向けの台本を作成してください。\n\n【文字起こしデータ】:\n${transcriptionResult || '（文字起こし結果をここに貼ってください）'}\n\n構成は、導入・本編（3チャプター）・エンディングの3部構成でお願いします。`,
    character: `このYouTube台本に登場する主要な人物をリストアップし、それぞれの外見や性格を定義した上で、AI画像生成ツール（DALL-E 3）で使える「高品質なアニメ風立ち絵」の生成プロンプトを作成してください。`,
    thumbnail: `この動画の内容から、クリック率（CTR）を最大化するYouTubeサムネイル案を3パターン（インパクト系・解決系・共感系）提案してください。入れるべき日本語のキャッチコピーも含めてください。サイズは1280x720です。`,
    seo: `この動画をYouTubeに投稿します。SEOに最適化された「クリックしたくなるタイトル」を5案、ハッシュタグを15個、そしてタイムスタンプ付きの動画説明文を作成してください。`,
    bgm: `この動画のテーマと雰囲気に最適なBGMの構成案を作成してください。また、音楽生成AI（Suno AI等）で使えるプロンプトを3つ作成してください。`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-8 flex items-start gap-4">
      <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-red-500" /></div>
      <div className="space-y-1">
        <p className="text-xs font-black text-white uppercase italic tracking-widest mb-1">How to play</p>
        {steps.map((s, i) => (
          <p key={i} className="text-[10px] text-slate-400 font-bold flex items-center gap-2">
            <span className="text-red-500">{i+1}.</span> {s}
          </p>
        ))}
      </div>
    </div>
  );

  const renderCopySection = (prompt: string, aiName: string, aiUrl: string) => (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <div className="space-y-4">
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic whitespace-pre-wrap">{prompt}</div>
        <Button onClick={() => handleCopy(prompt)} className={`w-full h-16 font-black rounded-xl shadow-lg transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>
          {copied ? '✅ COPIED!' : '指示をコピー'}
        </Button>
      </div>
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-white font-black italic uppercase tracking-widest text-xs">Recommended AI</p>
        <Button variant="outline" onClick={() => window.open(aiUrl, '_blank')} className="w-full h-16 border-slate-800 text-slate-300 font-black rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 italic uppercase">
           {aiName}を開く <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-2">
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 mb-2 font-bold italic tracking-widest">NEXTRALABS ORIGINAL</Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AI YouTube Producer</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-1 flex min-w-[800px] rounded-2xl">
          {TABS.map((tab) => {
            const isLocked = tab.id !== 'transcribe' && !isStep1Complete;
            return (
              <button key={tab.id} disabled={isLocked} onClick={() => !isLocked && setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-bold text-[10px] uppercase italic transition-all flex flex-col items-center justify-center gap-1 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.02]' : isLocked ? 'text-slate-700 cursor-not-allowed opacity-50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                <tab.icon className="w-5 h-5 mb-1" /> <span>{tab.label}</span>
                {isLocked && <Lock className="w-2.5 h-2.5 absolute top-2 right-2 opacity-30" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'transcribe' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3"><Volume2 className="text-red-500" /> ① 文字起こし</h3>
            {renderGuide(['動画ファイルをドロップして音声を抽出・保存する', '指示をコピーしてAI（Gemini等）を開く', 'AIにMP3を投げて結果を待ち、右側の欄に貼り付ける'])}
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                {!file ? (
                  <div className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" /><Upload className="h-10 w-10 text-slate-700 group-hover:text-red-500 mx-auto mb-4" /><p className="text-slate-500 font-bold italic text-sm uppercase">Drop Video/Audio</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border-2 border-red-600/30 rounded-3xl p-6 space-y-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">{isProcessing ? <Loader2 className="animate-spin text-white h-5 w-5" /> : <Download className="text-white h-5 w-5" />}</div>
                      <div className="flex-1 min-w-0"><p className="text-white font-black truncate text-xs">{file.name}</p><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Ready</p></div>
                    </div>
                    {processedFileUrl && (
                      <div className="space-y-4">
                        <a href={processedFileUrl} download="extracted_audio.mp3" className="w-full h-14 bg-white text-black hover:bg-slate-200 font-black rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all uppercase italic text-xs"><Download className="w-4 h-4" /> MP3をパソコンに保存</a>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                           <Button onClick={() => handleCopy("以下の音声ファイルから一言一句文字起こししてください。")} className={`w-full h-12 font-black rounded-xl transition-all text-xs ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>文字起こし指示をコピー</Button>
                           <div className="grid grid-cols-2 gap-2 mt-3">
                              <Button variant="outline" className="h-10 border-slate-800 text-slate-400 text-[9px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button>
                              <Button variant="outline" className="h-10 border-slate-800 text-slate-400 text-[9px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                           </div>
                        </div>
                        <Button onClick={() => setActiveTab('script')} className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm group">② 台本作成へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 flex flex-col justify-center space-y-4 relative overflow-hidden">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-5 w-5 text-emerald-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">AIの回答を戻す</h3></div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Paste results from Gemini/ChatGPT here</p>
                 <textarea value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} placeholder="ここにペースト..." className="w-full h-48 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:border-emerald-500 outline-none shadow-inner transition-colors font-mono" />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'script' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3"><FileText className="text-red-500" /> ② 台本プロンプトを生成</h3>
            {renderGuide(['動画ジャンルを選択する', '「台本指示をコピー」してCLAUDEを開く', 'CLAUDEに指示を貼り付けて送信し、次の工程へ進む'])}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {GENRES.map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)} className={`px-4 py-2 rounded-xl font-bold text-[10px] transition-all ${selectedGenre === g ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:bg-slate-800'}`}>{g}</button>
              ))}
            </div>
            {renderCopySection(PROMPTS.script, 'CLAUDE', 'https://claude.ai')}
            <Button onClick={() => setActiveTab('character')} className="w-full h-16 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm group">③ 登場人物画像へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
          </Card>
        )}

        {activeTab === 'character' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3"><Scissors className="text-red-500" /> ③ 登場人物のイラスト生成</h3>
            {renderGuide(['「指示をコピー」してChatGPTを開く', '台本をもとにキャラクター画像（DALL-E 3）を生成する', 'お気に入りの画像が見つかったら次へ進む'])}
            {renderCopySection(PROMPTS.character, 'CHATGPT', 'https://chatgpt.com')}
            <Button onClick={() => setActiveTab('thumbnail')} className="w-full h-16 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm group">④ サムネイルへ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
          </Card>
        )}

        {activeTab === 'thumbnail' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3"><ImageIcon className="text-red-500" /> ④ 最強サムネイル構成案</h3>
            {renderGuide(['「指示をコピー」してCANVAまたはAIを開く', 'クリック率の高い構成案を確認し、制作する', '完成したら次へ進む'])}
            {renderCopySection(PROMPTS.thumbnail, 'CANVA', 'https://www.canva.com')}
            <Button onClick={() => setActiveTab('seo')} className="w-full h-16 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm group">⑤ タイトル/SEOへ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
          </Card>
        )}

        {activeTab === 'seo' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3"><Type className="text-red-500" /> ⑤ SEO最適化タイトル＆タグ</h3>
            {renderGuide(['「指示をコピー」してGEMINIを開く', '検索に強いタイトルとタグを生成し、YouTubeに設定する', '最後はBGM！次へ進む'])}
            {renderCopySection(PROMPTS.seo, 'GEMINI', 'https://gemini.google.com')}
            <Button onClick={() => setActiveTab('bgm')} className="w-full h-16 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic text-sm group">⑥ BGMへ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
          </Card>
        )}

        {activeTab === 'bgm' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3"><Music className="text-red-500" /> ⑥ BGMプロンプト作成</h3>
            {renderGuide(['「指示をコピー」してSuno AI等の音楽AIを開く', '動画にぴったりのBGMを生成し、制作完了！'])}
            {renderCopySection(PROMPTS.bgm, 'SUNO AI', 'https://suno.com')}
            <Button onClick={() => { setFile(null); setProcessedFileUrl(null); setTranscriptionResult(''); setActiveTab('transcribe'); }} variant="outline" className="w-full h-16 mt-8 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl flex items-center justify-center gap-3 uppercase italic text-sm transition-all"><RotateCcw className="w-4 h-4" /> 最初からやり直す</Button>
          </Card>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">NextraLabs — 2026 Creative Automation Hub</p></div>
    </div>
  )
}
