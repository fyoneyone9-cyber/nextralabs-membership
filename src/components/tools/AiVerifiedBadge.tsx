'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, Cpu } from 'lucide-react'

export function AiVerifiedBadge({ isSample = false, model = 'Gemini 2.5 Flash' }) {
  if (isSample) {
    return (
      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg animate-pulse">
        <AlertTriangle size={14} className="text-red-500" />
        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight ">⚠️ SAMPLE DATA / ハリボテ</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
      <CheckCircle2 size={14} className="text-emerald-400" />
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight ">💎 AI Verified</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{model} Generated</span>
      </div>
    </div>
  )
}
