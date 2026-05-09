'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', category: 'general', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('すべての必須項目を入力してください。')
      return
    }
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', category: 'general', message: '' })
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || '送信に失敗しました。しばらくしてから再度お試しください。')
        setStatus('error')
      }
    } catch {
      setErrorMsg('ネットワークエラーが発生しました。')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 px-4 py-10 md:py-16 font-sans">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-black mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          トップに戻る
        </Link>

        <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white mb-2">📩 お問い合わせ</h1>
        <p className="text-slate-400 text-sm font-bold mb-8">
          ご質問・ご要望・不具合報告など、お気軽にお問い合わせください。
          <br />
          通常1〜2営業日以内にご返信いたします。
        </p>

        {status === 'sent' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">送信完了！</h2>
            <p className="text-slate-400 text-sm mb-6">
              お問い合わせありがとうございます。<br />
              内容を確認し、1〜2営業日以内にご連絡いたします。
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20"
            >
              別の問い合わせをする
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">
                お名前 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="山田 太郎"
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">
                メールアドレス <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">
                お問い合わせ種別
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-bold"
              >
                <option value="general">一般的なお問い合わせ</option>
                <option value="tool">ツールについて</option>
                <option value="billing">お支払い・料金について</option>
                <option value="bug">不具合の報告</option>
                <option value="feature">機能のリクエスト</option>
                <option value="partnership">提携・コラボのご提案</option>
                <option value="other">その他</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">
                お問い合わせ内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="お問い合わせ内容をご記入ください..."
                rows={6}
                className="w-full bg-[#13141f] border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 outline-none transition-all text-sm font-bold resize-none"
                required
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full h-14 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  送信する
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center">
              ※ ご入力いただいた個人情報は、お問い合わせへの回答のみに使用いたします。
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
