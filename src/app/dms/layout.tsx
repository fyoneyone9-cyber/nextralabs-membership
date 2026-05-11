'use client'
import React, { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Video } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch { /* 非対応ブラウザは無視 */ }
}

interface IncomingCall {
  roomUrl: string
  propertyName: string
  createdAt: string
}

function DmsCallNotifier() {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel('dms-layout-call-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dms_call_events' },
        (payload) => {
          const row = payload.new as any
          playNotificationSound()
          setIncomingCall({
            roomUrl: row.room_url,
            propertyName: row.property_name,
            createdAt: row.created_at,
          })
        }
      )
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [])

  // 30秒で自動消去
  useEffect(() => {
    if (!incomingCall) return
    const t = setTimeout(() => setIncomingCall(null), 30000)
    return () => clearTimeout(t)
  }, [incomingCall])

  if (!incomingCall) return null

  const time = (() => {
    try {
      return new Date(incomingCall.createdAt).toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit',
      })
    } catch { return '' }
  })()

  return (
    <div
      className="fixed top-4 left-1/2 z-[9999] flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl"
      style={{
        transform: 'translateX(-50%)',
        background: '#0d1117',
        border: '2px solid #10b981',
        boxShadow: '0 0 40px rgba(16,185,129,0.45)',
        minWidth: 300,
        maxWidth: 420,
      }}
    >
      {/* アイコン */}
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 animate-pulse"
        style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981' }}>
        <Video size={20} style={{ color: '#10b981' }} />
      </div>

      {/* テキスト */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-emerald-400">📞 フロント呼び出し！</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {incomingCall.propertyName} · {time}
        </p>
      </div>

      {/* ボタン */}
      <div className="flex gap-2 shrink-0">
        <a
          href={incomingCall.roomUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIncomingCall(null)}
          className="h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          style={{ background: '#10b981', color: '#fff' }}
        >
          <Video size={12} /> 応答
        </a>
        <button
          onClick={() => setIncomingCall(null)}
          className="h-9 px-3 rounded-xl text-xs font-semibold transition-all"
          style={{ background: '#1e293b', color: '#64748b', border: '1px solid #334155' }}
        >
          閉じる
        </button>
      </div>
    </div>
  )
}

export default function DmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DmsCallNotifier />
      {children}
    </>
  )
}
