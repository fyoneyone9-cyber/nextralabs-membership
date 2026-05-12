import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageCircleHeart, Brain, BarChart3, Calendar, BookOpen, HeartHandshake, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'

export const metadata: Metadata = {
  title: 'AIコミュニケーションコーチ | 職場・恋愛・家族の人間関係をAIが改善',
  description: '苦手な人との会話・上司への報告・恋愛トーク・家族関係まで。AIがシチュエーション別の最適な言葉を提案。コミュ力を劇的に上げる。NextraLabsプラン。',
  keywords: ["AIコミュニケーション","人間関係AI","会話術AI","コミュ力向上","職場関係改善AI"],
  alternates: {
    canonical: 'https://nextralab.jp/products/comm-coach',
  },
  openGraph: {
    title: 'AIコミュニケーションコーチ | 職場・恋愛・家族の人間関係をAIが改善 | NextraLabs',
    description: '苦手な人との会話・上司への報告・恋愛トーク・家族関係まで。AIがシチュエーション別の最適な言葉を提案。コミュ力を劇的に上げる。NextraLabsプラン。',
    url: 'https://nextralab.jp/products/comm-coach',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AIコミュニケーションコーチ | 職場・恋愛・家族の人間関係をAIが改善' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIコミュニケーションコーチ | 職場・恋愛・家族の人間関係をAIが改善',
    description: '苦手な人との会話・上司への報告・恋愛トーク・家族関係まで。AIがシチュエーション別の最適な言葉を提案。コミュ力を劇的に上げる。NextraLabsプラン。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

export default function CommCoachPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        ツール一覧に戻る
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-emerald-600 p-8 md:p-12 text-white mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIi8+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <div className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 inline-block mb-4">
            💬 対人スキルアップAI
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            AIコミュニケーション<br />改善コーチ
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            心理学理論ベースで、あなたのメッセージ・会話スキルを分析＆改善。
            恋愛・ビジネス・友人関係、あらゆる対人コミュニケーションに。
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">メッセージ添削AI</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">心理学ミニ講座</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">コミュスタイル診断</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">会話プランナー</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: '72%', label: '人間関係に悩む社会人' },
          { value: '10+', label: '心理学テーマ収録' },
          { value: '4タイプ', label: 'コミュスタイル分類' },
          { value: '50+', label: '場面別テンプレート' },
        ].map((s, i) => (
          <div key={i} className="bg-muted/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-emerald-500 bg-clip-text text-transparent">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 className="text-2xl font-bold mb-6">搭載機能</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {[
          {
            icon: <MessageCircleHeart className="h-6 w-6" />,
            title: '💬 メッセージ添削AI',
            desc: '下書きを入力するだけ。「重い」「素っ気ない」などトーンを5段階診断し、改善案を3パターン提案。',
          },
          {
            icon: <Brain className="h-6 w-6" />,
            title: '🧠 心理学ミニ講座',
            desc: 'アタッチメント理論・非暴力コミュニケーション・傾聴スキルなど、実践的な10テーマを収録。',
          },
          {
            icon: <BarChart3 className="h-6 w-6" />,
            title: '📊 コミュスタイル診断',
            desc: '15問の診断で4タイプに分類。あなたの強み・弱み・相性の良いタイプがわかる。',
          },
          {
            icon: <Calendar className="h-6 w-6" />,
            title: '🗓️ 会話プランナー',
            desc: 'デート・面接・飲み会・初対面。場面ごとに話題リストと会話フローを自動生成。',
          },
          {
            icon: <BookOpen className="h-6 w-6" />,
            title: '📖 NG集＆OK集',
            desc: 'LINE・対面・ビジネスメール。よくある失敗パターンと改善例をシーン別に50以上収録。',
          },
          {
            icon: <HeartHandshake className="h-6 w-6" />,
            title: '🏥 相談窓口ガイド',
            desc: '恋愛依存・DV相談・カウンセリング。専門機関への相談先をまとめて掲載。',
          },
        ].map((f, i) => (
          <Link key={i} href="/products/comm-coach/app" className="border rounded-2xl p-5 hover:border-pink-300 hover:bg-pink-500/5 transition-all group block">
            <div className="flex items-start justify-between">
              <div className="text-pink-500 mb-2">{f.icon}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Important notice */}
      <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-pink-600 mb-2">💡 このツールの考え方</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>✅ <strong>自分のスキルを上げる</strong>ためのツールです</li>
          <li>❌ 相手の行動を分析・監視する機能はありません</li>
          <li>❌ 「返信率◯%」のような非科学的な断定はしません</li>
          <li>✅ 心理学の知見に基づいた、健全なコミュニケーション改善を支援します</li>
        </ul>
      </div>

      {/* How to use */}
      <h2 className="text-2xl font-bold mb-6">使い方</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { step: '1', title: 'シーンを選ぶ', desc: '恋愛・ビジネス・友人関係など、改善したい場面を選択' },
          { step: '2', title: '診断＆学習', desc: 'コミュスタイル診断で自分を知り、心理学講座で知識をインプット' },
          { step: '3', title: '実践＆添削', desc: 'メッセージを添削AIに入力し、会話プランナーで本番に備える' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-emerald-500 text-white font-bold flex items-center justify-center mx-auto mb-3">
              {s.step}
            </div>
            <h3 className="font-bold mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Target */}
      <h2 className="text-2xl font-bold mb-4">こんな方におすすめ</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { emoji: '💑', title: 'パートナーとの関係改善', desc: '何気ない一言で相手を傷つけてしまう、気持ちがうまく伝えられない方に' },
          { emoji: '💼', title: 'ビジネスコミュニケーション', desc: '上司・同僚・クライアントとの関係構築を改善したい方に' },
          { emoji: '🤝', title: '対人関係の悩み全般', desc: '友人関係・初対面・SNSでのやり取りに自信がない方に' },
        ].map((t, i) => (
          <div key={i} className="border rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">{t.emoji}</div>
            <h3 className="font-bold mb-1">{t.title}</h3>
            <p className="text-xs text-muted-foreground">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold mb-3">技術仕様</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {['ブラウザ完結', 'データ外部送信なし', 'localStorage保存', 'スマホ対応', '心理学理論ベース', 'リアルタイム分析', 'コピー機能付き', 'ダークモード'].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="text-pink-500">✓</span> {t}
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-2 rounded-3xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">AIコミュニケーション改善コーチ</h2>
        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-3xl font-bold">¥980</span>
          <span className="text-base font-normal text-muted-foreground">/月</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">スタンダードプラン対応 — 全ツール使い放題</p>
        <Link href="/pricing">
          <Button className="w-full max-w-xs">プランを見る →</Button>
        </Link>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
      <div className="space-y-4 mb-12">
        {[
          { q: '相手のLINEやSNSを分析できますか？', a: 'いいえ。このツールは「自分の文章」を添削するもので、相手の行動を分析する機能はありません。健全なコミュニケーションスキルの向上を目的としています。' },
          { q: '心理学の知識がなくても使えますか？', a: 'はい。心理学ミニ講座は専門知識がない方でも理解できるよう、具体例を交えてわかりやすく解説しています。' },
          { q: '恋愛以外にも使えますか？', a: 'もちろんです。ビジネスメール、面接対策、友人関係、SNSでのやり取りなど、あらゆる対人コミュニケーションに活用できます。' },
          { q: '入力した内容はどこかに保存されますか？', a: 'すべてブラウザ内（localStorage）に保存されます。サーバーへの送信は一切行いません。' },
          { q: '返金はできますか？', a: '現在テスト運用中のため、ご不満がある場合はお問い合わせフォームよりご連絡ください。' },
        ].map((faq, i) => (
          <div key={i} className="border rounded-xl p-5">
            <h3 className="font-bold mb-2">Q. {faq.q}</h3>
            <p className="text-sm text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>

      <AffiliateBanner toolId="comm-coach" />

      {/* ── 口コミ ── */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ユーザーの<span className="text-emerald-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">実際に使ったユーザーの感想</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: '石原 一成', role: '管理職・40代', location: '東京都', text: '部下のモチベーションを上げる言葉がけが苦手でした。具体的なシーンを入力したら効果的な声掛けの例文を出してくれます。1on1の質が上がって部署の離職率が下がりました。管理職になりたての方にも勧めたいです。', tag: 'マネジメント改善' },
              { name: '東山 麻里', role: '転職活動中・30代', location: '大阪府', text: '面接で緊張してうまく話せなかったです。想定質問と回答例をロールプレイ形式で練習できました。本番でも自然に話せて第一志望に内定をもらいました。コミュ力を鍛えるツールとして最高です。', tag: '面接対策' },
              { name: '西川 竜也', role: '営業職・20代', location: '神奈川県', text: 'お客様への提案トークが単調でクロージングが弱かったです。相手のタイプ別の話し方を教えてくれるので、成約率が上がりました。先輩に相談しにくいことを気軽に聞けるのもいいです。', tag: '営業トーク改善' },
              { name: '白石 奈津子', role: '主婦・40代', location: '愛知県', text: '夫との会話がすれ違いばかりで疲れていました。相手の言い方の意図を分析してくれて、どう返せばいいかを教えてくれます。喧嘩が減ってお互い話しやすくなりました。家庭の雰囲気が変わりました。', tag: '夫婦間コミュニケーション' },
              { name: '桑田 光男', role: '中小企業経営者', location: '福岡県', text: '社員に意図が伝わらず、指示が空回りすることが多かったです。伝わる指示の出し方と確認の取り方を具体的に教えてもらいました。会議の生産性が上がり、残業が月20時間減りました。', tag: '経営者のリーダーシップ' },
              { name: '坂田 莉奈', role: '看護師・20代', location: '埼玉県', text: '患者さんや家族への説明が難しくて悩んでいました。専門用語を分かりやすく言い換える練習ができます。患者さんから説明が丁寧で安心できると言ってもらえる機会が増えました。', tag: '医療コミュニケーション' },
            ].map((r, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 space-y-4 flex flex-col transition-all">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{r.text}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{r.name}</p>
                    <p className="text-slate-500 text-xs whitespace-nowrap">{r.role} · {r.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">{r.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
