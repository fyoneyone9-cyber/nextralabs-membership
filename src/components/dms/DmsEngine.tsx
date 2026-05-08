'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search, RefreshCw, Download, Plus, Moon, Sun, Edit3, Loader2, ChevronRight, Info
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

  // フォーム用State
  const [newPms, setNewPms] = useState({
    type: '',
    status: '有効',
    apiKey: '',
    memo: ''
  });

  // Staysee APIから予約一覧を取得
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
      try {
        setSession(JSON.parse(data));
      } catch (e) {
        console.error('Session parse error:', e);
      }
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
          const initial = [{ id: 'staysee-1', type: 'Staysee', status: '有効', memo: 'メインPMS連携（API開通済み）', apiKey: 'sk_b54ca47f884c30d98dc429d3cbbbc29c' }];
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
    if (!newPms.type || !newPms.apiKey) {
      alert('種別とAPIキーは必須です');
      return;
    }
    const item = { ...newPms, id: Date.now().toString() };
    setPmsList(prev => [...prev, item]);
    setPmsView('list');
    setNewPms({ type: '', status: '有効', apiKey: '', memo: '' });
  };

  if (!mounted) return null;

  const NavItem = ({ item, isSub = false }: { item: any, isSub?: boolean }) => (
    <button
      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
      className={"w-full flex items-center gap-3 px-6 py-3 transition-all " + 
        (activeTab === item.id 
          ? "bg-emerald-500/20 text-emerald-400 border-r-4 border-emerald-500 font-black" 
          : "text-slate-400 hover:bg-white/5 hover:text-white font-medium") + 
        (isSub ? " pl-12 text-xs" : " text-sm")}
    >
      <item.icon size={isSub ? 16 : 18} />
      <span>{item.label}</span>
    </button>
  );

  const headerClass = "bg-[#0a0b14] border-white/5";

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden bg-[#050507] text-slate-200 dark">
      
      {/* サイドナビゲーション */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transform transition-transform md:relative md:translate-x-0 " + headerClass + (isMobileMenuOpen ? " translate-x-0" : " -translate-x-full")}>
        <div className="p-6 border-b flex items-center justify-between border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">N</div>
            <span className="text-lg font-black tracking-tighter uppercase">Nextra AI DMS</span>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
          <div className="mt-2">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-6 py-3 text-slate-500 hover:text-inherit transition-colors font-bold text-sm">
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
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={"h-14 border-b px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm " + headerClass}>
          <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
               <Settings size={14} />
               <span>PMS設定</span>
               {pmsView === 'create' && <><ChevronRight size={12} /> <span className="text-white">新規登録</span></>}
             </div>
          </div>
          <div className="flex items-center gap-3">
            {isCloudSyncing && <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 animate-pulse"><RefreshCw size={10} className="animate-spin text-emerald-500" /><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Cloud Syncing</span></div>}
            <Button onClick={() => setPmsView('create')} size="sm" className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-bold h-8 rounded-lg text-xs px-4"><Plus size={14} className="mr-1" />新規登録</Button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'pms-settings' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {pmsView === 'list' ? (
                <>
                  <div className="flex justify-between items-center bg-[#0a0b14] border border-white/5 p-4 rounded-xl shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input placeholder="検索" className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-full text-xs w-64 outline-none focus:border-emerald-500 transition-all" />
                      </div>
                    </div>
                  </div>

                  <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-black/40 text-slate-500 font-bold border-b border-white/5">
                        <tr>
                          <th className="p-5">種別</th>
                          <th className="p-5">有効/無効</th>
                          <th className="p-5">管理用メモ</th>
                          <th className="p-5 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {pmsList.length > 0 ? pmsList.map((p) => (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <td className="p-5 font-black text-sm italic">{p.type}</td>
                            <td className="p-5">
                              <Badge className={p.status === '有効' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500'}>
                                {p.status}
                              </Badge>
                            </td>
                            <td className="p-5 text-slate-500 font-medium">{p.memo}</td>
                            <td className="p-5 text-right space-x-2">
                              <Button variant="outline" size="sm" onClick={() => togglePmsStatus(p.id)} className="text-[10px] h-8 px-4 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                                {p.status === '有効' ? '無効にする' : '有効にする'}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deletePms(p.id)} className="text-red-500 hover:bg-red-500/10 h-8 px-2">
                                <X size={16} />
                              </Button>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="p-40 text-center text-slate-600 font-black uppercase tracking-[0.3em] italic opacity-20 text-2xl">No Data</td></tr>
                        )}
                      </tbody>
                    </table>
                  </Card>
                </>
              ) : (
                <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <Card className="bg-[#0a0b14] border-white/5 rounded-[2rem] p-12 shadow-2xl space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 ml-1">種別<span className="text-red-500">*</span></label>
                        <select 
                          value={newPms.type}
                          onChange={e => setNewPms({...newPms, type: e.target.value})}
                          className="w-full bg-black/40 border-b-2 border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] transition-all appearance-none"
                        >
                          <option value="" className="bg-[#0a0b14]">選択してください</option>
                          {PMS_TYPES.map(t => <option key={t} value={t} className="bg-[#0a0b14]">{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 ml-1">有効/無効<span className="text-red-500">*</span></label>
                        <select 
                          value={newPms.status}
                          onChange={e => setNewPms({...newPms, status: e.target.value})}
                          className="w-full bg-black/40 border-b-2 border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] transition-all appearance-none"
                        >
                          <option value="有効" className="bg-[#0a0b14]">有効</option>
                          <option value="無効" className="bg-[#0a0b14]">無効</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 ml-1">サイトAPIキー<span className="text-red-500">*</span></label>
                      <input 
                        type="password"
                        value={newPms.apiKey}
                        onChange={e => setNewPms({...newPms, apiKey: e.target.value})}
                        placeholder="••••••••••••••••"
                        className="w-full bg-black/40 border-b-2 border-white/10 py-3 text-xl font-mono text-white outline-none focus:border-[#5c59cc] transition-all placeholder:text-slate-800"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">管理用メモ(任意)</label>
                      <textarea 
                        rows={3} 
                        value={newPms.memo}
                        onChange={e => setNewPms({...newPms, memo: e.target.value})}
                        className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-6 text-sm font-medium text-white outline-none focus:border-[#5c59cc] transition-all" 
                      />
                    </div>

                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-6">
                      {[
                        '【設定ガイド】',
                        '【PMS→スマートチェックイン(同期)の仕様】',
                        '【スマートチェックイン→PMS(チェックイン情報等の連携)の仕様】'
                      ].map(text => (
                        <div key={text} className="group cursor-pointer">
                          <p className="text-xs font-black text-emerald-500/60 group-hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-2">
                             <Info size={14} /> {text}
                          </p>
                          <div className="h-px w-8 bg-white/10 mt-2 group-hover:w-16 transition-all" />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
                      <Button onClick={() => setPmsView('list')} variant="ghost" className="px-12 h-14 rounded-2xl font-black text-slate-500 hover:text-white uppercase tracking-widest">Cancel</Button>
                      <Button onClick={handleSavePms} className="px-16 h-14 rounded-2xl bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black uppercase italic tracking-tighter shadow-2xl shadow-indigo-500/20 transition-all active:scale-95">💾 Save Settings</Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTab === 'checkin' && (
            <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[600px]">
              <div className="p-4 bg-black/10 flex justify-between items-center border-b border-white/5">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 font-black">本日</Badge>
                  <Badge variant="outline" className="opacity-50">明日</Badge>
                </div>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 text-slate-500">
                  <tr>
                    <th className="p-4">ステータス</th>
                    <th className="p-4">物件名</th>
                    <th className="p-4">部屋</th>
                    <th className="p-4">宿泊者</th>
                    <th className="p-4">予約元</th>
                    <th className="p-4">チェックイン</th>
                    <th className="p-4">チェックアウト</th>
                    <th className="p-4">連絡先</th>
                    <th className="p-4 text-right">詳細</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-white/5 text-slate-300">
                  {loadingBookings ? (
                    <tr><td colSpan={9} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>
                  ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-emerald-500/5 transition-colors group border-b border-white/5">
                        <td className="p-4">
                          <Badge className={`${booking.paid ? 'bg-emerald-500' : 'bg-red-500'} text-slate-950 font-black text-[10px] px-2 py-0.5 rounded`}>
                            {booking.paid ? 'PAID' : 'UNPAID'}
                          </Badge>
                        </td>
                        <td className="p-4 font-bold text-white text-xs">ビジネスホテルアップル</td>
                        <td className="p-4 font-black text-emerald-500 text-xs">Room {booking.allocate_rooms?.[0]?.room_id || 'TBA'}</td>
                        <td className="p-4">
                          <Link href={`/dms/bookings/${booking.id}`} className="text-indigo-400 font-black hover:underline text-sm uppercase tracking-tight block">{booking.name_kanji}</Link>
                        </td>
                        <td className="p-4 text-[10px] font-bold text-slate-500">STAYSEE</td>
                        <td className="p-4 text-[10px] font-bold text-slate-400">{booking.start_date}</td>
                        <td className="p-4 text-[10px] font-bold text-slate-400">{booking.end_date}</td>
                        <td className="p-4 text-[10px] font-mono text-slate-500">{booking.tel}</td>
                        <td className="p-4 text-right"><Link href={`/dms/bookings/${booking.id}`}><Button variant="ghost" size="sm" className="text-emerald-500 hover:bg-emerald-500/10"><ArrowRight size={16} /></Button></Link></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={9} className="p-20 text-center text-slate-600 font-black uppercase tracking-[0.3em] italic opacity-20 text-2xl">No Data</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {activeTab === 'property' && (
            <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[400px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/50 text-slate-500">
                    <tr><th className="p-4">物件名</th><th className="p-4">PMS</th><th className="p-4 text-center">操作</th></tr>
                  </thead>
                  <tbody className="divide-y border-white/5">
                    <tr className="hover:bg-emerald-500/5 transition-colors">
                      <td className="p-6 font-black text-indigo-400">ビジネスホテルアップル</td>
                      <td className="p-6">Staysee</td>
                      <td className="p-6 text-center">
                        <Button size="sm" className="bg-indigo-600" onClick={() => setEditingProperty({ name: 'ビジネスホテルアップル' })}><PenLine size={14} /></Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </Card>
          )}
        </div>

        {editingBooking && <DmsBookingEditor booking={editingBooking} isDarkMode={true} onClose={() => setEditingBooking(null)} />}
        {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => setEditingProperty(null)} />}
      </main>
    </div>
  )
}
