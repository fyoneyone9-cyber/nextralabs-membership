'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase automatically handles the token from the URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
  }, [supabase.auth])

  const handleUpdate = async (e: React.FormEvent) => {
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

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error('パスワード更新に失敗しました', { description: error.message })
      setLoading(false)
      return
    }

    toast.success('パスワードを更新しました')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-10 font-sans">
      <Card className="w-full max-w-md bg-[#13141f] border border-emerald-500/20 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white">新しいパスワードを設定</CardTitle>
          <CardDescription className="text-slate-400 text-sm">新しいパスワードを入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-400" />
              <p className="text-sm text-slate-400">認証を確認中...</p>
              <p className="text-xs text-slate-400">
                この画面が長く表示される場合は、メールのリンクが期限切れの可能性があります。
              </p>
              <Button className="w-full h-12 border-2 border-emerald-500/40 text-emerald-400 font-black rounded-2xl hover:border-emerald-400 bg-transparent transition-all mt-2" onClick={() => router.push('/forgot-password')}>
                リセットリンクを再送信
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-emerald-400">新しいパスワード</Label>
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
                  placeholder="もう一度入力"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 bg-[#13141f] border border-white/10 rounded-xl px-4 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-0 outline-none transition-all text-sm font-bold"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                パスワードを更新
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
