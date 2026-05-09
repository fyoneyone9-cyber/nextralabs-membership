'use client'
import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search, Plus, ArrowRight, Filter, Download, Package
} from 'lucide-react'

const DUMMY_ITEMS = [
  { id: 'LP001', name: 'iPhone 充電器', property: 'ビジネスホテルアップル', room: '302', date: '2026-05-08', status: '保管中', finder: '清掃スタッフ' },
  { id: 'LP002', name: '青色の折りたたみ傘', property: 'ビジネスホテルアップル', room: '405', date: '2026-05-07', status: '返却済', finder: 'フロント' },
]

export default function LostPropertyPage() {
  const [mounted, setMounted] = useState(false)
  const [items] = useState(DUMMY_ITEMS)
  const [query, setQuery] = useState('')

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const filtered = items.filter(i =>
    i.name.includes(query) || i.room.includes(query) || i.property.includes(query)
  )

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-6 md:p-10 text-left">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-widest">
              <Package size={13} className="text-emerald-500" />
              <span>DMS</span>
              <span>/</span>
              <span className="text-white">忘れ物管理</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              忘れ物 <span className="text-emerald-400">管理</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-10 border border-white/10 text-slate-400 hover:bg-white/5 rounded-lg px-4 text-sm font-semibold"
            >
              <Download size={14} className="mr-1.5" /> CSV
            </Button>
            <Button className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-5 text-sm">
              <Plus size={14} className="mr-1.5" /> 新規登録
            </Button>
          </div>
        </div>

        {/* 検索 */}
        <div className="flex items-center gap-3 bg-[#0d0f1a] border border-white/5 rounded-xl p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="品名・部屋番号・物件名で検索..."
              className="w-full h-10 bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <Button variant="ghost" className="h-10 border border-white/10 text-slate-500 hover:bg-white/5 rounded-lg px-4 text-xs font-semibold">
            <Filter size={13} className="mr-1.5" /> フィルター
          </Button>
        </div>

        {/* テーブル */}
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">ステータス</th>
                  <th className="px-5 py-3">発見日</th>
                  <th className="px-5 py-3">物件 / 部屋</th>
                  <th className="px-5 py-3">品名</th>
                  <th className="px-5 py-3">発見者</th>
                  <th className="px-5 py-3 text-right">詳細</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <Badge className={
                        item.status === '保管中'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-semibold'
                          : 'bg-white/5 text-slate-400 border border-white/10 text-[9px] font-semibold'
                      }>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-semibold">{item.date}</td>
                    <td className="px-5 py-4">
                      <p className="text-slate-500 text-[9px] font-medium">{item.property}</p>
                      <p className="text-white font-black">Room {item.room}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-200 font-semibold">{item.name}</td>
                    <td className="px-5 py-4 text-slate-500 font-medium">{item.finder}</td>
                    <td className="px-5 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-500/10 rounded-lg">
                        <ArrowRight size={15} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
