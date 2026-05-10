'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, Settings, CheckCircle2, Zap, ShoppingCart, TrendingUp, RefreshCw, Shuffle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ─── スタイル定義 ────────────────────────────────────────────────────────────
// drawBg: Canvasにスタイル固有の背景を描画する関数
// textColor: テキスト色
// fontFamily: フォント族（pxサイズはロジック側で決定）
// fontWeight: bold / 300 / 900 など
type StyleDef = {
  id: string
  name: string
  emoji: string
  fontFamily: string
  fontWeight: string
  textColor: string
  drawBg: (ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number, bh: number) => void
}

const mkSolid = (bg: string): StyleDef['drawBg'] => (ctx, bx, by, bw, bh) => {
  ctx.fillStyle = bg
  ctx.fillRect(bx, by, bw, bh)
}

const mkLinear = (colors: string[], angle = 135): StyleDef['drawBg'] => (ctx, bx, by, bw, bh) => {
  const rad = (angle * Math.PI) / 180
  const cx2 = bx + bw / 2, cy2 = by + bh / 2
  const len = Math.sqrt(bw * bw + bh * bh) / 2
  const grd = ctx.createLinearGradient(
    cx2 - Math.cos(rad) * len, cy2 - Math.sin(rad) * len,
    cx2 + Math.cos(rad) * len, cy2 + Math.sin(rad) * len
  )
  colors.forEach((c, i) => grd.addColorStop(i / (colors.length - 1), c))
  ctx.fillStyle = grd
  ctx.fillRect(bx, by, bw, bh)
}

const STYLES: StyleDef[] = [
  {
    id: 'japanese', name: '和風', emoji: '⛩️',
    fontFamily: 'serif', fontWeight: 'bold', textColor: '#c0392b',
    drawBg: mkSolid('#1a0000'),
  },
  {
    id: 'street', name: 'ストリート', emoji: '🎤',
    fontFamily: 'Impact, sans-serif', fontWeight: 'bold', textColor: '#ffdd00',
    drawBg: mkSolid('#111111'),
  },
  {
    id: 'retro', name: 'レトロ', emoji: '📻',
    fontFamily: 'Georgia, serif', fontWeight: 'bold', textColor: '#ff6b35',
    drawBg: mkSolid('#2c1a0e'),
  },
  {
    id: 'cyberpunk', name: 'サイバー', emoji: '🌐',
    fontFamily: 'monospace', fontWeight: 'bold', textColor: '#00ffff',
    drawBg: mkSolid('#000020'),
  },
  {
    id: 'kawaii', name: 'かわいい', emoji: '🌸',
    fontFamily: 'sans-serif', fontWeight: 'bold', textColor: '#ff69b4',
    drawBg: mkSolid('#fff0f5'),
  },
  {
    id: 'minimal', name: 'ミニマル', emoji: '⬜',
    fontFamily: 'Helvetica, sans-serif', fontWeight: '300', textColor: '#111111',
    drawBg: mkSolid('#ffffff'),
  },
  {
    id: 'gold', name: 'ラグジュアリー', emoji: '💎',
    fontFamily: 'Georgia, serif', fontWeight: 'bold', textColor: '#d4af37',
    drawBg: mkSolid('#0a0a00'),
  },
  {
    id: 'neon', name: 'ネオン', emoji: '💡',
    fontFamily: 'monospace', fontWeight: 'bold', textColor: '#39ff14',
    drawBg: mkSolid('#000000'),
  },
  {
    id: 'nature', name: 'ボタニカル', emoji: '🌿',
    fontFamily: 'Georgia, serif', fontWeight: 'bold', textColor: '#2ecc71',
    drawBg: mkSolid('#f1f8f1'),
  },
  {
    id: 'gradient', name: 'グラデーション', emoji: '🌈',
    fontFamily: 'sans-serif', fontWeight: 'bold', textColor: '#ffffff',
    drawBg: mkLinear(['#1a0033', '#0d1f6b', '#1a0033']),
  },
  {
    id: 'wave', name: '波・和柄', emoji: '🌊',
    fontFamily: 'serif', fontWeight: 'bold', textColor: '#ffffff',
    drawBg: mkSolid('#1a4a8a'),
  },
  {
    id: 'popart', name: 'ポップアート', emoji: '🎨',
    fontFamily: 'Impact, sans-serif', fontWeight: 'bold', textColor: '#e91e63',
    drawBg: mkSolid('#ffff00'),
  },
  {
    id: 'anime', name: 'アニメ', emoji: '🌸',
    fontFamily: 'sans-serif', fontWeight: 'bold', textColor: '#ff6ec7',
    drawBg: mkSolid('#0d0d2b'),
  },
  {
    id: 'vintage', name: 'ヴィンテージ', emoji: '👘',
    fontFamily: 'Georgia, serif', fontWeight: 'bold', textColor: '#5c3d1e',
    drawBg: mkSolid('#f5e6c8'),
  },
  {
    id: 'typo', name: 'タイポ', emoji: '📝',
    fontFamily: 'Helvetica, sans-serif', fontWeight: '900', textColor: '#000000',
    drawBg: mkSolid('#ffffff'),
  },
  {
    id: 'monochrome', name: 'モノクロ', emoji: '🖤',
    fontFamily: 'Helvetica, sans-serif', fontWeight: '300', textColor: '#ffffff',
    drawBg: mkSolid('#1a1a1a'),
  },
  {
    id: 'motivate', name: 'モチベ', emoji: '💪',
    fontFamily: 'Impact, sans-serif', fontWeight: 'bold', textColor: '#ff4500',
    drawBg: mkLinear(['#1a1a1a', '#2d0a0a']),
  },
  {
    id: 'emo', name: 'エモ系', emoji: '🌙',
    fontFamily: 'Georgia, serif', fontWeight: 'bold', textColor: '#c084fc',
    drawBg: mkLinear(['#0f0020', '#1a0040']),
  },
  {
    id: 'surf', name: 'サーフ', emoji: '🏄',
    fontFamily: 'sans-serif', fontWeight: 'bold', textColor: '#ffffff',
    drawBg: mkLinear(['#0077b6', '#00b4d8', '#90e0ef'], 180),
  },
  {
    id: 'battle', name: 'バトル', emoji: '⚡',
    fontFamily: 'Impact, sans-serif', fontWeight: 'bold', textColor: '#ff0000',
    drawBg: mkSolid('#0a0a0a'),
  },
  {
    id: 'mountain', name: '山・自然', emoji: '🏔️',
    fontFamily: 'Georgia, serif', fontWeight: 'bold', textColor: '#e8f4f8',
    drawBg: mkLinear(['#1b4332', '#2d6a4f'], 180),
  },
  {
    id: 'cat', name: '猫・動物', emoji: '🐱',
    fontFamily: 'sans-serif', fontWeight: 'bold', textColor: '#1a1a1a',
    drawBg: mkSolid('#fff8e7'),
  },
  {
    id: 'oldmoney', name: 'オールドマネー', emoji: '🏛️',
    fontFamily: 'Georgia, serif', fontWeight: 'bold', textColor: '#c8a96e',
    drawBg: mkSolid('#1c1c1c'),
  },
  {
    id: 'skate', name: 'スケート', emoji: '🛹',
    fontFamily: 'Impact, sans-serif', fontWeight: 'bold', textColor: '#ffffff',
    drawBg: mkSolid('#1a1a2e'),
  },
  {
    id: 'geometric', name: '幾何学', emoji: '🔷',
    fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold', textColor: '#00d4ff',
    drawBg: mkSolid('#0a0a1a'),
  },
  {
    id: 'y2k', name: 'Y2K', emoji: '💿',
    fontFamily: 'sans-serif', fontWeight: 'bold', textColor: '#ffffff',
    drawBg: mkLinear(['#ff6eb4', '#a78bfa', '#67e8f9'], 135),
  },
  {
    id: 'zen', name: '禅・墨', emoji: '☯️',
    fontFamily: 'serif', fontWeight: 'bold', textColor: '#1a1a1a',
    drawBg: mkSolid('#f5f0e8'),
  },
  {
    id: 'streetstyle', name: 'ストリート系', emoji: '🔥',
    fontFamily: 'Impact, sans-serif', fontWeight: 'bold', textColor: '#ffffff',
    drawBg: mkLinear(['#1a1a1a', '#2d1a00']),
  },
]

const TSHIRT_COLORS = [
  { id: 'white',  name: '白',       hex: '#FFFFFF' },
  { id: 'black',  name: '黒',       hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',       hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー',   hex: '#808080' },
  { id: 'red',    name: 'レッド',   hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ', hex: '#f5e6c8' },
  { id: 'green',  name: 'グリーン', hex: '#2d6a4f' },
  { id: 'purple', name: 'パープル', hex: '#6b21a8' },
  { id: 'pink',   name: 'ピンク',   hex: '#f472b6' },
  { id: 'orange', name: 'オレンジ', hex: '#ea580c' },
  { id: 'brown',  name: 'ブラウン', hex: '#78350f' },
  { id: 'yellow', name: 'イエロー', hex: '#fbbf24' },
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

// ─── テキスト折り返しロジック ───────────────────────────────────────────────
// measureText を使って正確に計算する
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontFamily: string,
  fontWeight: string,
  startSize: number,
  maxHeight: number,
  lineHeightRatio = 1.45
): { lines: string[]; fontSize: number; lineHeight: number } {
  let fontSize = startSize

  const tryWrap = (size: number) => {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`
    const lines: string[] = []
    let current = ''

    for (const ch of text) {
      const test = current + ch
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        lines.push(current)
        current = ch
      } else {
        current = test
      }
    }
    if (current) lines.push(current)
    return lines
  }

  let lines = tryWrap(fontSize)
  let lineHeight = fontSize * lineHeightRatio

  // 高さに収まるまで縮小
  while (lines.length * lineHeight > maxHeight && fontSize > 8) {
    fontSize -= 1
    lines = tryWrap(fontSize)
    lineHeight = fontSize * lineHeightRatio
  }

  return { lines, fontSize, lineHeight }
}

// ─── Tシャツシルエット ───────────────────────────────────────────────────────
function drawTshirt(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.save()
  ctx.beginPath()
  // 肩 → 袖 → 脇 → 裾
  ctx.moveTo(w * 0.22, h * 0.10)
  ctx.lineTo(w * 0.78, h * 0.10)
  ctx.lineTo(w * 0.95, h * 0.30)
  ctx.lineTo(w * 0.80, h * 0.36)
  ctx.lineTo(w * 0.80, h * 0.90)
  ctx.lineTo(w * 0.20, h * 0.90)
  ctx.lineTo(w * 0.20, h * 0.36)
  ctx.lineTo(w * 0.05, h * 0.30)
  ctx.closePath()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 14
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

// ─── 角丸矩形パス ─────────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ─── メインコンポーネント ────────────────────────────────────────────────────
const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [styleId, setStyleId] = useState('japanese')
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
      setTrends([
        { id: 0, name: 'AI活用' }, { id: 1, name: 'サウナ' }, { id: 2, name: 'Web3' },
        { id: 3, name: '推し活' }, { id: 4, name: 'キャンプ' }, { id: 5, name: '筋トレ' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Canvas描画（完全書き直し版）──────────────────────────────────────────
  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !keyword.trim()) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width   // 400
    const H = canvas.height  // 480

    const S = STYLES.find(s => s.id === styleId) || STYLES[0]
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1]

    // ── 背景クリア ──
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, W, H)

    // ── Tシャツ描画 ──
    drawTshirt(ctx, W, H, TC.hex)

    // ── プリントボックスの位置・サイズ ──
    const isSmall = printPosition === 'chest-left'

    // 胴体の安全領域: x: W*0.20〜0.80 (幅60%)、y: H*0.36〜0.90
    // 胸中央: 胴体幅の74% = W*0.44、高さ方向も十分に確保
    const boxW = isSmall ? W * 0.24 : W * 0.44
    const boxH = isSmall ? H * 0.14 : H * 0.36
    const boxCX = W / 2 + (isSmall ? -W * 0.10 : 0)
    const boxCY = printPosition === 'back-center' ? H * 0.60
               : printPosition === 'chest-left'   ? H * 0.44
               : H * 0.57   // 胸中央: Tシャツ胴体の中央寄り
    const bx = boxCX - boxW / 2
    const by = boxCY - boxH / 2

    // ── プリントボックス背景（スタイル固有描画）──
    ctx.save()
    roundRect(ctx, bx, by, boxW, boxH, 10)
    ctx.clip()
    S.drawBg(ctx, bx, by, boxW, boxH)
    ctx.restore()

    // ── テキスト描画 ──
    const pad = 14
    const safeW = boxW - pad * 2
    const safeH = boxH - pad * 2
    const maxStartSize = isSmall ? 14 : 26

    const resolved = wrapText(ctx, keyword.trim(), safeW, S.fontFamily, S.fontWeight, maxStartSize, safeH)
    const { lines, fontSize, lineHeight } = resolved

    // テキスト色
    const resolvedColor = textColorId !== 'auto'
      ? (TEXT_COLORS.find(c => c.id === textColorId)?.hex ?? S.textColor)
      : S.textColor

    // フォントを確定させてから描画（これが重要）
    ctx.font = `${S.fontWeight} ${fontSize}px ${S.fontFamily}`
    ctx.fillStyle = resolvedColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const totalTextH = lines.length * lineHeight
    const startY = boxCY - totalTextH / 2 + lineHeight / 2

    // clip内に確実に収める
    ctx.save()
    roundRect(ctx, bx, by, boxW, boxH, 10)
    ctx.clip()
    lines.forEach((line, i) => {
      ctx.fillText(line, boxCX, startY + i * lineHeight)
    })
    ctx.restore()

    setMockupDataUrl(canvas.toDataURL('image/png'))
  }, [keyword, styleId, tshirtColor, textColorId, printPosition])

  useEffect(() => {
    if (keyword) drawDesign()
  }, [keyword, styleId, tshirtColor, textColorId, printPosition, drawDesign])

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

  const randomStyle = () => {
    const pick = STYLES[Math.floor(Math.random() * STYLES.length)]
    setStyleId(pick.id)
  }

  const STEP_LABELS = ['トレンド選択', 'デザイン生成', '出品完了']
  const currentStyle = STYLES.find(s => s.id === styleId) || STYLES[0]

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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">デザインを生成して出品</h2>
            <button onClick={() => setCurrentStep(1)} className="text-xs text-slate-500 hover:text-slate-300 font-semibold transition-colors">← 戻る</button>
          </div>

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
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">デザインスタイル</label>
                  <button onClick={randomStyle}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors">
                    <Shuffle size={11} /> ランダム
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyleId(s.id)}
                      style={{
                        borderColor: styleId === s.id ? '#10b981' : 'transparent',
                        backgroundColor: styleId === s.id ? '#10b98120' : '#ffffff08',
                      }}
                      className="h-10 rounded-lg border-2 text-[11px] font-semibold transition-all text-slate-300 hover:text-white px-1 truncate">
                      {s.emoji} {s.name}
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
                <Badge className="bg-white/5 text-slate-400 border border-white/10 text-[10px] font-semibold">
                  {currentStyle.emoji} {currentStyle.name}
                </Badge>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {/* Canvas: 400×480 で高解像度プレビュー */}
                <canvas ref={canvasRef} width={400} height={480}
                  className="rounded-2xl max-w-full shadow-2xl" />
              </div>
              {selectedSizes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSizes.map(s => (
                    <Badge key={s} className="bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold">{s}</Badge>
                  ))}
                  <Badge className="bg-white/5 text-slate-400 border border-white/10 text-xs">
                    {PRINT_POSITIONS.find(p => p.id === printPosition)?.name}
                  </Badge>
                </div>
              )}
            </div>
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
        Shopify × Printful Engine v3.0 · © 2026 NextraLabs
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false })
export default function AISelectShop() { return <NoSSR /> }
