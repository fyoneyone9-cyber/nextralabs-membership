'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { 
  Unlock, Activity, Zap, Copy, CheckCircle2, Terminal, AlertTriangle, ShieldCheck, Globe
} from 'lucide-react'

export function DebugPanel({ data, toolId }: { data?: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [logs, setLogs] = useState<{time: string, msg: string, type: string}[]>([])
  const [copied, setCopied] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
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

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('[data-nextra-port-trigger]')) setIsOpen(true);
    };
    
    window.addEventListener('click', handleClick);
    const handleCustomLog = (e: any) => {
       if (e.detail && e.detail.msg) createLogEntry([e.detail.msg], 'system');
    };
    window.addEventListener('nextra-log', handleCustomLog);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('nextra-log', handleCustomLog);
      console.log = originalLog; console.warn = originalWarn; console.error = originalError;
    };
  }, [])

  const runApiTest = async () => {
    setIsTesting(true);
    const endpoints = [
      { id: 'trends', name: 'Google Trends', url: '/api/tools/trends', method: 'GET' },
      { id: 'gnews', name: 'GNews API', url: '/api/tools/gnews', method: 'GET' },
      { id: 'gmail', name: 'Gmail Engine', url: '/api/tools/gmail-fetch', method: 'POST' },
      { id: 'staysee', name: 'Staysee PMS', url: '/api/tools/staysee-ai-finder', method: 'POST' },
      { id: 'rakuten', name: 'Rakuten API', url: '/api/tools/rakuten-search', method: 'GET' },
      { id: 'supabase', name: 'Supabase DB', url: '/api/auth/session', method: 'GET' }
    ];
    const results: any = {};
    for (const ep of endpoints) {
      try {
        const options: any = { method: ep.method };
        if (ep.method === 'POST') options.body = JSON.stringify({ action: 'health_check' });
        const res = await fetch(ep.url, options);
        // 405や400でも応答があれば「存在している」とみなす
        results[ep.id] = { name: ep.name, status: res.status, ok: res.status < 500 };
      } catch (e) {
        results[ep.id] = { name: ep.name, status: 'OFFLINE', ok: false };
      }
    }
    setApiHealth(results);
    setIsTesting(false);
  };

  const handleLogin = () => {
    if (password === '2026') {
      setIsAuth(true);
      runApiTest(); // ログイン時に自動テスト
    } else alert('Invalid Node Password');
  }

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[10001] flex flex-col items-start font-sans">
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-500 bg-black/40 backdrop-blur-md shadow-2xl ${isOpen ? 'border-emerald-500/50 text-emerald-500 scale-110' : 'border-white/5 text-slate-800 hover:border-white/20'}`}>
        <Activity size={20} />
      </button>
      
      {isOpen && (
        <div className="fixed top-20 left-6 w-[95vw] max-w-2xl bg-[#050507]/98 backdrop-blur-3xl border-2 border-white/10 p-8 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.9)] space-y-8 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
          {!isAuth ? (
            <div className="space-y-8 py-10">
              <div className="text-center space-y-3">
                <Terminal className="text-emerald-500 mx-auto" size={40} />
                <h3 className="text-2xl font-black text-white italic uppercase tracking-[0.3em]">Master Access</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Authorization Required: PW 2026</p>
              </div>
              <div className="flex gap-3 w-full max-w-xs mx-auto">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="bg-slate-900/50 border-slate-800 text-white text-center h-12 rounded-xl text-xl" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} autoFocus />
                <Button onClick={handleLogin} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 h-12 rounded-xl uppercase italic">Unlock</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-left animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  <span className="text-xl font-black uppercase italic tracking-tighter text-white">API Health Guard</span>
                </div>
                <Button onClick={runApiTest} disabled={isTesting} className="h-10 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black rounded-xl px-6 flex items-center gap-2 shadow-lg animate-pulse">
                  <Zap size={14} /> {isTesting ? 'SCANNING...' : 'SCAN ALL NODES'}
                </Button>
              </div>

              {/* 🛠️ メイン機能：API 監視パネル */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {apiHealth ? Object.keys(apiHealth).map(id => (
                   <div key={id} className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${apiHealth[id].ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/10'}`}>
                      <div className="flex justify-between items-start">
                         <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{apiHealth[id].name}</p>
                         <div className={`w-2 h-2 rounded-full ${apiHealth[id].ok ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                      </div>
                      <div className="flex items-end justify-between">
                         <p className={`text-xl font-black italic ${apiHealth[id].ok ? 'text-white' : 'text-red-400'}`}>{apiHealth[id].status}</p>
                         <Badge className={apiHealth[id].ok ? 'bg-emerald-600/20 text-emerald-500 border-0 text-[8px]' : 'bg-red-600/20 text-red-500 border-0 text-[8px]'}>
                            {apiHealth[id].ok ? 'ONLINE' : 'CRITICAL'}
                         </Badge>
                      </div>
                   </div>
                 )) : (
                   <div className="col-span-full py-10 border-2 border-dashed border-white/5 rounded-3xl text-center opacity-30 italic uppercase font-black text-xs tracking-widest">Awaiting System Scan...</div>
                 )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic pl-2 border-l-2 border-emerald-500">Log Stream</p>
                   <Button onClick={() => {
                     const report = {
                       timestamp: new Date().toISOString(),
                       url: window.location.href,
                       apiHealth: apiHealth,
                       systemLogs: logs, // ここを確実に最新のログ配列に修正
                       componentData: data || {}
                     };
                     navigator.clipboard.writeText(JSON.stringify(report, null, 2));
                     setCopied(true); setTimeout(() => setCopied(false), 2000);
                   }} className="h-7 bg-white/5 hover:bg-white/10 text-slate-400 text-[8px] font-black rounded-lg px-3 flex items-center gap-1 border border-white/5">
                      {copied ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />} {copied ? 'COPIED' : 'COPY REPORT'}
                   </Button>
                </div>
                <div className="bg-black/60 border border-white/5 p-4 rounded-2xl h-40 overflow-y-auto font-mono text-[9px] space-y-1 shadow-inner">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 leading-tight break-all border-b border-white/5 pb-1">
                      <span className="text-slate-600 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-amber-400' : 'text-emerald-500/80'}>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <button onClick={() => setIsOpen(false)} className="text-[10px] text-slate-700 hover:text-white font-black uppercase tracking-widest italic underline">Terminate</button>
                 <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/port')} className="text-[10px] text-emerald-500 hover:text-emerald-400 font-black uppercase tracking-widest italic flex items-center gap-1"><Globe size={10}/> PORTFOLIO</button>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black">v13.0 MASTER</Badge>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
