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

  const [newPms, setNewPms] = useState({ type: '', status: '有効', apiKey: '', memo: '' });
  const [newLock, setNewLock] = useState({ name: '', type: '', unit: '', roomType: '' });
  const [newPropName, setNewPropName] = useState('');

  // 売上計算
  const totalDailyRevenue = bookings.reduce((sum, b) => sum + (Number(b.billing_amount) || 0), 0);
  const paidRevenue = bookings.filter(b => b.paid).reduce((sum, b) => sum + (Number(b.billing_amount) || 0), 0);

  // CSVダウンロード機能（本物）
  const handleDownloadCsv = () => {
    if (bookings.length === 0) {
      alert('ダウンロードするデータがありません');
      return;
    }
    const headers = ["物件名","部屋番号","人数","予約者名","PMS予約番号","チェックイン予定","チェックアウト予定","電話番号","メールアドレス","宿泊金額","決済"];
    const rows = bookings.map(b => [
      "ビジネスホテルアップル",
      b.allocate_rooms?.[0]?.room_id || "",
      b.person_number || "1",
      b.name_kanji,
      b.id,
      `${b.start_date} ${b.check_in_time}`,
      `${b.end_date} ${b.check_out_time}`,
      b.tel,
      b.email || "",
      b.billing_amount,
      b.paid ? "済" : "未"
    ]);
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
    const list = pmsList.length > 0 ? pmsList : (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('dms_pms_list') || '[]') : []);
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
  useEffect(() => {
    if (mounted && pmsList.length > 0) {
      localStorage.setItem('dms_pms_list', JSON.stringify(pmsList));
      const sync = async () => { setIsCloudSyncing(true); await CloudPmsStorage.saveList(pmsList); setIsCloudSyncing(false); };
      sync();
    }
  }, [pmsList, mounted]);

  const togglePmsStatus = (id: string) => setPmsList(prev => prev.map(p => p.id === id ? { ...p, status: p.status === '有効' ? '無効' : '有効' } : p));
  const deletePms = (id: string) => { if (confirm('PMS連携を解除しますか？')) setPmsList(prev => prev.filter(p => p.id !== id)); };
  const handleSavePms = () => {
    if (!newPms.type || !newPms.apiKey) { alert('種別とAPIキーは必須です'); return; }
    setPmsList(prev => [...prev, { ...newPms, id: Date.now().toString() }]);
    setPmsView('list');
    setNewPms({ type: '', status: '有効', apiKey: '', memo: '' });
  };

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
        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
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
             <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
               {activeTab === 'checkin' ? <><PenLine className="text-emerald-500" /> チェックイン一覧</> : activeTab === 'property' ? <><Building className="text-emerald-500" /> 物件一覧</> : activeTab === 'lock-list' ? <><Lock className="text-emerald-500" /> 錠デバイス一覧</> : 'DMS Engine'}
               {pmsList.some(p => p.type === 'Staysee' && p.status === '有効') && activeTab === 'checkin' && <Badge variant="outline" className="ml-4 border-emerald-500/50 text-emerald-400 border-none text-[9px] font-black italic">SYNCING WITH STAYSEE</Badge>}
             </h2>
          </div>
          <div className="flex items-center gap-4">
             {activeTab === 'checkin' && (
               <>
                 <Button onClick={() => setEditingBooking({})} className="bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black italic rounded-full h-10 px-6 text-xs shadow-lg tracking-tighter uppercase"><Plus size={14} className="mr-1" /> 手動宿泊作成</Button>
                 <Button onClick={fetchStayseeBookings} variant="outline" className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 h-10 rounded-full text-xs font-black italic px-6"><RefreshCw size={14} className="mr-1" /> 手動予約同期</Button>
                 <Button onClick={handleDownloadCsv} variant="outline" className="border-white/5 text-slate-500 h-10 rounded-full text-xs font-black italic px-6 uppercase"><Download size={14} className="mr-1" /> CSVダウンロード</Button>
               </>
             )}
             {activeTab === 'property' && propView === 'list' && <Button onClick={() => setPropView('create')} className="bg-[#5c59cc] text-white font-black italic rounded-full h-10 px-6 text-xs"><Plus size={14} className="mr-1" /> 新規作成</Button>}
             {activeTab === 'lock-list' && lockView === 'list' && <Button onClick={() => setLockView('create')} className="bg-[#5c59cc] text-white font-black italic rounded-full h-10 px-6 text-xs"><Plus size={14} className="mr-1" /> 新規登録</Button>}
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'checkin' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center bg-black/40 p-1.5 rounded-full border border-white/5">{['今日', '明日', '日付指定', '全部屋', '部屋選択'].map((t, i) => (<button key={t} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase italic transition-all ${i===0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-slate-600 hover:text-white'}`}>{t}</button>))}</div>
                <div className="flex items-center gap-3"><Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black italic">➔ チェックイン {bookings.length}</Badge><Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-full text-[10px] font-black italic">¥ 売上総額 {totalDailyRevenue.toLocaleString()}</Badge><Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black italic">💳 決済済 {paidRevenue.toLocaleString()}</Badge></div>
              </div>
              <Card className="bg-[#0a0b14] border-white/5 rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px]">
                <div className="overflow-x-auto"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-black/40 text-slate-600 font-black uppercase border-b border-white/5 tracking-widest"><tr><th className="p-6">ステータス</th><th className="p-6">物件名</th><th className="p-6">部屋</th><th className="p-6">人数 / 予約者</th><th className="p-6">予約元 / OTA予約番号</th><th className="p-6">PMS予約番号</th><th className="p-6">チェックイン</th><th className="p-6">チェックアウト</th><th className="p-6">事前チェックイン</th><th className="p-6">電話番号 / メール</th><th className="p-6 text-right">詳細</th></tr></thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {loadingBookings ? (<tr><td colSpan={11} className="p-40 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>) : bookings.length > 0 ? (bookings.map(b => (
                        <tr key={b.id} className="hover:bg-emerald-500/5 transition-colors group"><td className="p-6"><div className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full text-center italic">confirmed</div></td><td className="p-6 font-bold text-slate-500">ビジネスホテルアップル</td><td className="p-6"><p className="text-white font-black text-sm">{b.allocate_rooms?.[0]?.room_id || '---'}</p></td><td className="p-6"><p className="text-slate-600 font-bold text-[9px] uppercase">{b.person_number || '1'}</p><Link href={`/dms/bookings/${b.id}`} className="text-indigo-400 font-black text-sm uppercase hover:underline">{b.name_kanji}</Link></td><td className="p-6 font-black text-slate-500 uppercase italic">{b.booking_number ? `OTA / ${b.booking_number}` : 'STAYSEE DIRECT'}</td><td className="p-6 font-mono text-slate-400">{b.id}</td><td className="p-6 font-black italic">{b.start_date.substring(5)}<br/><span className="text-slate-600 text-[9px] font-bold">予定({b.check_in_time})</span></td><td className="p-6 font-black italic">{b.end_date.substring(5)}<br/><span className="text-slate-600 text-[9px] font-bold">予定({b.check_out_time})</span></td><td className="p-6"><Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] font-black uppercase italic">送信済</Badge></td><td className="p-6"><p className="font-mono text-xs">{b.tel}</p><p className="text-slate-600 font-bold text-[9px]">{b.email || '(未設定)'}</p></td><td className="p-6 text-right"><Link href={`/dms/bookings/${b.id}`}><Button variant="ghost" size="sm" className="text-emerald-500 hover:bg-emerald-500/10 rounded-xl"><ArrowRight size={18}/></Button></Link></td></tr>
                      ))) : (<tr><td colSpan={11} className="p-40 text-center text-slate-600 font-black uppercase tracking-[0.4em] italic opacity-20 text-3xl">No Reservation Found</td></tr>)}
                    </tbody>
                  </table></div></Card>
            </>
          )}

          {activeTab === 'lock-list' && lockView === 'create' && (
            <div className="max-w-[1600px] mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
               <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl p-10"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"><div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">錠デバイスの識別名*</label><input value={newLock.name} onChange={e => setNewLock({...newLock, name: e.target.value})} placeholder="名前を入力してください" className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc]" /></div><div className="space-y-3 relative"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">錠デバイスタイプ*</label><select value={newLock.type} onChange={e => setNewLock({...newLock, type: e.target.value})} className="w-full bg-black/40 border-b-2 border-white/10 py-3 text-lg font-bold text-white outline-none focus:border-[#5c59cc] appearance-none"><option value="">選択してください</option>{LOCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select><ChevronDown size={16} className="absolute right-0 bottom-4 text-slate-600 pointer-events-none" /></div></div></Card>
               <div className="flex justify-center gap-4 pt-10"><Button onClick={() => setLockView('list')} variant="outline" className="px-12 h-12 rounded-lg font-black text-slate-500 uppercase">✕ キャンセル</Button><Button onClick={() => setLockView('list')} className="px-16 h-12 rounded-lg bg-[#5c59cc] text-white font-black uppercase italic italic shadow-lg">💾 登録</Button></div>
            </div>
          )}

          {activeTab === 'property' && propView === 'list' && (
             <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
                <table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-black/40 text-slate-600 font-black uppercase border-b border-white/5 tracking-widest"><tr><th className="p-5">物件名</th><th className="p-5">操作</th></tr></thead>
                   <tbody className="text-slate-300">
                      <tr className="hover:bg-white/5 transition-colors border-b border-white/5"><td className="p-6 font-bold">ビジネスホテルアップル</td><td className="p-6 text-right"><button onClick={() => setEditingProperty({ name: 'ビジネスホテルアップル' })} className="w-10 h-10 bg-[#5c59cc] rounded-full flex items-center justify-center text-white"><Edit3 size={18}/></button></td></tr>
                   </tbody>
                </table>
             </Card>
          )}

          {activeTab === 'pms-settings' && (
            <div className="space-y-6">
              {pmsView === 'list' ? (
                <Card className="bg-[#0a0b14] border-white/5 rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
                  <table className="w-full text-left text-[11px]"><thead className="bg-black/40 text-slate-500 font-black uppercase border-b border-white/5 tracking-widest"><tr><th className="p-5">種別</th><th className="p-5">有効/無効</th><th className="p-5 text-right">操作</th></tr></thead>
                    <tbody className="text-slate-300 divide-y divide-white/5">
                      {pmsList.map(p => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors group"><td className="p-5 font-black text-sm italic">{p.type}</td><td className="p-5"><Badge className={p.status === '有効' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-slate-800'}>{p.status}</Badge></td><td className="p-5 text-right space-x-2"><Button variant="outline" size="sm" onClick={() => togglePmsStatus(p.id)} className="text-[10px] h-8 px-4 font-black italic border-white/5">切り替え</Button><Button variant="ghost" size="sm" onClick={() => deletePms(p.id)} className="text-red-500 h-8 px-2"><X size={16} /></Button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
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

        {editingBooking && <DmsBookingEditor booking={editingBooking.name_kanji ? editingBooking : null} onClose={() => setEditingBooking(null)} />}
        {editingProperty && <DmsPropertyEditor property={editingProperty} isDarkMode={true} onClose={() => setEditingProperty(null)} />}
      </main>
    </div>
  )
}
