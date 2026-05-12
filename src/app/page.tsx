'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap, BookOpen, Calculator, ShoppingBag, ArrowRight, Star, X
} from 'lucide-react'

const REVIEWS = [
  { name: '田中 裕子', job: 'フリーランスデザイナー', rating: 5, text: 'SNS投稿が完全自動化できて、週4時間の作業が消えました。', avatar: '田' },
  { name: '山本 健太', job: '不動産エージェント', rating: 5, text: 'お客様への提案資料をAIが作ってくれる。競合と差がつきすぎて怖いくらいです。', avatar: '山' },
  { name: '佐藤 美咲', job: '副業OL', rating: 5, text: 'Kindle出版ナビで初めての電子書籍を出版できました！', avatar: '佐' },
  { name: '鈴木 大輔', job: 'ホテル経営者', rating: 5, text: 'チェックインの自動化で夜間スタッフが不要になりました。', avatar: '鈴' },
  { name: '中村 彩', job: 'ECショップオーナー', rating: 4, text: '詐欺ディフェンダーが予想外に優秀。怪しい取引を事前にキャッチしてくれています。', avatar: '中' },
  { name: '高橋 誠', job: 'Webマーケター', rating: 5, text: '30ツール使い放題でこの価格は破格。個別契約したら月5万は超える内容です。', avatar: '高' },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [floatClosed, setFloatClosed] = useState(false)
  const [exitPopup, setExitPopup] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const exitFired = useRef(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 5 && !exitFired.current) {
        exitFired.current = true
        setExitPopup(true)
      }
    }
    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  if (!mounted) return null

  const visibleReviews = showAllReviews ? REVIEWS : REVIEWS.slice(0, 3)

  return (
    <div className="bg-[#050507] text-slate-200 min-h-screen flex flex-col">

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes emeraldPulse { 0%,100% { box-shadow: 0 4px 24px rgba(16,185,129,0.4); } 50% { box-shadow: 0 4px 32px rgba(16,185,129,0.65); } }
      `}</style>

      {/* ===== Exit Intent ===== */}
      {exitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setExitPopup(false)}>
          <div className="bg-[#0d1117] border border-emerald-500/40 rounded-2xl p-8 max-w-md w-full text-center relative shadow-[0_0_60px_rgba(16,185,129,0.15)]"
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setExitPopup(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
              <X size={18} />
            </button>
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ちょっと待って！</h3>
            <p className="text-slate-400 text-sm mb-1">今なら<span className="text-emerald-400 font-bold">30のAIツールが使い放題</span></p>
            <p className="text-slate-500 text-xs mb-6">無料プランで今すぐ試せます。クレジットカード不要。</p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <Link href="/signup" className="flex-1">
                <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm">無料で始める →</Button>
              </Link>
              <button onClick={() => setExitPopup(false)} className="flex-1 h-11 rounded-xl border border-white/10 text-slate-500 text-sm hover:text-slate-300 transition-colors">後で</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== フローティングCTA ===== */}
      {scrolled && !floatClosed && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2" style={{ animation: 'slideUp 0.3s ease' }}>
          <button onClick={() => setFloatClosed(true)} className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
            <X size={14} />
          </button>
          <Link href="/signup">
            <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-[0_4px_24px_rgba(16,185,129,0.4)] hover:scale-105 transition-all"
              style={{ animation: 'emeraldPulse 2s ease-in-out infinite' }}>
              無料で使ってみる →
            </Button>
          </Link>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 text-center overflow-hidden">
        {/* 背景グロウ */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative">
          {/* バッジ */}
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-tight">NextraLabs — AI Platform</span>
          </div>

          {/* メインコピー */}
          <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-6 leading-[1.1]">
            AIツールで、<br />
            <span className="text-emerald-400">業務を自動化。</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
            指示したら、あとは全部やってくれる。<br />30のAIツールが、あなたの時間を取り戻す。
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
            <Link href="/login?provider=google">
              <Button size="lg" className="px-6 h-12 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-sm flex items-center gap-2.5 shadow-lg hover:scale-[1.02] transition-all">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Googleで無料登録
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="ghost" className="px-6 h-12 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 rounded-xl text-sm font-medium transition-all">
                ツール一覧を見る <ArrowRight className="inline ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* 統計 — ヒーロー内に統合 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 max-w-2xl mx-auto">
            {[
              { value: '2,847', label: '登録ユーザー' },
              { value: '30+', label: 'AIツール' },
              { value: '98%', label: '満足度' },
              { value: '12,400h', label: '削減した作業時間' },
            ].map((s, i) => (
              <div key={i} className="bg-[#0d1117] py-5 px-4 text-center">
                <p className="text-xl md:text-2xl font-bold text-emerald-400">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 無料体験ツール ===== */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs mb-4">登録不要・無料</Badge>
            <h2 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">今すぐ試せるツール</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { id: 'kdp-guide', title: 'Kindle出版完全ナビ', icon: BookOpen, desc: 'ゼロからKindle出版を完全ガイド' },
              { id: 'loan-advisor', title: '借金完済・おまとめ診断', icon: Calculator, desc: '最適な返済プランをAIが診断' },
              { id: 'shopping-stopper', title: 'AI買い物依存ストッパー', icon: ShoppingBag, desc: '衝動買いをAIがその場で止める' },
            ].map((tool) => (
              <Link key={tool.id} href={`/products/${tool.id}/app`} className="group block">
                <div className="bg-[#0d1117] border border-white/5 hover:border-emerald-500/40 rounded-2xl p-6 flex items-center gap-5 transition-all hover:bg-[#0d1117]/80 hover:shadow-[0_0_24px_rgba(16,185,129,0.08)]">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <tool.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{tool.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                    <p className="text-xs text-emerald-400 mt-2 font-medium group-hover:underline">無料で使う →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 料金プラン ===== */}
      <section className="py-20 border-t border-white/5 bg-[#080809]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-semibold text-white tracking-tight mb-2">シンプルな料金</h2>
            <p className="text-slate-500 text-sm">隠れた費用なし。いつでも解約できます。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                name: 'スタンダード', price: '¥980', period: '/月',
                badge: null,
                features: ['人気ツール20本以上', 'AI副業・防災・料理・旅行など', 'Gemini AI フル活用', 'いつでも解約OK'],
                cta: '始める', href: '/signup?plan=standard', accent: false,
                note: 'まずはここから',
              },
              {
                name: 'プレミアム', price: '¥1,980', period: '/月',
                badge: '一番人気',
                features: ['全ツール30本以上 使い放題', 'YouTube・SNS・Gmail AI連携', '画像生成・プロンプト最適化', '優先サポート'],
                cta: '今すぐ始める', href: '/signup?plan=premium', accent: true,
                note: null,
              },
              {
                name: 'エンタープライズ', price: '¥4,980', period: '/月',
                badge: null,
                features: ['ホテル・民泊向けAI自動化', 'Nextra AI KIOSKシステム', 'チーム複数アカウント', '専用サポート・SLA'],
                cta: 'お問い合わせ', href: '/contact', accent: false,
                note: '法人・ホテル向け',
              },
            ].map(plan => (
              <div key={plan.name}
                className={`rounded-2xl p-6 border transition-all relative ${plan.accent
                  ? 'border-emerald-500/60 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.1)]'
                  : 'border-white/5 bg-[#0d1117]'}`}>
                {plan.badge && (
                  <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px] mb-3">{plan.badge}</Badge>
                )}
                {plan.note && (
                  <p className="text-[10px] text-emerald-400 font-medium mb-2">{plan.note}</p>
                )}
                <p className="text-slate-400 text-xs font-medium mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {plan.price}<span className="text-sm text-slate-500 font-normal ml-1">{plan.period}</span>
                </p>
                {plan.accent && (
                  <p className="text-[10px] text-slate-500 mb-4">年払いで2ヶ月分お得</p>
                )}
                {!plan.accent && <div className="mb-4" />}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-emerald-400 font-bold">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className={`w-full h-10 rounded-xl font-semibold text-sm transition-all ${plan.accent
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'}`}>
                    {plan.cta} →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 mt-6">クレジットカード不要で無料登録 · いつでも解約可能</p>
        </div>
      </section>

      {/* ===== ユーザーの声 ===== */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-semibold text-white tracking-tight mb-2">ユーザーの声</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-emerald-400 fill-emerald-400" />)}
              </div>
              <span className="text-slate-500 text-xs">4.9 / 5.0（2,847件）</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {visibleReviews.map((r, i) => (
              <div key={i} className="bg-[#0d1117] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{r.name}</p>
                    <p className="text-[11px] text-slate-500">{r.job}</p>
                  </div>
                  <div className="flex shrink-0">
                    {[...Array(r.rating)].map((_, j) => <Star key={j} size={11} className="text-emerald-400 fill-emerald-400" />)}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
          {!showAllReviews && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAllReviews(true)}
                className="text-xs text-slate-500 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-xl px-6 py-2.5 transition-all">
                すべての口コミを見る ({REVIEWS.length}件) ↓
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== 最終CTA ===== */}
      <section className="py-24 border-t border-white/5 bg-[#080809]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4 leading-tight tracking-tight">
            あなたのAIを、<span className="text-emerald-400">今すぐ。</span>
          </h2>
          <p className="text-slate-500 text-sm mb-10">2,847名がすでに業務を自動化中。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login?provider=google">
              <Button size="lg" className="px-8 h-12 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-sm flex items-center gap-2.5 shadow-lg hover:scale-[1.02] transition-all">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Googleで無料登録
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="ghost" className="px-8 h-12 border border-white/10 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all">
                まずツールを見る →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== フッター ===== */}
      <footer className="border-t border-white/5 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <span className="text-xs text-slate-600">© 2026 NextraLabs</span>
          <div className="flex items-center gap-1">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 py-2 px-3 rounded-lg transition-colors">プライバシーポリシー</Link>
            <span className="text-slate-700">·</span>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 py-2 px-3 rounded-lg transition-colors">利用規約</Link>
            <span className="text-slate-700">·</span>
            <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-300 py-2 px-3 rounded-lg transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </footer>

      {/* 構造化データ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'NextraLabsは無料で使えますか？', acceptedAnswer: { '@type': 'Answer', text: 'はい、一部のツールは無料プランでご利用いただけます。クレジットカード不要・登録のみで今すぐ使えます。' } },
          { '@type': 'Question', name: 'NextraLabsのAIツールは何種類ありますか？', acceptedAnswer: { '@type': 'Answer', text: '2026年5月現在、SNS・出版・家計・旅行・学習・副業・防犯・婚活など9ジャンル30種類以上のAIツールをご用意しています。' } },
          { '@type': 'Question', name: 'いつでも解約できますか？', acceptedAnswer: { '@type': 'Answer', text: 'はい、いつでも解約可能です。解約後も当月末まではサービスをご利用いただけます。違約金・縛りは一切ありません。' } },
          { '@type': 'Question', name: 'NextraLabsはどんな人向けですか？', acceptedAnswer: { '@type': 'Answer', text: '副業・在宅ワークをしたい方、家計を改善したい主婦・サラリーマン、Kindle出版に挑戦したい方、SNSマーケティングを効率化したい事業者、資格勉強を自動化したい学生など、幅広い方にご利用いただいています。' } },
          { '@type': 'Question', name: 'NextraLabsで使えるAIはなんですか？', acceptedAnswer: { '@type': 'Answer', text: 'Google Gemini 2.5 Flash（最上位モデル）を主軸に、用途に応じて最適なAIを組み合わせて使用しています。' } },
          { '@type': 'Question', name: 'スマホでも使えますか？', acceptedAnswer: { '@type': 'Answer', text: 'はい、スマートフォン・タブレット・PCすべてに対応しています。アプリのインストールも不要です。' } },
          { '@type': 'Question', name: 'NextraLabsの料金プランを教えてください。', acceptedAnswer: { '@type': 'Answer', text: '無料プラン（一部ツール利用可）、ライトプラン月額980円、スタンダードプラン月額1,980円、プレミアムプラン月額2,980円の4プランをご用意しています。' } },
          { '@type': 'Question', name: 'Kindle出版をAIでサポートしてもらえますか？', acceptedAnswer: { '@type': 'Answer', text: 'はい、「Kindle出版完全ナビ」と「Kindle AI ファクトリー」の2ツールで、テーマ入力からKDP入稿用原稿の自動生成まで一気通貫でサポートします。' } },
        ],
      })}} />
    </div>
  )
}
