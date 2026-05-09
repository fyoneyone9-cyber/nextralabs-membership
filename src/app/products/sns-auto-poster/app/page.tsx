'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Loader2, 
  CheckCircle2, 
  TrendingUp, 
  Info, 
  Share2, 
  Clock, 
  Copy, 
  ChevronRight,
  Sparkles,
  AlertCircle,
  Twitter,
  Instagram,
  Flame
} from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'

export default function SnsAutoPosterApp() {
  const [topic, setTopic] = useState('')
  const [targetSns, setTargetSns] = useState<'X' | 'Instagram'>('X')
  const [isGenerating, setIsGenerating] = useState(false)
  const [trends, setTrends] = useState<string[]>([])
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null)
  const [result, setResult] = useState<{ content: string; strategy: string; bestTime: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // トレンド取得
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const r = await fetch('/api/tools/trend-stock', { cache: 'no-store' })
        const d = await r.json()
        if (d.items) {
          setTrends(d.items.map((item: any) => item.name))
        }
      } catch (e) {
        setTrends(['AI活用', '時短術', '最新ガジェット'])
      }
    }
    fetchTrends()
  }, [])

  const handleGenerate = async () => {
    if (!topic && !selectedTrend) {
      setError('テーマを入力するか、トレンドを選択してください。')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/tools/sns-auto-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || selectedTrend,
          sns: targetSns,
          trend: selectedTrend
        })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setResult(data)
    } catch (e: any) {
      setError('生成に失敗しました: ' + e.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('コピーしました！')
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      {/* ⚡ 憲法：MASTERMODEL最上位ロック */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-emerald-500 z-[9999] shadow-[0_0_30px_rgba(16,185,129,1)]"></div>

      <div className="max-w-6xl mx-auto space-y-12 border-t-[24px] border-x-8 border-b-8 border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.5)] rounded-[4rem] p-6 md:p-16 relative overflow-hidden bg-black/40 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-emerald-500/20 pb-12">
          <div className="flex items-center gap-6">
            <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Share2 className="h-12 w-12 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                AI SNS <span className="text-emerald-500">オートポスター</span>
              </h1>
              <p className="text-emerald-500 font-black text-sm uppercase italic tracking-[0.3em] mt-2">SOCIAL SYNC OS v1.0-MASTER</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Badge className="bg-emerald-500 text-slate-950 font-black italic px-8 py-3 text-lg rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)]">PREMIUM MASTER</Badge>
            <ApiLinkIndicator model="Gemini 1.5 Flash / Real-time Trend Engine" />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 flex items-center gap-4 text-red-500 font-black text-xl italic animate-in shake">
            <AlertCircle size={32} />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Input */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-2 bg-emerald-500 rounded-full"></div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">1. トレンドを選択</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {trends.map((t, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setSelectedTrend(t); setTopic(t); }} 
                    className={`p-6 rounded-2xl font-black italic text-left border-4 transition-all flex items-center justify-between group ${
                      selectedTrend === t 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105 shadow-[0_0_30px_rgba(52,211,153,0.3)]' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl truncate">{t}</span>
                    {selectedTrend === t ? <CheckCircle2 size={24} /> : <Flame size={20} className="text-emerald-500/30 group-hover:text-emerald-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t-2 border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-8 w-2 bg-emerald-500 rounded-full"></div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">2. ターゲットSNS</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: 'X', label: 'X (Twitter)', icon: Twitter, color: 'bg-white text-black' },
                  { id: 'Instagram', label: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white' }
                ].map((s: any) => (
                  <button 
                    key={s.id} 
                    onClick={() => setTargetSns(s.id)}
                    className={`p-6 rounded-3xl font-black italic text-xl border-4 transition-all flex items-center justify-center gap-3 ${
                      targetSns === s.id ? `${s.color} scale-105 shadow-xl` : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <s.icon size={28} /> {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t-2 border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-8 w-2 bg-emerald-500 rounded-full"></div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">3. カスタムテーマ</h3>
              </div>
              <textarea 
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setSelectedTrend(null); }}
                className="w-full h-40 bg-black/60 border-4 border-white/10 rounded-[2rem] p-8 font-bold text-white outline-none focus:border-emerald-500 transition-all text-2xl" 
                placeholder="独自のテーマを入力..." 
              />
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full h-32 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-4xl rounded-[3rem] shadow-[0_20px_50px_rgba(16,185,129,0.4)] uppercase italic group scale-105 active:scale-95 transition-all"
              >
                {isGenerating ? <Loader2 className="animate-spin h-16 w-16 mx-auto" /> : (
                  <span className="flex items-center gap-4">バズ投稿を錬成 <Zap className="h-10 w-10 fill-current animate-pulse" /></span>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="relative">
            {!result && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[3rem] p-12 text-center opacity-30">
                <Sparkles size={80} className="mb-6" />
                <p className="text-2xl font-black italic">生成ボタンを押して<br/>バズの魔法をかけましょう</p>
              </div>
            )}

            {isGenerating && (
              <div className="h-full flex flex-col items-center justify-center bg-emerald-500/5 border-4 border-emerald-500/20 rounded-[3rem] p-12 text-center animate-pulse">
                <Loader2 size={80} className="animate-spin text-emerald-500 mb-6" />
                <p className="text-3xl text-emerald-400 font-black italic">トレンドを解析中...</p>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <Card className="bg-emerald-500/5 border-4 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Zap size={200} /></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-black text-white italic uppercase flex items-center gap-4">
                      <TrendingUp className="text-emerald-400" /> 最適化済み投稿案
                    </h3>
                    <Button 
                      onClick={() => copyToClipboard(result.content)} 
                      className="h-14 px-8 bg-white text-slate-950 font-black rounded-2xl shadow-lg hover:bg-emerald-400 transition-all italic text-lg"
                    >
                      <Copy className="mr-2" /> コピー
                    </Button>
                  </div>

                  <div className="bg-black/60 rounded-[2rem] p-10 text-2xl text-white font-bold italic leading-relaxed border-2 border-white/5 shadow-inner min-h-[300px] whitespace-pre-wrap">
                    {result.content}
                  </div>

                  <div className="mt-10 grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Zap size={20} />
                        <span className="font-black italic text-sm uppercase">バズる理由</span>
                      </div>
                      <p className="text-sm font-bold text-slate-300 italic leading-relaxed">{result.strategy}</p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4 text-center flex flex-col justify-center">
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <Clock size={20} />
                        <span className="font-black italic text-sm uppercase">推奨投稿時間</span>
                      </div>
                      <p className="text-3xl font-black text-white italic">{result.bestTime}</p>
                    </div>
                  </div>
                </Card>

                {/* Final Roadmap */}
                <div className="pt-6 grid grid-cols-3 gap-4">
                  {[
                    { title: '即時投稿', icon: Share2 },
                    { title: '反響分析', icon: TrendingUp },
                    { title: '売上連動', icon: Zap }
                  ].map((s, i) => (
                    <div key={i} className="bg-[#13141f] border-2 border-white/10 p-6 rounded-[2rem] text-center space-y-3">
                      <s.icon className="mx-auto text-emerald-500/50" />
                      <p className="text-xs font-black text-white italic">{s.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t-2 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[12px] font-black italic uppercase tracking-[0.4em] text-white/20">
          <p>© 2026 NextraLabs Viral Content OS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-emerald-500 transition-colors">利用規約</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">ステータス</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">サポート</a>
          </div>
        </div>
      </div>
    </div>
  )
}
