'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { 
  Unlock, Activity, Zap, Copy, CheckCircle2, Terminal, ShieldCheck, Globe
} from 'lucide-react'

export function DebugPanel({ data }: { data?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const router = useRouter()

  // ログをsessionStorageに保存・復元する関数
  const syncLogs = (newLogs: any[]) => {
    setLogs(newLogs);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nextra_debug_logs', JSON.stringify(newLogs.slice(0, 100)));
    }
  }

  useEffect(() => {
    setIsMounted(true)
    
    // 起動時に保存されたログを復元
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('nextra_debug_logs');
      if (saved) setLogs(JSON.parse(saved));
    }

    const captureLog = (type: string, args: any[]) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      const entry = { time: new Date().toLocaleTimeString(), msg, type };
      
      setLogs(prev => {
        const updated = [entry, ...prev].slice(0, 100);
        // sessionStorageにも即座に保存
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('nextra_debug_logs', JSON.stringify(updated));
        }
        return updated;
      });
    };

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => { captureLog('info', args); originalLog.apply(console, args); };
    console.warn = (...args) => { captureLog('warn', args); originalWarn.apply(console, args); };
    console.error = (...args) => { captureLog('error', args); originalError.apply(console, args); };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, input, [role="button"]');
      if (clickable) {
        const text = clickable.textContent?.trim().substring(0, 30) || (clickable as HTMLInputElement).value || '要素';
        captureLog('action', [`[CLICK] ${text} (${clickable.tagName})`]);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);

    const handleTrigger = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-nextra-port-trigger]')) setIsOpen(true);
    };
    window.addEventListener('click', handleTrigger);

    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
      window.removeEventListener('click', handleTrigger);
      console.log = originalLog; console.warn = originalWarn; console.error = originalError;
    };
  }, [])

  const runApiScan = async () => {
    setIsTesting(true);
    const nodes = [
      { id: 'trends', name: 'Googleトレンド', url: '/api/tools/trends', method: 'GET' },
      { id: 'gnews', name: 'GNews API', url: '/api/tools/gnews', method: 'GET' },
      { id: 'gmail', name: 'Gmailエンジン', url: '/api/tools/gmail-fetch', method: 'POST' },
      { id: 'staysee', name: 'Staysee PMS', url: '/api/tools/staysee-ai-finder', method: 'POST' },
      { id: 'rakuten', name: '楽天API', url: '/api/tools/rakuten-search', method: 'GET' }
    ];
    const results: any = {};
    for (const node of nodes) {
      try {
        const res = await fetch(node.url, { method: node.method, body: node.method === 'POST' ? JSON.stringify({ action: 'health' }) : undefined });
        results[node.id] = { name: node.name, status: res.status, ok: res.status < 500 };
      } catch (e) {
        results[node.id] = { name: node.name, status: 'OFFLINE', ok: false };
      }
    }
    setApiHealth(results);
    setIsTesting(false);
  };

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
                <h3 className="text-2xl font-black text-white italic uppercase tracking-[0.3em]">Master Debug</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">管理パスワードを入力（2026）</p>
              </div>
              <div className="flex gap-3 w-full max-w-xs mx-auto">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="bg-slate-900/50 border-slate-800 text-white text-center h-12 rounded-xl text-xl" onKeyDown={(e) => e.key === 'Enter' && password === '2026' && setIsAuth(true)} autoFocus />
                <Button onClick={() => password === '2026' ? setIsAuth(true) : alert('Invalid')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 h-12 rounded-xl uppercase">Unlock</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-left animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  <span className="text-xl font-black text-white italic">APIヘルスガード</span>
                </div>
                <Button onClick={runApiScan} disabled={isTesting} className="h-10 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black rounded-xl px-6 flex items-center gap-2 shadow-lg">
                  <Zap size={14} /> {isTesting ? '検査中...' : '全ノードスキャン'}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {apiHealth && Object.keys(apiHealth).map(id => (
                   <div key={id} className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 ${apiHealth[id].ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/10'}`}>
                      <p className="text-[9px] font-black text-slate-500">{apiHealth[id].name}</p>
                      <div className="flex items-center justify-between">
                         <p className={`text-lg font-black italic ${apiHealth[id].ok ? 'text-white' : 'text-red-400'}`}>{apiHealth[id].status}</p>
                         <div className={`w-2 h-2 rounded-full ${apiHealth[id].ok ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic pl-2 border-l-2 border-emerald-500">システム実行ログ (F12情報 / 操作履歴)</p>
                   <Button onClick={() => {
                     const report = { timestamp: new Date().toISOString(), url: window.location.href, apiHealth, systemLogs: logs };
                     navigator.clipboard.writeText(JSON.stringify(report, null, 2));
                     setCopied(true); setTimeout(() => setCopied(false), 2000);
                   }} className="h-7 bg-white/5 hover:bg-white/10 text-slate-400 text-[8px] font-black rounded-lg px-3 flex items-center gap-1 border border-white/5">
                      {copied ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />} {copied ? 'コピー成功' : 'レポートをコピー'}
                   </Button>
                </div>
                <div className="bg-black/80 border border-white/5 p-4 rounded-2xl h-48 overflow-y-auto font-mono text-[9px] space-y-1 shadow-inner">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 leading-tight break-all border-b border-white/5 pb-1">
                      <span className="text-slate-600 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-amber-400' : log.type === 'action' ? 'text-blue-400 font-bold' : 'text-emerald-500/80'}>
                        {log.type === 'action' ? '▶ ' : ''}{log.msg}
                      </span>
                    </div>
                  ))}
                  {logs.length === 0 && <p className="text-slate-800 italic text-center pt-20 uppercase tracking-[0.3em]">No Logs Detected</p>}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <button onClick={() => setIsOpen(false)} className="text-[10px] text-slate-700 hover:text-white font-black italic underline">コンソールを閉じる</button>
                 <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/port')} className="text-[10px] text-emerald-500 hover:text-emerald-400 font-black flex items-center gap-1"><Globe size={10}/> ポートフォリオへ</button>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black">v15.0 ETERNAL</Badge>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
