'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
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
    setCompressProgress('🔄 エンジンロード中...')
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
    const ffmpeg = new FFmpeg()
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    ffmpeg.on('progress', ({ progress }) => setCompressProgress(`🎵 抽出中... ${Math.round(progress * 100)}%`))
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'))
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3'])
    const data = await ffmpeg.readFile('output.mp3') as any
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })))
    setCompressProgress(null)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000)
  }

  const getStepPrompt = (step: number) => {
    const base = inputText || "(音声抽出データ)"
    if (step === 2) return `以下の文字起こしを元に、視聴者を惹きつけるYouTube動画の台本を作成してください。:${base}`
    if (step === 3) return `この台本に登場するキャラクターの設定案（名前、性格、特徴）を作成してください。:${base}`
    if (step === 4) return `この動画のサムネイル案を3つ提案してください。:${base}`
    if (step === 5) return `この動画のSEOタイトルとハッシュタグを作成してください。:${base}`
    if (step === 6) return `この動画のBGM用プロンプト（Suno AI用）を作成してください。:${base}`
    return ""
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-10 w-10 text-white" /></div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">YouTube Producer</h1>
      </div>

      {/* 🟢 PROGRESS BAR - FIXED: Added flex-center and better spacing to prevent text cut */}
      <div className="flex items-center justify-center max-w-5xl mx-auto overflow-x-auto pb-8 px-10 scrollbar-hide">
        <div className="flex items-center justify-between w-full min-w-[600px]">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex flex-col items-center gap-3 transition-all ${currentStep === s.id ? 'opacity-100 scale-110' : currentStep > s.id ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${currentStep === s.id ? 'bg-red-600 border-red-400 text-white shadow-xl' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700'}`}>
                  {currentStep > s.id ? <CheckCircle2 className="h-7 w-7" /> : <s.icon className="h-7 w-7" />}
                </div>
                <span className="text-[11px] font-black uppercase whitespace-nowrap tracking-tighter">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-4 rounded-full ${currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Step 01: Media Input</h2>
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
              <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
              <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                <FileAudio className="h-16 w-16 mx-auto mb-4 text-red-500 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声をアップロード'}</p>
                <p className="text-slate-500 mt-2 font-bold italic tracking-widest uppercase">FFmpeg Enabled</p>
              </div>
              {extractedAudioUrl && (
                <div className="bg-slate-950 p-8 rounded-3xl border-2 border-blue-500/20 mt-8 space-y-6 animate-in zoom-in duration-300 shadow-2xl">
                  <p className="text-xl font-bold text-blue-400">✅ 音声の抽出完了</p>
                  <audio src={extractedAudioUrl} controls className="w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <a href={extractedAudioUrl} download="audio.mp3" className="bg-blue-600 text-white rounded-2xl py-5 text-lg font-black flex items-center justify-center gap-3 shadow-xl"><Download /> MP3保存</a>
                    <a href="https://claude.ai" target="_blank" className="bg-white text-black rounded-2xl py-5 text-lg font-black flex items-center justify-center gap-3 shadow-xl">Claudeで文字起こし <ExternalLink /></a>
                  </div>
                </div>
              )}
              <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="または文字起こし結果を貼り付け..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-2xl font-medium focus:border-red-600 text-white mt-8 shadow-inner" />
              <Button onClick={() => setCurrentStep(2)} disabled={!inputText.trim() && !extractedAudioUrl} className="w-full h-28 bg-red-600 hover:bg-red-500 text-white font-black text-4xl rounded-[2.5rem] mt-12 shadow-2xl shadow-red-600/40">STEP ② 台本作成へ進む <ArrowRight className="h-10 w-10 ml-2" /></Button>
            </Card>
          </div>
        )}

        {currentStep > 1 && (
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Step 0{currentStep}: {STEPS[currentStep-1].label}</h2>
              <Button variant="ghost" onClick={() => setCurrentStep((currentStep - 1) as any)} className="text-slate-500 text-xl font-bold">← 戻る</Button>
            </div>
            
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative">
              <div className="bg-slate-950 p-10 rounded-[2.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-10 max-h-96 overflow-y-auto whitespace-pre-wrap shadow-inner">
                {getStepPrompt(currentStep)}
              </div>

              <div className="space-y-8">
                <Button onClick={() => handleCopy(getStepPrompt(currentStep), `step-${currentStep}`)} className="w-full h-24 bg-white text-black font-black text-3xl rounded-3xl gap-4 shadow-xl hover:bg-slate-100 active:scale-95 transition-all">
                  <Copy className="h-10 w-10" /> {copied === `step-${currentStep}` ? "コピー完了！" : "プロンプトをコピー"}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                   {/* 🧡 Claude (RECOMMENDED FOR SCRIPT) */}
                   <a href="https://claude.ai" target="_blank" className={`relative h-28 rounded-3xl border-2 bg-slate-950 flex flex-col items-center justify-center hover:scale-105 transition-all ${currentStep === 2 ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/5 opacity-80'}`}>
                      {currentStep === 2 && <Badge className="absolute -top-4 bg-orange-600 text-white font-black px-4 py-1 text-sm shadow-xl">★ おすすめ：自然な日本語</Badge>}
                      <span className="text-3xl">🟠</span><span className="font-black text-orange-400 text-2xl uppercase tracking-widest">Claude</span>
                   </a>
                   {/* 💚 ChatGPT */}
                   <a href="https://chatgpt.com" target="_blank" className={`relative h-28 rounded-3xl border-2 bg-slate-950 flex flex-col items-center justify-center hover:scale-105 transition-all ${currentStep !== 2 ? 'border-green-500' : 'border-white/5 opacity-80'}`}>
                      {currentStep !== 2 && <Badge className="absolute -top-4 bg-green-600 text-white font-black px-4 py-1 text-sm shadow-xl">★ おすすめ：高品質</Badge>}
                      <span className="text-3xl">🟢</span><span className="font-black text-green-400 text-2xl uppercase tracking-widest">ChatGPT</span>
                   </a>
                </div>

                {currentStep < 6 && (
                  <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-24 bg-slate-800 hover:bg-slate-700 text-white font-black text-2xl rounded-3xl mt-6 shadow-xl gap-4 border-b-8 border-slate-950">
                    作業を終えたら STEP 0{currentStep + 1} へ進む <ArrowRight />
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
