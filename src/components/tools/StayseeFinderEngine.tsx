'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  CheckCircle2, Lock, Camera, Loader2,
  UserPlus, Search, Key, LogOut, QrCode,
  Monitor, ClipboardList, ArrowRight, PenLine, Phone, Hash
} from 'lucide-react'

/* ─────────── 定数 ─────────── */
const TABS = [
  { id: 'kiosk',    label: 'スタート',        icon: Monitor   },
  { id: 'search',   label: '予約検索',        icon: Search    },
  { id: 'checkin',  label: '自動チェックイン', icon: UserPlus  },
  { id: 'lock',     label: '鍵発行',          icon: Key       },
  { id: 'checkout', label: 'チェックアウト',   icon: LogOut    },
]

const LANGS = ['日本語', 'English', '中文', '한국어']

/* ダミー予約データ（実際はPMS APIから取得） */
const DUMMY_RESERVATIONS = [
  { id: 'NTR-20260510-001', name: '山田 太郎', phone: '090-1234-5678', room: '201', checkin: '2026/05/10', checkout: '2026/05/11', guests: 2, amount: 18000 },
  { id: 'NTR-20260510-002', name: '佐藤 花子', phone: '080-9876-5432', room: '305', checkin: '2026/05/10', checkout: '2026/05/12', guests: 1, amount: 24000 },
  { id: 'NTR-20260510-003', name: 'John Smith', phone: '070-1111-2222', room: '102', checkin: '2026/05/10', checkout: '2026/05/11', guests: 2, amount: 16000 },
]

type Reservation = typeof DUMMY_RESERVATIONS[number]

const inputCls = `w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors`
const inputStyle: React.CSSProperties = { background: '#13141f', border: '1px solid #334155' }

/* ─────────── CheckoutProcessing（安全なsetTimeout） ─────────── */
function CheckoutProcessing({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 font-medium text-sm">精算処理中...</p>
      <p className="text-slate-500 text-xs">PMSと同期しています</p>
    </div>
  )
}

/* ─────────── メインエンジン ─────────── */
const MasterEngine = () => {
  const [activeTab, setActiveTab]         = useState<string>('kiosk')
  const [isMounted, setIsMounted]         = useState(false)
  const [selectedLang, setSelectedLang]   = useState('日本語')

  /* 予約検索 */
  const [searchMode, setSearchMode]       = useState<'select'|'reservation'|'name'|'phone'>('select')
  const [searchQuery, setSearchQuery]     = useState('')
  const [searchResults, setSearchResults] = useState<Reservation[]>([])
  const [searching, setSearching]         = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  /* チェックイン */
  const [checkinStatus, setCheckinStatus] = useState<'IDLE'|'SCANNING'|'VERIFIED'>('IDLE')
  const [ledgerName, setLedgerName]       = useState('')
  const [ledgerAddress, setLedgerAddress] = useState('')
  const [ledgerOccupation, setLedgerOccupation] = useState('')
  const [ledgerTravel, setLedgerTravel]   = useState('')

  /* カメラ */
  const [isCameraOpen, setIsCameraOpen]   = useState(false)
  const [cameraError, setCameraError]     = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* チェックアウト */
  const [checkoutQuery, setCheckoutQuery]     = useState('')
  const [checkoutResults, setCheckoutResults] = useState<Reservation[]>([])
  const [checkoutTarget, setCheckoutTarget]   = useState<Reservation | null>(null)
  const [checkoutSearching, setCheckoutSearching] = useState(false)
  const [checkoutStep, setCheckoutStep]       = useState<'search'|'confirm'|'processing'|'done'>('search')
  const [hasExtraCharge] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  /* ── カメラ ── */
  const startCamera = async () => {
    setCameraError(null)
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
    } catch { setCameraError('カメラへのアクセスが拒否されました') }
  }
  const closeCamera = () => { streamRef.current?.getTracks().forEach(t => t.stop()); setIsCameraOpen(false); setCameraError(null) }
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx?.drawImage(videoRef.current, 0, 0)
      closeCamera()
      runCheckin()
    }
  }

  /* ── チェックイン AI読み取りシミュ ── */
  const runCheckin = async () => {
    setCheckinStatus('SCANNING')
    await new Promise(r => setTimeout(r, 2000))
    if (selectedReservation) {
      setLedgerName(selectedReservation.name)
    } else {
      setLedgerName('山田 太郎')
      setLedgerAddress('東京都渋谷区1-2-3')
      setLedgerOccupation('会社員')
      setLedgerTravel('大阪 → 東京 → 横浜')
    }
    setCheckinStatus('VERIFIED')
  }

  /* ── 予約検索 ── */
  const doSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    await new Promise(r => setTimeout(r, 800))
    const q = searchQuery.trim().toLowerCase()
    const results = DUMMY_RESERVATIONS.filter(r => {
      if (searchMode === 'reservation') return r.id.toLowerCase().includes(q)
      if (searchMode === 'name')        return r.name.toLowerCase().includes(q)
      if (searchMode === 'phone')       return r.phone.replace(/-/g,'').includes(q.replace(/-/g,''))
      return false
    })
    setSearchResults(results)
    setSearching(false)
  }

  const selectReservation = (r: Reservation) => {
    setSelectedReservation(r)
    setActiveTab('checkin')
  }

  /* ── チェックアウト検索 ── */
  const doCheckoutSearch = async () => {
    if (!checkoutQuery.trim()) return
    setCheckoutSearching(true)
    await new Promise(r => setTimeout(r, 800))
    const q = checkoutQuery.trim().toLowerCase()
    const results = DUMMY_RESERVATIONS.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.phone.replace(/-/g,'').includes(q.replace(/-/g,''))
    )
    setCheckoutResults(results)
    setCheckoutSearching(false)
  }

  const selectCheckoutTarget = (r: Reservation) => {
    setCheckoutTarget(r)
    setCheckoutStep('confirm')
  }

  /* ── タブ切り替え時リセット ── */
  const gotoTab = (id: string) => {
    setActiveTab(id)
    if (id === 'search') { setSearchMode('select'); setSearchQuery(''); setSearchResults([]) }
    if (id === 'checkout') { setCheckoutStep('search'); setCheckoutQuery(''); setCheckoutResults([]); setCheckoutTarget(null) }
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen pb-24" style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Nextra AI Autonomous OS
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          次世代スマート<span style={{ color: '#10b981' }}>チェックイン</span>プロトコル
        </h1>
        <p className="text-slate-400 text-sm">PMS連携・本人確認・鍵発行を完全自動化するホテルDXシステム。</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-5">

        {/* ── タブナビ ── */}
        <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => gotoTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={activeTab === tab.id ? { background: '#10b981', color: '#fff' } : { color: '#64748b' }}>
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════ スタート ════════════ */}
        {activeTab === 'kiosk' && (
          <div className="rounded-xl flex flex-col items-center justify-center py-16 space-y-10"
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
            {/* 言語選択 */}
            <div className="flex gap-2 flex-wrap justify-center">
              {LANGS.map(lang => (
                <button key={lang} onClick={() => setSelectedLang(lang)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: selectedLang === lang ? 'rgba(16,185,129,0.15)' : '#13141f',
                    border: selectedLang === lang ? '1px solid rgba(16,185,129,0.6)' : '1px solid #334155',
                    color: selectedLang === lang ? '#34d399' : '#94a3b8',
                  }}>
                  {lang}
                </button>
              ))}
            </div>

            {/* メインボタン */}
            <div className="flex gap-8 flex-wrap justify-center">
              {/* CHECK-IN START */}
              <button onClick={() => gotoTab('search')}
                className="w-44 h-44 rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.03]"
                style={{ background: '#13141f', border: '2px solid rgba(16,185,129,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)')}>
                <UserPlus size={32} style={{ color: '#10b981' }} />
                <span className="text-emerald-400 text-base font-bold">チェックイン</span>
                <span className="text-slate-600 text-[10px]">CHECK IN</span>
              </button>
              {/* CHECK-OUT */}
              <button onClick={() => gotoTab('checkout')}
                className="w-44 h-44 rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.03]"
                style={{ background: '#13141f', border: '2px solid rgba(99,102,241,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)')}>
                <LogOut size={32} style={{ color: '#818cf8' }} />
                <span className="text-indigo-400 text-base font-bold">チェックアウト</span>
                <span className="text-slate-600 text-[10px]">CHECK OUT</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">画面をタッチして開始してください</p>
          </div>
        )}

        {/* ════════════ 予約検索 ════════════ */}
        {activeTab === 'search' && (
          <div className="space-y-4">

            {/* 検索方法選択 */}
            {searchMode === 'select' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { mode: 'reservation' as const, icon: Hash,          label: '予約番号で検索', color: '#10b981' },
                  { mode: 'name'        as const, icon: ClipboardList,  label: '氏名で検索',     color: '#6366f1' },
                  { mode: 'phone'       as const, icon: Phone,          label: '電話番号で検索',  color: '#f59e0b' },
                ].map(item => (
                  <button key={item.mode} onClick={() => setSearchMode(item.mode)}
                    className="rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02]"
                    style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${item.color}60`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}>
                    <item.icon size={40} style={{ color: item.color }} />
                    <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* QRコード（カメラ） */}
            {searchMode === 'select' && (
              <div className="rounded-xl p-6 flex flex-col items-center gap-3"
                style={{ background: '#0d1117', border: '1px dashed #1e293b' }}>
                <button onClick={startCamera}
                  className="flex items-center gap-2 px-6 h-10 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                  <QrCode size={16} /> QRコードをスキャン
                </button>
                <p className="text-xs text-slate-600">予約確認メールのQRコードをご用意ください</p>
              </div>
            )}

            {/* 入力フォーム */}
            {searchMode !== 'select' && (
              <div className="rounded-xl p-6 space-y-4" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-200">
                    {searchMode === 'reservation' ? '予約番号を入力' : searchMode === 'name' ? '氏名を入力' : '電話番号を入力'}
                  </p>
                  <button onClick={() => { setSearchMode('select'); setSearchResults([]) }}
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← 戻る</button>
                </div>
                <div className="flex gap-2">
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doSearch()}
                    placeholder={searchMode === 'reservation' ? 'NTR-20260510-001' : searchMode === 'name' ? '山田 太郎' : '090-1234-5678'}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#10b981')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                  <button onClick={doSearch} disabled={searching}
                    className="shrink-0 h-11 px-5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                    style={{ background: '#10b981', color: '#fff', opacity: searching ? 0.7 : 1 }}>
                    {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                    検索
                  </button>
                </div>

                {/* 検索結果 */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-slate-500">{searchResults.length}件見つかりました</p>
                    {searchResults.map(r => (
                      <div key={r.id} className="rounded-xl p-4 flex items-center justify-between gap-4"
                        style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-100">{r.name} 様</p>
                          <p className="text-xs text-slate-500">{r.id} | {r.room}号室 | {r.checkin}〜{r.checkout}</p>
                        </div>
                        <button onClick={() => selectReservation(r)}
                          className="shrink-0 h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                          style={{ background: '#10b981', color: '#fff' }}>
                          選択 <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && searchQuery && !searching && (
                  <div className="rounded-xl p-6 text-center" style={{ background: '#13141f' }}>
                    <p className="text-sm text-slate-500">該当する予約が見つかりませんでした</p>
                    <p className="text-xs text-slate-600 mt-1">入力内容をご確認ください</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════ 自動チェックイン ════════════ */}
        {activeTab === 'checkin' && (
          <div className="rounded-xl p-6 space-y-6" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
            {/* 選択中の予約情報 */}
            {selectedReservation && (
              <div className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-emerald-400">{selectedReservation.name} 様</span>
                  <span className="text-slate-500 ml-2">{selectedReservation.id} | {selectedReservation.room}号室</span>
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">宿泊者情報の登録</h3>
                <p className="text-xs text-slate-500 mt-1">旅館業法に基づき、正確な情報をご入力ください。</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-medium animate-pulse"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                Identity Verification Active
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Step1: IDスキャン */}
              <div className="rounded-xl p-5 space-y-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                <p className="text-xs font-semibold text-slate-500">Step 1 — ID Scan</p>

                {/* カメラモーダル */}
                {isCameraOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
                    <div className="w-full max-w-sm space-y-4">
                      {cameraError ? (
                        <div className="rounded-xl p-6 text-center space-y-3" style={{ background: '#0d1117', border: '1px solid #ef4444' }}>
                          <p className="text-red-400 text-sm">{cameraError}</p>
                          <button onClick={closeCamera} className="px-6 py-2 rounded-lg bg-slate-800 text-sm font-bold text-white">閉じる</button>
                        </div>
                      ) : (
                        <>
                          <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="flex gap-2">
                            <button onClick={closeCamera} className="flex-1 py-3 rounded-lg bg-slate-800 text-sm font-bold text-white">キャンセル</button>
                            <button onClick={capturePhoto} className="flex-1 py-3 rounded-lg bg-emerald-600 text-sm font-bold text-white">撮影する</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="rounded-lg aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                  style={{ border: '2px dashed #334155', background: '#0a0b0f' }}
                  onClick={() => checkinStatus === 'IDLE' && startCamera()}>
                  <input type="file" ref={fileInputRef} onChange={() => runCheckin()} className="hidden" accept="image/*" />
                  {checkinStatus === 'SCANNING' && <Loader2 size={36} className="text-emerald-400 animate-spin" />}
                  {checkinStatus === 'VERIFIED' && <CheckCircle2 size={36} style={{ color: '#10b981' }} />}
                  {checkinStatus === 'IDLE'     && <Camera size={36} className="text-slate-600" />}
                  <p className="text-xs text-slate-500">
                    {checkinStatus === 'VERIFIED' ? 'スキャン完了 ✓' : checkinStatus === 'SCANNING' ? 'AI読み取り中...' : '身分証をタップしてスキャン'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={runCheckin} disabled={checkinStatus === 'SCANNING'}
                    className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
                    <Camera size={12} /> カメラを起動
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} disabled={checkinStatus === 'SCANNING'}
                    className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
                    📁 ファイルを選択
                  </button>
                </div>
              </div>

              {/* Step2: 台帳記入 */}
              <div className="rounded-xl p-5 space-y-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                <p className="text-xs font-semibold text-slate-500">Step 2 — Ledger Entry</p>
                <div className="space-y-3">
                  {[
                    { label: '氏名',  value: ledgerName,    set: setLedgerName,    placeholder: '氏名を入力' },
                    { label: '住所',  value: ledgerAddress, set: setLedgerAddress, placeholder: '住所を入力' },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-600">{f.label}</label>
                      <input value={f.value} onChange={e => f.set(e.target.value)}
                        placeholder={checkinStatus === 'SCANNING' ? 'AI読み取り中...' : f.placeholder}
                        className={inputCls} style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = '#10b981')}
                        onBlur={e => (e.target.style.borderColor = '#334155')} />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">職業</label>
                    <select value={ledgerOccupation} onChange={e => setLedgerOccupation(e.target.value)}
                      className={inputCls} style={{ ...inputStyle, appearance: 'none' as const }}>
                      <option value="">職業を選択...</option>
                      {['会社員','自営業','公務員','学生','無職','その他'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">前泊地・行先地</label>
                    <input value={ledgerTravel} onChange={e => setLedgerTravel(e.target.value)}
                      placeholder="例：大阪 → 東京 → 横浜" list="travel-suggestions"
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#10b981')}
                      onBlur={e => (e.target.style.borderColor = '#334155')} />
                    <datalist id="travel-suggestions">
                      {['自宅','東京','大阪','京都','名古屋','福岡','札幌','海外'].map(v => (
                        <option key={v} value={v} />
                      ))}
                    </datalist>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <PenLine size={14} className="text-indigo-400 shrink-0" />
                    <span className="text-xs text-slate-400">電子署名パネルで署名を行ってください</span>
                  </div>
                  <button onClick={() => setActiveTab('lock')}
                    disabled={!ledgerName}
                    className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{ background: ledgerName ? '#10b981' : '#1e293b', color: ledgerName ? '#fff' : '#475569' }}>
                    PMS登録 ＆ 鍵発行へ <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ 鍵発行 ════════════ */}
        {activeTab === 'lock' && (
          <div className="rounded-xl p-10 flex flex-col items-center justify-center gap-8"
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
            <Lock size={48} style={{ color: '#10b981' }} />
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-slate-100">Your Access Key</h3>
              <p className="text-xs text-slate-500">チェックイン期間中のみ有効な暗証番号です。</p>
            </div>
            <div className="rounded-xl px-12 py-8 text-center"
              style={{ background: '#13141f', border: '2px solid #10b981', boxShadow: '0 0 30px rgba(16,185,129,0.15)' }}>
              <p className="text-xs font-medium text-slate-500 mb-1">
                Room: {selectedReservation?.room || '201'}
              </p>
              <p className="text-xs text-slate-600 mb-3">
                {selectedReservation ? `${selectedReservation.checkin}〜${selectedReservation.checkout}` : '2026/05/10〜2026/05/11'}
              </p>
              <p className="text-6xl font-bold tracking-[0.2em]" style={{ color: '#10b981' }}>8421</p>
              <p className="text-xs text-slate-500 mt-3">暗証番号</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => gotoTab('kiosk')}
                className="px-8 h-10 rounded-lg text-sm font-semibold transition-all"
                style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
                スタートへ戻る
              </button>
              <button onClick={() => gotoTab('checkout')}
                className="px-8 h-10 rounded-lg text-sm font-semibold transition-all"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                チェックアウトへ
              </button>
            </div>
          </div>
        )}

        {/* ════════════ チェックアウト ════════════ */}
        {activeTab === 'checkout' && (
          <div className="rounded-xl p-6 space-y-5" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>

            {/* STEP: 検索 */}
            {checkoutStep === 'search' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">チェックアウト</h3>
                  <p className="text-xs text-slate-500 mt-1">予約番号・氏名・電話番号のいずれかで検索してください</p>
                </div>
                <div className="flex gap-2">
                  <input
                    value={checkoutQuery}
                    onChange={e => setCheckoutQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doCheckoutSearch()}
                    placeholder="予約番号 / 氏名 / 電話番号"
                    className={inputCls} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#818cf8')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                  <button onClick={doCheckoutSearch} disabled={checkoutSearching}
                    className="shrink-0 h-11 px-5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                    style={{ background: '#6366f1', color: '#fff', opacity: checkoutSearching ? 0.7 : 1 }}>
                    {checkoutSearching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                    検索
                  </button>
                </div>

                {checkoutResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">{checkoutResults.length}件見つかりました</p>
                    {checkoutResults.map(r => (
                      <div key={r.id} className="rounded-xl p-4 flex items-center justify-between gap-4"
                        style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-100">{r.name} 様</p>
                          <p className="text-xs text-slate-500">{r.id} | {r.room}号室 | {r.checkin}〜{r.checkout}</p>
                          <p className="text-xs text-slate-500">宿泊料金: ¥{r.amount.toLocaleString()}</p>
                        </div>
                        <button onClick={() => selectCheckoutTarget(r)}
                          className="shrink-0 h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                          style={{ background: '#6366f1', color: '#fff' }}>
                          選択 <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {checkoutResults.length === 0 && checkoutQuery && !checkoutSearching && (
                  <div className="rounded-xl p-6 text-center" style={{ background: '#13141f' }}>
                    <p className="text-sm text-slate-500">該当する予約が見つかりませんでした</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP: 確認 */}
            {checkoutStep === 'confirm' && checkoutTarget && (
              <div className="flex flex-col items-center gap-6">
                <LogOut size={40} style={{ color: '#818cf8' }} />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-100">チェックアウト確認</h3>
                  <p className="text-xs text-slate-500 mt-1">以下の内容でチェックアウトします</p>
                </div>
                <div className="w-full max-w-md rounded-xl p-5 space-y-3"
                  style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                  {[
                    { label: 'お名前',        value: `${checkoutTarget.name} 様` },
                    { label: '部屋番号',       value: `${checkoutTarget.room}号室` },
                    { label: 'チェックイン',   value: checkoutTarget.checkin },
                    { label: 'チェックアウト', value: `${checkoutTarget.checkout}（本日）` },
                    { label: '宿泊料金',       value: `¥${checkoutTarget.amount.toLocaleString()}` },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-100 font-medium">{item.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-800 pt-3 flex justify-between text-sm">
                    <span className="text-slate-500">追加料金</span>
                    <span className={hasExtraCharge ? 'text-amber-400 font-semibold' : 'text-emerald-500 font-medium'}>
                      {hasExtraCharge ? '¥3,300（要精算）' : 'なし'}
                    </span>
                  </div>
                </div>

                {hasExtraCharge ? (
                  <div className="w-full max-w-md rounded-xl p-5 flex flex-col items-center gap-4 text-center"
                    style={{ background: '#1a1200', border: '1px solid rgba(251,191,36,0.3)' }}>
                    <p className="text-amber-300 font-semibold text-sm">⚠️ 追加料金が発生しています</p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      スタッフをお呼びして精算の上、チェックアウトをお願いします。
                    </p>
                    <button className="px-6 h-10 rounded-lg text-sm font-semibold transition-all"
                      style={{ background: '#f59e0b', color: '#000' }}
                      onClick={() => alert('スタッフを呼び出しました。しばらくお待ちください。')}>
                      🔔 スタッフを呼ぶ
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setCheckoutStep('processing')}
                    className="w-full max-w-md h-12 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#6366f1', color: '#fff' }}>
                    チェックアウトする →
                  </button>
                )}

                <button onClick={() => setCheckoutStep('search')}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  ← 検索に戻る
                </button>
              </div>
            )}

            {/* STEP: 処理中 */}
            {checkoutStep === 'processing' && (
              <CheckoutProcessing onDone={() => setCheckoutStep('done')} />
            )}

            {/* STEP: 完了 */}
            {checkoutStep === 'done' && (
              <div className="flex flex-col items-center gap-6 py-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '2px solid #6366f1' }}>
                  <span className="text-4xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">チェックアウト完了</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {checkoutTarget?.name} 様、ご利用ありがとうございました
                  </p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  鍵カードの返却をお忘れなく。<br />またのご利用をお待ちしております。
                </p>
                <button onClick={() => gotoTab('kiosk')}
                  className="px-8 h-10 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
                  スタートへ戻る
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">Nextra AI Autonomous Front System · NextraLabs 2026</p>
      </div>
    </div>
  )
}

/* ─────────── SSR無効でラップ ─────────── */
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function HotelPage() { return <NoSSR /> }
