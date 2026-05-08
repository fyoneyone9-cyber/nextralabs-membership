'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Wifi, Zap, ShieldCheck } from 'lucide-react'

export function ApiLinkIndicator({ model = 'Gemini 2.5 Flash' }) {
  return (
    <div className="flex items-center gap-3 bg-black/40 border border-emerald-500/20 px-4 py-2 rounded-xl backdrop-blur-sm shadow-inner">
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Neural Link: Active</span>
      </div>
      <div className="h-3 w-px bg-white/10" />
      <div className="flex items-center gap-1.5">
        <Zap size={10} className="text-amber-400" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{model}</span>
      </div>
    </div>
  )
}
