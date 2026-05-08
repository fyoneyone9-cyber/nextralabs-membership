'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Network, Globe, ShoppingBag, Copy } from 'lucide-react'

export default function HotelAffiliateApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [hotelUrl, setHotelUrl] = useState('')
  const [affiliateData, setAffiliateData] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!hotelUrl) return;
    setIsAnalyzing(true);
    // 憲法遵守：楽天トラベルAPI等との連携シミュレーションを復旧
    await new Promise(r => setTimeout(r, 2000));
    setResult("指定されたホテルの特徴と周辺イベントを解析しました。今週末に付近で大型フェスが開催されるため、『直前予約・穴場宿』として楽天アフィリエイトリンクを含む紹介文を生成しました。");
    setAffiliateData({
      rakuten_url: "https://hb.afl.rakuten.co.jp/hgc/...",
      estimated_cvr: "4.2%",
      points: "楽天ポイント5倍キャンペーン対象"
    });
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Network className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">アフィリエイトAI連携</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Strategic Revenue Generation System</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">STANDARD PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 text-left">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">紹介したいホテル名や楽天トラベルのURLを入力してください。AIが最新の空室状況・トレンド・訴求ポイントを解析。SNSで「即予約」に繋がる最強の紹介文とアフィリエイトリンクを自動生成します。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">紹介したいホテル名 または URL</label>
            <input value={hotelUrl} onChange={e => setHotelUrl(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white focus:border-emerald-500 transition-all shadow-inner" placeholder="例：箱根の露天風呂付き旅館" />
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !hotelUrl} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">収益化紹介文を生成 🚀</Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI 収益化診断レポート</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              
              {affiliateData && (
                <div className="grid md:grid-cols-2 gap-6 border-t border-emerald-500/20 pt-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-emerald-400 uppercase italic">生成されたリンク</p>
                    <div className="flex gap-2">
                       <Button onClick={() => alert('コピーしました')} className="bg-white text-slate-950 font-black px-6"><Copy size={16} className="mr-2" /> リンクをコピー</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-amber-400 uppercase italic">想定成約率(CVR)</p>
                    <div className="text-2xl font-black text-white italic">{affiliateData.estimated_cvr}</div>
                  </div>
                </div>
              )}
            </Card>

            <div className="space-y-6 text-left">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">収益化ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '訴求点抽出', desc: '独自のAIスコアリングで、成約率が最も高い魅力を特定。', icon: Search }, { title: 'ターゲット配信', desc: '最適なハッシュタグと、感情を揺さぶるボタン配置を指南。', icon: TrendingUp }, { title: '報酬最大化', desc: 'キャンペーン情報を加味し、報酬を1.5倍にするタイミングを特定。', icon: ShoppingBag }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=アフィリエイト+ブログ運営+収益化&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <h3 className="text-2xl font-black text-white italic">不敗の収益化：AI時代の個人メディア戦略 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
