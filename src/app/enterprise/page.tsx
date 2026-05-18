import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, HeartHandshake, Mic, CloudRain, ArrowRight, CheckCircle2, Mail, Youtube, Video, Upload, Sparkles, BadgeCheck, MapPin, Navigation, Ticket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: '法人・個人事業主様向けAIソリューション | NextraLabs',
  description: '宿泊・観光インバウンド・婚活DX・口コミ運用・動画制作。オーバーツーリズム緩和ナビ（混雑分散AIナビ）含む、貴社課題に合わせたAIシステムをご提案。お見積もり無料。',
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
        lpUrl: '/products/review-flow',
        features: ['満足度チェック自動送信', '高評価/低評価の自動分岐', 'Googleレビュー導線', '月次レポートと改善提案'],
      },
    ],
  },
  {
    id: 'tourism',
    label: '🗺️ 観光・インバウンドDX',
    desc: '混雑分散・穴場誘導・クーポン連動でオーバーツーリズムを解決。自治体・観光協会・ホテル向け',
    color: 'border-teal-500/40',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    tools: [
      {
        id: 'overtourism-navi',
        title: 'オーバーツーリズム緩和ナビ',
        sub: '観光地が限界混雑に達した瞬間、AIがユーザーへ「今すぐ行ける隠れ名所 + 周辺飲食クーポン」を提示。混雑を分散しながら地域消費を最大化。',
        icon: Navigation,
        price: '要お見積もり',
        tags: ['観光協会', '自治体', 'ホテル・旅館', 'インバウンド'],
        lpUrl: '/products/overtourism-navi',
        features: [
          'リアルタイム混雑スコア（Google Places API連携）',
          'AI穴場スポット自動提案（GPT-4o）',
          '周辺飲食店クーポン連動配信',
          'Google Maps 経路ナビ統合',
          '多言語対応（日/英/中/韓）',
          'LINE・プッシュ通知連携',
          '自治体・観光協会向け管理ダッシュボード',
        ],
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
          宿泊・観光・婚活・口コミ・動画制作まで。<br />
          課題に合わせて、AIシステムを1件ずつ丁寧にカスタム提供します。<br />
          まずはお気軽にご相談ください。
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="#contact">
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
          <div key={cat.id} className="space-y-5">
            {/* カテゴリヘッダー */}
            <div className={`border-l-4 ${cat.color} pl-5 mb-2`}>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{cat.label}</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-3xl">{cat.desc}</p>
            </div>

            {/* ツールカード */}
            <div className="grid grid-cols-1 gap-6 max-w-4xl">
              {cat.tools.map(tool => (
                <Card key={tool.id} className="bg-[#13141f] border border-white/5 hover:border-amber-500/40 rounded-[2rem] overflow-hidden transition-all group shadow-xl">
                  <div className="p-8 md:p-10 space-y-6 flex flex-col h-full">
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
                    <ul className="space-y-2">
                      {tool.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* 導入効果 */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">導入効果</div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {tool.id === 'nextra-ai' && '人件費削減・チェックイン待ち時間短縮・多言語対応を一括で実現。'}
                        {tool.id === 'weather-boost' && '悪天候時の館内消費を底上げし、売上の波を平準化。'}
                        {tool.id === 'voice-guest-assist' && '多言語対応の属人化を防ぎ、接客品質を均一化。'}
                        {tool.id === 'omiai-room' && '沈黙ストレスを減らし、お見合いの会話満足度を改善。'}
                        {tool.id === 'review-flow' && 'レビュー収集と社内改善を分離し、口コミ運用を自動化。'}
                        {tool.id === 'overtourism-navi' && '混雑を分散しつつ、地元消費を増やす観光導線を作成。'}
                        {tool.id === 'pr-video-narrator' && '動画PRを量産し、営業素材の制作コストを圧縮。'}
                        {tool.id === 'youtube-yukkuri' && '短納期で見栄えする動画納品を実現し、SNS施策を高速化。'}
                      </p>
                    </div>

                    {/* 価格・CTA */}
                    <div className="pt-2 border-t border-white/5 space-y-3">
                      <span className="text-amber-400 font-bold text-sm">{tool.price}</span>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/contact" className="flex-1">
                          <Button className="w-full h-11 font-bold text-sm rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                            相談・見積もり →
                          </Button>
                        </Link>
                        {tool.lpUrl && (
                          <Link href={tool.lpUrl}>
                            <Button variant="outline" className="h-11 px-4 text-sm rounded-xl border-white/10 text-slate-400 hover:text-white">
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
      <section id="contact" className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-amber-600/20 to-slate-900 border border-amber-500/20 rounded-[3rem] p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
            まずはお気軽に<br /><span className="text-amber-400">ご相談ください</span>
          </h2>
          <p className="text-slate-400 font-bold">神奈川県海老名市 / ZOOM全国対応 / 無料相談・お見積もり</p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/pricing">
              <Button className="h-14 px-10 font-bold text-lg rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                <Mail className="mr-2 h-5 w-5" />
                料金プランを見る
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
