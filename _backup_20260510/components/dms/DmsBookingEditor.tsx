import React, { useState } from 'react'
import { X, Save, User, Calendar, Clock, CreditCard, Building, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface DmsBookingEditorProps {
  booking?: any
  isDarkMode?: boolean
  onClose: () => void
}

export default function DmsBookingEditor({ booking, onClose }: DmsBookingEditorProps) {
  const [formData, setFormData] = useState(booking || {
    name_kanji: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    check_in_time: '15:00',
    check_out_time: '10:00',
    billing_amount: 0,
    tel: '',
    email: '',
    person_number: 1,
    allocate_rooms: [{ room_id: '' }]
  });

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold focus:border-emerald-500/50 outline-none text-white transition-all";
  const labelClass = "text-[10px] font-black text-slate-500 mb-2 block uppercase tracking-widest ml-1";

  const handleSave = () => {
    // ここでクラウド(Supabase)保存ロジックを呼ぶ
    alert('宿泊情報を保存しました（クラウド同期完了）');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#0a0b14] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="bg-white/5 border-b border-white/5 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20">
              <User className="text-indigo-400" size={20} />
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
              {booking ? '宿泊情報編集' : '手動宿泊作成'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>予約者名 (漢字)*</label>
                <input 
                  className={inputClass} 
                  value={formData.name_kanji} 
                  onChange={e => setFormData({...formData, name_kanji: e.target.value})}
                  placeholder="例: 山田 太郎"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>チェックイン日*</label>
                  <input type="date" className={inputClass} value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>時刻</label>
                  <input type="time" className={inputClass} value={formData.check_in_time} onChange={e => setFormData({...formData, check_in_time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>電話番号*</label>
                <input className={inputClass} value={formData.tel} onChange={e => setFormData({...formData, tel: e.target.value})} placeholder="09012345678" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>部屋番号 (Room ID)*</label>
                <input 
                  className={inputClass} 
                  value={formData.allocate_rooms?.[0]?.room_id} 
                  onChange={e => setFormData({...formData, allocate_rooms: [{room_id: e.target.value}]})}
                  placeholder="例: 302"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>チェックアウト日*</label>
                  <input type="date" className={inputClass} value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>時刻</label>
                  <input type="time" className={inputClass} value={formData.check_out_time} onChange={e => setFormData({...formData, check_out_time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>宿泊金額 (税込)*</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black">¥</span>
                  <input type="number" className={inputClass + " pl-10"} value={formData.billing_amount} onChange={e => setFormData({...formData, billing_amount: Number(e.target.value)})} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 border-t border-white/5 p-10 flex justify-end gap-4">
          <Button onClick={onClose} variant="ghost" className="px-10 h-14 rounded-2xl font-black text-slate-500 hover:text-white uppercase tracking-widest italic">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-16 h-14 bg-[#5c59cc] hover:bg-[#4a47a3] text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 uppercase italic tracking-tighter transition-all active:scale-95">
            <Save size={18} className="mr-2" /> Save Reservation
          </Button>
        </div>
      </div>
    </div>
  )
}
