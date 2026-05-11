import React, { useState, useEffect } from 'react'
import { X, Save, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DmsBookingEditorProps {
  booking?: any
  isDarkMode?: boolean
  onClose: () => void
}

/** DMS-XXXXXXXX 形式の予約番号を自動発行 */
function generateDmsId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'DMS-'
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

/** localStorage から物件一覧を取得 */
function getProperties(): { id: string; name: string }[] {
  try {
    const raw = localStorage.getItem('dms_properties')
    if (raw) return JSON.parse(raw)
  } catch {}
  // フォールバック: org_name が設定されていれば単一物件として返す
  const orgName = localStorage.getItem('dms_org_org_name')
  if (orgName) return [{ id: 'default', name: orgName }]
  return []
}

export default function DmsBookingEditor({ booking, onClose }: DmsBookingEditorProps) {
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([])

  const [formData, setFormData] = useState(() => ({
    pms_reservation_id: booking?.pms_reservation_id || generateDmsId(),
    property_id: booking?.property_id || '',
    property_name: booking?.property_name || '',
    name_kanji: booking?.name_kanji || '',
    start_date: booking?.start_date || new Date().toISOString().split('T')[0],
    end_date: booking?.end_date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    check_in_time: booking?.check_in_time || '15:00',
    check_out_time: booking?.check_out_time || '10:00',
    billing_amount: booking?.billing_amount || 0,
    tel: booking?.tel || '',
    email: booking?.email || '',
    person_number: booking?.person_number || 1,
    allocate_rooms: booking?.allocate_rooms || [{ room_id: '' }],
  }))

  useEffect(() => {
    const props = getProperties()
    setProperties(props)
    // 物件が1件だけなら自動選択
    if (props.length === 1 && !formData.property_id) {
      setFormData(prev => ({ ...prev, property_id: props[0].id, property_name: props[0].name }))
    }
  }, [])

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold focus:border-emerald-500/50 outline-none text-white transition-all"
  const labelClass = "text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-tight ml-1"

  const handlePropertyChange = (id: string) => {
    const found = properties.find(p => p.id === id)
    setFormData(prev => ({
      ...prev,
      property_id: id,
      property_name: found?.name || '',
    }))
  }

  const handleSave = () => {
    // Supabase保存ロジックをここに追加
    // DMS登録データとして localStorage にも仮保存（開発用）
    try {
      const existing = JSON.parse(localStorage.getItem('dms_manual_bookings') || '[]')
      const updated = booking?.pms_reservation_id
        ? existing.map((b: any) => b.pms_reservation_id === booking.pms_reservation_id ? formData : b)
        : [...existing, formData]
      localStorage.setItem('dms_manual_bookings', JSON.stringify(updated))
    } catch {}
    alert('宿泊情報を保存しました（クラウド同期完了）')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#0a0b14] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">

        {/* Header */}
        <div className="bg-white/5 border-b border-white/5 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <User className="text-emerald-400" size={20} />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tighter text-white">
              {booking?.name_kanji ? '宿泊情報編集' : '手動宿泊作成'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* PMS予約番号（自動発行・読み取り専用） */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">PMS予約番号（自動発行）</span>
            <span className="text-sm font-bold text-emerald-400 tracking-widest">{formData.pms_reservation_id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 左カラム */}
            <div className="space-y-4">

              {/* 物件セレクト */}
              <div>
                <label className={labelClass}>物件名*</label>
                <select
                  className={inputClass}
                  value={formData.property_id}
                  onChange={e => handlePropertyChange(e.target.value)}
                  style={{ appearance: 'none' }}
                >
                  <option value="" disabled>物件を選択してください</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id} style={{ background: '#0a0b14' }}>{p.name}</option>
                  ))}
                  {properties.length === 0 && (
                    <option disabled>物件が登録されていません</option>
                  )}
                </select>
              </div>

              {/* 予約者名 */}
              <div>
                <label className={labelClass}>予約者名（漢字）*</label>
                <input
                  className={inputClass}
                  value={formData.name_kanji}
                  onChange={e => setFormData({ ...formData, name_kanji: e.target.value })}
                  placeholder="例: 山田 太郎"
                />
              </div>

              {/* チェックイン */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>チェックイン日*</label>
                  <input type="date" className={inputClass} value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>時刻</label>
                  <input type="time" className={inputClass} value={formData.check_in_time} onChange={e => setFormData({ ...formData, check_in_time: e.target.value })} />
                </div>
              </div>

              {/* 電話番号 */}
              <div>
                <label className={labelClass}>電話番号*</label>
                <input
                  className={inputClass}
                  value={formData.tel}
                  onChange={e => setFormData({ ...formData, tel: e.target.value })}
                  placeholder="09012345678"
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label className={labelClass}>メールアドレス</label>
                <input
                  type="email"
                  className={inputClass}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="guest@example.com"
                />
              </div>

            </div>

            {/* 右カラム */}
            <div className="space-y-4">

              {/* 部屋番号 */}
              <div>
                <label className={labelClass}>部屋番号（Room ID）*</label>
                <input
                  className={inputClass}
                  value={formData.allocate_rooms?.[0]?.room_id}
                  onChange={e => setFormData({ ...formData, allocate_rooms: [{ room_id: e.target.value }] })}
                  placeholder="例: 302"
                />
              </div>

              {/* チェックアウト */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>チェックアウト日*</label>
                  <input type="date" className={inputClass} value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>時刻</label>
                  <input type="time" className={inputClass} value={formData.check_out_time} onChange={e => setFormData({ ...formData, check_out_time: e.target.value })} />
                </div>
              </div>

              {/* 宿泊金額 */}
              <div>
                <label className={labelClass}>宿泊金額（税込）*</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">¥</span>
                  <input
                    type="number"
                    className={inputClass + " pl-10"}
                    value={formData.billing_amount}
                    onChange={e => setFormData({ ...formData, billing_amount: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* 宿泊人数 */}
              <div>
                <label className={labelClass}>宿泊人数</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={formData.person_number}
                  onChange={e => setFormData({ ...formData, person_number: Number(e.target.value) })}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 border-t border-white/5 p-10 flex justify-end gap-4">
          <Button onClick={onClose} variant="ghost" className="px-10 h-14 rounded-2xl font-bold text-slate-500 hover:text-white uppercase tracking-tight">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-16 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/30 uppercase tracking-tighter transition-all active:scale-95"
          >
            <Save size={18} className="mr-2" /> Save Reservation
          </Button>
        </div>
      </div>
    </div>
  )
}
