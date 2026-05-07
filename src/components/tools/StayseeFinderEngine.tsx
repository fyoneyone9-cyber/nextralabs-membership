'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, 
  RotateCcw, ClipboardPaste, Building2, Camera, Loader2, 
  Lock, Coins, Network, Shield, Settings, Info, UserPlus, List, Search, RefreshCw, Database, FileSpreadsheet, Download
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'bookings', label: '予約一覧', icon: List, desc: 'DMS予約管理' },
  { id: 'localdb', label: 'ローカルDB', icon: Database, desc: '台帳CSV連携' },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus, desc: '本人確認・記帳' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'API連携デプロイ' },
  { id: 'scan', label: '遺失物特定', icon: Camera, desc: 'AI画像解析' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isMounted, setIsMounted] = useState(false);
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const downloadTemplate = () => {
    const csvContent = "予約ID,宿泊者名,部屋番号,チェックイン日,チェックアウト日,国籍,旅券番号\nBK-0001,米山文貴,201,2026/05/07,2026/05/08,日本,";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "nextra_local_db_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-emerald-600 px-6 py-1 font-black tracking-widest uppercase text-[10px] shadow-lg">Nextra AI Autonomous OS</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.6em] italic text-sm md:text-xl text-center">宿泊DXの「正解」を、自律化する。</p>
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
        {/* --- 📁 ローカルDBタブ --- */}
        {activeTab === 'localdb' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Database size={300} className="text-white" /></div>
               <div className="relative z-10 space-y-12">
                  <div className="text-center space-y-4">
                    <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Database className="text-blue-400" size={48} /> ローカル台帳連携</h3>
                    <p className="text-slate-400 text-lg font-bold italic">PMS連携ができないオフライン環境でも、CSVのインポートでNextra AIを稼働させます。</p>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-12 text-left">
                    <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                       <h4 className="text-xl font-black text-white uppercase italic flex items-center gap-3"><Download className="text-emerald-500" /> 1. 雛形の取得</h4>
                       <p className="text-slate-400 text-sm leading-relaxed">Nextra AIが認識可能な「専用フォーマット」のCSVをダウンロードしてください。既存の台帳からコピー＆ペーストするだけで準備完了です。</p>
                       <Button onClick={downloadTemplate} className="w-full h-16 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all text-lg italic uppercase">
                         CSV雛形をダウンロード ➔
                       </Button>
                    </div>
                    
                    <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                       <h4 className="text-xl font-black text-white uppercase italic flex items-center gap-3"><Upload className="text-blue-500" /> 2. 台帳のアップロード</h4>
                       <p className="text-slate-400 text-sm leading-relaxed">準備したCSVファイルをアップロードしてください。AIが即座に内容を解析し、予約一覧へ同期・統合します。</p>
                       <div className="border-4 border-dashed border-white/10 rounded-2xl p-10 text-center hover:bg-white/5 cursor-pointer group transition-all">
                          <Upload className="h-10 w-10 text-slate-700 mx-auto mb-4 group-hover:text-blue-500" />
                          <p className="text-xs text-slate-500 font-black uppercase">ファイルをドロップ または 選択</p>
                       </div>
                    </div>
                  </div>
               </div>
            </Card>
          </div>
        )}
        
        {/* bookings, checkin, lock, scan タブの復元 */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0b14] p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner">
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/50">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">PMS SYNC: ACTIVE</span>
                 </div>
                 <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/50">
                   <Database size={14} className="text-blue-400" />
                   <span className="text-xs font-black text-blue-400 uppercase tracking-widest italic">LOCAL DB: READY</span>
                 </div>
               </div>
               <Button className="bg-emerald-600 text-white font-black h-10 px-6 rounded-xl shadow-lg">リアルタイム同期</Button>
            </div>
            <div className="overflow-x-auto bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-1 shadow-2xl">
              <table className="w-full text-left border-collapse"><thead className="bg-black/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><tr><th className="p-6">予約ID</th><th className="p-6">宿泊者名</th><th className="p-6 text-center">操作</th></tr></thead><tbody className="text-sm"><tr className="border-b border-white/5 hover:bg-white/5"><td className="p-6 font-mono text-emerald-500">BK-8821</td><td className="p-6 font-bold text-white">米山 文貴</td><td className="p-6 text-center"><button onClick={() => setActiveTab('checkin')} className="text-emerald-400"><ArrowRight /></button></td></tr></tbody></table>
            </div>
          </div>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-v4.6-localdb" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Operational OS • Nextra AI MASTERMODEL • 2026</div>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI...</div> });
export default function HotelPage() { return <NoSSR />; }