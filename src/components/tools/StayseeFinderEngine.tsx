'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, UserCheck, Lock, Coins, Building2 } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '拾得物スキャン', icon: Camera },
  { id: 'lock', label: '鍵自動発行', icon: Lock },
  { id: 'monetize', label: '返却マネタイズ', icon: Coins },
  { id: 'insights', label: '運営レポート', icon: Building2 },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-4">
        <Badge className="bg-blue-600">Hotel DX Engine</Badge>
        <h1 className="text-6xl md:text-9xl font-black text-white italic uppercase tracking-tighter">NextraAI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm">AI Hotel DX Intelligence</p>
      </div>
      <div className="flex gap-2 justify-center bg-slate-900 p-2 rounded-2xl overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex-1 py-4 px-6 rounded-xl font-black whitespace-nowrap " + (activeTab === tab.id ? "bg-emerald-600 text-white" : "text-slate-500")}>{tab.label}</button>
        ))}
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center border-2 border-emerald-500/20">
        <h3 className="text-3xl text-white font-black italic mb-6">INTELLIGENCE NODE ACTIVE</h3>
        <p className="text-slate-400">PMSとのAPI自動連携、遺失物スキャン機能を統合運用中。</p>
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function HotelPage() { return <NoSSR />; }