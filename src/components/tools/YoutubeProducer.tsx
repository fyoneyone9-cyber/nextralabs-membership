'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Video, FileText, Users, Image as ImageIcon, Music, Type, Download, Copy, ExternalLink, Info, AlertCircle, PlayCircle, Loader2, Sparkles } from 'lucide-react'

// ==================== TYPES ====================
type Step = 1 | 2 | 3 | 4 | 5 | 6
type Genre = 'entertainment' | 'education' | 'vlog' | 'tech' | 'business' | 'gaming' | 'cooking' | 'travel' | 'news' | 'interview'

interface TranscriptResult {
  text: string
}

// ==================== CONSTANTS ====================
const STEPS = [
  { id: 1, label: '素材取り込み', icon: Video, desc: '文字起こし' },
  { id: 2, label: '台本作成', icon: FileText, desc: 'プロンプト生成' },
  { id: 3, label: 'キャラ設定', icon: Users, desc: '人物画像' },
  { id: 4, label: 'サムネイル', icon: ImageIcon, desc: 'デザイン案' },
  { id: 5, label: 'タイトル/タグ', icon: Type, desc: 'SEO最適化' },
  { id: 6, label: 'BGM作成', icon: Music, desc: '音楽生成' },
]

const GENRES: { id: Genre; label: string; icon: string }[] = [
  { id: 'entertainment', label: 'エンタメ', icon: '🎭' },
  { id: 'education', label: '教育・解説', icon: '📚' },
  { id: 'vlog', label: 'Vlog', icon: '📷' },
  { id: 'tech', label: 'テック・IT', icon: '💻' },
  { id: 'business', label: 'ビジネス', icon: '💼' },
  { id: 'gaming', label: 'ゲーム実況', icon: '🎮' },
  { id: 'cooking', label: '料理', icon: '🍳' },
  { id: 'travel', label: '旅行', icon: '✈️' },
  { id: 'news', label: 'ニュース', icon: '📰' },
  { id: 'interview', label: '対談・インタビュー', icon: '🎤' },
]

export function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [genre, setGenre] = useState<Genre>('entertainment')
  
  // Data
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null)
  const [inputText, setInputText] = useState('')
  const [transcribing, setTranscribing] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6) as Step)
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1) as Step)

  const handleStartTranscribe = () => {
    if (!inputText.trim()) return
    setTranscribing(true)
    setTimeout(() => {
      setTranscript({ text: inputText })
      setTranscribing(false)
      nextStep()
    }, 1000)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 min-h-screen text-slate-200">
      
      {/* 🔴 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/20">
            <Video className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">AI YouTube Producer</h1>
            <p className="text-slate-500 text-sm">6ステップで完璧な投稿素材を自動生成</p>
          </div>
        </div>
        
        {/* Genre Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {GENRES.map(g => (
            <button 
              key={g.id} 
              onClick={() => setGenre(g.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all whitespace-nowrap ${genre === g.id ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20 scale-105' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
            >
              <span>{g.icon}</span>{g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 STEP PROGRESS BAR */}
      <div className="flex items-center justify-between gap-2 mb-16 overflow-x-auto pb-4 scrollbar-hide">
        {STEPS.map((s, i) => {
          const isActive = currentStep === s.id
          const isDone = currentStep > s.id
          const Icon = s.icon
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex flex-col items-center gap-2 transition-all ${isActive ? 'scale-110 opacity-100' : isDone ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${isActive ? 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-600/20' : isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                  {isDone ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase text-slate-500">Step 0{s.id}</span>
                  <span className="text-xs font-bold whitespace-nowrap">{s.label}</span>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${isDone ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* 🔵 STEP CONTENT AREA */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- STEP 1: TRANSCRIBE --- */}
        {currentStep === 1 && (
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Start with your source</h2>
              <p className="text-slate-400 text-lg">動画の核となる「文字起こしテキスト」を入力してください。</p>
            </div>
            
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="ここにYouTube動画の文字起こしや、台本のベースとなるテキストを貼り付けてください..."
                  className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-lg focus:border-red-600 focus:outline-none transition-all resize-none placeholder:text-slate-700"
                />
                <Button 
                  onClick={handleStartTranscribe}
                  disabled={!inputText.trim() || transcribing}
                  className="w-full h-20 bg-red-600 hover:bg-red-500 text-white font-black text-2xl rounded-3xl shadow-2xl shadow-red-600/30 gap-3"
                >
                  {transcribing ? <Loader2 className="h-8 w-8 animate-spin" /> : <><Sparkles className="h-8 w-8" /> STEP ② 台本作成へ進む</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- STEP 2: SCRIPT (PROMPT) --- */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Drafting the Script</h2>
                <p className="text-slate-400">AIに最適な台本を書かせるためのプロンプトが完成しました。</p>
              </div>
              <Button variant="ghost" onClick={prevStep} className="text-slate-500 hover:text-white">← 戻る</Button>
            </div>

            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 space-y-8">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-sm text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
                  {`以下の文字起こしをもとに、YouTube用の${genre}台本を作成してください。\n構成：オープニング(フック) ➔ 本編 ➔ エンディング\nトーン：${genre === 'entertainment' ? 'テンポよくツッコミ重視' : '論理的で分かりやすい解説'}\n\n文字起こし全文：\n${transcript?.text}`}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleCopy(`以下の文字起こしをもとに、YouTube用の${genre}台本を作成してください...\n(文字起こし全文)`, 'script')}
                    className="h-16 bg-white text-black font-black text-lg rounded-2xl gap-2 shadow-xl hover:bg-slate-200"
                  >
                    <Copy className="h-6 w-6" /> {copied === 'script' ? 'コピー完了！' : 'プロンプトをコピー'}
                  </Button>
                  <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className="h-16 bg-orange-600 hover:bg-orange-500 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-600/20 transition-all">
                    Claudeで作成する <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <Button onClick={nextStep} className="w-full h-16 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl gap-2">
                    台本が完成したら STEP ③ キャラ設定へ <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- OTHER STEPS (Placeholder logic for demo) --- */}
        {currentStep > 2 && (
          <div className="max-w-4xl mx-auto text-center space-y-8 py-20">
             <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-12 w-12 text-red-500" />
             </div>
             <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Step 0{currentStep}: {STEPS[currentStep-1].label}</h2>
             <p className="text-slate-400 max-w-md mx-auto">
               前のステップの成果物を元に、AIプロンプトを自動生成します。
               これを繰り返すだけで、ハイクオリティな動画素材が全て揃います。
             </p>
             <div className="flex gap-4 justify-center">
               <Button variant="ghost" onClick={prevStep} className="text-slate-500 hover:text-white">← 戻る</Button>
               <Button onClick={nextStep} disabled={currentStep === 6} className="bg-red-600 hover:bg-red-500 text-white font-black px-10 h-16 rounded-2xl shadow-xl shadow-red-600/20">
                 {currentStep === 6 ? '全工程完了！' : `STEP 0${currentStep + 1} へ進む →`}
               </Button>
             </div>
          </div>
        )}

      </div>

      {/* 🎁 FOOTER INFO */}
      <div className="max-w-4xl mx-auto mt-20 p-8 bg-red-600/5 border border-red-600/10 rounded-[2.5rem] flex gap-6 items-start">
        <div className="bg-red-600/20 p-4 rounded-2xl text-red-500 flex-shrink-0">
          <Info className="h-8 w-8" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white mb-2 italic uppercase">Zero-API Design</h4>
          <p className="text-slate-400 leading-relaxed">
            このツールは、高額なAI使用料を回避するため「プロンプト生成 ➔ 外部AIへの橋渡し」というハイブリッド設計を採用しています。
            あなたの使い慣れた ChatGPT や Claude をエンジンとして使いながら、YouTube投稿に必要な全ての素材を最短距離で作成できます。
          </p>
        </div>
      </div>

    </div>
  )
}
