'use client'
import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Plus, Trash2, RefreshCw, Search } from 'lucide-react'

interface LockDevice {
  id: string
  name: string
  type: string
  property: string
  room: string
  roomType: string
  deviceId: string
  inUse: boolean
}

const SAMPLE_LOCKS: LockDevice[] = [
  { id: '1',  name: 'COCO CLASS 402', type: 'セサミ5', property: 'COCO CLASS', room: '402',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '2',  name: 'COCO CLASS 403', type: 'セサミ5', property: 'COCO CLASS', room: '403',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '3',  name: 'COCO CLASS 502', type: 'セサミ5', property: 'COCO CLASS', room: '502',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '4',  name: 'COCO CLASS 503', type: 'セサミ5', property: 'COCO CLASS', room: '503',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '5',  name: 'COCO CLASS 601', type: 'セサミ5', property: 'COCO CLASS', room: '601',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '6',  name: 'COCO CLASS 602', type: 'セサミ5', property: 'COCO CLASS', room: '602',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '7',  name: 'COCO CLASS 603', type: 'セサミ5', property: 'COCO CLASS', room: '603',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '8',  name: 'COCO CLASS 701', type: 'セサミ5', property: 'COCO CLASS', room: '701',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '9',  name: 'COCO CLASS 702', type: 'セサミ5', property: 'COCO CLASS', room: '702',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '10', name: 'COCO CLASS 703', type: 'セサミ5', property: 'COCO CLASS', room: '703',  roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '11', name: 'CoCo PARK A303', type: 'セサミ5', property: 'CoCo PARK',  room: 'A303', roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '12', name: 'CoCo PARK A304', type: 'セサミ5', property: 'CoCo PARK',  room: 'A304', roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '13', name: 'CoCo PARK A305', type: 'セサミ5', property: 'CoCo PARK',  room: 'A305', roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '14', name: 'CoCo PARK B201', type: 'セサミ5', property: 'CoCo PARK',  room: 'B201', roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '15', name: 'CoCo PARK B202', type: 'セサミ5', property: 'CoCo PARK',  room: 'B202', roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '16', name: 'CoCo PARK C101', type: 'セサミ5', property: 'CoCo PARK',  room: 'C101', roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: false },
  { id: '17', name: 'CoCo PARK C102', type: 'セサミ5', property: 'CoCo PARK',  room: 'C102', roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: false },
]

// ── ヘッダーに差し込むアクション群（DmsEngineが使用）──
export function LockListHeaderActions({
  searchQuery,
  setSearchQuery,
  onDeleteUnused,
  deleting,
  unusedCount,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  onDeleteUnused: () => void
  deleting: boolean
  unusedCount: number
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
        className="h-8 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-xs px-4 font-semibold disabled:opacity-40"
      >
        {deleting
          ? <><RefreshCw size={12} className="mr-1 animate-spin" />削除中...</>
          : <><Trash2 size={12} className="mr-1" />未使用の鍵を全て削除{unusedCount > 0 ? ` (${unusedCount})` : ''}</>
        }
      </Button>
      <Button className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-4">
        <Plus size={12} className="mr-1" /> 新規登録
      </Button>
    </div>
  )
}

// ── テーブルコンテンツのみ（アクションはDmsEngineのヘッダーに委譲）──
export default function LockListContent({
  searchQuery = '',
}: {
  searchQuery?: string
}) {
  const [locks, setLocks] = useState<LockDevice[]>(SAMPLE_LOCKS)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const usedCount = locks.filter(l => l.inUse).length
  const unusedCount = locks.filter(l => !l.inUse).length

  const filteredLocks = locks.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.room.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (lock: LockDevice) => {
    const confirmed = window.confirm(
      `「${lock.name}」を削除しますか？\nこの操作は元に戻せません。`
    )
    if (!confirmed) return
    setDeletingId(lock.id)
    // 削除アニメーション後にリストから除去
    setTimeout(() => {
      setLocks(prev => prev.filter(l => l.id !== lock.id))
      setDeletingId(null)
    }, 400)
  }

  return (
    <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] whitespace-nowrap">
          <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">鍵名</th>
              <th className="px-5 py-3">錠の種別</th>
              <th className="px-5 py-3">使用中の物件</th>
              <th className="px-5 py-3">使用中の部屋</th>
              <th className="px-5 py-3">部屋タイプ</th>
              <th className="px-5 py-3">デバイスID / 解除番号</th>
              <th className="px-5 py-3 text-center">ステータス</th>
              <th className="px-5 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLocks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-600 text-xs font-semibold">
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
                    {lock.inUse ? lock.property : <span className="text-slate-600">（未使用）</span>}
                  </td>
                  <td className="px-5 py-3">
                    {lock.inUse
                      ? <span className="font-bold text-white text-sm">{lock.room}</span>
                      : <span className="text-slate-600 text-[9px] font-medium">—</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-600 text-[9px] font-medium">{lock.roomType}</td>
                  <td className="px-5 py-3 font-mono text-slate-500 text-[10px]">{lock.deviceId}</td>
                  <td className="px-5 py-3 text-center">
                    {lock.inUse ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-3 py-0.5 rounded-full text-[9px]">
                        使用中
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-800 text-slate-500 border border-white/10 font-semibold px-3 py-0.5 rounded-full text-[9px]">
                        未使用
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleDelete(lock)}
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
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-slate-600 font-medium">
          全 {locks.length} 件 / 使用中 {usedCount} 件 / 未使用 {unusedCount} 件
        </p>
        {searchQuery && (
          <p className="text-[10px] text-slate-700">検索結果: {filteredLocks.length} 件</p>
        )}
      </div>
    </div>
  )
}
