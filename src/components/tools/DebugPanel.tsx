'use client'

import React, { useState, useEffect } from 'react'
import { Terminal, ChevronDown, ChevronUp, AlertCircle, Copy, CheckCircle2, ShieldQuestion, Bug, Lock, Unlock, Database, Activity, History, ShieldAlert } from 'lucide-react'
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
      setConsoleErrors(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
      originalError.apply(console, args);
    };
    return () => { console.error = originalError; };
  }, []);

  const handleAuth = () => {
    if (password === 'nextralabs2026') setIsAuth(true)
    else alert('ACCESS DENIED')
  }

  const copyForAI = () => {
    const report = {
      header: "=== NEXTRALABS ULTIMATE DIAGNOSTIC REPORT v3.0 ===",
      tool: toolId,
      time: new Date().toISOString(),
      url: window.location.href,
      server_trace: data?._trace || "No server trace found",
      raw_response: data,
      client_logs: consoleErrors
    }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto mt-20 mb-32 px-4 select-none">
      <div className={`flex items-center justify-between border px-6 py-4 rounded-t-3xl shadow-2xl transition-all ${data?.error ? 'bg-rose-950 border-rose-500/50' : 'bg-slate-900 border-white/10'}`}>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            <Bug className={`h-5 w-5 ${data?.error ? 'text-rose-400' : 'text-emerald-400'}`} />
            <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
          </div>
          <span className="text-xs font-black text-white uppercase tracking-[0.3em]">System Intelligence Monitor</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-white/5 p-2 rounded-full hover:bg-white/10">
          {isOpen ? <ChevronUp className="h-6 w-6 text-white" /> : <ChevronDown className="h-6 w-6 text-white" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="bg-[#020204] border border-white/10 border-t-0 p-10 rounded-b-3xl shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-300">
          {!isAuth ? (
            <div className="flex flex-col items-center py-20 space-y-8">
              <ShieldAlert className="h-16 w-16 text-rose-500 animate-pulse" />
              <div className="text-center space-y-2">
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Encrypted Access</h4>
                <p className="text-slate-500 text-sm font-bold">開発者用キーを入力して緊急プロトコルを解除してください</p>
              </div>
              <div className="flex gap-3 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-900 border-slate-700 h-16 rounded-2xl text-white text-center text-2xl font-black" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-rose-600 hover:bg-rose-500 h-16 px-10 rounded-2xl font-black shadow-lg shadow-rose-600/20">DECRYPT</Button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 space-y-10">
              <div className="flex items-center justify-between bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20">
                <div className="flex items-center gap-6">
                  <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20"><Unlock className="h-8 w-8 text-slate-950" /></div>
                  <div>
                    <h4 className="text-white font-black text-xl uppercase tracking-tighter">AI Diagnostic Live</h4>
                    <p className="text-emerald-400/60 text-xs font-black uppercase tracking-[0.2em]">Ready for surgical recovery</p>
                  </div>
                </div>
                <Button onClick={copyForAI} className={`h-16 px-10 rounded-2xl text-sm font-black gap-3 transition-all shadow-2xl ${copied ? 'bg-green-600' : 'bg-white text-black hover:bg-slate-200'}`}>
                  {copied ? <CheckCircle2 className="h-6 w-6" /> : <Database className="h-6 w-6" />}
                  {copied ? "COPIED TO CLIPBOARD" : "COPY FULL CALTE FOR AI"}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <History className="h-4 w-4" /> Client-Side Anomalies
                  </h5>
                  <div className="bg-slate-950 p-6 rounded-[2rem] border border-rose-500/20 max-h-[400px] overflow-y-auto font-mono text-[10px] leading-relaxed text-rose-300/80 shadow-inner">
                    {consoleErrors.length > 0 ? consoleErrors.map((err, i) => <p key={i} className="mb-3 border-l-2 border-rose-500/20 pl-4">{err}</p>) : <p className="opacity-20 italic">No anomalies detected in browser runtime.</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> Server-Side Trace
                  </h5>
                  <div className="bg-slate-950 p-6 rounded-[2rem] border border-emerald-500/20 max-h-[400px] overflow-y-auto font-mono text-[10px] leading-relaxed text-emerald-400/80 shadow-inner">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
