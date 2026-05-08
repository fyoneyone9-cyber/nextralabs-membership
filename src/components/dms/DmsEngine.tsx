'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search, RefreshCw, Download, Plus, Moon, Sun, Edit3
} from 'lucide-react'
import DmsBookingEditor from './DmsBookingEditor'
import DmsPropertyEditor from './DmsPropertyEditor'

const MENU_ITEMS = [
  { id: 'checkin', label: 'チェックイン', icon: PenLine },
  { id: 'lost-property', label: '忘れ物管理', icon: Search },
  { id: 'survey', label: 'アンケート回答', icon: MessageSquare },
  { id: 'property', label: '物件', icon: Building },
  { id: 'lock-list', label: '錠デバイス一覧', icon: Lock },
  { id: 'terminals', label: 'チェックイン端末', icon: Monitor },
  { id: 'reports', label: '宿泊実績定期報告', icon: FileBarChart },
];

const SETTINGS_MENU = [
  { id: 'org-settings', label: '組織設定', icon: Users },
  { id: 'pms-settings', label: 'PMS設定', icon: Database },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock },
];

export default function DmsEngine() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [pmsView, setPmsView] = useState<'list' | 'create'>('list');
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('dms_session');
    if (data) setSession(JSON.parse(data));
  }, []);

  if (!mounted) return null;

  const NavItem = ({ item, isSub = false }) => (
    <button
      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
      className={"w-full flex items-center gap-3 px-6 py-3 transition-all " + 
        (activeTab === item.id 
          ? "bg-emerald-500/20 text-emerald-400 border-r-4 border-emerald-500 font-black" 
          : "text-slate-400 hover:bg-white/5 hover:text-white font-medium") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={isSub ? 16 : 18} />
      <span>{item.label}</span>
    </button>
  );

  const themeClass = "bg-[#050507] text-slate-200 dark";
  const cardClass = "bg-[#13141f] border-white/5 shadow-2xl";
  const headerClass = "bg-[#0a0b14] border-white/5";

  return (
    <div className={"min-h-screen font-sans flex flex-col md:flex-row overflow-hidden " + themeClass}>
      
      {/* サイドナビゲーション */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transform transition-transform md:relative md:translate-x-0 " + headerClass + (isMobileMenuOpen ? " translate-x-0" : " -translate-x-full")}>
        <div className="p-6 border-b flex items-center justify-between border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">N</div>
            <span className="text-lg font-black tracking-tighter uppercase">Nextra AI DMS</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-3 text-slate-500 hover:text-inherit transition-colors font-bold text-sm">
              <div className="flex items-center gap-3"><Settings size={18} /><span>各種設定</span></div>
              <ChevronDown size={14} className={isSettingsOpen ? "" : "-rotate-90"} />
            </button>
            {isSettingsOpen && (
              <div className="bg-black/20">
                {SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={"h-14 border-b px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm " + headerClass}>
          <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-base font-bold uppercase tracking-wider">
               {([...MENU_ITEMS, ...SETTINGS_MENU].find(i => i.id === activeTab))?.label}
             </h2>
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 rounded-lg text-xs px-4"><Plus size={14} className="mr-1" />新規登録</Button>
        </header>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* チェックイン一覧 */}
          {activeTab === 'checkin' && (
            <Card className={"rounded-xl overflow-hidden border " + cardClass}>
              <div className="p-4 bg-black/10 flex justify-between items-center border-b border-inherit">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 font-black">本日</Badge>
                  <Badge variant="outline" className="opacity-50">明日</Badge>
                </div>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 text-slate-500">
                  <tr><th className="p-4">ステータス</th><th className="p-4">宿泊者</th><th className="p-4">部屋</th><th className="p-4 text-right">操作</th></tr>
                </thead>
                <tbody className="divide-y border-inherit text-slate-300">
                  {[
                    { id: 'RSV001', name: 'SEKIDO KENJI', room: 'Room 302', status: '未チェックイン' },
                    { id: 'RSV002', name: 'NEXTRALABS', room: 'Room 501', status: '滞在中' }
                  ].map((booking) => (
                    <tr key={booking.id} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="p-4 md:p-6">
                        <Badge className={booking.status === '滞年中' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="p-4 md:p-6">
                        <button 
                          onClick={() => setEditingBooking(booking)}
                          className="text-indigo-400 font-black hover:underline text-sm uppercase tracking-tight text-left"
                        >
                          {booking.name}
                        </button>
                      </td>
                      <td className="p-4 md:p-6 font-bold">{booking.room}</td>
                      <td className="p-4 md:p-6 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setEditingBooking(booking)} className="md:opacity-0 group-hover:opacity-100">
                          <Edit3 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {/* 物件一覧 */}
          {activeTab === 'property' && (
            <Card className={"rounded-xl overflow-hidden border " + cardClass}>
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/50 text-slate-500">
                    <tr><th className="p-4">物件名</th><th className="p-4">PMS</th><th className="p-4 text-center">操作</th></tr>
                  </thead>
                  <tbody className="divide-y border-inherit">
                    <tr className="hover:bg-emerald-500/5 transition-colors">
                      <td className="p-6 font-black text-indigo-400">ビジネスホテルアップル</td>
                      <td className="p-6">Staysee</td>
                      <td className="p-6 text-center">
                        <Button size="sm" className="bg-indigo-600" onClick={() => setEditingProperty({ name: 'ビジネスホテルアップル' })}>
                          <PenLine size={14} />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </Card>
          )}

          {/* PMS設定画面 */}
          {activeTab === 'pms-settings' && (
            <div className="space-y-6">
              {pmsView === 'list' ? (
                <>
                  <div className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded shadow-sm">
                    <div className="flex items-center gap-2">
                      <Settings size={14} className="text-gray-500" />
                      <span className="text-sm font-bold text-gray-700 uppercase">PMS設定</span>
                      <div className="relative ml-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input placeholder="検索" className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-full text-xs w-64 outline-none focus:ring-1 ring-indigo-500 bg-white text-black" />
                      </div>
                    </div>
                    <Button 
                      onClick={() => setPmsView('create')}
                      className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-bold h-8 rounded text-xs px-4"
                    >
                      <Plus size={14} className="mr-1" /> 新規登録
                    </Button>
                  </div>

                  <Card className="bg-white border-gray-200 rounded shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#f8f9fa] text-gray-500 font-bold border-b">
                        <tr>
                          <th className="p-4">種別</th>
                          <th className="p-4">有効/無効</th>
                          <th className="p-4">管理用メモ</th>
                          <th className="p-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                            データはありません。
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Card>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-white p-3 border rounded shadow-sm">
                    <Settings size={14} />
                    <span>PMS設定</span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-gray-900">新規登録</span>
                  </div>

                  <Card className="bg-white border-gray-200 rounded shadow-sm p-10 space-y-10">
                    <div className="grid grid-cols-2 gap-12 text-black">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 flex items-center gap-1">種別<span className="text-red-500">*</span></label>
                        <select className="w-full bg-white border-b border-gray-300 py-2 text-sm outline-none focus:border-indigo-500">
                          <option value="">選択してください</option>
                          <option value="Staysee">Staysee</option>
                          <option value="Beds24">Beds24</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500">有効/無効(無効にすると同期等が行われなくなります)<span className="text-red-500">*</span></label>
                        <select className="w-full bg-white border-b border-gray-300 py-2 text-sm outline-none focus:border-indigo-500">
                          <option value="有効">有効</option>
                          <option value="無効">無効</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 text-black">
                      <label className="text-[10px] font-bold text-gray-500">サイトAPIキー<span className="text-red-500">*</span></label>
                      <input type="text" className="w-full bg-white border-b border-gray-300 py-2 text-sm outline-none focus:border-indigo-500" />
                    </div>

                    <div className="space-y-2 text-black">
                      <label className="text-[10px] font-bold text-gray-500">管理用メモ(任意)</label>
                      <textarea rows={4} className="w-full border border-gray-200 rounded p-4 text-sm outline-none focus:border-indigo-500 bg-white" />
                    </div>

                    <div className="border border-teal-600/30 rounded p-6 bg-teal-50/10 space-y-4">
                      {[
                        '【設定ガイド】',
                        '【PMS→スマートチェックイン(同期)の仕様】',
                        '【スマートチェックイン→PMS(チェックイン情報等の連携)の仕様】'
                      ].map(text => (
                        <div key={text} className="space-y-1">
                          <p className="text-xs font-bold text-teal-700 hover:underline cursor-pointer">{text}</p>
                          <div className="h-px w-8 bg-gray-300 ml-2" />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                      <Button onClick={() => setPmsView('list')} variant="outline" className="px-10 h-10 rounded font-bold text-xs">キャンセル</Button>
                      <Button onClick={() => setPmsView('list')} className="px-12 h-10 rounded bg-[#5c59cc] text-white font-black text-xs">保存する</Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        {/* モーダル表示エリア */}
        {editingBooking && (
          <DmsBookingEditor 
            booking={editingBooking} 
            isDarkMode={true} 
            onClose={() => setEditingBooking(null)} 
          />
        )}
        {editingProperty && (
          <DmsPropertyEditor 
            property={editingProperty} 
            isDarkMode={true} 
            onClose={() => setEditingProperty(null)} 
          />
        )}
      </main>
    </div>
  )
}
