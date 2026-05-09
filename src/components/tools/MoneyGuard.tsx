'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const MasterEngine = () => {
  const [inputText, setInputText] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [appraisalResult, setAppraisalResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [lastUsage, setLastUsage] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('last_usage_money_guard');
    if (saved) setLastUsage(parseInt(saved));
  }, []);

  const isLimitReached = () => {
    if (!lastUsage) return false;
    const now = new Date();
    const last = new Date(lastUsage);
    return now.toDateString() === last.toDateString();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 🛡️ 管理者（f.yoneyone9@gmail.com）は制限なし
    // ※ 簡易的にlocalStorageやログイン状態で判定可能だが、ここでは一般的な制限を実装
    if (isLimitReached()) {
      alert("⚠️ 1日の利用制限に達しました。家計防衛のため、続きは明日までお待ちください。\n（管理者の場合はログイン状態を確認してください）");
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setFileName(file.name);
      
      // 使用実績を保存
      const now = Date.now();
      setLastUsage(now);
      localStorage.setItem('last_usage_money_guard', now.toString());

      const reader = new FileReader();
      reader.onload = (event) => { 
        setImage(event.target?.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
      
      // 🚀 【重要：AIへの添付を強制する案内】
      alert("⚠️ 重要：この画像を必ずAIに添付してください！\n\n1. この画像は自動的にあなたの端末に保存（ダウンロード）されました。\n2. 下の「防衛指示をコピー」ボタンを押し、ChatGPT等のAI画面で【この画像を添付】して指示を貼り付けてください。");
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `money-guard-evidence.png`;
      link.click();
    }
  };

  const FINAL_PROMPT = `【最優先：添付された画像を解析してください】
あなたはプロの金融・防犯コンサルタントです。
今添付した【レシート/明細/商品画像】を隅々まで分析し、以下の【状況メモ】と合わせて、私の無駄遣いを全力で止めてください。

【状況メモ】: ${inputText || "（添付画像の内容をメインに解析してください）"}

以下の項目で回答してください：
1. 【リスクスコア】: 0-100で判定（高いほど危険）
2. 【心理的弱点】: 画像から読み取れる、私が今陥っている「買い物の罠」
3. 【防衛アドバイス】: 今すぐスマホを置いて、この購入を止めるための具体的な3つのアクション`;

  if (!isClient) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md: rounded-[2rem] md:rounded-[4rem] my-2 md:my-4">
      <div className="text-center space-y-1 md:space-y-3">
        <div className="inline-block bg-red-600 text-white font-bold tracking-tight px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full shadow-lg">Psychological Defense Command v7.0-MASTER</div>
        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none drop-shadow-2xl">AI家計防衛シミュレーター</h1>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-8 mb-12 flex items-start gap-6 shadow-inner">
          <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center shrink-0 text-red-500 font-bold">!</div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-[0.2em] mb-2">Defense Protocol</p>
            <div className="space-y-1 text-xs md:text-sm font-bold text-slate-400">
              <p className="flex items-center gap-3"><span className="text-red-600 ">#1</span> レシートや明細を撮影してアップロード（自動で保存されます）</p>
              <p className="flex items-center gap-3"><span className="text-red-600 ">#2</span> 防衛指示をコピー。AIに**画像を添付**してこの指示を投げる</p>
              <p className="flex items-center gap-3"><span className="text-red-600 ">#3</span> AIのアドバイス結果を右のエリアに戻す</p>
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
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-red-600 transition-all">
                  <span className="text-5xl">📷</span>
                </div>
                <p className="text-3xl text-white font-bold uppercase tracking-[0.1em] group-hover:text-red-500 text-center px-4">
                  TAP TO SCAN<br/>
                  <span className="text-xs text-slate-500 font-bold">RECEPT / STATEMENT</span>
                </p>
                <div className="absolute bottom-10 animate-bounce text-red-600/50">
                  ▼
                </div>
              </div>
            ) : (
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img src={image} alt="Evidence" className="object-contain w-full h-full p-4" />
                <button onClick={() => { setImage(null); setFileName(null); }} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full text-white h-12 w-12 transition-all">✕</button>
                <div className="absolute bottom-6 left-6 bg-emerald-500 text-slate-950 font-bold text-[10px] px-4 py-1 rounded-full animate-pulse">IMAGE_SAVED_FOR_AI</div>
              </div>
            )}

            <div className="space-y-4">
              <textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)}
                placeholder="購入の言い訳や迷いを打ち込んでください..."
                className="w-full h-32 bg-[#0a0b14] border-2 border-white/5 rounded-2xl p-6 text-sm text-white focus:border-red-600 outline-none shadow-inner"
              />
              <button 
                onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                className={`w-full h-24 text-xl font-bold rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-red-600 text-white hover:bg-red-500'}`}
              >
                {copied ? '✅ COPY COMPLETE' : '防衛指示をコピー'}
              </button>
              <div className="grid grid-cols-3 gap-4">
                 <button className="h-24 bg-white/5 border-2 border-white/10 rounded-2xl text-xs font-bold uppercase text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex flex-col items-center justify-center gap-2" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                    <span className="text-2xl">💬</span>
                    CHATGPT
                 </button>
                 <button className="h-24 bg-white/5 border-2 border-white/10 rounded-2xl text-xs font-bold uppercase text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex flex-col items-center justify-center gap-2" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                    <span className="text-2xl">✨</span>
                    GEMINI
                 </button>
                 <button className="h-24 bg-white/5 border-2 border-white/10 rounded-2xl text-xs font-bold uppercase text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex flex-col items-center justify-center gap-2" onClick={() => window.open('https://claude.ai', '_blank')}>
                    <span className="text-2xl">❄️</span>
                    CLAUDE
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0b14] rounded-[3.5rem] p-10 border border-white/5 shadow-inner flex flex-col gap-6 relative">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-500/20">
                    <span className="text-red-500 text-2xl font-bold">!</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">分析結果を戻す</h3>
                </div>
                <div className="text-right leading-none">
                  <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Dopamine Risk</p>
                  <p className="text-4xl font-bold text-white ">{riskScore}%</p>
                </div>
             </div>
             
             <textarea 
               value={appraisalResult} 
               onChange={(e) => setAppraisalResult(e.target.value)} 
               placeholder="AIからの厳しいアドバイスをペースト..." 
               className="flex-1 bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 text-base text-slate-300 focus:border-red-600 outline-none font-mono shadow-inner min-h-[400px] leading-relaxed" 
             />
             
             {appraisalResult && (
                <div className="p-8 bg-red-600 border-4 border-red-500 rounded-[2rem] shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-in zoom-in-95 duration-500 text-center space-y-4">
                   <div className="flex items-center justify-center gap-4 text-white font-bold uppercase tracking-tight text-xl">
                      <span className="animate-ping">🚨</span> DEFENSE SEQUENCE ACTIVE <span className="animate-ping">🚨</span>
                   </div>
                   <p className="text-white text-lg font-bold leading-relaxed">
                      警告：脳がドーパミンに支配されています！<br/>
                      今すぐブラウザを閉じ、このレポートを3回読み直してください。<br/>
                      冷静になるまで購入ボタンを押すことは許可されません。
                   </p>
                   <div className="flex justify-center gap-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                   </div>
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
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden text-left">
      <NoSSRWrapper />
    </div>
  );
}
