'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Mail, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Inbox, Send, ListChecks, Filter, CheckCircle2, Loader2, LogIn, Trash2, AlertCircle, Clock
} from 'lucide-react'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify'

export default function InboxOrganizer() {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    if (token) { setGoogleToken(token); window.history.replaceState(null, '', window.location.pathname); fetchEmails(token); }
  }, []);

  const handleGoogleAuth = useCallback(() => {
    setAuthLoading(true)
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.href.split('?')[0].split('#')[0],
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }, []);

  const fetchEmails = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tools/gmail-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      });
      const data = await res.json();
      setEmails(data.messages || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-6 py-2 text-xs uppercase rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)]">GMAIL AI ACCELERATOR</Badge>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Inbox Zero</h1>
      </div>

      {!googleToken ? (
        <Card className="bg-slate-900 border-4 border-blue-600/30 rounded-[4rem] p-20 text-center space-y-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8">
           <div className="w-32 h-32 bg-blue-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(37,99,235,0.5)] animate-pulse">
              <Mail className="w-16 h-16 text-white" />
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Accelerate Your Workflow</h2>
              <p className="text-slate-500 font-bold text-lg max-w-md mx-auto leading-relaxed italic">GmailをAIと直結。重要度の自動分類と、返信ドラフトの自動生成を開始しましょう。</p>
           </div>
           <Button onClick={handleGoogleAuth} className="h-24 bg-white text-black hover:bg-blue-600 hover:text-white font-black px-16 rounded-[2.5rem] text-3xl uppercase italic shadow-2xl transition-all">
              Connect Gmail ↗
           </Button>
        </Card>
      ) : (
        <div className="space-y-12">
          {/* 🔴 SACRED 4-QUADRANT MATRIX UI */}
          <div className="grid md:grid-cols-2 gap-8">
             {[
               { id: 'urgent_important', label: '🔥 今すぐ対応', color: 'border-red-600 bg-red-600/5', icon: Zap },
               { id: 'urgent_not_important', label: '⚡ 早めに対応', color: 'border-amber-500 bg-amber-500/5', icon: Clock },
               { id: 'not_urgent_important', label: '📌 計画して対応', color: 'border-blue-500 bg-blue-500/5', icon: ListChecks },
               { id: 'not_urgent_not_important', label: '📂 後回し/ゴミ箱', color: 'border-slate-700 bg-slate-900/50', icon: Filter },
             ].map(quad => (
               <Card key={quad.id} className={`border-4 rounded-[3rem] p-8 shadow-2xl transition-all hover:scale-[1.02] ${quad.color}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3"><quad.icon /> {quad.label}</h3>
                    <Badge className="bg-white/10 text-white font-bold">{loading ? '...' : '0'} 件</Badge>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-6 h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10">
                     <p className="text-xs text-slate-600 font-black uppercase italic tracking-widest">Awaiting Analysis</p>
                  </div>
               </Card>
             ))}
          </div>

          <div className="text-center">
             <Button onClick={() => setGoogleToken(null)} variant="ghost" className="text-slate-600 hover:text-red-500 uppercase font-black italic underline tracking-widest text-xs">Disconnect Session</Button>
          </div>
        </div>
      )}
    </div>
  )
}
