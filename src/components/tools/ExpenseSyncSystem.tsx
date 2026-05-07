'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, Receipt, Loader2, Sparkles, Database, FileText } from 'lucide-react'

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-blue-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600">BUSINESS AUTOMATION</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic text-center">Expense AI Sync</h1>
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center">
        <div className="flex justify-center mb-8"><div className="p-6 bg-white/5 rounded-full border border-white/10 text-blue-400"><Receipt size={48} /></div></div>
        <h3 className="text-3xl text-white font-black italic mb-6 uppercase text-center">経費精算の全自動・記帳OS</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-center">レシートや領収書の画像をAIが精密解析。金額、日付、店舗名を自動抽出し、スプレッドシートへリアルタイムに記帳します。</p>
        <button className="mt-10 h-20 px-12 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-500 transition-all uppercase italic">レシートをスキャン ➔</button>
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function ExpenseSyncPage() { return <NoSSR />; }