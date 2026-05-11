'use client'
import React, { useState, useEffect } from 'react'
import { Video, ArrowLeft, ExternalLink, Plus, Clock, Building } from 'lucide-react'
import Link from 'next/link'

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

export default function CallsEngine() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [callHistory, setCallHistory] = useState<CallRecord[]>([])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

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
  }, [])

  const saveApiKey = () => {
    localStorage.setItem(STORAGE_KEY_API, apiKey.trim())
    setApiKeySaved(!!apiKey.trim())
    setError('')
  }

  const createRoom = async () => {
    setError('')
    setCreating(true)
    try {
      const res = await fetch('/api/dms/daily-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-daily-api-key': apiKey,
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
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans">
      {/* ヘッダー */}
      <header className="bg-[#0d0f1a] border-b border-white/5 sticky top-0 z-40">
        <div className="px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dms"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              <span className="font-semibold">DMS</span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-sm font-bold text-slate-200">通話管理</span>
          </div>
          <Video size={18} className="text-emerald-400" />
        </div>
      </header>

      {/* メインコンテンツ */}
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
                style={{
                  background: '#13141f',
                  border: '1px solid #334155',
                  color: '#10b981',
                }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(v => !v)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-sm"
              >
                {showApiKey ? '🙈' : '👁'}
              </button>
            </div>
            <button
              onClick={saveApiKey}
              className="h-10 px-5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#10b981', color: '#fff' }}
            >
              保存
            </button>
          </div>
        </div>

        {/* セットアップガイド（APIキー未設定時のみ） */}
        {!apiKeySaved && (
          <div className="bg-[#0d0f1a] border border-emerald-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400">Daily.co セットアップガイド</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  1
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <a
                    href="https://dashboard.daily.co/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    https://dashboard.daily.co/signup
                    <ExternalLink size={11} />
                  </a>
                  <span>でアカウント作成（無料）</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  2
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <a
                    href="https://dashboard.daily.co/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    https://dashboard.daily.co/developers
                    <ExternalLink size={11} />
                  </a>
                  <span>でAPIキーをコピー</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  3
                </span>
                <span className="text-xs text-slate-400">上のフォームに貼り付けて保存</span>
              </li>
            </ol>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* 新規通話作成ボタン（APIキー設定済み時のみ） */}
        {apiKeySaved && (
          <button
            onClick={createRoom}
            disabled={creating}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
          >
            {creating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            新しい通話ルームを作成
          </button>
        )}

        {/* 通話履歴カード（APIキー設定済み時） */}
        {apiKeySaved && (
          <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock size={15} className="text-emerald-400" />
              通話履歴
            </h3>

            {callHistory.length === 0 ? (
              <p className="text-xs text-slate-600 py-4 text-center">通話履歴はありません</p>
            ) : (
              <div className="space-y-3">
                {callHistory.map(record => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl"
                    style={{ background: '#13141f', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Building size={12} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-300 truncate">{record.propertyName}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-mono truncate">{record.roomName}</p>
                      <p className="text-[10px] text-slate-600">{formatDate(record.createdAt)}</p>
                    </div>
                    <a
                      href={record.roomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 h-8 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                      style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      <ExternalLink size={11} />
                      参加
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
