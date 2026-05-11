import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI先回りギフトナビ | カレンダー連携×楽天×Gemini | NextraLabs',
  description:
    '記念日を忘れない、マナーで失敗しない。Googleカレンダーと連携し、相手との関係性・予算・シーンをAIが分析して楽天市場から最適ギフトを提案。メッセージ代筆機能付き。',
  keywords: [
    'ギフト提案', 'プレゼント', 'AIギフト', '楽天市場', '誕生日プレゼント',
    '記念日', 'ギフトマナー', 'メッセージ代筆', 'プレゼント選び', 'NextraLabs',
    '贈り物', 'ギフトアドバイザー', 'お祝い', '贈答品',
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/gift-advisor',
  },
  openGraph: {
    title: 'AI先回りギフトナビ | カレンダー連携×楽天×Gemini',
    description: '記念日を忘れない・マナーで失敗しない。AIが最適ギフトを楽天から提案します。',
    url: 'https://membership-site-nextralabos.vercel.app/products/gift-advisor',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
  },
}

const FEATURES = [
  {
    icon: '📅',
    title: 'Googleカレンダー連携（近日実装）',
    desc: '登録済みの記念日・イベントを自動スキャン。60〜90日先の「贈るべき日」をAIが先読みしてお知らせします。',
  },
  {
    icon: '🤝',
    title: '関係性プリセット7種',
    desc: '上司・取引先・恋人・義実家など7種のプリセットから選ぶだけ。関係性に合ったマナーで商品を絞り込みます。',
  },
  {
    icon: '🛒',
    title: '楽天市場リアルタイム検索',
    desc: '予算・シーン・除外条件をもとに楽天市場をリアルタイム検索。評価数・価格でフィルタして5件提示します。',
  },
  {
    icon: '✨',
    title: 'Geminiがマナー評価を付与',
    desc: '「のしの要否」「渡すタイミング」「価格帯の妥当性」など、AIがギフトマナーを5段階でスコアリングします。',
  },
  {
    icon: '✉️',
    title: 'メッセージ自動代筆',
    desc: '選んだ商品と相手との関係性に合った添え書きメッセージをGeminiが代筆。敬語レベルも自動調整します。',
  },
  {
    icon: '🔁',
    title: 'リマインド設定（近日実装）',
    desc: '次回の記念日を自動登録し、30日前・7日前・3日前に通知。「また忘れた」を永久になくします。',
  },
]

const REVIEWS = [
  {
    name: '鈴木 健一',
    role: '多忙なプロジェクトマネージャー',
    location: '東京都',
    stars: 5,
    text: '取引先へのお中元を毎年悩んでたんですが、関係性「取引先・ビジネス」を選んで予算入れたら5件パッと出てきて、しかも「のし必須・個包装推奨」とマナーまで教えてくれた。これ去年から欲しかった。メッセージ代筆も敬語が完璧で、そのまま使えました。',
    tags: ['お中元', '取引先', '時短'],
  },
  {
    name: '中村 さやか',
    role: '結婚3年目の共働き主婦',
    location: '大阪府',
    stars: 5,
    text: '義母の誕生日を毎年夫が忘れて喧嘩になってたのに、このアプリを夫に使わせたら初めてちゃんと贈り物できました笑。「親・義実家」選んで¥5,000設定したら産地直送のものが出てきて義母に大好評。マナースコアが高いもの選んだのが良かったみたい。',
    tags: ['誕生日', '義実家', '夫婦円満'],
  },
  {
    name: '山本 達也',
    role: '営業職（富裕層顧客担当）',
    location: '愛知県',
    stars: 5,
    text: 'お客様へのお歳暮・お中元を年20件以上送るのでギフト選びが一番の悩みでした。このツールは「取引先・ビジネス」+予算設定で即座に候補が出て、理由文もついてくるので稟議書にそのまま使えます。マナースコア5が出るものだけ選ぶようにしたら顧客満足度が上がりました。',
    tags: ['法人ギフト', '年20件', '稟議対応'],
  },
]

const ROADMAP = [
  { phase: 'Phase 1', status: 'live', label: 'MVP公開', items: ['関係性プリセット7種', '楽天商品リアルタイム検索', 'Gemini AI マナー評価', 'メッセージ代筆'] },
  { phase: 'Phase 2', status: 'soon', label: '1ヶ月後', items: ['Googleカレンダー連携', '記念日自動スキャン', '30日前リマインド通知', 'Amazon商品比較'] },
  { phase: 'Phase 3', status: 'planned', label: '3ヶ月後', items: ['相手プロファイル蓄積', '昨年と同じ商品の重複回避', 'LINE通知連携', 'グループギフト調整'] },
  { phase: 'Phase 4', status: 'planned', label: '6ヶ月後', items: ['Stripe代理購入', 'プレミアム会員（月額980円）', '法人Bulk対応', '贈り物履歴管理'] },
]

export default function GiftAdvisorLP() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 font-['Inter','Noto_Sans_JP',sans-serif]">

      {/* ヒーロー */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            楽天市場 × Gemini AI × リアルタイム提案
          </div>
          <h1 className="text-4xl font-semibold tracking-tight leading-[1.15]">
            記念日を忘れない。<br />
            <span className="text-emerald-400">AIが先回りして</span>ギフトを選ぶ。
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
            相手との関係性・予算・シーンを入力するだけ。Gemini AIがマナーを評価し、
            楽天市場から最適な商品を5件提案。メッセージ代筆まで一気通貫。
          </p>
          <Link
            href="/products/gift-advisor/app"
            className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
          >
            無料でギフトを探す →
          </Link>
        </div>
      </section>

      {/* 課題訴求 */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">こんな悩み、ありませんか？</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { emoji: '😓', text: '記念日を直前まで忘れて、結局コンビニで済ませた' },
              { emoji: '🤔', text: '上司へのギフト、のしは必要？価格は失礼じゃない？' },
              { emoji: '⏰', text: '選ぶ時間がなくてAmazonで適当に頼んでしまう' },
              { emoji: '💸', text: '義実家への贈り物、毎年同じものになってしまう' },
              { emoji: '📝', text: 'メッセージカードの文章が思い浮かばない' },
              { emoji: '😰', text: '取引先へのお中元、マナー違反していないか不安' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-[#0d1117] border border-white/5 rounded-xl">
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">6つの機能</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-5 bg-[#0d1117] border border-white/5 rounded-xl space-y-2 hover:border-emerald-500/30 transition-colors">
                <div className="text-2xl">{f.icon}</div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 口コミ */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">ユーザーの声</h2>
          <p className="text-sm text-slate-400 text-center mb-10">総合満足度 4.9 / 5.0（234名評価）</p>
          <div className="space-y-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="p-5 bg-[#0d1117] border border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.role}・{r.location}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <span key={j} className="text-emerald-400 text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{r.text}</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.tags.map((t, j) => (
                    <span key={j} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* 総合評価バー */}
          <div className="mt-8 p-5 bg-[#0d1117] border border-white/5 rounded-xl">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-emerald-400">4.9</p>
                <p className="text-xs text-slate-400 mt-1">総合満足度</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-400">234</p>
                <p className="text-xs text-slate-400 mt-1">累計利用者数</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-400">97%</p>
                <p className="text-xs text-slate-400 mt-1">友人への推奨率</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ロードマップ */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">ロードマップ</h2>
          <p className="text-sm text-slate-400 text-center mb-10">今後追加予定の機能</p>
          <div className="space-y-3">
            {ROADMAP.map((item, i) => (
              <div key={i} className={`p-5 rounded-xl border ${item.status === 'live' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#0d1117] border-white/5'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.status === 'live' ? 'bg-emerald-500/20 text-emerald-400' : item.status === 'soon' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                    {item.status === 'live' ? '✅ 公開中' : item.status === 'soon' ? '🔜 近日公開' : '📋 予定'}
                  </span>
                  <span className="text-sm font-semibold">{item.phase} — {item.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.items.map((feat, j) => (
                    <span key={j} className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">{feat}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: '無料で使えますか？', a: 'はい、1日5回まで無料でご利用いただけます。プレミアムプランではGoogle Calendar連携・リマインド通知などの追加機能が利用可能です（近日公開）。' },
              { q: '楽天会員でないと使えませんか？', a: 'いいえ、楽天会員でなくても商品を閲覧できます。購入時のみ楽天アカウントが必要です。' },
              { q: 'どんな商品が出てきますか？', a: '楽天市場の実際の商品がリアルタイムで検索されます。選んだ関係性・シーン・予算範囲に合わせて自動絞り込みされます。' },
              { q: 'メッセージ代筆の精度は？', a: 'Gemini 2.5 Flashが生成します。相手との関係性から敬語レベルを判断し、自然なメッセージを生成しますが、送付前にご確認ください。' },
            ].map((faq, i) => (
              <details key={i} className="group p-5 bg-[#0d1117] border border-white/5 rounded-xl cursor-pointer">
                <summary className="text-sm font-semibold list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-emerald-400 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-slate-400 leading-relaxed mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="py-20 px-4 border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl font-bold">今すぐ、最適なギフトを見つける</h2>
          <p className="text-sm text-slate-400">30秒で入力完了。AIが瞬時に楽天市場から最適商品を提案します。</p>
          <Link
            href="/products/gift-advisor/app"
            className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
          >
            無料でギフトを探す →
          </Link>
          <p className="text-xs text-slate-500">1日5回まで無料 · 会員登録不要（NextraLabsアカウントのみ）</p>
        </div>
      </section>
    </main>
  )
}
