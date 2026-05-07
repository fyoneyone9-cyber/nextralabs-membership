'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, ChevronRight, Menu, X, CheckCircle2
} from 'lucide-react'

// サイドメニュー項目の定義 (スクリーンショットに完全準拠)
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

const SETTINGS_SUBMENU = [
  { id: 'org-settings', label: '組織設定', icon: Users },
  { id: 'pms-settings', label: 'PMS設定', icon: Database },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock },
];

export default function DmsEngine() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('dms_session');
    if (data) setSession(JSON.parse(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dms_session');
    window.location.href = '/dms/login';
  };

  const NavItem = ({ item, isSub = false }) => (
    <button
      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
      className={"w-full flex items-center gap-3 px-6 py-3 transition-all " + 
        (activeTab === item.id 
          ? "bg-white/10 text-emerald-400 border-r-4 border-emerald-500 font-black" 
          : "text-slate-400 hover:bg-white/5 hover:text-white font-bold") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={isSub ? 16 : 18} />
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* 📱 モバイル用ヘッダー */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0b14]">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-emerald-500" size={20} />
          <span className="font-black italic uppercase tracking-tighter">Nextra DMS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 🏰 サイドナビゲーション (And-IoT DMS 完全再現) */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0b14] border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0 " + (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 mb-4 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <LayoutDashboard className="text-emerald-500" size={20} />
          </div>
          <span className="text-xl font-black text-white italic uppercase tracking-tighter text-left leading-none">Nextra <span className="text-emerald-500">DMS</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          
          {/* 各種設定アコーディオン */}
          <div className="mt-4">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full flex items-center justify-between px-6 py-3 text-slate-400 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3 font-bold text-sm">
                <Settings size={18} className="text-emerald-500" />
                <span>各種設定</span>
              </div>
              <ChevronDown size={16} className={"transition-transform " + (isSettingsOpen ? "" : "-rotate-90")} />
            </button>
            {isSettingsOpen && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                {SETTINGS_SUBMENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-left">Operator</span>
              <span className="text-xs font-bold text-white truncate text-left">{session?.id || 'admin'}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
          </div>
          <Badge className="w-full justify-center bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black py-1">AUTONOMOUS OS v4.5</Badge>
        </div>
      </aside>

      {/* 🖥️ メインコンテンツエリア */}
      <main className="flex-1 flex flex-col p-4 md:p-10 overflow-y-auto">
        <header className="mb-8 flex items-center justify-between">
           <div className="text-left">
             <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
               {([...MENU_ITEMS, ...SETTINGS_SUBMENU].find(i => i.id === activeTab))?.label}
             </h2>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">{session?.storeName || 'Operation Hub'}</p>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-[#13141f] px-4 py-2 rounded-xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase italic">Server: Connected</span>
              </div>
           </div>
        </header>

        {activeTab === 'checkin' && (
          <div className="animate-in fade-in space-y-6">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-black/50 p-6 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <Search className="text-slate-500" size={18} />
                    <input placeholder="宿泊者名、予約番号で検索..." className="bg-transparent border-none outline-none text-sm w-64" />
                  </div>
                  <Button size="sm" className="bg-emerald-600 h-9 rounded-xl font-black text-xs">新規予約登録</Button>
                </div>
                <table className="w-full text-left">
                  <thead><tr className="bg-black/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><th className="p-6">予約番号</th><th className="p-6">宿泊者名</th><th className="p-6">部屋番号</th><th className="p-6">状況</th><th className="p-6 text-center">アクション</th></tr></thead>
                  <tbody className="text-sm font-bold">
                    <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-6 font-mono text-emerald-500">BK-8821</td><td className="p-6 text-white">米山 文貴 様</td><td className="p-6 text-white italic">201</td><td className="p-6"><Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">本人確認済</Badge></td><td className="p-6 text-center"><ArrowRight className="mx-auto text-slate-700" /></td></tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 他のタブのコンテンツは ID に基づいて動的に表示 */}
        {activeTab !== 'checkin' && (
          <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[3rem] p-20 text-center animate-in zoom-in-95 border-dashed">
            <p className="text-slate-500 font-black uppercase tracking-widest italic">Module "{activeTab}" is Active and Synchronizing...</p>
            <p className="text-xs text-slate-600 mt-4 font-bold">自律型OSによりバックグラウンドで処理を継続しています。</p>
          </Card>
        )}
      </main>

    </div>
  )
}