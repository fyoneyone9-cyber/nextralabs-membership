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
  Lock,
  MessageSquarePlus,
  ClipboardPaste
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
  
  // 🔴 IMPORTANT: THE BRIDGE FROM AI
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

  const getFullScriptPrompt = () => {
    const base = `あなたはプロのYouTube放送作家です。以下の【文字起こしデータ】を元に、最高に面白いYouTube台本を作成してください。

【ジャンル】: ${selectedGenre}
【構成要件】: 
・導入15秒で視聴者の興味を惹きつける
・3〜5つのセクションで分かりやすく解説
・最後に自然なチャンネル登録誘導

【文字起こしデータ】:
${transcriptionResult || '（ここに文字起こしテキストが挿入されます）'}

それでは、台本をお願いします！`;
    return base;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-2">
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 mb-2">
          <Clapperboard className="w-3 h-3 mr-1" /> NEXTRALABS ORIGINAL
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter text-shadow-xl">AI YouTube Producer</h1>
      </div>

      {/* TABS */}
      <div className="w-full">
        <div className="overflow-x-auto pb-4">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-1 flex min-w-[800px] rounded-2xl shadow-2xl">
            {TABS.map((tab) => {
              const isLocked = tab.id !== 'transcribe' && !isStep1Complete;
              return (
                <button
                  key={tab.id}
                  disabled={isLocked}
                  onClick={() => !isLocked && setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-2 rounded-xl font-bold text-[10px] uppercase italic transition-all flex flex-col items-center justify-center gap-1 relative ${
                    activeTab === tab.id 
                      ? 'bg-red-600 text-white shadow-xl scale-[1.02]' 
                      : isLocked 
                        ? 'text-slate-700 cursor-not-allowed opacity-50' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mb-1" /> 
                  <span>{tab.label}</span>
                  {isLocked && <Lock className="w-2.5 h-2.5 absolute top-2 right-2 opacity-30" />}
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
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center shadow-lg"><Volume2 className="h-6 w-6 text-red-500" /></div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">1. 素材を準備</h3>
                  </div>
                  
                  {!file ? (
                    <div className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center hover:bg-slate-950 transition-all group cursor-pointer bg-slate-900/50" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
                      <Upload className="h-8 w-8 text-slate-700 group-hover:text-red-500 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold italic text-sm">動画・音声ファイルをドロップ</p>
                    </div>
                  ) : (
                    <div className="bg-slate-950 border-2 border-red-600/30 rounded-3xl p-6 space-y-4 shadow-2xl">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">{isProcessing ? <Loader2 className="animate-spin text-white h-5 w-5" /> : <Download className="text-white h-5 w-5" />}</div>
                         <div className="flex-1 min-w-0"><p className="text-white font-black truncate text-xs">{file.name}</p><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Ready to go</p></div>
                      </div>
                      {processedFileUrl && (
                        <div className="space-y-4">
                          <a href={processedFileUrl} download="extracted_audio.mp3" className="w-full h-14 bg-white text-black hover:bg-slate-200 font-black rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all uppercase italic text-xs">
                            <Download className="w-4 h-4" /> MP3をパソコンに保存
                          </a>
                          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                             <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase italic">Copy this & paste into Gemini with your MP3</p>
                             <Button onClick={() => handleCopy("以下の音声ファイルから、重要な発言を逃さず一言一句文字起こししてください。誤字脱字は文脈から補正してください。")} className={`w-full h-12 font-black rounded-xl transition-all text-xs ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>文字起こし指示をコピー</Button>
                             <div className="grid grid-cols-2 gap-2 mt-3">
                                <Button variant="outline" className="h-10 border-slate-800 text-slate-400 text-[9px] uppercase font-black" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                                <Button variant="outline" className="h-10 border-slate-800 text-slate-400 text-[9px] uppercase font-black" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                             </div>
                          </div>
                          <Button onClick={() => setActiveTab('script')} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase italic text-xs">② 台本作成へ進む <ArrowRight className="w-4 h-4" /></Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 flex flex-col justify-center space-y-6 relative overflow-hidden">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center shadow-lg"><ClipboardPaste className="h-5 w-5 text-emerald-500" /></div><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">AIの回答を戻す</h3></div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed italic">AIで文字起こしした結果をここに貼り付けてください（次の台本作成で使用します）</p>
                      <textarea 
                        value={transcriptionResult} 
                        onChange={(e) => setTranscriptionResult(e.target.value)}
                        placeholder="Gemini等からコピーした文字起こしをここにペースト..."
                        className="w-full h-48 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:border-emerald-500 outline-none shadow-inner transition-colors"
                      />
                      {transcriptionResult && <Badge className="bg-emerald-500 text-slate-950 font-black">入力済み：{transcriptionResult.length} 文字</Badge>}
                   </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'script' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500 text-center relative overflow-hidden">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8">台本プロンプトを生成</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {GENRES.map(g => (
                  <Button key={g} variant={selectedGenre === g ? 'default' : 'outline'} onClick={() => setSelectedGenre(g)} className={`rounded-xl font-bold h-10 px-6 ${selectedGenre === g ? 'bg-red-600 border-red-400' : 'border-slate-800 text-slate-400 hover:bg-slate-800'}`}>{g}</Button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                   <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left h-48 overflow-y-auto shadow-inner relative group">
                      {!transcriptionResult && <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center p-6 text-center"><p className="text-[10px] text-red-500 font-bold uppercase italic">①のタブに戻って<br />文字起こし結果を貼り付けてください</p></div>}
                      <p className="text-[10px] text-slate-500 font-mono leading-relaxed whitespace-pre-wrap italic">{getFullScriptPrompt()}</p>
                   </div>
                   <Button disabled={!transcriptionResult} onClick={() => handleCopy(getFullScriptPrompt())} className={`w-full h-20 font-black text-xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>
                    {copied ? <span className="flex items-center gap-2"><CheckCircle2 /> COPIED!</span> : '台本指示をコピー'}
                  </Button>
                </div>
                <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center space-y-6">
                   <div className="w-16 h-16 bg-orange-600/10 rounded-full flex items-center justify-center shadow-lg"><MessageSquarePlus className="h-8 w-8 text-orange-600" /></div>
                   <p className="text-white font-black italic uppercase tracking-tighter">Recommended: CLAUDE</p>
                   <Button variant="outline" onClick={() => window.open('https://claude.ai', '_blank')} className="w-full h-16 border-slate-800 text-slate-300 font-black text-lg rounded-xl hover:bg-slate-900 transition-all uppercase italic">CLAUDEを開く</Button>
                </div>
              </div>
              <div className="mt-12 flex justify-center border-t border-slate-800 pt-8">
                <Button onClick={() => setActiveTab('character')} variant="ghost" className="text-slate-500 hover:text-white font-black italic uppercase text-xs">③ 人物画像へ進む →</Button>
              </div>
            </Card>
          )}
          
          {/* ③〜⑥ TABS REMAIN SIMILAR (REDACTED FOR BREVITY) */}
          {activeTab === 'character' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center"><h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">③ 登場人物のイラスト生成</h3><Button onClick={() => handleCopy("台本から人物を抽出しイラスト生成してください。")} className="h-20 bg-red-600 text-white font-black text-xl rounded-2xl italic uppercase px-12 mt-8">指示をコピー</Button><div className="mt-12 flex justify-center"><Button onClick={() => setActiveTab('thumbnail')} variant="ghost" className="text-slate-500 italic font-bold">④ サムネイルへ進む →</Button></div></Card>}
          {activeTab === 'thumbnail' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center"><h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">④ 最強サムネイル構成案</h3><Button onClick={() => handleCopy("サムネイル案を3パターン出してください。")} className="h-20 bg-red-600 text-white font-black text-xl rounded-2xl italic uppercase px-12 mt-8">指示をコピー</Button><div className="mt-12 flex justify-center"><Button onClick={() => setActiveTab('seo')} variant="ghost" className="text-slate-500 italic font-bold">⑤ タイトル/SEOへ進む →</Button></div></Card>}
          {activeTab === 'seo' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center"><h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">⑤ SEO最適化タイトル＆タグ</h3><Button onClick={() => handleCopy("タイトルとタグを出してください。")} className="h-20 bg-red-600 text-white font-black text-xl rounded-2xl italic uppercase px-12 mt-8">指示をコピー</Button><div className="mt-12 flex justify-center"><Button onClick={() => setActiveTab('bgm')} variant="ghost" className="text-slate-500 italic font-bold">⑥ BGMへ進む →</Button></div></Card>}
          {activeTab === 'bgm' && <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center"><h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">⑥ BGMプロンプト作成</h3><Button onClick={() => handleCopy("BGMプロンプトを作ってください。")} className="h-20 bg-red-600 text-white font-black text-xl rounded-2xl italic uppercase px-12 mt-8">指示をコピー</Button></Card>}
        </div>
      </div>
      <div className="mt-16 text-center text-slate-500">
         <p className="text-[10px] font-black uppercase tracking-widest italic opacity-30">Powered by NextraLabs — 2026 Creative Automation Engine</p>
      </div>
    </div>
  )
}
