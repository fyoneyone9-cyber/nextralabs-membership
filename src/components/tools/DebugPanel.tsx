'use client'

import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Sparkles, Lock, Unlock, Heart, Cat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@supabase/supabase-js'

interface DebugPanelProps {
  data: any
  toolId?: string
}

export function DebugPanel({ data, toolId }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email === 'f.yoneyone9@gmail.com') setIsAuth(true)
    }
    checkUser()
  }, [supabase.auth]);

  const handleAuth = () => {
    if (password === 'nextralabs2026') setIsAuth(true)
    else alert('ごめんなさい、パスワードが違います 🐾')
  }

  const copyForAI = () => {
    const report = {
      header: "=== NEXTRALABS SURGICAL CALTE v4.4 (Kawaii Edition) ===",
      tool: toolId,
      time: new Date().toISOString(),
      server_trace: data
    }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      
      {/* 🐾 かわいく進化した起動ボタン: ぷるぷる動く猫の足跡 */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center justify-center p-2 rounded-full transition-all duration-500 group ${
          isOpen ? 'bg-emerald-500 scale-110 shadow-lg rotate-12' : 'opacity-10 hover:opacity-100 hover:bg-white/5 scale-90 hover:scale-110'
        }`}
        title="NextraLabs Helper"
      >
        <Sparkles className={`h-4 w-4 transition-all ${
          isOpen ? 'text-white' : 'text-emerald-400 group-hover:animate-spin'
        }`} />
        
        {/* マウスを乗せた時だけ「にゃー」と出る遊び心 */}
        <span className="absolute left-10 scale-0 group-hover:scale-100 transition-all origin-left bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap shadow-xl">
           Nextra Helper 🐾
        </span>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-16 left-4 w-[90vw] max-w-lg bg-[#0a0a0f]/95 backdrop-blur-2xl border-2 border-emerald-500/20 p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(16,185,129,0.15)] space-y-6 animate-in zoom-in-95 fade-in duration-300">
          
          {!isAuth ? (
            <div className="flex flex-col items-center py-10 space-y-6 text-center">
              <div className="relative">
                <Cat className="h-16 w-16 text-slate-800" />
                <Lock className="h-6 w-6 text-emerald-500 absolute -bottom-1 -right-1" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black text-lg">合言葉を教えてね 🔑</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Authorized Access Only</p>
              </div>
              <div className="flex gap-2 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="bg-slate-900 border-slate-800 text-white text-center rounded-2xl h-12 text-xl font-black" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl px-6 h-12">OPEN</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20"><Unlock className="h-4 w-4 text-slate-950" /></div>
                  <span className="text-white font-black text-xs uppercase tracking-widest">Diagnostic Live 🐾</span>
                </div>
                <Button onClick={copyForAI} className={`h-10 px-4 rounded-xl text-[10px] font-black gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                  {copied ? <CheckCircle2 className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
                  {copied ? "COPIED!" : "CALTE FOR AI"}
                </Button>
              </div>
              <div className="bg-slate-950 p-6 rounded-[2rem] border border-emerald-500/10 shadow-inner">
                <pre className="text-emerald-400/90 font-mono text-[9px] leading-relaxed max-h-[300px] overflow-y-auto scrollbar-hide">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-2">
            <span className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em]">NextraLabs surgical v4.4 - Sweet & Stealth</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-[10px] font-black uppercase underline decoration-emerald-500/30 underline-offset-4">さよなら</button>
          </div>
        </div>
      )}
    </div>
  )
}
