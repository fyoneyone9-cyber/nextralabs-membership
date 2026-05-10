'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { ClipboardPaste, ArrowRight, MapPin, ShieldCheck } from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isClient, setIsClient] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [report, setReport] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [weather, setWeather] = useState<{ temperature: number; windspeed: number } | null>(null)
  const [pref, setPref] = useState('')
  const [city, setCity] = useState('')
  const [stock, setStock] = useState('')
  const [housing, setHousing] = useState('')

  useEffect(() => { setIsClient(true) }, [])

  const getWeatherData = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      const data = await res.json()
      setWeather(data.current_weather)
    } catch (e) {
      console.error('Weather fetch error:', e)
    }
  }

  const getMyLocation = () => {
    setIsLocating(true)
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('お使いのブラウザは位置情報に対応していません')
      setIsLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(coords)
        getWeatherData(coords.lat, coords.lng)
        setIsLocating(false)
      },
      (err) => {
        console.error(err)
        alert('位置情報の取得に失敗しました。手動で入力してください')
        setIsLocating(false)
      }
    )
  }

  const FINAL_PROMPT = `あなたはプロの災害対策コンサルタントです。
以下の「公的機関推奨の共通防災知識」と【地域環境データ】に基づき、生存確率を最大化する「生存戦略レポート」を作成してください。

【共通防災知識の鉄則】
1. 生存優先度: 3・3・3の法則 — 3分(呼吸)、3時間(体温)、3日(水)を死守せよ
2. 家庭内備蓄: 最低3日分(推奨1週間)の水(1人1日3L)と食料
3. 発災時行動: シェイクアウト(まず低く、頭を守り、動かない)の徹底
4. 防御策: ブレーカー遮断、ハザードマップ確認、家族間連絡手段(171)の確立

【地域環境データ】
現在位置(座標): ${location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : '未特定'}
現在の気象: ${weather ? `気温:${weather.temperature}℃ 風速:${weather.windspeed}km/h` : '不明'}
都道府県: ${pref || '未入力'}
市区町村: ${city || '未入力'}
備蓄状況: ${stock || '未入力'}
住居形態: ${housing || '未入力'}

以下の項目で回答してください:
1. 【地域リスク診断】地震・洪水・土砂災害などのリスク評価
2. 【備蓄最適化】現状の不足物資と優先順位
3. 【生存戦略】発災後72時間の具体的な行動計画
4. 【避難所選定】近隣の安全な避難エリアの提案`

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(FINAL_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [FINAL_PROMPT])

  if (!isClient) return null

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">

      {/* ヘッダー */}
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-600 text-white font-semibold px-3 py-0.5 text-[9px] md:text-[10px] uppercase rounded-full">
          Survival Intelligence Hub
        </Badge>
        <h1 className="text-2xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-none">
          AI防災パーソナルガイド
        </h1>
        <div className="inline-block bg-emerald-600 text-white font-semibold px-4 py-0.5 rounded-full text-[9px] md:text-[10px] tracking-tight">
          MASTERMODEL
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
        {/* LEFT: 入力 */}
        <div className="bg-[#13141f] border border-white/10 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">#1 Environment Scan</p>

          {/* GPS */}
          <button
            onClick={getMyLocation}
            disabled={isLocating}
            className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <MapPin className={`w-5 h-5 ${isLocating ? 'animate-ping text-emerald-400' : 'text-emerald-400'}`} />
            <span className="text-sm">{isLocating ? '定位中...' : 'GPSで現在地・天気を取得'}</span>
            <div className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${location ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {location ? 'GPS ON' : 'GPS OFF'}
            </div>
          </button>

          {location && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Coordinates</p>
                <p className="text-xs font-mono text-emerald-400">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Weather</p>
                <p className="text-xs font-bold text-white">{weather ? `${weather.temperature}℃ / ${weather.windspeed}km/h` : 'Syncing...'}</p>
              </div>
            </div>
          )}

          {/* フォーム */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 pl-1">都道府県</label>
                <input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="神奈川県"
                  className="w-full h-11 bg-[#0a0b14] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 pl-1">市区町村</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="海老名市"
                  className="w-full h-11 bg-[#0a0b14] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 pl-1">備蓄状況（水・食料など）</label>
              <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="例: 水10L, 非常食3日分"
                className="w-full h-11 bg-[#0a0b14] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 pl-1">住居形態</label>
              <input value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="例: 木造2階建て"
                className="w-full h-11 bg-[#0a0b14] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
            </div>
          </div>

          {/* コピー + AI連携ボタン */}
          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className={`w-full h-14 text-base font-bold rounded-xl transition-all shadow-lg ${
                copied
                  ? 'bg-emerald-500 text-slate-950 scale-95'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {copied ? '✅ コピー完了！' : '① 診断プロンプトをコピー'}
            </button>
            <div className="grid grid-cols-3 gap-2">
              <button
                className="h-14 bg-white/5 border border-emerald-500/30 rounded-xl text-[10px] font-bold uppercase text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex flex-col items-center justify-center gap-1"
                onClick={() => window.open('https://chatgpt.com', '_blank')}
              >
                <span className="text-lg">💬</span> ChatGPT
              </button>
              <button
                className="h-14 bg-white/5 border border-emerald-500/30 rounded-xl text-[10px] font-bold uppercase text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex flex-col items-center justify-center gap-1"
                onClick={() => window.open('https://gemini.google.com', '_blank')}
              >
                <span className="text-lg">✨</span> Gemini
              </button>
              <button
                className="h-14 bg-white/5 border border-slate-500/30 rounded-xl text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-600 hover:text-white transition-all flex flex-col items-center justify-center gap-1"
                onClick={() => window.open('https://claude.ai', '_blank')}
              >
                <span className="text-lg">🤖</span> Claude
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: レポート貼り付け */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#13141f] border border-white/10 p-6 md:p-8 shadow-xl flex flex-col gap-4 relative overflow-hidden flex-1">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                <ClipboardPaste className="text-emerald-400 w-5 h-5" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white uppercase tracking-tight">
                ② 生存戦略レポート
              </h3>
            </div>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="AIからの戦略レポートをここにペースト..."
              className="flex-1 bg-[#0d0f1a] border border-white/10 rounded-2xl p-5 text-sm text-slate-300 focus:border-emerald-500 outline-none font-mono leading-relaxed min-h-[360px] resize-none transition-all"
            />
            {report && (
              <div className="p-4 bg-emerald-600/20 border border-emerald-500/40 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="text-emerald-400 w-6 h-6 shrink-0" />
                <p className="text-emerald-300 font-semibold text-sm">Survive Protocol Synchronized</p>
              </div>
            )}
          </div>
          <button
            onClick={() => window.print()}
            className="h-14 bg-white text-slate-950 font-semibold rounded-xl shadow-lg hover:bg-emerald-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} /> レポートを印刷・保存
          </button>
        </div>
      </div>

      <DebugPanel data={{ location, hasReport: !!report }} toolId="disaster-guard-master" />
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center text-emerald-500 font-bold animate-pulse uppercase tracking-tight">
      Initializing...
    </div>
  ),
})

export default function DisasterGuard() {
  return <NoSSRWrapper />
}
