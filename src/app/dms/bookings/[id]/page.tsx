'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Trash2, Save, ChevronRight, Loader2,
  CheckCircle2, AlertCircle, User, Phone, Mail, Calendar,
  Hash, Users, DollarSign, QrCode, Key, Building, Clock,
  Send, LogIn, LogOut, RefreshCw
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

/* ─── 型 ─── */
interface Booking {
  id: string
  pms_reservation_id?: string
  ota_reservation_id?: string
  booking_number?: string
  name_kanji?: string
  name_kana?: string
  property_id?: string
  property_name?: string
  room_id?: string
  room_type?: string
  start_date?: string
  end_date?: string
  check_in_time?: string
  check_out_time?: string
  actual_check_in_at?: string
  actual_check_out_at?: string
  billing_amount?: number
  tel?: string
  email?: string
  person_number?: number
  status?: string
  paid?: boolean
  source?: 'staysee' | 'manual' | 'pms'
  pms_type?: string
  allocate_rooms?: { room_id: string }[]
  booked_at?: string
}

const labelClass = "text-[10px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5"
const valueClass = "text-sm text-slate-200 font-medium"
const inputClass = "w-full bg-[#0d0f1a] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700"
const cardClass  = "bg-[#0d0f1a] border border-white/6 rounded-2xl p-5"

export default function BookingDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [booking, setBooking]     = useState<Booking | null>(null)
  const [loading, setLoading]     = useState(true)
  const [saving,  setSaving]      = useState(false)
  const [msg, setMsg]             = useState<{ ok: boolean; text: string } | null>(null)
  const [ciLoading, setCiLoading] = useState(false)
  const [coLoading, setCoLoading] = useState(false)
  const [editMode, setEditMode]   = useState(false)
  const [form, setForm]           = useState<Partial<Booking>>({})

  const showMsg = (ok: boolean, text: string) => {
    setMsg({ ok, text })
    setTimeout(() => setMsg(null), 4000)
  }

  /* ── 予約取得: Staysee → DMS Supabase の順で探す ── */
  const fetchBooking = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Staysee から取得（今日前後7日）
      const res = await fetch(`/api/staysee/search?q=${encodeURIComponent(id)}`)
      const data = await res.json()
      const found: any = data.reservations?.find(
        (r: any) => String(r.id) === String(id) ||
                    String(r.pms_reservation_id) === String(id)
      )
      if (found) {
        const b: Booking = {
          id:                   String(found.id),
          pms_reservation_id:   found.pms_reservation_id || found.reservation_id || String(found.id),
          ota_reservation_id:   found.ota_reservation_id || found.booking_number,
          booking_number:       found.booking_number,
          name_kanji:           found.name_kanji || found.name,
          name_kana:            found.name_kana,
          property_id:          found.property_id,
          property_name:        found.property_name || found.unit_name,
          room_id:              found.allocate_rooms?.[0]?.room_id || found.room_id,
          room_type:            found.room_type,
          start_date:           found.start_date,
          end_date:             found.end_date,
          check_in_time:        found.check_in_time  || '15:00',
          check_out_time:       found.check_out_time || '10:00',
          actual_check_in_at:   found.actual_check_in_at,
          actual_check_out_at:  found.actual_check_out_at,
          billing_amount:       found.billing_amount,
          tel:                  found.tel || found.phone,
          email:                found.email,
          person_number:        found.person_number || found.guests,
          status:               found.status,
          paid:                 found.paid,
          source:               'staysee',
          pms_type:             'staysee',
          booked_at:            found.booked_at || found.created_at,
        }
        setBooking(b)
        setForm(b)
        return
      }

      // 2. DMS手動予約 (localStorage フォールバック)
      const manual = JSON.parse(localStorage.getItem('dms_manual_bookings') || '[]')
      const mFound = manual.find((b: any) =>
        String(b.pms_reservation_id) === String(id) || String(b.id) === String(id)
      )
      if (mFound) {
        const b: Booking = { ...mFound, source: 'manual' }
        setBooking(b)
        setForm(b)
        return
      }

      showMsg(false, '予約が見つかりませんでした')
    } catch (e: any) {
      showMsg(false, e.message || '取得エラー')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchBooking() }, [fetchBooking])

  /* ── 保存 ── */
  const handleSave = async () => {
    setSaving(true)
    try {
      // Staysee連携予約は更新通知、手動はlocalStorage
      if (booking?.source === 'manual') {
        const existing = JSON.parse(localStorage.getItem('dms_manual_bookings') || '[]')
        const updated = existing.map((b: any) =>
          b.pms_reservation_id === booking.pms_reservation_id ? { ...b, ...form } : b
        )
        localStorage.setItem('dms_manual_bookings', JSON.stringify(updated))
      }
      setBooking(prev => prev ? { ...prev, ...form } : prev)
      setEditMode(false)
      showMsg(true, '保存しました')
    } catch (e: any) {
      showMsg(false, e.message || '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  /* ── チェックイン実行 ── */
  const handleCheckin = async () => {
    if (!booking) return
    setCiLoading(true)
    try {
      const res = await fetch('/api/staysee/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: booking.id, action: 'checkin' }),
      })
      const data = await res.json()
      if (!res.ok && !data.fallback) throw new Error(data.error || 'チェックイン失敗')
      const now = new Date().toISOString()
      setBooking(prev => prev ? { ...prev, actual_check_in_at: now, paid: true } : prev)
      showMsg(true, 'チェックイン完了')
    } catch (e: any) {
      showMsg(false, e.message)
    } finally {
      setCiLoading(false)
    }
  }

  /* ── チェックアウト実行 ── */
  const handleCheckout = async () => {
    if (!booking) return
    setCoLoading(true)
    try {
      const res = await fetch('/api/staysee/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: booking.id, action: 'checkout' }),
      })
      const data = await res.json()
      if (!res.ok && !data.fallback) throw new Error(data.error || 'チェックアウト失敗')
      const now = new Date().toISOString()
      setBooking(prev => prev ? { ...prev, actual_check_out_at: now } : prev)
      showMsg(true, 'チェックアウト完了')
    } catch (e: any) {
      showMsg(false, e.message)
    } finally {
      setCoLoading(false)
    }
  }

  /* ── ローディング ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050507' }}>
      <Loader2 size={32} className="animate-spin text-emerald-500" />
    </div>
  )

  if (!booking) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#050507' }}>
      <AlertCircle size={40} className="text-red-400" />
      <p className="text-slate-400 text-sm">予約が見つかりませんでした</p>
      <button onClick={() => router.back()} className="text-emerald-400 text-sm hover:underline">← 戻る</button>
    </div>
  )

  const b = booking
  const isCheckedIn  = !!b.actual_check_in_at  || b.paid
  const isCheckedOut = !!b.actual_check_out_at

  const sf = (k: keyof Booking) => (v: any) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="min-h-screen pb-24" style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>

      {/* ヘッダー */}
      <div className="sticky top-0 z-40 border-b" style={{ background: '#0a0b14', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dms')}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors text-slate-500 hover:text-slate-200">
              <ArrowLeft size={16} />
            </button>
            <span className="text-[11px] text-slate-600 flex items-center gap-1.5">
              チェックイン一覧 <ChevronRight size={11} />
              <span className="text-slate-200 font-semibold">{b.name_kanji || '(未入力)'}</span>
            </span>
            {b.source === 'manual' && (
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                手動作成
              </span>
            )}
            {b.pms_type && b.pms_type !== 'manual' && (
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                {b.pms_type.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {msg && (
              <span className={`text-[11px] flex items-center gap-1 ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {msg.ok ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />} {msg.text}
              </span>
            )}
            <button onClick={fetchBooking}
              className="h-8 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all"
              style={{ background: '#13141f', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}>
              <RefreshCw size={11} /> 更新
            </button>
            {editMode ? (
              <>
                <button onClick={() => { setEditMode(false); setForm(b) }}
                  className="h-8 px-3 rounded-lg text-[11px] font-semibold"
                  style={{ background: '#13141f', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}>
                  キャンセル
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="h-8 px-4 rounded-lg text-[11px] font-semibold flex items-center gap-1.5"
                  style={{ background: '#10b981', color: '#fff', opacity: saving ? 0.7 : 1 }}>
                  {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                  保存する
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)}
                className="h-8 px-4 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
                編集
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">

        {/* ── 予約番号バー ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: '予約者',         value: b.name_kanji || '(未入力)' },
            { label: 'ふりがな',       value: b.name_kana  || '---' },
            { label: 'PMS予約番号',    value: b.pms_reservation_id || '---', mono: true },
            { label: 'OTA予約番号',    value: b.ota_reservation_id || b.booking_number || '---', mono: true },
            { label: '予約日時',       value: b.booked_at ? new Date(b.booked_at).toLocaleString('ja-JP') : '---' },
          ].map(item => (
            <div key={item.label} className={cardClass}>
              <p className={labelClass}>{item.label}</p>
              <p className={`${valueClass} ${item.mono ? 'font-mono' : ''} truncate`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* ── メイングリッド ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* 左: 基本情報 + 連絡先 */}
          <div className="space-y-4">
            <div className={cardClass + ' space-y-4'}>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">基本情報</p>

              {/* 予約者名 */}
              <div>
                <label className={labelClass}><User size={9} className="inline mr-1" />予約者名</label>
                {editMode
                  ? <input className={inputClass} value={form.name_kanji || ''} onChange={e => sf('name_kanji')(e.target.value)} placeholder="山田 太郎" />
                  : <p className={valueClass}>{b.name_kanji || '(未入力)'}</p>}
              </div>

              {/* 物件 */}
              <div>
                <label className={labelClass}><Building size={9} className="inline mr-1" />物件・部屋</label>
                <p className={valueClass}>{b.property_name || '(未設定)'} {b.room_id ? `— ${b.room_id}号室` : ''}</p>
              </div>

              {/* 宿泊人数 */}
              <div>
                <label className={labelClass}><Users size={9} className="inline mr-1" />宿泊人数</label>
                {editMode
                  ? <input type="number" min={1} className={inputClass} value={form.person_number || 1} onChange={e => sf('person_number')(Number(e.target.value))} />
                  : <p className={valueClass}>{b.person_number || '---'}名</p>}
              </div>

              {/* 宿泊金額 */}
              <div>
                <label className={labelClass}><DollarSign size={9} className="inline mr-1" />宿泊金額（税込）</label>
                {editMode
                  ? (
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 text-sm font-bold">¥</span>
                      <input type="number" className={inputClass + ' pl-8'} value={form.billing_amount || 0} onChange={e => sf('billing_amount')(Number(e.target.value))} />
                    </div>
                  )
                  : <p className={valueClass}>{b.billing_amount != null ? `¥${b.billing_amount.toLocaleString()}` : '---'}</p>
                }
              </div>
            </div>

            {/* 連絡先 */}
            <div className={cardClass + ' space-y-4'}>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">連絡先</p>
              <div>
                <label className={labelClass}><Phone size={9} className="inline mr-1" />電話番号</label>
                {editMode
                  ? <input className={inputClass} value={form.tel || ''} onChange={e => sf('tel')(e.target.value)} placeholder="09012345678" />
                  : <p className={valueClass}>{b.tel || '(未入力)'}</p>}
              </div>
              <div>
                <label className={labelClass}><Mail size={9} className="inline mr-1" />メールアドレス</label>
                {editMode
                  ? <input type="email" className={inputClass} value={form.email || ''} onChange={e => sf('email')(e.target.value)} placeholder="guest@example.com" />
                  : <p className={valueClass}>{b.email || '(未入力)'}</p>}
              </div>
            </div>
          </div>

          {/* 中: チェックイン/アウト */}
          <div className="space-y-4">
            {/* チェックイン */}
            <div className={`${cardClass} space-y-3 border ${isCheckedIn ? 'border-emerald-500/20' : 'border-white/6'}`}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <LogIn size={11} className={isCheckedIn ? 'text-emerald-400' : 'text-slate-600'} /> チェックイン
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isCheckedIn
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                  {isCheckedIn ? '✓ 済' : '未'}
                </span>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={labelClass}>予定日</label>
                  {editMode
                    ? <input type="date" className={inputClass} value={form.start_date || ''} onChange={e => sf('start_date')(e.target.value)} style={{ colorScheme: 'dark' }} />
                    : <p className={valueClass}>{b.start_date || '---'}</p>}
                </div>
                <div className="w-24">
                  <label className={labelClass}>時刻</label>
                  {editMode
                    ? <input type="time" className={inputClass} value={form.check_in_time || ''} onChange={e => sf('check_in_time')(e.target.value)} style={{ colorScheme: 'dark' }} />
                    : <p className={valueClass}>{b.check_in_time || '---'}</p>}
                </div>
              </div>

              {b.actual_check_in_at && (
                <div>
                  <label className={labelClass}>実績日時</label>
                  <p className="text-[11px] text-emerald-400 font-mono">{new Date(b.actual_check_in_at).toLocaleString('ja-JP')}</p>
                </div>
              )}

              <button onClick={handleCheckin} disabled={ciLoading || isCheckedIn}
                className="w-full h-10 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: isCheckedIn ? 'rgba(16,185,129,0.08)' : '#10b981',
                  color: isCheckedIn ? '#34d399' : '#fff',
                  opacity: ciLoading ? 0.7 : 1,
                  cursor: isCheckedIn ? 'default' : 'pointer',
                }}>
                {ciLoading ? <Loader2 size={12} className="animate-spin" /> : <LogIn size={12} />}
                {isCheckedIn ? 'チェックイン済み' : 'DMSでチェックインを実行'}
              </button>
            </div>

            {/* チェックアウト */}
            <div className={`${cardClass} space-y-3 border ${isCheckedOut ? 'border-emerald-500/20' : 'border-white/6'}`}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <LogOut size={11} className={isCheckedOut ? 'text-emerald-400' : 'text-slate-600'} /> チェックアウト
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isCheckedOut
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                  {isCheckedOut ? '✓ 済' : '未'}
                </span>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={labelClass}>予定日</label>
                  {editMode
                    ? <input type="date" className={inputClass} value={form.end_date || ''} onChange={e => sf('end_date')(e.target.value)} style={{ colorScheme: 'dark' }} />
                    : <p className={valueClass}>{b.end_date || '---'}</p>}
                </div>
                <div className="w-24">
                  <label className={labelClass}>時刻</label>
                  {editMode
                    ? <input type="time" className={inputClass} value={form.check_out_time || ''} onChange={e => sf('check_out_time')(e.target.value)} style={{ colorScheme: 'dark' }} />
                    : <p className={valueClass}>{b.check_out_time || '---'}</p>}
                </div>
              </div>

              {b.actual_check_out_at && (
                <div>
                  <label className={labelClass}>実績日時</label>
                  <p className="text-[11px] text-emerald-400 font-mono">{new Date(b.actual_check_out_at).toLocaleString('ja-JP')}</p>
                </div>
              )}

              <button onClick={handleCheckout} disabled={coLoading || isCheckedOut || !isCheckedIn}
                className="w-full h-10 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: isCheckedOut ? 'rgba(16,185,129,0.08)' : (!isCheckedIn ? '#13141f' : '#10b981'),
                  color: isCheckedOut ? '#34d399' : (!isCheckedIn ? '#475569' : '#fff'),
                  opacity: coLoading ? 0.7 : 1,
                  cursor: (isCheckedOut || !isCheckedIn) ? 'default' : 'pointer',
                }}>
                {coLoading ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                {isCheckedOut ? 'チェックアウト済み' : !isCheckedIn ? 'チェックイン後に実行可能' : 'DMSでチェックアウトを実行'}
              </button>
            </div>

            {/* メール送信 */}
            <div className={cardClass}>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">アクション</p>
              <button
                className="w-full h-10 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
                <Send size={12} /> 事前チェックインメールを送信
              </button>
            </div>
          </div>

          {/* 右: QRコード + PIN */}
          <div className="space-y-4">
            {/* QRコード */}
            <div className={cardClass + ' space-y-3'}>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode size={11} /> KIOSKチェックイン用QR
              </p>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-white shrink-0">
                  <QRCodeSVG
                    value={b.pms_reservation_id || b.id}
                    size={96}
                    bgColor="#ffffff"
                    fgColor="#050507"
                    level="M"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <p className={labelClass}>DMS管理番号</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono tracking-[0.1em] truncate">
                    {b.pms_reservation_id || b.id}
                  </p>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    このQRをゲストに提示<br />KIOSKでスキャン→自動チェックイン
                  </p>
                </div>
              </div>
            </div>

            {/* PIN情報 */}
            <div className={cardClass + ' space-y-2'}>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Key size={11} /> PIN情報
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                PIN情報の自動同期（DMS発行→スマートロック送信）は、チェックイン日の2日前より毎時10分ごろに行われます。
              </p>
              {b.room_id && (
                <div className="mt-2 bg-[#080910] rounded-xl px-4 py-3 border border-white/5">
                  <p className={labelClass}>部屋番号</p>
                  <p className="text-base font-bold text-white font-mono">{b.room_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
