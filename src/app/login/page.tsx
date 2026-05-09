'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('ログインに失敗しました', { description: error.message })
      setLoading(false)
      return
    }

    toast.success('ログインしました')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-10 font-sans">
      <Card className="w-full max-w-md bg-[#13141f] border border-emerald-500/20 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white">ログイン</CardTitle>
          <CardDescription className="text-slate-400 text-sm">アカウントにログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-emerald-400">パスワード</Label>
                <Link href="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300">
                  パスワードを忘れた方
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ログイン
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-400">
            アカウントをお持ちでない方は{' '}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
              新規登録
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
