import Link from 'next/link'
import { ArrowLeft, ArrowRight, Shirt, BarChart3, Trash2, Banknote, Palette, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'AIクローゼット断捨離コーチ | NextraLabs',
  description: 'ワードローブ管理×コスパ分析×断捨離AI判定。持ってる服を最大限活かし、賢く手放すためのツール。',
}

export default function ClosetCoachPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        ツール一覧に戻る
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-8 md:p-12 text-white mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIi8+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <div className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 inline-block mb-4">
            👗 ワードローブ管理AI
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            AIクローゼット<br />断捨離コーチ
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            持ってる服のコスパを可視化し、断捨離すべきアイテムをAIが判定。
            売却ガイド＆コーデ提案で、クローゼットを最適化。
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">クローゼット管理</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">コスパ分析</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">断捨離AI判定</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">売却ガイド</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: '25着', label: '平均の眠ってる服' },
          { value: '¥15万', label: '年間衣服支出平均' },
          { value: '60%', label: '1年着ない服の割合' },
          { value: '6カテゴリ', label: 'アイテム分類' },
        ].map((s, i) => (
          <div key={i} className="bg-muted/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 className="text-2xl font-bold mb-6">搭載機能</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {[
          { icon: <Shirt className="h-6 w-6" />, title: '👕 クローゼット登録', desc: 'アイテム名・カテゴリ・購入価格・購入日・着用回数を登録。全データはブラウザ内に安全に保存。' },
          { icon: <BarChart3 className="h-6 w-6" />, title: '📊 コスパ分析', desc: '1日あたりのコストを自動計算。「元を取れてるか」が一目でわかる。カテゴリ別ランキングも。' },
          { icon: <Trash2 className="h-6 w-6" />, title: '🗑️ 断捨離AI判定', desc: '長期未着用・季節外れ・コスパ悪をスコアリング。手放し候補を理由付きで自動リストアップ。' },
          { icon: <Banknote className="h-6 w-6" />, title: '💰 売却ガイド', desc: 'カテゴリ×ブランドランク×状態から想定売却価格を提示。メルカリ・ラクマ・セカスト比較＆撮影Tips。' },
          { icon: <Palette className="h-6 w-6" />, title: '👗 コーデ提案', desc: '登録アイテムから色×カテゴリで着回しパターンを自動生成。「持ってるもので着回す」提案。' },
          { icon: <TrendingUp className="h-6 w-6" />, title: '📈 ワードローブ統計', desc: 'カテゴリ別保有数・総投資額・月間追加/断捨離数のダッシュボード。衣服消費の見える化。' },
        ].map((f, i) => (
          <Link key={i} href="/products/closet-coach/app" className="border rounded-2xl p-5 hover:border-violet-300 hover:bg-violet-500/5 transition-all group block">
            <div className="flex items-start justify-between">
              <div className="text-violet-500 mb-2">{f.icon}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Synergy */}
      <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-violet-600 dark:text-violet-400 mb-2">🔗 他ツールとの連携コンセプト</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>👕 <strong>古着ハンター</strong>（Tool #1）で買った服 → クローゼットに登録して管理</li>
          <li>🛍️ <strong>AI買い物依存ストッパー</strong>（Tool #4）と併用 → 衝動買い防止＋既存服の活用</li>
        </ul>
      </div>

      {/* How to use */}
      <h2 className="text-2xl font-bold mb-6">使い方</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { step: '1', title: 'アイテム登録', desc: '手持ちの服をカテゴリ別に登録。名前・価格・購入日を入力' },
          { step: '2', title: 'コスパ確認', desc: '着用回数を更新するたび、1日コストが下がっていく。元を取れてるか一目瞭然' },
          { step: '3', title: '断捨離＆売却', desc: 'AI判定で手放し候補を確認。売却ガイドを見て賢くリセール' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
            <h3 className="font-bold mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold mb-3">技術仕様</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {['ブラウザ完結', 'データ外部送信なし', 'localStorage保存', 'スマホ対応', 'CSV出力対応', 'リアルタイム計算', 'ダークモード', '無制限登録'].map(t => (
            <div key={t} className="flex items-center gap-1.5"><span className="text-violet-500">✓</span> {t}</div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-2 rounded-3xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">AIクローゼット断捨離コーチ</h2>
        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-3xl font-bold">¥980</span>
          <span className="text-base font-normal text-muted-foreground">/月</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">スタンダードプラン対応 — 全ツール使い放題</p>
        <Button className="w-full max-w-xs" asChild>
          <a href="/pricing">プランを見る →</a>
        </Button>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
      <div className="space-y-4 mb-12">
        {[
          { q: 'メルカリと連携できますか？', a: 'いいえ。このツールは手動入力で管理するシンプルなワードローブ管理ツールです。外部サービスとの自動連携機能はありませんが、売却ガイドでメルカリ等の比較情報を参考にできます。' },
          { q: '何着まで登録できますか？', a: '制限はありません。ブラウザのlocalStorageに保存されるため、数百着程度は問題なく管理できます。' },
          { q: '写真は登録できますか？', a: 'テキストベースの管理ツールのため、写真登録機能はありません。アイテム名とメモ欄で識別できます。' },
          { q: 'データのバックアップはできますか？', a: 'CSVエクスポート機能で、登録データをファイルとして保存できます。' },
          { q: '断捨離判定の基準は？', a: '購入からの経過日数、最終着用からの日数、1日あたりコスト、季節適合度を総合的にスコアリングします。' },
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
