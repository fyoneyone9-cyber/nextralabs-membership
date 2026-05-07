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
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [certData, setCertData] = useState(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [insightData, setInsightData] = useState(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const [profileData, setProfileData] = useState(null);
  const [isProfiling, setIsProfiling] = useState(false);
  
  const [monetizationData, setMonetizationData] = useState(null);
  const [isGeneratingMonetize, setIsGeneratingMonetize] = useState(false);
  
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  
  const DEVICE_OPTIONS = ['RemoteLock', 'TTLock', 'SwitchBot', 'KEYVOX', 'MIWA', 'GOAL', 'ASSAABLOY', 'Baycom'];
  const PMS_OPTIONS = ['Staysee', 'Beds24', 'AirHost', 'suitebook', 'infor', 'JTBデータコネクト'];

  const fileInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const savedKey = localStorage.getItem('staysee_user_api_key');
    if (savedKey) setUserApiKey(savedKey);
  }, []);

  const searchStaysee = async (query) => {
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
    } catch (e) { alert('API連携エラー'); } finally { setIsApiLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result); setIsProcessing(false); };
      reader.readAsDataURL(file);
      alert("重要：この画像を必ずAIに添付してください！");
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
          bookingData: { deviceType: selectedDevice, pmsType: selectedPMS } 
        }),
      });
      const data = await res.json();
      if (data.success) setLockKeyData(data.keyData);
    } catch (e) { alert('鍵発行エラー'); } finally { setIsIssuingKey(false); }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600">HOTEL DX ENGINE</Badge>
        <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">AI×ホテルDXシステム【Nextra】</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[10px] tracking-widest shadow-lg">v3.5-MASTER</div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[600px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex-1 py-5 px-1 rounded-xl font-black text-[9px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative " + (activeTab === tab.id ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white')}>
              <tab.icon className="w-4 h-4" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-left">
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><PackageSearch /> ① 拾得物スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Camera className="h-10 w-10 text-slate-500" />
                    <p className="text-2xl text-white font-black italic uppercase text-center">TAP TO SCAN</p>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-emerald-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Found" className="object-contain w-full h-full p-4" />
                       <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10 text-white text-center">✕</button>
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
          </Card>
        )}

        {activeTab === 'lock' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in space-y-12">
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-xl">
                 <Lock className="w-10 h-10 text-emerald-500" />
               </div>
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none text-center">PMS × 錠デバイス：API自動連携</h3>
               <p className="text-slate-400 font-bold italic text-center">予約確定と同時に、指定の錠デバイスへ鍵発行命令をデプロイします。</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-8">
                <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-inner space-y-8 relative overflow-hidden">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-500 uppercase italic px-2">PMS Select</label>
                        <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-emerald-500">
                          {PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-500 uppercase italic px-2">Lock Device Select</label>
                        <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-emerald-500">
                          {DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                   </div>
                   <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 text-2xl uppercase italic transition-all active:scale-95">
                     {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />} 連携実行・鍵を発行 ➔
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
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-10 text-center">
                      <p className="font-black uppercase italic tracking-[0.3em] leading-loose text-center">Awaiting Confirmation...</p>
                   </div>
                 )}
              </div>
            </div>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="hotel-dx-master-v3.5" />
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Master Node...</div> });
export default function HotelPage() { return <NoSSR />; }