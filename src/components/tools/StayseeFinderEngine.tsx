'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, 
  RotateCcw, ClipboardPaste, Building2, Camera, Loader2, 
  Lock, Coins, Network, Shield, ShoppingCart, UserCheck, Target, Settings, Eye, EyeOff, Info, Sparkles
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'guide', label: 'ガイド', icon: Info, desc: 'Nextra AIの概要' },
  { id: 'scan', label: 'スキャン', icon: Camera, desc: '遺失物AI解析' },
  { id: 'match', label: '照合', icon: UserCheck, desc: '名簿クロス照合' },
  { id: 'lock', label: '鍵発行', icon: Lock, desc: 'API自動連携' },
  { id: 'monetize', label: '収益化', icon: Coins, desc: '返却マネタイズ' },
  { id: 'insights', label: 'レポート', icon: Building2, desc: '運営最適化' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('guide');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState(null);
  const [matchResult, setMatchResult] = useState('');
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [lockApiKey, setLockApiKey] = useState('');
  const [showPmsKey, setShowPmsKey] = useState(false);
  const [showLockKey, setShowLockKey] = useState(false);

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
    alert('API設定を保存しました');
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
    <div className="max-w-7xl mx-auto p-2 md:p-10 space-y-6 md:space-y-12 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.15)] rounded-[2rem] md:rounded-[4rem]">
      <div className="text-center space-y-4 pt-4">
        <Badge className="bg-blue-600 px-6 py-1 font-black tracking-widest uppercase text-[10px]">Hotel DX Intelligence</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.6em] italic text-xs md:text-2xl">AI Hotel DX Intelligence</p>
      </div>

      {/* 🧭 ロードマップナビゲーション：非線形ハブ */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 px-2">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-3 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105' : 'bg-[#13141f] border-white/5 text-slate-500 hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-400 group-hover:scale-110 transition-transform'} size={24} />
            <div className="text-center">
              <p className="text-[10px] md:text-xs font-black uppercase italic leading-none mb-1">{tab.label}</p>
              <p className="hidden md:block text-[8px] font-bold opacity-40">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="px-2 md:px-0">
        {activeTab === 'guide' && (
          <Card className="bg-[#13141f] border-2 border-emerald-500/30 rounded-[2.5rem] p-8 md:p-16 animate-in fade-in">
             <div className="space-y-8">
                <h3 className="text-3xl md:text-6xl font-black text-white italic uppercase border-l-8 border-emerald-500 pl-8">宿泊運営を自律化せよ。</h3>
                <p className="text-slate-300 font-bold leading-relaxed text-lg md:text-2xl">Nextra AIは、ホテル運営における「鍵の発行」「遺失物照合」などの物理的労働をデジタルで消し去る司令塔です。手順に縛られず、必要な機能を自由に呼び出してください。</p>
             </div>
          </Card>
        )}

        {activeTab === 'lock' && (
          <div className="space-y-6 animate-in zoom-in-95">
            <Card className="bg-[#0a0b14] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-inner space-y-8">
              <div className="flex items-center gap-4 text-emerald-500"><Settings size={28} /><h3 className="text-2xl font-black uppercase italic tracking-wider">API連携設定</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-left">
                <div className="space-y-4">
                  <label className="text-xs font-black text-emerald-500 uppercase tracking-widest px-2">PMS 選択</label>
                  <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input type="password" value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder="APIキーを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white font-bold focus:border-emerald-500" />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-emerald-500 uppercase tracking-widest px-2">錠デバイス 選択</label>
                  <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <input type="password" value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder="トークンを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white font-bold focus:border-emerald-500" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-14 px-10 bg-white/5 border-2 border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mx-auto block italic">構成を同期 ➔</button>
            </Card>
            <Card className="bg-[#13141f] border-2 border-emerald-500/50 rounded-[2.5rem] p-8 md:p-16 text-center space-y-10">
               <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase leading-none">鍵をデプロイ ➔</h3>
               <button onClick={() => setIsIssuingKey(true)} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl text-4xl italic active:scale-95 transition-all border-b-8 border-emerald-900 active:border-b-0">連携実行</button>
               {isIssuingKey && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in zoom-in"><p className="text-emerald-500 font-black uppercase text-sm mb-4">Issued Passcode</p><p className="text-9xl font-black text-white tracking-[0.2em] italic">1022</p></div>}
            </Card>
          </div>
        )}

        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-emerald-500/50 rounded-[2.5rem] p-8 md:p-16 animate-in fade-in">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><Camera size={48} /> 遺失物スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Scan" /> : <><Camera className="h-16 w-16 text-slate-700" /><p className="text-2xl text-white font-black italic uppercase">TAP TO SCAN</p></>}
                </div>
                {image && (
                   <div className="grid grid-cols-3 gap-2">
                     <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT</button>
                     <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini</button>
                     <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>Claude</button>
                   </div>
                )}
              </div>
                            <div className="bg-[#0a0b14] rounded-[3rem] p-10 border-2 border-emerald-500/20 shadow-inner flex flex-col min-h-[450px]">
                <div className="flex items-center gap-4 text-emerald-400 font-black italic uppercase text-2xl mb-8"><ClipboardPaste size={32} /> AI解析連携</div>
                
                <div className="space-y-6 mb-8">
                  <button 
                    onClick={() => { navigator.clipboard.writeText("【最優先：添付画像を解析してください】PMSの宿泊履歴から持ち主を特定するための詳細分析を行ってください。"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                    className={"w-full h-20 text-2xl font-black rounded-2xl transition-all shadow-xl " + (copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white hover:bg-blue-500')}
                  >
                    {copied ? '✅ COPY COMPLETE' : '① 解析指示をコピー'}
                  </button>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {['CHATGPT', 'GEMINI', 'CLAUDE'].map(ai => (
                      <button key={ai} onClick={() => window.open(ai === 'CHATGPT' ? 'https://chatgpt.com' : ai === 'GEMINI' ? 'https://gemini.google.com' : 'https://claude.ai', '_blank')} className="h-20 bg-white/5 border-2 border-white/10 rounded-2xl text-xs font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase italic">
                        {ai} 🚀
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 flex-1 flex flex-col">
                  <label className="text-xs font-black text-emerald-500 uppercase italic px-4">② AIの解析結果をペースト</label>
                  <textarea 
                    value={matchResult} 
                    onChange={(e) => setMatchResult(e.target.value)} 
                    placeholder="AIからの回答をここに貼り付けてください..." 
                    className="flex-1 w-full bg-[#13141f] border-2 border-white/10 rounded-[2rem] p-8 text-lg text-white font-bold focus:border-emerald-500 outline-none italic shadow-inner" 
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-ai-v4.0" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[10px] pb-10">Operational OS • Nextra AI MASTERMODEL • 2026</div>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }