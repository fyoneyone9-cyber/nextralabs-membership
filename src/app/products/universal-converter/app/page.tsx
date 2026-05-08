'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Video, ImageIcon, FileText, Repeat, Download } from 'lucide-react'

export default function UniversalConverterApp() {
  const [mode, setMode] = useState<'video' | 'image' | 'pdf'>('video')
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleModeChange = (newMode: 'video' | 'image' | 'pdf') => {
    setMode(newMode); setFile(null); setResultUrl(null);
    if (newMode === 'video') setTargetFormat('mp4')
    else if (newMode === 'image') setTargetFormat('webp')
    else setTargetFormat('pdf-min')
  }

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true); setProgress(10);
    await new Promise(r => setTimeout(r, 3000));
    setResultUrl(`https://example.com/output.${targetFormat}`);
    setIsProcessing(false); setProgress(100);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Repeat className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">究極AIマルチコンバーター</h1>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full">MASTERMODEL v2.3</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">動画・画像・PDFの形式変換と圧縮をこれ一台で。モードを選択し、ファイルをドロップしてください。AIが画質を維持したまま、送信やWeb掲載に最適なサイズへ一括処理します。</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[{ id: 'video', label: '動画', icon: Video }, { id: 'image', label: '画像', icon: ImageIcon }, { id: 'pdf', label: 'PDF', icon: FileText }].map(m => (
            <Button key={m.id} onClick={() => handleModeChange(m.id as any)} className={`h-20 rounded-2xl font-black text-lg transition-all border-2 ${mode === m.id ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black/40 border-white/5 text-slate-500'}`}>
              <m.icon className="mr-2 h-6 w-6" /> {m.label}
            </Button>
          ))}
        </div>

        <Card className="bg-[#13141f] border border-white/10 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl">
          {!resultUrl ? (
            <>
              <div className="flex flex-wrap gap-2 justify-center">
                {(mode === 'video' ? ['mp4', 'webm', 'gif', 'mp3'] : mode === 'image' ? ['webp', 'png', 'jpg', 'ico'] : ['pdf-min']).map(f => (
                  <Button key={f} onClick={() => setTargetFormat(f)} className={`h-10 px-6 rounded-lg text-xs font-black uppercase border-2 ${targetFormat === f ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 text-slate-600'}`}>{f === 'mp3' ? '音声抽出' : f.toUpperCase()}</Button>
                ))}
              </div>
              <div className="w-full h-48 bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all">
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="file-up" />
                <label htmlFor="file-up" className="cursor-pointer space-y-2">
                  <p className="text-xl font-black text-white italic uppercase">{file ? file.name : 'ファイルをドロップ または クリック'}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">{file ? `${(file.size/1024/1024).toFixed(1)}MB` : 'MAX 100MB'}</p>
                </label>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing || !file} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">{isProcessing ? 'AI処理中...' : 'AI変換を開始する 🚀'}</Button>
            </>
          ) : (
            <div className="space-y-8">
              <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
              <h2 className="text-4xl font-black text-white italic uppercase">処理が完了しました</h2>
              <Button onClick={() => window.open(resultUrl)} className="h-20 px-12 bg-white text-emerald-950 font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all italic"><Download className="mr-3 h-6 w-6" /> ファイルを保存する</Button>
              <br/><Button variant="ghost" onClick={() => setResultUrl(null)} className="text-slate-500 font-bold uppercase italic underline">続けて他のファイルを処理</Button>
            </div>
          )}
        </Card>

        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
          <p className="text-sm text-slate-400 font-bold italic">※ Nextra利用規約に基づき、全形式共通で1日1回〜3回の利用制限が適用されます。</p>
        </div>
      </div>
    </div>
  )
}
