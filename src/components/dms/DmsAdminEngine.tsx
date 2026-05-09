'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, UserCog, Video, Search, Plus, PenLine, LogOut, LayoutDashboard, Menu, X, FileText, Settings, ShieldCheck, Mail, Phone
} from 'lucide-react'

const ADMIN_MENU = [
  { id: 'clients', label: 'クライアント', icon: UserCog },
  { id: 'managers', label: '管理者', icon: Users },
  { id: 'guidance', label: 'ガイダンス動画', icon: Video },
];

export default function DmsAdminEngine() {
  const [activeTab, setActiveTab] = useState('clients');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem('dms_session');
    window.location.href = '/dms/login';
  };

  const CLIENTS = [
    { name: 'C&C', email: 'uchida@hagi-s.jp', tel: '(未設定)', userCount: 1, logCount: 12 },
    { name: '(株)ホテルエース', email: 'miki-tanaka@hotel-ace.co.jp', tel: '(未設定)', userCount: 3, logCount: 45 },
    { name: 'BCM株式会社', email: 'kapuseruhotelasahipuraza@gmail.com', tel: '(未設定)', userCount: 2, logCount: 8 },
    { name: 'demo', email: 'info@hotel-melissa.com', tel: '(未設定)', userCount: 1, logCount: 3 },
  ];

  const MANAGERS = [
    { name: 'admin@kujira.co.jp', role: '管理者', email: 'admin@kujira.co.jp', tel: '08029877828' },
    { name: '雁藤 久仁子', role: '導入支援', email: 'kunikogando.kjr@gmail.com', tel: '(未設定)' },
    { name: '米山 文貴', role: '導入支援', email: 'humitakayoneyama.kjr@gmail.com', tel: '(未設定)' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* 🏰 サイドナビ（管理者用） */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform md:relative md:translate-x-0 " + (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex flex-col gap-1">
             <div className="text-[20px] font-bold text-slate-800 tracking-tighter">5/7(木)14:33</div>
             <div className="flex gap-2">
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-400"><Users size={12}/> 29</div>
                <div className="flex items-center gap-1 bg-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold text-white"><PenLine size={12}/> 2</div>
             </div>
          </div>
        </div>
        <nav className="flex-1 py-4 bg-white">
          {ADMIN_MENU.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={"w-full flex items-center gap-3 px-6 py-4 transition-all " + (activeTab === item.id ? "bg-slate-100 text-slate-900 border-r-4 border-slate-800 font-bold" : "text-slate-500 hover:bg-slate-50 font-medium")}>
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Master Admin</p>
          <p className="text-xs font-bold text-slate-700 truncate mb-4">f.yoneyone9@gmail.com</p>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 text-xs font-bold transition-colors"><LogOut size={14} /> ログアウト</button>
          <p className="text-[8px] text-slate-300 font-bold mt-4">v3.50.1</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-12 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} /></button>
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               {activeTab === 'clients' ? 'クライアント一覧' : '管理者一覧'}
               <div className="relative ml-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input placeholder="検索" className="pl-10 pr-4 py-1.5 bg-slate-100 border-2 border-slate-200 rounded-full text-xs w-64 outline-none" />
               </div>
             </h2>
           </div>
           <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-full px-6"><Plus size={16} className="mr-1" />新規登録</Button>
        </header>

        <div className="p-8 overflow-y-auto">
          {activeTab === 'clients' && (
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                  <tr><th className="p-4">名前</th><th className="p-4">メールアドレス</th><th className="p-4">電話番号</th><th className="p-4">ユーザー</th><th className="p-4">ログ</th><th className="p-4 text-center">操作</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {CLIENTS.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-700">{c.name}</td>
                      <td className="p-4 text-slate-600">{c.email}</td>
                      <td className="p-4 text-slate-400">{c.tel}</td>
                      <td className="p-4"><Button size="xs" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded text-[9px]"><Users size={12} className="mr-1"/> ユーザー</Button></td>
                      <td className="p-4"><Button size="xs" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded text-[9px]"><FileText size={12} className="mr-1"/> ログ</Button></td>
                      <td className="p-4 text-center"><button className="p-1 hover:bg-slate-100 rounded text-slate-400"><PenLine size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {activeTab === 'managers' && (
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                  <tr><th className="p-4">名前</th><th className="p-4">権限</th><th className="p-4">メールアドレス</th><th className="p-4">電話番号</th><th className="p-4 text-center">操作</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MANAGERS.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-700">{m.name}</td>
                      <td className="p-4 text-slate-600">{m.role}</td>
                      <td className="p-4 text-slate-600">{m.email}</td>
                      <td className="p-4 text-slate-600">{m.tel}</td>
                      <td className="p-4 text-center"><button className="p-1 hover:bg-slate-100 rounded text-slate-400"><PenLine size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}