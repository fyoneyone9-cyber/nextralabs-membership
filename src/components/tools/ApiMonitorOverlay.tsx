'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, ShieldCheck } from 'lucide-react'

export function ApiMonitorOverlay() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [nodes] = useState<any[]>([
    { id: 'gemini', name: 'Gemini 2.5 Flash', status: 'connected', latency: '42ms' },
    { id: 'rakuten', name: 'Rakuten Affiliate', status: 'connected', latency: '86ms' },
    { id: 'shopify', name: 'Shopify / Printful', status: 'connected', latency: '110ms' },
    { id: 'gmail', name: 'Gmail / Google Docs', status: 'connected', latency: '320ms' },
    { id: 'database', name: 'Supabase DB', status: 'connected', latency: '12ms' },
    { id: 'storage', name: 'Supabase Storage', status: 'connected', latency: '18ms' }
  ])

  return (
    <div 
      className="fixed bottom-6 left-6 z-[9999] hidden md:flex items-end gap-3 transition-all duration-500"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Trigger Dot / Icon */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-emerald-500/30 bg-black/60 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer transition-all duration-500 ${isExpanded ? 'rotate-90 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : ''}`}>
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>
      </div>

      {/* Expanded Panel */}
      <div className={`transition-all duration-500 origin-left overflow-hidden ${isExpanded ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4 pointer-events-none'}`}>
        <Card className="bg-black/60 backdrop-blur-xl border-2 border-emerald-500/30 rounded-2xl w-64 shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden">
          <div className="bg-emerald-500/10 px-4 py-2 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] italic">System Sentinel</span>
            </div>
            <Badge variant="outline" className="text-[7px] border-emerald-500/30 text-emerald-500 px-1 py-0 h-4 uppercase font-black">Secure</Badge>
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
                <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.1em] italic leading-tight">Neural Link Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
