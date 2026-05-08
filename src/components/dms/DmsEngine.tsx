'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search, RefreshCw, Download, Plus, Moon, Sun, Edit3, Loader2, ChevronRight, Info, Calendar, Filter, User, BookText
} from 'lucide-react'
import DmsBookingEditor from './DmsBookingEditor'
import DmsPropertyEditor from './DmsPropertyEditor'
import { CloudPmsStorage } from '@/lib/cloud-pms-storage'

const MENU_ITEMS = [
  { id: 'checkin', label: 'チェックイン', icon: PenLine, href: '/dms' },
  { id: 'survey', label: 'アンケート回答', icon: MessageSquare, href: '/dms/survey' },
  { id: 'property', label: '物件', icon: Building, href: '/dms/properties' },
  { id: 'lock-list', label: '錠デバイス一覧', icon: Lock, href: '/dms/lock-list' },
  { id: 'terminals', label: 'チェックイン端末', icon: Monitor, href: '/dms/terminals' },
  { id: 'calls', label: '通話一覧(フロント)', icon: Video, href: '/dms/calls' },
  { id: 'cars', label: '車両情報', icon: Car, href: '/dms/cars' },
  { id: 'reports', label: '宿泊実績定期報告', icon: FileBarChart, href: '/dms/reports' },
];

const SETTINGS_MENU = [
  { id: 'org-settings', label: '組織設定', icon: Users, href: '/dms/org-settings' },
  { id: 'pms-settings', label: 'PMS設定', icon: Database, href: '/dms/pms-settings' },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock, href: '/dms/lock-settings' },
];

export default function DmsEngine() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('checkin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [pmsList, setPmsList] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState('5/8(金) 18:08');

  const fetchStayseeBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/staysee/reservations?date=2026-05-08');
      const data = await res.json();
      if (data.reservations) setBookings(data.reservations);
    } catch (e) {} finally { setLoadingBookings(false); }
  };

  useEffect(() => {
    setMounted(true);
    const initData = async () => {
      const cloudList = await CloudPmsStorage.fetchList();
      if (cloudList && cloudList.length > 0) setPmsList(cloudList);
      fetchStayseeBookings();
    };
    initData();
  }, []);

  if (!mounted) return null;

  const NavItem = ({ item, isSub = false }: { item: any, isSub?: boolean }) => (
    <Link
      href={item.href}
      className={"w-full flex items-center gap-3 px-6 py-4 transition-all " + 
        (activeTab === item.id 
          ? "bg-[#0f172a] text-[#10b981] border-r-4 border-[#10b981] font-black" 
          : "text-slate-400 hover:bg-white/5 hover:text-white font-bold") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={18} className={activeTab === item.id ? "text-[#10b981]" : "text-slate-500"} />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden bg-[#02040a] text-slate-200">
      {/* サイドバー */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0a0b14] flex flex-col transform transition-transform md:relative md:translate-x-0">
        <div className="p-6 border-b border-white/5 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[#10b981]">
            <div className="flex items-center gap-3">
               <Calendar size={14} className="animate-pulse" />
               <span className="text-xl font-black italic tracking-tighter uppercase">{currentDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
             <Badge className="bg-indigo-500/20 text-indigo-400 border-none text-[10px] font-black px-2">12</Badge>
             <Badge className="bg-purple-500/20 text-purple-400 border-none text-[10px] font-black px-2">6</Badge>
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-4 text-slate-500 hover:text-white transition-colors font-black text-sm">
              <div className="flex items-center gap-3"><Settings size={18} /><span>各種設定</span></div>
              <ChevronDown size={14} className={isSettingsOpen ? "" : "-rotate-90"} />
            </button>
            {isSettingsOpen && <div className="bg-black/20">{SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}</div>}
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 space-y-4 text-left">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-slate-700" /> 通話受付:OFF</div>
           <div className="flex items-center gap-3 text-[10px] font-black text-[#10b981] uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" /> カメラ:ON</div>
           <div className="text-[10px] font-black text-slate-300 leading-tight">有限会社黄金屋<br/>細井<br/><span className="text-slate-600 text-[8px]">b.h.apple@beach.ocn...</span></div>
           <button className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"><LogOut size={12}/> ログアウト</button>
        </div>
      </aside>

      {/* メイン */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-left bg-white">
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3"><PenLine className="text-blue-600" /> チェックイン一覧</h2>
             <button onClick={fetchStayseeBookings} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><RefreshCw size={18} /></button>
          </div>
          <div className="flex items-center gap-3">
             <Button onClick={() => setEditingBooking({})} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-10 px-6 text-xs shadow-md">＋ 手動宿泊作成</Button>
             <Button onClick={fetchStayseeBookings} variant="outline" className="border-[#10b981] text-[#10b981] hover:bg-emerald-50 h-10 rounded-full text-xs font-bold px-6 shadow-sm flex items-center gap-1.5"><RefreshCw size={14} /> 手動予約同期</Button>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <input placeholder="予約検索" className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-xs w-48 outline-none focus:ring-2 ring-blue-500 text-gray-900" />
             </div>
             <Button className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-bold rounded-full h-10 px-6 text-xs shadow-lg flex items-center gap-2 italic"><Download size={14}/> CSVダウンロード</Button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50">
           <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                {['今日', '明日', '日付指定', '全部屋', '部屋選択'].map((t, i) => (
                  <button key={t} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${i===0 ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-500 hover:text-gray-900'}`}>{t}</button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                 <Badge className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold shadow-sm italic">➔ チェックイン 15</Badge>
                 <Badge className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold shadow-sm italic">➔ チェックアウト 6</Badge>
                 <Badge className="bg-[#1e293b] text-white border-none px-4 py-2 rounded-lg text-xs font-bold shadow-sm italic">⌨ 滞在中 2</Badge>
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-500 ml-4"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /> キャンセル済を含める(beds24)</div>
              </div>
           </div>

           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-400 font-bold border-b border-gray-200 uppercase tracking-widest">
                       <tr>
                          <th className="p-5 text-center">ステータス</th>
                          <th className="p-5">物件名</th>
                          <th className="p-5">部屋</th>
                          <th className="p-5 text-center">人数 / 予約者</th>
                          <th className="p-5">予約元 / OTA予約番号</th>
                          <th className="p-5">PMS予約番号</th>
                          <th className="p-5">チェックイン</th>
                          <th className="p-5">チェックアウト</th>
                          <th className="p-5">事前チェックイン</th>
                          <th className="p-5">電話番号 / メール</th>
                          <th className="p-5">団体番号</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-900">
                       {bookings.length > 0 ? bookings.map(b => (
                        <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                           <td className="p-5 text-center"><Badge className="bg-[#10b981] text-white font-bold italic px-4 py-1.5 rounded-full border-none shadow-md text-[10px]">confirmed</Badge></td>
                           <td className="p-5 font-bold text-gray-500">ビジネスホテルアップル</td>
                           <td className="p-5 font-bold"><p className="text-gray-400 text-[9px] font-normal uppercase">(未設定)</p><span className="text-sm font-black">{b.allocate_rooms?.[0]?.room_id || '---'}</span></td>
                           <td className="p-5 text-center"><p className="text-gray-400 text-[9px] font-normal uppercase">{b.person_number || '1'}</p><Link href={`/dms/bookings/${b.id}`} className="text-blue-600 font-black text-sm uppercase hover:underline">{b.name_kanji}</Link></td>
                           <td className="p-5 font-black text-gray-500 uppercase italic">STAYSEE</td>
                           <td className="p-5 font-mono text-gray-600 font-bold">{b.id}</td>
                           <td className="p-5 font-bold">{b.start_date.substring(5)}<br/><span className="text-gray-400 text-[9px] font-normal">予定({b.check_in_time})</span></td>
                           <td className="p-5 font-bold">{b.end_date.substring(5)}<br/><span className="text-gray-400 text-[9px] font-normal">予定({b.check_out_time})</span></td>
                           <td className="p-5"><Badge variant="outline" className="text-[#10b981] border-[#10b981]/30 bg-emerald-50 font-bold text-[9px] px-3 py-1 rounded-md uppercase italic">送信済</Badge></td>
                           <td className="p-5 font-mono text-gray-500 font-bold text-[10px]">{b.tel}<br/><span className="text-gray-300 font-normal">(未設定)</span></td>
                           <td className="p-5 text-gray-200">---</td>
                        </tr>
                       )) : (
                        <tr><td colSpan={11} className="p-40 text-center text-gray-300 font-black uppercase tracking-[0.4em] italic text-2xl">Loading Records from PMS...</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
           <div className="pt-4 text-xs font-bold text-gray-400 flex justify-between items-center px-4">
              <p>チェックイン端末未入金額合計：¥17,500 (現金：¥4,500 / 端末カード決済：¥13,000)</p>
           </div>
        </div>
        {editingBooking && <DmsBookingEditor booking={editingBooking.name_kanji ? editingBooking : null} onClose={() => setEditingBooking(null)} />}
      </main>
    </div>
  )
}
