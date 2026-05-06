'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, 
  RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, 
  Building2, UserSearch, Camera, Loader2, Download, FileImage, 
  Settings, Shield, Printer 
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

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
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [certData, setCertData] = useState<any>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('staysee_user_api_key');
      if (savedKey) setUserApiKey(savedKey);
    }
  }, []);

  const saveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('staysee_user_api_key', userApiKey);
      alert('Staysee APIキーを保存しました');
      setShowSettings(false);
    }
  };

  const generateCert = async () => {
    if (!image) return;
    setIsGeneratingCert(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder/generate-cert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, matchResult }),
      });
      const data = await res.json();
      if (data.success) {
        setCertData(data.certData);
        setActiveTab('match');
      }
    } catch (e) {
      alert('証明書生成エラー');
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const searchStaysee = async (query: string) => {
    setIsApiLoading(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search-booking', query, userApiKey }),
      });
      const data = await res.json();
      if (data.success) {
        setMatchResult(JSON.stringify(data.results, null, 2));
        alert('Staysee同期完了');
      }
    } catch (e) {
      alert('Staysee API連携エラー');
    } finally {
      setIsApiLoading(false);
    }
  };

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
      alert("⚠️ 重要：この画像を必ずAIに添付してください！自動保存されました。");
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `staysee-lost-item.png`;
      link.click();
    }
  };

  const FINAL_PROMPT = `【最優先：添付された画像を解析してください】
あなたはホテル管理システム（PMS）の専門家です。今添付した【忘れ物の写真】を元に、Stayseeの宿泊履歴から持ち主を特定するための詳細分析を行ってください。`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-[#050507] border-8 border-emerald-500/50 rounded-[4rem] my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">HOTEL DX ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl leading-none">Staysee AI Finder</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[10px] tracking-widest shadow-lg">v3.0-MASTER</div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[500px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowSettings(false); }} className={`flex-1 py-5 px-2 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id && !showSettings ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
          <button onClick={() => setShowSettings(!showSettings)} className={`px-8 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 ${showSettings ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
            <Settings className="w-5 h-5" /> <span>設定</span>
          </button>
        </div>
      </div>

      <div className="mt-4 text-left">
        {showSettings ? (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl animate-in zoom-in-95 text-center space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Staysee API Configuration</h3>
            <div className="max-w-xl mx-auto space-y-4">
              <input type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} placeholder="sk_xxxxxxxx" className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-amber-500 outline-none" />
              <button onClick={saveApiKey} className="w-full h-16 bg-amber-500 text-black font-black rounded-2xl uppercase italic shadow-xl transition-all active:scale-95">Save Key</button>
            </div>
          </Card>
        ) : activeTab === 'scan' ? (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><PackageSearch /> ① 拾得物スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner relative overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
                    <Camera className="h-10 w-10 text-slate-500" />
                    <p className="text-2xl text-white font-black italic uppercase">TAP TO SCAN</p>
                    <div className="absolute bottom-6 animate-bounce text-emerald-600/50">▼</div>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="relative aspect-video max-w-[450px] mx-auto rounded-3xl overflow-hidden border-4 border-emerald-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Found" className="object-contain w-full h-full p-4" />
                       <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10 text-white">✕</button>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white'}`}>照合指示をコピー</button>
                  </div>
                )}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col relative overflow-hidden">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white font-black italic uppercase"><ClipboardPaste className="text-emerald-400" /> Staysee 同期</div>
                    <button onClick={() => searchStaysee('latest')} disabled={isApiLoading} className="h-10 bg-emerald-600 text-white px-6 rounded-xl font-black italic text-[10px] uppercase shadow-lg">LIVE SYNC</button>
                 </div>
                 <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="同期ボタンでデータを取得..." className="w-full h-80 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-300 focus:border-emerald-500 outline-none font-mono italic leading-relaxed" />
              </div>
            </div>
            {matchResult && (
               <button onClick={generateCert} disabled={isGeneratingCert} className="w-full h-24 mt-12 bg-emerald-600 text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-2xl group transition-all active:scale-95 border-b-4 border-emerald-800 active:border-b-0">
                  {isGeneratingCert ? 'GENERATING...' : '② AI保管証明書を発行 📜'}
               </button>
            )}
          </Card>
        ) : (
          <div className="animate-in fade-in zoom-in space-y-8 text-left pb-20">
            <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[4rem] p-10 md:p-20 shadow-[0_0_100px_rgba(16,185,129,0.1)] border-l-[16px] border-l-emerald-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Building2 className="w-96 h-96" /></div>
               <div className="relative z-10 space-y-12">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Shield className="text-emerald-500 w-24 h-24 animate-pulse" />
                    <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">AI Official Certificate</h3>
                    <div className="bg-emerald-600 text-white px-8 py-2 rounded-full font-black italic text-sm shadow-lg leading-none">NextraLabs Verification v3.0-MASTER</div>
                  </div>

                  {certData ? (
                    <div className="grid lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="aspect-square bg-black rounded-[3rem] border-2 border-white/10 overflow-hidden relative shadow-2xl">
                          <img src={image || ''} className="w-full h-full object-contain p-8" />
                          <div className="absolute top-6 left-6 bg-emerald-500 text-slate-950 font-black px-4 py-1 rounded-full text-[10px] italic leading-none">ORIGINAL EVIDENCE</div>
                        </div>
                      </div>
                      <div className="space-y-6 text-left bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                         <div><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Management ID</p><p className="text-xl font-mono text-white">{certData.certId}</p></div>
                         <div><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Item Name</p><p className="text-3xl font-black text-white italic">{certData.itemName}</p></div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-slate-500 uppercase">Grade</p><p className="text-2xl font-black text-emerald-400 italic">{certData.status}</p></div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-slate-500 uppercase">Expiry</p><p className="text-xs font-black text-white">{certData.expiry}</p></div>
                         </div>
                         <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</p><p className="text-sm text-slate-300 italic">{certData.description}</p></div>
                         <div className="pt-6 border-t border-white/5"><p className="text-sm text-emerald-400 font-bold italic leading-relaxed">" {certData.message} "</p></div>
                         <button onClick={() => window.print()} className="w-full h-16 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all uppercase italic flex items-center justify-center gap-3 mt-4"><Printer className="w-6 h-6" /> Print Certificate</button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/80 rounded-[3rem] p-16 border-2 border-white/5 text-2xl text-slate-100 italic text-center">{matchResult || "Data Pending..."}</div>
                  )}
               </div>
            </Card>
            <button onClick={() => { setImage(null); setMatchResult(''); setCertData(null); setActiveTab('scan'); }} className="w-full h-20 border-2 border-white/10 text-slate-600 hover:text-white hover:bg-white/5 font-black rounded-3xl uppercase italic transition-all flex items-center justify-center gap-4 text-xl active:scale-95"><RotateCcw className="w-6 h-6" /> RESET PROTOCOL</button>
          </div>
        )}
      </div>
      <DebugPanel data={{ activeTab, hasImage: !!image, hasResult: !!matchResult }} toolId="staysee-finder-master" />
    </div>
  )
}
