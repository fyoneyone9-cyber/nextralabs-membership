'use client';

import React from 'react';
import { 
  X, Save, Trash2, Building, Wifi, Clock, MapPin, 
  Phone, ShieldCheck, CreditCard, Printer, Image, 
  Settings, ChevronRight, HelpCircle, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DmsPropertyEditorProps {
  property: any;
  onClose: () => void;
  isDarkMode: boolean;
}

const DmsPropertyEditor: React.FC<DmsPropertyEditorProps> = ({ property, onClose, isDarkMode }) => {
  const inputClass = "w-full bg-[#f4f4f7] border border-gray-200 rounded px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-500";
  const labelClass = "text-[10px] font-bold text-gray-400 mb-1 block uppercase";
  const sectionTitleClass = "text-sm font-black tracking-tight border-l-4 border-indigo-500 pl-3 mb-6 flex items-center gap-2";

  const Toggle = ({ enabled = false }) => (
    <div className={`w-10 h-5 rounded-full relative cursor-pointer ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'left-6' : 'left-1'}`} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[1600px] bg-white rounded-lg shadow-2xl overflow-hidden my-4 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              物件一覧 <ChevronRight size={14} className="text-gray-400" /> 
              <span className="text-black font-black uppercase">{property?.name || 'ビジネスホテルアップル'}</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-1.5 bg-[#5c59cc] text-white text-[10px] font-bold rounded hover:bg-[#4a47a3] transition-colors">プラン情報</button>
             <button className="px-4 py-1.5 bg-[#5c59cc] text-white text-[10px] font-bold rounded hover:bg-[#4a47a3] transition-colors">支払情報</button>
             <button className="px-4 py-1.5 bg-[#5c59cc] text-white text-[10px] font-bold rounded hover:bg-[#4a47a3] transition-colors">アンケート情報</button>
             <button className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 transition-colors flex items-center gap-1">
               <Trash2 size={12} /> 削除
             </button>
             <button onClick={onClose} className="ml-4 p-1 hover:bg-gray-100 rounded">
               <X size={24} className="text-gray-400" />
             </button>
          </div>
        </div>

        <div className="p-10 space-y-12 text-xs text-gray-700">
          
          {/* Section 1: Basic Info */}
          <section>
            <div className="bg-blue-50/30 border border-blue-100 p-4 rounded mb-8 text-[10px] flex items-center gap-2">
               <Info size={14} className="text-blue-500" />
               <p className="text-gray-500">※ の項目は、PMSと連携している場合は自動で同期されるため、DMS上で設定する必要はありません。</p>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>連携元PMS</label><input type="text" defaultValue="Staysee" className={inputClass} /></div>
                <div><label className={labelClass}>PMS上の物件ID</label><input type="text" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>物件名※</label><input type="text" defaultValue={property?.name} className={inputClass} /></div>
                <div><label className={labelClass}>PROPキー</label><input type="text" defaultValue="PROP-8824" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>wifi接続名</label><input type="text" className={inputClass} /></div>
                <div><label className={labelClass}>wifiパスワード</label><input type="text" defaultValue="0524615151" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>既定チェックイン時刻</label><input type="time" defaultValue="15:00" className={inputClass} /></div>
                <div><label className={labelClass}>既定チェックアウト時刻</label><input type="time" defaultValue="10:00" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelClass}>国</label><input type="text" defaultValue="日本" className={inputClass} /></div>
                <div className="col-span-2"><label className={labelClass}>郵便番号※</label><input type="text" defaultValue="453-0804" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelClass}>都道府県※</label><input type="text" defaultValue="愛知県" className={inputClass} /></div>
                <div className="col-span-2"><label className={labelClass}>市区町村※</label><input type="text" defaultValue="名古屋市中村区黄金通1-22" className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>電話番号※ (領収書用)</label><input type="text" defaultValue="0524615151" className={inputClass} /></div>
                <div><label className={labelClass}>登録番号 (領収書用)</label><input type="text" defaultValue="T2180002027641" className={inputClass} /></div>
              </div>
            </div>
          </section>

          {/* Section 2: Behavior Settings */}
          <section className="grid grid-cols-2 gap-x-12">
            <div className="space-y-6">
               <div className="flex items-center justify-between"><label className="font-bold">音声ガイダンス</label><Toggle enabled={false} /></div>
               <div className="flex items-center justify-between"><label className="font-bold">チェックインタブレットからの通話呼び出し</label><Toggle enabled={false} /></div>
               <div className="flex items-center justify-between"><label className="font-bold">規定チェックイン時間より早いチェックインを許可しない</label><Toggle enabled={true} /></div>
               <div className="flex items-center justify-between"><label className="font-bold">チェックインのみを受付</label><Toggle enabled={false} /></div>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between"><label className="font-bold">言語選択をスキップ</label><Toggle enabled={false} /></div>
               <div className="flex items-center justify-between"><label className="font-bold">本人確認通話の呼び出しに応答できない場合、通話をスキップ</label><Toggle enabled={true} /></div>
               <div className="flex items-center justify-between"><label className="font-bold">チェックアウト時、チェックアウト時間を経過した際にメールを送信</label><Toggle enabled={true} /></div>
               <div className="flex items-center justify-between"><label className="font-bold">チェックアウトのみを受付</label><Toggle enabled={false} /></div>
            </div>
          </section>

          {/* Section 3: Identity & Instructions */}
          <section className="bg-emerald-50/30 border border-emerald-100 p-6 rounded-xl space-y-4">
             <div className="flex gap-2 text-emerald-700 font-bold">
                <HelpCircle size={16} />
                <span>本人確認通話とチェックインメールについて</span>
             </div>
             <p className="text-[10px] text-emerald-800 leading-relaxed pl-6">
                本人確認通話をスキップする条件は以下のいずれかです。<br />
                ①無人モードをオフに設定する（物件一覧画面で切り替えができます）<br />
                ②「チェックインタブレットからの通話呼び出し」を無効、「本人確認通話の呼び出しに応答できない場合、通話をスキップ」を有効にする<br />
                かつ「無人モードがオン」の場合は、ゲストのチェックイン時にDMSユーザーへメールが送信されます。
             </p>
          </section>

          {/* Section 4: Terms & Files */}
          <section className="space-y-4">
             <label className={labelClass}>利用規約 (ENGLISH / 日本語 / ...)</label>
             <div className="flex flex-wrap gap-2 mb-4">
                {['ENGLISH', '日本語', '简体中文', '繁體中文', '한국어', 'ภาษาไทย'].map(l => (
                  <Badge key={l} variant="outline" className="px-4 py-1 rounded-full cursor-pointer hover:bg-gray-100">{l}</Badge>
                ))}
             </div>
             <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <Image size={40} className="mb-2 opacity-20" />
                <p>ファイルを形式（PDFファイルがテキストより優先されます）</p>
                <p className="text-[10px] mt-2">最大サイズ: 10MB / 形式: PNG, JPEG, PDF</p>
             </div>
          </section>

          {/* Section 5: Billing & Payment */}
          <section className="space-y-8 border-t pt-12">
            <h3 className={sectionTitleClass}><CreditCard size={18} /> 精算設定</h3>
            <div className="grid grid-cols-3 gap-12">
               <div className="space-y-6">
                  <div className="flex items-center justify-between"><label className="font-bold">現金決済</label><Toggle enabled={true} /></div>
                  <div className="flex items-center justify-between"><label className="font-bold">PayPay決済</label><Toggle enabled={true} /></div>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center justify-between"><label className="font-bold">端末カード決済 (Vesca)</label><Toggle enabled={true} /></div>
                  <div className="flex items-center justify-between"><label className="font-bold">スマホカード決済</label><Toggle enabled={false} /></div>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-12 mt-8">
               <div><label className={labelClass}>PayPay 加盟店ID</label><input type="text" defaultValue="884397576656273408" className={inputClass} /></div>
               <div><label className={labelClass}>APIキー</label><input type="text" defaultValue="a_ISFcCFVqnJ_mbiN" className={inputClass} /></div>
               <div><label className={labelClass}>シークレット</label><input type="password" value="********" className={inputClass} /></div>
            </div>
          </section>

          {/* Section 6: Print & UI Customization (Image 5 & 6) */}
          <section className="space-y-10 border-t pt-12">
            <h3 className={sectionTitleClass}><Printer size={18} /> 印刷・画面設定</h3>
            
            <div className="space-y-6">
              <label className={labelClass}>朝食券の発行枚数</label>
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="breakfast" defaultChecked className="w-4 h-4 accent-emerald-500" />
                  <span className="font-bold text-[10px]">人数×宿泊日数分だけ発行する</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="breakfast" className="w-4 h-4 accent-emerald-500" />
                  <span className="font-bold text-[10px]">1室につき1枚だけ発行する</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                 <label className={labelClass}>背景画像</label>
                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-400 min-h-[150px]">
                    <span className="text-[10px]">未設定</span>
                    <p className="text-[9px] mt-2">形式: PNG, JPEG / 最大10MB</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <label className={labelClass}>トップページ画像</label>
                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-400 min-h-[150px]">
                    <span className="text-[10px]">未設定</span>
                    <p className="text-[9px] mt-2">形式: PNG, JPEG / 最大10MB</p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                 <label className={labelClass}>背景色設定 (上部)</label>
                 <div className="flex gap-4">
                   <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-inner" />
                   <div className="flex flex-col justify-between">
                     <div className="flex gap-2 text-[10px]">
                        <span>R: <input type="number" defaultValue={0} className="w-10 border-b outline-none" /></span>
                        <span>G: <input type="number" defaultValue={146} className="w-10 border-b outline-none" /></span>
                        <span>B: <input type="number" defaultValue={180} className="w-10 border-b outline-none" /></span>
                     </div>
                     <Button size="sm" className="bg-teal-600 text-white text-[9px] h-7">デフォルトに戻す</Button>
                   </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <label className={labelClass}>背景色設定 (下部)</label>
                 <div className="flex gap-4">
                   <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-slate-900 to-blue-900 shadow-inner" />
                   <div className="flex flex-col justify-between">
                     <div className="flex gap-2 text-[10px]">
                        <span>R: <input type="number" defaultValue={0} className="w-10 border-b outline-none" /></span>
                        <span>G: <input type="number" defaultValue={48} className="w-10 border-b outline-none" /></span>
                        <span>B: <input type="number" defaultValue={89} className="w-10 border-b outline-none" /></span>
                     </div>
                     <Button size="sm" className="bg-teal-600 text-white text-[9px] h-7">デフォルトに戻す</Button>
                   </div>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <label className={labelClass}>広告A (上段) 用画像</label>
               <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <p className="text-[10px]">ファイルを追加</p>
                  <p className="text-[9px] mt-1 opacity-50">ファイルサイズ上限: 10MB / 形式: PNG, JPEG</p>
               </div>
            </div>
          </section>

          {/* Footer Save (Image 6 Style) */}
          <div className="sticky bottom-0 bg-[#f8f9fa] border-t p-6 flex justify-end gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-30">
            <button onClick={onClose} className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-black text-xs font-bold rounded flex items-center gap-2 transition-colors">
              ✕ キャンセル
            </button>
            <button onClick={onClose} className="px-12 py-2 bg-[#5c59cc] hover:bg-[#4a47a3] text-white text-xs font-bold rounded flex items-center gap-2 shadow-lg transition-all">
              💾 更新
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DmsPropertyEditor;
