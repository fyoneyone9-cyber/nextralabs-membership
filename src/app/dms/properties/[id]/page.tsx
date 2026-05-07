'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, Trash2, Save, ChevronRight, Building, Wifi, Clock, Globe, Phone, Info, Settings, Monitor, Printer, CreditCard, Camera, Plus, Mail
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function PropertyDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const Toggle = ({ label, active = false }) => (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[11px] font-bold text-slate-600">{label}</span>
      <div className={"w-10 h-5 rounded-full relative transition-colors cursor-pointer " + (active ? "bg-indigo-600" : "bg-slate-200")}>
        <div className={"absolute top-1 w-3 h-3 bg-white rounded-full transition-all " + (active ? "right-1" : "left-1")} />
      </div>
    </div>
  )

  const ImageUploadBox = ({ label, hint }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label>
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
         <p className="text-slate-400 text-xs font-bold mb-1 group-hover:text-indigo-600">ファイルを参加</p>
         <p className="text-[9px] text-slate-400 leading-relaxed">{hint}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20 text-left">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 text-left">
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

      <main className="max-w-[1600px] mx-auto p-6 space-y-8">
        {/* 📋 セクション：デザイン・表示設定 (画像1, 2準拠) */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 border-l-4 border-indigo-600 pl-4 uppercase italic">デザイン・表示設定</h3>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <Toggle label="ガイドUI表示" active={true} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">背景色設定(上部)</label>
                    <div className="h-24 w-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl border-4 border-white shadow-md" />
                    <Button variant="outline" size="xs" className="h-8 bg-emerald-600 text-white border-0 text-[10px] px-4 font-bold">デフォルトに戻す</Button>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center gap-4"><label className="text-[10px] font-bold text-slate-500">スライド切り替え...秒</label><Input value="5" className="w-20 h-8 text-center" /></div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">背景色設定(下部)</label>
                    <div className="h-24 w-full bg-gradient-to-r from-blue-700 to-indigo-900 rounded-xl border-4 border-white shadow-md" />
                    <Button variant="outline" size="xs" className="h-8 bg-emerald-600 text-white border-0 text-[10px] px-4 font-bold">デフォルトに戻す</Button>
                  </div>
               </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
               <ImageUploadBox label="広告A(上段)用画像" hint="・ファイルサイズの上限: 10MB  ・画像(.png / .jpeg)" />
               <div className="p-4 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 italic">広告B(上段ガイド棚代替)用画像: (ガイドUI表示を有効にしているため、広告B欄は無効です)</div>
               <ImageUploadBox label="広告C(下段)用画像" hint="・ファイルサイズの上限: 10MB  ・画像(.png / .jpeg)" />
            </div>
          </div>
        </section>

        {/* 📋 セクション：フロントタブレット用設定 (画像3, 4準拠) */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 border-l-4 border-indigo-600 pl-4 uppercase italic">フロントタブレット用設定</h3>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-1 divide-y divide-slate-50">
                  <p className="text-[10px] font-black text-indigo-600 mb-2 uppercase tracking-widest">ゲスト個人情報 (代表者)</p>
                  <Toggle label="住所" active={true} /><Toggle label="電話番号" active={true} /><Toggle label="生年月日" /><Toggle label="性別" /><Toggle label="職業" /><Toggle label="本人サイン" />
               </div>
               <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">本人確認書類撮影</p>
                    <Toggle label="無人モード時有効" active={true} />
                    <Toggle label="外国人の場合はスキップ" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">プリンタ設定</p>
                    <Toggle label="部屋番号レシートにプランを印字" active={true} />
                    <Toggle label="領収書の記名省略を認める" />
                  </div>
               </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 space-y-6">
               <ImageUploadBox label="ロゴ画像(ルームナンバー・領収書用)" hint="※印刷サイズは縦35px, 横128.93pxです(アスペクト比約3.7)。" />
               <ImageUploadBox label="朝食券画像" hint="※印刷サイズは縦170px, 横136pxです(アスペクト比0.8)。" />
            </div>
          </div>
        </section>

        {/* 📋 セクション：事前チェックイン用設定 (画像5準拠) */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 border-l-4 border-indigo-600 pl-4 uppercase italic">事前チェックイン用設定</h3>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
             <div className="flex flex-wrap gap-8">
                <Toggle label="予約直後に事前チェックイン案内メールを送信" />
                <div className="flex items-center gap-3"><label className="text-[10px] font-bold text-slate-500">チェックイン直前に再送...日前</label><Input value="1" className="w-16 h-8 text-center" /></div>
                <Toggle label="事前チェックイン後に部屋番号・暗証番号を表示" />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase">ホテルからのご連絡事項</label>
                <div className="flex gap-2 mb-2"><Badge className="bg-indigo-600">ENGLISH</Badge><Badge variant="outline">日本語</Badge></div>
                <textarea className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 ring-indigo-500/20" placeholder="Enter instructions here..." />
             </div>
             <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex gap-4">
                <Info className="text-emerald-500" size={24} />
                <div className="text-[10px] text-emerald-800 leading-relaxed font-bold">
                   <p className="uppercase mb-1">事前チェックインメールの送信ルールについて</p>
                   <p>・毎時5分に自動送信判定が行われます。</p>
                   <p>・チェックイン予定日時が現在より後の予約のみが送信対象となります。</p>
                </div>
             </div>
          </div>
        </section>

        <footer className="pt-10 flex justify-center gap-4">
           <Button variant="outline" className="h-12 px-12 font-bold rounded-xl text-slate-600" onClick={() => router.back()}>✕ 戻る</Button>
           <Button className="h-12 px-20 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg uppercase italic">Update All ➔</Button>
        </footer>
      </main>
    </div>
  )
}