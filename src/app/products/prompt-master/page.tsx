import Link from 'next/link'
import { ArrowLeft, ArrowRight, Wand2, BookOpen, SlidersHorizontal, Sparkles, ClipboardList, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'AI画像プロンプトマスター | NextraLabs',
  description: '26カテゴリ対応。日本語入力→画像生成AI用の最適プロンプトを自動生成。Midjourney/DALL-E/Stable Diffusion対応。',
}

export default function PromptMasterPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        ツール一覧に戻る
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 p-8 md:p-12 text-white mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIi8+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <div className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 inline-block mb-4">
            🎨 クリエイティブシリーズ
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
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 26 Categories */}
      <h2 className="text-2xl font-bold mb-4">対応カテゴリ</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-muted/30 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-purple-500 mb-3">💼 ビジネス向け（13カテゴリ）</h3>
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
          <h3 className="font-bold text-sm text-fuchsia-500 mb-3">🎨 クリエイティブ向け（13カテゴリ）</h3>
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
          { icon: <Wand2 className="h-6 w-6" />, title: '🎨 プロンプト生成', desc: '26カテゴリから選択→日本語で内容入力→最適な英語プロンプトを自動生成。スタイル・画角・照明・品質のパラメータも調整可能。' },
          { icon: <BookOpen className="h-6 w-6" />, title: '📚 カテゴリ別テンプレート', desc: 'ビジネス系13種＋クリエイティブ系13種、合計200以上のプリセットテンプレート。用途に合わせてワンクリック適用。' },
          { icon: <SlidersHorizontal className="h-6 w-6" />, title: '🔧 パラメータ辞典', desc: 'スタイル（写真/イラスト/水彩/3D等）、カメラアングル、照明、アスペクト比の組み合わせリファレンス。50+のプリセット。' },
          { icon: <Sparkles className="h-6 w-6" />, title: '✨ プロンプト改善AI', desc: '既存のプロンプトを貼り付けるだけで、より高品質な画像が生成できるよう自動修正・強化。弱点を診断してアドバイス。' },
          { icon: <ClipboardList className="h-6 w-6" />, title: '📋 履歴＆お気に入り', desc: '生成したプロンプトの保存・コピー・再利用。お気に入り登録で頻繁に使うプロンプトにすぐアクセス。' },
          { icon: <GraduationCap className="h-6 w-6" />, title: '📖 学習ガイド', desc: 'プロンプトの基本構造、効果的な修飾語、NG表現、モデル別Tips。初心者でもプロ品質のプロンプトが書けるように。' },
        ].map((f, i) => (
          <Link key={i} href="/products/prompt-master/app" className="border rounded-2xl p-5 hover:border-purple-300 hover:bg-purple-500/5 transition-all group block">
            <div className="flex items-start justify-between">
              <div className="text-purple-500 mb-2">{f.icon}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Supported Models */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-3">🤖 対応モデル</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Flux', 'Adobe Firefly', 'Leonardo AI', 'Bing Image Creator', 'その他汎用'].map(m => (
            <div key={m} className="flex items-center gap-1.5"><span className="text-purple-500">✓</span> {m}</div>
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
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
            <div key={t} className="flex items-center gap-1.5"><span className="text-purple-500">✓</span> {t}</div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-2 border-violet-500/30 rounded-3xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">AI画像プロンプトマスター</h2>
        <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">プレミアムプラン限定</Badge>
        <div className="text-3xl font-bold mb-2">¥1,980<span className="text-base font-normal text-muted-foreground">/月</span></div>
        <p className="text-muted-foreground mb-6">Gmail AI Accelerator を含む上位プラン</p>
        <Button className="w-full max-w-xs mx-auto bg-violet-500 hover:bg-violet-600 text-white" asChild>
          <a href="/pricing">プレミアムプランを見る →</a>
        </Button>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
      <div className="space-y-4 mb-12">
        {[
          { q: '画像生成AIの知識がなくても使えますか？', a: 'はい。日本語でイメージを入力するだけで、最適なプロンプトが生成されます。学習ガイドタブで基本から学べます。' },
          { q: 'どの画像生成AIに対応していますか？', a: 'Midjourney、DALL-E 3、Stable Diffusion、Flux、Adobe Firefly、Leonardo AIなど主要なモデルすべてに対応しています。' },
          { q: 'プロンプトは英語で出力されますか？', a: 'はい。画像生成AIは英語プロンプトが最も高品質な結果を返すため、日本語入力→英語プロンプト変換が基本です。日本語のままのオプションもあります。' },
          { q: '生成されたプロンプトの著作権は？', a: 'プロンプト自体は自由にご利用いただけます。生成された画像の権利は各AIサービスの利用規約に従います。' },
          { q: 'オフラインでも使えますか？', a: 'テンプレートとパラメータ辞典はオフラインでも閲覧可能です。プロンプト生成のコア機能もブラウザ内で動作します。' },
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

        ))}
      </div>
    </div>
  )
}
