import Link from 'next/link'
import { Metadata } from 'next'
import { Youtube, Mic, Video, Upload, Wand2, Download, Users, Check, ArrowRight, ChevronRight, Star, Clock, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'YouTubeゆっくり系動画作成代行 | NextraLabs — ずんだもん・めたんが貴社PRを紹介',
  description: 'PR動画をお渡しいただくだけ。ずんだもん×四国めたんの掛け合いナレーション・立ち絵アニメーション・字幕・BGM付きの完成動画を最短3営業日で納品。法人・個人事業主様向け動画制作代行。',
  alternates: { canonical: 'https://nextralab.jp/products/youtube-yukkuri' },
}

const STEPS = [
  { icon: Upload,   label: '動画素材をご提供',     desc: 'MP4・MOV形式でDropboxやDrive経由でお送りください。' },
  { icon: Wand2,    label: 'AIシーン解析＆台本作成', desc: 'AIが動画内容を解析し、掛け合い台本を自動生成します。' },
  { icon: Mic,      label: 'ずんだもん×めたん収録',  desc: 'VOICEVOXで高品質な掛け合い音声を生成。立ち絵演出付き。' },
  { icon: Download, label: 'MP4で納品',             desc: '字幕・BGM入りの完成動画をご納品。YouTube即アップ対応。' },
]

const FEATURES = [
  'ずんだもん＆四国めたん 掛け合いナレーション（VOICEVOX使用）',
  'AIによるシーン解析＆台本自動生成',
  '立ち絵キャラアニメーション演出（アクティブ切り替え）',
  '字幕テロップ自動同期',
  '著作権フリーBGM付き',
  'MP4納品（1920×1080 / YouTube即アップ対応）',
  '最短3営業日納品',
  '修正1回対応',
]

const USE_CASES = [
  { emoji: '🏨', title: '宿泊・ホテルのPR動画',   desc: '施設の魅力をずんだもんが楽しくレポート。観光客への訴求力が格段にアップ。' },
  { emoji: '💕', title: '結婚相談所・婚活サービス', desc: 'めたんが丁寧に成婚実績や入会メリットをご紹介。親しみやすさが信頼に。' },
  { emoji: '🛒', title: '商品・サービス紹介',      desc: 'ECや店舗のPR動画にキャラナレーションを追加。SNSでの拡散力が向上。' },
  { emoji: '📚', title: 'ツール・SaaS紹介動画',   desc: '機能説明を掛け合いで分かりやすく。NextraLabsのツール動画でも実績あり。' },
]

const PLANS = [
  {
    name: 'スポット',
    price: '¥29,800〜',
    note: '1本あたり（動画5分以内）',
    features: ['動画1本', '掛け合いナレーション', '立ち絵アニメーション', '字幕テロップ', 'BGM選曲', '修正1回', '最短3営業日'],
    cta: '申し込む',
    highlight: false,
  },
  {
    name: '法人パック',
    price: 'お見積もり',
    note: '月4本〜（10%割引）',
    features: ['月4本以上', '優先対応', 'ブランドカスタマイズ', '専用キャラ台本設計', '修正2回まで', '専任担当者対応', '請求書払い対応'],
    cta: '相談・見積もり',
    highlight: true,
  },
]

export default function YoutubeYukkuriLpPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">

      {/* ヒーロー */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-transparent to-amber-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-rose-500/25 bg-rose-500/5 rounded-full px-4 py-1.5 mb-6">
            <Youtube className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px] font-medium text-rose-400 tracking-widest uppercase">YouTube Yukkuri 代行</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.15]">
            動画素材をお渡しするだけ。<br />
            <span className="text-rose-400">ずんだもん×めたん</span>が<br />
            貴社をPRします。
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            AIシーン解析 → 掛け合い台本自動生成 → VOICEVOX音声 → 立ち絵アニメーション。<br />
            字幕・BGM入りの完成動画を<strong className="text-white">最短3営業日</strong>で納品します。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button className="h-14 px-10 font-bold text-lg rounded-2xl gap-2 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: '#fff' }}>
                <Video className="h-5 w-5" />
                制作を依頼する →
              </Button>
            </Link>
            <Link href="/enterprise">
              <Button variant="outline" className="h-14 px-10 font-bold text-lg rounded-2xl border-white/20 text-slate-300 hover:text-white">
                法人プランを見る
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-600 mt-4">法人会員は10%割引 ／ ZOOM打ち合わせ対応 ／ 全国OK</p>
        </div>
      </section>

      {/* 実績バナー */}
      <section className="py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-6 justify-center">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-bold">実制作実績あり</span>
              <span className="text-slate-400">— NextraLabsのサービス紹介動画で本手法を使用・好評</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>最短<strong className="text-white">3営業日</strong>納品</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Wrench className="h-4 w-4 text-amber-400" />
              <span>修正<strong className="text-white">1回</strong>対応</span>
            </div>
          </div>
        </div>
      </section>

      {/* 制作フロー 4ステップ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">制作フローは4ステップ</h2>
          <div className="flex flex-col md:flex-row items-start gap-4">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
                  <step.icon className="h-6 w-6 text-rose-400" />
                </div>
                <div className="text-[10px] font-bold text-rose-400 mb-1">STEP {i + 1}</div>
                <p className="text-sm font-semibold text-white mb-1">{step.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-slate-700 mt-3 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 完成動画 サンプルイメージ（テキスト説明） */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0d1117] border border-white/8 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">完成動画の構成イメージ</p>
            <div className="flex items-center gap-2 flex-wrap">
              {['元動画', 'ずんだもん立ち絵', '四国めたん立ち絵', '掛け合いナレーション', '字幕テロップ', 'BGM', '→ MP4完成'].map((label, i, arr) => (
                <div key={label} className="flex items-center gap-2 shrink-0">
                  <div className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                    label.includes('MP4') ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                  }`}>
                    {label}
                  </div>
                  {i < arr.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 機能＋活用シーン */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">含まれるもの</h2>
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">こんな動画に最適</h2>
              <div className="space-y-4">
                {USE_CASES.map((u) => (
                  <div key={u.title} className="bg-[#0d1117] border border-white/8 rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">{u.emoji} {u.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">料金プラン</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`rounded-[2rem] overflow-hidden border p-8 flex flex-col gap-5 transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-br from-rose-950/40 to-amber-950/20 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]'
                  : 'bg-[#0d1117] border-white/8'
              }`}>
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-0.5 w-fit">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">おすすめ</span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">{plan.name}</p>
                  <p className="text-3xl font-bold text-white">{plan.price}</p>
                  <p className="text-xs text-slate-500 mt-1">{plan.note}</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button className="w-full h-11 font-bold rounded-xl"
                    style={plan.highlight
                      ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }
                      : { background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: '#fff' }}>
                    {plan.cta} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">※ 動画5分超・複数キャラ追加・急ぎ対応は別途お見積もり</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white text-center mb-8">よくある質問</h2>
          {[
            { q: '動画の形式は何でもOKですか？', a: 'MP4・MOV・AVI等の一般的な動画形式に対応しています。4K素材もOKです。' },
            { q: 'キャラクターは選べますか？', a: 'ずんだもん・四国めたんがメインですが、VOICEVOXの他キャラにも対応できます。ご相談ください。' },
            { q: '台本の確認はできますか？', a: 'はい。音声収録前に台本をご確認いただけます（法人パックは2回まで修正可）。' },
            { q: '全国対応していますか？', a: 'もちろんです。データのやりとりはDropbox・Google Driveで行います。ZOOM打ち合わせも対応。' },
          ].map((faq) => (
            <div key={faq.q} className="bg-[#0d1117] border border-white/8 rounded-2xl p-5">
              <p className="text-sm font-bold text-white mb-2">Q. {faq.q}</p>
              <p className="text-xs text-slate-400 leading-relaxed">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-rose-600/20 to-amber-950/20 border border-rose-500/20 rounded-[3rem] p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
              まずはお気軽に<br /><span className="text-rose-400">ご相談ください</span>
            </h2>
            <p className="text-slate-400 font-bold">神奈川県海老名市 / ZOOM全国対応 / 無料相談・お見積もり</p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact">
                <Button className="h-14 px-10 font-bold text-lg rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: '#fff' }}>
                  <Video className="mr-2 h-5 w-5" />
                  制作を依頼する・お見積もり
                </Button>
              </Link>
              <Link href="/enterprise">
                <Button variant="outline" className="h-14 px-8 font-bold text-lg rounded-2xl border-white/20 text-slate-300 hover:text-white">
                  法人向けAIソリューション一覧
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm text-slate-500">
              <span>📍 神奈川県海老名市</span>
              <span>📞 080-3207-8422</span>
              <span>✉️ f.yoneyone9@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
