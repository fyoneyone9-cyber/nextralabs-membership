'use client'

import React, { useState, useEffect } from 'react'
import { Terminal, ChevronDown, ChevronUp, AlertCircle, Copy, CheckCircle2, ShieldQuestion, Bug, Lock, Unlock, Database, Activity, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      setConsoleErrors(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);
      originalError.apply(console, args);
    };
    return () => { console.error = originalError; };
  }, []);

  const handleAuth = () => {
    if (password === 'nextralabs2026') setIsAuth(true)
    else alert('Invalid Key')
  }

  const copyForAI = () => {
    const report = {
      report_type: "ULTIMATE_AI_REPORT",
      tool_id: toolId || "unknown",
      timestamp: new Date().toISOString(),
      environment: { user_agent: navigator.userAgent, url: window.location.href },
      server_trace: data,
      console_logs: consoleErrors
    }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto mt-20 mb-32 px-4">
      <div className="flex items-center justify-between bg-slate-900 border border-white/10 px-6 py-4 rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            <Bug className="h-5 w-5 text-rose-500 relative z-10" />
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="text-sm font-black text-white uppercase tracking-[0.2em]">NextraLabs Ultimate Debugger</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-all">
          {isOpen ? <ChevronUp className="h-6 w-6 text-white" /> : <ChevronDown className="h-6 w-6 text-white" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="bg-[#020204] border border-white/10 border-t-0 p-10 rounded-b-3xl shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-300">
          
          {!isAuth ? (
            <div className="flex flex-col items-center py-16 space-y-6">
              <div className="p-6 bg-slate-900/50 rounded-full border border-white/5"><Lock className="h-12 w-12 text-slate-600" /></div>
              <h4 className="text-xl font-bold text-white uppercase tracking-widest">Developer Access Only</h4>
              <div className="flex gap-2 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-900 border-slate-700 h-14 rounded-2xl text-white text-center" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-emerald-600 h-14 px-8 rounded-2xl font-black">UNLOCK</Button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400"><Unlock className="h-6 w-6" /></div>
                  <div>
                    <h4 className="text-white font-black text-lg uppercase tracking-tight">Diagnostic Mode Active</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Deep trace of server & client states</p>
                  </div>
                </div>
                <Button onClick={copyForAI} className={`h-14 px-8 rounded-2xl text-sm font-black gap-3 transition-all shadow-xl ${copied ? 'bg-green-600' : 'bg-white text-black hover:bg-slate-200'}`}>
                  {copied ? <CheckCircle2 className="h-5 w-5" /> : <Database className="h-5 w-5" />}
                  {copied ? "COPIED" : "REPORT TO AI"}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* 🔴 Browser Console Section */}
                <div className="space-y-4">
                  <h5 className="text-rose-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <History className="h-4 w-4" /> Client Runtime Logs
                  </h5>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/20 max-h-[300px] overflow-y-auto font-mono text-[11px] leading-loose text-rose-300">
                    {consoleErrors.length > 0 ? consoleErrors.map((err, i) => <p key={i} className="border-l-2 border-rose-500/30 pl-4 mb-2">{err}</p>) : <p className="opacity-30">No client errors detected.</p>}
                  </div>
                </div>

                {/* 🟢 Server Response Section */}
                <div className="space-y-4">
                  <h5 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> Server Trace Response
                  </h5>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/20 max-h-[400px] overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 flex gap-4 items-center">
            <ShieldQuestion className="h-5 w-5 text-indigo-400 shrink-0" />
            <p className="text-[10px] text-indigo-300 leading-relaxed font-bold uppercase tracking-widest opacity-60">
              Diagnostic protocol v2.1: Full stack tracing enabled for rapid AI recovery.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
