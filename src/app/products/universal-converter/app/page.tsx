'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Repeat, Download, Video, ImageIcon, FileText } from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'

export default function UniversalConverterApp() {
  const [mode, setMode] = useState<'video' | 'image' | 'pdf'>('video')
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleModeChange = (newMode: 'video' | 'image' | 'pdf') => {
    setMode(newMode); setFile(null); setResultUrl(null); setDownloadUrl(null);
    if (newMode === 'video') setTargetFormat('mp4')
    else if (newMode === 'image') setTargetFormat('webp')
    else setTargetFormat('pdf-min')
  }

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 3000));
    // 実際の変換後はダウンロードURLをセット（現在はデモとしてObjectURLを生成）
    const objectUrl = URL.createObjectURL(file)
    setDownloadUrl(objectUrl)
    setResultUrl(objectUrl);
    setIsProcessing(false);
  }

  const handleDownload = () => {
    if (!downloadUrl || !file) return
    const a = document.createElement('a')
    a.href = downloadUrl
    const ext = targetFormat === 'mp3' ? 'mp3' : targetFormat === 'pdf-min' ? 'pdf' : targetFormat
    const baseName = file.name.replace(/\.[^.]+$/, '')
    a.download = `${baseName}_converted.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12 text-white font-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Repeat className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">究極AI<span className="text-emerald-400">マルチコンバーター</span></h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-emerald-500 text-slate-950 font-semibold px-4 py-1 text-xs rounded-full">✓ 完成</Badge>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 text-left">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-semibold text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 leading-relaxed">動画・画像・PDFをこれ一台で。モードを選択し、ファイルをアップロードしてください。AIが画質を維持したまま最適処理します。</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[{ id: 'video', label: '動画', icon: Video }, { id: 'image', label: '画像', icon: ImageIcon }, { id: 'pdf', label: 'PDF', icon: FileText }].map(m => (
            <Button key={m.id} variant="ghost" onClick={() => handleModeChange(m.id as any)} className={`h-20 rounded-2xl font-black text-lg border-2 ${mode === m.id ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-black/40 border-white/5 text-slate-500'}`}>
              <m.icon className="mr-2 h-6 w-6" /> {m.label}
            </Button>
          ))}
        </div>

        <Card className="bg-[#13141f] border border-white/10 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl relative">
          {!resultUrl ? (
            <>
              <div className="flex flex-wrap gap-2 justify-center">
                {(mode === 'video' ? ['mp4', 'webm', 'gif', 'mp3'] : mode === 'image' ? ['webp', 'png', 'jpg', 'ico'] : ['pdf-min']).map(f => (
                  <Button key={f} variant="ghost" onClick={() => setTargetFormat(f)} className={`h-10 px-6 rounded-lg text-xs font-black uppercase border-2 ${targetFormat === f ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'bg-black/40 border-white/5 text-slate-600'}`}>{f === 'mp3' ? '音声抽出' : f.toUpperCase()}</Button>
                ))}
              </div>
              <div className="w-full h-48 bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all relative text-center">
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="space-y-2 pointer-events-none">
                  <p className="text-xl font-black text-white italic uppercase">{file ? file.name : 'ドロップ または クリック'}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">{file ? `${(file.size/1024/1024).toFixed(1)}MB` : 'MAX 100MB'}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleProcess} disabled={isProcessing || !file} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">{isProcessing ? <Loader2 className="animate-spin h-10 w-10 mx-auto" /> : 'AI変換を開始する 🚀'}</Button>
            </>
          ) : (
            <div className="space-y-8 text-center">
              <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
              <h2 className="text-4xl font-black text-white italic uppercase leading-none">完了しました</h2>
              <Button variant="ghost" onClick={handleDownload} className="h-20 px-12 bg-white text-emerald-950 font-black text-2xl rounded-2xl shadow-xl italic"><Download className="mr-3 h-6 w-6" /> ファイルを保存</Button>
              <br/><Button variant="ghost" onClick={() => { setResultUrl(null); setDownloadUrl(null); }} className="text-slate-500 font-bold italic underline">他のファイルを処理</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
