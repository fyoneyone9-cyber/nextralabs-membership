'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Copy, CheckCircle2, Unlock, Activity, Zap, Globe
} from 'lucide-react'
import Link from 'next/link'

export function DebugPanel({ data, toolId }: { data: any, toolId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    setIsMounted(true)
    // グローバルなログ取得用に関数をウィンドウに登録
    (window as any).nextraLog = (msg: string) => {
      setLogs(prev => [new Date().toLocaleTimeString() + ': ' + msg, ...prev].slice(0, 30))
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
        // GETで試行し、ダメならPOST（405回避）
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
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 ${isOpen ? 'bg-slate-800 border-white/20 text-white' : 'bg-transparent border-white/5 text-slate-700 hover:border-white/10'}`}>
        <Activity className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">System Debug</span>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-20 left-6 w-[95vw] max-w-2xl bg-[#050507] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          {!isAuth ? (
            <div className="flex gap-2 w-full max-w-sm mx-auto py-10">
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••" 
                className="bg-slate-900 border-slate-800 text-white text-center" 
                onKeyDown={(e) => e.key === 'Enter' && password === '2026' && setIsAuth(true)} 
              />
              <Button onClick={() => password === '2026' ? setIsAuth(true) : alert('Invalid')} className="bg-white text-black font-black">OPEN</Button>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3"><Unlock className="h-4 w-4 text-emerald-500" /><span className="text-sm font-black uppercase">Master Surveillance</span></div>
                <div className="flex gap-2">
                  <Link 
                    href="/port"
                    className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg px-4 flex items-center gap-2 transition-all shadow-lg active:scale-95"
                  >
                    <Globe size={12} /> PORT
                  </Link>
                  <Button onClick={runApiTest} className="h-8 bg-amber-600 text-[10px] font-black rounded-lg px-4 flex items-center gap-2"><Zap size={12} /> GLOBAL TEST</Button>
                </div>
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
                  <p className="text-[8px] text-slate-600 font-black uppercase mb-2 border-b border-white/5 pb-1 italic">Console Stream</p>
                  {logs.map((log, i) => <p key={i}>{log}</p>)}
                </div>
              )}

              <div className="bg-emerald-600/5 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden group">
                 <p className="text-xs text-emerald-400 font-bold italic">NEXTRA MASTER CONSOLE ACTIVE. ALL NODES ONLINE.</p>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center"><span className="text-[8px] text-slate-800 font-bold uppercase">Surveillance v10.1</span><button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white text-[10px] font-bold uppercase underline">Close</button></div>
        </div>
      )}
    </div>
  )
}
