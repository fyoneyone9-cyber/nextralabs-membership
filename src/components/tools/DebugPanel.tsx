'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Copy, CheckCircle2, Database, Sparkles, Lock, Unlock, Activity, Terminal, ShieldAlert, Loader2, Send, ExternalLink, Camera, Zap, Heart, RefreshCw, BarChart3, Globe
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function DebugPanel({ data, toolId }: { data: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [consoleErrors, setConsoleErrors] = useState<string[]>([])
  const [apiHealth, setApiHealth] = useState<any>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const originalError = window.console.error;
    const wrapError = (...args: any[]) => {
      try {
        const msg = args.map(arg => (arg instanceof Error ? arg.message : typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
        setConsoleErrors(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}][ERR] ${msg}`]);
      } catch (e) {}
      originalError.apply(window.console, args);
    };
    window.console.error = wrapError;
    return () => { window.console.error = originalError; };
  }, []);

  const runApiTest = async () => {
    console.log('[TEST] Universal API Surveillance Start...');
    const endpoints = [
      { id: 'trends', name: 'Google Trends', url: '/api/trends' },
      { id: 'gmail', name: 'Gmail Engine', url: '/api/tools/gmail-fetch' },
      { id: 'printful', name: 'Printful Cloud', url: '/api/tools/printful' },
      { id: 'shopify', name: 'Shopify Admin', url: '/api/tools/printful' }, 
      { id: 'staysee', name: 'Staysee PMS', url: '/api/tools/staysee-ai-finder' },
      { id: 'recipe', name: 'AI Recipe', url: '/api/tools/ai-recipe' }
    ];
    
    const results: any = {};
    for (const ep of endpoints) {
      try {
        const body = ep.id === 'shopify' ? { action: 'shopify-test' } : { action: 'test' };
        const res = await fetch(ep.url, { method: 'POST', body: JSON.stringify(body) }).catch(() => fetch(ep.url));
        results[ep.id] = { status: res.status, ok: res.ok };
        console.log(`[SURVEILLANCE] ${res.ok ? '✅' : '⚠️'} ${ep.name}: ${res.status}`);
      } catch (e) {
        results[ep.id] = { status: 'OFFLINE', ok: false };
        console.error(`[SURVEILLANCE] ❌ ${ep.name} CRITICAL_FAILURE`);
      }
    }
    setApiHealth(results);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 ${isOpen ? 'bg-slate-800 border-white/20 text-white' : 'bg-transparent border-white/5 text-slate-700 hover:text-slate-400'}`}>
        <Activity className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">System Debug</span>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-20 left-6 w-[95vw] max-w-2xl bg-[#050507] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          {!isAuth ? (
            <div className="flex gap-2 w-full max-w-sm mx-auto py-10">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="bg-slate-900 border-slate-800 text-white text-center" onKeyDown={(e) => e.key === 'Enter' && password === '2026' && setIsAuth(true)} />
              <Button onClick={() => password === '2026' ? setIsAuth(true) : alert('Invalid')} className="bg-white text-black font-black">OPEN</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3"><Unlock className="h-4 w-4 text-emerald-500" /><span className="text-sm font-black uppercase">Master Surveillance</span></div>
                <div className="flex gap-2">
                  <Button onClick={runApiTest} className="h-8 bg-amber-600 text-[10px] font-black rounded-lg px-4 flex items-center gap-2"><Zap size={12} /> GLOBAL TEST</Button>
                  <Button onClick={() => { navigator.clipboard.writeText(JSON.stringify({ diagnostic: new Date().toISOString(), apiHealth, logs: consoleErrors, data }, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="h-8 bg-white text-black text-[10px] font-black rounded-lg px-4">{copied ? "COPIED" : "REPORT"}</Button>
                </div>
              </div>

              {/* 📊 API監視マトリクス */}
              <div className="grid grid-cols-6 gap-2">
                 {['trends', 'gmail', 'printful', 'shopify', 'staysee', 'recipe'].map(id => (
                   <div key={id} className={`p-2 rounded-lg border text-center transition-all ${apiHealth?.[id]?.ok ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                      <p className="text-[8px] font-black uppercase text-slate-500">{id}</p>
                      <p className="text-[10px] font-bold text-white">{apiHealth?.[id]?.status || '---'}</p>
                   </div>
                 ))}
              </div>

              <div className="bg-black rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[300px]">
                <div className="bg-slate-900 px-4 py-2 border-b border-white/5 text-[10px] font-black text-slate-400">CONSOLE_MIRROR</div>
                <div className="flex-1 overflow-auto p-4 font-mono text-[10px] space-y-1">
                  {consoleErrors.map((log, i) => <div key={i} className={`py-1 border-l-2 pl-2 ${log.includes('[ERR]') ? 'border-red-500 text-red-400' : 'border-emerald-500 text-emerald-400'}`}>{log}</div>)}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center"><span className="text-[8px] text-slate-800 font-bold uppercase">Ultimate Surveillance v9.0</span><button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white text-[10px] font-bold uppercase underline">Close</button></div>
        </div>
      )}
    </div>
  )
}
