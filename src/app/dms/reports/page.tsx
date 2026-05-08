'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileBarChart, Download, Calendar, TrendingUp, Users, DollarSign, ChevronRight, Filter, PieChart, LineChart
} from 'lucide-react'

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-6 md:p-10 text-left">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest">
              <FileBarChart size={14} className="text-emerald-500" />
              <span>DMS Analytics</span>
              <ChevronRight size={12} />
              <span className="text-white">宿泊実績定期報告</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Monthly <span className="text-emerald-500">Report</span></h1>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="border-white/5 text-slate-500 h-12 rounded-full text-sm font-black italic px-8 uppercase"><Download size={18} className="mr-2" /> Export PDF</Button>
             <Button className="bg-[#5c59cc] text-white h-12 px-8 rounded-full font-black italic shadow-lg uppercase"><Download size={18} className="mr-2" /> Export CSV</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Total Revenue', value: '¥2,482,000', change: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
             { label: 'Total Guests', value: '142', change: '+5.2%', icon: Users, color: 'text-blue-500' },
             { label: 'ADR', value: '¥17,478', change: '-2.1%', icon: TrendingUp, color: 'text-purple-500' },
             { label: 'Occupancy', value: '82.4%', change: '+8.0%', icon: PieChart, color: 'text-amber-500' }
           ].map((stat, i) => (
             <Card key={i} className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                   <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}><stat.icon size={20}/></div>
                   <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-black">{stat.change}</Badge>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-2xl font-black text-white italic">{stat.value}</p>
                </div>
             </Card>
           ))}
        </div>

        {/* Chart Mockup */}
        <Card className="bg-[#0a0b14] border border-white/5 rounded-[3rem] p-10 shadow-2xl h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
           <LineChart size={80} className="text-emerald-500/20 mb-4 animate-pulse" />
           <p className="text-slate-600 font-black uppercase tracking-[0.4em] italic text-xl relative z-10">Revenue Analytics Visualizing...</p>
           <p className="text-[10px] text-slate-700 font-bold uppercase mt-2 relative z-10">Historical Data Sync in Progress</p>
        </Card>
      </div>
    </div>
  )
}
