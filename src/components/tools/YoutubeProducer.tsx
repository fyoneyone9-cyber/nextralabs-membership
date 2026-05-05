'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Video, FileText, Download, Copy, ExternalLink, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText, HelpCircle, Globe, Zap } from 'lucide-react'

const STEPS = [
  { id: 1, label: '素材取り込み', what: '動画・音声の解析準備', how: '素材をアップロードしてください。音声を自動で抜き出します。', result: '文字起こし用の音声データ' },
  { id: 2, label: '台本作成', what: 'ストーリー構築', how: 'プロンプトをコピーしてAIに渡してください。', result: 'プロ級の神台本' }
]

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎', desc: '大容量・検索連動' },
  { id: 'chatgpt', name: 'GPT', url: 'https://chatgpt.com', icon: '🟢', desc: '万能・画像生成' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠', desc: '日本語・台本最強' }
]

export default function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedAudioUrl, setExtractedAudioUrl] = useState(null);
  const [compressProgress, setCompressProgress] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const fileRef = useRef(null);

  const extractAudio = async (file) => {
    setCompressProgress('🔄 抽出中...');
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({ coreURL: await toBlobURL(baseURL + '/ffmpeg-core.js', 'text/javascript'), wasmURL: await toBlobURL(baseURL + '/ffmpeg-core.wasm', 'application/wasm') });
    ffmpeg.on('progress', ({ progress }) => setCompressProgress('🎵 ' + Math.round(progress * 100) + '%'));
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'));
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3');
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
    setCompressProgress(null);
  };

  const currentInfo = STEPS[currentStep - 1];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">YouTube Producer</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-4 text-left">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-full shadow-lg">STEP 0{currentStep}</Badge>
            <h3 className="text-3xl font-black italic uppercase">{currentInfo.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto">
          {currentStep === 1 ? (
             <div className="space-y-12 text-center">
                <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                {!extractedAudioUrl ? (
                  <div onClick={() => fileRef.current.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                    <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                    <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声をここに追加'}</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-blue-500/30 space-y-10 animate-in zoom-in duration-500 text-center">
                    <audio src={extractedAudioUrl} controls className="w-full h-20 shadow-inner" />
                    <div className="grid grid-cols-2 gap-8">
                        <a href={extractedAudioUrl} download="audio.mp3" className="h-28 bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl rounded-[2rem] shadow-xl flex items-center justify-center gap-4">保存</a>
                        <Button className="h-28 bg-white text-black font-black text-3xl rounded-[2rem] shadow-xl" onClick={() => { navigator.clipboard.writeText("指示..."); setCopiedId('tr') }}>コピー</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-6 pt-12 border-t border-slate-800">
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="結果を貼り付け..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                  <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl mt-10 uppercase italic">Next Stage <ArrowRight className="h-12 w-12" /></Button>
                </div>
             </div>
          ) : (
            <div className="space-y-12">
              <h2 className="text-4xl font-black text-white uppercase italic">Step 0{currentStep}: Scripting</h2>
              <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-10 max-h-[600px] overflow-y-auto shadow-inner text-left">{inputText}</div>
              <div className="grid grid-cols-3 gap-8">
                {MAJOR_AI.map(ai => (
                  <a key={ai.id} href={ai.url} target="_blank" className="p-8 rounded-[2.5rem] border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl">
                    <span className="text-5xl">{ai.icon}</span><span className="font-black text-white text-2xl uppercase tracking-tighter">{ai.name}</span>
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