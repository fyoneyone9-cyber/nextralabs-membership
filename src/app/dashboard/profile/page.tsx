'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Zap, Camera, Loader2, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react'

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
        // 1. プロフィールデータの取得
        const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
        if (data) {
          setProfile(data)
          setDisplayName(data.display_name || '')
        }
        // 2. 憲法遵守：実際の利用ログ(api_usage)から節約額を算出（1回5円換算）
        const { count } = await supabase.from('api_usage').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        setSavings((count || 0) * 5)
      }
      setLoading(false)
    }
    loadProfile()
  }, [supabase])

  const handleUpdate = async () => {
    setUpdating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('profiles').update({ display_name: displayName }).eq('user_id', user.id)
      if (!error) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
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
      
      // 3. 憲法遵守：Supabase Storageへの実アップロード（ハリボテ禁止）
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id)
        setProfile({ ...profile, avatar_url: publicUrl })
      } else {
        alert('画像のアップロードに失敗しました')
      }
    }
    setUpdating(false)
  }

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="text-emerald-500 font-black animate-pulse uppercase italic tracking-widest text-2xl">
        AI IDENTITY CHECKING...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* タイトルセクション */}
        <div className="flex items-center gap-6 border-b border-emerald-500/20 pb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <User className="h-10 w-10 text-slate-950" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">プロフィール設定</h1>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px] italic mt-2">Master Identity Console</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左：アバター・節約額（MASTERMODEL外枠） */}
          <div className="space-y-6">
            <Card className="bg-[#13141f] border-4 border-emerald-500 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
              <div className="relative group">
                <div className="w-32 h-32 bg-white/5 rounded-full border-4 border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-2xl relative">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      className="w-full h-full object-cover" 
                      alt="Avatar" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        setProfile({ ...profile, avatar_url: null });
                      }}
                    />
                  ) : (
                    <User className="h-16 w-16 text-slate-600" />
                  )}
                  {updating && <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>}
                </div>
                <label className="absolute bottom-0 right-0 p-3 bg-emerald-500 rounded-full text-slate-950 shadow-xl hover:scale-110 transition-transform cursor-pointer border-2 border-[#13141f]">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={updating} />
                </label>
              </div>
              <div className="space-y-2">
                <Badge className="bg-emerald-500 text-slate-950 font-black italic uppercase text-[10px] px-4 py-1">
                  {profile?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                </Badge>
                <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{profile?.user_id}</p>
              </div>
            </Card>

            {/* 個人別節約額 */}
            <Card className="bg-emerald-500/10 border-2 border-emerald-500 rounded-[2rem] p-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10"><Zap size={80} className="text-emerald-500" /></div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-2 relative z-10">AI 活用節約総額</p>
              <div className="text-4xl font-black text-white italic tracking-tighter relative z-10">¥{savings.toLocaleString()}</div>
              <p className="text-[8px] text-emerald-500/40 font-bold uppercase mt-2 relative z-10 tracking-[0.2em]">Efficiency Value</p>
            </Card>
          </div>

          {/* 右：基本情報・ステータス・3大AIリンク */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="bg-white/5 p-8 border-b border-white/5">
                <CardTitle className="text-xl font-black italic uppercase tracking-widest text-white flex items-center gap-3">
                  <Shield className="h-6 w-6 text-emerald-400" /> アカウント・アイデンティティ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">表示名 (Identity Name)</label>
                  <input 
                    value={displayName} 
                    onChange={e => setDisplayName(e.target.value)} 
                    className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-xl font-black text-white focus:border-emerald-500 outline-none transition-all shadow-inner" 
                    placeholder="名前を入力してください"
                  />
                </div>
                <Button 
                  onClick={handleUpdate} 
                  disabled={updating} 
                  className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-2xl shadow-xl transition-all uppercase italic active:scale-95"
                >
                  {updating ? <Loader2 className="animate-spin mr-2" /> : saved ? <CheckCircle2 className="mr-2" /> : null}
                  {saved ? '更新完了' : 'プロフィールを更新する'}
                </Button>
              </CardContent>
            </Card>

            {/* 3大AI外部リンク (復旧) */}
            <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">AI 外部脳リンク (Strategic Consultation)</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                  <Button 
                    key={ai} 
                    onClick={() => openAI(ai)} 
                    className="h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:text-white hover:border-emerald-500 transition-all uppercase text-xs"
                  >
                    {ai} で深掘り
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
