'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { 
  Unlock, Activity, Zap, Copy, CheckCircle2, Terminal, ShieldCheck, Globe, X
} from 'lucide-react'

// --- ABSOLUTE LOGGING ENGINE (Reactの外で動作) ---
const STORAGE_KEY = 'nextra_absolute_logs';

function getStoredLogs() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function pushAbsoluteLog(type: string, msg: string) {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    const entry = { time: new Date().toLocaleTimeString(), msg, type };
    const current = getStoredLogs();
    const updated = [entry, ...current].slice(0, 100);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nextra_refresh_logs'));
  } catch (e) {
    // サイレントに失敗させる（無限ループ防止）
  }
}

// consoleジャックを即時実行
if (typeof window !== 'undefined' && !(window as any).nextra_initialized) {
  (window as any).nextra_initialized = true;
  const oLog = console.log; const oWarn = console.warn; const oErr = console.error;
  console.log = (...args) => { pushAbsoluteLog('info', args.map(String).join(' ')); oLog.apply(console, args); };
  console.warn = (...args) => { pushAbsoluteLog('warn', args.map(String).join(' ')); oWarn.apply(console, args); };
  console.error = (...args) => { pushAbsoluteLog('error', args.map(String).join(' ')); oErr.apply(console, args); };
  
  window.addEventListener('mousedown', (e) => {
    const target = e.target as HTMLElement;
    const clickable = target.closest('button, a, input');
    if (clickable) pushAbsoluteLog('action', `[CLICK] ${clickable.textContent?.trim().substring(0,20) || '要素'}`);
  });
}

export function DebugPanel({ data }: { data?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [displayLogs, setDisplayLogs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true);
    setDisplayLogs(getStoredLogs());
    const refresh = () => setDisplayLogs(getStoredLogs());
    window.addEventListener('nextra_refresh_logs', refresh);
    const handleTrigger = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-nextra-port-trigger]')) setIsOpen(true);
    };
    window.addEventListener('click', handleTrigger);
    return () => {
      window.removeEventListener('nextra_refresh_logs', refresh);
      window.removeEventListener('click', handleTrigger);
    };
  }, []);

  const copyReport = () => {
    // 【重要】ReactのStateではなく、ストレージから直接取得
    const finalLogs = getStoredLogs();
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      apiHealth,
      systemLogs: finalLogs, // これで空になることは絶対にない
      componentData: data || {}
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runApiScan = async () => {
    setIsTesting(true);
    const nodes = [
      { id: 'trends', name: 'トレンド', url: '/api/tools/trends', method: 'GET' },
      { id: 'gnews', name: 'GNews', url: '/api/tools/gnews', method: 'GET' },
      { id: 'gmail', name: 'Gmail', url: '/api/tools/gmail-fetch', method: 'POST' },
      { id: 'staysee', name: 'Staysee', url: '/api/tools/staysee-ai-finder', method: 'POST' }
    ];
    const results: any = {};
    for (const node of nodes) {
      try {
        const res = await fetch(node.url, { method: node.method, body: node.method === 'POST' ? JSON.stringify({ action: 'health' }) : undefined });
        results[node.id] = { name: node.name, status: res.status, ok: res.status < 500 };
      } catch (e) {
        results[node.id] = { name: node.name, status: 'ERR', ok: false };
      }
    }
    setApiHealth(results);
    setIsTesting(false);
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[10001] hidden md:flex flex-col items-end font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-center w-12 h-12 rounded-2xl border bg-black/40 backdrop-blur-md shadow-2xl border-white/5 text-slate-400 hover:text-emerald-500 transition-colors"
      >
        <Activity size={20} />
      </button>
      
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-[#050507]/98 backdrop-blur-3xl border-2 border-emerald-500/30 p-8 rounded-[3rem] space-y-6 animate-in zoom-in-95 duration-300">
          {/* 終了ボタン (大きく、右上に配置) */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-all active:scale-90 border border-white/10 z-10"
          >
            <X size={28} strokeWidth={3} />
          </button>

          {!isAuth ? (
            <div className="py-10 space-y-10 text-center">
              <div className="space-y-4">
                <Terminal className="text-emerald-500 mx-auto" size={60} />
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">System Authentication</h3>
              </div>
              
              <div className="space-y-4 px-4">
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="PW" 
                  className="h-12 bg-slate-900/50 border-2 border-white/10 rounded-2xl text-white text-center text-3xl font-bold outline-none focus:border-emerald-500 transition-all" 
                  onKeyDown={(e) => e.key === 'Enter' && password === '2026' && setIsAuth(true)} 
                  autoFocus 
                />
                <Button 
                  onClick={() => password === '2026' ? setIsAuth(true) : alert('ERR')} 
                  className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-2xl rounded-2xl shadow-xl transition-all active:scale-95 uppercase "
                >
                  Unlock <Unlock className="ml-2 h-6 w-6" />
                </Button>
              </div>
              
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight ">Authorized Personnel Only</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-emerald-500" /><span className="text-xl font-bold text-white ">監視パネル v15.2 ABSOLUTE</span></div>
                <Button onClick={runApiScan} disabled={isTesting} className="h-10 bg-emerald-600 text-white text-[10px] font-bold rounded-xl px-6 flex items-center gap-2 shadow-lg"><Zap size={14} /> スキャン開始</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                 {apiHealth && Object.keys(apiHealth).map(id => (
                   <div key={id} className={`p-3 rounded-xl border transition-all flex flex-col gap-1 ${apiHealth[id].ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/10'}`}>
                      <p className="text-[8px] font-bold text-slate-500">{apiHealth[id].name}</p>
                      <p className={`text-lg font-bold ${apiHealth[id].ok ? 'text-white' : 'text-red-400'}`}>{apiHealth[id].status}</p>
                   </div>
                 ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tight border-l-2 border-emerald-500 pl-2">System Absolute Logs</p>
                   <Button onClick={copyReport} className="h-7 bg-white/5 text-slate-400 text-[8px] font-bold rounded-lg px-3 flex items-center gap-1 border border-white/5">
                      {copied ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />} {copied ? 'コピー成功' : 'レポートをコピー'}
                   </Button>
                </div>
                <div className="bg-black/80 border border-white/5 p-4 rounded-2xl h-48 overflow-y-auto font-mono text-[9px] space-y-1 shadow-inner">
                  {displayLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 leading-tight break-all border-b border-white/5 pb-1">
                      <span className="text-slate-600 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'error' ? 'text-red-400' : log.type === 'action' ? 'text-blue-400 font-bold' : 'text-emerald-500/80'}>
                        {log.type === 'action' ? '▶ ' : ''}{log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <button onClick={() => setIsOpen(false)} className="text-[10px] text-slate-700 hover:text-white font-bold underline">終了</button>
                 <button onClick={() => router.push('/port')} className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><Globe size={10}/> PORTFOLIO</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
