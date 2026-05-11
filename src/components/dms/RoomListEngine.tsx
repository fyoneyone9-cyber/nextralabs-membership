'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Search, RefreshCw, Edit3, Phone, Lock,
  Monitor, Loader2, CheckCircle2, Building, X, Save
} from 'lucide-react'
import DeleteConfirmDialog from './DeleteConfirmDialog'

/* ══════════ 型定義 ══════════ */
export interface Room {
  id: string
  displayName: string        // 分かりやすい識別名
  roomType: string           // 部屋タイプ
  pmsRoomId: string          // PMS部屋ID
  capacity: number | null    // 定員
  floor: string              // 階
  lockDeviceId: string       // 組づいた錠デバイス
  lockDeviceName: string
  tabletId: string           // ルームタブレット
  propertyName: string       // 物件名
  source: 'pms' | 'local'   // データソース
}

/* ── デフォルトローカルデータ ── */
const DEFAULT_LOCAL_ROOMS: Room[] = [
  { id: 'local-1', displayName: '201', roomType: '-', pmsRoomId: '1', capacity: 2,   floor: '2F', lockDeviceId: '', lockDeviceName: '（未設定）', tabletId: '', propertyName: 'ビジネスホテルアップル', source: 'local' },
  { id: 'local-2', displayName: '202', roomType: '-', pmsRoomId: '2', capacity: 2,   floor: '2F', lockDeviceId: '', lockDeviceName: '（未設定）', tabletId: '', propertyName: 'ビジネスホテルアップル', source: 'local' },
  { id: 'local-3', displayName: '301', roomType: '-', pmsRoomId: '3', capacity: 2,   floor: '3F', lockDeviceId: '', lockDeviceName: '（未設定）', tabletId: '', propertyName: 'ビジネスホテルアップル', source: 'local' },
  { id: 'local-4', displayName: '302', roomType: '-', pmsRoomId: '4', capacity: 2,   floor: '3F', lockDeviceId: '', lockDeviceName: '（未設定）', tabletId: '', propertyName: 'ビジネスホテルアップル', source: 'local' },
  { id: 'local-5', displayName: '401', roomType: '-', pmsRoomId: '5', capacity: 4,   floor: '4F', lockDeviceId: '', lockDeviceName: '（未設定）', tabletId: '', propertyName: 'ビジネスホテルアップル', source: 'local' },
]
const STORAGE_KEY = 'nextra_dms_rooms'

/* ══════════ 部屋編集モーダル ══════════ */
function RoomEditModal({
  room, onSave, onClose,
}: {
  room: Partial<Room>
  onSave: (r: Room) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Partial<Room>>({
    displayName: '',
    roomType: '',
    pmsRoomId: '',
    capacity: null,
    floor: '',
    lockDeviceName: '',
    tabletId: '',
    propertyName: '',
    ...room,
  })
  const set = (k: keyof Room, v: string | number | null) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!form.displayName?.trim()) return
    onSave({
      id: form.id || `local-${Date.now()}`,
      displayName:    form.displayName    || '',
      roomType:       form.roomType       || '-',
      pmsRoomId:      form.pmsRoomId      || '',
      capacity:       form.capacity ?? null,
      floor:          form.floor          || '-',
      lockDeviceId:   form.lockDeviceId   || '',
      lockDeviceName: form.lockDeviceName || '（未設定）',
      tabletId:       form.tabletId       || '',
      propertyName:   form.propertyName   || '',
      source:         'local',
    })
  }

  const inputCls = 'w-full h-10 rounded-lg px-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors'
  const inputStyle = { background: '#13141f', border: '1px solid #334155' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-5"
        style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Building size={15} style={{ color: '#10b981' }} />
            {form.id ? '部屋を編集' : '新規部屋を追加'}
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '分かりやすい識別名 *', key: 'displayName', ph: '例：201' },
            { label: '物件名',               key: 'propertyName', ph: '例：ビジネスホテルアップル' },
            { label: '部屋タイプ',           key: 'roomType',    ph: '例：シングル' },
            { label: 'PMS部屋ID',            key: 'pmsRoomId',   ph: '例：room_001' },
            { label: '階',                   key: 'floor',        ph: '例：3F' },
            { label: '組づいた錠デバイス',    key: 'lockDeviceName', ph: '例：SwitchBot 201' },
            { label: 'ルームタブレットID',    key: 'tabletId',    ph: '任意' },
          ].map(f => (
            <div key={f.key} className={f.key === 'propertyName' ? 'col-span-2' : ''}>
              <label className="text-[10px] font-medium text-slate-500 block mb-1">{f.label}</label>
              <input
                value={(form as Record<string, string | number | null>)[f.key] as string || ''}
                onChange={e => set(f.key as keyof Room, e.target.value)}
                placeholder={f.ph}
                className={inputCls} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">定員（人）</label>
            <input
              type="number" min={1} max={20}
              value={form.capacity ?? ''}
              onChange={e => set('capacity', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="例：2"
              className={inputCls} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = '#334155')}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-lg text-xs font-semibold"
            style={{ background: '#1e293b', color: '#94a3b8' }}>
            キャンセル
          </button>
          <button onClick={handleSave}
            disabled={!form.displayName?.trim()}
            className="flex-1 h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: form.displayName?.trim() ? '#10b981' : '#1e293b',
              color: form.displayName?.trim() ? '#fff' : '#475569',
            }}>
            <Save size={13} /> 保存
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════ ヘッダーアクション（DmsEngineが使用）══════════ */
export function RoomListHeaderActions({
  searchQuery, setSearchQuery, onAdd, syncing, onSync, pmsMode,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  onAdd: () => void
  syncing: boolean
  onSync: () => void
  pmsMode: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="部屋を検索..."
          className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-36 outline-none focus:border-emerald-500 text-slate-300 transition-all"
        />
      </div>
      {pmsMode && (
        <button
          onClick={onSync} disabled={syncing}
          className="h-7 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border transition-all"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
          PMSから同期
        </button>
      )}
      <button
        onClick={onAdd}
        className="h-7 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-white"
        style={{ background: '#10b981' }}
      >
        <Plus size={11} /> 新規作成
      </button>
    </div>
  )
}

/* ══════════ メイン: 部屋一覧 ══════════ */
export default function RoomListContent({
  searchQuery,
  onHeaderActionsReady,
}: {
  searchQuery: string
  onHeaderActionsReady?: (actions: React.ReactNode) => void
}) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [pmsMode, setPmsMode] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null)
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<Room | null>(null)

  /* ── ローカルデータ読み込み ── */
  const loadLocal = useCallback((): Room[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return DEFAULT_LOCAL_ROOMS
  }, [])

  const saveLocal = (data: Room[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch { /* ignore */ }
  }

  /* ── PMS（Staysee）から部屋一覧を取得 ── */
  const syncFromPms = useCallback(async () => {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const pmsConfig = (() => {
        try { return JSON.parse(localStorage.getItem('nextra_ai_pms_config') || '{}') } catch { return {} }
      })()
      const pmsApiKey: string = pmsConfig.fields?.apiKey
        || localStorage.getItem('dms_pms_pms_api_key')
        || ''

      const res = await fetch('/api/nextra-ai/rooms', {
        headers: pmsApiKey ? { 'x-pms-api-key': pmsApiKey } : {},
      })
      const data = await res.json()
      if (data.rooms && Array.isArray(data.rooms)) {
        const pmsRooms: Room[] = data.rooms.map((r: {
          id?: string; pms_room_id?: string; name?: string; room_type?: string;
          capacity?: number; floor?: string; property_name?: string
        }, i: number) => ({
          id: `pms-${r.id || r.pms_room_id || i}`,
          displayName:    r.name || String(r.pms_room_id || i + 1),
          roomType:       r.room_type    || '-',
          pmsRoomId:      String(r.pms_room_id || r.id || ''),
          capacity:       r.capacity ?? null,
          floor:          r.floor        || '-',
          lockDeviceId:   '',
          lockDeviceName: '（未設定）',
          tabletId:       '',
          propertyName:   r.property_name || '',
          source:         'pms' as const,
        }))
        // ローカルデータとマージ（ローカルのみの部屋はそのまま保持）
        const localOnly = loadLocal().filter(l => l.source === 'local')
        const merged = [...pmsRooms, ...localOnly]
        setRooms(merged)
        saveLocal(merged)
        setSyncMsg({ ok: true, text: `PMSから${pmsRooms.length}室を同期しました` })
      } else {
        setSyncMsg({ ok: false, text: data.error || 'PMS同期に失敗しました（ローカルデータを使用中）' })
      }
    } catch {
      setSyncMsg({ ok: false, text: 'PMS接続に失敗しました（ローカルデータを使用中）' })
    } finally {
      setSyncing(false)
    }
  }, [loadLocal])

  /* ── 初期ロード ── */
  useEffect(() => {
    const local = loadLocal()
    setRooms(local)

    // PMS設定があればPMSモードとして自動同期
    try {
      const cfg = JSON.parse(localStorage.getItem('nextra_ai_pms_config') || '{}')
      const dmsCfg = localStorage.getItem('dms_pms_pms_type') || ''
      const hasPms = cfg.pms && cfg.pms !== 'none' && cfg.pms !== 'offline'
        || (dmsCfg && !dmsCfg.includes('ローカル') && !dmsCfg.includes('未接続'))
      setPmsMode(hasPms)
    } catch { /* ignore */ }

    setLoading(false)
  }, [loadLocal])

  /* ── 部屋保存（追加・更新） ── */
  const handleSaveRoom = (room: Room) => {
    setRooms(prev => {
      const exists = prev.findIndex(r => r.id === room.id)
      const next = exists >= 0
        ? prev.map(r => r.id === room.id ? room : r)
        : [...prev, room]
      saveLocal(next)
      return next
    })
    setEditingRoom(null)
  }

  /* ── 部屋削除 ── */
  const handleDelete = (id: string) => {
    setRooms(prev => {
      const next = prev.filter(r => r.id !== id)
      saveLocal(next)
      return next
    })
  }

  /* ── フィルタリング ── */
  const filtered = rooms.filter(r => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      r.displayName.toLowerCase().includes(q) ||
      r.pmsRoomId.toLowerCase().includes(q) ||
      r.propertyName.toLowerCase().includes(q) ||
      r.floor.toLowerCase().includes(q) ||
      r.lockDeviceName.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-emerald-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ヘッダーアクション（インライン） */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
            <input
              value={searchQuery}
              readOnly
              placeholder="上部の検索ボックスを使用"
              className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-40 text-slate-500"
            />
          </div>
          <Badge className="text-xs px-3 py-1 rounded-lg font-semibold"
            style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
            {filtered.length}室
            {pmsMode && <span className="ml-1 text-emerald-600">| PMS連携中</span>}
          </Badge>
          {!pmsMode && (
            <Badge className="text-xs px-3 py-1 rounded-lg font-semibold"
              style={{ background: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)' }}>
              📴 ローカル管理
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {syncMsg && (
            <span className={`text-[11px] flex items-center gap-1 ${syncMsg.ok ? 'text-emerald-400' : 'text-amber-400'}`}>
              {syncMsg.ok ? <CheckCircle2 size={11} /> : '⚠️'} {syncMsg.text}
            </span>
          )}
          {pmsMode && (
            <button onClick={syncFromPms} disabled={syncing}
              className="h-7 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border transition-all"
              style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)', opacity: syncing ? 0.7 : 1 }}>
              <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
              PMSから同期
            </button>
          )}
          <button onClick={() => setEditingRoom({})}
            className="h-7 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#10b981' }}>
            <Plus size={11} /> 新規作成
          </button>
        </div>
      </div>

      {/* PMS未接続バナー */}
      {!pmsMode && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <span className="text-amber-400 text-base">📴</span>
          <div>
            <p className="text-amber-400 font-semibold">ローカル管理モードで動作中</p>
            <p className="text-slate-500 mt-0.5">
              PMS設定でAPIキーを保存すると、PMSから部屋情報を自動同期できます。
              現在はlocalStorageに保存した部屋データを使用しています。
            </p>
          </div>
        </div>
      )}

      {/* 部屋一覧テーブル */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] whitespace-nowrap">
            <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">分かりやすい識別名 ↑</th>
                <th className="px-4 py-3">部屋タイプ</th>
                <th className="px-4 py-3">PMS部屋ID</th>
                <th className="px-4 py-3 text-center">定員</th>
                <th className="px-4 py-3">階</th>
                <th className="px-4 py-3">組づいた錠デバイス</th>
                <th className="px-4 py-3">ルームタブレット</th>
                <th className="px-4 py-3 text-center">通話</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-600 text-xs font-semibold">
                    {searchQuery ? `「${searchQuery}」に一致する部屋が見つかりません` : '部屋がありません。「新規作成」から追加してください。'}
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                    {/* 識別名 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{r.displayName}</span>
                        {r.source === 'pms' ? (
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>PMS</span>
                        ) : (
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: 'rgba(100,116,139,0.12)', color: '#64748b' }}>ローカル</span>
                        )}
                      </div>
                      {r.propertyName && (
                        <p className="text-[9px] text-slate-600 mt-0.5">{r.propertyName}</p>
                      )}
                    </td>
                    {/* 部屋タイプ */}
                    <td className="px-4 py-3 text-slate-500">{r.roomType || '-'}</td>
                    {/* PMS部屋ID */}
                    <td className="px-4 py-3">
                      {r.pmsRoomId
                        ? <span className="text-emerald-400 font-semibold">{r.pmsRoomId}</span>
                        : <span className="text-slate-700">-</span>}
                    </td>
                    {/* 定員 */}
                    <td className="px-4 py-3 text-center text-slate-400">
                      {r.capacity ? `${r.capacity}名` : '-'}
                    </td>
                    {/* 階 */}
                    <td className="px-4 py-3 text-slate-400">{r.floor || '-'}</td>
                    {/* 錠デバイス */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Lock size={10} className={r.lockDeviceName && r.lockDeviceName !== '（未設定）' ? 'text-emerald-400' : 'text-slate-700'} />
                        <span className={r.lockDeviceName && r.lockDeviceName !== '（未設定）' ? 'text-slate-300' : 'text-slate-700'}>
                          {r.lockDeviceName || '（未設定）'}
                        </span>
                      </div>
                    </td>
                    {/* タブレット */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Monitor size={10} className={r.tabletId ? 'text-indigo-400' : 'text-slate-700'} />
                        <span className={r.tabletId ? 'text-slate-300' : 'text-slate-700'}>
                          {r.tabletId || '-'}
                        </span>
                      </div>
                    </td>
                    {/* 通話ボタン */}
                    <td className="px-4 py-3 text-center">
                      <button
                        className="h-6 px-2.5 rounded text-[9px] font-semibold flex items-center gap-1 mx-auto transition-all"
                        style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}
                        onClick={() => alert(`${r.displayName} への通話機能は開発中です`)}
                      >
                        <Phone size={9} /> 通話
                      </button>
                    </td>
                    {/* 操作（編集・削除） */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setEditingRoom(r)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                        >
                          <Edit3 size={12} />
                        </button>
                        {r.source === 'local' && (
                          <button
                            onClick={() => setConfirmTarget(r)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 編集モーダル */}
      {editingRoom !== null && (
        <RoomEditModal
          room={editingRoom}
          onSave={handleSaveRoom}
          onClose={() => setEditingRoom(null)}
        />
      )}

      <DeleteConfirmDialog
        open={confirmTarget !== null}
        title={confirmTarget ? `「${confirmTarget.displayName}」を削除しますか？` : ''}
        description="この部屋のデータをローカルから削除します。PMS連携データは影響を受けません。"
        onConfirm={() => {
          if (!confirmTarget) return
          handleDelete(confirmTarget.id)
          setConfirmTarget(null)
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  )
}
