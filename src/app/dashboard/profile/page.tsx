'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Zap, Camera, Loader2, CheckCircle2 } from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [savings, setSavings] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
        if (data) {
          setProfile(data)
          setDisplayName(data.display_name || '')
        }
        const { count } = await supabase.from('api_usage').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        setSavings((count || 0) * 5)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleUpdate = async () => {
    setUpdating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ display_name: displayName }).eq('user_id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setUpdating(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUpdating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id)
        setProfile({ ...profile, avatar_url: publicUrl })
      }
    }
    setUpdating(false)
  }

  if (loading) return <div className="p-20 text-emerald-500 font-black animate-pulse uppercase italic">システムを読み込み中...</div>

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-emerald-500/20 pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <User className="h-8 w-8 text-slate-950" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">プロフィール設定</h1>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Master Identity Console</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center space-y-6 shadow-xl">
              <div className="relative group">
                <div className="w-32 h-32 bg-white/5 rounded-full border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-slate-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full text-slate-950 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={updating} />
                </label>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 font-black italic uppercase text-[10px]">
                {profile?.role === 'admin' ? '管理者アカウント' : '認証済みメンバー'}
              </Badge>
            </Card>

            <Card className="bg-emerald-500/10 border-2 border-emerald-500 rounded-[2rem] p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Zap className="h-6 w-6 text-emerald-500 mx-auto mb-2 animate-pulse" />
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">AI 活用節約総額</p>
              <div className="text-3xl font-black text-white italic tracking-tighter">¥{savings.toLocaleString()}</div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="bg-white/5 p-8 border-b border-white/5">
                <CardTitle className="text-lg font-black italic uppercase tracking-widest text-white flex items-center gap-3">
                  <Zap className="h-5 w-5 text-emerald-400" /> 基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">表示名</label>
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-lg font-black text-white focus:border-emerald-500 outline-none transition-all shadow-inner" />
                </div>
                <Button onClick={handleUpdate} disabled={updating} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-lg rounded-xl shadow-xl transition-all uppercase italic">
                  {updating ? <Loader2 className="animate-spin mr-2" /> : saved ? <CheckCircle2 className="mr-2" /> : null}
                  {saved ? '更新完了' : '情報を更新する'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="bg-white/5 p-8 border-b border-white/5">
                <CardTitle className="text-lg font-black italic uppercase tracking-widest text-white flex items-center gap-3">
                  <Shield className="h-5 w-5 text-emerald-400" /> 会員ステータス
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase">現在のプラン</span>
                  <Badge className="bg-emerald-500 text-slate-950 font-black italic">PREMIUM</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
