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
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507]">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Scouting System Active</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          Ticket <span className="text-emerald-500">Scout</span>
        </h1>
        <p className="text-slate-500 font-bold italic tracking-widest uppercase text-xs md:text-sm">MasterModel Intelligence Engine</p>
      </div>

      {/* STEP 1: AUTH */}
      <div className="max-w-4xl mx-auto relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r ${googleToken ? 'from-emerald-500 to-cyan-500' : 'from-slate-800 to-slate-900'} rounded-[2.5rem] blur opacity-25 transition duration-1000`}></div>
        <Card className={`relative bg-[#0a0a0f] border-2 transition-all rounded-[2rem] overflow-hidden ${googleToken ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-white/5'}`}>
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 ${googleToken ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-700'}`}>
                {googleToken ? <CheckCircle2 className="w-10 h-10" /> : <Calendar className="w-10 h-10" />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {googleToken ? 'Sync Established' : 'Google Sync'}
                  </h4>
                  {googleToken && <Badge className="bg-emerald-500 text-slate-950 font-black text-[8px] px-2 py-0">CONNECTED</Badge>}
                </div>
                <p className="text-sm text-slate-500 font-medium">発売・リセール情報をカレンダーに自動同期</p>
              </div>
            </div>
            {!googleToken && (
              <Button onClick={handleGoogleAuth} className="h-16 bg-white text-slate-950 hover:bg-slate-200 font-black px-12 rounded-2xl text-lg uppercase shadow-2xl transition-transform hover:scale-105">
                Connect Google ↗
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SEARCH SECTION */}
      <div className="max-w-5xl mx-auto">
        <div className="relative p-1 bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/20 rounded-[3.5rem]">
          <Card className="bg-[#0a0a0f] border-2 border-emerald-500/10 rounded-[3.4rem] p-10 md:p-20 shadow-inner">
             <div className="space-y-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <Search className="text-emerald-500 w-10 h-10" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Target Artist Scout</h3>
                  <p className="text-slate-500 font-bold italic tracking-widest text-xs uppercase">e+, Lawson, Pia - Multidimensional Search</p>
                </div>
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 relative">
                   <div className="relative flex-1">
                     <input 
                       type="text" 
                       value={artistName} 
                       onChange={e => setArtistName(e.target.value)}
                       placeholder="Enter Artist Name..." 
                       className="w-full h-24 bg-black border-4 border-white/5 rounded-[2rem] px-10 text-3xl text-white font-black italic placeholder:text-slate-800 focus:border-emerald-500 outline-none transition-all shadow-2xl"
                     />
                     <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                       <Bot className="w-10 h-10 text-emerald-500" />
                     </div>
                   </div>
                   <Button 
                    onClick={handleSearch} 
                    disabled={loading || !artistName} 
                    className="h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-12 rounded-[2rem] text-2xl uppercase italic shadow-[0_0_40px_rgba(16,185,129,0.4)] group transition-all active:scale-95"
                   >
                     {loading ? <RefreshCw className="animate-spin w-8 h-8" /> : <span className="flex items-center gap-3">Scout <ArrowRight className="group-hover:translate-x-2 transition-transform" /></span>}
                   </Button>
                </div>
             </div>
          </Card>
        </div>
      </div>

      {/* AI ADVICE PANEL (MONITORING) */}
      {aiAdvice && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-10 -right-10 opacity-5">
              <Sparkles className="w-64 h-64 text-emerald-500" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Intelligence Monitor</h3>
                </div>
                <Badge className="bg-emerald-500 text-slate-950 font-black border-none text-[10px]">ANALYSIS COMPLETE</Badge>
              </div>
              <div className="p-6 bg-black/40 rounded-2xl border border-emerald-500/20">
                <p className="text-emerald-400 font-bold leading-relaxed text-sm md:text-lg italic whitespace-pre-wrap">
                  {aiAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-8 pt-10">
          <div className="flex items-center justify-between px-6">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
              <div className="w-2 h-8 bg-emerald-500"></div> Target Detected
            </h3>
            <Badge className="bg-white/5 text-slate-500 border-white/10 font-black px-4 py-1">{results.length} EVENTS</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.map((event, i) => (
              <Card key={i} className="bg-[#0a0a0f] border-2 border-white/5 p-10 rounded-[3rem] hover:border-emerald-500/40 transition-all group relative overflow-hidden">
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Ticket className="w-32 h-32 text-emerald-500" />
                 </div>
                 <div className="relative z-10 space-y-6 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] italic">{event.source || 'Verified Source'}</span>
                      <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h4 className="text-2xl font-black text-white leading-tight tracking-tight uppercase italic">{event.title}</h4>
                    <div className="space-y-3 pt-6 border-t border-white/5">
                       <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                         <Calendar className="w-5 h-5 text-emerald-500" /> {event.date || 'To Be Announced'}
                       </div>
                       <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                         <MapPin className="w-5 h-5 text-emerald-500" /> {event.venue || 'TBA'}
                       </div>
                    </div>
                    <div className="pt-6 flex gap-3">
                       <Button variant="outline" className="flex-1 h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl" onClick={() => window.open(event.link, '_blank')}>
                         Official Site ↗
                       </Button>
                       {googleToken && (
                         <Button className="bg-emerald-600 text-slate-950 font-black px-8 h-14 rounded-2xl text-xs uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                           <CheckCircle2 className="w-4 h-4 mr-2" /> Sync-ed
                         </Button>
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
