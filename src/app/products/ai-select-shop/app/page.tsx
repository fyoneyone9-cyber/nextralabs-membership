'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Loader2, CheckCircle2, Zap, ShoppingCart,
  TrendingUp, Package, RefreshCw, ExternalLink, AlertCircle, Shuffle
} from 'lucide-react'
import { AccessGate } from '@/components/tools/AccessGate'

// ──────────────────────────────────────────────
// デザインスタイル定義（描画ロジック付き）
// ──────────────────────────────────────────────
type StyleDef = {
  id: string
  name: string
  draw: (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, text: string, pw: number, ph: number) => void
}

function parseFontSize(font: string): number {
  const m = font.match(/(\d+(?:\.\d+)?)px/)
  return m ? parseFloat(m[1]) : NaN
}

function drawFitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  stroke = false
) {
  const savedFont = ctx.font
  let safety = 0
  while (ctx.measureText(text).width > maxWidth && safety < 30) {
    const currentSize = parseFontSize(ctx.font)
    if (isNaN(currentSize) || currentSize <= 14) break
    const newSize = Math.max(14, Math.floor(currentSize * 0.88))
    ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, `${newSize}px`)
    safety++
  }
  if (ctx.measureText(text).width > maxWidth) {
    ctx.font = savedFont
    const half = Math.ceil(text.length / 2)
    let splitIdx = half
    const spaceIdx = text.indexOf(' ', Math.floor(text.length * 0.3))
    const midSpaceIdx = text.lastIndexOf(' ', Math.ceil(text.length * 0.7))
    if (midSpaceIdx > 0) splitIdx = midSpaceIdx
    else if (spaceIdx > 0) splitIdx = spaceIdx

    const line1 = text.slice(0, splitIdx).trim()
    const line2 = text.slice(splitIdx).trim()
    const longer = line1.length >= line2.length ? line1 : line2
    let safety2 = 0
    while (ctx.measureText(longer).width > maxWidth && safety2 < 30) {
      const currentSize = parseFontSize(ctx.font)
      if (isNaN(currentSize) || currentSize <= 10) break
      const newSize = Math.max(10, Math.floor(currentSize * 0.88))
      ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, `${newSize}px`)
      safety2++
    }
    const lineH = (parseFontSize(ctx.font) || 14) * 1.3
    if (stroke) {
      ctx.strokeText(line1, x, y - lineH / 2)
      ctx.strokeText(line2, x, y + lineH / 2)
    }
    ctx.fillText(line1, x, y - lineH / 2)
    ctx.fillText(line2, x, y + lineH / 2)
    return
  }
  if (stroke) ctx.strokeText(text, x, y)
  ctx.fillText(text, x, y)
}

const STYLES: StyleDef[] = [
  {
    id: 'japanese', name: '⛩ 和風',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle = '#fafaf7'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      ctx.strokeStyle = 'rgba(192,57,43,0.15)'; ctx.lineWidth = 1.5
      const sz = 28
      for (let row = 0; row * sz < ph + sz; row++) {
        for (let col = -1; col * sz < pw + sz; col++) {
          const ox = cx - pw/2 + col*sz + (row%2)*sz/2
          const oy = cy - ph/2 + row*sz*0.7
          ctx.beginPath(); ctx.arc(ox, oy, sz*0.55, 0, Math.PI); ctx.stroke()
        }
      }
      ctx.fillStyle = '#c0392b'
      ctx.beginPath(); ctx.arc(cx, cy - r*0.15, r*0.62, 0, Math.PI*2); ctx.fill()
      ctx.font = `bold ${Math.floor(r*0.44)}px serif`
      ctx.fillStyle = '#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy - r*0.15, pw * 0.88)
    },
  },
  {
    id: 'street', name: '🏙 街',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle = '#0d0d0d'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      const bw=36, bh=18
      for (let row=0; row*bh<ph+bh; row++) {
        const offset = (row%2)*bw/2
        for (let col=-1; col*bw<pw+bw; col++) {
          const bx=cx-pw/2+col*bw+offset, by=cy-ph/2+row*bh
          ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=1
          ctx.strokeRect(bx,by,bw,bh)
        }
      }
      ctx.shadowColor='#ffdd00'; ctx.shadowBlur=16
      ctx.font=`900 ${Math.floor(r*0.52)}px Impact,sans-serif`
      ctx.fillStyle='#ffdd00'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.strokeStyle='#000'; ctx.lineWidth=4
      drawFitText(ctx, text, cx, cy, pw * 0.88, true)
      ctx.shadowBlur=0
      ctx.font=`700 ${Math.floor(r*0.17)}px Helvetica,sans-serif`
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText('STREET WEAR', cx, cy+r*0.6)
    },
  },
  {
    id: 'retro', name: '📻 レトロ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#f5e6c8'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      ctx.strokeStyle='rgba(92,61,30,0.12)'; ctx.lineWidth=6
      for (let i=-ph; i<pw+ph; i+=22) {
        ctx.beginPath()
        ctx.moveTo(cx-pw/2+i, cy-ph/2)
        ctx.lineTo(cx-pw/2+i+ph, cy+ph/2)
        ctx.stroke()
      }
      ctx.fillStyle='#5c3d1e'
      ctx.beginPath(); ctx.arc(cx, cy-r*0.1, r*0.65, 0, Math.PI*2); ctx.fill()
      ctx.strokeStyle='#f5e6c8'; ctx.lineWidth=3
      ctx.beginPath(); ctx.arc(cx, cy-r*0.1, r*0.58, 0, Math.PI*2); ctx.stroke()
      ctx.font=`bold ${Math.floor(r*0.4)}px Georgia,serif`
      ctx.fillStyle='#f5e6c8'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy - r*0.1, pw * 0.88)
      ctx.font=`${Math.floor(r*0.16)}px Georgia,serif`
      ctx.fillStyle='rgba(245,230,200,0.7)'; ctx.fillText('VINTAGE', cx, cy+r*0.52)
    },
  },
  {
    id: 'cyberpunk', name: '🌃 サイバー',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#000010'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      ctx.strokeStyle='rgba(0,255,255,0.18)'; ctx.lineWidth=1
      const grid=24
      for (let x=cx-pw/2; x<cx+pw/2; x+=grid) {
        ctx.beginPath(); ctx.moveTo(x, cy-ph/2); ctx.lineTo(x, cy+ph/2); ctx.stroke()
      }
      for (let y=cy-ph/2; y<cy+ph/2; y+=grid) {
        ctx.beginPath(); ctx.moveTo(cx-pw/2, y); ctx.lineTo(cx+pw/2, y); ctx.stroke()
      }
      ctx.fillStyle='rgba(0,255,255,0.3)'
      for (let x=cx-pw/2; x<cx+pw/2; x+=grid) {
        for (let y=cy-ph/2; y<cy+ph/2; y+=grid) {
          ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill()
        }
      }
      ctx.shadowColor='#00ffff'; ctx.shadowBlur=20
      ctx.font=`bold ${Math.floor(r*0.48)}px monospace`
      ctx.fillStyle='#00ffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
      ctx.strokeStyle='#ff00ff'; ctx.lineWidth=2
      ctx.beginPath(); ctx.moveTo(cx-r*0.7,cy+r*0.42); ctx.lineTo(cx+r*0.7,cy+r*0.42); ctx.stroke()
    },
  },
  {
    id: 'kawaii', name: '🎀 カワイイ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      const bg=ctx.createLinearGradient(cx-pw/2,cy-ph/2,cx+pw/2,cy+ph/2)
      bg.addColorStop(0,'#ffe4f0'); bg.addColorStop(1,'#ffd6e7')
      ctx.fillStyle=bg; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      ctx.fillStyle='rgba(255,105,180,0.18)'
      for (let x=cx-pw/2+10; x<cx+pw/2; x+=20) {
        for (let y=cy-ph/2+10; y<cy+ph/2; y+=20) {
          ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill()
        }
      }
      const hearts=['💕','🌸','✨','🎀','💖']
      hearts.forEach((h,i)=>{
        const angle=(i/hearts.length)*Math.PI*2 - Math.PI/2
        ctx.font=`${Math.floor(r*0.22)}px sans-serif`
        ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText(h, cx+Math.cos(angle)*r*0.78, cy+Math.sin(angle)*r*0.78)
      })
      ctx.font=`bold ${Math.floor(r*0.44)}px sans-serif`
      ctx.fillStyle='#c2185b'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
    },
  },
  {
    id: 'minimal', name: '⬜ ミニマル',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#fafafa'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      ctx.strokeStyle='rgba(0,0,0,0.05)'; ctx.lineWidth=0.5
      const g=20
      for (let x=cx-pw/2; x<cx+pw/2; x+=g){ctx.beginPath();ctx.moveTo(x,cy-ph/2);ctx.lineTo(x,cy+ph/2);ctx.stroke()}
      for (let y=cy-ph/2; y<cy+ph/2; y+=g){ctx.beginPath();ctx.moveTo(cx-pw/2,y);ctx.lineTo(cx+pw/2,y);ctx.stroke()}
      ctx.font=`200 ${Math.floor(r*0.42)}px Helvetica,sans-serif`
      ctx.fillStyle='#111'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.strokeStyle='#111'; ctx.lineWidth=1.5
      ctx.beginPath(); ctx.moveTo(cx-r*0.45,cy+r*0.38); ctx.lineTo(cx+r*0.45,cy+r*0.38); ctx.stroke()
    },
  },
  {
    id: 'gold', name: '💎 高級',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#080800'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      ctx.strokeStyle='rgba(212,175,55,0.2)'; ctx.lineWidth=1
      const d=28
      for (let x=cx-pw/2-d; x<cx+pw/2+d; x+=d) {
        for (let y=cy-ph/2-d; y<cy+ph/2+d; y+=d) {
          ctx.beginPath()
          ctx.moveTo(x,y-d/2); ctx.lineTo(x+d/2,y)
          ctx.lineTo(x,y+d/2); ctx.lineTo(x-d/2,y)
          ctx.closePath(); ctx.stroke()
        }
      }
      const tg=ctx.createLinearGradient(cx,cy-r*0.3,cx,cy+r*0.3)
      tg.addColorStop(0,'#ffe566'); tg.addColorStop(0.5,'#d4af37'); tg.addColorStop(1,'#b8960c')
      ctx.shadowColor='rgba(212,175,55,0.6)'; ctx.shadowBlur=14
      ctx.font=`bold ${Math.floor(r*0.44)}px Georgia,serif`
      ctx.fillStyle=tg; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
      const bg2=ctx.createLinearGradient(cx-r,cy,cx+r,cy)
      bg2.addColorStop(0,'#b8960c'); bg2.addColorStop(0.5,'#ffe566'); bg2.addColorStop(1,'#b8960c')
      ctx.strokeStyle=bg2; ctx.lineWidth=2
      ctx.strokeRect(cx-r*0.88,cy-r*0.6,r*1.76,r*1.2)
    },
  },
  {
    id: 'neon', name: '💡 ネオン',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#000000'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      const lineColors=['#ff00ff','#00ffff','#ff6600','#39ff14','#ff0066']
      lineColors.forEach((c,i)=>{
        const x = cx-pw/2 + (i+1)*(pw/(lineColors.length+1))
        ctx.strokeStyle=c; ctx.lineWidth=2
        ctx.shadowColor=c; ctx.shadowBlur=8
        ctx.beginPath(); ctx.moveTo(x,cy-ph/2+8); ctx.lineTo(x,cy+ph/2-8); ctx.stroke()
        ctx.shadowBlur=0
      })
      ctx.shadowColor='#39ff14'; ctx.shadowBlur=22
      ctx.font=`bold ${Math.floor(r*0.5)}px monospace`
      ctx.fillStyle='#39ff14'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
      ctx.strokeStyle='#39ff14'; ctx.lineWidth=2; ctx.shadowColor='#39ff14'; ctx.shadowBlur=10
      ctx.strokeRect(cx-pw/2+4,cy-ph/2+4,pw-8,ph-8)
      ctx.shadowBlur=0
    },
  },
]

type TshirtColor = {
  id: string
  name: string
  hex: string
  pattern?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}

function drawTieDye(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const colors = ['#e91e63','#9c27b0','#3f51b5','#00bcd4','#4caf50','#ffeb3b','#ff5722']
  colors.forEach((c, i) => {
    const g = ctx.createRadialGradient(
      w * (0.2 + (i % 3) * 0.3), h * (0.2 + Math.floor(i / 3) * 0.3), 0,
      w * (0.2 + (i % 3) * 0.3), h * (0.2 + Math.floor(i / 3) * 0.3), w * 0.4
    )
    g.addColorStop(0, c + 'cc')
    g.addColorStop(1, c + '00')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  })
}

const TSHIRT_COLORS: TshirtColor[] = [
  { id: 'white',  name: '白',        hex: '#FFFFFF' },
  { id: 'black',  name: '黒',        hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',        hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー',    hex: '#808080' },
  { id: 'red',    name: 'レッド',    hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ',  hex: '#f5e6c8' },
  { id: 'tiedye',  name: 'タイダイ',      hex: '#9c27b0', pattern: drawTieDye },
]

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

function drawTshirtShape(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath()
  ctx.moveTo(w * 0.20, h * 0.08)
  ctx.lineTo(w * 0.35, h * 0.04)
  ctx.quadraticCurveTo(w * 0.50, h * 0.14, w * 0.65, h * 0.04)
  ctx.lineTo(w * 0.80, h * 0.08)
  ctx.lineTo(w * 0.97, h * 0.28)
  ctx.lineTo(w * 0.80, h * 0.34)
  ctx.lineTo(w * 0.80, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.34)
  ctx.lineTo(w * 0.03, h * 0.28)
  ctx.closePath()
}

export default function AISelectShopPage() {
  const router = useRouter()
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) router.push('/dashboard')
      else window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  const handleBack = useCallback(() => {
    if (window.confirm('ツールを終了しますか？')) router.push('/dashboard')
  }, [router])

  return (
    <AccessGate productId="ai-select-shop">
      <AISelectShopApp handleBack={handleBack} />
    </AccessGate>
  )
}

function AISelectShopApp({ handleBack }: { handleBack: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [styleId, setStyleId] = useState('japanese')
  const [tshirtColorId, setTshirtColorId] = useState('black')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL'])
  const [mockupDataUrl, setMockupDataUrl] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fetchTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' })
      const d = await r.json()
      if (d.trends) setTrends(d.trends.slice(0, 9).map((t: string, i: number) => ({ id: i, name: t })))
    } catch {
      setTrends(['AI活用術', '副業', 'キャンプ'].map((t, i) => ({ id: i, name: t })))
    } finally {
      setIsLoadingTrends(false)
    }
  }
  useEffect(() => { fetchTrends() }, [])

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !keyword) return
    const ctx = canvas.getContext('2d')!
    const w = canvas.width, h = canvas.height
    const S = STYLES.find(s => s.id === styleId) || STYLES[0]
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColorId) || TSHIRT_COLORS[1]
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h)
    ctx.save(); drawTshirtShape(ctx, w, h); ctx.clip()
    if (TC.pattern) TC.pattern(ctx, w, h); else { ctx.fillStyle = TC.hex; ctx.fillRect(0, 0, w, h) }
    ctx.restore()
    const px = w * 0.27, py = h * 0.33, pw = w * 0.46, ph = h * 0.36
    ctx.save()
    ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip()
    S.draw(ctx, px + pw/2, py + ph/2, Math.min(pw, ph)*0.44, keyword, pw, ph)
    ctx.restore()
    setMockupDataUrl(canvas.toDataURL('image/png'))
  }, [keyword, styleId, tshirtColorId])

  useEffect(() => { if (keyword) drawDesign() }, [keyword, styleId, tshirtColorId, drawDesign])

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-product', keyword, style: styleId, mockupUrl: mockupDataUrl }),
      })
      const data = await res.json()
      setPublishResult({ url: data.url || '#' })
      setStep(3)
    } catch { setPublishResult({ error: '出品に失敗しました' }) }
    finally { setIsPublishing(false) }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      <div className="h-1 bg-emerald-500 w-full" />
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <button onClick={handleBack} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">← 戻る</button>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-white tracking-tight">AIセレクトショップ</h1>
          <p className="text-slate-400 text-sm">トレンドから商品を作り、Shopifyへ自動出品します。</p>
        </div>
        <div className="flex gap-1 bg-[#1e293b] p-1 rounded-xl max-w-sm">
          {[1,2,3].map(n => (
            <button key={n} onClick={() => setStep(n as any)} className={`flex-1 py-2 rounded-lg text-sm ${step === n ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Step {n}</button>
          ))}
        </div>
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trends.map(t => (
              <button key={t.id} onClick={() => { setKeyword(t.name); setStep(2) }} className="h-20 bg-[#1e293b] border border-slate-700 rounded-xl px-5 text-left hover:border-emerald-500 transition-all">{t.name}</button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full h-11 bg-[#0f172a] border border-slate-700 rounded-lg px-4 text-white" />
              <div className="grid grid-cols-4 gap-1.5">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyleId(s.id)} className={`py-2 rounded-lg text-xs ${styleId === s.id ? 'bg-emerald-500 text-slate-950' : 'bg-[#0f172a] text-slate-400'}`}>{s.name}</button>
                ))}
              </div>
              <button onClick={handlePublish} disabled={isPublishing} className="w-full h-12 bg-emerald-500 text-slate-950 font-semibold rounded-xl">
                {isPublishing ? '出品中...' : 'Shopifyへ自動出品'}
              </button>
            </div>
            <div className="bg-[#1e293b] p-5 rounded-xl flex flex-col items-center">
              <canvas ref={canvasRef} width={400} height={500} className="max-w-full rounded-xl" />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-emerald-500/30">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">出品が完了しました！</h2>
            <p className="text-slate-400 mt-2 mb-8">Shopifyストアを確認してください。</p>
            <button onClick={() => setStep(1)} className="h-11 px-8 bg-emerald-500 text-slate-950 font-semibold rounded-xl">新しいデザインを作る</button>
          </div>
        )}
      </div>
    </div>
  )
}
