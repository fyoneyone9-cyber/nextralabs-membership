'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, Star, Search, ChevronRight, Filter, Download, ArrowRight, Calendar, User
} from 'lucide-react'

export default function SurveyPage() {
  const [mounted, setMounted] = useState(false)
  const surveys = [
    { id: 'SV001', guest: 'ゆかわ まさる', date: '2026-05-08', rating: 5, comment: '非常に快適な滞在でした。スマートチェックインがスムーズで驚きました。', property: 'ビジネスホテルアップル' },
    { id: 'SV002', guest: 'SEKIDO KENJI', date: '2026-05-08', rating: 4, comment: '部屋が綺麗で良かったです。', property: 'ビジネスホテルアップル' }
  ]

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest">
              <MessageCircle size={14} className="text-emerald-500" />
              <span>DMS Operations</span>
              <ChevronRight size={12} />
              <span className="text-white">アンケート回答</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Guest <span className="text-emerald-500">Feedback</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {surveys.map(s => (
             <Card key={s.id} className="bg-[#0a0b14] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden hover:border-emerald-500/30 transition-all p-8 space-y-6 group">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/20 transition-all">
                         <User className="text-slate-400 group-hover:text-emerald-500" size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-black text-white italic uppercase tracking-tight">{s.guest} 様</p>
                         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{s.property}</p>
                      </div>
                   </div>
                   <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < s.rating ? "text-amber-400 fill-amber-400" : "text-slate-800"} />
                      ))}
                   </div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 shadow-inner">
                   <p className="text-slate-400 text-sm font-medium leading-relaxed italic">"{s.comment}"</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                   <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase">
                      <Calendar size={12}/> {s.date}
                   </div>
                   <Button variant="ghost" className="text-emerald-500 hover:bg-emerald-500/10 rounded-full font-black text-[10px] uppercase italic tracking-widest gap-2">View Full Report <ArrowRight size={14}/></Button>
                </div>
             </Card>
           ))}
        </div>
      </div>
    </div>
  )
}
