'use client'

import React, { useState, useEffect } from 'react'
import { Copy, CheckCircle2, Database, Sparkles, Lock, Unlock, Heart, Cat, ChevronUp, ChevronDown, Activity, Terminal, ShieldAlert, Loader2, Send, ExternalLink, Camera, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export function DebugPanel({ data, toolId }: { data: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [consoleErrors, setConsoleErrors] = useState<string[]>([])
  
  const supabase = createClient()

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
            if (typeof arg === 'object') return JSON.stringify(arg);
            return String(arg);
          } catch { return "[Object]"; }
        }).join(' ');
        setConsoleErrors(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}][ERR] ${msg}`]);
      } catch (e) { /* silent */ }
      originalError.apply(window.console, args);
    };

    const wrapLog = (...args: any[]) => {
      try {
        const msg = args.map(arg => {
          try {
            if (typeof arg === 'object') return JSON.stringify(arg);
            return String(arg);
          } catch { return "[Object]"; }
        }).join(' ');
        setConsoleErrors(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}][LOG] ${msg}`]);
      } catch (e) { /* silent */ }
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

  const takeScreenshot = async () => {
    if (typeof window === 'undefined') return;
    try {
      // 依存関係を動的インポートしてSSRエラーを完全に封じる
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(document.body, {
        backgroundColor: '#050507',
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = `debug-${Date.now()}.png`;
      link.click();
    } catch (e) { console.error('Screenshot failed', e); }
  };

  const runApiTest = async () => {
    console.log('[TEST] Starting Connectivity Check...');
    const endpoints = [
      { name: 'Trends', url: '/api/trends' },
      { name: 'Gmail', url: '/api/tools/gmail-fetch' },
      { name: 'Printful', url: '/api/tools/printful' }
    ];
    for (const ep of endpoints) {
      try {
        const start = Date.now();
        const res = await fetch(ep.url, { method: 'POST', body: JSON.stringify({ test: true }) }).catch(() => fetch(ep.url));
        console.log(`[TEST] ${res.ok ? '✅' : '⚠️'} ${ep.name}: ${res.status} (${Date.now() - start}ms)`);
      } catch (e) { console.error(`[TEST] ❌ ${ep.name} FAILED`); }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 ${
          isOpen ? 'bg-slate-800 border-white/20 text-white' : 'bg-transparent border-white/5 text-slate-700 hover:border-white/10 hover:text-slate-400'
        }`}
      >
        <Activity className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">System Debug</span>
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
                <div className="flex items-center gap-3">
                  <Unlock className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-black uppercase">Diagnostic Live</span>
                  <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-500 animate-pulse">STREAMING</Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={runApiTest} className="h-8 bg-amber-600 hover:bg-amber-500 text-[10px] font-black rounded-lg px-4 flex items-center gap-2"><Zap size={12} /> API TEST</Button>
                  <Button onClick={takeScreenshot} className="h-8 bg-pink-600 hover:bg-pink-500 text-[10px] font-black rounded-lg px-4 flex items-center gap-2"><Camera size={12} /> SHOT</Button>
                  <Button onClick={() => { 
                    const fullReport = {
                      identity: { app: "NextraLabs", version: "v7.5-FINAL" },
                      diagnostic: { timestamp: new Date().toISOString(), url: window.location.href },
                      tool_context: { toolId, current_state: data },
                      console_stack: consoleErrors
                    };
                    navigator.clipboard.writeText(JSON.stringify(fullReport, null, 2)); 
                    setCopied(true); 
                    setTimeout(() => setCopied(false), 2000) 
                  }} className="h-8 bg-white text-black hover:bg-slate-200 text-[10px] font-black rounded-lg px-4 shadow-[0_0_20px_rgba(255,255,255,0.3)]">{copied ? "✅ COPIED" : "🚀 COPY REPORT"}</Button>
                </div>
              </div>

              <div className="bg-black rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-[400px]">
                <div className="bg-slate-900 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2"><Terminal size={14} className="text-slate-400" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nextra Debug Terminal</span></div>
                </div>
                <div className="flex-1 overflow-auto p-6 font-mono text-[11px] leading-relaxed">
                  <div className="space-y-1">
                    {consoleErrors.length > 0 ? consoleErrors.map((log, i) => (
                      <div key={i} className={`py-1 px-3 rounded border-l-2 ${log.includes('[ERR]') ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-emerald-500/5 border-emerald-500/30 text-emerald-500/80'}`}>{log}</div>
                    )) : <p className="text-slate-700 italic">No events captured...</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between"><span className="text-[8px] text-slate-800 font-bold uppercase">v7.5-FINAL</span><button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white text-[10px] font-bold uppercase underline">Close</button></div>
        </div>
      )}
    </div>
  )
}
