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
import { useSearchParams } from 'next/navigation'

const MENU_ITEMS = [
  { id: 'checkin', label: 'チェックイン', icon: PenLine, href: '/dms' },
  { id: 'survey', label: 'アンケート回答', icon: MessageSquare, href: '/dms/survey' },
  { id: 'property', label: '物件', icon: Building, href: '/dms?tab=property' },
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

const PMS_TYPES = ['Beds24', 'Staysee', 'イージー会計', 'shs', 'suitebook', 'AIRHOST'];
const LOCK_TYPES = ['RemoteLock', 'SwitchBot', 'ASSA ABLOY', 'dormakaba', 'SALTO', 'bitlock', 'SESAME', 'その他'];

export default function DmsEngine() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('checkin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [pmsView, setPmsView] = useState<'list' | 'create'>('list');
  const [propView, setPropView] = useState<'list' | 'create'>('list');
  const [lockView, setLockView] = useState<'list' | 'create'>('list');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [pmsList, setPmsList] = useState<any[]>([]);
  const [currentDate] = useState('5/8(金) 18:08');
  
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

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
      onClick={() => { if(item.href.startsWith('/dms?')) setActiveTab(item.id); setIsMobileMenuOpen(false); }}
      className={"w-full flex items-center gap-3 px-6 py-4 transition-all " + 
        (activeTab === item.id 
          ? "bg-[#f1f5f9] text-[#020617] border-r-4 border-[#020617] font-black" 
          : "text-slate-400 hover:bg-white/5 hover:text-white font-bold") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={18} className={activeTab === item.id ? "text-slate-900" : "text-slate-500"} />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden bg-white text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white flex flex-col transform transition-transform md:relative md:translate-x-0 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1"><span className="text-xs font-bold">{currentDate}</span></div>
          </div>
          <div className="flex items-center gap-1 mt-1">
             <Badge className="bg-[#e2e8f0] text-[#64748b] border-none text-[10px] font-bold px-2 py-0 h-4">12</Badge>
             <Badge className="bg-[#6366f1] text-white border-none text-[10px] font-bold px-2 py-0 h-4">6</Badge>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">{MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2"><button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-4 text-slate-500 hover:text-slate-900 font-bold text-sm"><div className="flex items-center gap-3"><Settings size={18} /><span>各種設定</span></div><ChevronDown size={14} className={isSettingsOpen ? "" : "-rotate-90"} /></button>
            {isSettingsOpen && <div className="bg-gray-50">{SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}</div>}
          </div>
        </nav>
        <div className="p-6 mt-auto border-t border-gray-100 space-y-4 text-left">
           <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold"><div className="w-2 h-2 rounded-full bg-gray-200" /> 通話受付:OFF</div>
           <div className="flex items-center gap-2 text-[10px] text-[#8b5cf6] font-bold"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> カメラ:ON</div>
           <div className="text-[10px] font-bold text-slate-900 leading-tight">有限会社黄金屋<br/>細井<br/><span className="text-slate-400 font-normal text-[8px]">b.h.apple@beach.ocn...</span></div>
           <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-[10px] font-bold"><LogOut size={12}/> ログアウト</button>
           <div className="text-[8px] text-gray-300 font-normal">v3.50.2</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-left bg-white">
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
               {activeTab === 'checkin' ? <><PenLine className="text-blue-600" /> チェックイン一覧</> : activeTab === 'property' ? <><Building className="text-blue-600" /> 物件一覧</> : activeTab === 'lock-list' ? <><Lock className="text-blue-600" /> 錠デバイス一覧</> : 'DMS Engine'}
             </h2>
             <button onClick={fetchStayseeBookings} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><RefreshCw size={18} /></button>
          </div>
          <div className="flex items-center gap-3">
             {activeTab === 'checkin' && (
               <>
                 <Button onClick={() => setEditingBooking({})} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-10 px-6 text-xs shadow-md">＋ 手動宿泊作成</Button>
                 <Button onClick={fetchStayseeBookings} variant="outline" className="border-[#10b981] text-[#10b981] hover:bg-emerald-50 h-10 rounded-full text-xs font-bold px-6">手動予約同期</Button>
                 <div className="relative group"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} /><input placeholder="予約検索" className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-xs w-48 outline-none focus:ring-2 ring-blue-500 text-gray-900" /></div>
                 <Button className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-bold rounded-full h-10 px-6 text-xs shadow-lg flex items-center gap-2 italic"><Download size={14}/> CSVダウンロード</Button>
               </>
             )}
             {activeTab === 'property' && <Button onClick={() => setPropView('create')} className="bg-blue-600 text-white font-bold rounded-full h-10 px-6 text-xs"><Plus size={14} className="mr-1" /> 新規作成</Button>}
          </div>
        </header>

        <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50 flex-1">
          {activeTab === 'checkin' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-gray-200">{['今日', '明日', '日付指定', '全部屋', '部屋選択'].map((t, i) => (<button key={t} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${i===0 ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-500 hover:text-gray-900'}`}>{t}</button>))}</div>
                <div className="flex items-center gap-3"><Badge className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold shadow-sm italic">➔ チェックイン 15</Badge><Badge className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold shadow-sm italic">➔ チェックアウト 6</Badge><Badge className="bg-[#1e293b] text-white border-none px-4 py-2 rounded-lg text-xs font-bold shadow-sm italic">⌨ 滞在中 2</Badge></div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-gray-50 text-gray-400 font-bold border-b border-gray-200 uppercase tracking-widest"><tr><th className="p-4 text-center">ステータス</th><th className="p-4">物件名</th><th className="p-4">部屋</th><th className="p-4 text-center">人数 / 予約者</th><th className="p-4">予約元 / OTA予約番号</th><th className="p-4">PMS予約番号</th><th className="p-4">チェックイン</th><th className="p-4 text-right">詳細</th></tr></thead><tbody className="divide-y divide-gray-100 text-gray-900">{bookings.map(b => (
                <tr key={b.id} className="hover:bg-blue-50/40 transition-colors"><td className="p-4 text-center"><Badge className="bg-[#10b981] text-white font-bold italic px-4 py-1.5 rounded-full text-[10px]">confirmed</Badge></td><td className="p-4 text-gray-500">ビジネスホテルアップル</td><td className="p-4 font-bold"><p className="text-gray-400 text-[9px] font-normal uppercase">(未設定)</p><span className="text-sm font-black">{b.allocate_rooms?.[0]?.room_id || '---'}</span></td><td className="p-4 text-center"><p className="text-gray-400 text-[9px] font-normal uppercase">{b.person_number || '1'}</p><Link href={`/dms/bookings/${b.id}`} className="text-blue-600 font-black text-sm uppercase hover:underline">{b.name_kanji}</Link></td><td className="p-4 font-black text-gray-500 uppercase italic">STAYSEE</td><td className="p-4 font-mono text-gray-600 font-bold">{b.id}</td><td className="p-4 font-bold">{b.start_date.substring(5)}</td><td className="p-4 text-right"><Link href={`/dms/bookings/${b.id}`}><Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-xl"><ArrowRight size={18}/></Button></Link></td></tr>
              ))}</tbody></table></div></div>
            </>
          )}

          {activeTab === 'property' && propView === 'list' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-gray-50 text-gray-400 font-bold border-b border-gray-200 tracking-widest"><tr><th className="p-5">物件名</th><th className="p-5 text-right">操作</th></tr></thead><tbody className="text-gray-900"><tr><td className="p-6 font-bold text-sm">ビジネスホテルアップル</td><td className="p-6 text-right"><button onClick={() => setEditingProperty({ name: 'ビジネスホテルアップル' })} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white"><Edit3 size={18}/></button></td></tr></tbody></table></div>
          )}
        </div>
        {editingBooking && <DmsBookingEditor booking={editingBooking.name_kanji ? editingBooking : null} onClose={() => setEditingBooking(null)} />}
        {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={false} onClose={() => setEditingProperty(null)} />}
      </main>
    </div>
  )
}
