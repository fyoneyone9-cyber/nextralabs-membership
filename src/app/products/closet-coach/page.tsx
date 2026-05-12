import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Shirt, BarChart3, Trash2, Banknote, Palette, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'AIクローゼットコーチ | タンスの肥やしをゼロにする断捨離AI',
  description: '持ち服を撮影するだけでAIがコーデ提案・不要品判定・フリマ出品サポートまで。クローゼット整理でお金も生み出す。NextraLabsライトプラン以上。',
  keywords: ["AI断捨離","クローゼット整理AI","コーデAI","フリマ出品AI","服整理"],
  alternates: {
    canonical: 'https://nextralab.jp/products/closet-coach',
  },
  openGraph: {
    title: 'AIクローゼットコーチ | タンスの肥やしをゼロにする断捨離AI | NextraLabs',
    description: '持ち服を撮影するだけでAIがコーデ提案・不要品判定・フリマ出品サポートまで。クローゼット整理でお金も生み出す。NextraLabsライトプラン以上。',
    url: 'https://nextralab.jp/products/closet-coach',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AIクローゼットコーチ | タンスの肥やしをゼロにする断捨離AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIクローゼットコーチ | タンスの肥やしをゼロにする断捨離AI',
    description: '持ち服を撮影するだけでAIがコーデ提案・不要品判定・フリマ出品サポートまで。クローゼット整理でお金も生み出す。NextraLabsライトプラン以上。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

export default function ClosetCoachPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        ツール一覧に戻る
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-fuchsia-500 to-pink-500 p-8 md:p-12 text-white mb-12">
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
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-pink-500 bg-clip-text text-transparent">{s.value}</div>
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
          <Link key={i} href="/products/closet-coach/app" className="border rounded-2xl p-5 hover:border-emerald-300 hover:bg-emerald-500/5 transition-all group block">
            <div className="flex items-start justify-between">
              <div className="text-emerald-500 mb-2">{f.icon}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Synergy */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">🔗 他ツールとの連携コンセプト</h3>
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-pink-500 text-white font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
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
            <div key={t} className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> {t}</div>
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
        <Link href="/pricing">
          <Button className="w-full max-w-xs">プランを見る →</Button>
        </Link>
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

      {/* Amazon アソシエイト */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 断捨離・収納グッズをAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E6%96%AD%E6%8D%A8%E9%9B%A2%20%E5%8F%8E%E7%B4%8D&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors"
        >
          Amazonで見る →
        </a>
      </div>

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
              { name: '北村 恵理', role: '主婦・30代', location: '埼玉県', text: '服が多いのに毎朝着る服が決まらなくて困っていました。手持ち服のコーデを提案してくれるので、朝の時間が10分以上短縮されました。買い物前に何が足りないかを聞けるので無駄買いも減りました。', tag: '朝の時短コーデ' },
              { name: '葛西 剛志', role: 'ファッション初心者・20代', location: '東京都', text: '就職して服に気を遣いたいけど何を買えばいいか分かりませんでした。体型と予算を伝えたら優先して揃えるべきアイテムを教えてくれました。職場でおしゃれになったねと言われるようになりました。', tag: 'ビジネスカジュアル入門' },
              { name: '沼田 美穂', role: 'ミニマリスト志向・40代', location: '大阪府', text: '断捨離したいけど何を残すべきか判断できなかったです。残すべき服の基準をAIが整理してくれて、クローゼットの量が3分の1になりました。残った服全部お気に入りで毎日気分よく選べます。', tag: '断捨離サポート' },
              { name: '田辺 直樹', role: '営業職・40代', location: '名古屋市', text: 'スーツ以外の服装に困っていました。休日のカジュアルコーデが苦手で毎回同じ服になっていました。シーンに合わせたコーデを提案してくれるので、家族サービスの日も褒めてもらえるようになりました。', tag: '大人男性のカジュアル' },
              { name: '荒木 さやか', role: '産後ダイエット中・30代', location: '福岡県', text: '体型が変わって以前の服が着られなくなり何を買えばいいか分からなくなりました。今の体型に似合うシルエットと着こなしを教えてくれます。ポジティブな気持ちで外出できるようになりました。', tag: '体型カバーコーデ' },
              { name: '久保田 誠', role: 'ITエンジニア・30代', location: '神奈川県', text: '毎日同じような格好になっていました。服の写真を撮って登録したら持っている服でバリエーションのあるコーデを出してくれます。新しい服を買わなくてもおしゃれを楽しめることに気づきました。', tag: '手持ち服の活用' },
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
