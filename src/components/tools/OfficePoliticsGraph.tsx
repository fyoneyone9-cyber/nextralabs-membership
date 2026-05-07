'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Share2 } from 'lucide-react'

const MasterEngine = () => {
  const [report, setReport] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-blue-600 text-white font-black italic px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">Organization Intelligence</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">社内政治 AI相関図</h1>
      </div>
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
         <h3 className="text-2xl text-white font-black italic mb-10 uppercase flex items-center gap-4"><Share2 className="text-blue-500" /> 人間関係の構造解析</h3>
         <p className="text-slate-400 font-bold leading-relaxed mb-10">組織内のパワーバランス、派閥、深層心理の繋がりをAIが可視化。最適な立ち回りをプランニングします。</p>
         <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="部署名、役職、最近のやり取りなどを入力してください..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-8 text-lg text-white font-bold focus:border-blue-500 outline-none transition-all shadow-inner" />
      </Card>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function PoliticsPage() { return <NoSSR />; }