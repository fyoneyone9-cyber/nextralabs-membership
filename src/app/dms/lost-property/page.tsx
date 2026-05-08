'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, ArrowLeft, Plus, Edit3, Trash2, Camera, MapPin, Calendar, Clock, 
  ChevronRight, Filter, Download, Package, MoreHorizontal, ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LostPropertyPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState([
    { id: 'LP001', name: 'iPhone 充電器', property: 'ビジネスホテルアップル', room: '302', date: '2026-05-08', status: '保管中', finder: '清掃スタッフ' },
    { id: 'LP002', name: '青色の折りたたみ傘', property: 'ビジネスホテルアップル', room: '405', date: '2026-05-07', status: '返却済', finder: 'フロント' }
  ])

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest">
              <Package size={14} className="text-emerald-500" />
              <span>DMS Operations</span>
              <ChevronRight size={12} />
              <span className="text-white">忘れ物管理</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Lost Property <span className="text-emerald-500">Monitor</span></h1>
          </div>
          <div className="flex items-center gap-3">
             <Button className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black italic rounded-full h-12 px-8 text-sm shadow-lg uppercase tracking-tighter"><Plus size={18} className="mr-2" /> 新規登録</Button>
             <Button variant="outline" className="border-white/5 text-slate-500 h-12 rounded-full text-sm font-black italic px-8 uppercase"><Download size={18} className="mr-2" /> CSV</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 bg-[#0a0b14] border border-white/5 p-4 rounded-2xl shadow-xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input placeholder="品名、部屋番号、物件名で検索..." className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all" />
           </div>
           <Button variant="outline" className="border-white/10 h-12 px-6 rounded-xl font-black text-xs uppercase text-slate-400 gap-2"><Filter size={16}/> Filter</Button>
        </div>

        {/* Table */}
        <Card className="bg-[#0a0b14] border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="bg-black/40 text-slate-600 font-black uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="p-6">ステータス</th>
                  <th className="p-6">発見日</th>
                  <th className="p-6">物件名 / 部屋</th>
                  <th className="p-6">品名</th>
                  <th className="p-6">発見者</th>
                  <th className="p-6 text-right">詳細</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 text-left">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-500/5 transition-colors group">
                    <td className="p-6">
                      <Badge className={item.status === '保管中' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-none'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-6 font-black italic text-sm">{item.date}</td>
                    <td className="p-6">
                       <p className="text-slate-500 font-bold text-[9px] uppercase">{item.property}</p>
                       <p className="text-white font-black text-sm">Room {item.room}</p>
                    </td>
                    <td className="p-6 font-black text-sm text-indigo-400 uppercase tracking-tight">{item.name}</td>
                    <td className="p-6 font-bold text-slate-500">{item.finder}</td>
                    <td className="p-6 text-right">
                       <Button variant="ghost" size="sm" className="text-emerald-500 hover:bg-emerald-500/10 rounded-xl"><ArrowRight size={20}/></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
