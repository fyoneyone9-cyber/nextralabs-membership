'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Scale, Search, Loader2, ShoppingCart, Zap, TrendingUp, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react'

const MasterEngine = () => {
  const [query, setQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetch('/api/trends').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setTrends(d.slice(0, 8))
      else if (d.trends) setTrends(d.trends.slice(0, 8))
    }).catch(() => {})
  }, [])

  const runAnalysis = async (searchWord?: string) => {
    const word = searchWord || query
    if (!word) return
    setQuery(word)
    setIsAnalyzing(true)
    setResult(null)
    try {
      const res = await fetch('/api/tools/buy-smart-nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: word })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || '解析に失敗しました')
      setResult(data)
    } catch (e: any) {
      setResult({ error: e.message || '価格の取得に失敗しました。' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 min-h-screen text-slate-200 bg-[#050507] border-2 border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.08)]">

      {/* ヘッダー */}
      <div className="text-center space-y-2 pt-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-4 py-1 rounded-full">中古・新品 価格比較</Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          AI<span className="text-emerald-400">比較</span>ナビ
        </h1>
        <p className="text-slate-400 text-sm">楽天APIからリアルタイム相場を取得。Gemini AIが「本当の損得」を判定します。</p>
      </div>

      {/* 検索エリア */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 md:p-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAnalysis()}
            placeholder="商品名や型番を入力（例：iPhone 15、MacBook Pro）"
            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          onClick={() => runAnalysis()}
          disabled={isAnalyzing || !query}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all"
        >
          {isAnalyzing
            ? <><Loader2 className="animate-spin" size={16} /> AI解析中...</>
            : <>市場価格をAIで解析する <ArrowRight size={16} /></>
          }
        </button>

        {/* トレンドキーワード */}
        {!result && !isAnalyzing && trends.length > 0 && (
          <div className="pt-3 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-slate-500" />
              <p className="text-[10px] font-semibold text-slate-500">トレンド</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {trends.map((t, i) => (
                <button
                  key={i}
                  onClick={() => runAnalysis(t.name || t.title || t)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all"
                >
                  {t.name || t.title || t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 解析結果 */}
      {(result || isAnalyzing) && (
        <div className="grid md:grid-cols-3 gap-4 animate-in fade-in duration-500">

          {/* 価格データ */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={14} className="text-emerald-400" />
                <p className="text-xs font-semibold text-white">市場データ</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 space-y-1">
                  <Badge className="bg-emerald-500/10 text-blue-300 border border-emerald-500/20 text-[9px] font-semibold">新品最安値</Badge>
                  <p className="text-2xl font-bold text-white">
                    {result?.data?.minPrice ? `¥${result.data.minPrice.toLocaleString()}` : isAnalyzing ? '---' : 'データなし'}
                  </p>
                </div>
                <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 space-y-1">
                  <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px] font-semibold">中古相場</Badge>
                  <p className="text-2xl font-bold text-white">
                    {result?.data?.avgPrice ? `¥${result.data.avgPrice.toLocaleString()}` : isAnalyzing ? '---' : 'データなし'}
                  </p>
                </div>
              </div>

              {/* 商品リスト */}
              {result?.data?.items && result.data.items.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {result.data.items.map((item: any, i: number) => (
                    <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/3 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all group">
                      <img src={item.img} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">{item.name}</p>
                        <p className="text-sm font-bold text-emerald-400">¥{item.price.toLocaleString()}</p>
                      </div>
                      <ArrowRight size={13} className="text-slate-600 group-hover:text-emerald-400 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI判定 */}
          <div className="md:col-span-1">
            <div className={`h-full bg-[#0d0f1a] border rounded-2xl p-5 space-y-4 flex flex-col ${
              result?.verdict === 'new' ? 'border-emerald-500/40' :
              result?.verdict === 'used' ? 'border-emerald-500/40' :
              'border-white/5'
            }`}>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-emerald-400" />
                <p className="text-xs font-semibold text-white">AI判定</p>
              </div>

              {isAnalyzing ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 size={24} className="text-emerald-400 animate-spin" />
                </div>
              ) : result?.error ? (
                <p className="text-xs text-red-400">{result.error}</p>
              ) : result ? (
                <>
                  <div className={`text-center p-4 rounded-xl ${
                    result.verdict === 'new' ? 'bg-emerald-500/10' :
                    result.verdict === 'used' ? 'bg-emerald-500/10' : 'bg-white/5'
                  }`}>
                    <p className="text-2xl font-bold text-white mb-1">{result.status || '判定中'}</p>
                    <Badge className={`text-[9px] font-semibold ${
                      result.verdict === 'new' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                    } border`}>{result.verdict === 'new' ? '新品推奨' : result.verdict === 'used' ? '中古推奨' : '検討中'}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed flex-1">
                    {result.reason || '判定理由がありません'}
                  </p>
                  <button
                    onClick={() => window.open(`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(query)}`, '_blank')}
                    className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                    <ShoppingCart size={13} /> 楽天市場で探す
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 注意事項 */}
      <div className="p-4 border border-white/5 rounded-xl bg-black/20">
        <div className="flex items-center gap-2 text-slate-600 mb-2">
          <AlertTriangle size={12} />
          <span className="text-[10px] font-semibold text-slate-600">注意事項</span>
        </div>
        <p className="text-[10px] text-slate-700 leading-relaxed">
          ※本解析結果は楽天APIの公開データに基づくAIの推論であり、将来の価格変動や在庫・品質を保証するものではありません。実際の購入に際しては楽天ポイントの付与率・送料・販売店の評価を必ずご確認ください。本ツールはアフィリエイト連携を含みます。
        </p>
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false })
export default function BuySmartPage() { return <NoSSR /> }
