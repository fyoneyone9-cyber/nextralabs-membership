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
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        トップに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-2">📩 お問い合わせ</h1>
      <p className="text-muted-foreground mb-8">
        ご質問・ご要望・不具合報告など、お気軽にお問い合わせください。
        <br />
        通常1〜2営業日以内にご返信いたします。
      </p>

      {status === 'sent' ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">送信完了！</h2>
          <p className="text-muted-foreground mb-6">
            お問い合わせありがとうございます。<br />
            内容を確認し、1〜2営業日以内にご連絡いたします。
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            別の問い合わせをする
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="山田 太郎"
              className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              お問い合わせ種別
            </label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
            <label className="block text-sm font-medium mb-1.5">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="お問い合わせ内容をご記入ください..."
              rows={6}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-500">
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3.5 font-medium hover:opacity-90 disabled:opacity-50 transition-all"
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

          <p className="text-xs text-muted-foreground text-center">
            ※ ご入力いただいた個人情報は、お問い合わせへの回答のみに使用いたします。
          </p>
        </form>
      )}
    </div>
  )
}
