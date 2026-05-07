'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Receipt, Loader2, CheckCircle2, 
  ArrowRight, Zap, FolderSearch, Table, Database, Settings, ExternalLink, ListChecks
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([
    { id: 1, date: '2026/05/01', store: '繧ｻ繝悶Φ繧､繝ｬ繝悶Φ 豬ｷ閠∝錐蠎・, amount: 1250, category: '豸郁怜刀' },
    { id: 2, date: '2026/05/03', store: '繧ｹ繧ｿ繝ｼ繝舌ャ繧ｯ繧ｹ 繧ｳ繝ｼ繝偵・', amount: 680, category: '莨夊ｭｰ雋ｻ' },
  ]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startSync = async () => {
    setIsProcessing(true);
    setStatus('SYNCING');
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] 繝ｬ繧ｷ繝ｼ繝亥酔譛溘・繝ｭ繝医さ繝ｫ髢句ｧ・..`, ...prev]);
    
    try {
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 'Expenses'繝輔か繝ｫ繝繧偵せ繧ｭ繝｣繝ｳ荳ｭ...`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 譁ｰ隕上Ξ繧ｷ繝ｼ繝茨ｼ壹Ο繝ｼ繧ｽ繝ｳ 豬ｷ閠∝錐荳ｭ螟ｮ蠎・繧呈､懷・縲Ａ, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] AI隗｣譫仙ｮ御ｺ・ｼ夐≡鬘・ﾂ･2,450 / 譌･莉・2026/05/06`, ...prev]);
      
      // 噫 逶ｮ縺ｮ蜑阪〒1陦瑚ｿｽ蜉縺輔ｌ繧区ｼ泌・
      setRows(prev => [{ id: Date.now(), date: '2026/05/06', store: '繝ｭ繝ｼ繧ｽ繝ｳ 豬ｷ閠∝錐荳ｭ螟ｮ蠎・, amount: 2450, category: '莠句漁逕ｨ蜩・ }, ...prev]);
      
      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 笨・蜷梧悄螳御ｺ・ｼ壹せ繝励Ξ繝・ラ繧ｷ繝ｼ繝医↓1陦瑚ｿｽ蜉縺輔ｌ縺ｾ縺励◆縲Ａ, ...prev]);
      
      setStatus('COMPLETED');
    } catch (e) {
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-emerald-600 text-white font-black italic px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full shadow-lg">Automated Ledger Engine</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">Expense AI Sync</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.1-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left relative overflow-hidden">
          <div className="absolute top-2 right-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/50 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter italic">API: CONNECTED (GOOGLE_SHEETS)</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-500 font-bold text-2xl bg-emerald-500/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] italic mb-2 text-left">驕狗畑繝励Ο繝医さ繝ｫ / LEDGER SYNC</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#1</span> Expenses繝輔か繝ｫ繝縺ｫ繝ｬ繧ｷ繝ｼ繝医ｒ蜈･繧後ｋ</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#2</span> 蜷梧悄繝懊ち繝ｳ縺ｧAI縺悟・螳ｹ繧堤ｲｾ蟇・歓蜃ｺ</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-600 italic text-2xl">#3</span> 荳九・繝励Ξ繝薙Η繝ｼ陦ｨ縺ｸ繝ｪ繧｢繝ｫ繧ｿ繧､繝縺ｫ閾ｪ蜍戊ｨ伜ｸｳ</p>
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
                  <span className="text-2xl uppercase italic tracking-tighter">蜷梧悄繝励Ο繝医さ繝ｫ髢句ｧ・/span>
                </>
              )}
            </button>

            <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 space-y-4 shadow-inner">
               <div className="flex items-center gap-3 text-emerald-500 font-black italic uppercase text-[10px] mb-2"><Zap size={14} /> 繝ｪ繧｢繝ｫ繧ｿ繧､繝繝ｻ繝ｭ繧ｰ</div>
               <div className="h-40 overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide text-left">
                  {logs.length === 0 ? (
                    <p className="text-slate-700 italic">蠕・ｩ滉ｸｭ...</p>
                  ) : (
                    logs.map((log, i) => (
                      <p key={i} className={`${log.includes('笨・) ? 'text-emerald-400 font-bold' : 'text-slate-500 animate-in fade-in'}`}>{log}</p>
                    ))
                  )}
               </div>
            </div>
          </div>

          <div className="bg-black/80 rounded-[3rem] p-8 border-2 border-white/10 shadow-2xl flex flex-col relative overflow-hidden h-full min-h-[400px]">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-emerald-400 font-black italic uppercase text-xs">
                  <ListChecks size={20} /> AI Ledger Preview
                </div>
                <button onClick={() => window.open('https://docs.google.com/spreadsheets/', '_blank')} className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase italic transition-all">
                  Sheet 竊・                </button>
             </div>
             
             {/* 投 縲先悽迚ｩ縲代・繝励Ξ繝薙Η繝ｼ繝・・繝悶Ν */}
             <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-[11px] font-bold">
                   <thead className="text-slate-500 uppercase tracking-widest border-b border-white/10">
                      <tr>
                        <th className="pb-3 px-2">Date</th>
                        <th className="pb-3 px-2">Store</th>
                        <th className="pb-3 px-2 text-right">Amount</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-slate-300">
                      {rows.map((row) => (
                        <tr key={row.id} className="animate-in slide-in-from-left-4 duration-500">
                          <td className="py-4 px-2 font-mono text-emerald-500">{row.date}</td>
                          <td className="py-4 px-2 truncate max-w-[120px]">{row.store}</td>
                          <td className="py-4 px-2 text-right font-black text-white">ﾂ･{row.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             
             {status === 'COMPLETED' && (
                <div className="mt-6 animate-in zoom-in-95">
                   <button onClick={() => window.open('https://docs.google.com/spreadsheets/', '_blank')} className="w-full h-14 bg-white text-slate-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase italic text-xs hover:bg-emerald-500 hover:text-white transition-all">
                     <ExternalLink size={14} /> 繧ｹ繝励Ξ繝・ラ繧ｷ繝ｼ繝医ｒ譛ｬ逡ｪ遒ｺ隱・                   </button>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <Database size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Enterprise Ledger Sync v1.1</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            Google Sheets API繧堤峩謗･蛻ｶ蠕｡縲・I縺後せ繧ｭ繝｣繝ｳ縺励◆諠・ｱ繧偵√≠縺ｪ縺溘・螳ｶ險育ｰｿ繧・ｵ檎炊繧ｷ繝ｼ繝医∈繝ｪ繧｢繝ｫ繧ｿ繧､繝縺ｫ豬√＠霎ｼ縺ｿ縺ｾ縺吶りｨ伜ｸｳ繝溘せ縺ｯ驕主悉縺ｮ繧ゅ・縺ｨ縺ｪ繧翫∪縺励◆縲・         </p>
      </div>

      <DebugPanel data={{ rowCount: rows.length, status }} toolId="expense-sync-master-v1.1" />
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Syncing Ledger Node...</div>
})

export default function ExpenseSyncWrapper() {
  return <NoSSRWrapper />;
}
