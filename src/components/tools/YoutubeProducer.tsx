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
  { id: 1, label: '邏譚仙叙繧願ｾｼ縺ｿ', what: '蜍慕判繝ｻ髻ｳ螢ｰ縺ｮ隗｣譫先ｺ門ｙ', how: '縺頑戟縺｡縺ｮ蜍慕判繧・浹螢ｰ繝輔ぃ繧､繝ｫ繧偵い繝・・繝ｭ繝ｼ繝峨＠縺ｦ縺上□縺輔＞縲・I縺瑚ｪｭ縺ｿ蜿悶ｌ繧九ｈ縺・↓髻ｳ螢ｰ繧定・蜍輔〒謚懊″蜃ｺ縺励∪縺吶・, result: '譁・ｭ苓ｵｷ縺薙＠逕ｨ縺ｮ髻ｳ螢ｰ繝・・繧ｿ縺檎函謌舌＆繧後∪縺吶・ },
  { id: 2, label: '蜿ｰ譛ｬ菴懈・', what: '繧ｹ繝医・繝ｪ繝ｼ讒狗ｯ・, how: '逕滓・縺輔ｌ縺溘・繝ｭ繝ｳ繝励ヨ繧偵さ繝斐・縺励※縲，laude・医♀縺吶☆繧・ｼ峨↓貂｡縺励※縺上□縺輔＞縲・, result: '蜍慕判縺ｮ讒区・縺ｨ蜈ｨ繧ｻ繝ｪ繝輔′謇九↓蜈･繧翫∪縺吶・ },
]

const MAJOR_AI = [
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', icon: '虫', desc: '螟ｧ螳ｹ驥上・讀懃ｴ｢騾｣蜍・, billing: '螳悟・辟｡譁・ },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', icon: '泙', desc: '荳・・繝ｻ逕ｻ蜒冗函謌・, billing: '蝓ｺ譛ｬ辟｡譁・ },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai', icon: '泛', desc: '譌･譛ｬ隱槭・蜿ｰ譛ｬ譛蠑ｷ', billing: '蝓ｺ譛ｬ辟｡譁・, isBestForScript: true },
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
    setCompressProgress('売 謚ｽ蜃ｺ荳ｭ...');
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
    navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans pb-10">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center mx-auto shadow-xl"><Clapperboard className="h-10 w-10 text-white" /></div>
        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase">YouTube Producer</h1>
      </div>

      {/* STEP CONTENT (Simplified for visibility) */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 shadow-2xl max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="space-y-8">
              <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
              {!extractedAudioUrl ? (
                <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center hover:bg-slate-800/30 cursor-pointer group">
                  <FileAudio className="h-16 w-16 mx-auto mb-4 text-red-500 group-hover:scale-110 transition-all" />
                  <p className="text-2xl font-black text-white">蜍慕判縺ｾ縺溘・髻ｳ螢ｰ繧定ｿｽ蜉</p>
                </div>
              ) : (
                <div className="bg-slate-950 p-8 rounded-3xl border-2 border-blue-500/30 space-y-6">
                  <audio src={extractedAudioUrl} controls className="w-full h-14" />
                  <div className="grid grid-cols-2 gap-4">
                    <a href={extractedAudioUrl} download="audio.mp3" className="bg-blue-600 text-white rounded-2xl py-4 text-center font-bold">髻ｳ螢ｰ繧剃ｿ晏ｭ・/a>
                    <Button onClick={() => handleCopy("譁・ｭ苓ｵｷ縺薙＠縺励※", "t")} className="bg-white text-black rounded-2xl py-4 font-bold">謖・､ｺ繧偵さ繝斐・</Button>
                  </div>
                </div>
              )}
              <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="譁・ｭ苓ｵｷ縺薙＠邨先棡繧定ｲｼ繧贋ｻ倥￠..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-xl focus:border-red-600 text-white shadow-inner" />
              <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-24 bg-red-600 text-white font-black text-2xl rounded-[2rem] shadow-xl">蜿ｰ譛ｬ菴懈・縺ｸ騾ｲ繧 <ArrowRight className="ml-2 h-6 w-6" /></Button>
            </div>
          )}
          {currentStep > 1 && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold">蟾･遞矩ｲ陦御ｸｭ...</h2>
              <Button onClick={() => setCurrentStep(1)} variant="ghost" className="mt-4">譛蛻昴↓謌ｻ繧・/Button>
            </div>
          )}
        </Card>
      </div>

      {/* 屏・・縺薙％縺檎ｩｺ逋ｽ縺ｮ蜴溷屏縺縺｣縺溽ｮ・園: mt-8繧知t-8縺ｫ菫ｮ豁｣ */}
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-red-600/5 border border-red-600/10 rounded-[2.5rem] flex gap-6 items-start">
        <div className="bg-red-600/20 p-4 rounded-2xl text-red-500 flex-shrink-0"><Info className="h-8 w-8" /></div>
        <div>
          <h4 className="text-xl font-bold text-white mb-2 italic">Pro Guide</h4>
          <p className="text-slate-400 text-sm leading-relaxed">螟夜ΚAI縺ｨNextraLabs繧堤ｵ・∩蜷医ｏ縺帙ｋ縺薙→縺ｧ縲∵怙鬮伜刀雉ｪ縺ｮ蜍慕判繧呈怙螳峨さ繧ｹ繝医〒蛻ｶ菴懊〒縺阪∪縺吶・/p>
        </div>
      </div>
    </div>
  )
}


