'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef } from 'react'

// ブラウザ専用の機能をすべてDynamic ImportでラップしてSSRから隔離する
const ClientSideEngine = dynamic(() => Promise.resolve(({ data, trendsInitial }: any) => {
  const { Button } = require('@/components/ui/button')
  const { Card, CardContent } = require('@/components/ui/card')
  const { Badge } = require('@/components/ui/badge')
  const { Input } = require('@/components/ui/input')
  const { Label } = require('@/components/ui/label')
  const { TrendingUp, Activity, Terminal, Sparkles, Wand2, Palette, Shirt, Trash2, Globe, RefreshCw, X, Store, Loader2, Eye, ChevronRight, Box } = require('lucide-react')

  const STORAGE_KEYS = { designs: 'ai-select-shop-designs' }
  const STYLES = [
    { id: 'minimal', name: 'ミニマル', emoji: '⬜', kw: 'minimalist,clean' },
    { id: 'street', name: 'ストリート', emoji: '🏙️', kw: 'streetwear,urban' },
    { id: 'retro', name: 'レトロ', emoji: '📻', kw: 'retro,vintage' },
    { id: 'cyberpunk', name: 'サイバーパンク', emoji: '🌃', kw: 'cyberpunk,neon' },
    { id: 'kawaii', name: 'かわいい', emoji: '🎀', kw: 'kawaii,pastel' },
    { id: 'japanese', name: '和風', emoji: '⛩️', kw: 'japanese,tradition' },
  ]
  const TSHIRT_COLORS = [
    { id: 'white', name: '白', hex: '#FFFFFF' },
    { id: 'black', name: '黒', hex: '#1a1a1a' },
    { id: 'navy', name: 'ネイビー', hex: '#1e3a5f' },
  ]
  const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

  const [currentStep, setCurrentStep] = useState(1)
  const [trends, setTrends] = useState(trendsInitial || [])
  const [designs, setDesigns] = useState([])
  const [designKeyword, setDesignKeyword] = useState('')
  const [designStyle, setDesignStyle] = useState('japanese')
  const [designTshirtColor, setDesignTshirtColor] = useState('black')
  const [designGenerated, setDesignGenerated] = useState(false)
  const [mockupImage, setMockupImage] = useState(null)
  
  const canvasRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.designs)
    if (saved) setDesigns(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (!designKeyword) return
    const timer = setTimeout(() => {
      const ts = new Date().getTime()
      const style = STYLES.find(s => s.id === designStyle)
      setMockupImage(`https://loremflickr.com/800/800/tshirt,${style?.kw || 'design'}?lock=${ts}&text=${encodeURIComponent(designKeyword)}`)
    }, 600)
    return () => clearTimeout(timer)
  }, [designKeyword, designStyle, designTshirtColor])

  const executeDesign = () => {
    if (!canvasRef.current || !designKeyword) return
    const ctx = canvasRef.current.getContext('2d')
    const w = canvasRef.current.width, h = canvasRef.current.height
    const tc = TSHIRT_COLORS.find(c => c.id === designTshirtColor) || TSHIRT_COLORS[1]
    ctx.fillStyle = '#0f0f1a'; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = tc.hex; ctx.beginPath()
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1); ctx.lineTo(w*0.9, h*0.3); ctx.lineTo(w*0.8, h*0.3); ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9); ctx.lineTo(w*0.2, h*0.3); ctx.lineTo(w*0.1, h*0.3); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'
    if (designStyle === 'japanese') {
       ctx.font = 'bold 30px serif'
       designKeyword.split('').forEach((ch, i) => ctx.fillText(ch, w/2, h/2 - 60 + i*40))
    } else {
       ctx.font = '900 45px Impact'; ctx.fillText(designKeyword.toUpperCase(), w/2, h/2)
    }
    setDesignGenerated(true)
  }

  const addToList = () => {
    const newDesign = { id: Date.now().toString(), keyword: designKeyword, canvasDataUrl: canvasRef.current.toDataURL(), status: 'READY' }
    const updated = [newDesign, ...designs]
    setDesigns(updated); localStorage.setItem(STORAGE_KEYS.designs, JSON.stringify(updated))
    setCurrentStep(3)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI SELECT SHOP</h1>
        <Badge className="bg-[#5845e0] text-white font-black px-8 py-2 rounded-full uppercase italic text-sm">v12.0-ULTIMATE</Badge>
      </div>
      <div className="flex gap-4 justify-center bg-[#1a1b26]/50 p-2 rounded-3xl border border-white/5 max-w-2xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s)} className={`flex-1 py-4 rounded-2xl font-black italic transition-all ${currentStep === s ? 'bg-[#5845e0] text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}>Step {s}</button>
        ))}
      </div>
      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {trends.map((t) => (
            <Card key={t.id} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer group transition-all" onClick={() => { setDesignKeyword(t.name); setCurrentStep(2); }}>
              <div className="flex justify-between items-start mb-6"><Badge variant="outline" className="text-indigo-400 border-indigo-400/30">TRENDING</Badge><TrendingUp className="text-indigo-500" /></div>
              <p className="text-3xl font-black italic uppercase text-white tracking-tighter">{t.name}</p>
            </Card>
          ))}
        </div>
      )}
      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in zoom-in-95">
          <div className="bg-[#13141f] p-10 rounded-[3rem] border-2 border-white/5 space-y-10 shadow-2xl">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Master Parameter</Label>
              <Input value={designKeyword} onChange={(e) => setDesignKeyword(e.target.value)} className="h-20 text-3xl font-black italic bg-black border-2 border-white/10 rounded-2xl px-8 focus:border-[#5845e0]" />
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Design Style</Label>
                  <div className="grid grid-cols-2 gap-2">
                     {STYLES.map(s => <button key={s.id} onClick={() => setDesignStyle(s.id)} className={`py-3 rounded-xl text-[10px] font-black uppercase italic border-2 transition-all ${designStyle === s.id ? 'bg-[#5845e0] text-white border-white shadow-lg' : 'bg-black text-slate-500 border-white/5'}`}>{s.name}</button>)}
                  </div>
               </div>
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Fabric Tone</Label>
                  <div className="flex gap-3">
                     {TSHIRT_COLORS.map(c => <button key={c.id} onClick={() => setDesignTshirtColor(c.id)} className={`w-12 h-12 rounded-2xl border-4 transition-all ${designTshirtColor === c.id ? 'border-[#5845e0] scale-110 shadow-xl' : 'border-white/5'}`} style={{ backgroundColor: c.hex }} />)}
                  </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <Button onClick={executeDesign} className="h-24 bg-white text-slate-950 font-black text-2xl italic uppercase rounded-[2rem] hover:bg-[#5845e0] hover:text-white shadow-xl">EXECUTION</Button>
              <Button onClick={addToList} disabled={!designGenerated} className="h-24 bg-emerald-600 text-white font-black text-2xl italic uppercase rounded-[2rem] shadow-xl flex items-center justify-center gap-3">SYNC STORE <ArrowRight /></Button>
            </div>
          </div>
          <div className="bg-[#13141f] rounded-[3rem] border-2 border-white/5 p-12 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8 w-full"><Activity className="text-indigo-400" /><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Monitor</h3></div>
            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-white/5 bg-black shadow-inner">
              {mockupImage ? <img src={mockupImage} className="w-full h-full object-cover animate-in fade-in" alt="Preview" /> : <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20"><Eye size={64}/><p className="text-xs font-black uppercase mt-4">Awaiting Signal</p></div>}
            </div>
            <canvas ref={canvasRef} width={400} height={500} className="hidden" />
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
          {designs.map(d => (
            <Card key={d.id} className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl group hover:border-emerald-500/30 transition-all">
              <img src={d.canvasDataUrl} className="w-full aspect-[4/5] object-cover bg-black" />
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center"><p className="text-2xl font-black italic uppercase text-white tracking-tighter">{d.keyword}</p><Badge className="bg-emerald-500 text-slate-950 font-black italic uppercase text-[10px] px-4 py-1">READY</Badge></div>
                <Button onClick={() => window.open(`https://z5ju1n-vs.myshopify.com/admin/products`, '_blank')} className="w-full h-16 bg-white text-slate-950 font-black rounded-2xl italic uppercase flex items-center justify-center gap-3">Shopify Open</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}), { ssr: false });

export default function AISelectShop() {
  const [trends, setTrends] = useState([]);
  useEffect(() => {
    fetch('/api/trends').then(r => r.json()).then(d => {
      if (d && d.trends) setTrends(d.trends.map((t, i) => ({ id: `t-${i}`, name: t })));
      else setTrends([{ id: '1', name: 'AIエージェント' }, { id: '2', name: '働き方改革' }]);
    }).catch(() => setTrends([{ id: '1', name: 'AI革命' }]));
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 pb-32">
      <ClientSideEngine trendsInitial={trends} />
      <DebugPanel data={{ trends }} toolId="ai-select-shop-ultimate-no-ssr" />
    </div>
  );
}
