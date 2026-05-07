'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, Globe, Landmark, ListChecks, Loader2 } from 'lucide-react'

const TABS = [
  { id: 'account', label: '① KDP設定', icon: Landmark },
  { id: 'manuscript', label: '② 内容・構成', icon: FileText },
  { id: 'register', label: '③ 本の情報', icon: ListChecks },
  { id: 'publish', label: '④ 出版申請', icon: Globe },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-orange-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full">Publishing OS</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic text-center">Kindle出版AI完全ナビ</h1>
      </div>
      <div className="flex gap-2 justify-center bg-slate-900 p-2 rounded-2xl overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex-1 py-4 px-6 rounded-xl font-black whitespace-nowrap " + (activeTab === tab.id ? "bg-orange-600 text-white" : "text-slate-500")}>{tab.label}</button>
        ))}
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center">
        <h3 className="text-3xl text-white font-black italic mb-6 uppercase text-center">執筆から出版までの一気通貫ガイド</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-center">AIの力を借りて、最短距離で電子書籍作家デビュー。目次構成から申請手順まで、全工程をナビゲートします。</p>
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function KdpPage() { return <NoSSR />; }