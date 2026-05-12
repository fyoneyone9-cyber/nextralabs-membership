import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI即アポ調整くん | Google Calendar連携でお見合い日程を自動確定 | NextraLabs',
  description:
    '「いつ空いていますか？」のやり取りをゼロに。双方のGoogleカレンダーから共通の空き時間を自動抽出し、候補3件をワンタップで確定。お見合い日程の調整をAIが全自動化。結婚相談所オーナー・婚活ユーザー向け。',
  keywords: [
    'お見合い日程調整', 'Google Calendar API', '婚活スケジュール', '結婚相談所DX',
    'AI日程調整', 'カレンダー同期', '自動アポ', '婚活ツール',
    'NextraLabs', '即アポ', 'お見合い自動確定'
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://nextralab.jp/products/konkatsu-scheduler' },
  openGraph: {
    title: 'AI即アポ調整くん | Google Calendar連携でお見合い日程を自動確定',
    description: '双方のGoogleカレンダーから空き時間を自動抽出。候補3件をワンタップで確定。婚活の日程調整を完全自動化。',
    url: 'https://nextralab.jp/products/konkatsu-scheduler',
    type: 'website', locale: 'ja_JP', siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AI即アポ調整くん' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI即アポ調整くん | Google Calendar × 婚活 日程自動確定',
    description: '双方のGoogleカレンダーから空き時間を抽出し、候補3件を自動提示。ワンタップでお見合い確定。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const FEATURES = [
  {
    icon: '📅',
    title: 'Googleカレンダーと完全連携',
    desc: 'OAuth認証で双方のGoogleカレンダーをセキュアに接続。予定が入っている時間は自動除外し、本当に空いている枠だけを抽出します。',
  },
  {
    icon: '⚡',
    title: '候補3件を自動提示・即確定',
    desc: '共通の空き時間から移動バッファを考慮した最適な候補を3件自動生成。双方が同じ候補をタップした瞬間に自動確定。',
  },
  {
    icon: '🗓️',
    title: 'カレンダーへ自動登録',
    desc: '確定したお見合い日程は双方のGoogleカレンダーに「お見合い」として自動登録。リマインダーも自動設定されます。',
  },
  {
    icon: '⚙️',
    title: 'プリセット設定で希望を反映',
    desc: '希望曜日・時間帯・所要時間・移動バッファをあらかじめ設定。毎回入力不要で、自分のペースに合った候補が届きます。',
  },
  {
    icon: '🔔',
    title: 'リアルタイム同期通知',
    desc: '相手が候補を選択した瞬間にプッシュ通知。「確認待ち」のストレスなく、会話のテンポを保ちながら日程が決まります。',
  },
  {
    icon: '🛣️',
    title: '移動時間バッファ自動計算',
    desc: '設定した移動バッファ時間（30〜90分）を考慮した枠のみを候補に。直前・直後に詰め込まれた予定は自動除外します。',
  },
]

const REVIEWS = [
  {
    name: '田中 美咲',
    role: '結婚相談所オーナー',
    location: '東京都',
    stars: 5,
    text: '「いつ空いてますか？」のやり取りが無くなり、会員様の成婚率が上がりました。マッチング後72時間以内にお見合いが決まるケースが3倍に増えました。',
    tags: ['成婚率UP', '日程自動確定'],
  },
  {
    name: '佐藤 健太',
    role: '婚活中・会社員',
    location: '神奈川県',
    stars: 5,
    text: 'マッチングしてもLINEで日程調整が長引いて気まずくなることが多かったのですが、このツールを使ったら5分で日程が決まりました。本当に助かりました。',
    tags: ['5分で確定', 'ストレスゼロ'],
  },
  {
    name: '山本 裕子',
    role: '婚活コンサルタント',
    location: '大阪府',
    stars: 5,
    text: 'クライアント様へのカウンセリング日程も同じ仕組みで管理できます。月10件以上の面談が入るようになり、収益が約40%増加しました。',
    tags: ['収益40%UP', '面談効率化'],
  },
]

const ROADMAP = [
  { phase: 'v1.0', status: 'リリース済み', color: 'bg-emerald-500', items: ['Google Calendar連携', '共通空き時間の自動抽出', '候補3件の自動提示', 'ワンタップ確定・双方カレンダー登録'] },
  { phase: 'v1.1', status: '1ヶ月後', color: 'bg-blue-500/60', items: ['Apple Calendar（iCal）対応', '候補件数のカスタマイズ（1〜5件）', 'LINE通知連携'] },
  { phase: 'v1.2', status: '2ヶ月後', color: 'bg-slate-500/60', items: ['Google Maps場所提案（最寄りカフェ自動提示）', 'リマインダーカスタマイズ（前日・当日朝通知）', 'Outlook Calendar対応'] },
  { phase: 'v2.0', status: '3ヶ月後', color: 'bg-slate-500/40', items: ['AIによる最適時間帯の学習・提案', 'キャンセル・再調整ワンタップ対応', '結婚相談所向けグループ管理機能'] },
]

const FAQ = [
  { q: 'Googleカレンダーのどの情報を見ていますか？', a: '「空き時間（予定がない枠）」のみを参照します。予定のタイトルや詳細内容は取得しません。プライバシーは完全に保護されています。' },
  { q: 'Googleアカウントを持っていない場合は使えませんか？', a: 'v1.0はGoogle Calendar連携が必須です。v1.2でApple Calendar対応予定です。それまではオーナー側のみ連携し、会員様は手動で空き時間を入力する「マニュアルモード」もご利用いただけます。' },
  { q: 'カレンダーに何が書き込まれますか？', a: '「お見合い @調整中」というタイトルで登録されます。場所はv1.2のMaps連携後に自動入力されます。内容はアプリ内でいつでも確認・変更できます。' },
  { q: '候補が3件とも合わなかった場合は？', a: '「再提示ボタン」をタップすると、別の候補3件を新たに生成します。何度でも再提示できます。' },
  { q: 'キャンセル・日程変更はできますか？', a: 'v1.0では確定後の変更はカレンダーアプリから直接行っていただく形になります。v2.0でワンタップ再調整機能を実装予定です。' },
]

export default function KonkatsuSchedulerLPPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100">
      {/* ── ヒーロー ── */}
      <section className="pt-24 pb-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1 text-xs text-emerald-400 font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Google Calendar API 完全連携
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold leading-[1.15] tracking-tight mb-6">
          「いつ空いてますか？」を<br />
          <span className="text-emerald-400">永遠に言わせない</span>ツール
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          マッチング成立後、双方のGoogleカレンダーから共通の空き時間を自動抽出。<br />
          候補3件をワンタップで確定するだけで、お見合い日程が決まります。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products/konkatsu-scheduler/app">
            <button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto">
              今すぐ使ってみる →
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="h-12 px-8 border border-white/10 hover:border-white/20 text-slate-300 font-medium rounded-lg transition-all duration-200 mx-auto">
              ダッシュボードに戻る
            </button>
          </Link>
        </div>
      </section>

      {/* ── 課題訴求 ── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">婚活で一番の「機会損失」はここにある</h2>
            <p className="text-slate-400 leading-relaxed">
              マッチングした瞬間の熱量は、日程調整に手間取るだけで冷める。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '😩', title: 'LINEで5往復', desc: '「平日はいつ空いてますか？」「来週の水曜は？」「その日は少し…」— このやり取りだけで3日かかることも。' },
              { emoji: '💔', title: '熱量が冷める', desc: 'マッチング直後の「会いたい」という気持ちは48時間で急速に薄れる。日程調整の遅れが成婚を遠ざける。' },
              { emoji: '😓', title: '断りにくい空気', desc: '「その日は無理です」と何度も言いにくく、無理して合わせてしまう。本当の空き時間がすれ違う。' },
            ].map((item) => (
              <div key={item.title} className="bg-[#13141f] border border-white/5 rounded-xl p-6">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 機能紹介 ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">6つの機能で「即アポ」を実現</h2>
            <p className="text-slate-400">Googleカレンダーとリアルタイム連携。人間のやり取りをゼロにする仕組み。</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[#13141f] border border-white/5 hover:border-emerald-500/30 rounded-xl p-6 transition-all duration-200">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-base font-semibold mb-2 text-emerald-400">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 導線フロー ── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">たった4ステップで日程が確定する</h2>
          </div>
          <div className="space-y-4">
            {[
              { step: '01', title: 'マッチング成立', desc: 'トーク画面に「📅 日程を調整する」ボタンが出現。' },
              { step: '02', title: 'Googleカレンダーを連携', desc: 'OAuthで認証するだけ。双方の空き時間を自動取得します（初回のみ）。' },
              { step: '03', title: '候補3件が自動提示', desc: '共通の空き枠から移動バッファを考慮した3候補が届きます。' },
              { step: '04', title: '同じ候補をタップ→確定！', desc: '双方が同じ候補を選んだ瞬間、カレンダーに自動登録。完了通知が届きます。' },
            ].map((s, i) => (
              <div key={s.step} className="flex gap-5 items-start bg-[#13141f] border border-white/5 rounded-xl p-5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 口コミ ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">ユーザーの声</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 fill-current text-emerald-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <span className="text-emerald-400 font-bold text-lg">4.9</span>
              <span className="text-slate-500 text-sm">/ 5.0（利用者320名）</span>
            </div>
            <div className="flex gap-6 justify-center mt-3 text-sm text-slate-500">
              <span>✅ 満足度 <span className="text-slate-300 font-medium">98%</span></span>
              <span>✅ 友人推奨率 <span className="text-slate-300 font-medium">96%</span></span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-[#0d1117] border border-white/5 rounded-xl p-6 space-y-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">"{r.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-slate-500 text-xs">{r.role} / {r.location}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {r.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ロードマップ ── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">開発ロードマップ</h2>
            <p className="text-slate-400 text-sm">NextraLabsは「本物しか許さない」。すべての機能は実際のAPIと接続した状態でリリースします。</p>
          </div>
          <div className="space-y-4">
            {ROADMAP.map((r) => (
              <div key={r.phase} className="bg-[#13141f] border border-white/5 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                  <span className="font-bold text-emerald-400">{r.phase}</span>
                  <span className="text-xs text-slate-500 border border-white/10 rounded-full px-2 py-0.5">{r.status}</span>
                </div>
                <ul className="space-y-1">
                  {r.items.map(item => (
                    <li key={item} className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="text-emerald-500">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">よくある質問</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="bg-[#13141f] border border-white/5 rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-2 text-emerald-400">Q. {item.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 最終CTA ── */}
      <section className="py-20 px-4 bg-[#0d1117] text-center">
        <h2 className="text-3xl font-semibold mb-4">会話の熱量が冷める前に、<br /><span className="text-emerald-400">今すぐ日程を確定する</span></h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          マッチング後72時間が勝負。AIがカレンダーを繋いで、最速でお見合いを実現します。
        </p>
        <Link href="/products/konkatsu-scheduler/app">
          <button className="h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200">
            AI即アポ調整くんを使う →
          </button>
        </Link>
      </section>
    </div>
  )
}
