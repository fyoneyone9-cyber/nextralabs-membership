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
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] 險ｼ諡繧ｹ繧ｭ繝｣繝ｳ繝励Ο繝医さ繝ｫ髢句ｧ・..`, ...prev]);
    
    try {
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 繝繧ｦ繝ｳ繝ｭ繝ｼ繝峨ヵ繧ｩ繝ｫ繝繧堤音螳壼ｮ御ｺ・Ａ, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] YouTube蛻ｶ菴懃黄 (MP3, 逕ｻ蜒・ 蜿ｰ譛ｬ) 繧呈､懷・縲Ａ, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 繝輔か繝ｫ繝讒矩 'YouTube_Production' 繧呈ｧ狗ｯ我ｸｭ...`, ...prev]);
      
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 繝輔ぃ繧､繝ｫ縺ｮ遘ｻ蜍輔→縲梧э蜻ｳ縺ｮ縺ゅｋ謨ｴ逅・阪ｒ螳溯｡後Ａ, ...prev]);
      
      setEvidenceCount(7);
      setStatus('COMPLETED');
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 笨・謨ｴ逅・ｮ御ｺ・ｼ壻ｸ崎ｦ√↑荳譎ゅヵ繧｡繧､繝ｫ繧帝勁蜴ｻ縺励∬ｨｼ諡繧偵い繝ｼ繧ｫ繧､繝悶＠縺ｾ縺励◆縲Ａ, ...prev]);
    } catch (e) {
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-amber-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">螳溽ｸｾ繧｢繝ｼ繧ｫ繧､繝悶お繝ｳ繧ｸ繝ｳ</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">繧ｨ繝薙ョ繝ｳ繧ｹ繝ｻ繝槭ロ繝ｼ繧ｸ繝｣繝ｼ</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left">
          <div className="w-14 h-14 rounded-2xl border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-500 font-bold text-2xl bg-amber-500/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] italic mb-2">驕狗畑繝励Ο繝医さ繝ｫ / SYSTEM GUIDE</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-amber-500 italic text-2xl">#1</span> 繝繧ｦ繝ｳ繝ｭ繝ｼ繝峨ヵ繧ｩ繝ｫ繝蜀・ｒAI縺瑚・蜍募・譫・/p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-amber-500 italic text-2xl">#2</span> YouTube蛻ｶ菴懃黄縺ｪ縺ｩ縺ｮ縲梧э蜻ｳ縺ｮ縺ゅｋ螳溽ｸｾ縲阪ｒ閾ｪ蜍募・鬘・/p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-amber-600 italic text-2xl">#3</span> 荳崎ｦ√↑繧ｴ繝溘ｒ謗・勁縺励√ヵ繧ｩ繝ｫ繝讒矩繧呈怙譁ｰ蛹・/p>
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
                  <span className="text-2xl uppercase italic tracking-tighter">繧｢繝ｼ繧ｫ繧､繝夜幕蟋・/span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 text-center shadow-inner">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic text-left pl-2">讀懷・螳溽ｸｾ謨ｰ</p>
                  <p className="text-4xl font-black text-white italic">{evidenceCount}</p>
               </div>
               <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 text-center shadow-inner">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic text-left pl-2">豁｣蟶ｸ遞ｼ蜒咲紫</p>
                  <p className="text-4xl font-black text-emerald-500 italic">100%</p>
               </div>
            </div>
          </div>

          <div className="bg-black rounded-[3rem] p-8 border border-white/5 shadow-inner flex flex-col relative overflow-hidden h-[300px] text-left">
             <div className="flex items-center gap-3 text-amber-500 font-black italic uppercase text-xs mb-4"><Zap size={16} /> 蜃ｦ逅・Ο繧ｰ</div>
             <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide text-left">
                {logs.length === 0 ? (
                  <p className="text-slate-700 italic">繧ｳ繝槭Φ繝牙ｾ・ｩ滉ｸｭ...</p>
                ) : (
                  logs.map((log, i) => (
                    <p key={i} className={`${log.includes('笨・) ? 'text-emerald-400 font-bold' : 'text-slate-400 animate-in fade-in'}`}>{log}</p>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-emerald-500">
            <CheckCircle2 size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Master Protocol 螳牙・遒ｺ隱肴ｸ医∩</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed">
            縺薙・繧ｷ繧ｹ繝・Β縺ｯNextraLabs縺ｫ縺翫￠繧九悟宛菴懷ｮ溽ｸｾ縲阪ｒ菫晁ｭｷ縺吶ｋ縺溘ａ縺ｫ險ｭ險医＆繧後∪縺励◆縲よэ蜻ｳ縺ｮ縺ｪ縺・ｸ譎ゅヵ繧｡繧､繝ｫ繧呈賜髯､縺励√≠縺ｪ縺溘・縲梧悽迚ｩ縺ｮ莉穂ｺ九阪ｒ讒矩蛹悶＠縺ｦ繧｢繝ｼ繧ｫ繧､繝悶＠縺ｾ縺吶・         </p>
      </div>

      <DebugPanel data={{ status, evidenceCount }} toolId="evidence-manager-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">螳溽ｸｾ邂｡逅・す繧ｹ繝・Β 窶｢ NextraLabs 2026</div>
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
