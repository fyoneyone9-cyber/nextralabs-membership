'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Upload, 
  CheckCircle2, 
  Youtube, 
  FileVideo, 
  FileText,
  Zap,
  ChevronRight,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
  Download,
  Volume2,
  Image as ImageIcon,
  Type,
  Music,
  Clapperboard,
  Scissors,
  FileCheck,
  Lock
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
      }, 1500);
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'transcribe' || isStep1Complete) {
      setActiveTab(tabId);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-2">
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 mb-2">
          <Clapperboard className="w-3 h-3 mr-1" /> NEXTRALABS ORIGINAL
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AI YouTube Producer</h1>
        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Post-Production Automation Hub</p>
      </div>

      {/* 🔴 LOCKED TABS SYSTEM */}
      <div className="w-full">
        <div className="overflow-x-auto pb-4">
          <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[800px] rounded-2xl">
            {TABS.map((tab) => {
              const isLocked = tab.id !== 'transcribe' && !isStep1Complete;
              return (
                <button
                  key={tab.id}
                  disabled={isLocked}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 py-4 px-2 rounded-xl font-bold text-xs uppercase italic transition-all flex items-center justify-center relative ${
                    activeTab === tab.id 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : isLocked 
                        ? 'text-slate-700 cursor-not-allowed' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" /> 
                  {tab.label}
                  {isLocked && <Lock className="w-3 h-3 ml-1 opacity-50" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          {activeTab === 'transcribe' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center"><Volume2 className="h-8 w-8 text-red-500" /></div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">1. 音声を抽出</h3>
                  
                  {!file ? (
                    <div 
                      className="border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center hover:bg-slate-950 transition-all group cursor-pointer relative"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
                      <Upload className="h-10 w-10 text-slate-700 group-hover:text-red-500 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold italic">動画をドロップして開始</p>
                    </div>
                  ) : (
                    <div className="bg-slate-950 border-2 border-red-600 rounded-3xl p-6 space-y-4 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                          {isProcessing ? <Loader2 className="animate-spin text-white h-5 w-5" /> : <Download className="text-white h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-black truncate text-sm">{file.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Ready to Download</p>
                        </div>
                      </div>
                      
                      {processedFileUrl && (
                        <div className="space-y-4">
                          <a 
                            href={processedFileUrl} 
                            download="extracted_audio.mp3" 
                            className="w-full h-14 bg-white text-black hover:bg-slate-200 font-black rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all uppercase italic text-sm"
                          >
                            <Download className="w-4 h-4" /> MP3をパソコンに保存
                          </a>
                          <div className="flex items-center gap-2 text-emerald-500 justify-center">
                            <ArrowRight className="h-4 w-4 animate-bounce rotate-90" />
                            <p className="text-[10px] font-black uppercase tracking-widest italic">ロック解除！②へ進めます</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 flex flex-col justify-center space-y-6 relative overflow-hidden">
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">2. 指示をコピーしてAIへ</h3>
                    <div className="p-5 bg-slate-900 rounded-2xl border border-white/5 space-y-4">
                      <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                        「保存したMP3をAIにドロップして、この指示を貼り付けてください」
                      </p>
                      <Button onClick={() => handleCopy("以下の音声ファイルから文字起こししてください。")} className={`w-full h-14 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>
                        {copied ? '✅ COPY SUCCESS!' : '文字起こし指示をコピー'}
                      </Button>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button variant="outline" className="h-14 border-slate-800 text-slate-300 font-black italic uppercase group" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                        <Button variant="outline" className="h-14 border-slate-800 text-slate-300 font-black italic uppercase group" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'script' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8">台本プロンプトを生成</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {GENRES.map(g => (
                  <Button key={g} variant={selectedGenre === g ? 'default' : 'outline'} onClick={() => setSelectedGenre(g)} className={`rounded-xl font-bold h-10 ${selectedGenre === g ? 'bg-red-600 border-red-400' : 'border-slate-800 text-slate-400'}`}>{g}</Button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={() => handleCopy(`あなたはプロのYouTube作家です。台本を作成してください。ジャンル：${selectedGenre}`)} className="h-16 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl shadow-xl italic uppercase">{copied ? '✅ COPIED' : '台本指示をコピー'}</Button>
                <Button variant="outline" onClick={() => window.open('https://claude.ai', '_blank')} className="h-16 border-slate-800 text-slate-300 font-black text-xl rounded-2xl italic uppercase">CLAUDEを開く</Button>
              </div>
            </Card>
          )}
          
          {/* ... ③〜⑥ も同様に activeTab チェックで表示（略） ... */}
          {activeTab === 'character' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">登場人物のイラスト生成</h3>
               <Button onClick={() => handleCopy("人物イラストを生成してください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase mt-8">指示をコピー</Button>
            </Card>
          )}
          {activeTab === 'thumbnail' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">最強サムネイル案</h3>
               <Button onClick={() => handleCopy("サムネ案を出してください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase mt-8">指示をコピー</Button>
            </Card>
          )}
          {activeTab === 'seo' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">SEO最適化セット</h3>
               <Button onClick={() => handleCopy("タイトルとタグを出してください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase mt-8">指示をコピー</Button>
            </Card>
          )}
          {activeTab === 'bgm' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">BGMプロンプト</h3>
               <Button onClick={() => handleCopy("BGMプロンプトを作ってください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase mt-8">指示をコピー</Button>
            </Card>
          )}
        </div>
      </div>
      <div className="mt-16 text-center text-slate-500">
         <p className="text-[10px] font-black uppercase tracking-widest italic">Powered by NextraLabs — AIの力を、あなたの日常に。</p>
      </div>
    </div>
  )
}
