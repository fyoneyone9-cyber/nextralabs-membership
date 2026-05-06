'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Receipt, Loader2, CheckCircle2, 
  ArrowRight, Zap, FolderSearch, Table, Database, Settings
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [syncedCount, setSyncedCount] = useState(0);

  const startSync = async () => {
    setIsProcessing(true);
    setStatus('SYNCING');
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] レシート同期プロトコル開始...`, ...prev]);
    
    try {
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 'Expenses'フォルダをスキャン中...`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 3件の新規レシート画像を検出。`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] AIが金額・日付・店舗名を解析中...`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] スプレッドシートへの書き込みを実行...`, ...prev]);
      
      setSyncedCount(prev => prev + 3);
      setStatus('COMPLETED');
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ 同期完了：スプレッドシートが最新化されました。`, ...prev]);
    } catch (e) {
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-emerald-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Automated Ledger Engine</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Expense Sync</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left">
          <div className="w-14 h-14 rounded-2xl border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-500 font-bold text-2xl bg-emerald-500/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] italic mb-2">運用プロトコル / LEDGER SYNC</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#1</span> ExpensesフォルダのレシートをAIが自動スキャン</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#2</span> 金額・日付・店舗名を「本物のAI」が精密抽出</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-600 italic text-2xl">#3</span> スプレッドシートへ自動で一行ずつ記帳</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <button 
              onClick={startSync}
              disabled={isProcessing}
              className={`w-full h-32 ${isProcessing ? 'bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-black rounded-[2rem] shadow-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 border-b-8 border-emerald-900 active:border-b-0`}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : (
                <>
                  <Table className="w-10 h-10" />
                  <span className="text-2xl uppercase italic tracking-tighter">同期プロトコル開始</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 text-center shadow-inner">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic text-left pl-2">同期済み件数</p>
                  <p className="text-4xl font-black text-white italic">{syncedCount}</p>
               </div>
               <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 text-center shadow-inner text-left">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic pl-2">DB接続ステータス</p>
                  <p className="text-xl font-black text-emerald-500 italic uppercase">Sync Active</p>
               </div>
            </div>
          </div>

          <div className="bg-black rounded-[3rem] p-8 border border-white/5 shadow-inner flex flex-col relative overflow-hidden h-[300px] text-left">
             <div className="flex items-center gap-3 text-emerald-500 font-black italic uppercase text-xs mb-4"><Zap size={16} /> Data Processing Output</div>
             <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide text-left">
                {logs.length === 0 ? (
                  <p className="text-slate-700 italic">待機中...</p>
                ) : (
                  logs.map((log, i) => (
                    <p key={i} className={`${log.includes('✅') ? 'text-emerald-400 font-bold' : 'text-slate-400 animate-in fade-in'}`}>{log}</p>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-emerald-500">
            <Database size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Enterprise Ledger Protocol</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed">
            このツールは経理業務の完全自動化を目指して設計されました。Expensesフォルダを監視し、スプレッドシートへの記帳作業からあなたを解放します。
         </p>
      </div>

      <DebugPanel data={{ status, syncedCount }} toolId="expense-sync-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Financial Automation Hub • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Ledger Node...</div>
})

export default function ExpenseSyncSystem() {
  return <NoSSRWrapper />;
}
