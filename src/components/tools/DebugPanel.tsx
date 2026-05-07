'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Unlock, Activity, Zap
} from 'lucide-react'

export function DebugPanel({ data, toolId }: { data: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    setIsMounted(true)
    
    // PORTリンクをクリックした時にここを開くためのグローバルイベント
    const handleOpenPort = () => {
      setIsOpen(true)
    }
    
    // ログ受信用
    const handleLog = (e: any) => {
      if (e && e.detail && e.detail.msg) {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`${time}: ${e.detail.msg}`, ...prev].slice(0, 30));
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('open-port-debug', handleOpenPort)
      window.addEventListener('nextra-log', handleLog)
      return () => {
        window.removeEventListener('open-port-debug', handleOpenPort)
        window.removeEventListener('nextra-log', handleLog)
      }
    }
  }, [])

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
        const res = await fetch(ep.url, { method: 'GET' });
        results[ep.id] = { status: res.status, ok: res.ok };
        if (res.status === 405) {
          const resPost = await fetch(ep.url, { method: 'POST', body: JSON.stringify({ action: 'test' }) });
          results[ep.id] = { status: resPost.status, ok: resPost.ok };
        }
      } catch (e) {
        results[ep.id] = { status: 'OFFLINE', ok: false };
      }
    }
    setApiHealth(results);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* 画面端のボタンは隠し、ヘッダーからのトリガーを待つ */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#050507] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-300">
            {!isAuth ? (
              <div className="space-y-6 py-10">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-[0.2em]">Master Access Required</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Enter Secure Node Password</p>
                </div>
                <div className="flex gap-2 w-full max-w-xs mx-auto">
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••" 
                    className="bg-slate-900 border-slate-800 text-white text-center" 
                    onKeyDown={(e) => e.key === 'Enter' && password === '2026' && setIsAuth(true)} 
                    autoFocus
                  />
                  <Button onClick={() => password === '2026' ? setIsAuth(true) : alert('Invalid')} className="bg-white text-black font-black">LOGIN</Button>
                </div>
                <button onClick={() => setIsOpen(false)} className="block mx-auto text-[10px] text-slate-600 hover:text-white uppercase underline">Cancel</button>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Unlock className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-black uppercase tracking-tighter italic">Master Surveillance v10.5</span>
                  </div>
                  <Button onClick={runApiTest} className="h-8 bg-amber-600 hover:bg-amber-500 text-[10px] font-black rounded-lg px-4 flex items-center gap-2 transition-all active:scale-95">
                    <Zap size={12} /> GLOBAL TEST
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                   {['trends', 'gnews', 'gmail', 'staysee'].map(id => (
                     <div key={id} className={`p-3 rounded-xl border text-center transition-all ${apiHealth?.[id]?.ok ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                        <p className="text-[7px] font-black uppercase text-slate-500 mb-1">{id}</p>
                        <p className="text-[10px] font-bold text-white leading-none">{apiHealth?.[id]?.status || '---'}</p>
                     </div>
                   ))}
                </div>

                {logs.length > 0 && (
                  <div className="bg-black/50 border border-white/5 p-4 rounded-xl max-h-40 overflow-y-auto font-mono text-[9px] text-emerald-500/80 space-y-1">
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-2 border-b border-white/5 pb-1 italic">System Intelligence Logs</p>
                    {logs.map((log, i) => <p key={i}>{log}</p>)}
                  </div>
                )}

                <div className="bg-emerald-600/5 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden">
                   <p className="text-xs text-emerald-400 font-bold italic">NEXTRA MASTER CONSOLE ACTIVE. ALL NODES VERIFIED.</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[8px] text-slate-800 font-bold uppercase tracking-[0.5em]">Identity: NextraLabs Master</span>
                  <button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white text-[10px] font-bold uppercase underline italic">Terminate Node</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
