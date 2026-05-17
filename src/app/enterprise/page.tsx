import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, HeartHandshake, Mic, CloudRain, ArrowRight, CheckCircle2, Mail, Youtube, Video, Upload, Sparkles, BadgeCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: '法人・個人事業主様向けAIソリューション | NextraLabs',
  description: '宿泊・不動産DX・婚活相談所DX・口コミ/顧客の声収集・業務効率化。貴社の課題に合わせたAIシステムをご提案。お見積もり無料。',
  alternates: { canonical: 'https://nextralab.jp/enterprise' },
}

const CATEGORIES = [
  {
    id: 'hotel',
    label: '🏨 宿泊・ホテルDX',
    desc: 'チェックイン自動化・館内収益向上・多言語対応をAIで解決',
    color: 'border-sky-500/40',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    tools: [
      {
        id: 'nextra-ai',
        title: 'Nextra AI',
        sub: 'チェックイン・予約・解錠を全自動化。ホテル・民泊・ゲストハウスのフロント業務をAIが代替。人件費を最大60%削減。',
        icon: Building2,
        price: '要お見積もり',
        tags: ['ホテル', '民泊', '不動産'],
        lpUrl: '/products/nextra-ai',
        features: ['多言語対応チェックイン', 'スマートロック連携', '予約管理自動化', 'レポート自動生成'],
      },
      {
        id: 'weather-boost',
        title: 'Google天気連動型 館内消費ブースト',
        sub: '悪天候を売上チャンスに変える。雨・台風・猛暑を検知して自動でクーポン・プッシュ通知を配信。',
        icon: CloudRain,
        price: '要お見積もり',
        tags: ['ホテル', '飲食', '小売'],
        lpUrl: '/products/weather-boost',
        features: ['天気API連携', 'クーポン自動配信', 'LINE/メール通知', '売上分析'],
      },
      {
        id: 'voice-guest-assist',
        title: 'AI多言語ゲストアシスト',
        sub: '語学力ゼロでも外国語ゲスト対応を完璧にこなせる。会話をリアルタイム翻訳＆CRM自動記録。',
        icon: Mic,
        price: '要お見積もり',
        tags: ['ホテル', '旅館', '多言語'],
        lpUrl: '/products/voice-guest-assist',
        features: ['リアルタイム翻訳', 'アレルギー情報抽出', 'Stayseeメモ連携', '引き継ぎ自動化'],
      },
    ],
  },
  {
    id: 'konkatsu',
    label: '💕 婚活・結婚相談所DX',
    desc: 'お見合い成功率向上・業務自動化で相談所の差別化を実現',
    color: 'border-pink-500/40',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    tools: [
      {
        id: 'omiai-room',
        title: 'オンラインお見合い盛り上げシステム',
        sub: 'BGM×AIトークサジェストで気まずい沈黙を完全解消。成婚率を飛躍的に向上させる婚活DXシステム。',
        icon: HeartHandshake,
        price: '要お見積もり',
        tags: ['結婚相談所', '婚活', 'DX'],
        lpUrl: '/products/omiai-room',
        features: ['AIトーク提案', 'BGM自動制御', 'オンライン対応', '成婚率レポート'],
      },
    ],
  },
  {
    id: 'reputation',
    label: '⭐ 口コミ・顧客の声DX',
    desc: '実体験者の声を自然に集め、公開レビューと社内改善を自動で分岐',
    color: 'border-amber-500/40',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    tools: [
      {
        id: 'review-flow',
        title: '口コミ運用まるごと代行プラン',
        sub: '顧客満足の確認からレビュー導線、返信テンプレ、月次レポートまで一括運用。高評価は公開レビューへ、低評価は社内改善へ自動分岐。',
        icon: BadgeCheck,
        price: '要お見積もり',
        tags: ['口コミ', 'レビュー', '運用代行'],
        lpUrl: '/contact',
        features: ['満足度チェック自動送信', '高評価/低評価の自動分岐', 'Googleレビュー導線', '月次レポートと改善提案'],
      },
    ],
  },
  {
    id: 'content',
    label: '🎬 動画・コンテンツ制作',
    desc: 'AI×VOICEVOXでPR動画制作コストを激減。個人事業主・法人どちらも対応',
    color: 'border-emerald-500/40',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tools: [
      {
        id: 'pr-video-narrator',
        title: 'PR動画ナレーター',
        sub: '動画をアップするだけ。AIが内容を解析してVOICEVOXキャラのナレーション入り動画を自動生成。SNS・YouTube用PR動画を激安コストで量産。',
        icon: Mic,
        price: '法人・個人事業主プラン',
        tags: ['法人', '個人事業主', '動画制作'],
        lpUrl: '/products/pr-video-narrator',
        features: ['VOICEVOX音声自動生成', 'シーン解析', 'テロップ自動同期', 'YouTubeバズり構成'],
      },
      {
        id: 'youtube-yukkuri',
        title: 'ゆっくり系動画作成代行',
        sub: 'PRしたい動画素材をご提供いただくだけ。ずんだもん・四国めたんが掛け合いでサービスを紹介。字幕・BGM・立ち絵アニメーション付きの完成動画を最短3営業日で納品。',
        icon: Youtube,
        price: '¥29,800〜（法人会員10%割引）',
        tags: ['YouTube', 'ゆっくり動画', '動画制作代行'],
        lpUrl: '/products/youtube-yukkuri',
        features: [
          'ずんだもん＆四国めたん 掛け合いナレーション',
          'AIシーン解析＆台本自動生成',
          '立ち絵キャラアニメーション演出',
          '字幕テロップ＋著作権フリーBGM',
          'MP4納品（YouTube即アップ対応）',
          '最短3営業日・修正1回対応',
        ],
      },
    ],
  },
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 pb-32">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">
          Enterprise & Business
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight">
          法人・個人事業主様向け<br />
          <span className="text-amber-400">AIソリューション</span>
        </h1>
        <p className="text-xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
          宿泊・婚活・動画制作・口コミ運用代行。<br />
          貴社の課題に合わせたAIシステムをカスタム提供。<br />
          まずはお気軽にご相談ください。
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/contact">
            <Button className="h-14 px-10 font-bold text-lg rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
              無料相談・お見積もり →
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="h-14 px-10 font-bold text-lg rounded-2xl border-white/20 text-slate-300 hover:text-white">
              全ツール一覧を見る
            </Button>
          </Link>
        </div>
      </section>

      {/* ジャンル別ツール一覧 */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            {/* カテゴリヘッダー */}
            <div className={`border-l-4 ${cat.color} pl-5 mb-8`}>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{cat.label}</h2>
              <p className="text-slate-400 text-sm mt-1">{cat.desc}</p>
            </div>

            {/* ツールカード */}
            <div className={`grid gap-6 ${cat.tools.length === 1 ? 'md:grid-cols-1 max-w-2xl' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {cat.tools.map(tool => (
                <Card key={tool.id} className="bg-[#13141f] border border-white/5 hover:border-amber-500/40 rounded-[2rem] overflow-hidden transition-all group shadow-xl">
                  <div className="p-7 space-y-5 flex flex-col h-full">
                    {/* ヘッダー */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                        <tool.icon className="h-6 w-6 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white leading-snug">{tool.title}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {tool.tags.map(tag => (
                            <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 説明 */}
                    <p className="text-slate-400 text-sm leading-relaxed flex-1">{tool.sub}</p>

                    {/* 機能リスト */}
                    <ul className="space-y-1.5">
                      {tool.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* 価格・CTA */}
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <span className="text-amber-400 font-bold text-sm">{tool.price}</span>
                      <div className="flex gap-3">
                        <Link href="/contact" className="flex-1">
                          <Button className="w-full h-10 font-bold text-sm rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                            相談・見積もり →
                          </Button>
                        </Link>
                        {tool.lpUrl && (
                          <Link href={tool.lpUrl}>
                            <Button variant="outline" className="h-10 px-4 text-sm rounded-xl border-white/10 text-slate-400 hover:text-white">
                              詳細
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 導入フロー */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">
          導入までの<span className="text-amber-400">3ステップ</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: '無料相談', desc: 'お問い合わせフォームまたはZoomで現状の課題をヒアリング。口コミ導線、顧客アンケート、レビュー返信まで整理します。' },
            { step: '02', title: 'お見積もり', desc: '貴社の規模・要件に合わせたカスタムプランをご提案。初期費用・月額費用を明記。' },
            { step: '03', title: '導入・運用', desc: '最短1週間で導入開始。配信設定、分岐、レポート運用までサポート継続。全国対応・ZOOM可。' },
          ].map(s => (
            <div key={s.step} className="space-y-4 text-left">
              <div className="text-6xl font-bold text-amber-500/20">{s.step}</div>
              <h3 className="text-xl font-bold text-white">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-amber-600/20 to-slate-900 border border-amber-500/20 rounded-[3rem] p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
            まずはお気軽に<br /><span className="text-amber-400">ご相談ください</span>
          </h2>
          <p className="text-slate-400 font-bold">神奈川県海老名市 / ZOOM全国対応 / 無料相談・お見積もり</p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/contact">
              <Button className="h-14 px-10 font-bold text-lg rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                <Mail className="mr-2 h-5 w-5" />
                お問い合わせ・見積もり
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm text-slate-500">
            <span>📍 神奈川県海老名市</span>
            <span>📞 080-3207-8422</span>
            <span>✉️ f.yoneyone9@gmail.com</span>
          </div>
        </div>
      </section>
    </div>
  )
}
