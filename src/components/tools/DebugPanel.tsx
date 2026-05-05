'use client'

import React, { useState, useEffect } from 'react'
import { Terminal, ChevronDown, ChevronUp, AlertCircle, Copy, CheckCircle2, ShieldQuestion, Bug, Lock, Unlock, Database, Activity, History, ShieldAlert, Cpu } from 'lucide-react'
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
      setConsoleErrors(prev => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${msg}`]);
      originalError.apply(console, args);
    };
    return () => { console.error = originalError; };
  }, []);

  const handleAuth = () => {
    if (password === 'nextralabs2026') setIsAuth(true)
    else alert('SYSTEM ACCESS DENIED')
  }

  const copyForAI = () => {
    const report = {
      header: "=== NEXTRALABS SURGICAL CALTE v4.0 ===",
      tool: toolId,
      time: new Date().toISOString(),
      server_trace: data?._trace || "INCOMPLETE_TRACE",
      raw_error_details: data,
      client_console: consoleErrors,
      browser_info: { screen: `${window.innerWidth}x${window.innerHeight}`, agent: navigator.userAgent }
    }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto mt-20 mb-40 px-4">
      <div 
        onClick={() => !isOpen && setIsOpen(true)}
        className={`flex items-center justify-between border px-8 py-5 rounded-t-[2.5rem] shadow-2xl transition-all cursor-pointer ${data?.error ? 'bg-rose-950 border-rose-500/50' : 'bg-slate-900 border-white/10'}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <Bug className={`h-6 w-6 ${data?.error ? 'text-rose-400' : 'text-emerald-400'} relative z-10`} />
            <Cpu className="h-6 w-6 text-blue-400 animate-pulse" />
          </div>
          <span className="text-sm font-black text-white uppercase tracking-[0.4em]">NextraLabs Intelligence Hub</span>
          {data?.error && <Badge className="bg-rose-600 text-white animate-bounce border-0">ANOMALY DETECTED</Badge>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }} className="bg-white/5 p-2 rounded-full hover:bg-white/10">
          {isOpen ? <ChevronUp className="h-6 w-6 text-white" /> : <ChevronDown className="h-6 w-6 text-white" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="bg-[#020204] border border-white/10 border-t-0 p-12 rounded-b-[2.5rem] shadow-2xl space-y-10 animate-in slide-in-from-top-4 duration-500">
          {!isAuth ? (
            <div className="flex flex-col items-center py-20 space-y-8">
              <ShieldAlert className="h-20 w-20 text-rose-500 animate-pulse" />
              <div className="text-center space-y-2">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Encrypted Protocol</h4>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Enter development key to visualize system organs</p>
              </div>
              <div className="flex gap-4 w-full max-w-md">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-900 border-slate-700 h-20 rounded-3xl text-white text-center text-3xl font-black focus:border-rose-500" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-rose-600 hover:bg-rose-500 h-20 px-12 rounded-3xl font-black text-lg">DECRYPT</Button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 space-y-12">
              <div className="flex flex-col md:flex-row items-center justify-between bg-emerald-500/5 p-8 rounded-[2rem] border border-emerald-500/20 gap-8">
                <div className="flex items-center gap-6">
                  <div className="bg-emerald-500 p-5 rounded-3xl shadow-2xl shadow-emerald-500/20"><Unlock className="h-10 w-10 text-slate-950" /></div>
                  <div>
                    <h4 className="text-white font-black text-2xl uppercase tracking-tight">Surgical Diagnostic Live</h4>
                    <p className="text-emerald-400/60 text-sm font-black uppercase tracking-[0.3em]">Full System Transparency Enabled</p>
                  </div>
                </div>
                <Button onClick={copyForAI} className={`h-20 px-12 rounded-3xl text-lg font-black gap-4 transition-all shadow-2xl ${copied ? 'bg-green-600' : 'bg-white text-black hover:bg-slate-200'}`}>
                  {copied ? <CheckCircle2 className="h-8 w-8" /> : <Database className="h-8 w-8" />}
                  {copied ? "COPIED" : "COPY CALTE FOR AI"}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-10">
                <div className="space-y-4">
                  <h5 className="text-rose-500 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                    <History className="h-5 w-5" /> Runtime Anomalies
                  </h5>
                  <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-rose-500/20 max-h-[400px] overflow-y-auto font-mono text-[11px] leading-loose text-rose-300/80 shadow-inner">
                    {consoleErrors.length > 0 ? consoleErrors.map((err, i) => <p key={i} className="mb-4 border-l-2 border-rose-500/20 pl-6">{err}</p>) : <p className="opacity-20 italic p-4 text-lg">No anomalies detected.</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                    <Terminal className="h-5 w-5" /> Organ Trace (Server-Side)
                  </h5>
                  <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-emerald-500/20 max-h-[500px] overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400/80 shadow-inner">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-indigo-500/10 p-6 rounded-3xl border border-indigo-500/20 flex gap-6 items-center">
            <ShieldQuestion className="h-8 w-8 text-indigo-400 shrink-0" />
            <p className="text-xs text-indigo-300 leading-relaxed font-bold uppercase tracking-[0.1em] opacity-80">
              Surgical protocol v4.0: Deep trace active. All system organs visible. AI-ready for instantaneous recovery.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
