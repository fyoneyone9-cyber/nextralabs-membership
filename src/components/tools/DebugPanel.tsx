'use client'

import React, { useState, useEffect } from 'react'
import { Terminal, Copy, CheckCircle2, Database, Bug, Activity, ShieldQuestion, History, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'

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
  
  const supabase = createClient()

  // 🛠️ 権限チェック (f.yoneyone9@gmail.com の場合は自動認証)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email === 'f.yoneyone9@gmail.com') {
        setIsAuth(true)
      }
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
      header: "=== NEXTRALABS SURGICAL CALTE v4.1 ===",
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

  // 🔴 開発者以外には見えない、または極めて目立たないUI
  return (
    <div className="fixed bottom-4 left-4 z-[9999] opacity-20 hover:opacity-100 transition-opacity">
      {/* 🛠️ ステルス起動ボタン: 小さなバグアイコンのみ */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-8 h-8 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center hover:bg-slate-800 transition-all shadow-2xl"
        title="Diagnostic Hub"
      >
        <Bug className={`h-4 w-4 ${data?.error ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`} />
      </button>
      
      {isOpen && (
        <div className="fixed bottom-16 left-4 w-[90vw] max-w-2xl bg-[#020204] border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          
          {!isAuth ? (
            <div className="flex flex-col items-center py-10 space-y-4">
              <Lock className="h-10 w-10 text-slate-700" />
              <div className="flex gap-2 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Developer Key" className="bg-slate-900 border-slate-700 text-white text-center rounded-xl" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-emerald-600 text-white rounded-xl">OPEN</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Unlock className="h-5 w-5 text-emerald-500" />
                  <span className="text-white font-black text-sm uppercase tracking-widest">Diagnostic Live</span>
                </div>
                <Button onClick={copyForAI} className={`h-10 px-4 rounded-xl text-xs font-black gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-white text-black'}`}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                  {copied ? "COPIED" : "REPORT TO AI"}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] scrollbar-hide">
                <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/10 font-mono text-[10px] text-rose-300/70">
                   <p className="text-white opacity-30 mb-2 uppercase font-black">Runtime Anomalies</p>
                   {consoleErrors.length > 0 ? consoleErrors.map((err, i) => <p key={i} className="mb-1">➔ {err}</p>) : <p className="opacity-20 italic">No anomalies.</p>}
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/10 font-mono text-[10px] text-emerald-400/70">
                   <p className="text-white opacity-30 mb-2 uppercase font-black">Server Response</p>
                   <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">NextraLabs surgical v4.1 (Admin Auto-Auth Active)</p>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-[10px] font-bold underline">CLOSE PANEL</button>
          </div>
        </div>
      )}
    </div>
  )
}
