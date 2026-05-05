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
  { id: 1, label: '素材取り込み', what: '動画・音声の解析準備', how: 'お持ちの素材をアップロードしてください。AIが読み取れるように音声を自動で抜き出します。', result: '文字起こし用の音声データが生成されます。' },
  { id: 2, label: '台本作成', what: '最高に面白いストーリーの構築', how: '生成された「最強のプロンプト」をコピーして、Claude（おすすめ）に渡してください。', result: 'プロの放送作家級の「神台本」が手に入ります。' },
]

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎', desc: '大容量・検索連動に。', billing: '完全無料' },
  { id: 'chatgpt', name: 'CHATGPT', url: 'https://chatgpt.com', icon: '🟢', desc: '万能・正確な構造化。', billing: '基本無料' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠', desc: '日本語・台本作成に。', billing: '基本無料', isBestForScript: true },
]

export default function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null)
  const [compressProgress, setCompressProgress] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const extractAudio = async (file: File) => {
    setCompressProgress('🔄 音声を抽出中...');
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({ coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'), wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm') });
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'));
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3') as any;
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
    setCompressProgress(null);
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 3000)
  }

  const getStepPrompt = (step: number) => {
    const base = inputText || "(文字起こしデータ)"
    if (step === 2) return `以下の文字起こしを徹底分析し、YouTube動画の構成と台本を作成してください：\n\n${base}`
    return ""
  }

  const currentInfo = STEPS[currentStep - 1]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200">
      
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">YouTube Producer</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-6">
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
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {currentStep === 1 ? (
             <div className="space-y-12 text-center">
                <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                  <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                  <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声を追加'}</p>
                </div>
                {extractedAudioUrl && (
                  <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-blue-500/30 space-y-10 animate-in zoom-in duration-500">
                    <h3 className="text-3xl font-black text-blue-400 italic uppercase tracking-tighter text-center">Extraction Completed</h3>
                    <audio src={extractedAudioUrl} controls className="w-full h-20 shadow-inner" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a href={extractedAudioUrl} download="nextra-audio.mp3" className="w-full h-28 bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-transform active:scale-95">
                           <Download className="h-10 w-10" /> 音声を保存
                        </a>
                        <Button 
                          onClick={() => handleCopy("スプレッドシート形式不要、詳細に漏れのないように抜き出して下さい。この音声を一字一句正確に文字起こしして下さい。", 'step1')} 
                          className={`w-full h-28 font-black text-3xl rounded-[2rem] shadow-2xl transition-all ${copiedId === 'step1' ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100'}`}
                        >
                          {copiedId === 'step1' ? <><CheckCircle2 className="h-10 w-10" /> コピー完了！</> : "指示をコピー"}
                        </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-6 pt-12 border-t border-slate-800">
                  <div className="flex items-center justify-center gap-4 text-white font-black text-4xl italic uppercase"><MessageSquareText className="h-12 w-12 text-red-500" /> Result Paste</div>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AIの結果を貼り付けてください..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                  <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl mt-10 gap-4 uppercase italic">NEXT STAGE <ArrowRight className="h-12 w-12" /></Button>
                </div>
             </div>
          ) : (
             <div className="space-y-12">
                <h2 className="text-4xl font-black text-white uppercase italic">Step 0{currentStep}: {currentInfo.what}</h2>
                <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-12 max-h-[600px] overflow-y-auto shadow-inner text-left">{getStepPrompt(currentStep)}</div>
                <Button onClick={() => handleCopy(getStepPrompt(currentStep), `s${currentStep}`)} className={`w-full h-32 font-black text-4xl rounded-[2.5rem] shadow-2xl transition-all ${copiedId === `s${currentStep}` ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100'}`}>
                   {copiedId === `s${currentStep}` ? <><CheckCircle2 className="h-10 w-10" /> コピー完了！</> : "プロンプトをコピー"}
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-800">
                  {MAJOR_AI.map(ai => (
                    <a key={ai.id} href={ai.url} target="_blank" className={`p-8 rounded-[3rem] border-2 bg-slate-950 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl ${
                      currentStep === 2 && ai.isBestForScript ? 'border-orange-500 ring-4 ring-orange-500/10 scale-105' : 'border-white/5 opacity-80'
                    }`}>
                      <span className="text-6xl">{ai.icon}</span>
                      <span className="font-black text-white text-3xl uppercase block mb-1">{ai.name}</span>
                      <p className="text-slate-500 text-[10px] font-bold uppercase">{ai.desc}</p>
                    </a>
                  ))}
                </div>
             </div>
          )}
        </Card>
      </div>

      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}
