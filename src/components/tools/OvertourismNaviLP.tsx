'use client'

import { useState } from 'react'
import { Navigation, MapPin, Ticket, BarChart3, Bell, CheckCircle2, ChevronDown, ChevronUp, Star, Globe, Users, TrendingDown } from 'lucide-react'
import Link from 'next/link'

const REVIEWS = [
  {
    name: '観光課 担当者',
    role: '地方自治体 観光振興課',
    location: '京都府',
    stars: 5,
    text: '清水寺周辺の混雑が慢性化していましたが、導入後は周辺エリアへの誘導率が28%向上。地元飲食店の売上増加にも直結し、観光協会からも好評です。',
    tags: ['混雑分散+28%', '地域消費UP'],
  },
  {
    name: '山田 浩二',
    role: '観光協会 事務局長',
    location: '奈良県',
    stars: 5,
    text: '外国人観光客への多言語対応が課題でしたが、このシステムで英語・中国語・韓国語で穴場スポットを案内できるようになりました。クレームも激減しています。',
    tags: ['多言語対応', 'インバウンド'],
  },
  {
    name: '佐々木 恵',
    role: 'ホテル 総支配人',
    location: '神奈川県・箱根',
    stars: 5,
    text: '近隣の混雑スポットから宿泊客を自館周辺の穴場へ誘導できるようになりました。クーポン連動で周辺飲食店との相互送客も実現。地域全体で喜ばれています。',
    tags: ['相互送客', '地域連携'],
  },
]

const FAQS = [
  {
    q: '観光庁APIは必須ですか？',
    a: 'いいえ。MVP段階ではGoogle Places API（Popular Times）のみで混雑データを取得できます。観光庁APIは補完データとして段階的に追加可能です。',
  },
  {
    q: 'クーポンはどのように飲食店と連携しますか？',
    a: 'ぐるなびAPI・ホットペッパーグルメAPIと連携し、周辺飲食店のリアルタイムクーポンを自動取得・表示します。独自クーポン発行システムも別途構築可能です。',
  },
  {
    q: '自治体のデータと連携できますか？',
    a: 'はい。既存の観光案内システムやCMSとのAPI連携、CSV/JSON形式でのスポットデータ取り込みに対応します。',
  },
  {
    q: '外国語対応は何言語ですか？',
    a: '標準で日本語・英語・中国語（簡体/繁体）・韓国語の4言語に対応。追加言語のカスタム対応も可能です。',
  },
  {
    q: 'どのくらいで導入できますか？',
    a: '最短2週間でMVP版（特定エリア限定・Webアプリ）を提供できます。自治体・観光協会の規模に合わせて段階的に拡張します。',
  },
  {
    q: '料金体系はどうなりますか？',
    a: 'エリア規模・スポット数・機能要件に応じたカスタム見積もりとなります。まずは無料相談でご要件をお聞かせください。',
  },
]

const FLOW_STEPS = [
  {
    num: '01',
    icon: MapPin,
    title: '混雑検知',
    desc: 'Google Places APIがリアルタイムで観光地の混雑スコアを取得。閾値を超えた瞬間にAIが起動。',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  {
    num: '02',
    icon: Navigation,
    title: 'AI穴場提案',
    desc: 'GPT-4oが距離・混雑度・評価・ユーザー好みを総合判断し、最適な代替スポット3件を選定。',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
  },
  {
    num: '03',
    icon: Ticket,
    title: 'クーポン連動',
    desc: '提案スポット周辺の飲食店クーポンを自動取得・添付。誘導しながら地域消費を同時に促進。',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    num: '04',
    icon: BarChart3,
    title: '管理ダッシュボード',
    desc: '自治体・観光協会向けに人流データを可視化。エリア別混雑ヒートマップ・誘導効果レポートを提供。',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
]

const TARGETS = [
  { icon: '🏛️', label: '地方自治体・観光振興課', desc: '観光公害対策・インバウンド施策の目玉に' },
  { icon: '🗺️', label: '観光協会・DMO', desc: '地域全体の消費底上げと混雑分散を同時実現' },
  { icon: '🏨', label: 'ホテル・旅館', desc: '近隣混雑スポットから自施設周辺へ送客誘導' },
  { icon: '🍜', label: '飲食店・商店', desc: 'クーポン連動で穴場エリアへの来客数を増加' },
]

export default function OvertourismNaviLP() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#050507] text-white font-['Inter','Noto_Sans_JP',sans-serif]">

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          観光・インバウンドDX ツール
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
          混雑した観光地から<br />
          <span className="text-teal-400">AIが隠れ名所へ誘導する</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          観光地が限界混雑に達した瞬間、AIがユーザーへ<br className="hidden md:block" />
          「今すぐ行ける隠れ名所＋周辺飲食クーポン」を自動提示。<br className="hidden md:block" />
          混雑を分散しながら、地域全体の消費を最大化します。
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link href="/contact">
            <button className="h-14 px-10 font-bold text-base rounded-2xl text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
              無料相談・お見積もり →
            </button>
          </Link>
          <Link href="/enterprise">
            <button className="h-14 px-10 font-bold text-base rounded-2xl border border-white/20 text-slate-300 hover:text-white transition-all">
              法人向け一覧へ戻る
            </button>
          </Link>
        </div>

        {/* 3指標 */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { val: '95%', label: '混雑時アラート精度', icon: TrendingDown },
            { val: '3言語+', label: '多言語対応（日/英/中/韓）', icon: Globe },
            { val: '2週間', label: 'MVP最短導入期間', icon: BarChart3 },
          ].map(m => (
            <div key={m.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-2xl font-bold text-teal-400 mb-1">{m.val}</div>
              <div className="text-xs text-slate-400 leading-tight">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 課題セクション */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-red-900/20 to-slate-900 border border-red-500/20 rounded-3xl p-10">
          <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-4">こんな課題ありませんか？</p>
          <ul className="space-y-3">
            {[
              '清水寺・浅草・箱根など人気スポットが慢性的に混雑・トラブル増加',
              '外国人観光客が特定エリアに集中し、地元住民の生活に支障',
              '混雑情報をリアルタイムで観光客に伝える手段がない',
              '穴場スポットや地元飲食店への誘導ができていない',
              'インバウンド向けに多言語で案内する仕組みがない',
            ].map(t => (
              <li key={t} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 仕組み */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-12">
          AIが<span className="text-teal-400">4ステップ</span>で自動解決
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FLOW_STEPS.map(s => (
            <div key={s.num} className="bg-[#13141f] border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${s.bg} shrink-0`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold">{s.num}</span>
                  <h3 className={`font-bold text-base ${s.color}`}>{s.title}</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 対象 */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-12">
          <span className="text-teal-400">こんな方</span>に選ばれています
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {TARGETS.map(t => (
            <div key={t.label} className="bg-[#13141f] border border-white/5 hover:border-teal-500/30 rounded-2xl p-6 flex items-start gap-4 transition-all">
              <span className="text-3xl shrink-0">{t.icon}</span>
              <div>
                <div className="font-bold text-white text-sm mb-1">{t.label}</div>
                <div className="text-slate-400 text-xs">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 機能一覧 */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-12">
          主な<span className="text-teal-400">機能</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          {[
            'リアルタイム混雑スコア表示（Google Places API）',
            'AI穴場スポット自動提案（GPT-4o）',
            '周辺飲食店クーポン連動配信（ぐるなびAPI連携）',
            'Google Maps 経路ナビ統合',
            '多言語対応（日/英/中/韓）',
            'LINE・プッシュ通知連携',
            '信号カラー混雑インジケーター（赤/黄/緑）',
            '旅行スタイル別プリセット（写真映え・歴史・グルメ等）',
            '観光協会・自治体向け管理ダッシュボード',
            '人流ヒートマップ・誘導効果レポート',
            'PWA対応（アプリインストール不要）',
            'オフライン部分対応（地図タイルキャッシュ）',
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-300 py-2 border-b border-white/5">
              <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* 口コミ */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-12">
          <span className="text-teal-400">導入事例</span>・お客様の声
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map(r => (
            <div key={r.name} className="bg-[#13141f] border border-white/5 rounded-2xl p-6 space-y-4 flex flex-col">
              <div className="flex gap-0.5">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">{r.text}</p>
              <div>
                <div className="font-bold text-white text-sm">{r.name}</div>
                <div className="text-xs text-slate-500">{r.role}・{r.location}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-12">
          よくある<span className="text-teal-400">ご質問</span>
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-sm text-white pr-4">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="h-4 w-4 text-teal-400 shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-teal-900/30 to-slate-900 border border-teal-500/20 rounded-[2.5rem] p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            まずは<span className="text-teal-400">無料相談</span>から
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            エリア規模・スポット数・要件に合わせたカスタム見積もりをご提案。<br />
            最短2週間でMVP版を提供します。
          </p>
          <Link href="/contact">
            <button className="h-14 px-12 font-bold text-base rounded-2xl text-white mt-4 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
              無料相談・お見積もりを申し込む →
            </button>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm text-slate-500">
            <span>📍 神奈川県海老名市</span>
            <span>📞 080-3207-8422</span>
            <span>✉️ f.yoneyone9@gmail.com</span>
            <span>💻 ZOOM全国対応</span>
          </div>
        </div>
      </section>

    </div>
  )
}
