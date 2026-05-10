'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart,
  Settings, Database, LogOut, ArrowRight, Search, RefreshCw,
  Download, Plus, Edit3, BookText, Wrench, Plane, MapPin, Sparkles, ExternalLink
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
  { id: 'tools',      label: '便利ツール',          icon: Wrench,       href: '/dms?tab=tools' },
]

const SETTINGS_MENU = [
  { id: 'org-settings',  label: '組織設定',   icon: Database, href: '/dms/org-settings' },
  { id: 'pms-settings',  label: 'PMS設定',    icon: Settings, href: '/dms/pms-settings' },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock,     href: '/dms/lock-settings' },
]

const inputCls = 'w-full h-10 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors'
const inputStyle = { background: '#13141f', border: '1px solid #334155' }

function SettingsPanel({ title, icon, fields, storagePrefix }: {
  title: string
  icon: React.ReactNode
  fields: { key: string; label: string; type: 'text' | 'password' | 'select'; options?: string[]; placeholder: string }[]
  storagePrefix: string
}) {
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [showPass, setShowPass] = React.useState<Record<string, boolean>>({})
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    const loaded: Record<string, string> = {}
    fields.forEach(f => {
      loaded[f.key] = localStorage.getItem(`${storagePrefix}_${f.key}`) || ''
    })
    setValues(loaded)
  }, [storagePrefix])

  const save = () => {
    fields.forEach(f => localStorage.setItem(`${storagePrefix}_${f.key}`, values[f.key] || ''))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-white/5 pb-4">
          {icon} {title}
        </div>
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">{f.label}</label>
              {f.type === 'select' ? (
                <select
                  value={values[f.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  className={inputCls}
                  style={{ ...inputStyle, appearance: 'none' as any }}
                >
                  <option value="">{f.placeholder}</option>
                  {f.options?.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === 'password' ? (
                <div className="relative">
                  <input
                    type={showPass[f.key] ? 'text' : 'password'}
                    value={values[f.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className={`${inputCls} pr-10 font-mono`}
                    style={{ ...inputStyle, color: '#10b981' }}
                    onFocus={e => (e.target.style.borderColor = '#10b981')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => ({ ...v, [f.key]: !v[f.key] }))}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPass[f.key] ? '🙈' : '👁'}
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={values[f.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#10b981')}
                  onBlur={e => (e.target.style.borderColor = '#334155')}
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={save}
          className="h-10 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
          style={{ background: saved ? '#059669' : '#10b981', color: '#fff' }}
        >
          {saved ? '✓ 保存しました' : '設定を保存'}
        </button>
      </div>
    </div>
  )
}

export default function DmsEngine() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('checkin')
  const [editingBooking, setEditingBooking] = useState<any>(null)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [propView, setPropView] = useState<'list' | 'create'>('list')
  const [lockSearchQuery, setLockSearchQuery] = useState('')
  const [lockDeleting, setLockDeleting] = useState(false)
  const [lockUnusedCount, setLockUnusedCount] = useState(2)
  const [bookings, setBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
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
    fetchStayseeBookings()
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#050507] text-slate-200">

      {/* 上部ヘッダー */}
      <header className="border-b border-white/5 bg-[#0d0f1a] sticky top-0 z-40">
        {/* ロゴ行 */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="font-bold text-slate-950 text-xs">N</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-bold text-white text-sm tracking-tight">Nextra DMS</p>
              <p className="text-[10px] text-slate-500 font-medium">{currentDate}</p>
              <Badge className="bg-slate-800 text-slate-400 text-[9px] font-semibold px-2 py-0 h-4 border-0">今日の予約</Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold px-2 py-0 h-4 border-emerald-500/30">{bookings.length}件</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'checkin' && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                  <input placeholder="予約検索" className="pl-8 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs w-36 outline-none focus:border-emerald-500 text-slate-300 transition-all" />
                </div>
                <Button onClick={() => setEditingBooking({})} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-3">
                  <Plus size={11} className="mr-1" /> 手動宿泊作成
                </Button>
                <Button onClick={fetchStayseeBookings} variant="ghost" className="h-7 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs px-3 font-semibold">
                  <RefreshCw size={11} className={`mr-1 ${loadingBookings ? 'animate-spin' : ''}`} /> 予約同期
                </Button>
                <Button variant="ghost" className="h-7 border border-white/10 text-slate-400 hover:bg-white/5 rounded-lg text-xs px-3 font-semibold">
                  <Download size={11} className="mr-1" /> CSV
                </Button>
              </>
            )}
            {activeTab === 'property' && (
              <Button onClick={() => setPropView('create')} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs px-3">
                <Plus size={11} className="mr-1" /> 新規作成
              </Button>
            )}
            {activeTab === 'lock-list' && (
              <LockListHeaderActions searchQuery={lockSearchQuery} setSearchQuery={setLockSearchQuery}
                onDeleteUnused={() => { if (lockUnusedCount === 0) return; if (!confirm(`未使用の鍵 ${lockUnusedCount}件 を全て削除しますか？`)) return; setLockDeleting(true); setTimeout(() => { setLockUnusedCount(0); setLockDeleting(false) }, 800) }}
                deleting={lockDeleting} unusedCount={lockUnusedCount}
              />
            )}
            <button onClick={() => { localStorage.removeItem('dms_session'); window.location.href = '/dms/login' }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-[10px] font-semibold transition-colors ml-2">
              <LogOut size={12} /> ログアウト
            </button>
          </div>
        </div>

        {/* タブナビ（常時表示） */}
        <div className="px-4 flex items-center gap-0.5 overflow-x-auto">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (item.href && !item.href.includes('?')) window.history.pushState({}, '', item.href) }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === item.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              <item.icon size={13} />
              {item.label}
            </button>
          ))}
          {/* 区切り */}
          <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />
          {/* 設定項目も常時表示 */}
          {SETTINGS_MENU.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === item.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              <item.icon size={13} />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0">

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

          {/* 便利ツール */}
          {activeTab === 'tools' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base font-bold text-slate-200 mb-1">便利ツール</h2>
                <p className="text-xs text-slate-500">宿泊DMS連携の便利機能・AIツール集。宿泊者サービス向上にお使いください。</p>
              </div>

              {/* 旅行系ツール */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Plane size={13} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">旅行・観光</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {/* AI旅行コンシェルジュ */}
                  <a
                    href="/products/travel-concierge/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-5 rounded-2xl transition-all hover:border-emerald-500/50 hover:scale-[1.01]"
                    style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      <Plane size={20} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-200">AI旅行コンシェルジュ</span>
                        <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        楽天トラベルの宿＋Google Mapsの観光地を自動収集し、Gemini AIが旅程を丸ごと生成。宿泊者のチェックイン前・滞在中のご案内に活用できます。
                      </p>
                      <div className="flex gap-2 mt-2.5 flex-wrap">
                        {['楽天トラベル', 'Google Maps', 'Gemini AI'].map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>

                  {/* AIロケーションファインダー */}
                  <a
                    href="/products/location-finder/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-5 rounded-2xl transition-all hover:border-emerald-500/50 hover:scale-[1.01]"
                    style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      <MapPin size={20} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-200">AI Location Scout</span>
                        <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        YouTube URLを貼るだけでGemini AIがサムネイルを解析し撮影場所をGoogle Mapsにピン表示。周辺スポット紹介・SNS発信に活用。
                      </p>
                      <div className="flex gap-2 mt-2.5 flex-wrap">
                        {['Gemini Vision', 'Google Maps', 'YouTube'].map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>

                </div>
              </div>

              {/* 近日追加予定 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">近日追加予定</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: '🗾', title: '周辺グルメ自動案内', desc: 'チェックイン後に宿泊者へ周辺のおすすめグルメをAIが自動提案' },
                    { icon: '🚂', title: 'アクセス自動案内', desc: '最寄り駅・バス停からのルートをAIが自動生成して宿泊者へ送付' },
                  ].map(({ icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex gap-4 p-5 rounded-2xl opacity-50"
                      style={{ background: '#0d1117', border: '1px dashed #1e293b' }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ background: '#13141f' }}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-400 mb-1">{title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                        <span className="inline-block mt-2 text-[10px] text-slate-700 font-medium">開発予定</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

          {/* ロック設定 */}
          {activeTab === 'lock-settings' && (
            <SettingsPanel
              title="ロック・鍵デバイス設定"
              icon={<Lock size={15} style={{ color: '#10b981' }} />}
              fields={[
                { key: 'lock_type', label: '鍵デバイス', type: 'select', options: ['RemoteLock','SwitchBot','ASSA ABLOY (Visionline)','dormakaba','SALTO Systems','bitlock','SESAME','その他'], placeholder: '鍵デバイスを選択...' },
                { key: 'lock_api_key', label: '鍵デバイス API KEY', type: 'password', placeholder: '鍵デバイス APIキーを入力' },
              ]}
              storagePrefix="dms_lock"
            />
          )}

          {/* PMS設定 */}
          {activeTab === 'pms-settings' && (
            <SettingsPanel
              title="PMSシステム設定"
              icon={<Settings size={15} style={{ color: '#10b981' }} />}
              fields={[
                { key: 'pms_type', label: 'PMSシステム', type: 'select', options: ['Staysee','イージー会計','Oracle OPERA','Mews','apaleo','その他'], placeholder: 'PMSを選択...' },
                { key: 'pms_api_key', label: 'PMS API KEY', type: 'password', placeholder: 'PMS APIキーを入力' },
              ]}
              storagePrefix="dms_pms"
            />
          )}

          {/* 組織設定 */}
          {activeTab === 'org-settings' && (
            <SettingsPanel
              title="組織設定"
              icon={<Database size={15} style={{ color: '#10b981' }} />}
              fields={[
                { key: 'org_name', label: '施設名', type: 'text', placeholder: '例：ビジネスホテルアップル' },
                { key: 'org_email', label: '管理者メールアドレス', type: 'text', placeholder: 'admin@example.com' },
              ]}
              storagePrefix="dms_org"
            />
          )}

        </div>
      </main>

      {editingBooking && <DmsBookingEditor booking={editingBooking.name_kanji ? editingBooking : null} onClose={() => setEditingBooking(null)} />}
      {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => setEditingProperty(null)} />}
    </div>
  )
}
