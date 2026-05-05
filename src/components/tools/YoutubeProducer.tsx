'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Video, FileText, Download, Copy, ExternalLink, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText, HelpCircle, Globe } from 'lucide-react'

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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const currentInfo = STEPS[currentStep - 1];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl shadow-red-600/20"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-none tracking-tighter">YouTube Producer</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-2xl shadow-xl">STEP 01</Badge>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">{currentInfo.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4.5rem] p-16 shadow-2xl max-w-5xl mx-auto overflow-hidden">
          {currentStep === 1 && (
             <div className="space-y-12">
                <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                
                {!extractedAudioUrl ? (
                  <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all relative">
                    {/* 透明なinputを最前面に置いてクリックを確実に拾わせる */}
                    <input type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="absolute inset-0 opacity-0 cursor-pointer z-50" />
                    <FileAudio className="h-28 w-28 mx-auto mb-8 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                    <p className="text-4xl font-black text-white leading-tight">動画または音声を<br/>ここに追加して開始</p>
                  </label>
                ) : (
                  <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-blue-500/30 space-y-10 animate-in zoom-in duration-500 text-center">
                    <audio src={extractedAudioUrl} controls className="w-full h-20 shadow-inner mb-6" />
                    <div className="grid grid-cols-2 gap-8">
                        <a href={extractedAudioUrl} download="nextra-audio.mp3" className="w-full h-32 bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-6">
                           <Download className="h-12 w-12" /> 音声を保存
                        </a>
                        <Button 
                          onClick={() => { navigator.clipboard.writeText("スプレッドシート形式不要、詳細に漏れのないように抜き出して下さい。この音声を一字一句正確に文字起こしして下さい。"); setCopiedId('tr'); setTimeout(() => setCopiedId(null), 3000) }} 
                          className={w-full h-32 font-black text-3xl rounded-[2.5rem] shadow-2xl transition-all \}
                        >
                          {copiedId === 'tr' ? <><CheckCircle2 className="h-12 w-12" /> コピー完了！</> : "指示をコピー"}
                        </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/5">
                  {MAJOR_AI.map(ai => (
                    <a key={ai.id} href={ai.url} target="_blank" className="h-24 bg-slate-900 border-2 border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl group">
                      <span className="text-4xl">{ai.icon}</span>
                      <span className="font-black text-white text-xl uppercase tracking-tighter">{ai.name}</span>
                    </a>
                  ))}
                </div>

                <div className="space-y-8 pt-12 border-t border-slate-800">
                  <Label className="text-3xl font-black text-white flex items-center gap-4 italic uppercase"><MessageSquareText className="h-12 w-12 text-red-500" /> Result Paste Area</Label>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AIから返ってきたテキストを貼り付け..." className="w-full h-96 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-12 text-3xl font-medium focus:border-red-600 text-white shadow-inner" />
                  <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl mt-12 gap-6 uppercase italic">Next Stage <ArrowRight className="h-12 w-12" /></Button>
                </div>
             </div>
          ) : (
             <div className="text-center py-40">
                <h2 className="text-5xl font-black text-white uppercase italic">Step 02: Scripting</h2>
                <Button onClick={() => setCurrentStep(1)} className="mt-12 h-24 bg-slate-800 text-white px-16 rounded-3xl font-black text-2xl shadow-xl">← BACK TO START</Button>
             </div>
          )}
        </Card>
      </div>
      {/* 🐞 憲法に基づき、DebugPanelを100%確実に配置 */}
      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}