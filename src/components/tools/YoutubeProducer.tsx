'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Video, FileText, Download, Copy, ExternalLink, FileAudio, Clapperboard, CheckCircle2, HelpCircle } from 'lucide-react'

const STEPS = [
  { id: 1, label: '素材取り込み', what: '動画・音声の解析準備', how: '動画または音声ファイルをアップロード。AIが扱いやすい形式に自動抽出します。', result: '文字起こし用の音声データ' },
  { id: 2, label: '台本作成', what: 'ストーリー構築', how: 'プロンプトをコピーしてAIに渡してください。', result: 'プロ級の動画台本' }
]

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎' },
  { id: 'chatgpt', name: 'GPT', url: 'https://chatgpt.com', icon: '🟢' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠' }
]

export default function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState(1)
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [extractedAudioUrl, setExtractedAudioUrl] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const fileRef = useRef(null)

  const currentInfo = STEPS[currentStep - 1]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl shadow-red-600/20"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-none tracking-tighter">YouTube Producer</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-2xl shadow-xl">STEP 0{currentStep}</Badge>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">{currentInfo.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto overflow-hidden">
          {currentStep === 1 ? (
             <div className="space-y-12">
                <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
                <div onClick={() => fileRef.current.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group">
                  <FileAudio className="h-28 w-28 mx-auto mb-8 text-red-500" />
                  <p className="text-4xl font-black text-white leading-tight">動画または音声を<br/>ここに追加</p>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-12">
                  {MAJOR_AI.map(ai => (
                    <a key={ai.id} href={ai.url} target="_blank" className="h-24 bg-slate-900 border-2 border-white/5 rounded-3xl flex items-center justify-center font-black text-2xl">{ai.name}</a>
                  ))}
                </div>
                <Button onClick={() => setCurrentStep(2)} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl mt-12">Next Stage</Button>
             </div>
          ) : (
             <div className="text-center py-20">
                <h2 className="text-4xl font-black text-white italic">Step 02: Scripting</h2>
                <Button onClick={() => setCurrentStep(1)} className="mt-10 h-20 bg-slate-800 text-white px-10 rounded-2xl">戻る</Button>
             </div>
          )}
        </Card>
      </div>
      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}
