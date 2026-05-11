'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Video, ArrowLeft, ExternalLink, Plus, Clock, Building, RefreshCw, Info, Bell, BellOff } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CallRecord {
  id: string
  roomName: string
  roomUrl: string
  propertyName: string
  createdAt: string
  status: 'active' | 'ended'
}

const STORAGE_KEY_API = 'dms_org_daily_api_key'
const STORAGE_KEY_HISTORY = 'dms_call_history'

// 通知音（800Hz ビープ音をWeb Audio APIで生成）
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.setValueAtTime(600, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch { /* 非対応ブラウザは無視 */ }
}

export default function CallsEngine() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [callHistory, setCallHistory] = useState<CallRecord[]>([])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [refreshed, setRefreshed] = useState(false)
  const [notifyEnabled, setNotifyEnabled] = useState(true)
  const [incomingCall, setIncomingCall] = useState<CallRecord | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_API) || ''
    setApiKey(stored)
    setApiKeySaved(!!stored.trim())
    try {
      const hist = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]')
      setCallHistory(hist)
    } catch {
      setCallHistory([])
    }

    // Supabase Realtime購読: dms_call_eventsテーブルのINSERTを監視
    const channel = supabase
      .channel('dms-call-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dms_call_events' },
        (payload) => {
          const row = payload.new as any
          const newRecord: CallRecord = {
            id: row.id || row.room_name,
            roomName: row.room_name,
            roomUrl: row.room_url,
            propertyName: row.property_name,
            createdAt: row.created_at,
            status: row.status || 'active',
          }

          // 履歴に追加
          setCallHistory(prev => {
            const updated = [newRecord, ...prev].slice(0, 50)
            localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated))
            return updated
          })

          // 通知
          setNotifyEnabled(prev => {
            if (prev) {
              playNotificationSound()
              setIncomingCall(newRecord)
            }
            return prev
          })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 着信バナー自動消去（30秒）
  useEffect(() => {
    if (!incomingCall) return
    const timer = setTimeout(() => setIncomingCall(null), 30000)
    return () => clearTimeout(timer)
  }, [incomingCall])

  const saveApiKey = () => {
    localStorage.setItem(STORAGE_KEY_API, apiKey.trim())
    setApiKeySaved(!!apiKey.trim())
    setError('')
  }

  const refreshHistory = () => {
    try {
      const hist = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]')
      setCallHistory(hist)
      setRefreshed(true)
      setTimeout(() => setRefreshed(false), 2000)
    } catch {
      setCallHistory([])
    }
  }

  const createRoom = async () => {
    setError('')
    setCreating(true)
    try {
      const res = await fetch('/api/dms/daily-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-daily-api-key': apiKey } : {}),
        },
        body: JSON.stringify({ propertyName: 'フロント' }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || '通話ルームの作成に失敗しました')
        return
      }
      const data = await res.json()
      const newRecord: CallRecord = {
        id: data.name,
        roomName: data.name,
        roomUrl: data.url,
        propertyName: data.propertyName,
        createdAt: data.createdAt,
        status: 'active',
      }
      const updated = [newRecord, ...callHistory].slice(0, 50)
      setCallHistory(updated)
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated))
      window.open(data.url, '_blank')
    } catch {
      setError('ネットワークエラーが発生しました')
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    } catch { return iso }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans">

      {/* 着信バナー（フロート） */}
      {incomingCall && (
        <div
          className="fixed top-4 left-1/2 z-[9999] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl"
          style={{
            transform: 'translateX(-50%)',
            background: '#0d1117',
            border: '2px solid #10b981',
            boxShadow: '0 0 40px rgba(16,185,129,0.4)',
            minWidth: 320,
            animation: 'pulse 1s ease-in-out 3',
          }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 animate-pulse"
            style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981' }}>
            <Video size={22} style={{ color: '#10b981' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-400">📞 フロント呼び出し！</p>
            <p className="text-xs text-slate-400 mt-0.5">{incomingCall.propertyName} · {formatDate(incomingCall.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={incomingCall.roomUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIncomingCall(null)}
              className="h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5"
              style={{ background: '#10b981', color: '#fff' }}
            >
              <Video size={13} /> 応答
            </a>
            <button
              onClick={() => setIncomingCall(null)}
              className="h-9 px-3 rounded-xl text-xs font-semibold"
              style={{ background: '#1e293b', color: '#64748b' }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header className="bg-[#0d0f1a] border-b border-white/5 sticky top-0 z-40">
        <div className="px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dms" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-sm">
              <ArrowLeft size={16} />
              <span className="font-semibold">DMS</span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-sm font-bold text-slate-200">通話管理</span>
          </div>
          <div className="flex items-center gap-3">
            {/* 通知ON/OFF */}
            <button
              onClick={() => setNotifyEnabled(v => !v)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: notifyEnabled ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                border: notifyEnabled ? '1px solid rgba(16,185,129,0.3)' : '1px solid #1e293b',
                color: notifyEnabled ? '#10b981' : '#64748b',
              }}
            >
              {notifyEnabled ? <Bell size={12} /> : <BellOff size={12} />}
              {notifyEnabled ? '通知ON' : '通知OFF'}
            </button>
            {/* Realtime接続インジケーター */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              リアルタイム監視中
            </div>
            <Video size={18} className="text-emerald-400" />
          </div>
        </div>
      </header>

      <main className="p-5 space-y-5 max-w-3xl">

        {/* APIキー設定カード */}
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Video size={15} className="text-emerald-400" />
              Daily.co API キー設定
            </h2>
            {apiKeySaved && (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                ✅ Daily.co 接続済み
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Daily.co API キーを入力..."
                className="w-full h-10 rounded-lg px-4 pr-10 text-sm font-mono outline-none transition-colors"
                style={{ background: '#13141f', border: '1px solid #334155', color: '#10b981' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
              <button type="button" onClick={() => setShowApiKey(v => !v)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-sm">
                {showApiKey ? '🙈' : '👁'}
              </button>
            </div>
            <button onClick={saveApiKey}
              className="h-10 px-5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#10b981', color: '#fff' }}>
              保存
            </button>
          </div>
        </div>

        {/* 仕組み説明 */}
        <div className="bg-[#0d0f1a] border border-indigo-500/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
            <Info size={15} className="text-indigo-400" />
            フロント通話の仕組み
          </h3>
          <div className="space-y-3">
            {[
              { step: '①', title: 'ゲストがKIOSKで呼び出す', desc: 'KIOSKトップの「フロントを呼び出す」を押すとDaily.coのルームが自動生成され、ゲストのブラウザで通話画面が開きます。', color: '#818cf8' },
              { step: '②', title: 'この画面に即時通知が届く', desc: 'この画面を開いておくと、ゲストが呼び出した瞬間に音とバナーで通知されます。「更新」ボタン不要です。', color: '#10b981' },
              { step: '③', title: '「応答」ボタンで即座に参加', desc: '着信バナーの「応答」ボタン、または履歴の「参加」ボタンを押すとビデオ通話に参加できます。', color: '#6366f1' },
              { step: '④', title: 'スタッフ側から発信も可能', desc: '「新しい通話ルームを作成」でスタッフ側から発信できます。URLをゲストに共有すれば通話できます。', color: '#f59e0b' },
            ].map(item => (
              <div key={item.step} className="flex gap-3 p-3 rounded-xl" style={{ background: '#13141f', border: `1px solid ${item.color}20` }}>
                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${item.color}20`, color: item.color }}>{item.step}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: item.color }}>{item.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 p-3 rounded-xl text-[11px] text-amber-400"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
            ⚠️ <span>このページを開いたままにしてください。バックグラウンドタブでも通知されます。Daily.co無料プランは200分/月まで利用可能。</span>
          </div>
        </div>

        {/* エラー */}
        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>
        )}

        {/* 新規通話作成ボタン */}
        <button onClick={createRoom} disabled={creating}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all">
          {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
          新しい通話ルームを作成（スタッフ発信）
        </button>

        {/* 通話履歴 */}
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock size={15} className="text-emerald-400" />
              通話履歴
            </h3>
            <button onClick={refreshHistory}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: refreshed ? '#34d399' : '#10b981' }}>
              <RefreshCw size={11} />
              {refreshed ? '更新しました ✓' : '手動更新'}
            </button>
          </div>
          <p className="text-[11px] text-slate-600">
            ゲストの呼び出しはリアルタイムで自動表示されます。手動更新はlocalStorageの再読み込みです。
          </p>

          {callHistory.length === 0 ? (
            <p className="text-xs text-slate-600 py-4 text-center">通話履歴はありません</p>
          ) : (
            <div className="space-y-3">
              {callHistory.map(record => (
                <div key={record.id} className="flex items-center justify-between gap-4 p-4 rounded-xl"
                  style={{ background: '#13141f', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <Building size={12} className="text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-300 truncate">{record.propertyName}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono truncate">{record.roomName}</p>
                    <p className="text-[10px] text-slate-600">{formatDate(record.createdAt)}</p>
                  </div>
                  <a href={record.roomUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 h-8 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <ExternalLink size={11} /> 参加
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
