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

const FAMOUS_AI = [
  { id: 'claude', name: 'Claude', url: 'https://claude.ai', icon: '🟠', desc: '文章・台本が得意', billing: '基本無料（1日5〜10回程度）', isBestForScript: true },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', icon: '🟢', desc: '万能・画像生成に強い', billing: '基本無料（制限なし/上位版は制限有）', isBestForImage: true },
  { id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai', icon: '⚪', desc: '最新情報の調査に最強', billing: '基本無料（回数制限あり）' },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', icon: '💎', desc: 'Google連動・大容量', billing: '基本無料（大容量データ向き）', isBestForSEO: true },
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
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'))
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3'])
    const data = await ffmpeg.readFile('output.mp3') as any
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
    setCompressProgress(null);
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000);
  }

  const transcribePrompt = "以下の音声を文字起こししてください。専門用語や固有名詞も正確に記述してください。"

  const getStepPrompt = (step: number) => {
    const base = inputText || "(文字起こしデータ)"
    if (step === 2) return `以下の文字起こしを徹底分析し、YouTube動画の構成と詳細な台本を作成してください：\n\n${base}`
    if (step === 3) return `この動画に登場するキャラ設定案を作成してください：\n\n${base}`
    return ""
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">YouTube Producer</h1>
      </div>

      {/* 🟢 STEP NAV */}
      <div className="flex items-center justify-between max-w-5xl mx-auto overflow-x-auto pb-4 px-4 scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-3 transition-all ${currentStep === s.id ? 'opacity-100 scale-125' : currentStep > s.id ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${currentStep === s.id ? 'bg-red-600 border-red-400 text-white shadow-xl' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700'}`}>
                {currentStep > s.id ? <CheckCircle2 className="h-8 w-8" /> : <s.icon className="h-8 w-8" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-4 rounded-full ${currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* --- STEP 1: MEDIA --- */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
              <div className="space-y-12">
                {!extractedAudioUrl ? (
                  <div className="space-y-8">
                    <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                    <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                      <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform" />
                      <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声を追加'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-12 rounded-[3rem] border-2 border-blue-500/30 space-y-10 animate-in zoom-in duration-500 shadow-2xl">
                    <div className="space-y-6 border-b border-white/5 pb-8 text-center">
                       <h3 className="text-2xl font-black text-blue-400 uppercase italic tracking-widest">Audio Extraction Success</h3>
                       <audio src={extractedAudioUrl} controls className="w-full h-16" />
                    </div>
                    
                    {/* 🚀 AI WORKFLOW GUIDE (VERY USER FRIENDLY) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <Label className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center gap-2"><Zap className="h-4 w-4" /> Step 1: Copy Command</Label>
                          <p className="text-slate-400 text-sm font-bold">下のボタンを押して、AIへの「命令文」をコピーします。</p>
                          <Button onClick={() => handleCopy(transcribePrompt, 'tr')} className="w-full h-24 bg-white text-black font-black text-2xl rounded-3xl gap-4 shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                             <Copy className="h-8 w-8" /> 指示をコピー
                          </Button>
                       </div>
                       <div className="space-y-6">
                          <Label className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center gap-2"><Globe className="h-4 w-4" /> Step 2: Paste to AI</Label>
                          <p className="text-slate-400 text-sm font-bold">好きなAIを開き、命令文と抽出ファイルを渡してください。</p>
                          <div className="grid grid-cols-2 gap-4">
                            {FAMOUS_AI.slice(0, 2).map(ai => (
                              <a key={ai.id} href={ai.url} target="_blank" className="h-24 bg-slate-900 border border-white/10 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-800 transition-all group">
                                <span className="text-3xl mb-1">{ai.icon}</span>
                                <span className="font-black text-white text-xs uppercase">{ai.name}</span>
                                <span className="text-[9px] text-slate-500 mt-1">{ai.billing}</span>
                              </a>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
                <div className="space-y-6 pt-12 border-t border-slate-800">
                  <div className="flex items-center gap-3 text-white font-black text-3xl italic uppercase"><MessageSquareText className="h-10 w-10 text-red-500" /> Result Input</div>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed">AIから返ってきたテキストを下の枠に貼り付けて、次へ進んでください。費用は一切かかりません。</p>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="ここに文字起こし結果を貼り付け..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                  <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl shadow-red-600/40 mt-6 gap-4 uppercase italic">NEXT: SCRIPTING <ArrowRight className="h-12 w-12" /></Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* --- STEP 2+: SCRIPTING & BEYOND --- */}
        {currentStep > 1 && (
          <div className="max-w-6xl mx-auto space-y-12">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Step 0{currentStep}: {STEPS[currentStep-1].label}</h2>
                <Button variant="ghost" onClick={() => setCurrentStep((currentStep - 1) as any)} className="text-slate-500 text-xl font-bold">← 戻る</Button>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-6">
                   <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.3em] flex items-center gap-2"><Zap className="h-5 w-5" /> STEP 1: Copy The High-Quality Prompt</Label>
                   <div className="bg-slate-950 p-12 rounded-[3rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-6 max-h-[600px] overflow-y-auto shadow-inner">
                      {getStepPrompt(currentStep)}
                   </div>
                   <Button onClick={() => handleCopy(getStepPrompt(currentStep), "p")} className="w-full h-32 bg-white text-black font-black text-4xl rounded-[2.5rem] gap-6 shadow-2xl hover:scale-[1.02] transition-all active:scale-95">
                      <Copy className="h-12 w-12" /> プロンプトをコピー
                   </Button>
                </div>

                <div className="space-y-8 pt-8 border-t border-slate-800">
                  <div className="space-y-2">
                    <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.3em] flex items-center gap-2"><Globe className="h-5 w-5" /> STEP 2: Choose Best AI (FREE Tier)</Label>
                    <p className="text-slate-500 text-lg font-bold">コピーした指示を、以下の好きなAIに貼り付けるだけで完了。どれも基本無料で使えます。</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FAMOUS_AI.map(ai => (
                      <a key={ai.id} href={ai.url} target="_blank" className={`p-8 rounded-[2.5rem] border-2 bg-slate-950 flex items-center justify-between hover:scale-[1.02] transition-all shadow-xl ${
                        (currentStep === 2 && ai.isBestForScript) || (currentStep === 4 && ai.isBestForImage) ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-white/5 opacity-80'
                      }`}>
                        <div className="flex items-center gap-6">
                          <span className="text-5xl">{ai.icon}</span>
                          <div>
                            <span className="font-black text-white text-2xl uppercase tracking-tighter block">{ai.name}</span>
                            <span className="text-slate-400 text-sm font-bold italic">{ai.desc}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {(currentStep === 2 && ai.isBestForScript) || (currentStep === 4 && ai.isBestForImage) ? <Badge className="bg-amber-500 text-black font-black px-5 py-2 text-sm uppercase">Recommended</Badge> : null}
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{ai.billing}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-28 bg-slate-800 hover:bg-slate-700 text-white font-black text-2xl rounded-3xl shadow-xl border-b-8 border-slate-950 uppercase italic">
                  Complete Task: Move to Next Stage <ArrowRight />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}
