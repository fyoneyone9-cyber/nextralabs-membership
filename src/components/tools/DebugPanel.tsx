'use client'

import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Bug, Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react'
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
      header: "=== NEXTRALABS SURGICAL CALTE v4.2 ===",
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
    /* 🌑 ステルス・コンテナ: 画面の隅にひっそりと配置 */
    <div className="fixed bottom-4 left-4 z-[9999] group">
      
      {/* 🐞 控えめな起動ボタン: 通常はほぼ透明 */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-slate-900/30 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest transition-all ${
          isOpen ? 'opacity-100 bg-slate-800 border-white/10' : 'opacity-10 hover:opacity-100 hover:bg-slate-800'
        } ${data?.error && !isOpen ? 'text-rose-500/50' : 'text-slate-600'}`}
      >
        <Bug className="h-3 w-3" />
        <span className="hidden group-hover:inline">Diagnostics</span>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-14 left-4 w-[90vw] max-w-2xl bg-[#020204]/95 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,1)] space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          
          {!isAuth ? (
            <div className="flex flex-col items-center py-10 space-y-4">
              <Lock className="h-10 w-10 text-slate-800" />
              <p className="text-slate-500 font-bold text-xs tracking-widest uppercase italic">Secure Layer</p>
              <div className="flex gap-2 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-slate-900 border-slate-800 text-white text-center rounded-2xl h-12" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-white text-black font-black rounded-2xl px-6 h-12 hover:bg-slate-200">OPEN</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Unlock className="h-5 w-5 text-emerald-500" />
                  <span className="text-white font-black text-sm uppercase tracking-widest">Surgical Diagnostic Live</span>
                </div>
                <Button onClick={copyForAI} className={`h-10 px-4 rounded-xl text-xs font-black gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                  {copied ? "COPIED" : "REPORT TO AI"}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] scrollbar-hide">
                <div className="bg-black/50 p-6 rounded-3xl border border-white/5 font-mono text-[10px] leading-relaxed">
                  <p className="text-white/20 mb-2 uppercase font-black tracking-widest">Data Trace Output</p>
                  <pre className="text-emerald-400/80 whitespace-pre-wrap">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-2">
            <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Protocol v4.2 Stealth Mode</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white text-[10px] font-bold uppercase underline-offset-4 hover:underline">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
