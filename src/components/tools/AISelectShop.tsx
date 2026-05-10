'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, Settings, CheckCircle2, Zap, ShoppingCart, TrendingUp, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const STYLES = [
  { id: 'japanese',   name: '和風',         bg: '#1a0000', textColor: '#c0392b', font: 'bold 28px serif' },
  { id: 'street',     name: 'ストリート',   bg: '#111111', textColor: '#ffdd00', font: 'bold 30px Impact, sans-serif' },
  { id: 'retro',      name: 'レトロ',       bg: '#2c1a0e', textColor: '#ff6b35', font: 'bold 26px Georgia, serif' },
  { id: 'cyberpunk',  name: 'サイバー',     bg: '#000020', textColor: '#00ffff', font: 'bold 28px monospace' },
  { id: 'kawaii',     name: 'かわいい',     bg: '#fff0f5', textColor: '#ff69b4', font: 'bold 28px sans-serif' },
  { id: 'minimal',    name: 'ミニマル',     bg: '#ffffff', textColor: '#111111', font: '300 28px Helvetica, sans-serif' },
  { id: 'gold',       name: 'ラグジュアリー',bg: '#0a0a00', textColor: '#d4af37', font: 'bold 26px Georgia, serif' },
  { id: 'neon',       name: 'ネオンサイン', bg: '#000000', textColor: '#39ff14', font: 'bold 28px monospace' },
  { id: 'nature',     name: 'ボタニカル',   bg: '#f1f8f1', textColor: '#2ecc71', font: 'bold 26px Georgia, serif' },
  { id: 'gradient',   name: 'グラデーション',bg: '#1a0033', textColor: '#ffffff', font: 'bold 28px sans-serif' },
  { id: 'wave',       name: '波・和柄',     bg: '#1a4a8a', textColor: '#ffffff', font: 'bold 26px serif' },
  { id: 'popart',     name: 'ポップアート', bg: '#ffff00', textColor: '#e91e63', font: 'bold 30px Impact, sans-serif' },
  { id: 'anime',      name: 'アニメ風',     bg: '#0d0d2b', textColor: '#ff6ec7', font: 'bold 26px sans-serif' },
  { id: 'military',   name: 'ミリタリー',   bg: '#2d3a1e', textColor: '#c8b560', font: 'bold 26px monospace' },
  { id: 'typo',       name: 'タイポグラフィ',bg: '#ffffff', textColor: '#000000', font: '900 32px Helvetica, sans-serif' },
  { id: 'monochrome', name: 'モノクロ',     bg: '#1a1a1a', textColor: '#ffffff', font: '300 28px Helvetica, sans-serif' },
  { id: 'tiedye',     name: 'タイダイ',     bg: '#ff6b9d', textColor: '#ffffff', font: 'bold 28px sans-serif' },
  { id: 'leopard',    name: 'レオパード',   bg: '#d4a017', textColor: '#1a1a1a', font: 'bold 28px sans-serif' },
  { id: 'vintage',    name: 'ヴィンテージ', bg: '#f5e6c8', textColor: '#5c3d1e', font: 'bold 26px Georgia, serif' },
  { id: 'abstract',   name: 'アブストラクト',bg: '#f0f0f0', textColor: '#333333', font: 'bold 28px sans-serif' },
]

const TSHIRT_COLORS = [
  { id: 'white',  name: '白',         hex: '#FFFFFF' },
  { id: 'black',  name: '黒',         hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',         hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー',     hex: '#808080' },
  { id: 'red',    name: 'レッド',     hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ',   hex: '#f5e6c8' },
  { id: 'green',  name: 'グリーン',   hex: '#2d6a4f' },
  { id: 'purple', name: 'パープル',   hex: '#6b21a8' },
  { id: 'pink',   name: 'ピンク',     hex: '#f472b6' },
  { id: 'orange', name: 'オレンジ',   hex: '#ea580c' },
  { id: 'brown',  name: 'ブラウン',   hex: '#78350f' },
  { id: 'yellow', name: 'イエロー',   hex: '#fbbf24' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

const PRINT_POSITIONS = [
  { id: 'chest-center', name: '胸中央' },
  { id: 'chest-left',   name: '左胸' },
  { id: 'back-center',  name: '背面中央' },
]

const TEXT_COLORS = [
  { id: 'auto',   hex: null,      name: 'スタイル自動' },
  { id: 'white',  hex: '#FFFFFF', name: '白' },
  { id: 'black',  hex: '#111111', name: '黒' },
  { id: 'yellow', hex: '#FFE600', name: '黄' },
  { id: 'red',    hex: '#FF2D2D', name: '赤' },
  { id: 'cyan',   hex: '#00FFFF', name: '水色' },
  { id: 'pink',   hex: '#FF6EC7', name: 'ピンク' },
  { id: 'gold',   hex: '#D4AF37', name: 'ゴールド' },
  { id: 'lime',   hex: '#39FF14', name: 'ライム' },
]

const LS_KEY = 'nextra_selectshop_settings'

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [style, setStyle] = useState('japanese')
  const [tshirtColor, setTshirtColor] = useState('black')
  const [textColorId, setTextColorId] = useState('auto')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L'])
  const [printPosition, setPrintPosition] = useState('chest-center')
  const [mockupDataUrl, setMockupDataUrl] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [shopifyDomain, setShopifyDomain] = useState('')
  const [shopifyClientId, setShopifyClientId] = useState('')
  const [shopifyClientSecret, setShopifyClientSecret] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const { shopifyDomain: sd, shopifyClientId: ci, shopifyClientSecret: cs } = JSON.parse(saved)
        if (sd) setShopifyDomain(sd)
        if (ci) setShopifyClientId(ci)
        if (cs) setShopifyClientSecret(cs)
      }
    } catch {}
    fetchTrends()
  }, [])

  const saveSettings = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ shopifyDomain, shopifyClientId, shopifyClientSecret }))
    setShowSettings(false)
  }

  const fetchTrends = async () => {
    setIsLoading(true)
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' })
      const d = await r.json()
      if (d.trends) setTrends(d.trends.slice(0, 9).map((t: string, i: number) => ({ id: i, name: t })))
    } catch {
      setTrends([{ id: 0, name: 'AI活用' }, { id: 1, name: 'サウナ' }, { id: 2, name: 'Web3' }])
    } finally {
      setIsLoading(false)
    }
  }

  const getTshirtPath = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.beginPath()
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1)
    ctx.lineTo(w*0.95, h*0.3); ctx.lineTo(w*0.8, h*0.35)
    ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9)
    ctx.lineTo(w*0.2, h*0.35); ctx.lineTo(w*0.05, h*0.3)
    ctx.closePath()
  }

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !keyword) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    const S = STYLES.find(s => s.id === style) || STYLES[0]
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1]

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, w, h)

    // Tシャツ本体を描画（clipなし）
    ctx.save()
    getTshirtPath(ctx, w, h)
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 12
    ctx.fillStyle = TC.hex; ctx.fill()
    ctx.restore()

    // プリント領域のサイズ・位置
    const isSmall = printPosition === 'chest-left'
    const cx = w / 2
    const cy = printPosition === 'chest-left' ? h * 0.3
             : printPosition === 'back-center' ? h * 0.55
             : h * 0.44
    const boxW = isSmall ? w * 0.22 : w * 0.52
    const boxH = isSmall ? h * 0.14 : h * 0.32
    const rx = 8
    const bx = cx - boxW / 2
    const by = cy - boxH / 2
    const pad = 12
    const safeW = boxW - pad * 2
    const safeH = boxH - pad * 2

    // ラウンド矩形ヘルパー
    const roundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + rw - r, y);  ctx.quadraticCurveTo(x + rw, y, x + rw, y + r)
      ctx.lineTo(x + rw, y + rh - r); ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh)
      ctx.lineTo(x + r, y + rh);  ctx.quadraticCurveTo(x, y + rh, x, y + rh - r)
      ctx.lineTo(x, y + r);       ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    // プリントボックス背景
    roundRect(bx, by, boxW, boxH, rx)
    ctx.fillStyle = S.bg; ctx.globalAlpha = 0.92; ctx.fill()
    ctx.globalAlpha = 1

    // テキスト描画をclipで囲む
    ctx.save()
    roundRect(bx, by, boxW, boxH, rx)
    ctx.clip()

    // フォントサイズ自動決定（上限から縮小）
    const styleSize = parseInt(S.font.match(/\b(\d+)px\b/)?.[1] || '24', 10)
    const maxFontSize = isSmall ? 13 : Math.min(styleSize, 20)
    const minFontSize = 8
    const effectiveSafeW = safeW * 0.88  // measureText のフォント読み込み遅延分の安全マージン

    const splitLines = (size: number): string[] => {
      ctx.font = S.font.replace(/\b[\d.]+px\b/, `${size}px`)
      const result: string[] = []
      let line = ''
      for (const ch of keyword) {
        const test = line + ch
        if (ctx.measureText(test).width > effectiveSafeW && line.length > 0) {
          result.push(line)
          line = ch
        } else {
          line = test
        }
      }
      if (line) result.push(line)
      return result
    }

    let fontSize = maxFontSize
    let fittedLines: string[] = []
    while (fontSize >= minFontSize) {
      const ls = splitLines(fontSize)
      if (ls.length * (fontSize * 1.4) <= safeH) { fittedLines = ls; break }
      fontSize--
    }
    if (fittedLines.length === 0) { fittedLines = splitLines(minFontSize); fontSize = minFontSize }

    // テキスト描画
    ctx.font = S.font.replace(/\b[\d.]+px\b/, `${fontSize}px`)
    const resolvedColor = textColorId !== 'auto'
      ? (TEXT_COLORS.find(c => c.id === textColorId)?.hex ?? S.textColor)
      : S.textColor
    ctx.fillStyle = resolvedColor!
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const lineH = fontSize * 1.4
    const startY = cy - (fittedLines.length * lineH) / 2 + lineH / 2
    fittedLines.forEach((ln, i) => { ctx.fillText(ln, cx, startY + i * lineH) })

    ctx.restore()
    setMockupDataUrl(canvas.toDataURL('image/png'))
  }, [keyword, style, tshirtColor, textColorId, printPosition])

  useEffect(() => { if (keyword) drawDesign() }, [keyword, style, tshirtColor, textColorId, printPosition, drawDesign])

  const toggleSize = (s: string) => {
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    await new Promise(r => setTimeout(r, 2000))
    setPublishResult({ url: 'https://myshopify.com/products/test' })
    setCurrentStep(3)
    setIsPublishing(false)
  }

  const STEP_LABELS = ['トレンド選択', 'デザイン生成', '出品完了']

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 text-left p-5 md:p-10 bg-[#050507]">

      {/* タイトル */}
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-4 py-1 text-xs rounded-full">在庫ゼロ販売</Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">AIセレクト<span className="text-emerald-400">ショップ</span></h1>
        <p className="text-slate-400 text-sm">トレンドを選んでデザインを生成。Shopifyへ自動出品して在庫ゼロで販売をはじめましょう。</p>
        <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 mx-auto mt-2 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors">
          <Settings size={12} /> API設定
        </button>
      </div>

      {/* API設定パネル */}
      {showSettings && (
        <div className="bg-[#0d0f1a] border border-white/10 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto">
          <h3 className="font-semibold text-white text-sm">Shopify API設定</h3>
          {[
            { label: 'ショップドメイン', val: shopifyDomain, set: setShopifyDomain, placeholder: 'mystore.myshopify.com' },
            { label: 'Client ID', val: shopifyClientId, set: setShopifyClientId, placeholder: 'Client ID' },
            { label: 'Client Secret', val: shopifyClientSecret, set: setShopifyClientSecret, placeholder: 'Client Secret' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                className="w-full h-10 bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-emerald-500 transition-all" />
            </div>
          ))}
          <Button onClick={saveSettings} className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-6 text-sm">保存</Button>
        </div>
      )}

      {/* ステップナビ */}
      <div className="flex gap-2 justify-center bg-[#0d0f1a] p-1.5 rounded-xl border border-white/5 max-w-sm mx-auto">
        {STEP_LABELS.map((label, i) => (
          <button key={i} onClick={() => setCurrentStep(i + 1)}
            className={'flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all ' +
              (currentStep === i + 1 ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300')}>
            {label}
          </button>
        ))}
      </div>

      {/* STEP 1: トレンド選択 */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">今日のトレンドから選ぶ</h2>
            <button onClick={fetchTrends} className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-400 text-xs font-semibold transition-colors">
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> 更新
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {isLoading ? Array.from({length: 9}).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            )) : trends.map(t => (
              <button key={t.id}
                onClick={() => { setKeyword(t.name); setCurrentStep(2) }}
                className="group bg-[#0d0f1a] border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 rounded-xl p-5 text-left transition-all">
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold mb-2">TREND</Badge>
                <p className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">{t.name}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="または直接キーワードを入力..."
              className="flex-1 h-11 bg-[#0d0f1a] border border-white/10 rounded-xl px-4 text-sm text-white outline-none focus:border-emerald-500 transition-all" />
            <Button onClick={() => { if(keyword) setCurrentStep(2) }}
              className="h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl px-5 text-sm">
              デザイン生成 →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: デザイン生成 */}
      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左：設定パネル */}
          <div className="space-y-5">

            {/* キーワード */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">キーワード</label>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-base font-bold text-white outline-none focus:border-emerald-500 transition-all" />
            </div>

            {/* デザインスタイル */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">デザインスタイル</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    style={{ borderColor: style === s.id ? '#10b981' : 'transparent', backgroundColor: style === s.id ? '#10b98120' : '#ffffff08' }}
                    className="h-10 rounded-lg border-2 text-xs font-semibold transition-all text-slate-300 hover:text-white">
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tシャツカラー */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Tシャツカラー</label>
              <div className="flex flex-wrap gap-2">
                {TSHIRT_COLORS.map(c => (
                  <button key={c.id} onClick={() => setTshirtColor(c.id)} title={c.name}
                    style={{ backgroundColor: c.hex, outline: tshirtColor === c.id ? '3px solid #10b981' : '2px solid transparent', outlineOffset: '2px' }}
                    className="w-8 h-8 rounded-full transition-all hover:scale-110" />
                ))}
              </div>
            </div>

            {/* テキストカラー */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">文字カラー</label>
              <div className="flex flex-wrap gap-2">
                {TEXT_COLORS.map(c => (
                  <button key={c.id} onClick={() => setTextColorId(c.id)}
                    className={'h-8 px-3 rounded-lg text-xs font-semibold border-2 transition-all ' +
                      (textColorId === c.id ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 text-slate-400 hover:text-white')}
                    style={c.hex ? { color: textColorId === c.id ? c.hex : undefined } : {}}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* サイズ選択 */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">販売サイズ（複数選択可）</label>
              <div className="flex gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => toggleSize(s)}
                    className={'h-10 w-12 rounded-lg text-sm font-bold border-2 transition-all ' +
                      (selectedSizes.includes(s) ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-white/10 text-slate-500 hover:text-white')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* プリント位置 */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">プリント位置</label>
              <div className="flex gap-2">
                {PRINT_POSITIONS.map(p => (
                  <button key={p.id} onClick={() => setPrintPosition(p.id)}
                    className={'flex-1 h-10 rounded-lg text-xs font-semibold border-2 transition-all ' +
                      (printPosition === p.id ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-white/10 text-slate-500 hover:text-white')}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 出品ボタン */}
            <Button onClick={handlePublish} disabled={isPublishing || !keyword || selectedSizes.length === 0}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-lg rounded-2xl shadow-xl transition-all">
              {isPublishing
                ? <><Loader2 className="animate-spin mr-2" size={18} /> 出品中...</>
                : <><ShoppingCart size={18} className="mr-2" /> Shopifyへ自動出品</>}
            </Button>
          </div>

          {/* 右：プレビュー */}
          <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">プレビュー</p>
              <button onClick={() => setCurrentStep(1)} className="text-xs text-slate-500 hover:text-slate-300 font-semibold transition-colors">← 戻る</button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <canvas ref={canvasRef} width={360} height={440}
                className="rounded-2xl max-w-full shadow-2xl" />
            </div>
            {selectedSizes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedSizes.map(s => (
                  <Badge key={s} className="bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold">{s}</Badge>
                ))}
                <Badge className="bg-white/5 text-slate-400 border border-white/10 text-xs">{PRINT_POSITIONS.find(p => p.id === printPosition)?.name}</Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: 出品完了 */}
      {currentStep === 3 && (
        <div className="text-center py-16 space-y-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <CheckCircle2 size={40} className="text-slate-950" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">出品完了！</h2>
            <p className="text-slate-400 text-sm mt-2">Shopifyストアに商品が登録されました</p>
          </div>
          <Button onClick={() => window.open(publishResult?.url)}
            className="h-12 px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xl text-sm">
            Shopifyで確認 →
          </Button>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4">
            {[
              { title: '自動出品完了', desc: 'ShopifyとPrintfulが連携。注文が入るまでコストはゼロです。', icon: ShoppingCart },
              { title: 'SNSで拡散', desc: '生成したモックアップをInstagramやXで拡散して集客しましょう。', icon: TrendingUp },
              { title: '自動受注・発送', desc: '注文確認後、AIと連携システムが全自動で処理します。', icon: Zap },
            ].map((s, i) => (
              <div key={i} className="bg-[#0d0f1a] border border-white/5 p-5 rounded-2xl space-y-2 text-left">
                <s.icon size={18} className="text-emerald-400" />
                <p className="font-bold text-white text-sm">{s.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <button onClick={() => { setCurrentStep(1); setPublishResult(null) }}
            className="text-slate-500 hover:text-slate-300 text-sm font-semibold transition-colors">
            ← 最初からやり直す
          </button>
        </div>
      )}

      <div className="text-center text-[9px] text-slate-700 font-semibold pt-4">
        Shopify × Printful Engine v2.0 · © 2026 NextraLabs
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false })
export default function AISelectShop() { return <NoSSR /> }
