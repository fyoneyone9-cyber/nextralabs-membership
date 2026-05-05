'use client'

import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Bug, Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@supabase/supabase-js' // 🛠️ 標準ライブラリからインポートに変更

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
  
  // 🛠️ 特定のパスに依存せず、環境変数からクライアントを直接作成
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

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

  return (
    <div className="fixed bottom-4 left-4 z-[9999] opacity-20 hover:opacity-100 transition-opacity">
      <button onClick={() => setIsOpen(!isOpen)} className="w-8 h-8 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center hover:bg-slate-800 transition-all shadow-2xl">
        <Bug className={`h-4 w-4 ${data?.error ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`} />
      </button>
      {isOpen && (
        <div className="fixed bottom-16 left-4 w-[90vw] max-w-2xl bg-[#020204] border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          {!isAuth ? (
            <div className="flex flex-col items-center py-10 space-y-4 text-center">
              <Lock className="h-10 w-10 text-slate-700" />
              <p className="text-white font-bold text-sm">Developer Key Required</p>
              <div className="flex gap-2 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-900 border-slate-700 text-white rounded-xl" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-emerald-600 text-white rounded-xl">OPEN</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3"><Unlock className="h-5 w-5 text-emerald-500" /><span className="text-white font-black text-sm uppercase">Diagnostic Hub</span></div>
                <Button onClick={copyForAI} className={`h-10 px-4 rounded-xl text-xs font-black gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-white text-black'}`}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                  {copied ? "COPIED" : "REPORT TO AI"}
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] scrollbar-hide">
                <pre className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/10 font-mono text-[10px] text-emerald-400/70 whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}
          <div className="flex justify-end"><button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-[10px] font-bold underline uppercase">Close Panel</button></div>
        </div>
      )}
    </div>
  )
}
