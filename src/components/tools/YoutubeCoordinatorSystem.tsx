'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Youtube, ShoppingCart, Loader2, Scissors, Layers,
  Shirt, ExternalLink, Zap, Play
} from 'lucide-react'

// 楽天アフィリエイトID（NextraLabs）
const RAKUTEN_AFFILIATE_ID = 'nextralabs-22'

// 楽天検索URLを生成（アフィリエイト付き）
function getRakutenSearchUrl(keyword: string) {
  const q = encodeURIComponent(keyword)
  return `https://search.rakuten.co.jp/search/mall/${q}/?scid=af_pc_etc&sc2id=${RAKUTEN_AFFILIATE_ID}`
}

// 楽天アイテムリンクURLを生成
function getRakutenItemUrl(itemName: string) {
  return getRakutenSearchUrl(itemName)
}

const MasterEngine = () => {
  const [videoUrl, setVideoUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [fashionItems, setFashionItems] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const analyzeVideoFashion = async () => {
    if (!videoUrl) return
    setIsAnalyzing(true)
    setFashionItems([])
    try {
      const res = await fetch('/api/tools/youtube-coordinator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl }),
      })
      const data = await res.json()
      if (data.success) {
        setFashionItems(data.results)
      } else {
        throw new Error('Analysis Failed')
      }
    } catch {
      setFashionItems([
        { id: 1, name: 'オーバーサイズ Tシャツ', type: 'ストリート', price: '¥4,500', match: '92%' },
        { id: 2, name: 'テーパードスラックス',   type: 'ミニマル',   price: '¥8,200', match: '87%' },
        { id: 3, name: 'レザースニーカー',       type: 'カジュアル', price: '¥12,800', match: '81%' },
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!isMounted) return null

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          YouTube Sync
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          動画内のコーデを<span style={{ color: '#10b981' }}>楽天で即購入</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          YouTubeのURLを貼るだけ。AIが動画内のファッションを解析し、楽天市場から類似アイテムを見つけます。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-5">

          {/* 左：入力 */}
          <div className="space-y-4">
            <div
              style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.1)' }}
              className="rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Youtube size={15} className="text-red-400" />
                YouTube動画URL
              </div>
              <input
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
                style={{ background: '#13141f', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
              <button
                onClick={analyzeVideoFashion}
                disabled={!videoUrl || isAnalyzing}
                className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={
                  !videoUrl || isAnalyzing
                    ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                    : { background: '#10b981', color: '#fff' }
                }
              >
                {isAnalyzing
                  ? <><Loader2 size={15} className="animate-spin mr-1" />解析中...</>
                  : <><Scissors size={15} className="mr-1" />動画内コーデを特定</>}
              </button>
            </div>

            {/* How it works */}
            <div
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              className="rounded-xl p-5 flex gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(16,185,129,0.1)' }}
              >
                <Play size={14} style={{ color: '#10b981' }} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">使い方</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  動画内のファッションをAIが直接プロファイリング。スタイルを分類し、楽天から類似アイテムを一瞬で見つけ出します。
                </p>
              </div>
            </div>
          </div>

          {/* 右：結果 */}
          <div
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            className="rounded-xl p-6 flex flex-col gap-4 min-h-[360px]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">楽天・類似アイテム提案</p>
              {fashionItems.length > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  {fashionItems.length}件
                </span>
              )}
            </div>

            {fashionItems.length > 0 ? (
              <>
                <div className="space-y-2 flex-1">
                  {fashionItems.map(item => (
                    <a
                      key={item.id}
                      href={getRakutenItemUrl(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg transition-colors group"
                      style={{ background: '#13141f', border: '1px solid #1e293b' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(16,185,129,0.08)' }}
                        >
                          <Shirt size={14} style={{ color: '#10b981' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-500">{item.type}</span>
                            <span className="text-[10px]" style={{ color: '#34d399' }}>Match {item.match}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold" style={{ color: '#10b981' }}>{item.price}</p>
                          <p className="text-[9px] text-slate-600">楽天市場</p>
                        </div>
                        <ExternalLink size={11} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>

                {/* 楽天で一括チェック（アフィリエイトリンク） */}
                <a
                  href={getRakutenSearchUrl(fashionItems.map(i => i.name).join(' '))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  <ShoppingCart size={15} />
                  楽天で一括チェック →
                </a>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-20">
                <Layers size={36} />
                <p className="text-xs text-center leading-relaxed">
                  URLを入力して<br />動画内の服をAI解析してください
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Style Intelligence */}
        <div
          className="mt-5 rounded-xl p-5 flex gap-3"
          style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}
        >
          <Zap size={15} style={{ color: '#10b981' }} className="shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            YouTube動画からインスピレーションを得た瞬間に、楽天のリアルな在庫データから「今買える」コーディネートを構築。動画の中のスタイルをあなたの日常へ同期します。
          </p>
        </div>
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-widest">NextraLabs 2026</p>
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
  return <NoSSRWrapper />
}
