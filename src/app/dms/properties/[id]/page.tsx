'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, Trash2, Save, ChevronRight, Building, Wifi, Clock, Globe, Phone, Info, Settings, Monitor, Printer, CreditCard, Camera, Plus, Mail, ShieldCheck, Zap
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function PropertyDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const Toggle = ({ label, active = false }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-xs font-bold text-slate-300">{label}</span>
      <div className={"w-12 h-6 rounded-full relative transition-all cursor-pointer " + (active ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-800")}>
        <div className={"absolute top-1 w-4 h-4 bg-white rounded-full transition-all " + (active ? "right-1" : "left-1")} />
      </div>
    </div>
  )

  const ImageUploadBox = ({ label, hint }) => (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2 italic">{label}</label>
      <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center bg-black/40 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group cursor-pointer shadow-inner">
         <Plus className="mx-auto mb-2 text-slate-700 group-hover:text-emerald-500 transition-colors" />
         <p className="text-slate-400 text-sm font-black italic uppercase mb-1">ファイルをアップロード</p>
         <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{hint}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32 selection:bg-emerald-500/30">
      {/* 👑 ヘッダー - ダークモード仕様 */}
      <header className="bg-[#0a0b14]/80 backdrop-blur-md border-b border-white/5 px-8 py-6 flex items-center justify-between sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-3 bg-white/5 hover:bg-emerald-500/20 rounded-xl border border-white/5 transition-all text-emerald-500 shadow-inner">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              <span>物件一覧</span><ChevronRight size={12} className="text-emerald-500" /><span>Property Detail</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">ネクストラ・ベイサイド静岡</h1>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 font-black italic text-xs h-10 rounded-xl">プラン情報</Button>
          <Button variant="destructive" className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 font-black italic text-xs h-10 rounded-xl transition-all">削除</Button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 space-y-12">
        {/* 🏨 連携ステータス */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5"><Database size={80} /></div>
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 block italic">連携先PMS</label>
            <div className="flex items-center gap-4">
               <span className="text-4xl font-black text-white italic uppercase tracking-tighter">Beds24</span>
               <Badge className="bg-emerald-500 text-slate-950 font-black animate-pulse">Connected</Badge>
            </div>
          </Card>
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-inner relative overflow-hidden text-left">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block italic text-left">PMS上の物件ID</label>
            <p className="text-4xl font-black text-white font-mono tracking-widest">165875</p>
          </Card>
        </div>

        {/* 📋 セクション：環境・表示設定 */}
        <div className="space-y-8">
          <h3 className="text-xl font-black text-white border-l-8 border-orange-500 pl-6 uppercase italic tracking-widest flex items-center gap-4">
            <Monitor className="text-orange-500" /> 環境・表示設定
          </h3>
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 space-y-12 shadow-2xl text-left">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
                <div className="space-y-8 text-left">
                   <Toggle label="KIOSKガイドUI表示" active={true} />
                   <div className="space-y-4 text-left">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic block text-left">背景色設定 (上部グラデーション)</label>
                      <div className="h-28 w-full bg-gradient-to-r from-emerald-600/40 to-blue-900/40 rounded-[2rem] border-2 border-white/10 shadow-inner flex items-center justify-center">
                         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Nextra Theme Active</span>
                      </div>
                   </div>
                </div>
                <div className="space-y-8 text-left">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic block text-left">スライド切り替え時間</label>
                      <div className="flex items-center gap-4">
                        <Input value="5" className="bg-black border-2 border-white/10 h-14 w-32 rounded-2xl text-center text-xl font-black text-emerald-500" />
                        <span className="text-sm font-black text-slate-500 italic">SECONDS</span>
                      </div>
                   </div>
                   <div className="space-y-4 text-left text-left">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic block text-left">背景色設定 (下部グラデーション)</label>
                      <div className="h-28 w-full bg-gradient-to-r from-blue-950 to-slate-950 rounded-[2rem] border-2 border-white/10 shadow-inner" />
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* 📋 セクション：フロントタブレット用設定 */}
        <div className="space-y-8">
          <h3 className="text-xl font-black text-white border-l-8 border-emerald-500 pl-6 uppercase italic tracking-widest flex items-center gap-4 text-left">
            <Zap className="text-emerald-500" /> フロントタブレット用設定
          </h3>
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 space-y-12 shadow-2xl text-left">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
                <div className="space-y-2 bg-black/40 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                   <p className="text-[10px] font-black text-emerald-500 mb-6 uppercase tracking-widest text-center border-b border-white/5 pb-4">ゲスト個人情報の取得項目</p>
                   <div className="space-y-1">
                      <Toggle label="住所" active={true} /><Toggle label="電話番号" active={true} /><Toggle label="生年月日" /><Toggle label="性別" /><Toggle label="職業" /><Toggle label="本人サイン" active={true} /><Toggle label="前泊地・行先地" />
                   </div>
                </div>
                <div className="space-y-10">
                   <div className="space-y-4 text-left text-left">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-4 italic text-left text-left text-left">本人確認書類撮影プロトコル</p>
                      <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                        <Toggle label="無人モード時に有効化" active={true} />
                        <Toggle label="外国籍ゲストは必須" active={true} />
                      </div>
                   </div>
                   <div className="space-y-4 text-left">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic text-left">プリンタ・レシート設定</p>
                      <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                        <Toggle label="チェックイン時にレシート印刷" />
                        <Toggle label="暗証番号(PIN)を印字" active={true} />
                      </div>
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* 🛠️ アクション */}
        <footer className="pt-10 flex flex-col items-center gap-6">
           <Button className="h-24 px-24 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2rem] text-3xl shadow-[0_15px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase italic border-b-8 border-emerald-900 active:border-b-0">
             Save All Configuration ➔
           </Button>
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em] italic">Nextra AI Autonomous Management System</p>
        </footer>
      </main>
    </div>
  )
}