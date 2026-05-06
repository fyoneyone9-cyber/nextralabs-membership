'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Sparkles, Send, Calendar, ListChecks, Loader2, Copy, Activity, FileText, Globe, RefreshCw, BarChart3, Rocket, ShieldCheck, Zap, UserPlus
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'
import { AccessGate } from '@/components/tools/AccessGate'

const MASTER_TOOLS = [
  { id: 'ai-select-shop', name: 'AIセレクトショップ', desc: 'トレンド分析×在庫ゼロ出品OS' },
  { id: 'youtube-producer', name: 'YouTubeプロデューサー', desc: '最新ニュースからの全自動動画制作' },
  { id: 'scam-defender', name: 'AI詐欺ディフェンダー', desc: 'リアルタイム犯罪手口スキャナー' }
];

export default function PRCommandSystem() {
  const [selectedTool, setSelectedTool] = useState(MASTER_TOOLS[0]);
  const [updateNote, setUpdateNote] = useState('GoogleトレンドAPIの完全連携と、Shopify直接出品エンジンの安定化。');
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
          evidenceData: "API Connect 200 OK, Shopify Sync Active"
        }),
      });
      const data = await res.json();
      setArticle(data.article);
      setStatus('READY_TO_SCHEDULE');
    } catch (e) { setStatus('ERROR'); } finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">Nextra PR-Command v1.0-MASTER</Badge>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">PR COMMAND</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
        
        {/* 🛠️ LEFT: MISSION CONTROL */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden h-fit">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-blue-500 font-black italic tracking-widest text-xs uppercase">
                  <Rocket size={16} className="animate-bounce" /> Mission Launcher
                </div>
                <Badge className="bg-emerald-500 text-slate-950 font-black text-[8px] uppercase italic">Standard Plan</Badge>
             </div>
             
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Target Master Intelligence</p>
                <div className="grid grid-cols-1 gap-2">
                   {MASTER_TOOLS.map(t => (
                     <button key={t.id} onClick={() => setSelectedTool(t)} className={`py-4 px-6 rounded-2xl font-black text-xs text-left transition-all border-2 ${selectedTool.id === t.id ? 'bg-blue-600 border-white text-white shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500'}`}>
                        {t.name}
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4 pt-6 border-t border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Evidence Note</p>
                <textarea value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} className="w-full h-32 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:border-blue-500 outline-none shadow-inner" />
             </div>

             <Button onClick={generatePR} disabled={isGenerating} className="w-full h-20 bg-white text-black hover:bg-blue-600 hover:text-white font-black text-xl rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 italic active:scale-95">
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 記事を自動錬成
             </Button>
          </Card>

          <div className="bg-blue-600/5 border-2 border-blue-500/20 rounded-[2rem] p-8 space-y-4 italic shadow-inner">
             <p className="text-blue-500 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> System Protocol</p>
             <p className="text-slate-400 text-sm font-bold leading-relaxed">マスタ機の実績を「本物のPR」へと昇華。note記事生成から投稿予約まで、NextraLabsの声を世界に届けます。</p>
          </div>
        </div>

        {/* 📝 CENTER: DRAFT TERMINAL */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[750px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <FileText className="text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Draft Feed</h3>
               </div>
               <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(article); alert('コピーしました'); }} className="text-slate-500 hover:text-white"><Copy size={20}/></Button>
            </div>

            <textarea 
              value={article} 
              onChange={(e) => setArticle(e.target.value)} 
              placeholder="ここにAIが作成したPR記事が出erされます..." 
              className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-base text-slate-300 focus:border-blue-500 outline-none font-mono leading-relaxed shadow-inner italic" 
            />

            {article && (
              <div className="mt-8 pt-8 border-t border-slate-800 space-y-6 animate-in slide-in-from-bottom-4">
                 <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full space-y-3">
                       <div className="flex items-center gap-2 px-4 text-slate-500">
                          <Calendar size={14} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Post Scheduling</p>
                       </div>
                       <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="h-16 bg-black border-2 border-slate-800 rounded-2xl px-6 text-blue-400 font-black focus:border-blue-500" />
                    </div>
                    <Button className="h-16 bg-blue-600 hover:bg-blue-500 text-white font-black px-12 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.3)] group transition-all">
                       <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       <span className="italic uppercase tracking-widest">Schedule to note</span>
                    </Button>
                 </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <DebugPanel data={{ status, selectedTool, articleLength: article.length }} toolId="pr-command-system" />
      <div className="text-center opacity-20 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">Public Relations Engine • NextraLabs 2026</div>
    </div>
  )
}
