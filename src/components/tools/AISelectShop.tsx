'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ==================== Types ====================
interface TrendKeyword {
  id: string
  name: string
  score: number
  category: string
  direction: '↑' | '↗' | '→' | '↘' | '↓'
  traffic: string
  link: string
}

interface DesignRecord {
  id: string
  keyword: string
  style: string
  colorScheme: string[]
  tshirtColor: string
  sizes: string[]
  sellingPrice: number
  baseCost: number
  markup: number
  status: '出品中' | '下書き' | '売り切れ'
  createdAt: string
  canvasDataUrl: string
}

interface SaleRecord {
  id: string
  designId: string
  quantity: number
  revenue: number
  timestamp: string
}

interface AppSettings {
  defaultMarkup: number
  defaultTshirtColor: string
  autoGenerateCount: number
  printfulApiKey: string
  printfulStoreId: string
  shopifyDomain: string
  shopifyClientId: string
  shopifyClientSecret: string
}

// ==================== Constants ====================
const STORAGE_KEYS = {
  designs: 'ai-select-shop-designs',
  sales: 'ai-select-shop-sales',
  settings: 'ai-select-shop-settings',
  trends: 'ai-select-shop-trends',
}

const STYLES = [
  { id: 'minimal', name: 'ミニマル', emoji: '⬜' },
  { id: 'street', name: 'ストリート', emoji: '🏙️' },
  { id: 'retro', name: 'レトロ', emoji: '📻' },
  { id: 'cyberpunk', name: 'サイバーパンク', emoji: '🌃' },
  { id: 'kawaii', name: 'かわいい', emoji: '🎀' },
  { id: 'typography', name: 'タイポグラフィ', emoji: '🔤' },
  { id: 'graffiti', name: 'グラフィティ', emoji: '🎨' },
  { id: 'japanese', name: '和風', emoji: '⛩️' },
  { id: 'sports', name: 'スポーツ', emoji: '⚡' },
  { id: 'vintage', name: 'ヴィンテージ', emoji: '🏺' },
  { id: 'neon_sign', name: 'ネオンサイン', emoji: '💡' },
  { id: 'abstract', name: 'アブストラクト', emoji: '🔮' },
]

const COLOR_SCHEMES = [
  { id: 'neon', name: 'ネオン', colors: ['#00ff88', '#00ccff', '#ff00ff'] },
  { id: 'sunset', name: 'サンセット', colors: ['#ff6b35', '#f7c59f', '#efefd0'] },
  { id: 'ocean', name: 'オーシャン', colors: ['#0077b6', '#00b4d8', '#90e0ef'] },
  { id: 'sakura', name: '桜', colors: ['#ffb7c5', '#ff69b4', '#fff0f5'] },
  { id: 'forest', name: 'フォレスト', colors: ['#2d6a4f', '#52b788', '#d8f3dc'] },
  { id: 'midnight', name: 'ミッドナイト', colors: ['#7b2cbf', '#c77dff', '#e0aaff'] },
  { id: 'fire', name: 'ファイア', colors: ['#ff4500', '#ff8c00', '#ffd700'] },
  { id: 'monochrome', name: 'モノクロ', colors: ['#ffffff', '#888888', '#333333'] },
  { id: 'toxic', name: 'トキシック', colors: ['#39ff14', '#00ff00', '#003300'] },
  { id: 'candy', name: 'キャンディ', colors: ['#ff9ef0', '#ffb347', '#87ceeb'] },
  { id: 'aurora', name: 'オーロラ', colors: ['#00c9ff', '#92fe9d', '#f7971e'] },
  { id: 'blood', name: 'ブラッド', colors: ['#8b0000', '#dc143c', '#ff6347'] },
]

const TSHIRT_COLORS: { id: string; name: string; hex: string; textColor: string }[] = [
  { id: 'white', name: '白', hex: '#FFFFFF', textColor: '#000000' },
  { id: 'black', name: '黒', hex: '#1a1a1a', textColor: '#FFFFFF' },
  { id: 'gray', name: 'グレー', hex: '#6b7280', textColor: '#FFFFFF' },
  { id: 'navy', name: 'ネイビー', hex: '#1e3a5f', textColor: '#FFFFFF' },
  { id: 'khaki', name: 'カーキ', hex: '#8b7355', textColor: '#FFFFFF' },
  { id: 'red', name: 'レッド', hex: '#c0392b', textColor: '#FFFFFF' },
  { id: 'forest', name: 'フォレスト', hex: '#1a5e2a', textColor: '#FFFFFF' },
  { id: 'purple', name: 'パープル', hex: '#6b21a8', textColor: '#FFFFFF' },
  { id: 'beige', name: 'ベージュ', hex: '#d4b483', textColor: '#000000' },
  { id: 'charcoal', name: 'チャコール', hex: '#36454f', textColor: '#FFFFFF' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

const DEFAULT_SETTINGS: AppSettings = {
  defaultMarkup: 150,
  defaultTshirtColor: 'black',
  autoGenerateCount: 3,
  printfulApiKey: '',
  printfulStoreId: '',
  shopifyDomain: 'z5ju1n-vs.myshopify.com',
  shopifyClientId: '67b4f4e95c3a421925f45fffc42b7327',
  shopifyClientSecret: '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',
}

// Normalize Shopify domain input — accept admin URL or bare store name
function normalizeShopifyDomain(input: string): string {
  let v = input.trim()
  const adminMatch = v.match(/admin\.shopify\.com\/store\/([a-zA-Z0-9_-]+)/)
  if (adminMatch) return `${adminMatch[1]}.myshopify.com`
  const fullMatch = v.match(/([a-zA-Z0-9_-]+)\.myshopify\.com/)
  if (fullMatch) return `${fullMatch[1]}.myshopify.com`
  if (v && !v.includes('.')) return `${v}.myshopify.com`
  return v
}

// ==================== Helpers ====================
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function trafficToScore(traffic: string): number {
  const num = parseInt(traffic.replace(/[^0-9]/g, ''), 10)
  if (!num || isNaN(num)) return 50
  if (num >= 500000) return 98
  if (num >= 200000) return 90
  if (num >= 100000) return 80
  if (num >= 50000) return 70
  if (num >= 20000) return 60
  if (num >= 10000) return 50
  return 40
}

function trafficToNumber(traffic: string): number {
  const num = parseInt(traffic.replace(/[^0-9]/g, ''), 10)
  if (!num || isNaN(num)) return 0
  return num
}

function scoreToDirection(score: number): TrendKeyword['direction'] {
  if (score >= 80) return '↑'
  if (score >= 60) return '↗'
  if (score >= 40) return '→'
  if (score >= 20) return '↘'
  return '↓'
}

async function fetchRealTrends(): Promise<TrendKeyword[]> {
  try {
    const res = await fetch('/api/tools/trends')
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return (data.trends || []).map((t: any, i: number) => {
      const score = trafficToScore(t.traffic || '')
      return {
        id: `rt-${i}`,
        name: t.title,
        score,
        category: 'トレンド',
        direction: scoreToDirection(score),
        traffic: t.traffic || '',
        link: t.link || '',
      }
    })
  } catch {
    return []
  }
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// ==================== Canvas Drawing ====================
function drawTshirt(
  canvas: HTMLCanvasElement,
  keyword: string,
  styleId: string,
  scheme: string[],
  tshirtHex: string,
  tshirtTextColor: string,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  // Background
  ctx.fillStyle = '#0f0f1a'
  ctx.fillRect(0, 0, w, h)

  // T-shirt shape
  ctx.beginPath()
  ctx.moveTo(w * 0.15, h * 0.12)
  ctx.lineTo(w * 0.05, h * 0.28)
  ctx.lineTo(w * 0.2, h * 0.32)
  ctx.lineTo(w * 0.2, h * 0.88)
  ctx.lineTo(w * 0.8, h * 0.88)
  ctx.lineTo(w * 0.8, h * 0.32)
  ctx.lineTo(w * 0.95, h * 0.28)
  ctx.lineTo(w * 0.85, h * 0.12)
  ctx.lineTo(w * 0.62, h * 0.08)
  ctx.quadraticCurveTo(w * 0.5, h * 0.14, w * 0.38, h * 0.08)
  ctx.closePath()

  ctx.fillStyle = tshirtHex
  ctx.fill()
  ctx.strokeStyle = tshirtHex === '#FFFFFF' ? '#cccccc' : 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
  ctx.stroke()

  const cx = w * 0.5
  const cy = h * 0.48
  const maxTextWidth = w * 0.5

  ctx.save()
  ctx.beginPath()
  ctx.rect(w * 0.22, h * 0.18, w * 0.56, h * 0.65)
  ctx.clip()

  switch (styleId) {
    case 'minimal': {
      ctx.font = `${Math.floor(w * 0.06)}px "Helvetica Neue", Arial, sans-serif`
      ctx.fillStyle = scheme[0]
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(keyword, cx, cy, maxTextWidth)
      ctx.strokeStyle = scheme[1] || scheme[0]
      ctx.lineWidth = 1
      ctx.beginPath()
      const textM = ctx.measureText(keyword)
      const lw = Math.min(textM.width, maxTextWidth)
      ctx.moveTo(cx - lw / 2, cy + w * 0.05)
      ctx.lineTo(cx + lw / 2, cy + w * 0.05)
      ctx.stroke()
      break
    }
    case 'street': {
      ctx.font = `900 ${Math.floor(w * 0.1)}px Impact, "Arial Black", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillText(keyword.toUpperCase(), cx + 3, cy + 3, maxTextWidth)
      ctx.fillStyle = scheme[0]
      ctx.fillText(keyword.toUpperCase(), cx, cy, maxTextWidth)
      ctx.strokeStyle = scheme[1] || scheme[0]
      ctx.lineWidth = 3
      ctx.strokeRect(cx - maxTextWidth / 2 - 10, cy - w * 0.08, maxTextWidth + 20, w * 0.16)
      break
    }
    case 'retro': {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-0.08)
      ctx.font = `bold italic ${Math.floor(w * 0.08)}px Georgia, "Times New Roman", serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = scheme[0]
      ctx.fillText(keyword, 0, 0, maxTextWidth)
      ctx.font = `${Math.floor(w * 0.04)}px sans-serif`
      ctx.fillStyle = scheme[1] || scheme[0]
      ctx.fillText('★  ★  ★', 0, w * 0.07)
      ctx.restore()
      break
    }
    case 'cyberpunk': {
      const fontSize = Math.floor(w * 0.08)
      ctx.font = `bold ${fontSize}px "Courier New", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ff003c'
      ctx.globalAlpha = 0.7
      ctx.fillText(keyword, cx - 3, cy - 2, maxTextWidth)
      ctx.fillStyle = '#00ffff'
      ctx.globalAlpha = 0.7
      ctx.fillText(keyword, cx + 3, cy + 2, maxTextWidth)
      ctx.globalAlpha = 1.0
      ctx.fillStyle = scheme[0]
      ctx.fillText(keyword, cx, cy, maxTextWidth)
      ctx.strokeStyle = 'rgba(0,255,255,0.15)'
      ctx.lineWidth = 1
      for (let i = 0; i < h; i += 4) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(w, i)
        ctx.stroke()
      }
      break
    }
    case 'kawaii': {
      ctx.font = `bold ${Math.floor(w * 0.07)}px "Segoe UI", "Hiragino Maru Gothic Pro", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = scheme[0]
      ctx.fillText(keyword, cx, cy, maxTextWidth)
      ctx.font = `${Math.floor(w * 0.05)}px sans-serif`
      ctx.fillText('✨ 💖 ✨', cx, cy - w * 0.09)
      ctx.fillText('🌸 🎀 🌸', cx, cy + w * 0.09)
      break
    }
    case 'typography': {
      ctx.font = `900 ${Math.floor(w * 0.13)}px Impact, "Arial Black", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = scheme[0]
      ctx.globalAlpha = 0.3
      ctx.fillText(keyword.charAt(0), cx, cy, maxTextWidth)
      ctx.globalAlpha = 1
      ctx.font = `bold ${Math.floor(w * 0.07)}px "Helvetica Neue", Arial, sans-serif`
      ctx.fillStyle = scheme[1] || scheme[0]
      ctx.fillText(keyword, cx, cy, maxTextWidth)
      ctx.font = `${Math.floor(w * 0.03)}px sans-serif`
      ctx.fillStyle = scheme[2] || scheme[0]
      ctx.fillText('DESIGN BY AI SELECT SHOP', cx, cy + w * 0.07)
      break
    }
    case 'graffiti': {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-0.15)
      const gFont = `900 ${Math.floor(w * 0.11)}px Impact, "Arial Black", sans-serif`
      ctx.font = gFont
      // spray paint bleed layers
      const alphas = [0.08, 0.12, 0.15, 0.1]
      const offsets = [[-4, -4], [4, -3], [-3, 4], [5, 3]]
      alphas.forEach((a, idx) => {
        ctx.globalAlpha = a
        ctx.fillStyle = scheme[0]
        ctx.fillText(keyword.toUpperCase(), offsets[idx][0] * 2, offsets[idx][1] * 2, maxTextWidth)
      })
      ctx.globalAlpha = 1.0
      ctx.fillStyle = scheme[0]
      ctx.fillText(keyword.toUpperCase(), 0, 0, maxTextWidth)
      ctx.globalAlpha = 0.6
      ctx.fillStyle = scheme[1] || scheme[0]
      ctx.font = `900 ${Math.floor(w * 0.115)}px Impact, "Arial Black", sans-serif`
      ctx.fillText(keyword.toUpperCase(), 2, 2, maxTextWidth)
      ctx.globalAlpha = 1.0
      ctx.restore()
      break
    }
    case 'japanese': {
      // circular red background
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = '#c0392b'
      ctx.globalAlpha = 0.85
      ctx.fill()
      ctx.globalAlpha = 1.0
      // vertical text simulation
      const chars = keyword.split('')
      const charSize = Math.floor(w * 0.07)
      ctx.font = `bold ${charSize}px "Hiragino Mincho ProN", "Yu Mincho", serif`
      ctx.fillStyle = '#fff8f0'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const totalH = chars.length * charSize * 1.2
      chars.forEach((ch, i) => {
        ctx.fillText(ch, cx, cy - totalH / 2 + charSize * 0.6 + i * charSize * 1.2)
      })
      ctx.restore()
      break
    }
    case 'sports': {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      // arched text at top
      const archRadius = w * 0.32
      const archText = keyword.toUpperCase()
      const archFontSize = Math.floor(w * 0.075)
      ctx.font = `900 ${archFontSize}px Impact, "Arial Black", sans-serif`
      ctx.fillStyle = scheme[0]
      const angleStep = (Math.PI * 0.7) / Math.max(archText.length - 1, 1)
      const startAngle = -Math.PI * 0.5 - (Math.PI * 0.35)
      archText.split('').forEach((ch, i) => {
        ctx.save()
        const angle = startAngle + i * angleStep
        ctx.translate(cx + archRadius * Math.cos(angle), cy - w * 0.12 + archRadius * Math.sin(angle))
        ctx.rotate(angle + Math.PI / 2)
        ctx.fillText(ch, 0, 0)
        ctx.restore()
      })
      // large number
      ctx.font = `900 ${Math.floor(w * 0.22)}px Impact, "Arial Black", sans-serif`
      ctx.fillStyle = scheme[1] || scheme[0]
      ctx.globalAlpha = 0.9
      ctx.fillText('99', cx, cy + w * 0.12)
      ctx.globalAlpha = 1.0
      break
    }
    case 'vintage': {
      // sepia toned, decorative border
      ctx.save()
      const vintageColor = '#c8a96e'
      ctx.strokeStyle = vintageColor
      ctx.lineWidth = 2
      ctx.strokeRect(cx - maxTextWidth / 2 - 5, cy - w * 0.12, maxTextWidth + 10, w * 0.24)
      ctx.strokeRect(cx - maxTextWidth / 2 - 9, cy - w * 0.13, maxTextWidth + 18, w * 0.26)
      ctx.font = `bold italic ${Math.floor(w * 0.075)}px Georgia, "Times New Roman", serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = vintageColor
      ctx.fillText(keyword, cx, cy, maxTextWidth)
      ctx.font = `${Math.floor(w * 0.028)}px Georgia, serif`
      ctx.fillStyle = scheme[1] || vintageColor
      ctx.globalAlpha = 0.8
      ctx.fillText('EST. 2025  ·  HANDCRAFTED', cx, cy + w * 0.085)
      ctx.globalAlpha = 1.0
      ctx.restore()
      break
    }
    case 'neon_sign': {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const neonColors = [scheme[0], scheme[1] || '#ff00ff', scheme[2] || '#00ffff']
      ctx.font = `bold ${Math.floor(w * 0.085)}px "Courier New", monospace`
      // multi-layer glow
      neonColors.forEach((color, idx) => {
        ctx.shadowColor = color
        ctx.shadowBlur = 18 + idx * 10
        ctx.fillStyle = color
        ctx.globalAlpha = 0.35
        ctx.fillText(keyword, cx, cy, maxTextWidth)
      })
      ctx.shadowBlur = 30
      ctx.shadowColor = neonColors[0]
      ctx.globalAlpha = 1.0
      ctx.fillStyle = '#ffffff'
      ctx.fillText(keyword, cx, cy, maxTextWidth)
      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'
      break
    }
    case 'abstract': {
      // geometric background shapes
      const geoColors = [scheme[0], scheme[1] || '#ff00ff', scheme[2] || '#00ffff']
      const shapes = [
        { x: cx - w * 0.15, y: cy - h * 0.1, r: w * 0.12 },
        { x: cx + w * 0.1, y: cy + h * 0.05, r: w * 0.09 },
        { x: cx - w * 0.05, y: cy + h * 0.08, r: w * 0.07 },
      ]
      shapes.forEach((s, i) => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = geoColors[i % geoColors.length]
        ctx.globalAlpha = 0.25
        ctx.fill()
      })
      // triangle
      ctx.beginPath()
      ctx.moveTo(cx, cy - h * 0.14)
      ctx.lineTo(cx + w * 0.18, cy + h * 0.06)
      ctx.lineTo(cx - w * 0.18, cy + h * 0.06)
      ctx.closePath()
      ctx.fillStyle = geoColors[1]
      ctx.globalAlpha = 0.18
      ctx.fill()
      ctx.globalAlpha = 1.0
      // text overlay
      ctx.font = `bold ${Math.floor(w * 0.075)}px "Helvetica Neue", Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = scheme[0]
      ctx.fillText(keyword, cx, cy, maxTextWidth)
      break
    }
  }

  ctx.restore()

  // Label at bottom
  ctx.font = `${Math.floor(w * 0.025)}px sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.textAlign = 'center'
  ctx.fillText('AI SELECT SHOP × PRINTFUL', cx, h * 0.95)
}

// ==================== Main Component ====================
export default function AISelectShop() {
  // --- Step flow state ---
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // --- Data state ---
  const [trends, setTrends] = useState<TrendKeyword[]>([])
  const [trendsLoading, setTrendsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('すべて')
  const [designs, setDesigns] = useState<DesignRecord[]>([])
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  // Design step state
  const [designKeyword, setDesignKeyword] = useState('')
  const [designStyle, setDesignStyle] = useState('minimal')
  const [designColorScheme, setDesignColorScheme] = useState('neon')
  const [designTshirtColor, setDesignTshirtColor] = useState('black')
  const [designSizes, setDesignSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL'])
  const [designMarkup, setDesignMarkup] = useState(150)
  const [designGenerated, setDesignGenerated] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settingsRef = useRef(settings)
  useEffect(() => { settingsRef.current = settings }, [settings])

  // Modals
  const [showShopifyModal, setShowShopifyModal] = useState(false)
  const [shopifyStatus, setShopifyStatus] = useState<string>('')
  const [showPrintfulModal, setShowPrintfulModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importData, setImportData] = useState('')

  // Printful live integration
  const [printfulConnected, setPrintfulConnected] = useState(false)
  const [printfulStoreName, setPrintfulStoreName] = useState('')
  const [printfulProducts, setPrintfulProducts] = useState<Array<{id: number, name: string, variants: number, thumbnail_url: string | null}>>([])
  const [printfulLoading, setPrintfulLoading] = useState(false)
  const [printfulPublishing, setPrintfulPublishing] = useState<string | null>(null)
  const [printfulError, setPrintfulError] = useState('')
  const [printfulShowShopifyLink, setPrintfulShowShopifyLink] = useState(false)
  const [printfulShipping, setPrintfulShipping] = useState<string | null>(null)

  // --- Printful credential helper ---
  const getPrintfulCreds = useCallback(() => {
    const s = settingsRef.current
    return {
      printfulApiKey: s.printfulApiKey || undefined,
      printfulStoreId: s.printfulStoreId || undefined,
      shopifyDomain: s.shopifyDomain || undefined,
      shopifyClientId: s.shopifyClientId || undefined,
      shopifyClientSecret: s.shopifyClientSecret || undefined,
    }
  }, [])

  // --- Printful API helpers ---
  const connectPrintful = useCallback(async () => {
    setPrintfulLoading(true)
    setPrintfulError('')
    try {
      const creds = getPrintfulCreds()
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-store', ...creds }),
      })
      const data = await res.json()
      if (data.code === 200) {
        setPrintfulConnected(true)
        setPrintfulStoreName(data.result.name)
        const prodRes = await fetch('/api/tools/printful', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-sync-products', ...creds }),
        })
        const prodData = await prodRes.json()
        if (prodData.code === 200) {
          setPrintfulProducts(prodData.result.map((p: { id: number; name: string; variants: number; thumbnail_url: string | null }) => ({
            id: p.id,
            name: p.name,
            variants: p.variants,
            thumbnail_url: p.thumbnail_url,
          })))
        }
      } else {
        setPrintfulError(data.error?.message || data.result || 'Connection failed')
      }
    } catch (err) {
      setPrintfulError(err instanceof Error ? err.message : 'Network error')
    }
    setPrintfulLoading(false)
  }, [getPrintfulCreds])

  const resizeImageForUpload = useCallback((dataUrl: string, maxSize = 2000): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = () => resolve(dataUrl)
      img.src = dataUrl
    })
  }, [])

  const publishToPrintful = useCallback(async (design: DesignRecord) => {
    setPrintfulPublishing(design.id)
    setPrintfulError('')
    try {
      const creds = getPrintfulCreds()
      let imageData = design.canvasDataUrl || undefined
      if (imageData) {
        setPrintfulError('')
        imageData = await resizeImageForUpload(imageData, 2000)
      }
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-product',
          keyword: design.keyword,
          style: design.style,
          tshirtColor: design.tshirtColor,
          sizes: design.sizes,
          designImageBase64: imageData,
          sellingPrice: design.sellingPrice,
          ...creds,
        }),
      })
      const data = await res.json()
      if (data.code === 200) {
        await connectPrintful()
        const shopifyInfo = data.shopify
          ? ` + Shopify登録済み (${data.shopify.title})`
          : ''
        setPrintfulError(`✅ Printful出品完了${shopifyInfo}`)
        setPrintfulShowShopifyLink(true)
        setPrintfulPublishing(null)
        return true
      } else {
        setPrintfulError(data.error?.message || data.error || data.result || 'Failed to publish')
        setPrintfulShowShopifyLink(false)
        setPrintfulPublishing(null)
        return false
      }
    } catch (err) {
      setPrintfulError(err instanceof Error ? err.message : 'Network error')
      setPrintfulShowShopifyLink(false)
      setPrintfulPublishing(null)
      return false
    }
  }, [connectPrintful, getPrintfulCreds, resizeImageForUpload])

  const checkShipping = useCallback(async (tshirtColor: string) => {
    try {
      const creds = getPrintfulCreds()
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-shipping', tshirtColor, ...creds }),
      })
      const data = await res.json()
      if (data.code === 200 && data.result?.length > 0) {
        const cheapest = data.result[0]
        setPrintfulShipping(`${cheapest.name}: $${(cheapest.rate / 100).toFixed(2)} (${cheapest.minDeliveryDays}-${cheapest.maxDeliveryDays}日)`)
      }
    } catch {
      // silently fail
    }
  }, [getPrintfulCreds])

  // --- Initialize ---
  useEffect(() => {
    fetchRealTrends().then((realTrends) => {
      if (realTrends.length > 0) {
        setTrends(realTrends)
        saveToStorage(STORAGE_KEYS.trends, realTrends)
        setTrendsLoading(false)
      } else {
        const saved = loadFromStorage<TrendKeyword[]>(STORAGE_KEYS.trends, [])
        if (saved.length > 0) setTrends(saved)
        setTrendsLoading(false)
      }
    })
    setDesigns(loadFromStorage<DesignRecord[]>(STORAGE_KEYS.designs, []))
    setSales(loadFromStorage<SaleRecord[]>(STORAGE_KEYS.sales, []))
    setSettings(loadFromStorage<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS))
  }, [])

  // --- Simulate sales periodically ---
  useEffect(() => {
    const interval = setInterval(() => {
      setDesigns((prev) => {
        const activeDesigns = prev.filter((d) => d.status === '出品中')
        if (activeDesigns.length === 0) return prev
        if (Math.random() < 0.3) {
          const design = activeDesigns[randomInt(0, activeDesigns.length - 1)]
          const qty = randomInt(1, 3)
          const newSale: SaleRecord = {
            id: generateId(),
            designId: design.id,
            quantity: qty,
            revenue: design.sellingPrice * qty,
            timestamp: new Date().toISOString(),
          }
          setSales((prevSales) => {
            const updated = [...prevSales, newSale]
            saveToStorage(STORAGE_KEYS.sales, updated)
            return updated
          })
        }
        return prev
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // --- Sync settings ---
  useEffect(() => {
    setDesignMarkup(settings.defaultMarkup)
    setDesignTshirtColor(settings.defaultTshirtColor)
  }, [settings])

  // --- Functions ---
  const refreshTrends = useCallback(() => {
    setTrendsLoading(true)
    fetchRealTrends().then((realTrends) => {
      if (realTrends.length > 0) {
        setTrends(realTrends)
        saveToStorage(STORAGE_KEYS.trends, realTrends)
      }
      setTrendsLoading(false)
    })
  }, [])

  const selectKeywordForDesign = useCallback((keyword: string) => {
    setDesignKeyword(keyword)
    setDesignGenerated(false)
    setCurrentStep(2)
  }, [])

  const generateDesign = useCallback(() => {
    if (!designKeyword.trim() || !canvasRef.current) return
    const scheme = COLOR_SCHEMES.find((c) => c.id === designColorScheme)
    const tc = TSHIRT_COLORS.find((c) => c.id === designTshirtColor)
    if (!scheme || !tc) return
    drawTshirt(canvasRef.current, designKeyword, designStyle, scheme.colors, tc.hex, tc.textColor)
    setDesignGenerated(true)
  }, [designKeyword, designStyle, designColorScheme, designTshirtColor])

  const addToStore = useCallback(() => {
    if (!canvasRef.current || !designGenerated) return
    const dataUrl = canvasRef.current.toDataURL('image/png')
    const baseCost = 1200
    const sellingPrice = Math.round(baseCost * (designMarkup / 100))
    const newDesign: DesignRecord = {
      id: generateId(),
      keyword: designKeyword,
      style: STYLES.find((s) => s.id === designStyle)?.name || designStyle,
      colorScheme: COLOR_SCHEMES.find((c) => c.id === designColorScheme)?.colors || [],
      tshirtColor: TSHIRT_COLORS.find((c) => c.id === designTshirtColor)?.name || designTshirtColor,
      sizes: designSizes,
      sellingPrice,
      baseCost,
      markup: designMarkup,
      status: '下書き',
      createdAt: new Date().toISOString(),
      canvasDataUrl: dataUrl,
    }
    const updated = [newDesign, ...designs]
    setDesigns(updated)
    saveToStorage(STORAGE_KEYS.designs, updated)
    setDesignGenerated(false)
    setDesignKeyword('')
    setCurrentStep(3)
  }, [designGenerated, designKeyword, designStyle, designColorScheme, designTshirtColor, designSizes, designMarkup, designs])

  const toggleDesignStatus = useCallback((id: string, status: DesignRecord['status']) => {
    setDesigns((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, status } : d))
      saveToStorage(STORAGE_KEYS.designs, updated)
      return updated
    })
  }, [])

  const deleteDesign = useCallback((id: string) => {
    setDesigns((prev) => {
      const updated = prev.filter((d) => d.id !== id)
      saveToStorage(STORAGE_KEYS.designs, updated)
      return updated
    })
    setSales((prev) => {
      const updated = prev.filter((s) => s.designId !== id)
      saveToStorage(STORAGE_KEYS.sales, updated)
      return updated
    })
  }, [])

  const exportAllData = useCallback(() => {
    const data = { designs, sales, settings, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-select-shop-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [designs, sales, settings])

  const importAllData = useCallback(() => {
    try {
      const parsed = JSON.parse(importData)
      if (parsed.designs) {
        setDesigns(parsed.designs)
        saveToStorage(STORAGE_KEYS.designs, parsed.designs)
      }
      if (parsed.sales) {
        setSales(parsed.sales)
        saveToStorage(STORAGE_KEYS.sales, parsed.sales)
      }
      if (parsed.settings) {
        setSettings(parsed.settings)
        saveToStorage(STORAGE_KEYS.settings, parsed.settings)
      }
      setShowImportModal(false)
      setImportData('')
    } catch {
      alert('JSONの形式が正しくありません。')
    }
  }, [importData])

  const resetAllData = useCallback(() => {
    if (!confirm('すべてのデータをリセットしますか？この操作は取り消せません。')) return
    setDesigns([])
    setSales([])
    setSettings(DEFAULT_SETTINGS)
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
  }, [])

  const saveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings)
    saveToStorage(STORAGE_KEYS.settings, newSettings)
  }, [])

  // --- Computed ---
  const filteredTrends = categoryFilter === 'すべて'
    ? trends
    : trends.filter((t) => t.category === categoryFilter)
  const sortedTrends = [...filteredTrends].sort((a, b) => b.score - a.score)
  const top5 = [...trends].sort((a, b) => b.score - a.score).slice(0, 5)

  // Traffic-based bar width helpers
  const getTrafficNumber = (kw: TrendKeyword) => {
    const n = trafficToNumber(kw.traffic)
    return n > 0 ? n : kw.score
  }
  const top5MaxTraffic = Math.max(...top5.map(getTrafficNumber), 1)
  const allMaxTraffic = Math.max(...sortedTrends.map(getTrafficNumber), 1)

  const getSalesForDesign = (designId: string) => sales.filter((s) => s.designId === designId)
  const getTotalRevenue = () => sales.reduce((acc, s) => acc + s.revenue, 0)
  const getTotalProfit = () => {
    return sales.reduce((acc, s) => {
      const design = designs.find((d) => d.id === s.designId)
      if (!design) return acc
      return acc + (s.revenue - design.baseCost * s.quantity)
    }, 0)
  }

  const baseCost = 1200
  const sellingPrice = Math.round(baseCost * (designMarkup / 100))
  const profit = sellingPrice - baseCost
  const profitMargin = ((profit / sellingPrice) * 100).toFixed(1)

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Header */}
      <div className="border-b border-emerald-500/20 bg-[#0d0d15]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                🏪
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">「在庫ゼロ」AIセレクトショップ</h1>
                <p className="text-xs text-gray-400">トレンド分析 × AI自動デザイン × オンデマンド出品</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-lg"
              title="設定"
            >
              ⚙️
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {([1, 2, 3] as const).map((step) => {
              const labels: Record<number, string> = { 1: 'トレンドを見る', 2: 'デザイン生成', 3: '出品・管理' }
              const isActive = currentStep === step
              const isDone = currentStep > step
              return (
                <div key={step} className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isDone
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-emerald-500 text-white' : isDone ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {isDone ? '✓' : step}
                    </span>
                    <span className="hidden sm:inline">{labels[step]}</span>
                  </button>
                  {step < 3 && <span className="text-gray-600 text-xs">›</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ===== STEP 1: Trends ===== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Top 5 */}
            <div>
              <h2 className="text-lg font-bold text-emerald-400 mb-3">
                🏆 Googleトレンド急上昇 TOP5 <span className="text-xs text-gray-500 font-normal">（リアルタイム）</span>
              </h2>
              {trendsLoading && <p className="text-sm text-gray-400 animate-pulse mb-2">Googleトレンドを取得中...</p>}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {top5.map((kw, i) => {
                  const trafficNum = getTrafficNumber(kw)
                  const barWidth = Math.round((trafficNum / top5MaxTraffic) * 100)
                  return (
                    <Card key={kw.id} className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-emerald-400 font-bold">#{i + 1}</span>
                          <span className="text-lg">{kw.direction}</span>
                        </div>
                        <p className="font-bold text-white text-sm truncate">{kw.name}</p>
                        {kw.traffic && <p className="text-[10px] text-gray-400 truncate">{kw.traffic}+ 検索</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${barWidth}%` }} />
                          </div>
                          <span className="text-xs text-emerald-400 font-mono">{kw.score}</span>
                        </div>
                        <button
                          onClick={() => selectKeywordForDesign(kw.name)}
                          className="mt-2 w-full text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded py-1 transition-colors"
                        >
                          デザイン生成 →
                        </button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Refresh */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">出典: Google Trends Japan（30分キャッシュ）</span>
              <button
                onClick={refreshTrends}
                disabled={trendsLoading}
                className="ml-auto px-4 py-1.5 text-xs font-medium bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-full transition-colors disabled:opacity-50"
              >
                {trendsLoading ? '⏳ 取得中...' : '🔄 トレンド更新'}
              </button>
            </div>

            {/* Keyword list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sortedTrends.map((kw) => {
                const trafficNum = getTrafficNumber(kw)
                const barWidth = Math.round((trafficNum / allMaxTraffic) * 100)
                return (
                  <Card key={kw.id} className="bg-[#12121a] border-gray-800 hover:border-emerald-500/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">{kw.name}</span>
                            <span className={`text-sm ${kw.direction === '↑' || kw.direction === '↗' ? 'text-emerald-400' : kw.direction === '→' ? 'text-gray-400' : 'text-red-400'}`}>
                              {kw.direction}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="text-[10px] bg-gray-700 text-gray-300 border-0">Google トレンド</Badge>
                            {kw.traffic && <span className="text-xs text-gray-500">検索数: {kw.traffic}</span>}
                            <span className="text-xs text-gray-500">スコア: {kw.score}</span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full w-full">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${barWidth}%` }} />
                          </div>
                        </div>
                        <button
                          onClick={() => selectKeywordForDesign(kw.name)}
                          className="ml-3 px-3 py-1.5 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded transition-colors whitespace-nowrap"
                        >
                          デザイン生成 →
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* ===== STEP 2: Design ===== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Controls */}
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">キーワード</Label>
                  <Input
                    value={designKeyword}
                    onChange={(e) => { setDesignKeyword(e.target.value); setDesignGenerated(false) }}
                    placeholder="例: サイバーパンク"
                    className="bg-[#12121a] border-gray-700 text-white"
                  />
                </div>

                {/* Style */}
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">スタイル</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setDesignStyle(s.id); setDesignGenerated(false) }}
                        className={`p-2 rounded-lg text-sm font-medium border transition-colors ${
                          designStyle === s.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : 'border-gray-700 bg-[#12121a] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {s.emoji} {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">カラースキーム</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_SCHEMES.map((cs) => (
                      <button
                        key={cs.id}
                        onClick={() => { setDesignColorScheme(cs.id); setDesignGenerated(false) }}
                        className={`p-2 rounded-lg border transition-colors ${
                          designColorScheme === cs.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-[#12121a] hover:border-gray-600'
                        }`}
                      >
                        <div className="flex justify-center gap-1 mb-1">
                          {cs.colors.map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{cs.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* T-shirt Color */}
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">Tシャツカラー</Label>
                  <div className="flex flex-wrap gap-2">
                    {TSHIRT_COLORS.map((tc) => (
                      <button
                        key={tc.id}
                        onClick={() => { setDesignTshirtColor(tc.id); setDesignGenerated(false) }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                          designTshirtColor === tc.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-[#12121a] hover:border-gray-600'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: tc.hex }} />
                        <span className="text-gray-300">{tc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">サイズ展開</Label>
                  <div className="flex gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setDesignSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size],
                          )
                        }}
                        className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                          designSizes.includes(size)
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                            : 'border-gray-700 bg-[#12121a] text-gray-500 hover:border-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Calculator */}
                <Card className="bg-[#12121a] border-gray-800">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-sm text-gray-400">💰 価格設定</Label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12">50%</span>
                      <input
                        type="range"
                        min={50}
                        max={300}
                        step={10}
                        value={designMarkup}
                        onChange={(e) => setDesignMarkup(Number(e.target.value))}
                        className="flex-1 accent-emerald-500"
                      />
                      <span className="text-xs text-gray-500 w-12 text-right">300%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500">原価</div>
                        <div className="text-white font-bold">¥{baseCost.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500">マークアップ</div>
                        <div className="text-emerald-400 font-bold">{designMarkup}%</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500">販売価格</div>
                        <div className="text-white font-bold">¥{sellingPrice.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2">
                        <div className="text-gray-500">利益率</div>
                        <div className="text-teal-400 font-bold">{profitMargin}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateDesign}
                    disabled={!designKeyword.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                  >
                    🎨 デザイン生成
                  </Button>
                  <Button
                    onClick={addToStore}
                    disabled={!designGenerated}
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    📋 出品リストに追加
                  </Button>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ← STEP 1 トレンドに戻る
                </button>
              </div>

              {/* Right: Preview */}
              <div className="space-y-4">
                <Label className="text-sm text-gray-400 block">プレビュー</Label>
                <div className="bg-[#12121a] rounded-xl border border-gray-800 p-4 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={480}
                    className="rounded-lg max-w-full"
                  />
                </div>

                {/* Design History */}
                {designs.length > 0 && (
                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">過去のデザイン</Label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {designs.slice(0, 10).map((d) => (
                        <div key={d.id} className="shrink-0">
                          <img
                            src={d.canvasDataUrl}
                            alt={d.keyword}
                            className="w-16 h-20 object-cover rounded border border-gray-700"
                          />
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate w-16">{d.keyword}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Store & Dashboard ===== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '総デザイン数', value: designs.length.toString(), color: 'text-white' },
                { label: '出品中', value: designs.filter((d) => d.status === '出品中').length.toString(), color: 'text-emerald-400' },
                { label: '総売上', value: `¥${getTotalRevenue().toLocaleString()}`, color: 'text-teal-400' },
                { label: '総利益', value: `¥${getTotalProfit().toLocaleString()}`, color: getTotalProfit() >= 0 ? 'text-emerald-400' : 'text-red-400' },
              ].map((stat) => (
                <Card key={stat.label} className="bg-[#12121a] border-gray-800">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions row */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-sm bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium"
              >
                ✨ 新しいデザインを作る
              </button>
              <button onClick={() => setShowShopifyModal(true)} className="px-4 py-2 text-sm bg-[#96bf48]/20 text-[#96bf48] rounded-lg hover:bg-[#96bf48]/30 transition-colors">
                🛒 Shopify連携
              </button>
              <button onClick={() => setShowPrintfulModal(true)} className="px-4 py-2 text-sm bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors">
                📦 Printful連携
              </button>
              <button onClick={exportAllData} className="px-4 py-2 text-sm bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors ml-auto">
                💾 JSONエクスポート
              </button>
            </div>

            {/* Design Cards */}
            {designs.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-4xl mb-3">🏪</p>
                <p className="text-lg">まだデザインがありません</p>
                <p className="text-sm mb-4">STEP 1からキーワードを選んでデザインを作成してください</p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  トレンドを見る →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {designs.map((design) => {
                  const designSales = getSalesForDesign(design.id)
                  const totalSold = designSales.reduce((a, s) => a + s.quantity, 0)
                  const totalRev = designSales.reduce((a, s) => a + s.revenue, 0)
                  const totalProfit = totalRev - design.baseCost * totalSold

                  return (
                    <Card key={design.id} className="bg-[#12121a] border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <img
                            src={design.canvasDataUrl}
                            alt={design.keyword}
                            className="w-24 h-28 object-cover rounded border border-gray-700"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-sm truncate">{design.keyword}</span>
                              <Badge className={`text-[10px] border-0 ${
                                design.status === '出品中' ? 'bg-emerald-500/20 text-emerald-400' :
                                design.status === '下書き' ? 'bg-gray-600/20 text-gray-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {design.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              {design.style} ・ {design.tshirtColor} ・ ¥{design.sellingPrice.toLocaleString()}
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                              <div className="bg-gray-800/50 rounded p-1">
                                <div className="text-gray-500">販売数</div>
                                <div className="text-white font-bold">{totalSold}</div>
                              </div>
                              <div className="bg-gray-800/50 rounded p-1">
                                <div className="text-gray-500">売上</div>
                                <div className="text-white font-bold">¥{totalRev.toLocaleString()}</div>
                              </div>
                              <div className="bg-gray-800/50 rounded p-1">
                                <div className="text-gray-500">利益</div>
                                <div className={`font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  ¥{totalProfit.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Status buttons */}
                        <div className="flex gap-1.5 mt-3">
                          {design.status !== '出品中' && (
                            <button onClick={() => toggleDesignStatus(design.id, '出品中')} className="flex-1 text-xs py-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors">
                              出品する
                            </button>
                          )}
                          {design.status !== '下書き' && (
                            <button onClick={() => toggleDesignStatus(design.id, '下書き')} className="flex-1 text-xs py-1.5 bg-gray-600/20 text-gray-400 rounded hover:bg-gray-600/30 transition-colors">
                              下書きに
                            </button>
                          )}
                          {design.status !== '売り切れ' && (
                            <button onClick={() => toggleDesignStatus(design.id, '売り切れ')} className="flex-1 text-xs py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors">
                              売り切れ
                            </button>
                          )}
                          <button
                            onClick={() => publishToPrintful(design)}
                            disabled={printfulPublishing === design.id}
                            className="text-xs py-1.5 px-2 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 disabled:opacity-50 transition-colors"
                          >
                            {printfulPublishing === design.id ? '⏳' : '🚀'}
                          </button>
                          <button onClick={() => deleteDesign(design.id)} className="text-xs py-1.5 px-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors">
                            🗑
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Revenue Chart */}
            {sales.length > 0 && (
              <Card className="bg-[#12121a] border-gray-800">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-gray-300 mb-4">📈 直近30日の売上推移</h3>
                  <DailyRevenueChart sales={sales} />
                </CardContent>
              </Card>
            )}

            {/* Printful error/status */}
            {printfulError && (
              <div className={`text-xs p-3 rounded-lg ${printfulError.startsWith('✅') ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'}`}>
                <p>{printfulError}</p>
                {printfulShowShopifyLink && (
                  <a
                    href="https://admin.shopify.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-[#96bf48]/20 hover:bg-[#96bf48]/30 text-[#96bf48] rounded-lg transition-colors font-medium"
                  >
                    🛒 Shopify管理画面を開く ↗
                  </a>
                )}
              </div>
            )}

            {/* Shopify Modal */}
            {showShopifyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowShopifyModal(false)}>
                <div className="bg-[#12121a] border border-gray-700 rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-bold text-white mb-4">🛒 Shopify連携ガイド</h3>
                  <ol className="space-y-3 text-sm text-gray-300">
                    <li>1. Shopifyストアを作成（14日間無料トライアル）</li>
                    <li>2. Printfulアプリをインストール</li>
                    <li>3. 本ツールのデザインをPrintfulにアップロード</li>
                    <li>4. 商品情報を同期してストアに自動出品</li>
                    <li>5. 注文が入るとPrintfulが自動で製造・配送</li>
                  </ol>
                  <p className="text-xs text-gray-500 mt-4">※ この機能は情報提供のみです。実際の連携にはShopify / Printfulのアカウントが必要です。</p>
                  <a
                    href="https://admin.shopify.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-2 bg-[#96bf48] hover:bg-[#7da03c] text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    🛒 Shopify管理画面を開く ↗
                  </a>
                  <button onClick={() => setShowShopifyModal(false)} className="mt-2 w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                    閉じる
                  </button>
                </div>
              </div>
            )}

            {/* Printful Modal */}
            {showPrintfulModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowPrintfulModal(false)}>
                <div className="bg-[#12121a] border border-gray-700 rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">📦 Printful連携</h3>
                    {printfulConnected && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 接続済み
                      </span>
                    )}
                  </div>

                  {!printfulConnected ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-300">Printful APIに接続してデザインを直接出品できます。</p>
                      <button
                        onClick={connectPrintful}
                        disabled={printfulLoading}
                        className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 font-medium"
                      >
                        {printfulLoading ? '⏳ 接続中...' : '🔗 Printfulに接続'}
                      </button>
                      {printfulError && (
                        <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded">{printfulError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                        <p className="text-sm text-emerald-300 font-medium">🏪 {printfulStoreName}</p>
                        <p className="text-xs text-gray-400 mt-1">Store ID: 18088076 • Bella+Canvas 3001対応</p>
                      </div>

                      {printfulShipping ? (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-xs text-gray-400">🚚 日本への配送目安</p>
                          <p className="text-sm text-white mt-1">{printfulShipping}</p>
                        </div>
                      ) : (
                        <button onClick={() => checkShipping('白')} className="text-xs text-emerald-400 hover:text-emerald-300 underline">
                          🚚 配送料を確認
                        </button>
                      )}

                      <div>
                        <p className="text-sm text-gray-300 mb-2 font-medium">📋 出品可能なデザイン</p>
                        {designs.filter(d => d.status === '出品中').length === 0 ? (
                          <p className="text-xs text-gray-500">出品中のデザインがありません。出品するボタンで状態を変更してください。</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {designs.filter(d => d.status === '出品中').map(d => (
                              <div key={d.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  {d.canvasDataUrl && (
                                    <img src={d.canvasDataUrl} alt="" className="w-10 h-10 rounded object-cover" />
                                  )}
                                  <div>
                                    <p className="text-xs text-white">{d.keyword} - {d.style}</p>
                                    <p className="text-xs text-gray-500">¥{d.sellingPrice.toLocaleString()}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => publishToPrintful(d)}
                                  disabled={printfulPublishing === d.id}
                                  className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                                >
                                  {printfulPublishing === d.id ? '⏳' : '🚀 出品'}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {printfulProducts.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-300 mb-2 font-medium">✅ Printful出品済み ({printfulProducts.length})</p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {printfulProducts.map(p => (
                              <a
                                key={p.id}
                                href={`https://www.printful.com/dashboard/product-templates/published/18088076/${p.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between text-xs bg-gray-800/30 rounded p-2 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                              >
                                <span className="text-gray-300 group-hover:text-white">{p.name}</span>
                                <span className="text-gray-500 group-hover:text-emerald-400">{p.variants} variants ↗</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <a
                        href="https://www.printful.com/dashboard/product-templates/published"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 rounded-lg transition-colors"
                      >
                        🖨️ Printfulダッシュボードで管理 ↗
                      </a>

                      {printfulError && (
                        <div className={`text-xs p-2 rounded ${printfulError.startsWith('✅') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                          <p>{printfulError}</p>
                          {printfulShowShopifyLink && (
                            <a
                              href="https://admin.shopify.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-[#96bf48]/20 hover:bg-[#96bf48]/30 text-[#96bf48] rounded-lg transition-colors font-medium"
                            >
                              🛒 Shopify管理画面を開く ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={() => setShowPrintfulModal(false)} className="mt-4 w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                    閉じる
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== Settings Modal ===== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-[#0d0d15] border border-gray-700 rounded-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">⚙️ 設定</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
            </div>

            <div className="space-y-6">
              {/* Basic Settings */}
              <Card className="bg-[#12121a] border-gray-800">
                <CardContent className="p-5 space-y-5">
                  <h3 className="text-sm font-bold text-white">基本設定</h3>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">デフォルトマークアップ (%)</Label>
                    <Input
                      type="number"
                      min={50}
                      max={300}
                      value={settings.defaultMarkup}
                      onChange={(e) => saveSettings({ ...settings, defaultMarkup: Number(e.target.value) })}
                      className="bg-[#0a0a0f] border-gray-700 text-white w-32"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">デフォルトTシャツカラー</Label>
                    <div className="flex flex-wrap gap-2">
                      {TSHIRT_COLORS.map((tc) => (
                        <button
                          key={tc.id}
                          onClick={() => saveSettings({ ...settings, defaultTshirtColor: tc.id })}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                            settings.defaultTshirtColor === tc.id
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-gray-700 bg-[#0a0a0f] hover:border-gray-600'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: tc.hex }} />
                          <span className="text-gray-300">{tc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">キーワードあたり自動生成数</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={settings.autoGenerateCount}
                      onChange={(e) => saveSettings({ ...settings, autoGenerateCount: Number(e.target.value) })}
                      className="bg-[#0a0a0f] border-gray-700 text-white w-32"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Printful */}
              <Card className="bg-[#12121a] border-gray-800">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">🖨️ Printful連携</h3>
                  <p className="text-xs text-gray-400">
                    自分のPrintfulアカウントを接続して、AIデザインを直接オンデマンドTシャツとして出品できます。
                    <a href="https://www.printful.com/dashboard/settings/api" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline ml-1">
                      APIキーを取得 →
                    </a>
                  </p>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">Printful APIキー</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={settings.printfulApiKey}
                        onChange={(e) => saveSettings({ ...settings, printfulApiKey: e.target.value })}
                        placeholder="例: suHaJYIsHrfa..."
                        className="bg-[#0a0a0f] border-gray-700 text-white flex-1 font-mono text-sm"
                      />
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => navigator.clipboard.writeText(settings.printfulApiKey)}>
                        📋
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">ストアID</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={settings.printfulStoreId}
                        onChange={(e) => saveSettings({ ...settings, printfulStoreId: e.target.value })}
                        placeholder="例: 18088076"
                        className="bg-[#0a0a0f] border-gray-700 text-white w-48 font-mono text-sm"
                      />
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => navigator.clipboard.writeText(settings.printfulStoreId)}>
                        📋
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={connectPrintful}
                      disabled={printfulLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                    >
                      {printfulLoading ? '接続中...' : printfulConnected ? '🔄 再接続' : '🔗 接続テスト'}
                    </Button>
                    {printfulConnected && (
                      <span className="text-sm text-emerald-400 flex items-center gap-1.5">
                        ✅ 接続済み: {printfulStoreName}
                      </span>
                    )}
                  </div>
                  {printfulError && !printfulError.startsWith('✅') && (
                    <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">❌ {printfulError}</p>
                  )}
                </CardContent>
              </Card>

              {/* Shopify */}
              <Card className="bg-[#12121a] border-gray-800">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">🛍️ Shopify連携</h3>
                  <p className="text-xs text-gray-400">
                    Shopifyストアに接続すると、出品時にPrintful + Shopify両方に自動で商品が登録されます。
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">ストアドメイン</label>
                      <input
                        type="text"
                        placeholder="your-store.myshopify.com"
                        value={settings.shopifyDomain}
                        onChange={e => saveSettings({ ...settings, shopifyDomain: e.target.value })}
                        onBlur={e => {
                          const normalized = normalizeShopifyDomain(e.target.value)
                          if (normalized !== e.target.value) saveSettings({ ...settings, shopifyDomain: normalized })
                        }}
                        className="w-full bg-[#0a0a0f] border border-gray-700 rounded-lg text-sm text-gray-300 px-3 py-2 placeholder:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Client ID</label>
                      <input
                        type="text"
                        placeholder="67b4f4e9..."
                        value={settings.shopifyClientId}
                        onChange={e => saveSettings({ ...settings, shopifyClientId: e.target.value })}
                        className="w-full bg-[#0a0a0f] border border-gray-700 rounded-lg text-sm text-gray-300 px-3 py-2 placeholder:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Client Secret</label>
                      <input
                        type="password"
                        placeholder="shpss_..."
                        value={settings.shopifyClientSecret}
                        onChange={e => saveSettings({ ...settings, shopifyClientSecret: e.target.value })}
                        className="w-full bg-[#0a0a0f] border border-gray-700 rounded-lg text-sm text-gray-300 px-3 py-2 placeholder:text-gray-600"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        setShopifyStatus('🔄 接続テスト中...')
                        try {
                          const domain = normalizeShopifyDomain(settings.shopifyDomain)
                          if (domain !== settings.shopifyDomain) saveSettings({ ...settings, shopifyDomain: domain })
                          const res = await fetch('/api/tools/printful', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              action: 'shopify-test',
                              shopifyDomain: domain || undefined,
                              shopifyClientId: settings.shopifyClientId || undefined,
                              shopifyClientSecret: settings.shopifyClientSecret || undefined,
                            }),
                          })
                          const data = await res.json()
                          if (data.code === 200) {
                            setShopifyStatus(`✅ 接続成功: ${data.result.name}（${data.result.productCount}商品）`)
                          } else {
                            setShopifyStatus(`❌ ${data.error || '接続に失敗しました'}`)
                          }
                        } catch {
                          setShopifyStatus('❌ 接続テストに失敗しました')
                        }
                      }}
                      className="w-full py-2 bg-[#96bf48] text-white rounded-lg hover:bg-[#7da03c] transition-colors text-sm font-medium"
                    >
                      🔗 接続テスト
                    </button>
                    {shopifyStatus && (
                      <p className={`text-sm ${shopifyStatus.startsWith('✅') ? 'text-emerald-400' : shopifyStatus.startsWith('🔄') ? 'text-yellow-400' : 'text-red-400'}`}>
                        {shopifyStatus}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="bg-[#12121a] border-gray-800">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">💾 データ管理</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={exportAllData} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      📤 エクスポート
                    </Button>
                    <Button onClick={() => setShowImportModal(true)} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      📥 インポート
                    </Button>
                    <Button onClick={resetAllData} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      🗑 全データリセット
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <button onClick={() => setShowSettingsModal(false)} className="mt-4 w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowImportModal(false)}>
          <div className="bg-[#12121a] border border-gray-700 rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">📥 データインポート</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="エクスポートしたJSONを貼り付けてください..."
              rows={8}
              className="w-full bg-[#0a0a0f] border border-gray-700 rounded-lg text-sm text-gray-300 p-3 font-mono"
            />
            <div className="flex gap-3 mt-4">
              <Button onClick={importAllData} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                インポート実行
              </Button>
              <Button onClick={() => { setShowImportModal(false); setImportData('') }} variant="outline" className="border-gray-700 text-gray-300">
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== Sub-components ====================
function DailyRevenueChart({ sales }: { sales: SaleRecord[] }) {
  const now = new Date()
  const days: { label: string; revenue: number }[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    const revenue = sales
      .filter((s) => s.timestamp.slice(0, 10) === dateStr)
      .reduce((acc, s) => acc + s.revenue, 0)
    days.push({ label, revenue })
  }

  const maxRevenue = Math.max(...days.map((d) => d.revenue), 1)

  return (
    <div className="flex items-end gap-0.5 h-40">
      {days.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
          <div
            className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t min-h-[2px] transition-all"
            style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 1.5)}%` }}
          />
          {i % 5 === 0 && (
            <span className="text-[8px] text-gray-600 mt-1">{day.label}</span>
          )}
          <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {day.label}: ¥{day.revenue.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
