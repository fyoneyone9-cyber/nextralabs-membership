'use client'
import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Shield, Zap, Building2, Search, ArrowRight, Smartphone, Printer, Globe, AlertTriangle, Camera, Loader2 } from 'lucide-react'
import Link from 'next/link'

const StayseeLpContent = () => {

  const [room, setRoom] = useState('')
  const [description, setDescription] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const scrollToTool = () => {
    const el = document.getElementById('tool')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('忘れ物の特徴を入力してください')
      return
    }
    setError('')
    setLoading(true)
    setResult('')
    try {
      const prompt = `あなたはホテルの忘れ物プロ鑑定AIです。以下の忘れ物情報をもとに、詳細な鑑定レポートを日本語で作成してください。

【部屋番号】${room || '不明'}
【忘れ物の特徴】${description}

以下の形式でレポートを作成してください：

## 🔍 AI鑑定レポート

**物品種別：** （例：衣類・電子機器・アクセサリー等）
**推定ブランド・メーカー：** （わかる範囲で）
**状態ランク：** A（良好） / B（使用感あり） / C（要確認）
**推定価値：** （概算）

## 📋 保管証明書

管理番号：STAY-${Date.now().toString().slice(-6)}
発行日時：${new Date().toLocaleDateString('ja-JP')}
保管場所：フロントカウンター

## 📬 お客様への連絡文例

「○○様、このたびはご宿泊いただきありがとうございました。お部屋に忘れ物がございましたのでご連絡いたします。（以下に物品詳細）」

## 💡 対応推奨アクション

1. お客様への即時連絡
2. 着払い発送の手配
3. 保管期限の設定（30日推奨）`

      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCMbtu9IJIGbml2KOv1Yjit9QP7TkmIgiA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      })
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        setResult(text)
      } else {
        setError('AIの応答が取得できませんでした。再度お試しください。')
      }
    } catch {
      setError('エラーが発生しました。再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-xs">宿泊業界特化型 AIソリューション</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          Staysee <span className="text-emerald-500">AI</span> Finder
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
          忘れ物対応を「コスト」から「利益と信頼」へ。<br className="hidden md:block" />
          AIが即座に鑑定・証明書発行・連絡文を生成。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <button
            onClick={scrollToTool}
            className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase italic"
          >
            今すぐ無料で試す ➔
          </button>
        </div>
      </section>

      {/* 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center text-left">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">こんな課題、ありませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 客室の忘れ物、持ち主の特定に時間がかかる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 電話での特徴説明が曖昧でミスが起きやすい</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 着払い発送の事務作業が煩雑で工数がかかる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 宿泊者との「言った言わない」のトラブル</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
            <p className="text-red-400 text-lg italic font-black text-center leading-loose">
              その「隠れた赤字業務」、<br />
              Nextra AIが完全自動化します。
            </p>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">主要な4つの機能</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {[
            { icon: <Camera size={32} />, title: 'AIプロ鑑定', desc: 'AIが物品の種類、ブランド、状態ランクを詳細に言語化。誰でもプロの鑑定が可能に。' },
            { icon: <Globe size={32} />, title: 'ステイシー本物連携', desc: '宿泊管理システム（Staysee）と完全同期。昨日その部屋にいたお客様を瞬時にリストアップ。' },
            { icon: <Shield size={32} />, title: 'AI保管証明書', desc: '公式な管理番号付きの鑑定書を自動発行。宿泊者への送付で圧倒的な信頼を提供。' },
            { icon: <Zap size={32} />, title: '収益化エンジン', desc: 'AIが送料や手数料を自動算出。お土産同梱（アップセル）までAIが提案します。' },
          ].map((f, i) => (
            <div key={i} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all shadow-xl group">
              <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h4 className="text-2xl font-black text-white italic uppercase">{f.title}</h4>
              <p className="text-slate-400 font-bold leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ★ AIツール本体 */}
      <section id="tool" className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-xs">AI鑑定ツール</Badge>
          <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">忘れ物を今すぐ鑑定</h3>
          <p className="text-slate-400 font-bold">忘れ物の特徴を入力するだけで、AIが即座に鑑定レポート＋証明書＋連絡文を生成します</p>
        </div>

        <div className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[3rem] p-8 md:p-12 space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.1)]">
          <div className="space-y-2">
            <label className="text-sm font-black text-emerald-400 uppercase tracking-wider">部屋番号（任意）</label>
            <input
              type="text"
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="例：302号室"
              className="w-full bg-black/50 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-emerald-400 uppercase tracking-wider">忘れ物の特徴 <span className="text-red-400">*</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="例：黒いiPhone、ケース付き。充電器も一緒にあり。ベッドサイドに置いてありました。"
              rows={4}
              className="w-full bg-black/50 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all resize-none"
            />
          </div>
          {error && <p className="text-red-400 font-bold text-sm">{error}</p>}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase italic flex items-center justify-center gap-3"
          >
            {loading ? <><Loader2 className="animate-spin" size={24} />鑑定中...</> : <><Camera size={24} />AI鑑定スタート</>}
          </button>
        </div>

        {result && (
          <div className="mt-8 bg-[#13141f] border-2 border-emerald-500/30 rounded-[3rem] p-8 md:p-12 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
            <h4 className="text-emerald-400 font-black text-lg uppercase tracking-wider mb-6">✅ 鑑定完了</h4>
            <div className="text-slate-300 font-bold leading-relaxed whitespace-pre-wrap text-sm">{result}</div>
          </div>
        )}
      </section>

      {/* CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Building2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">最高峰のマスタモデルを。</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4">
              今すぐNextraLabsに参加して、あなたのホテルのホスピタリティをAIでマスタ化しましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-emerald-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 uppercase italic leading-none">
                  無料で始めてみる
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default StayseeLpContent
