'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, Send, Calendar, Loader2, Copy, FileText, Rocket, Zap, RotateCcw
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MASTER_TOOLS = [
  { id: 'staysee-ai-finder', name: 'Staysee AI Finder', desc: 'ホテルDX：AI忘れ物鑑定×PMS同期×保管証明書発行' },
  { id: 'inbox-organizer', name: 'Inbox Zero', desc: 'Gmail AI Accelerator：爆速返信案生成×下書き同期' },
  { id: 'ai-sidejob', name: 'AI SIDEJOB', desc: '適性診断×AI活用副業0→1ロードマップ' },
  { id: 'money-guard', name: 'Money Guard', desc: '家計防衛：カメラ解析×ドーパミン抑止警告' },
  { id: 'disaster-guard', name: 'Disaster Guard', desc: '防災：GPS現在地・天気連動型72時間生存戦略' },
  { id: 'ai-select-shop', name: 'AIセレクトショップ', desc: 'トレンド分析×在庫ゼロ出品OS' }
];

const MasterEngine = () => {
  const [selectedTool, setSelectedTool] = useState(MASTER_TOOLS[0]);
  const [updateNote, setUpdateNote] = useState('Staysee本物API連携成功。AI保管証明書（鑑定書）の自動発行機能、印刷レイアウト最適化、v3.1-MASTERへの昇格完了。');
  const [article, setArticle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [status, setStatus] = useState('IDLE');

  const generatePR = async () => {
    setIsGenerating(true);
    setStatus('GENERATING');
    try {
      const res = await fetch('/api/tools/pr-command/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toolName: selectedTool.name, 
          toolDescription: selectedTool.desc,
          updateInfo: updateNote,
          evidenceData: "Staysee API Connect 200 OK, AI Certificate PDF Sync Active, MASTERMODEL Finalized"
        }),
      });
      const data = await res.json();
      setArticle(data.article);
      setStatus('READY_TO_SCHEDULE');
    } catch (e) { setStatus('ERROR'); } finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-8 border-emerald-500/50 rounded-[4rem] my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-3">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg border border-white/20">Nextra PR-Command v2.0-MASTER</Badge>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">PR COMMAND</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
        
        {/* 🛠️ LEFT: MISSION CONTROL */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden h-fit">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-emerald-500 font-black italic tracking-widest text-xs uppercase">
                  <Rocket size={16} className="animate-bounce" /> Mission Launcher
                </div>
                <Badge className="bg-emerald-500 text-slate-950 font-black text-[8px] uppercase italic">Master Model</Badge>
             </div>
             
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Target Master Intelligence</p>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto scrollbar-hide p-1">
                   {MASTER_TOOLS.map(t => (
                     <button key={t.id} onClick={() => setSelectedTool(t)} className={`py-4 px-6 rounded-2xl font-black text-[10px] text-left transition-all border-2 ${selectedTool.id === t.id ? 'bg-emerald-600 border-white text-white shadow-lg' : 'bg-black border-white/5 text-slate-500'}`}>
                        {t.name}
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4 pt-6 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic text-emerald-500">Evidence Note (Updates)</p>
                <textarea value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} className="w-full h-32 bg-black border-2 border-white/5 rounded-2xl p-4 text-xs text-slate-300 focus:border-emerald-500 outline-none shadow-inner" />
             </div>

             <button onClick={generatePR} disabled={isGenerating} className="w-full h-20 bg-white text-black hover:bg-emerald-600 hover:text-white font-black text-xl rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 italic active:scale-95 border-b-4 border-slate-300 active:border-b-0">
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 記事を自動錬成
             </button>
          </Card>

          <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2rem] p-8 space-y-4 italic shadow-inner">
             <p className="text-emerald-500 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Master Protocol</p>
             <p className="text-slate-400 text-sm font-bold leading-relaxed">マスタ機の実績を「本物のPR」へと昇華。本日確定したMASTERMODELの価値を世界へ届けます。</p>
          </div>
        </div>

        {/* 📝 CENTER: DRAFT TERMINAL */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[850px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                    <FileText className="text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter text-left">Note Draft Feed</h3>
               </div>
               <button onClick={() => { navigator.clipboard.writeText(article); alert('コピーしました'); }} className="p-4 bg-white/5 rounded-xl text-slate-500 hover:text-emerald-500 transition-all"><Copy size={24}/></button>
            </div>

            <textarea 
              value={article} 
              onChange={(e) => setArticle(e.target.value)} 
              placeholder="生成ボタンを押すと、マスタモデルの実績に基づいたPR記事が出力されます..." 
              className="flex-1 bg-black border-2 border-white/5 rounded-[2.5rem] p-10 text-lg text-slate-200 focus:border-emerald-500 outline-none font-sans leading-loose shadow-inner italic" 
            />

            {article && (
              <div className="mt-8 pt-8 border-t border-white/5 space-y-6 animate-in slide-in-from-bottom-4">
                 <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full space-y-3">
                       <div className="flex items-center gap-2 px-4 text-slate-500">
                          <Calendar size={14} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Post Scheduling</p>
                       </div>
                       <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full h-16 bg-black border-2 border-white/5 rounded-2xl px-6 text-emerald-400 font-black focus:border-emerald-500" />
                    </div>
                    <button className="h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_50px_rgba(16,185,129,0.3)] group transition-all active:scale-95">
                       <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       <span className="italic uppercase tracking-widest font-black">Reserve Note Post</span>
                    </button>
                 </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <DebugPanel data={{ status, selectedTool, articleLength: article.length }} toolId="pr-command-system-master" />
      <div className="text-center opacity-20 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">NextraLabs MASTERMODEL PR Engine • 2026</div>
    </div>
  )
}

const NoSSRWrapper = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return <div className="min-h-screen bg-slate-950" />;
  return <MasterEngine />;
};

export default NoSSRWrapper;
