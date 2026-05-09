'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart,
  Settings, Database, LogOut, ChevronDown, Plus, Trash2, RefreshCw, Search
} from 'lucide-react'

// ──────────────────────────────────────────────
// 型定義
// ──────────────────────────────────────────────
interface LockDevice {
  id: string
  name: string          // 鍵名
  type: string          // 錠の種別（例: セサミ5）
  property: string      // 使用中の物件
  room: string          // 使用中の部屋
  roomType: string      // 部屋タイプ
  deviceId: string      // デバイスID / 解除番号
  inUse: boolean
}

// ──────────────────────────────────────────────
// サンプルデータ（スクリーンショット再現）
// ──────────────────────────────────────────────
const SAMPLE_LOCKS: LockDevice[] = [
  { id: '1',  name: 'COCO CLASS 402',   type: 'セサミ5', property: 'COCO CLASS',  room: '402',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '2',  name: 'COCO CLASS 403',   type: 'セサミ5', property: 'COCO CLASS',  room: '403',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '3',  name: 'COCO CLASS 502',   type: 'セサミ5', property: 'COCO CLASS',  room: '502',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '4',  name: 'COCO CLASS 503',   type: 'セサミ5', property: 'COCO CLASS',  room: '503',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '5',  name: 'COCO CLASS 601',   type: 'セサミ5', property: 'COCO CLASS',  room: '601',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '6',  name: 'COCO CLASS 602',   type: 'セサミ5', property: 'COCO CLASS',  room: '602',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '7',  name: 'COCO CLASS 603',   type: 'セサミ5', property: 'COCO CLASS',  room: '603',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '8',  name: 'COCO CLASS 701',   type: 'セサミ5', property: 'COCO CLASS',  room: '701',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '9',  name: 'COCO CLASS 702',   type: 'セサミ5', property: 'COCO CLASS',  room: '702',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '10', name: 'COCO CLASS 703',   type: 'セサミ5', property: 'COCO CLASS',  room: '703',    roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '11', name: 'CoCo PARK A303',   type: 'セサミ5', property: 'CoCo PARK',   room: 'A303',   roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '12', name: 'CoCo PARK A304',   type: 'セサミ5', property: 'CoCo PARK',   room: 'A304',   roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '13', name: 'CoCo PARK A305',   type: 'セサミ5', property: 'CoCo PARK',   room: 'A305',   roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '14', name: 'CoCo PARK B201',   type: 'セサミ5', property: 'CoCo PARK',   room: 'B201',   roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '15', name: 'CoCo PARK B202',   type: 'セサミ5', property: 'CoCo PARK',   room: 'B202',   roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: true },
  { id: '16', name: 'CoCo PARK C101',   type: 'セサミ5', property: 'CoCo PARK',   room: 'C101',   roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: false },
  { id: '17', name: 'CoCo PARK C102',   type: 'セサミ5', property: 'CoCo PARK',   room: 'C102',   roomType: '（未設定）', deviceId: 'JD8BPAKD', inUse: false },
]

// ──────────────────────────────────────────────
// サイドバーメニュー
// ──────────────────────────────────────────────
const MENU_ITEMS = [
  { id: 'checkin',    label: 'チェックイン',      icon: PenLine,       href: '/dms' },
  { id: 'survey',     label: 'アンケート回収',     icon: MessageSquare, href: '/dms/survey' },
  { id: 'property',   label: '物件',              icon: Building,      href: '/dms?tab=property' },
  { id: 'lock-list',  label: '錠デバイス一覧',     icon: Lock,          href: '/dms/lock-list' },
  { id: 'terminals',  label: 'チェックイン端末',   icon: Monitor,       href: '/dms/terminals' },
  { id: 'calls',      label: '通話一覧（フロント）',icon: Video,         href: '/dms/calls' },
  { id: 'cars',       label: '車両情報',           icon: Car,           href: '/dms/cars' },
  { id: 'reports',    label: '宿泊実績定期報告',   icon: FileBarChart,  href: '/dms/reports' },
]

const SETTINGS_MENU = [
  { id: 'org-settings',  label: '組織設定',   icon: Database, href: '/dms/org-settings' },
  { id: 'pms-settings',  label: 'PMS設定',    icon: Settings, href: '/dms/pms-settings' },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock,     href: '/dms/lock-settings' },
]

// ──────────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────────
export default function LockListEngine() {
  const [locks, setLocks] = useState<LockDevice[]>(SAMPLE_LOCKS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const now = new Date()
    const days = ['日','月','火','水','木','金','土']
    setCurrentDate(`${now.getMonth()+1}/${now.getDate()}(${days[now.getDay()]}) ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
  }, [])

  const unusedLocks = locks.filter(l => !l.inUse)
  const filteredLocks = locks.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.room.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteUnused = () => {
    if (unusedLocks.length === 0) return
    if (!confirm(`未使用の鍵 ${unusedLocks.length}件 を全て削除しますか？`)) return
    setDeleting(true)
    setTimeout(() => {
      setLocks(prev => prev.filter(l => l.inUse))
      setDeleting(false)
    }, 800)
  }

  const NavItem = ({ item, isSub = false }: { item: typeof MENU_ITEMS[0]; isSub?: boolean }) => (
    <Link
      href={item.href}
      className={
        'w-full flex items-center gap-3 px-5 py-3 transition-all text-left ' +
        (item.id === 'lock-list'
          ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500 font-semibold'
          : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium') +
        (isSub ? ' pl-10 text-xs' : ' text-sm')
      }
    >
      <item.icon size={16} className={item.id === 'lock-list' ? 'text-emerald-400' : 'text-slate-500'} />
      <span>{item.label}</span>
    </Link>
  )

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row bg-[#050507] text-slate-200">

      {/* ── サイドバー ── */}
      <aside className="w-56 shrink-0 border-r border-white/5 bg-[#0d0f1a] flex flex-col">
        {/* ロゴ */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-slate-950 text-sm">N</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm tracking-tight">Nextra DMS</p>
              <p className="text-[9px] text-slate-500 font-medium">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-slate-800 text-slate-400 text-[9px] font-semibold px-2 py-0 h-4 border-0">錠デバイス</Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold px-2 py-0 h-4 border-emerald-500/30">{locks.length}件</Badge>
          </div>
        </div>

        {/* ナビ */}
        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2 pt-2 border-t border-white/5">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full flex items-center justify-between px-5 py-3 text-slate-500 hover:text-slate-300 text-sm font-medium"
            >
              <div className="flex items-center gap-3"><Settings size={16} /><span>各種設定</span></div>
              <ChevronDown size={12} className={`transition-transform ${isSettingsOpen ? '' : '-rotate-90'}`} />
            </button>
            {isSettingsOpen && (
              <div className="bg-black/20">
                {SETTINGS_MENU.map(sub => (
                  <Link
                    key={sub.id}
                    href={sub.href}
                    className="w-full flex items-center gap-3 pl-10 pr-5 py-3 text-slate-400 hover:bg-white/5 hover:text-white font-medium text-xs transition-all"
                  >
                    <sub.icon size={14} className="text-slate-500" />
                    <span>{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* フッター */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> カメラ: ON
          </div>
          <div className="text-[10px] font-semibold text-slate-300 leading-tight">
            有限会社黒潮屋
            <span className="block text-slate-500 font-normal text-[8px] mt-0.5">b.h.apple@beach.ocn...</span>
          </div>
          <button
            onClick={() => { localStorage.removeItem('dms_session'); window.location.href = '/dms/login' }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-[10px] font-semibold transition-colors"
          >
            <LogOut size={12} /> ログアウト
          </button>
          <p className="text-[8px] text-slate-700">v3.50.2</p>
        </div>
      </aside>

      {/* ── メインコンテンツ ── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* ヘッダー */}
        <header className="h-14 border-b border-white/5 bg-[#0d0f1a] px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-emerald-400" />
              錠デバイス一覧
            </h2>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold px-2 py-0.5 rounded-full">
              {locks.length} 件
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* 検索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="鍵名・物件・部屋で検索"
                className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-44 outline-none focus:border-emerald-500 text-slate-300 transition-all"
              />
            </div>

            {/* 未使用削除 */}
            <Button
              onClick={handleDeleteUnused}
              disabled={deleting || unusedLocks.length === 0}
              variant="ghost"
              className="h-8 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-xs px-4 font-semibold disabled:opacity-40"
            >
              {deleting
                ? <><RefreshCw size={12} className="mr-1 animate-spin" />削除中...</>
                : <><Trash2 size={12} className="mr-1" />未使用の鍵を全て削除 {unusedLocks.length > 0 && `(${unusedLocks.length})`}</>
              }
            </Button>

            {/* 新規登録 */}
            <Button
              className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-4"
            >
              <Plus size={12} className="mr-1" /> 新規登録
            </Button>
          </div>
        </header>

        {/* テーブルエリア */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#050507]">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLocks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-600 text-xs font-semibold">
                        該当する錠デバイスが見つかりません
                      </td>
                    </tr>
                  ) : (
                    filteredLocks.map(lock => (
                      <tr key={lock.id} className="hover:bg-white/5 transition-colors group">
                        {/* 鍵名 */}
                        <td className="px-5 py-3 font-semibold text-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-emerald-500/10 rounded-md flex items-center justify-center">
                              <Lock size={10} className="text-emerald-400" />
                            </div>
                            {lock.name}
                          </div>
                        </td>

                        {/* 錠の種別 */}
                        <td className="px-5 py-3">
                          <Badge className="bg-slate-800 text-slate-300 border border-white/10 font-semibold text-[9px] px-2 py-0.5 rounded-full">
                            {lock.type}
                          </Badge>
                        </td>

                        {/* 物件 */}
                        <td className="px-5 py-3 text-slate-400 font-medium">
                          {lock.inUse ? lock.property : <span className="text-slate-600">（未使用）</span>}
                        </td>

                        {/* 部屋 */}
                        <td className="px-5 py-3">
                          {lock.inUse
                            ? <span className="font-bold text-white text-sm">{lock.room}</span>
                            : <span className="text-slate-600 text-[9px] font-medium">—</span>
                          }
                        </td>

                        {/* 部屋タイプ */}
                        <td className="px-5 py-3 text-slate-600 text-[9px] font-medium">
                          {lock.roomType}
                        </td>

                        {/* デバイスID */}
                        <td className="px-5 py-3 font-mono text-slate-500 text-[10px]">
                          {lock.deviceId}
                        </td>

                        {/* ステータス */}
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* フッター */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-slate-600 font-medium">
                全 {locks.length} 件 / 使用中 {locks.filter(l=>l.inUse).length} 件 / 未使用 {unusedLocks.length} 件
              </p>
              <p className="text-[10px] text-slate-700">
                {searchQuery && `検索結果: ${filteredLocks.length} 件`}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
