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
  { id: 1, label: '素材取り込み', icon: Video, what: '動画・音声の解析準備', how: 'お持ちの素材をアップロードしてください。AIが読み取れるように音声を自動で抜き出します。', result: '文字起こし用の音声データが生成されます。' },
  { id: 2, label: '台本作成', icon: FileText, what: '魂を揺さぶるストーリー構築', how: '生成された「最強のプロンプト」をコピーして、Claude（おすすめ）に渡してください。', result: 'プロの放送作家級の「神台本」が手に入ります。' },
  { id: 3, label: 'キャラ設定', icon: Users, what: '魅力的なキャラクター定義', how: '台本から、視聴者に愛されるキャラクター像をAIが提案します。', result: 'キャラ設定と、イラスト用の詳細プロンプトが手に入ります。' },
  { id: 4, label: 'サムネイル', icon: ImageIcon, what: 'クリック率最大化のデザイン', how: 'AIを使って、思わずクリックしたくなるサムネイルを生成します。', result: 'インパクトのあるサムネイル構図が手に入ります。' },
  { id: 5, label: 'タイトル/タグ', icon: Type, what: 'YouTube SEO・検索最適化', how: 'Googleの検索エンジンに最適化したタイトルを生成します。', result: '検索に強いタイトルとタグが手に入ります。' },
  { id: 6, label: 'BGM作成', icon: Music, what: '感情を揺さぶる音の魔法', how: '動画の雰囲気にマッチするBGMプロンプトを作成します。', result: 'あなたの動画専用のオリジナルBGMが完成します。' },
]

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎', desc: '大容量・検索連動に。', billing: '完全無料' },
  { id: 'chatgpt', name: 'CHATGPT', url: 'https://chatgpt.com', icon: '🟢', desc: '万能・正確な構造化。', billing: '基本無料' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠', desc: '日本語・台本作成に。', billing: '基本無料', isBestForScript: true },
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
    await ffmpeg.load({ coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'), wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm') });
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'))
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3'])
    const data = await ffmpeg.readFile('output.mp3') as any
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })))
    setCompressProgress(null)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 3000)
  }

  const getStepPrompt = (step: number) => {
    const base = inputText || "(文字起こしデータ)"
    if (step === 2) return `以下の文字起こしを徹底分析し、YouTube動画の構成と台本を作成してください：\n\n${base}`
    if (step === 3) return `この物語に命を吹き込む、魅力的なキャラクターの設定案を作成してください。:${base}`
    return ""
  }

  const currentInfo = STEPS[currentStep - 1]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans pb-10">
      
      {/* 🔴 HEADER */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">YouTube Producer</h1>
      </div>

      {/* 🟢 STEP PROGRESS BAR - RESTORED FOR ORIENTATION */}
      <div className="flex items-center justify-center max-w-6xl mx-auto overflow-x-auto pb-10 px-10">
        <div className="flex items-center justify-between w-full min-w-[800px]">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex flex-col items-center gap-4 transition-all ${currentStep === s.id ? 'opacity-100 scale-125' : currentStep > s.id ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${currentStep === s.id ? 'bg-red-600 border-red-400 text-white shadow-xl' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700'}`}>
                  {currentStep > s.id ? <CheckCircle2 className="h-8 w-8" /> : <s.icon className="h-8 w-8" />}
                </div>
                <span className="text-[11px] font-black uppercase whitespace-nowrap tracking-widest">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-4 rounded-full transition-all ${currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* 💡 INTUITIVE GUIDE PANEL */}
      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-6 text-left">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-2xl shadow-xl">STEP 0{currentStep}</Badge>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">{currentInfo.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
          <div className="bg-black/20 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
             <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg"><Zap className="h-8 w-8 text-slate-950 fill-current" /></div>
             <div>
               <p className="text-emerald-300 font-black text-xl italic uppercase tracking-widest leading-none mb-1">Expected Success:</p>
               <p className="text-white font-bold text-lg">{currentInfo.result}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-12 shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {currentStep === 1 ? (
             <div className="space-y-12 text-center">
                <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 hover:bg-slate-800/30 cursor-pointer group transition-all">
                  <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                  <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声をここに追加'}</p>
                </div>
                <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl shadow-red-600/40 gap-4 uppercase italic">NEXT STAGE <ArrowRight className="h-12 w-12" /></Button>
             </div>
          ) : (
             <div className="space-y-12">
                <div className="space-y-6">
                   <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center gap-3">1. Copy NextraLabs optimized prompt</Label>
                   <div className="bg-slate-950 p-10 rounded-[2.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-10 max-h-[500px] overflow-y-auto shadow-inner text-left">
                      {getStepPrompt(currentStep)}
                   </div>
                   <Button onClick={() => handleCopy(getStepPrompt(currentStep), `s${currentStep}`)} className={`w-full h-32 font-black text-4xl rounded-[2.5rem] shadow-2xl transition-all ${copiedId === `s${currentStep}` ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100'}`}>
                      {copiedId === `s${currentStep}` ? <><CheckCircle2 className="h-10 w-10" /> コピー完了！</> : "プロンプトをコピー"}
                   </Button>
                </div>

                <div className="space-y-8 pt-12 border-t border-slate-800">
                  <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-2 italic"><Globe className="h-5 w-5" /> 2. Choose Global AI (Order: GEMINI ➔ GPT ➔ CLAUDE)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {MAJOR_AI.map(ai => (
                      <a key={ai.id} href={ai.url} target="_blank" className={`p-8 rounded-[3rem] border-2 bg-slate-950 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl ${
                        currentStep === 2 && ai.isBestForScript ? 'border-orange-500 ring-4 ring-orange-500/10 scale-105 z-10' : 'border-white/5 opacity-80'
                      }`}>
                        <span className="text-6xl">{ai.icon}</span>
                        <div className="text-center">
                          <span className="font-black text-white text-3xl uppercase block mb-1">{ai.name}</span>
                          <span className="text-slate-500 text-[10px] font-bold uppercase">{ai.desc}</span>
                        </div>
                        {currentStep === 2 && ai.isBestForScript && <Badge className="bg-orange-600 text-white font-black px-6 py-2 text-sm uppercase shadow-lg border-0">Recommended</Badge>}
                      </a>
                    ))}
                  </div>
                </div>

                {currentStep < 6 && (
                  <div className="pt-16">
                    <p className="text-slate-500 text-center mb-8 font-black uppercase tracking-widest text-sm italic">AIによる生成が終わったら...</p>
                    <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-32 bg-slate-800 hover:bg-slate-700 text-white font-black text-4xl rounded-[2.5rem] shadow-xl uppercase italic border-b-8 border-slate-950">
                      GO TO STEP 0{currentStep + 1} <ArrowRight className="h-12 w-12 ml-4" />
                    </Button>
                  </div>
                )}
             </div>
          )}
        </Card>
      </div>

      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}
