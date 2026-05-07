'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, CheckCircle2, Zap, RotateCcw, ClipboardPaste, 
  Building2, Camera, Loader2, Lock, Coins, Settings, Info, 
  UserPlus, List, Search, RefreshCw, Database, Eye, EyeOff, Sparkles
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'bookings', label: 'DMS予約一覧', icon: List, desc: '予約状況の統合管理' },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus, desc: '本人確認・PMS記帳' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'API連携デプロイ' },
  { id: 'scan', label: '遺失物特定', icon: Camera, desc: 'AI画像解析' },
  { id: 'settings', label: 'API設定', icon: Settings, desc: '環境一元管理' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [image, setImage] = useState(null);
  const [matchResult, setMatchResult] = useState('');
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [lockApiKey, setLockApiKey] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
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

  const issueLockKey = async () => {
    if (!pmsApiKey || !lockApiKey) { alert('設定タブからAPI連携を完了させてください'); return; }
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1000));
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
        <p className="text-emerald-500 font-black uppercase tracking-[0.6em] italic text-sm md:text-xl text-center">宿泊DXの「正解」を、自律化する。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-2">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-xl scale-[1.05]' : 'bg-[#13141f] border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-500'} size={32} />
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
                 <div className={"flex items-center gap-2 px-4 py-2 rounded-full border " + (isPmsConnected ? "bg-emerald-500/10 border-emerald-500/50" : "bg-red-500/10 border-red-500/50")}>
                   <div className={"w-2 h-2 rounded-full " + (isPmsConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                   <span className={"text-xs font-black uppercase tracking-widest italic " + (isPmsConnected ? "text-emerald-500" : "text-red-500")}>PMS SYNC: {isPmsConnected ? "ACTIVE" : "OFFLINE"}</span>
                 </div>
               </div>
               {!isPmsConnected && <Badge className="bg-red-600 text-white animate-bounce px-4 py-1">API未設定</Badge>}
            </div>
            <div className="overflow-x-auto bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-1 shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-black/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><th className="p-6">予約ID</th><th className="p-6">宿泊者名</th><th className="p-6 text-center">操作</th></tr></thead>
                <tbody className="text-sm italic">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-6 font-mono text-emerald-500">BK-8821</td><td className="p-6 font-black text-white">米山 文貴</td><td className="p-6 text-center"><button onClick={() => setActiveTab('checkin')} className="text-emerald-400 hover:scale-110 transition-transform"><ArrowRight /></button></td></tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-6 font-mono text-emerald-500">BK-8822</td><td className="p-6 font-black text-white">田中 太郎</td><td className="p-6 text-center"><button onClick={() => setActiveTab('checkin')} className="text-emerald-400 hover:scale-110 transition-transform"><ArrowRight /></button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-emerald-500/30 rounded-[2.5rem] p-8 md:p-16 shadow-2xl space-y-12">
              <div className="flex items-center gap-6 text-emerald-500"><Settings size={48} className="animate-spin-slow" /><h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-wider">API連携・一元管理</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-16 animate-in fade-in text-center"><h3 className="text-5xl font-black text-white italic uppercase mb-10">自動チェックイン</h3><button className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] text-3xl uppercase italic shadow-xl">身分証スキャン開始 ➔</button></Card>
        )}
        {activeTab === 'lock' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-16 shadow-2xl text-center space-y-12 animate-in fade-in"><h3 className="text-5xl font-black text-white italic uppercase">鍵自動発行デプロイ</h3><button onClick={issueLockKey} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl text-3xl uppercase italic active:scale-95">鍵発行APIを叩く ➔</button>{lockKeyData && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 animate-in zoom-in text-center"><p className="text-9xl font-black text-white tracking-widest">{lockKeyData.pinCode}</p></div>}</Card>
        )}
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-16 animate-in fade-in text-center"><h3 className="text-5xl font-black text-white italic uppercase mb-10">遺失物特定スキャン</h3><button className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] text-3xl uppercase italic shadow-xl">画像スキャン開始 ➔</button></Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-v4.9-final" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Operational OS • Nextra AI MASTERMODEL • 2026</div>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }