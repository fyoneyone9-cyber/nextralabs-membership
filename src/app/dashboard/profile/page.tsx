'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User, Shield, Zap, Camera, Loader2, CheckCircle2,
  LogOut, Mail, Calendar, Clock, AlertCircle
} from 'lucide-react'

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:     { label: '無料プラン',         color: 'bg-slate-700 text-slate-300' },
  light:    { label: 'ライトプラン',       color: 'bg-emerald-500/20 text-blue-300 border border-emerald-500/30' },
  standard: { label: 'スタンダードプラン', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  premium:  { label: 'プレミアムプラン',   color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  admin:    { label: 'ADMIN',              color: 'bg-emerald-500 text-slate-950' },
}

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [savings, setSavings] = useState(0)
  const [usageCount, setUsageCount] = useState(0)
  const [joinedAt, setJoinedAt] = useState('')
  const [lastSignIn, setLastSignIn] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      setUserId(user.id)
      setUserEmail(user.email || '')
      setJoinedAt(user.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : '')
      setLastSignIn(user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('ja-JP') : '')

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (prof) {
        setProfile(prof)
        setDisplayName(prof.display_name || '')
      }

      const { count } = await supabase
        .from('api_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const c = count || 0
      setUsageCount(c)
      setSavings(c * 5)
      setLoading(false)
    }
    load()
  }, [])

  const handleUpdate = async () => {
    if (!userId) return
    setUpdating(true)
    try {
      const res = await fetch('/api/tools/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, display_name: displayName }),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    // バリデーション
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('5MB以下の画像を選択してください')
      return
    }
    if (!file.type.startsWith('image/')) {
      setAvatarError('画像ファイルを選択してください')
      return
    }

    setAvatarError('')
    setAvatarUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('user_id', userId)

      const res = await fetch('/api/tools/profile', { method: 'PUT', body: form })
      const data = await res.json()

      if (data.success && data.avatar_url) {
        setProfile((prev: any) => ({ ...prev, avatar_url: data.avatar_url }))
      } else {
        setAvatarError(data.error || 'アップロードに失敗しました')
      }
    } catch (err) {
      setAvatarError('通信エラーが発生しました')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const plan = profile?.role || 'free'
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.free

  if (loading) return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-semibold">読み込み中...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-5 md:p-10 text-left">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">プロフィール設定</h1>
            <p className="text-slate-500 text-sm">アカウント情報の確認・変更ができます</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-sm font-semibold transition-colors"
          >
            <LogOut size={15} /> ログアウト
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 左列：アバター + ステータス */}
          <div className="space-y-4">

            {/* アバターカード */}
            <div className="bg-[#0d0f1a] border-2 border-emerald-500/30 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
              <div className="relative">
                <div className="w-28 h-28 bg-white/5 rounded-full border-2 border-emerald-500/20 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="アバター" />
                  ) : (
                    <User size={40} className="text-slate-600" />
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-emerald-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-9 h-9 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all border-2 border-[#0d0f1a]">
                  <Camera size={15} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    disabled={avatarUploading}
                  />
                </label>
              </div>

              {avatarError && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 w-full">
                  <AlertCircle size={13} /> {avatarError}
                </div>
              )}

              <div className="text-center space-y-2">
                <p className="font-bold text-white text-base">{displayName || 'ユーザー'}</p>
                <Badge className={`${planInfo.color} font-semibold text-xs px-3 py-0.5 rounded-full`}>
                  {planInfo.label}
                </Badge>
                <p className="text-slate-600 text-[10px] font-mono">{userId.slice(0, 16)}...</p>
              </div>
            </div>

            {/* AI節約額 */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
                <Zap size={13} /> AI利用節約総額
              </div>
              <p className="text-3xl font-bold text-white">¥{savings.toLocaleString()}</p>
              <p className="text-slate-500 text-xs">{usageCount}回利用</p>
            </div>

            {/* アカウント情報 */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">アカウント情報</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs">
                  <Mail size={13} className="text-slate-500 shrink-0" />
                  <span className="text-slate-400 font-mono truncate">{userEmail}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Calendar size={13} className="text-slate-500 shrink-0" />
                  <span className="text-slate-400">加入日: {joinedAt}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Clock size={13} className="text-slate-500 shrink-0" />
                  <span className="text-slate-400">最終ログイン: {lastSignIn}</span>
                </div>
              </div>
            </div>

          </div>

          {/* 右列：編集フォーム */}
          <div className="md:col-span-2 space-y-4">

            {/* 表示名編集 */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-400" />
                <h2 className="font-bold text-white text-sm">アカウント・アイデンティティ</h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">表示名</label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white font-semibold text-sm outline-none focus:border-emerald-500 transition-all"
                  placeholder="名前を入力してください"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">メールアドレス</label>
                <div className="w-full h-12 bg-black/20 border border-white/5 rounded-xl px-4 flex items-center text-slate-500 text-sm font-mono select-all">
                  {userEmail}
                </div>
                <p className="text-[10px] text-slate-600 pl-1">メールアドレスの変更はサポートへお問い合わせください</p>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
              >
                {updating ? (
                  <><Loader2 size={15} className="animate-spin mr-2" /> 更新中...</>
                ) : saved ? (
                  <><CheckCircle2 size={15} className="mr-2" /> 更新しました</>
                ) : (
                  'プロフィールを更新する'
                )}
              </Button>
            </div>

            {/* プラン情報 */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-emerald-400" />
                <h2 className="font-bold text-white text-sm">現在のプラン</h2>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <Badge className={`${planInfo.color} font-semibold text-xs px-3 py-0.5 rounded-full`}>
                    {planInfo.label}
                  </Badge>
                  <p className="text-slate-500 text-xs mt-1.5">
                    {plan === 'free' ? '1日1回まで利用可能' :
                     plan === 'light' ? '1日1回まで利用可能' :
                     plan === 'standard' ? '1日2回まで利用可能' :
                     plan === 'premium' ? '1日3回まで利用可能' : '制限なし'}
                  </p>
                </div>
                {plan !== 'premium' && plan !== 'admin' && (
                  <a
                    href="/pricing"
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    アップグレード →
                  </a>
                )}
              </div>
            </div>

            {/* AIで深掘り */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-4">
              <p className="text-xs font-semibold text-slate-500">AIで深掘り相談</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'ChatGPT', url: 'https://chatgpt.com' },
                  { name: 'Gemini',  url: 'https://gemini.google.com' },
                  { name: 'Claude',  url: 'https://claude.ai' },
                ].map(ai => (
                  <button
                    key={ai.name}
                    onClick={() => window.open(ai.url, '_blank')}
                    className="h-11 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/5 rounded-xl text-sm font-semibold transition-all"
                  >
                    {ai.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* App Install */}
      <PWAInstallSection />

    </div>
  )
}
