'use client'
import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, ChevronDown, Plus } from 'lucide-react'

export default function SurveyPage() {
  const [mounted, setMounted] = useState(false)
  const [property, setProperty] = useState('ビジネスホテルアップル')
  const [mode, setMode] = useState<'single' | 'week'>('single')

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-6 md:p-10 text-left">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-widest">
              <MessageSquare size={13} className="text-emerald-500" />
              <span>DMS</span>
              <span>/</span>
              <span className="text-white">アンケート回収</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              アンケート <span className="text-emerald-400">回収</span>
            </h1>
          </div>
          <Button className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-5 text-sm">
            <Plus size={14} className="mr-1.5" /> 新規アンケート作成
          </Button>
        </div>

        {/* フィルター */}
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* 物件選択 */}
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1 bg-[#0d0f1a] text-[9px] text-slate-500 font-semibold">物件</label>
              <div className="flex items-center gap-2 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-300 min-w-56 cursor-pointer hover:border-emerald-500/40 transition-all">
                <span>{property}</span>
                <ChevronDown size={14} className="text-slate-500 ml-auto" />
              </div>
            </div>
            {/* 期間切替 */}
            <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5">
              {(['single', 'week'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    mode === m ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m === 'single' ? '単日' : '週間'}
                </button>
              ))}
            </div>
          </div>

          {/* タブ */}
          <div className="flex gap-6 border-b border-white/5 text-xs font-semibold">
            {['今日', '明日', '日付指定'].map((t, i) => (
              <button
                key={t}
                className={`pb-2.5 px-1 transition-all ${
                  i === 0
                    ? 'text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 空状態 */}
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl py-24 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <MessageSquare size={28} className="text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm font-semibold">アンケートが登録されていません</p>
          <p className="text-slate-700 text-xs">「新規アンケート作成」からテンプレートを選択してください</p>
        </div>

      </div>
    </div>
  )
}
