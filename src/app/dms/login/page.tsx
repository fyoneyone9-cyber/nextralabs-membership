'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Building2, ShieldCheck, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function DmsLoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 諞ｲ豕包ｼ壹♀螳｢讒倥＃縺ｨ縺ｮID/PW邂｡逅・ｼ医ョ繝｢逕ｨ邁｡譏薙Ο繧ｸ繝・け・・    if ((id === 'admin' && password === '2026') || (id === 'f.yoneyone9@gmail.com' && password === '10Birano6587') || (id === 'demo' && password === 'nextra')) {
      localStorage.setItem('dms_session', JSON.stringify({ id, storeName: id === 'admin' ? 'NextraLabs Hotel' : 'Demo Guesthouse' }))
      if (id === 'f.yoneyone9@gmail.com') { router.push('/dms/admin') } else { router.push('/dms') }
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b98110,transparent_70%)]" />
      
      <Card className="w-full max-w-md bg-[#13141f] border-4 border-emerald-500/50 p-8 md:p-12 rounded-[3rem] shadow-[0_0_80px_rgba(16,185,129,0.2)] relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
        
        <div className="space-y-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20 shadow-inner">
              <Building2 className="text-emerald-500" size={40} />
            </div>
            <div className="space-y-2">
              <Badge className="bg-emerald-600 text-white font-black italic px-4 py-1 rounded-full uppercase text-[10px] tracking-widest shadow-lg">DMS Portal</Badge>
              <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Nextra <span className="text-emerald-500">DMS</span></h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4 text-left">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic">Operator ID</label>
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="ID繧貞・蜉・
                  className="bg-black border-2 border-white/10 h-14 rounded-2xl px-6 text-white font-bold focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic">Access Key</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password繧貞・蜉・
                  className="bg-black border-2 border-white/10 h-14 rounded-2xl px-6 text-white font-bold focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-black uppercase italic animate-pulse">
                <AlertCircle size={14} /> ID縺ｾ縺溘・繝代せ繝ｯ繝ｼ繝峨′豁｣縺励￥縺ゅｊ縺ｾ縺帙ｓ
              </div>
            )}

            <Button 
              type="submit"
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xl shadow-xl transition-all active:scale-95 uppercase italic gap-3"
            >
              <ShieldCheck size={24} /> 蜿ｸ莉､蝪斐∈蜈･螳､ 筐・            </Button>
          </form>

          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] italic leading-relaxed">
            Authorized Operators Only<br/>
            Nextra AI Autonomous OS 窶｢ 2026
          </p>
        </div>
      </Card>
    </div>
  )
}
