'use client'
import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Plus, Trash2, RefreshCw, Search, X, Eye, EyeOff, ChevronRight, Save } from 'lucide-react'
import DeleteConfirmDialog from './DeleteConfirmDialog'

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
export interface LockDevice {
  id: string
  name: string           // 識別名
  type: string           // 錠の種別
  property: string       // 使用中の物件
  room: string           // 部屋
  roomType: string       // 部屋タイプ
  deviceId: string       // デバイスID / 解除番号
  inUse: boolean
  // 接続情報（種別依存）
  loginId?: string
  loginPassword?: string
  unlockCodeType?: string
  unlockButton?: string
}

export interface LockListRef {
  triggerDeleteUnused: () => void
  triggerDeleteAll: () => void
  getUnusedCount: () => number
  getTotalCount: () => number
}

// ─────────────────────────────────────────────
// 種別ごとのフィールド定義
// ─────────────────────────────────────────────
const LOCK_TYPE_OPTIONS = [
  { value: 'switchbot',  label: 'SwitchBot',           icon: '🔵' },
  { value: 'ttlock',     label: 'TT Lock',              icon: '🟣' },
  { value: 'sesame',     label: 'SESAME',               icon: '🟡' },
  { value: 'igloohome',  label: 'igloohome',            icon: '🟤' },
  { value: 'nuki',       label: 'Nuki',                 icon: '⚫' },
  { value: 'remotelock', label: 'RemoteLOCK',           icon: '🔴' },
  { value: 'salto',      label: 'Salto KS',             icon: '🔶' },
  { value: 'baycom',     label: 'Baycom',               icon: '🔷' },
  { value: 'fixed',      label: '固定パスワード',        icon: '🔢' },
  { value: 'offline',    label: 'オフライン（手渡し）',  icon: '📋' },
]

// 種別ごとに表示するフィールド
interface FieldDef { key: string; label: string; ph: string; secret?: boolean; hint?: string; type?: 'text' | 'select'; options?: string[] }

const LOCK_TYPE_FIELDS: Record<string, FieldDef[]> = {
  switchbot: [
    { key: 'token',        label: 'Open Token',   ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
      hint: 'SwitchBotアプリ → プロフィール → 設定 → APIキー' },
    { key: 'secret',       label: 'Secret Key',   ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
      hint: 'Open Token画面下に表示されるSecret Key（v1.1必須）' },
    { key: 'deviceId',     label: 'デバイスID',   ph: 'デバイスID（省略可）' },
    { key: 'unlockCodeType', label: '解錠コードタイプ', ph: '', type: 'select',
      options: ['一時コード', 'アクセスコード', 'その他'] },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  ttlock: [
    { key: 'clientId',     label: 'Client ID',     ph: 'your_client_id',     hint: 'TTLock開発者ポータル → Client ID' },
    { key: 'clientSecret', label: 'Client Secret', ph: 'your_client_secret', secret: true },
    { key: 'loginId',      label: 'ログインID（メール）', ph: 'your@email.com', hint: 'TTLockアプリのアカウントメール' },
    { key: 'loginPassword', label: 'ログインパスワード', ph: '••••••••', secret: true },
    { key: 'unlockCodeType', label: '解錠コードタイプ', ph: '', type: 'select',
      options: ['TT Lock 一時コード', 'アクセスコード', 'その他'] },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  sesame: [
    { key: 'apiKey',       label: 'API Key',      ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
      hint: 'my.sesame.team → API Keys → Generate API Key' },
    { key: 'unlockCodeType', label: '解錠コードタイプ', ph: '', type: 'select',
      options: ['認証番号', '解錠コード', 'その他'] },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  igloohome: [
    { key: 'clientId',     label: 'Client ID',     ph: 'igl-client-xxxxxxxx', hint: 'igloohome Bridge → Developer → API Settings' },
    { key: 'clientSecret', label: 'Client Secret', ph: 'igl-secret-xxxxxxxx', secret: true },
    { key: 'unlockCodeType', label: '解錠コードタイプ', ph: '', type: 'select',
      options: ['PINコード', 'アクセスコード', 'その他'] },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  nuki: [
    { key: 'apiToken',     label: 'API Token',    ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
      hint: 'Nuki Web → API → Manage API tokens → Generate API token' },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  remotelock: [
    { key: 'apiKey',       label: 'APIキー',      ph: 'rl-xxxxxxxxxxxxxxxx', secret: true,
      hint: 'RemoteLOCK管理画面 → 設定 → API連携' },
    { key: 'unlockCodeType', label: '解錠コードタイプ', ph: '', type: 'select',
      options: ['アクセスコード', 'PINコード', 'その他'] },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  salto: [
    { key: 'clientId',     label: 'Client ID',     ph: 'salto-client-xxxxxxxx', hint: 'Saltoパートナーポータルで取得' },
    { key: 'clientSecret', label: 'Client Secret', ph: 'salto-secret-xxxxxxxx', secret: true },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  baycom: [
    { key: 'loginId',      label: 'ログインID',             ph: 'コネクテッドポータルのログインID', hint: 'コネクテッドポータルのログインアカウントを設定してください。' },
    { key: 'loginPassword', label: 'ログインパスワード',    ph: '••••••••', secret: true },
    { key: 'unlockCodeType', label: '解錠コードタイプ', ph: '', type: 'select',
      options: ['固定鍵番号', '一時解除コード', 'その他'] },
    { key: 'unlockButton', label: '解錠ボタン',   ph: '', type: 'select',
      options: ['解錠', 'アンロック', 'UNLOCK', 'その他'] },
  ],
  fixed: [
    { key: 'deviceId',     label: '固定鍵の解除番号',  ph: '0862E',  hint: 'チェックイン時にゲストへ案内するコード番号' },
  ],
  offline: [],
}

const inputBase = 'w-full h-10 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors'
const inputStyle = { background: '#13141f', border: '1px solid #334155' }

// ─────────────────────────────────────────────
// 新規登録ダイアログ
// ─────────────────────────────────────────────
function LockRegisterDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (device: Omit<LockDevice, 'id' | 'inUse' | 'property' | 'room' | 'roomType'>) => void
}) {
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [lockType, setLockType] = useState('switchbot')
  const [name, setName] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [showFields, setShowFields] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!open) return null

  const curTypeOpt = LOCK_TYPE_OPTIONS.find(o => o.value === lockType)!
  const curFields  = LOCK_TYPE_FIELDS[lockType] || []

  const handleTypeChange = (v: string) => {
    setLockType(v)
    setFields({})
    setErrors({})
  }

  const setField = (k: string, v: string) => {
    setFields(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs['name'] = '識別名を入力してください'
    // API系は必須フィールドチェック
    curFields.filter(f => !f.type || f.type === 'text').forEach(f => {
      if (f.secret && !fields[f.key]) errs[f.key] = '必須項目です'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const deviceId = fields['deviceId'] || fields['apiKey'] || fields['token'] || fields['apiToken'] || fields['clientId'] || '（未設定）'
    onSave({
      name: name.trim(),
      type: curTypeOpt.label,
      deviceId,
      loginId: fields['loginId'],
      loginPassword: fields['loginPassword'],
      unlockCodeType: fields['unlockCodeType'],
      unlockButton: fields['unlockButton'],
    })
    // リセット
    setName('')
    setLockType('switchbot')
    setFields({})
    setErrors({})
    setStep('form')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-xl bg-[#0d0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Lock size={14} className="text-emerald-400" />
            <span className="text-slate-500 text-xs">ロック設定</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span>新規登録</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* フォーム */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* 識別名 */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              分かりやすい錠デバイスの識別名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); if (errors['name']) setErrors(p => { const n = {...p}; delete n['name']; return n }) }}
              placeholder="例：COCO CLASS - 103"
              className={inputBase}
              style={{ ...inputStyle, ...(errors['name'] ? { borderColor: '#ef4444' } : {}) }}
              onFocus={e => { if (!errors['name']) e.target.style.borderColor = '#10b981' }}
              onBlur={e => { if (!errors['name']) e.target.style.borderColor = '#334155' }}
            />
            {errors['name'] && <p className="text-[10px] text-red-400">{errors['name']}</p>}
          </div>

          {/* 種別セレクト */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              錠デバイスタイプ <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={lockType}
                onChange={e => handleTypeChange(e.target.value)}
                className={inputBase}
                style={{ ...inputStyle, paddingRight: '2rem', appearance: 'none' as any }}
              >
                {LOCK_TYPE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▾</div>
            </div>
          </div>

          {/* 動的フィールド */}
          {curFields.length > 0 ? (
            <div className="space-y-4 pt-1">
              <div className="h-px bg-white/5" />
              {curFields.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {f.label} {f.secret && <span className="text-red-400">*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <div className="relative">
                      <select
                        value={fields[f.key] || ''}
                        onChange={e => setField(f.key, e.target.value)}
                        className={inputBase}
                        style={{ ...inputStyle, paddingRight: '2rem', appearance: 'none' as any }}
                      >
                        <option value="">— 選択してください —</option>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▾</div>
                    </div>
                  ) : f.secret ? (
                    <div className="relative">
                      <input
                        type={showFields[f.key] ? 'text' : 'password'}
                        value={fields[f.key] || ''}
                        onChange={e => setField(f.key, e.target.value)}
                        placeholder={f.ph}
                        className={`${inputBase} pr-10 font-mono`}
                        style={{ ...inputStyle, color: '#10b981', ...(errors[f.key] ? { borderColor: '#ef4444' } : {}) }}
                        onFocus={e => { if (!errors[f.key]) e.target.style.borderColor = '#10b981' }}
                        onBlur={e => { if (!errors[f.key]) e.target.style.borderColor = '#334155' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowFields(v => ({ ...v, [f.key]: !v[f.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showFields[f.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={fields[f.key] || ''}
                      onChange={e => setField(f.key, e.target.value)}
                      placeholder={f.ph}
                      className={inputBase}
                      style={{ ...inputStyle, ...(errors[f.key] ? { borderColor: '#ef4444' } : {}) }}
                      onFocus={e => { if (!errors[f.key]) e.target.style.borderColor = '#10b981' }}
                      onBlur={e => { if (!errors[f.key]) e.target.style.borderColor = '#334155' }}
                    />
                  )}
                  {errors[f.key] && <p className="text-[10px] text-red-400">{errors[f.key]}</p>}
                  {f.hint && (
                    <p className="text-[10px] text-slate-600 leading-relaxed bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                      💡 {f.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : lockType === 'offline' ? (
            <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 text-[11px] text-slate-500 leading-relaxed">
              📋 オフライン（手渡し）モードはAPIキー不要です。チェックイン時に手動で鍵を渡す運用となります。
            </div>
          ) : null}

        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="h-9 px-5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 border border-white/10 hover:border-white/20 transition-all"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 h-9 px-6 rounded-lg text-xs font-semibold transition-all"
            style={{ background: '#10b981', color: '#fff' }}
          >
            <Save size={13} /> 登録する
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// ヘッダーアクション（DmsEngineに差し込む）
// ─────────────────────────────────────────────
export function LockListHeaderActions({
  searchQuery,
  setSearchQuery,
  onAdd,
  onDeleteUnused,
  onDeleteAll,
  deleting,
  unusedCount,
  totalCount,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  onAdd: () => void
  onDeleteUnused: () => void
  onDeleteAll: () => void
  deleting: boolean
  unusedCount: number
  totalCount: number
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="鍵名・物件・部屋で検索"
          className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-44 outline-none focus:border-emerald-500 text-slate-300 transition-all"
        />
      </div>
      <Button
        onClick={onDeleteUnused}
        disabled={deleting || unusedCount === 0}
        variant="ghost"
        className="h-8 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-xs px-3 font-semibold disabled:opacity-40"
      >
        {deleting
          ? <><RefreshCw size={12} className="mr-1 animate-spin" />削除中...</>
          : <><Trash2 size={12} className="mr-1" />未使用を削除{unusedCount > 0 ? ` (${unusedCount})` : ''}</>
        }
      </Button>
      <Button
        onClick={onDeleteAll}
        disabled={deleting || totalCount === 0}
        variant="ghost"
        className="h-8 border border-red-600/50 text-red-500 hover:bg-red-600/10 rounded-lg text-xs px-3 font-semibold disabled:opacity-40"
      >
        {deleting
          ? <><RefreshCw size={12} className="mr-1 animate-spin" />削除中...</>
          : <><Trash2 size={12} className="mr-1" />全件削除{totalCount > 0 ? ` (${totalCount})` : ''}</>
        }
      </Button>
      <Button
        onClick={onAdd}
        className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-4"
      >
        <Plus size={12} className="mr-1" /> 新規登録
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────
// メインコンテンツ（テーブル）
// ─────────────────────────────────────────────
const LockListContent = forwardRef<LockListRef, {
  searchQuery?: string
  onCountChange?: (total: number, unused: number) => void
}>(
  function LockListContent({ searchQuery = '', onCountChange }, ref) {
    const [locks, setLocks] = useState<LockDevice[]>([])
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmTarget, setConfirmTarget] = useState<LockDevice | null>(null)
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
    const [confirmDeleteUnused, setConfirmDeleteUnused] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)

    const usedCount   = locks.filter(l => l.inUse).length
    const unusedCount = locks.filter(l => !l.inUse).length

    React.useEffect(() => {
      onCountChange?.(locks.length, unusedCount)
    }, [locks.length, unusedCount, onCountChange])

    const filteredLocks = locks.filter(l =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.room.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useImperativeHandle(ref, () => ({
      triggerDeleteUnused: () => { if (unusedCount > 0) setConfirmDeleteUnused(true) },
      triggerDeleteAll:    () => { if (locks.length > 0) setConfirmDeleteAll(true) },
      getUnusedCount:      () => unusedCount,
      getTotalCount:       () => locks.length,
      openRegisterDialog:  () => setRegisterOpen(true),
    }), [locks.length, unusedCount])

    const handleRegisterSave = (device: Omit<LockDevice, 'id' | 'inUse' | 'property' | 'room' | 'roomType'>) => {
      const newLock: LockDevice = {
        ...device,
        id: `lock_${Date.now()}`,
        property: '',
        room: '',
        roomType: '',
        inUse: false,
      }
      setLocks(prev => [newLock, ...prev])
      setRegisterOpen(false)
    }

    return (
      <>
        {/* 新規登録ダイアログ */}
        <LockRegisterDialog
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onSave={handleRegisterSave}
        />

        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          {locks.length === 0 && !searchQuery ? (
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Lock size={24} className="text-emerald-400" />
              </div>
              <p className="text-slate-400 text-sm font-semibold">錠デバイスがまだ登録されていません</p>
              <p className="text-slate-600 text-xs">右上の「新規登録」からSESAME・SwitchBot等を追加してください</p>
              <button
                onClick={() => setRegisterOpen(true)}
                className="mt-2 flex items-center gap-2 h-9 px-5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: '#10b981', color: '#fff' }}
              >
                <Plus size={13} /> 最初の錠デバイスを登録
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">識別名 ↑</th>
                    <th className="px-5 py-3">鍵の種別</th>
                    <th className="px-5 py-3">使用中の物件・部屋</th>
                    <th className="px-5 py-3">使用中の物件・部屋タイプ</th>
                    <th className="px-5 py-3">デバイスID / 解除番号</th>
                    <th className="px-5 py-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLocks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-600 text-xs font-semibold">
                        該当する錠デバイスが見つかりません
                      </td>
                    </tr>
                  ) : (
                    filteredLocks.map(lock => (
                      <tr
                        key={lock.id}
                        className={`hover:bg-white/5 transition-all duration-300 ${
                          deletingId === lock.id ? 'opacity-0 scale-95' : 'opacity-100'
                        }`}
                      >
                        <td className="px-5 py-3 font-semibold text-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-emerald-500/10 rounded-md flex items-center justify-center">
                              <Lock size={10} className="text-emerald-400" />
                            </div>
                            {lock.name}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge className="bg-slate-800 text-slate-300 border border-white/10 font-semibold text-[9px] px-2 py-0.5 rounded-full">
                            {lock.type}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-slate-400 font-medium">
                          {lock.inUse
                            ? <><span className="text-slate-400">{lock.property}</span> <span className="text-white font-bold ml-1">{lock.room}</span></>
                            : <span className="text-slate-600">（未使用）</span>}
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-[9px] font-medium">
                          {lock.roomType || '—'}
                        </td>
                        <td className="px-5 py-3 font-mono text-slate-500 text-[10px]">
                          {lock.deviceId}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => setConfirmTarget(lock)}
                            disabled={deletingId === lock.id}
                            title={`${lock.name} を削除`}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-red-500/20 text-red-500/50 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all disabled:opacity-30"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-600 font-medium">
              全 {locks.length} 件 / 使用中 {usedCount} 件 / 未使用 {unusedCount} 件
            </p>
            {searchQuery && (
              <p className="text-[10px] text-slate-700">検索結果: {filteredLocks.length} 件</p>
            )}
          </div>
        </div>

        {/* 個別削除確認 */}
        <DeleteConfirmDialog
          open={confirmTarget !== null}
          title={confirmTarget ? `「${confirmTarget.name}」を削除しますか？` : ''}
          description={confirmTarget?.inUse ? 'この鍵は現在使用中の部屋に紐づいています。' : '未使用の鍵デバイスです。'}
          warning="この操作は元に戻せません。削除すると復元できません。"
          onConfirm={() => {
            if (!confirmTarget) return
            setDeletingId(confirmTarget.id)
            setTimeout(() => {
              setLocks(prev => prev.filter(l => l.id !== confirmTarget.id))
              setDeletingId(null)
              setConfirmTarget(null)
            }, 400)
          }}
          onCancel={() => setConfirmTarget(null)}
        />

        <DeleteConfirmDialog
          open={confirmDeleteUnused}
          title={`未使用の鍵 ${unusedCount} 件を全て削除しますか？`}
          description="現在使用中の部屋に紐づいていない鍵のみ削除されます。"
          warning="この操作は元に戻せません。"
          onConfirm={() => {
            setConfirmDeleteUnused(false)
            setLocks(prev => prev.filter(l => l.inUse))
          }}
          onCancel={() => setConfirmDeleteUnused(false)}
        />

        <DeleteConfirmDialog
          open={confirmDeleteAll}
          title={`全 ${locks.length} 件の鍵を削除しますか？`}
          description="使用中・未使用を問わず、登録されている全ての錠デバイスが削除されます。"
          warning="この操作は取り消せません。本当に全件削除してよい場合のみ実行してください。"
          onConfirm={() => {
            setConfirmDeleteAll(false)
            setLocks([])
          }}
          onCancel={() => setConfirmDeleteAll(false)}
        />
      </>
    )
  }
)

LockListContent.displayName = 'LockListContent'
export default LockListContent
