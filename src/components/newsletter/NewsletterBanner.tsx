'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

interface Props {
  variant?: 'full' | 'compact'  // full=ツールページフッター compact=ツール一覧内
}

export default function NewsletterBanner({ variant = 'full' }: Props) {
  const [email, setEmail]   = useState('')
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
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setStatus(data.ok ? 'success' : 'error')
      setMessage(data.message)
    } catch {
      setStatus('error')
      setMessage('通信エラーが発生しました')
    }
  }

  // ── compact版（ツール一覧ページ内セクション） ──
  if (variant === 'compact') {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20"
        style={{ background: 'linear-gradient(135deg, #0a1a12 0%, #0d1117 60%, #0a1218 100%)' }}>
        {/* グロウ背景 */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />

        <div className="relative px-6 py-8 md:px-10 flex flex-col md:flex-row items-center gap-6">
          {/* 左：テキスト */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Newsletter</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white leading-tight">
              新ツール・AIノウハウを<span className="text-emerald-400">いち早くゲット</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              NextraLabsの最新情報をメールでお届け。無料・いつでも配信停止OK。
            </p>
          </div>

          {/* 右：フォーム */}
          <div className="w-full md:w-auto md:min-w-[320px]">
            {status === 'success' ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400 font-medium">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                  required
                  className="flex-1 h-11 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors min-w-0"
                  style={{ background: '#13141f', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#10b981')}
                  onBlur={e => (e.target.style.borderColor = '#334155')}
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="shrink-0 h-11 px-5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  {status === 'loading'
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Mail size={14} />登録</>}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-[10px] text-red-400 mt-1.5 pl-1">{message}</p>
            )}
            <p className="text-[10px] text-slate-700 mt-2 text-center md:text-left">
              または <Link href="/products/newsletter" className="text-slate-500 hover:text-emerald-400 underline transition-colors">登録ページを開く →</Link>
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ── full版（各ツールページのフッターバナー） ──
  return (
    <div className="mt-12 mx-auto max-w-2xl px-4">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 p-6 md:p-8 space-y-5"
        style={{ background: 'linear-gradient(135deg, #0a1a12 0%, #0d1117 60%, #0a1218 100%)' }}>
        {/* グロウ */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />

        <div className="relative space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">NextraLabs Newsletter</span>
          </div>
          <h3 className="text-lg font-semibold text-white leading-tight">
            📬 新ツール・最新情報をいち早くお届け
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            NextraLabsの新ツール・AIノウハウ・アップデート情報をメールでお知らせします。<br />
            登録無料・スパムなし・いつでも配信停止できます。
          </p>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-400 font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 h-12 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
              style={{ background: '#13141f', border: '1px solid #334155' }}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = '#334155')}
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="shrink-0 h-12 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: '#10b981', color: '#fff' }}
            >
              {status === 'loading'
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />登録中...</>
                : <><Mail size={15} />メルマガに登録する</>}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-400">{message}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-[10px] text-slate-700">登録することでプライバシーポリシーに同意したものとみなします</p>
          <Link href="/products/newsletter"
            className="text-[10px] text-slate-600 hover:text-emerald-400 transition-colors flex items-center gap-1">
            登録ページを開く <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </div>
  )
}
