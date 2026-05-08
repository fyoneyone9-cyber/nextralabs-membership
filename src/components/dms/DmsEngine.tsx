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

const MENU_ITEMS = [
  { id: 'checkin', label: 'チェックイン', icon: PenLine },
  { id: 'survey', label: 'アンケート回答', icon: MessageSquare },
  { id: 'property', label: '物件', icon: Building },
  { id: 'lock-list', label: '錠デバイス一覧', icon: Lock },
  { id: 'terminals', label: 'チェックイン端末', icon: Monitor },
  { id: 'calls', label: '通話一覧(フロント)', icon: Video },
  { id: 'vehicles', label: '車両情報', icon: Car },
  { id: 'reports', label: '宿泊実績定期報告', icon: FileBarChart },
];

const SETTINGS_MENU = [
  { id: 'org-settings', label: '組織設定', icon: Users },
  { id: 'pms-settings', label: 'PMS設定', icon: Database },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock },
];

export default function DmsEngine() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [showPmsKey, setShowPmsKey] = useState(false);
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('dms_session');
    if (data) setSession(JSON.parse(data));
    const savedTheme = localStorage.getItem('dms_theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('dms_theme', newMode ? 'dark' : 'light');
  };

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem('dms_session');
    window.location.href = '/dms/login';
  };

  const NavItem = ({ item, isSub = false }) => (
    <button
      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
      className={"w-full flex items-center gap-3 px-6 py-3 transition-all " + 
        (activeTab === item.id 
          ? (isDarkMode ? "bg-emerald-500/20 text-emerald-400 border-r-4 border-emerald-500 font-black" : "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-bold") 
          : (isDarkMode ? "text-slate-400 hover:bg-white/5 hover:text-white font-medium" : "text-slate-500 hover:bg-slate-50 font-medium")) + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={isSub ? 16 : 18} />
      <span>{item.label}</span>
    </button>
  );

  const themeClass = isDarkMode ? "bg-[#050507] text-slate-200 dark" : "bg-[#f1f5f9] text-slate-900";
  const cardClass = isDarkMode ? "bg-[#13141f] border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-sm";
  const headerClass = isDarkMode ? "bg-[#0a0b14] border-white/5" : "bg-white border-slate-200";

  return (
    <div className={"min-h-screen font-sans flex flex-col md:flex-row overflow-hidden transition-colors duration-300 " + themeClass}>
      
      {/* 🏰 サイドナビゲーション */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transform transition-transform md:relative md:translate-x-0 " + (isDarkMode ? "bg-[#0a0b14] border-white/5" : "bg-white border-slate-200") + (isMobileMenuOpen ? " translate-x-0" : " -translate-x-full")}>
        <div className="p-6 border-b flex items-center justify-between border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">N</div>
            <span className="text-lg font-black tracking-tighter uppercase">Nextra DMS</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-3 text-slate-500 hover:text-inherit transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold"><Settings size={18} /><span>各種設定</span></div>
              <ChevronDown size={14} className={isSettingsOpen ? "" : "-rotate-90"} />
            </button>
            {isSettingsOpen && (
              <div className={isDarkMode ? "bg-black/20" : "bg-slate-50/50"}>
                {SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}
              </div>
            )}
          </div>
        </nav>

                <div className="p-6 border-t border-inherit mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-500 truncate uppercase">Operator</p>
              <p className="text-xs font-black truncate">{session?.id || 'admin'}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
              title="ログアウト"
            >
              <LogOut size={18} />
            </button>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full h-10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-black uppercase italic text-[10px] transition-all"
          >
            <LogOut size={14} className="mr-2" /> Exit System
          </Button>
        </div>
      </aside>

      {/* 🖥️ メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={"h-14 border-b px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm " + headerClass}>
          <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-base font-bold uppercase tracking-wider">
               {([...MENU_ITEMS, ...SETTINGS_MENU].find(i => i.id === activeTab))?.label}
             </h2>
             <div className="relative hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input placeholder="検索" className={"pl-8 pr-4 py-1.5 border-none rounded-full text-xs w-48 focus:ring-2 ring-emerald-500/20 outline-none " + (isDarkMode ? "bg-black" : "bg-slate-100")} />
             </div>
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 rounded-lg text-xs px-4"><Plus size={14} className="mr-1" />新規登録</Button>
        </header>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* --- 🔑 設定系画面の共通デザイン --- */}
          {(activeTab === 'lock-settings' || activeTab === 'pms-settings') && (
            <Card className={"rounded-lg overflow-hidden border " + cardClass}>
              <table className="w-full text-left text-xs">
                <thead className={isDarkMode ? "bg-black/50 text-slate-400" : "bg-slate-50 text-slate-400"}>
                  <tr><th className="p-4">項目</th><th className="p-4">ステータス</th><th className="p-4 text-right">操作</th></tr>
                </thead>
                                <tbody className="divide-y border-inherit">
                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-6"><Link href="/dms/properties/PROP-001" className="text-indigo-400 font-bold hover:underline uppercase tracking-tight">ネクストラ・ベイサイド静岡</Link></td>
                    <td className="p-6 font-medium text-slate-500">Beds24 (165875)</td>
                    <td className="p-6"><Badge className="bg-emerald-500/20 text-emerald-500 border-0 text-[8px] font-black uppercase">Active</Badge></td>
                    <td className="p-6 text-right"><ArrowRight size={16} className="ml-auto opacity-20" /></td>
                  </tr>
                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-6"><Link href="/dms/properties/PROP-002" className="text-indigo-400 font-bold hover:underline uppercase tracking-tight">サイバー・レジデンス島根</Link></td>
                    <td className="p-6 font-medium text-slate-500">Staysee (442135)</td>
                    <td className="p-6"><Badge className="bg-emerald-500/20 text-emerald-500 border-0 text-[8px] font-black uppercase">Active</Badge></td>
                    <td className="p-6 text-right"><ArrowRight size={16} className="ml-auto opacity-20" /></td>
                  </tr>
                </tbody>
              </table>
            </Card>
          )}

          {/* 物件一覧画面 */}
          {activeTab === 'property' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input placeholder="検索" className={"pl-10 pr-4 py-2 border-2 border-white/10 rounded-full text-sm w-80 bg-black focus:border-emerald-500 outline-none"} />
                </div>
                <div className="flex gap-3">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg px-6">
                    <Plus size={18} className="mr-2" /> 新規作成
                  </Button>
                  <Button variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 font-bold rounded-lg px-6">
                    <RefreshCw size={18} className="mr-2" /> 物件・鍵デバイス情報同期
                  </Button>
                </div>
              </div>

              <Card className={"rounded-xl overflow-hidden border " + cardClass}>
                <table className="w-full text-left text-[11px]">
                  <thead className={isDarkMode ? "bg-black/50 text-slate-500 uppercase font-black" : "bg-slate-50 text-slate-400"}>
                    <tr>
                      <th className="p-4">物件名</th>
                      <th className="p-4">PMS連携</th>
                      <th className="p-4">住所</th>
                      <th className="p-4 text-center">部屋</th>
                      <th className="p-4 text-center">操作</th>
                      <th className="p-4 text-center">無人モード</th>
                      <th className="p-4 text-center">ログ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-inherit">
                    {[
                      { name: 'ビジネスホテルアップル', pms: 'Staysee', address: '愛知県名古屋市中村区黄金通1-22', unmanned: true },
                      { name: 'ネクストラ・ベイサイド静岡', pms: 'Beds24', address: '静岡県静岡市清水区...', unmanned: false },
                      { name: 'サイバー・レジデンス島根', pms: 'Staysee', address: '島根県松江市...', unmanned: true }
                    ].map((prop, idx) => (
                      <tr key={idx} className="hover:bg-emerald-500/5 transition-colors">
                        <td className="p-6">
                          <span className="text-indigo-400 font-black hover:underline cursor-pointer text-sm">{prop.name}</span>
                        </td>
                        <td className="p-6 font-bold text-slate-500">{prop.pms}</td>
                        <td className="p-6 text-slate-400">{prop.address}</td>
                        <td className="p-6 text-center">
                          <Button size="sm" variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 h-8 font-black">
                            <Building size={14} className="mr-1" /> 部屋
                          </Button>
                        </td>
                        <td className="p-6 text-center">
                          <button className="p-3 bg-indigo-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                            <PenLine size={16} />
                          </button>
                        </td>
                        <td className="p-6 text-center">
                          <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${prop.unmanned ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prop.unmanned ? 'left-7' : 'left-1'}`} />
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <Button size="sm" variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 h-8 font-black">
                             ログ
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'checkin' && (
            <Card className={"rounded-xl overflow-hidden border " + cardClass}>
              <div className="p-4 bg-black/10 flex justify-between items-center border-b border-inherit">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">本日</Badge>
                  <Badge variant="outline" className="opacity-50">明日</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="xs" variant="outline" className="h-7 text-[10px]"><RefreshCw size={10} className="mr-1" /> 同期</Button>
                  <Button size="xs" variant="outline" className="h-7 text-[10px]"><Download size={10} className="mr-1" /> CSV</Button>
                </div>
              </div>
              <table className="w-full text-left text-xs">
                <thead className={isDarkMode ? "bg-black/50 text-slate-500" : "bg-slate-50 text-slate-400"}>
                  <tr><th className="p-4">ステータス</th><th className="p-4">宿泊者</th><th className="p-4">部屋</th><th className="p-4 text-right">操作</th></tr>
                </thead>
                <tbody className="divide-y border-inherit">
                  <tr className="hover:bg-emerald-500/5 transition-colors group">
                    <td className="p-6">
                      <Badge className="bg-emerald-500/20 text-emerald-500 border-0 text-[10px] font-black uppercase">未チェックイン</Badge>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => setEditingBooking({ id: 'RSV001', name: 'SEKIDO KENJI', phone: '080-1234-5678' })}
                        className="text-indigo-400 font-black hover:underline text-sm tracking-tight uppercase"
                      >
                        SEKIDO KENJI
                      </button>
                    </td>
                    <td className="p-6 font-bold text-slate-500">Room 302</td>
                    <td className="p-6 text-right">
                      <Button 
                        size="xs" 
                        variant="ghost" 
                        onClick={() => setEditingBooking({ id: 'RSV001', name: 'SEKIDO KENJI', phone: '080-1234-5678' })}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={14} />
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-emerald-500/5 transition-colors group">
                    <td className="p-6">
                      <Badge className="bg-blue-500/20 text-blue-500 border-0 text-[10px] font-black uppercase">滞在中</Badge>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => setEditingBooking({ id: 'RSV002', name: 'NEXTRALABS', phone: '080-0000-0000' })}
                        className="text-indigo-400 font-black hover:underline text-sm tracking-tight uppercase"
                      >
                        NEXTRALABS
                      </button>
                    </td>
                    <td className="p-6 font-bold text-slate-500">Room 501</td>
                    <td className="p-6 text-right">
                      <Button 
                        size="xs" 
                        variant="ghost" 
                        onClick={() => setEditingBooking({ id: 'RSV002', name: 'NEXTRALABS', phone: '080-0000-0000' })}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={14} />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          )}

          {/* 編集モーダル */}
          {editingBooking && (
            <DmsBookingEditor 
              booking={editingBooking} 
              isDarkMode={isDarkMode} 
              onClose={() => setEditingBooking(null)} 
            />
          )}

          {/* デフォルト */}
          {!['checkin', 'lock-settings', 'pms-settings'].includes(activeTab) && (
            <div className="py-40 text-center opacity-20">
               <LayoutDashboard size={64} className="mx-auto mb-4" />
               <p className="font-black uppercase italic tracking-widest">Nextra DMS Interface Ready</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}