'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  CheckCircle2, Lock, Camera, Loader2,
  UserPlus, Search, Key, LogOut, QrCode,
  Monitor, ClipboardList, ArrowRight, PenLine, Phone, Hash,
  Wifi, WifiOff, Settings, ChevronDown, Shield, Trash2
} from 'lucide-react'

/* ─────────── 型定義 ─────────── */
const TABS = [
  { id: 'kiosk',    label: 'スタート',        icon: Monitor   },
  { id: 'search',   label: '予約検索',        icon: Search    },
  { id: 'checkin',  label: '自動チェックイン', icon: UserPlus  },
  { id: 'lock',     label: '鍵発行',          icon: Key       },
  { id: 'checkout', label: 'チェックアウト',   icon: LogOut    },
]
const LANGS = ['日本語', 'English', '中文', '한국어']

// PMS設定
// local: true → APIキー不要・ローカルのみで完結
const PMS_OPTIONS: {
  id: string; label: string; color: string
  local?: boolean       // ローカルモード（API不要）
  pending?: boolean     // 連携開発中
  region?: string       // 'JP' | 'Global'
  note?: string         // 補足
}[] = [
  // ── 日本向け ──
  { id: 'staysee',        label: 'Staysee',         color: '#10b981', region: 'JP', note: '民泊・旅館向け' },
  { id: 'easyaccounting', label: 'イージー会計',     color: '#6366f1', region: 'JP', note: '宿泊会計特化', pending: true },
  { id: 'bets24',         label: 'BETS24',           color: '#f59e0b', region: 'JP', note: 'ホテル向け', pending: true },
  { id: 'airhost',        label: 'エアホスト',       color: '#3b82f6', region: 'JP', note: 'Airbnb系' },
  { id: 'neppan',         label: 'ねっぱん！',       color: '#ec4899', region: 'JP', note: '旅館・温泉宿向け', pending: true },
  // ── グローバル ──
  { id: 'cloudbeds',      label: 'Cloudbeds',        color: '#8b5cf6', region: 'Global', note: '中規模ホテル向け' },
  { id: 'beds24',         label: 'Beds24',           color: '#14b8a6', region: 'Global', note: '民泊・ゲストハウス' },
  { id: 'apaleo',         label: 'apaleo',           color: '#f97316', region: 'Global', note: 'ヨーロッパ系REST API', pending: true },
  { id: 'hostaway',       label: 'Hostaway',         color: '#06b6d4', region: 'Global', note: '民泊チャンネル管理', pending: true },
  { id: 'little_hotelier',label: 'Little Hotelier',  color: '#84cc16', region: 'Global', note: '小規模ホテル向け', pending: true },
  { id: 'opera',          label: 'Oracle Opera',     color: '#ef4444', region: 'Global', note: '大手ホテルチェーン向け', pending: true },
  // ── ローカル（オフライン） ──
  { id: 'none',           label: 'PMS未接続',        color: '#64748b', local: true, note: 'ローカルで完全動作' },
]

// 錠デバイス設定
// local: true → APIキー不要
const LOCK_OPTIONS: {
  id: string; label: string; color: string
  local?: boolean
  pending?: boolean
  note?: string
  keyLabel?: string     // APIキーの呼び名
  keyHint?: string      // 取得場所のヒント
}[] = [
  // ── API連携型 ──
  {
    id: 'switchbot',   label: 'SwitchBot',      color: '#10b981',
    keyLabel: 'APIトークン',
    keyHint: 'SwitchBotアプリ → プロフィール → 設定 → APIキー',
  },
  {
    id: 'ttlock',      label: 'TT Lock',         color: '#6366f1',
    keyLabel: 'アクセストークン',
    keyHint: 'TT Lockアプリ → プロフィール → APIアクセス',
  },
  {
    id: 'sesame',      label: 'SESAME',          color: '#f59e0b',
    keyLabel: 'APIキー',
    keyHint: 'my.sesame.team → API Keys',
  },
  {
    id: 'igloohome',   label: 'igloohome',       color: '#3b82f6',
    keyLabel: 'Bridge APIトークン',
    keyHint: 'igloohome Bridge API → Access Token',
  },
  {
    id: 'remotelock',  label: 'RemoteLOCK',      color: '#ec4899',
    keyLabel: 'APIキー',
    keyHint: 'RemoteLOCK管理画面 → 設定 → API連携',
    pending: true,
  },
  {
    id: 'nuki',        label: 'Nuki',            color: '#84cc16',
    keyLabel: 'APIトークン',
    keyHint: 'Nuki Web API → https://api.nuki.io',
    pending: true,
  },
  {
    id: 'salto',       label: 'Salto KS',        color: '#8b5cf6',
    keyLabel: 'クライアントID / シークレット',
    keyHint: 'Saltoパートナーポータルで取得',
    pending: true,
  },
  // ── ローカル型（API不要） ──
  {
    id: 'fixed',       label: '固定パスワード',  color: '#f97316',
    local: true,
    keyLabel: 'パスワード（4〜8桁）',
    keyHint: 'チェックイン時に毎回この番号を案内します',
  },
  {
    id: 'offline',     label: 'オフライン（手渡し）', color: '#64748b',
    local: true,
    keyLabel: '—',
    keyHint: 'スタッフが手動で鍵を渡す運用です',
  },
]

type Reservation = {
  id: string
  name_kanji?: string
  name?: string
  tel?: string
  start_date?: string
  end_date?: string
  allocate_rooms?: { room_id: string }[]
  person_number?: number
  billing_amount?: number
  check_in_time?: string
  check_out_time?: string
}

const resName   = (r: Reservation) => r.name_kanji || r.name || '（氏名未設定）'
const resRoom   = (r: Reservation) => r.allocate_rooms?.[0]?.room_id || '—'
const resPhone  = (r: Reservation) => r.tel || '—'
const resAmount = (r: Reservation) => r.billing_amount ? `¥${r.billing_amount.toLocaleString()}` : '—'
const resDate   = (s?: string) => s ? s.substring(5).replace('-', '/') : '—'

const inputCls = `w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors`
const inputStyle: React.CSSProperties = { background: '#13141f', border: '1px solid #334155' }

/* ─────────── ローカルモード用ダミー予約 ─────────── */
const LOCAL_RESERVATIONS: Reservation[] = [
  {
    id: 'LOCAL-001', name_kanji: '山田 太郎', name: '山田 太郎',
    tel: '090-1234-5678', start_date: '2026-05-10', end_date: '2026-05-12',
    allocate_rooms: [{ room_id: '201' }], billing_amount: 18000, person_number: 2,
  },
  {
    id: 'LOCAL-002', name_kanji: '鈴木 花子', name: '鈴木 花子',
    tel: '080-9876-5432', start_date: '2026-05-10', end_date: '2026-05-11',
    allocate_rooms: [{ room_id: '305' }], billing_amount: 12000, person_number: 1,
  },
]

/* ─────────── 電子署名パネル ─────────── */
function SignaturePanel({
  onSigned, onClear
}: {
  onSigned: (dataUrl: string) => void
  onClear: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      const t = e.touches[0]
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current; if (!canvas) return
    const pos = getPos(e, canvas)
    lastPos.current = pos
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const pos = getPos(e, canvas)
    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }
    lastPos.current = pos
    setHasSignature(true)
  }

  const stopDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(false)
    lastPos.current = null
    if (hasSignature && canvasRef.current) {
      onSigned(canvasRef.current.toDataURL())
    }
  }

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onClear()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
          <PenLine size={11} /> 電子署名（ここに署名してください）
        </label>
        {hasSignature && (
          <button onClick={clear} className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-red-400 transition-colors">
            <Trash2 size={10} /> クリア
          </button>
        )}
      </div>
      <div className="relative rounded-xl overflow-hidden"
        style={{ border: `2px dashed ${hasSignature ? 'rgba(16,185,129,0.6)' : '#334155'}`, background: '#0a0b0f', transition: 'border-color 0.2s' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="w-full block touch-none select-none"
          style={{ cursor: 'crosshair', height: '160px' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-600">ここに署名してください</p>
          </div>
        )}
      </div>
      {hasSignature && (
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
          <CheckCircle2 size={11} /> 署名完了
        </div>
      )}
    </div>
  )
}

/* ─────────── CheckoutProcessing ─────────── */
function CheckoutProcessing({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t) }, [onDone])
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 font-medium text-sm">精算処理中...</p>
      <p className="text-slate-500 text-xs">PMSと同期しています</p>
    </div>
  )
}

/* ─────────── PMS設定バナー（DMS同期ボタン付き） ─────────── */
function PmsBanner({
  pms, lockType, isOnline, onSync
}: {
  pms: string; lockType: string; isOnline: boolean
  onSync: () => void
}) {
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const pmsInfo  = PMS_OPTIONS.find(p => p.id === pms)  || PMS_OPTIONS[4]
  const lockInfo = LOCK_OPTIONS.find(l => l.id === lockType) || LOCK_OPTIONS[2]

  const handleSync = async () => {
    setSyncing(true)
    setSyncMsg(null)
    await onSync()
    setSyncing(false)
    setSyncMsg('DMSに同期しました')
    setTimeout(() => setSyncMsg(null), 3000)
  }

  return (
    <div className="rounded-lg px-4 py-2.5 flex items-center gap-3 flex-wrap"
      style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
      {/* PMS状態 */}
      <div className="flex items-center gap-1.5 text-[11px]">
        {isOnline
          ? <Wifi size={11} style={{ color: pmsInfo.color }} />
          : <WifiOff size={11} className="text-slate-500" />}
        <span style={{ color: pmsInfo.color }} className="font-semibold">{pmsInfo.label}</span>
        {!isOnline && <span className="text-slate-600">（ローカル）</span>}
      </div>
      <span className="text-slate-700 text-[10px]">|</span>
      {/* 錠状態 */}
      <div className="flex items-center gap-1.5 text-[11px]">
        <Lock size={11} style={{ color: lockInfo.color }} />
        <span style={{ color: lockInfo.color }} className="font-semibold">{lockInfo.label}</span>
      </div>
      {/* 同期ボタン・ステータス */}
      <div className="flex items-center gap-2 ml-auto">
        {syncMsg && (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={10} /> {syncMsg}
          </span>
        )}
        <button onClick={handleSync} disabled={syncing}
          className="flex items-center gap-1.5 px-3 h-7 rounded-md text-[11px] font-semibold transition-all"
          style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399',
            opacity: syncing ? 0.6 : 1,
          }}>
          {syncing ? <Loader2 size={10} className="animate-spin" /> : <Wifi size={10} />}
          DMSに同期
        </button>
      </div>
    </div>
  )
}

/* ─────────── 設定パネル（APIキー入力→保存→接続テスト） ─────────── */
type ConnectStatus = { ok: boolean; message: string } | null

function SettingsPanel({
  pms, setPms, lockType, setLockType, fixedPassword, setFixedPassword,
  onClose, onPmsConnected, onLockConnected,
}: {
  pms: string; setPms: (v: string) => void
  lockType: string; setLockType: (v: string) => void
  fixedPassword: string; setFixedPassword: (v: string) => void
  onClose: () => void
  onPmsConnected: (mode: string) => void
  onLockConnected: (mode: string) => void
}) {
  const STORAGE_KEY_PMS  = 'nextra_ai_pms_config'
  const STORAGE_KEY_LOCK = 'nextra_ai_lock_config'

  // localStorageから復元（複数フィールド対応）
  const saved     = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(STORAGE_KEY_PMS)  || '{}') : {}
  const savedLock = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(STORAGE_KEY_LOCK) || '{}') : {}

  // PMS フィールド
  const [pmsFields, setPmsFields] = useState<Record<string, string>>(saved.fields || {})
  // 錠 フィールド
  const [lockFields, setLockFields] = useState<Record<string, string>>(savedLock.fields || {})

  const [pmsStatus,  setPmsStatus]  = useState<ConnectStatus>(null)
  const [lockStatus, setLockStatus] = useState<ConnectStatus>(null)
  const [pmsTesting, setPmsTesting]  = useState(false)
  const [lockTesting, setLockTesting] = useState(false)
  const [showFields, setShowFields] = useState<Record<string, boolean>>({})

  const pmsInfo  = PMS_OPTIONS.find(p => p.id === pms)!
  const lockInfo = LOCK_OPTIONS.find(l => l.id === lockType)!

  // PMS必須フィールド定義
  const PMS_FIELDS: Record<string, { key: string; label: string; ph: string; secret?: boolean; hint?: string }[]> = {
    staysee:        [{ key: 'apiKey',       label: 'APIキー',                      ph: 'sk-xxxxxxxx',              secret: true, hint: 'Staysee管理画面 → 設定 → APIキー' }],
    airhost:        [{ key: 'apiKey',       label: 'APIキー',                      ph: 'ah-xxxxxxxx',              secret: true, hint: 'エアホスト管理画面 → API連携' }],
    easyaccounting: [{ key: 'apiKey',       label: 'APIキー',                      ph: 'ea-xxxxxxxx',              secret: true, hint: 'イージー会計 → 設定 → API連携（開発中）' }],
    bets24:         [{ key: 'apiKey',       label: 'APIキー',                      ph: 'bets-xxxxxxxx',            secret: true, hint: 'BETS24管理画面 → API設定（開発中）' }],
    neppan:         [{ key: 'apiKey',       label: 'APIキー',                      ph: 'np-xxxxxxxx',              secret: true, hint: 'ねっぱん！管理画面 → API設定（開発中）' }],
    cloudbeds:      [
      { key: 'clientId',     label: 'Client ID',     ph: 'cb_client_xxxxxxxx', hint: 'Cloudbeds → Apps → API' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'cb_secret_xxxxxxxx', secret: true, hint: 'Cloudbeds → Apps → API' },
    ],
    beds24:         [
      { key: 'propKey',     label: 'Prop Key (APIトークン)',  ph: 'xxxxxxxxxxxxxxxx', secret: true, hint: 'Beds24 → My Account → Advanced → API Keys' },
      { key: 'inviteCode',  label: 'Invite Code（初回のみ）', ph: 'invite-xxxxxxxx',   hint: 'Beds24アカウントの招待コード（初期設定時のみ必要）' },
    ],
    apaleo:         [
      { key: 'clientId',     label: 'Client ID',     ph: 'APALEO-xxxxxxxx', hint: 'apaleo Developer Portal → Apps' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'xxxxxxxxxxxxxxxx', secret: true },
    ],
    hostaway:       [
      { key: 'accountId',   label: 'Account ID',    ph: '12345',           hint: 'Hostaway → Settings → API' },
      { key: 'apiKey',      label: 'APIキー',        ph: 'ha-xxxxxxxx',    secret: true },
    ],
    little_hotelier: [{ key: 'apiKey', label: 'APIキー', ph: 'lh-xxxxxxxx', secret: true, hint: 'Little Hotelier → Settings → API Access' }],
    opera:           [
      { key: 'clientId',     label: 'Client ID',     ph: 'oracle-client-id',     hint: 'Oracle Cloud → API Gateway' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'oracle-client-secret', secret: true },
      { key: 'propertyCode', label: 'Property Code', ph: 'HOTEL1', hint: 'Operaのプロパティコード（英数字）' },
    ],
    none: [],
  }

  // 錠デバイス必須フィールド定義
  const LOCK_FIELDS: Record<string, { key: string; label: string; ph: string; secret?: boolean; hint?: string }[]> = {
    switchbot: [
      { key: 'token',     label: 'Open Token',  ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
        hint: 'SwitchBotアプリ → プロフィール → 設定 → アプリ・SwitchBotウェブサービス → APIキー' },
      { key: 'secret',    label: 'Secret Key',  ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
        hint: 'Open Token取得画面の下に表示されるSecret Key（v1.1必須）' },
    ],
    ttlock: [
      { key: 'clientId',  label: 'Client ID',   ph: 'your_client_id',     hint: 'TTLock開発者ポータル → アプリ作成 → Client ID' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'your_client_secret', secret: true },
      { key: 'username',  label: 'ログインID（メール）', ph: 'your@email.com',  hint: 'TTLockアプリのアカウントメールアドレス' },
      { key: 'password',  label: 'パスワード',   ph: '••••••••',           secret: true, hint: 'TTLockアプリのログインパスワード' },
    ],
    sesame: [
      { key: 'apiKey',    label: 'API Key',      ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
        hint: 'my.sesame.team → ログイン → API Keys → Generate API Key' },
    ],
    igloohome: [
      { key: 'clientId',     label: 'Client ID',     ph: 'igl-client-xxxxxxxx', hint: 'igloohome Bridge → Developer → API Settings' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'igl-secret-xxxxxxxx', secret: true },
    ],
    remotelock: [
      { key: 'apiKey',    label: 'APIキー',      ph: 'rl-xxxxxxxxxxxxxxxx', secret: true, hint: 'RemoteLOCK管理画面 → 設定 → API連携（開発中）' },
    ],
    nuki: [
      { key: 'apiToken',  label: 'API Token',    ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
        hint: 'Nuki Web（https://web.nuki.io）→ API → Manage API tokens → Generate API token' },
    ],
    salto: [
      { key: 'clientId',     label: 'Client ID',     ph: 'salto-client-xxxxxxxx', hint: 'Saltoパートナーポータルで取得（開発中）' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'salto-secret-xxxxxxxx', secret: true },
    ],
    fixed: [
      { key: 'password',  label: '固定パスワード（4〜8桁の数字）', ph: '8421', hint: 'チェックイン時にゲストへ案内するコード番号' },
    ],
    offline: [],
  }

  const curPmsFields  = PMS_FIELDS[pms]  || []
  const curLockFields = LOCK_FIELDS[lockType] || []

  const setPmsField  = (k: string, v: string) => setPmsFields(prev => ({ ...prev, [k]: v }))
  const setLockField = (k: string, v: string) => setLockFields(prev => ({ ...prev, [k]: v }))
  const toggleShow = (k: string) => setShowFields(prev => ({ ...prev, [k]: !prev[k] }))

  /* PMS保存 */
  const savePms = () => {
    localStorage.setItem(STORAGE_KEY_PMS, JSON.stringify({ pms, fields: pmsFields }))
    setPmsStatus({ ok: true, message: '保存しました。「DMS接続テスト」を押してください。' })
  }

  /* 錠設定保存 */
  const saveLock = () => {
    const pw = curLockFields.find(f => f.key === 'password')?.key
    if (pw) setFixedPassword(lockFields[pw] || fixedPassword)
    localStorage.setItem(STORAGE_KEY_LOCK, JSON.stringify({ lockType, fields: lockFields }))
    setLockStatus({ ok: true, message: '保存しました。「錠接続テスト」を押してください。' })
  }

  /* DMS接続テスト */
  const testPms = async () => {
    setPmsTesting(true)
    setPmsStatus(null)
    try {
      const res = await fetch('/api/nextra-ai/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pms', pms, fields: pmsFields }),
      })
      const data = await res.json()
      setPmsStatus({ ok: data.ok, message: data.message })
      if (data.ok) onPmsConnected(data.mode || 'live')
    } catch {
      setPmsStatus({ ok: false, message: 'ネットワークエラーが発生しました' })
    } finally {
      setPmsTesting(false)
    }
  }

  /* 錠接続テスト */
  const testLock = async () => {
    setLockTesting(true)
    setLockStatus(null)
    try {
      const res = await fetch('/api/nextra-ai/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lock', lockType, fields: lockFields }),
      })
      const data = await res.json()
      setLockStatus({ ok: data.ok, message: data.message })
      if (data.ok) onLockConnected(data.mode || 'live')
    } catch {
      setLockStatus({ ok: false, message: 'ネットワークエラーが発生しました' })
    } finally {
      setLockTesting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6 space-y-7 my-4"
        style={{ background: '#0d1117', border: '1px solid #1e293b' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Settings size={16} style={{ color: '#10b981' }} /> DMS システム設定
          </h3>
          <button onClick={onClose} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">✕ 閉じる</button>
        </div>

        {/* ── PMS設定セクション ── */}
        <div className="space-y-4 rounded-xl p-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
          <div className="flex items-center gap-2">
            <Wifi size={13} style={{ color: pmsInfo.color }} />
            <span className="text-xs font-semibold text-slate-300">PMS連携設定</span>
            <span className="text-[10px] text-slate-600 ml-auto">{PMS_OPTIONS.length - 1}種類対応</span>
          </div>

          {/* 日本向けPMS */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">🇯🇵 日本向け</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PMS_OPTIONS.filter(o => o.region === 'JP').map(opt => (
                <button key={opt.id} onClick={() => { setPms(opt.id); setPmsStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all relative"
                  style={{
                    background: pms === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${pms === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: pms === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.note}</span>
                  {opt.pending && (
                    <span className="absolute top-1 right-1 text-[8px] px-1 rounded"
                      style={{ background: '#1e293b', color: '#64748b' }}>開発中</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* グローバルPMS */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">🌐 グローバル</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PMS_OPTIONS.filter(o => o.region === 'Global').map(opt => (
                <button key={opt.id} onClick={() => { setPms(opt.id); setPmsStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all relative"
                  style={{
                    background: pms === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${pms === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: pms === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.note}</span>
                  {opt.pending && (
                    <span className="absolute top-1 right-1 text-[8px] px-1 rounded"
                      style={{ background: '#1e293b', color: '#64748b' }}>開発中</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ローカルモード */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">📴 オフライン</p>
            <div className="grid grid-cols-1 gap-1.5">
              {PMS_OPTIONS.filter(o => o.local).map(opt => (
                <button key={opt.id} onClick={() => { setPms(opt.id); setPmsStatus(null) }}
                  className="h-auto py-1.5 px-3 rounded-lg text-left transition-all"
                  style={{
                    background: pms === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${pms === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold" style={{ color: pms === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600 ml-2">{opt.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PMS動的フィールド入力 */}
          {!pmsInfo.local && curPmsFields.length > 0 && (
            <div className="space-y-3">
              {pmsInfo.pending && (
                <div className="text-[10px] px-2 py-1.5 rounded-lg text-amber-400"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  ⚠️ このPMSは連携開発中です。APIキーを先行保存しておくと、リリース後すぐ使えます。
                </div>
              )}
              {curPmsFields.map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">{f.label}</label>
                  {f.hint && <p className="text-[10px] text-slate-600">📍 {f.hint}</p>}
                  <div className="flex gap-2">
                    <input
                      type={f.secret && !showFields[`pms_${f.key}`] ? 'password' : 'text'}
                      value={pmsFields[f.key] || ''}
                      onChange={e => setPmsField(f.key, e.target.value)}
                      placeholder={f.ph}
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = pmsInfo.color)}
                      onBlur={e => (e.target.style.borderColor = '#334155')}
                    />
                    {f.secret && (
                      <button onClick={() => toggleShow(`pms_${f.key}`)}
                        className="shrink-0 h-11 px-3 rounded-lg text-xs transition-all"
                        style={{ background: '#0d1117', border: '1px solid #334155', color: '#64748b' }}>
                        {showFields[`pms_${f.key}`] ? '🙈' : '👁'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!pmsInfo.local && curPmsFields.length === 0 && (
            <p className="text-[10px] text-slate-600 px-2">このPMSのフィールド定義は準備中です。</p>
          )}

          {/* PMS 保存 + 接続テストボタン */}
          <div className="flex gap-2">
            <button onClick={savePms}
              className="flex-1 h-9 rounded-lg text-xs font-semibold transition-all"
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
              💾 保存
            </button>
            <button onClick={testPms} disabled={pmsTesting}
              className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={{ background: pmsInfo.local ? '#334155' : pmsInfo.color, color: '#fff', opacity: pmsTesting ? 0.7 : 1 }}>
              {pmsTesting ? <Loader2 size={12} className="animate-spin" /> : <Wifi size={12} />}
              {pmsInfo.local ? 'ローカルモードで確認' : 'DMS接続テスト'}
            </button>
          </div>

          {/* PMS ステータス */}
          {pmsStatus && (
            <div className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg"
              style={{
                background: pmsStatus.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${pmsStatus.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: pmsStatus.ok ? '#34d399' : '#f87171',
              }}>
              {pmsStatus.ok ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" /> : <span className="shrink-0">✗</span>}
              {pmsStatus.message}
            </div>
          )}
        </div>

        {/* ── 錠デバイス設定セクション ── */}
        <div className="space-y-4 rounded-xl p-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
          <div className="flex items-center gap-2">
            <Lock size={13} style={{ color: lockInfo.color }} />
            <span className="text-xs font-semibold text-slate-300">錠デバイス設定</span>
            <span className="text-[10px] text-slate-600 ml-auto">{LOCK_OPTIONS.length}種類対応</span>
          </div>

          {/* API連携型 */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">🔌 API連携型スマートロック</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {LOCK_OPTIONS.filter(o => !o.local).map(opt => (
                <button key={opt.id} onClick={() => { setLockType(opt.id); setLockStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all relative"
                  style={{
                    background: lockType === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${lockType === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: lockType === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.keyLabel}</span>
                  {opt.pending && (
                    <span className="absolute top-1 right-1 text-[8px] px-1 rounded"
                      style={{ background: '#1e293b', color: '#64748b' }}>開発中</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ローカル型 */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">📴 ローカル／手動</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LOCK_OPTIONS.filter(o => o.local).map(opt => (
                <button key={opt.id} onClick={() => { setLockType(opt.id); setLockStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all"
                  style={{
                    background: lockType === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${lockType === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: lockType === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.keyHint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 錠デバイス動的フィールド入力 */}
          {curLockFields.length > 0 && (
            <div className="space-y-3">
              {lockInfo.pending && (
                <div className="text-[10px] px-2 py-1.5 rounded-lg text-amber-400"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  ⚠️ このデバイスは連携開発中です。先行保存しておくとリリース後すぐ使えます。
                </div>
              )}
              {curLockFields.map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">{f.label}</label>
                  {f.hint && <p className="text-[10px] text-slate-600">📍 {f.hint}</p>}
                  <div className="flex gap-2">
                    <input
                      type={f.secret && !showFields[`lock_${f.key}`] ? 'password' : 'text'}
                      value={lockFields[f.key] || ''}
                      onChange={e => {
                        const val = f.key === 'password' && lockType === 'fixed'
                          ? e.target.value.replace(/\D/g, '').slice(0, 8)
                          : e.target.value
                        setLockField(f.key, val)
                        if (f.key === 'password') setFixedPassword(val)
                      }}
                      placeholder={f.ph}
                      className={inputCls} style={inputStyle}
                      maxLength={f.key === 'password' && lockType === 'fixed' ? 8 : undefined}
                      onFocus={e => (e.target.style.borderColor = lockInfo.color)}
                      onBlur={e => (e.target.style.borderColor = '#334155')}
                    />
                    {f.secret && (
                      <button onClick={() => toggleShow(`lock_${f.key}`)}
                        className="shrink-0 h-11 px-3 rounded-lg text-xs transition-all"
                        style={{ background: '#0d1117', border: '1px solid #334155', color: '#64748b' }}>
                        {showFields[`lock_${f.key}`] ? '🙈' : '👁'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {lockType === 'offline' && (
            <p className="text-[10px] text-slate-500 px-2 py-2 rounded-lg"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
              🏠 API不要モード。スタッフが手動で鍵をゲストへ渡す運用です。
            </p>
          )}

          {/* 錠 保存 + 接続テストボタン */}
          <div className="flex gap-2">
            <button onClick={saveLock}
              className="flex-1 h-9 rounded-lg text-xs font-semibold transition-all"
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
              💾 保存
            </button>
            <button onClick={testLock} disabled={lockTesting}
              className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={{
                background: lockInfo.local ? '#334155' : lockInfo.color,
                color: '#fff',
                opacity: lockTesting ? 0.7 : 1,
              }}>
              {lockTesting ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
              {lockInfo.local ? 'ローカルで確認' : '錠接続テスト'}
            </button>
          </div>

          {/* 錠 ステータス */}
          {lockStatus && (
            <div className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg"
              style={{
                background: lockStatus.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${lockStatus.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: lockStatus.ok ? '#34d399' : '#f87171',
              }}>
              {lockStatus.ok ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" /> : <span className="shrink-0">✗</span>}
              {lockStatus.message}
            </div>
          )}
        </div>

        <button onClick={onClose}
          className="w-full h-11 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#10b981', color: '#fff' }}>
          設定を保存して閉じる
        </button>
      </div>
    </div>
  )
}

/* ─────────── メインエンジン ─────────── */
const MasterEngine = () => {
  const [activeTab, setActiveTab]         = useState<string>('kiosk')
  const [isMounted, setIsMounted]         = useState(false)
  const [selectedLang, setSelectedLang]   = useState('日本語')

  // システム設定
  const [pms, setPms]                     = useState<string>('staysee')
  const [lockType, setLockType]           = useState<string>('fixed')
  const [fixedPassword, setFixedPassword] = useState<string>('8421')
  const [showSettings, setShowSettings]   = useState(false)
  const [isOnline, setIsOnline]           = useState(true)

  // 予約検索
  const [searchMode, setSearchMode]       = useState<'select'|'reservation'|'name'|'phone'>('select')
  const [searchQuery, setSearchQuery]     = useState('')
  const [searchResults, setSearchResults] = useState<Reservation[]>([])
  const [searching, setSearching]         = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  // チェックイン
  const [checkinStatus, setCheckinStatus] = useState<'IDLE'|'SCANNING'|'VERIFIED'>('IDLE')
  const [ledgerName, setLedgerName]       = useState('')
  const [ledgerAddress, setLedgerAddress] = useState('')
  const [ledgerOccupation, setLedgerOccupation] = useState('')
  const [ledgerTravel, setLedgerTravel]   = useState('')
  const [signatureData, setSignatureData] = useState<string>('')
  const [signatureClearedAt, setSignatureClearedAt] = useState(0)

  // カメラ（IDスキャン専用）
  const [isCameraOpen, setIsCameraOpen]   = useState(false)
  const [cameraError, setCameraError]     = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // チェックアウト
  const [checkoutQuery, setCheckoutQuery]     = useState('')
  const [checkoutResults, setCheckoutResults] = useState<Reservation[]>([])
  const [checkoutTarget, setCheckoutTarget]   = useState<Reservation | null>(null)
  const [checkoutSearching, setCheckoutSearching] = useState(false)
  const [checkoutStep, setCheckoutStep]       = useState<'search'|'confirm'|'processing'|'done'>('search')
  const [hasExtraCharge] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // localStorage から設定を復元（fields対応）
    try {
      const savedPms  = JSON.parse(localStorage.getItem('nextra_ai_pms_config')  || '{}')
      const savedLock = JSON.parse(localStorage.getItem('nextra_ai_lock_config') || '{}')
      if (savedPms.pms)     setPms(savedPms.pms)
      if (savedLock.lockType) setLockType(savedLock.lockType)
      // fixedPasswordをfields.passwordから復元
      const lockPw = savedLock.fields?.password
      if (lockPw) setFixedPassword(lockPw)
      if (savedPms.pms === 'none' || savedPms.pms === 'offline') setIsOnline(false)
    } catch { /* ignore */ }
  }, [])

  /* ─── QRスキャン（BarcodeDetector API） ─── */
  const qrScanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCamera = async () => {
    setCameraError(null)
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        // BarcodeDetector APIでQRを連続検出
        videoRef.current.addEventListener('playing', () => startQrDetection(), { once: true })
      }
    } catch {
      setCameraError('カメラへのアクセスが拒否されました')
      setIsCameraOpen(false)
    }
  }

  const startQrDetection = () => {
    // BarcodeDetector API 非対応ブラウザはスキップ（手動スキャンボタンにフォールバック）
    if (!('BarcodeDetector' in window)) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })

    qrScanTimerRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return
      try {
        const barcodes = await detector.detect(videoRef.current)
        if (barcodes.length > 0) {
          const qrValue: string = barcodes[0].rawValue || ''
          clearInterval(qrScanTimerRef.current!)
          closeCamera()
          handleQrResult(qrValue)
        }
      } catch { /* 検出エラーは無視 */ }
    }, 300)
  }

  const closeCamera = () => {
    if (qrScanTimerRef.current) clearInterval(qrScanTimerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    setIsCameraOpen(false)
    setCameraError(null)
  }

  /* ─── QR読み取り結果処理 ─── */
  const handleQrResult = (qrValue: string) => {
    // 予約IDがQRに含まれているか検索（例: "reservation_id=ABC123" or "ABC123" など）
    const idMatch = qrValue.match(/(?:reservation[_-]?id[=:]?\s*)([A-Za-z0-9-]+)/i)
      || qrValue.match(/([A-Za-z0-9]{6,20})/)
    const extractedId = idMatch?.[1] || qrValue.trim()

    if (extractedId && selectedReservation) {
      // 予約が既に選択済み → チェックイン処理へ
      runCheckin()
    } else if (extractedId) {
      // 予約IDをQRから自動検索
      setSearchQuery(extractedId)
      setSearchMode('reservation')
      doSearchByQuery(extractedId)
    } else {
      setCameraError('QRコードから予約IDを読み取れませんでした')
    }
  }

  const capturePhoto = () => {
    // BarcodeDetector非対応時のフォールバック（手動撮影）
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx?.drawImage(videoRef.current, 0, 0)
      closeCamera()
      runCheckin()
    }
  }

  /* ─── チェックイン処理（予約選択済みが前提） ─── */
  const runCheckin = async () => {
    setCheckinStatus('SCANNING')
    await new Promise(r => setTimeout(r, 800))
    if (selectedReservation) {
      setLedgerName(resName(selectedReservation))
      setLedgerAddress((selectedReservation as Record<string, unknown>).address as string || '')
      setLedgerOccupation('')
      setLedgerTravel('')
    }
    setCheckinStatus('VERIFIED')
  }

  /* ─── 予約検索（クエリ直接指定版） ─── */
  const doSearchByQuery = async (query: string) => {
    if (!query.trim()) return
    setSearching(true)
    setSearchResults([])
    try {
      if (pms === 'none') {
        const q = query.toLowerCase()
        const results = LOCAL_RESERVATIONS.filter(r =>
          r.id.toLowerCase().includes(q) ||
          (r.name_kanji || '').toLowerCase().includes(q) ||
          (r.tel || '').replace(/-/g, '').includes(q.replace(/-/g, ''))
        )
        await new Promise(r => setTimeout(r, 400))
        setSearchResults(results)
      } else {
        const res = await fetch(`/api/staysee/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSearchResults(data.reservations || [])
      }
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  /* ─── 予約検索（PMS分岐） ─── */
  const doSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchResults([])
    try {
      if (pms === 'none') {
        // ローカルモード: ダミーデータから検索
        const q = searchQuery.toLowerCase()
        const results = LOCAL_RESERVATIONS.filter(r =>
          r.id.toLowerCase().includes(q) ||
          (r.name_kanji || '').toLowerCase().includes(q) ||
          (r.tel || '').replace(/-/g, '').includes(q.replace(/-/g, ''))
        )
        await new Promise(r => setTimeout(r, 500))
        setSearchResults(results)
        setIsOnline(false)
      } else {
        // PMS API呼び出し
        const apiPath = pms === 'staysee' ? '/api/staysee/search' : `/api/pms/${pms}/search`
        const res = await fetch(`${apiPath}?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await res.json()
        setSearchResults(data.reservations || [])
        setIsOnline(true)
      }
    } catch {
      // APIエラー時はローカルモードにフォールバック
      const q = searchQuery.toLowerCase()
      setSearchResults(LOCAL_RESERVATIONS.filter(r =>
        r.id.toLowerCase().includes(q) || (r.name_kanji || '').includes(q) || (r.tel || '').includes(q)
      ))
      setIsOnline(false)
    } finally {
      setSearching(false)
    }
  }

  const selectReservation = (r: Reservation) => {
    setSelectedReservation(r)
    setLedgerName(resName(r))
    setCheckinStatus('IDLE')
    setActiveTab('checkin')
  }

  /* ─── チェックアウト検索 ─── */
  const doCheckoutSearch = async () => {
    if (!checkoutQuery.trim()) return
    setCheckoutSearching(true)
    setCheckoutResults([])
    try {
      if (pms === 'none') {
        const q = checkoutQuery.toLowerCase()
        const results = LOCAL_RESERVATIONS.filter(r =>
          r.id.toLowerCase().includes(q) ||
          (r.name_kanji || '').toLowerCase().includes(q) ||
          (r.tel || '').replace(/-/g, '').includes(q.replace(/-/g, ''))
        )
        await new Promise(r => setTimeout(r, 400))
        setCheckoutResults(results)
      } else {
        const apiPath = pms === 'staysee' ? '/api/staysee/search' : `/api/pms/${pms}/search`
        const res = await fetch(`${apiPath}?q=${encodeURIComponent(checkoutQuery.trim())}&mode=checkout`)
        const data = await res.json()
        setCheckoutResults(data.reservations || [])
      }
    } catch {
      const q = checkoutQuery.toLowerCase()
      setCheckoutResults(LOCAL_RESERVATIONS.filter(r =>
        (r.name_kanji || '').includes(q) || (r.tel || '').includes(q)
      ))
    } finally {
      setCheckoutSearching(false)
    }
  }

  const selectCheckoutTarget = (r: Reservation) => {
    setCheckoutTarget(r)
    setCheckoutStep('confirm')
  }

  /* ─── クラウド保存（Supabase経由） ─── */
  const saveToCloud = async (payload: Record<string, unknown>) => {
    try {
      await fetch('/api/nextra-ai/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // サイレントフェイル（UI影響なし）
    }
  }

  /* ─── チェックイン完了通知 ─── */
  const notifyCheckin = async (reservationId: string) => {
    if (pms !== 'none') {
      await fetch('/api/staysee/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId, action: 'checkin',
          ledger: { name: ledgerName, address: ledgerAddress, occupation: ledgerOccupation, travel: ledgerTravel },
        }),
      }).catch(() => null)
    }
    // クラウド保存（常時）
    await saveToCloud({
      type: 'checkin', reservationId, pms,
      ledger: { name: ledgerName, address: ledgerAddress, occupation: ledgerOccupation, travel: ledgerTravel },
      hasSig: !!signatureData,
      timestamp: new Date().toISOString(),
    })
  }

  /* ─── チェックアウト完了通知 ─── */
  const notifyCheckout = async (reservationId: string) => {
    if (pms !== 'none') {
      await fetch('/api/staysee/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, action: 'checkout' }),
      }).catch(() => null)
    }
    await saveToCloud({
      type: 'checkout', reservationId, pms,
      timestamp: new Date().toISOString(),
    })
  }

  /* ─── 錠パスワード生成 ─── */
  const getLockCode = useCallback(() => {
    if (lockType === 'fixed') return fixedPassword || '8421'
    if (lockType === 'switchbot' || lockType === 'ttlock') {
      // 実API連携時はAPIから取得（現在はシミュレーション）
      const base = selectedReservation?.id?.slice(-4) || '0000'
      return base.padStart(4, '0')
    }
    return '—'
  }, [lockType, fixedPassword, selectedReservation])

  /* ─── タブ切り替え ─── */
  const gotoTab = (id: string) => {
    setActiveTab(id)
    if (id === 'search') { setSearchMode('select'); setSearchQuery(''); setSearchResults([]) }
    if (id === 'checkout') { setCheckoutStep('search'); setCheckoutQuery(''); setCheckoutResults([]); setCheckoutTarget(null) }
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen pb-24" style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
            style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Nextra AI Autonomous OS
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
            次世代スマート<span style={{ color: '#10b981' }}>チェックイン</span>プロトコル
          </h1>
          <p className="text-slate-400 text-sm">PMS連携・本人確認・電子署名・鍵発行を完全自動化するホテルDXシステム。</p>
        </div>
        {/* PMS/錠設定はDMS（/dms）で管理 */}
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-4">

        {/* PMS接続状態バナー + DMS同期ボタン */}
        <PmsBanner
          pms={pms}
          lockType={lockType}
          isOnline={isOnline}
          onSync={async () => {
            // PMS接続テストを実行してDMSの状態を更新
            try {
              const savedPms = JSON.parse(localStorage.getItem('nextra_ai_pms_config') || '{}')
              const res = await fetch('/api/nextra-ai/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'pms', pms, pmsApiKey: savedPms.apiKey || '' }),
              })
              const data = await res.json()
              setIsOnline(data.ok && data.mode !== 'local')
            } catch {
              setIsOnline(false)
            }
          }}
        />

        {/* タブナビ */}
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

        {/* ════ スタート ════ */}
        {activeTab === 'kiosk' && (
          <div className="rounded-xl flex flex-col items-center justify-center py-16 space-y-10"
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
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
            <div className="flex gap-8 flex-wrap justify-center">
              <button onClick={() => gotoTab('search')}
                className="w-44 h-44 rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.03]"
                style={{ background: '#13141f', border: '2px solid rgba(16,185,129,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)')}>
                <UserPlus size={32} style={{ color: '#10b981' }} />
                <span className="text-emerald-400 text-base font-bold">チェックイン</span>
                <span className="text-slate-600 text-[10px]">CHECK IN</span>
              </button>
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

        {/* ════ 予約検索 ════ */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            {searchMode === 'select' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { mode: 'reservation' as const, icon: Hash,         label: '予約番号で検索', color: '#10b981' },
                  { mode: 'name'        as const, icon: ClipboardList, label: '氏名で検索',     color: '#6366f1' },
                  { mode: 'phone'       as const, icon: Phone,         label: '電話番号で検索',  color: '#f59e0b' },
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
                    placeholder={searchMode === 'reservation' ? 'NTR-001' : searchMode === 'name' ? '山田 太郎' : '090-1234-5678'}
                    className={inputCls} style={inputStyle}
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

                {searchResults.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-slate-500">{searchResults.length}件見つかりました</p>
                    {searchResults.map(r => (
                      <div key={r.id} className="rounded-xl p-4 flex items-center justify-between gap-4"
                        style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-100">{resName(r)} 様</p>
                          <p className="text-xs text-slate-500">
                            {r.id} | {resRoom(r)}号室 | {resDate(r.start_date)}〜{resDate(r.end_date)}
                          </p>
                          <p className="text-xs text-slate-600">{resPhone(r)}</p>
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

        {/* ════ 自動チェックイン ════ */}
        {activeTab === 'checkin' && (
          <div className="rounded-xl p-6 space-y-6" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>

            {/* カメラモーダル */}
            {isCameraOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
                <div className="w-full max-w-sm space-y-4">
                  {cameraError ? (
                    <div className="rounded-xl p-6 text-center space-y-3"
                      style={{ background: '#0d1117', border: '1px solid #ef4444' }}>
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

            {selectedReservation && (
              <div className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-emerald-400">{resName(selectedReservation)} 様</span>
                  <span className="text-slate-500 ml-2">
                    {selectedReservation.id} | {resRoom(selectedReservation)}号室 |
                    {resDate(selectedReservation.start_date)}〜{resDate(selectedReservation.end_date)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">宿泊者情報の登録</h3>
                <p className="text-xs text-slate-500 mt-1">旅館業法に基づき、正確な情報をご入力ください。</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                <Shield size={10} className="inline mr-1" />
                本人確認プロセス
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">

              {/* Step 1: IDスキャン（カメラのみ） */}
              <div className="rounded-xl p-5 space-y-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Camera size={12} className="text-emerald-400" />
                  ステップ 1 — 身分証スキャン
                </p>

                <div
                  className="rounded-lg aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                  style={{ border: `2px dashed ${checkinStatus === 'VERIFIED' ? '#10b981' : '#334155'}`, background: '#0a0b0f' }}
                  onClick={() => checkinStatus === 'IDLE' && startCamera()}>
                  {checkinStatus === 'SCANNING' && <Loader2 size={36} className="text-emerald-400 animate-spin" />}
                  {checkinStatus === 'VERIFIED' && <CheckCircle2 size={36} style={{ color: '#10b981' }} />}
                  {checkinStatus === 'IDLE'     && <Camera size={36} className="text-slate-600" />}
                  <p className="text-xs text-slate-500">
                    {checkinStatus === 'VERIFIED' ? 'スキャン完了 ✓' : checkinStatus === 'SCANNING' ? 'AI読み取り中...' : '身分証をタップしてスキャン'}
                  </p>
                </div>

                {/* カメラのみ（ファイル選択なし） */}
                <button onClick={startCamera} disabled={checkinStatus === 'SCANNING'}
                  className="w-full h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Camera size={12} /> カメラを起動してスキャン
                </button>
              </div>

              {/* Step 2: 台帳記入 */}
              <div className="rounded-xl p-5 space-y-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <ClipboardList size={12} className="text-indigo-400" />
                  ステップ 2 — 宿泊者台帳記入
                </p>
                <div className="space-y-3">
                  {[
                    { label: '氏名 *',  value: ledgerName,    set: setLedgerName,    ph: '例：山田 太郎' },
                    { label: '住所 *',  value: ledgerAddress, set: setLedgerAddress, ph: '例：東京都渋谷区1-2-3' },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-600">{f.label}</label>
                      <input value={f.value} onChange={e => f.set(e.target.value)}
                        placeholder={checkinStatus === 'SCANNING' ? 'AI読み取り中...' : f.ph}
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
                </div>
              </div>
            </div>

            {/* Step 3: 電子署名（全幅） */}
            <div className="rounded-xl p-5 space-y-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <PenLine size={12} className="text-violet-400" />
                ステップ 3 — 電子署名（旅館業法・宿泊約款への同意）
              </p>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                宿泊約款および個人情報取扱方針に同意の上、下記にご署名ください。署名はデジタル台帳として保管されます。
              </p>
              <SignaturePanel
                key={signatureClearedAt}
                onSigned={setSignatureData}
                onClear={() => { setSignatureData(''); setSignatureClearedAt(Date.now()) }}
              />
            </div>

            {/* チェックイン完了ボタン */}
            <button
              onClick={async () => {
                if (selectedReservation?.id) await notifyCheckin(selectedReservation.id)
                setActiveTab('lock')
              }}
              disabled={!ledgerName}
              className="w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                background: ledgerName ? '#10b981' : '#1e293b',
                color: ledgerName ? '#fff' : '#475569',
              }}>
              チェックイン完了 → 鍵発行 <ArrowRight size={15} />
            </button>
            <p className="text-center text-[10px] text-slate-600">
              {!ledgerName
                ? '氏名を入力してください'
                : `入力内容を${PMS_OPTIONS.find(p => p.id === pms)?.label || 'PMS'}に送信し、DMSに反映されます`}
            </p>
          </div>
        )}

        {/* ════ 鍵発行 ════ */}
        {activeTab === 'lock' && (
          <div className="rounded-xl p-10 flex flex-col items-center justify-center gap-8"
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
            <div className="flex items-center gap-3">
              <Lock size={36} style={{ color: '#10b981' }} />
              <div>
                <h3 className="text-xl font-semibold text-slate-100">アクセスキー発行</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {LOCK_OPTIONS.find(l => l.id === lockType)?.label} 連携
                </p>
              </div>
            </div>

            <div className="rounded-xl px-12 py-8 text-center"
              style={{ background: '#13141f', border: '2px solid #10b981', boxShadow: '0 0 30px rgba(16,185,129,0.15)' }}>
              <p className="text-xs font-medium text-slate-500 mb-1">
                Room: {selectedReservation ? resRoom(selectedReservation) : '—'}
              </p>
              <p className="text-xs text-slate-600 mb-3">
                {selectedReservation
                  ? `${resDate(selectedReservation.start_date)}〜${resDate(selectedReservation.end_date)}`
                  : '—'}
              </p>
              {lockType !== 'fixed' && (
                <p className="text-xs text-slate-500 mb-2">
                  {lockType === 'switchbot' ? 'SwitchBot' : 'TT Lock'} 連携中
                </p>
              )}
              <p className="text-6xl font-bold tracking-[0.2em]" style={{ color: '#10b981' }}>
                {getLockCode()}
              </p>
              <p className="text-xs text-slate-500 mt-3">
                {lockType === 'fixed' ? '固定暗証番号' : lockType === 'switchbot' ? 'SwitchBot 一時コード' : 'TT Lock 一時コード'}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
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

        {/* ════ チェックアウト ════ */}
        {activeTab === 'checkout' && (
          <div className="rounded-xl p-6 space-y-5" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>

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
                          <p className="text-sm font-semibold text-slate-100">{resName(r)} 様</p>
                          <p className="text-xs text-slate-500">
                            {r.id} | {resRoom(r)}号室 | {resDate(r.start_date)}〜{resDate(r.end_date)}
                          </p>
                          <p className="text-xs text-slate-500">宿泊料金: {resAmount(r)}</p>
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
                    { label: 'お名前',        value: `${resName(checkoutTarget)} 様` },
                    { label: '部屋番号',       value: `${resRoom(checkoutTarget)}号室` },
                    { label: 'チェックイン',   value: resDate(checkoutTarget.start_date) },
                    { label: 'チェックアウト', value: `${resDate(checkoutTarget.end_date)}（本日）` },
                    { label: '宿泊料金',       value: resAmount(checkoutTarget) },
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
                    <p className="text-slate-400 text-xs leading-relaxed">スタッフをお呼びして精算の上、チェックアウトをお願いします。</p>
                    <button className="px-6 h-10 rounded-lg text-sm font-semibold transition-all"
                      style={{ background: '#f59e0b', color: '#000' }}
                      onClick={() => alert('スタッフを呼び出しました。しばらくお待ちください。')}>
                      🔔 スタッフを呼ぶ
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      if (checkoutTarget.id) await notifyCheckout(checkoutTarget.id)
                      setCheckoutStep('processing')
                    }}
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

            {checkoutStep === 'processing' && (
              <CheckoutProcessing onDone={() => setCheckoutStep('done')} />
            )}

            {checkoutStep === 'done' && (
              <div className="flex flex-col items-center gap-6 py-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '2px solid #6366f1' }}>
                  <CheckCircle2 size={40} style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">チェックアウト完了</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {checkoutTarget ? resName(checkoutTarget) : ''} 様、ご利用ありがとうございました
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-500">
                  <CheckCircle2 size={12} /> データをクラウドに保存しました
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

/* ─── SSR無効でラップ ─── */
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function HotelPage() { return <NoSSR /> }
