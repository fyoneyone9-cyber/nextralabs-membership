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
                <div className="flex items-center gap-3">
                  <Unlock className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-black uppercase tracking-tighter">Diagnostic Live (Master Core)</span>
                  <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-500 animate-pulse">STREAMING</Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      const el = document.documentElement;
                      const report = {
                        url: window.location.href,
                        screen: { width: window.innerWidth, height: window.innerHeight },
                        ua: navigator.userAgent,
                        dom_summary: {
                          tags: Array.from(document.querySelectorAll('*')).length,
                          has_error_overlay: !!document.querySelector('.nextjs-error-overlay-dark')
                        }
                      };
                      console.log('[SYSTEM_SNAPSHOT]', report);
                    }}
                    className="h-8 bg-blue-600 hover:bg-blue-500 text-[10px] font-black rounded-lg px-4"
                  >
                    🔍 SNAPSHOT
                  </Button>
                  <Button 
                    onClick={() => { 
                      const fullReport = {
                        identity: {
                          app: "NextraLabs Social Command",
                          version: "v7.5-ULTIMATE",
                          environment: process.env.NODE_ENV,
                        },
                        diagnostic: {
                          timestamp: new Date().toISOString(),
                          local_time: new Date().toLocaleString(),
                          url: window.location.href,
                          user_agent: navigator.userAgent
                        },
                        tool_context: {
                          toolId,
                          current_state: data
                        },
                        console_stack: {
                          count: consoleErrors.length,
                          entries: consoleErrors
                        },
                        network_check: {
                          online: navigator.onLine,
                        }
                      };
                      navigator.clipboard.writeText(JSON.stringify(fullReport, null, 2)); 
                      setCopied(true); 
                      setTimeout(() => setCopied(false), 2000) 
                    }} 
                    className="h-8 bg-white text-black hover:bg-slate-200 text-[10px] font-black rounded-lg px-4 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    {copied ? "✅ ULTIMATE REPORT COPIED" : "🚀 COPY ULTIMATE REPORT"}
                  </Button>
                </div>
              </div>

              <div className="bg-black rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-[500px]">
                {/* ターミナルヘッダー */}
                <div className="bg-slate-900 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nextra Debug Terminal</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-6 font-mono text-[11px] leading-relaxed custom-scrollbar">
                  <div className="space-y-4">
                    {/* Console Logs Area */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500 border-b border-white/5 pb-1">
                        <Activity size={12} />
                        <span className="font-black uppercase tracking-tighter">System Events & F12 Mirror</span>
                      </div>
                      <div className="space-y-1">
                        {consoleErrors.length > 0 ? (
                          consoleErrors.map((log, i) => {
                            const isErr = log.includes('[ERR]');
                            const isWarn = log.includes('[WARN]');
                            return (
                              <div key={i} className={`py-1 px-3 rounded border-l-2 ${
                                isErr ? 'bg-red-500/10 border-red-500 text-red-400' : 
                                isWarn ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 
                                'bg-emerald-500/5 border-emerald-500/30 text-emerald-500/80'
                              }`}>
                                {log}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-slate-700 italic">No events captured...</p>
                        )}
                      </div>
                    </div>

                    {/* Component Data Area */}
                    <div className="space-y-2 pt-4">
                      <div className="flex items-center gap-2 text-slate-500 border-b border-white/5 pb-1">
                        <Database size={12} />
                        <span className="font-black uppercase tracking-tighter">Live State Buffer</span>
                      </div>
                      <pre className="text-blue-400/60 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 overflow-x-auto">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  </div>
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
