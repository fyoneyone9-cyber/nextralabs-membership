'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react'

export default function PortAuthPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    // 2026のPW
    if (password === '2026') {
      localStorage.setItem('port_auth', 'true')
      router.push('/port')
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b98110,transparent_70%)]" />
      
      <Card className="w-full max-w-md bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        
        <div className="space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border-2 border-white/5">
              <Lock className="text-emerald-500" size={32} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Identity Gate</h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-tight">Master Identity Sync Required</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-black border-2 h-14 rounded-2xl text-center text-xl font-bold tracking-[0.5em] transition-all ${
                  error ? 'border-red-500 animate-shake' : 'border-white/5 focus:border-emerald-500'
                }`}
                autoFocus
              />
              {error && (
                <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-1 text-red-500 text-[10px] font-bold uppercase ">
                  <AlertCircle size={10} /> Access Denied
                </div>
              )}
            </div>

            <Button 
              type="submit"
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-lg shadow-xl transition-all active:scale-95 uppercase gap-2"
            >
              <ShieldCheck size={20} /> Verify Access ➔
            </Button>
          </form>

          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] ">
            Authorized Personnel Only • NextraLabs 2026
          </p>
        </div>
      </Card>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  )
}
