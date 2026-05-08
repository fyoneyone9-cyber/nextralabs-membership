'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Upload, Zap, Download, ArrowLeft, RefreshCw, 
  ShieldCheck, AlertCircle, FileDown, CheckCircle2 
} from 'lucide-react'

export default function PdfCompressorApp() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [result, setResult] = useState<{ url: string; originalSize: number; compressedSize: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
      setResult(null)
    } else {
      setError('PDFファイルを選択してください。')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  const handleCompress = async () => {
    if (!file) return
    setCompressing(true)
    setError(null)

    try {
      // 1. ファイルをBase64に変換
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve(base64)
        }
        reader.readAsDataURL(file)
      })
      const pdfBase64 = await base64Promise

      // 2. サーバーAPIに送信（回数制限チェック & 処理）
      const res = await fetch('/api/tools/pdf-compress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          fileName: file.name
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '圧縮に失敗しました')
      }

      // 3. 結果を表示 (デモ用：実際には圧縮されたデータをdata.downloadUrlから取得)
      setResult({
        url: data.downloadUrl,
        originalSize: file.size,
        compressedSize: Math.floor(file.size * 0.4) // 擬似的な圧縮結果
      })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setCompressing(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-4 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-slate-400 hover:text-emerald-400"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 戻る
          </Button>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black tracking-widest uppercase">
            💎 Master PDF App
          </Badge>
        </div>

        {/* Main Interface */}
        <Card className="bg-[#13141f] border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                AI COMPRESSOR
              </h1>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em]">
                憲法遵守型 高速圧縮システム
              </p>
            </div>

            {!result ? (
              <div className="space-y-6">
                {/* Dropzone */}
                <div 
                  {...getRootProps()} 
                  className={`
                    border-2 border-dashed rounded-[2rem] p-10 md:p-16 transition-all duration-300 cursor-pointer
                    ${isDragActive ? 'border-emerald-500 bg-emerald-500/10 scale-[0.98]' : 'border-white/10 hover:border-emerald-500/50 bg-white/5'}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-emerald-500/20 rounded-2xl">
                      {file ? <FileText className="h-10 w-10 text-emerald-400" /> : <Upload className="h-10 w-10 text-emerald-400" />}
                    </div>
                    {file ? (
                      <div>
                        <p className="text-lg font-bold text-white mb-1">{file.name}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{formatSize(file.size)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-bold text-white mb-1 italic">PDFをドロップ、または選択</p>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest italic">MAX 10MB / PRESET LIMIT</p>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold italic">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}

                <Button 
                  size="lg"
                  disabled={!file || compressing}
                  onClick={handleCompress}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] group transition-all"
                >
                  {compressing ? (
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2 italic uppercase">
                      <Zap className="h-6 w-6" /> 圧縮を開始する
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white italic uppercase mb-1 tracking-tighter">圧縮が完了しました！</p>
                    <p className="text-sm font-bold text-emerald-500 italic">憲法に基づき、回数を1回消費しました。</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Original</p>
                    <p className="text-xl font-black text-slate-400 italic">{formatSize(result.originalSize)}</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500">
                    <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Compressed</p>
                    <p className="text-2xl font-black text-emerald-400 italic">{formatSize(result.compressedSize)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a href={result.url} download={`compressed_${file?.name || 'document.pdf'}`}>
                    <Button size="lg" className="w-full h-16 bg-white text-slate-950 font-black text-xl rounded-2xl hover:bg-slate-200">
                      <Download className="h-6 w-6 mr-2" /> ファイルをダウンロード
                    </Button>
                  </a>
                  <Button 
                    variant="ghost" 
                    onClick={() => { setFile(null); setResult(null); }}
                    className="text-slate-500 font-bold hover:text-emerald-400"
                  >
                    別のファイルを圧縮する
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Privacy Secured</span>
          <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> AI Powered</span>
          <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Constitution Regulated</span>
        </div>
      </div>
    </div>
  )
}
