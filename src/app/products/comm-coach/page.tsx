import Link from 'next/link'
import { ArrowLeft, MessageCircleHeart, Brain, BarChart3, Calendar, BookOpen, HeartHandshake, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'AIコミュニケーション改善コーチ | NextraLabs',
  description: '心理学ベースの対人コミュニケーションスキルアップツール。メッセージ添削・自己分析・会話プランナーで人間関係を改善。',
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-8 md:p-12 text-white mb-12">
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
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{s.value}</div>
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center mx-auto mb-3">
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
    </div>
  )
}
