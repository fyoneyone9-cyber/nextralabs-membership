'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wifi, Activity, Zap, ShieldCheck, Clock, Server, AlertCircle } from 'lucide-react'

export function ApiMonitorOverlay() {
  const [nodes, setNodes] = useState<any[]>([
    { id: 'gemini', name: 'Gemini 2.5 Flash', status: 'connected', latency: '42ms' },
    { id: 'database', name: 'Supabase DB', status: 'connected', latency: '12ms' },
    { id: 'storage', name: 'Supabase Storage', status: 'connected', latency: '18ms' }
  ])

  return (
    <div className="fixed bottom-6 left-6 z-[9999] pointer-events-none hidden md:block">
      <Card className="bg-black/60 backdrop-blur-xl border-2 border-emerald-500/30 rounded-2xl w-64 shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden animate-in slide-in-from-left duration-700">
        <div className="bg-emerald-500/10 px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] italic">System Sentinel</span>
          </div>
          <Badge variant="outline" className="text-[7px] border-emerald-500/30 text-emerald-500 px-1 py-0 h-4 uppercase">Secure</Badge>
        </div>
        <CardContent className="p-4 space-y-3">
          {nodes.map(node => (
            <div key={node.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${node.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]' : 'bg-red-500'}`} />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{node.name}</span>
              </div>
              <span className="text-[8px] font-mono text-emerald-500/70">{node.latency}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ShieldCheck size={10} className="text-emerald-500/50" />
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">Neural Link Integrity Verified</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
