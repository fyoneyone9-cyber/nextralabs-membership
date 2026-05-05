'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label' // 🛠️ 追加
import { ArrowRight, Video, FileText, Users, Image as ImageIcon, Music, Type, Download, Copy, ExternalLink, Info, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

type Step = 1 | 2 | 3 | 4 | 5 | 6
const STEPS = [
  { id: 1, label: '素材取り込み', icon: Video },
  { id: 2, label: '台本作成', icon: FileText },
  { id: 3, label: 'キャラ設定', icon: Users },
  { id: 4, label: 'サムネイル', icon: ImageIcon },
  { id: 5, label: 'タイトル/タグ', icon: Type },
  { id: 6, label: 'BGM作成', icon: Music },
]

export function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null)
  const [compressProgress, setCompressProgress] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const extractAudio = async (file: File) => {
    setCompressProgress('🔄 FFmpegエンジンをロード中...')
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
    const ffmpeg = new FFmpeg()
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    ffmpeg.on('progress', ({ progress }) => setCompressProgress(`🎵 音声を抽出・圧縮中... ${Math.round(progress * 100)}%`))
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'))
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3'])
    const data = await ffmpeg.readFile('output.mp3') as any
    const blob = new Blob([data.buffer], { type: 'audio/mp3' })
    setExtractedAudioUrl(URL.createObjectURL(blob))
    setCompressProgress(null)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // 🪄 文字起こし専用プロンプト
  const transcribePrompt = "この音声ファイルを文字起こししてください。不自然な箇所は修正し、読みやすい日本語のテキストとして出力してください。"

  const getStepPrompt = (step: number) => {
    const base = inputText || "(音声から抽出したテキスト)"
    if (step === 2) return `以下の文字起こし内容を元に、YouTube動画の構成案と詳細な台本（セリフ付き）を作成してください。:${base}`
    if (step === 3) return `この台本に登場するキャラクターの設定案（名前、性格、特徴）を作成してください。:${base}`
    return ""
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-10 w-10 text-white" /></div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">YouTube Producer</h1>
      </div>

      {/* PROGRESS */}
      <div className="flex items-center justify-between max-w-4xl mx-auto overflow-x-auto pb-4 scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-2 ${currentStep === s.id ? 'opacity-100 scale-125' : currentStep > s.id ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${currentStep === s.id ? 'bg-red-600 border-red-400 text-white' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700'}`}>
                {currentStep > s.id ? <CheckCircle2 className="h-6 w-6" /> : <s.icon className="h-6 w-6" />}
              </div>
              <span className="text-[10px] font-black uppercase">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-3 rounded-full transition-all ${currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-black text-white text-center italic uppercase">Step 01: Media Input</h2>
            
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 shadow-2xl">
              <div className="space-y-8">
                {/* 📁 FILE SELECTOR */}
                {!extractedAudioUrl ? (
                  <div className="space-y-4">
                    <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                    <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                      <FileAudio className="h-16 w-16 mx-auto mb-4 text-red-500 group-hover:scale-110 transition-transform" />
                      <p className="text-2xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声をアップロード'}</p>
                      <p className="text-slate-500 mt-2 font-bold italic uppercase tracking-widest">Powered by FFmpeg</p>
                    </div>
                    {compressProgress && <Badge className="bg-blue-600 animate-pulse px-8 py-3 text-lg rounded-2xl w-full flex justify-center shadow-xl">{compressProgress}</Badge>}
                  </div>
                ) : (
                  /* 🪄 AI TRANSCRIBE GUIDE (RESTORED & ENHANCED) */
                  <div className="bg-slate-950 p-10 rounded-[2.5rem] border-2 border-blue-500/30 space-y-8 animate-in zoom-in duration-300 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-4 rounded-2xl"><Sparkles className="h-8 w-8 text-white" /></div>
                      <div>
                        <h3 className="text-2xl font-black text-white">音声抽出が完了しました</h3>
                        <p className="text-slate-400">外部AIを使って「文字起こし」を行いましょう。</p>
                      </div>
                    </div>
                    
                    <audio src={extractedAudioUrl} controls className="w-full h-16" />

                    <div className="space-y-4">
                      <Label className="text-blue-400 font-black uppercase tracking-widest text-xs">手順 1: 命令文をコピー</Label>
                      <Button onClick={() => handleCopy(transcribePrompt, 'trans')} className="w-full h-20 bg-white text-black font-black text-xl rounded-2xl gap-3 shadow-xl hover:bg-slate-100">
                        <Copy /> {copied === 'trans' ? 'コピー完了！' : '文字起こし指示をコピー'}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-blue-400 font-black uppercase tracking-widest text-xs">手順 2: 抽出ファイルをAIに渡す (おすすめ順)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="https://chatgpt.com" target="_blank" className="relative h-24 bg-slate-900 border-2 border-green-500/50 rounded-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 transition-all">
                          <Badge className="absolute -top-3 bg-green-600 text-white font-black">★ おすすめ：最強</Badge>
                          <span className="text-2xl">🟢</span><span className="font-black text-green-400">ChatGPT</span>
                        </a>
                        <a href="https://gemini.google.com" target="_blank" className="h-24 bg-slate-900 border-2 border-sky-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 transition-all opacity-80">
                          <span className="text-2xl">🔵</span><span className="font-black text-sky-400">Gemini</span>
                        </a>
                        <a href="https://claude.ai" target="_blank" className="h-24 bg-slate-900 border-2 border-orange-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 transition-all opacity-80">
                          <span className="text-2xl">🟠</span><span className="font-black text-orange-400">Claude</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button variant="ghost" onClick={() => {setExtractedAudioUrl(null); setSelectedFile(null)}} className="text-slate-500 hover:text-white">別のファイルをアップロードする</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-8 border-t border-slate-800">
                  <div className="flex items-center gap-2"><MessageSquareText className="h-5 w-5 text-red-500" /><Label className="text-xl font-black text-white">文字起こし結果を入力</Label></div>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AIから返ってきたテキストをここに貼り付けてください..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[2rem] p-8 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                </div>

                <Button onClick={() => setCurrentStep(2)} disabled={!inputText.trim()} className="w-full h-28 bg-red-600 hover:bg-red-500 text-white font-black text-4xl rounded-[2.5rem] shadow-2xl shadow-red-600/40 transition-transform active:scale-95">
                  STEP ② 台本作成へ進む <ArrowRight className="ml-2 h-10 w-10" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 2+ continues with same logic and Large UI */}
        {currentStep > 1 && (
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter font-mono italic">Step 0{currentStep}: {STEPS[currentStep-1].label}</h2>
              <Button variant="ghost" onClick={() => setCurrentStep((currentStep - 1) as any)} className="text-slate-500 text-xl font-bold">← 戻る</Button>
            </div>
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
              <div className="bg-slate-950 p-10 rounded-[2.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-10 max-h-96 overflow-y-auto whitespace-pre-wrap shadow-inner">
                {getStepPrompt(currentStep)}
              </div>
              <div className="space-y-6">
                <Button onClick={() => handleCopy(getStepPrompt(currentStep), `step-${currentStep}`)} className="w-full h-24 bg-white text-black font-black text-3xl rounded-3xl gap-4 shadow-xl hover:bg-slate-100">
                  <Copy className="h-10 w-10" /> {copied === `step-${currentStep}` ? "コピー完了！" : "プロンプトをコピー"}
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <a href="https://claude.ai" target="_blank" className={`h-24 rounded-3xl border-2 bg-slate-950 flex flex-col items-center justify-center relative hover:scale-105 transition-all ${currentStep === 2 ? 'border-orange-500' : 'border-white/5'}`}>
                      {currentStep === 2 && <Badge className="absolute -top-3 bg-orange-600 text-white font-black">★ おすすめ：自然な日本語</Badge>}
                      <span className="text-2xl">🟠</span><span className="font-black text-orange-400 text-xl uppercase tracking-widest">Claude</span>
                   </a>
                   <a href="https://chatgpt.com" target="_blank" className={`h-24 rounded-3xl border-2 bg-slate-950 flex flex-col items-center justify-center relative hover:scale-105 transition-all ${currentStep !== 2 ? 'border-green-500' : 'border-white/5'}`}>
                      {currentStep !== 2 && <Badge className="absolute -top-3 bg-green-600 text-white font-black">★ おすすめ：高性能</Badge>}
                      <span className="text-2xl">🟢</span><span className="font-black text-green-400 text-xl uppercase tracking-widest">ChatGPT</span>
                   </a>
                </div>
                {currentStep < 6 && (
                  <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-24 bg-slate-800 hover:bg-slate-700 text-white font-black text-2xl rounded-3xl mt-6 shadow-xl gap-4">
                    作業完了：次へ進む <ArrowRight />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}
