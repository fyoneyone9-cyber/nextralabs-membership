'use client'

import React, { useState } from 'react'
import { Terminal, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

interface DebugPanelProps {
  data: any
}

export function DebugPanel({ data }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!data) return null

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-20 px-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-emerald-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-t-xl border border-white/5 border-b-0"
      >
        <Terminal className="h-3 w-3" />
        {isOpen ? "Close Logs" : "Open System Logs"}
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      
      {isOpen && (
        <div className="bg-[#050507] text-emerald-400 p-8 rounded-b-3xl rounded-r-3xl font-mono text-xs border border-white/5 shadow-2xl overflow-hidden relative">
          <div className="absolute top-4 right-6 flex items-center gap-2 opacity-30">
            <AlertCircle className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">NextraLabs Realtime Debug</span>
          </div>
          <p className="mb-4 text-white opacity-40 uppercase tracking-widest font-black border-b border-white/5 pb-2">Diagnostic Data Output</p>
          <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[300px]">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
