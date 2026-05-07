'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, CheckCircle2, Zap, RotateCcw, ClipboardPaste, 
  Building2, Camera, Loader2, Lock, Coins, Settings, Info, Key,
  UserPlus, List, Search, RefreshCw, Database, ShieldCheck, Eye, EyeOff, Sparkles,
  PhoneCall, CreditCard, ClipboardList, LogOut, QrCode, Monitor, Languages, PenTool
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'kiosk', label: 'KIOSKトップ', icon: Monitor, desc: '待機・言語選択' },
  { id: 'search', label: '予約検索', icon: Search, desc: 'QR/予約番号' },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus, desc: '本人確認・台帳記帳' },
  { id: 'lock', label: '鍵発行', icon: Key, desc: 'アクセス権デプロイ' },
  { id: 'checkout', label: 'チェックアウト', icon: LogOut, desc: '1秒退館・精算' },
  { id: 'bookings', label: 'DMS予約管理', icon: List, desc: '統合台帳' },
  { id: 'settings', label: 'システム設定', icon: Settings, desc: 'API一元管理' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('kiosk');
  const [isMounted, setIsMounted] = useState(false);
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [lockApiKey, setLockApiKey] = useState('');
  const [image, setImage] = useState(null);
  const [checkinStatus, setCheckinStatus] = useState('IDLE');
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  // 台帳フィールド（PMS自動入力 + 手動編集可能）
  const [ledgerName, setLedgerName] = useState('');
  const [ledgerAddress, setLedgerAddress] = useState('');
  const [ledgerOccupation, setLedgerOccupation] = useState('');
  const [ledgerTravel, setLedgerTravel] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const k1 = localStorage.getItem('nextra_pms_key');
    const k2 = localStorage.getItem('nextra_lock_key');
    if (k1) setPmsApiKey(k1); if (k2) setLockApiKey(k2);
  }, []);

  const runCheckin = async () => {
    setCheckinStatus('SCANNING');
    await new Promise(r => setTimeout(r, 2000));
    // PMS自動入力（実際はAPIから取得。ここではデモ値）
    setLedgerName('山田 太郎');
    setLedgerAddress('東京都渋谷区1-2-3');
    setLedgerOccupation('会社員');
    setLedgerTravel('大阪 → 東京 → 横浜');
    setCheckinStatus('VERIFIED');
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-emerald-600 px-6 py-1 font-black tracking-widest uppercase text-[10px]">Nextra AI Autonomous OS</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl text-center">次世代スマートチェックイン・プロトコル</p>
      </div>

      {/* 🧭 ナビゲーション */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 px-2">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-xl scale-[1.05]' : 'bg-[#13141f] border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-500'} size={28} />
            <div className="text-center">
              <p className="text-[11px] font-black uppercase italic leading-none mb-1">{tab.label}</p>
              <p className="text-[8px] font-bold opacity-40 leading-none">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-left min-h-[600px]">
        {/* --- 👑 KIOSKトップ画面 --- */}
        {activeTab === 'kiosk' && (
          <div className="animate-in fade-in h-full flex flex-col items-center justify-center space-y-12 py-20 bg-gradient-to-br from-[#0a0b14] to-[#13141f] rounded-[4rem] border-2 border-white/5 shadow-2xl relative">
             <div className="text-center space-y-8 relative z-10">
                <div className="flex justify-center gap-6 mb-12">
                   {['日本語', 'English', '中文', '한국어'].map(lang => (
                     <Badge key={lang} variant="outline" className="px-6 py-2 border-white/10 text-slate-400 font-bold hover:text-emerald-400 cursor-pointer">{lang}</Badge>
                   ))}
                </div>
                <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-2xl animate-pulse">Touch Start to Check-in</p>
                <div className="w-80 h-80 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.15)] cursor-pointer hover:scale-105 transition-all group mx-auto" onClick={() => setActiveTab('search')}>
                   <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl mb-4 group-hover:animate-ping-slow"><Zap size={64} fill="currentColor" /></div>
                   <p className="text-slate-900 text-4xl font-black italic uppercase">Start</p>
                </div>
             </div>
          </div>
        )}

        {/* --- 🔍 予約検索 --- */}
        {activeTab === 'search' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8">
            <Card className="bg-[#13141f] p-12 rounded-[3rem] border-2 border-white/5 flex flex-col items-center justify-center space-y-8 hover:border-emerald-500/50 transition-all cursor-pointer" onClick={() => setActiveTab('checkin')}>
               <QrCode size={120} className="text-emerald-500" />
               <h3 className="text-3xl font-black italic uppercase">QRコードで検索</h3>
            </Card>
            <Card className="bg-[#13141f] p-12 rounded-[3rem] border-2 border-white/5 flex flex-col items-center justify-center space-y-8 hover:border-indigo-500/50 transition-all cursor-pointer" onClick={() => setActiveTab('checkin')}>
               <ClipboardList size={120} className="text-indigo-400" />
               <h3 className="text-3xl font-black italic uppercase">予約番号で検索</h3>
            </Card>
          </div>
        )}

        {/* --- 📝 自動チェックイン (詳細マニュアル準拠) --- */}
        {activeTab === 'checkin' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-12 animate-in fade-in">
             <div className="flex items-center justify-between border-b border-white/5 pb-8 text-left">
                <div>
                   <h3 className="text-4xl font-black text-white italic uppercase">宿泊者情報の登録</h3>
                   <p className="text-slate-500 font-bold mt-2">旅館業法に基づき、正確な情報をご入力ください。</p>
                </div>
                <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-6 py-2 rounded-full font-black italic uppercase animate-pulse">Identity Verification Active</Badge>
             </div>
             <div className="grid lg:grid-cols-2 gap-12 text-left">
                <div className="space-y-8">
                   <div className="bg-black/60 p-8 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-inner">
                      <p className="text-emerald-500 font-black uppercase text-xs mb-6 tracking-widest">Step 1: ID Scan</p>
                      <div className="border-4 border-dashed border-white/10 rounded-2xl aspect-video flex flex-col items-center justify-center gap-4 bg-white/5 cursor-pointer hover:bg-white/10" onClick={() => fileInputRef.current?.click()}>
                         <input type="file" ref={fileInputRef} onChange={runCheckin} className="hidden" accept="image/*" />
                         {checkinStatus === 'VERIFIED' ? <CheckCircle2 size={64} className="text-emerald-500" /> : <Camera size={64} className="text-slate-700" />}
                         <p className="font-black italic uppercase text-slate-500">{checkinStatus === 'VERIFIED' ? 'Scan Completed' : '身分証をスキャン'}</p>
                      </div>
                   </div>
                </div>
                <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                   <p className="text-slate-500 font-black uppercase text-xs mb-4 tracking-widest">Step 2: Ledger Entry</p>
                   <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: '氏名', value: ledgerName, setter: setLedgerName, placeholder: checkinStatus === 'SCANNING' ? 'AI読み取り中...' : '氏名を入力' },
                        { label: '住所', value: ledgerAddress, setter: setLedgerAddress, placeholder: checkinStatus === 'SCANNING' ? 'AI読み取り中...' : '住所を入力' },
                        { label: '職業', value: ledgerOccupation, setter: setLedgerOccupation, placeholder: checkinStatus === 'SCANNING' ? 'AI読み取り中...' : '職業を入力' },
                        { label: '前泊地・行先地', value: ledgerTravel, setter: setLedgerTravel, placeholder: checkinStatus === 'SCANNING' ? 'AI読み取り中...' : '前泊地・行先地を入力' },
                      ].map(f => (
                        <div key={f.label} className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase px-2">{f.label}</label>
                          <input
                            type="text"
                            value={f.value}
                            onChange={e => f.setter(e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full h-12 bg-white/5 rounded-xl border border-white/10 px-4 text-sm font-bold text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
                          />
                        </div>
                      ))}
                      <div className="pt-4 flex flex-col gap-4">
                         <div className="flex items-center gap-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><PenTool className="text-indigo-400" /><span className="text-sm font-black italic">署名を行ってください</span></div>
                         <Button className="h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl shadow-xl italic uppercase" onClick={() => setActiveTab('lock')}>PMS登録 ＆ 鍵発行へ ➔</Button>
                      </div>
                   </div>
                </div>
             </div>
          </Card>
        )}

        {/* --- 🔑 鍵発行 --- */}
        {activeTab === 'lock' && (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center py-20 space-y-12">
             <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-20 animate-pulse" />
                <Lock size={120} className="text-emerald-500 relative z-10" />
             </div>
             <div className="text-center space-y-4">
                <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Your Access Key</h3>
                <p className="text-slate-500 font-bold italic">チェックイン期間中のみ有効な暗証番号です。</p>
             </div>
             <div className="bg-black border-4 border-emerald-500 p-12 rounded-[4rem] shadow-2xl text-center min-w-[320px]">
                <p className="text-emerald-500 font-black uppercase tracking-[0.4em] text-sm mb-6">Room: 201</p>
                <p className="text-9xl font-black text-white italic tracking-widest drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">8 4 2 1</p>
             </div>
             <Button variant="outline" className="border-white/10 text-slate-500 hover:text-white px-10 h-14 rounded-full font-black uppercase italic" onClick={() => setActiveTab('kiosk')}>Finish ➔</Button>
          </div>
        )}
        
        {/* --- 📊 DMS予約管理 (And-IoT DMS 再現) --- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in">
             <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
               <table className="w-full text-left">
                 <thead className="bg-black/50 text-[10px] font-black text-slate-500 uppercase border-b border-white/5"><tr className="italic"><th className="p-8">予約ID</th><th className="p-8">宿泊者</th><th className="p-8">部屋</th><th className="p-8">ステータス</th></tr></thead>
                 <tbody className="text-sm font-bold italic">
                   <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-8 text-emerald-500 font-mono">BK-8821</td><td className="p-8 text-white">ゲスト 太郎 様</td><td className="p-8">201</td><td className="p-8"><Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 uppercase">Confirmed</Badge></td></tr>
                 </tbody>
               </table>
             </Card>
          </div>
        )}

        {/* --- ⚙️ 設定 --- */}
        {activeTab === 'settings' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-12 animate-in fade-in space-y-10">
             <div className="flex items-center gap-4 text-emerald-500"><Settings size={32} /><h3 className="text-3xl font-black uppercase italic">API Environment</h3></div>
             <div className="grid md:grid-cols-2 gap-8 text-left">
                {['Staysee (PMS)', 'RemoteLock (Device)'].map(label => (
                  <div key={label} className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-4 italic">{label} API KEY</label>
                    <input type="password" value="********" readOnly className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-emerald-500 font-mono" />
                  </div>
                ))}
             </div>
             <Button className="h-16 px-12 bg-white text-slate-950 font-black rounded-2xl italic uppercase">Save Configuration ➔</Button>
          </Card>
        )}
      </div>
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10 mt-10">Nextra AI Autonomous Front System • 2026</div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }