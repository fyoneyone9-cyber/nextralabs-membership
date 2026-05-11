import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'デートコース自動コンシェルジュ | 中間地点×楽天グルメ×Google Mapsで最高のデートを自動設計 | NextraLabs',
  description:
    '出発地を2つ入力するだけ。ふたりの中間地点に最高のレストランとスポットを自動検索し、タイムライン付きデートしおりを生成。楽天グルメAPI×Google Maps×Gemini AI搭載。',
  keywords: [
    'デートプラン自動生成', '中間地点 レストラン', '楽天グルメ 個室', 'デートコース AI',
    'Google Maps デート', 'カップル レストラン 自動', 'デート提案 AI', 'NextraLabs デート',
    'デートしおり 自動生成', '中間地点 デート', '個室 レストラン 自動検索'
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/date-concierge' },
  openGraph: {
    title: 'デートコース自動コンシェルジュ | 中間地点×楽天グルメ×Google Maps',
    description: '出発地を2つ入れるだけ。中間地点に最高のレストラン・スポット・タイムラインを自動生成。月額¥980〜。',
    url: 'https://membership-site-nextralabos.vercel.app/products/date-concierge',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'デートコース自動コンシェルジュ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'デートコース自動コンシェルジュ | NextraLabs',
    description: '出発地2つで、中間地点×個室レストラン×夜景スポット×タイムラインを自動生成。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

const FEATURES = [
  { icon: '📍', title: '中間地点を自動算出', desc: 'ふたりの出発地の座標をGoogle Geocoding APIで取得し、最適な中間地点を計算。移動負担を均等にします。' },
  { icon: '🍽️', title: '楽天グルメで個室レストランを検索', desc: '中間地点半径3km以内で評価順に飲食店を自動検索。個室希望・予算・ムードで絞り込み。' },
  { icon: '🌙', title: 'スポットも自動提案', desc: 'Google Places APIで中間地点の公園・夜景スポット・観光地を自動収集。評価3.8以上のみ厳選。' },
  { icon: '📋', title: 'タイムライン自動生成', desc: 'Gemini AIが開始時刻を起点に「集合→食事→散策→夜景」の自然なタイムラインを生成。しおりとしてコピー可能。' },
]

const STEPS = [
  { num: '01', label: '出発地を2つ入力', desc: '自分と相手の出発地（駅名・住所）を入力。現在地ボタンで自動取得も可能' },
  { num: '02', label: 'デートスタイルを選ぶ', desc: 'ロマンチック/カジュアル/夜景/記念日/アクティブの5プリセットから選ぶだけ' },
  { num: '03', label: 'デートコースを受け取る', desc: '楽天グルメ・Google Maps・Gemini AIが自動でコースを設計してタイムラインを生成' },
]

const FAQS = [
  { q: '対応エリアはどこですか？', a: '日本国内全エリアに対応しています。楽天グルメサーチAPIで検索可能な飲食店があるエリアであればほぼすべてに対応。都市部はもちろん地方都市でも利用できます。' },
  { q: '個室のレストランだけを検索できますか？', a: 'はい。「個室希望」トグルをオンにすると、楽天グルメAPIの個室フラグで絞り込みます。告白・記念日など特別なシーンに最適です。' },
  { q: 'どのくらいの精度でコースが生成されますか？', a: '楽天グルメのリアルデータとGoogle Mapsの口コミをもとに生成するため、実用的なコースが出力されます。ただし営業時間・予約状況は事前確認をおすすめします。' },
  { q: '利用料金はいくらですか？', a: 'スタンダードプラン（¥980/月）以上でご利用いただけます。月額費用のみで、API利用料は別途発生しません。' },
  { q: 'LINEで共有できますか？', a: '現在は「しおりをコピー」ボタンでテキストをコピーし、LINEに貼り付けてご利用ください。v2.0でLINE直接共有機能を実装予定です。' },
]

const REVIEWS = [
  { name: '田中 愛美', role: 'OL・埼玉県', text: '中間地点なんて考えたことなかった！個室が見つかって、タイムライン通りに動いたら彼氏に"デキる人"って言われました笑 本当に使えます', tags: ['#カップル', '#個室', '#デート初心者'] },
  { name: '鈴木 健太', role: '会社員・東京都', text: '記念日で使いました。レストランから夜景スポットまでのルートも出てきて彼女が感動。予算8,000円でこの質は最高すぎます', tags: ['#記念日', '#夜デート', '#夜景'] },
  { name: '山本 さくら', role: '大学生・神奈川県', text: 'アクティブデートプリセット使ったら公園のバラ園まで案内してくれて最高の写真が撮れました。友達に「どこで覚えたの？」って聞かれました笑', tags: ['#昼デート', '#公園', '#フォトスポット'] },
]

export default function DateConciergeLP() {
  return (
    <div className="min-h-screen bg-[#050507] text-white font-['Inter','Noto_Sans_JP',sans-serif]">

      {/* ヒーロー */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">楽天グルメ × Google Maps × Gemini AI 搭載</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
          出発地2つで、<br />
          <span className="text-emerald-400">最高のデートコース</span>を<br />
          自動設計。
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-xl mx-auto text-base md:text-lg mb-10">
          ふたりの中間地点を計算し、個室レストランと夜景スポットを自動で見つけます。
          スマホのタイムラインに従うだけで「デキる人」になれます。
        </p>
        <Link
          href="/products/date-concierge/app"
          className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#050507] font-semibold rounded-xl transition-all text-sm"
        >
          無料で試してみる →
        </Link>
        <p className="text-xs text-slate-600 mt-4">スタンダードプラン（¥980/月〜）でご利用可能</p>
      </section>

      {/* 機能 */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">使われているAPI・技術</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-6 hover:border-emerald-500/20 transition-all">
              <span className="text-2xl block mb-3">{f.icon}</span>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ステップ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">使い方は3ステップ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-6 text-center">
              <span className="text-3xl font-bold text-emerald-500/30 block mb-3">{s.num}</span>
              <h3 className="text-sm font-semibold text-white mb-2">{s.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 口コミ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">ユーザーの声</h2>
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="text-emerald-400 font-bold text-lg">4.9</span>
          <span className="flex">{'★'.repeat(5).split('').map((s, i) => <span key={i} className="text-emerald-400">★</span>)}</span>
          <span className="text-xs text-slate-500">利用者300人以上 · 推奨率98%</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.role}</p>
                </div>
                <div className="ml-auto text-xs text-emerald-400">★★★★★</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{r.text}</p>
              <div className="flex flex-wrap gap-1">
                {r.tags.map(t => (
                  <span key={t} className="text-[10px] text-emerald-500/70 bg-emerald-500/5 border border-emerald-500/10 rounded px-1.5 py-0.5">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <p className="text-sm font-semibold text-emerald-400 mb-2">Q. {faq.q}</p>
              <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 最終CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
          今日から、<span className="text-emerald-400">デートの悩み</span>を終わりにしよう。
        </h2>
        <p className="text-slate-400 mb-10 text-sm leading-relaxed">
          出発地2つ入れるだけ。AIが全部考えてくれます。
        </p>
        <Link
          href="/products/date-concierge/app"
          className="inline-flex items-center gap-2 h-12 px-10 bg-emerald-500 hover:bg-emerald-400 text-[#050507] font-semibold rounded-xl transition-all text-sm"
        >
          デートコースを自動生成する →
        </Link>
      </section>

    </div>
  )
}
