'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const MasterEngine = () => {
  const [inputText, setInputText] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [appraisalResult, setAppraisalResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const DANGER_KEYWORDS = ["即日現金", "身分証不要", "テレグラム", "Telegram", "シグナル", "Signal", "運び屋", "受け子", "出し子", "高額報酬", "ホワイト案件", "裏バイト", "未経験歓迎", "ノルマなし"];

  const performRealtimeAnalysis = useCallback((text: string) => {
    const found = DANGER_KEYWORDS.filter(word => text.toLowerCase().includes(word.toLowerCase()));
    setDetectedWords(found);
    const score = Math.min(100, found.length * 25 + (text.length > 50 ? 10 : 0));
    setRiskScore(score);
  }, []);

  useEffect(() => {
    if (isClient) performRealtimeAnalysis(inputText);
  }, [inputText, isClient, performRealtimeAnalysis]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => { 
        setImage(event.target?.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const FINAL_PROMPT = `あなたはプロの金融・防犯コンサルタントです。
添付された【証拠画像（レシート/明細）】および【入力テキスト】を解析し、無駄遣いや詐欺のリスクを判定してください。

1. 【リスクスコア】: 0-100で判定
2. 【心理的要因】: なぜこの支出が起きているか（衝動買い、ドーパミン、等）
3. 【防衛アドバイス】: 今すぐこの支出を止めるための具体的なアクション`;

  if (!isClient) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3">
        <div className="inline-block bg-red-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">Psychological Defense Command v5.5-MASTER</div>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Money Guard</h1>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-8 mb-12 flex items-start gap-6 shadow-inner">
          <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center shrink-0 text-red-500">
             <span className="text-xl">✨</span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-red-500/70 uppercase tracking-[0.2em] italic mb-2">Defense Protocol</p>
            <div className="space-y-1 text-xs md:text-sm font-bold text-slate-400">
              <p className="flex items-center gap-3"><span className="text-red-600 italic">#1</span> レシートや明細を撮影してアップロード</p>
              <p className="flex items-center gap-3"><span className="text-red-600 italic">#2</span> 防衛指示をコピーしてAI三台体制へ投げ、画像をドロップ</p>
              <p className="flex items-center gap-3"><span className="text-red-600 italic">#3</span> AIのアドバイス結果を右のエリアへ戻す</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden bg-white/5"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <span className="text-4xl text-slate-800 group-hover:text-red-600 transition-colors">📷</span>
                <p className="text-2xl text-slate-700 font-black italic uppercase tracking-[0.1em] group-hover:text-slate-500">Drop Receipt/Slip</p>
              </div>
            ) : (
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black animate-in zoom-in-95">
                <img src={image} alt="Evidence" className="object-contain w-full h-full p-4" />
                <button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full text-white h-12 w-12 transition-all">✕</button>
              </div>
            )}

            <div className="space-y-4">
              <textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)}
                placeholder="購入を迷っている商品名や金額を自由に入力..."
                className="w-full h-32 bg-[#0a0b14] border-2 border-white/5 rounded-2xl p-6 text-sm text-white focus:border-red-600 outline-none italic shadow-inner"
              />
              <button 
                onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-red-600 text-white hover:bg-red-500'}`}
              >
                {copied ? '✅ 指示をコピー完了' : '防衛指示をコピーする'}
              </button>
              <div className="grid grid-cols-3 gap-3">
                 <button className="h-14 bg-[#0a0b14] border border-white/5 rounded-xl text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</button>
                 <button className="h-14 bg-[#0a0b14] border border-white/5 rounded-xl text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</button>
                 <button className="h-14 bg-[#0a0b14] border border-white/5 rounded-xl text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</button>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0b14] rounded-[3.5rem] p-10 border border-white/5 shadow-inner flex flex-col gap-6 relative">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-500/20">
                    <span className="text-red-500 text-2xl font-black">!</span>
                  </div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">分析結果を戻す</h3>
                </div>
                <div className="text-right leading-none">
                  <p className="text-[10px] font-black text-red-500 uppercase italic mb-1">Dopamine Risk</p>
                  <p className="text-4xl font-black text-white italic">{riskScore}%</p>
                </div>
             </div>
             
             <textarea 
               value={appraisalResult} 
               onChange={(e) => setAppraisalResult(e.target.value)} 
               placeholder="AIからの防衛アドバイスをここにペースト..." 
               className="flex-1 bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 text-base text-slate-300 focus:border-red-600 outline-none font-mono leading-relaxed shadow-inner min-h-[400px] italic" 
             />
             
             {appraisalResult && (
                <div className="p-6 bg-red-600/10 border-2 border-red-600/30 rounded-3xl animate-in slide-in-from-bottom-4">
                   <p className="text-red-500 font-black italic uppercase text-xs mb-2 flex items-center gap-2">🛡️ Defense Active</p>
                   <p className="text-slate-300 text-sm font-bold italic leading-relaxed">支出の抑止が発動されました。冷静さを取り戻すまで、ブラウザを閉じることを推奨します。</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

export default function MoneyGuard() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden">
      <NoSSRWrapper />
    </div>
  );
}
