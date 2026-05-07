'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, Trash2, Send, Plus, PenLine, CheckCircle2, X, Save, Calendar, Clock, 
  User, Mail, Phone, Building, Key, ShieldCheck, ChevronRight, Lock
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function BookingDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      {/* 🚀 ヘッダーエリア */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <span>チェックイン一覧</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 text-lg">光来 吉田</span>
          </div>
        </div>
        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 font-bold h-9">
          <Trash2 size={16} className="mr-2" /> 削除
        </Button>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6 text-left">
        {/* 📋 基本情報グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">予約者</label>
            <p className="font-bold text-sm">光来 吉田</p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">予約者(ふりがな)</label>
            <p className="text-sm text-slate-300">---</p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">PMS予約番号</label>
            <p className="font-mono text-sm">84213531</p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">OTA予約番号</label>
            <p className="font-mono text-sm uppercase">HMJM9X2XWZ</p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">予約ID</label>
            <p className="font-mono text-[10px] text-slate-500 truncate">6dc10hv2w501gnf3471i</p>
          </div>
        </div>

        {/* 🏨 部屋・デバイス情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="col-span-1 border-slate-200 shadow-sm"><CardContent className="p-4"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">部屋ユニット*</label><select className="w-full bg-slate-50 border-slate-200 rounded px-3 py-2 text-sm font-bold"><option>プライベートリゾート清風 - SEIFU</option></select></CardContent></Card>
          <Card className="col-span-1 border-slate-200 shadow-sm"><CardContent className="p-4"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">部屋タイプ</label><p className="text-sm font-bold">プライベートリゾート清風</p></CardContent></Card>
          <Card className="col-span-1 border-slate-200 shadow-sm"><CardContent className="p-4"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">錠デバイス</label><div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Lock size={14} /> SPA固定</div></CardContent></Card>
          <Card className="col-span-1 border-slate-200 shadow-sm"><CardContent className="p-4"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">予約日時</label><p className="text-sm font-bold">2026/03/24 18:09</p></CardContent></Card>
        </div>

        {/* 📅 チェックイン・アウト詳細 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1"><label className="text-[10px] font-bold text-slate-400 mb-1 block text-left">チェックイン予定日*</label><Input value="2026-05-07" readOnly className="bg-slate-50 border-slate-200 h-10 font-bold" /></div>
              <div className="w-24"><label className="text-[10px] font-bold text-slate-400 mb-1 block text-left">予定時刻</label><Input value="11:00" readOnly className="bg-slate-50 border-slate-200 h-10 font-bold" /></div>
              <div className="flex-1 pb-1 text-left"><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">ステータス</p><p className="text-sm font-bold text-indigo-600 uppercase">未チェックイン</p></div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 font-bold text-xs rounded-xl">チェックイン日時を直接入力する</Button>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1"><label className="text-[10px] font-bold text-slate-400 mb-1 block text-left">チェックアウト予定日*</label><Input value="2026-05-08" readOnly className="bg-slate-50 border-slate-200 h-10 font-bold" /></div>
              <div className="w-24"><label className="text-[10px] font-bold text-slate-400 mb-1 block text-left">予定時刻</label><Input value="12:00" readOnly className="bg-slate-50 border-slate-200 h-10 font-bold" /></div>
              <div className="flex-1 pb-1 text-left"><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">ステータス</p><p className="text-sm font-bold text-indigo-600 uppercase">未チェックアウト</p></div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 font-bold text-xs rounded-xl">チェックアウト日時を直接入力する</Button>
            </div>
          </div>
          <div className="space-y-6 border-l border-slate-100 pl-8">
            <div className="flex items-center justify-between">
              <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 font-black italic uppercase text-xs shadow-lg rounded-xl text-white"><Send size={16} className="mr-2" /> 事前チェックインメールを手動送信</Button>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2"><div className="w-8 h-4 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" /></div><span className="text-[10px] font-bold text-slate-500">フロントへ誘導: 無効</span></div>
                <div className="flex items-center gap-2"><div className="w-8 h-4 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" /></div><span className="text-[10px] font-bold text-slate-500">アウト時フロントへ誘導: 無効</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 👥 宿泊者情報テーブル */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic text-left">宿泊者情報</h3>
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                  <tr><th className="p-4">名前 / メールアドレス</th><th className="p-4">郵便番号/住所/国籍</th><th className="p-4">チェックイン/アウト</th><th className="p-4">パスポート写真</th><th className="p-4">顔写真</th><th className="p-4">サイン画像</th><th className="p-4">カードキー</th><th className="p-4 text-center">操作</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600">
                  <tr>
                    <td className="p-4 font-bold">光来 吉田<br/><span className="text-slate-400">(未入力)</span></td>
                    <td className="p-4 text-slate-400 font-medium">(未入力)<br/>(未入力)<br/>(未入力)</td>
                    <td className="p-4 text-indigo-600 font-bold">(未チェックイン)<br/>(未チェックアウト)</td>
                    <td className="p-4 text-slate-300">-</td><td className="p-4 text-slate-300">-</td><td className="p-4 text-slate-300">-</td><td className="p-4 text-slate-300">-</td>
                    <td className="p-4 text-center"><button className="p-2 hover:bg-slate-100 rounded text-slate-400"><PenLine size={14} /></button></td>
                  </tr>
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} className="opacity-50">
                      <td className="p-4 text-slate-300">(未入力)</td><td className="p-4 text-slate-300">(未入力)</td><td className="p-4 text-slate-300">(未チェックイン)</td>
                      <td className="p-4 text-slate-300">-</td><td className="p-4 text-slate-300">-</td><td className="p-4 text-slate-300">-</td><td className="p-4 text-slate-300">-</td>
                      <td className="p-4 text-center"><button className="p-2 hover:bg-slate-100 rounded text-slate-300"><PenLine size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-left">
               <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-6 h-10 rounded-lg"><Plus size={16} className="mr-2" /> 宿泊者を追加</Button>
            </div>
          </Card>
        </div>

        {/* 🔐 PIN情報 */}
        <div className="space-y-2 text-left">
           <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">PIN情報</h3>
           <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
             PIN情報の自動同期(DMSで発行→スマートロック側システムへ送信)は、チェックイン日の2日前より、毎時10分ごろに行われます。
           </p>
        </div>

        {/* 🛠️ アクションフッター */}
        <footer className="pt-10 border-t border-slate-200 flex justify-center gap-4">
           <Button variant="outline" className="h-12 px-12 border-slate-300 font-bold rounded-xl text-slate-600" onClick={() => router.back()}>✕ キャンセル</Button>
           <Button className="h-12 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200"><Save size={18} className="mr-2" /> 更新</Button>
        </footer>
      </main>
    </div>
  )
}
