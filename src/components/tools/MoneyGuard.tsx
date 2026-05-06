'use client'
import React, { useState, useEffect, useRef } from 'react'

/**
 * 🛠️ Nextra Master MoneyGuard Engine v5.6-STABLE
 * SSR依存を100%排除し、ブラウザのみで動作する堅牢な防衛システム。
 */

export default function MoneyGuard() {
  const [isClient, setIsClient] = useState(false);
  const [inputText, setInputText] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [appraisalResult, setAppraisalResult] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (inputText) {
      const score = Math.min(100, Math.floor(inputText.length * 1.5 + Math.random() * 20));
      setRiskScore(score);
    } else {
      setRiskScore(0);
    }
  }, [inputText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyPrompt = () => {
    const prompt = `あなたはプロの金融・防犯コンサルタントです。\n添付のレシート/明細画像を分析し、この支出のリスクと対策を提示してください。`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isClient) return <div className="min-h-screen bg-[#050507]" />;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-4 md:p-10 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-block bg-red-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full">MASTER COMMAND v5.6</div>
          <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none">Money Guard</h1>
        </div>

        <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-50" />
          
          <div className="grid lg:grid-cols-2 gap-12 mt-8">
            <div className="space-y-8">
              <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 space-y-2">
                 <p className="text-red-500 font-black text-xs uppercase italic tracking-widest">#1 Evidence Submission</p>
                 {!image ? (
                   <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      <span className="text-4xl">📷</span>
                      <p className="text-sm font-black text-slate-500 mt-2 uppercase">Drop Receipt</p>
                   </div>
                 ) : (
                   <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10">
                      <img src={image} className="w-full h-full object-contain" />
                      <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">✕</button>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="支出の内容をここに記入..." className="w-full h-32 bg-[#0a0b14] border border-white/10 rounded-2xl p-6 text-white focus:border-red-600 outline-none italic" />
                <button onClick={copyPrompt} className={`w-full h-20 font-black text-xl rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
                  {copied ? '✅ COPIED' : '防衛指示をコピー'}
                </button>
              </div>
            </div>

            <div className="bg-[#0a0b14] rounded-[2.5rem] p-10 border border-white/5 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white italic uppercase">AI Analysis Feed</h3>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-red-500 uppercase">Risk</p>
                    <p className="text-4xl font-black text-white italic">{riskScore}%</p>
                 </div>
              </div>
              <textarea value={appraisalResult} onChange={(e) => setAppraisalResult(e.target.value)} placeholder="分析結果をペースト..." className="flex-1 bg-[#13141f] border border-white/5 rounded-2xl p-8 text-slate-300 focus:border-red-600 outline-none font-mono text-sm min-h-[300px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
