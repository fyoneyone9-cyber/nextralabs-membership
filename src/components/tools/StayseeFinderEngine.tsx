'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, UserCheck, Lock, Coins, Building2, Loader2, Zap } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① スキャン', icon: Camera },
  { id: 'match', label: '② 照合プロファイル', icon: UserCheck },
  { id: 'lock', label: '③ 鍵自動発行', icon: Lock },
  { id: 'monetize', label: '④ 収益化', icon: Coins },
  { id: 'insights', label: '⑤ レポート', icon: Building2 },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600">HOTEL DX ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic">AI×ホテルDXシステム【Nextra】</h1>
      </div>
      <div className="flex gap-2 justify-center bg-slate-900 p-2 rounded-2xl">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={lex-1 py-4 rounded-xl font-black \}>{tab.label}</button>
        ))}
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center">
        <h3 className="text-3xl text-white font-black italic mb-6 uppercase">現在、次世代フロント機能を構築中...</h3>
        <p className="text-slate-400">PMSとのAPI自動連携により、宿泊予約と鍵発行を完全同期します。</p>
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function HotelPage() { return <NoSSR />; }