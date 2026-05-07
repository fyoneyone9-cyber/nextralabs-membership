'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { 
  Unlock, Activity, Zap, Copy, CheckCircle2, Terminal, AlertTriangle, Info
} from 'lucide-react'

export function DebugPanel({ data, toolId }: { data?: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [logs, setLogs] = useState<{time: string, msg: string, type: string}[]>([])
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    
    // --- Console Interceptor (F12情報をジャック) ---
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const createLogEntry = (args: any[], type: string) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      const entry = { time: new Date().toLocaleTimeString(), msg, type };
      setLogs(prev => [entry, ...prev].slice(0, 100));
    };

    console.log = (...args) => {
      createLogEntry(args, 'info');
      originalLog.apply(console, args);
    };
    console.warn = (...args) => {
      createLogEntry(args, 'warn');
      originalWarn.apply(console, args);
    };
    console.error = (...args) => {
      createLogEntry(args, 'error');
      originalError.apply(console, args);
    };

    // --- PORT Trigger ---
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('[data-nextra-port-trigger]')) {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('click', handleClick);
    // カスタムイベント経由のログも受け入れる
    const handleCustomLog = (e: any) => {
       if (e.detail && e.detail.msg) createLogEntry([e.detail.msg], 'system');
    };
    window.addEventListener('nextra-log', handleCustomLog);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('nextra-log', handleCustomLog);
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, [])

  const handleLogin = () => {
    if (password === '2026') {
      setIsAuth(true)
      router.push('/port')
    } else {
      alert('Invalid Node Password')
    }
  }

  const copyDebugInfo = () => {
    const info = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      apiHealth,
      systemLogs: logs, // これでF12レベルの全ログがコピーされる
      componentData: data || 'none'
    };
    navigator.clipboard.writeText(JSON.stringify(info, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const runApiTest = async () => {
    const endpoints = [
      { id: 'trends', name: 'Trends', url: '/api/tools/trends' },
      { id: 'gnews', name: 'GNews', url: '/api/tools/gnews' },
      { id: 'gmail', name: 'Gmail', url: '/api/tools/gmail-fetch' },
      { id: 'staysee', name: 'Staysee', url: '/api/tools/staysee-ai-finder' }
    ];
    const results: any = {};
    for (const ep of endpoints) {
      try {
        const method = (ep.id === 'gmail' || ep.id === 'staysee') ? 'POST' : 'GET';
        const res = await fetch(ep.url, { method, body: method === 'POST' ? JSON.stringify({ action: 'health' }) : undefined });
        results[ep.id] = { status: res.status, ok: res.ok || res.status === 405 };
      } catch (e) {
        results[ep.id] = { status: 'OFFLINE', ok: false };
      }
    }
    setApiHealth(results);
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[10001] flex flex-col items-start font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-500 bg-black/40 backdrop-blur-md shadow-2xl ${isOpen ? 'border-emerald-500/50 text-emerald-500 rotate-90 scale-110' : 'border-white/5 text-slate-800 hover:border-white/20'}`}
      >
        <Activity size={20} />
      </button>
      
      {isOpen && (
        <div className="fixed top-20 left-6 w-[95vw] max-w-xl bg-[#050507]/98 backdrop-blur-3xl border-2 border-white/10 p-8 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.9)] space-y-8 animate-in slide-in-from-top-4 duration-500">
          {!isAuth ? (
            <div className="space-y-8 py-10">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center border border-emerald-500/20 shadow-inner">
                  <Terminal className="text-emerald-500" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-[0.3em]">Master Console</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Authorization Required: PW 2026</p>
              </div>
              <div className="flex gap-3 w-full max-w-xs mx-auto">
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••" 
                  className="bg-slate-900/50 border-slate-800 text-white text-center h-12 rounded-xl text-xl" 
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
                  autoFocus
                />
                <Button onClick={handleLogin} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 h-12 rounded-xl italic uppercase">Unlock</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  <Unlock className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-black uppercase italic tracking-tighter text-white">Surveillance OS v12.0 - FULL INTERCEPT</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyDebugInfo} className="h-9 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black rounded-xl px-4 flex items-center gap-2 transition-all">
                    {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />} {copied ? 'COPIED' : 'COPY ALL LOGS'}
                  </Button>
                  <Button onClick={runApiTest} className="h-9 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black rounded-xl px-4 flex items-center gap-2 shadow-lg">
                    <Zap size={12} /> TEST
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                 {['trends', 'gnews', 'gmail', 'staysee'].map(id => (
                   <div key={id} className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${apiHealth?.[id]?.ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/10'}`}>
                      <p className="text-[7px] font-black uppercase text-slate-500">{id}</p>
                      <p className={`text-[10px] font-black ${apiHealth?.[id]?.ok ? 'text-emerald-500' : 'text-slate-700'}`}>{apiHealth?.[id]?.status || '--'}</p>
                   </div>
                 ))}
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic pl-2 border-l-2 border-emerald-500">Live Runtime Stream (F12 Intercepted)</p>
                <div className="bg-black/80 border border-white/5 p-4 rounded-2xl h-64 overflow-y-auto font-mono text-[9px] space-y-1.5 shadow-inner">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="flex gap-2 leading-relaxed break-all border-b border-white/5 pb-1">
                      <span className="text-slate-600 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-amber-400' : 'text-emerald-500/80'}>
                        {log.type === 'error' ? '✖ ' : log.type === 'warn' ? '⚠ ' : 'ℹ '} {log.msg}
                      </span>
                    </div>
                  )) : (
                    <p className="text-slate-800 italic text-center pt-24 uppercase tracking-[0.3em]">Awaiting Runtime Signal...</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                 <button onClick={() => setIsOpen(false)} className="text-[10px] text-slate-700 hover:text-white font-black uppercase tracking-widest italic">Terminate</button>
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black italic">INTELLIGENCE ACTIVE</Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
