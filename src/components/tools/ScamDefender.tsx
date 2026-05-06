'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShieldAlert, ShieldCheck, Zap, ExternalLink, AlertOctagon, Info, Activity, Terminal, Eye, Lock, Camera, Upload, Trash2, ClipboardPaste, ArrowRight
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const DANGER_KEYWORDS = [
  "即日現金", "身分証不要", "テレグラム", "Telegram", "シグナル", "Signal", "運び屋", "受け子", "出し子", 
  "高額報酬", "ホワイト案件", "裏バイト", "未経験歓迎", "ノルマなし", "amezen", "amazen", "楽天カード", 
  "重要なお知らせ", "本人確認", "異常なアクティビティ", "ログイン制限", "差し押さえ", "アカウント停止"
];

export default function ScamDefender() {
  const [inputText, setInputText] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [subjectInfo, setSubjectInfo] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [systemOnline, setSystemOnline] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🚀 【完全連動】1文字ずつの変化をリアルタイム検知するロジック
  const performRealtimeAnalysis = useCallback((text: string, sender: string, subject: string) => {
    const fullText = `${text} ${sender} ${subject}`.toLowerCase();
    
    // キーワード検知（大文字小文字無視）
    const found = DANGER_KEYWORDS.filter(word => 
      fullText.includes(word.toLowerCase())
    );
    
    setDetectedWords(found);

    // スコア計算の感度を最大化
    let score = 0;
    if (found.length > 0) {
      score = 40 + (found.length * 15); // 見つかった時点で40%スタート
    }
    
    // ドメイン偽装の特別検知 (amezen / amazan等)
    if (sender.toLowerCase().includes('amezen') || sender.toLowerCase().includes('amazen')) {
      score += 30;
    }
    
    // 緊急性を煽る言葉
    if (subject.includes('停止') || subject.includes('制限') || subject.includes('重要')) {
      score += 20;
    }

    setRiskScore(Math.min(100, score));
    
    // システム稼働状態
    const isActive = text.length > 0 || sender.length > 0 || subject.length > 0 || !!image;
    setSystemOnline(isActive);
  }, [image]);

  useEffect(() => {
    performRealtimeAnalysis(inputText, senderInfo, subjectInfo);
  }, [inputText, senderInfo, subjectInfo, performRealtimeAnalysis]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { 
        setImage(event.target?.result as string);
        setSystemOnline(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const PROMPT = `あなたはプロのサイバー犯罪捜査官です。以下の【証拠データ】を解析し、詐欺の可能性を判定してください。
【送信者/ドメイン】: ${senderInfo}
【件名】: ${subjectInfo}
【本文】: ${inputText}

1. 【詐欺スコア】: 0-100で判定
2. 【手口の解説】: どのような詐欺か（闇バイト、フィッシング等）
3. 【対策アドバイス】: 今すぐすべきこと`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]">Cyber scanner engine v5.5-MASTER</Badge>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Scam Defender</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
        
        {/* 🛡️ LEFT: ANALYSIS TERMINAL */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden h-fit">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-red-500 font-black italic tracking-widest text-xs uppercase">
                  <Activity size={16} className="animate-pulse" /> Cyber Analysis Node
                </div>
                <Badge variant="outline" className={`text-[9px] font-black italic uppercase ${systemOnline ? 'border-red-500/30 text-red-500' : 'border-slate-800 text-slate-700'}`}>
                  {systemOnline ? 'SCANNING' : 'IDLE'}
                </Badge>
             </div>
             
             <div className="space-y-6">
                <div className={`bg-slate-950 border-4 rounded-[3rem] p-10 text-center transition-all duration-700 shadow-2xl ${riskScore > 60 ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'border-slate-800'}`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">Scam Risk Analysis</p>
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <p className={`text-7xl font-black italic tracking-tighter ${riskScore > 60 ? 'text-red-500' : 'text-emerald-500'}`}>{riskScore}%</p>
                  </div>
                  <h4 className={`text-xl font-black italic uppercase tracking-tighter ${riskScore > 60 ? 'text-red-500' : 'text-slate-500'}`}>
                    {riskScore > 80 ? 'CRITICAL DANGER' : riskScore > 40 ? 'SUSPICIOUS' : 'SYSTEM PASSIVE'}
                  </h4>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Detected Indicators</p>
                  <div className="flex flex-wrap gap-2">
                    {detectedWords.length > 0 ? detectedWords.map(word => (
                      <Badge key={word} className="bg-red-600/20 text-red-500 border-red-500/30 font-black px-3 py-1 text-[10px] italic">#{word}</Badge>
                    )) : (
                      <p className="text-[10px] text-slate-700 italic">No red flags detected in text...</p>
                    )}
                  </div>
                </div>
             </div>
          </Card>

          <div className="bg-slate-900/50 border-2 border-slate-800 rounded-[2rem] p-8 space-y-4 italic shadow-inner">
             <p className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14}/> Operation Protocol</p>
             <p className="text-slate-400 text-sm font-bold leading-relaxed">怪しいテキストやスクリーンショットを投入してください。AIが犯罪手口と照合し、危険度をリアルタイム算出します。</p>
          </div>
        </div>

        {/* 📷 RIGHT: EVIDENCE SUBMISSION */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                <AlertOctagon className="text-red-500" />
              </div>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">証拠品を提出せよ</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 text-left">
              {/* Text Input Group */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Meta: Sender / Domain</p>
                    <input 
                      type="text"
                      value={senderInfo}
                      onChange={(e) => setSenderInfo(e.target.value)}
                      placeholder="info@unknown-scam.com / @fake_user..."
                      className="w-full h-14 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 text-sm text-slate-200 focus:border-red-600 outline-none italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Meta: Subject</p>
                    <input 
                      type="text"
                      value={subjectInfo}
                      onChange={(e) => setSubjectInfo(e.target.value)}
                      placeholder="重要：アカウントが停止されました..."
                      className="w-full h-14 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 text-sm text-slate-200 focus:border-red-600 outline-none italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Evidence: Text Buffer</p>
                    <textarea 
                      value={inputText} 
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="本文、SNS募集文などを貼り付け..."
                      className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-8 text-lg text-slate-200 focus:border-red-600 outline-none shadow-inner leading-relaxed transition-all italic"
                    />
                  </div>
                </div>
                <Button onClick={() => { setInputText(''); setSenderInfo(''); setSubjectInfo(''); }} variant="ghost" size="sm" className="text-slate-700 hover:text-red-500 font-black"><Trash2 size={14} /> CLEAR ALL BUFFERS</Button>
              </div>

              {/* Image Input */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Evidence: Visual Snapshot</p>
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] h-[550px] hover:bg-slate-950 transition-all cursor-pointer bg-slate-950/50 shadow-inner group flex flex-col items-center justify-center space-y-6" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-800 shadow-xl group-hover:border-red-600 transition-colors">
                      <Camera className="w-10 h-10 text-slate-700 group-hover:text-red-500 transition-colors" />
                    </div>
                    <p className="text-xl text-slate-700 font-black italic uppercase tracking-widest group-hover:text-slate-500 text-center px-8">Upload<br/>Screenshot</p>
                  </div>
                ) : (
                  <div className="relative h-[550px] rounded-[2.5rem] overflow-hidden border-4 border-red-600/20 shadow-2xl bg-black group">
                    <img src={image} alt="Scam Evidence" className="object-contain w-full h-full" />
                    <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white border-2 border-white/20 transition-all">✕</Button>
                    <div className="absolute bottom-6 left-6 flex items-center gap-2">
                      <Badge className="bg-red-600 text-white font-black italic animate-pulse tracking-widest">EVIDENCE_LOADED</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <Button 
                onClick={() => { 
                  navigator.clipboard.writeText(PROMPT);
                  window.open('https://gemini.google.com', '_blank');
                }} 
                disabled={!inputText && !image && !senderInfo && !subjectInfo}
                className="w-full h-24 bg-white text-black hover:bg-red-600 hover:text-white font-black text-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase italic flex items-center justify-center gap-6 transition-all active:scale-95 group"
              >
                <Zap className="w-10 h-10 text-red-600 group-hover:text-white transition-colors" />
                AI徹底鑑定を開始 ↗
              </Button>
              <p className="text-[10px] text-slate-600 text-center font-bold italic uppercase tracking-widest flex items-center justify-center gap-2 opacity-50"><Info className="w-3 h-3" /> Professional Cyber Intelligence via Gemini Vision Protocol</p>
            </div>
          </Card>
        </div>
      </div>
      
      <DebugPanel data={{ riskScore, detectedWords, systemOnline, senderInfo, subjectInfo }} toolId="scam-defender" />
      <div className="text-center opacity-20 mt-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Nextra Cyber Defense Command • 2026</p></div>
    </div>
  )
}
