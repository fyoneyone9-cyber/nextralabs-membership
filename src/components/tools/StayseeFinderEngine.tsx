'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, 
  RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, 
  Building2, UserSearch, Camera, Loader2, Download, FileImage, 
  Settings, Shield, Printer, FileText, Smartphone, Truck, Box, Coins, ShoppingCart, CreditCard,
  UserCheck, Target, Car, Wine, Lock
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'scan', label: '① スキャン', icon: Camera },
  { id: 'match', label: '② 照合プロファイル', icon: UserCheck },
  { id: 'lock', label: '③ 鍵自動発行', icon: Lock },
  { id: 'monetize', label: '④ 収益化', icon: Coins },
  { id: 'insights', label: '⑤ レポート', icon: Building2 },
];

const MasterEngine = () => {
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
  const [insightData, setInsightData] = useState<any>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const [profileData, setProfileData] = useState<any>(null);
  const [isProfiling, setIsProfiling] = useState(false);
  
  const [monetizationData, setMonetizationData] = useState<any>(null);
  const [isGeneratingMonetize, setIsGeneratingMonetize] = useState(false);
  
  const [lockKeyData, setLockKeyData] = useState<any>(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  
  const DEVICE_OPTIONS = ['RemoteLock', 'TTLock', 'SwitchBot', 'KEYVOX', 'MIWA', 'GOAL', 'ASSAABLOY', 'Baycom'];
  const PMS_OPTIONS = ['Staysee', 'Beds24', 'AirHost', 'suitebook', 'infor', 'JTBデータコネクト'];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('staysee_user_api_key');
      if (savedKey) setUserApiKey(savedKey);
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('staysee_user_api_key', userApiKey);
    alert('APIキーを保存しました');
    setShowSettings(false);
  };

  const runProfileAnalysis = async () => {
    if (!image || !matchResult) return;
    setIsProfiling(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, stayseeData: matchResult }),
      });
      const data = await res.json();
      if (data.success) setProfileData(data.profileData);
    } catch (e) {
      alert('分析エラー');
    } finally {
      setIsProfiling(false);
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
      if (data.success) setCertData(data.certData);
    } catch (e) {
      alert('証明書生成エラー');
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const generateMonetize = async () => {
    setIsGeneratingMonetize(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder/monetize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemInfo: certData?.itemName || "鑑定済み物品",
          hotelName: "NextraLabs Hotel" 
        }),
      });
      const data = await res.json();
      if (data.success) setMonetizationData(data.monetizationData);
    } catch (e) {
      alert('収益化提案エラー');
    } finally {
      setIsGeneratingMonetize(false);
    }
  };

  const issueLockKey = async () => {
    setIsIssuingKey(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder/lock-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate-key',
          bookingData: { 
            guestName: "米山 文貴", 
            checkIn: "2026-05-07", 
            checkOut: "2026-05-08",
            deviceType: selectedDevice,
            pmsType: selectedPMS
          } 
        }),
      });
      const data = await res.json();
      if (data.success) setLockKeyData(data.keyData);
    } catch (e) {
      alert('鍵発行エラー');
    } finally {
      setIsIssuingKey(false);
    }
  };

  const generateInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stayseeData: matchResult }),
      });
      const data = await res.json();
      if (data.success) setInsightData(data.insightData);
    } catch (e) {
      alert('分析エラー');
    } finally {
      setIsGeneratingInsight(false);
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
        alert('同期完了');
      }
    } catch (e) {
      alert('API連携エラー');
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
      alert("重要：この画像を必ずAIに添付してください！自動保存されました。");
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `staysee-lost-item.png`;
      link.click();
    }
  };

  const FINAL_PROMPT = `【最優先：添付された画像を解析してください】
あなたはホテル管理システム（PMS）の専門家です。今添付した【忘れ物の写真】を元に、PMSの宿泊履歴から持ち主を特定するための詳細分析を行ってください。`;

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-[#050507] border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)] print:border-0 print:shadow-none print:my-0 print:p-0">
      <div className="text-center space-y-2 print:hidden">
        <Badge className="bg-blue-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">HOTEL DX ENGINE</Badge>
        <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl leading-none">AI×ホテルDXシステム【Nextra】</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v3.5-MASTER</div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide print:hidden">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[600px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowSettings(false); }} className={`flex-1 py-5 px-1 rounded-xl font-black text-[9px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id && !showSettings ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-4 h-4" /> <span>{tab.label}</span>
            </button>
          ))}
          <button onClick={() => setShowSettings(!showSettings)} className={`px-8 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 ${showSettings ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
            <Settings className="w-5 h-5" /> <span>設定</span>
          </button>
        </div>
      </div>

      <div className="mt-4 text-left">
        {showSettings ? (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl animate-in zoom-in-95 text-center space-y-8 print:hidden">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">API Configuration</h3>
            <div className="max-w-xl mx-auto space-y-4">
              <input type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} placeholder="sk_xxxxxxxx" className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-amber-500 outline-none" />
              <button onClick={saveApiKey} className="w-full h-16 bg-amber-500 text-black font-black rounded-2xl uppercase italic shadow-xl transition-all active:scale-95">Save Key</button>
            </div>
          </Card>
        ) : activeTab === 'scan' ? (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in text-center print:hidden">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><PackageSearch /> ① 拾得物スキャン</h3>
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
                    <div className="grid grid-cols-3 gap-3 mt-4">
                       <button className="h-16 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</button>
                       <button className="h-16 bg-white/5 border-2 border-blue-500/30 rounded-2xl text-[10px] font-black uppercase italic text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</button>
                       <button className="h-16 bg-white/5 border-2 border-orange-500/30 rounded-2xl text-[10px] font-black uppercase italic text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col relative overflow-hidden">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white font-black italic uppercase"><ClipboardPaste className="text-emerald-400" /> 同期設定</div>
                    <button onClick={() => searchStaysee('latest')} disabled={isApiLoading} className="h-10 bg-emerald-600 text-white px-6 rounded-xl font-black italic text-[10px] uppercase shadow-lg">LIVE SYNC</button>
                 </div>
                 <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="同期ボタンでデータを取得..." className="w-full h-80 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-300 focus:border-emerald-500 outline-none font-mono italic shadow-inner leading-relaxed" />
              </div>
            </div>
            {matchResult && (
               <button onClick={() => setActiveTab('match')} className="w-full h-24 mt-12 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-4 uppercase italic text-2xl active:scale-95 border-b-8 border-emerald-800 active:border-b-0">
                  ② 照合プロファイルを開始 ➔
               </button>
            )}
          </Card>
        ) : activeTab === 'match' ? (
          <div className="animate-in fade-in zoom-in space-y-8 text-left pb-20 print:pb-0">
            <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[4rem] p-10 md:p-16 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden print:bg-white print:text-black print:rounded-none">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white print:hidden"><Target className="w-96 h-96" /></div>
               <div className="relative z-10 space-y-12">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <UserCheck className="text-emerald-500 w-20 h-20 animate-pulse print:text-emerald-600" />
                    <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none print:text-black">AI Matching Profile</h3>
                    <div className="bg-emerald-600 text-white px-8 py-2 rounded-full font-black italic text-xs shadow-lg leading-none print:bg-emerald-50 print:text-emerald-800">Nextra Profile Logic v3.5-MASTER</div>
                  </div>

                  {!profileData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-8">
                       <p className="text-slate-400 text-lg italic text-center max-w-md">物品の属性と宿泊履歴をクロス分析し、持ち主を特定します。</p>
                       <button onClick={runProfileAnalysis} disabled={isProfiling} className="h-24 px-16 bg-white text-slate-950 font-black text-2xl rounded-3xl shadow-2xl transition-all active:scale-95 flex items-center gap-4 italic uppercase">
                          {isProfiling ? <Loader2 className="animate-spin" /> : <Zap className="text-emerald-500" />}
                          プロファイリング開始
                       </button>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="aspect-square bg-black rounded-[3rem] border-2 border-white/10 overflow-hidden relative shadow-2xl">
                          <img src={image || ''} className="w-full h-full object-contain p-8" alt="Evidence" />
                          <div className="absolute top-6 left-6 bg-emerald-500 text-slate-950 font-black px-4 py-1 rounded-full text-[10px] italic">EVIDENCE SCAN</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {profileData.profileTags?.map((tag: string, i: number) => (
                             <Badge key={i} className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-lg text-xs font-black italic"># {tag}</Badge>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-6 text-left bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                         <div className="flex justify-between items-center mb-4">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Matching Probability</p>
                            <div className="text-right leading-none"><p className="text-[8px] font-black text-emerald-500 italic uppercase">Confidence</p><p className="text-5xl font-black text-white italic">{profileData.certaintyLevel}</p></div>
                         </div>
                         <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Reasoning Logic</p>
                            <p className="text-lg text-slate-200 leading-relaxed font-bold italic">{profileData.reasoning}</p>
                         </div>
                         <div className="p-6 bg-emerald-600/10 border-2 border-emerald-500/30 rounded-2xl">
                            <p className="text-[10px] font-black text-emerald-500 uppercase mb-2 italic pl-1">Front Desk Advisor</p>
                            <p className="text-sm text-white font-bold leading-relaxed">「 {profileData.actionAdvise} 」</p>
                         </div>
                         <button onClick={generateCert} disabled={isGeneratingCert} className="w-full h-16 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 uppercase italic flex items-center justify-center gap-3">
                            {isGeneratingCert ? <Loader2 className="animate-spin" /> : <Shield />} 
                            公式保管証明書を作成 ➔
                         </button>
                      </div>
                    </div>
                  )}
                  {certData && (
                    <div className="animate-in slide-in-from-top-4 p-8 bg-emerald-600 border-4 border-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.4)] text-center space-y-4">
                       <p className="text-white text-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-4"><CheckCircle2 /> 証明書の準備が完了しました</p>
                       <button onClick={() => window.print()} className="bg-white text-slate-950 px-10 py-3 rounded-xl font-black italic uppercase text-sm hover:scale-105 transition-all flex items-center gap-2 mx-auto"><Printer /> Print Official Certificate</button>
                    </div>
                  )}
               </div>
            </Card>
            <button onClick={() => { setImage(null); setMatchResult(''); setCertData(null); setProfileData(null); setActiveTab('scan'); }} className="w-full h-20 border-2 border-white/10 text-slate-600 hover:text-white hover:bg-white/5 font-black rounded-3xl uppercase italic transition-all flex items-center justify-center gap-4 text-xl active:scale-95 print:hidden"><RotateCcw className="w-6 h-6" /> RESET PROTOCOL</button>
          </div>
        ) : activeTab === 'lock' ? (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in space-y-12">
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-xl">
                 <Lock className="w-10 h-10 text-emerald-500" />
               </div>
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">PMS × 錠デバイス：API自動連携</h3>
               <p className="text-slate-400 font-bold italic">予約確定と同時に、指定の錠デバイスへ鍵発行命令をデプロイします。</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-8">
                <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-inner space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Shield className="w-32 h-32 text-white" /></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-500 uppercase italic px-2">PMS Select</label>
                        <select 
                          value={selectedPMS} 
                          onChange={(e) => setSelectedPMS(e.target.value)}
                          className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-emerald-500"
                        >
                          {PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-500 uppercase italic px-2">Lock Device Select</label>
                        <select 
                          value={selectedDevice} 
                          onChange={(e) => setSelectedDevice(e.target.value)}
                          className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-emerald-500"
                        >
                          {DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                   </div>
                   <p className="text-sm text-slate-400 font-bold leading-relaxed">{selectedPMS}の予約状況を監視し、{selectedDevice}の有効な鍵を自動生成します。</p>
                   <button 
                    onClick={issueLockKey}
                    disabled={isIssuingKey}
                    className="w-full h-24 bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 text-2xl uppercase italic transition-all active:scale-95"
                   >
                     {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />}
                     連携実行・鍵を発行 ➔
                   </button>
                </div>
              </div>
              <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[300px] flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-30" />
                 <div className="flex items-center gap-4 text-emerald-500 font-black italic uppercase text-xs mb-8"><ClipboardPaste /> Lock Device Output</div>
                 {lockKeyData ? (
                   <div className="space-y-8 animate-in slide-in-from-right-4">
                      <div className="bg-emerald-600/10 p-8 rounded-3xl border-2 border-emerald-500/30 text-center">
                         <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Issued Passcode</p>
                         <p className="text-6xl font-black text-white tracking-widest italic">{lockKeyData.pinCode}</p>
                         <p className="text-xs text-emerald-400 mt-4 font-bold italic">{lockKeyData.message}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Valid From</p>
                            <p className="text-xs font-bold text-slate-300">{lockKeyData.validFrom} 15:00</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Valid To</p>
                            <p className="text-xs font-bold text-slate-300">{lockKeyData.validTo} 10:00</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(lockKeyData.pinCode); alert('パスコードをコピーしました'); }}
                        className="w-full h-16 bg-white/10 text-white font-black rounded-2xl border border-white/10 flex items-center justify-center gap-3 uppercase italic transition-all hover:bg-white/20 active:scale-95"
                      >
                        <Copy size={20} /> Copy Code
                      </button>
                   </div>
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-10 text-center">
                      <p className="font-black uppercase italic tracking-[0.3em] leading-loose">Awaiting Confirmation...</p>
                   </div>
                 )}
              </div>
            </div>
          </Card>
        ) : activeTab === 'monetize' ? (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in space-y-12">
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-xl">
                 <Coins className="w-10 h-10 text-emerald-500" />
               </div>
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">忘れ物返却マネタイズ</h3>
               <p className="text-slate-400 font-bold italic">返却コストを収益に変え、ホスピタリティをマーケティングへ昇華させる。</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-inner space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><ShoppingCart className="w-32 h-32 text-white" /></div>
                   <h4 className="text-xl font-black text-white italic uppercase flex items-center gap-3"><Zap className="text-emerald-500" /> 収益最大化プロトコル</h4>
                   <p className="text-sm text-slate-400 font-bold leading-relaxed">AIが送料・手数料を自動算出し、宿泊者への「ついで買い」を提案します。</p>
                   <button 
                    onClick={generateMonetize}
                    disabled={isGeneratingMonetize || !certData}
                    className="w-full h-24 bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 text-2xl uppercase italic transition-all active:scale-95 disabled:opacity-20"
                   >
                     {isGeneratingMonetize ? <Loader2 className="animate-spin" /> : <Coins />}
                     マネタイズ提案を生成
                   </button>
                </div>
              </div>
              <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[400px] flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-30" />
                 <div className="flex items-center gap-4 text-emerald-500 font-black italic uppercase text-xs mb-8"><ClipboardPaste /> AI Monetize Output</div>
                 {monetizationData ? (
                   <div className="space-y-8 animate-in slide-in-from-right-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Total Fee (預取額)</p>
                            <p className="text-3xl font-black text-white italic">¥{monetizationData.total.toLocaleString()}</p>
                            <p className="text-[9px] text-slate-600 mt-2 font-bold italic">手数料 ¥{monetizationData.baseFee} 込</p>
                         </div>
                         <div className="bg-emerald-600/10 p-6 rounded-2xl border-2 border-emerald-500/30">
                            <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Upsell Suggestion</p>
                            <p className="text-xl font-black text-white italic leading-tight">{monetizationData.upsellItem}</p>
                            <p className="text-xs text-emerald-400 mt-2 font-bold italic">単価: ¥{monetizationData.upsellPrice.toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="bg-[#1a1b26] p-6 rounded-2xl border border-white/5 shadow-inner">
                         <p className="text-[10px] font-black text-slate-500 uppercase mb-3 italic">Message to Guest</p>
                         <p className="text-sm text-slate-200 leading-relaxed font-bold italic">"{monetizationData.message}"</p>
                      </div>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(monetizationData.message); alert('お誘いメッセージをコピーしました'); }}
                        className="w-full h-16 bg-emerald-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic transition-all hover:bg-emerald-500 active:scale-95"
                      >
                        <Copy size={20} /> リンクと文章をコピー
                      </button>
                   </div>
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-10 text-center">
                      <p className="font-black uppercase italic tracking-[0.3em] leading-loose">Waiting for Monetization Strategy...</p>
                   </div>
                 )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="animate-in fade-in zoom-in space-y-8 text-left pb-20">
            <Card className="bg-[#0f111a] border-4 border-blue-500/50 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden print:border-0 print:shadow-none print:p-0 print:bg-white print:text-black print:rounded-none">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white print:hidden"><Zap className="w-96 h-96" /></div>
               <div className="relative z-10 space-y-10">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 print:bg-blue-100 print:shadow-none"><Building2 className="text-white w-12 h-12 print:text-blue-700" /></div>
                    <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none print:text-black print:text-3xl">Hospitality Insight Report</h3>
                  </div>
                  {!insightData ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-8 print:hidden">
                       <p className="text-slate-400 text-lg italic text-center max-w-md">稼働データと忘れ物の傾向をAIが分析し、経営改善のアドバイスを提出します。</p>
                       <button onClick={generateInsight} disabled={isGeneratingInsight} className="h-24 px-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl rounded-3xl shadow-2xl transition-all active:scale-95 flex items-center gap-4 italic uppercase">{isGeneratingInsight ? 'Analyzing...' : 'レポートを生成 📊'}</button>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 space-y-8"><div className="bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 shadow-inner print:bg-white print:border-2 print:border-slate-100 print:p-6 print:rounded-2xl"><p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4 italic print:text-blue-600">Executive Summary</p><p className="text-xl text-white font-bold leading-relaxed italic print:text-black print:text-lg print:not-italic">{insightData.summary}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{insightData.findings.map((f: any, i: number) => (<div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4 print:bg-slate-50 print:border-slate-200"><div className="flex items-center gap-3"><Badge className="bg-blue-500 text-white font-black">{f.room}</Badge></div><p className="text-slate-300 text-sm italic font-bold print:text-black">{f.trend}</p><div className="pt-4 border-t border-white/5"><p className="text-xs font-black text-emerald-400 uppercase mb-2">Recommendation</p><p className="text-slate-200 text-sm font-bold leading-relaxed print:text-slate-700">{f.action}</p></div></div>))}</div></div>
                       <div className="space-y-8"><div className="bg-emerald-600/10 border-2 border-emerald-500/30 p-8 rounded-[2.5rem] shadow-xl print:bg-emerald-50 print:border-emerald-200"><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 italic">ROI Projection</p><p className="text-3xl font-black text-white italic leading-tight print:text-black">{insightData.roi}</p></div><div className="bg-[#1a1c2e] p-8 rounded-[2.5rem] border border-blue-500/20 shadow-inner print:bg-slate-50 print:border-slate-100"><p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 italic">Strategic Tip</p><p className="text-sm text-slate-300 leading-relaxed font-bold italic print:text-slate-600">"{insightData.executiveMessage}"</p></div><button onClick={() => window.print()} className="w-full h-20 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-blue-600 transition-all uppercase italic flex items-center justify-center gap-4 print:hidden">PRINT REPORT</button></div>
                    </div>
                  )}
               </div>
            </div>
          <button onClick={() => { setInsightData(null); setActiveTab('scan'); }} className="w-full h-20 border-2 border-white/10 text-slate-600 hover:text-white hover:bg-white/5 font-black rounded-3xl uppercase italic transition-all flex items-center justify-center gap-4 text-xl active:scale-95 print:hidden"><RotateCcw className="w-6 h-6" /> EXIT REPORTING</button>
        </div>
      )}
      </div>
      <DebugPanel data={{ activeTab, hasImage: !!image, hasResult: !!matchResult }} toolId="hotel-key-sync-master" />
    </div>
  )
}

const StayseeFinderEngineWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Master Node...</div>
})

export default function NoSSRWrapper() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return <div className="min-h-screen bg-[#050507]" />;
  return <StayseeFinderEngineWithNoSSR />;
}
