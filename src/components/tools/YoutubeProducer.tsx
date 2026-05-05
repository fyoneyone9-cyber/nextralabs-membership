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
  { 
    id: 1, 
    label: '素材取り込み', 
    icon: Video, 
    what: '動画・音声の解析準備',
    how: 'お持ちの動画や音声ファイルをアップロードしてください。AIが読み取れるように音声を自動で抜き出します。',
    result: '文字起こし用の音声データが生成されます。'
  },
  { 
    id: 2, 
    label: '台本作成', 
    icon: FileText, 
    what: '最高に面白いストーリーの構築',
    how: '生成された最強プロンプトをコピーして、Claude（おすすめ）に渡してください。視聴者を惹きつける台本が完成します。',
    result: '動画の構成と全セリフが手に入ります。'
  },
  { 
    id: 3, 
    label: 'キャラ設定', 
    icon: Users, 
    what: '登場人物のビジュアル・性格定義',
    how: '台本の文脈から、AIが魅力的なキャラクター像を提案します。画像生成AI用の指示も同時に作成されます。',
    result: 'キャラの名前、設定、イラスト用プロンプトが手に入ります。'
  },
  { 
    id: 4, 
    label: 'サムネイル', 
    icon: ImageIcon, 
    what: 'クリック率最大化のデザイン案',
    how: '動画のハイライトをAIが分析。ChatGPT(DALL-E 3)等を使って、思わずクリックしたくなるサムネイルを生成します。',
    result: 'インパクトのあるサムネイル構図と文字入れ案が手に入ります。'
  },
  { 
    id: 5, 
    label: 'タイトル/タグ', 
    icon: Type, 
    what: 'YouTube SEO・検索最適化',
    how: 'Googleの検索アルゴリズムに最適化したタイトルを15案作成。Geminiを使って検索上位を狙いましょう。',
    result: '検索に強いタイトルと、拡散を加速させるハッシュタグが手に入ります。'
  },
  { 
    id: 6, 
    label: 'BGM作成', 
    icon: Music, 
    what: '感情を揺さぶる音の魔法',
    how: '動画の雰囲気に完璧にマッチするBGMプロンプトを作成。Suno AIなどの作曲AIで理想の音を生成できます。',
    result: 'あなたの動画専用のオリジナルBGMが完成します。'
  },
]

const MAJOR_AI = [
  { id: 'claude', name: 'Claude', url: 'https://claude.ai', icon: '🟠', desc: '【台本・文章】日本語の自然さは世界一。情緒的な表現が得意。', billing: '基本無料', isBestForScript: true },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', icon: '🟢', desc: '【万能・画像】最も多機能。画像生成(DALL-E 3)に最強。', billing: '基本無料', isBestForImage: true },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', icon: '💎', desc: '【SEO・大容量】Google検索と連動。大容量データの処理に。', billing: '完全無料', isBestForSEO: true },
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
    setCompressProgress('🔄 エンジン起動中...');
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

  const getStepPrompt = (step: number) => {
    const base = inputText || "(ここに文字起こしデータが入ります)"
    if (step === 2) return `以下の文字起こしを徹底分析し、視聴者が釘付けになるYouTube動画の台本（構成・セリフ・演出）を作成してください：\n\n${base}`
    if (step === 3) return `この台本の文脈から、登場キャラクターの性格・役割・外見の設定案を詳細に作成してください。画像生成AI用の指示も含めてください。:${base}`
    return ""
  }

  const currentStepInfo = STEPS[currentStep - 1];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans">
      
      {/* 🔴 HEADER & GLOBAL GUIDE */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl border-4 border-white/10">
          <Clapperboard className="h-12 w-12 text-white" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">YouTube Producer</h1>
          <p className="text-2xl text-slate-400 leading-relaxed font-black uppercase tracking-widest italic border-y border-white/5 py-4">Step-by-Step AI Co-Pilot</p>
        </div>
      </div>

      {/* 🟢 STEP NAV */}
      <div className="flex items-center justify-center max-w-6xl mx-auto overflow-x-auto pb-10 px-10 scrollbar-hide">
        <div className="flex items-center justify-between w-full min-w-[800px]">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex flex-col items-center gap-4 transition-all ${currentStep === s.id ? 'opacity-100 scale-125' : currentStep > s.id ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${currentStep === s.id ? 'bg-red-600 border-red-400 text-white shadow-xl' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700'}`}>
                  {currentStep > s.id ? <CheckCircle2 className="h-8 w-8" /> : <s.icon className="h-8 w-8" />}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-4 rounded-full transition-all ${currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* 💡 INTUITIVE GUIDE PANEL (EVERY STEP MUST HAVE THIS) */}
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><HelpCircle className="h-40 w-40" /></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-lg rounded-full shadow-lg">STEP 0{currentStep}</Badge>
                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">{currentStepInfo.what}</h3>
              </div>
              <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-90 max-w-3xl">
                {currentStepInfo.how}
              </p>
              <div className="flex items-center gap-3 text-emerald-300 font-black text-lg italic bg-black/20 w-fit px-6 py-2 rounded-2xl border border-white/10">
                <Zap className="h-6 w-6 fill-current" /> 期待される成果：{currentStepInfo.result}
              </div>
            </div>
          </div>

          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-12 shadow-2xl">
            {currentStep === 1 ? (
              <div className="space-y-10">
                 <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                 {!extractedAudioUrl ? (
                   <div onClick={() => fileRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                      <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform" />
                      <p className="text-3xl font-black text-white">動画または音声ファイルをここに追加</p>
                   </div>
                 ) : (
                   <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-blue-500/30 space-y-8 animate-in zoom-in duration-500">
                      <h4 className="text-2xl font-black text-blue-400 italic">Audio Ready. Choose AI for Transcribe:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {MAJOR_AI.map(ai => (
                          <a key={ai.id} href={ai.url} target="_blank" className={`p-8 rounded-[2.5rem] border-2 bg-slate-900 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl ${ai.isBestForTranscribe ? 'border-green-500 ring-4 ring-green-500/10' : 'border-white/5 opacity-80'}`}>
                            <span className="text-4xl">{ai.icon}</span>
                            <span className="font-black text-white uppercase text-sm">{ai.name}</span>
                            <Badge className="bg-slate-800 text-slate-500 border-0 text-[9px]">{ai.billing}</Badge>
                          </a>
                        ))}
                      </div>
                   </div>
                 )}
                 <div className="space-y-6 pt-12 border-t border-slate-800">
                   <Label className="text-2xl font-black text-white flex items-center gap-3"><MessageSquareText className="h-8 w-8 text-red-500" /> 文字起こし結果を貼り付け</Label>
                   <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AIから返ってきたテキストを貼り付け..." className="w-full h-[500px] bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                   <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl shadow-red-600/40 mt-6 gap-4">STEP ② 台本作成を開始 <ArrowRight className="h-12 w-12" /></Button>
                 </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-12 max-h-[600px] overflow-y-auto shadow-inner">
                  {getStepPrompt(currentStep)}
                </div>
                
                <Button onClick={() => handleCopy(getStepPrompt(currentStep), "p")} className="w-full h-32 bg-white text-black font-black text-4xl rounded-[2.5rem] gap-6 shadow-2xl hover:bg-slate-100 transition-all active:scale-95">
                  <Copy className="h-12 w-12" /> プロンプトをコピー
                </Button>

                <div className="space-y-8 pt-12 border-t border-slate-800">
                  <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-2"><Globe className="h-5 w-5" /> 2. AIを選択して実行（無料枠）</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MAJOR_AI.map(ai => (
                      <a key={ai.id} href={ai.url} target="_blank" className={`p-10 rounded-[3rem] border-2 bg-slate-950 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl ${
                        (currentStep === 2 && ai.isBestForScript) || (currentStep === 4 && ai.isBestForImage) ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-white/5 opacity-80'
                      }`}>
                        <span className="text-6xl">{ai.icon}</span>
                        <div className="text-center space-y-1">
                          <span className="font-black text-white text-3xl uppercase tracking-tighter block">{ai.name}</span>
                          <span className="text-slate-500 text-xs font-bold leading-tight block px-4">{ai.desc}</span>
                        </div>
                        {(currentStep === 2 && ai.isBestForScript) || (currentStep === 4 && ai.isBestForImage) ? <Badge className="bg-orange-600 text-white font-black px-6 py-2 text-sm uppercase shadow-lg animate-pulse border-0">Recommended</Badge> : null}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-16">
                  <Button onClick={() => setCurrentStep((currentStep + 1) as any)} className="w-full h-24 bg-slate-800 hover:bg-slate-700 text-white font-black text-2xl rounded-[1.5rem] shadow-xl uppercase italic border-b-8 border-slate-950">
                    NEXT STAGE: {STEPS[currentStep].label} <ArrowRight className="h-8 w-8 ml-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}
