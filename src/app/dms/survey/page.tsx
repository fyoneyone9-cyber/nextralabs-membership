'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, ChevronDown, Calendar, Search, ChevronRight, Menu, LogOut, Settings, PenLine, Building, Lock, Monitor, Video, Car, FileBarChart
} from 'lucide-react'
import Link from 'next/link'

const MENU_ITEMS = [
  { id: 'checkin', label: 'チェックイン', icon: PenLine, href: '/dms' },
  { id: 'survey', label: 'アンケート回答', icon: MessageSquare, href: '/dms/survey' },
  { id: 'property', label: '物件', icon: Building, href: '/dms/properties' },
  { id: 'lock-list', label: '錠デバイス一覧', icon: Lock, href: '/dms/lock-list' },
  { id: 'terminals', label: 'チェックイン端末', icon: Monitor, href: '/dms/terminals' },
  { id: 'calls', label: '通話一覧(フロント)', icon: Video, href: '/dms/calls' },
  { id: 'cars', label: '車両情報', icon: Car, href: '/dms/cars' },
  { id: 'reports', label: '宿泊実績定期報告', icon: FileBarChart, href: '/dms/reports' },
];

export default function SurveyPage() {
  const [mounted, setMounted] = useState(false)
  const [currentDate] = useState('5/8(金)18:42')

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden bg-[#f3f4f6] text-slate-900">
      {/* 🚀 サイドナビゲーション（Screenshot同期） */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1">
               <span className="text-xs font-bold">{currentDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
             <Badge className="bg-[#e2e8f0] text-[#64748b] border-none text-[10px] font-bold px-2 py-0 h-4">12</Badge>
             <Badge className="bg-[#6366f1] text-white border-none text-[10px] font-bold px-2 py-0 h-4">6</Badge>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {MENU_ITEMS.map(item => (
            <Link key={item.id} href={item.href} className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${item.id === 'survey' ? "bg-[#f1f5f9] text-slate-900 font-bold border-r-4 border-slate-900" : "text-slate-500 hover:bg-gray-50"}`}>
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 mt-auto border-t border-gray-100 space-y-4 text-[10px] text-slate-400 font-bold">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300" /> 通話受付:OFF</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#a78bfa]" /> カメラ:ON</div>
           <div className="text-slate-900">有限会社黄金屋<br/>細井<br/><span className="text-slate-400 font-normal">b.h.apple@beach.ocn...</span></div>
           <div className="flex items-center gap-2 text-slate-500"><LogOut size={12}/> ログアウト</div>
           <div className="text-[8px] text-gray-300 font-normal">v3.50.2</div>
        </div>
      </aside>

      {/* 🚀 メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-left bg-white p-8">
        <div className="flex items-center gap-2 text-lg font-bold mb-8">
           <div className="w-2 h-2 rounded-full bg-slate-900" />
           <h1>アンケート回答</h1>
        </div>

        {/* 物件選択・タブ（Screenshot完全再現） */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="flex-1 max-w-xl relative">
                 <label className="absolute -top-2.5 left-3 px-1 bg-white text-[10px] text-gray-400 font-bold">物件</label>
                 <div className="w-full border border-gray-300 rounded px-4 py-3 flex justify-between items-center text-sm">
                    <span>ビジネスホテルアップル</span>
                    <ChevronDown size={16} className="text-gray-400" />
                 </div>
              </div>
              <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
                 <button className="px-4 py-1.5 text-[10px] font-bold bg-white shadow-sm rounded">単日</button>
                 <button className="px-4 py-1.5 text-[10px] font-bold text-gray-400">週間</button>
              </div>
           </div>

           <div className="flex gap-8 border-b border-gray-100 text-xs font-bold text-gray-400 pb-2">
              <span className="text-indigo-600 border-b-2 border-indigo-600 pb-2 px-1">今日</span>
              <span>明日</span>
              <span>日付指定</span>
           </div>

           {/* アンケートなし状態（Screenshot完全再現） */}
           <div className="pt-12 text-center">
              <p className="text-gray-400 text-xs font-bold italic">アンケートが登録されていません</p>
           </div>
        </div>
      </main>
    </div>
  )
}
