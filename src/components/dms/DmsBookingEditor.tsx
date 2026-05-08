'use client';

import React from 'react';
import { 
  X, User, Phone, Mail, Calendar, MapPin, 
  CreditCard, Key, ShieldCheck, Save, Trash2, 
  Clock, Hash, Building2, Send, ChevronRight, Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DmsBookingEditorProps {
  booking: any;
  onClose: () => void;
  isDarkMode: boolean;
}

const DmsBookingEditor: React.FC<DmsBookingEditorProps> = ({ booking, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[1400px] bg-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* 🟥 Top Banner / Title */}
        <div className="bg-[#f8f9fa] border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit3 size={18} className="text-gray-500" />
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              チェックイン一覧 <ChevronRight size={14} className="text-gray-400" /> 
              <span className="text-black font-black uppercase">{booking?.name || 'SEKIDO KENJI'}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-2 hover:bg-red-700 transition-colors">
              <Trash2 size={14} /> 削除
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded transition-colors">
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-10 text-xs text-gray-700">
          
          {/* 🟦 Top Metadata Grid (Inputs like the image) */}
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">予約名*</label>
              <input type="text" defaultValue={booking?.name || 'SEKIDO KENJI'} className="w-full bg-[#f4f4f7] border border-gray-200 rounded px-3 py-2 font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">予約名(ふりがな)</label>
              <input type="text" defaultValue="せきど けんじ" className="w-full bg-[#f4f4f7] border border-gray-200 rounded px-3 py-2" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">PMS予約番号</label>
              <input type="text" defaultValue="894872" className="w-full bg-[#f4f4f7] border border-gray-200 rounded px-3 py-2" />
            </div>
            <div className="space-y-1.5 opacity-50">
              <label className="text-[10px] font-bold text-gray-400">OTA予約番号</label>
              <input type="text" placeholder="-" className="w-full bg-[#f4f4f7] border border-gray-200 rounded px-3 py-2" readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">予約ID(システム内部管理)</label>
              <input type="text" defaultValue="1f88ka4u506lvewnybta" className="w-full bg-[#f4f4f7] border border-gray-200 rounded px-3 py-2 text-[9px]" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">部屋ユニット*</label>
              <select className="w-full bg-white border border-gray-200 rounded px-3 py-2 font-bold">
                <option>ビジネスホテルアップル - 403</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">部屋タイプ</label>
              <p className="px-3 py-2 bg-[#f4f4f7] border border-gray-200 rounded font-bold text-gray-400">(未設定)</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">錠デバイス</label>
              <p className="px-3 py-2 bg-[#f4f4f7] border border-gray-200 rounded font-bold flex items-center gap-2">
                <Key size={12} className="text-gray-400" /> 403
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400">予約日時</label>
              <p className="px-3 py-2 bg-[#f4f4f7] border border-gray-200 rounded font-bold">2026/05/01 22:06</p>
            </div>
          </div>

          {/* 📅 Check-In/Out Grid */}
          <div className="grid grid-cols-3 gap-12">
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-red-500 uppercase">チェックイン予定日*</label>
                   <div className="flex items-center gap-2">
                     <input type="date" defaultValue="2026-05-08" className="w-full border border-gray-300 rounded px-3 py-2 font-bold" />
                     <Clock size={16} className="text-gray-400" />
                     <input type="time" defaultValue="15:00" className="w-full border border-gray-300 rounded px-3 py-2" />
                   </div>
                 </div>
                 <div className="flex items-end">
                   <button className="w-full bg-[#5c59cc] text-white rounded py-2 font-bold hover:bg-[#4a47a3] transition-colors">チェックイン日時を直接入力する</button>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-red-500 uppercase">チェックアウト予定日*</label>
                   <div className="flex items-center gap-2">
                     <input type="date" defaultValue="2026-05-09" className="w-full border border-gray-300 rounded px-3 py-2 font-bold" />
                     <Clock size={16} className="text-gray-400" />
                     <input type="time" defaultValue="10:00" className="w-full border border-gray-300 rounded px-3 py-2" />
                   </div>
                 </div>
                 <div className="flex items-end">
                   <button className="w-full bg-[#5c59cc] text-white rounded py-2 font-bold hover:bg-[#4a47a3] transition-colors">チェックアウト日時を直接入力する</button>
                 </div>
               </div>
            </div>
          </div>

          {/* 👤 Guest Contact */}
          <div className="grid grid-cols-3 gap-8 border-t pt-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">予約時電話番号</label>
              <input type="tel" defaultValue="09023308560" className="w-full border-b border-gray-300 py-1 focus:border-indigo-500 outline-none text-sm font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">予約時メールアドレス</label>
              <input type="email" defaultValue="sekido421208@gmail.com" className="w-full border-b border-gray-300 py-1 focus:border-indigo-500 outline-none text-sm font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">団体番号</label>
              <input type="text" className="w-full border-b border-gray-300 py-1 focus:border-indigo-500 outline-none text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-6 pb-8 border-b">
            <button className="flex items-center gap-2 bg-[#5c59cc] text-white px-4 py-2 rounded text-[10px] font-bold">
              <Send size={14} /> 事前チェックインメールを手動送信
            </button>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <span className="text-gray-400">チェックイン時にフロントへ誘導</span>
              <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
              <span className="text-gray-400 ml-4">チェックアウト時にフロントへ誘導</span>
              <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
            </div>
          </div>

          {/* 💴 Billing Information */}
          <section className="space-y-6">
            <h3 className="text-lg font-black tracking-tight border-l-4 border-indigo-500 pl-3">請求情報</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400">宿泊代金</label>
                <div className="flex items-end gap-2 border-b border-gray-300 pb-1">
                  <span className="text-gray-400 font-bold">¥</span>
                  <input type="text" defaultValue="4500" className="w-full outline-none text-xl font-black tracking-tighter" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400">うち消費税</label>
                <div className="flex items-end gap-2 border-b border-gray-200 pb-1 opacity-50">
                  <span className="text-gray-400 font-bold">¥</span>
                  <input type="text" defaultValue="409" className="w-full outline-none text-lg font-bold" readOnly />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-12 bg-[#fdfdfd] p-6 rounded-xl border border-dashed">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">請求金額</p>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">¥4,500</p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">事前支払い済金額</p>
                <p className="text-2xl font-black text-indigo-500 tracking-tighter">¥4,500</p>
              </div>
            </div>
          </section>

          {/* 🔐 PIN Information */}
          <section className="space-y-6">
            <h3 className="text-lg font-black tracking-tight border-l-4 border-indigo-500 pl-3">PIN情報</h3>
            <p className="text-[10px] leading-relaxed text-gray-400 max-w-2xl">
              PIN情報の自動同期(DMSで発行→スマートロック側システムへ送信)は、チェックイン日の2日前より、毎時10分ごろに行われます。<br />
              チェックイン日を変更した場合、変更後のチェックイン日から2日前まではPIN情報の再発行は行われないのでご注意ください。
            </p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-[#5c59cc] text-white px-6 py-2 rounded text-xs font-bold shadow-lg shadow-indigo-500/20">
                <RefreshCw size={14} /> 手動同期する
              </button>
            </div>
            <div className="p-8 bg-red-50 border border-red-100 rounded-xl">
               <p className="text-red-500 font-bold text-sm">有効なPIN情報が存在しません。同期を実行してください。</p>
            </div>
          </section>

          {/* 💾 Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <Button onClick={onClose} variant="outline" className="px-10 h-12 rounded-lg font-bold">キャンセル</Button>
            <Button onClick={onClose} className="px-16 h-12 rounded-lg bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black shadow-xl shadow-indigo-500/20 uppercase tracking-widest">保存する</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DmsBookingEditor;
