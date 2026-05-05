'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ArrowRight, Video, FileText, Users, Image as ImageIcon, Music, Type, Download, Copy, ExternalLink, Info, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText, HelpCircle, Globe, BrainCircuit, Zap } from 'lucide-react'


type Step = 1 | 2 | 3 | 4 | 5 | 6
const STEPS = [
  { id: 1, label: '邏譚仙叙繧願ｾｼ縺ｿ', what: '蜍慕判繝ｻ髻ｳ螢ｰ縺ｮ隗｣譫先ｺ門ｙ', how: '縺頑戟縺｡縺ｮ蜍慕判繧・浹螢ｰ繝輔ぃ繧､繝ｫ繧偵い繝・・繝ｭ繝ｼ繝峨＠縺ｦ縺上□縺輔＞縲・I縺瑚ｪｭ縺ｿ蜿悶ｌ繧九ｈ縺・↓髻ｳ螢ｰ繧定・蜍輔〒謚懊″蜃ｺ縺励∪縺吶・, result: '譁・ｭ苓ｵｷ縺薙＠逕ｨ縺ｮ髻ｳ螢ｰ繝・・繧ｿ縺檎函謌舌＆繧後∪縺吶・ },
  { id: 2, label: '蜿ｰ譛ｬ菴懈・', what: '譛鬮倥↓髱｢逋ｽ縺・せ繝医・繝ｪ繝ｼ縺ｮ讒狗ｯ・, how: '逕滓・縺輔ｌ縺溘・繝ｭ繝ｳ繝励ヨ繧偵さ繝斐・縺励※縲，laude・医♀縺吶☆繧・ｼ峨↓貂｡縺励※縺上□縺輔＞縲・, result: '蜍慕判縺ｮ讒区・縺ｨ蜈ｨ繧ｻ繝ｪ繝輔′謇九↓蜈･繧翫∪縺吶・ },
]

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '虫', desc: '螟ｧ螳ｹ驥上ョ繝ｼ繧ｿ縺ｮ蜃ｦ逅・ｄ譛譁ｰ諠・ｱ縺ｮ讀懃ｴ｢縺ｫ縲・, billing: '螳悟・辟｡譁・ },
  { id: 'chatgpt', name: 'CHATGPT', url: 'https://chatgpt.com', icon: '泙', desc: '荳・・縺ｪ邇矩％AI縲よｭ｣遒ｺ縺ｪ繝・・繧ｿ讒矩蛹悶ｄ逕ｻ蜒冗函謌舌↓縲・, billing: '蝓ｺ譛ｬ辟｡譁・ },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '泛', desc: '譌･譛ｬ隱槭′譛繧り・辟ｶ縲ゆｺｺ髢灘袖縺ｮ縺ゅｋ蜿ｰ譛ｬ菴懈・縺ｪ繧峨％繧後・, billing: '蝓ｺ譛ｬ辟｡譁・ },
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
    setCompressProgress('売 髻ｳ螢ｰ繧呈歓蜃ｺ荳ｭ...')
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
    navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 3000)
  }

  // 屏・・縲先眠繝ｫ繝ｼ繝ｫ驕ｩ逕ｨ縲第怙蠑ｷ縺ｮ譁・ｭ苓ｵｷ縺薙＠繝励Ο繝ｳ繝励ヨ
  const transcribePrompt = "繧ｹ繝励Ξ繝・ラ繧ｷ繝ｼ繝亥ｽ｢蠑丈ｸ崎ｦ√∬ｩｳ邏ｰ縺ｫ貍上ｌ縺ｮ縺ｪ縺・ｈ縺・↓謚懊″蜃ｺ縺励※荳九＆縺・ゅ％縺ｮ髻ｳ螢ｰ繧剃ｸ蟄嶺ｸ蜿･豁｣遒ｺ縺ｫ譁・ｭ苓ｵｷ縺薙＠縺励※荳九＆縺・・

  const getStepPrompt = (step: number) => {
    const base = inputText || "(譁・ｭ苓ｵｷ縺薙＠繝・・繧ｿ)"
    if (step === 2) return `莉･荳九・譁・ｭ苓ｵｷ縺薙＠繧貞ｾｹ蠎募・譫舌＠縲〆ouTube蜍慕判縺ｮ蜿ｰ譛ｬ繧剃ｽ懈・縺励※縺上□縺輔＞・喀n\n${base}`
    return ""
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200">
      
      {/* 閥 HEADER & GUIDE */}
      <div className="text-center space-y-6">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase">YouTube Producer</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <Badge className="bg-white text-indigo-600 font-black px-6 py-2">STEP 0{currentStep}</Badge>
          <h3 className="text-3xl font-black italic uppercase">{STEPS[currentStep-1].what}</h3>
          <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-95">{STEPS[currentStep-1].how}</p>
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-12 shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {currentStep === 1 && (
            <div className="space-y-12">
              {!extractedAudioUrl ? (
                <div className="space-y-8">
                  <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                  <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                    <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                    <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '蜍慕判縺ｾ縺溘・髻ｳ螢ｰ繧偵％縺薙↓霑ｽ蜉'}</p>
                  </div>
                  {compressProgress && <Badge className="bg-blue-600 animate-pulse px-10 py-4 text-xl rounded-2xl w-full flex justify-center">{compressProgress}</Badge>}
                </div>
              ) : (
                <div className="space-y-12 animate-in zoom-in duration-500">
                  <div className="text-center space-y-8">
                     <h3 className="text-3xl font-black text-blue-400 italic uppercase">1. Copy Command & Download</h3>
                     <audio src={extractedAudioUrl} controls className="w-full h-20 shadow-inner" />
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 屏・・縲仙ｮ悟・蠕ｩ蜈・代ム繧ｦ繝ｳ繝ｭ繝ｼ繝峨・繧ｿ繝ｳ繧貞ｾｩ豢ｻ */}
                        <a href={extractedAudioUrl} download="nextra-audio.mp3" className="w-full h-28 bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-transform active:scale-95">
                           <Download className="h-10 w-10" /> 髻ｳ螢ｰ繧剃ｿ晏ｭ・                        </a>
                        <Button 
                          onClick={() => handleCopy(transcribePrompt, 'step1')} 
                          className={`w-full h-28 font-black text-3xl rounded-[2rem] shadow-2xl transition-all ${copiedId === 'step1' ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100'}`}
                        >
                          {copiedId === 'step1' ? <><CheckCircle2 className="h-10 w-10" /> 繧ｳ繝斐・螳御ｺ・ｼ・/> : "謖・､ｺ繧偵さ繝斐・"}
                        </Button>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                    {MAJOR_AI.map(ai => (
                      <a key={ai.id} href={ai.url} target="_blank" className="p-8 rounded-[2.5rem] border-2 border-white/5 bg-slate-950 flex flex-col items-center text-center gap-4 hover:scale-105 transition-all shadow-xl">
                        <span className="text-5xl">{ai.icon}</span>
                        <span className="font-black text-white text-xl uppercase">{ai.name}</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold">{ai.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-6 pt-12 border-t border-slate-800 text-center">
                <div className="flex items-center justify-center gap-4 text-white font-black text-4xl italic uppercase"><MessageSquareText className="h-12 w-12 text-red-500" /> Result Paste</div>
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AI縺九ｉ霑斐▲縺ｦ縺阪◆縲梧ｼ上ｌ縺ｮ縺ｪ縺・枚蟄苓ｵｷ縺薙＠縲阪ｒ縺薙％縺ｫ雋ｼ繧贋ｻ倥￠..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white" />
                <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl mt-10 gap-4 uppercase italic">NEXT: SCRIPTING <ArrowRight className="h-12 w-12" /></Button>
              </div>
            </div>
          )}

          {currentStep > 1 && (
             <div className="space-y-12">
                <div className="flex justify-between items-center"><h2 className="text-4xl font-black text-white uppercase italic">Step 0{currentStep}: {STEPS[currentStep-1].label}</h2></div>
                <div className="bg-slate-950 p-12 rounded-[3rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-10 max-h-[600px] overflow-y-auto shadow-inner text-left">{getStepPrompt(currentStep)}</div>
                <Button onClick={() => handleCopy(getStepPrompt(currentStep), `step${currentStep}`)} className={`w-full h-32 font-black text-4xl rounded-[2.5rem] shadow-2xl transition-all ${copiedId === `step${currentStep}` ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100'}`}>
                  {copiedId === `step${currentStep}` ? <><CheckCircle2 className="h-12 w-12" /> 繧ｳ繝斐・螳御ｺ・ｼ・/> : "繝励Ο繝ｳ繝励ヨ繧偵さ繝斐・"}
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                  {MAJOR_AI.map(ai => (
                    <a key={ai.id} href={ai.url} target="_blank" className="p-8 rounded-[2.5rem] border-2 border-white/5 bg-slate-950 flex flex-col items-center text-center gap-4 hover:scale-105 transition-all shadow-xl">
                      <span className="text-5xl">{ai.icon}</span>
                      <span className="font-black text-white text-xl uppercase">{ai.name}</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-bold">{ai.desc}</p>
                    </a>
                  ))}
                </div>
             </div>
          )}
        </Card>
      </div>

      
    </div>
  )
}

