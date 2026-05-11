'use client';

import React, { useState } from 'react';
import {
  X, Save, Trash2, Building, Settings,
  ChevronRight, HelpCircle, Info, Palette,
  AlertTriangle, Loader2, CheckCircle2
} from 'lucide-react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface DmsPropertyEditorProps {
  property: any;
  onClose: () => void;
  isDarkMode: boolean;
  onDeleted?: () => void;
}

const DmsPropertyEditor: React.FC<DmsPropertyEditorProps> = ({ property, onClose, isDarkMode, onDeleted }) => {
  const isNew = !property?.name;

  // フォーム状態
  const [form, setForm] = useState({
    name:          property?.name          || '',
    pms:           property?.pms           || 'Staysee',
    pmsId:         property?.pmsId         || '',
    propKey:       property?.propKey       || 'PROP-8824',
    wifiSsid:      property?.wifiSsid      || '',
    wifiPass:      property?.wifiPass      || '',
    checkinTime:   property?.checkinTime   || '15:00',
    checkoutTime:  property?.checkoutTime  || '10:00',
    country:       property?.country       || '日本',
    postalCode:    property?.postalCode    || '',
    address:       property?.address       || '',
    phone:         property?.phone         || '',
    invoiceNo:     property?.invoiceNo     || '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'plan' | 'payment' | 'survey'>('basic');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-white transition-all";
  const labelClass = "text-[10px] font-bold text-gray-500 mb-1.5 block uppercase tracking-[0.15em] ml-1";
  const sectionTitleClass = "text-lg font-bold tracking-tight border-l-4 border-emerald-500 pl-4 mb-8 flex items-center gap-2 text-white uppercase";

  const Toggle = ({ enabled = false, onChange }: { enabled?: boolean; onChange?: () => void }) => (
    <div
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${enabled ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
    </div>
  );

  const [toggles, setToggles] = useState({
    voice: false,
    skipLang: false,
    callFromTablet: false,
    noEarlyCheckin: true,
    skipCallIfNoAnswer: true,
    sendLateEmail: true,
    checkinOnly: false,
    checkoutOnly: false,
  });
  const toggleKey = (k: keyof typeof toggles) => setToggles(p => ({ ...p, [k]: !p[k] }));

  // 保存処理（ローカルstorage保存 + 親への通知）
  const handleSave = async () => {
    if (!form.name.trim()) {
      setSaveMsg({ ok: false, text: '物件名は必須です' });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      // ローカルに保存（実際はAPIへ送信する想定）
      const key = 'nextra_dms_properties';
      const existing = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
      if (isNew) {
        existing.push({ ...form, id: `prop-${Date.now()}`, createdAt: new Date().toISOString() });
      } else {
        const idx = existing.findIndex((p: any) => p.name === property.name);
        if (idx >= 0) existing[idx] = { ...existing[idx], ...form };
        else existing.push({ ...form, id: `prop-${Date.now()}` });
      }
      localStorage.setItem(key, JSON.stringify(existing));
      setSaveMsg({ ok: true, text: isNew ? '物件を作成しました' : '保存しました' });
      setTimeout(() => { onClose(); }, 1000);
    } catch {
      setSaveMsg({ ok: false, text: '保存に失敗しました' });
    } finally {
      setSaving(false);
    }
  };

  // 削除処理
  const handleDelete = () => {
    try {
      const key = 'nextra_dms_properties';
      const existing = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
      const filtered = existing.filter((p: any) => p.name !== property?.name);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch { /* ignore */ }
    setConfirmDelete(false);
    onDeleted?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[1500px] bg-[#050508] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden my-8 animate-in slide-in-from-bottom-8 duration-500">

        {/* ヘッダー */}
        <div className="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-md border-b border-white/5 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Building size={20} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-bold text-gray-500 flex items-center gap-2">
              PROPERTY <ChevronRight size={14} className="text-gray-700" />
              <span className="text-white text-lg tracking-tighter uppercase">
                {isNew ? '新規物件を作成' : (form.name || 'ビジネスホテルアップル')}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* タブ */}
            {[
              { id: 'basic',   label: '基本設定' },
              { id: 'plan',    label: 'プラン情報' },
              { id: 'payment', label: '支払情報' },
              { id: 'survey',  label: 'アンケート' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="px-5 py-2 text-[10px] font-bold rounded-full border transition-all"
                style={{
                  background: activeTab === tab.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                  color: activeTab === tab.id ? '#10b981' : '#9ca3af',
                  borderColor: activeTab === tab.id ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)',
                }}
              >
                {tab.label}
              </button>
            ))}
            {/* 削除ボタン（新規作成時は非表示） */}
            {!isNew && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-5 py-2 text-[10px] font-bold rounded-full border transition-all flex items-center gap-1.5"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              >
                <Trash2 size={13} /> DELETE
              </button>
            )}
            <button onClick={onClose} className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500">
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="p-16 space-y-16">

          {/* 基本設定タブ */}
          {activeTab === 'basic' && (
            <>
              <section className="space-y-10">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl flex items-center gap-3 text-blue-400">
                  <Info size={18} className="shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">※ の項目は、PMSと連携している場合は自動で同期されます。DMS上での手動設定は不要です。</p>
                </div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>連携元PMS</label>
                      <select value={form.pms} onChange={e => set('pms', e.target.value)}
                        className={inputClass} style={{ colorScheme: 'dark' }}>
                        {['Staysee','エアホスト','Cloudbeds','Beds24','未接続（ローカル）'].map(p => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>PMS上の物件ID</label>
                      <input value={form.pmsId} onChange={e => set('pmsId', e.target.value)} placeholder="ID" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>物件名 ※ *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="例：ビジネスホテルアップル" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>PROPキー</label>
                      <input value={form.propKey} onChange={e => set('propKey', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>WIFI SSID</label>
                      <input value={form.wifiSsid} onChange={e => set('wifiSsid', e.target.value)} placeholder="例：HOTEL_GUEST" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>WIFI PASSWORD</label>
                      <input value={form.wifiPass} onChange={e => set('wifiPass', e.target.value)} placeholder="パスワード" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>CHECK-IN TIME</label>
                      <input type="time" value={form.checkinTime} onChange={e => set('checkinTime', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>CHECK-OUT TIME</label>
                      <input type="time" value={form.checkoutTime} onChange={e => set('checkoutTime', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className={labelClass}>COUNTRY</label>
                      <input value={form.country} onChange={e => set('country', e.target.value)} className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>POSTAL CODE ※</label>
                      <input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} placeholder="例：453-0804" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>ADDRESS ※</label>
                    <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="住所" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>PHONE ※</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="03-0000-0000" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>INVOICE REG NUMBER</label>
                      <input value={form.invoiceNo} onChange={e => set('invoiceNo', e.target.value)} placeholder="T0000000000000" className={inputClass} />
                    </div>
                  </div>
                </div>
              </section>

              {/* System Behavior */}
              <section className="space-y-8">
                <h3 className={sectionTitleClass}><Settings size={22} /> System Behavior</h3>
                <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                  {[
                    { key: 'voice',            label: '音声ガイダンス' },
                    { key: 'skipLang',         label: '言語選択をスキップ' },
                    { key: 'callFromTablet',   label: 'チェックインタブレットからの通話呼び出し' },
                    { key: 'noEarlyCheckin',   label: '規定チェックイン時間より早いチェックインを許可しない' },
                    { key: 'skipCallIfNoAnswer', label: '本人確認通話の呼び出しに応答できない場合、通話をスキップ' },
                    { key: 'sendLateEmail',    label: 'チェックアウト時、超過メールを送信' },
                    { key: 'checkinOnly',      label: 'チェックインのみを受付' },
                    { key: 'checkoutOnly',     label: 'チェックアウトのみを受付' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                      <span className={`font-bold text-sm ${toggles[item.key as keyof typeof toggles] ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
                      <Toggle enabled={toggles[item.key as keyof typeof toggles]} onChange={() => toggleKey(item.key as keyof typeof toggles)} />
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl space-y-3">
                  <div className="flex gap-3 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
                    <HelpCircle size={16} /> 本人確認通話の条件
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">
                    無人モードをOFFにするか、「通話呼び出し」無効かつ「応答不可時スキップ」有効の場合に本機能が動作します。
                  </p>
                </div>
              </section>
            </>
          )}

          {/* プラン情報タブ */}
          {activeTab === 'plan' && (
            <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
              プラン情報の管理機能は開発中です
            </div>
          )}

          {/* 支払情報タブ */}
          {activeTab === 'payment' && (
            <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
              支払情報の管理機能は開発中です
            </div>
          )}

          {/* アンケートタブ */}
          {activeTab === 'survey' && (
            <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
              アンケート設定の管理機能は開発中です
            </div>
          )}

          {/* フッター */}
          <div className="sticky bottom-0 bg-[#050508] border-t border-white/5 p-8 flex items-center justify-between shadow-[0_-20px_40px_rgba(0,0,0,0.8)] z-40">
            <div>
              {saveMsg && (
                <span className={`flex items-center gap-2 text-sm font-semibold ${saveMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                  {saveMsg.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                  {saveMsg.text}
                </span>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-10 py-3 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold rounded-2xl border border-white/10 transition-all uppercase tracking-tight"
              >
                ✕ キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-20 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest flex items-center gap-3"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <span>💾</span>}
                {isNew ? 'CREATE PROPERTY' : 'UPDATE PROPERTY'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={confirmDelete}
        title={`「${form.name}」を削除しますか？`}
        description="物件を削除すると、紐づく部屋・鍵デバイスの設定も失われます。"
        warning="この操作は元に戻せません。削除すると復元できません。"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

export default DmsPropertyEditor;
