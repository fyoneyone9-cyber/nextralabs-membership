'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Youtube, ShoppingCart, Loader2, Layers,
  Shirt, ExternalLink, Zap, Play, Star, Search
} from 'lucide-react'

interface RakutenProduct {
  name: string
  price: string
  imageUrl: string | null
  itemUrl: string
  shopName: string
  reviewAverage: number
  reviewCount: number
}

interface SearchResult {
  keyword: string
  products: RakutenProduct[]
}

interface AnalysisResult {
  videoTitle: string
  thumbnailUrl: string
  detectedItems: string[]
  results: SearchResult[]
}

const MasterEngine = () => {
  const [videoUrl, setVideoUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const analyzeVideoFashion = async () => {
    if (!videoUrl) return
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setErrorMsg('')

    try {
      const res = await fetch('/api/tools/youtube-coordinator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl }),
      })
      const data = await res.json()
      if (data.success) {
        setAnalysisResult(data)
      } else {
        setErrorMsg(data.error || '解析に失敗しました')
      }
    } catch {
      setErrorMsg('通信エラーが発生しました。しばらくしてから再度お試しください。')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const totalProducts = analysisResult?.results.reduce((acc, r) => acc + r.products.length, 0) ?? 0

  const presets = [
    { label: '結婚相談所リアル体験談｜1年で成婚する秘訣', url: 'https://www.youtube.com/watch?v=-0SYREouHeg' },
    { label: 'マッチングアプリとの違いは？成婚の秘訣', url: 'https://www.youtube.com/watch?v=7-ydEP3vEEQ' },
    { label: '【成功率UP】仮交際・真剣交際・プロポーズ完全解説', url: 'https://www.youtube.com/watch?v=kSfsHNDyT-U' },
    { label: '結婚相談所で半年成婚した30代女性のリアル体験談', url: 'https://www.youtube.com/watch?v=_7Ze4HfPqHw' },
    { label: 'お見合い成功の注意点（女性編）', url: 'https://www.youtube.com/watch?v=dnGbuoc3XBs' },
  ]

  if (!isMounted) return null

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          YouTube Sync — Real Data
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          動画内のコーデを<span style={{ color: '#10b981' }}>楽天で即購入</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          YouTubeのURLを貼るだけ。Gemini AIが動画のサムネイルを解析し、楽天市場から実際の商品を検索します。
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-6">

        {/* 入力エリア */}
        <div
          style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.1)' }}
          className="rounded-xl p-6"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-4">
            <Youtube size={15} className="text-red-400" />
            YouTube動画URL
          </div>
          <div className="flex gap-3">
            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyzeVideoFashion()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
              style={{ background: '#13141f', border: '1px solid #334155' }}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = '#334155')}
            />
            <button
              onClick={analyzeVideoFashion}
              disabled={!videoUrl || isAnalyzing}
              className="h-11 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shrink-0"
              style={
                !videoUrl || isAnalyzing
                  ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                  : { background: '#10b981', color: '#fff' }
              }
            >
              {isAnalyzing
                ? <><Loader2 size={14} className="animate-spin" />解析中...</>
                : <><Search size={14} />解析する</>}
            </button>
          </div>

          {/* プリセット */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1e293b' }}>
            <p className="text-xs text-slate-500 mb-2 font-medium">📌 プリセット動画から選ぶ</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setVideoUrl(p.url)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: videoUrl === p.url ? 'rgba(16,185,129,0.15)' : '#13141f',
                    border: videoUrl === p.url ? '1px solid #10b981' : '1px solid #334155',
                    color: videoUrl === p.url ? '#34d399' : '#94a3b8',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="flex items-start gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #1e293b' }}>
            <Play size={13} style={{ color: '#10b981' }} className="shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Gemini AIがサムネイルを解析 → ファッションアイテムを特定 → 楽天市場から実在商品を検索
            </p>
          </div>
        </div>

        {/* エラー表示 */}
        {errorMsg && (
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ローディング */}
        {isAnalyzing && (
          <div
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            className="rounded-xl p-10 flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-300">Gemini AIが解析中...</p>
              <p className="text-xs text-slate-500">サムネイルからファッションを検出 → 楽天で商品検索</p>
            </div>
          </div>
        )}

        {/* 結果エリア */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-5">

            {/* 動画情報 + 検出アイテム */}
            <div
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              className="rounded-xl p-5 flex gap-4 items-start"
            >
              {/* サムネイル */}
              <img
                src={analysisResult.thumbnailUrl}
                alt={analysisResult.videoTitle}
                className="w-32 h-20 object-cover rounded-lg shrink-0"
                style={{ border: '1px solid #1e293b' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 leading-tight mb-2 line-clamp-2">
                  {analysisResult.videoTitle}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.detectedItems.map((item, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {totalProducts}件の楽天商品が見つかりました
                </p>
              </div>
            </div>

            {/* 楽天商品結果 */}
            {analysisResult.results.map((section, si) => (
              <div key={si}>
                {/* セクションヘッダー */}
                <div className="flex items-center gap-2 mb-3">
                  <Shirt size={13} style={{ color: '#10b981' }} />
                  <span className="text-xs font-semibold text-slate-400">{section.keyword}</span>
                  <span className="text-[10px] text-slate-600">— 楽天市場検索結果</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.products.map((product, pi) => (
                    <a
                      key={pi}
                      href={product.itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col rounded-xl overflow-hidden transition-all group"
                      style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
                    >
                      {/* 商品画像 */}
                      <div className="w-full h-36 overflow-hidden" style={{ background: '#13141f' }}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Shirt size={32} />
                          </div>
                        )}
                      </div>

                      {/* 商品情報 */}
                      <div className="p-3 space-y-2 flex-1 flex flex-col">
                        <p className="text-xs font-semibold text-slate-200 leading-tight line-clamp-2">
                          {product.name}
                        </p>

                        {/* レビュー */}
                        {product.reviewCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] text-slate-400">
                              {product.reviewAverage.toFixed(1)} ({product.reviewCount}件)
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-1">
                          <p className="text-sm font-bold" style={{ color: '#10b981' }}>
                            {product.price}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-600 max-w-[80px] truncate">{product.shopName}</span>
                            <ExternalLink size={10} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* 楽天まとめ検索ボタン */}
            <a
              href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(analysisResult.detectedItems.join(' '))}/?scid=af_pc_etc&sc2id=534e3725.64346793.534e3726.d5412af4`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: '#10b981', color: '#fff' }}
            >
              <ShoppingCart size={15} />
              楽天市場でもっと探す →
            </a>
          </div>
        )}

        {/* 空状態 + サンプル動画 */}
        {!analysisResult && !isAnalyzing && !errorMsg && (
          <div className="space-y-4">
            <div
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              className="rounded-xl p-10 flex flex-col items-center justify-center gap-3 opacity-40"
            >
              <Layers size={36} />
              <p className="text-sm text-center leading-relaxed">
                YouTubeのURLを貼り付けて<br />「解析する」を押してください
              </p>
            </div>

            {/* サンプル動画リンク */}
            <div style={{ background: '#0d1117', border: '1px solid #1e293b' }} className="rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <Play size={12} style={{ color: '#10b981' }} />
                試してみる — ファッション系 人気動画
              </p>
              <div className="space-y-2">
                {[
                  { label: 'GU 新作コーデ紹介 2024', url: 'https://www.youtube.com/results?search_query=GU+コーデ+2024' },
                  { label: 'ZARA・H&M プチプラコーデ', url: 'https://www.youtube.com/results?search_query=ZARA+H%26M+プチプラコーデ' },
                  { label: 'ユニクロ メンズコーデ', url: 'https://www.youtube.com/results?search_query=ユニクロ+メンズコーデ' },
                  { label: 'トレンドコーデ 春夏 2024', url: 'https://www.youtube.com/results?search_query=トレンドコーデ+春夏+2024' },
                ].map((item) => (
                  <button
                    key={item.url}
                    onClick={() => window.open(item.url, '_blank')}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-all group"
                    style={{ background: '#13141f', border: '1px solid #334155' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                  >
                    <div className="flex items-center gap-2">
                      <Youtube size={13} className="text-red-400 shrink-0" />
                      {item.label}
                    </div>
                    <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                ※ YouTubeで動画を見つけたら、そのURLをコピーして上の入力欄に貼り付けてください
              </p>
            </div>
          </div>
        )}

        {/* Style Intelligence */}
        <div
          className="rounded-xl p-5 flex gap-3"
          style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}
        >
          <Zap size={15} style={{ color: '#10b981' }} className="shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Gemini AI × 楽天市場APIによるリアルタイム解析。動画内のスタイルを検出し、今すぐ購入できる実在商品を楽天から直接提案します。
          </p>
        </div>
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">NextraLabs 2026</p>
      </div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function YoutubeCoordinatorSystem() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  return <NoSSRWrapper />
}
