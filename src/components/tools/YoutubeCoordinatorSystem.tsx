'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Youtube, ShoppingCart, Loader2,
  Shirt, ExternalLink, Zap, Play, Star, Search,
  ChevronRight, Sparkles, TrendingUp
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

const STEPS = [
  { num: '01', title: 'URLを貼る', desc: 'YouTubeのURLをコピーして入力欄に貼り付け' },
  { num: '02', title: 'AIが解析', desc: 'Gemini AIがサムネイルからアイテムを自動検出' },
  { num: '03', title: '楽天で購入', desc: '検出されたアイテムを楽天市場から即購入' },
]

const PRESETS = [
  { label: '結婚相談所リアル体験談｜1年で成婚する秘訣', url: 'https://www.youtube.com/watch?v=-0SYREouHeg' },
  { label: 'マッチングアプリとの違いは？成婚の秘訣', url: 'https://www.youtube.com/watch?v=7-ydEP3vEEQ' },
  { label: '【成功率UP】仮交際・真剣交際・プロポーズ完全解説', url: 'https://www.youtube.com/watch?v=kSfsHNDyT-U' },
  { label: '結婚相談所で半年成婚した30代女性のリアル体験談', url: 'https://www.youtube.com/watch?v=_7Ze4HfPqHw' },
  { label: 'お見合い成功の注意点（女性編）', url: 'https://www.youtube.com/watch?v=dnGbuoc3XBs' },
]

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

  if (!isMounted) return null

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden">
        {/* 背景グロー */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-14 pb-12 relative">
          {/* バッジ */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium"
              style={{ borderColor: 'rgba(16,185,129,0.35)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini AI × 楽天市場
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium"
              style={{ borderColor: 'rgba(251,191,36,0.3)', color: '#fbbf24', background: 'rgba(251,191,36,0.06)' }}
            >
              <TrendingUp size={10} />
              リアルタイム商品検索
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-3xl md:text-5xl font-bold text-slate-100 tracking-tight leading-[1.15] mb-4">
            動画内のアイテムを<br />
            <span style={{ color: '#10b981' }}>楽天で即購入</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
            YouTubeのURLを貼るだけ。Gemini AIがサムネイルを解析して、楽天市場から実際の商品を自動検索します。
          </p>

          {/* How it works ステップ */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex flex-col gap-2 relative"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              >
                {i < STEPS.length - 1 && (
                  <ChevronRight
                    size={14}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600"
                    style={{ display: 'block' }}
                  />
                )}
                <span className="text-lg font-black" style={{ color: '#10b981', opacity: 0.6 }}>{step.num}</span>
                <span className="text-xs font-bold text-slate-200">{step.title}</span>
                <span className="text-[10px] text-slate-500 leading-relaxed">{step.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-6">

        {/* ===== 入力エリア ===== */}
        <div
          style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 30px rgba(16,185,129,0.08)' }}
          className="rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-4">
            <Youtube size={15} className="text-red-400" />
            YouTube動画URL を入力
          </div>

          <div className="flex gap-3">
            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyzeVideoFashion()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 h-12 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
              style={{ background: '#13141f', border: '1px solid #334155' }}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = '#334155')}
            />
            <button
              onClick={analyzeVideoFashion}
              disabled={!videoUrl || isAnalyzing}
              className="h-12 px-7 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0"
              style={
                !videoUrl || isAnalyzing
                  ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                  : { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }
              }
            >
              {isAnalyzing
                ? <><Loader2 size={14} className="animate-spin" />解析中...</>
                : <><Search size={14} />解析する</>}
            </button>
          </div>

          {/* プリセット */}
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid #1e293b' }}>
            <p className="text-xs text-slate-500 mb-3 font-semibold flex items-center gap-1.5">
              <Sparkles size={11} style={{ color: '#10b981' }} />
              プリセット動画から試す
            </p>
            <div className="space-y-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setVideoUrl(p.url)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group"
                  style={{
                    background: videoUrl === p.url ? 'rgba(16,185,129,0.1)' : '#13141f',
                    border: videoUrl === p.url ? '1px solid rgba(16,185,129,0.5)' : '1px solid #1e293b',
                  }}
                >
                  <Youtube size={13} className="text-red-400 shrink-0" />
                  <span
                    className="text-xs flex-1 leading-relaxed"
                    style={{ color: videoUrl === p.url ? '#34d399' : '#94a3b8' }}
                  >
                    {p.label}
                  </span>
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== エラー ===== */}
        {errorMsg && (
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ===== ローディング ===== */}
        {isAnalyzing && (
          <div
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            className="rounded-2xl p-12 flex flex-col items-center gap-5"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <Sparkles size={16} className="absolute inset-0 m-auto text-emerald-400" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-200">Gemini AIが解析中...</p>
              <p className="text-xs text-slate-500">サムネイルからアイテムを検出 → 楽天で商品を検索</p>
            </div>
            {/* ステータスバー */}
            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
              <div
                className="h-full rounded-full animate-pulse"
                style={{ width: '60%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}
              />
            </div>
          </div>
        )}

        {/* ===== 結果エリア ===== */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-6">

            {/* 動画情報 + 検出アイテム */}
            <div
              style={{ background: '#0d1117', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 20px rgba(16,185,129,0.05)' }}
              className="rounded-2xl p-5 flex gap-4 items-start"
            >
              <img
                src={analysisResult.thumbnailUrl}
                alt={analysisResult.videoTitle}
                className="w-36 h-24 object-cover rounded-xl shrink-0"
                style={{ border: '1px solid #1e293b' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 leading-tight mb-3 line-clamp-2">
                  {analysisResult.videoTitle}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {analysisResult.detectedItems.map((item, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <ShoppingCart size={10} />
                  {totalProducts}件の楽天商品が見つかりました
                </p>
              </div>
            </div>

            {/* 楽天商品グリッド */}
            {analysisResult.results.map((section, si) => (
              <div key={si}>
                <div className="flex items-center gap-2 mb-3">
                  <Shirt size={13} style={{ color: '#10b981' }} />
                  <span className="text-xs font-bold text-slate-300">{section.keyword}</span>
                  <span className="text-[10px] text-slate-600">— 楽天市場</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.products.map((product, pi) => (
                    <a
                      key={pi}
                      href={product.itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col rounded-2xl overflow-hidden transition-all group"
                      style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#1e293b'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div className="w-full h-40 overflow-hidden" style={{ background: '#13141f' }}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Shirt size={36} />
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 space-y-2 flex-1 flex flex-col">
                        <p className="text-xs font-semibold text-slate-200 leading-tight line-clamp-2">
                          {product.name}
                        </p>
                        {product.reviewCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] text-slate-400">
                              {product.reviewAverage.toFixed(1)} ({product.reviewCount}件)
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-1">
                          <p className="text-sm font-black" style={{ color: '#10b981' }}>
                            {product.price}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-600 max-w-[80px] truncate">{product.shopName}</span>
                            <ExternalLink size={10} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
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
              className="w-full h-13 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', height: '52px', boxShadow: '0 4px 20px rgba(16,185,129,0.25)' }}
            >
              <ShoppingCart size={15} />
              楽天市場でもっと探す →
            </a>
          </div>
        )}

        {/* ===== 機能紹介（初期表示 / 空状態） ===== */}
        {!analysisResult && !isAnalyzing && !errorMsg && (
          <div className="space-y-4">
            {/* 特徴カード3枚 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  icon: <Youtube size={18} className="text-red-400" />,
                  title: 'YouTube対応',
                  desc: '通常動画・ショート・プレイリストなど幅広いURLに対応',
                },
                {
                  icon: <Zap size={18} style={{ color: '#10b981' }} />,
                  title: 'Gemini AI解析',
                  desc: 'サムネイルから商品・アイテムを高精度で自動検出',
                },
                {
                  icon: <ShoppingCart size={18} className="text-yellow-400" />,
                  title: '楽天で即購入',
                  desc: '検出結果を楽天市場APIでリアルタイム検索・直接購入',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 space-y-3"
                  style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: '#13141f', border: '1px solid #1e293b' }}
                  >
                    {card.icon}
                  </div>
                  <p className="text-sm font-bold text-slate-200">{card.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA テキスト */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
              style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}
            >
              <Play size={28} style={{ color: '#10b981', opacity: 0.5 }} />
              <p className="text-sm text-slate-400 leading-relaxed">
                上のプリセットから動画を選ぶか、<br />YouTubeのURLを貼り付けて<span style={{ color: '#34d399' }}>「解析する」</span>を押してください
              </p>
            </div>
          </div>
        )}

      </div>

      <div className="text-center mt-20 opacity-20">
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
      <AffiliateBanner toolId="youtube-coordinator" />
    </div>
  ),
})

export default function YoutubeCoordinatorSystem() {
  const router = useRouter()

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
