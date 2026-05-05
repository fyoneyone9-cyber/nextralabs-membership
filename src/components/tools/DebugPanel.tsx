'use client'

import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Sparkles, Lock, Unlock, Heart, Cat, ChevronUp, ChevronDown, Activity, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@supabase/supabase-js'

export function DebugPanel({ data, toolId }: { data: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [consoleErrors, setConsoleErrors] = useState<string[]>([])
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email === 'f.yoneyone9@gmail.com') setIsAuth(true)
      } catch (e) { console.warn(e) }
    }
    checkUser()

    const originalError = console.error;
    console.error = (...args: any[]) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      setConsoleErrors(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
      originalError.apply(console, args);
    };
    return () => { console.error = originalError; };
  }, [supabase.auth]);

  const handleAuth = () => {
    if (password === 'nextralabs2026') setIsAuth(true)
    else alert('パスワードが違います 🐾')
  }

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-3">
      
      {/* 🚀 目立つ覚醒ボタン: ネオンエメラルドに輝く */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] border-2 ${
          isOpen ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105' : 'bg-slate-900/80 border-emerald-500/50 text-emerald-400 hover:bg-slate-800 animate-pulse'
        }`}
      >
        <Activity className={`h-5 w-5 ${isOpen ? 'animate-spin' : ''}`} />
        <span className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
          System Debug <Sparkles className="h-3 w-3 fill-current" />
        </span>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-[95vw] max-w-2xl bg-[#0a0a0f]/98 backdrop-blur-2xl border-2 border-emerald-500/20 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] space-y-8 animate-in zoom-in-95 fade-in duration-300">
          
          {!isAuth ? (
            <div className="flex flex-col items-center py-10 space-y-6 text-center">
              <div className="p-6 bg-emerald-500/10 rounded-full border-2 border-emerald-500/20"><Lock className="h-12 w-12 text-emerald-500" /></div>
              <div className="space-y-2">
                <p className="text-white font-black text-2xl tracking-tighter">Enter Developer Key</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">NextraLabs Core Security</p>
              </div>
              <div className="flex gap-3 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="bg-slate-900 border-slate-700 h-16 rounded-2xl text-white text-center text-3xl font-black" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl px-8 h-16 text-lg">UNLOCK</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20"><Unlock className="h-6 w-6 text-slate-950" /></div>
                  <h4 className="text-white font-black text-xl uppercase tracking-tighter italic">Surgical Diagnostic Live</h4>
                </div>
                <Button size="sm" className="h-12 bg-slate-800 text-white border border-white/10 rounded-xl font-bold px-6">REPORT TO AI</Button>
              </div>
              <div className="bg-slate-950 p-8 rounded-[2rem] border border-emerald-500/10 shadow-inner">
                <pre className="text-emerald-400 font-mono text-xs leading-relaxed max-h-[400px] overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
              {consoleErrors.length > 0 && (
                <div className="space-y-3">
                   <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Terminal className="h-3 w-3" /> Runtime Exceptions</p>
                   <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10 text-rose-300/80 font-mono text-[10px] max-h-[150px] overflow-auto">
                      {consoleErrors.map((err, i) => <p key={i} className="mb-1">➔ {err}</p>)}
                   </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">Protocol v4.5 Master Access</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-xs font-black uppercase underline decoration-2 decoration-emerald-500/30 underline-offset-8">Close Interface</button>
          </div>
        </div>
      )}
    </div>
  )
}
