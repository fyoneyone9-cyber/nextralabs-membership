import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI旅行コンシェルジュ | 楽天トラベル×Google Maps×AIで旅程を自動生成 | NextraLabs',
  description:
    '目的地・日程・予算を入力するだけ。楽天トラベルで宿を、Google Mapsで周辺観光地を自動取得し、Gemini AIが完全オリジナルの旅程を生成します。',
  keywords: ['AI旅行', '旅程自動生成', '楽天トラベルAPI', 'Google Maps観光', 'AI旅行計画'],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/travel-concierge',
  },
  openGraph: {
    title: 'AI旅行コンシェルジュ | 楽天トラベル×Google Maps×AIで旅程を自動生成',
    description:
      '目的地・日程・予算を入力するだけ。楽天トラベルで宿を、Google Mapsで観光地を自動取得し、Gemini AIがオリジナル旅程を生成。',
    url: 'https://membership-site-nextralabos.vercel.app/products/travel-concierge',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [
      {
        url: 'https://membership-site-nextralabos.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI旅行コンシェルジュ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI旅行コンシェルジュ | 楽天トラベル×Google Maps×AI',
    description: '目的地・日程・予算を入力するだけでAIが完全旅程を自動生成。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

const FEATURES = [
  {
    icon: '🏨',
    title: '楽天トラベルで宿を自動取得',
    desc: '予算・チェックイン日・人数に合わせて楽天トラベルから最安値ホテルをリアルタイム検索。',
  },
  {
    icon: '📍',
    title: 'Google Mapsで観光地を収集',
    desc: '目的地周辺の観光スポット・グルメ・温泉などをカテゴリ別に最大8件取得。評価・場所情報付き。',
  },
  {
    icon: '✈️',
    title: 'Gemini AIが旅程を完全生成',
    desc: '取得した宿・観光地データをもとに、日程・テーマに合わせた完全オリジナル旅程プランを出力。',
  },
  {
    icon: '💰',
    title: '概算予算も自動算出',
    desc: '交通費・宿泊費・食費・観光費の目安をAIが推定。旅行前の予算計画に活用できます。',
  },
]

const STEPS = [
  { num: '01', label: '目的地・日程を入力', desc: '行き先・チェックイン/アウト日・人数・予算・テーマを設定' },
  { num: '02', label: '宿と観光地を自動収集', desc: '楽天トラベルとGoogle Mapsが並列でリアルデータを取得' },
  { num: '03', label: 'AI旅程を受け取る', desc: 'Gemini 2.5 Flashが10〜20秒で完全旅程を生成' },
]

export default function TravelConciergeLP() {
  return (
    <div className="min-h-screen" style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif", color: '#f1f5f9' }}>
      {/* ─── Hero ─── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          楽天トラベル × Google Maps × Gemini AI
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15]">
          AI旅行コンシェルジュ
          <br />
          <span style={{ color: '#10b981' }}>旅程を丸ごと自動生成</span>
        </h1>
        <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          目的地・日程・予算を入力するだけ。楽天トラベルのリアル宿泊データとGoogle Mapsの観光スポットを自動収集し、
          Gemini AIがあなただけの旅程プランを一発生成します。
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/products/travel-concierge/app"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: '#10b981' }}
          >
            今すぐ旅程を生成する →
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center h-12 px-8 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: '#13141f', border: '1px solid #334155', color: '#94a3b8' }}
          >
            料金プランを見る
          </Link>
        </div>
      </section>

      {/* ─── 3ステップ ─── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-10">3ステップで完了</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map(({ num, label, desc }) => (
            <div
              key={num}
              className="rounded-xl p-6 space-y-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <span className="text-3xl font-bold" style={{ color: 'rgba(16,185,129,0.5)' }}>{num}</span>
              <p className="text-base font-semibold text-slate-100">{label}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 機能 ─── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-10">機能詳細</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-6 space-y-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <span className="text-3xl">{icon}</span>
              <p className="text-base font-semibold text-slate-100">{title}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 注意事項 ─── */}
      <section
        className="max-w-4xl mx-auto px-6 py-10 rounded-2xl mb-10"
        style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.2)' }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-base font-bold text-yellow-500 mb-4">⚠️ ご利用上の注意</h2>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              '旅程はAIによる自動生成のため、実際の混雑・営業時間・交通状況と異なる場合があります。',
              'ホテル料金は検索時点の参考価格です。実際の予約は楽天トラベルのサイトでご確認ください。',
              '1日5回の利用制限があります（スタンダード以上プラン）。',
              'Google Places APIが未設定の場合、周辺観光地は取得されません。',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 料金 ─── */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-8">料金プラン</h2>
        <div
          className="inline-block rounded-2xl p-8 text-center"
          style={{ background: '#0d1117', border: '2px solid #10b981' }}
        >
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            スタンダードプラン以上
          </div>
          <div className="text-4xl font-bold mb-1">
            ¥980<span className="text-base font-normal text-slate-400">/月〜</span>
          </div>
          <p className="text-slate-500 text-sm mb-6">1日5回まで無制限に旅程生成</p>
          <Link
            href="/pricing"
            className="inline-flex items-center h-12 px-8 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: '#10b981' }}
          >
            プランを確認する →
          </Link>
        </div>
      </section>

      {/* ─── Amazon アフィリエイト ─── */}
      <div className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}
        >
          <p className="text-xs text-slate-500 mb-3">🛒 旅行グッズをAmazonでチェック</p>
          <a
            href="https://www.amazon.co.jp/s?k=%E6%97%85%E8%A1%8C+%E3%82%B0%E3%83%83%E3%82%BA+%E3%82%B9%E3%83%BC%E3%83%84%E3%82%B1%E3%83%BC%E3%82%B9&tag=nextralabs-22"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors"
            style={{ background: '#10b981' }}
          >
            Amazonで旅行グッズを見る →
          </a>
        </div>
      </div>
    </div>
  )
}
