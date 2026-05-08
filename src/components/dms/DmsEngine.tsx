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
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [pmsList, setPmsList] = useState<any[]>([]);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [currentDate, setCurrentDate] = useState('5/8(金) 17:45');

  const [newPms, setNewPms] = useState({ type: '', status: '有効', apiKey: '', memo: '' });
  const [newPropName, setNewPropName] = useState('');

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('dms_session');
    if (data) { try { setSession(JSON.parse(data)); } catch (e) {} }

    const initData = async () => {
      const cloudList = await CloudPmsStorage.fetchList();
      if (cloudList && cloudList.length > 0) {
        setPmsList(cloudList);
      } else {
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
      onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); setPropView('list'); setPmsView('list'); }}
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
            {isSettingsOpen && <div className="bg-black/20">{SETTINGS_MENU.map(sub => <NavItem key={sub.id} item={sub} isSub={true} />)}</div>}
          </div>
        </nav>
        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-slate-800" /> 通話受付:OFF</div>
           <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> カメラ:ON</div>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg">N</div>
              <div className="text-[9px] font-black text-slate-500 leading-tight">有限会社黄金屋<br/>細井<br/><span className="opacity-40">b.h.apple@beach.ocn...</span></div>
           </div>
           <button className="flex items-center gap-2 text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"><LogOut size={12}/> ログアウト</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/5 bg-[#0a0b14] px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
               {activeTab === 'property' && <Building className="text-emerald-500" />}
               {activeTab === 'property' ? '物件一覧' : activeTab === 'checkin' ? 'チェックイン一覧' : 'DMS Engine'}
             </h2>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
               <input placeholder="検索" className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs w-48 outline-none focus:border-emerald-500 transition-all" />
             </div>
          </div>
          <div className="flex items-center gap-4">
             {activeTab === 'property' && (
               <>
                 <Button onClick={() => setPropView('create')} className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black italic rounded-full h-10 px-6 text-xs shadow-lg tracking-tighter uppercase"><Plus size={14} className="mr-1" /> 新規作成</Button>
                 <Button variant="outline" className="border-[#5c59cc]/40 text-indigo-400 hover:bg-indigo-500/10 h-10 rounded-full text-xs font-black italic px-6"><RefreshCw size={14} className="mr-1" /> 物件・錠デバイス情報同期</Button>
               </>
             )}
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'property' && propView === 'list' && (
            <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-black/40 text-slate-600 font-black uppercase tracking-widest border-b border-white/5">
                  <tr><th className="p-5">物件名</th><th className="p-5">PMS連携</th><th className="p-5">住所</th><th className="p-5">部屋</th><th className="p-5">操作</th><th className="p-5">無人モード</th><th className="p-5 text-right">ログ</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="p-6 font-bold text-white">ビジネスホテルアップル</td>
                    <td className="p-6 text-slate-600">-</td>
                    <td className="p-6 text-slate-400">愛知県名古屋市中村区黄金通1-22</td>
                    <td className="p-6">
                      <Button variant="outline" size="sm" className="bg-[#5c59cc]/20 border-[#5c59cc]/40 text-[#a5a3ff] h-8 px-4 font-black italic rounded-lg flex items-center gap-2 uppercase tracking-tighter"><Building size={14} /> 部屋</Button>
                    </td>
                    <td className="p-6">
                      <button onClick={() => setEditingProperty({ name: 'ビジネスホテルアップル' })} className="w-10 h-10 bg-[#5c59cc] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><Edit3 size={18} /></button>
                    </td>
                    <td className="p-6">
                       <div className="w-12 h-6 bg-[#5c59cc] rounded-full relative cursor-pointer"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-md" /></div>
                    </td>
                    <td className="p-6 text-right">
                       <Button variant="outline" size="sm" className="bg-[#5c59cc]/20 border-[#5c59cc]/40 text-[#a5a3ff] h-8 px-4 font-black italic rounded-lg flex items-center gap-2 uppercase tracking-tighter"><BookText size={14} /> ログ</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          )}

          {activeTab === 'property' && propView === 'create' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest mb-4">
                  <span>物件一覧</span> <ChevronRight size={12}/> <span className="text-white">新規作成</span>
               </div>
               <Card className="bg-[#0a0b14] border-white/5 rounded-xl p-10 shadow-2xl space-y-12">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">物件名<span className="text-red-500 ml-1">*</span></label>
                     <input value={newPropName} onChange={e => setNewPropName(e.target.value)} placeholder="物件名を入力してください" className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] transition-all" />
                  </div>
                  <div className="flex justify-center gap-4 pt-10 border-t border-white/5">
                     <Button onClick={() => setPropView('list')} variant="outline" className="px-12 h-12 rounded-lg font-black text-slate-500 bg-white/5 border-white/5 uppercase tracking-widest">✕ キャンセル</Button>
                     <Button onClick={() => setPropView('list')} className="px-16 h-12 rounded-lg bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black uppercase italic tracking-tighter shadow-lg flex items-center gap-2"><Database size={16} /> 💾 保存して次へ</Button>
                  </div>
               </Card>
            </div>
          )}

          {/* ... checkin / pms-settings implementations remain as updated before ... */}
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
                  <tr><th className="p-4">ステータス</th><th className="p-4">物件名</th><th className="p-4">部屋</th><th className="p-4">宿泊者</th><th className="p-4">予約元</th><th className="p-4">チェックイン</th><th className="p-4">チェックアウト</th><th className="p-4">連絡先</th><th className="p-4 text-right">詳細</th></tr>
                </thead>
                <tbody className="divide-y border-white/5 text-slate-300">
                  {loadingBookings ? (<tr><td colSpan={9} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>) : bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-emerald-500/5 transition-colors group border-b border-white/5">
                      <td className="p-4"><Badge className={`${b.paid ? 'bg-emerald-500' : 'bg-red-500'} text-slate-950 font-black text-[10px] px-2 py-0.5 rounded`}>{b.paid ? 'PAID' : 'UNPAID'}</Badge></td>
                      <td className="p-4 font-bold text-white text-xs">ビジネスホテルアップル</td>
                      <td className="p-4 font-black text-emerald-500 text-xs">Room {b.allocate_rooms?.[0]?.room_id || 'TBA'}</td>
                      <td className="p-4"><Link href={`/dms/bookings/${b.id}`} className="text-indigo-400 font-black hover:underline text-sm uppercase block">{b.name_kanji}</Link></td>
                      <td className="p-4 text-[10px] font-bold text-slate-500">STAYSEE</td>
                      <td className="p-4 text-[10px] font-bold text-slate-400">{b.start_date}</td>
                      <td className="p-4 text-[10px] font-bold text-slate-400">{b.end_date}</td>
                      <td className="p-4 text-[10px] font-mono text-slate-500">{b.tel}</td>
                      <td className="p-4 text-right"><Link href={`/dms/bookings/${b.id}`}><Button variant="ghost" size="sm" className="text-emerald-500 hover:bg-emerald-500/10"><ArrowRight size={16} /></Button></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {activeTab === 'pms-settings' && (
            <div className="space-y-6">
              {pmsView === 'list' ? (
                <>
                  <div className="flex justify-between items-center bg-[#0a0b14] border border-white/5 p-4 rounded-xl shadow-2xl">
                    <Search className="text-slate-500" size={14} />
                    <input placeholder="検索" className="bg-transparent text-xs w-full ml-4 outline-none" />
                  </div>
                  <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
                    <table className="w-full text-left text-[11px]"><thead className="bg-black/40 text-slate-500 font-black uppercase border-b border-white/5"><tr><th className="p-5">種別</th><th className="p-5">有効/無効</th><th className="p-5">管理用メモ</th><th className="p-5 text-right">操作</th></tr></thead>
                      <tbody className="text-slate-300 divide-y divide-white/5">
                        {pmsList.map(p => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors group"><td className="p-5 font-black text-sm italic">{p.type}</td><td className="p-5"><Badge className={p.status === '有効' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800'}>{p.status}</Badge></td><td className="p-5 text-slate-500 font-bold italic">{p.memo}</td><td className="p-5 text-right space-x-2"><Button variant="outline" size="sm" onClick={() => togglePmsStatus(p.id)} className="text-[10px] h-8 px-4 font-black italic">切り替え</Button><Button variant="ghost" size="sm" onClick={() => deletePms(p.id)} className="text-red-500 h-8 px-2"><X size={16} /></Button></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </>
              ) : (
                <Card className="bg-[#0a0b14] border-white/5 rounded-[3rem] p-16 shadow-2xl space-y-12 max-w-5xl mx-auto">
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase">種別*</label><select value={newPms.type} onChange={e => setNewPms({...newPms, type: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-4 text-xl font-black text-white outline-none">{PMS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                      <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase">有効/無効*</label><select value={newPms.status} onChange={e => setNewPms({...newPms, status: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-4 text-xl font-black text-white outline-none"><option value="有効">有効</option><option value="無効">無効</option></select></div>
                   </div>
                   <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase">サイトAPIキー*</label><input type="password" value={newPms.apiKey} onChange={e => setNewPms({...newPms, apiKey: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-4 text-2xl font-mono text-white outline-none" /></div>
                   <div className="flex justify-end gap-6 pt-10"><Button onClick={() => setPmsView('list')} variant="ghost">Cancel</Button><Button onClick={handleSavePms} className="bg-[#5c59cc] text-white font-black italic shadow-2xl">💾 Save Settings</Button></div>
                </Card>
              )}
            </div>
          )}
        </div>

        {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => setEditingProperty(null)} />}
      </main>
    </div>
  )
}
