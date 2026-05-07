'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { 
  Unlock, Activity, Zap, Copy, CheckCircle2, Terminal
} from 'lucide-react'

export function DebugPanel({ data, toolId }: { data?: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const handleLog = (e: any) => {
      if (e && e.detail && e.detail.msg) {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`${time}: ${e.detail.msg}`, ...prev].slice(0, 30));
      }
    }
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('[data-nextra-port-trigger]')) {
        setIsOpen(true);
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('nextra-log', handleLog)
      window.addEventListener('click', handleClick)
      return () => {
        window.removeEventListener('nextra-log', handleLog)
        window.removeEventListener('click', handleClick)
      }
    }
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
      logs: logs.slice(0, 10),
      data: data || 'none'
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
        // 基本はGET、特定のツールはPOSTでテスト
        const method = (ep.id === 'gmail' || ep.id === 'staysee') ? 'POST' : 'GET';
        const options: any = { method };
        if (method === 'POST') {
          options.body = JSON.stringify({ action: 'health_check' });
        }
        
        const res = await fetch(ep.url, options);
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
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-500 bg-black/40 backdrop-blur-md shadow-2xl ${isOpen ? 'border-emerald-500/50 text-emerald-500 rotate-90 scale-110' : 'border-white/5 text-slate-800 hover:border-white/20'}`}
      >
        <Activity size={20} />
      </button>
      
      {isOpen && (
        <div className="fixed top-20 left-6 w-[95vw] max-w-lg bg-[#050507]/95 backdrop-blur-2xl border-2 border-white/10 p-8 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.9)] space-y-8 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          {!isAuth ? (
            <div className="space-y-8 py-10">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center border border-emerald-500/20 shadow-inner animate-pulse">
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
                <Button onClick={handleLogin} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 h-12 rounded-xl shadow-lg transition-all active:scale-95 italic uppercase">Unlock</Button>
              </div>
              <button onClick={() => setIsOpen(false)} className="block mx-auto text-[10px] text-slate-700 hover:text-white uppercase font-black tracking-widest transition-colors italic">Terminate Node</button>
            </div>
          ) : (
            <div className="space-y-8 text-left animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <Unlock className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="leading-none">
                    <span className="text-sm font-black uppercase italic tracking-tighter text-white">Surveillance OS v11.0</span>
                    <p className="text-[8px] font-bold text-emerald-500/70 uppercase tracking-widest mt-1 italic">Master Identity Verified</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyDebugInfo} className="h-10 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black rounded-xl px-5 flex items-center gap-2 border border-white/5 transition-all">
                    {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />} 
                    {copied ? 'COPIED' : 'COPY DEBUG'}
                  </Button>
                  <Button onClick={runApiTest} className="h-10 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black rounded-xl px-5 flex items-center gap-2 border-b-4 border-amber-800 active:border-b-0 transition-all active:scale-95 shadow-lg">
                    <Zap size={14} /> GLOBAL TEST
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                 {['trends', 'gnews', 'gmail', 'staysee'].map(id => (
                   <div key={id} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${apiHealth?.[id]?.ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/10'}`}>
                      <p className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">{id}</p>
                      <p className={`text-[11px] font-black italic ${apiHealth?.[id]?.ok ? 'text-emerald-500' : 'text-slate-700'}`}>{apiHealth?.[id]?.status || '---'}</p>
                      <div className={`w-1.5 h-1.5 rounded-full ${apiHealth?.[id]?.ok ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`} />
                   </div>
                 ))}
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic pl-2 border-l-2 border-emerald-500">Live System Intelligence</p>
                <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] h-48 overflow-y-auto font-mono text-[10px] text-emerald-500/80 space-y-2 shadow-inner custom-scrollbar">
                  {logs.length > 0 ? logs.map((log, i) => <p key={i} className="animate-in slide-in-from-left-2">{log}</p>) : (
                    <p className="text-slate-800 italic uppercase tracking-widest text-center pt-14">Awaiting Signal...</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                 <button onClick={() => setIsOpen(false)} className="text-[10px] text-slate-700 hover:text-white font-black uppercase tracking-[0.3em] transition-colors italic underline">Terminate View</button>
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black italic uppercase tracking-widest px-4 py-1">Nodes Verified 100%</Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
