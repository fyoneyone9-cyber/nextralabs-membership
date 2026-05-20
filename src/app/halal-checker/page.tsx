'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Copy, Check, Building2, ClipboardList, Sparkles, BarChart3 } from 'lucide-react'

// Static metadata handled via separate metadata.ts (this is a client component)

interface HalalResult {
  religion: string
  dietType: string
  confidence: number
  presets: string[]
  notes: string
  handover: string
}

export default function HalalCheckerPage() {
  const [name, setName] = useState('')
  const [nationality, setNationality] = useState('')
  const [guestRequest, setGuestRequest] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HalalResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleAnalyze = async () => {
    if (!name.trim() || !nationality.trim()) {
      setError('予約者名と国籍を入力してください')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/halal-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nationality, request: guestRequest }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'エラーが発生しました')
      setResult(data)
    } catch (e: any) {
      setError(e.message ?? '不明なエラー')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.handover)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confidenceColor = (c: number) =>
    c >= 80 ? 'bg-green-500' : c >= 50 ? 'bg-yellow-500' : 'bg-slate-500'

  const confidenceLabel = (c: number) =>
    c >= 80 ? '高確信' : c >= 50 ? '中程度' : '参考情報'

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 pb-32">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest">
          🕌 インバウンド × AI 宗教・食習慣対応
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-tight">
          予約名と国籍を入れるだけで<br />
          <span className="text-green-400">ハラール・宗教対応</span>を自動提案
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          チェックイン前に申し送り完了。<br />
          フロントの対応漏れをゼロに。
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a href="#demo">
            <button className="h-14 px-10 font-bold text-lg rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 20px 50px rgba(22,163,74,0.3)' }}>
              無料デモを試す ↓
            </button>
          </a>
          <Link href="/enterprise">
            <button className="h-14 px-10 font-bold text-lg rounded-2xl border border-white/20 text-slate-300 hover:text-white transition-colors">
              法人プランを見る →
            </button>
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs text-slate-500">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">ハラール対応</span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">ベジタリアン対応</span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">コーシャ対応</span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">礼拝マット準備</span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">10種以上のプリセット</span>
        </div>
      </section>

      {/* 課題セクション */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12 tracking-tight">
          こんな<span className="text-green-400">対応漏れ</span>、起きていませんか？
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { emoji: '🍖', title: 'ムスリムゲストに豚肉料理を出してしまった', desc: '国籍から事前に気づけていれば防げたトラブル。口コミに「最悪だった」と書かれることも。' },
            { emoji: '🥗', title: 'ヴィーガンゲストへの配慮が事前にわからなかった', desc: 'チェックイン後に発覚。慌てて対応するも、印象は既に悪化してしまった。' },
            { emoji: '👥', title: 'スタッフによって対応がバラバラ', desc: '勘と経験頼みの対応では品質が安定しない。新人スタッフは特に判断が難しい。' },
          ].map((item) => (
            <div key={item.title} className="bg-[#13141f] border border-red-500/20 rounded-2xl p-6 space-y-3">
              <div className="text-3xl">{item.emoji}</div>
              <h3 className="font-bold text-white text-sm leading-snug">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* デモセクション */}
      <section id="demo" className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3 tracking-tight">
          今すぐ<span className="text-green-400">無料デモ</span>を体験
        </h2>
        <p className="text-slate-400 text-center text-sm mb-10">予約者名と国籍を入力するだけ。Gemini AIが3秒で分析します。</p>

        <div className="bg-[#13141f] border border-white/10 rounded-3xl p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">予約者名 *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例: Ahmed Al-Rashid"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">国籍・出身地 *</label>
              <input
                type="text"
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                placeholder="例: UAE、サウジアラビア、インド"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">特別リクエスト（任意）</label>
            <input
              type="text"
              value={guestRequest}
              onChange={e => setGuestRequest(e.target.value)}
              placeholder="例: No pork please / Vegetarian meal required"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-green-500/50"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full h-12 font-bold text-sm rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AIが分析中...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AIで分析する
              </>
            )}
          </button>

          {/* 結果表示 */}
          {result && (
            <div className="space-y-5 pt-4 border-t border-white/10">
              {/* 宗教・食事タイプ・確信度 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-xs text-slate-500 uppercase tracking-widest">推定宗教</div>
                  <div className="text-lg font-bold text-white">{result.religion}</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-xs text-slate-500 uppercase tracking-widest">食事タイプ</div>
                  <div className="text-lg font-bold text-green-400">{result.dietType}</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-xs text-slate-500 uppercase tracking-widest">確信度</div>
                  <div className="text-lg font-bold text-white">{result.confidence}%</div>
                </div>
              </div>

              {/* 確信度バー */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>確信度</span>
                  <span className="font-bold">{confidenceLabel(result.confidence)}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${confidenceColor(result.confidence)}`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              {/* プリセットタグ */}
              {result.presets && result.presets.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">推奨対応項目</div>
                  <div className="flex flex-wrap gap-2">
                    {result.presets.map((p) => (
                      <span key={p} className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 説明文 */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">AIの判断根拠</div>
                <p className="text-sm text-slate-300 leading-relaxed bg-white/5 rounded-xl p-4">{result.notes}</p>
              </div>

              {/* 申し送り文 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">申し送り文（フロント用）</div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'コピー済み' : 'コピー'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={result.handover}
                  rows={5}
                  className="w-full bg-white/5 border border-green-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 leading-relaxed resize-none focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12 tracking-tight">
          <span className="text-green-400">4つの機能</span>で対応漏れをゼロに
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Sparkles, title: 'Gemini AI 高精度推定', desc: '名前・国籍・リクエスト文から宗教・食習慣を自動推定。10カ国語以上の名前パターンに対応。' },
            { icon: ClipboardList, title: 'ワンクリックプリセット', desc: 'ハラール/ベジタリアン/コーシャ等10種以上のプリセット。プッシュひとつで対応内容を確定。' },
            { icon: Building2, title: 'そのまま使える申し送り文', desc: 'フロントで読み上げるだけでOKな申し送り文を自動生成。記入漏れ・表記ゆれをなくします。' },
            { icon: BarChart3, title: '対応履歴・フィードバック', desc: '対応実績を蓄積してAI精度を向上。「実際にハラール対応した」フィードバックで学習します。（近日対応）' },
          ].map((f) => (
            <div key={f.title} className="bg-[#13141f] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 w-fit">
                <f.icon className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="font-bold text-white text-sm leading-snug">{f.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 料金プラン */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3 tracking-tight">
          <span className="text-green-400">料金プラン</span>
        </h2>
        <p className="text-slate-400 text-center text-sm mb-12">まずは無料プランでお試しください</p>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              name: 'フリー',
              price: '¥0',
              period: '',
              highlight: false,
              features: ['月30件まで', '手動入力', 'Gemini AI分析', 'プリセット対応', '申し送り文生成'],
            },
            {
              name: 'スタンダード',
              price: '¥9,800',
              period: '/月',
              highlight: false,
              features: ['月500件', '予約システム連携1社', 'メール申し送り', 'Supabase履歴管理', 'スタッフ3名'],
            },
            {
              name: 'プロ',
              price: '¥29,800',
              period: '/月',
              highlight: true,
              features: ['月2,000件', '予約システム連携3社', 'スタッフ10名', 'フィードバック学習', '月次レポート'],
            },
            {
              name: 'エンタープライズ',
              price: '要見積',
              period: '',
              highlight: false,
              features: ['件数無制限', '複数施設対応', 'ホワイトラベル', '専用サポート', 'SLA保証'],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 space-y-4 border ${
                plan.highlight
                  ? 'bg-green-500/10 border-green-500/40'
                  : 'bg-[#13141f] border-white/5'
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-bold text-green-400 uppercase tracking-widest">人気</div>
              )}
              <div>
                <div className="text-lg font-bold text-white">{plan.name}</div>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-green-400' : 'text-white'}`}>{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-green-600/20 to-slate-900 border border-green-500/20 rounded-3xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            法人プランの<span className="text-green-400">ご相談・見積もり</span>はこちら
          </h2>
          <p className="text-slate-400 text-sm">複数施設対応・ホワイトラベル・API直接提供など、ご要望に合わせてご提案します。</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/enterprise">
              <button className="h-12 px-8 font-bold text-sm rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                法人プランを見る →
              </button>
            </Link>
            <Link href="/contact">
              <button className="h-12 px-8 font-bold text-sm rounded-xl border border-white/20 text-slate-300 hover:text-white transition-colors">
                お問い合わせ
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
