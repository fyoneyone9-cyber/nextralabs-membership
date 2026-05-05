'use client'

import React, { useState, useEffect } from 'react'
import { Terminal, ChevronDown, ChevronUp, AlertCircle, Copy, CheckCircle2, ShieldQuestion, Bug, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DebugPanelProps {
  data: any
  toolId?: string
}

export function DebugPanel({ data, toolId }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [consoleErrors, setConsoleErrors] = useState<string[]>([])

  // コンソールエラーの収集は継続（認証後に表示）
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      setConsoleErrors(prev => [...prev.slice(-10), `[F12 ERROR] ${msg}`]);
      originalError.apply(console, args);
    };
    return () => { console.error = originalError; };
  }, []);

  const handleAuth = () => {
    // 🔐 暫定パスワード: nextralabs2026
    if (password === 'nextralabs2026') {
      setIsAuth(true)
    } else {
      alert('パスワードが違います')
    }
  }

  const copyForAI = () => {
    const report = {
      report_type: "AI_DIAGNOSTIC_REPORT",
      tool_id: toolId || "unknown",
      timestamp: new Date().toISOString(),
      server_data: data,
      client_f12_errors: consoleErrors
    }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-32 px-4 font-sans">
      <div className="flex items-center justify-between bg-slate-900 border border-white/5 px-6 py-3 rounded-t-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <Bug className="h-4 w-4 text-rose-500" />
          <span className="text-xs font-black text-white uppercase tracking-widest">NextraLabs Ultimate Debugger</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="bg-[#050507] border border-white/5 border-t-0 p-8 rounded-b-2xl shadow-2xl space-y-6">
          
          {!isAuth ? (
            /* 🔒 AUTH SECTION */
            <div className="flex flex-col items-center py-10 space-y-4">
              <Lock className="h-12 w-12 text-slate-700" />
              <div className="text-center">
                <h4 className="text-white font-bold">デバッグパネルはロックされています</h4>
                <p className="text-slate-500 text-xs mt-1">閲覧には開発者用パスワードが必要です</p>
              </div>
              <div className="flex gap-2 w-full max-w-sm">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white rounded-xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                />
                <Button onClick={handleAuth} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6">解除</Button>
              </div>
            </div>
          ) : (
            /* 🔓 AUTHENTICATED LOGS */
            <div className="animate-in fade-in duration-500 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-white font-bold text-sm">認証済みデバッグログ</h4>
                  </div>
                  <p className="text-slate-500 text-[10px]">この情報は秘匿情報として取り扱ってください。</p>
                </div>
                <Button onClick={copyForAI} className={`h-10 px-6 rounded-xl text-xs font-bold gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-rose-600 hover:bg-rose-500'}`}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "コピー完了！" : "AIに全エラーを報告"}
                </Button>
              </div>

              <div className="bg-slate-950 p-6 rounded-xl border border-rose-500/20 max-h-[400px] overflow-y-auto font-mono text-[11px] leading-relaxed">
                {consoleErrors.length > 0 && (
                  <div className="mb-4 text-rose-400">
                    <p className="text-white opacity-40 uppercase tracking-widest font-black border-b border-rose-500/10 mb-2">Browser F12 Logs:</p>
                    {consoleErrors.map((err, i) => <p key={i} className="mb-1">➔ {err}</p>)}
                  </div>
                )}
                <p className="text-white opacity-40 uppercase tracking-widest font-black border-b border-white/5 mb-2">Server Response:</p>
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              ※ このパネルは NextraLabs 開発者専用です。認証後の情報はAIによる迅速な不具合修正にのみ使用されます。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
