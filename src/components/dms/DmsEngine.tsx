'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PenLine, MessageSquare, Building, Lock, Monitor, Video, Car, FileBarChart, 
  Settings, Users, Database, LogOut, LayoutDashboard, ChevronDown, Menu, X, ArrowRight, Search
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
    <div className="min-h-screen bg-[#050507] text-slate-200 flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0b14] border-b border-white/5">
        <span className="font-black italic uppercase">Nextra DMS</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X /> : <Menu />}</button>
      </div>

      <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0b14] border-r border-white/5 transform transition-transform md:relative md:translate-x-0 " + (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 flex items-center gap-3"><LayoutDashboard className="text-emerald-500" /><span className="text-xl font-black text-white italic">Nextra DMS</span></div>
        <nav className="flex-1 py-4">
          {MENU_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={"w-full flex items-center gap-3 px-6 py-3 transition-all " + (activeTab === item.id ? "bg-white/10 text-emerald-400 border-r-4 border-emerald-500 font-black" : "text-slate-400 font-bold")}>
              <item.icon size={18} /><span>{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-6 text-red-400 font-black mt-auto uppercase italic text-xs border-t border-white/5"><LogOut size={16} /> Exit System</button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-8"><h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{MENU_ITEMS.find(i => i.id === activeTab)?.label}</h2></header>
        {activeTab === 'checkin' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-black/30 flex justify-between"><div className="flex items-center gap-2"><Search size={18} /><input placeholder="検索..." className="bg-transparent outline-none" /></div><Button size="sm" className="bg-emerald-600">新規予約</Button></div>
            <table className="w-full text-left">
              <thead><tr className="bg-black/50 text-[10px] font-black text-slate-500 border-b border-white/5 uppercase tracking-widest"><th className="p-6">予約番号</th><th className="p-6">宿泊者名</th><th className="p-6">状況</th></tr></thead>
              <tbody><tr className="border-b border-white/5 font-bold"><td className="p-6 text-emerald-500 font-mono">BK-8821</td><td className="p-6 text-white">米山 文貴 様</td><td className="p-6"><Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">本人確認済</Badge></td></tr></tbody>
            </table>
          </Card>
        )}
        {activeTab !== 'checkin' && <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20 font-black uppercase italic tracking-widest text-2xl">Initializing {activeTab}...</div>}
      </main>
    </div>
  )
}