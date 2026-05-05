'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ArrowRight, Video, FileText, Users, Image as ImageIcon, Music, Type, Download, Copy, ExternalLink, Info, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText, HelpCircle } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

type Step = 1 | 2 | 3 | 4 | 5 | 6
const STEPS = [
  { id: 1, label: '素材取り込み', icon: Video, guide: '動画や音声から「文字」を抽出する最初の工程です。' },
  { id: 2, label: '台本作成', icon: FileText, guide: '文字起こし結果を元に、プロ級の台本プロンプトを生成します。' },
  { id: 3, label: 'キャラ設定', icon: Users, guide: '動画に彩りを添えるキャラクターの外見や性格を定義します。' },
  { id: 4, label: 'サムネイル', icon: ImageIcon, guide: 'クリック率を最大化するサムネイルの構図案を作成します。' },
  { id: 5, label: 'タイトル/タグ', icon: Type, guide: 'YouTube SEOに最適化されたタイトルとタグを生成します。' },
  { id: 6, label: 'BGM作成', icon: Music, guide: '動画の雰囲気を決定づける音楽のAIプロンプトを作成します。' },
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
    setCompressProgress('🔄 音声データを抽出しています...');
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    ffmpeg.on('progress', ({ progress }) => setCompressProgress(`🎵 解析中... ${Math.round(progress * 100)}%`));
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'));
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3') as any;
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
    setCompressProgress(null);
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000);
  }

  const transcribePrompt = "この音声ファイルを一字一句漏らさず文字起こししてください。専門用語や固有名詞も文脈から推測して正しく記述してください。"

  const getStepPrompt = (step: number) => {
    const base = inputText || "(ここに文字起こしデータが入ります)"
    if (step === 2) return `以下の文字起こしを徹底的に分析し、視聴者の離脱を防ぐ最高に面白いYouTube台本（構成・セリフ・ト書き）を作成してください。:${base}`
    if (step === 3) return `この台本の文脈から、登場キャラクターの性格・役割・外見の設定案を作成してください。画像生成AI用の外見記述も含めてください。:${base}`
    return ""
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      {/* 🔴 HEADER & GLOBAL GUIDE */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="w-20 h-20 rounded-[2.5rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl shadow-red-600/30 border-4 border-white/10">
          <Clapperboard className="h-10 w-10 text-white" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">YouTube Producer</h1>
          <p className="text-xl text-slate-400 leading-relaxed font-bold">
            素材を入れるだけで、台本からBGMまで。<br/>
            指示に従うだけで、プロの動画制作フローが完結します。
          </p>
        </div>
      </div>

      {/* 🟢 STEP NAV WITH TOOLTIPS */}
      <div className="flex items-center justify-center max-w-5xl mx-auto overflow-x-auto pb-12 px-10 scrollbar-hide">
        <div className="flex items-center justify-between w-full min-w-[700px]">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none relative group">
              <div className={`flex flex-col items-center gap-3 transition-all ${currentStep === s.id ? 'opacity-100 scale-110' : currentStep > s.id ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${currentStep === s.id ? 'bg-red-600 border-red-400 text-white shadow-xl' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700'}`}>
                  {currentStep > s.id ? <CheckCircle2 className="h-7 w-7" /> : <s.icon className="h-7 w-7" />}
                </div>
                <span className="text-[11px] font-black uppercase whitespace-nowrap tracking-widest">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-4 rounded-full transition-all ${currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* --- STEP 1 --- */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex gap-6 items-center">
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg"><HelpCircle className="h-8 w-8 text-slate-950" /></div>
              <div>
                <h3 className="text-xl font-black text-white mb-1">Step 01: 何をすればいいですか？</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">お手元にある **動画ファイル** または **音声ファイル** をアップロードしてください。AIが扱いやすい「音声データ」として抜き出し、文字起こしの準備を整えます。</p>
              </div>
            </div>

            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
              <div className="space-y-8">
                {!extractedAudioUrl ? (
                  <div className="space-y-6">
                    <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                    <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-20 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                      <FileAudio className="h-20 w-20 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform" />
                      <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声をここに追加'}</p>
                    </div>
                    {compressProgress && <Badge className="bg-blue-600 animate-pulse px-8 py-4 text-xl rounded-2xl w-full flex justify-center shadow-xl">{compressProgress}</Badge>}
                  </div>
                ) : (
                  <div className="bg-slate-950 p-10 rounded-[2.5rem] border-2 border-blue-500/30 space-y-8 animate-in zoom-in duration-300 shadow-2xl">
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-blue-400">✅ 準備完了！外部AIに文字起こしを頼みましょう</h4>
                      <audio src={extractedAudioUrl} controls className="w-full h-16" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-slate-300 text-lg">指示をコピーして、おすすめAI（ChatGPTが最強です）に音声ファイルを渡してください。</p>
                      <Button onClick={() => handleCopy(transcribePrompt, 'trans')} className="w-full h-24 bg-white text-black font-black text-2xl rounded-3xl gap-4 shadow-xl hover:bg-slate-100 transition-transform active:scale-95">
                        <Copy className="h-10 w-10" /> {copied === 'trans' ? 'コピー完了！' : '文字起こし指示をコピー'}
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="https://chatgpt.com" target="_blank" className="relative h-28 bg-slate-900 border-2 border-green-500/50 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all">
                          <Badge className="absolute -top-3 bg-green-600 text-white font-black px-4 py-1">★ 精度No.1：おすすめ</Badge>
                          <span className="text-3xl">🟢</span><span className="font-black text-green-400 text-xl uppercase tracking-widest">ChatGPT</span>
                        </a>
                        <a href="https://gemini.google.com" target="_blank" className="h-28 bg-slate-900 border-2 border-sky-500/20 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all opacity-80">
                          <span className="text-3xl">🔵</span><span className="font-black text-sky-400 text-xl uppercase tracking-widest">Gemini</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6 pt-10 border-t border-slate-800">
                  <div className="flex items-center gap-3"><MessageSquareText className="h-8 w-8 text-red-500" /><Label className="text-2xl font-black text-white text-left">文字起こし結果を貼り付け</Label></div>
                  <p className="text-slate-500 text-lg">AIが書き出したテキストを、下の枠にコピペしてください。</p>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="ここにテキストを貼り付けてください..." className="w-full h-96 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                </div>

                <Button onClick={() => setCurrentStep(2)} disabled={!inputText.trim()} className="w-full h-32 bg-red-600 hover:bg-red-500 text-white font-black text-4xl rounded-[3rem] shadow-2xl shadow-red-600/40 transition-transform active:scale-95 flex items-center justify-center gap-4">
                  STEP ② 台本作成を開始する <ArrowRight className="h-12 w-12" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* --- STEP 2+ --- */}
        {currentStep > 1 && (
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex gap-6 items-center shadow-xl">
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg"><HelpCircle className="h-8 w-8 text-slate-950" /></div>
              <div>
                <h3 className="text-xl font-black text-white mb-1">Step 0{currentStep}: {STEPS[currentStep-1].label} の手順</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">{STEPS[currentStep-1].guide}</p>
              </div>
            </div>

            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter font-mono">{STEPS[currentStep-1].label} PROMPT</h2>
                <Button variant="ghost" onClick={() => setCurrentStep((currentStep - 1) as any)} className="text-slate-500 text-xl font-bold">← 戻る</Button>
              </div>
              
              <div className="bg-slate-950 p-10 rounded-[2.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-12 max-h-[500px] overflow-y-auto whitespace-pre-wrap shadow-inner">
                {getStepPrompt(currentStep)}
              </div>

              <div className="space-y-10">
                <Button onClick={() => handleCopy(getStepPrompt(currentStep), `step-${currentStep}`)} className="w-full h-28 bg-white text-black font-black text-3xl rounded-[2rem] gap-4 shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                  <Copy className="h-12 w-12" /> {copied === `step-${currentStep}` ? "コピー成功！AIに貼り付けてください" : "最強プロンプトをコピー"}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <a href="https://claude.ai" target="_blank" className={`relative h-32 rounded-[2rem] border-2 bg-slate-950 flex flex-col items-center justify-center hover:scale-105 transition-all ${currentStep === 2 ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/5 opacity-70'}`}>
                      {currentStep === 2 && <Badge className="absolute -top-4 bg-orange-600 text-white font-black px-6 py-2 text-base shadow-xl">★ おすすめ：自然な日本語台本</Badge>}
                      <span className="text-4xl mb-1">🟠</span><span className="font-black text-orange-400 text-2xl uppercase tracking-widest">Claude</span>
                   </a>
                   <a href="https://chatgpt.com" target="_blank" className={`relative h-32 rounded-[2rem] border-2 bg-slate-950 flex flex-col items-center justify-center hover:scale-105 transition-all ${currentStep !== 2 ? 'border-green-500' : 'border-white/5 opacity-70'}`}>
                      {currentStep !== 2 && <Badge className="absolute -top-4 bg-green-600 text-white font-black px-6 py-2 text-base shadow-xl">★ おすすめ：高品質生成</Badge>}
                      <span className="text-4xl mb-1">🟢</span><span className="font-black text-green-400 text-2xl uppercase tracking-widest">ChatGPT</span>
                   </a>
                </div>

                {currentStep < 6 && (
                  <div className="pt-10 border-t border-slate-800">
                    <p className="text-slate-500 text-center mb-6 font-bold uppercase tracking-widest">AIの作業が終わったら...</p>
                    <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-24 bg-slate-800 hover:bg-slate-700 text-white font-black text-2xl rounded-3xl shadow-xl gap-4 border-b-8 border-slate-950">
                      STEP 0{currentStep + 1} へ進む <ArrowRight />
                    </Button>
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
