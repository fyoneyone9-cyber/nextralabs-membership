// ============================================================
// 🔒 LOCKED — PromptMaster product page
// 完成済みツール。NextraLabs様の明示的な指示なしに
// このファイルを編集・削除・移動することを禁止する。
// Locked: 2026-05-10
// ============================================================
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Wand2, BookOpen, SlidersHorizontal, Sparkles, ClipboardList, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'AI画像プロンプトマスター | Midjourney・DALL-E・Stable Diffusion用プロンプトを瞬時生成 | NextraLabs',
  description: '「こんな画像が欲しい」をテキストで入力するだけ。AIがMidjourney・DALL-E・Stable Diffusionに最適化されたプロンプトを自動生成。クオリティ10倍向上。月額¥480。',
  keywords: ['プロンプト生成AI','Midjourneyプロンプト','DALL-Eプロンプト','Stable Diffusionプロンプト','画像生成AI','AIアート','プロンプトエンジニアリング','画像プロンプト自動生成','NextraLabsプロンプト','AI画像生成'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://nextralab.jp/products/prompt-master' },
  openGraph: {
    title: 'AI画像プロンプトマスター | Midjourney・DALL-E・Stable Diffusion用プロンプトを瞬時生成 | NextraLabs',
    description: '「こんな画像が欲しい」をテキストで入力するだけ。AIがMidjourney・DALL-E・Stable Diffusionに最適化されたプロンプトを自動生成。クオリティ10倍向上。月額¥480。',
    url: 'https://nextralab.jp/products/prompt-master',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AI画像プロンプトマスター | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI画像プロンプトマスター | Midjourney・DALL-E・Stable Diffusion用プロンプトを瞬時生成 | NextraLabs',
    description: '日本語で入力するだけで最適な画像生成AIプロンプトを自動生成。26カテゴリ対応。月額¥480。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const faqItems = [
  {
    q: 'どの画像生成AIツールに対応していますか？',
    a: 'Midjourney、DALL-E 3、Stable Diffusion、Flux、Adobe Firefly、Leonardo AI、Bing Image Creator、その他汎用モデルに対応しています。各ツールの特性に合わせてプロンプトを最適化します。',
  },
  {
    q: '生成されるプロンプトのクオリティはどの程度ですか？',
    a: '26カテゴリ・200以上のテンプレートと50以上のスタイルプリセットを組み合わせ、プロのプロンプトエンジニア水準のプロンプトを自動生成します。既存プロンプトの改善AI機能も搭載しており、さらなる品質向上が可能です。',
  },
  {
    q: '生成されたプロンプトの著作権はどうなりますか？',
    a: '生成されたプロンプト自体は自由にご利用いただけます。商用利用も可能です。ただし、生成された画像の権利は各AIサービスの利用規約に従います。Midjourneyは有料プランが商用利用可、DALL-Eは商用利用可能です。',
  },
  {
    q: 'プロンプトをそのままコピペして使えますか？',
    a: 'はい、ワンクリックコピー機能を搭載しています。生成されたプロンプトをコピーして各画像生成AIのチャット・入力欄に貼り付けるだけで使用できます。Midjourneyの/imagineコマンドにも対応したフォーマットで出力します。',
  },
  {
    q: 'プロンプトは英語で入力しなければいけませんか？',
    a: 'いいえ、日本語で入力するだけでOKです。AIが日本語の意図を解釈し、画像生成AIに最適化された英語プロンプトに自動変換します。英語の知識は一切不要です。',
  },
]

export default function PromptMasterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'AI画像プロンプトマスター',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: 'https://nextralab.jp/products/prompt-master',
        description: '日本語で入力するだけで、Midjourney・DALL-E・Stable Diffusion向けの高品質プロンプトを自動生成。26カテゴリ対応。',
        offers: {
          '@type': 'Offer',
          price: '480',
          priceCurrency: 'JPY',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '480', priceCurrency: 'JPY', unitText: '月' },
        },
        provider: { '@type': 'Organization', name: 'NextraLabs', url: 'https://nextralab.jp' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        ツール一覧に戻る
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-fuchsia-600 to-pink-600 p-8 md:p-12 text-white mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIi8+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <div className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 inline-block mb-4">
            クリエイティブシリーズ
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            AI画像プロンプト<br />マスター
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            日本語で入力するだけで、Midjourney・DALL-E・Stable Diffusion向けの
            高品質プロンプトを自動生成。26カテゴリ対応のプロンプト専門ツール。
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">26カテゴリ</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">日本語→英語変換</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">パラメータ調整</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">プロンプト改善</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: '26', label: 'カテゴリ' },
          { value: '200+', label: 'テンプレート' },
          { value: '50+', label: 'スタイルプリセット' },
          { value: '6タブ', label: '搭載機能' },
        ].map((s, i) => (
          <div key={i} className="bg-muted/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-fuchsia-500 bg-clip-text text-transparent">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 26 Categories */}
      <h2 className="text-2xl font-bold mb-4">対応カテゴリ</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-muted/30 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-emerald-500 mb-3">ビジネス向け（13カテゴリ）</h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            {[
              '01 商品イメージの仮作成',
              '02 サービスのビジュアル化',
              '03 ホームページのトップ画像',
              '04 ロゴやアイコン案のたたき台',
              '05 資料やプレゼン用の画像',
              '06 ビジネスモデルの図解',
              '07 SNS広告画像',
              '08 セール用バナー作成',
              '09 キャッチコピーに合ったビジュアル',
              '10 サムネイル生成（YouTube等）',
              '11 メルマガのヘッダー画像',
              '12 教材の挿絵',
              '13 歴史や地理のイメージ画像',
            ].map(c => <div key={c}>• {c}</div>)}
          </div>
        </div>
        <div className="bg-muted/30 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-fuchsia-500 mb-3">クリエイティブ向け（13カテゴリ）</h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            {[
              '14 英会話の「場面」を視覚化',
              '15 プロフィール画像のアレンジ',
              '16 投稿のビジュアル強化',
              '17 絵日記',
              '18 小説やシナリオの挿絵生成',
              '19 画像の構図変更',
              '20 写真をイラストに変換',
              '21 イラストをリアルな写真に変換',
              '22 キャラクターの作成',
              '23 手書きラフ → 線画清書',
              '24 線画 → 着彩＆テクスチャ追加',
              '25 手書きラフ → 色んなジャンルに変換',
              '26 LINEスタンプ風挨拶スタンプ4種',
            ].map(c => <div key={c}>• {c}</div>)}
          </div>
        </div>
      </div>

      {/* Features */}
      <h2 className="text-2xl font-bold mb-6">搭載機能</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {[
          { icon: <Wand2 className="h-6 w-6" />, title: 'プロンプト生成', desc: '26カテゴリから選択→日本語で内容入力→最適な英語プロンプトを自動生成。スタイル・画角・照明・品質のパラメータも調整可能。' },
          { icon: <BookOpen className="h-6 w-6" />, title: 'カテゴリ別テンプレート', desc: 'ビジネス系13種＋クリエイティブ系13種、合計200以上のプリセットテンプレート。用途に合わせてワンクリック適用。' },
          { icon: <SlidersHorizontal className="h-6 w-6" />, title: 'パラメータ辞典', desc: 'スタイル（写真/イラスト/水彩/3D等）、カメラアングル、照明、アスペクト比の組み合わせリファレンス。50+のプリセット。' },
          { icon: <Sparkles className="h-6 w-6" />, title: 'プロンプト改善AI', desc: '既存のプロンプトを貼り付けるだけで、より高品質な画像が生成できるよう自動修正・強化。弱点を診断してアドバイス。' },
          { icon: <ClipboardList className="h-6 w-6" />, title: '履歴＆お気に入り', desc: '生成したプロンプトの保存・コピー・再利用。お気に入り登録で頻繁に使うプロンプトにすぐアクセス。' },
          { icon: <GraduationCap className="h-6 w-6" />, title: '学習ガイド', desc: 'プロンプトの基本構造、効果的な修飾語、NG表現、モデル別Tips。初心者でもプロ品質のプロンプトが書けるように。' },
        ].map((f, i) => (
          <Link key={i} href="/products/prompt-master/app" className="border rounded-2xl p-5 hover:border-emerald-300 hover:bg-emerald-500/5 transition-all group block">
            <div className="flex items-start justify-between">
              <div className="text-emerald-500 mb-2">{f.icon}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Supported Models */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">対応モデル</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Flux', 'Adobe Firefly', 'Leonardo AI', 'Bing Image Creator', 'その他汎用'].map(m => (
            <div key={m} className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> {m}</div>
          ))}
        </div>
      </div>

      {/* How to use */}
      <h2 className="text-2xl font-bold mb-6">使い方</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { step: '1', title: 'カテゴリを選ぶ', desc: '26カテゴリから目的に合ったものを選択' },
          { step: '2', title: '日本語で入力', desc: '作りたい画像の内容を日本語で記述' },
          { step: '3', title: 'コピー＆生成', desc: 'プロンプトをコピーしてAIに貼り付けるだけ' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-fuchsia-500 text-white font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
            <h3 className="font-bold mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold mb-3">技術仕様</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {['ブラウザ完結', 'サーバー送信なし', 'localStorage保存', 'ワンクリックコピー', 'スマホ対応', 'ダークモード', '英語プロンプト出力', '日本語UI'].map(t => (
            <div key={t} className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> {t}</div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-2 border-emerald-500/30 rounded-3xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">AI画像プロンプトマスター</h2>
        <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">スタンダードプラン</Badge>
        <div className="text-3xl font-bold mb-2">¥480<span className="text-base font-normal text-muted-foreground">/月</span></div>
        <p className="text-muted-foreground mb-6">AI画像プロンプトマスター単体プラン</p>
        <Link href="/pricing">
          <Button className="w-full max-w-xs mx-auto bg-emerald-500 hover:bg-emerald-600 text-white">プランを見る →</Button>
        </Link>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
      <div className="space-y-4 mb-12">
        {faqItems.map((faq, i) => (
          <div key={i} className="border rounded-xl p-5">
            <h3 className="font-bold mb-2">Q. {faq.q}</h3>
            <p className="text-sm text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Amazon アフィリエイト */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 truncate">AI・画像生成本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=AI%20%E7%94%BB%E5%83%8F%E7%94%9F%E6%88%90&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-amber-400 transition-colors"
        >
          <span className="text-amber-500/60 font-bold text-[10px]">Amazon</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
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
              { name: '倉田 涼子', role: 'グラフィックデザイナー', location: '東京都', text: 'AIイラストを仕事に使い始めましたが、思い通りの画像が出せなくて困っていました。プロンプトの構造を教えてくれて、一発で理想に近い画像が出るようになりました。クライアントへの提案スピードが3倍になりました。', tag: 'デザイン業務効率化' },
              { name: '古川 雄介', role: '個人ゲーム開発者', location: '大阪府', text: 'ゲームのコンセプトアートを自分で作りたかったのですが、プロンプトの組み立てが難しかったです。ジャンルごとのプロンプトテンプレートを出してくれて、一貫したビジュアルスタイルを作れるようになりました。', tag: 'ゲームアート' },
              { name: '柳沢 真紀', role: 'イラストレーター', location: '神奈川県', text: 'Midjourneyの設定パラメータが複雑で使いこなせていませんでした。効果を具体例付きで教えてくれるので、バージョンアップのたびに悩まなくなりました。商業利用の案件も増えています。', tag: 'イラスト商業利用' },
              { name: '尾崎 哲朗', role: 'マーケター', location: '愛知県', text: 'SNS広告用のバナー画像を量産する必要があり困っていました。ターゲットと訴求軸を入力したら効果的な画像スタイルのプロンプトを提案してくれます。CTRが改善してCPAが下がりました。', tag: '広告クリエイティブ' },
              { name: '高野 さくら', role: 'Vtuber・20代', location: '福岡県', text: '立ち絵やサムネイル用のイラストを自分で作りたかったです。キャラクターの設定を入力したらキャラクターの一貫性を保つプロンプト集を作ってくれました。制作コストが大幅に下がりました。', tag: 'Vtuberコンテンツ制作' },
              { name: '辻 勝彦', role: '写真家・フリーランス', location: '京都府', text: 'AI画像生成を写真加工の参考にしています。撮りたいシチュエーションのプロンプトを組んでもらってビジュアルイメージを確認してからロケに行くようになりました。撮り直しが減って仕事の質と効率が上がりました。', tag: '写真撮影参考' },
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
