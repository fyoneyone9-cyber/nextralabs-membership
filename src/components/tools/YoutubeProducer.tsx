'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ArrowRight, Video, FileText, Users, Image as ImageIcon, Music, Type, Download, Copy, ExternalLink, Info, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText, HelpCircle, Globe, BrainCircuit, Zap } from 'lucide-react'
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

// 🛠️ 必ず表示する3大AI
const MAJOR_AI = [
  { id: 'claude', name: 'Claude', url: 'https://claude.ai', icon: '🟠', desc: '自然な日本語', isBestForScript: true },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', icon: '🟢', desc: '万能・画像生成', isBestForImage: true },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', icon: '💎', desc: 'Google検索・大容量' },
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
    setCompressProgress('🔄 音声を抽出中...');
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
    const ffmpeg = new FFmpeg()
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
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
    const base = inputText || "(文字起こしデータ)"
    if (step === 2) return `以下の文字起こしを元に、最高に面白いYouTube台本を作成してください：\n\n${base}`
    if (step === 3) return `この動画に登場するキャラの設定案を作成してください：\n\n${base}`
    return ""
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">YouTube Producer</h1>
      </div>

      {/* 🟢 STEP NAV */}
      <div className="flex items-center justify-center max-w-5xl mx-auto overflow-x-auto pb-4 px-4 scrollbar-hide">
        <div className="flex items-center justify-between w-full min-w-[700px]">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex flex-col items-center gap-3 transition-all ${currentStep === s.id ? 'opacity-100 scale-125' : currentStep > s.id ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${currentStep === s.id ? 'bg-red-600 border-red-400 text-white' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700'}`}>
                  {currentStep > s.id ? <CheckCircle2 className="h-8 w-8" /> : <s.icon className="h-8 w-8" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-4 rounded-full ${currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* --- STEP 1: MEDIA --- */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-12 shadow-2xl">
              <div className="space-y-12">
                {!extractedAudioUrl ? (
                  <div className="space-y-8">
                    <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                    <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                      <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                      <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声をここに追加'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-blue-500/30 space-y-10 animate-in zoom-in duration-500 shadow-2xl">
                    <h3 className="text-3xl font-black text-blue-400 uppercase italic tracking-tighter text-center">Extraction Completed</h3>
                    <audio src={extractedAudioUrl} controls className="w-full h-20" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <Label className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center gap-2">1. Copy Instruction</Label>
                          <Button onClick={() => handleCopy("この音声を文字起こしして。", 'tr')} className="w-full h-24 bg-white text-black font-black text-2xl rounded-[1.5rem] gap-4 shadow-xl hover:bg-slate-100 transition-all active:scale-95">指示をコピー</Button>
                       </div>
                       <div className="space-y-6">
                          <Label className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center gap-2">2. Open Best AI</Label>
                          <div className="grid grid-cols-3 gap-4">
                            {MAJOR_AI.map(ai => (
                              <a key={ai.id} href={ai.url} target="_blank" className="h-24 bg-slate-900 border border-white/10 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-800 transition-all group">
                                <span className="text-3xl mb-1">{ai.icon}</span>
                                <span className="font-black text-white text-[10px] uppercase">{ai.name}</span>
                              </a>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
                <div className="space-y-6 pt-12 border-t border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-4 text-white font-black text-4xl italic uppercase"><MessageSquareText className="h-12 w-12 text-red-500" /> Result Paste</div>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AIから返ってきた結果を貼り付けてください..." className="w-full h-[400px] bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                  <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl shadow-red-600/40 mt-10 gap-4 uppercase italic">GO TO SCRIPTING <ArrowRight className="h-12 w-12" /></Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* --- STEP 2+: SCRIPTING & BEYOND --- */}
        {currentStep > 1 && (
          <div className="max-w-6xl mx-auto space-y-12">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Step 0{currentStep}: {STEPS[currentStep-1].label}</h2>
                <Button variant="ghost" onClick={() => setCurrentStep((currentStep - 1) as any)} className="text-slate-500 text-xl font-bold hover:text-white transition-colors">← BACK</Button>
              </div>

              <div className="space-y-12">
                <div className="space-y-6 text-center">
                   <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-2 px-4"><Zap className="h-5 w-5" /> 1. Copy The Prompt</Label>
                   <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-white/5 font-mono text-3xl text-slate-300 leading-relaxed mb-12 max-h-[600px] overflow-y-auto shadow-inner text-left">
                      {getStepPrompt(currentStep)}
                   </div>
                   <Button onClick={() => handleCopy(getStepPrompt(currentStep), "p")} className="w-full h-32 bg-white text-black font-black text-4xl rounded-[2rem] gap-6 shadow-2xl hover:scale-[1.02] transition-all active:scale-95">プロンプトをコピー</Button>
                </div>

                <div className="space-y-8 pt-12 border-t border-slate-800">
                  <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-2"><Globe className="h-5 w-5" /> 2. Choose Your Engine</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MAJOR_AI.map(ai => (
                      <a key={ai.id} href={ai.url} target="_blank" className={`p-10 rounded-[3rem] border-2 bg-slate-950 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl ${
                        (currentStep === 2 && ai.isBestForScript) || (currentStep === 4 && ai.isBestForImage) ? 'border-orange-500 ring-4 ring-orange-500/10 scale-105 z-10' : 'border-white/5 opacity-80'
                      }`}>
                        <span className="text-6xl">{ai.icon}</span>
                        <div className="text-center">
                          <span className="font-black text-white text-3xl uppercase tracking-tighter block mb-1">{ai.name}</span>
                          <span className="text-slate-400 text-sm font-bold uppercase">{ai.desc}</span>
                        </div>
                        {(currentStep === 2 && ai.isBestForScript) || (currentStep === 4 && ai.isBestForImage) ? <Badge className="bg-orange-600 text-white font-black px-6 py-2 text-sm uppercase shadow-lg animate-pulse">Recommended</Badge> : null}
                      </a>
                    ))}
                  </div>
                </div>

                {currentStep < 6 && (
                  <div className="pt-16">
                    <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-24 bg-slate-800 hover:bg-slate-700 text-white font-black text-2xl rounded-[1.5rem] shadow-xl uppercase italic">NEXT STAGE <ArrowRight /></Button>
                  </div>
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
