'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      toast.error('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) {
      toast.error('登録に失敗しました', { description: error.message })
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-10 font-sans">
        <Card className="w-full max-w-md bg-[#13141f] border border-emerald-500/20 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.08)]">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">登録ありがとうございます！</h2>
            <p className="text-slate-400 text-sm mb-6">
              確認メールを送信しました。メール内のリンクをクリックして、アカウントを有効化してください。
            </p>
            <Link href="/login">
              <Button className="w-full h-12 border-2 border-emerald-500/40 text-emerald-400 font-black rounded-2xl hover:border-emerald-400 bg-transparent transition-all">ログインページへ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-10 font-sans">
      <Card className="w-full max-w-md bg-[#13141f] border border-emerald-500/20 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white">新規登録</CardTitle>
          <CardDescription className="text-slate-400 text-sm">無料アカウントを作成しましょう</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-emerald-400">表示名</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="あなたの名前"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-emerald-400">メールアドレス</Label>
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-emerald-400">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="6文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-emerald-400">パスワード確認</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="パスワードを再入力"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              アカウント作成
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-400">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              ログイン
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
