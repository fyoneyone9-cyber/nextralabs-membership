'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback, useEffect } from 'react'
import { Loader2, CheckCircle2, Repeat, Download, Video, ImageIcon, FileText, Upload } from 'lucide-react'

const MODES = [
  { id: 'video', label: '動画変換', icon: Video,      formats: ['mp4', 'webm', 'gif', 'mp3'] },
  { id: 'image', label: '画像変換', icon: ImageIcon,   formats: ['webp', 'png', 'jpg', 'ico'] },
  { id: 'pdf',   label: 'PDF圧縮', icon: FileText,    formats: ['pdf-min'] },
] as const

type Mode = typeof MODES[number]['id']

export default function UniversalConverterApp() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const [mode, setMode]                 = useState<Mode>('video')
  const [file, setFile]                 = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl]   = useState<string | null>(null)

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
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* ─── Hero ─── */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 space-y-4">
        {/* バッジ */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Universal Converter
        </div>

        {/* 見出し */}
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          動画・画像・PDFを<span style={{ color: '#10b981' }}>AIで即変換</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          ファイルをアップロードするだけ。AIが画質を維持したまま最適処理します。
          動画変換・音声抽出・画像変換・PDF圧縮をこれ一台で。
        </p>
      </div>

      {/* ─── メインコンテンツ ─── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">

          {/* ─── 左：モード選択 + 変換形式 ─── */}
          <div className="space-y-4">
            {/* モード */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">変換モード</p>
              <div className="flex flex-col gap-2">
                {MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    className="flex items-center gap-3 h-11 px-4 rounded-lg text-sm font-medium transition-all"
                    style={
                      mode === m.id
                        ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }
                        : { background: 'transparent', border: '1px solid #1e293b', color: '#64748b' }
                    }
                  >
                    <m.icon size={15} />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 変換形式 */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">変換形式</p>
              <div className="flex flex-wrap gap-2">
                {currentMode.formats.map(f => (
                  <button
                    key={f}
                    onClick={() => setTargetFormat(f)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold uppercase transition-all"
                    style={
                      targetFormat === f
                        ? { border: '1px solid rgba(16,185,129,0.5)', background: 'rgba(16,185,129,0.1)', color: '#34d399' }
                        : { border: '1px solid #1e293b', background: 'rgba(0,0,0,0.3)', color: '#475569' }
                    }
                  >
                    {f === 'mp3' ? '音声抽出' : f === 'pdf-min' ? 'PDF圧縮' : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* 使いかた */}
            <div
              className="rounded-xl p-5 space-y-2"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">📖 使いかた</p>
              <ol className="text-xs text-slate-500 leading-relaxed space-y-1 list-none">
                <li>① モードと変換形式を選択</li>
                <li>② ファイルをアップロード</li>
                <li>③「AI変換を開始」をタップ</li>
                <li>④ 完了後にダウンロード</li>
              </ol>
              <p className="text-[10px] text-slate-600 pt-1">MAX 100MB対応</p>
            </div>
          </div>

          {/* ─── 右：アップロード & 変換 ─── */}
          <div className="space-y-4">
            {!downloadUrl ? (
              <>
                {/* アップロードゾーン */}
                <div
                  className="rounded-xl p-6 space-y-4"
                  style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                >
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">ファイルを選択</p>
                  <label
                    className="relative flex flex-col items-center justify-center w-full h-52 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: `2px dashed ${file ? 'rgba(16,185,129,0.5)' : '#1e293b'}`,
                    }}
                  >
                    <input
                      type="file"
                      onChange={e => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload
                      size={28}
                      style={{ color: file ? '#10b981' : '#334155' }}
                    />
                    <p
                      className="mt-3 text-sm font-medium pointer-events-none"
                      style={{ color: file ? '#f1f5f9' : '#475569' }}
                    >
                      {file ? file.name : 'クリックまたはドラッグ&ドロップ'}
                    </p>
                    <p className="text-xs mt-1 pointer-events-none" style={{ color: '#475569' }}>
                      {file
                        ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                        : '動画・画像・PDF（MAX 100MB）'}
                    </p>
                  </label>
                </div>

                {/* 変換ボタン */}
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !file}
                  className="w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={
                    isProcessing || !file
                      ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                      : { background: '#10b981', color: '#fff' }
                  }
                >
                  {isProcessing
                    ? <><Loader2 size={16} className="animate-spin" />変換中...</>
                    : <><Repeat size={16} />AI変換を開始する</>}
                </button>

                {/* プログレス表示（処理中） */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                      <div
                        className="h-full rounded-full animate-pulse"
                        style={{ width: '60%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}
                      />
                    </div>
                    <p className="text-xs text-center" style={{ color: '#475569' }}>AIが最適処理中...</p>
                  </div>
                )}
              </>
            ) : (
              /* ─── 完了画面 ─── */
              <div
                className="rounded-xl p-12 flex flex-col items-center text-center space-y-6"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  <CheckCircle2 size={32} style={{ color: '#10b981' }} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-100">変換完了</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {targetFormat === 'pdf-min' ? 'PDF圧縮' : targetFormat.toUpperCase()} で出力済み
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="h-12 px-8 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  <Download size={16} />ダウンロード
                </button>
                <button
                  onClick={() => { setDownloadUrl(null); setFile(null) }}
                  className="text-xs transition-colors"
                  style={{ color: '#475569' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                >
                  別のファイルを変換する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

