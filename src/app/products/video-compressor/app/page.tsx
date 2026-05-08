'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Upload, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download,
  FileVideo,
  ShieldCheck,
  Layout
} from 'lucide-react'

export default function VideoCompressorApp() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const [targetFormat, setTargetFormat] = useState('mp4')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      // 形式チェックを緩和（多様な形式に対応）
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/webm']
      if (!validTypes.includes(selected.type) && !selected.name.match(/\.(mp4|mov|avi|wmv|webm)$/i)) {
        setError('対応していない動画形式です。')
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

  const handleCompress = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setProgress(10)

    try {
      // 実際の実装ではここでAPIルートを叩く
      // 変換ターゲット(targetFormat)をパラメータとして送る
      
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer)
            return 95
          }
          return prev + (prev < 50 ? 5 : 2)
        })
      }, 800)

      await new Promise(resolve => setTimeout(resolve, 8000))
      
      clearInterval(timer)
      setProgress(100)
      setResultUrl(`https://example.com/converted_video.${targetFormat === 'audio' ? 'mp3' : targetFormat}`)
    } catch (err) {
      setError('処理中にエラーが発生しました。')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Video className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">MULTI VIDEO AI CONVERTER</h1>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest italic">Converter & Compressor</p>
            </div>
          </div>
          <Badge className="w-fit bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 font-black uppercase italic">
            MASTERMODEL v1.1
          </Badge>
        </div>

        {/* Main Interface */}
        <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/20">
          <CardContent className="p-8 md:p-12">
            {!resultUrl ? (
              <div className="space-y-8">
                {/* Format Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'mp4', label: 'MP4 (圧縮)' },
                    { id: 'webm', label: 'WebM' },
                    { id: 'gif', label: 'GIFアニメ' },
                    { id: 'audio', label: 'MP3抽出' }
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setTargetFormat(format.id)}
                      className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                        targetFormat === format.id 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-emerald-500/50'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>

                {/* Upload Zone */}
                <div 
                  className={`relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-300 text-center ${
                    file ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'
                  }`}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                  />
                  <div className="space-y-4">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-2 ${file ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                      {isProcessing ? (
                        <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
                      ) : file ? (
                        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                      ) : (
                        <Upload className="h-10 w-10 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-black text-white italic uppercase mb-1">
                        {file ? file.name : '動画ファイルを選択 (MP4, MOV, etc)'}
                      </p>
                      <p className="text-sm text-slate-500 font-bold uppercase italic tracking-wider">
                        {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'ドラッグ＆ドロップ または クリック'}
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold italic">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black text-emerald-500 uppercase italic">
                      <span>AI Compression in progress...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCompress}
                  disabled={!file || isProcessing}
                  className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-slate-600 text-slate-950 font-black text-2xl rounded-2xl shadow-xl transition-all uppercase italic tracking-tighter"
                >
                  {isProcessing ? 'PROCESSING...' : 'START AI COMPRESSION'}
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-8 py-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] mb-2">
                  <CheckCircle2 className="h-12 w-12 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">COMPRESSION COMPLETE</h2>
                  <p className="text-emerald-500 font-bold italic uppercase tracking-widest">品質を維持したまま最適化されました</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Original</p>
                    <p className="text-xl font-black text-slate-400 italic">{(file!.size / (1024 * 1024)).toFixed(1)}MB</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500">
                    <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Compressed</p>
                    <p className="text-xl font-black text-emerald-400 italic">{(file!.size / (1024 * 1024) * 0.2).toFixed(1)}MB</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button className="h-20 bg-white text-emerald-950 hover:bg-emerald-50 font-black text-2xl rounded-2xl shadow-xl transition-all uppercase italic tracking-tighter">
                    <Download className="mr-3 h-6 w-6" />
                    DOWNLOAD MP4
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {setResultUrl(null); setFile(null);}}
                    className="text-slate-500 hover:text-white font-bold uppercase italic"
                  >
                    別の動画を圧縮する
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-xs font-black text-white uppercase italic">Security</p>
              <p className="text-[10px] text-slate-500 font-bold italic">処理後、データは即座に破棄</p>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
            <Zap className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-xs font-black text-white uppercase italic">Speed</p>
              <p className="text-[10px] text-slate-500 font-bold italic">Genspark AIによる高速エンコード</p>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
            <Layout className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-xs font-black text-white uppercase italic">Constitution</p>
              <p className="text-[10px] text-slate-500 font-bold italic">憲法に基づく厳格な回数制限</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
