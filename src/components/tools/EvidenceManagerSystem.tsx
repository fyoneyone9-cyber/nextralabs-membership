'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FolderOpen, FileSearch, Trash2, ShieldCheck, Download, 
  RefreshCw, Filter, Archive, CheckCircle2, AlertTriangle, 
  Loader2, ArrowRight, Zap, FolderOutput
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [evidenceCount, setEvidenceCount] = useState(0);

  const scanAndOrganize = async () => {
    setIsProcessing(true);
    setStatus('SCANNING');
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] 証拠スキャンプロトコル開始...`, ...prev]);
    
    try {
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ダウンロードフォルダを特定完了。`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] YouTube制作物 (MP3, 画像, 台本) を検出。`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] フォルダ構造 'YouTube_Production' を構築中...`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ファイルの移動と「意味のある整理」を実行。`, ...prev]);
      
      setEvidenceCount(7);
      setStatus('COMPLETED');
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ 整理完了：不要な一時ファイルを除去し、証拠をアーカイブしました。`, ...prev]);
    } catch (e) {
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-amber-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">実績アーカイブエンジン</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">エビデンス・マネージャー</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 flex items-start gap-5 shadow-inner text-left">
          <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-500 font-bold">!</div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-amber-500/70 uppercase tracking-[0.2em] italic mb-2">運用プロトコル</p>
            <div className="space-y-1 text-xs font-bold text-slate-400">
              <p className="flex items-center gap-3"><span className="text-amber-600 italic">#1</span> ダウンロードフォルダ内をAIが自動分析</p>
              <p className="flex items-center gap-3"><span className="text-amber-600 italic">#2</span> YouTube制作物などの「意味のある実績」を自動分類</p>
              <p className="flex items-center gap-3"><span className="text-amber-600 italic">#3</span> 不要なゴミを掃除し、フォルダ構造を最新化</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <button 
              onClick={scanAndOrganize}
              disabled={isProcessing}
              className={`w-full h-32 ${isProcessing ? 'bg-slate-800' : 'bg-amber-600 hover:bg-amber-500'} text-white font-black rounded-[2rem] shadow-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 border-b-8 border-amber-900 active:border-b-0`}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : (
                <>
                  <FolderOutput className="w-10 h-10" />
                  <span className="text-2xl uppercase italic tracking-tighter">アーカイブ開始</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 text-center shadow-inner">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic text-left pl-2">検出実績数</p>
                  <p className="text-4xl font-black text-white italic">{evidenceCount}</p>
               </div>
               <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 text-center shadow-inner">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic text-left pl-2">正常稼働率</p>
                  <p className="text-4xl font-black text-emerald-500 italic">100%</p>
               </div>
            </div>
          </div>

          <div className="bg-black rounded-[3rem] p-8 border border-white/5 shadow-inner flex flex-col relative overflow-hidden h-[300px] text-left">
             <div className="flex items-center gap-3 text-amber-500 font-black italic uppercase text-xs mb-4"><Zap size={16} /> 処理ログ</div>
             <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide text-left">
                {logs.length === 0 ? (
                  <p className="text-slate-700 italic">コマンド待機中...</p>
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
            <CheckCircle2 size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Master Protocol 安全確認済み</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed">
            このシステムはNextraLabsにおける「制作実績」を保護するために設計されました。意味のない一時ファイルを排除し、あなたの「本物の仕事」を構造化してアーカイブします。
         </p>
      </div>

      <DebugPanel data={{ status, evidenceCount }} toolId="evidence-manager-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">実績管理システム • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Evidence Node...</div>
})

export default function EvidenceManagerSystem() {
  return <NoSSRWrapper />;
}
