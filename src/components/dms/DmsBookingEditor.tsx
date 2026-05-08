'use client';

import React from 'react';
import { 
  X, User, Phone, MapPin, Briefcase, Mail, Calendar, 
  CreditCard, Key, ShieldCheck, Save, Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DmsBookingEditorProps {
  booking: any;
  onClose: () => void;
  isDarkMode: boolean;
}

const DmsBookingEditor: React.FC<DmsBookingEditorProps> = ({ booking, onClose, isDarkMode }) => {
  const cardClass = isDarkMode ? "bg-[#1a1b26] border-white/10" : "bg-white border-slate-200";
  const inputClass = isDarkMode 
    ? "bg-black/40 border-white/10 text-white focus:border-emerald-500/50" 
    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[40px] border shadow-2xl ${cardClass} animate-in zoom-in-95 duration-300`}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-8 border-b border-inherit backdrop-blur-md bg-inherit/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                Booking Editor <span className="text-emerald-500">#{booking?.id || 'NEW'}</span>
              </h2>
              <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">宿泊予約詳細・編集</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Guest Details */}
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-6">
              <h3 className="text-sm font-black text-emerald-500/50 uppercase tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck size={16} /> Guest Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Name / 氏名</label>
                  <input type="text" defaultValue={booking?.name} className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all ${inputClass}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Phone / 電話番号</label>
                  <input type="tel" defaultValue={booking?.phone} className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all ${inputClass}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Email / メールアドレス</label>
                  <input type="email" placeholder="example@nextralabs.com" className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all ${inputClass}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Occupation / 職業</label>
                  <input type="text" defaultValue="ITエンジニア" className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all ${inputClass}`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Address / 住所</label>
                <input type="text" placeholder="神奈川県海老名市..." className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all ${inputClass}`} />
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-sm font-black text-emerald-500/50 uppercase tracking-[0.3em] flex items-center gap-2">
                <Calendar size={16} /> Stay Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Check-In</p>
                  <p className="font-bold">2026-05-08</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Check-Out</p>
                  <p className="font-bold">2026-05-09</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Guests</p>
                  <p className="font-bold">1名</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Room</p>
                  <p className="font-bold text-emerald-500 italic">Room 302</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Billing & Status */}
          <div className="space-y-8">
            <section className={`p-8 rounded-[40px] border shadow-xl ${isDarkMode ? 'bg-black/40 border-emerald-500/20' : 'bg-slate-50 border-indigo-100'}`}>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard size={20} className="text-emerald-500" />
                <h3 className="text-sm font-black uppercase tracking-widest">Billing Info</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-500 font-bold uppercase">Total Amount</span>
                  <span className="text-4xl font-black tracking-tighter">¥4,500</span>
                </div>
                <div className="pt-4 border-t border-inherit space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">支払い状況</span>
                    <Badge className="bg-emerald-500/20 text-emerald-500 border-0 text-[10px] font-black uppercase">Paid</Badge>
                  </div>
                </div>
              </div>
            </section>

            <section className={`p-8 rounded-[40px] border shadow-xl ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Key size={20} className="text-emerald-500" />
                <h3 className="text-sm font-black uppercase tracking-widest">Security</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Smart Lock PIN</p>
                  <p className="text-3xl font-black tracking-[0.3em] text-emerald-500">8824</p>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-xl text-xs uppercase tracking-widest">
                  PINを再発行する
                </Button>
              </div>
            </section>

            <div className="pt-8 grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-2xl border-red-500/30 text-red-500 font-black uppercase tracking-widest text-[10px]">
                <Trash2 size={16} className="mr-2" /> Delete
              </Button>
              <Button className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px]">
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DmsBookingEditor;
