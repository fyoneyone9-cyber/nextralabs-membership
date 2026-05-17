'use client'

import { useState } from 'react'
import { ArrowRight, CloudRain, Zap, Gift, BarChart3, Bell, CheckCircle2, ChevronDown, ChevronUp, Star } from 'lucide-react'
import Link from 'next/link'

const REVIEWS = [
  {
    name: '田中 美咲',
    role: '宿泊施設マネージャー',
    location: '北海道',
    stars: 5,
    text: '雨が降るたびにバーの売上が上がるのが数字で見えるようになりました。先月の雨天日だけで館内消費が平均+¥32,000増えています。設定も10分で完了しました。',
    tags: ['収益UP', '即日設定'],
  },
  {
    name: '佐藤 健太',
    role: 'フロントマネージャー',
    location: '京都府',
    stars: 5,
    text: 'ゲストから「気が利くね」と言われることが増えました。悪天候でも館内で楽しんでもらえる体験が自動で提供できるのが最高です。クーポン使用率は38%を超えています。',
    tags: ['顧客満足度', 'クーポン使用率38%'],
  },
  {
    name: '山本 由紀',
    role: '小規模旅館オーナー',
    location: '静岡県',
    stars: 5,
    text: 'スタッフが少ない旅館でも全自動で動いてくれます。台風シーズンの売店売上が前年比45%増になりました。こんなツールを待っていました。',
    tags: ['小規模施設向け', '売上+45%'],
  },
]

const FAQS = [
  {
    q: 'どのAPIが必要ですか？',
    a: '天気データ取得にOpenWeatherMap API（無料プランあり）、通知にLINE Messaging APIまたはResend（メール）を使います。すべて無料枠から始められます。',
  },
  {
    q: 'チェックイン時にゲストのLINE/メールをどう取得しますか？',
    a: 'チェックイン時にQRコードを提示し、LINE登録またはメールアドレス入力を案内するフローを提供します。既存PMSとの連携も可能です。',
  },
  {
    q: '深夜にも通知が届きますか？',
    a: 'いいえ。送信時間帯（例: 9:00〜22:00）を設定できます。深夜の通知は自動ブロックされます。',
  },
  {
    q: '同じゲストに何度も送られませんか？',
    a: '連続発動インターバル（最短3時間）を設定でき、同一ゲストへの重複送信を防ぎます。',
  },
  {
    q: 'クーポンはどのように管理しますか？',
    a: 'UUIDで管理されたQRコードが自動生成されます。スタッフがスキャンすると使用済みになり、二重利用を防ぎます。',
  },
]

export default function WeatherBoostLP() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#050507] text-white font-['Inter','Noto_Sans_JP',sans-serif]">

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          ホテル・旅館 向けDXツール
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
          雨が降った瞬間に<br />
          <span className="text-emerald-400">館内消費が動き出す</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          天気APIと自動通知が連携し、悪天候のたびにゲストへクーポンを送信。<br className="hidden md:block" />
          「不運な天気」をホテルの収益チャンスに変えます。
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          🏨 エンタープライズ専用プラン
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact">
            <button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto">
              導入のご相談・お見積もり <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/enterprise">
            <button className="h-12 px-8 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto">
              エンタープライズプランを見る
            </button>
          </Link>
        </div>
      </section>

      {/* 課題訴求 */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 tracking-tight">こんな場面、ありませんか？</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: CloudRain, title: '雨でゲストが外出できない', desc: '外出予定がなくなり、ゲストが部屋で過ごすだけ。館内施設の稼働率が低いまま。' },
            { icon: Zap, title: 'チャンスを逃している', desc: '「今なら売れるのに」というタイミングをスタッフが把握できていない。人手も足りない。' },
            { icon: Bell, title: '手動対応は限界', desc: 'ゲストへの個別案内はフロントの負担が大きい。自動化したいが仕組みがない。' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#0d1117] border border-white/5 rounded-xl p-6">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit mb-4">
                <Icon className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="py-20 px-4 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">3ステップで全自動化</h2>
          <p className="text-slate-400 text-center text-sm mb-12">設定は最短10分。あとはシステムが自動で動き続けます。</p>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: '天気トリガーを設定',
                desc: '「降水確率70%以上」「気温10℃以下」など、条件をプリセットまたはカスタムで設定。発動時間帯も指定できます。',
                detail: ['☔ 雨スタート', '🌬️ 強風注意', '🥶 寒波到来', '🌩️ 台風接近', '🌡️ 猛暑日'],
              },
              {
                step: '02',
                title: 'オファー（クーポン）を登録',
                desc: 'バークーポン・スパ割引・売店特典などをテンプレートから選んでカスタマイズ。送信文言もプレビューで確認できます。',
                detail: ['バークーポン', 'レストラン割引', 'スパ特典', '売店20%OFF', 'ルームサービス'],
              },
              {
                step: '03',
                title: '自動送信 & 効果測定',
                desc: '条件が合致した瞬間にLINE/メールで自動送信。クーポン使用率・推定売上増加額をリアルタイムで確認できます。',
                detail: ['送信件数', 'クーポン使用率', '推定売上増加額', 'ゲスト満足度スコア'],
              },
            ].map(({ step, title, desc, detail }) => (
              <div key={step} className="bg-[#0d1117] border border-white/5 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <span className="text-4xl font-bold text-emerald-400/30">{step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.map(d => (
                      <span key={d} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium px-3 py-1 rounded-full">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* レビュー */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">導入施設の声</h2>
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="text-center">
            <span className="text-3xl font-bold text-white">4.9</span>
            <span className="text-slate-400 text-sm ml-1">/ 5.0</span>
          </div>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-emerald-400 fill-current" />)}
          </div>
          <div className="text-slate-400 text-sm">導入施設 47件 | 推奨率 96%</div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-6">
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-emerald-400 fill-current" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{r.text}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {r.tags.map(t => (
                  <span key={t} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-medium px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="text-xs text-slate-500">
                <span className="text-white font-medium">{r.name}</span>｜{r.role}｜{r.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ロードマップ */}
      <section className="py-20 px-4 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">開発ロードマップ</h2>
          <p className="text-slate-400 text-center text-sm mb-12">透明性のある開発で、施設様のニーズに応えていきます。</p>
          <div className="space-y-4">
            {[
              {
                phase: 'Phase 1',
                status: '現在',
                color: 'emerald',
                items: ['OpenWeatherMap連携（リアルタイム天気取得）', 'LINE / メール通知', '基本クーポン発行（QRコード）', '管理ダッシュボード', '送信履歴・使用率計測'],
              },
              {
                phase: 'Phase 2',
                status: '〜2026年7月',
                color: 'sky',
                items: ['PMS（ホテル管理システム）API連携', 'ゲストアプリ内プッシュ通知', 'A/Bテスト機能（最適なオファーを自動学習）', 'Webhook外部連携'],
              },
              {
                phase: 'Phase 3',
                status: '〜2026年10月',
                color: 'amber',
                items: ['多言語対応（英・中・韓）', 'Stripe連携（有料オプション設定）', 'チェーンホテル向け一括管理', 'AIによる天気×消費パターン分析'],
              },
            ].map(({ phase, status, color, items }) => (
              <div key={phase} className="bg-[#0d1117] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${color}-500/15 text-${color}-400 border border-${color}-500/30`}>{phase}</span>
                  <span className="text-slate-500 text-sm">{status}</span>
                  {phase === 'Phase 1' && (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 size={14} /> 稼働中
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-${color}-400`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 tracking-tight">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium text-white hover:bg-white/5 transition-colors"
              >
                {faq.q}
                {openFaq === i ? <ChevronUp size={16} className="text-emerald-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          🏨 エンタープライズ専用プラン
        </div>
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
          次の雨の日から、<span className="text-emerald-400">売上が変わります</span>
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          法人・ホテル向けエンタープライズ契約のみ。<br />
          導入施設のご状況に合わせてカスタムご提案します。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact">
            <button className="h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto">
              導入のご相談・お見積もり <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/enterprise">
            <button className="h-12 px-8 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto">
              エンタープライズプランを見る
            </button>
          </Link>
        </div>
      </section>

    </div>
  )
}
