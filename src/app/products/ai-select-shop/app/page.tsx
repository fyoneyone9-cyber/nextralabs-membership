'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Loader2, CheckCircle2, Info, Zap, ShoppingCart,
  TrendingUp, Palette, Package, RefreshCw, ExternalLink, AlertCircle
} from 'lucide-react'

// ──────────────────────────────────────────────
// デザインスタイル定義
// ──────────────────────────────────────────────
const STYLES = [
  { id: 'japanese',   name: '和風',         bg: '#1a0000', textColor: '#c0392b', font: 'bold 28px serif' },
  { id: 'street',     name: 'ストリート',   bg: '#111111', textColor: '#ffdd00', font: 'bold 30px Impact,sans-serif' },
  { id: 'retro',      name: 'レトロ',       bg: '#2c1a0e', textColor: '#ff6b35', font: 'bold 26px Georgia,serif' },
  { id: 'cyberpunk',  name: 'サイバー',     bg: '#000020', textColor: '#00ffff', font: 'bold 28px monospace' },
  { id: 'kawaii',     name: 'かわいい',     bg: '#fff0f5', textColor: '#ff69b4', font: 'bold 28px sans-serif' },
  { id: 'minimal',    name: 'ミニマル',     bg: '#ffffff', textColor: '#111111', font: '300 28px Helvetica,sans-serif' },
  { id: 'gold',       name: 'ラグジュアリー', bg: '#0a0a00', textColor: '#d4af37', font: 'bold 26px Georgia,serif' },
  { id: 'neon',       name: 'ネオン',       bg: '#000000', textColor: '#39ff14', font: 'bold 28px monospace' },
  { id: 'nature',     name: 'ボタニカル',   bg: '#f1f8f1', textColor: '#2ecc71', font: 'bold 26px Georgia,serif' },
  { id: 'gradient',   name: 'グラデーション', bg: '#1a0033', textColor: '#ffffff', font: 'bold 28px sans-serif' },
  { id: 'wave',       name: '波・和柄',     bg: '#1a4a8a', textColor: '#ffffff', font: 'bold 26px serif' },
  { id: 'popart',     name: 'ポップアート', bg: '#ffff00', textColor: '#e91e63', font: 'bold 30px Impact,sans-serif' },
]

const TSHIRT_COLORS = [
  { id: 'white',  name: '白',      hex: '#FFFFFF' },
  { id: 'black',  name: '黒',      hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',      hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー', hex: '#808080' },
  { id: 'red',    name: 'レッド', hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ', hex: '#f5e6c8' },
  { id: 'green',  name: 'グリーン', hex: '#2d6a4f' },
  { id: 'purple', name: 'パープル', hex: '#6b21a8' },
  { id: 'pink',   name: 'ピンク', hex: '#f472b6' },
  { id: 'orange', name: 'オレンジ', hex: '#ea580c' },
]

const FALLBACK_TRENDS = [
  'AI活用術', '副業・在宅ワーク', '節約・投資',
  'ChatGPT最新', '動画制作', '健康・ダイエット',
  '転職・キャリア', 'ガジェット', 'SNSマーケ'
]

// ──────────────────────────────────────────────
// Tシャツ描画ヘルパー
// ──────────────────────────────────────────────
function drawTshirt(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath()
  ctx.moveTo(w * 0.20, h * 0.08)
  ctx.lineTo(w * 0.35, h * 0.04)
  ctx.quadraticCurveTo(w * 0.50, h * 0.13, w * 0.65, h * 0.04)
  ctx.lineTo(w * 0.80, h * 0.08)
  ctx.lineTo(w * 0.97, h * 0.28)
  ctx.lineTo(w * 0.80, h * 0.34)
  ctx.lineTo(w * 0.80, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.34)
  ctx.lineTo(w * 0.03, h * 0.28)
  ctx.closePath()
}

// ──────────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────────
const AISelectShopApp = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [styleId, setStyleId] = useState('japanese')
  const [tshirtColorId, setTshirtColorId] = useState('black')
  const [mockupDataUrl, setMockupDataUrl] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ── トレンド取得 ──
  const fetchTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' })
      const d = await r.json()
      if (d.trends && d.trends.length > 0) {
        const fetched: string[] = d.trends.slice(0, 9)
        const padded = fetched.length >= 9
          ? fetched
          : [...fetched, ...FALLBACK_TRENDS.filter(f => !fetched.includes(f))].slice(0, 9)
        setTrends(padded.map((t, i) => ({ id: i, name: t })))
        setIsLive(d.isLive === true)
      } else throw new Error('empty')
    } catch {
      setTrends(FALLBACK_TRENDS.map((t, i) => ({ id: i, name: t })))
      setIsLive(false)
    } finally {
      setIsLoadingTrends(false)
    }
  }

  useEffect(() => { fetchTrends() }, [])

  // ── Tシャツモックアップ描画 ──
  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !keyword) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    const S = STYLES.find(s => s.id === styleId) || STYLES[0]
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColorId) || TSHIRT_COLORS[1]

    ctx.clearRect(0, 0, w, h)

    // 背景
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, w, h)

    // Tシャツ本体
    ctx.save()
    drawTshirt(ctx, w, h)
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 16
    ctx.fillStyle = TC.hex
    ctx.fill()
    ctx.strokeStyle = TC.hex === '#FFFFFF' ? '#e2e8f0' : TC.hex
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()

    // デザイン印刷エリア（クリップ）
    ctx.save()
    drawTshirt(ctx, w, h)
    ctx.clip()

    const cx = w / 2, cy = h * 0.50, pr = h * 0.18
    ctx.fillStyle = S.bg
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.arc(cx, cy, pr, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.font = S.font
    ctx.fillStyle = S.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(keyword.length > 8 ? keyword.slice(0, 8) + '…' : keyword, cx, cy)
    ctx.restore()

    setMockupDataUrl(canvas.toDataURL('image/png'))
  }, [keyword, styleId, tshirtColorId])

  useEffect(() => { if (keyword) drawDesign() }, [keyword, styleId, tshirtColorId, drawDesign])

  // ── 出品処理 ──
  const handlePublish = async () => {
    if (!keyword || !mockupDataUrl) return
    setIsPublishing(true)
    setPublishResult(null)
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-product',
          keyword,
          style: styleId,
          mockupUrl: mockupDataUrl,
          tshirtColor: tshirtColorId,
          sizes: ['S', 'M', 'L', 'XL'],
        }),
      })
      const data = await res.json()
      if (data.error) {
        setPublishResult({ error: data.error })
      } else {
        setPublishResult({ url: data.url || data.shopifyUrl || '#' })
        setStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (e: any) {
      setPublishResult({ error: e.message || '出品に失敗しました' })
    } finally {
      setIsPublishing(false)
    }
  }

  // ──────────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100" style={{ fontFamily: "'Inter','Noto Sans JP',sans-serif" }}>
      {/* エメラルドトップバー */}
      <div className="h-1 bg-emerald-500 w-full" />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {/* ヘッダー */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide">
              {isLive ? 'LIVE TREND DATA' : 'CACHED DATA'}
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-white tracking-tight leading-[1.15]">
            AIセレクトショップ
          </h1>
          <p className="text-slate-400 leading-relaxed text-base max-w-xl">
            トレンドを選んでデザインを生成。Shopifyへ自動出品して在庫ゼロで販売をはじめましょう。
          </p>
        </div>

        {/* ステップナビ */}
        <div className="flex gap-1 bg-[#1e293b] p-1 rounded-xl max-w-sm border border-slate-700/50">
          {([
            { n: 1, label: 'トレンド選択' },
            { n: 2, label: 'デザイン生成' },
            { n: 3, label: '出品完了' },
          ] as { n: 1|2|3; label: string }[]).map(({ n, label }) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                step === n
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── Step 1: トレンド選択 ─── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">今週のトレンドキーワード</h2>
              <button
                onClick={fetchTrends}
                disabled={isLoadingTrends}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={isLoadingTrends ? 'animate-spin' : ''} />
                更新
              </button>
            </div>

            {isLoadingTrends ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-20 bg-[#1e293b] rounded-xl animate-pulse border border-slate-700/50" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {trends.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setKeyword(t.name); setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="h-20 bg-[#1e293b] border border-slate-700/50 hover:border-emerald-500 hover:bg-[#1e293b]/80 rounded-xl px-5 text-left font-medium text-slate-200 hover:text-emerald-400 transition-all group"
                  >
                    <span className="text-xs text-slate-500 block mb-1">TREND</span>
                    <span className="text-base">{t.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 手入力 */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
              <p className="text-sm font-medium text-slate-300">または自分でキーワードを入力</p>
              <div className="flex gap-3">
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="例：AI美女、侍、宇宙猫..."
                  className="flex-1 h-11 bg-[#0f172a] border border-slate-700 rounded-lg px-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
                />
                <button
                  onClick={() => { if (keyword) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
                  disabled={!keyword}
                  className="h-11 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  次へ →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: デザイン生成 & 出品 ─── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">デザインを生成して出品</h2>
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">← 戻る</button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* 左：設定 */}
              <div className="space-y-5">
                {/* キーワード */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">キーワード</label>
                  <input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="w-full h-11 bg-[#0f172a] border border-slate-700 rounded-lg px-4 text-base text-white focus:border-emerald-500 outline-none transition-colors"
                  />
                </div>

                {/* スタイル */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">デザインスタイル</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setStyleId(s.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                          styleId === s.id
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-[#0f172a] text-slate-400 hover:text-slate-200 border border-slate-700/50'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tシャツカラー */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Tシャツカラー</label>
                  <div className="flex flex-wrap gap-2">
                    {TSHIRT_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setTshirtColorId(c.id)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          tshirtColorId === c.id ? 'border-emerald-400 scale-110' : 'border-slate-600 hover:border-slate-400'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* エラー表示 */}
                {publishResult?.error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                    <AlertCircle size={16} />
                    {publishResult.error}
                  </div>
                )}

                {/* 出品ボタン */}
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !keyword || !mockupDataUrl}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                >
                  {isPublishing ? (
                    <><Loader2 size={18} className="animate-spin" /> Shopifyへ出品中...</>
                  ) : (
                    <><ShoppingCart size={18} /> Shopifyへ自動出品</>
                  )}
                </button>
              </div>

              {/* 右：プレビュー */}
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 flex flex-col items-center gap-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide self-start">プレビュー</p>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={500}
                  className="max-w-full rounded-xl"
                />
                {!keyword && (
                  <p className="text-sm text-slate-500 text-center">キーワードを入力するとプレビューが表示されます</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: 出品完了 ─── */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="bg-[#1e293b] border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-white">出品完了</h2>
              <p className="text-slate-400 text-sm">商品がShopifyストアへ同期されました。受注後は自動で生産・配送されます。</p>
              {publishResult?.url && publishResult.url !== '#' && (
                <a
                  href={publishResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-colors"
                >
                  <ExternalLink size={16} /> Shopifyで確認する
                </a>
              )}
            </div>

            {/* 販売ロードマップ */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">販売ロードマップ</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: ShoppingCart, title: '自動出品', desc: 'Shopify × Printful連携。在庫リスクゼロで販売開始。' },
                  { icon: TrendingUp,   title: 'SNS集客',  desc: 'モックアップ画像をXやInstagramでシェアして集客。' },
                  { icon: Zap,          title: '完全自動化', desc: '受注後の生産・配送はシステムが自動で処理。' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <s.icon size={18} className="text-emerald-400" />
                      <span className="text-sm font-semibold text-white">{s.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setStep(1); setPublishResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="h-11 px-6 bg-[#1e293b] hover:bg-[#334155] border border-slate-700/50 text-slate-300 font-medium text-sm rounded-xl transition-colors"
            >
              新しいデザインを作成する
            </button>
          </div>
        )}

        {/* フッター */}
        <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600">
          <span>© 2026 NextraLabs</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Shopify × Printful Engine v2.0
          </span>
        </div>
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(AISelectShopApp), { ssr: false })
export default function AISelectShopPage() { return <NoSSR /> }
