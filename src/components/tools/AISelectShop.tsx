'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  TrendingUp, Activity, Database, Terminal, Sparkles, Wand2, Box, Palette, Shirt, 
  Trash2, Globe, RefreshCw, X, Settings, Store, Loader2, FileDown, CheckCircle2 
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

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
  { id: 'japanese', name: '和風', emoji: '⛩️' },
]

const TSHIRT_COLORS = [
  { id: 'white', name: '白', hex: '#FFFFFF', textColor: '#000000' },
  { id: 'black', name: '黒', hex: '#1a1a1a', textColor: '#FFFFFF' },
  { id: 'gray', name: 'グレー', hex: '#6b7280', textColor: '#FFFFFF' },
  { id: 'navy', name: 'ネイビー', hex: '#1e3a5f', textColor: '#FFFFFF' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

// ==================== Component ====================
export default function AISelectShop() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [designs, setDesigns] = useState<any[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [trendsLoading, setTrendsLoading] = useState(true)
  const [designKeyword, setDesignKeyword] = useState('')
  const [designStyle, setDesignStyle] = useState('minimal')
  const [designTshirtColor, setDesignTshirtColor] = useState('black')
  const [designSizes, setDesignSizes] = useState<string[]>(SIZES)
  const [designGenerated, setDesignGenerated] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsClient(true)
    const savedDesigns = localStorage.getItem(STORAGE_KEYS.designs)
    if (savedDesigns) setDesigns(JSON.parse(savedDesigns))
    
    fetch('/api/trends')
      .then(res => res.json())
      .then(data => {
        if (data.trends) setTrends(data.trends)
        setTrendsLoading(false)
      })
      .catch(() => setTrendsLoading(false))
  }, [])

  const generateDesign = () => {
    if (!canvasRef.current || !designKeyword) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    
    const w = canvasRef.current.width
    const h = canvasRef.current.height
    const tc = TSHIRT_COLORS.find(c => c.id === designTshirtColor) || TSHIRT_COLORS[1]
    
    ctx.fillStyle = '#0f0f1a'
    ctx.fillRect(0, 0, w, h)
    
    // T-shirt Shape
    ctx.fillStyle = tc.hex
    ctx.beginPath()
    ctx.moveTo(w*0.2, h*0.1)
    ctx.lineTo(w*0.8, h*0.1)
    ctx.lineTo(w*0.9, h*0.3)
    ctx.lineTo(w*0.8, h*0.3)
    ctx.lineTo(w*0.8, h*0.9)
    ctx.lineTo(w*0.2, h*0.9)
    ctx.lineTo(w*0.2, h*0.3)
    ctx.lineTo(w*0.1, h*0.3)
    ctx.closePath()
    ctx.fill()
    
    // Text
    ctx.fillStyle = tc.textColor
    ctx.font = 'bold 40px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(designKeyword.toUpperCase(), w/2, h/2)
    setDesignGenerated(true)
  }

  const addToStore = () => {
    if (!canvasRef.current) return
    const newDesign = {
      id: Date.now().toString(),
      keyword: designKeyword,
      canvasDataUrl: canvasRef.current.toDataURL(),
      status: '下書き'
    }
    const updated = [newDesign, ...designs]
    setDesigns(updated)
    localStorage.setItem(STORAGE_KEYS.designs, JSON.stringify(updated))
    setCurrentStep(3)
  }

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI SELECT SHOP</h1>
          <Badge className="bg-emerald-500 text-slate-950 font-black px-6 py-1 rounded-full uppercase italic">v12.0-STABLE</Badge>
        </div>

        {/* Step Nav */}
        <div className="flex gap-2 justify-center">
          {[1, 2, 3].map(s => (
            <Button key={s} onClick={() => setCurrentStep(s as any)} variant={currentStep === s ? 'default' : 'outline'} className={currentStep === s ? 'bg-emerald-500' : ''}>
              Step {s}
            </Button>
          ))}
        </div>

        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {trends.map((t, i) => (
              <Card key={i} className="bg-[#12121a] border-white/5 p-6 hover:border-emerald-500/50 cursor-pointer" onClick={() => { setDesignKeyword(t); setCurrentStep(2); }}>
                <p className="text-xl font-black italic uppercase text-white">{t}</p>
                <p className="text-xs text-emerald-500 font-bold mt-2">TRENDING NOW</p>
              </Card>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid lg:grid-cols-2 gap-10 animate-in zoom-in-95">
            <div className="bg-[#13141f] p-8 rounded-[3rem] border border-white/5 space-y-6">
              <Label className="text-xs font-black uppercase text-slate-500">Master Parameter</Label>
              <Input value={designKeyword} onChange={(e) => setDesignKeyword(e.target.value)} className="h-16 text-2xl font-black italic bg-black border-white/10" />
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={generateDesign} className="h-20 bg-white text-black font-black text-xl italic uppercase rounded-2xl hover:bg-emerald-500">Execution</Button>
                <Button onClick={addToStore} disabled={!designGenerated} className="h-20 bg-emerald-600 text-white font-black text-xl italic uppercase rounded-2xl">Add to List</Button>
              </div>
            </div>
            <div className="flex justify-center bg-[#13141f] rounded-[3rem] border border-white/5 p-10">
              <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-2xl shadow-2xl" />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
            {designs.map(d => (
              <Card key={d.id} className="bg-[#12121a] border-white/5 p-4">
                <img src={d.canvasDataUrl} className="w-full aspect-[4/5] object-cover rounded-xl mb-4" />
                <div className="flex justify-between items-center">
                  <p className="font-black italic text-white">{d.keyword}</p>
                  <Badge className="bg-white/10 text-slate-400">{d.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <DebugPanel data={{ currentStep, designs }} toolId="ai-select-shop-stable" />
    </div>
  )
}
