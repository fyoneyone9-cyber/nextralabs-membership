'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network, Share2, Zap, Loader2, Search } from 'lucide-react'

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-pink-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full">Viral Affiliate OS</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic text-center">アフィリエイトAI連携</h1>
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center">
        <div className="flex justify-center mb-8"><div className="p-6 bg-white/5 rounded-full border border-white/10 text-pink-400"><Network size={48} /></div></div>
        <h3 className="text-3xl text-white font-black italic mb-6 uppercase text-center">宿紹介 × 楽天収益化OS</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-center">宿泊者がSNSで宿を紹介する際、バズる紹介文と楽天アフィリエイトリンクをAIが自動生成。宿の認知拡大と収益化を同時に実現します。</p>
        <button className="mt-10 h-20 px-12 bg-pink-600 text-white font-black rounded-2xl shadow-xl hover:bg-pink-500 transition-all uppercase italic">連携を開始する ➔</button>
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function AffiliatePage() { return <NoSSR />; }