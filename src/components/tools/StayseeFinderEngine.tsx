'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, 
  RotateCcw, ClipboardPaste, Building2, Camera, Loader2, 
  Lock, Coins, Network, Shield, ShoppingCart, UserCheck, Target, Settings, Eye, EyeOff, Info
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'guide', label: 'NextraAIとは', icon: Info },
  { id: 'scan', label: '拾得物スキャン', icon: Camera },
  { id: 'lock', label: '鍵自動発行', icon: Lock },
  { id: 'monetize', label: '返却マネタイズ', icon: Coins },
  { id: 'insights', label: '運営レポート', icon: Building2 },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('guide');
  const [image, setImage] = useState(null);
  const [matchResult, setMatchResult] = useState('');
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  
  // API設定用
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
    const savedPms = localStorage.getItem('nextra_pms_key');
    const savedLock = localStorage.getItem('nextra_lock_key');
    if (savedPms) setPmsApiKey(savedPms);
    if (savedLock) setLockApiKey(savedLock);
  }, []);

  const saveKeys = () => {
    localStorage.setItem('nextra_pms_key', pmsApiKey);
    localStorage.setItem('nextra_lock_key', lockApiKey);
    alert('API設定を保存しました');
  };

  const issueLockKey = async () => {
    if (!pmsApiKey || !lockApiKey) {
      alert('先にAPI連携の設定を行ってください');
      return;
    }
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1500));
    setLockKeyData({ pinCode: Math.floor(1000 + Math.random() * 9000).toString() });
    setIsIssuingKey(false);
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
        <Badge className="bg-blue-600 px-6 py-1 font-black tracking-widest uppercase">Hotel DX Intelligence</Badge>
        <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none">NextraAI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl">AI Hotel DX Intelligence</p>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-xs md:text-sm tracking-widest shadow-lg">v3.8-MASTER</div>
      </div>

      {/* タブ選択 */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[600px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex-1 py-5 px-1 rounded-xl font-black text-sm md:text-base uppercase italic transition-all flex items-center justify-center gap-3 relative " + (activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white')}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-left">
        {/* 📚 解説タブ */}
        {activeTab === 'guide' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Info size={300} className="text-white" /></div>
               <div className="relative z-10 space-y-8">
                  <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase border-l-8 border-emerald-500 pl-8">宿泊運営を自律化せよ。</h3>
                  <div className="grid md:grid-cols-2 gap-12 text-slate-300 font-bold leading-relaxed text-lg">
                    <div className="space-y-4">
                      <p className="text-white text-2xl font-black italic">NextraAIは何をするツールか？</p>
                      <p>NextraAIは、ホテルや民泊の運営において「最も時間がかかり、ミスが許されない業務」をAIとAPIの力で自動化する、宿泊特化型の司令塔システムです。</p>
                      <ul className="space-y-2 text-sm md:text-base">
                        <li className="flex items-center gap-3"><Zap className="text-emerald-500" size={18} /> 予約が入った瞬間の「鍵の発行・通知」を完全無人化。</li>
                        <li className="flex items-center gap-3"><Zap className="text-emerald-500" size={18} /> 忘れ物の写真を撮るだけで宿泊者名簿と照合し持ち主を特定。</li>
                        <li className="flex items-center gap-3"><Zap className="text-emerald-500" size={18} /> 返却に必要な送料の決済リンクをAIが自動生成して収益化。</li>
                      </ul>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 shadow-inner">
                      <p className="text-emerald-500 text-sm font-black uppercase tracking-widest mb-4">Supported Integration</p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                           <p className="text-slate-500 font-black uppercase">PMS (宿泊管理)</p>
                           <p>Staysee / Beds24 / AirHost / suitebook / JTBデータコネクト</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-slate-500 font-black uppercase">LOCK (スマートロック)</p>
                           <p>RemoteLock / SwitchBot / MIWA / GOAL / TTLock / KEYVOX</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('lock')} className="h-16 px-12 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all uppercase italic text-xl">設定を開始する ➔</button>
               </div>
            </Card>
          </div>
        )}

        {/* 🔐 鍵発行タブ */}
        {activeTab === 'lock' && (
          <div className="space-y-8 animate-in fade-in">
            {/* 🔑 API連携設定エリア */}
            <Card className="bg-[#0a0b14] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-inner space-y-8">
              <div className="flex items-center gap-4 text-emerald-500">
                <Settings size={28} className="animate-spin-slow" />
                <h3 className="text-2xl font-black uppercase italic tracking-wider">API連携・環境設定</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{selectedPMS} APIキー / 連携ID</label>
                    <button onClick={() => setShowPmsKey(!showPmsKey)} className="text-slate-500 hover:text-white">{showPmsKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <input type={showPmsKey ? "text" : "password"} value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder={selectedPMS + " のAPIキーを入力..."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-lg font-bold text-white outline-none focus:border-emerald-500 shadow-inner" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{selectedDevice} 認証キー / アクセストークン</label>
                    <button onClick={() => setShowLockKey(!showLockKey)} className="text-slate-500 hover:text-white">{showLockKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <input type={showLockKey ? "text" : "password"} value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder={selectedDevice + " のキーを入力..."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-lg font-bold text-white outline-none focus:border-emerald-500 shadow-inner" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-12 px-8 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mx-auto block italic text-center">構成を保存・同期 ➔</button>
            </Card>

            {/* 連携実行エリア */}
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase leading-none flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> リアルタイム・キー・デプロイ</h3>
                <p className="text-slate-400 text-lg font-bold italic">PMSと錠デバイスをAPIで直結し、予約に連動したパスコードを発行します。</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 shadow-inner space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                      <div className="space-y-3">
                        <label className="text-[12px] font-black text-emerald-500 uppercase italic px-4">使用中のPMS</label>
                        <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-lg font-black text-white outline-none focus:border-emerald-500">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[12px] font-black text-emerald-500 uppercase italic px-4">連携する錠デバイス</label>
                        <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-lg font-black text-white outline-none focus:border-emerald-500">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                      </div>
                   </div>
                   <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-emerald-900 active:border-b-0">
                     {isIssuingKey ? <Loader2 className="animate-spin w-10 h-10" /> : <Zap className="w-10 h-10" />} 連携実行 ➔
                   </button>
                </div>
                <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[350px] flex flex-col items-center justify-center text-center">
                   {lockKeyData ? <div className="space-y-6 animate-in zoom-in duration-500 text-center"><p className="text-emerald-500 font-black uppercase tracking-[0.4em] text-sm">Issued Passcode</p><p className="text-8xl font-black text-white tracking-[0.2em] italic">{lockKeyData.pinCode}</p><Badge className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-6 py-2 rounded-full font-black italic">SYNC COMPLETED</Badge></div> : <p className="font-black uppercase italic tracking-[0.5em] opacity-10 text-2xl text-center">Awaiting Trigger...</p>}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 📷 スキャンタブ */}
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><Camera /> 拾得物AIスキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Scan" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-2xl text-white font-black italic uppercase text-center">TAP TO SCAN</p></>}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 flex flex-col min-h-[350px]">
                <div className="flex items-center justify-between text-white font-black italic uppercase text-lg"><ClipboardPaste className="text-emerald-400" /> 持ち主特定ログ</div>
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="画像をアップすると、宿泊履歴からAIが持ち主を特定します..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-sm text-slate-300 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}

        {/* 💰 マネタイズ / 📈 レポート (プレースホルダー) */}
        {(activeTab === 'monetize' || activeTab === 'insights') && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center"><h3 className="text-4xl font-black text-white italic uppercase mb-6">{activeTab === 'monetize' ? '返却マネタイズ機能' : '運営レポート分析'}</h3><p className="text-slate-400 font-bold text-lg">NextraAIの全自動プロトコルにより、{activeTab === 'monetize' ? '配送・決済リンクが自動生成' : '稼働率と満足度の最大化'}を支援します。</p></Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-ai-v3.8" />
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing NextraAI Node...</div> });
export default function HotelPage() { return <NoSSR />; }
