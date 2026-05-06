'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  PenTool, Send, CheckCircle2, Loader2, Copy, Sparkles, Activity, FileText, Globe, RefreshCw, BarChart3, Terminal, X, ExternalLink, Activity as ActivityIcon
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MASTER_TOOLS = [
  { id: 'ai-select-shop', name: 'AIセレクトショップ', desc: 'トレンド分析×在庫ゼロ出品OS' },
  { id: 'youtube-producer', name: 'YouTubeプロデューサー', desc: '最新ニュースからの全自動動画制作' },
  { id: 'scam-defender', name: 'AI詐欺ディフェンダー', desc: 'リアルタイム犯罪手口スキャナー' },
  { id: 'inbox-organizer', name: 'Inbox Zero', desc: 'Gmail自動仕分け×AI高速返信' }
];

export default function NotePRSystem() {
  const [selectedTool, setSelectedTool] = useState(MASTER_TOOLS[0]);
  const [updateNote, setUpdateInfo] = useState('メガ・シャッフルモデルへの進化と、GoogleトレンドAPIの完全連携。');
  const [article, setArticle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [noteUrl, setNoteUrl] = useState('');
  const [status, setStatus] = useState('IDLE');

  const generateArticle = async () => {
    setIsGenerating(true);
    setStatus('GENERATING');
    try {
      const res = await fetch('/api/tools/note-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toolName: selectedTool.name, 
          toolDescription: selectedTool.desc,
          updateInfo: updateNote 
        }),
      });
      const data = await res.json();
      setArticle(data.article);
      setStatus('READY_TO_UPLOAD');
    } catch (e) { setStatus('ERROR'); } finally { setIsGenerating(false); }
  };

  const markAsUploaded = async () => {
    if (!noteUrl) return alert('noteの公開URLを入力してください');
    setIsUploading(true);
    try {
      const res = await fetch('/api/tools/note-uploader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: selectedTool.id, noteUrl }),
      });
      if (res.ok) {
        setStatus('UPLOADED');
        alert('ステータスを「アップロード済み」に更新しました。');
      }
    } catch (e) { alert('更新失敗'); } finally { setIsUploading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-emerald-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">Nextra PR Command v1.0-MASTER</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl leading-none">Note PR System</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
        
        {/* 🛠️ LEFT: SOURCE SELECTION */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden h-fit">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-emerald-500 font-black italic tracking-widest text-xs uppercase">
                  <ActivityIcon size={16} className="animate-pulse" /> Content Engine
                </div>
                <Badge variant="outline" className={`text-[10px] font-black italic uppercase ${status === 'UPLOADED' ? 'border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-500'}`}>
                  {status}
                </Badge>
             </div>
             
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Target Master Tool</p>
                <div className="grid grid-cols-1 gap-2">
                   {MASTER_TOOLS.map(t => (
                     <button key={t.id} onClick={() => setSelectedTool(t)} className={`py-4 px-6 rounded-2xl font-black text-xs text-left transition-all border-2 ${selectedTool.id === t.id ? 'bg-emerald-600 border-white text-white shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'}`}>
                        {t.name}
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4 pt-6 border-t border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Update Notes</p>
                <textarea value={updateNote} onChange={(e) => setUpdateInfo(e.target.value)} className="w-full h-32 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:border-emerald-500 outline-none shadow-inner" />
             </div>

             <Button onClick={generateArticle} disabled={isGenerating} className="w-full h-20 bg-white text-black hover:bg-emerald-600 hover:text-white font-black text-xl rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 italic">
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 記事を自動錬成
             </Button>
          </Card>
        </div>

        {/* 📝 CENTER: ARTICLE EDITOR */}
        <div className="lg:col-span-2 space-y-8 h-full">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[750px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                    <FileText className="text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Draft Editor</h3>
               </div>
               <div className="flex gap-2">
                 <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(article); setStatus('COPIED'); setTimeout(()=>setStatus('READY_TO_UPLOAD'), 2000); }} className="text-slate-500 hover:text-white"><Copy size={20}/></Button>
                 <Button variant="ghost" onClick={() => window.open('https://note.com/', '_blank')} className="text-slate-500 hover:text-emerald-400"><ExternalLink size={20}/></Button>
               </div>
            </div>

            <textarea 
              value={article} 
              onChange={(e) => setArticle(e.target.value)} 
              placeholder="ここにAIが作成したPR記事が出力されます..." 
              className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-base text-slate-300 focus:border-emerald-500 outline-none font-mono leading-relaxed shadow-inner italic" 
            />

            {article && (
              <div className="mt-8 pt-8 border-t border-slate-800 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full space-y-3">
                       <div className="flex items-center gap-2 px-4">
                          <Globe size={14} className="text-slate-500" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Note URL</p>
                       </div>
                       <Input value={noteUrl} onChange={(e) => setNoteUrl(e.target.value)} placeholder="https://note.com/nextralabs/n/..." className="h-16 bg-black border-2 border-slate-800 rounded-2xl px-6 text-emerald-400 font-bold focus:border-emerald-500" />
                    </div>
                    <Button onClick={markAsUploaded} disabled={isUploading || !noteUrl} className="h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.3)] group transition-all">
                       {isUploading ? <Loader2 className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                       <span className="italic uppercase">Archive Post</span>
                    </Button>
                 </div>
                 <div className="text-center opacity-30 italic text-[10px] uppercase tracking-widest">Post-Sync Protocol: All memories updated on confirm.</div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <DebugPanel data={{ status, selectedTool, noteUrl, articleLength: article.length }} toolId="note-pr-system" />
      <div className="text-center opacity-20 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">PR Management Engine • NextraLabs 2026</div>
    </div>
  )
}
