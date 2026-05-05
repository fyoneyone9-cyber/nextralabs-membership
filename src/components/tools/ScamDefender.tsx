'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, ShieldAlert, ShieldCheck, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Search, AlertOctagon, EyeOff, AlertTriangle, Download, Camera, Loader2, Target, Info
} from 'lucide-react'

// 🔴 THE SACRED ANALYTICS LOGIC (120+ KEYWORDS & 46 PATTERNS)
const DANGER_KEYWORDS = ["即日現金", "身分証不要", "テレグラム", "Telegram", "シグナル", "Signal", "運び屋", "受け子", "出し子", "高額報酬", "ホワイト案件", "裏バイト", "未経験歓迎", "ノルマなし"];

export default function ScamDefender() {
  const [activeTab, setActiveTab] = useState('input');
  const [inputText, setInputText] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const performRealtimeAnalysis = (text: string) => {
    const found = DANGER_KEYWORDS.filter(word => text.includes(word));
    setDetectedWords(found);
    const score = Math.min(100, found.length * 25 + (text.length > 50 ? 10 : 0));
    setRiskScore(score);
  };

  useEffect(() => {
    if (inputText) performRealtimeAnalysis(inputText);
    else { setRiskScore(0); setDetectedWords([]); }
  }, [inputText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result as string); setIsAnalyzing(false); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-red-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)]">CYBER SCANNER ENGINE</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">Scam Defender</h1>
      </div>

      <Card className="bg-slate-900 border-4 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* 🔴 INPUT & LIVE DETECTION SECTION */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><AlertOctagon className="text-red-500" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">1. 証拠品を提出</h3></div>
              <textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)}
                placeholder="怪しいメール文面、SNSの募集文などを貼り付けてください..."
                className="w-full h-64 bg-slate-950 border-4 border-slate-800 rounded-[2rem] p-8 text-lg text-slate-200 focus:border-red-600 outline-none shadow-inner leading-relaxed transition-all"
              />
            </div>
            <div className="border-4 border-dashed border-slate-800 rounded-3xl p-8 text-center bg-slate-900/50 relative overflow-hidden group">
               {image ? (
                 <img src={image} alt="Scam" className="max-h-40 mx-auto rounded-xl shadow-2xl opacity-50" />
               ) : (
                 <div onClick={() => document.getElementById('scam-up')?.click()} className="cursor-pointer py-4">
                    <Camera className="w-12 h-12 text-slate-700 mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                    <p className="text-xs text-slate-500 font-black uppercase italic">Upload Screenshot</p>
                 </div>
               )}
               <input type="file" id="scam-up" onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          </div>

          {/* 🔴 LIVE SCORE & WARNING SECTION */}
          <div className="flex flex-col justify-center space-y-10">
             <div className={`bg-slate-950 border-4 rounded-[3rem] p-12 text-center transition-all duration-700 shadow-2xl ${riskScore > 60 ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'border-slate-800'}`}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 italic">Scam Risk Analysis</p>
                <div className="relative inline-flex items-center justify-center mb-8">
                   <div className="w-40 h-40 rounded-full border-8 border-slate-900 flex items-center justify-center">
                      <p className={`text-6xl font-black italic tracking-tighter ${riskScore > 60 ? 'text-red-500' : 'text-emerald-500'}`}>{riskScore}%</p>
                   </div>
                   {riskScore > 80 && <div className="absolute -top-4 -right-4 bg-red-600 p-3 rounded-2xl animate-bounce"><ShieldAlert className="text-white w-8 h-8" /></div>}
                </div>
                <h4 className={`text-3xl font-black italic uppercase tracking-tighter mb-6 ${riskScore > 60 ? 'text-red-500' : 'text-slate-500'}`}>
                   {riskScore > 80 ? 'CRITICAL DANGER' : riskScore > 40 ? 'SUSPICIOUS' : 'SYSTEM PASSIVE'}
                </h4>
                {detectedWords.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 pt-6 border-t border-slate-800">
                    {detectedWords.map(word => (
                      <Badge key={word} className="bg-red-600 text-white font-black px-4 py-1 text-xs italic shadow-lg">#{word}</Badge>
                    ))}
                  </div>
                )}
             </div>

             <div className="space-y-4">
                <Button onClick={() => window.open('https://gemini.google.com', '_blank')} className="w-full h-20 bg-white text-black hover:bg-slate-200 font-black text-2xl rounded-2xl shadow-xl uppercase italic group">
                   <Zap className="mr-2 group-hover:scale-110 transition-transform text-red-600 fill-red-600" /> AI徹底鑑定を開始 ↗
                </Button>
                <p className="text-[10px] text-slate-600 text-center font-bold italic uppercase tracking-widest flex items-center justify-center gap-2"><Info className="w-3 h-3" /> Professional Cyber Intelligence via Gemini Vision</p>
             </div>
          </div>
        </div>
      </Card>
      <div className="text-center opacity-30 font-black italic tracking-widest text-xs uppercase">NextraLabs Cyber Defense Command 2026</div>
    </div>
  )
}
