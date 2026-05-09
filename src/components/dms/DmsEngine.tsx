'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart,
  Settings, Database, LogOut, ChevronDown, ArrowRight, Search, RefreshCw,
  Download, Plus, Edit3, Loader2, Filter, BookText
} from 'lucide-react'
import DmsBookingEditor from './DmsBookingEditor'
import DmsPropertyEditor from './DmsPropertyEditor'
import LockListContent, { LockListHeaderActions } from './LockListEngine'
import { CloudPmsStorage } from '@/lib/cloud-pms-storage'
import { useSearchParams } from 'next/navigation'

const MENU_ITEMS = [
  { id: 'checkin',    label: 'チェックイン',      icon: PenLine,      href: '/dms' },
  { id: 'survey',     label: 'アンケート回収',     icon: MessageSquare,href: '/dms/survey' },
  { id: 'property',   label: '物件',              icon: Building,     href: '/dms?tab=property' },
  { id: 'lock-list',  label: '錠デバイス一覧',     icon: Lock,         href: '/dms/lock-list' },
  { id: 'terminals',  label: 'チェックイン端末',   icon: Monitor,      href: '/dms/terminals' },
  { id: 'calls',      label: '通話一覧（フロント）',icon: Video,        href: '/dms/calls' },
  { id: 'cars',       label: '車両情報',           icon: Car,          href: '/dms/cars' },
  { id: 'reports',    label: '宿泊実績定期報告',   icon: FileBarChart, href: '/dms/reports' },
]

const SETTINGS_MENU = [
  { id: 'org-settings',  label: '組織設定',   icon: Database, href: '/dms/org-settings' },
  { id: 'pms-settings',  label: 'PMS設定',    icon: Settings, href: '/dms/pms-settings' },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock,     href: '/dms/lock-settings' },
]

export default function DmsEngine() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('checkin')
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  const [editingBooking, setEditingBooking] = useState<any>(null)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [propView, setPropView] = useState<'list' | 'create'>('list')
  const [lockSearchQuery, setLockSearchQuery] = useState('')
  const [lockDeleting, setLockDeleting] = useState(false)
  const [lockUnusedCount, setLockUnusedCount] = useState(2)
  const [bookings, setBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [pmsList, setPmsList] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState('')

  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam)
  }, [tabParam])

  const fetchStayseeBookings = async () => {
    setLoadingBookings(true)
    try {
      const today = new Date().toISOString().slice(0, 10)
      const res = await fetch(`/api/staysee/reservations?date=${today}`)
      const data = await res.json()
      if (data.reservations) setBookings(data.reservations)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    const days = ['日','月','火','水','木','金','土']
    setCurrentDate(`${now.getMonth()+1}/${now.getDate()}(${days[now.getDay()]}) ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
    const initData = async () => {
      const cloudList = await CloudPmsStorage.fetchList()
      if (cloudList && cloudList.length > 0) setPmsList(cloudList)
      fetchStayseeBookings()
    }
    initData()
  }, [])

  if (!mounted) return null

  const NavItem = ({ item, isSub = false }: { item: any; isSub?: boolean }) => (
    <Link
      href={item.href}
      onClick={() => { if (item.href.includes('?tab=')) setActiveTab(item.id) }}
      className={
        'w-full flex items-center gap-3 px-5 py-3 transition-all text-left ' +
        (activeTab === item.id
          ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500 font-semibold'
          : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium') +
        (isSub ? ' pl-10 text-xs' : ' text-sm')
      }
    >
      <item.icon size={16} className={activeTab === item.id ? 'text-emerald-400' : 'text-slate-500'} />
      <span>{item.label}</span>
    </Link>
  )

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row bg-[#050507] text-slate-200">

      {/* サイドバー */}
      <aside className="w-56 shrink-0 border-r border-white/5 bg-[#0d0f1a] flex flex-col">
        {/* ロゴ */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-slate-950 text-sm ">N</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm tracking-tight">Nextra DMS</p>
              <p className="text-[9px] text-slate-500 font-medium">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-slate-800 text-slate-400 text-[9px] font-semibold px-2 py-0 h-4 border-0">今日の予約</Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold px-2 py-0 h-4 border-emerald-500/30">{bookings.length}件</Badge>
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
                {SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}
              </div>
            )}
          </div>
        </nav>

        {/* フッター */}
        <div className="p-4 border-t border-white/5 space-y-3">
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

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* ヘッダー */}
        <header className="h-14 border-b border-white/5 bg-[#0d0f1a] px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {activeTab === 'checkin' && <><PenLine size={18} className="text-emerald-400" /> チェックイン一覧</>}
              {activeTab === 'property' && <><Building size={18} className="text-emerald-400" /> 物件一覧</>}
              {activeTab === 'lock-list' && <><Lock size={18} className="text-emerald-400" /> 錠デバイス一覧</>}
              {!['checkin','property','lock-list'].includes(activeTab) && 'DMS'}
            </h2>
            <button
              onClick={fetchStayseeBookings}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-slate-300"
            >
              <RefreshCw size={14} className={loadingBookings ? 'animate-spin text-emerald-400' : ''} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'checkin' && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                  <input
                    placeholder="予約検索"
                    className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-40 outline-none focus:border-emerald-500 text-slate-300 transition-all"
                  />
                </div>
                <Button
                  onClick={() => setEditingBooking({})}
                  className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-4"
                >
                  <Plus size={12} className="mr-1" /> 手動宿泊作成
                </Button>
                <Button
                  onClick={fetchStayseeBookings}
                  variant="ghost"
                  className="h-8 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs px-4 font-semibold"
                >
                  <RefreshCw size={12} className={`mr-1 ${loadingBookings ? 'animate-spin' : ''}`} />
                  手動予約同期
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 border border-white/10 text-slate-400 hover:bg-white/5 rounded-lg text-xs px-4 font-semibold"
                >
                  <Download size={12} className="mr-1" /> CSV
                </Button>
              </>
            )}
            {activeTab === 'property' && (
              <Button
                onClick={() => setPropView('create')}
                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-4"
              >
                <Plus size={12} className="mr-1" /> 新規作成
              </Button>
            )}
            {activeTab === 'lock-list' && (
              <LockListHeaderActions
                searchQuery={lockSearchQuery}
                setSearchQuery={setLockSearchQuery}
                onDeleteUnused={() => {
                  if (lockUnusedCount === 0) return
                  if (!confirm(`未使用の鍵 ${lockUnusedCount}件 を全て削除しますか？`)) return
                  setLockDeleting(true)
                  setTimeout(() => { setLockUnusedCount(0); setLockDeleting(false) }, 800)
                }}
                deleting={lockDeleting}
                unusedCount={lockUnusedCount}
              />
            )}
          </div>
        </header>

        {/* コンテンツエリア */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-[#050507]">

          {/* チェックイン一覧 */}
          {activeTab === 'checkin' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center bg-[#0d0f1a] border border-white/5 p-1 rounded-xl">
                  {['今日', '明日', '日付指定', '全部屋', '部屋選択'].map((t, i) => (
                    <button
                      key={t}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        i === 0 ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/5 text-slate-300 border border-white/10 px-3 py-1 rounded-lg text-xs font-semibold">→ チェックイン {bookings.length}</Badge>
                  <Badge className="bg-white/5 text-slate-300 border border-white/10 px-3 py-1 rounded-lg text-xs font-semibold">← チェックアウト 6</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-semibold">⌨ 滞在中 2</Badge>
                </div>
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
                      ) : bookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-slate-600 text-xs font-semibold">
                            本日の予約はありません
                          </td>
                        </tr>
                      ) : (
                        bookings.map(b => (
                          <tr key={b.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-center">
                              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-3 py-0.5 rounded-full text-[9px]">
                                confirmed
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-xs">ビジネスホテルアップル</td>
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
                            <td className="px-4 py-3 text-slate-400 font-semibold text-xs uppercase">STAYSEE</td>
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

          {/* 錠デバイス一覧 */}
          {activeTab === 'lock-list' && (
            <LockListContent searchQuery={lockSearchQuery} />
          )}

          {/* 物件一覧 */}
          {activeTab === 'property' && propView === 'list' && (
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">物件名</th>
                    <th className="px-5 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-200">ビジネスホテルアップル</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setEditingProperty({ name: 'ビジネスホテルアップル' })}
                        className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white ml-auto transition-all"
                      >
                        <Edit3 size={15} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      {editingBooking && <DmsBookingEditor booking={editingBooking.name_kanji ? editingBooking : null} onClose={() => setEditingBooking(null)} />}
      {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => setEditingProperty(null)} />}
    </div>
  )
}
