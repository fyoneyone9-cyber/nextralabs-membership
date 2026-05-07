'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search, RefreshCw, Download, Plus, Moon, Sun
} from 'lucide-react'

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
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
                  <tr>
                    <td className="p-4 font-bold text-inherit">AdvaNceD IoT 連携ユニット</td>
                    <td className="p-4"><Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Active</Badge></td>
                    <td className="p-4 text-right"><button className="p-1 hover:bg-emerald-500/10 rounded transition-colors"><PenLine size={14} /></button></td>
                  </tr>
                </tbody>
              </table>
            </Card>
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
                  <tr><th className="p-4">ステータス</th><th className="p-4">宿泊者</th><th className="p-4">部屋</th><th className="p-4 text-right">詳細</th></tr>
                </thead>
                <tbody className="divide-y border-inherit">
                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-4"><Badge className="bg-emerald-500 text-white border-0 font-bold text-[8px]">確定</Badge></td>
                    <td className="p-4 font-black">米山 文貴 様</td>
                    <td className="p-4 font-mono text-emerald-500">201</td>
                    <td className="p-4 text-right"><ArrowRight size={16} className="ml-auto opacity-20" /></td>
                  </tr>
                </tbody>
              </table>
            </Card>
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