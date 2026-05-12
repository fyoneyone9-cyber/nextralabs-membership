'use client'
import Link from 'next/link'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PenLine, MessageSquare, Building, Lock, Video, Car, FileBarChart,
  Settings, Database, LogOut, ArrowRight, Search, RefreshCw,
  Download, Plus, Edit3, BookText, Wrench, Plane, MapPin, Sparkles, ExternalLink, Trash2
} from 'lucide-react'
import DmsBookingEditor from './DmsBookingEditor'
import DmsPropertyEditor from './DmsPropertyEditor'
import LockListContent, { LockListHeaderActions, LockListRef } from './LockListEngine'
import RoomListContent from './RoomListEngine'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import CallsEngine from './CallsEngine'
import { CloudPmsStorage } from '@/lib/cloud-pms-storage'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

/* ─── Realtime通話通知フック ─── */
function playCallSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6)
  } catch { /* 非対応ブラウザは無視 */ }
}

interface IncomingCallBannerProps { onDismiss: () => void; roomUrl: string; propertyName: string; time: string }
function IncomingCallBanner({ onDismiss, roomUrl, propertyName, time }: IncomingCallBannerProps) {
  return (
    <div className="fixed top-4 left-1/2 z-[9999] flex items-center gap-4 px-5 py-4 rounded-2xl"
      style={{
        transform: 'translateX(-50%)',
        background: '#0d1117',
        border: '2px solid #10b981',
        boxShadow: '0 0 40px rgba(16,185,129,0.45)',
        minWidth: 300, maxWidth: 420,
      }}>
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 animate-pulse"
        style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981' }}>
        <Video size={20} style={{ color: '#10b981' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-emerald-400">📞 フロント呼び出し！</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{propertyName} · {time}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <a href={roomUrl} target="_blank" rel="noopener noreferrer" onClick={onDismiss}
          className="h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5"
          style={{ background: '#10b981', color: '#fff' }}>
          <Video size={12} /> 応答
        </a>
        <button onClick={onDismiss} className="h-9 px-3 rounded-xl text-xs font-semibold"
          style={{ background: '#1e293b', color: '#64748b', border: '1px solid #334155' }}>
          閉じる
        </button>
      </div>
    </div>
  )
}

const MENU_ITEMS = [
  { id: 'checkin',    label: 'チェックイン',      icon: PenLine,      href: '/dms' },
  { id: 'survey',     label: 'アンケート回収',     icon: MessageSquare,href: '/dms/survey' },
  { id: 'property',   label: '物件',              icon: Building,     href: '/dms?tab=property' },
  { id: 'room-list',  label: '部屋一覧',          icon: Building,     href: '/dms?tab=room-list' },
  { id: 'lock-list',  label: '錠デバイス一覧',     icon: Lock,         href: '/dms/lock-list' },
  { id: 'calls',      label: '通話一覧（フロント）',icon: Video,        href: '/dms?tab=calls' },
  { id: 'cars',       label: '車両情報',           icon: Car,          href: '/dms/cars' },
  { id: 'reports',    label: '宿泊実績定期報告',   icon: FileBarChart, href: '/dms/reports' },
  { id: 'tools',      label: '便利ツール',          icon: Wrench,       href: '/dms?tab=tools' },
]

const SETTINGS_MENU = [
  { id: 'org-settings',  label: '組織設定',   icon: Database, href: '/dms/org-settings' },
  { id: 'pms-settings',  label: 'PMS設定',    icon: Settings, href: '/dms/pms-settings' },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock,     href: '/dms/lock-settings' },
]

const inputCls = 'w-full h-10 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors'
const inputStyle = { background: '#13141f', border: '1px solid #334155' }

function SettingsPanel({ title, icon, fields, storagePrefix }: {
  title: string
  icon: React.ReactNode
  fields: { key: string; label: string; type: 'text' | 'password' | 'select'; options?: string[]; placeholder: string }[]
  storagePrefix: string
}) {
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [showPass, setShowPass] = React.useState<Record<string, boolean>>({})
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/dms/config')
      .then(r => r.json())
      .then(data => {
        if (data.error) return
        const loaded: Record<string, string> = {}
        fields.forEach(f => {
          const cfgKey = f.key // e.g. 'daily_api_key', 'org_name'
          loaded[f.key] = (data[cfgKey] as string) || ''
        })
        setValues(loaded)
      })
      .catch(() => {})
  }, [storagePrefix, fields])

  const save = async () => {
    const patch: Record<string, string> = {}
    fields.forEach(f => { patch[f.key] = values[f.key] || '' })
    await fetch('/api/dms/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-white/5 pb-4">
          {icon} {title}
        </div>
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">{f.label}</label>
              {f.type === 'select' ? (
                <select
                  value={values[f.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  className={inputCls}
                  style={{ ...inputStyle, appearance: 'none' as any }}
                >
                  <option value="">{f.placeholder}</option>
                  {f.options?.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === 'password' ? (
                <div className="relative">
                  <input
                    type={showPass[f.key] ? 'text' : 'password'}
                    value={values[f.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className={`${inputCls} pr-10 font-mono`}
                    style={{ ...inputStyle, color: '#10b981' }}
                    onFocus={e => (e.target.style.borderColor = '#10b981')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => ({ ...v, [f.key]: !v[f.key] }))}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPass[f.key] ? '🙈' : '👁'}
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={values[f.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#10b981')}
                  onBlur={e => (e.target.style.borderColor = '#334155')}
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={save}
          className="h-10 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
          style={{ background: saved ? '#059669' : '#10b981', color: '#fff' }}
        >
          {saved ? '✓ 保存しました' : '設定を保存'}
        </button>
      </div>
    </div>
  )
}

// ── ロック設定パネル（種別ごとにフィールドが動的切り替え） ──
const LOCK_TYPE_OPTIONS = [
  { value: 'switchbot',  label: 'SwitchBot',          icon: '🔵', apiType: 'api' },
  { value: 'ttlock',     label: 'TT Lock',             icon: '🟣', apiType: 'oauth' },
  { value: 'sesame',     label: 'SESAME',              icon: '🟡', apiType: 'api' },
  { value: 'igloohome',  label: 'igloohome',           icon: '🟤', apiType: 'oauth' },
  { value: 'nuki',       label: 'Nuki',                icon: '⚫', apiType: 'api' },
  { value: 'remotelock', label: 'RemoteLOCK',          icon: '🔴', apiType: 'api' },
  { value: 'salto',      label: 'Salto KS',            icon: '🔶', apiType: 'oauth' },
  { value: 'fixed',      label: '固定パスワード',       icon: '🔢', apiType: 'none' },
  { value: 'offline',    label: 'オフライン（手渡し）', icon: '📋', apiType: 'none' },
]

const LOCK_FIELDS_DEF: Record<string, { key: string; label: string; ph: string; secret?: boolean; hint?: string }[]> = {
  switchbot: [
    { key: 'token',        label: 'Open Token',   ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
      hint: 'SwitchBotアプリ → プロフィール → 設定 → アプリ・SwitchBotウェブサービス → APIキー' },
    { key: 'secret',       label: 'Secret Key',   ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
      hint: 'Open Token取得画面の下に表示されるSecret Key（v1.1必須）' },
  ],
  ttlock: [
    { key: 'clientId',     label: 'Client ID',           ph: 'your_client_id',     hint: 'TTLock開発者ポータル → アプリ作成 → Client ID' },
    { key: 'clientSecret', label: 'Client Secret',       ph: 'your_client_secret', secret: true },
    { key: 'username',     label: 'ログインID（メール）', ph: 'your@email.com',     hint: 'TTLockアプリのアカウントメールアドレス' },
    { key: 'password',     label: 'パスワード',           ph: '••••••••',           secret: true, hint: 'TTLockアプリのログインパスワード' },
  ],
  sesame: [
    { key: 'apiKey',       label: 'API Key',      ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
      hint: 'my.sesame.team → ログイン → API Keys → Generate API Key' },
  ],
  igloohome: [
    { key: 'clientId',     label: 'Client ID',     ph: 'igl-client-xxxxxxxx', hint: 'igloohome Bridge → Developer → API Settings' },
    { key: 'clientSecret', label: 'Client Secret', ph: 'igl-secret-xxxxxxxx', secret: true },
  ],
  nuki: [
    { key: 'apiToken',     label: 'API Token',    ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
      hint: 'Nuki Web（https://web.nuki.io）→ API → Manage API tokens → Generate API token' },
  ],
  remotelock: [
    { key: 'apiKey',       label: 'APIキー',      ph: 'rl-xxxxxxxxxxxxxxxx', secret: true,
      hint: 'RemoteLOCK管理画面 → 設定 → API連携' },
  ],
  salto: [
    { key: 'clientId',     label: 'Client ID',     ph: 'salto-client-xxxxxxxx', hint: 'Saltoパートナーポータルで取得' },
    { key: 'clientSecret', label: 'Client Secret', ph: 'salto-secret-xxxxxxxx', secret: true },
  ],
  fixed: [
    { key: 'password',     label: '固定パスワード（4〜8桁の数字）', ph: '8421',
      hint: 'チェックイン時にゲストへ案内するコード番号' },
  ],
  offline: [],
}

function LockSettingsPanel({ onGoLockList }: { onGoLockList: () => void }) {
  const STORAGE_KEY = 'dms_lock_v2'
  const [lockType, setLockType] = React.useState('switchbot')
  const [fields, setFields] = React.useState<Record<string, string>>({})
  const [showFields, setShowFields] = React.useState<Record<string, boolean>>({})
  const [saved, setSaved] = React.useState(false)

  // ローカルストレージから復元
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.lockType) setLockType(parsed.lockType)
        if (parsed.fields)   setFields(parsed.fields)
      }
    } catch {}
  }, [])

  // 種別切り替え時にフィールド値をリセット
  const handleTypeChange = (v: string) => {
    setLockType(v)
    setFields({})
    setSaved(false)
  }

  const curFields = LOCK_FIELDS_DEF[lockType] || []
  const selectedOpt = LOCK_TYPE_OPTIONS.find(o => o.value === lockType)

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lockType, fields }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* 種別セレクター */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-white/5 pb-4">
          <Lock size={15} style={{ color: '#10b981' }} />
          ロック・鍵デバイス設定
        </div>

        {/* 種別ドロップダウン */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">種別</label>
          <select
            value={lockType}
            onChange={e => handleTypeChange(e.target.value)}
            className={inputCls}
            style={{ ...inputStyle, appearance: 'none' as any }}
          >
            {LOCK_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
            ))}
          </select>
        </div>

        {/* 種別バッジ */}
        {selectedOpt && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedOpt.icon}</span>
            <span className="text-sm font-semibold text-slate-200">{selectedOpt.label}</span>
            {selectedOpt.apiType === 'api' && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">API接続</span>
            )}
            {selectedOpt.apiType === 'oauth' && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">OAuth2</span>
            )}
            {selectedOpt.apiType === 'none' && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-white/10">APIなし</span>
            )}
          </div>
        )}

        {/* 動的フィールド */}
        {curFields.length > 0 ? (
          <div className="space-y-4">
            {curFields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">{f.label}</label>
                {f.secret ? (
                  <div className="relative">
                    <input
                      type={showFields[f.key] ? 'text' : 'password'}
                      value={fields[f.key] || ''}
                      onChange={e => setFields(v => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      className={`${inputCls} pr-10 font-mono`}
                      style={{ ...inputStyle, color: '#10b981' }}
                      onFocus={e => (e.target.style.borderColor = '#10b981')}
                      onBlur={e => (e.target.style.borderColor = '#334155')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowFields(v => ({ ...v, [f.key]: !v[f.key] }))}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-sm"
                    >
                      {showFields[f.key] ? '🙈' : '👁'}
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={fields[f.key] || ''}
                    onChange={e => setFields(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#10b981')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                )}
                {f.hint && (
                  <p className="text-[10px] text-slate-600 leading-relaxed">{f.hint}</p>
                )}
              </div>
            ))}
          </div>
        ) : lockType === 'offline' ? (
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 text-[11px] text-slate-500 leading-relaxed">
            📋 オフライン（手渡し）モードはAPIキー不要です。<br />
            チェックイン時に手動でゲストへ鍵を渡す運用となります。
          </div>
        ) : null}

        <button
          onClick={save}
          disabled={lockType === 'offline'}
          className="h-10 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-40"
          style={{ background: saved ? '#059669' : '#10b981', color: '#fff' }}
        >
          {saved ? '✓ 保存しました' : '設定を保存'}
        </button>
      </div>

      {/* 錠デバイス一覧へのリンク */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
        <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <Lock size={13} style={{ color: '#10b981' }} />
          設定した錠デバイスを確認・管理
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          保存した設定でデバイスの登録状態や接続台数を確認できます。<br />
          <span className="text-slate-500">固定パスワード・オフライン設定でもローカル管理リストとして利用できます。</span>
        </p>
        <button
          onClick={onGoLockList}
          className="flex items-center gap-2 h-9 px-5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: '#10b981', color: '#fff' }}
        >
          <Lock size={13} /> 錠デバイス一覧で確認 <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

// PMS別APIキー取得ガイド
const PMS_GUIDE: Record<string, { url: string; label: string; steps: string[] }> = {
  'Staysee': {
    url: 'https://app.staysee.jp/settings/api',
    label: 'Staysee 管理画面',
    steps: [
      'Staysee管理画面にログイン',
      '右上のアカウントメニュー → 「設定」を開く',
      '「API設定」タブを選択',
      '「APIキーを生成」ボタンをクリック',
      '表示されたAPIキーをコピーして上のフォームに貼り付け',
    ],
  },
  'エアホスト': {
    url: 'https://dashboard.airhost.co.jp/settings',
    label: 'エアホスト ダッシュボード',
    steps: [
      'エアホスト ダッシュボードにログイン',
      '左メニュー「設定」→「API連携」を開く',
      '「APIキー発行」をクリック',
      '発行されたAPIキーをコピーして貼り付け',
    ],
  },
  'Cloudbeds': {
    url: 'https://hotels.cloudbeds.com/api/v1.1/docs',
    label: 'Cloudbeds APIドキュメント',
    steps: [
      'Cloudbeds管理画面にログイン',
      '右上アカウント → 「Apps & Integrations」',
      '「API Keys」セクション → 「Generate New Key」',
      'スコープ（予約・ゲスト）にチェックを入れて生成',
      '表示されたAPIキーをコピーして貼り付け',
    ],
  },
  'Beds24': {
    url: 'https://beds24.com/control2.php?pagetype=keychain',
    label: 'Beds24 API設定',
    steps: [
      'Beds24管理画面にログイン',
      '「Account」→「Apps & Integrations」→「API Keys」',
      '「Add Key」で新しいAPIキーを作成',
      '権限を「Read Bookings」に設定して保存',
      'キーをコピーして貼り付け',
    ],
  },
  'イージー会計': {
    url: 'https://easy-kaikei.jp/',
    label: 'イージー会計サポート',
    steps: [
      'イージー会計サポートページにてAPI連携申請が必要です',
      'お問い合わせフォームから「API連携希望」と送信',
      'サポートからAPIキーが発行されメールで届きます',
      '届いたAPIキーをコピーして貼り付け',
    ],
  },
  'ねっぱん！': {
    url: 'https://www.neppan.com/',
    label: 'ねっぱん！管理画面',
    steps: [
      'ねっぱん！管理画面にログイン',
      '「システム設定」→「外部連携設定」を開く',
      '「APIキー」欄に表示されているキーをコピー',
      '上のフォームに貼り付けて保存',
    ],
  },
  'Hostaway': {
    url: 'https://dashboard.hostaway.com/settings/api',
    label: 'Hostaway API設定',
    steps: [
      'Hostaway ダッシュボードにログイン',
      '左メニュー「Settings」→「API Access」',
      '「Generate API Key」をクリック',
      '用途を入力してキーを生成',
      'コピーして上のフォームに貼り付け',
    ],
  },
  'apaleo': {
    url: 'https://apaleo.com/developers',
    label: 'apaleo Developer Portal',
    steps: [
      'apaleo Developer Portalにアクセス',
      '「My Applications」→「Create Application」',
      'Client IDとClient Secretが発行されます',
      '※apaleoはOAuth2認証のため、サポートへ連携申請をお願いします',
    ],
  },
  'Little Hotelier': {
    url: 'https://www.littlehotelier.com/',
    label: 'Little Hotelier サポート',
    steps: [
      'Little Hotelier管理画面にログイン',
      '「Settings」→「Connectivity」→「Channel Manager API」',
      'APIキーが表示されるのでコピー',
      '上のフォームに貼り付けて保存',
    ],
  },
  'Oracle Opera': {
    url: 'https://docs.oracle.com/en/industries/hospitality/opera-cloud/',
    label: 'Oracle Opera Cloud ドキュメント',
    steps: [
      'Oracle Opera Cloud管理者権限でログイン',
      '「Administration」→「Interfaces」→「OXI Configuration」',
      'API Credentialsを生成してコピー',
      '※エンタープライズ向けのため、Oracleサポートへの連絡を推奨します',
    ],
  },
}

function PmsSettingsPanel({ onGoCheckin }: { onGoCheckin: () => void }) {
  const [pmsType, setPmsType] = React.useState('')
  const [apiKey, setApiKey] = React.useState('')
  const [showKey, setShowKey] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/dms/config')
      .then(r => r.json())
      .then(data => {
        if (data.error) return
        setPmsType(data.pms_type || '')
        setApiKey(data.pms_fields?.apiKey || '')
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    await fetch('/api/dms/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pms_type: pmsType,
        pms_fields: { apiKey },
      }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const guide = pmsType ? PMS_GUIDE[pmsType] : null
  const isLocal = pmsType === 'PMS未接続（ローカル）'

  return (
    <div className="space-y-4 max-w-2xl">
      {/* PMS選択 + APIキー入力 */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-white/5 pb-4">
          <Settings size={15} style={{ color: '#10b981' }} /> PMSシステム設定
        </div>

        {/* PMSシステム選択 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">PMSシステム</label>
          <select
            value={pmsType}
            onChange={e => setPmsType(e.target.value)}
            className={inputCls}
            style={{ ...inputStyle, appearance: 'none' as any }}
          >
            <option value="">PMSを選択...</option>
            {['Staysee','エアホスト','Cloudbeds','Beds24','イージー会計','ねっぱん！',
              'apaleo','Hostaway','Little Hotelier','Oracle Opera','PMS未接続（ローカル）'
            ].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* APIキー入力（ローカルモードは非表示） */}
        {!isLocal && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">PMS API KEY</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="PMS APIキーを入力"
                className={`${inputCls} pr-10 font-mono`}
                style={{ ...inputStyle, color: '#10b981' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKey ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={save}
          className="h-10 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
          style={{ background: saved ? '#059669' : '#10b981', color: '#fff' }}
        >
          {saved ? '✓ 保存しました' : '設定を保存'}
        </button>
      </div>

      {/* ローカルモード説明 */}
      {isLocal && (
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span style={{ color: '#10b981' }}>●</span> ローカルモード（PMS未接続）
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            APIキーは不要です。予約データを手動で入力してローカル管理できます。<br />
            後からPMSを追加したい場合は、上のプルダウンから切り替えてください。
          </p>
        </div>
      )}

      {/* PMSごとのAPIキー取得ガイド */}
      {guide && (
        <div className="bg-[#0d0f1a] border border-emerald-500/20 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <ExternalLink size={13} /> {pmsType} のAPIキー取得方法
          </p>
          <ol className="space-y-2">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  {i + 1}
                </span>
                <span className="text-[12px] text-slate-400 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <a
            href={guide.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all w-fit"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <ExternalLink size={12} /> {guide.label}を開く
          </a>
        </div>
      )}

      {/* チェックイン一覧へのリンク */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
        <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <PenLine size={13} style={{ color: '#10b981' }} />
          PMS設定をチェックイン一覧に反映
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          設定したPMSの予約データを今日・明日・日付指定でフィルターして確認できます。<br />
          <span className="text-slate-500">PMS未接続（ローカル）でも、手動入力した予約をローカル管理できます。</span>
        </p>
        <button
          onClick={onGoCheckin}
          className="flex items-center gap-2 h-9 px-5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: '#10b981', color: '#fff' }}
        >
          <PenLine size={13} /> チェックイン一覧で確認 <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

// 物件の型定義
interface Property {
  id: string
  name: string
  pmsType?: string       // 例: 'staysee' | 'airhost' | '' (空=ローカル)
  pmsConnected?: boolean // PMS接続テスト済みか
}

// 物件はSupabase管理（localStorage廃止）
async function fetchPropertiesFromCloud(): Promise<Property[]> {
  try {
    const res = await fetch('/api/dms/properties')
    const data = await res.json()
    return (data.properties || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      pmsType: p.pms_type || '',
      pmsConnected: p.pms_connected || false,
    }))
  } catch { return [] }
}

async function savePropertiesToCloud(props: Property[]) {
  await fetch('/api/dms/properties', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: props }),
  })
}

async function deletePropertyFromCloud(id: string) {
  await fetch('/api/dms/properties', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}

export default function DmsEngine() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('checkin')
  const [editingBooking, setEditingBooking] = useState<any>(null)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [confirmDeleteProperty, setConfirmDeleteProperty] = useState<string | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [propView, setPropView] = useState<'list' | 'create'>('list')
  const [lockSearchQuery, setLockSearchQuery] = useState('')
  const [roomSearchQuery, setRoomSearchQuery] = useState('')
  const [lockDeleting, setLockDeleting] = useState(false)
  const [lockUnusedCount, setLockUnusedCount] = useState(0)
  const [lockTotalCount, setLockTotalCount] = useState(0)
  const lockListRef = useRef<LockListRef>(null)
  const handleLockCountChange = useCallback((total: number, unused: number) => {
    setLockTotalCount(total)
    setLockUnusedCount(unused)
  }, [])
  const [bookings, setBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [orgName, setOrgName] = useState('')
  const [activePmsType, setActivePmsType] = useState('')
  const [incomingCall, setIncomingCall] = useState<{ roomUrl: string; propertyName: string; time: string } | null>(null)
  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // ── フィルターバー state ──
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'custom'>('today')
  const [roomFilter, setRoomFilter] = useState<'all' | 'custom'>('all')
  const [customDate, setCustomDate] = useState('')
  const [customRoom, setCustomRoom] = useState('')

  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam)
  }, [tabParam])

  const getTargetDate = (filter: 'today' | 'tomorrow' | 'custom', custom?: string) => {
    if (filter === 'custom' && custom) return custom
    const d = new Date()
    if (filter === 'tomorrow') d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  }

  const fetchStayseeBookings = async (dateF = dateFilter, custDate = customDate) => {
    setLoadingBookings(true)
    try {
      const date = getTargetDate(dateF, custDate)
      const res = await fetch(`/api/staysee/reservations?date=${date}`)
      const data = await res.json()
      if (data.reservations) setBookings(data.reservations)
      else setBookings([])
    } catch (e) {
      console.error(e)
      setBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  // 日付フィルター変更時に再取得
  const handleDateFilter = (f: 'today' | 'tomorrow' | 'custom') => {
    setDateFilter(f)
    if (f !== 'custom') fetchStayseeBookings(f, '')
  }

  // 部屋フィルター: クライアントサイドでbookingsをフィルタリング
  const filteredBookings = bookings.filter(b => {
    if (roomFilter === 'all') return true
    if (!customRoom.trim()) return true
    const roomId = String(b.allocate_rooms?.[0]?.room_id || '')
    return roomId.includes(customRoom.trim())
  })

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    const days = ['日','月','火','水','木','金','土']
    setCurrentDate(`${now.getMonth()+1}/${now.getDate()}(${days[now.getDay()]}) ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
    fetchPropertiesFromCloud().then(setProperties)
    fetch('/api/dms/config')
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setOrgName(data.org_name || '')
          setActivePmsType(data.pms_type || '')
        }
      })
      .catch(() => {})
    fetchStayseeBookings()
  }, [])

  // Supabase Realtime: フロント呼び出し通知（別useEffectで分離）
  useEffect(() => {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const ch = sb.channel('dms-engine-calls')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dms_call_events' }, (payload) => {
        const row = payload.new as any
        playCallSound()
        const time = (() => {
          try { return new Date(row.created_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }) }
          catch { return '' }
        })()
        setIncomingCall({ roomUrl: row.room_url, propertyName: row.property_name, time })
        setTimeout(() => setIncomingCall(null), 30000)
      })
      .subscribe((status) => {
        console.log('[DMS Realtime] status:', status)
      })
    realtimeRef.current = ch
    return () => { sb.removeChannel(ch) }
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#050507] text-slate-200">

      {/* フロント着信バナー */}
      {incomingCall && (
        <IncomingCallBanner
          roomUrl={incomingCall.roomUrl}
          propertyName={incomingCall.propertyName}
          time={incomingCall.time}
          onDismiss={() => setIncomingCall(null)}
        />
      )}

      {/* 上部ヘッダー */}
      <header className="border-b border-white/5 bg-[#0d0f1a] sticky top-0 z-40">
        {/* ロゴ行 */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="font-bold text-slate-950 text-xs">N</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-bold text-white text-sm tracking-tight">Nextra DMS</p>
              <p className="text-[10px] text-slate-500 font-medium">{currentDate}</p>
              <Badge className="bg-slate-800 text-slate-400 text-[9px] font-semibold px-2 py-0 h-4 border-0">今日の予約</Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold px-2 py-0 h-4 border-emerald-500/30">{bookings.length}件</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'checkin' && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                  <input placeholder="予約検索" className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-36 outline-none focus:border-emerald-500 text-slate-300 transition-all" />
                </div>
                <Button onClick={() => setEditingBooking({})} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-3">
                  <Plus size={11} className="mr-1" /> 手動宿泊作成
                </Button>
                <Button onClick={fetchStayseeBookings} variant="ghost" className="h-7 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs px-3 font-semibold">
                  <RefreshCw size={11} className={`mr-1 ${loadingBookings ? 'animate-spin' : ''}`} /> 予約同期
                </Button>
                <Button variant="ghost" className="h-7 border border-white/10 text-slate-400 hover:bg-white/5 rounded-lg text-xs px-3 font-semibold">
                  <Download size={11} className="mr-1" /> CSV
                </Button>
              </>
            )}
            {activeTab === 'property' && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={async () => {
                    const cfgRes = await fetch('/api/dms/config')
                    const cfg = await cfgRes.json()
                    const pmsApiKey = cfg.pms_fields?.apiKey || ''
                    const pmsType = cfg.pms_type || ''
                    if (!pmsApiKey || !pmsType || pmsType === 'PMS未接続（ローカル）') {
                      alert('PMS設定からAPIキーを設定してください')
                      return
                    }
                    try {
                      const res = await fetch('/api/staysee/properties', {
                        headers: { 'x-staysee-api-key': pmsApiKey }
                      })
                      const data = await res.json()
                      if (!res.ok) { alert(`同期失敗: ${data.error}`); return }
                      if (data.properties?.length) {
                        await savePropertiesToCloud(data.properties)
                        setProperties(data.properties)
                        alert(`✅ ${data.properties.length}件の物件をクラウドに同期しました`)
                      } else {
                        alert('PMSに物件が見つかりませんでした')
                      }
                    } catch { alert('通信エラーが発生しました') }
                  }}
                  variant="ghost"
                  className="h-7 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs px-3 font-semibold"
                >
                  <RefreshCw size={11} className="mr-1" /> PMSから同期
                </Button>
                <Button onClick={() => setPropView('create')} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-3">
                  <Plus size={11} className="mr-1" /> 新規作成
                </Button>
              </div>
            )}
            {activeTab === 'lock-list' && (
              <LockListHeaderActions
                searchQuery={lockSearchQuery}
                setSearchQuery={setLockSearchQuery}
                onAdd={() => (lockListRef.current as any)?.openRegisterDialog?.()}
                onDeleteUnused={() => lockListRef.current?.triggerDeleteUnused()}
                onDeleteAll={() => lockListRef.current?.triggerDeleteAll()}
                deleting={lockDeleting}
                unusedCount={lockUnusedCount}
                totalCount={lockTotalCount}
              />
            )}
            {activeTab === 'room-list' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                <input
                  value={roomSearchQuery}
                  onChange={e => setRoomSearchQuery(e.target.value)}
                  placeholder="部屋を検索..."
                  className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-40 outline-none focus:border-emerald-500 text-slate-300 transition-all"
                />
              </div>
            )}
            <button onClick={async () => {
                // Cookie削除 + localStorage削除
                await fetch('/api/dms/logout', { method: 'POST' })
                localStorage.removeItem('dms_session')
                window.location.href = '/dms/login'
              }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-[10px] font-semibold transition-colors ml-2">
              <LogOut size={12} /> ログアウト
            </button>
          </div>
        </div>

        {/* タブナビ（常時表示） */}
        <div className="px-4 flex items-center gap-0.5 overflow-x-auto">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (item.href && !item.href.includes('?')) window.history.pushState({}, '', item.href) }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === item.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              <item.icon size={13} />
              {item.label}
            </button>
          ))}
          {/* 区切り */}
          <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />
          {/* 設定項目も常時表示 */}
          {SETTINGS_MENU.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === item.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              <item.icon size={13} />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* コンテンツエリア */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-[#050507]">

          {/* チェックイン一覧 */}
          {activeTab === 'checkin' && (
            <>
              {/* フィルターバー（実動作） */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* 日付フィルター */}
                  <div className="flex items-center bg-[#0d0f1a] border border-white/5 p-1 rounded-xl">
                    {(['today', 'tomorrow', 'custom'] as const).map((f, i) => (
                      <button
                        key={f}
                        onClick={() => handleDateFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          dateFilter === f ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {i === 0 ? '今日' : i === 1 ? '明日' : '日付指定'}
                      </button>
                    ))}
                  </div>

                  {/* 日付指定input */}
                  {dateFilter === 'custom' && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={customDate}
                        onChange={e => {
                          setCustomDate(e.target.value)
                          if (e.target.value) fetchStayseeBookings('custom', e.target.value)
                        }}
                        className="h-8 px-3 rounded-lg text-xs text-slate-200 outline-none focus:border-emerald-500 transition-all"
                        style={{ background: '#0d0f1a', border: '1px solid rgba(16,185,129,0.4)', colorScheme: 'dark' }}
                      />
                    </div>
                  )}

                  {/* 部屋フィルター */}
                  <div className="flex items-center bg-[#0d0f1a] border border-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => { setRoomFilter('all'); setCustomRoom('') }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${roomFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >全部屋</button>
                    <button
                      onClick={() => setRoomFilter('custom')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${roomFilter === 'custom' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >部屋選択</button>
                  </div>

                  {/* 部屋番号input */}
                  {roomFilter === 'custom' && (
                    <input
                      type="text"
                      value={customRoom}
                      onChange={e => setCustomRoom(e.target.value)}
                      placeholder="部屋番号を入力..."
                      className="h-8 px-3 rounded-lg text-xs text-slate-200 outline-none focus:border-emerald-500 transition-all w-32"
                      style={{ background: '#0d0f1a', border: '1px solid rgba(99,102,241,0.4)' }}
                    />
                  )}
                </div>

                {/* 件数バッジ（本日のチェックアウト・滞在中をbookingsから計算） */}
                {(() => {
                  const today = new Date().toISOString().slice(0, 10)
                  const checkoutCount = bookings.filter(b => b.end_date?.startsWith(today)).length
                  const stayingCount = bookings.filter(b => {
                    const start = b.start_date?.slice(0, 10) || ''
                    const end = b.end_date?.slice(0, 10) || ''
                    return start < today && end > today
                  }).length
                  return (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/5 text-slate-300 border border-white/10 px-3 py-1 rounded-lg text-xs font-semibold">
                        → チェックイン {filteredBookings.length}
                        {roomFilter === 'custom' && customRoom && ` / 全${bookings.length}`}
                      </Badge>
                      <Badge className="bg-white/5 text-slate-300 border border-white/10 px-3 py-1 rounded-lg text-xs font-semibold">
                        ← チェックアウト {checkoutCount}
                      </Badge>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-semibold">
                        ⌨ 滞在中 {stayingCount}
                      </Badge>
                    </div>
                  )
                })()}
              </div>

              <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-center">ステータス</th>
                        <th className="px-4 py-3">物件名</th>
                        <th className="px-4 py-3">部屋</th>
                        <th className="px-4 py-3 text-center">人数 / 予約者</th>
                        <th className="px-4 py-3">予約元 / OTA予約番号</th>
                        <th className="px-4 py-3">PMS予約番号</th>
                        <th className="px-4 py-3">チェックイン</th>
                        <th className="px-4 py-3 text-right">詳細</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingBookings ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-slate-500">
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                              <span className="text-xs font-semibold">予約データ同期中...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-slate-600 text-xs font-semibold">
                            {bookings.length > 0
                              ? `部屋「${customRoom}」の予約は見つかりません（全${bookings.length}件中）`
                              : `${dateFilter === 'tomorrow' ? '明日' : dateFilter === 'custom' && customDate ? customDate : '本日'}の予約はありません`}
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map(b => (
                          <tr key={b.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-center">
                              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-3 py-0.5 rounded-full text-[9px]">
                                confirmed
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <div className="flex flex-col gap-1">
                                <span className="text-slate-300 font-medium">
                                  {orgName || properties[0]?.name || '（施設名未設定）'}
                                </span>
                                {activePmsType && activePmsType !== 'PMS未接続（ローカル）' ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full w-fit"
                                    style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                    {activePmsType} 連携中
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full w-fit"
                                    style={{ background: 'rgba(100,116,139,0.1)', color: '#64748b', border: '1px solid #1e293b' }}>
                                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                                    ローカル保存
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-slate-600 text-[9px] font-medium uppercase">（未設定）</p>
                              <span className="text-sm font-bold text-white">{b.allocate_rooms?.[0]?.room_id || '---'}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <p className="text-slate-500 text-[9px] font-medium">{b.person_number || '1'}名</p>
                              <Link href={`/dms/bookings/${b.id}`} className="text-emerald-400 font-bold text-xs hover:underline">
                                {b.name_kanji}
                              </Link>
                            </td>
                            <td className="px-4 py-3 font-semibold text-xs uppercase"
                              style={{ color: activePmsType && activePmsType !== 'PMS未接続（ローカル）' ? '#34d399' : '#64748b' }}>
                              {activePmsType && activePmsType !== 'PMS未接続（ローカル）' ? activePmsType.toUpperCase() : 'LOCAL'}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-500 text-xs">{b.id}</td>
                            <td className="px-4 py-3 text-slate-300 font-semibold text-xs">{b.start_date?.substring(5)}</td>
                            <td className="px-4 py-3 text-right">
                              <Link href={`/dms/bookings/${b.id}`}>
                                <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-500/10 rounded-lg">
                                  <ArrowRight size={16} />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* 便利ツール */}
          {activeTab === 'tools' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base font-bold text-slate-200 mb-1">便利ツール</h2>
                <p className="text-xs text-slate-500">宿泊DMS連携の便利機能・AIツール集。宿泊者サービス向上にお使いください。</p>
              </div>

              {/* 旅行系ツール */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Plane size={13} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">旅行・観光</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {/* AI旅行コンシェルジュ */}
                  <a
                    href="/products/travel-concierge/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-5 rounded-2xl transition-all hover:border-emerald-500/50 hover:scale-[1.01]"
                    style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      <Plane size={20} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-200">AI旅行コンシェルジュ</span>
                        <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        楽天トラベルの宿＋Google Mapsの観光地を自動収集し、Gemini AIが旅程を丸ごと生成。宿泊者のチェックイン前・滞在中のご案内に活用できます。
                      </p>
                      <div className="flex gap-2 mt-2.5 flex-wrap">
                        {['楽天トラベル', 'Google Maps', 'Gemini AI'].map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>

                  {/* AIロケーションファインダー */}
                  <a
                    href="/products/location-finder/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-5 rounded-2xl transition-all hover:border-emerald-500/50 hover:scale-[1.01]"
                    style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      <MapPin size={20} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-200">AI Location Scout</span>
                        <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        YouTube URLを貼るだけでGemini AIがサムネイルを解析し撮影場所をGoogle Mapsにピン表示。周辺スポット紹介・SNS発信に活用。
                      </p>
                      <div className="flex gap-2 mt-2.5 flex-wrap">
                        {['Gemini Vision', 'Google Maps', 'YouTube'].map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>

                  {/* 推し活聖地巡礼プランナー */}
                  <a
                    href="/products/pilgrimage-planner/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-5 rounded-2xl transition-all hover:border-emerald-500/50 hover:scale-[1.01]"
                    style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      <Sparkles size={20} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-200">推し活聖地巡礼プランナー</span>
                        <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        アニメ・ドラマ・アイドルの聖地をAIが自動検索し、宿泊地からの最適巡礼ルートと旅程を丸ごと生成。ファン宿泊者の特別体験づくりに。
                      </p>
                      <div className="flex gap-2 mt-2.5 flex-wrap">
                        {['聖地マップ', '旅程自動生成', 'AI提案'].map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>

                </div>
              </div>

              {/* 近日追加予定 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">近日追加予定</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: '🗾', title: '周辺グルメ自動案内', desc: 'チェックイン後に宿泊者へ周辺のおすすめグルメをAIが自動提案' },
                    { icon: '🚂', title: 'アクセス自動案内', desc: '最寄り駅・バス停からのルートをAIが自動生成して宿泊者へ送付' },
                  ].map(({ icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex gap-4 p-5 rounded-2xl opacity-50"
                      style={{ background: '#0d1117', border: '1px dashed #1e293b' }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ background: '#13141f' }}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-400 mb-1">{title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                        <span className="inline-block mt-2 text-[10px] text-slate-700 font-medium">開発予定</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 部屋一覧 */}
          {activeTab === 'room-list' && (
            <RoomListContent searchQuery={roomSearchQuery} />
          )}

          {/* 錠デバイス一覧 */}
          {activeTab === 'lock-list' && (
            <LockListContent
              ref={lockListRef}
              searchQuery={lockSearchQuery}
              onCountChange={handleLockCountChange}
            />
          )}

          {/* 物件新規作成 */}
          {activeTab === 'property' && propView === 'create' && (
            <DmsPropertyEditor
              property={null}
              isDarkMode={true}
              onClose={() => { setPropView('list'); fetchPropertiesFromCloud().then(setProperties) }}
            />
          )}

          {/* 物件一覧 */}
          {activeTab === 'property' && propView === 'list' && (() => {
            // PMS接続状況をcloudconfigのstateから読む
            const pmsType = activePmsType
            const isPmsConnected = !!pmsType && pmsType !== 'PMS未接続（ローカル）'

            return (
              <div className="space-y-3">
                {/* PMS接続状況サマリー */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs"
                  style={{
                    background: isPmsConnected ? 'rgba(16,185,129,0.06)' : 'rgba(100,116,139,0.06)',
                    border: isPmsConnected ? '1px solid rgba(16,185,129,0.25)' : '1px solid #1e293b',
                  }}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isPmsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  {isPmsConnected
                    ? <><span className="font-semibold text-emerald-400">{pmsType} 接続済み</span><span className="text-slate-500 ml-2">予約データをPMSから取得中</span></>
                    : <><span className="font-semibold text-slate-400">PMS未接続（ローカル保存）</span><span className="text-slate-600 ml-2">左メニュー「PMS設定」から連携できます</span></>
                  }
                </div>

                <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">物件名</th>
                        <th className="px-5 py-3">データソース</th>
                        <th className="px-5 py-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {properties.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-slate-500 text-xs">物件がまだ登録されていません</td>
                        </tr>
                      )}
                      {properties.map((prop) => {
                        const propPms = prop.pmsType || (isPmsConnected ? pmsType : '')
                        const isLocal = !propPms || propPms === 'PMS未接続（ローカル）'
                        return (
                          <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-5 py-4 font-semibold text-slate-200">{prop.name}</td>
                            <td className="px-5 py-4">
                              {isLocal ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                  style={{ background: 'rgba(100,116,139,0.12)', color: '#64748b', border: '1px solid #1e293b' }}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                  ローカル保存
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  {propPms} 連携
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingProperty(prop)}
                                  className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white transition-all"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteProperty(prop.id)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center ml-2 transition-all"
                                  style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })()}

          {/* 通話一覧（フロント） */}
          {activeTab === 'calls' && (
            <div className="-mx-6 -mt-4">
              <CallsEngine embedded />
            </div>
          )}

          {/* ロック設定 */}
          {activeTab === 'lock-settings' && (
            <LockSettingsPanel onGoLockList={() => setActiveTab('lock-list')} />
          )}

          {/* PMS設定 */}
          {activeTab === 'pms-settings' && <PmsSettingsPanel onGoCheckin={() => setActiveTab('checkin')} />}

          {/* 組織設定 */}
          {activeTab === 'org-settings' && (
            <SettingsPanel
              title="組織設定"
              icon={<Database size={15} style={{ color: '#10b981' }} />}
              fields={[
                { key: 'org_name', label: '施設名', type: 'text', placeholder: '例：ビジネスホテルアップル' },
                { key: 'org_email', label: '管理者メールアドレス', type: 'text', placeholder: 'admin@example.com' },
                { key: 'daily_api_key', label: 'Daily.co API Key（通話機能）', type: 'password', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxx' },
              ]}
              storagePrefix="dms_org"
            />
          )}

        </div>
      </main>

      {editingBooking && <DmsBookingEditor booking={editingBooking.name_kanji ? editingBooking : null} onClose={() => setEditingBooking(null)} />}
      {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => { setEditingProperty(null); fetchPropertiesFromCloud().then(setProperties) }} onDeleted={() => fetchPropertiesFromCloud().then(setProperties)} />}
      <DeleteConfirmDialog
        open={confirmDeleteProperty !== null}
        title={confirmDeleteProperty ? `「${properties.find(p => p.id === confirmDeleteProperty)?.name ?? ''}」を削除しますか？` : ''}
        description="物件を削除すると、紐づく部屋・鍵デバイスの設定も失われます。"
        warning="この操作は元に戻せません。削除すると復元できません。"
        onConfirm={async () => {
          if (!confirmDeleteProperty) return
          await deletePropertyFromCloud(confirmDeleteProperty)
          setProperties(prev => prev.filter(p => p.id !== confirmDeleteProperty))
          setConfirmDeleteProperty(null)
        }}
        onCancel={() => setConfirmDeleteProperty(null)}
      />
    </div>
  )
}
