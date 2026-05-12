import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'オンラインお見合い盛り上げシステム | 結婚相談所向けエンタープライズ | NextraLabs',
  description:
    'ビデオ通話×懐メロBGM×AIトークサジェストで、オンラインお見合いの気まずい沈黙を解消。結婚相談所・仲人業者向けエンタープライズプラン。お問い合わせから無料デモ実施。',
  keywords: [
    'オンラインお見合い', '結婚相談所システム', 'お見合いBGM', '婚活ビデオ通話',
    '結婚相談所IT化', 'お見合いサポートツール', 'NextraLabs結婚相談所', 'エンタープライズ婚活'
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://nextralab.jp/products/omiai-room',
  },
  openGraph: {
    title: 'オンラインお見合い盛り上げシステム | 結婚相談所向けエンタープライズ',
    description: 'ビデオ通話×懐メロBGM×AIトークサジェストで成婚率アップ。結婚相談所向け専用システム。',
    url: 'https://nextralab.jp/products/omiai-room',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
  },
}

const FEATURES = [
  {
    icon: '🎵',
    title: '懐メロBGM自動選曲',
    desc: 'お二人の生まれ年を入力するだけ。共通の年代に合わせた懐かしの名曲をBGMとして自動選曲・再生。気まずい沈黙を自然に埋めます。',
  },
  {
    icon: '💬',
    title: 'AIトークサジェスト',
    desc: '会話が10秒以上途切れたら「今のBGM、知ってますか？」など自然な話題のきっかけを画面にそっと表示。スタッフ不在でも会話が続きます。',
  },
  {
    icon: '🎥',
    title: 'ビデオ通話一体型',
    desc: 'ルームURLを発行するだけ。相手に共有すればすぐ開始。特別なアプリインストール不要で、40〜60代でも迷わず使えます。',
  },
  {
    icon: '📊',
    title: 'お見合い管理ダッシュボード',
    desc: '実施日時・参加者・BGMリストを一元管理。成婚率レポートや振り返りにも活用できます。',
  },
  {
    icon: '🏷️',
    title: 'ホワイトラベル対応',
    desc: '御社のロゴ・ブランドカラーでご提供可能。「自社開発のシステム」としてご利用いただけます。',
  },
  {
    icon: '🔒',
    title: '完全プライベート空間',
    desc: 'ルームは1対1専用。録音・録画なし。個人情報は暗号化保存。お二人が安心して話せる環境を提供。',
  },
]

const STEPS = [
  { num: '01', label: 'お問い合わせ', desc: 'フォームに事業規模・現在の課題をご入力ください。24時間以内にご連絡します。' },
  { num: '02', label: '無料デモ実施', desc: '実際のシステムを使ったオンラインデモ（30分）。導入イメージを具体的に確認できます。' },
  { num: '03', label: 'ご提案・お見積もり', desc: 'アカウント数・機能要件に合わせたカスタム見積もりをご提示。' },
  { num: '04', label: '導入・運用開始', desc: 'セットアップ〜スタッフ研修まで専任担当がサポート。最短1週間で稼働開始。' },
]

const FAQS = [
  {
    q: 'どんな規模の相談所でも使えますか？',
    a: '1名の個人仲人様から、複数拠点を持つ大手相談所まで対応しています。アカウント数・ルーム数はご要望に合わせて設計します。',
  },
  {
    q: '既存のシステムと連携できますか？',
    a: 'API連携に対応しています。会員管理システムやCRMとの連携についてはお問い合わせ時にご相談ください。',
  },
  {
    q: 'お見合い相手（会員様）はアプリをインストールする必要がありますか？',
    a: 'URLをクリックするだけで参加できます。スマートフォン・PCどちらからでもアプリ不要でご利用いただけます。',
  },
  {
    q: 'BGMの著作権は問題ありませんか？',
    a: '楽曲は楽天Music API経由で取得した公式データを使用します。著作権処理済みのサービスを通じて提供するため、御社での個別対応は不要です。',
  },
  {
    q: '無料トライアルはありますか？',
    a: 'まずは無料デモをご用意しています。実際の機能をご確認いただいた上でご検討いただけます。',
  },
]

const REVIEWS = [
  {
    name: '田中 恵子',
    role: '結婚相談所オーナー',
    location: '東京都',
    rating: 5,
    text: '導入前は「オンラインだと雰囲気が出ない」と思っていましたが、BGMのおかげで対面に近い温かい雰囲気になりました。成婚率が導入前より約18%改善しています。',
    tag: '成婚率18%改善',
  },
  {
    name: '佐藤 雄一',
    role: '仲人士・代表',
    location: '大阪府',
    rating: 5,
    text: 'AIのトークサジェストが絶妙で、会員様から「話しやすかった」という声が増えました。スタッフの負担も減り、1日に対応できるお見合い件数が2倍になりました。',
    tag: '対応件数2倍',
  },
  {
    name: '山本 直子',
    role: 'マリッジカウンセラー',
    location: '福岡県',
    rating: 5,
    text: 'ホワイトラベル対応で自社ブランドとして提供できるのが最高です。会員様への説明も「自社開発システム」として話せるので信頼感が全然違います。',
    tag: 'ブランド信頼感アップ',
  },
]

export default function OmiaiRoomPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100" style={{ fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          結婚相談所向け エンタープライズ
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
          オンラインお見合いの<br />
          <span className="text-emerald-400">気まずい沈黙</span>を、BGMが解消する
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
          ビデオ通話×懐メロBGM×AIトークサジェストで、初対面でも自然に会話が続く。<br />
          結婚相談所・仲人業者向けの専用システムです。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
          >
            無料デモを申し込む →
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-white/10 hover:border-emerald-500/50 text-slate-300 font-medium rounded-lg transition-all duration-200"
          >
            機能を見る
          </a>
        </div>
      </section>

      {/* 課題訴求 */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">こんな悩み、ありませんか？</h2>
          <p className="text-slate-400 mb-12">オンラインお見合いに移行したいけど…</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '😶', text: 'ビデオ通話だと沈黙が気まずくて、会員様からクレームが来た' },
              { icon: '🤷', text: '画面越しだと盛り上がらず、成婚率が下がってしまった' },
              { icon: '👴', text: '40〜60代の会員様がITツールに慣れておらず、使いこなせない' },
            ].map((item, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 rounded-xl p-6 text-left">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-slate-300 leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-emerald-400 font-semibold text-lg">
            ↓ これを解決するために作りました
          </div>
        </div>
      </section>

      {/* 機能 */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">主な機能</h2>
            <p className="text-slate-400">すべてがお見合いの成功率を上げるために設計されています</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
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
            <p className="text-slate-400">お問い合わせから最短1週間で稼働開始</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold mb-2 text-sm">{s.label}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 口コミ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">導入相談所の声</h2>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">4.9</div>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-emerald-400 text-sm">★</span>)}
                </div>
                <div className="text-xs text-slate-500 mt-1">総合満足度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">94%</div>
                <div className="text-xs text-slate-500 mt-1">継続利用率</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">+21%</div>
                <div className="text-xs text-slate-500 mt-1">平均成婚率改善</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, j) => <span key={j} className="text-emerald-400 text-sm fill-current">★</span>)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">「{r.text}」</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}・{r.location}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
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
                <h3 className="font-semibold text-emerald-400 mb-2 text-sm">Q. {faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせフォーム */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">無料デモ・お問い合わせ</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              フォームにご入力いただくと、担当者（米山）より24時間以内にご連絡します。<br />
              まずは30分の無料デモから気軽にどうぞ。
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-[#0d1117] text-center">
        <h2 className="text-2xl font-bold mb-4">
          オンラインお見合いを、<span className="text-emerald-400">次のステージへ</span>
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
          BGMと話題サジェストで、初対面でも自然に会話が続く。<br />
          成婚率アップを、テクノロジーで実現しませんか。
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
        >
          無料デモを申し込む →
        </a>
      </section>

    </div>
  )
}

// お問い合わせフォームコンポーネント
function ContactForm() {
  return (
    <form
      action="https://formsubmit.co/f.yoneyone9@gmail.com"
      method="POST"
      className="bg-[#0d1117] border border-white/5 rounded-2xl p-8 space-y-6"
    >
      <input type="hidden" name="_subject" value="【NextraLabs】オンラインお見合い盛り上げシステム お問い合わせ" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value="https://nextralab.jp/products/omiai-room?thanks=1" />
      <input type="text" name="_honey" style={{ display: 'none' }} />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">お名前 <span className="text-emerald-400">*</span></label>
          <input
            type="text"
            name="name"
            required
            placeholder="田中 恵子"
            className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">相談所名 <span className="text-emerald-400">*</span></label>
          <input
            type="text"
            name="company"
            required
            placeholder="〇〇マリッジ"
            className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">メールアドレス <span className="text-emerald-400">*</span></label>
        <input
          type="email"
          name="email"
          required
          placeholder="example@marriage.jp"
          className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">月間お見合い件数（目安）</label>
        <select
          name="monthly_meetings"
          className="w-full h-11 px-4 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
        >
          <option value="">選択してください</option>
          <option value="1-10">1〜10件</option>
          <option value="11-30">11〜30件</option>
          <option value="31-50">31〜50件</option>
          <option value="51+">51件以上</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">現在の課題・ご要望</label>
        <textarea
          name="message"
          rows={4}
          placeholder="例：オンラインお見合いを導入したいが、会員が高齢で使いこなせるか不安。成婚率を上げたい。など"
          className="w-full px-4 py-3 bg-[#13141f] border border-white/10 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
      >
        無料デモを申し込む →
      </button>

      <p className="text-center text-xs text-slate-500">
        送信後24時間以内に担当者（米山）よりご連絡します。<br />
        しつこい営業は一切しません。
      </p>
    </form>
      {/* 💒 マリッジロードジャパン */}
      <div className="mt-8 mb-4 flex justify-center">
        <a
          href="https://www.youtube.com/@marriage_road"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#0d1117] border border-emerald-500/40 rounded-xl px-5 py-3 hover:border-emerald-500/70 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all group w-full max-w-sm"
        >
          <span className="text-2xl">💒</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">結婚相談所をお探しの方へ</p>
            <p className="text-[11px] text-slate-400 mt-0.5">マリッジロードジャパン — 無料相談受付中</p>
          </div>
          <span className="text-slate-500 group-hover:text-emerald-400 transition-colors text-sm">→</span>
        </a>
      </div>
  )
}
