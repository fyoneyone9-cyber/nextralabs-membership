'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Users, Plus, Edit3, Trash2, RefreshCw, LogOut, Shield,
  Building, Mail, Phone, X, Save, Eye, EyeOff, CheckCircle2,
  AlertCircle, Loader2, Search, MoreVertical
} from 'lucide-react'

/* ══════════ 型定義 ══════════ */
interface Tenant {
  id: string
  company_name: string
  login_id: string
  contact_email: string | null
  contact_phone: string | null
  plan: string
  pms_type: string
  status: 'active' | 'inactive'
  created_at: string
  last_login_at: string | null
}

/* ══════════ プランバッジ ══════════ */
const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  trial:    { label: 'トライアル', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  standard: { label: 'スタンダード', color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
  premium:  { label: 'プレミアム',  color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
  enterprise:{ label: 'エンタープライズ', color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
}

/* ══════════ テナント編集モーダル ══════════ */
function TenantModal({
  tenant, onSave, onClose,
}: {
  tenant: Partial<Tenant> | null
  onSave: (data: Partial<Tenant> & { password?: string }) => Promise<void>
  onClose: () => void
}) {
  const isNew = !tenant?.id
  const [form, setForm] = useState({
    company_name: tenant?.company_name || '',
    login_id:     tenant?.login_id     || '',
    password:     '',
    contact_email: tenant?.contact_email || '',
    contact_phone: tenant?.contact_phone || '',
    plan:          tenant?.plan          || 'standard',
    pms_type:      tenant?.pms_type      || 'none',
    status:        tenant?.status        || 'active' as 'active' | 'inactive',
  })
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.company_name.trim() || !form.login_id.trim()) {
      setErr('会社名・ログインIDは必須です')
      return
    }
    if (isNew && !form.password.trim()) {
      setErr('新規作成時はパスワードが必須です')
      return
    }
    setSaving(true)
    setErr('')
    try {
      await onSave({ ...form, id: tenant?.id })
      onClose()
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full h-10 rounded-lg px-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors'
  const inputStyle = { background: '#13141f', border: '1px solid #334155' }
  const focusStyle = { borderColor: '#10b981' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6 space-y-5"
        style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Building size={15} style={{ color: '#10b981' }} />
            {isNew ? '新規テナント作成' : `${tenant?.company_name} を編集`}
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[10px] font-medium text-slate-500 block mb-1">会社名 *</label>
            <input value={form.company_name} onChange={e => set('company_name', e.target.value)}
              placeholder="例：ホテルマリーナ株式会社"
              className={inputCls} style={inputStyle}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => (e.target.style.borderColor = '#334155')} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">ログインID *</label>
            <input value={form.login_id} onChange={e => set('login_id', e.target.value)}
              placeholder="例：hotel-marina"
              disabled={!isNew}
              className={inputCls} style={{ ...inputStyle, opacity: isNew ? 1 : 0.5 }}
              onFocus={e => isNew && Object.assign(e.target.style, focusStyle)}
              onBlur={e => (e.target.style.borderColor = '#334155')} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">
              パスワード{!isNew && ' （空白=変更なし）'}
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder={isNew ? '必須' : '変更する場合のみ入力'}
                className={inputCls + ' pr-10'} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => (e.target.style.borderColor = '#334155')} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">メールアドレス</label>
            <input value={form.contact_email} onChange={e => set('contact_email', e.target.value)}
              type="email" placeholder="info@hotel.co.jp"
              className={inputCls} style={inputStyle}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => (e.target.style.borderColor = '#334155')} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">電話番号</label>
            <input value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)}
              placeholder="03-0000-0000"
              className={inputCls} style={inputStyle}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => (e.target.style.borderColor = '#334155')} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">プラン</label>
            <select value={form.plan} onChange={e => set('plan', e.target.value)}
              className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="trial">トライアル</option>
              <option value="standard">スタンダード</option>
              <option value="premium">プレミアム</option>
              <option value="enterprise">エンタープライズ</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">PMS</label>
            <select value={form.pms_type} onChange={e => set('pms_type', e.target.value)}
              className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="none">未接続（ローカル）</option>
              <option value="staysee">Staysee</option>
              <option value="airhost">エアホスト</option>
              <option value="cloudbeds">Cloudbeds</option>
              <option value="beds24">Beds24</option>
              <option value="easykeikaku">イージー会計</option>
              <option value="bets24">BETS24</option>
              <option value="neppan">ねっぱん！</option>
            </select>
          </div>
          {!isNew && (
            <div className="col-span-2">
              <label className="text-[10px] font-medium text-slate-500 block mb-1">ステータス</label>
              <div className="flex gap-2">
                {(['active', 'inactive'] as const).map(s => (
                  <button key={s} type="button"
                    onClick={() => set('status', s)}
                    className="flex-1 h-9 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: form.status === s
                        ? s === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'
                        : '#13141f',
                      border: `1px solid ${form.status === s ? (s === 'active' ? '#10b981' : '#ef4444') : '#334155'}`,
                      color: form.status === s ? (s === 'active' ? '#34d399' : '#f87171') : '#64748b',
                    }}>
                    {s === 'active' ? '✓ 有効' : '✗ 無効化'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {err && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            <AlertCircle size={12} /> {err}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-lg text-xs font-semibold"
            style={{ background: '#1e293b', color: '#94a3b8' }}>キャンセル</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
            style={{ background: '#10b981', color: '#fff', opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isNew ? '作成する' : '保存する'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════ DMS ADMIN メインエンジン ══════════ */
export default function DmsAdminEngine() {
  const [tenants, setTenants]       = useState<Tenant[]>([])
  const [loading, setLoading]       = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTenant, setEditingTenant] = useState<Partial<Tenant> | null | false>(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const showMsg = (ok: boolean, text: string) => {
    setMsg({ ok, text })
    setTimeout(() => setMsg(null), 4000)
  }

  /* ── テナント一覧取得 ── */
  const fetchTenants = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dms/tenants', {
        headers: { 'x-admin-key': 'nextra-admin-2026' }
      })
      const data = await res.json()
      if (data.tenants) setTenants(data.tenants)
      else showMsg(false, data.error || '取得に失敗しました')
    } catch {
      showMsg(false, 'サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTenants() }, [fetchTenants])

  /* ── テナント保存（新規・更新） ── */
  const handleSave = async (data: Partial<Tenant> & { password?: string }) => {
    const isNew = !data.id
    const res = await fetch('/api/dms/tenants', {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': 'nextra-admin-2026' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || '保存に失敗しました')
    showMsg(true, isNew ? `「${result.tenant.company_name}」を作成しました` : '更新しました')
    await fetchTenants()
  }

  /* ── テナント削除 ── */
  const handleDelete = async (tenant: Tenant) => {
    if (!confirm(`「${tenant.company_name}」を削除しますか？\nこの操作は元に戻せません。`)) return
    const res = await fetch(`/api/dms/tenants?id=${tenant.id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': 'nextra-admin-2026' }
    })
    if (res.ok) {
      showMsg(true, `「${tenant.company_name}」を削除しました`)
      await fetchTenants()
    } else {
      showMsg(false, '削除に失敗しました')
    }
  }

  /* ── ステータス切替 ── */
  const toggleStatus = async (tenant: Tenant) => {
    const newStatus = tenant.status === 'active' ? 'inactive' : 'active'
    await handleSave({ id: tenant.id, status: newStatus })
  }

  /* ── ログアウト ── */
  const handleLogout = () => {
    localStorage.removeItem('dms_session')
    window.location.href = '/dms/login'
  }

  /* ── フィルタリング ── */
  const filtered = tenants.filter(t => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      t.company_name.toLowerCase().includes(q) ||
      t.login_id.toLowerCase().includes(q) ||
      (t.contact_email || '').toLowerCase().includes(q)
    )
  })

  const activeCount   = tenants.filter(t => t.status === 'active').length
  const inactiveCount = tenants.filter(t => t.status === 'inactive').length

  return (
    <div className="min-h-screen pb-16" style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>

      {/* トップバー */}
      <div className="sticky top-0 z-40 border-b" style={{ background: '#0d0f1a', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={16} style={{ color: '#10b981' }} />
            <span className="text-sm font-semibold text-slate-100">Nextra DMS — 管理者コンソール</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
              SUPER ADMIN
            </span>
          </div>
          <div className="flex items-center gap-3">
            {msg && (
              <span className={`text-[11px] flex items-center gap-1 ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {msg.ok ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />} {msg.text}
              </span>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold"
              style={{ background: '#1e293b', color: '#94a3b8' }}>
              <LogOut size={11} /> ログアウト
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

        {/* サマリーカード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '総テナント数', value: tenants.length, color: '#64748b' },
            { label: '有効',         value: activeCount,    color: '#10b981' },
            { label: '無効化',       value: inactiveCount,  color: '#ef4444' },
            { label: 'エンタープライズ', value: tenants.filter(t => t.plan === 'enterprise').length, color: '#818cf8' },
          ].map(card => (
            <div key={card.label} className="rounded-xl p-4 space-y-1"
              style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] text-slate-600 font-medium">{card.label}</p>
              <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* テナント一覧 */}
        <div className="space-y-3">
          {/* テーブルヘッダー */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="会社名・ID・メールで検索..."
                className="pl-8 pr-4 py-1.5 text-xs rounded-lg w-56 outline-none transition-all text-slate-300"
                style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchTenants} disabled={loading}
                className="h-8 px-3 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all"
                style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}>
                <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> 更新
              </button>
              <button onClick={() => setEditingTenant({})}
                className="h-8 px-4 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5"
                style={{ background: '#10b981' }}>
                <Plus size={11} /> 新規テナント
              </button>
            </div>
          </div>

          {/* テーブル */}
          <div className="rounded-2xl overflow-hidden shadow-xl" style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <tr className="text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">会社名</th>
                    <th className="px-4 py-3">ログインID</th>
                    <th className="px-4 py-3">連絡先</th>
                    <th className="px-4 py-3">プラン</th>
                    <th className="px-4 py-3">PMS</th>
                    <th className="px-4 py-3">最終ログイン</th>
                    <th className="px-4 py-3 text-center">状態</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <Loader2 size={20} className="animate-spin text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-600 font-semibold">
                        {searchQuery ? '検索条件に一致するテナントがありません' : 'テナントがありません。「新規テナント」から追加してください。'}
                      </td>
                    </tr>
                  ) : filtered.map(t => {
                    const planStyle = PLAN_LABELS[t.plan] || { label: t.plan, color: '#64748b', bg: 'rgba(100,116,139,0.12)' }
                    return (
                      <tr key={t.id}
                        className="transition-colors"
                        style={{ opacity: t.status === 'inactive' ? 0.5 : 1 }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                              {t.company_name[0]}
                            </div>
                            <span className="font-semibold text-slate-200">{t.company_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono">{t.login_id}</td>
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            {t.contact_email && (
                              <div className="flex items-center gap-1 text-slate-500">
                                <Mail size={9} /> {t.contact_email}
                              </div>
                            )}
                            {t.contact_phone && (
                              <div className="flex items-center gap-1 text-slate-500">
                                <Phone size={9} /> {t.contact_phone}
                              </div>
                            )}
                            {!t.contact_email && !t.contact_phone && (
                              <span className="text-slate-700">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: planStyle.bg, color: planStyle.color }}>
                            {planStyle.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {t.pms_type === 'none' ? <span className="text-slate-700">ローカル</span> : t.pms_type}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-[10px]">
                          {t.last_login_at
                            ? new Date(t.last_login_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : '未ログイン'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleStatus(t)}
                            className="text-[9px] px-2.5 py-1 rounded-full font-semibold transition-all"
                            style={{
                              background: t.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                              color: t.status === 'active' ? '#34d399' : '#f87171',
                              border: `1px solid ${t.status === 'active' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                            }}>
                            {t.status === 'active' ? '有効' : '無効'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                              style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>
                              <MoreVertical size={13} />
                            </button>
                            {openMenu === t.id && (
                              <div className="absolute right-0 top-8 z-50 w-36 rounded-xl shadow-xl overflow-hidden"
                                style={{ background: '#13141f', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <button onClick={() => { setEditingTenant(t); setOpenMenu(null) }}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5 transition-colors">
                                  <Edit3 size={11} style={{ color: '#10b981' }} /> 編集
                                </button>
                                <button onClick={() => { handleDelete(t); setOpenMenu(null) }}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                                  <Trash2 size={11} /> 削除
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>

      {/* メニューを閉じるオーバーレイ */}
      {openMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
      )}

      {/* 編集モーダル */}
      {editingTenant !== false && (
        <TenantModal
          tenant={editingTenant}
          onSave={handleSave}
          onClose={() => setEditingTenant(false)}
        />
      )}
    </div>
  )
}
