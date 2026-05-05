'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DebugPanel } from './DebugPanel'
import { 
  ArrowRight, 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  Youtube, 
  FileVideo, 
  FileAudio, 
  ChevronRight,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'STEP 01', what: '素材取り込み', how: '動画・音声・YouTubeリンクを読み込みます。' },
  { id: 2, label: 'STEP 02', what: 'AIプロンプト生成', how: '文字起こしから最強の指示書を作成します。' },
  { id: 3, label: 'STEP 03', what: '各AIで実行', how: '生成された指示をコピーして、目的のAIで実行します。' }
];

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎', desc: '動画解析・長文に強い' },
  { id: 'chatgpt', name: 'GPT', url: 'https://chatgpt.com', icon: '🟢', desc: '台本・構成案に強い' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠', desc: '自然な文章・編集に強い' }
];

export default function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTranscript('（擬似文字起こし結果）動画の内容：AIを活用した副業の始め方について。1. ジャンル選定 2. プロンプト作成 3. 継続のコツ...');
          setCurrentStep(2);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleUrlSubmit = () => {
    if (youtubeUrl) {
      simulateUpload();
    }
  };

  const handleCopy = () => {
    const prompt = `以下の文字起こしデータをもとに、YouTubeの「台本案」「タイトル5選」「サムネイル構成案」を作成してください。\n\n【文字起こし】\n${transcript}`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentInfo = STEPS[currentStep - 1] || STEPS[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">AI YouTubeプロデューサー</h1>
        <p className="text-slate-400 mt-4 font-bold tracking-widest uppercase">Content Creation Pipeline</p>
      </div>

      {/* 🔴 PROGRESS BAR */}
      <div className="flex items-center justify-center max-w-5xl mx-auto overflow-x-auto pb-10 px-4">
        <div className="flex items-center justify-between w-full min-w-[500px] relative">
          <div className="absolute top-6 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full" />
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-3 bg-slate-950 px-4">
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                  currentStep === s.id ? 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] scale-110' : 
                  currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 
                  'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {currentStep > s.id ? <CheckCircle2 className="h-7 w-7" /> : <span className="font-bold text-lg italic">{s.id}</span>}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === s.id ? 'text-red-500' : 'text-slate-500'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP INFO BOX */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 to-violet-700 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><FileVideo className="h-48 w-48" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-700 font-black px-4 py-1 text-lg rounded-xl shadow-lg">STEP 0{currentStep}</Badge>
            <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">{currentInfo.what}</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-90">{currentInfo.how}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* STEP 01: INPUT */}
        {currentStep === 1 && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl hover:border-red-500/50 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                  {isUploading ? <Loader2 className="h-12 w-12 text-red-500 animate-spin" /> : <Upload className="h-12 w-12 text-red-500" />}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white">動画・音声ファイルをアップ</h4>
                  <p className="text-slate-400 mt-2 font-medium">MP4, MOV, MP3, WAV 対応</p>
                </div>
                {isUploading && (
                  <div className="w-full space-y-2">
                    <Progress value={uploadProgress} className="h-2 bg-slate-800" />
                    <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">Uploading: {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-red-500" />
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase italic">YouTube URL</h4>
                </div>
                <input 
                  type="text" 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..." 
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 text-lg focus:border-red-600 outline-none text-white shadow-inner" 
                />
                <Button 
                  onClick={handleUrlSubmit}
                  disabled={!youtubeUrl || isUploading}
                  className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black text-xl rounded-2xl shadow-xl transition-all"
                >
                  読み込む <ChevronRight className="ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 02: TRANSCRIPT & PROMPT */}
        {currentStep === 2 && (
          <div className="animate-in fade-in zoom-in duration-500">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
                    <FileText className="text-red-500" /> 文字起こしプレビュー
                  </h4>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1">解析完了</Badge>
                </div>
                
                <div className="bg-slate-950 border-2 border-slate-800 rounded-[2rem] p-8 max-h-60 overflow-y-auto text-slate-300 font-medium leading-relaxed shadow-inner">
                  {transcript}
                </div>

                <div className="pt-6">
                  <h4 className="text-2xl font-black text-white italic uppercase mb-6 flex items-center gap-3">
                    <Zap className="text-yellow-500" /> 最強のプロンプトを生成
                  </h4>
                  <Button 
                    onClick={handleCopy} 
                    className={`w-full h-24 font-black text-3xl rounded-[2rem] shadow-2xl transition-all duration-300 ${
                      copied ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-red-600 text-white hover:bg-red-500'
                    }`}
                  >
                    {copied ? '✅ COPIED!' : '指示をコピーして次へ'}
                  </Button>
                </div>
              </div>
            </Card>
            <div className="mt-8 flex justify-center">
              <Button variant="ghost" onClick={() => setCurrentStep(3)} className="text-slate-500 hover:text-white font-bold">
                コピーせずに次へ <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 03: EXECUTE */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MAJOR_AI.map(ai => (
                <a 
                  key={ai.id} 
                  href={ai.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 flex flex-col items-center text-center space-y-6 hover:border-red-500/50 hover:-translate-y-2 transition-all shadow-2xl group"
                >
                  <div className="text-6xl bg-slate-950 w-24 h-24 flex items-center justify-center rounded-[2rem] shadow-inner group-hover:scale-110 transition-transform">
                    {ai.icon}
                  </div>
                  <div>
                    <h5 className="text-2xl font-black text-white tracking-tighter">{ai.name}</h5>
                    <p className="text-slate-400 text-sm mt-1 font-bold uppercase tracking-widest">{ai.desc}</p>
                  </div>
                  <div className="w-full h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-white" />
                  </div>
                </a>
              ))}
            </div>
            
            <div className="mt-16 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 p-10 rounded-[3rem]">
              <p className="text-slate-400 font-bold mb-6 italic">別の素材でやり直す場合はこちら</p>
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="rounded-2xl border-slate-700 text-slate-300 hover:bg-slate-800 px-10 h-14 font-black italic"
              >
                最初からやり直す
              </Button>
            </div>
          </div>
        )}
      </div>

      <DebugPanel data={null} toolId="youtubeproducer" />
    </div>
  )
}
