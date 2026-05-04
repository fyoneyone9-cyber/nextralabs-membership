'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Palette, Rocket, ArrowRight, CheckCircle2, ChevronRight, Settings, Download, Trash2, ShoppingCart, Info, ExternalLink, RefreshCw, BarChart3, Globe } from 'lucide-react'

// ==================== Types ====================
interface TrendKeyword {
  id: string
  name: string
  score: number
  category: string
  direction: '↑' | '↗' | '→' | '↘' | '↓'
  traffic: string
}

interface DesignRecord {
  id: string
  keyword: string
  style: string
  colorScheme: string[]
  tshirtColor: string
  sellingPrice: number
  status: '出品中' | '下書き'
  canvasDataUrl: string
}

interface AppSettings {
  defaultMarkup: number
  defaultTshirtColor: string
  shopifyDomain: string
}

// ==================== Constants ====================
const STYLES = [
  { id: 'minimal', name: 'ミニマル', emoji: '⬜' },
  { id: 'street', name: 'ストリート', emoji: '🏙️' },
  { id: 'retro', name: 'レトロ', emoji: '📻' },
  { id: 'cyberpunk', name: 'サイバーパンク', emoji: '🌃' },
  { id: 'kawaii', name: 'かわいい', emoji: '🎀' },
  { id: 'japanese', name: '和風', emoji: '⛩️' },
  { id: 'vintage', name: 'ヴィンテージ', emoji: '🏺' },
]

const COLOR_SCHEMES = [
  { id: 'neon', name: 'ネオン', colors: ['#00ff88', '#00ccff', '#ff00ff'] },
  { id: 'sunset', name: 'サンセット', colors: ['#ff6b35', '#f7c59f', '#efefd0'] },
  { id: 'sakura', name: '桜', colors: ['#ffb7c5', '#ff69b4', '#fff0f5'] },
]

const TSHIRT_COLORS = [
  { id: 'white', name: '白', hex: '#FFFFFF', textColor: '#000000' },
  { id: 'black', name: '黒', hex: '#1a1a1a', textColor: '#FFFFFF' },
  { id: 'navy', name: 'ネイビー', hex: '#1e3a5f', textColor: '#FFFFFF' },
]

// ==================== Canvas Engine (RESTORED) ====================
function drawTshirt(
  canvas: HTMLCanvasElement,
  keyword: string,
  styleId: string,
  scheme: string[],
  tshirtHex: string,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width; const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#0f0f1a'; ctx.fillRect(0, 0, w, h)

  // T-shirt shape
  ctx.beginPath(); ctx.moveTo(w * 0.15, h * 0.12); ctx.lineTo(w * 0.05, h * 0.28); ctx.lineTo(w * 0.2, h * 0.32); ctx.lineTo(w * 0.2, h * 0.88); ctx.lineTo(w * 0.8, h * 0.88); ctx.lineTo(w * 0.8, h * 0.32); ctx.lineTo(w * 0.95, h * 0.28); ctx.lineTo(w * 0.85, h * 0.12); ctx.lineTo(w * 0.62, h * 0.08); ctx.quadraticCurveTo(w * 0.5, h * 0.14, w * 0.38, h * 0.08); ctx.closePath()
  ctx.fillStyle = tshirtHex; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.stroke()

  // Text design
  const cx = w * 0.5; const cy = h * 0.45
  ctx.fillStyle = scheme[0]; ctx.textAlign = 'center'
  if (styleId === 'minimal') {
    ctx.font = '24px sans-serif'; ctx.fillText(keyword, cx, cy)
  } else if (styleId === 'street') {
    ctx.font = 'bold 40px Impact'; ctx.fillText(keyword.toUpperCase(), cx, cy)
  } else {
    ctx.font = 'bold 30px sans-serif'; ctx.fillText(keyword, cx, cy)
  }
}

// ==================== Main Component ====================
export default function AISelectShop() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [showSettings, setShowSettings] = useState(false)
  
  // Data
  const [trends, setTrends] = useState<TrendKeyword[]>([])
  const [designs, setDesigns] = useState<DesignRecord[]>([])
  const [trendsLoading, setTrendsLoading] = useState(true)
  
  // Current Design
  const [designKeyword, setDesignKeyword] = useState('')
  const [designStyle, setDesignStyle] = useState('minimal')
  const [designTshirtColor, setDesignTshirtColor] = useState('black')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch('/api/tools/trends');
        const data = await res.json();
        setTrends(data.trends?.map((t: any, i: number) => ({
          id: String(i), name: t.title, score: 90 - i*5, category: 'トレンド', direction: '↑', traffic: t.traffic || '100K'
        })) || []);
      } catch {
        setTrends([{ id: '1', name: '猫耳サイバーパンク', score: 95, category: 'ファッション', direction: '↑', traffic: '500K' }]);
      }
      setTrendsLoading(false);
    }
    fetchTrends();
  }, [])

  useEffect(() => {
    if (currentStep === 2 && canvasRef.current) {
      drawTshirt(canvasRef.current, designKeyword, designStyle, COLOR_SCHEMES[0].colors, TSHIRT_COLORS.find(c => c.id === designTshirtColor)?.hex || '#000')
    }
  }, [designKeyword, designStyle, designTshirtColor, currentStep])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 md:p-8">
      {/* ⚙️ HEADER with Settings */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12 bg-slate-900/50 p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">🏪</div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-wider">AI Select Shop</h1>
            <p className="text-xs text-slate-500">Trend Analysis & Auto Design</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="rounded-full hover:bg-white/5">
          <Settings className="h-6 w-6 text-slate-400" />
        </Button>
      </div>

      {/* 🟢 STEP PROGRESS */}
      <div className="max-w-2xl mx-auto flex items-center justify-between mb-16 px-4">
        {[
          { s: 1, label: 'Trend', icon: TrendingUp },
          { s: 2, label: 'Design', icon: Palette },
          { s: 3, label: 'Launch', icon: Rocket }
        ].map((item, i) => (
          <div key={item.s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-2 transition-all ${currentStep === item.s ? 'scale-110 opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${currentStep === item.s ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-800 border-slate-700'}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </div>
            {i < 2 && <div className={`h-1 flex-1 mx-4 rounded-full ${currentStep > item.s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      {/* 🔵 STEP CONTENT */}
      <div className="max-w-6xl mx-auto">
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">売れるトレンドを選ぶ</h2>
              <p className="text-slate-400">Googleのリアルタイム検索データをAIが解析。今この瞬間の需要を狙います。</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map(kw => (
                <Card key={kw.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-2xl overflow-hidden" onClick={() => { setDesignKeyword(kw.name); setCurrentStep(2) }}>
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-0 px-3 py-1 font-bold">{kw.category}</Badge>
                      <BarChart3 className="text-emerald-500/30 h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{kw.name}</h3>
                    <div className="flex items-center justify-between text-sm mt-6 pt-6 border-t border-white/5">
                      <span className="text-slate-500 font-mono">{kw.traffic}+ Searches</span>
                      <div className="flex items-center gap-1 text-emerald-400 font-black italic">CHOOSE <ChevronRight className="h-4 w-4" /></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Palette className="text-emerald-400 h-8 w-8" /> デザイン確定</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Keyword</Label>
                  <Input value={designKeyword} onChange={(e) => setDesignKeyword(e.target.value)} className="bg-slate-950 border-slate-800 h-14 text-xl font-bold text-white rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Select Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {STYLES.map(s => (
                      <button key={s.id} onClick={() => setDesignStyle(s.id)} className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${designStyle === s.id ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                        {s.emoji} <br/> {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">T-shirt Color</Label>
                  <div className="flex gap-6">
                    {TSHIRT_COLORS.map(c => (
                      <button key={c.id} onClick={() => setDesignTshirtColor(c.id)} className={`w-12 h-12 rounded-full border-2 transition-all shadow-xl ${designTshirtColor === c.id ? 'ring-4 ring-emerald-500 ring-offset-4 ring-offset-[#0a0a0f] scale-110' : 'border-slate-700'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                </div>
                <Button onClick={() => {
                  const url = canvasRef.current?.toDataURL();
                  setDesigns([{ id: Date.now().toString(), keyword: designKeyword, style: designStyle, tshirtColor: designTshirtColor, sellingPrice: 3500, status: '下書き', canvasDataUrl: url || '', colorScheme: [] }, ...designs]);
                  setCurrentStep(3);
                }} className="w-full h-20 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-2xl rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 mt-10 gap-3 transition-transform hover:scale-[1.02]">
                  ショップへ出品する <Rocket className="h-8 w-8" />
                </Button>
              </div>
            </div>
            <div className="text-center space-y-6">
              <span className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">AI Render Preview</span>
              <div className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl aspect-[3/4] flex items-center justify-center relative overflow-hidden group">
                <canvas ref={canvasRef} width={400} height={500} className="w-full h-full object-contain rounded-2xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 font-medium">※ 全自動で商用利用可能なデザインが生成されます</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Shop Dashboard</h2>
                <p className="text-slate-400">出品済みのデザイン管理とShopify同期。</p>
              </div>
              <Button onClick={() => setCurrentStep(1)} className="bg-white text-black font-bold rounded-2xl px-8 h-14 hover:bg-slate-200">✨ 新規作成</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designs.map(d => (
                <Card key={d.id} className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl group border-2 hover:border-emerald-500/30 transition-all">
                  <div className="aspect-square bg-slate-950 flex items-center justify-center p-10 relative">
                    <img src={d.canvasDataUrl} alt={d.keyword} className="w-full h-full object-contain rounded-2xl shadow-2xl" />
                    <Badge className="absolute top-6 right-6 bg-blue-600 text-white border-0 px-4 py-1.5 rounded-full font-black text-[10px]">READY TO SYNC</Badge>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-white mb-2">{d.keyword}</h3>
                    <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest">{d.style} ・ {d.tshirtColor}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-2xl font-black text-emerald-400">¥{d.sellingPrice.toLocaleString()}</span>
                      <Button className="bg-white text-black font-black rounded-xl hover:bg-slate-200 gap-2">
                        <ShoppingCart className="h-4 w-4" /> Shopify出品
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {designs.length === 0 && (
                <div className="col-span-full py-40 text-center bg-slate-900/20 border-4 border-dashed border-slate-800 rounded-[3rem]">
                  <p className="text-slate-600 font-black text-2xl uppercase italic tracking-widest">No Designs Yet</p>
                  <Button onClick={() => setCurrentStep(1)} className="mt-8 bg-slate-800 text-white px-10 h-16 rounded-2xl font-bold">Start First Design</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ⚙️ SETTINGS OVERLAY (RESTORED) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-8 uppercase italic tracking-widest">System Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-500 font-bold text-xs uppercase">Shopify Store Domain</Label>
                <Input defaultValue="z5ju1n-vs.myshopify.com" className="bg-slate-950 border-slate-800 h-12 rounded-xl text-white font-mono" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-500 font-bold text-xs uppercase">Profit Margin (%)</Label>
                <Input type="number" defaultValue="150" className="bg-slate-950 border-slate-800 h-12 rounded-xl text-white font-mono" />
              </div>
              <div className="pt-6">
                <Button onClick={() => setShowSettings(false)} className="w-full h-14 bg-white text-black font-black rounded-2xl">設定を保存して閉じる</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
