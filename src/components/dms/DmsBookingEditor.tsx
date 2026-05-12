'use client'
import React, { useState, useEffect } from 'react'
import { X, Save, User, QrCode, CheckCircle2, AlertCircle, Loader2, ChevronRight, Calendar, Phone, Mail, Hash, Home, Users, DollarSign } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface DmsBookingEditorProps {
  booking?: any
  isDarkMode?: boolean
  onClose: () => void
  onSaved?: () => void
}

function generateDmsId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

async function fetchProperties(): Promise<{ id: string; name: string }[]> {
  try {
    const res = await fetch('/api/dms/properties')
    const data = await res.json()
    if (data.properties) return data.properties.map((p: any) => ({ id: p.id, name: p.name }))
  } catch {}
  // フォールバック: localStorage
  try {
    const raw = localStorage.getItem('dms_properties')
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export default function DmsBookingEditor({ booking, onClose, onSaved }: DmsBookingEditorProps) {
  const isNew = !booking?.id && !booking?.pms_reservation_id
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const [formData, setFormData] = useState(() => ({
    pms_reservation_id: booking?.pms_reservation_id || generateDmsId(),
    property_id:    booking?.property_id    || '',
    property_name:  booking?.property_name  || '',
    name_kanji:     booking?.name_kanji     || '',
    start_date:     booking?.start_date     || new Date().toISOString().split('T')[0],
    end_date:       booking?.end_date       || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    check_in_time:  booking?.check_in_time  || '15:00',
    check_out_time: booking?.check_out_time || '10:00',
    billing_amount: booking?.billing_amount || 0,
    tel:            booking?.tel            || '',
    email:          booking?.email          || '',
    person_number:  booking?.person_number  || 1,
    allocate_rooms: booking?.allocate_rooms || [{ room_id: '' }],
  }))

  useEffect(() => {
    fetchProperties().then(props => {
      setProperties(props)
      if (props.length === 1 && !formData.property_id) {
        setFormData(prev => ({ ...prev, property_id: props[0].id, property_name: props[0].name }))
      }
    })
  }, [])

  const set = (k: string, v: any) => setFormData(prev => ({ ...prev, [k]: v }))

  const handlePropertyChange = (id: string) => {
    const found = properties.find(p => p.id === id)
    setFormData(prev => ({ ...prev, property_id: id, property_name: found?.name || '' }))
  }

  const handleSave = async () => {
    if (!formData.name_kanji.trim()) {
      setSaveMsg({ ok: false, text: '予約者名は必須です' })
      return
    }
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch('/api/dms/bookings', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? formData : { ...formData, id: booking?.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '保存に失敗しました')
      setSaveMsg({ ok: true, text: isNew ? '予約を登録しました' : '予約情報を更新しました' })
      setTimeout(() => { onSaved?.(); onClose() }, 900)
    } catch (e: any) {
      // APIがなければlocalStorageにフォールバック
      try {
        const existing = JSON.parse(localStorage.getItem('dms_manual_bookings') || '[]')
        const updated = booking?.pms_reservation_id
          ? existing.map((b: any) => b.pms_reservation_id === booking.pms_reservation_id ? formData : b)
          : [...existing, formData]
        localStorage.setItem('dms_manual_bookings', JSON.stringify(updated))
        setSaveMsg({ ok: true, text: isNew ? '予約を登録しました（ローカル保存）' : '更新しました（ローカル保存）' })
        setTimeout(() => { onSaved?.(); onClose() }, 900)
      } catch {
        setSaveMsg({ ok: false, text: e.message || '保存に失敗しました' })
      }
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-[#0d0f1a] border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700"
  const labelClass = "text-[10px] font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider"

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-[#050508] border border-white/10 rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden my-8 animate-in slide-in-from-bottom-6 duration-400">

        {/* ヘッダー */}
        <div className="sticky top-0 z-30 bg-[#050508]/90 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <User size={17} className="text-emerald-500" />
            </div>
            <h2 className="text-[11px] font-bold text-gray-500 flex items-center gap-2">
              RESERVATION <ChevronRight size={13} className="text-gray-700" />
              <span className="text-white text-base tracking-tighter">
                {isNew ? '新規予約を作成' : (booking?.name_kanji || '予約を編集')}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className={`text-[11px] flex items-center gap-1 ${saveMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {saveMsg.ok ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                {saveMsg.text}
              </span>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors text-slate-500 hover:text-slate-300">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">

          {/* DMS管理番号 + QR */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl px-6 py-4 flex items-center justify-between gap-6">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">DMS管理番号</span>
              <span className="text-2xl font-bold text-emerald-400 tracking-[0.15em] font-mono">{formData.pms_reservation_id}</span>
              <p className="text-[11px] text-slate-600">このQRコードをゲストに提示 → KIOSKでスキャン</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white shrink-0">
              <QRCodeSVG
                value={formData.pms_reservation_id}
                size={88}
                bgColor="#ffffff"
                fgColor="#050507"
                level="M"
              />
            </div>
          </div>

          {/* フォーム 2カラム */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

            {/* 物件 */}
            <div className="md:col-span-2">
              <label className={labelClass}><Home size={10} className="inline mr-1" />物件名</label>
              <select
                className={inputClass}
                value={formData.property_id}
                onChange={e => handlePropertyChange(e.target.value)}
                style={{ appearance: 'none', colorScheme: 'dark' }}
              >
                <option value="" disabled style={{ background: '#0d0f1a' }}>物件を選択...</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id} style={{ background: '#0d0f1a' }}>{p.name}</option>
                ))}
                {properties.length === 0 && (
                  <option disabled style={{ background: '#0d0f1a' }}>物件が登録されていません</option>
                )}
              </select>
            </div>

            {/* 予約者名 */}
            <div className="md:col-span-2">
              <label className={labelClass}><User size={10} className="inline mr-1" />予約者名（漢字）</label>
              <input
                className={inputClass}
                value={formData.name_kanji}
                onChange={e => set('name_kanji', e.target.value)}
                placeholder="例: 山田 太郎"
              />
            </div>

            {/* チェックイン */}
            <div>
              <label className={labelClass}><Calendar size={10} className="inline mr-1" />チェックイン</label>
              <div className="flex gap-2">
                <input type="date" className={inputClass} value={formData.start_date}
                  onChange={e => set('start_date', e.target.value)}
                  style={{ colorScheme: 'dark' }} />
                <input type="time" className={`${inputClass} w-28 shrink-0`} value={formData.check_in_time}
                  onChange={e => set('check_in_time', e.target.value)}
                  style={{ colorScheme: 'dark' }} />
              </div>
            </div>

            {/* チェックアウト */}
            <div>
              <label className={labelClass}><Calendar size={10} className="inline mr-1" />チェックアウト</label>
              <div className="flex gap-2">
                <input type="date" className={inputClass} value={formData.end_date}
                  onChange={e => set('end_date', e.target.value)}
                  style={{ colorScheme: 'dark' }} />
                <input type="time" className={`${inputClass} w-28 shrink-0`} value={formData.check_out_time}
                  onChange={e => set('check_out_time', e.target.value)}
                  style={{ colorScheme: 'dark' }} />
              </div>
            </div>

            {/* 部屋番号 */}
            <div>
              <label className={labelClass}><Hash size={10} className="inline mr-1" />部屋番号</label>
              <input
                className={inputClass}
                value={formData.allocate_rooms?.[0]?.room_id || ''}
                onChange={e => set('allocate_rooms', [{ room_id: e.target.value }])}
                placeholder="例: 302"
              />
            </div>

            {/* 宿泊人数 */}
            <div>
              <label className={labelClass}><Users size={10} className="inline mr-1" />宿泊人数</label>
              <input
                type="number" min={1}
                className={inputClass}
                value={formData.person_number}
                onChange={e => set('person_number', Number(e.target.value))}
              />
            </div>

            {/* 電話番号 */}
            <div>
              <label className={labelClass}><Phone size={10} className="inline mr-1" />電話番号</label>
              <input
                className={inputClass}
                value={formData.tel}
                onChange={e => set('tel', e.target.value)}
                placeholder="09012345678"
              />
            </div>

            {/* メール */}
            <div>
              <label className={labelClass}><Mail size={10} className="inline mr-1" />メールアドレス</label>
              <input
                type="email"
                className={inputClass}
                value={formData.email}
                onChange={e => set('email', e.target.value)}
                placeholder="guest@example.com"
              />
            </div>

            {/* 宿泊金額 */}
            <div className="md:col-span-2">
              <label className={labelClass}><DollarSign size={10} className="inline mr-1" />宿泊金額（税込）</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-sm">¥</span>
                <input
                  type="number"
                  className={`${inputClass} pl-9`}
                  value={formData.billing_amount}
                  onChange={e => set('billing_amount', Number(e.target.value))}
                />
              </div>
            </div>

          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-white/5 px-8 py-5 flex items-center justify-end gap-3">
          <button onClick={onClose}
            className="h-10 px-6 rounded-xl text-xs font-semibold transition-all text-slate-400 hover:text-slate-200"
            style={{ background: '#13141f', border: '1px solid rgba(255,255,255,0.07)' }}>
            キャンセル
          </button>
          <button onClick={handleSave} disabled={saving}
            className="h-10 px-8 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            style={{ background: '#10b981', color: '#fff', opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isNew ? '予約を登録する' : '変更を保存する'}
          </button>
        </div>

      </div>
    </div>
  )
}
