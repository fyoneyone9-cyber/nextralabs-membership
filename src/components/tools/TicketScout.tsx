'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Search, Ticket, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Calendar, MapPin, CheckCircle2, Loader2, LogIn, RefreshCw, XCircle
} from 'lucide-react'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events'

export default function TicketScout() {
  const [artistName, setArtistName] = useState('');
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    if (token) { setGoogleToken(token); window.history.replaceState(null, '', window.location.pathname); }
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

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!artistName) return;
    setLoading(true);
    setAiAdvice(null);
    try {
      // プレイガイド情報の検索
      const res = await fetch('/api/ticket-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist: artistName, accessToken: googleToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API Error');
      setResults(data.events || []);

      // AIによる独自の情報収集とアドバイス生成
      const adviceRes = await fetch('/api/tools/gsk-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: `${artistName} チケット 発売日 先行 リセール 2026`,
          instructions: "チケット購入の必勝法やリセール情報を、200文字程度の熱量の高いアドバイスとして出力してください。"
        }),
      });
      const adviceData = await adviceRes.json();
      setAiAdvice(adviceData.result);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">EVENT INTELLIGENCE ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Ticket Scout</h1>
      </div>

      {/* STEP 1: AUTH */}
      <Card className={`bg-slate-900 border-4 transition-all ${googleToken ? 'border-indigo-500/50 shadow-2xl' : 'border-slate-800'}`}>
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl ${googleToken ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
              <Calendar className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-white italic uppercase tracking-tighter">{googleToken ? 'Google Calendar Connected' : 'Google カレンダー連携'}</p>
              <p className="text-sm text-slate-500 font-bold">発売日を自動登録するためにログインしてください</p>
            </div>
          </div>
          {!googleToken && (
            <Button onClick={handleGoogleAuth} className="h-14 bg-white text-black hover:bg-slate-200 font-black px-10 rounded-2xl text-lg uppercase shadow-xl">Connect Google ↗</Button>
          )}
        </CardContent>
      </Card>

      {/* SEARCH SECTION */}
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl">
         <div className="space-y-10">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center gap-4"><Search className="text-indigo-500 w-10 h-10" /> アーティスト検索</h3>
              <p className="text-slate-500 font-bold italic">e+、ローチケ、ぴあ を一括検索します</p>
            </div>
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
               <input 
                 type="text" 
                 value={artistName} 
                 onChange={e => setArtistName(e.target.value)}
                 placeholder="例：米津玄師, King Gnu, YOASOBI..." 
                 className="flex-1 h-20 bg-slate-950 border-4 border-slate-800 rounded-3xl px-8 text-2xl text-white font-black italic focus:border-indigo-600 outline-none transition-all shadow-inner"
               />
               <Button onClick={handleSearch} disabled={loading || !artistName} className="h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 rounded-3xl text-2xl uppercase italic shadow-2xl group">
                 {loading ? <Loader2 className="animate-spin" /> : <><Search className="mr-2 group-hover:scale-110 transition-transform" /> Scout Now</>}
               </Button>
            </div>
         </div>
      </Card>

      {/* AI ADVICE PANEL */}
      {aiAdvice && (
        <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3rem] p-8 md:p-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sparkles className="w-40 h-40 text-emerald-500" />
          </div>
          <div className="relative z-10 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">AI Scout Intelligence</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">必勝スカウト・アドバイス</h3>
            <p className="text-slate-300 font-bold leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {aiAdvice}
            </p>
          </div>
        </Card>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3"><Ticket className="text-emerald-500" /> Detected Live Events</h3>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{results.length}件の公演を発見</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((event, i) => (
              <Card key={i} className="bg-slate-900 border-2 border-slate-800 p-8 rounded-[2.5rem] hover:border-indigo-500/50 transition-all shadow-xl">
                 <div className="space-y-4 text-left">
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest italic">{event.source || 'PLAYGUIDE'}</p>
                    <h4 className="text-xl font-black text-white leading-tight">{event.title}</h4>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-xs"><Calendar className="w-4 h-4" /> {event.date || '未定'}</div>
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-xs"><MapPin className="w-4 h-4" /> {event.venue || '未定'}</div>
                    </div>
                    <div className="pt-4 flex gap-2">
                       <Button variant="outline" className="flex-1 h-12 border-slate-800 text-slate-300 font-black text-xs uppercase" onClick={() => window.open(event.link, '_blank')}>Buy Tickets ↗</Button>
                       {googleToken && (
                         <Button className="bg-emerald-600 text-white font-black px-6 h-12 rounded-xl text-xs uppercase"><Calendar className="w-4 h-4 mr-1" /> Added</Button>
                       )}
                    </div>
                 </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
