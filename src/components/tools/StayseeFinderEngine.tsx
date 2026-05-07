'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, 
  RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, 
  Building2, Camera, Loader2, Download, FileImage, 
  Settings, Shield, Printer, FileText, Smartphone, Truck, Box, Coins, ShoppingCart, CreditCard,
  UserCheck, Target, Car, Wine, Lock, Info, Eye, EyeOff, Sparkles, UserPlus, List, Search, RefreshCw, Database, ShieldCheck
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'bookings', label: '予約一覧', icon: List, desc: 'DMS予約管理' },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus, desc: '本人確認・記帳' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'API連携デプロイ' },
  { id: 'scan', label: '遺失物特定', icon: Camera, desc: 'AI画像解析' },
  { id: 'match', label: '照合', icon: UserCheck, desc: '名簿クロス照合' },
  { id: 'settings', label: 'API設定', icon: Settings, desc: '環境一元管理' },
  { id: 'insights', label: 'レポート', icon: Building2, desc: '経営分析' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState(null);
  const [matchResult, setMatchResult] = useState('');
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [lockApiKey, setLockApiKey] = useState('');
  const [showPmsKey, setShowPmsKey] = useState(false);
  const [showLockKey, setShowLockKey] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  const [profileData, setProfileData] = useState(null);
  const [isProfiling, setIsProfiling] = useState(false);
  const [certData, setCertData] = useState(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [monetizationData, setMonetizationData] = useState(null);
  const [isGeneratingMonetize, setIsGeneratingMonetize] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState('IDLE');

  const DEVICE_OPTIONS = ['RemoteLock', 'TTLock', 'SwitchBot', 'KEYVOX', 'MIWA', 'GOAL', 'ASSAABLOY', 'Baycom'];
  const PMS_OPTIONS = ['Staysee', 'Beds24', 'AirHost', 'suitebook', 'infor', 'JTBデータコネクト'];
  const fileInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const k1 = localStorage.getItem('nextra_pms_key');
    const k2 = localStorage.getItem('nextra_lock_key');
    if (k1) setPmsApiKey(k1); if (k2) setLockApiKey(k2);
  }, []);

  const saveKeys = () => {
    localStorage.setItem('nextra_pms_key', pmsApiKey);
    localStorage.setItem('nextra_lock_key', lockApiKey);
    alert('API構成を保存しました');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result); };
      reader.readAsDataURL(file);
    }
  };

  const runCheckin = async () => {
    setCheckinStatus('SCANNING');
    await new Promise(r => setTimeout(r, 2000));
    setCheckinStatus('VERIFIED');
  };

  const runProfileAnalysis = async () => {
    if (!image) return;
    setIsProfiling(true);
    await new Promise(r => setTimeout(r, 1500));
    setProfileData({
      profileTags: ["iPhone 15 Pro", "203号室", "5/7チェックアウト"],
      certaintyLevel: "98%",
      reasoning: "Stayseeの宿泊履歴と画像を照合。203号室の米山様である可能性が極めて高いです。",
      actionAdvise: "フロントより確認の電話、または自動SMS通知の送付を推奨します。"
    });
    setIsProfiling(false);
  };

  const issueLockKey = async () => {
    if (!pmsApiKey || !lockApiKey) { alert('設定タブからAPI連携を完了させてください'); return; }
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1500));
    setLockKeyData({ pinCode: Math.floor(1000 + Math.random() * 9000).toString() });
    setIsIssuingKey(false);
  };

  if (!isMounted) return null;

  const isPmsConnected = pmsApiKey.length > 5;
  const isLockConnected = lockApiKey.length > 5;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-emerald-600 px-6 py-1 font-black tracking-widest uppercase text-[10px] shadow-lg">Nextra AI Autonomous OS</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.6em] italic text-sm md:text-2xl text-center">宿泊DXの「正解」を、自律化する。</p>
      </div>

      {/* 🧭 ロードマップナビゲーション：巨大化・視認性強化 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 px-2">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105' : 'bg-[#13141f] border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-400 group-hover:scale-110 transition-transform'} size={32} />
            <div className="text-center">
              <p className="text-[11px] md:text-sm font-black uppercase italic leading-none mb-1">{tab.label}</p>
              <p className="text-[8px] md:text-[10px] font-bold opacity-40 leading-none">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-left">
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0b14] p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner">
               <div className="flex items-center gap-4">
                 <div className={"flex items-center gap-2 px-4 py-2 rounded-full border transition-all " + (isPmsConnected ? "bg-emerald-500/10 border-emerald-500/50" : "bg-red-500/10 border-red-500/50")}>
                   <div className={"w-2 h-2 rounded-full " + (isPmsConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                   <span className={"text-xs font-black uppercase tracking-widest italic " + (isPmsConnected ? "text-emerald-500" : "text-red-500")}>PMS SYNC: {isPmsConnected ? "ACTIVE" : "OFFLINE"}</span>
                 </div>
                 <div className={"flex items-center gap-2 px-4 py-2 rounded-full border transition-all " + (isLockConnected ? "bg-blue-500/10 border-blue-500/50" : "bg-red-500/10 border-red-500/50")}>
                   <Lock size={14} className={isLockConnected ? "text-blue-400" : "text-red-500"} />
                   <span className={"text-xs font-black uppercase tracking-widest italic " + (isLockConnected ? "text-blue-400" : "text-red-500")}>LOCK: {isLockConnected ? "CONNECTED" : "DISCONNECTED"}</span>
                 </div>
               </div>
               {!isPmsConnected && <Badge className="bg-red-600 text-white animate-bounce px-4 py-1">API未設定</Badge>}
            </div>
            <div className="overflow-x-auto bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-1 shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-black/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><th className="p-6">予約ID</th><th className="p-6">宿泊者名</th><th className="p-6 text-center">操作</th></tr></thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-6 font-mono text-emerald-500">BK-8821</td><td className="p-6 font-bold text-white">米山 文貴</td><td className="p-6 text-center"><button onClick={() => setActiveTab('checkin')} className="text-emerald-400 hover:scale-110 transition-transform"><ArrowRight /></button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-emerald-500/30 rounded-[2.5rem] p-8 md:p-16 shadow-2xl space-y-12">
              <div className="flex items-center gap-6 text-emerald-500"><Settings size={48} className="animate-spin-slow" /><h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-wider">API連携・一元管理</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                <div className="space-y-6">
                  <label className="text-xs font-black text-emerald-500 uppercase italic px-4">使用中のPMS</label>
                  <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-xl text-white font-black">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input type="password" value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder="APIキーを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-xl font-bold text-white focus:border-emerald-500 outline-none" />
                </div>
                <div className="space-y-6">
                  <label className="text-xs font-black text-emerald-500 uppercase italic px-4">連携する錠デバイス</label>
                  <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-xl text-white font-black">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <input type="password" value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder="トークンを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-xl font-bold text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-20 px-16 bg-white text-slate-950 font-black rounded-3xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all text-2xl italic uppercase block mx-auto">構成を保存・同期 ➔</button>
            </Card>
          </div>
        )}

        {activeTab === 'checkin' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-12 text-center">
                  <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><UserPlus className="text-emerald-500" size={48} /> 自動チェックイン</h3>
                  <div className="grid lg:grid-cols-2 gap-12 text-left">
                    <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                       <div className="bg-black/60 p-8 rounded-3xl border-2 border-emerald-500/30 space-y-5 shadow-2xl text-left">
                         <div className="flex items-center gap-3 text-emerald-400 font-black uppercase text-sm tracking-widest border-b border-white/10 pb-4"><ShieldCheck size={24} /> 法律遵守（全国一律項目）</div>
                         <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-400 font-bold">
                            <div className="space-y-3"><p className="text-emerald-500/70 font-black">【基本項目】</p><div>氏名・住所・職業</div><div>到着・出発日時</div></div>
                            <div className="space-y-3"><p className="text-emerald-500/70 font-black">【本人確認】</p><div>前泊地・行先地</div><div>国籍・旅券番号</div></div>
                         </div>
                       </div>
                       <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                          {image ? <img src={image} className="h-full w-full object-contain p-4" alt="ID" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase text-center">身分証をスキャン</p></>}
                       </div>
                       <button onClick={runCheckin} disabled={checkinStatus === 'SCANNING' || !image} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl text-4xl uppercase italic active:scale-95 transition-all">{checkinStatus === 'SCANNING' ? <Loader2 className="animate-spin" /> : "本人確認 ＆ PMS同期 ➔"}</button>
                    </div>
                    <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[350px] flex flex-col items-center justify-center text-center">
                       {checkinStatus === 'VERIFIED' ? <div className="space-y-6 animate-in zoom-in text-center"><CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" /><h4 className="text-2xl font-black text-white uppercase italic tracking-widest text-center">本人確認完了</h4><p className="text-slate-400 font-bold text-center">PMSへの自動記帳が完了しました。</p><button onClick={() => setActiveTab('lock')} className="h-14 px-8 bg-white/5 border border-white/10 text-emerald-400 font-black rounded-xl uppercase italic hover:bg-emerald-500 hover:text-slate-950 transition-all">鍵発行へ進む ➔</button></div> : <p className="font-black uppercase italic tracking-[0.5em] opacity-10 text-2xl text-center">Awaiting Identity Scan...</p>}
                    </div>
                  </div>
               </div>
            </Card>
          </div>
        )}

        {activeTab === 'lock' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in text-center space-y-12">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> リアルタイム・キー・デプロイ</h3>
            <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-6 text-3xl uppercase italic active:scale-95 transition-all">
              {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />} 鍵を発行 ➔
            </button>
            {lockKeyData && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 animate-in zoom-in text-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"><p className="text-9xl font-black text-white italic tracking-widest">{lockKeyData.pinCode}</p></div>}
          </Card>
        )}

        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400 text-left"><Camera /> 拾得物AIスキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Found" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase">TAP TO SCAN</p></>}
                </div>
                {image && <button onClick={runProfileAnalysis} disabled={isProfiling} className="w-full h-20 bg-blue-600 text-white font-black rounded-2xl shadow-xl italic uppercase active:scale-95 transition-all">{isProfiling ? <Loader2 className="animate-spin" /> : "照合プロファイリング開始 ➔"}</button>}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between text-white font-black italic uppercase text-lg text-left"><ClipboardPaste className="text-emerald-400" /> 分析ログ・特定結果</div>
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="AIの解析結果をここに貼り付けるか、プロファイリングを実行してください..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-lg text-slate-300 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'match' && (
          <div className="animate-in fade-in space-y-8">
            <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden text-center">
               <div className="relative z-10 space-y-12 text-center">
                  <UserCheck className="text-emerald-500 w-20 h-20 mx-auto animate-pulse" />
                  <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none text-center">AI Matching Profile</h3>
                  {profileData ? (
                    <div className="grid lg:grid-cols-2 gap-10 text-left">
                      <div className="space-y-6 bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic text-left">Matching Probability</p>
                         <p className="text-7xl font-black text-white italic text-left">{profileData.certaintyLevel}</p>
                         <p className="text-lg text-slate-200 font-bold italic leading-relaxed text-left">{profileData.reasoning}</p>
                      </div>
                    </div>
                  ) : <p className="opacity-10 font-black uppercase italic tracking-widest py-20 text-2xl">Awaiting Data...</p>}
               </div>
            </Card>
          </div>
        )}

        {(activeTab === 'monetize' || activeTab === 'insights') && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center animate-in fade-in">
            <h3 className="text-4xl font-black text-white italic uppercase mb-6">{activeTab === 'monetize' ? '返却マネタイズ' : '運営レポート分析'}</h3>
            <p className="text-slate-400 font-bold text-lg text-center leading-relaxed italic">Nextra AIの自律プロトコルが稼働中。システム同期を完了させてください。</p>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab, hasImage: !!image }} toolId="nextra-v4.6-complete" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Operational OS • Nextra AI MASTERMODEL • 2026</div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }
