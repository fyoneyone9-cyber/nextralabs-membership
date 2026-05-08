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

  if (loading) return <div className="p-20 text-emerald-500 font-black animate-pulse uppercase italic">Loading Intelligence...</div>

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-emerald-500/20 pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <User className="h-8 w-8 text-slate-950" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Profile Settings</h1>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Master Identity Control</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <Card className="md:col-span-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-white/5 rounded-full border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-2xl">
                <User className="h-16 w-16 text-slate-600" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full text-slate-950 shadow-lg hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 font-black italic uppercase text-[10px]">
                {profile?.role === 'admin' ? 'Administrator' : 'Verified Member'}
              </Badge>
              <p className="text-xs text-slate-500 font-bold uppercase mt-4 tracking-widest">User ID</p>
              <p className="text-[10px] text-slate-600 font-mono mt-1">{profile?.user_id?.slice(0, 16)}...</p>
            </div>
          </Card>

          {/* Edit Section */}
          <Card className="md:col-span-2 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-8 border-b border-white/5">
              <CardTitle className="text-lg font-black italic uppercase tracking-widest text-white flex items-center gap-3">
                <Zap className="h-5 w-5 text-emerald-500" /> Identity Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Display Name</label>
                <input 
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-xl font-black text-white focus:border-emerald-500 outline-none transition-all shadow-inner"
                  placeholder="Your Identity Name"
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all uppercase italic"
                >
                  {updating ? <Loader2 className="animate-spin mr-2" /> : saved ? <CheckCircle2 className="mr-2" /> : null}
                  {saved ? 'ID UPDATED' : 'Update Identity'}
                </Button>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                  <Shield size={16} />
                  <p className="text-xs font-black uppercase italic tracking-widest">Nextra Intelligence Note</p>
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                  プロフィール情報はNextra Labs内での表示にのみ使用されます。情報は常に暗号化され、利用規約に基づき安全に管理されています。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
