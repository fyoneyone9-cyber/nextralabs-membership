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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error('Googleログインに失敗しました', { description: error.message })
      setGoogleLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) { toast.error('パスワードが一致しません'); return }
    if (password.length < 6) { toast.error('パスワードは6文字以上で入力してください'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: displayName } },
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
            <CheckCircle className="h-12 w-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-3">登録ありがとうございます！</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              確認メールを送信しました。メール内のリンクをクリックして、アカウントを有効化してください。
            </p>
            <Link href="/login">
              <Button className="w-full h-12 border border-emerald-500/40 text-emerald-400 font-semibold rounded-lg hover:border-emerald-400 bg-transparent transition-all">ログインページへ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-10 font-sans">
      <Card className="w-full max-w-md bg-[#13141f] border border-emerald-500/20 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <CardHeader className="text-center pb-2">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-4 mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-tight uppercase">Nextra Labs</span>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">新規登録</CardTitle>
          <CardDescription className="text-slate-400 text-sm leading-relaxed">無料アカウントを作成しましょう</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Googleで登録ボタン */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow hover:scale-[1.02]"
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Googleで登録（1クリック）
          </Button>

          {/* 区切り */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-600 font-medium">またはメールで登録</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* メール登録フォーム */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-xs font-medium text-slate-400">表示名</Label>
              <Input id="displayName" type="text" placeholder="あなたの名前"
                value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-slate-400">メールアドレス</Label>
              <Input id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-slate-400">パスワード</Label>
              <Input id="password" type="password" placeholder="6文字以上"
                value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-400">パスワード確認</Label>
              <Input id="confirmPassword" type="password" placeholder="パスワードを再入力"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm"
              />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition-all shadow-[0_0_24px_rgba(16,185,129,0.2)] hover:scale-[1.02]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              アカウント作成
            </Button>
          </form>

          <div className="text-center text-sm text-slate-400">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">ログイン</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
