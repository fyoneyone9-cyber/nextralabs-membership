'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search, RefreshCw, Download, Plus, Trash2, Camera, Phone, User
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('dms_session');
    if (data) setSession(JSON.parse(data));
  }, []);

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
          ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-bold" 
          : "text-slate-500 hover:bg-slate-50 font-medium") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={isSub ? 16 : 18} />
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* 🏰 サイドナビゲーション */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform md:relative md:translate-x-0 " + (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-white">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">N</div>
          <span className="text-lg font-black text-slate-800 tracking-tighter uppercase">Nextra DMS</span>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto bg-white">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          
          <div className="mt-2">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-3 text-slate-500 hover:text-slate-900 transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold"><Settings size={18} /><span>各種設定</span></div>
              <ChevronDown size={14} className={isSettingsOpen ? "" : "-rotate-90"} />
            </button>
            {isSettingsOpen && (
              <div className="bg-slate-50/50">
                {SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}
              </div>
            )}
          </div>
        </nav>

        {/* 下部ステータス */}
        <div className="p-6 border-t border-slate-100 space-y-4 bg-white mt-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-slate-400 uppercase">通話受付:OFF</span><div className="w-8 h-4 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" /></div></div>
            <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-slate-400 uppercase">カメラ:ON</span><div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" /></div></div>
          </div>
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 truncate uppercase">{session?.storeName || 'NextraLabs Hotel'}</p>
              <p className="text-xs font-black text-slate-700 truncate">{session?.id || 'admin'}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 p-1"><LogOut size={16} /></button>
          </div>
          <p className="text-[8px] text-slate-300 font-bold text-center uppercase tracking-widest">v3.50.1</p>
        </div>
      </aside>

      {/* 🖥️ メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
               {([...MENU_ITEMS, ...SETTINGS_MENU].find(i => i.id === activeTab))?.label}
             </h2>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input placeholder="検索" className="pl-8 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs w-48 focus:ring-2 ring-indigo-500/20 outline-none" />
             </div>
          </div>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-8 rounded-lg text-xs px-4"><Plus size={14} className="mr-1" />新規登録</Button>
        </header>

        <div className="p-6 overflow-y-auto">
          {/* --- 🔑 ロック設定画面 --- */}
          {activeTab === 'lock-settings' && (
            <div className="animate-in fade-in space-y-4">
              <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                    <tr><th className="p-4 w-1/4">種別</th><th className="p-4 w-2/4">ログインID</th><th className="p-4 w-1/4 text-right">操作</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-medium">キーボックス</td><td className="p-4 text-slate-400">-</td>
                      <td className="p-4 text-right"><button className="p-1 hover:bg-slate-100 rounded text-slate-400"><PenLine size={14} /></button></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-medium">TTLock</td><td className="p-4 font-bold text-slate-700">info@peaceinnjapan.com</td>
                      <td className="p-4 text-right"><button className="p-1 hover:bg-slate-100 rounded text-slate-400"><PenLine size={14} /></button></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* --- 📄 PMS設定画面 --- */}
          {activeTab === 'pms-settings' && (
            <div className="animate-in fade-in space-y-4">
              <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                    <tr><th className="p-4">種別</th><th className="p-4">有効/無効</th><th className="p-4">管理用メモ</th><th className="p-4 text-right">操作</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-700">Beds24</td>
                      <td className="p-4"><Badge className="bg-emerald-100 text-emerald-700 border-0">有効</Badge></td>
                      <td className="p-4 text-slate-400">-</td>
                      <td className="p-4 text-right"><button className="p-1 hover:bg-slate-100 rounded text-slate-400"><PenLine size={14} /></button></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* --- 🏢 組織設定画面 --- */}
          {activeTab === 'org-settings' && (
            <div className="animate-in fade-in space-y-8 max-w-4xl bg-white p-10 rounded-xl shadow-sm border border-slate-200">
              <div className="grid grid-cols-2 gap-12 border-b border-slate-100 pb-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">組織名</label>
                    <p className="text-sm font-bold text-slate-800">株式会社佐々木</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">メールアドレス</label>
                    <p className="text-sm font-bold text-slate-800">info@peaceinnjapan.com</p>
                 </div>
                 <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">電話番号</label>
                    <p className="text-sm font-bold text-slate-800">---</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">ご利用製品名</h4>
                 <ul className="text-sm font-medium text-slate-600 space-y-1 list-disc pl-5">
                   <li>AdvaNceD IoT スマートチェックイン for クラウドスマートロック</li>
                   <li>AdvaNceD IoT スマートチェックイン with キーボックス</li>
                 </ul>
              </div>
              <div className="pt-8 flex justify-end gap-3">
                 <Button variant="outline" size="sm">キャンセル</Button>
                 <Button size="sm" className="bg-indigo-600">更新</Button>
              </div>
            </div>
          )}

          {/* --- 🔒 錠デバイス一覧 --- */}
          {activeTab === 'lock-list' && (
            <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-end gap-2">
                 <Button variant="destructive" size="xs" className="h-7 text-[10px] font-bold">未使用の鍵を全て削除</Button>
                 <Button size="xs" className="h-7 text-[10px] font-bold bg-indigo-600"><Plus size={12} className="mr-1" />新規登録</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                    <tr><th className="p-4">識別名</th><th className="p-4">鍵の種別</th><th className="p-4">使用中の物件・部屋</th><th className="p-4">デバイスID/解除番号</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-4 font-bold">101</td><td className="p-4">キーボックス</td><td className="p-4 text-slate-600 font-medium">ピースINN萩 - 101</td><td className="p-4 font-mono">0-0</td></tr>
                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-4 font-bold">311</td><td className="p-4 text-indigo-600 font-bold">TTLock</td><td className="p-4 text-slate-600 font-medium">ピースINN益田駅北 - 311</td><td className="p-4 font-mono text-indigo-600">30772578</td></tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* デフォルト表示 */}
          {activeTab === 'checkin' && (
            <Card className="bg-white border border-slate-200 p-20 text-center rounded-xl shadow-sm italic text-slate-300">
              DMS Booking Dashboard Syncing...
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}