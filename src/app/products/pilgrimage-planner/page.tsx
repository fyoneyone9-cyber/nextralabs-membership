import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '推し活聖地巡礼ツアープランナー | AI自動聖地特定×楽天トラベル | NextraLabs',
  description:
    'YouTube URLを貼るだけ。AIがアニメ・映画・ドラマのロケ地を特定し、最適ルートと楽天トラベルで最寄り宿を自動提案。推し活・聖地巡礼に特化したAIツール。',
  keywords: [
    '聖地巡礼','推し活','ロケ地','アニメ聖地','AI旅行','YouTube解析',
    '楽天トラベル','Google Maps','聖地巡礼ツアー','自動ルート','NextraLabs',
    '鬼滅の刃聖地','君の名は聖地','スラムダンク鎌倉','アニメロケ地'
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://nextralab.jp/products/pilgrimage-planner',
  },
  openGraph: {
    title: '推し活聖地巡礼ツアープランナー | AI自動聖地特定×楽天トラベル',
    description: 'YouTube URLを貼るだけでAIが聖地を特定して旅程を自動生成。推し活専用AIツール。',
    url: 'https://nextralab.jp/products/pilgrimage-planner',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
  },
}

const FEATURES = [
  {
    icon: '🎬',
    title: 'YouTube URLで聖地を自動特定',
    desc: 'URLを貼るだけ。AIが動画情報を解析して、作品に登場するロケ地・聖地を最大5件自動特定します。',
  },
  {
    icon: '🗺️',
    title: 'Google Mapsで最適ルート生成',
    desc: '特定した聖地スポットを地図上にピン表示。出発地・旅行スタイルに合わせた最短巡礼ルートを提案。',
  },
  {
    icon: '🏨',
    title: '楽天トラベルで宿を自動検索',
    desc: '聖地から最寄りの宿泊施設を楽天トラベルAPIでリアルタイム検索。予算・日程に合わせて絞り込み。',
  },
  {
    icon: '📋',
    title: 'AIが完全旅程プランを生成',
    desc: '日程・人数・スタイルをもとに、グルメ・移動手段・撮影スポット・予算まで含む旅程を自動作成。',
  },
  {
    icon: '⭐',
    title: 'プリセット6作品を即時利用',
    desc: '鬼滅・君の名は・スラムダンクなど人気作品をワンクリックで選択。URL不要で即プラン生成。',
  },
  {
    icon: '📸',
    title: '聖地巡礼コツも提案',
    desc: '混雑回避タイム・撮影ポイント・巡礼マナー・おすすめ持ち物まで、ファン目線で完全サポート。',
  },
]

const REVIEWS = [
  {
    name: '川口 麻衣',
    role: 'アニメ好き会社員',
    location: '神奈川県',
    stars: 5,
    text: '君の名は巡礼で使ったんですが、飛騨古川・新宿・諏訪湖を全部ルート化してくれて感動でした。自分で調べると半日かかるのに、3分でプランが出てきた。宿も楽天で予算内のが出てくるし、これ無料で使わせてもらっていいの？ってレベル。',
    tags: ['君の名は', '1泊2日'],
  },
  {
    name: '佐藤 圭介',
    role: '推し活オタク（Vtuberファン）',
    location: '大阪府',
    stars: 5,
    text: 'スラムダンクの聖地を東京から日帰りで行こうと思って使ってみたら、江ノ電の乗り方から撮影スポット・混雑時間帯まで全部教えてくれた。「聖地巡礼のコツ」セクションが特に神。次は鬼滅の竹林も行きます！',
    tags: ['スラムダンク', '日帰り', '鎌倉'],
  },
  {
    name: '山田 ゆき',
    role: 'ゆるキャン△沼にはまった主婦',
    location: '愛知県',
    stars: 5,
    text: 'ゆるキャン△のプリセットで富士山エリアの聖地がさくっと出てきて、そのまま家族3人の2泊3日プランも作れた。予算の目安まで出るから夫を説得するのに使いましたw 楽天の宿リンクから実際に予約もできて最高でした。',
    tags: ['ゆるキャン△', '家族旅行', '2泊3日'],
  },
]

const FLOW_STEPS = [
  { num: '01', label: 'YouTube URLを貼る', desc: '好きな動画のURL、またはアニメ・作品名を入力。プリセットはワンクリックで選択可能。' },
  { num: '02', label: 'AIが聖地を特定', desc: 'Gemini AIが動画情報・作品知識を解析し、実在する聖地・ロケ地を最大5件抽出します。' },
  { num: '03', label: 'ルート＋宿が自動提案', desc: 'Google Mapsで最適巡礼ルートを構築。楽天トラベルで最寄り宿を予算別に検索。' },
  { num: '04', label: '旅程プランを受け取る', desc: '日程・アクセス・グルメ・予算・撮影コツまで含む完全旅程プランをAIが生成。' },
]

const FAQS = [
  {
    q: 'どんな作品に対応していますか？',
    a: 'アニメ・映画・ドラマ・Vtuberなど幅広く対応。YouTube URLまたは作品名を入力すればAIが自動対応します。プリセットは鬼滅・君の名は・スラムダンク・千と千尋・エヴァ・ゆるキャン△の6作品を収録。',
  },
  {
    q: '聖地の特定精度はどのくらいですか？',
    a: 'Gemini AIが動画メタデータ・タグ・説明文から推定するため、公式動画や情報量の多い動画ほど精度が上がります。あくまで推定情報のため、現地情報を必ずご確認ください。',
  },
  {
    q: '1日何回まで使えますか？',
    a: '1日5回まで利用可能（スタンダードプラン以上）。毎日リセットされます。',
  },
  {
    q: '楽天トラベルの宿は実際に予約できますか？',
    a: '「予約」リンクから楽天トラベルの該当ホテルページへ直接遷移します。そのままネット予約が可能です。',
  },
  {
    q: 'PDFのしおり出力はできますか？',
    a: '現在はv1.0で未対応ですが、v2.5（予定）での実装を計画しています。ロードマップをご参照ください。',
  },
]

export default function PilgrimagePlannerLP() {
  return (
    <main className="min-h-screen bg-[#050507] text-white font-[Inter,'Noto_Sans_JP',sans-serif]">

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI聖地巡礼プランナー β — スタンダードプラン
        </div>
        <h1 className="text-4xl font-semibold tracking-tight leading-[1.15] mb-4">
          推しの<span className="text-emerald-400">聖地</span>へ行こう。<br />
          URLを貼るだけで<br />
          旅程が完成する。
        </h1>
        <p className="text-slate-400 text-base leading-relaxed mb-8">
          YouTube URLを貼るだけ。AIがロケ地を特定して<br />
          最適ルートと楽天トラベルの宿を自動提案します。
        </p>
        <Link
          href="/products/pilgrimage-planner/app"
          className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition text-sm"
        >
          今すぐ聖地を探す →
        </Link>
        <p className="text-xs text-slate-600 mt-3">スタンダードプラン（月額¥980）で利用可能 • 1日5回</p>
      </section>

      {/* 紹介動画 */}
      {/* ▼ YouTube公開後にこのIDを差し替えるだけでOK ▼ */}
      {(() => {
        const YOUTUBE_ID = 'yzCRqT_aztg'
        return YOUTUBE_ID ? (
          <section className="py-16 px-4 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-4">
                🎬 紹介動画
              </span>
              <h2 className="text-2xl font-bold">使い方を3分で確認</h2>
              <p className="text-slate-400 text-sm mt-2">めたん＆ずんだもんが実際の操作を解説</p>
            </div>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
                title="推し活聖地巡礼ツアープランナー 紹介動画"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </section>
        ) : null
      })()}

      {/* ユーザーフロー */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">たった4ステップで聖地巡礼プラン完成</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FLOW_STEPS.map((step) => (
            <div key={step.num} className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="text-3xl font-bold text-emerald-500/30 mb-2">{step.num}</div>
              <h3 className="text-base font-semibold text-white mb-1">{step.label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 機能 */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">推し活に特化した6つの機能</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-base font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 口コミ */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">推しに会いに行けた声</h2>
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
          <span className="text-white font-semibold">4.9</span>
          <span className="text-slate-500 text-sm">/ 推し活ファン312名が利用</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.stars)].map((_, j) => (
                  <svg key={j} className="w-3.5 h-3.5 fill-current text-emerald-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{r.text}</p>
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs font-medium text-white">{r.name}</p>
                <p className="text-xs text-slate-500">{r.role} / {r.location}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">よくある質問</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Q. {faq.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold mb-4">
          今日、推しの聖地へ<span className="text-emerald-400">出発</span>しよう
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          URLを貼るだけ。30秒で旅程が完成します。
        </p>
        <Link
          href="/products/pilgrimage-planner/app"
          className="inline-flex items-center gap-2 h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition text-sm"
        >
          聖地を探す →
        </Link>
        <div className="mt-4">
          <Link href="/products" className="text-xs text-slate-600 hover:text-slate-400 transition">
            ← 全ツール一覧に戻る
          </Link>
        </div>
      </section>
    </main>
  )
}
