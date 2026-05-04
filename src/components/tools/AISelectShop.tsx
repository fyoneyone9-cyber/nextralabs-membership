'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Palette, Rocket, ArrowRight, CheckCircle2, ChevronRight, Settings, Download, Trash2, ShoppingCart, Info, ExternalLink } from 'lucide-react'

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
  tshirtColor: string
  sellingPrice: number
  status: '出品中' | '下書き'
  canvasDataUrl: string
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

const TSHIRT_COLORS = [
  { id: 'white', name: '白', hex: '#FFFFFF' },
  { id: 'black', name: '黒', hex: '#1a1a1a' },
  { id: 'navy', name: 'ネイビー', hex: '#1e3a5f' },
]

// ==================== Main Component ====================
export default function AISelectShop() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [trends, setTrends] = useState<TrendKeyword[]>([])
  const [loading, setLoading] = useState(true)
  const [designs, setDesigns] = useState<DesignRecord[]>([])
  
  // Design state
  const [designKeyword, setDesignKeyword] = useState('')
  const [designStyle, setDesignStyle] = useState('minimal')
  const [designTshirtColor, setDesignTshirtColor] = useState('black')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize
  useEffect(() => {
    const mockTrends: TrendKeyword[] = [
      { id: '1', name: '猫耳サイバーパンク', score: 95, category: 'ファッション', direction: '↑', traffic: '500K' },
      { id: '2', name: '昭和レトロポップ', score: 88, category: 'デザイン', direction: '↗', traffic: '200K' },
      { id: '3', name: 'ミニマル瞑想', score: 82, category: 'ライフスタイル', direction: '→', traffic: '100K' },
      { id: '4', name: '都市伝説スニーカー', score: 75, category: 'ストリート', direction: '↑', traffic: '80K' },
      { id: '5', name: 'AIアシスタント美少女', score: 92, category: 'テック', direction: '↑', traffic: '400K' },
    ]
    setTrends(mockTrends)
    setLoading(false)
  }, [])

  // 🛠️ Fixed: useEffect should be here, outside JSX
  useEffect(() => {
    if (currentStep === 2) {
      generateDesign()
    }
  }, [designKeyword, designStyle, designTshirtColor, currentStep])

  const selectTrend = (name: string) => {
    setDesignKeyword(name)
    setCurrentStep(2)
  }

  const generateDesign = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = designTshirtColor === 'black' ? '#1a1a1a' : designTshirtColor === 'navy' ? '#1e3a5f' : '#ffffff'
    ctx.fillRect(0, 0, 400, 400)
    ctx.fillStyle = designTshirtColor === 'white' ? '#000000' : '#ffffff'
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(designKeyword, 200, 200)
    ctx.font = '14px sans-serif'
    ctx.fillText(designStyle.toUpperCase(), 200, 240)
  }

  const addToStore = () => {
    const newDesign: DesignRecord = {
      id: Math.random().toString(36).substr(2, 9),
      keyword: designKeyword,
      style: designStyle,
      tshirtColor: designTshirtColor,
      sellingPrice: 3500,
      status: '下書き',
      canvasDataUrl: canvasRef.current?.toDataURL() || '',
    }
    setDesigns([newDesign, ...designs])
    setCurrentStep(3)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen text-slate-200">
      
      {/* 🟢 STEP INDICATOR */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
        {[
          { step: 1, label: 'トレンド', icon: TrendingUp },
          { step: 2, label: 'デザイン', icon: Palette },
          { step: 3, label: '出品', icon: Rocket }
        ].map((item, i) => (
          <div key={item.step} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-2 group cursor-pointer transition-all ${currentStep === item.step ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-60'}`} onClick={() => setCurrentStep(item.step as any)}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${currentStep === item.step ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold">{item.label}</span>
            </div>
            {i < 2 && <div className={`h-0.5 flex-1 mx-4 rounded-full transition-all ${currentStep > item.step ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentStep === 1 && (
          <div className="space-y-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-3 text-white">トレンドをキャッチする</h2>
              <p className="text-slate-400">AIがリアルタイムで解析した、いま「売れる」キーワードです。</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
              {trends.map((kw) => (
                <Card key={kw.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xl" onClick={() => selectTrend(kw.name)}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-0">{kw.category}</Badge>
                      <span className="text-2xl font-bold text-emerald-400">{kw.direction}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{kw.name}</h3>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{kw.traffic}+ 検索</span>
                      <div className="flex items-center gap-1 text-emerald-500 font-bold">
                        選択する <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Palette className="text-emerald-400" /> デザインを確定する
                </h2>
                <div className="space-y-4">
                  <Label className="text-slate-400">デザインキーワード</Label>
                  <Input value={designKeyword} onChange={(e) => setDesignKeyword(e.target.value)} className="bg-slate-950 border-slate-700 h-12 text-lg font-bold text-white rounded-xl" />
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">スタイルを選択</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {STYLES.map(s => (
                      <button key={s.id} onClick={() => setDesignStyle(s.id)} className={`p-3 rounded-xl border-2 transition-all text-sm ${designStyle === s.id ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                        {s.emoji} {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">Tシャツの色</Label>
                  <div className="flex gap-4">
                    {TSHIRT_COLORS.map(c => (
                      <button key={c.id} onClick={() => setDesignTshirtColor(c.id)} className={`w-10 h-10 rounded-full border-2 transition-all ${designTshirtColor === c.id ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-slate-950 scale-110' : 'border-slate-700'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                </div>
                <Button onClick={addToStore} className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl rounded-2xl shadow-xl shadow-emerald-500/20 mt-8 gap-2">
                  ショップへ出品する <Rocket className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="space-y-4 text-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Real-time Preview</span>
              <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden aspect-[3/4] flex flex-col items-center justify-center relative">
                <canvas ref={canvasRef} width={400} height={400} className="w-full h-full object-contain rounded-xl" />
              </div>
              <p className="text-xs text-slate-500">※ デザインはAIによって最適化されています</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
             <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">ショップ管理</h2>
                <p className="text-slate-400">出品済みのデザインと販売状況を確認できます。</p>
              </div>
              <Button onClick={() => setCurrentStep(1)} variant="outline" className="border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/10">
                ✨ 新しく作る
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map(d => (
                <Card key={d.id} className="bg-slate-900 border-slate-800 overflow-hidden rounded-3xl group shadow-2xl">
                  <div className="aspect-square bg-slate-950 flex items-center justify-center p-6 relative">
                    <img src={d.canvasDataUrl} alt={d.keyword} className="w-full h-full object-contain rounded-lg" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-0">出品待ち</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-1">{d.keyword}</h3>
                    <p className="text-xs text-slate-500 mb-4">{d.style} ・ {d.tshirtColor}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <span className="text-xl font-bold text-emerald-400">¥{d.sellingPrice.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-slate-500 hover:text-white" onClick={() => setDesigns(designs.filter(x => x.id !== d.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-white text-black font-bold rounded-lg hover:bg-slate-200">
                          Shopify連携
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {designs.length === 0 && (
                <div className="col-span-full py-32 text-center bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                  <ShoppingCart className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-lg">まだ出品されたアイテムはありません</p>
                  <Button onClick={() => setCurrentStep(1)} className="mt-6 bg-slate-800 text-white rounded-xl">最初のデザインを作る</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-20 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex gap-6 items-start">
        <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400">
          <Info className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">一本道UIによる直感操作</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            トレンドを選ぶだけでデザインが完成し、そのまま出品リストへ。
            複雑な設定を排除し、クリエイティブな作業に集中できるよう設計されています。
          </p>
        </div>
      </div>
    </div>
  )
}
