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
import { useRouter } from 'next/navigation'

const MENU_ITEMS = [
  { id: 'checkin', label: 'チェックイン', icon: PenLine, href: '/dms' },
  { id: 'survey', label: 'アンケート回答', icon: MessageSquare, href: '/dms/survey' },
  { id: 'lost-property', label: '忘れ物管理', icon: Search, href: '/dms/lost-property' },
  { id: 'property', label: '物件', icon: Building, href: '/dms/properties' },
  { id: 'lock-list', label: '錠デバイス一覧', icon: Lock, href: '/dms/lock-list' },
  { id: 'terminals', label: 'チェックイン端末', icon: Monitor, href: '/dms/terminals' },
  { id: 'calls', label: '通話一覧(フロント)', icon: Video, href: '/dms/calls' },
  { id: 'reports', label: '宿泊実績定期報告', icon: FileBarChart, href: '/dms/reports' },
];

const SETTINGS_MENU = [
  { id: 'org-settings', label: '組織設定', icon: Users, href: '/dms/org-settings' },
  { id: 'pms-settings', label: 'PMS設定', icon: Database, href: '/dms/pms-settings' },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock, href: '/dms/lock-settings' },
];

export default function DmsEngine() {
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('checkin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [pmsList, setPmsList] = useState<any[]>([]);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [currentDate, setCurrentDate] = useState('5/8(金) 18:10');
  const router = useRouter();

  // 売上計算
  const totalDailyRevenue = bookings.reduce((sum, b) => sum + (Number(b.billing_amount) || 0), 0);
  const paidRevenue = bookings.filter(b => b.paid).reduce((sum, b) => sum + (Number(b.billing_amount) || 0), 0);

  const handleDownloadCsv = () => {
    if (bookings.length === 0) return;
    const headers = ["物件名","部屋番号","人数","予約者名","PMS予約番号","チェックイン予定","チェックアウト予定","電話番号","メールアドレス","宿泊金額","決済"];
    const rows = bookings.map(b => ["ビジネスホテルアップル",b.allocate_rooms?.[0]?.room_id || "",b.person_number || "1",b.name_kanji,b.id,`${b.start_date} ${b.check_in_time}`,`${b.end_date} ${b.check_out_time}`,b.tel,b.email || "",b.billing_amount,b.paid ? "済" : "未"]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchStayseeBookings = async () => {
    const savedPms = typeof window !== 'undefined' ? localStorage.getItem('dms_pms_list') : null;
    const list = savedPms ? JSON.parse(savedPms) : [];
    const activeStaysee = list.find((p: any) => p.type === 'Staysee' && p.status === '有効');
    if (!activeStaysee) { setBookings([]); return; }
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/staysee/reservations?date=2026-05-08');
      const data = await res.json();
      if (data.reservations) setBookings(data.reservations);
    } catch (e) {} finally { setLoadingBookings(false); }
  };

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('dms_session');
    if (data) { try { setSession(JSON.parse(data)); } catch (e) {} }
    const initData = async () => {
      const cloudList = await CloudPmsStorage.fetchList();
      if (cloudList && cloudList.length > 0) setPmsList(cloudList);
      else {
        const savedPms = localStorage.getItem('dms_pms_list');
        if (savedPms) setPmsList(JSON.parse(savedPms));
        else {
          const initial = [{ id: 'staysee-1', type: 'Staysee', status: '有効', memo: 'メインPMS連携', apiKey: 'sk_b54ca47f884c30d98dc429d3cbbbc29c' }];
          setPmsList(initial);
          localStorage.setItem('dms_pms_list', JSON.stringify(initial));
          CloudPmsStorage.saveList(initial);
        }
      }
    };
    initData();
  }, []);

  useEffect(() => { if (mounted) fetchStayseeBookings(); }, [mounted, pmsList]);

  if (!mounted) return null;

  const NavItem = ({ item, isSub = false }: { item: any, isSub?: boolean }) => (
    <Link
      href={item.href}
      className={"w-full flex items-center gap-3 px-6 py-4 transition-all " + 
        (activeTab === item.id 
          ? "bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 font-black" 
          : "text-slate-500 hover:bg-white/5 hover:text-white font-bold") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={18} className={activeTab === item.id ? "text-emerald-400" : "text-slate-600"} />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden bg-[#050507] text-slate-200 dark">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0a0b14] flex flex-col transform transition-transform md:relative md:translate-x-0">
        <div className="p-6 border-b border-white/5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-500"><Calendar size={14} className="animate-pulse" /><span className="text-xl font-black italic tracking-tighter uppercase">{currentDate}</span></div>
            {pmsList.some(p => p.type === 'Staysee' && p.status === '有効') ? <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black animate-pulse">PMS LIVE</Badge> : <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-[8px] font-black">PMS OFF</Badge>}
          </div>
          <div className="flex items-center gap-2 mt-2"><Badge className="bg-indigo-500/20 text-indigo-400 border-none text-[10px] font-black">14</Badge><Badge className="bg-purple-500/20 text-purple-400 border-none text-[10px] font-black">3</Badge></div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">{MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2"><button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-4 text-slate-600 hover:text-white transition-colors font-black text-sm"><div className="flex items-center gap-3"><Settings size={18} /><span>各種設定</span></div><ChevronDown size={14} className={isSettingsOpen ? "" : "-rotate-90"} /></button>
            {isSettingsOpen && <div className="bg-black/20">{SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}</div>}
          </div>
        </nav>
        <div className="p-6 mt-auto border-t border-white/5 space-y-4 text-left">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-slate-800" /> 通話受付:OFF</div>
           <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> カメラ:ON</div>
           <div className="text-[9px] font-black text-slate-500 leading-tight">有限会社黄金屋<br/>細井<br/><span className="opacity-40 text-[8px]">b.h.apple@beach.ocn...</span></div>
           <button className="flex items-center gap-2 text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"><LogOut size={12}/> ログアウト</button>
           <div className="text-[8px] font-bold text-slate-800 tracking-widest text-center pt-2">v3.50.2</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-left">
        <header className="h-16 border-b border-white/5 bg-[#0a0b14] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-6">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3"><PenLine className="text-emerald-500" /> チェックイン一覧</h2>
          </div>
          <div className="flex items-center gap-4">
             <Button onClick={() => setEditingBooking({})} className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black italic rounded-full h-10 px-6 text-xs shadow-lg tracking-tighter uppercase"><Plus size={14} className="mr-1" /> 手動宿泊作成</Button>
             <Button onClick={fetchStayseeBookings} variant="outline" className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 h-10 rounded-full text-xs font-black italic px-6"><RefreshCw size={14} className="mr-1" /> 手動予約同期</Button>
             <Button onClick={handleDownloadCsv} variant="outline" className="border-white/5 text-slate-500 h-10 rounded-full text-xs font-black italic px-6 uppercase"><Download size={14} className="mr-1" /> CSVダウンロード</Button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
           <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
             <div className="flex items-center bg-black/40 p-1.5 rounded-full border border-white/5">{['今日', '明日', '日付指定', '全部屋', '部屋選択'].map((t, i) => (<button key={t} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase italic transition-all ${i===0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-slate-600 hover:text-white'}`}>{t}</button>))}</div>
             <div className="flex items-center gap-3"><Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black italic">➔ チェックイン {bookings.length}</Badge><Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-full text-[10px] font-black italic">¥ 売上総額 {totalDailyRevenue.toLocaleString()}</Badge><Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black italic">💳 決済済 {paidRevenue.toLocaleString()}</Badge></div>
           </div>
           <Card className="bg-[#0a0b14] border-white/5 rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px]">
             <div className="overflow-x-auto"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-black/40 text-slate-600 font-black uppercase border-b border-white/5 tracking-widest"><tr><th className="p-6">ステータス</th><th className="p-6">物件名</th><th className="p-6">部屋</th><th className="p-6">人数 / 予約者</th><th className="p-6">予約元</th><th className="p-6">チェックイン</th><th className="p-6">チェックアウト</th><th className="p-6 text-right">詳細</th></tr></thead>
                 <tbody className="divide-y divide-white/5 text-slate-200">
                   {bookings.map(b => (
                     <tr key={b.id} className="hover:bg-emerald-500/5 transition-colors group">
                       <td className="p-6"><div className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full text-center italic">confirmed</div></td>
                       <td className="p-6 font-bold text-slate-400">ビジネスホテルアップル</td>
                       <td className="p-6 font-black text-white text-sm">{b.allocate_rooms?.[0]?.room_id || '---'}</td>
                       <td className="p-6"><p className="text-slate-500 font-bold text-[9px] uppercase">{b.person_number || '1'}</p><Link href={`/dms/bookings/${b.id}`} className="text-indigo-400 font-black text-sm uppercase hover:underline">{b.name_kanji}</Link></td>
                       <td className="p-6 font-black text-slate-400 uppercase italic">STAYSEE</td>
                       <td className="p-6 font-black italic text-white">{b.start_date.substring(5)}</td>
                       <td className="p-6 font-black italic text-white">{b.end_date.substring(5)}</td>
                       <td className="p-6 text-right"><Link href={`/dms/bookings/${b.id}`}><Button variant="ghost" size="sm" className="text-emerald-500 hover:bg-emerald-500/10 rounded-xl"><ArrowRight size={18}/></Button></Link></td>
                     </tr>
                   ))}
                 </tbody>
               </table></div></Card>
        </div>
        {editingBooking && <DmsBookingEditor booking={editingBooking.name_kanji ? editingBooking : null} onClose={() => setEditingBooking(null)} />}
      </main>
    </div>
  )
}
