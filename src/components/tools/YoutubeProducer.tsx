'use client'
import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ArrowRight, Video, FileText, Users, ImageIcon, Music, Type, Download, Copy, ExternalLink, Info, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText, HelpCircle, Globe } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

export default function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedAudioUrl, setExtractedAudioUrl] = useState(null);
  const [compressProgress, setCompressProgress] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const fileRef = useRef(null);

  const extractAudio = async (file) => {
    setCompressProgress('🔄 FFmpegエンジン起動中...');
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({ coreURL: await toBlobURL(\/ffmpeg-core.js, 'text/javascript'), wasmURL: await toBlobURL(\/ffmpeg-core.wasm, 'application/wasm') });
    ffmpeg.on('progress', ({ progress }) => setCompressProgress('🎵 抽出中... ' + Math.round(progress * 100) + '%'));
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'));
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3');
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
    setCompressProgress(null);
  };

  const getPrompt = (step) => {
    const base = inputText || "(文字起こしデータ)";
    if (step === 2) return "以下の文字起こしを元にYouTube台本を作成してください。:" + base;
    return "";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl shadow-red-600/30"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-none">YouTube Producer</h1>
      </div>
      
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl overflow-hidden max-w-5xl mx-auto">
        {currentStep === 1 ? (
          <div className="space-y-12">
            <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
            {!extractedAudioUrl ? (
              <div onClick={() => fileRef.current.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group">
                <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500" />
                <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '素材をアップロード'}</p>
              </div>
            ) : (
              <div className="bg-slate-950 p-10 rounded-[3rem] border-2 border-blue-500/30 space-y-8 text-center">
                <audio src={extractedAudioUrl} controls className="w-full" />
                <div className="grid grid-cols-2 gap-6">
                  <a href={extractedAudioUrl} download="audio.mp3" className="h-24 bg-blue-600 text-white font-black text-2xl rounded-3xl flex items-center justify-center gap-4 shadow-xl">保存</a>
                  <Button className="h-24 bg-white text-black font-black text-2xl rounded-3xl" onClick={() => { navigator.clipboard.writeText("文字起こしして。"); setCopiedId('tr') }}>コピー</Button>
                </div>
              </div>
            )}
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="結果を貼り付け..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium text-white" />
            <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl">台本作成へ進む</Button>
          </div>
        ) : (
          <div className="space-y-12">
            <h2 className="text-4xl font-black text-white italic">Step 02: Scripting</h2>
            <div className="bg-slate-950 p-10 rounded-[3.5rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto shadow-inner text-left">{getPrompt(currentStep)}</div>
            <Button onClick={() => { navigator.clipboard.writeText(getPrompt(currentStep)); setCopiedId('pr') }} className={"w-full h-32 font-black text-4xl rounded-[2.5rem] shadow-2xl " + (copiedId === 'pr' ? "bg-emerald-500 text-slate-950" : "bg-white text-black")}>プロンプトをコピー</Button>
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-800">
               <a href="https://gemini.google.com" target="_blank" className="h-24 bg-slate-950 border-2 border-white/5 rounded-3xl flex items-center justify-center font-black text-2xl">GEMINI</a>
               <a href="https://chatgpt.com" target="_blank" className="h-24 bg-slate-950 border-2 border-white/5 rounded-3xl flex items-center justify-center font-black text-2xl">GPT</a>
               <a href="https://claude.ai" target="_blank" className="h-24 bg-slate-950 border-2 border-orange-500/50 rounded-3xl flex items-center justify-center font-black text-2xl text-orange-400">CLAUDE</a>
            </div>
          </div>
        )}
      </Card>
      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}