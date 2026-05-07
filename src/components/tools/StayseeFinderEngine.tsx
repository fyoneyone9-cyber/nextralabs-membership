'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, 
  RotateCcw, ClipboardPaste, Building2, Camera, Loader2, 
  Lock, Coins, Network, Shield, ShoppingCart, UserCheck, Target
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'scan', label: '拾得物スキャン', icon: Camera },
  { id: 'lock', label: '鍵自動発行', icon: Lock },
  { id: 'monetize', label: '返却マネタイズ', icon: Coins },
  { id: 'insights', label: '運営レポート', icon: Building2 },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  
  const DEVICE_OPTIONS = ['RemoteLock', 'TTLock', 'SwitchBot', 'KEYVOX', 'MIWA', 'GOAL', 'ASSAABLOY', 'Baycom'];
  const PMS_OPTIONS = ['Staysee', 'Beds24', 'AirHost', 'suitebook', 'infor', 'JTBデータコネクト'];

  const fileInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const issueLockKey = async () => {
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1000));
    setLockKeyData({ pinCode: Math.floor(1000 + Math.random() * 9000).toString() });
    setIsIssuingKey(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result); setIsProcessing(false); };
      reader.readAsDataURL(file);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600">HOTEL DX ENGINE</Badge>
        <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">AI×ホテルDXシステム【Nextra】</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[10px] tracking-widest shadow-lg">v3.6-MASTER</div>
      </div>

      {/* タブナビゲーション：ロックなし、自由選択 */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[600px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex-1 py-5 px-1 rounded-xl font-black text-[9px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative " + (activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white')}>
              <tab.icon className="w-4 h-4" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-left">
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-emerald-400"><Camera /> 拾得物スキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Scan" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase">TAP TO SCAN</p></>}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between text-white font-black italic uppercase"><ClipboardPaste className="text-emerald-400" /> 同期設定</div>
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="Staysee等から取得したデータをここに貼り付けるか、API連携で取得します..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-sm text-slate-300 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'lock' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in space-y-12">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none text-center flex items-center justify-center gap-4"><Lock className="text-emerald-500" /> API自動連携：鍵発行</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-inner space-y-8 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-500 uppercase italic px-2">PMS 選択</label>
                    <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-emerald-500">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-500 uppercase italic px-2">錠デバイス 選択</label>
                    <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-emerald-500">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  </div>
                </div>
                <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 text-2xl uppercase italic transition-all">
                  {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />} 連携実行・鍵を発行 ➔
                </button>
              </div>
              <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[300px] flex flex-col items-center justify-center text-center">
                 {lockKeyData ? <div className="space-y-4"><p className="text-emerald-500 font-black uppercase text-xs">Issued Passcode</p><p className="text-6xl font-black text-white tracking-widest italic">{lockKeyData.pinCode}</p></div> : <p className="font-black uppercase italic tracking-[0.3em] opacity-10">Awaiting Trigger...</p>}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'monetize' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center"><h3 className="text-4xl font-black text-white italic uppercase mb-6"><Coins className="text-emerald-500 inline-block mr-4" /> 返却マネタイズ機能</h3><p className="text-slate-400">送料・手数料の自動算出プロトコルを展開します。</p></Card>
        )}

        {activeTab === 'insights' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center"><h3 className="text-4xl font-black text-white italic uppercase mb-6"><Building2 className="text-emerald-500 inline-block mr-4" /> 運営レポート分析</h3><p className="text-slate-400">稼働データと遺失物傾向のクロス分析レポートを生成します。</p></Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="hotel-dx-master-v3.6" />
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Master Node...</div> });
export default function HotelPage() { return <NoSSR />; }
