'use client'
import React, { useState } from 'react'
import { Loader2, CheckCircle2, Repeat, Download, Video, ImageIcon, FileText, Upload } from 'lucide-react'

const MODES = [
  { id: 'video', label: '動画', icon: Video,     formats: ['mp4', 'webm', 'gif', 'mp3'] },
  { id: 'image', label: '画像', icon: ImageIcon,  formats: ['webp', 'png', 'jpg', 'ico'] },
  { id: 'pdf',   label: 'PDF',  icon: FileText,   formats: ['pdf-min'] },
] as const

type Mode = typeof MODES[number]['id']

export default function UniversalConverterApp() {
  const [mode, setMode]               = useState<Mode>('video')
  const [file, setFile]               = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const currentMode = MODES.find(m => m.id === mode)!

  const handleModeChange = (m: Mode) => {
    setMode(m); setFile(null); setDownloadUrl(null)
    setTargetFormat(MODES.find(x => x.id === m)!.formats[0])
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

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">
      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center gap-2.5">
          <Repeat size={18} className="text-emerald-400 shrink-0" />
          <div>
            <h1 className="text-base font-semibold text-white leading-tight">
              究極AI<span className="text-emerald-400">マルチコンバーター</span>
            </h1>
            <p className="text-[11px] text-slate-500">動画・画像・PDFを変換</p>
          </div>
        </div>

        {/* モードタブ */}
        <div className="flex gap-1.5">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`flex-1 h-9 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                mode === m.id
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <m.icon size={13} />{m.label}
            </button>
          ))}
        </div>

        {/* カード */}
        <div className="bg-[#0d0f1a] border border-white/10 rounded-xl p-5 space-y-5">
          {!downloadUrl ? (
            <>
              {/* フォーマット */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">変換形式</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentMode.formats.map(f => (
                    <button
                      key={f}
                      onClick={() => setTargetFormat(f)}
                      className={`h-7 px-3 rounded-md text-[11px] font-semibold uppercase border transition-all ${
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

              {/* アップロード */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">ファイル</p>
                <label className="relative block w-full h-28 bg-black/30 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/40 transition-all">
                  <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload size={20} className={file ? 'text-emerald-400' : 'text-slate-600'} />
                  <p className="mt-1.5 text-sm text-slate-300 pointer-events-none">
                    {file ? file.name : 'クリックまたはドロップ'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 pointer-events-none">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'MAX 100MB'}
                  </p>
                </label>
              </div>

              {/* 変換ボタン */}
              <button
                onClick={handleProcess}
                disabled={isProcessing || !file}
                className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isProcessing
                  ? <><Loader2 size={15} className="animate-spin" />変換中...</>
                  : <><Repeat size={15} />AI変換を開始する</>}
              </button>
            </>
          ) : (
            <div className="text-center space-y-4 py-2">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <div>
                <p className="text-base font-semibold text-white">変換完了</p>
                <p className="text-xs text-slate-500 mt-0.5">{targetFormat === 'pdf-min' ? 'PDF圧縮' : targetFormat.toUpperCase()} で出力済み</p>
              </div>
              <button
                onClick={handleDownload}
                className="h-10 px-6 bg-white text-slate-900 font-semibold text-sm rounded-lg flex items-center gap-2 mx-auto hover:bg-slate-100 transition-all"
              >
                <Download size={15} />ダウンロード
              </button>
              <button
                onClick={() => { setDownloadUrl(null); setFile(null) }}
                className="text-xs text-slate-600 hover:text-slate-300 transition-colors underline block mx-auto"
              >
                別のファイルを変換する
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
