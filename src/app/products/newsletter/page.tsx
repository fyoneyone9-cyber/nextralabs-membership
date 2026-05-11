'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, CheckCircle2, ArrowRight, Zap, Bell, Star, Shield } from 'lucide-react'

const BENEFITS = [
  { icon: Zap,       text: '新ツール・機能のいち早いお知らせ' },
  { icon: Star,      text: 'メンバー限定のAI活用ノウハウ' },
  { icon: Bell,      text: 'アップデート・重要なお知らせ' },
  { icon: Shield,    text: 'スパムなし。いつでも配信停止OK' },
]

export default function NewsletterPage() {
  const [email, setEmail]   = useState('')
  const [name, setName]     = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res  = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch {
      setStatus('error')
      setMessage('通信エラーが発生しました。もう一度お試しください。')
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">

        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-tight uppercase">NextraLabs Newsletter</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight">
            AIツールの最新情報を<br />
            <span className="text-emerald-400">いち早くお届けします</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            NextraLabsの新ツール・使い方・AIノウハウを<br />
            メールでお知らせします。登録は無料です。
          </p>
        </div>

        {/* メリット */}
        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-[#0d1117] border border-white/5 rounded-xl p-3">
              <b.icon size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[11px] text-slate-400 leading-snug">{b.text}</span>
            </div>
          ))}
        </div>

        {/* フォーム or 完了 */}
        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3">
            <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
            <p className="text-white font-semibold">{message}</p>
            <p className="text-slate-500 text-xs">まずはNextraLabsのツールを使ってみよう！</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-2 h-10 px-6 rounded-lg text-xs font-semibold transition-all"
              style={{ background: '#10b981', color: '#fff' }}
            >
              ツール一覧へ <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0d1117] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">お名前（任意）</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例：田中 太郎"
                className="w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
                style={{ background: '#13141f', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                メールアドレス <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
                style={{ background: '#13141f', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </div>

            {status === 'error' && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: '#10b981', color: '#fff' }}
            >
              {status === 'loading' ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />登録中...</>
              ) : (
                <><Mail size={15} />メルマガに登録する</>
              )}
            </button>

            <p className="text-center text-[10px] text-slate-600">
              登録することで<Link href="/privacy" className="text-slate-500 underline">プライバシーポリシー</Link>に同意したものとみなします。<br />
              いつでも配信停止できます。
            </p>
          </form>
        )}

        {/* 戻るリンク */}
        <div className="text-center">
          <Link href="/products" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            ← ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
