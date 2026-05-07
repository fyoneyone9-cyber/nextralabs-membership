'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  List, UserPlus, Lock, Camera, Building2, Settings, RefreshCw, 
  ArrowRight, ShieldCheck, Zap, Database, LogOut, LayoutDashboard
} from 'lucide-react'

const TABS = [
  { id: 'bookings', label: '予約一覧', icon: List },
  { id: 'checkin', label: '自動チェックイン', icon: UserPlus },
  { id: 'lock', label: '鍵発行管理', icon: Lock },
  { id: 'scan', label: '遺失物解析', icon: Camera },
  { id: 'settings', label: 'システム設定', icon: Settings },
];

export default function DmsEngine() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('dms_session');
    if (data) setSession(JSON.parse(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dms_session');
    window.location.href = '/dms/login';
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-4 md:p-10 flex flex-col">
      {/* 👑 DMS専用ヘッダー */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border-2 border-emerald-500/20 shadow-glow">
            <LayoutDashboard className="text-emerald-500" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Nextra <span className="text-emerald-500">DMS</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">{session?.storeName || 'Autonomous Management OS'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 px-4 py-1 font-black text-[10px]">ID: {session?.id || 'OPERATOR'}</Badge>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-500 hover:text-red-400 font-black uppercase text-[10px] italic">
            <LogOut className="mr-2 h-4 w-4" /> Exit System
          </Button>
        </div>
      </header>

      {/* 🧭 メインナビゲーション */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-glow scale-[1.03]' : 'bg-[#13141f] border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/30')}>
            <tab.icon size={28} className={activeTab === tab.id ? 'text-white' : 'text-emerald-500'} />
            <span className="text-xs font-black uppercase italic tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 🖥️ 各機能画面 */}
      <main className="flex-1">
        {activeTab === 'bookings' && (
          <div className="animate-in fade-in space-y-6">
            <div className="flex items-center justify-between bg-[#0a0b14] p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner">
               <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/50">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">PMS Sync: Active</span>
               </div>
               <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black h-10 px-8 rounded-xl shadow-lg transition-all active:scale-95 text-xs italic">
                 <RefreshCw className="mr-2 h-4 w-4" /> リアルタイム台帳同期
               </Button>
            </div>
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-black/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><th className="p-8">予約ID</th><th className="p-8">宿泊者名</th><th className="p-8">部屋</th><th className="p-8">ステータス</th><th className="p-8 text-center">詳細</th></tr></thead>
                <tbody className="text-sm font-bold">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-8 font-mono text-emerald-500">BK-8821</td><td className="p-8 text-white">米山 文貴 様</td><td className="p-8 text-white italic">201</td><td className="p-8"><Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">予約確定</Badge></td><td className="p-8 text-center"><ArrowRight className="mx-auto text-slate-700" /></td></tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-8 font-mono text-emerald-500">BK-8822</td><td className="p-8 text-white">デモ ゲスト 様</td><td className="p-8 text-white italic">205</td><td className="p-8"><Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30">清掃完了</Badge></td><td className="p-8 text-center"><ArrowRight className="mx-auto text-slate-700" /></td></tr>
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {activeTab === 'checkin' && (
          <Card className="bg-[#13141f] border-2 border-emerald-500/50 rounded-[4rem] p-20 text-center animate-in zoom-in-95 space-y-10 shadow-glow">
            <UserPlus size={80} className="text-emerald-500 mx-auto animate-pulse" />
            <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">自律チェックイン・OS</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed font-bold">身分証のAIスキャン ＆ PMS自動記帳プロトコルを開始します。</p>
            <Button className="h-24 px-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-2xl shadow-xl transition-all active:scale-95 uppercase italic">スキャン開始 ➔</Button>
          </Card>
        )}

        {activeTab === 'lock' && (
          <Card className="bg-[#13141f] border-2 border-emerald-500/50 rounded-[4rem] p-20 text-center animate-in zoom-in-95 space-y-10 shadow-glow">
            <Lock size={80} className="text-emerald-500 mx-auto" />
            <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">鍵発行デプロイ・エンジン</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed font-bold">PMSの予約期間をフックし、スマートロックへPINコードを自動デプロイします。</p>
            <Button className="h-24 px-16 bg-emerald-600 hover:bg-emerald-400 text-white font-black rounded-2xl text-2xl shadow-xl transition-all active:scale-95 uppercase italic">API連携実行 ➔</Button>
          </Card>
        )}
        
        {/* settings, scan 等も同様に構築 */}
      </main>

      <footer className="mt-12 text-center opacity-10 text-[9px] font-black uppercase tracking-[0.5em] italic">
        Nextra AI Autonomous OS • Operator Portal • 2026
      </footer>
    </div>
  )
}