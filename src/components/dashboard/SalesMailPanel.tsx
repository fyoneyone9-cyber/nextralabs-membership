'use client'
import React, { useState } from 'react'
import { Mail, Send, CheckCircle2, Building2, Heart } from 'lucide-react'

const SENT_LIST = [
  { name: 'HOTEL PLUMM 横浜', email: 'info@hotel-plumm.jp', category: 'ホテル・旅館', date: '2026-05-10' },
  { name: 'KOKO HOTEL 横浜鶴見', email: 'info-yokohama_tsurumi@koko-hotels.com', category: 'ホテル・旅館', date: '2026-05-10' },
  { name: '東海道 川崎宿 縁道', email: 'contact@en-michi.jp', category: 'ホテル・旅館', date: '2026-05-10' },
  { name: '強羅環翠楼（箱根）', email: 'info@gourakansuirou.co.jp', category: 'ホテル・旅館', date: '2026-05-10' },
  { name: '良縁サポート 和（川崎市）', email: 'info@ryouensupport-kazu.jp', category: '結婚相談所', date: '2026-05-10' },
]

export default function SalesMailPanel() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const handleSend = () => {
    alert('この機能は近日実装予定です。現在はGmailから手動送信してください。')
  }

  return (
    <div className="space-y-8">
      {/* 送信済み履歴 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-emerald-500/30 pl-4">
          <Mail size={16} className="text-emerald-400" />
          <h2 className="font-semibold text-lg text-emerald-400">送信済み営業メール</h2>
          <span className="text-xs text-slate-500 ml-2">{SENT_LIST.length}件</span>
        </div>
        <div className="space-y-2">
          {SENT_LIST.map((item, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {item.category === 'ホテル・旅館'
                  ? <Building2 size={16} className="text-emerald-400 shrink-0" />
                  : <Heart size={16} className="text-pink-400 shrink-0" />
                }
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-600">{item.date}</span>
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1">
                  <CheckCircle2 size={11} /> 送信済み
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 新規送信フォーム */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-emerald-500/30 pl-4">
          <Send size={16} className="text-emerald-400" />
          <h2 className="font-semibold text-lg text-emerald-400">新規営業メール送信</h2>
        </div>
        <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">宛先</label>
            <input
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="info@example.com"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">件名</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="【ご提案】..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">本文</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={6}
              placeholder="営業メール本文..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
          <button
            onClick={handleSend}
            className="h-10 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-lg transition-all flex items-center gap-2"
          >
            <Send size={14} /> 送信する（近日実装）
          </button>
        </div>
      </div>
    </div>
  )
}
