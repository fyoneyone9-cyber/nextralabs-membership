'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Building2, ShieldCheck, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export default function DmsLoginPage() {
  const [loginId, setLoginId]   = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginId.trim() || !password.trim()) {
      setError('IDとパスワードを入力してください')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/dms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId.trim(), password }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        setError(data.error || 'IDまたはパスワードが正しくありません')
        setLoading(false)
        return
      }

      // セッション保存
      localStorage.setItem('dms_session', JSON.stringify(data.session))

      // ロール別リダイレクト
      if (data.session.role === 'super_admin') {
        router.push('/dms/admin')
      } else {
        router.push('/dms')
      }
    } catch {
      setError('通信エラーが発生しました。しばらく経ってから再試行してください。')
      setLoading(false)
    }
  }

  const inputBase = 'w-full h-14 rounded-2xl px-5 text-white font-semibold text-sm outline-none transition-all'
  const inputStyle = { background: '#0a0b0f', border: '2px solid rgba(255,255,255,0.08)' }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#050507' }}>

      {/* 背景グロウ */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(16,185,129,0.08) 0%, transparent 65%)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* ロゴ */}
        <div className="text-center mb-8 space-y-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Building2 size={28} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Nextra <span style={{ color: '#10b981' }}>DMS</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">ホテルDMSポータル</p>
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 px-1">
              Operator ID
            </label>
            <input
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              placeholder="ログインIDを入力"
              autoComplete="username"
              className={inputBase}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 px-1">
              Access Key
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                autoComplete="current-password"
                className={inputBase + ' pr-12'}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 px-1 py-2">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all mt-2"
            style={{
              background: loading ? 'rgba(16,185,129,0.5)' : '#10b981',
              boxShadow: loading ? 'none' : '0 0 20px rgba(16,185,129,0.3)',
            }}
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> ログイン中...</>
              : <><ShieldCheck size={16} /> ログイン</>}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-700 mt-8">
          Authorized Operators Only · Nextra AI © 2026
        </p>
      </div>
    </div>
  )
}
