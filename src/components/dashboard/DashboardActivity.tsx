'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Activity, 
  Clock, 
  History, 
  Cpu, 
  FileText, 
  Clapperboard, 
  Repeat,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardActivity() {
  const supabase = createClient()
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const toolIcons: Record<string, any> = {
    'universal-converter': Repeat,
    'staysee-ai-finder': Clapperboard,
    'default': Cpu
  }

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('api_usage')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
        setActivities(data || [])
      }
      setLoading(false)
    }
    fetchActivity()
  }, [])

  if (loading) return null

  return (
    <div className="space-y-6">
      {/* 🚀 Nextra Intelligence Live Status */}
      <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse" />
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-emerald-500 animate-bounce" />
              <span className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Nextra Intelligence Live</span>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 text-[8px] font-black uppercase tracking-widest">System Online</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Processing</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white italic">2,482</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Calls</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Edge Efficiency</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-400 italic">98.2</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📜 AI Activity Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-500" />
            <h3 className="text-xs font-black text-slate-500 uppercase italic tracking-widest">Recent Activity Log</h3>
          </div>
          <Link href="/dashboard/history" className="text-[8px] font-black text-emerald-500 uppercase tracking-widest hover:underline">View All History</Link>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
              <p className="text-[10px] font-bold text-slate-600 uppercase italic">No recent activities found</p>
            </div>
          ) : (
            activities.map((act, i) => {
              const Icon = toolIcons[act.tool_id] || toolIcons.default
              return (
                <div key={i} className="flex items-center gap-4 bg-[#13141f] border border-white/5 p-4 rounded-2xl hover:border-emerald-500/30 transition-all group shadow-lg">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors border border-white/5">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white italic truncate uppercase">{act.tool_id.replace(/-/g, ' ')}</p>
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <Clock size={8} /> {new Date(act.created_at).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
