'use client';

import React from 'react';
import { 
  X, Save, Trash2, Building, Wifi, Clock, MapPin, 
  Phone, ShieldCheck, CreditCard, Printer, Image, 
  Settings, ChevronRight, HelpCircle, Info, Hash, Monitor, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DmsPropertyEditorProps {
  property: any;
  onClose: () => void;
  isDarkMode: boolean;
}

const DmsPropertyEditor: React.FC<DmsPropertyEditorProps> = ({ property, onClose, isDarkMode }) => {
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-white transition-all";
  const labelClass = "text-[10px] font-bold text-gray-500 mb-1.5 block uppercase tracking-[0.15em] ml-1";
  const sectionTitleClass = "text-lg font-bold tracking-tight border-l-4 border-emerald-500 pl-4 mb-8 flex items-center gap-2 text-white uppercase ";

  const Toggle = ({ enabled = false }) => (
    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${enabled ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/10'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[1500px] bg-[#050508] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden my-8 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header - Fixed & Premium */}
        <div className="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-md border-b border-white/5 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
               <Building size={20} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-bold text-gray-500 flex items-center gap-2">
              PROPERTY <ChevronRight size={14} className="text-gray-700" /> 
              <span className="text-white text-lg tracking-tighter uppercase ">{property?.name || 'ビジネスホテルアップル'}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
             {['プラン情報', '支払情報', 'アンケート'].map(t => (
               <button key={t} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 rounded-full border border-white/10 transition-all">{t}</button>
             ))}
             <button className="px-6 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-bold rounded-full border border-red-500/20 transition-all flex items-center gap-2">
               <Trash2 size={14} /> DELETE
             </button>
             <button onClick={onClose} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500">
               <X size={28} />
             </button>
          </div>
        </div>

        <div className="p-16 space-y-24">
          
          {/* Section 1: Basic Information (Images 1 & 2) */}
          <section className="space-y-12">
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4 text-blue-400">
               <Info size={20} />
               <p className="text-xs font-bold leading-relaxed">※ の項目は、PMSと連携している場合は自動で同期されます。DMS上での手動設定は不要です。</p>
            </div>

            <div className="grid grid-cols-2 gap-x-20 gap-y-10">
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelClass}>連携元PMS</label><input type="text" defaultValue="Staysee" className={inputClass} /></div>
                <div><label className={labelClass}>PMS上の物件ID</label><input type="text" placeholder="ID" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelClass}>物件名※</label><input type="text" defaultValue={property?.name} className={inputClass} /></div>
                <div><label className={labelClass}>PROPキー</label><input type="text" defaultValue="PROP-8824" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelClass}>WIFI SSID</label><input type="text" defaultValue="APPLE_HOTEL_GUEST" className={inputClass} /></div>
                <div><label className={labelClass}>WIFI PASSWORD</label><input type="text" defaultValue="0524615151" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelClass}>CHECK-IN TIME</label><input type="time" defaultValue="15:00" className={inputClass} /></div>
                <div><label className={labelClass}>CHECK-OUT TIME</label><input type="time" defaultValue="10:00" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div><label className={labelClass}>COUNTRY</label><input type="text" defaultValue="日本" className={inputClass} /></div>
                <div className="col-span-2"><label className={labelClass}>POSTAL CODE※</label><input type="text" defaultValue="453-0804" className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>ADDRESS※</label><input type="text" defaultValue="愛知県名古屋市中村区黄金通1-22" className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelClass}>PHONE※</label><input type="text" defaultValue="0524615151" className={inputClass} /></div>
                <div><label className={labelClass}>INVOICE REG NUMBER</label><input type="text" defaultValue="T2180002027641" className={inputClass} /></div>
              </div>
            </div>
          </section>

          {/* Section 2: Advanced Settings (Image 3) */}
          <section className="space-y-10">
            <h3 className={sectionTitleClass}><Settings size={22} /> System Behavior</h3>
            <div className="grid grid-cols-2 gap-x-20 gap-y-8">
               {[
                 { label: '音声ガイダンス', enabled: false },
                 { label: '言語選択をスキップ', enabled: false },
                 { label: 'チェックインタブレットからの通話呼び出し', enabled: false },
                 { label: '規定チェックイン時間より早いチェックインを許可しない', enabled: true },
                 { label: '本人確認通話の呼び出しに応答できない場合、通話をスキップ', enabled: true },
                 { label: 'チェックアウト時、超過メールを送信', enabled: true },
                 { label: 'チェックインのみを受付', enabled: false },
                 { label: 'チェックアウトのみを受付', enabled: false },
               ].map(item => (
                 <div key={item.label} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <span className={`font-bold text-sm ${item.enabled ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
                    <Toggle enabled={item.enabled} />
                 </div>
               ))}
            </div>
            
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl space-y-4">
               <div className="flex gap-3 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
                  <HelpCircle size={18} /> 本人確認通話の条件
               </div>
               <p className="text-xs text-gray-500 leading-relaxed pl-8">
                  無人モードをOFFにするか、「通話呼び出し」無効かつ「応答不可時スキップ」有効の場合に本機能が動作します。<br />
                  詳細はマニュアルの「無人モード運用ガイド」をご参照ください。
               </p>
            </div>
          </section>

          {/* Section 3: Billing & Printer (Image 4 & 5) */}
          <section className="space-y-12">
            <h3 className={sectionTitleClass}><CreditCard size={22} /> Payment & Printer</h3>
            <div className="grid grid-cols-3 gap-10">
               <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
                  <div className="flex items-center justify-between"><span className="font-bold text-emerald-400">現金決済</span><Toggle enabled={true} /></div>
                  <div className="flex items-center justify-between"><span className="font-bold text-emerald-400">PayPay決済</span><Toggle enabled={true} /></div>
                  <div className="flex items-center justify-between"><span className="font-bold text-emerald-400">Vesca (カード)</span><Toggle enabled={true} /></div>
               </div>
               <div className="col-span-2 grid grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl border border-white/5">
                  <div><label className={labelClass}>PayPay Merchant ID</label><input type="text" defaultValue="884397576656273408" className={inputClass} /></div>
                  <div><label className={labelClass}>API KEY</label><input type="text" defaultValue="a_ISFcCFVqnJ_mbiN" className={inputClass} /></div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-10 bg-white/5 p-10 rounded-[40px] border border-white/5">
               <div className="space-y-4">
                  <label className={labelClass}>朝食券の発行枚数</label>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /></div>
                        <span className="text-sm font-bold text-white">人数×宿泊日数分だけ発行する</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group opacity-30">
                        <div className="w-5 h-5 rounded-full border-2 border-white/20 flex items-center justify-center" />
                        <span className="text-sm font-bold text-white">1室につき1枚だけ発行する</span>
                     </label>
                  </div>
               </div>
               <div className="space-y-4">
                  <label className={labelClass}>汎用追加印刷設定 (パスコード等)</label>
                  <textarea placeholder="領収書の下部に印刷するテキストを入力してください" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:border-emerald-500/50 outline-none h-24" />
               </div>
            </div>
          </section>

          {/* Section 4: Design & Ads (Image 5 & 6) */}
          <section className="space-y-12">
            <h3 className={sectionTitleClass}><Palette size={22} /> Visual Customization</h3>
            <div className="grid grid-cols-3 gap-10">
               {[
                 { label: '背景画像', sub: 'BG Image' },
                 { label: 'トップページ画像', sub: 'Top Hero' },
                 { label: '広告エリア画像', sub: 'Advertisement' },
               ].map(img => (
                 <div key={img.label} className="space-y-4">
                   <label className={labelClass}>{img.label}</label>
                   <div className="w-full h-48 border-2 border-dashed border-white/10 rounded-[32px] bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center text-gray-600 group cursor-pointer">
                      <Image size={32} className="mb-2 opacity-20 group-hover:opacity-40" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{img.sub}</span>
                   </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-2 gap-10">
               <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-6">
                  <label className={labelClass}>UI背景色 (Gradient Top)</label>
                  <div className="flex items-center gap-6">
                     <div className="w-32 h-32 rounded-3xl bg-cyan-500 shadow-lg shadow-cyan-500/20" />
                     <div className="grid grid-cols-3 gap-2">
                        {['R', 'G', 'B'].map(c => <div key={c}><span className="text-[9px] font-bold text-gray-500">{c}</span><input type="number" className="w-full bg-black/40 border-b border-white/10 py-1 text-center" defaultValue={146} /></div>)}
                     </div>
                  </div>
               </div>
               <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-6">
                  <label className={labelClass}>UI背景色 (Gradient Bottom)</label>
                  <div className="flex items-center gap-6">
                     <div className="w-32 h-32 rounded-3xl bg-blue-900 shadow-lg shadow-blue-900/20" />
                     <div className="grid grid-cols-3 gap-2">
                        {['R', 'G', 'B'].map(c => <div key={c}><span className="text-[9px] font-bold text-gray-500">{c}</span><input type="number" className="w-full bg-black/40 border-b border-white/10 py-1 text-center" defaultValue={89} /></div>)}
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Footer - Image 6 Style */}
          <div className="sticky bottom-0 bg-[#050508] border-t border-white/5 p-10 flex justify-end gap-5 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-40">
            <button onClick={onClose} className="px-12 py-4 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold rounded-2xl border border-white/10 transition-all uppercase tracking-tight">
              ✕ Cancel
            </button>
            <button onClick={onClose} className="px-24 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all uppercase tracking-[0.3em] flex items-center gap-3">
              💾 UPDATE PROPERTY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DmsPropertyEditor;
