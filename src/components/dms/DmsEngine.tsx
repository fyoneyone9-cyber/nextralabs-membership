'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search, RefreshCw, Download, Plus
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

export default function DmsEngine() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col md:flex-row">
      {/* 🏰 サイドナビゲーション (And-IoT DMS 完全再現) */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform md:relative md:translate-x-0 " + (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">N</div>
          <span className="text-lg font-black text-slate-800 tracking-tighter">Nextra DMS</span>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={"w-full flex items-center gap-3 px-6 py-3 transition-all " + (activeTab === item.id ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-bold" : "text-slate-500 hover:bg-slate-50 font-medium")}>
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          <div className="px-6 py-4 mt-4 border-t border-slate-100">
            <button className="flex items-center justify-between w-full text-slate-500 hover:text-slate-900 transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold"><Settings size={18} /><span>各種設定</span></div>
              <ChevronDown size={14} />
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 mt-auto bg-slate-50/50">
          <div className="flex items-center justify-between mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 truncate">{session?.id || 'admin'}</span>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* 🖥️ メインコンテンツエリア */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f1f5f9]">
        {/* トップバー */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               {MENU_ITEMS.find(i => i.id === activeTab)?.label}
               <RefreshCw size={14} className="text-slate-300 animate-spin-slow cursor-pointer hover:text-indigo-500" />
             </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-600 uppercase italic">Server Online</span>
             </div>
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">29</div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">2</div>
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 max-w-[1600px]">
          {/* --- 📝 チェックイン画面 (And-IoT DMS 再現) --- */}
          {activeTab === 'checkin' && (
            <div className="animate-in fade-in space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                 <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold shadow-sm hover:bg-slate-50">今日</button>
                 <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold shadow-sm hover:bg-slate-50">明日</button>
                 <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2"><Calendar size={14} />日付指定</button>
                 <div className="h-6 w-px bg-slate-300 mx-2" />
                 <button className="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-2"><ArrowRight size={14} />チェックイン 22</button>
                 <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">チェックアウト 12</button>
                 <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">滞在中 6</button>
              </div>

              <Card className="border-slate-200 shadow-xl overflow-hidden rounded-xl">
                 <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input placeholder="予約番号、宿泊者名..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 outline-none focus:ring-2 ring-indigo-500/20" />
                       </div>
                       <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold h-9"><Filter size={14} className="mr-2" />詳細検索</Button>
                    </div>
                    <div className="flex items-center gap-3">
                       <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-lg"><Plus size={16} className="mr-2" />手動宿泊作成</Button>
                       <Button size="sm" variant="outline" className="h-9 rounded-lg border-indigo-200 text-indigo-700 font-bold"><RefreshCw size={16} className="mr-2" />手動同期</Button>
                       <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 rounded-lg"><Download size={16} className="mr-2" />CSVダウンロード</Button>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                       <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                          <tr>
                             <th className="p-4">ステータス</th>
                             <th className="p-4">物件名</th>
                             <th className="p-4">部屋</th>
                             <th className="p-4">宿泊者名</th>
                             <th className="p-4">予約サイト</th>
                             <th className="p-4">チェックイン</th>
                             <th className="p-4">チェックアウト</th>
                             <th className="p-4">操作</th>
                          </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50 transition-colors">
                             <td className="p-4"><Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold uppercase text-[9px]">Confirmed</Badge></td>
                             <td className="p-4 font-bold text-slate-700">ピースINN益田駅北</td>
                             <td className="p-4 font-black">201</td>
                             <td className="p-4">米山 文貴 様</td>
                             <td className="p-4 text-slate-500">Beds24 - setBooking</td>
                             <td className="p-4">5/7 予定</td>
                             <td className="p-4">5/8 予定</td>
                             <td className="p-4 text-center"><ArrowRight size={16} className="text-slate-300" /></td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                             <td className="p-4"><Badge className="bg-sky-100 text-sky-700 border-sky-200 font-bold uppercase text-[9px]">New</Badge></td>
                             <td className="p-4 font-bold text-slate-700">ピースINN萩</td>
                             <td className="p-4 font-black">412</td>
                             <td className="p-4">デモ 太郎 様</td>
                             <td className="p-4 text-slate-500">Direct</td>
                             <td className="p-4">5/7 予定</td>
                             <td className="p-4">5/9 予定</td>
                             <td className="p-4 text-center"><ArrowRight size={16} className="text-slate-300" /></td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </Card>
            </div>
          )}

          {/* --- 🚗 車両情報画面 --- */}
          {activeTab === 'vehicles' && (
            <div className="animate-in fade-in space-y-6">
              <div className="bg-white border-l-4 border-sky-500 p-6 rounded-xl shadow-sm flex gap-4">
                 <Info className="text-sky-500 shrink-0" size={24} />
                 <div className="text-sm text-slate-600 leading-relaxed font-medium">
                   現在滞在中のお客様の車両情報を表示します。<br />
                   この機能を有効にするためには、物件の車両情報アンケート機能を有効にする必要があります。
                 </div>
              </div>
              <Card className="border-slate-200 shadow-lg rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                    <tr><th className="p-6">物件名</th><th className="p-6">チェックイン</th><th className="p-6">チェックアウト</th><th className="p-6">部屋名</th><th className="p-6">車両数</th><th className="p-6">車両情報</th></tr>
                  </thead>
                  <tbody><tr><td colSpan={6} className="p-20 text-center text-slate-300 font-bold italic">データはありません。</td></tr></tbody>
                </table>
              </Card>
            </div>
          )}

          {/* 他の機能も ID に基づいて適宜表示 */}
          {(activeTab !== 'checkin' && activeTab !== 'vehicles') && (
            <Card className="bg-white border border-slate-200 rounded-2xl p-20 text-center shadow-sm border-dashed">
              <p className="text-slate-400 font-black uppercase tracking-widest italic">Data Synchronization in Progress...</p>
              <p className="text-[10px] text-slate-400 mt-2">DMS自律型OS v3.50.1 により、バックグラウンドで最新データを取得中。</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}