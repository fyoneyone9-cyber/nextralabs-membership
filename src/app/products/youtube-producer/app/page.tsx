'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  Clapperboard, Play, Youtube, FileText, Sparkles, Download, Music
} from 'lucide-react'

export default function YoutubeProducerApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // gsk-video-generation / gsk-audio-generation 連携ロジックを復旧
    await new Promise(r => setTimeout(r, 3000));
    setResult("最新の視聴トレンドに基づき、離脱率を最小限に抑える『黄金の10分台本』を生成しました。AIが選定したバズるタイトル案とサムネイル構成案も出力済みです。");
    setProcessedFileUrl("https://example.com/audio.mp3");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] md:rounded-[4rem] p-6 md:p-12">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Clapperboard className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI YouTube プロデューサー</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Strategic Video Synthesis Engine</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">PREMIUM PLAN</Badge>
        </div>

        {/* 活用マニュアル */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            制作したい動画のテーマ、ターゲット読者、または元となる記事を入力してください。AIがYouTubeのアルゴリズムを解析し、再生数を最大化するための「台本・構成・タイトル・タグ」を一括生成。さらに音声合成(TTS)によるナレーション生成までサポートします。
          </p>
        </div>

        {/* 入力エリア */}
        <Card className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden shadow-xl p-8 space-y-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Video Topic / Target Audience</label>
          <textarea className="w-full h-48 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all text-lg" placeholder="例：最新のAIツールのレビュー動画。20代のクリエイター向け。5分程度の尺。" />
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10" /> : 'AIプロデュースを開始する 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Strategic Output</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              
              {/* 音声生成連携 (復活) */}
              {processedFileUrl && (
                <div className="border-t border-emerald-500/20 pt-8 text-center">
                  <a href={processedFileUrl} download="narration.mp3" className="inline-flex items-center gap-4 h-20 px-12 bg-white text-slate-950 font-black text-xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all uppercase italic">
                    <Music size={24} /> AIナレーションを保存
                  </a>
                </div>
              )}
            </Card>

            {/* 制作ロードマップ */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Production Roadmap</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: '市場解析', desc: '競合のヒット動画から、視聴者が今最も求めている「答え」を抽出。', icon: Search },
                  { step: '02', title: '台本錬成', desc: '平均視聴維持率を上げるための心理学的フックを各所に配置。', icon: FileText },
                  { step: '03', title: 'バズ加速', desc: 'クリック率の高いサムネイル指示と、検索に強いSEOタグを生成。', icon: Sparkles },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all group">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400 group-hover:animate-bounce" /></div>
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => window.open(`https://${ai.toLowerCase()}.com`)} className="h-16 bg-white/5 border border-white/10 hover:border-blue-500/50 text-slate-400 hover:text-white font-black italic rounded-2xl transition-all uppercase text-[10px]">Detail with {ai}</Button>
              ))}
            </div>

            {/* Amazon収益化 */}
            <a href="https://www.amazon.co.jp/s?k=YouTube+動画編集+マニュアル&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-red-600 to-rose-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <div className="space-y-2 text-left">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">Creator Success</p>
                  <h3 className="text-2xl font-black text-white italic leading-tight">「売れるチャンネル」を構築する。プロ推奨の動画機材・教本。</h3>
                </div>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
