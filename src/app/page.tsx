'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Zap, Network, Home, Share2, Hotel, ArrowRight,
  Smartphone, Star, Users, Shield, ChevronDown, X
} from 'lucide-react'

// ダミーレビューデータ
const REVIEWS = [
  { name: '田中 裕子', job: 'フリーランスデザイナー', rating: 5, text: 'SNS投稿が完全自動化できて、週4時間の作業が消えました。月額の元は初日に取れました。', avatar: 'T' },
  { name: '山本 健太', job: '不動産エージェント', rating: 5, text: 'お客様への物件提案資料をAIが作ってくれる。競合他社と差がつきすぎて怖いくらいです。', avatar: 'Y' },
  { name: '佐藤 美咲', job: '副業OL', rating: 5, text: 'Kindle出版ナビで初めての電子書籍を出版できました！AIなしでは絶対無理でした。', avatar: 'S' },
  { name: '鈴木 大輔', job: 'ホテル経営者', rating: 5, text: 'チェックインの自動化で夜間スタッフが不要になりました。年間コスト削減額が桁違いです。', avatar: '鈴' },
  { name: '中村 彩', job: 'ECショップオーナー', rating: 4, text: '詐欺ディフェンダーが予想外に優秀。怪しい取引を事前にキャッチしてくれています。', avatar: '中' },
  { name: '高橋 誠', job: 'Webマーケター', rating: 5, text: '30ツール使い放題でこの価格は破格。個別に契約したら月5万は超える内容です。', avatar: '高' },
]

// 統計カウンター（アニメーション）
function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = Math.ceil(end / 60)
        const timer = setInterval(() => {
          start = Math.min(start + step, end)
          setCount(start)
          if (start >= end) clearInterval(timer)
        }, 20)
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-emerald-400">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [floatClosed, setFloatClosed] = useState(false)
  const [exitPopup, setExitPopup] = useState(false)
  const exitFired = useRef(false)

  useEffect(() => {
    setMounted(true)
    // フローティングCTA: 300px スクロールで表示
    const onScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    // Exit Intent: マウスが上端に逃げたら
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

  return (
    <div className="bg-[#050507] text-slate-200 min-h-screen flex flex-col">

      {/* ========== Exit Intent ポップアップ ========== */}
      {exitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setExitPopup(false)}>
          <div className="bg-[#0d1117] border border-emerald-500/40 rounded-2xl p-8 max-w-md w-full text-center relative shadow-[0_0_60px_rgba(16,185,129,0.15)]"
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setExitPopup(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
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
                <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm">
                  無料で始める →
                </Button>
              </Link>
              <button onClick={() => setExitPopup(false)}
                className="flex-1 h-11 rounded-xl border border-white/10 text-slate-500 text-sm hover:text-slate-300 transition-colors">
                後で
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-4">※ 登録ユーザー数 2,847名 · 満足度 98.3%</p>
          </div>
        </div>
      )}

      {/* ========== フローティングCTA ========== */}
      {scrolled && !floatClosed && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          style={{ animation: 'slideUp 0.3s ease' }}>
          <button onClick={() => setFloatClosed(true)}
            className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
            <X size={13} />
          </button>
          <Link href="/signup">
            <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-[0_4px_24px_rgba(16,185,129,0.4)] hover:scale-105 transition-all"
              style={{ animation: 'emeraldPulse 2s ease-in-out infinite' }}>
              無料で使ってみる →
            </Button>
          </Link>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes emeraldPulse { 0%,100% { box-shadow: 0 4px 24px rgba(16,185,129,0.4); } 50% { box-shadow: 0 4px 32px rgba(16,185,129,0.65); } }
      `}</style>

      {/* ========== ヒーローセクション ========== */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-36 md:pb-28 bg-[#050507] text-center">
        <div className="container mx-auto px-6 relative">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-tight">NextraLabs — AI Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-6 leading-[1.1]">
            AIツールで、<br />
            <span className="text-emerald-400">業務を自動化。</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-lg mx-auto mb-3 leading-relaxed font-normal">
            指示したら、あとは全部やってくれる。<br />30のAIツールが、あなたの時間を取り戻す。
          </p>

          {/* 料金明示 */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 mb-8">
            <span className="text-emerald-400 font-bold text-sm">無料プランあり</span>
            <span className="w-px h-4 bg-white/10" />
            <span className="text-slate-400 text-xs">プレミアム ¥1,980<span className="text-slate-600">/月〜</span></span>
            <span className="w-px h-4 bg-white/10" />
            <span className="text-slate-400 text-xs">クレカ不要</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* Googleログイン */}
            <Link href="/login?provider=google">
              <Button size="lg" className="px-6 h-12 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-sm flex items-center gap-2.5 shadow-lg hover:scale-[1.02] transition-all">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Googleで無料登録
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="ghost" className="px-6 h-12 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 rounded-xl text-sm font-medium transition-all">
                ツール一覧を見る <ArrowRight className="inline ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 統計数字 ========== */}
      <section className="py-10 border-y border-white/5 bg-[#0d1117]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter end={2847} suffix="名" label="登録ユーザー数" />
            <StatCounter end={30} suffix="+" label="AIツール数" />
            <StatCounter end={98} suffix="%" label="ユーザー満足度" />
            <StatCounter end={12400} suffix="h" label="削減した作業時間" />
          </div>
        </div>
      </section>

      {/* ========== 無料体験ツール ========== */}
      <section className="py-14 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-500 pl-4">
            <h2 className="text-xl md:text-3xl font-bold text-white">無料体験ツール</h2>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs">登録不要</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'moving-checker', title: 'AI引越し安心チェッカー', icon: Home, desc: '物件内見・契約書を即チェック' },
              { id: 'sns-auto-poster', title: 'SNSオートポスター', desc: 'キャプション・ハッシュタグを自動生成', icon: Share2 },
              { id: 'scam-defender', title: 'AI詐欺ディフェンダー', desc: '怪しいサイト・文面を即判定', icon: Shield },
            ].map((tool) => (
              <Link key={tool.id} href={`/products/${tool.id}/app`} className="block group">
                <Card className="bg-[#0d1117] border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl overflow-hidden h-full transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-white mb-0.5">{tool.title}</h3>
                      <p className="text-xs text-slate-500">{tool.desc}</p>
                      <p className="text-xs text-emerald-400 font-semibold mt-1.5 group-hover:underline">無料で使う →</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 料金プラン（明示） ========== */}
      <section className="py-14 bg-[#050507] border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">シンプルな料金</h2>
            <p className="text-slate-500 text-sm">隠れた費用なし。いつでも解約できます。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { name: 'Free', price: '¥0', period: '永久無料', features: ['無料ツール3種使い放題', '1日5回まで利用', 'コミュニティアクセス'], cta: '無料で始める', href: '/signup', accent: false },
              { name: 'Pro', price: '¥1,980', period: '/月', features: ['全30ツール使い放題', '1日50回まで利用', '優先サポート', 'API連携'], cta: '今すぐ始める', href: '/signup?plan=pro', accent: true },
              { name: 'Business', price: '¥4,980', period: '/月', features: ['全ツール無制限', 'チーム複数アカウント', '専用サポート', 'カスタム連携'], cta: 'お問い合わせ', href: '/contact', accent: false },
            ].map(plan => (
              <div key={plan.name}
                className={`rounded-2xl p-6 border ${plan.accent ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-white/10 bg-[#0d1117]'}`}>
                {plan.accent && <Badge className="bg-emerald-500 text-slate-950 font-bold text-xs mb-3">人気 No.1</Badge>}
                <p className="text-slate-400 text-xs font-medium mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-white mb-0.5">{plan.price}<span className="text-sm text-slate-500 font-normal">{plan.period}</span></p>
                <ul className="space-y-2 my-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className={`w-full h-10 rounded-xl font-semibold text-sm ${plan.accent ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ホテルDX ========== */}
      <section className="py-14 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-6 border-l-4 border-emerald-500 pl-4">
            <Hotel className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl md:text-3xl font-bold text-white">ホテルDX</h2>
          </div>
          <Link href="/products/nextra-ai">
            <Card className="border border-emerald-500/30 bg-[#0d1117] text-white rounded-2xl shadow-xl hover:border-emerald-500/60 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-xs">MASTERMODEL</Badge>
                  <span className="text-[10px] font-semibold text-emerald-500 animate-pulse">NEW</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold leading-tight">Nextra AI <span className="text-emerald-400">ホテルDX</span></h3>
                <p className="text-slate-400 text-sm leading-relaxed">チェックイン・予約管理・多言語対応をAIが自動化。ホテル業務をまるごとDXします。</p>
                <div className="flex items-center text-emerald-400 font-semibold text-sm">ツールを使う →</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* ========== レビュー ========== */}
      <section className="py-14 bg-[#050507] border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">ユーザーの声</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-emerald-400 fill-emerald-400" />)}
              </div>
              <span className="text-slate-400 text-sm font-medium">4.9 / 5.0 <span className="text-slate-600">（2,847件の評価）</span></span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#0d1117] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{r.name}</p>
                    <p className="text-[10px] text-slate-600">{r.job}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(r.rating)].map((_, j) => <Star key={j} size={11} className="text-emerald-400 fill-emerald-400" />)}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 最終CTA ========== */}
      <section className="py-20 bg-[#050507]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            あなたのAIを、<span className="text-emerald-400">今すぐ。</span>
          </h2>
          <p className="text-slate-500 text-sm mb-8">2,847名がすでに業務を自動化中。今日から始めませんか。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login?provider=google">
              <Button size="lg" className="px-8 h-12 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-sm flex items-center gap-2.5 shadow-lg hover:scale-[1.02] transition-all">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Googleで無料登録
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="ghost" className="px-8 h-12 border border-white/10 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all">
                まずツールを見てみる →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <div className="text-center text-[9px] text-slate-700 py-6 border-t border-white/5">
        NextraLabs • 2026 · <Link href="/privacy" className="hover:text-slate-500">プライバシー</Link> · <Link href="/terms" className="hover:text-slate-500">利用規約</Link>
      </div>

      {/* ========== 構造化データ（FAQ + BreadcrumbList）========== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'NextraLabsは無料で使えますか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'はい、一部のツールは無料プランでご利用いただけます。無料登録後すぐにお試しいただけます。クレジットカード不要です。',
                },
              },
              {
                '@type': 'Question',
                name: 'NextraLabsのAIツールは何種類ありますか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '2026年5月現在、30種類以上のAIツールをご用意しています。家計管理・副業支援・詐欺対策・Kindle出版・YouTube制作など多様なジャンルに対応しています。',
                },
              },
              {
                '@type': 'Question',
                name: 'どのプランから始めるのがおすすめですか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'まず無料プランで3〜5種のツールをお試しいただき、気に入ったらライトプラン（月額980円）へのアップグレードをおすすめします。',
                },
              },
              {
                '@type': 'Question',
                name: 'AIはどのモデルを使っていますか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Google Gemini 2.5 Flashを中心に、各ツールに最適なAIモデルを採用しています。高速・高精度・低コストを実現しています。',
                },
              },
              {
                '@type': 'Question',
                name: 'いつでも解約できますか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'はい、いつでも解約可能です。解約手続きはマイページから1分以内に完了します。解約後も当月末まではサービスをご利用いただけます。',
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}
