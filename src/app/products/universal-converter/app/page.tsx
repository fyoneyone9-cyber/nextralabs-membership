'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Image as ImageIcon,
  FileText,
  Upload, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download,
  ShieldCheck,
  Layout,
  Repeat
} from 'lucide-react'

export default function UniversalConverterApp() {
  const [mode, setMode] = useState<'video' | 'image' | 'pdf'>('video')
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleModeChange = (newMode: 'video' | 'image' | 'pdf') => {
    setMode(newMode)
    setFile(null)
    setResultUrl(null)
    setError(null)
    if (newMode === 'video') setTargetFormat('mp4')
    if (newMode === 'image') setTargetFormat('webp')
    if (newMode === 'pdf') setTargetFormat('pdf-min')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      // 簡易的な形式チェック
      if (mode === 'video' && !selected.type.startsWith('video/')) {
        setError('動画ファイルを選択してください。')
        return
      }
      if (mode === 'image' && !selected.type.startsWith('image/')) {
        setError('画像ファイルを選択してください。')
        return
      }
      if (mode === 'pdf' && selected.type !== 'application/pdf') {
        setError('PDFファイルを選択してください。')
        return
      }

      if (selected.size > 100 * 1024 * 1024) {
        setError('ファイルサイズが大きすぎます（最大100MB）。')
        return
      }
      setFile(selected)
      setError(null)
      setResultUrl(null)
    }
  }

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setProgress(5)

    try {
      // シミュレーション
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer)
            return 95
          }
          return prev + (mode === 'video' ? 2 : 10)
        })
      }, 500)

      await new Promise(resolve => setTimeout(resolve, mode === 'video' ? 6000 : 3000))
      
      clearInterval(timer)
      setProgress(100)
      setResultUrl(`https://example.com/output_file.${targetFormat.split('-')[0]}`)
    } catch (err) {
      setError('処理中にエラーが発生しました。')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Repeat className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">UNIVERSAL AI CONVERTER</h1>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest italic">Video • Image • PDF</p>
            </div>
          </div>
          <Badge className="w-fit bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 font-black uppercase italic">
            MASTERMODEL v2.0
          </Badge>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'video', label: '動画変換', icon: Video },
            { id: 'image', label: '画像変換', icon: ImageIcon },
            { id: 'pdf', label: 'PDF圧縮', icon: FileText }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id as any)}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all border-2 ${
                mode === m.id 
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 text-slate-500 border-white/5 hover:border-emerald-500/30'
              }`}
            >
              <m.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Main Interface */}
        <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardContent className="p-8 md:p-12">
            {!resultUrl ? (
              <div className="space-y-8">
                {/* Target Formats for Video/Image */}
                {mode !== 'pdf' && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(mode === 'video' ? ['mp4', 'webm', 'gif', 'mp3'] : ['webp', 'png', 'jpg', 'ico']).map((f) => (
                      <button
                        key={f}
                        onClick={() => setTargetFormat(f)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          targetFormat === f ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-white/5 text-slate-600'
                        }`}
                      >
                        {f === 'mp3' ? 'Extract Audio' : `To ${f.toUpperCase()}`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Upload Zone */}
                <div className={`relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-300 text-center ${
                  file ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'
                }`}>
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={isProcessing} />
                  <div className="space-y-4">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-2 ${file ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                      {isProcessing ? <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" /> : file ? <CheckCircle2 className="h-10 w-10 text-emerald-400" /> : <Upload className="h-10 w-10 text-slate-500" />}
                    </div>
                    <div>
                      <p className="text-xl font-black text-white italic uppercase mb-1">{file ? file.name : `${mode.toUpperCase()}ファイルを選択`}</p>
                      <p className="text-sm text-slate-500 font-bold uppercase italic">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Drop here or Click'}</p>
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <Button onClick={handleProcess} disabled={!file || isProcessing} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-2xl shadow-xl uppercase italic">
                  {isProcessing ? 'AI Processing...' : `Start ${mode === 'pdf' ? 'Compression' : 'Conversion'}`}
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-8 py-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] mb-2">
                  <CheckCircle2 className="h-12 w-12 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Success!</h2>
                  <p className="text-emerald-500 font-bold italic uppercase tracking-widest">AIによる最適化が完了しました</p>
                </div>
                <div className="flex flex-col gap-4">
                  <Button className="h-20 bg-white text-emerald-950 hover:bg-emerald-50 font-black text-2xl rounded-2xl shadow-xl uppercase italic tracking-tighter">
                    <Download className="mr-3 h-6 w-6" /> DOWNLOAD {targetFormat.toUpperCase()}
                  </Button>
                  <Button variant="ghost" onClick={() => {setResultUrl(null); setFile(null);}} className="text-slate-500 hover:text-white font-bold uppercase italic">
                    続けて他のファイルを処理する
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Lock Info */}
        <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 text-center">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">🚨 Nextra利用規約に基づく制限</p>
          <p className="text-sm text-slate-400 font-bold italic">
            本ツールは「動画・画像・PDF」のどれを使用しても、<span className="text-white">全プラン共通の1カウント</span>として集計されます。<br/>
            プランごとの1日上限回数を守ってご利用ください。
          </p>
        </div>
      </div>
    </div>
  )
}
