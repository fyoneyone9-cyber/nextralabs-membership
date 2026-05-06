'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, ArrowRight, Sparkles 
} from 'lucide-react'

// 各マスタツールのリスト
const MASTER_MODELS = [
  { id: 'staysee-ai-finder', name: 'Staysee AI Finder', version: 'v3.4', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'inbox-organizer', name: 'Gmail AI Accelerator', version: 'v5.0', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', version: 'v2.0', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', version: 'v7.0', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'disaster-guard', name: 'AI防災パーソナルガイド', version: 'v6.0', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', version: 'v2.1', color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'expense-sync', name: 'Expense Sync', version: 'v1.0', color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { id: 'contact-sync', name: 'Contact Sync', version: 'v1.0', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'interior-coordinator', name: 'Interior Sync', version: 'v1.0', color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { id: 'youtube-coordinator', name: 'YouTube Sync', version: 'v1.0', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const PortPageContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return <div className="min-h-screen bg-[#050507]" />;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-4 md:p-10 pb-32 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-emerald-600 text-white font-black italic px-4 py-1 rounded-full uppercase text-xs tracking-widest shadow-lg">NextraLabs Intelligence Port</Badge>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">THE PORT</h1>
          <p className="text-slate-500 font-bold italic uppercase tracking-widest text-sm">Unified Master Model Showcase</p>
        </div>

        {/* Master Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASTER_MODELS.map((model) => (
            <Link key={model.id} href={`/products/${model.id}/app`}>
              <Card className="bg-[#13141f] border-2 border-emerald-500/50 rounded-[2.5rem] p-8 hover:scale-[1.03] hover:border-emerald-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-48 flex flex-col justify-center">
                <div className="absolute top-0 right-8 bg-emerald-500 text-slate-950 text-[8px] font-black px-3 py-0.5 rounded-b-lg uppercase tracking-tighter shadow-lg">MASTER</div>
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 ${model.bg} ${model.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <Zap size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic leading-tight group-hover:text-emerald-400 transition-colors uppercase">{model.name}</h3>
                    <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest italic">Node Status: Online ({model.version})</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Closing Section */}
        <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[3rem] p-10 md:p-16 text-center space-y-6 shadow-inner relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
           <Sparkles className="w-16 h-16 text-emerald-500 mx-auto animate-pulse" />
           <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Everything Is Synced.</h2>
           <p className="text-slate-400 max-w-xl mx-auto font-bold leading-relaxed">
             このポートはNextraLabsの全ての知能（マスタモデル）が集結する中枢です。サブスクリプションと独立した「純粋な体験」として、あなたのビジネスと生活を拡張します。
           </p>
           <Link href="/products" className="inline-flex items-center gap-4 bg-white text-slate-950 font-black px-12 py-5 rounded-2xl shadow-2xl hover:bg-emerald-50 transition-all active:scale-95 text-lg italic uppercase">
             Explore Catalog <ArrowRight />
           </Link>
        </div>

      </div>
      <div className="text-center opacity-10 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">NextraLabs Port Terminal • 2026</div>
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(PortPageContent), { ssr: false });

export default function PortPage() {
  return <NoSSRWrapper />;
}
