'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  CheckCircle2, Zap, Lock, Camera, Loader2,
  UserPlus, Search, Key, LogOut, QrCode,
  Monitor, ClipboardList, ArrowRight, PenLine
} from 'lucide-react'

const TABS = [
{ id: 'kiosk',    label: 'スタート',        icon: Monitor,       desc: '待機・言語選択' },
  { id: 'search',   label: '予約検索',        icon: Search,        desc: 'QR/予約番号' },
  { id: 'checkin',  label: '自動チェックイン', icon: UserPlus,      desc: '本人確認・台帳記帳' },
  { id: 'lock',     label: '鍵発行',          icon: Key,           desc: 'アクセス権デプロイ' },
  { id: 'checkout', label: 'チェックアウト',   icon: LogOut,        desc: '1秒退館・精算' },
]

const inputCls = `w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors`
const inputStyle = { background: '#13141f', border: '1px solid #334155' }

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('kiosk')
  const [isMounted, setIsMounted] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'confirm'|'extra'|'processing'|'done'>('confirm')
  const [hasExtraCharge] = useState(false)  // 実際はPMSから取得

  const [checkinStatus, setCheckinStatus] = useState('IDLE')
  const [ledgerName, setLedgerName] = useState('')
  const [ledgerAddress, setLedgerAddress] = useState('')
  const [ledgerOccupation, setLedgerOccupation] = useState('')
  const [ledgerTravel, setLedgerTravel] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // カメラ関連
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    setCameraError(null)
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setCameraError('カメラへのアクセスが拒否されました')
    }
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setIsCameraOpen(false)
    setCameraError(null)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx?.drawImage(videoRef.current, 0, 0)
      runCheckin()
      closeCamera()
    }
  }

  useEffect(() => {
    setIsMounted(true)

  }, [])

  const runCheckin = async () => {
    setCheckinStatus('SCANNING')
    await new Promise(r => setTimeout(r, 2000))
    setLedgerName('山田 太郎')
    setLedgerAddress('東京都渋谷区1-2-3')
    setLedgerOccupation('会社員')
    setLedgerTravel('大阪 → 東京 → 横浜')
    setCheckinStatus('VERIFIED')
  }

  if (!isMounted) return null

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-8 space-y-3">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Nextra AI Autonomous OS
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          次世代スマート<span style={{ color: '#10b981' }}>チェックイン</span>プロトコル
        </h1>
        <p className="text-slate-400 text-sm">PMS連携・本人確認・鍵発行を完全自動化するホテルDXシステム。</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-5">
        {/* タブナビ */}
        <div
          className="flex gap-1 p-1 rounded-xl overflow-x-auto"
          style={{ background: '#0d1117', border: '1px solid #1e293b' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={
                activeTab === tab.id
                  ? { background: '#10b981', color: '#fff' }
                  : { color: '#64748b' }
              }
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- KIOSKトップ --- */}
        {activeTab === 'kiosk' && (
          <div
            className="rounded-xl flex flex-col items-center justify-center py-20 space-y-10"
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}
          >
            {/* 言語選択 */}
            <div className="flex gap-2 flex-wrap justify-center">
              {['日本語', 'English', '中文', '한국어'].map(lang => (
                <button
                  key={lang}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{ background: '#13141f', border: '1px solid #334155', color: '#94a3b8' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                >
                  {lang}
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-400 tracking-tight">TOUCH START TO CHECK-IN</p>
            {/* STARTボタン */}
            <button
              onClick={() => setActiveTab('search')}
              className="w-48 h-48 rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] border-2 border-emerald-500/20"
              style={{ background: '#0d1117' }}
            >
              <span className="text-emerald-500 text-2xl font-bold tracking-tighter">CHECK-IN</span>
              <span className="text-white text-[10px] font-medium tracking-widest opacity-40">START</span>
            </button>
          </div>
        )}

        {/* --- 予約検索 --- */}
        {activeTab === 'search' && (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: QrCode, label: 'QRコードで検索', color: '#10b981' },
              { icon: ClipboardList, label: '予約番号で検索', color: '#6366f1' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setActiveTab('checkin')}
                className="rounded-xl p-10 flex flex-col items-center justify-center gap-5 transition-all hover:scale-[1.02]"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${item.color}60`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
              >
                <item.icon size={48} style={{ color: item.color }} />
                <p className="text-base font-semibold text-slate-200">{item.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* --- 自動チェックイン --- */}
        {activeTab === 'checkin' && (
          <div
            className="rounded-xl p-6 space-y-6"
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">宿泊者情報の登録</h3>
                <p className="text-xs text-slate-500 mt-1">旅館業法に基づき、正確な情報をご入力ください。</p>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium animate-pulse"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                Identity Verification Active
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Step1: IDスキャン */}
              <div
                className="rounded-xl p-5 space-y-4"
                style={{ background: '#13141f', border: '1px solid #1e293b' }}
              >
                <p className="text-xs font-semibold text-slate-500">Step 1 — ID Scan</p>
                
                {/* カメラモーダル */}
                {isCameraOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
                    <div className="w-full max-w-sm space-y-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="flex gap-2">
                        <button onClick={closeCamera} className="flex-1 py-3 rounded-lg bg-slate-800 text-sm font-bold text-white">キャンセル</button>
                        <button onClick={capturePhoto} className="flex-1 py-3 rounded-lg bg-emerald-600 text-sm font-bold text-white">撮影する</button>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="rounded-lg aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                  style={{ border: '2px dashed #334155', background: '#0a0b0f' }}
                  onClick={startCamera}
                >
                  <input type="file" ref={fileInputRef} onChange={runCheckin} className="hidden" accept="image/*" />
                  {checkinStatus === 'SCANNING' && <Loader2 size={36} className="text-emerald-400 animate-spin" />}
                  {checkinStatus === 'VERIFIED' && <CheckCircle2 size={36} style={{ color: '#10b981' }} />}
                  {checkinStatus === 'IDLE' && <Camera size={36} className="text-slate-600" />}
                  <p className="text-xs text-slate-500">
                    {checkinStatus === 'VERIFIED' ? 'スキャン完了' : checkinStatus === 'SCANNING' ? 'AI読み取り中...' : '身分証をスキャン'}
                  </p>
                </div>
              </div>

              {/* Step2: 台帳記入 */}
              <div
                className="rounded-xl p-5 space-y-4"
                style={{ background: '#13141f', border: '1px solid #1e293b' }}
              >
                <p className="text-xs font-semibold text-slate-500">Step 2 — Ledger Entry</p>
                <div className="space-y-3">
                  {[
                    { label: '氏名', value: ledgerName, set: setLedgerName, placeholder: '氏名を入力' },
                    { label: '住所', value: ledgerAddress, set: setLedgerAddress, placeholder: '住所を入力' },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-600">{f.label}</label>
                      <input
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        placeholder={checkinStatus === 'SCANNING' ? 'AI読み取り中...' : f.placeholder}
                        className={inputCls}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = '#10b981')}
                        onBlur={e => (e.target.style.borderColor = '#334155')}
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">職業</label>
                    <select
                      value={ledgerOccupation}
                      onChange={e => setLedgerOccupation(e.target.value)}
                      className={inputCls}
                      style={{ ...inputStyle, appearance: 'none' as any }}
                    >
                      <option value="">職業を選択...</option>
                      {['会社員','自営業','公務員','学生','無職','その他'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">前泊地・行先地</label>
                    <input
                      value={ledgerTravel}
                      onChange={e => setLedgerTravel(e.target.value)}
                      placeholder="例：大阪 → 東京 → 横浜"
                      list="travel-suggestions"
                      className={inputCls}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#10b981')}
                      onBlur={e => (e.target.style.borderColor = '#334155')}
                    />
                    <datalist id="travel-suggestions">
                      {['自宅','東京','大阪','京都','名古屋','福岡','札幌','海外'].map(v => (
                        <option key={v} value={v} />
                      ))}
                    </datalist>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
                  >
                    <PenLine size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-xs text-slate-400">署名を行ってください</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('lock')}
                    className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{ background: '#10b981', color: '#fff' }}
                  >
                    PMS登録 ＆ 鍵発行へ <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 鍵発行 --- */}
        {activeTab === 'lock' && (
          <div
            className="rounded-xl p-10 flex flex-col items-center justify-center gap-8"
            style={{ background: '#0d1117', border: '1px solid #1e293b' }}
          >
            <Lock size={48} style={{ color: '#10b981' }} />
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-slate-100">Your Access Key</h3>
              <p className="text-xs text-slate-500">チェックイン期間中のみ有効な暗証番号です。</p>
            </div>
            <div
              className="rounded-xl px-12 py-8 text-center"
              style={{ background: '#13141f', border: '2px solid #10b981', boxShadow: '0 0 30px rgba(16,185,129,0.15)' }}
            >
              <p className="text-xs font-medium text-slate-500 mb-3">Room: 201</p>
              <p className="text-6xl font-bold text-slate-100 tracking-[0.2em]" style={{ color: '#10b981' }}>8421</p>
            </div>
            <button
              onClick={() => setActiveTab('kiosk')}
              className="px-8 h-10 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
            >
              Finish →
            </button>
          </div>
        )}

        {/* --- チェックアウト --- */}
        {activeTab === 'checkout' && (
          <div
            className="rounded-xl p-8 flex flex-col items-center gap-8"
            style={{ background: '#0d1117', border: '1px solid #1e293b', minHeight: 320 }}
          >
            {checkoutStep === 'confirm' && (
              <div className="w-full max-w-md flex flex-col items-center gap-6">
                <LogOut size={40} style={{ color: '#10b981' }} />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-100">チェックアウト確認</h3>
                  <p className="text-xs text-slate-500 mt-1">以下の内容でチェックアウトします</p>
                </div>
                <div className="w-full rounded-xl p-5 space-y-3" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">お名前</span>
                    <span className="text-slate-100 font-medium">山田 太郎 様</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">部屋番号</span>
                    <span className="text-slate-100 font-medium">201号室</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">チェックイン</span>
                    <span className="text-slate-100 font-medium">2026/05/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">チェックアウト</span>
                    <span className="text-slate-100 font-medium">2026/05/11（本日）</span>
                  </div>
                  <div className="border-t border-slate-800 pt-3 flex justify-between text-sm">
                    <span className="text-slate-500">追加料金</span>
                    <span className={hasExtraCharge ? 'text-amber-400 font-semibold' : 'text-emerald-500 font-medium'}>
                      {hasExtraCharge ? '¥3,300（要精算）' : 'なし'}
                    </span>
                  </div>
                </div>
                {hasExtraCharge ? (
                  <div
                    className="w-full rounded-xl p-5 flex flex-col items-center gap-4 text-center"
                    style={{ background: '#1a1200', border: '1px solid rgba(251,191,36,0.3)' }}
                  >
                    <div className="text-amber-400 text-4xl">⚠️</div>
                    <p className="text-amber-300 font-semibold text-sm">追加料金が発生しています</p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      自動精算できない料金があります。<br />
                      スタッフをお呼びして精算の上、チェックアウトをお願いします。
                    </p>
                    <button
                      className="px-6 h-10 rounded-lg text-sm font-semibold transition-all"
                      style={{ background: '#f59e0b', color: '#000' }}
                      onClick={() => alert('スタッフを呼び出しました。しばらくお待ちください。')}
                    >
                      🔔 スタッフを呼ぶ
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCheckoutStep('processing')}
                    className="w-full h-12 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#10b981', color: '#fff' }}
                  >
                    チェックアウトする →
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('kiosk')}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  ← スタートに戻る
                </button>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <CheckoutProcessing onDone={() => setCheckoutStep('done')} />
            )}

            {checkoutStep === 'done' && (
              <div className="flex flex-col items-center gap-6 py-8 text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid #10b981' }}
                >
                  <span className="text-4xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">チェックアウト完了</h3>
                  <p className="text-slate-400 text-sm mt-1">ご利用ありがとうございました</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  鍵カードの返却をお忘れなく。<br />またのご利用をお待ちしております。
                </p>
                <button
                  onClick={() => { setCheckoutStep('confirm'); setActiveTab('kiosk') }}
                  className="px-8 h-10 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
                >
                  スタートに戻る
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">Nextra AI Autonomous Front System · NextraLabs 2026</p>
      </div>
    </div>
  )
}

// setTimeout を useEffect で安全に処理するサブコンポーネント
function CheckoutProcessing({ onDone }: { onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 font-medium text-sm">精算処理中...</p>
      <p className="text-slate-500 text-xs">PMSと同期しています</p>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function HotelPage() { return <NoSSR /> }
