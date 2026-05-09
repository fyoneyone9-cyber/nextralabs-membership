'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, TrendingUp, Loader2, Search, Hotel, Zap } from 'lucide-react'

const MasterEngine = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600">HOTEL DX ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic">競合AI価格監視</h1>
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center">
        <div className="flex justify-center mb-8"><div className="p-6 bg-white/5 rounded-full border border-white/10 text-emerald-400"><Hotel size={48} /></div></div>
        <h3 className="text-3xl text-white font-black italic mb-6 uppercase text-center">周辺宿の販売価格をAIが24時間監視</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-center">楽天市場や宿泊予約サイトから競合の価格をリアルタイム収集。NextraLabsのAIが最適な販売価格を戦略的に提案します。</p>
        <button className="mt-10 h-20 px-12 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-500 transition-all uppercase italic">監視プロトコルを始動 ➔</button>
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function CompPricePage() { return <NoSSR />; }