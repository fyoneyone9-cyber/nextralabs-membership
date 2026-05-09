'use client'

import React from 'react'
import { Zap } from 'lucide-react'

export function ApiLinkIndicator({ model = 'Gemini 2.5 Flash' }) {
  return (
    <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <Zap size={10} className="text-emerald-400" />
      <span className="text-[10px] font-semibold text-slate-400">{model}</span>
    </div>
  )
}
