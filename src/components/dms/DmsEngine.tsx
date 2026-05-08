'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search, RefreshCw, Download, Plus, Moon, Sun, Edit3, Loader2, ChevronRight, Info, Calendar, Filter, User
} from 'lucide-react'
import DmsBookingEditor from './DmsBookingEditor'
import DmsPropertyEditor from './DmsPropertyEditor'
import { CloudPmsStorage } from '@/lib/cloud-pms-storage'

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

const PMS_TYPES = ['Beds24', 'Staysee', 'イージー会計', 'shs', 'suitebook', 'AIRHOST'];

export default function DmsEngine() {
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('checkin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [pmsView, setPmsView] = useState<'list' | 'create'>('list');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [pmsList, setPmsList] = useState<any[]>([]);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [currentDate, setCurrentDate] = useState('5/8(金)');

  const [newPms, setNewPms] = useState({
    type: '',
    status: '有効',
    apiKey: '',
    memo: ''
  });

  const fetchStayseeBookings = async () => {
    const savedPms = typeof window !== 'undefined' ? localStorage.getItem('dms_pms_list') : null;
    const list = savedPms ? JSON.parse(savedPms) : [];
    const activeStaysee = list.find((p: any) => p.type === 'Staysee' && p.status === '有効');
    
    if (!activeStaysee) {
      setBookings([]);
      return;
    }

    setLoadingBookings(true);
    try {
      const res = await fetch('/api/staysee/reservations?date=2026-05-08');
      const data = await res.json();
      if (data.reservations) {
        setBookings(data.reservations);
      }
    } catch (e) {
      console.error('Staysee fetch error:', e);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('dms_session');
    if (data) {
      try { setSession(JSON.parse(data)); } catch (e) {}
    }

    const initData = async () => {
      const cloudList = await CloudPmsStorage.fetchList();
      if (cloudList && cloudList.length > 0) {
        setPmsList(cloudList);
        localStorage.setItem('dms_pms_list', JSON.stringify(cloudList));
      } else {
        const savedPms = localStorage.getItem('dms_pms_list');
        if (savedPms) {
          setPmsList(JSON.parse(savedPms));
        } else {
          const initial = [{ id: 'staysee-1', type: 'Staysee', status: '有効', memo: 'メインPMS連携', apiKey: 'sk_b54ca47f884c30d98dc429d3cbbbc29c' }];
          setPmsList(initial);
          localStorage.setItem('dms_pms_list', JSON.stringify(initial));
          CloudPmsStorage.saveList(initial);
        }
      }
      fetchStayseeBookings();
    };
    initData();
  }, []);

  useEffect(() => {
    if (mounted && pmsList.length > 0) {
      localStorage.setItem('dms_pms_list', JSON.stringify(pmsList));
      const sync = async () => {
        setIsCloudSyncing(true);
        await CloudPmsStorage.saveList(pmsList);
        setIsCloudSyncing(false);
      };
      sync();
    }
  }, [pmsList]);

  const togglePmsStatus = (id: string) => {
    setPmsList(prev => prev.map(p => p.id === id ? { ...p, status: p.status === '有効' ? '無効' : '有効' } : p));
  };

  const deletePms = (id: string) => {
    if (confirm('PMS連携を解除しますか？')) {
      setPmsList(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSavePms = () => {
    if (!newPms.type || !newPms.apiKey) return;
    const item = { ...newPms, id: Date.now().toString() };
    setPmsList(prev => [...prev, item]);
    setPmsView('list');
    setNewPms({ type: '', status: '有効', apiKey: '', memo: '' });
  };

  if (!mounted) return null;

  const NavItem = ({ item, isSub = false }: { item: any, isSub?: boolean }) => (
    <button
      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
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
      
      {/* 🚀 サイドナビゲーション（Screenshot 1 / 左側） */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0a0b14] flex flex-col transform transition-transform md:relative md:translate-x-0 " + (isMobileMenuOpen ? " translate-x-0" : " -translate-x-full")}>
        <div className="p-6 border-b border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-3 text-emerald-500">
             <Calendar size={14} className="animate-pulse" />
             <span className="text-xl font-black italic tracking-tighter uppercase">{currentDate}</span>
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
            {isSettingsOpen && (
              <div className="bg-black/20">
                {SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-slate-800" /> 通話受付:OFF</div>
           <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> カメラ:ON</div>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg">N</div>
              <div className="text-[9px] font-black text-slate-500 leading-tight">有限会社黄金屋<br/>細井</div>
           </div>
           <button className="flex items-center gap-2 text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"><LogOut size={12}/> ログアウト</button>
        </div>
      </aside>

      {/* 🚀 メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ヘッダー・アクションバー（Screenshot 1 / 上部） */}
        <header className="h-16 border-b border-white/5 bg-[#0a0b14] px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3"><PenLine className="text-emerald-500" /> チェックイン一覧</h2>
             <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500"><RefreshCw size={18} /></button>
          </div>
          <div className="flex items-center gap-4">
             {isCloudSyncing && <RefreshCw size={14} className="animate-spin text-emerald-500" />}
             <Button className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black italic rounded-full h-10 px-6 text-xs shadow-lg shadow-indigo-500/20 tracking-tighter uppercase"><Plus size={14} className="mr-1" /> 手動宿泊作成</Button>
             <Button variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 h-10 rounded-full text-xs font-black italic px-6"><RefreshCw size={14} className="mr-1" /> 手動予約同期</Button>
             <div className="w-px h-6 bg-white/5 mx-2" />
             <Button variant="outline" className="border-white/5 text-slate-500 h-10 rounded-full text-xs font-black italic px-6 uppercase"><Download size={14} className="mr-1" /> CSVダウンロード</Button>
          </div>
        </header>

        {/* 🚀 リスト・ツールバー（Screenshot 1 & 2 / タブ部分） */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'checkin' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center bg-black/40 p-1.5 rounded-full border border-white/5">
                   {['今日', '明日', '日付指定', '全部屋', '部屋選択'].map((t, i) => (
                     <button key={t} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase italic transition-all ${i===0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-slate-600 hover:text-white'}`}>{t}</button>
                   ))}
                </div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black italic">➔ チェックイン 15</Badge>
                   <Badge className="bg-white/5 text-slate-600 border border-white/5 px-4 py-1.5 rounded-full text-[10px] font-black italic">➔ チェックアウト 6</Badge>
                   <Badge className="bg-white/5 text-slate-600 border border-white/5 px-4 py-1.5 rounded-full text-[10px] font-black italic">⌨ 滞在中 2</Badge>
                </div>
              </div>

              {/* 🚀 メインテーブル（Screenshot 1 & 2 / 本体） */}
              <Card className="bg-[#0a0b14] border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead className="bg-black/40 text-slate-600 font-black uppercase tracking-widest border-b border-white/5">
                      <tr>
                        <th className="p-6">ステータス</th>
                        <th className="p-6">物件名</th>
                        <th className="p-6">部屋</th>
                        <th className="p-6">人数 / 予約者</th>
                        <th className="p-6">予約元 / OTA予約番号</th>
                        <th className="p-6">PMS予約番号</th>
                        <th className="p-6">チェックイン</th>
                        <th className="p-6">チェックアウト</th>
                        <th className="p-6">事前チェックイン</th>
                        <th className="p-6">電話番号 / メール</th>
                        <th className="p-6 text-right">詳細</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {loadingBookings ? (
                        <tr><td colSpan={11} className="p-40 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>
                      ) : bookings.length > 0 ? (
                        bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-emerald-500/5 transition-colors group">
                            <td className="p-6">
                              <div className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full text-center italic shadow-[0_0_10px_rgba(16,185,129,0.3)]">confirmed</div>
                            </td>
                            <td className="p-6 font-bold text-slate-500">ビジネスホテルアップル</td>
                            <td className="p-6">
                               <p className="text-slate-600 font-bold text-[9px] uppercase">(未設定)</p>
                               <p className="text-white font-black text-sm">{b.allocate_rooms?.[0]?.room_id || '302'}</p>
                            </td>
                            <td className="p-6">
                               <p className="text-slate-600 font-bold text-[9px] uppercase">1</p>
                               <Link href={`/dms/bookings/${b.id}`} className="text-indigo-400 font-black text-sm uppercase hover:underline">{b.name_kanji}</Link>
                            </td>
                            <td className="p-6 font-black text-slate-500 uppercase italic">STAYSEE</td>
                            <td className="p-6 font-mono text-slate-400">{b.id}</td>
                            <td className="p-6 font-black italic">
                               {b.start_date.substring(5)}<br/>
                               <span className="text-slate-600 text-[9px] uppercase font-bold">予定(15:00)</span>
                            </td>
                            <td className="p-6 font-black italic">
                               {b.end_date.substring(5)}<br/>
                               <span className="text-slate-600 text-[9px] uppercase font-bold">予定(10:00)</span>
                            </td>
                            <td className="p-6">
                               <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase italic">送信済</Badge>
                            </td>
                            <td className="p-6">
                               <p className="font-mono text-xs">{b.tel}</p>
                               <p className="text-slate-600 font-bold text-[9px]">(未設定)</p>
                            </td>
                            <td className="p-6 text-right">
                               <Link href={`/dms/bookings/${b.id}`}>
                                 <Button variant="ghost" size="sm" className="text-emerald-500 hover:bg-emerald-500/10 rounded-xl"><ArrowRight size={18}/></Button>
                               </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={11} className="p-40 text-center text-slate-600 font-black uppercase tracking-[0.4em] italic opacity-20 text-3xl">No Reservation Found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'pms-settings' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {pmsView === 'list' ? (
                 <>
                   <div className="flex justify-between items-center bg-[#0a0b14] border border-white/5 p-4 rounded-xl shadow-2xl">
                     <div className="flex items-center gap-4">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                         <input placeholder="検索" className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-full text-xs w-64 outline-none focus:border-emerald-500 transition-all text-white" />
                       </div>
                     </div>
                   </div>
                   <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
                     <table className="w-full text-left text-[11px]">
                       <thead className="bg-black/40 text-slate-500 font-black border-b border-white/5 uppercase tracking-widest">
                         <tr><th className="p-5">種別</th><th className="p-5">有効/無効</th><th className="p-5">管理用メモ</th><th className="p-5 text-right">操作</th></tr>
                       </thead>
                       <tbody className="text-slate-300 divide-y divide-white/5">
                         {pmsList.map((p) => (
                           <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                             <td className="p-5 font-black text-sm italic">{p.type}</td>
                             <td className="p-5"><Badge className={p.status === '有効' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500'}>{p.status}</Badge></td>
                             <td className="p-5 text-slate-500 font-bold italic">{p.memo}</td>
                             <td className="p-5 text-right space-x-2">
                               <Button variant="outline" size="sm" onClick={() => togglePmsStatus(p.id)} className="text-[10px] h-8 px-4 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-black italic">切り替え</Button>
                               <Button variant="ghost" size="sm" onClick={() => deletePms(p.id)} className="text-red-500 hover:bg-red-500/10 h-8 px-2"><X size={16} /></Button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </Card>
                 </>
               ) : (
                 <Card className="bg-[#0a0b14] border-white/5 rounded-[3rem] p-16 shadow-2xl space-y-12 max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 gap-12">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">種別*</label>
                          <select value={newPms.type} onChange={e => setNewPms({...newPms, type: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-4 text-xl font-black italic text-white outline-none focus:border-[#5c59cc] transition-all appearance-none">{PMS_TYPES.map(t => <option key={t} value={t} className="bg-[#0a0b14]">{t}</option>)}</select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ステータス*</label>
                          <select value={newPms.status} onChange={e => setNewPms({...newPms, status: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-4 text-xl font-black italic text-white outline-none focus:border-[#5c59cc] transition-all appearance-none"><option value="有効" className="bg-[#0a0b14]">有効</option><option value="無効" className="bg-[#0a0b14]">無効</option></select>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">サイトAPIキー*</label>
                       <input type="password" value={newPms.apiKey} onChange={e => setNewPms({...newPms, apiKey: e.target.value})} placeholder="••••••••••••••••" className="w-full bg-black/40 border-b-2 border-white/10 py-4 text-2xl font-mono text-white outline-none focus:border-[#5c59cc] transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">管理用メモ</label>
                       <textarea rows={3} value={newPms.memo} onChange={e => setNewPms({...newPms, memo: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-8 text-sm font-bold text-white outline-none focus:border-[#5c59cc]" />
                    </div>
                    <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
                       <Button onClick={() => setPmsView('list')} variant="ghost" className="px-12 h-16 rounded-2xl font-black text-slate-500 hover:text-white uppercase tracking-widest italic">Cancel</Button>
                       <Button onClick={handleSavePms} className="px-20 h-16 rounded-2xl bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black uppercase italic tracking-tighter shadow-2xl transition-all active:scale-95">💾 Save Settings</Button>
                    </div>
                 </Card>
               )}
            </div>
          )}
        </div>

        {editingBooking && <DmsBookingEditor booking={editingBooking} isDarkMode={true} onClose={() => setEditingBooking(null)} />}
        {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => setEditingProperty(null)} />}
      </main>
    </div>
  )
}
