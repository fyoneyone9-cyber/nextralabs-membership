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
  { id: 'checkin', label: 'チェックイン', icon: PenLine },
  { id: 'survey', label: 'アンケート回答', icon: MessageSquare },
  { id: 'property', label: '物件', icon: Building },
  { id: 'lock-list', label: '錠デバイス一覧', icon: Lock },
  { id: 'terminals', label: 'チェックイン端末', icon: Monitor },
  { id: 'calls', label: '通話一覧(フロント)', icon: Video },
  { id: 'cars', label: '車両情報', icon: Car },
  { id: 'reports', label: '宿泊実績定期報告', icon: FileBarChart },
];

const SETTINGS_MENU = [
  { id: 'org-settings', label: '組織設定', icon: Users },
  { id: 'pms-settings', label: 'PMS設定', icon: Database },
  { id: 'lock-settings', label: 'ロック設定', icon: Lock },
];

const PMS_TYPES = ['Beds24', 'Staysee', 'イージー会計', 'shs', 'suitebook', 'AIRHOST'];
const LOCK_TYPES = ['RemoteLock', 'SwitchBot', 'ASSA ABLOY', 'dormakaba', 'SALTO', 'bitlock', 'SESAME', 'その他'];

export default function DmsEngine() {
  const [session, setSession] = useState<any>(null);
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
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [currentDate, setCurrentDate] = useState('5/8(金) 17:47');

  // 売上計算ロジック
  const totalDailyRevenue = bookings.reduce((sum, b) => sum + (Number(b.billing_amount) || 0), 0);
  const paidRevenue = bookings.filter(b => b.paid).reduce((sum, b) => sum + (Number(b.billing_amount) || 0), 0);

  // CSVダウンロード機能
  const handleDownloadCsv = () => {
    if (bookings.length === 0) return;
    
    // ヘッダー（CSV生データに基づく）
    const headers = ["物件名","部屋番号","人数","予約者名","PMS予約番号","チェックイン予定","チェックイン実績","チェックアウト予定","チェックアウト実績","電話番号","メールアドレス","宿泊金額","決済済金額"];
    
    const rows = bookings.map(b => [
      "ビジネスホテルアップル",
      b.allocate_rooms?.[0]?.room_id || "",
      b.person_number || "1",
      b.name_kanji,
      b.id,
      b.start_date,
      b.check_in_date_time || "",
      b.end_date,
      b.check_out_date_time || "",
      b.tel,
      b.email,
      b.billing_amount,
      b.paid ? b.billing_amount : "0"
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [newPms, setNewPms] = useState({ type: '', status: '有効', apiKey: '', memo: '' });
  const [newLock, setNewLock] = useState({ name: '', type: '', unit: '', roomType: '' });

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
      }
      fetchStayseeBookings();
    };
    initData();
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('dms_pms_list', JSON.stringify(pmsList));
      CloudPmsStorage.saveList(pmsList);
    }
  }, [pmsList]);

  const fetchStayseeBookings = async () => {
    const list = pmsList.length > 0 ? pmsList : JSON.parse(localStorage.getItem('dms_pms_list') || '[]');
    const activeStaysee = list.find((p: any) => p.type === 'Staysee' && p.status === '有効');
    if (!activeStaysee) { setBookings([]); return; }
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/staysee/reservations?date=2026-05-08');
      const data = await res.json();
      if (data.reservations) setBookings(data.reservations);
    } catch (e) {} finally { setLoadingBookings(false); }
  };

  const togglePmsStatus = (id: string) => setPmsList(prev => prev.map(p => p.id === id ? { ...p, status: p.status === '有効' ? '無効' : '有効' } : p));
  const deletePms = (id: string) => { if (confirm('PMS連携を解除しますか？')) setPmsList(prev => prev.filter(p => p.id !== id)); };

  if (!mounted) return null;

  const NavItem = ({ item, isSub = false }: { item: any, isSub?: boolean }) => (
    <button
      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); setPropView('list'); setPmsView('list'); setLockView('list'); }}
      className={"w-full flex items-center gap-3 px-6 py-4 transition-all " + 
        (activeTab === item.id 
          ? "bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 font-black" 
          : "text-slate-500 hover:bg-white/5 hover:text-white font-bold") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={18} className={activeTab === item.id ? "text-emerald-400" : "text-slate-600"} />
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden bg-[#050507] text-slate-200 dark">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0a0b14] flex flex-col transform transition-transform md:relative md:translate-x-0">
        <div className="p-6 border-b border-white/5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-500">
               <Calendar size={14} className="animate-pulse" />
               <span className="text-xl font-black italic tracking-tighter uppercase">{currentDate}</span>
            </div>
            {pmsList.some(p => p.type === 'Staysee' && p.status === '有効') ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black animate-pulse">PMS LIVE</Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-[8px] font-black">PMS OFF</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
             <Badge className="bg-indigo-500/20 text-indigo-400 border-none text-[10px] font-black">14</Badge>
             <Badge className="bg-purple-500/20 text-purple-400 border-none text-[10px] font-black">3</Badge>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-4 text-slate-600 hover:text-white transition-colors font-black text-sm">
              <div className="flex items-center gap-3"><Settings size={18} /><span>各種設定</span></div>
              <ChevronDown size={14} className={isSettingsOpen ? "" : "-rotate-90"} />
            </button>
            {isSettingsOpen && <div className="bg-black/20">{SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}</div>}
          </div>
        </nav>
        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-slate-800" /> 通話受付:OFF</div>
           <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> カメラ:ON</div>
           <div className="flex items-center gap-3">
              <div className="text-[9px] font-black text-slate-500 leading-tight">有限会社黄金屋<br/>細井<br/><span className="opacity-40 text-[8px]">b.h.apple@beach.ocn...</span></div>
           </div>
           <button className="flex items-center gap-2 text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"><LogOut size={12}/> ログアウト</button>
           <div className="text-[8px] font-bold text-slate-800 tracking-widest text-center pt-2">v3.50.2</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/5 bg-[#0a0b14] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
               {activeTab === 'lock-list' && <Lock size={14} className="text-emerald-500 mr-1" />}
               <span>{activeTab === 'lock-list' ? '錠デバイス一覧' : activeTab === 'property' ? '物件一覧' : 'チェックイン一覧'}</span>
               {pmsList.some(p => p.type === 'Staysee' && p.status === '有効') && (
                 <Badge variant="outline" className="ml-4 border-emerald-500/50 text-emerald-500 font-black text-[9px] px-2 py-0">SYNCING WITH STAYSEE</Badge>
               )}
               {activeTab === 'lock-list' && lockView === 'create' && <><ChevronRight size={12} /> <span className="text-white">(未入力)</span></>}
             </h2>
          </div>
          <div className="flex items-center gap-3">
             {activeTab === 'lock-list' && lockView === 'list' && (
               <Button onClick={() => setLockView('create')} size="sm" className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-bold h-8 rounded-lg text-xs px-4"><Plus size={14} className="mr-1" />新規登録</Button>
             )}
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          {/* 🚀 錠デバイス一覧 新規登録画面 (Screenshot @ 17:47) */}
          {activeTab === 'lock-list' && lockView === 'create' && (
            <div className="max-w-[1600px] mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
               <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">分かりやすい錠デバイスの識別名<span className="text-red-500 ml-1">*</span></label>
                        <input value={newLock.name} onChange={e => setNewLock({...newLock, name: e.target.value})} placeholder="名前を入力してください" className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] transition-all" />
                     </div>
                     <div className="space-y-3 relative">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">錠デバイスタイプ<span className="text-red-500 ml-1">*</span></label>
                        <select value={newLock.type} onChange={e => setNewLock({...newLock, type: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] transition-all appearance-none">
                           <option value="">選択してください</option>
                           {LOCK_TYPES.map(t => <option key={t} value={t} className="bg-[#0a0b14]">{t}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-0 bottom-4 text-slate-600 pointer-events-none" />
                     </div>
                     <div className="space-y-3 relative">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">紐づく部屋ユニット<span className="text-red-500 ml-1">*</span></label>
                        <select value={newLock.unit} onChange={e => setNewLock({...newLock, unit: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] transition-all appearance-none">
                           <option value="">選択してください</option>
                           <option value="SEIFU">プライベートリゾート清風</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-0 bottom-4 text-slate-600 pointer-events-none" />
                     </div>
                     <div className="space-y-3 relative">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">紐づく部屋タイプ(部屋タイプ単位で紐づける場合のみ)</label>
                        <select value={newLock.roomType} onChange={e => setNewLock({...newLock, roomType: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] transition-all appearance-none">
                           <option value="">選択してください</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-0 bottom-4 text-slate-600 pointer-events-none" />
                     </div>
                  </div>
               </Card>

               <div className="flex justify-center gap-4 pt-10">
                  <Button onClick={() => setLockView('list')} variant="outline" className="px-12 h-12 rounded-lg font-black text-slate-500 bg-white/5 border-white/5 uppercase tracking-widest">✕ キャンセル</Button>
                  <Button onClick={() => setLockView('list')} className="px-16 h-12 rounded-lg bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black uppercase italic tracking-tighter shadow-lg flex items-center gap-2">💾 登録</Button>
               </div>
            </div>
          )}

          {/* 既存の各リストUIは継承 */}
          {activeTab === 'checkin' && (
             <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[600px]">
                <table className="w-full text-left text-[11px]"><thead className="bg-black/50 text-slate-500"><tr><th className="p-4">ステータス</th><th className="p-4">物件名</th><th className="p-4">部屋</th><th className="p-4">宿泊者</th><th className="p-4 text-right">詳細</th></tr></thead>
                   <tbody className="divide-y border-white/5 text-slate-300">
                      {bookings.map(b => (
                         <tr key={b.id} className="hover:bg-emerald-500/5 transition-colors border-b border-white/5"><td className="p-4"><Badge className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded">confirmed</Badge></td><td className="p-4 font-bold text-white text-xs">ビジネスホテルアップル</td><td className="p-4 font-black text-emerald-500 text-xs">{b.allocate_rooms?.[0]?.room_id || '302'}</td><td className="p-4"><Link href={`/dms/bookings/${b.id}`} className="text-indigo-400 font-black hover:underline text-sm uppercase">{b.name_kanji}</Link></td><td className="p-4 text-right"><Link href={`/dms/bookings/${b.id}`}><Button variant="ghost" size="sm" className="text-emerald-500"><ArrowRight size={16}/></Button></Link></td></tr>
                      ))}
                   </tbody>
                </table>
             </Card>
          )}

          {activeTab === 'property' && propView === 'list' && (
             <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden"><table className="w-full text-left text-[11px]"><thead className="bg-black/40 text-slate-600 font-black uppercase tracking-widest border-b border-white/5"><tr><th className="p-5">物件名</th><th className="p-5">操作</th></tr></thead><tbody className="text-slate-300"><tr><td className="p-6 font-bold">ビジネスホテルアップル</td><td className="p-6"><button onClick={() => setEditingProperty({ name: 'ビジネスホテルアップル' })} className="w-10 h-10 bg-[#5c59cc] rounded-full flex items-center justify-center text-white"><Edit3 size={18}/></button></td></tr></tbody></table></Card>
          )}
        </div>

        {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => setEditingProperty(null)} />}
      </main>
    </div>
  )
}
