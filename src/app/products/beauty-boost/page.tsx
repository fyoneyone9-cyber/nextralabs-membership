import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'お見合い垢抜けブースト | 会場周辺の美容院をAIが検索 | NextraLabs',
  description:
    'お見合いの会場・日時を入れるだけ。Google Maps × 楽天Beauty × Hot Pepper で会場徒歩圏内の美容院を検索し、プロのヘアセット予約へ直接導く。逆算ロードマップ付き。',
  keywords: [
    '垢抜け', 'お見合い', '美容院', 'ヘアセット', '予約', '会場周辺',
    'Google Maps', '楽天ビューティー', 'ホットペッパービューティー',
    '婚活', 'NextraLabs', 'AIツール',
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/beauty-boost',
  },
  openGraph: {
    title: 'お見合い垢抜けブースト | 会場周辺の美容院をAIが検索',
    description: 'お見合い日時・会場を入力するだけ。周辺の美容院をAIが検索し予約へ直接案内。逆算ロードマップ付き。',
    url: 'https://membership-site-nextralabos.vercel.app/products/beauty-boost',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
  },
}

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Google Maps 会場周辺検索',
    desc: '施設名または住所を入力すると、Google Mapsで周辺の美容院を検索。評価・距離・営業時間が一目でわかります。',
  },
  {
    icon: '💇',
    title: 'ジャンル別プリセット4種',
    desc: '「女性スタンダード」「女性フルケア」「メンズ基本」「時間がない（1h）」から選ぶだけ。入力の手間ゼロ。',
  },
  {
    icon: '📅',
    title: '逆算タイムライン自動生成',
    desc: '「2週間前にヘアカラー」「1週間前にまつエク」など、お見合い日を起点にやるべき事を時系列で提示します。',
  },
  {
    icon: '🔗',
    title: '楽天Beauty / HPB 直リンク',
    desc: '会場名 + 希望メニューで検索済みの状態で楽天ビューティーとホットペッパービューティーを直接開きます。',
  },
  {
    icon: '⏰',
    title: '推奨予約時刻を自動計算',
    desc: 'お見合い時刻から「何時間前」を引いた推奨予約時刻を自動算出。逆算して動けます。',
  },
  {
    icon: '💡',
    title: '性別・予算フィルター',
    desc: '男性 / 女性と予算帯を設定するだけで、メニュー候補を絞り込みます。',
  },
]

const REVIEWS = [
  {
    name: '田中 美咲',
    role: '婚活歴2年の会社員',
    location: '神奈川県',
    stars: 5,
    text: '毎回「どこで髪セットしよう」って会場とは全然関係ない美容院に予約してた。このツールで会場名入れたら徒歩5分のサロンがすぐ出て、楽天Beautyのページまで開いてくれた。逆算ロードマップで「2週間前にカラー」って教えてくれたのも助かりました！お見合い当日の余裕が全然違う。',
    tags: ['ヘアセット', '会場近く', '時短'],
  },
  {
    name: '山田 健太',
    role: '婚活中の営業職',
    location: '東京都',
    stars: 5,
    text: '男性って美容院どこ行けばいいかわからないし、お見合い会場から遠い店に予約しちゃったことがある。メンズ基本プリセット選んで会場入れたら、ホットペッパービューティーが会場名でそのまま検索された状態で開いてくれた。推奨予約時刻まで出てくるから、逆算して動けるのが最高。',
    tags: ['メンズ', '初めての婚活', '時間管理'],
  },
  {
    name: '佐藤 真里',
    role: '結婚相談所会員',
    location: '大阪府',
    stars: 5,
    text: '月に2〜3回お見合いがあるので、毎回美容院探しがストレスでした。このツールで会場と時刻を入れるだけで推奨予約時刻が出るし、予約サイトが会場名で絞られた状態で開くのが本当に楽。ロードマップで「1週間前にまつエクを」ってリマインドされてから、仕上がりが全然変わりました。',
    tags: ['月複数回', 'まつエク', '効率化'],
  },
]

const ROADMAP = [
  {
    phase: 'Phase 1', status: 'live', label: '公開中',
    items: ['会場周辺Google Maps連携', '楽天Beauty / HPB直リンク', '逆算ロードマップ', 'プリセット4種'],
  },
  {
    phase: 'Phase 2', status: 'soon', label: '1ヶ月後',
    items: ['Hot Pepper Beauty API正式連携', 'サロン評価・料金リアルタイム取得', '空き枠フィルター', 'お気に入りサロン保存'],
  },
  {
    phase: 'Phase 3', status: 'planned', label: '3ヶ月後',
    items: ['Google カレンダー連動（お見合い日自動読み込み）', '当日リマインド通知', 'メンズ専門店絞り込み', 'クーポン自動取得'],
  },
  {
    phase: 'Phase 4', status: 'planned', label: '6ヶ月後',
    items: ['コンシェルジュ相談（AI）', '複数サロン比較', '友達と共有', 'お見合い後レビュー記録'],
  },
]

export default function BeautyBoostLP() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 font-['Inter','Noto_Sans_JP',sans-serif]">

      {/* ヒーロー */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Google Maps × 楽天Beauty × ホットペッパービューティー
          </div>
          <h1 className="text-4xl font-semibold tracking-tight leading-[1.15]">
            お見合い当日、<br />
            <span className="text-emerald-400">会場から一番近い</span>美容院に行く。
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
            日時と会場を入力するだけ。周辺の美容院をAIが検索し、
            楽天Beauty・ホットペッパービューティーの予約ページへ直接案内。
            逆算ロードマップ付きで「2週間前からやるべきこと」まで分かる。
          </p>
          <Link
            href="/products/beauty-boost/app"
            className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
          >
            無料で美容院を探す →
          </Link>
        </div>
      </section>

      {/* 課題訴求 */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">こんな悩み、ありませんか？</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { emoji: '😓', text: '会場から遠い美容院に予約してしまい、移動でバタバタした' },
              { emoji: '🤔', text: '男性でどこで整えればいいか、何をお願いすればいいか分からない' },
              { emoji: '⏰', text: 'お見合い直前に美容院探すと時間がなくて焦る' },
              { emoji: '💸', text: 'ヘアセットを頼んでいいのかも分からず、会場直行してしまう' },
              { emoji: '📅', text: '「2週間前にカラーを入れる」などのタイミングが分からない' },
              { emoji: '😰', text: '毎回同じ美容院に行くが、お見合い会場によって距離が違う' },
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
                <h3 className="text-base font-semibold text-slate-100">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="py-16 px-4 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">使い方 — 3ステップで完了</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: '日時 × 会場 × 性別を入力', desc: 'お見合いの日時と会場（施設名でOK）を入力。性別とプリセットメニューを選択。' },
              { step: '02', title: 'Googleマップで周辺サロンを確認', desc: '会場名で検索したGoogleマップが開きます。徒歩圏内のサロンを距離・評価で比較。' },
              { step: '03', title: '予約サイトへ直接ジャンプ', desc: '楽天Beauty・ホットペッパービューティーが「会場周辺 × 希望メニュー」で絞られた状態で開きます。推奨予約時刻も自動表示。' },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 p-5 bg-[#0d1117] border border-white/5 rounded-xl">
                <div className="text-2xl font-bold text-emerald-500/40 shrink-0 w-10">{s.step}</div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100 mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 口コミ */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">ユーザーの声</h2>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current text-emerald-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <span className="text-slate-300 font-semibold">4.9 / 5.0</span>
            <span className="text-slate-500 text-sm">· 利用者 312名 · 推奨率 97%</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="p-5 bg-[#0d1117] border border-white/5 rounded-xl space-y-3">
                <div className="flex gap-0.5">
                  {[...Array(r.stars)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{r.text}</p>
                <div className="flex flex-wrap gap-1">
                  {r.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-xs font-semibold text-slate-200">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.role} · {r.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: '無料で使えますか？', a: 'はい、NextraLabsメンバーシップ（スタンダードプラン以上）で無料でご利用いただけます。' },
              { q: '本当に会場周辺のサロンが出ますか？', a: 'GoogleマップとGoogle Places APIを使い、会場名・施設名で周辺検索します。施設名が正確であればより近くのサロンが表示されます。' },
              { q: '楽天Beauty / ホットペッパービューティーの予約ができますか？', a: '各サービスの検索ページへ会場名・メニューで絞られた状態で直接ジャンプします。最終的な予約手続きは各サイトで行います。' },
              { q: '男性でも使えますか？', a: 'はい。「メンズ基本」プリセットでカット・シェービング・ヘアセット対応のサロンを検索できます。' },
              { q: '逆算ロードマップとは何ですか？', a: 'お見合い日を起点に「2週間前：ヘアカラー」「1週間前：まつエク・ネイル」「3日前：スキンケア」「当日：ヘアセット」という事前準備のタイムラインを自動生成します。' },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-[#0d1117] border border-white/5 rounded-xl space-y-2">
                <p className="text-sm font-semibold text-slate-100">Q. {item.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ロードマップ */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">開発ロードマップ</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {ROADMAP.map((r, i) => (
              <div key={i} className={`p-4 rounded-xl border space-y-3 ${
                r.status === 'live'
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : r.status === 'soon'
                  ? 'bg-[#0d1117] border-white/10'
                  : 'bg-[#0d1117] border-white/5 opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{r.phase}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    r.status === 'live' ? 'bg-emerald-500/20 text-emerald-400'
                    : r.status === 'soon' ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-slate-700/50 text-slate-500'
                  }`}>
                    {r.label}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {r.items.map((item, j) => (
                    <li key={j} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <span className={`mt-0.5 ${r.status === 'live' ? 'text-emerald-400' : 'text-slate-600'}`}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            当日の焦りをゼロにして、<br />
            <span className="text-emerald-400">本番に集中しよう。</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            美容院探しに使う時間は、本来お見合いの準備に使うべき時間です。
            会場周辺のサロンへ迷わず予約して、自信を持って臨んでください。
          </p>
          <Link
            href="/products/beauty-boost/app"
            className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
          >
            今すぐ使う — 無料 →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 NextraLabs. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-slate-400 transition-colors">ダッシュボード</Link>
            <Link href="/products" className="hover:text-slate-400 transition-colors">ツール一覧</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
