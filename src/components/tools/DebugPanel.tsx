'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Unlock, Activity, Zap, Copy, CheckCircle2, Terminal, ShieldCheck, Globe, X
} from 'lucide-react'

// 管理者メールアドレス（この人にだけボタンが見える）
const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

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
  } catch (e) {}
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
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    setIsMounted(true);
    setDisplayLogs(getStoredLogs());
    const refresh = () => setDisplayLogs(getStoredLogs());
    window.addEventListener('nextra_refresh_logs', refresh);
    const handleTrigger = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-nextra-port-trigger]')) setIsOpen(true);
    };
    window.addEventListener('click', handleTrigger);

    // 管理者チェック
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email === ADMIN_EMAIL) setIsAdmin(true)
    }
    checkAdmin()

    return () => {
      window.removeEventListener('nextra_refresh_logs', refresh);
      window.removeEventListener('click', handleTrigger);
    };
  }, []);

  const copyReport = () => {
    const finalLogs = getStoredLogs();
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      apiHealth,
      systemLogs: finalLogs,
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

  // マウント前 or 管理者でない場合は何も表示しない
  if (!isMounted || !isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[10001] hidden md:flex flex-col items-end font-sans">
      {/* トリガーボタン：小さくシンプルに */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Admin Panel"
        className="flex items-center justify-center w-8 h-8 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5 text-slate-600 hover:text-emerald-500 hover:border-emerald-500/20 transition-all"
      >
        <Activity size={14} />
      </button>

      {isOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-[#0d1117]/98 backdrop-blur-3xl border border-emerald-500/20 p-5 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
          {/* 閉じるボタン */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-1.5 bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-all"
          >
            <X size={14} />
          </button>

          {!isAuth ? (
            /* 認証画面：コンパクト版 */
            <div className="space-y-4 text-center py-2">
              <div className="space-y-1">
                <Terminal className="text-emerald-500 mx-auto" size={28} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Auth</p>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-9 bg-slate-900/60 border border-white/10 rounded-lg text-white text-center text-sm font-mono focus:border-emerald-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && password === '2026' && setIsAuth(true)}
                autoFocus
              />
              <Button
                onClick={() => password === '2026' ? setIsAuth(true) : alert('ERR')}
                className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg transition-all"
              >
                <Unlock size={13} className="mr-1.5" /> Unlock
              </Button>
              <p className="text-[9px] text-slate-700 uppercase tracking-tight">Authorized Personnel Only</p>
            </div>
          ) : (
            /* 認証後パネル */
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-bold text-white">監視パネル v15.2</span>
                </div>
                <Button
                  onClick={runApiScan}
                  disabled={isTesting}
                  className="h-7 bg-emerald-600/80 text-white text-[10px] font-bold rounded-lg px-3 flex items-center gap-1"
                >
                  <Zap size={10} /> スキャン
                </Button>
              </div>

              {/* APIヘルス */}
              {apiHealth && (
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.keys(apiHealth).map(id => (
                    <div key={id} className={`p-2 rounded-lg border text-center ${apiHealth[id].ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/10'}`}>
                      <p className="text-[7px] font-bold text-slate-500 truncate">{apiHealth[id].name}</p>
                      <p className={`text-sm font-bold ${apiHealth[id].ok ? 'text-white' : 'text-red-400'}`}>{apiHealth[id].status}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ログ */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tight border-l-2 border-emerald-500 pl-1.5">Logs</p>
                  <Button onClick={copyReport} className="h-6 bg-white/5 text-slate-400 text-[8px] font-bold rounded-md px-2 flex items-center gap-1 border border-white/5">
                    {copied ? <CheckCircle2 size={9} className="text-emerald-500" /> : <Copy size={9} />}
                    {copied ? 'コピー済' : 'コピー'}
                  </Button>
                </div>
                <div className="bg-black/60 border border-white/5 p-3 rounded-xl h-36 overflow-y-auto font-mono text-[8px] space-y-1 shadow-inner">
                  {displayLogs.map((log, i) => (
                    <div key={i} className="flex gap-1.5 leading-tight break-all border-b border-white/5 pb-0.5">
                      <span className="text-slate-700 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'error' ? 'text-red-400' : log.type === 'action' ? 'text-blue-400 font-bold' : 'text-emerald-500/80'}>
                        {log.type === 'action' ? '▶ ' : ''}{log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button onClick={() => setIsOpen(false)} className="text-[9px] text-slate-700 hover:text-white font-bold underline">終了</button>
                <button onClick={() => router.push('/port')} className="text-[9px] text-emerald-500 font-bold flex items-center gap-1"><Globe size={9}/> PORTFOLIO</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
