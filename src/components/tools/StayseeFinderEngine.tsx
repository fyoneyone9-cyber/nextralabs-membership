'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, Building2, UserSearch, Camera, Loader2, Download, FileImage } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 拾得物スキャン', icon: Camera },
  { id: 'match', label: '② 顧客マッチング', icon: UserSearch },
];

export default function StayseeFinderEngine() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // 🚀 【重要：AIへの添付を強制する案内】
      alert("⚠️ 重要：この画像を必ずAIに添付してください！\n\n1. この画像は自動的にあなたの端末に保存（ダウンロード）されました。\n2. 下の「照合指示をコピー」ボタンを押し、ChatGPT等のAI画面で【この画像を添付】して指示を貼り付けてください。");

      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `staysee-lost-item.png`;
      link.click();
    }
  };

  const useSample = () => {
    const sampleUrl = "https://membership-site-nextralabos.vercel.app/samples/lost-item.jpg";
    setImage(sampleUrl);
    const a = document.createElement("a"); a.href = sampleUrl; a.download = "staysee-lost-item.jpg"; a.click();
    alert("⚠️ サンプル画像を保存しました。AI（ChatGPT/Gemini等）にこの画像を添付して「照合指示」を送信してください。");
  };

  const FINAL_PROMPT = `【最優先：添付された画像を解析してください】
あなたはホテル管理システム（PMS）の専門家です。
今添付した【忘れ物の写真】を隅々まで分析し、宿泊管理システム（Staysee）の宿泊履歴から持ち主を特定するための情報を出力してください。

分析項目：
1. 物品の名称と特徴（ブランド、色、型番など）
2. 想定される持ち主の属性（性別、年齢層など）
3. 発見場所に基づいたStayseeでの検索キーワード提案`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl shadow-emerald-500/5">
      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20"><Lightbulb className="text-white" /></div>
      <div className="space-y-1 text-left">
        <p className="text-sm font-black text-emerald-500 uppercase italic tracking-widest opacity-70">PMS Protocol</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-lg text-slate-300 font-bold flex items-center gap-2 leading-tight"><span className="text-emerald-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-[#050507] border-8 border-emerald-500/50 rounded-[4rem] my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">HOTEL DX ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl leading-none">Staysee AI Finder</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[10px] tracking-widest shadow-lg">v2.0-MASTER</div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[500px] md:min-w-full rounded-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><PackageSearch /> ① 拾得物スキャン</h3>
            {renderGuide(['忘れ物を撮影してアップロード（保存）', '照合指示をコピーしてAIに画像を添付して投げる', 'AIから返ってきた結果を右側に戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-emerald-500 transition-all">
                        <Camera className="h-10 w-10 text-slate-500 group-hover:text-emerald-500" />
                      </div>
                      <p className="text-2xl text-white font-black italic uppercase tracking-[0.1em] group-hover:text-emerald-500 text-center px-4">
                        TAP TO SCAN<br/>
                        <span className="text-[10px] text-slate-500 font-bold">DROP LOST ITEM</span>
                      </p>
                      <div className="absolute bottom-6 animate-bounce text-emerald-600/50">▼</div>
                    </div>
                    <button onClick={useSample} className="w-full h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase text-sm"><Download className="w-5 h-5" /> サンプルを保存して試す</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-video max-w-[450px] mx-auto rounded-3xl overflow-hidden border-4 border-emerald-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Found" className="object-contain w-full h-full p-4" />
                       <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10 text-white transition-all">✕</button>
                       <div className="absolute bottom-4 left-6 bg-emerald-500 text-slate-950 font-black text-[8px] px-3 py-1 rounded-full animate-pulse uppercase">ITEM_SAVED_FOR_AI</div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                      {copied ? '✅ COPY COMPLETE' : '照合指示をコピー'}
                    </button>
                    <div className="grid grid-cols-3 gap-3">
                       <button className="h-20 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                          <span className="text-xl">💬</span> CHATGPT
                       </button>
                       <button className="h-20 bg-white/5 border-2 border-blue-500/30 rounded-2xl text-[10px] font-black uppercase italic text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                          <span className="text-xl">✨</span> GEMINI
                       </button>
                       <button className="h-20 bg-white/5 border-2 border-orange-500/30 rounded-2xl text-[10px] font-black uppercase italic text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://claude.ai', '_blank')}>
                          <span className="text-xl">❄️</span> CLAUDE
                       </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-30" />
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-emerald-400" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">照合結果を戻す</h3></div>
                 <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="AIから届いたStaysee検索情報をペースト..." className="w-full h-80 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-300 focus:border-emerald-500 outline-none font-mono italic shadow-inner leading-relaxed" />
              </div>
            </div>
            {matchResult && (
               <button onClick={() => setActiveTab('match')} className="w-full h-24 mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 uppercase italic text-2xl group transition-all active:scale-95 border-b-4 border-emerald-800 active:border-b-0">
                  ② 顧客マッチングを確認 <ArrowRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
               </button>
            )}
          </Card>
        )}

        {activeTab === 'match' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20 text-left">
            <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[4rem] p-10 md:p-20 shadow-[0_0_100px_rgba(16,185,129,0.1)] border-l-[16px] border-l-emerald-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Building2 className="w-96 h-96" /></div>
               <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-16 flex items-center justify-center gap-6 relative z-10"><UserSearch className="text-emerald-500 animate-pulse w-16 h-16" /> Staysee 照合レポート</h3>
               <div className="bg-slate-950/80 rounded-[3rem] p-16 border-2 border-white/5 text-2xl text-slate-100 leading-loose italic whitespace-pre-wrap shadow-inner relative z-10 font-sans tracking-tight">
                  {matchResult || "データがありません。"}
               </div>
               <div className="mt-12 p-8 bg-emerald-600 border-4 border-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-in zoom-in-95 duration-500 text-center space-y-4 relative z-10">
                   <div className="flex items-center justify-center gap-4 text-white font-black italic uppercase tracking-widest text-xl">
                      <span className="animate-ping">✅</span> MATCHING ANALYSIS COMPLETE <span className="animate-ping">✅</span>
                   </div>
                   <p className="text-white text-lg font-black italic leading-relaxed">
                      照合完了：提示された情報をStayseeで即座に検索し、<br/>
                      顧客への連絡または拾得物リストへの登録を行ってください。
                   </p>
                </div>
            </Card>
            <button onClick={() => { setImage(null); setMatchResult(''); setActiveTab('scan'); }} className="w-full h-20 border-2 border-white/10 text-slate-600 hover:text-white hover:bg-white/5 font-black rounded-3xl uppercase italic transition-all flex items-center justify-center gap-4 text-xl shadow-xl active:scale-95"><RotateCcw className="w-6 h-6" /> RESET PROTOCOL</button>
          </div>
        )}
      </div>
    </div>
  )
}
