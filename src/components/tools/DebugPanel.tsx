'use client'

import React, { useState, useEffect } from 'react'
import { Terminal, ChevronDown, ChevronUp, AlertCircle, Copy, CheckCircle2, ShieldQuestion, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DebugPanelProps {
  data: any
  toolId?: string
}

export function DebugPanel({ data, toolId }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [consoleErrors, setConsoleErrors] = useState<string[]>([])

  // 🛠️ F12（コンソール）のエラーをキャッチする
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      setConsoleErrors(prev => [...prev.slice(-10), `[F12 ERROR] ${msg}`]); // 直近10件を保存
      originalError.apply(console, args);
    };
    return () => { console.error = originalError; };
  }, []);

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
        <div className="bg-[#050507] border border-white/5 border-t-0 p-8 rounded-b-2xl shadow-2xl space-y-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-white font-bold text-sm">全システム統合ログ</h4>
              <p className="text-slate-500 text-[10px]">サーバー応答 ＋ ブラウザ(F12)のエラーを統合表示中。</p>
            </div>
            <Button onClick={copyForAI} className={`h-10 px-6 rounded-xl text-xs font-bold gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-rose-600 hover:bg-rose-500'}`}>
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "コピー完了！" : "AIに全エラーを報告"}
            </Button>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-rose-500/20 max-h-[400px] overflow-y-auto font-mono text-[11px] leading-relaxed">
            {/* 🔴 F12 Errors Section */}
            {consoleErrors.length > 0 && (
              <div className="mb-4 text-rose-400">
                <p className="text-white opacity-40 uppercase tracking-widest font-black border-b border-rose-500/10 mb-2">Browser F12 Logs:</p>
                {consoleErrors.map((err, i) => <p key={i} className="mb-1">➔ {err}</p>)}
              </div>
            )}
            
            {/* 🟢 Server Data Section */}
            <p className="text-white opacity-40 uppercase tracking-widest font-black border-b border-white/5 mb-2">Server Response:</p>
            <pre className="text-emerald-400">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              ※ F12を開かずに、このパネルだけでトラブルシューティングが完結するように設計されています。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
