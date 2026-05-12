'use client'
import { useState } from 'react'
import { Smartphone, Monitor, Tablet, RefreshCw, ExternalLink, ChevronDown } from 'lucide-react'

const DEVICES = [
  { id: 'iphone-se',    label: 'iPhone SE',      width: 375,  height: 667,  icon: Smartphone },
  { id: 'iphone-14',   label: 'iPhone 14',       width: 390,  height: 844,  icon: Smartphone },
  { id: 'iphone-plus', label: 'iPhone 14 Plus',  width: 430,  height: 932,  icon: Smartphone },
  { id: 'android-s',   label: 'Android (小)',    width: 360,  height: 800,  icon: Smartphone },
  { id: 'android-l',   label: 'Android (大)',    width: 412,  height: 915,  icon: Smartphone },
  { id: 'ipad-mini',   label: 'iPad mini',       width: 768,  height: 1024, icon: Tablet },
  { id: 'desktop',     label: 'デスクトップ',    width: 1280, height: 800,  icon: Monitor },
]

const PAGES = [
  { label: 'トップページ',       path: '/' },
  { label: 'ツール一覧',         path: '/products' },
  { label: '料金プラン',         path: '/pricing' },
  { label: 'ログイン',           path: '/login' },
  { label: 'サインアップ',       path: '/signup' },
  { label: 'ダッシュボード',     path: '/dashboard' },
  { label: 'お問い合わせ',       path: '/contact' },
]

const BASE_URL = 'https://nextralab.jp'

export default function MobilePreviewPage() {
  const [device, setDevice] = useState(DEVICES[1]) // iPhone 14 default
  const [page, setPage] = useState(PAGES[0])
  const [rotate, setRotate] = useState(false)
  const [key, setKey] = useState(0)

  const frameW = rotate ? device.height : device.width
  const frameH = rotate ? device.width  : device.height

  // スケールを計算（最大ウィンドウ高さに収める）
  const maxH = 700
  const scale = Math.min(1, maxH / frameH)

  const isMobile = device.width < 800

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200">
      {/* ヘッダー */}
      <div className="border-b border-white/5 bg-[#0d1117] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">スマホプレビュー</h1>
          </div>

          {/* ページ選択 */}
          <div className="relative">
            <select
              value={page.path}
              onChange={e => setPage(PAGES.find(p => p.path === e.target.value) ?? PAGES[0])}
              className="h-9 pl-3 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 focus:border-emerald-500 outline-none appearance-none cursor-pointer"
            >
              {PAGES.map(p => (
                <option key={p.path} value={p.path}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* デバイス選択 */}
          <div className="flex flex-wrap gap-1">
            {DEVICES.map(d => {
              const Icon = d.icon
              return (
                <button
                  key={d.id}
                  onClick={() => { setDevice(d); setRotate(false) }}
                  className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all ${
                    device.id === d.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{d.label}</span>
                  <span className="sm:hidden">{d.width}</span>
                </button>
              )
            })}
          </div>

          {/* 操作ボタン */}
          <div className="flex items-center gap-2 ml-auto">
            {isMobile && (
              <button
                onClick={() => setRotate(r => !r)}
                className="h-9 w-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
                title="横向きに切り替え"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="9" y1="21" x2="15" y2="21" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setKey(k => k + 1)}
              className="h-9 w-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
              title="リロード"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <a
              href={BASE_URL + page.path}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
              title="新しいタブで開く"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* プレビューエリア */}
      <div className="flex flex-col items-center py-8 px-4">
        {/* デバイス情報バッジ */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            {rotate ? `${device.height} × ${device.width}` : `${device.width} × ${device.height}`} px
          </span>
          {scale < 1 && (
            <span className="text-xs text-slate-600 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              表示倍率 {Math.round(scale * 100)}%
            </span>
          )}
        </div>

        {/* フレーム */}
        <div
          style={{
            width:  frameW * scale,
            height: frameH * scale,
            position: 'relative',
          }}
        >
          {/* デバイスシェル（スマホのみ） */}
          {isMobile && !rotate && (
            <div
              className="absolute inset-0 rounded-[2.5rem] border-[6px] border-slate-700 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.6)] pointer-events-none z-10"
              style={{ borderRadius: 40 * scale }}
            >
              {/* ノッチ */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-700 rounded-b-xl"
                style={{ width: 100 * scale, height: 22 * scale }}
              />
            </div>
          )}

          {/* iframe */}
          <iframe
            key={key}
            src={BASE_URL + page.path}
            title="preview"
            style={{
              width:  frameW,
              height: frameH,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              border: 'none',
              borderRadius: isMobile && !rotate ? 40 : 8,
              display: 'block',
              background: '#050507',
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>

        {/* 説明テキスト */}
        <p className="mt-6 text-xs text-slate-600 text-center max-w-md">
          ※ iframeによるプレビューです。認証が必要なページは正しく表示されない場合があります。<br />
          実際のスマホで確認するには右上の外部リンクアイコンから開いてください。
        </p>
      </div>
    </div>
  )
}
