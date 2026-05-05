'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Upload, 
  CheckCircle2, 
  Youtube, 
  FileVideo, 
  FileText,
  Zap,
  ChevronRight,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowDown
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'STEP 01', title: '素材取り込み', desc: '動画・音声・URLの準備' },
  { id: 2, label: 'STEP 02', title: 'AIプロンプト生成', desc: '最強の指示書でAIを実行' },
  { id: 3, label: 'STEP 03', title: '完了', desc: '成果物の確認' }
];

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎', color: 'bg-blue-600' },
  { id: 'chatgpt', name: 'CHATGPT', url: 'https://chatgpt.com', icon: '🟢', color: 'bg-emerald-600' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠', color: 'bg-orange-600' }
];

export default function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTranscript('（文字起こし結果）本日の動画ではAI副業について解説します。1.市場調査 2.ツール選定 3.コンテンツ作成...');
          setCurrentStep(2);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleCopy = () => {
    const prompt = `以下の文字起こしデータをもとに、YouTubeの「台本案」「タイトル5選」「サムネイル構成案」を作成してください。\n\n【文字起こし】\n${transcript}`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">AI YouTube PRODUCER</h1>
        <div className="flex items-center justify-center gap-2 text-red-500 font-bold tracking-[0.3em] text-xs md:text-sm">
          <Sparkles className="h-4 w-4" /> NEXTRALABS CREATIVE PIPELINE
        </div>
      </div>

      {/* 🔴 ENHANCED PROGRESS BAR */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 max-w-4xl mx-auto shadow-xl">
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2" />
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-950 px-2 md:px-6 py-2 rounded-2xl border border-transparent transition-all">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  currentStep === s.id ? 'bg-red-600 border-red-400 text-white scale-125 shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 
                  currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 
                  'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {currentStep > s.id ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-black text-sm italic">{s.id}</span>}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest ${currentStep === s.id ? 'text-red-500' : 'text-slate-500'}`}>{s.title}</p>
                <p className="text-[8px] text-slate-600 font-bold hidden md:block">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* STEP 01: INPUT */}
        {currentStep === 1 && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card 
              className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl hover:border-red-500/50 transition-all group cursor-pointer" 
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={simulateUpload} className="hidden" accept="video/*,audio/*" />
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {isUploading ? <Loader2 className="h-10 w-10 text-red-500 animate-spin" /> : <Upload className="h-10 w-10 text-red-500" />}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">File Upload</h4>
                  <p className="text-slate-500 mt-1 font-bold text-xs">VIDEO / AUDIO SUPPORTED</p>
                </div>
                {isUploading && (
                  <div className="w-full space-y-2">
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Processing... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-3">
                  <Youtube className="h-6 w-6 text-red-600" />
                  <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">YouTube URL</h4>
                </div>
                <input 
                  type="text" 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste video link here..." 
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-sm focus:border-red-600 outline-none text-white shadow-inner font-mono" 
                />
                <Button 
                  onClick={simulateUpload}
                  disabled={!youtubeUrl || isUploading}
                  className="w-full h-14 bg-white text-black hover:bg-red-600 hover:text-white font-black text-lg rounded-2xl shadow-xl transition-all uppercase italic"
                >
                  Fetch Content <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 02: THE "ONE-WAY" PIPELINE */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-500" />
                    </div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">文字起こし完了</h4>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 font-bold">READY</Badge>
                </div>
                
                <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 h-40 overflow-y-auto text-slate-400 text-sm font-medium leading-relaxed">
                  {transcript}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">最強のプロンプトを生成しました</h4>
                  </div>
                  
                  <div className="grid gap-4">
                    <Button 
                      onClick={handleCopy} 
                      className={`h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all duration-300 ${
                        copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'
                      }`}
                    >
                      {copied ? <span className="flex items-center gap-2"><CheckCircle2 /> COPIED!</span> : 'プロンプトをコピーする'}
                    </Button>

                    {/* AI REDIRECTION SECTION - REVEALED ON COPY OR JUST VISIBLE */}
                    <div className={`pt-6 border-t border-slate-800 transition-all duration-700 ${copied ? 'opacity-100 translate-y-0' : 'opacity-50'}`}>
                      <p className="text-center text-xs font-black text-slate-500 uppercase tracking-widest mb-6">貼り付け先を選択してください</p>
                      <div className="grid grid-cols-3 gap-4">
                        {MAJOR_AI.map(ai => (
                          <a 
                            key={ai.id} 
                            href={ai.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => setCurrentStep(3)}
                            className={`${ai.color} h-20 rounded-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 transition-all shadow-xl group`}
                          >
                            <span className="text-2xl">{ai.icon}</span>
                            <span className="font-black text-[10px] tracking-tighter text-white/90">{ai.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 03: COMPLETION */}
        {currentStep === 3 && (
          <div className="text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-32 h-32 bg-emerald-500/10 border-4 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Mission Accomplished</h3>
              <p className="text-slate-400 font-bold max-w-md mx-auto">AIでの生成は開始されましたか？台本、タイトル、サムネイル案が揃えば動画制作の準備は完了です。</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-10">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="rounded-2xl border-slate-800 text-slate-400 hover:bg-slate-900 px-10 h-16 font-black italic uppercase"
              >
                別の動画を制作する
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-black hover:bg-slate-200 rounded-2xl px-10 h-16 font-black italic uppercase"
              >
                ダッシュボードに戻る
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
