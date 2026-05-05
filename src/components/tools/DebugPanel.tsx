'use client'

import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Sparkles, Lock, Unlock, Heart, Cat, ChevronUp, ChevronDown, Activity, Terminal, ShieldAlert } from 'lucide-react'
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
    if (typeof window === 'undefined') return;

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email === 'f.yoneyone9@gmail.com') setIsAuth(true)
      } catch (e) { /* ignore */ }
    }
    checkUser()

    const originalError = window.console.error;
    const originalLog = window.console.log;

    const wrapError = (...args: any[]) => {
      try {
        const msg = args.map(arg => {
          try {
            if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          } catch { return "[Object]"; }
        }).join(' ');
        setConsoleErrors(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}][ERR] ${msg}`]);
      } catch (e) { /* fail silent */ }
      originalError.apply(window.console, args);
    };

    const wrapLog = (...args: any[]) => {
      try {
        const msg = args.map(arg => {
          try {
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          } catch { return "[Complex Object]"; }
        }).join(' ');
        setConsoleErrors(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}][LOG] ${msg}`]);
      } catch (e) { /* fail silent */ }
      originalLog.apply(window.console, args);
    };

    window.console.error = wrapError;
    window.console.log = wrapLog;

    return () => { 
      window.console.error = originalError; 
      window.console.log = originalLog;
    };
  }, []); 

  const handleAuth = () => {
    if (password === '2026') setIsAuth(true)
    else alert('Invalid Developer Key')
  }

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      
      {/* 🌑 最終：光らない、静かでプロフェッショナルなフラットボタン */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 ${
          isOpen ? 'bg-slate-800 border-white/20 text-white' : 'bg-transparent border-white/5 text-slate-700 hover:border-white/10 hover:text-slate-400'
        }`}
      >
        <Activity className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          System Debug
        </span>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-20 left-6 w-[95vw] max-w-2xl bg-[#050507] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-8 animate-in slide-in-from-bottom-2 duration-300">
          {!isAuth ? (
            <div className="flex flex-col items-center py-10 space-y-6">
              <Lock className="h-8 w-8 text-slate-800" />
              <div className="flex gap-2 w-full max-w-sm">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="bg-slate-900 border-slate-800 text-white text-center rounded-xl h-12" onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
                <Button onClick={handleAuth} className="bg-white text-black font-black rounded-xl px-6 h-12">OPEN</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 text-white">
                <div className="flex items-center gap-3"><Unlock className="h-4 w-4 text-emerald-500" /><span className="text-sm font-black uppercase">Diagnostic Live</span></div>
                <Button 
                  onClick={() => { 
                    const fullReport = {
                      timestamp: new Date().toISOString(),
                      toolId,
                      logs: consoleErrors,
                      componentData: data
                    };
                    navigator.clipboard.writeText(JSON.stringify(fullReport, null, 2)); 
                    setCopied(true); 
                    setTimeout(() => setCopied(false), 2000) 
                  }} 
                  className="h-8 bg-slate-800 text-[10px] rounded-lg border border-white/10 hover:bg-slate-700 transition-colors"
                >
                  {copied ? "✅ FULL REPORT COPIED" : "📋 COPY ALL FOR AI"}
                </Button>
              </div>
              <div className="bg-black p-6 rounded-2xl border border-white/5 overflow-auto max-h-[350px] space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Console Logs (F12 Mirror)</p>
                  <div className="bg-slate-900/50 p-4 rounded-xl font-mono text-[10px] leading-relaxed text-emerald-500/80 whitespace-pre-wrap border border-white/5">
                    {consoleErrors.length > 0 ? consoleErrors.join('\n') : "No logs captured yet..."}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Component Data</p>
                  <pre className="text-blue-400/70 font-mono text-[10px] leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between"><span className="text-[8px] text-slate-800 font-bold uppercase">v4.6 Static Master</span><button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white text-[10px] font-bold uppercase underline">Close</button></div>
        </div>
      )}
    </div>
  )
}
