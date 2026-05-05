'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Dog, Cat, MessageCircle, Heart, Camera, Loader2, Download, Mic, Activity
} from 'lucide-react'

export default function PetTranslator() {
  const [activeTab, setActiveTab] = useState('scan');
  const [isRecording, setIsRecording] = useState(false);
  const [analysisLevel, setAnalysisLevel] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState('');
  
  // 🔴 REAL-TIME AUDIO ANALYSIS SIMULATION
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setAnalysisLevel(Math.floor(Math.random() * 100));
      }, 100);
    } else {
      setAnalysisLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startVoiceAnalysis = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setActiveTab('result');
      setTranslationResult("「ねぇ、遊んで！今は最高にワクワクしてるんだ。そのボールを投げてくれたら、全力で追いかけるよ！」");
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-yellow-500 text-black font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">ANIMAL VOICE ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Pet Translator</h1>
      </div>

      <Card className="bg-slate-900 border-4 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* 🔴 SENSORY INPUT SECTION */}
          <div className="space-y-8">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border-4 border-slate-800 bg-black shadow-inner flex items-center justify-center">
              {image ? (
                <img src={image} alt="Pet" className="object-cover w-full h-full opacity-60" />
              ) : (
                <div className="text-center space-y-4">
                  <Camera className="w-16 h-16 text-slate-700 mx-auto" />
                  <input type="file" onChange={handleFileChange} className="hidden" id="pet-upload" accept="image/*" />
                  <label htmlFor="pet-upload" className="cursor-pointer text-indigo-400 font-black italic underline uppercase">Upload Photo</label>
                </div>
              )}
              {isRecording && (
                <div className="absolute inset-0 bg-yellow-500/20 flex flex-col items-center justify-center space-y-4 backdrop-blur-sm">
                   <Activity className="w-20 h-20 text-yellow-500 animate-pulse" />
                   <p className="text-2xl font-black text-white italic uppercase animate-bounce">Analyzing Voice...</p>
                   <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 transition-all duration-100" style={{ width: `${analysisLevel}%` }}></div>
                   </div>
                </div>
              )}
            </div>
            <Button 
              onClick={startVoiceAnalysis} 
              disabled={isRecording}
              className="w-full h-24 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 text-3xl uppercase italic group"
            >
              <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" /> Listen & Translate
            </Button>
          </div>

          {/* 🔴 RESULT / INTERFACE SECTION */}
          <div className="flex flex-col justify-center space-y-8">
             <div className="bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 relative shadow-inner">
                <div className="absolute -top-4 -left-4 bg-red-600 text-white p-3 rounded-2xl shadow-lg"><Heart className="w-6 h-6 fill-white" /></div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-4 tracking-tighter">Emotion Report</h3>
                <div className="min-h-[200px] flex items-center justify-center">
                  {translationResult ? (
                    <p className="text-2xl md:text-3xl font-bold text-slate-200 leading-relaxed italic animate-in fade-in slide-in-from-left-4">
                      {translationResult}
                    </p>
                  ) : (
                    <p className="text-slate-600 font-bold italic text-center">AIがペットの声を聴き取るのを待機中...</p>
                  )}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 border-slate-800 text-slate-400 font-black rounded-2xl uppercase italic hover:bg-slate-800" onClick={() => {setImage(null); setTranslationResult('')}}><RotateCcw className="mr-2" /> Reset</Button>
                <Button className="h-16 bg-white text-black font-black rounded-2xl shadow-xl uppercase italic hover:bg-slate-200">Save Log <Download className="ml-2" /></Button>
             </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
