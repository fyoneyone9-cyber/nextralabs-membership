'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Monitor, RefreshCw, Zap, Wifi, Signal, AlertCircle, ChevronRight, Power, Settings
} from 'lucide-react'

export default function TerminalsPage() {
  const [mounted, setMounted] = useState(false)
  const terminals = [
    { id: 'TRM-001', name: 'フロント 01', location: '1F エントランス', status: 'Online', battery: '98%', lastSync: '1分前', ip: '192.168.1.50' },
    { id: 'TRM-002', name: 'フロント 02', location: '1F エントランス', status: 'Offline', battery: '0%', lastSync: '3時間前', ip: '192.168.1.51' }
  ]

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest">
              <Monitor size={14} className="text-emerald-500" />
              <span>DMS Monitoring</span>
              <ChevronRight size={12} />
              <span className="text-white">チェックイン端末</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Terminal <span className="text-emerald-500">Status</span></h1>
          </div>
          <Button variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 h-12 rounded-full font-black italic px-8"><RefreshCw size={18} className="mr-2" /> 全端末一斉再起動指令</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {terminals.map(t => (
             <Card key={t.id} className={`bg-[#0a0b14] border rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden shadow-2xl transition-all hover:scale-[1.02] ${t.status === 'Online' ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                {t.status === 'Online' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />}
                
                <div className="flex justify-between items-start relative z-10">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{t.name}</h3>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">{t.id}</p>
                   </div>
                   <Badge className={t.status === 'Online' ? 'bg-emerald-500 text-slate-950 font-black italic animate-pulse' : 'bg-red-600 text-white font-black italic'}>
                      {t.status}
                   </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                   <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[8px] font-black text-slate-600 uppercase">Connection</p>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                         <Wifi size={14}/> Stable
                      </div>
                   </div>
                   <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[8px] font-black text-slate-600 uppercase">Battery</p>
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                         <Zap size={14} className="text-amber-400"/> {t.battery}
                      </div>
                   </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5 relative z-10">
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-600 uppercase">Last Seen</span>
                      <span className="text-slate-400">{t.lastSync}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-600 uppercase">IP Address</span>
                      <span className="text-slate-400">{t.ip}</span>
                   </div>
                </div>

                <div className="flex gap-2 pt-4 relative z-10">
                   <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 text-[10px] font-black uppercase italic tracking-widest text-slate-400">Settings</Button>
                   <Button variant="outline" className="w-12 border-red-500/20 text-red-500 hover:bg-red-500/10"><Power size={18}/></Button>
                </div>
             </Card>
           ))}
        </div>
      </div>
    </div>
  )
}
