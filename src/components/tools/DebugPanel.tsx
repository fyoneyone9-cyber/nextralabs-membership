'use client'

import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Bug, Lock, Unlock, ChevronUp, ChevronDown, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  const [consoleErrors, setConsoleErrors] = useState<string[]>([])
  
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
    else alert('ACCESS DENIED')
  }

  const copyForAI = () => {
    const report = {
      header: "=== NEXTRALABS SURGICAL CALTE v4.3 ===",
      tool: toolId,
      time: new Date().toISOString(),
      server_trace: data?._trace || "INCOMPLETE",
      raw_error: data,
      client_logs: consoleErrors
    }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      
      {/* 🛠️ 改良：少しだけ存在感を出し、マウスを乗せるとクッキリするボタン */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-slate-900/40 backdrop-blur-md transition-all duration-300 shadow-2xl group ${
          isOpen ? 'ring-2 ring-emerald-500/50 opacity-100' : 'opacity-20 hover:opacity-100 hover:bg-slate-800'
        }`}
      >
        <Terminal className={`h-4 w-4 ${data?.error ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
          Debug Hub
        </span>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-20 left-6 w-[95vw] max-w-2xl bg-[#020204]/98 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,1)] space-y-8 animate-in slide-in-from-bottom-4 duration-300">
          
          {!isAuth ? (
            <div className="flex flex-col items-center py-16 space-y-6">
              <Lock className="h-12 w-12 text-slate-800" />
              <p className="text-slate-500 font-black text-xs tracking-widest uppercase italic">Secure Layer Access Required</p>
              <div className="flex gap-3 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-slate-900 border-slate-700 h-14 text-white text-center rounded-2xl text-2xl font-black" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-white text-black font-black rounded-2xl px-8 h-14 hover:bg-slate-200">UNLOCK</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-3 rounded-2xl"><Unlock className="h-6 w-6 text-slate-950" /></div>
                  <div>
                    <h4 className="text-white font-black text-lg uppercase tracking-tight">Diagnostic Active</h4>
                    <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest">Admin Privileges Granted</p>
                  </div>
                </div>
                <Button onClick={copyForAI} className={`h-12 px-6 rounded-2xl text-xs font-black gap-2 transition-all shadow-xl ${copied ? 'bg-green-600' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                  {copied ? "COPIED" : "COPY FOR AI"}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="bg-black/50 p-8 rounded-[2rem] border border-white/5 font-mono text-[11px] leading-relaxed shadow-inner">
                  <p className="text-white/20 mb-4 uppercase font-black tracking-widest border-b border-white/5 pb-2">Full Trace Data</p>
                  <pre className="text-emerald-400/90 whitespace-pre-wrap">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">v4.3 Optimized Stealth System</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-xs font-black uppercase underline decoration-2 underline-offset-4">Close Hub</button>
          </div>
        </div>
      )}
    </div>
  )
}
