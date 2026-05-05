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
  { id: 1, label: '素材取り込み', icon: Video, what: '動画・音声の解析準備', how: 'お持ちの動画や音声ファイルをアップロードしてください。AIが読み取れるように音声を自動で抜き出します。', result: '文字起こし用の音声データが生成されます。' },
  { id: 2, label: '台本作成', icon: FileText, what: '最高に面白いストーリーの構築', how: '生成されたプロンプトをコピーして、おすすめのAIに渡してください。', result: '動画の構成と全セリフが手に入ります。' },
  { id: 3, label: 'キャラ設定', icon: Users, what: '登場人物の定義', how: 'AIが魅力的なキャラクター像を提案します。画像生成用の指示も作成されます。', result: 'キャラ設定とイラスト用プロンプトが手に入ります。' },
]

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎', desc: 'Google公式AI。大容量データの処理や最新情報の検索に特化。', color: 'border-sky-500/30' },
  { id: 'chatgpt', name: 'CHATGPT', url: 'https://chatgpt.com', icon: '🟢', desc: 'AI界のスタンダード。構造化データの作成や画像生成(DALL-E)に最適。', color: 'border-green-500/30' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠', desc: '日本語が最も自然。人間味のある台本作成や長文要約ならこれ。', color: 'border-orange-500/30' },
]

export function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null)
  const [compressProgress, setCompressProgress] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const extractAudio = async (file: File) => {
    setCompressProgress('🔄 音声を抽出中...')
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
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 3000)
  }

  const getStepPrompt = (step: number) => {
    const base = inputText || "(文字起こしデータ)"
    if (step === 2) return `以下の文字起こしを徹底分析し、YouTube動画の台本を作成してください：\n\n${base}`
    return ""
  }

  const currentInfo = STEPS[currentStep - 1]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">YouTube Producer</h1>
      </div>

      <div className="max-w-4xl mx-auto mb-16 bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-4 text-left">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-lg rounded-full">STEP 0{currentStep}</Badge>
            <h3 className="text-3xl font-black italic uppercase">{currentInfo.what}</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
        <div className="max-w-5xl mx-auto space-y-12">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-12 shadow-2xl overflow-hidden">
            
            {currentStep === 1 && (
              <div className="space-y-10">
                {!extractedAudioUrl ? (
                  <div className="space-y-8">
                    <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                    <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                      <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                      <p className="text-3xl font-black text-white">動画または音声を追加</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12 animate-in zoom-in duration-500">
                    <div className="text-center space-y-6">
                       <h3 className="text-3xl font-black text-blue-400 italic">1. 命令文をコピーしてAIを選択</h3>
                       <audio src={extractedAudioUrl} controls className="w-full h-20" />
                       <Button 
                         onClick={() => handleCopy("この音声を一字一句正確に文字起こしして。", 'step1')} 
                         className={`w-full h-28 font-black text-3xl rounded-[2rem] shadow-2xl transition-all ${copiedId === 'step1' ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100'}`}
                       >
                         {copiedId === 'step1' ? <><CheckCircle2 className="h-10 w-10" /> コピー完了！</> : "指示をコピー"}
                       </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {MAJOR_AI.map(ai => (
                        <a key={ai.id} href={ai.url} target="_blank" className={`p-8 rounded-[2.5rem] border-2 bg-slate-950 flex flex-col items-center text-center gap-4 hover:scale-105 transition-all shadow-xl ${ai.color}`}>
                          <span className="text-5xl">{ai.icon}</span>
                          <span className="font-black text-white text-xl uppercase">{ai.name}</span>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-bold">{ai.desc}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-6 pt-12 border-t border-slate-800">
                  <Label className="text-2xl font-black text-white flex items-center gap-4 italic uppercase"><MessageSquareText className="h-10 w-10 text-red-500" /> Result Input</Label>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AIが作成した文字起こし結果をここに貼り付けてください..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                  <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl shadow-red-600/40 mt-10 gap-4 uppercase italic">NEXT: SCRIPTING <ArrowRight className="h-12 w-12" /></Button>
                </div>
              </div>
            )}
            
            {/* Step 2+ logic... (same as above but with improved copy/AI selector) */}
            {currentStep > 1 && (
               <div className="space-y-12">
                  <div className="flex justify-between items-center"><h2 className="text-4xl font-black text-white uppercase italic">Step 0{currentStep}: {currentInfo.what}</h2></div>
                  <div className="bg-slate-950 p-12 rounded-[3rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto shadow-inner text-left">{getStepPrompt(currentStep)}</div>
                  <Button 
                    onClick={() => handleCopy(getStepPrompt(currentStep), `step${currentStep}`)} 
                    className={`w-full h-32 font-black text-4xl rounded-[2.5rem] shadow-2xl transition-all ${copiedId === `step${currentStep}` ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100'}`}
                  >
                    {copiedId === `step${currentStep}` ? <><CheckCircle2 className="h-12 w-12" /> コピー完了！</> : "プロンプトをコピー"}
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-800">
                    {MAJOR_AI.map(ai => (
                      <a key={ai.id} href={ai.url} target="_blank" className={`p-8 rounded-[2.5rem] border-2 bg-slate-950 flex flex-col items-center text-center gap-4 hover:scale-105 transition-all shadow-xl ${ai.color}`}>
                        <span className="text-5xl">{ai.icon}</span>
                        <span className="font-black text-white text-xl uppercase">{ai.name}</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-bold">{ai.desc}</p>
                      </a>
                    ))}
                  </div>
                  {currentStep < 6 && <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-24 bg-slate-800 hover:bg-slate-700 text-white font-black text-2xl rounded-[1.5rem] shadow-xl uppercase italic border-b-8 border-slate-950">NEXT STAGE <ArrowRight /></Button>}
               </div>
            )}

          </Card>
        </div>
      </div>

      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}
