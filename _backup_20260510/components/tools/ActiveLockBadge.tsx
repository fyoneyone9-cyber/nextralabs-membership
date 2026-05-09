'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Lock, Zap } from 'lucide-react'

export function ActiveLockBadge() {
  return (
    <div className="flex items-center gap-3 bg-[#1a1033] border-2 border-purple-500/50 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-pulse group relative overflow-hidden">
      {/* 背景の光彩演出 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-fuchsia-500/10 to-purple-600/10 group-hover:opacity-100 opacity-50 transition-opacity" />
      
      <div className="flex items-center gap-2 relative z-10">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"></span>
        </div>
        <span className="text-[11px] font-black text-purple-100 uppercase tracking-[0.2em] italic">SYSTEM ACTIVE</span>
      </div>
      
      <div className="h-4 w-px bg-purple-500/30 relative z-10" />
      
      <div className="flex items-center gap-1.5 relative z-10">
        <Lock size={12} className="text-purple-300" />
        <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest italic">LOCKED</span>
      </div>
      
      {/* 憲法に基づく説明ツールチップ（ホバー時） */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 flex items-center justify-center pointer-events-none">
        <span className="text-[9px] font-black text-white uppercase tracking-tighter">憲法：全修正対象外 / 個別指示のみ有効</span>
      </div>
    </div>
  )
}
