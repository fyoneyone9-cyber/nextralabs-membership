'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error('送信に失敗しました', { description: error.message })
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-10 font-sans">
      <Card className="w-full max-w-md bg-[#13141f] border border-emerald-500/20 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold uppercase tracking-tight text-white">パスワードリセット</CardTitle>
          <CardDescription className="text-slate-400 text-sm">登録済みのメールアドレスを入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="text-sm text-slate-400">
                <strong className="text-slate-100">{email}</strong> にパスワードリセット用のリンクを送信しました。
              </p>
              <p className="text-xs text-slate-400">
                メールが届かない場合は迷惑メールフォルダをご確認ください。
              </p>
              <Link href="/login">
                <Button className="w-full h-12 border-2 border-emerald-500/40 text-emerald-400 font-bold rounded-2xl hover:border-emerald-400 bg-transparent transition-all mt-4">ログインに戻る</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-tight text-emerald-400">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-2xl uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                リセットリンクを送信
              </Button>
              <div className="text-center text-sm text-slate-400">
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300">ログインに戻る</Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
