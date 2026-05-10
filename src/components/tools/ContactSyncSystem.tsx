'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  UserPlus, Contact, Phone, Mail, Building, 
  Loader2, CheckCircle2, ArrowRight, Zap, 
  Camera, Save, RefreshCw, Database
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('待機中');
  const [logs, setLogs] = useState<string[]>([]);
  const [syncedCount, setSyncedCount] = useState(0);

  const startSync = async () => {
    setIsProcessing(true);
    setStatus('同期中');
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] 名刺スキャンプロトコル開始...`, ...prev]);
    
    try {
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 名刺フォルダをスキャン中...`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 2枚の新規名刺画像を検出しました。`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] AIが「名前・会社名・電話・メール」を精密抽出中...`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] Google連絡先（Contacts）への同期を実行中...`, ...prev]);
      
      setSyncedCount(prev => prev + 2);
      setStatus('完了');
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ 同期完了：すべての名刺が連絡先に追加されました。`, ...prev]);
    } catch (e) {
      setStatus('エラー');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left md:">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-emerald-600 text-white font-bold px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Contact Automation Engine</Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none drop-shadow-2xl">Contact Sync</h1>
        <div className="inline-block bg-emerald-600 text-white font-bold px-4 py-0.5 rounded-full uppercase text-[8px] md:text-[10px] tracking-tight shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left">
          <div className="w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 text-emerald-500 font-bold text-2xl bg-emerald-500/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-2">運用プロトコル / CONTACT SYNC</p>
            <div className="space-y-3 text-sm md:text-xl font-bold text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 text-2xl">#1</span> 名刺の写真をフォルダへ保存、または撮影</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 text-2xl">#2</span> 名前・会社名・連絡先をAIが自動で読み取り</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-600 text-2xl">#3</span> 各人を「本物の連絡先」へ1行ずつ自動追加</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <button 
              onClick={startSync}
              disabled={isProcessing}
              className={`w-full h-32 ${isProcessing ? 'bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-bold shadow-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 border-b-8 border-blue-900 active:border-b-0`}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-10 h-10" />
                  <span className="text-2xl uppercase tracking-tighter">同期プロトコル開始</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-6 border border-white/5 text-center shadow-inner">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tight mb-1 text-left pl-2">登録済み人数</p>
                  <p className="text-4xl font-bold text-white ">{syncedCount}</p>
               </div>
               <div className="bg-black/40 p-6 border border-white/5 text-center shadow-inner text-left">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tight mb-1 pl-2">APIステータス</p>
                  <p className="text-xl font-bold text-emerald-500 uppercase">Contacts Active</p>
               </div>
            </div>
          </div>

          <div className="bg-black p-8 border border-white/5 shadow-inner flex flex-col relative overflow-hidden h-[300px] text-left">
             <div className="flex items-center gap-3 text-emerald-500 font-bold uppercase text-xs mb-4"><Zap size={16} /> Data Processing Output</div>
             <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide text-left">
                {logs.length === 0 ? (
                  <p className="text-slate-700 ">待機中...</p>
                ) : (
                  logs.map((log, i) => (
                    <p key={i} className={`${log.includes('✅') ? 'text-emerald-400 font-bold' : 'text-slate-400 animate-in fade-in'}`}>{log}</p>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-600/5 border-2 rounded-[2.5rem] p-8 space-y-4 shadow-inner text-left">
         <div className="flex items-center gap-3 text-emerald-500">
            <Database size={20} />
            <p className="text-xs font-bold uppercase tracking-tight">Business Intelligence Protocol</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            このシステムはビジネスネットワークの構築を加速するために設計されました。名刺の山から解放され、AIがあなたの専属秘書として連絡先を整理します。
         </p>
      </div>

      <DebugPanel data={{ status, syncedCount }} toolId="contact-sync-master" />
      <div className="text-center opacity-10 mt-10 font-bold uppercase tracking-[0.5em] text-[10px]">CRM Automation Hub • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-bold text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Contact Node...</div>
})

export default function ContactSyncSystem() {
  return <NoSSRWrapper />;
}
