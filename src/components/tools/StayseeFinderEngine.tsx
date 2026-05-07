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
  UserCheck, Target, Car, Wine, Lock, Info, Eye, EyeOff, Sparkles, UserPlus, List, Search
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'bookings', label: '予約一覧', icon: List, desc: 'DMS予約管理' },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus, desc: '本人確認・記帳' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'API連携デプロイ' },
  { id: 'scan', label: '遺失物特定', icon: Camera, desc: 'AI画像解析' },
  { id: 'monetize', label: '返却収益化', icon: Coins, desc: '送料・決済自動化' },
  { id: 'insights', label: '運営レポート', icon: Building2, desc: '経営分析' },
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
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  const [checkinStatus, setCheckinStatus] = useState('IDLE');
  const [insightData, setInsightData] = useState(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

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

  const issueLockKey = async () => {
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1000));
    setLockKeyData({ pinCode: Math.floor(1000 + Math.random() * 9000).toString() });
    setIsIssuingKey(false);
  };

  const generateInsight = async () => {
    setIsGeneratingInsight(true);
    await new Promise(r => setTimeout(r, 1500));
    setInsightData({ summary: "今月の自動チェックイン利用率は85%を超え、フロント待機時間が平均4分短縮されました。", roi: "¥128,000" });
    setIsGeneratingInsight(false);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-emerald-600 px-6 py-1 font-black tracking-widest uppercase text-[10px]">Nextra AI Autonomous OS</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.6em] italic text-sm md:text-xl text-center">宿泊DXの「正解」を、自律化する。</p>
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
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="overflow-x-auto bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-1 shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="p-6">予約ID</th><th className="p-6">宿泊者名</th><th className="p-6">ステータス</th><th className="p-6 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-6 font-mono text-emerald-500">BK-8821</td><td className="p-6 font-bold text-white">米山 文貴</td><td className="p-6">確定</td><td className="p-6 text-center"><button onClick={() => setActiveTab('checkin')} className="text-emerald-400"><ArrowRight /></button></td></tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-6 font-mono text-emerald-500">BK-8822</td><td className="p-6 font-bold text-white">田中 太郎</td><td className="p-6">確定</td><td className="p-6 text-center"><button onClick={() => setActiveTab('checkin')} className="text-emerald-400"><ArrowRight /></button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'checkin' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 animate-in fade-in text-center">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase mb-10">自動チェックイン</h3>
            <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 mb-10" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {image ? <img src={image} className="h-full w-full object-contain p-4" alt="ID" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase">身分証スキャン開始</p></>}
            </div>
            <button className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] text-3xl uppercase italic shadow-xl">本人確認を実行</button>
          </Card>
        )}

        {activeTab === 'lock' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#0a0b14] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-inner space-y-10">
              <div className="flex items-center gap-4 text-emerald-500"><Settings size={28} /><h3 className="text-2xl font-black uppercase italic">API連携設定</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 text-left">
                  <label className="text-xs font-black text-slate-400 uppercase">PMS 選択</label>
                  <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input type="password" value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder="APIキーを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
                <div className="space-y-4 text-left">
                  <label className="text-xs font-black text-slate-400 uppercase">錠デバイス 選択</label>
                  <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <input type="password" value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder="トークンを入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-14 px-10 bg-white/5 border-2 border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mx-auto block">構成を同期 ➔</button>
            </Card>
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl text-center space-y-12">
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> リアルタイム・キー・デプロイ</h3>
               <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl text-3xl uppercase italic active:scale-95 transition-all">
                 {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />} 鍵を発行 ➔
               </button>
               {lockKeyData && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 animate-in zoom-in text-center"><p className="text-9xl font-black text-white tracking-widest">{lockKeyData.pinCode}</p></div>}
            </Card>
          </div>
        )}

        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><Camera /> 遺失物AIスキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Found" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase">TAP TO SCAN</p></>}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 flex flex-col min-h-[300px]">
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="AIからの解析結果をここに貼り付けてください..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-lg text-slate-300 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'insights' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in text-center space-y-12">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase">運営レポート分析</h3>
            {!insightData ? (
              <button onClick={generateInsight} disabled={isGeneratingInsight} className="h-24 px-16 bg-blue-600 text-white font-black text-2xl rounded-3xl shadow-2xl active:scale-95 flex items-center gap-4 italic uppercase mx-auto">
                {isGeneratingInsight ? <Loader2 className="animate-spin" /> : <Zap />} レポートを生成
              </button>
            ) : (
              <div className="grid lg:grid-cols-2 gap-10 text-left">
                <div className="bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 shadow-inner"><p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Summary</p><p className="text-xl text-white font-bold leading-relaxed italic">{insightData.summary}</p></div>
                <div className="bg-emerald-600/10 border-2 border-emerald-500/30 p-8 rounded-[2.5rem] shadow-xl text-center"><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">ROI</p><p className="text-6xl font-black text-white italic">{insightData.roi}</p></div>
              </div>
            )}
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-v4.2-stable" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Operational OS • Nextra AI MASTERMODEL • 2026</div>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }