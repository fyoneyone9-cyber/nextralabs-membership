'use client'
import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Sparkles, Lock, Unlock, Heart, Cat, ChevronUp, ChevronDown, Bug, Activity, History, Terminal, ShieldQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@supabase/supabase-js'

export function DebugPanel({ data, toolId }: { data: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [consoleErrors, setConsoleErrors] = useState<string[]>([])
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email === 'f.yoneyone9@gmail.com') setIsAuth(true)
    }
    checkUser()
    const originalError = console.error
    console.error = (...args: any[]) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
      setConsoleErrors(prev => [...prev.slice(-30), '[' + new Date().toLocaleTimeString() + '] ' + msg])
      originalError.apply(console, args)
    }
    return () => { console.error = originalError }
  }, [supabase.auth])

  const handleAuth = () => {
    if (password === 'nextralabs2026') setIsAuth(true)
    else alert('パスワードが違います 🐾')
  }

  const copyForAI = () => {
    const report = { report_type: "AI_DIAGNOSTIC_REPORT", tool_id: toolId || "unknown", time: new Date().toISOString(), server_trace: data, client_logs: consoleErrors }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] opacity-20 hover:opacity-100 transition-opacity">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full transition-all group">
        <Sparkles className={'h-4 w-4 ' + (isOpen ? 'text-white' : 'text-emerald-400')} />
      </button>
      {isOpen && (
        <div className="fixed bottom-16 left-4 w-[90vw] max-w-lg bg-[#0a0a0f]/95 backdrop-blur-2xl border-2 border-emerald-500/20 p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          {!isAuth ? (
            <div className="flex flex-col items-center py-10 space-y-4">
              <Lock className="h-10 w-10 text-slate-700" />
              <div className="flex gap-2 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="bg-slate-900 border-white/5 text-white h-12 rounded-xl" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-emerald-600 text-white rounded-xl h-12 px-6">OPEN</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3"><Unlock className="h-5 w-5 text-emerald-500" /><span className="text-white font-black text-xs uppercase">Diagnostic Hub</span></div>
                <Button onClick={copyForAI} size="sm" className={'h-10 px-4 rounded-xl text-xs font-black ' + (copied ? 'bg-green-600' : 'bg-white text-black')}>{copied ? 'COPIED!' : 'REPORT TO AI'}</Button>
              </div>
              <div className="bg-slate-950 p-6 rounded-[2rem] border border-emerald-500/10 shadow-inner overflow-auto max-h-[300px]">
                <pre className="text-emerald-400/90 font-mono text-[9px] leading-relaxed">{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          )}
          <div className="flex justify-end"><button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-[10px] font-bold underline">CLOSE</button></div>
        </div>
      )}
    </div>
  )
}