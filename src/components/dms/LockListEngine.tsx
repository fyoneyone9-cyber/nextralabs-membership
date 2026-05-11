'use client'
import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Plus, Trash2, RefreshCw, Search } from 'lucide-react'
import DeleteConfirmDialog from './DeleteConfirmDialog'

export interface LockDevice {
  id: string
  name: string
  type: string
  property: string
  room: string
  roomType: string
  deviceId: string
  inUse: boolean
}

// 外部から呼び出せるメソッド
export interface LockListRef {
  triggerDeleteUnused: () => void
  triggerDeleteAll: () => void
  getUnusedCount: () => number
  getTotalCount: () => number
}

// ── ヘッダーアクション（DmsEngineに差し込む） ──
export function LockListHeaderActions({
  searchQuery,
  setSearchQuery,
  onDeleteUnused,
  onDeleteAll,
  deleting,
  unusedCount,
  totalCount,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
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
      {/* 未使用のみ削除 */}
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
      {/* 全件一括削除 */}
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
      <Button className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-4">
        <Plus size={12} className="mr-1" /> 新規登録
      </Button>
    </div>
  )
}

// ── テーブルコンテンツ（ref経由で外部から削除トリガー可能） ──
const LockListContent = forwardRef<LockListRef, { searchQuery?: string; onCountChange?: (total: number, unused: number) => void }>(
  function LockListContent({ searchQuery = '', onCountChange }, ref) {
    // プリセットデータなし — 空からスタート
    const [locks, setLocks] = useState<LockDevice[]>([])
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmTarget, setConfirmTarget] = useState<LockDevice | null>(null)
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
    const [confirmDeleteUnused, setConfirmDeleteUnused] = useState(false)

    const usedCount = locks.filter(l => l.inUse).length
    const unusedCount = locks.filter(l => !l.inUse).length

    // 件数変化を親に通知
    React.useEffect(() => {
      onCountChange?.(locks.length, unusedCount)
    }, [locks.length, unusedCount, onCountChange])

    const filteredLocks = locks.filter(l =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.room.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 外部から呼び出せるメソッドを公開
    useImperativeHandle(ref, () => ({
      triggerDeleteUnused: () => {
        if (unusedCount > 0) setConfirmDeleteUnused(true)
      },
      triggerDeleteAll: () => {
        if (locks.length > 0) setConfirmDeleteAll(true)
      },
      getUnusedCount: () => unusedCount,
      getTotalCount: () => locks.length,
    }), [locks.length, unusedCount])

    return (
      <>
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          {locks.length === 0 && !searchQuery ? (
            /* 空状態 */
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Lock size={24} className="text-emerald-400" />
              </div>
              <p className="text-slate-400 text-sm font-semibold">錠デバイスがまだ登録されていません</p>
              <p className="text-slate-600 text-xs">右上の「新規登録」からSESAME・SwitchBot等を追加してください</p>
            </div>
          ) : (
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

        {/* 未使用を全削除確認 */}
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

        {/* 全件削除確認 */}
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
