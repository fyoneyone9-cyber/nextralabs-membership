'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Zap, RotateCcw, ClipboardPaste, 
  Building2, Camera, Loader2, Lock, Coins, Network, Shield, 
  UserCheck, Target, Settings, Eye, EyeOff, Info, Sparkles, UserPlus, Key, ShieldCheck, List, Calendar, Search, Filter
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'bookings', label: '予約一覧', icon: List, desc: 'DMS予約管理' },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus, desc: '本人確認・記帳' },
  { id: 'lock', label: '鍵自動発行', icon: Lock, desc: 'API連携デプロイ' },
  { id: 'scan', label: '遺失物特定', icon: Camera, desc: 'AI画像解析' },
  { id: 'insights', label: 'レポート', icon: Building2, desc: '経営分析' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isMounted, setIsMounted] = useState(false);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [lockKeyData, setLockKeyData] = useState(null);

  useEffect(() => { setIsMounted(true); }, []);

  // 模擬予約データ (And-IoT DMS 風)
  const MOCK_BOOKINGS = [
    { id: 'BK-8821', guest: '米山 文貴', checkin: '2026/05/07', room: '201', status: '確定', device: 'RemoteLock', key: '発行済' },
    { id: 'BK-8822', guest: '田中 太郎', checkin: '2026/05/07', room: '205', status: '確定', device: 'TTLock', key: '未発行' },
    { id: 'BK-8823', guest: '佐藤 結衣', checkin: '2026/05/08', room: '302', status: '予約中', device: 'SwitchBot', key: '-' },
  ];

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-blue-600 px-6 py-1 font-black tracking-widest uppercase">Nextra AI x And-IoT</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl">Unified Booking & Access Management</p>
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
        {/* --- 📝 And-IoT DMS 風：予約管理リスト --- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0b14] p-6 rounded-3xl border border-white/10">
               <div className="flex items-center gap-4 w-full md:w-auto">
                 <Search className="text-emerald-500" size={20} />
                 <input placeholder="予約者名、予約IDで検索..." className="bg-transparent border-b border-white/10 outline-none text-sm w-full md:w-64 pb-1 focus:border-emerald-500 transition-colors" />
               </div>
               <div className="flex items-center gap-2 w-full md:w-auto">
                 <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 uppercase text-[10px]">Today: 2 Check-ins</Badge>
                 <Button size="sm" className="bg-emerald-600 h-8 rounded-lg text-[10px] font-black">PMSデータ同期</Button>
               </div>
            </div>

            <div className="overflow-x-auto bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="p-6">予約ID</th>
                    <th className="p-6">宿泊者名</th>
                    <th className="p-6">部屋</th>
                    <th className="p-6">チェックイン</th>
                    <th className="p-6">デバイス</th>
                    <th className="p-6">ステータス</th>
                    <th className="p-6 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {MOCK_BOOKINGS.map((bk) => (
                    <tr key={bk.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 font-mono text-emerald-500">{bk.id}</td>
                      <td className="p-6 font-bold text-white">{bk.guest}</td>
                      <td className="p-6 font-black italic">{bk.room}</td>
                      <td className="p-6 text-slate-400">{bk.checkin}</td>
                      <td className="p-6 font-bold">{bk.device}</td>
                      <td className="p-6">
                        <Badge className={bk.key === '発行済' ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "bg-red-600/20 text-red-400 border border-red-500/30"}>
                          {bk.key}
                        </Badge>
                      </td>
                      <td className="p-6 text-center">
                        <button onClick={() => setActiveTab('checkin')} className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-all"><ArrowRight size={20} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 自動チェックイン */}
        {activeTab === 'checkin' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 animate-in fade-in text-center">
            <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-6"><UserPlus className="text-emerald-500" size={48} /> 自動チェックイン</h3>
            <div className="bg-black/60 p-8 rounded-3xl border-2 border-emerald-500/30 space-y-5 shadow-2xl text-left max-w-3xl mx-auto mb-10">
              <div className="flex items-center gap-3 text-emerald-400"><ShieldCheck size={24} /><p className="text-sm font-black uppercase tracking-[0.2em]">旅館業法・標準入項目（全国一律）</p></div>
              <p className="text-slate-300 text-sm">パスポート・身分証をAIがスキャンし、PMS（Staysee/Beds24等）へ自動記帳。本人確認を0秒で完了させます。</p>
            </div>
            <button className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl text-3xl uppercase italic active:scale-95 transition-all">スキャン開始 ➔</button>
          </Card>
        )}

        {/* 鍵発行 */}
        {activeTab === 'lock' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl text-center space-y-10 animate-in fade-in">
             <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> 鍵自動発行デプロイ</h3>
             <button onClick={() => setIsIssuingKey(true)} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-6 text-3xl uppercase italic active:scale-95 transition-all border-b-8 border-emerald-900 active:border-b-0">
               連携実行
             </button>
             {isIssuingKey && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in zoom-in text-center"><p className="text-emerald-500 font-black uppercase tracking-widest text-sm mb-4">Issued Passcode</p><p className="text-9xl font-black text-white tracking-widest italic">1022</p></div>}
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-dms-v4.1" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Nextra AI x And-IoT Integrated System • 2026</div>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI Hub...</div> });
export default function HotelPage() { return <NoSSR />; }