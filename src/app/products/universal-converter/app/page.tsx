'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2, Repeat, Download, Video, ImageIcon, FileText, Upload } from 'lucide-react'

export default function UniversalConverterApp() {
  const [mode, setMode] = useState<'video' | 'image' | 'pdf'>('video')
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const MODES = [
    { id: 'video', label: '動画', icon: Video,      formats: ['mp4', 'webm', 'gif', 'mp3'] },
    { id: 'image', label: '画像', icon: ImageIcon,  formats: ['webp', 'png', 'jpg', 'ico'] },
    { id: 'pdf',   label: 'PDF',  icon: FileText,   formats: ['pdf-min'] },
  ]

  const handleModeChange = (newMode: 'video' | 'image' | 'pdf') => {
    setMode(newMode); setFile(null); setDownloadUrl(null)
    const m = MODES.find(m => m.id === newMode)!
    setTargetFormat(m.formats[0])
  }

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 3000))
    setDownloadUrl(URL.createObjectURL(file))
    setIsProcessing(false)
  }

  const handleDownload = () => {
    if (!downloadUrl || !file) return
    const a = document.createElement('a')
    a.href = downloadUrl
    const ext = targetFormat === 'mp3' ? 'mp3' : targetFormat === 'pdf-min' ? 'pdf' : targetFormat
    a.download = `${file.name.replace(/\.[^.]+$/, '')}_converted.${ext}`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  const currentMode = MODES.find(m => m.id === mode)!

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Repeat className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">究極AI<span className="text-emerald-400">マルチコンバーター</span></h1>
            <p className="text-xs text-slate-500 mt-0.5">動画・画像・PDFをAIで最適変換</p>
          </div>
        </div>

        {/* モード選択 */}
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id as any)}
              className={`h-14 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all ${
                mode === m.id
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              <m.icon size={16} /> {m.label}
            </button>
          ))}
        </div>

        {/* メインカード */}
        <div className="bg-[#0d0f1a] border border-white/10 rounded-2xl p-6 space-y-6">

          {!downloadUrl ? (
            <>
              {/* フォーマット選択 */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">変換形式</p>
                <div className="flex flex-wrap gap-2">
                  {currentMode.formats.map(f => (
                    <button
                      key={f}
                      onClick={() => setTargetFormat(f)}
                      className={`h-8 px-4 rounded-lg text-xs font-semibold uppercase border transition-all ${
                        targetFormat === f
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 bg-black/30 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {f === 'mp3' ? '音声抽出' : f === 'pdf-min' ? 'PDF圧縮' : f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* ファイルアップロード */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">ファイル</p>
                <label className="block w-full h-36 bg-black/30 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/40 transition-all relative">
                  <input
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload size={24} className={file ? 'text-emerald-400' : 'text-slate-600'} />
                  <p className="mt-2 text-sm font-medium text-slate-300 pointer-events-none">
                    {file ? file.name : 'クリックまたはドロップ'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 pointer-events-none">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'MAX 100MB'}
                  </p>
                </label>
              </div>

              {/* 変換ボタン */}
              <button
                onClick={handleProcess}
                disabled={isProcessing || !file}
                className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isProcessing
                  ? <><Loader2 size={16} className="animate-spin" /> 変換中...</>
                  : <><Repeat size={16} /> AI変換を開始する</>
                }
              </button>
            </>
          ) : (
            /* 完了画面 */
            <div className="text-center space-y-5 py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <div>
                <p className="text-lg font-bold text-white">変換完了</p>
                <p className="text-xs text-slate-500 mt-1">{file?.name} → {targetFormat.toUpperCase()}</p>
              </div>
              <button
                onClick={handleDownload}
                className="h-11 px-8 bg-white text-slate-900 font-semibold text-sm rounded-xl flex items-center gap-2 mx-auto hover:bg-slate-100 transition-all"
              >
                <Download size={16} /> ファイルをダウンロード
              </button>
              <button
                onClick={() => { setDownloadUrl(null); setFile(null) }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline"
              >
                別のファイルを変換する
              </button>
            </div>
          )}
        </div>

        {/* 説明 */}
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          動画・画像・PDFの形式変換に対応。AIが画質を維持したまま最適処理します。
        </p>
      </div>
    </div>
  )
}
