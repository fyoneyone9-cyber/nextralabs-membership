import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '口コミ運用まるごと代行プラン | 顧客の声を自然に集める法人向けサービス | NextraLabs',
  description:
    '満足度チェックから高評価・低評価の自動分岐、Googleレビュー導線、月次レポートまで一括運用。現場の手間を増やさず、顧客の声を集客資産に変える法人向けサービス。',
  keywords: [
    '口コミ収集代行', '顧客レビュー自動化', 'Googleレビュー増やす', '口コミ運用代行',
    '法人向け口コミ', '満足度調査自動化', '低評価対策', 'NextraLabs法人'
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://nextralab.jp/products/review-flow',
  },
  openGraph: {
    title: '口コミ運用まるごと代行プラン | NextraLabs',
    description: '高評価は公開レビューへ、低評価は社内改善へ。顧客の声を自然に集める法人向けサービス。',
    url: 'https://nextralab.jp/products/review-flow',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
  },
}

const FEATURES = [
  {
    icon: '📨',
    title: '満足度チェック自動送信',
    desc: '来店・利用完了後にLINE・メール・SMSで自動配信。スタッフが毎回お願いする手間がゼロになります。',
  },
  {
    icon: '⭐',
    title: '高評価／低評価の自動分岐',
    desc: '4〜5点の高評価者だけをGoogleレビュー等の公開導線へ。1〜3点は社内改善フォームへ自動で分岐。炎上・悪評拡散を防ぎます。',
  },
  {
    icon: '🔗',
    title: 'Googleレビュー導線',
    desc: '高評価ユーザーに、GoogleマップのレビューページへのリンクをQRコード付きで提示。投稿への心理的ハードルを下げます。',
  },
  {
    icon: '📊',
    title: '管理ダッシュボード',
    desc: '送信数・回答率・高評価率・低評価件数を一画面で確認。店舗別・期間別の比較も可能です。',
  },
  {
    icon: '📝',
    title: '文面プリセット＆テンプレ管理',
    desc: '業種別・目的別・トーン別のプリセットを用意。依頼文・お礼文・リマインド文をすぐに設定できます。',
  },
  {
    icon: '📅',
    title: '月次レポート＆改善提案',
    desc: '回答率・高評価傾向・改善ポイントをまとめた月次レポートを提供。数字で改善点が見えるようになります。',
  },
]

const STEPS = [
  { num: '01', label: '無料相談', desc: 'ZOOMまたはフォームで業種・現状の課題をヒアリング。どの業種でも対応可能です。' },
  { num: '02', label: '導線設計', desc: '評価分岐のルール・配信タイミング・文面を御社に合わせてカスタム設計します。' },
  { num: '03', label: '初期設定代行', desc: '顧客取り込み・テンプレ登録・通知先設定まで全部やります。現場の負担ゼロです。' },
  { num: '04', label: '運用開始', desc: '最短1週間で稼働。配信・分岐・レポートが自動で回り続けます。' },
]

const FAQS = [
  {
    q: 'どんな業種でも使えますか？',
    a: '美容院・クリニック・結婚相談所・不動産・飲食・EC・教室・サロンなど、顧客満足が売上に直結するあらゆる業種に対応しています。',
  },
  {
    q: 'Googleレビューを直接書いてもらえますか？',
    a: 'Googleのポリシー上、レビュー投稿をAPIで代行することはできません。実体験のある顧客に投稿ページへの導線を提示する形で対応します。',
  },
  {
    q: '低評価の口コミは外部に出てしまいますか？',
    a: '低評価者は公開レビュー導線には進まず、社内改善フォームへ自動で分岐します。クレームを外部に出す前に回収できます。',
  },
  {
    q: '複数店舗でも使えますか？',
    a: 'StandardプランおよびPremiumプランは複数拠点対応です。店舗ごとの集計・比較も可能です。',
  },
  {
    q: '既存の顧客データを使えますか？',
    a: 'CSVアップロードまたはGoogle Sheets連携でインポートできます。既存のCRM・予約システムとのWebhook連携もご相談ください。',
  },
  {
    q: '運用代行なしのシステムのみも可能ですか？',
    a: 'Liteプランはシステム提供のみです。初期設定は弊社でサポートし、運用は御社で行う形になります。',
  },
]

const REVIEWS = [
  {
    name: '佐藤 由美',
    role: '美容サロンオーナー',
    location: '神奈川県',
    rating: 5,
    text: '施術後のお礼メッセージと一緒に口コミ依頼を送るように設定してもらったら、毎月3〜5件Googleレビューが増えるようになりました。スタッフが何もしなくていいのが最高です。',
    tag: '月5件ペースで増加',
  },
  {
    name: '田中 雄介',
    role: '結婚相談所代表',
    location: '東京都',
    rating: 5,
    text: '面談後の感想を自動で集めてくれるので、改善すべき点がすぐわかります。低評価の声を外に出さずに回収できるのが特に助かっています。',
    tag: 'クレーム事前回収',
  },
  {
    name: '山田 敦子',
    role: 'クリニック事務長',
    location: '大阪府',
    rating: 5,
    text: '受付スタッフに口コミ依頼をお願いしていたときは声かけムラがありましたが、自動化してから回収率が安定しました。月次レポートで数字が見えるのも経営判断に役立っています。',
    tag: '回収率が安定',
  },
]

const PLANS = [
  {
    name: 'Lite',
    price: '要お見積もり',
    desc: '小規模店舗・個人事業主向け',
    features: [
      'テンプレ提供（業種別プリセット）',
      '自動配信設定',
      '基本レポート（月1回）',
      '初期設定サポート',
    ],
    accent: false,
  },
  {
    name: 'Standard',
    price: '要お見積もり',
    desc: '中小企業・複数拠点向け',
    features: [
      'Liteの全機能',
      '複数店舗・拠点管理',
      '高評価/低評価の自動分岐',
      'Googleレビュー導線設計',
      '月次改善レポート',
      'Slack/Teams通知連携',
    ],
    accent: true,
  },
  {
    name: 'Premium',
    price: '要お見積もり',
    desc: '運用代行込み・丸投げプラン',
    features: [
      'Standardの全機能',
      '初期設計〜文面作成まで全代行',
      '配信設定・分岐設定代行',
      '月次改善MTG（ZOOM）',
      '担当者つきサポート',
      '複数ブランド対応',
    ],
    accent: false,
  },
]

export default function ReviewFlowPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100" style={{ fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          法人・個人事業主向け エンタープライズ
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
          口コミを<span className="text-amber-400">作る</span>のではなく、<br />
          <span className="text-amber-400">自然に集まる</span>仕組みを作る
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-6 max-w-2xl mx-auto">
          満足した顧客が自然にレビューを書きたくなる導線を設計し、<br />
          高評価は公開へ、低評価は社内改善へ自動で分岐。<br />
          現場の手間を増やさず、顧客の声を集客資産に変えます。
        </p>
        <p className="text-sm text-amber-400/80 font-medium mb-10">
          ※ 実体験のある顧客のみへの依頼・合法・健全な運用です
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}
          >
            無料相談・お見積もり →
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-white/10 hover:border-amber-500/50 text-slate-300 font-medium rounded-lg transition-all duration-200"
          >
            機能を見る
          </a>
        </div>
      </section>

      {/* 課題訴求 */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">こんな悩み、ありませんか？</h2>
          <p className="text-slate-400 mb-12">口コミを増やしたいけど、現場に余裕がない…</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '😓', text: 'スタッフが毎回口コミをお願いするのが気まずくて声かけがバラバラ' },
              { icon: '😱', text: '低評価がそのままGoogleに書かれてしまって、対応が後手になる' },
              { icon: '🤷', text: 'お客様は満足しているのに、口コミが全然増えない' },
            ].map((item, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 rounded-xl p-6 text-left">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-slate-300 leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-amber-400 font-semibold text-lg">
            ↓ これを解決するために作りました
          </div>
        </div>
      </section>

      {/* 導線の仕組み図 */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">仕組みはシンプルです</h2>
          <p className="text-slate-400 mb-12">顧客満足度に応じて、自動で最適な導線に振り分けます</p>
          <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-8">
            <div className="flex flex-col gap-4 text-sm">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-6 py-3 text-amber-300 font-semibold">
                利用完了後、自動でアンケートを送信
              </div>
              <div className="text-slate-500 text-xs">↓ 回答（星評価）</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="text-emerald-400 font-bold mb-2">⭐⭐⭐⭐⭐ 高評価</div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    Googleレビュー・公式サイト<br />
                    体験談ページへ誘導<br />
                    <span className="text-emerald-400">→ 公開集客に活用</span>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="text-red-400 font-bold mb-2">⭐ 低評価</div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    社内改善フォームへ<br />
                    担当者にアラート通知<br />
                    <span className="text-red-400">→ 外部に出る前に回収</span>
                  </div>
                </div>
              </div>
              <div className="text-slate-500 text-xs">↓ 全データを集約</div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-6 py-3 text-slate-300 text-xs">
                管理ダッシュボードで送信数・回答率・高評価率を確認 → 月次レポートで改善提案
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能 */}
      <section id="features" className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">主な機能</h2>
            <p className="text-slate-400">現場の負担を増やさず、口コミが自然に集まる仕組みを全部用意しています</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 rounded-xl p-6 hover:border-amber-500/30 transition-all duration-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* プラン */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">プラン</h2>
            <p className="text-slate-400">規模・ニーズに合わせて選べます。詳細はお見積もりにて。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 flex flex-col gap-4 border transition-all ${
                  plan.accent
                    ? 'bg-amber-500/5 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]'
                    : 'bg-[#0d1117] border-white/5'
                }`}
              >
                {plan.accent && (
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">人気プラン</div>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-xs">{plan.desc}</p>
                </div>
                <div className="text-amber-400 font-bold">{plan.price}</div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-amber-400 mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`w-full h-10 rounded-lg font-semibold text-sm flex items-center justify-center transition-all ${
                    plan.accent
                      ? 'text-white hover:opacity-90'
                      : 'border border-white/10 text-slate-300 hover:border-amber-500/50'
                  }`}
                  style={plan.accent ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : {}}
                >
                  相談・お見積もり →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 導入フロー */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">導入の流れ</h2>
            <p className="text-slate-400">最短1週間で口コミ収集の仕組みが動き始めます</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold mb-2 text-sm">{s.label}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 声 */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">導入事業者の声</h2>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">4.9</div>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <div className="text-xs text-slate-500 mt-1">満足度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">92%</div>
                <div className="text-xs text-slate-500 mt-1">継続利用率</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">最短1週</div>
                <div className="text-xs text-slate-500 mt-1">導入スピード</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">「{r.text}」</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}・{r.location}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    {r.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">よくある質問</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 rounded-xl p-6">
                <h3 className="font-semibold text-amber-400 mb-2 text-sm">Q. {faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">無料相談・お見積もり</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              フォームにご入力いただくと、担当者（米山）より24時間以内にご連絡します。<br />
              ZOOM対応・全国OK。しつこい営業は一切しません。
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-[#0d1117] text-center">
        <h2 className="text-2xl font-bold mb-4">
          口コミは、<span className="text-amber-400">仕組みで集める</span>時代です
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
          高評価は公開レビューへ、低評価は社内改善へ。<br />
          顧客の声を資産に変える導線を、まるごと任せてください。
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 h-12 px-10 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}
        >
          無料相談・お見積もり →
        </a>
      </section>

    </div>
  )
}

function ContactForm() {
  return (
    <form
      action="https://formsubmit.co/f.yoneyone9@gmail.com"
      method="POST"
      className="bg-[#0d1117] border border-white/5 rounded-2xl p-8 space-y-6"
    >
      <input type="hidden" name="_subject" value="【NextraLabs】口コミ運用まるごと代行プラン お問い合わせ" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value="https://nextralab.jp/products/review-flow?thanks=1" />
      <input type="text" name="_honey" style={{ display: 'none' }} />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">お名前 <span className="text-amber-400">*</span></label>
          <input
            type="text"
            name="name"
            required
            placeholder="田中 恵子"
            className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">会社名・屋号 <span className="text-amber-400">*</span></label>
          <input
            type="text"
            name="company"
            required
            placeholder="〇〇サロン"
            className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">メールアドレス <span className="text-amber-400">*</span></label>
        <input
          type="email"
          name="email"
          required
          placeholder="example@company.jp"
          className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">業種</label>
        <select
          name="industry"
          className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
        >
          <option value="">選択してください</option>
          <option value="beauty">美容院・サロン</option>
          <option value="clinic">クリニック・医療</option>
          <option value="konkatsu">結婚相談所・婚活</option>
          <option value="realestate">不動産</option>
          <option value="restaurant">飲食</option>
          <option value="ec">EC・通販</option>
          <option value="school">教室・スクール</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">希望プラン</label>
        <select
          name="plan"
          className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
        >
          <option value="">未定・相談したい</option>
          <option value="lite">Lite（システムのみ）</option>
          <option value="standard">Standard（複数拠点対応）</option>
          <option value="premium">Premium（運用代行込み）</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">現在の課題・ご要望</label>
        <textarea
          name="message"
          rows={4}
          placeholder="例：口コミが全然増えない。スタッフが毎回声かけするのが大変。低評価がそのまま公開されてしまった。など"
          className="w-full px-4 py-3 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full h-12 font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] text-white"
        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
      >
        無料相談・お見積もりを申し込む →
      </button>

      <p className="text-center text-xs text-slate-500">
        送信後24時間以内に担当者（米山）よりご連絡します。<br />
        しつこい営業は一切しません。
      </p>
    </form>
  )
}
