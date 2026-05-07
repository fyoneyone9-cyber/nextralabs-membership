'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, CheckCircle2, Zap, RotateCcw, ClipboardPaste, 
  Building2, Camera, Loader2, Lock, Coins, Network, Shield, 
  Settings, Info, UserPlus, List, Search, RefreshCw, Database, Download, Upload, Filter, Calendar
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'bookings', label: 'DMS予約一覧', icon: List, desc: '台帳・状況管理' },
  { id: 'localdb', label: '台帳CSV連携', icon: Database, desc: 'ローカルDB同期' },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus, desc: 'PMS本人確認' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'APIキーデプロイ' },
  { id: 'scan', label: '遺失物特定', icon: Camera, desc: 'AI画像解析' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isMounted, setIsMounted] = useState(false);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [lockKeyData, setLockKeyData] = useState(null);

  useEffect(() => { setIsMounted(true); }, []);

  const MOCK_BOOKINGS = [
    { id: 'BK-8821', guest: '米山 文貴', checkin: '2026/05/07', room: '201', status: '確定', device: 'RemoteLock', key: '発行済' },
    { id: 'BK-8822', guest: '田中 太郎', checkin: '2026/05/07', room: '205', status: '確定', device: 'TTLock', key: '未発行' },
    { id: 'BK-8823', guest: '佐藤 結衣', checkin: '2026/05/08', room: '302', status: '予約中', device: 'SwitchBot', key: '-' },
  ];

  const downloadTemplate = () => {
    const csvContent = "予約ID,宿泊者名,部屋番号,チェックイン日,チェックアウト日,国籍\nBK-0001,米山文貴,201,2026/05/07,2026/05/08,日本";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "nextra_dms_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-emerald-600 px-6 py-1 font-black tracking-widest uppercase text-[10px] shadow-lg">Nextra AI Autonomous OS</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl text-center">宿泊DXの「正解」を、自律化する。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-xl scale-[1.05]' : 'bg-[#13141f] border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-400'} size={28} />
            <div className="text-center">
              <p className="text-[11px] font-black uppercase italic leading-none mb-1">{tab.label}</p>
              <p className="text-[9px] font-bold opacity-40">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-left">
        {/* --- 📝 DMS 予約一覧 --- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0b14] p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner">
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/50"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">PMS SYNC: ACTIVE</span></div>
                 <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/50"><Database size={14} className="text-blue-400" /><span className="text-xs font-black text-blue-400 uppercase tracking-widest italic">LOCAL DB: READY</span></div>
               </div>
               <div className="flex items-center gap-3">
                 <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black h-10 px-6 rounded-xl shadow-lg transition-all active:scale-95"><RefreshCw className="mr-2 h-4 w-4" /> リアルタイム同期</Button>
               </div>
            </div>

            <div className="overflow-x-auto bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="p-6">予約ID</th><th className="p-6">宿泊者名</th><th className="p-6">部屋</th><th className="p-6">デバイス</th><th className="p-6">ステータス</th><th className="p-6 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {MOCK_BOOKINGS.map((bk) => (
                    <tr key={bk.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-mono text-emerald-500">{bk.id}</td>
                      <td className="p-6 font-bold text-white">{bk.guest}</td>
                      <td className="p-6 font-black italic">{bk.room}</td>
                      <td className="p-6 font-bold">{bk.device}</td>
                      <td className="p-6"><Badge className={bk.key === '発行済' ? "bg-emerald-600/20 text-emerald-400" : "bg-red-600/20 text-red-400"}>{bk.key}</Badge></td>
                      <td className="p-6 text-center"><button onClick={() => setActiveTab('lock')} className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-all"><ArrowRight size={20} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 📁 台帳CSV連携 --- */}
        {activeTab === 'localdb' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-12">
               <h3 className="text-4xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Database className="text-blue-400" size={48} /> ローカル台帳同期</h3>
               <div className="grid lg:grid-cols-2 gap-10 text-left">
                  <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                     <h4 className="text-xl font-black text-white italic uppercase flex items-center gap-3"><Download className="text-emerald-500" /> 1. 雛形の取得</h4>
                     <p className="text-slate-400 text-sm font-bold">Nextra AI専用のCSVフォーマットをダウンロードして台帳を作成してください。</p>
                     <Button onClick={downloadTemplate} className="w-full h-16 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all text-lg italic uppercase">CSV雛形をダウンロード ➔</Button>
                  </div>
                  <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                     <h4 className="text-xl font-black text-white italic uppercase flex items-center gap-3"><Upload className="text-blue-500" /> 2. 台帳のアップロード</h4>
                     <div className="border-4 border-dashed border-white/10 rounded-2xl p-10 text-center hover:bg-white/5 cursor-pointer group transition-all">
                        <Upload className="h-10 w-10 text-slate-700 mx-auto mb-4 group-hover:text-blue-500" />
                        <p className="text-xs text-slate-500 font-black uppercase">ファイルをドロップ または 選択</p>
                     </div>
                  </div>
               </div>
            </Card>
          </div>
        )}

        {/* 自動チェックイン, 鍵発行, スキャンタブの復元 */}
        {activeTab === 'checkin' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-16 animate-in fade-in text-center">
            <h3 className="text-5xl font-black text-white italic uppercase mb-10">自動チェックイン</h3>
            <button className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] text-3xl uppercase italic active:scale-95 transition-all shadow-xl">身分証スキャン開始 ➔</button>
          </Card>
        )}

        {activeTab === 'lock' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-16 shadow-2xl text-center space-y-12 animate-in fade-in">
             <h3 className="text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> 鍵自動発行デプロイ</h3>
             <button onClick={() => setIsIssuingKey(true)} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl text-3xl uppercase italic active:scale-95 transition-all">鍵発行APIを叩く ➔</button>
             {isIssuingKey && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 animate-in zoom-in text-center"><p className="text-9xl font-black text-white tracking-widest">1022</p></div>}
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-dms-v4.7" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Nextra AI Autonomous Management System • 2026</div>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }