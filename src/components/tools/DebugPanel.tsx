'use client'

import React, { useState } from 'react'
import { Terminal, ChevronDown, ChevronUp, AlertCircle, Copy, CheckCircle2, ShieldQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button' // 🛠️ 追加

interface DebugPanelProps {
  data: any
  toolId?: string
}

export function DebugPanel({ data, toolId }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!data) return null

  const copyForAI = () => {
    const report = {
      report_type: "AI_DIAGNOSTIC_REPORT",
      tool_id: toolId || "unknown",
      timestamp: new Date().toISOString(),
      raw_data: data
    }
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-32 px-4 font-sans">
      <div className="flex items-center justify-between bg-slate-900 border border-white/5 px-6 py-3 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-black text-white uppercase tracking-widest">NextraLabs Diagnostic Panel</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="bg-[#050507] border border-white/5 border-t-0 p-8 rounded-b-2xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-white font-bold text-sm">システム実行ログ</h4>
              <p className="text-slate-500 text-[10px]">この情報を私（AI）に伝えると、一瞬で原因を特定できます。</p>
            </div>
            <Button 
              onClick={copyForAI}
              className={`h-10 px-4 rounded-xl text-xs font-bold gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "コピーしました！" : "AIに状況を報告（コピー）"}
            </Button>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-emerald-500/20 max-h-[400px] overflow-y-auto scrollbar-hide">
            <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          <div className="flex items-center gap-2 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <ShieldQuestion className="h-4 w-4 text-emerald-400" />
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              ※ デバッグモード有効中。本番環境ではこのパネルを通じて、サーバーからの生のエラーレスポンスを確認できます。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
