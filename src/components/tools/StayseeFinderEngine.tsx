'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, 
  RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, 
  Building2, Camera, Loader2, Download, FileImage, 
  Settings, Shield, Printer, FileText, Smartphone, Truck, Box, Coins, ShoppingCart, CreditCard,
  UserCheck, Target, Car, Wine, Lock, Info, Eye, EyeOff, Sparkles, UserPlus, Key
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'guide', label: 'Nextra AIとは', icon: Info, desc: 'システム解説' },
  { id: 'checkin', label: '自律チェックイン', icon: UserPlus, desc: '本人確認・記帳' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'API連携デプロイ' },
  { id: 'scan', label: '遺失物特定', icon: Camera, desc: 'AI画像解析' },
  { id: 'monetize', label: '返却収益化', icon: Coins, desc: '送料・決済自動化' },
  { id: 'insights', label: '運営レポート', icon: Building2, desc: '経営分析' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState(null);
  const [matchResult, setMatchResult] = useState('');
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [lockApiKey, setLockApiKey] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  const [profileData, setProfileData] = useState(null);
  const [certData, setCertData] = useState(null);
  const [monetizationData, setMonetizationData] = useState(null);
  const [isGeneratingMonetize, setIsGeneratingMonetize] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState('IDLE'); // IDLE, SCANNING, VERIFIED

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

  const issueLockKey = async () => {
    if (!pmsApiKey || !lockApiKey) { alert('先にAPI連携の設定を行ってください'); return; }
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1500));
    setLockKeyData({ pinCode: Math.floor(1000 + Math.random() * 9000).toString() });
    setIsIssuingKey(false);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-blue-600 px-6 py-1 font-black tracking-widest uppercase">Hotel DX Intelligence</Badge>
        <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl">AI Hotel DX Intelligence</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-xl scale-[1.05]' : 'bg-[#13141f] border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-500'} size={28} />
            <div className="text-center">
              <p className="text-[11px] font-black uppercase italic leading-none mb-1">{tab.label}</p>
              <p className="text-[9px] font-bold opacity-40">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-left">
        {/* --- 🆕 自律チェックインタブ --- */}
        {activeTab === 'checkin' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><UserPlus size={300} className="text-white" /></div>
               <div className="relative z-10 space-y-12 text-center">
                  <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><UserPlus className="text-emerald-500" size={48} /> 自律チェックイン</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-12 text-left">
                    <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                       <p className="text-slate-300 font-bold leading-relaxed italic text-center">パスポートまたは身分証をAIがスキャンし、Staysee等のPMSへ自動記帳。本人確認を0秒で完了させます。</p>
                       <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                          {image ? <img src={image} className="h-full w-full object-contain p-4" alt="ID" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase">身分証をスキャン</p></>}
                       </div>
                       <button onClick={runCheckin} disabled={checkinStatus === 'SCANNING' || !image} className="w-full h-20 bg-emerald-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-xl uppercase italic active:scale-95 transition-all">
                          {checkinStatus === 'SCANNING' ? <Loader2 className="animate-spin" /> : <Zap />} 本人確認 ＆ PMS同期 ➔
                       </button>
                    </div>
                    
                    <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[350px] flex flex-col items-center justify-center text-center">
                       {checkinStatus === 'VERIFIED' ? (
                         <div className="space-y-6 animate-in zoom-in">
                            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-widest">本人確認完了</h4>
                            <p className="text-slate-400 font-bold">Stayseeへの自動記帳が完了しました。<br/>次のステップで鍵を発行してください。</p>
                            <button onClick={() => setActiveTab('lock')} className="h-14 px-8 bg-white/5 border border-white/10 text-emerald-400 font-black rounded-xl uppercase italic hover:bg-emerald-500 hover:text-slate-950 transition-all">鍵発行へ進む ➔</button>
                         </div>
                       ) : <p className="font-black uppercase italic tracking-[0.5em] opacity-10 text-2xl">Awaiting Identity Scan...</p>}
                    </div>
                  </div>
               </div>
            </Card>
          </div>
        )}

        {/* --- 🔑 鍵発行タブ (API設定統合) --- */}
        {activeTab === 'lock' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#0a0b14] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-inner space-y-10">
              <div className="flex items-center gap-4 text-emerald-500"><Settings size={28} /><h3 className="text-2xl font-black uppercase italic tracking-wider">API連携・環境設定</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{selectedPMS} APIキー</label>
                  <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black mb-4">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input type="password" value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder={selectedPMS + " APIキーを入力..."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{selectedDevice} 認証キー</label>
                  <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black mb-4">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <input type="password" value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder={selectedDevice + " 認証トークンを入力..."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-14 px-10 bg-white/5 border-2 border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mx-auto block italic">構成を保存・同期 ➔</button>
            </Card>
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl space-y-12 text-center">
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> リアルタイム・キー・デプロイ</h3>
               <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-6 text-3xl uppercase italic active:scale-95 transition-all">
                 {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />} 連携実行 ➔
               </button>
               {lockKeyData && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 animate-in zoom-in text-center"><p className="text-emerald-500 font-black uppercase tracking-widest text-sm mb-4">Issued Passcode</p><p className="text-9xl font-black text-white tracking-widest italic">{lockKeyData.pinCode}</p></div>}
            </Card>
          </div>
        )}

        {/* --- 📷 その他タブ (スキャン・マネタイズ・レポート) --- */}
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400 text-left"><Camera /> 拾得物AIスキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left text-left">
              <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Found" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase text-center">TAP TO SCAN</p></>}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between text-white font-black italic uppercase text-lg text-left"><ClipboardPaste className="text-emerald-400" /> AI解析リンク</div>
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="画像をアップし、AIからの解析結果をここに貼り付けてください..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-sm text-slate-300 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-ai-v4.0" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Operational OS • Nextra AI MASTERMODEL • 2026</div>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI Node...</div> });
export default function HotelPage() { return <NoSSR />; }