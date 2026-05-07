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
  UserCheck, Target, Car, Wine, Lock, Info, Eye, EyeOff, Sparkles
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'guide', label: 'Nextra AIとは', icon: Info, desc: 'システム解説' },
  { id: 'scan', label: '拾得物スキャン', icon: Camera, desc: 'AI画像特定' },
  { id: 'match', label: '照合プロファイル', icon: UserCheck, desc: '宿泊名簿照合' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'API連携発行' },
  { id: 'monetize', label: '返却マネタイズ', icon: Coins, desc: '収益化OS' },
  { id: 'insights', label: '運営レポート', icon: Building2, desc: '稼働分析' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('guide');
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
    alert('構成を保存しました');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result); };
      reader.readAsDataURL(file);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-blue-600 px-6 py-1 font-black uppercase tracking-widest">Hotel DX Intelligence</Badge>
        <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl">AI Hotel DX Intelligence</p>
      </div>

      {/* 🧭 ロードマップナビゲーション（一本道ではなく、機能ハブとして再定義） */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-xl scale-105' : 'bg-[#13141f] border-white/5 text-slate-500 hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-400 group-hover:scale-110 transition-transform'} size={24} />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase italic leading-none mb-1">{tab.label}</p>
              <p className="text-[8px] font-bold opacity-40">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-left">
        {/* ガイド */}
        {activeTab === 'guide' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 animate-in fade-in">
             <div className="space-y-8">
                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase border-l-8 border-emerald-500 pl-8">宿泊運営を自律化せよ。</h3>
                <p className="text-slate-300 font-bold leading-relaxed text-lg">Nextra AIは、ホテル運営の各フェーズで必要なAI機能を自由に呼び出せる「自律型司令塔」です。手順に縛られることなく、あなたの現場に最適なソリューションを即座に提供します。</p>
             </div>
          </Card>
        )}

        {/* 鍵発行 */}
        {activeTab === 'lock' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#0a0b14] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-inner space-y-8">
              <div className="flex items-center gap-4 text-emerald-500"><Settings size={28} /><h3 className="text-2xl font-black uppercase italic tracking-wider">API連携設定</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4 text-left">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">PMS 選択</label>
                  <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input type="password" value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder="APIキーを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
                <div className="space-y-4 text-left">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">錠デバイス 選択</label>
                  <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <input type="password" value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder="トークンを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-12 px-8 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mx-auto block italic text-center">構成を同期 ➔</button>
            </Card>
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl text-center">
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> キー・デプロイ</h3>
               <button onClick={() => setIsIssuingKey(true)} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-6 text-3xl uppercase italic active:scale-95 transition-all">連携実行 ➔</button>
               {isIssuingKey && <div className="mt-10 p-10 bg-black rounded-3xl border border-emerald-500/30 animate-in zoom-in"><p className="text-emerald-500 font-black uppercase text-sm mb-4">Issued Passcode</p><p className="text-8xl font-black text-white tracking-widest italic">1022</p></div>}
            </Card>
          </div>
        )}

        {/* スキャン */}
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><Camera /> 拾得物AIスキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Scan" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase text-center text-center">TAP TO SCAN</p></>}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 flex flex-col min-h-[300px] text-left">
                <div className="flex items-center gap-4 text-white font-black italic uppercase text-lg text-left"><ClipboardPaste className="text-emerald-400" /> AI解析リンク</div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                   <button className="h-16 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT</button>
                   <button className="h-16 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini</button>
                   <button className="h-16 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>Claude</button>
                </div>
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="AIの解析結果をペーストしてください..." className="mt-6 flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-6 text-sm text-slate-300 outline-none italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}

        {/* 照合プロファイル / マネタイズ / レポート */}
        {(activeTab === 'match' || activeTab === 'monetize' || activeTab === 'insights') && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center">
            <h3 className="text-4xl font-black text-white italic uppercase mb-6">{activeTab === 'match' ? '照合プロファイル' : activeTab === 'monetize' ? '返却マネタイズ' : '運営レポート'}</h3>
            <p className="text-slate-400 font-bold text-lg text-center leading-relaxed">指定のAI機能を実行準備中。Nextra AIが自律的にオペレーションを代行します。</p>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-ai-v4.0" />
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }