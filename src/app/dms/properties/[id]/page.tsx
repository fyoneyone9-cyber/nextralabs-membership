'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, Trash2, Save, ChevronRight, Building, Wifi, Clock, Globe, Phone, Info, Settings, Monitor, Printer, CreditCard
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function PropertyDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const Toggle = ({ label, active = false }: { label: string, active?: boolean }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-[11px] font-bold text-slate-600">{label}</span>
      <div className={"w-10 h-5 rounded-full relative transition-colors " + (active ? "bg-indigo-600" : "bg-slate-200")}>
        <div className={"absolute top-1 w-3 h-3 bg-white rounded-full transition-all " + (active ? "right-1" : "left-1")} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      {/* 🚀 ヘッダー */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <span>物件一覧</span><ChevronRight size={14} />
            <span className="text-slate-900 text-lg uppercase tracking-tighter">AAA 静岡市 shizuoka</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold h-9">プラン情報</Button>
          <Button variant="outline" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold h-9">アンケート情報</Button>
          <Button variant="destructive" size="sm" className="bg-red-600 font-bold h-9 rounded-lg">削除</Button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6 text-left">
        <div className="bg-slate-100/50 p-4 rounded-lg border border-slate-200 flex items-center gap-2 text-[10px] font-bold text-slate-500">
           <Info size={14} /> <span>※印の項目は、PMSと連携している場合は自動で同期されるため、DMS上で設定する必要はありません。</span>
        </div>

        {/* 🏨 連携情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block italic">連携先PMS</label>
            <p className="text-lg font-black text-slate-800">Beds24</p>
          </div>
          <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block italic">PMS上の物件ID</label>
            <p className="text-lg font-black text-slate-800 font-mono">165875</p>
          </div>
        </div>

        {/* 📋 物件基本設定 */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">物件名</label><Input value="AAA 静岡市 shizuoka (Dynamic shizuokakenn10)" readOnly className="font-bold h-10 bg-slate-50" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">wifi接続名</label><Input value="" placeholder="未入力" className="h-10" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">wifiパスワード</label><Input value="" placeholder="未入力" className="h-10" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">既定チェックイン時刻</label><Input value="15:00" className="h-10 font-bold text-center" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">既定チェックアウト時刻</label><Input value="11:00" className="h-10 font-bold text-center" /></div>
              </div>
            </div>
            <div className="space-y-4">
              <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">PROPキー</label><Input value="" placeholder="未入力" className="h-10" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">国</label><Input value="JP" className="h-10 font-bold text-center" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">郵便番号</label><Input value="" placeholder="000-0000" className="h-10 text-center" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">都道府県</label><Input value="静岡県" className="h-10 font-bold text-center" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 mb-1 block">市区町村</label><Input value="静岡市" className="h-10 font-bold text-center" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* 🖥️ フロント・タブレット設定 */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">フロントタブレット用設定</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
             <div className="space-y-1 divide-y divide-slate-50">
               <p className="text-[10px] font-black text-indigo-600 mb-2 uppercase tracking-widest">ゲスト個人情報 (代表者)</p>
               <Toggle label="住所" active={true} />
               <Toggle label="電話番号" active={true} />
               <Toggle label="生年月日" />
               <Toggle label="性別" />
               <Toggle label="職業" />
               <Toggle label="本人サイン" />
               <Toggle label="前泊地" />
               <Toggle label="後泊地" />
             </div>
             <div className="space-y-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">無人モード時 本人確認書類撮影</p>
                  <Toggle label="撮影機能を有効にする" active={true} />
                </div>
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">プリンタ・領収書設定</p>
                   <div className="grid grid-cols-1 gap-2">
                      <Toggle label="プリンタ使用有無" />
                      <Toggle label="鍵番号印刷有無" />
                      <Toggle label="部屋番号レシートにプランを印字" active={true} />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* 🛠️ アクション */}
        <footer className="pt-10 border-t border-slate-200 flex justify-center gap-4">
           <Button variant="outline" className="h-12 px-12 border-slate-300 font-bold rounded-xl text-slate-600" onClick={() => router.back()}>✕ キャンセル</Button>
           <Button className="h-12 px-20 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-100 uppercase italic">
             Update Configuration ➔
           </Button>
        </footer>
      </main>
    </div>
  )
}
