'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DebugPanel } from '@/components/tools/DebugPanel'

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
  printfulApiKey: 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN',
  printfulStoreId: '18088076',
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
    const res = await fetch('/api/trends')
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return (data.trends || []).map((t: any, i: number) => {
      const score = 50 + randomInt(0, 48)
      return {
        id: `rt-${i}`,
        name: t,
        score,
        category: 'トレンド',
        direction: scoreToDirection(score),
        traffic: '',
        link: '',
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
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans pb-32">
      {/* Header */}
      <div className="border-b border-emerald-500/20 bg-[#0d0d15]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                🏪
              </div>
              <div>
                <h1 className="text-xl font-bold text-white uppercase tracking-tighter italic">Master Select Shop v12.0</h1>
                <p className="text-xs text-gray-400">Trend Analysis × Automatic Canvas Design × Printful/Shopify Direct Sync</p>
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
              const labels: Record<number, string> = { 1: '① トレンド解析', 2: '② キャンバス設計', 3: '③ ストア管理' }
              const isActive = currentStep === step
              const isDone = currentStep > step
              return (
                <div key={step} className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-black transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg scale-105'
                        : isDone
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive ? 'bg-emerald-500 text-white' : isDone ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {isDone ? '✓' : step}
                    </span>
                    <span className="hidden sm:inline uppercase italic">{labels[step]}</span>
                  </button>
                  {step < 3 && <span className="text-gray-600 text-xs">›</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ===== STEP 1: Trends ===== */}
        {currentStep === 1 && (
          <div className="space-y-10 animate-in fade-in duration-700">
            {/* Top 5 */}
            <div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                <TrendingUp className="text-emerald-400" /> Google Trends Japan
              </h2>
              {trendsLoading && <p className="text-sm text-gray-500 animate-pulse mb-6 uppercase italic font-black">Scanning real-time search volume...</p>}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {top5.map((kw, i) => {
                  const trafficNum = getTrafficNumber(kw)
                  const barWidth = Math.round((trafficNum / top5MaxTraffic) * 100)
                  return (
                    <Card key={kw.id} className="bg-[#12121a] border-white/5 hover:border-emerald-500/30 transition-all group overflow-hidden shadow-2xl">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-emerald-500 uppercase italic">Rank #{i + 1}</span>
                          <span className="text-lg font-black text-emerald-400">{kw.direction}</span>
                        </div>
                        <p className="font-black text-white text-lg truncate mb-1 italic uppercase tracking-tighter">{kw.name}</p>
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex-1 h-1 bg-gray-800 rounded-full">
                            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full transition-all duration-1000" style={{ width: `${barWidth}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-emerald-500/50">{kw.score}</span>
                        </div>
                        <Button
                          onClick={() => selectKeywordForDesign(kw.name)}
                          className="mt-6 w-full h-12 bg-white/5 hover:bg-emerald-500 hover:text-white text-emerald-400 text-[10px] font-black uppercase italic rounded-xl border border-white/5 transition-all"
                        >
                          Design Logic →
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Keyword list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedTrends.map((kw) => {
                const trafficNum = getTrafficNumber(kw)
                const barWidth = Math.round((trafficNum / allMaxTraffic) * 100)
                return (
                  <Card key={kw.id} className="bg-[#12121a] border-white/5 hover:border-emerald-500/20 transition-all group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-black text-white text-xl italic uppercase tracking-tighter truncate">{kw.name}</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[8px] font-black uppercase italic tracking-widest">Live</Badge>
                          </div>
                          <div className="h-1 bg-gray-800 rounded-full w-full">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${barWidth}%` }} />
                          </div>
                        </div>
                        <Button
                          onClick={() => selectKeywordForDesign(kw.name)}
                          className="h-14 px-8 bg-emerald-500 text-slate-950 font-black text-sm uppercase italic rounded-2xl hover:bg-emerald-400 transition-all shadow-xl"
                        >
                          Execute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="flex justify-center pt-10">
               <Button onClick={refreshTrends} disabled={trendsLoading} className="h-16 px-12 bg-white/5 hover:bg-white/10 text-gray-500 font-black uppercase italic rounded-2xl border border-white/5 flex items-center gap-3">
                  <RefreshCw size={20} className={trendsLoading ? 'animate-spin' : ''} /> Refresh Trends
               </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: Design ===== */}
        {currentStep === 2 && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Controls */}
              <div className="space-y-8">
                <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8">
                  <div>
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-2">Market Keyword</Label>
                    <Input
                      value={designKeyword}
                      onChange={(e) => { setDesignKeyword(e.target.value); setDesignGenerated(false) }}
                      className="h-16 bg-[#0a0b14] border-2 border-white/5 rounded-2xl px-6 font-black text-2xl text-white italic tracking-tighter focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  {/* Style */}
                  <div>
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-2">Design Architecture</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {STYLES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setDesignStyle(s.id); setDesignGenerated(false) }}
                          className={`h-14 rounded-xl text-xs font-black uppercase italic border-2 transition-all ${
                            designStyle === s.id
                              ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-lg scale-105'
                              : 'border-white/5 bg-[#0a0b14] text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* T-shirt Color */}
                  <div>
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-2">Fabric Tone (Bella+Canvas 3001)</Label>
                    <div className="flex flex-wrap gap-3">
                      {TSHIRT_COLORS.map((tc) => (
                        <button
                          key={tc.id}
                          onClick={() => { setDesignTshirtColor(tc.id); setDesignGenerated(false) }}
                          className={`w-12 h-12 rounded-2xl border-4 transition-all ${
                            designTshirtColor === tc.id
                              ? 'border-emerald-500 scale-110 shadow-xl'
                              : 'border-white/5 hover:border-white/20'
                          }`}
                          style={{ backgroundColor: tc.hex }}
                          title={tc.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block px-2">Size Configuration</Label>
                    <div className="flex gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setDesignSizes((prev) =>
                              prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
                            )
                          }}
                          className={`w-12 h-12 rounded-xl font-black text-xs border-2 transition-all ${
                            designSizes.includes(size)
                              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                              : 'border-white/5 bg-[#0a0b14] text-slate-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-4 pt-6">
                    <Button
                      onClick={generateDesign}
                      disabled={!designKeyword.trim()}
                      className="h-24 bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black text-3xl uppercase italic rounded-3xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all active:scale-95"
                    >
                      EXECUTE DESIGN
                    </Button>
                    <Button
                      onClick={addToStore}
                      disabled={!designGenerated}
                      className="h-16 bg-white/5 hover:bg-white/10 border border-white/5 text-emerald-400 font-black uppercase italic rounded-2xl transition-all"
                    >
                      SYNC TO MASTER LIST
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="space-y-8 flex flex-col items-center justify-center">
                <div className="relative bg-[#13141f] rounded-[4rem] border-2 border-white/5 p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] group transition-all">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-8 py-1.5 rounded-b-2xl z-20 uppercase tracking-[0.2em] italic">Real-time Canvas</div>
                  <canvas ref={canvasRef} width={400} height={480} className="rounded-3xl shadow-inner bg-black" />
                  <div className="absolute bottom-8 left-12 right-12 flex justify-between items-end opacity-20 pointer-events-none font-mono text-[8px] text-emerald-500">
                     <span>MASTER_CORE_ONLINE</span>
                     <span>V12.0_STABLE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Store & Dashboard ===== */}
        {currentStep === 3 && (
          <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'TOTAL DESIGNS', value: designs.length.toString(), color: 'text-white' },
                { label: 'LIVE STATUS', value: designs.filter((d) => d.status === '出品中').length.toString(), color: 'text-emerald-400' },
                { label: 'GROSS REVENUE', value: `¥${getTotalRevenue().toLocaleString()}`, color: 'text-teal-400' },
                { label: 'NET PROFIT', value: `¥${getTotalProfit().toLocaleString()}`, color: getTotalProfit() >= 0 ? 'text-emerald-400' : 'text-red-400' },
              ].map((stat) => (
                <Card key={stat.label} className="bg-[#13141f] border-white/5 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-[10px] font-black text-slate-600 mb-4 uppercase tracking-[0.2em] italic">{stat.label}</p>
                    <p className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {designs.map((design) => (
                    <Card key={design.id} className="bg-[#13141f] border-white/5 hover:border-emerald-500/20 transition-all overflow-hidden group shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="relative w-32 h-40 rounded-2xl overflow-hidden shadow-inner border border-white/5 bg-black"><img src={design.canvasDataUrl} className="w-full h-full object-cover" /></div>
                          <div className="flex-1 min-w-0 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-white text-xl italic uppercase tracking-tighter truncate">{design.keyword}</span>
                              <Badge className={`text-[8px] font-black border-0 uppercase italic tracking-widest ${design.status === '出品中' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-500'}`}>{design.status}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                               <Button onClick={() => publishToPrintful(design)} disabled={printfulPublishing === design.id} className="h-12 bg-white text-slate-950 font-black uppercase italic rounded-xl flex items-center justify-center gap-2 text-xs">
                                  {printfulPublishing === design.id ? <Loader2 className="animate-spin" /> : <><Globe size={14}/> SHOPIFY PUSH</>}
                               </Button>
                               <Button onClick={() => deleteDesign(design.id)} variant="ghost" className="h-12 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl">
                                  <Trash2 size={14}/>
                               </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
               </div>
               
               <div className="lg:col-span-1 space-y-6">
                  <Card className="bg-[#13141f] border-2 border-emerald-500/30 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                     <div className="flex items-center gap-3 mb-8"><Activity className="text-emerald-400"/><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Status</h3></div>
                     <div className="space-y-6">
                        {printfulError && <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-2xl text-[10px] font-bold text-emerald-400 italic leading-relaxed">{printfulError}</div>}
                        <Button onClick={() => window.open('https://admin.shopify.com/', '_blank')} className="w-full h-16 bg-white text-slate-950 font-black uppercase italic rounded-2xl shadow-xl flex items-center justify-center gap-3">
                           <Store size={20}/> OPEN SHOPIFY
                        </Button>
                        <Button onClick={connectPrintful} className="w-full h-14 bg-white/5 hover:bg-white/10 text-slate-500 font-black uppercase italic rounded-xl border border-white/5 flex items-center justify-center gap-3">
                           <RefreshCw size={16}/> SYNC API ENGINE
                        </Button>
                     </div>
                  </Card>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050507]/90 backdrop-blur-md p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] max-w-xl w-full p-12 shadow-[0_40px_100px_rgba(0,0,0,1)] relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-8 right-8 text-slate-700 hover:text-white"><X size={32}/></button>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4"><Settings className="text-emerald-500" /> System Config</h2>
            <div className="space-y-6">
               <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase px-4 italic">Printful Master Token</p><Input type="password" value={settings.printfulApiKey} onChange={(e) => saveSettings({ ...settings, printfulApiKey: e.target.value })} className="h-16 bg-[#0a0b14] border-2 border-white/5 rounded-2xl px-6 font-mono text-emerald-400 text-sm" /></div>
               <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase px-4 italic">Store ID</p><Input value={settings.printfulStoreId} onChange={(e) => saveSettings({ ...settings, printfulStoreId: e.target.value })} className="h-16 bg-[#0a0b14] border-2 border-white/5 rounded-2xl px-6 font-mono text-emerald-400" /></div>
               <Button onClick={() => setShowSettingsModal(false)} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xl shadow-2xl mt-8 italic uppercase tracking-widest">Update Architecture</Button>
            </div>
          </div>
        </div>
      )}

      <DebugPanel data={{ designs, sales, settings }} toolId="ai-select-shop-ultimate" />
    </div>
  )
}
