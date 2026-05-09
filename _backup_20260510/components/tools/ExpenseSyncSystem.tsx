'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt } from 'lucide-react'

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-2 border-emerald-500 rounded-[4rem]"
      style={{ boxShadow: '0 0 12px rgba(16,185,129,0.35)' }}>
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-1 rounded-full font-medium text-xs">
          BUSINESS AUTOMATION
        </Badge>
        <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.15] text-center">
          Expense <span className="text-emerald-400">AI Sync</span>
        </h1>
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center border border-white/5">
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
            <Receipt size={48} />
          </div>
        </div>
        <h3 className="text-2xl text-white font-semibold mb-4 text-center">経費精算の全自動・記帳OS</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-center leading-relaxed">
          レシートや領収書の画像をAIが精密解析。金額、日付、店舗名を自動抽出し、スプレッドシートへリアルタイムに記帳します。
        </p>
        <button className="mt-10 h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg transition-all"
          style={{ boxShadow: '0 0 12px rgba(16,185,129,0.3)' }}>
          レシートをスキャン →
        </button>
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function ExpenseSyncPage() { return <NoSSR />; }
