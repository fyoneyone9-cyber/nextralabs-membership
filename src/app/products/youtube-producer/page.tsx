import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Mic, FileText, Users, Image, Type, Music, Clapperboard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'AI YouTubeプロデューサー | NextraLabs',
  description: '動画・音声・テキストを取り込んで、YouTube投稿に必要な台本・人物イラスト・サムネイル・タイトル・BGMを全自動生成',
}

export default function YoutubeProducerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
            <Clapperboard className="w-3 h-3 mr-1" /> クリエイティブシリーズ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            AI YouTubeプロデューサー
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            文字起こし → 台本 → 人物画像 → サムネイル → タイトル → BGM
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            6ステップのパイプラインでYouTube投稿素材を全自動生成
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild>
              <a href="/pricing">プランを見る →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-y bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-center mb-6">6ステップ自動パイプライン</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            {[
              { num: '①', icon: '🎙️', label: '文字起こし' },
              { num: '②', icon: '📝', label: '台本作成' },
              { num: '③', icon: '🎨', label: '人物画像' },
              { num: '④', icon: '🖼️', label: 'サムネイル' },
              { num: '⑤', icon: '✏️', label: 'タイトル' },
              { num: '⑥', icon: '🎵', label: 'BGM' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-card border rounded-xl px-4 py-3 text-center min-w-[100px]">
                  <div className="text-xs text-muted-foreground">{s.num}</div>
                  <div className="text-xl">{s.icon}</div>
                  <div className="text-xs font-medium">{s.label}</div>
                </div>
                {i < 5 && <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">6つの機能</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: <Mic className="w-5 h-5" />, title: '🎙️ ① 文字起こし', desc: '動画/音声/テキスト/URLに対応。Whisper APIで高精度文字起こし。結果は編集可能', color: 'text-red-500' },
            { icon: <FileText className="w-5 h-5" />, title: '📝 ② 台本作成', desc: '10ジャンル対応のAI台本生成。オープニング/本編/エンディングの3部構成', color: 'text-orange-500' },
            { icon: <Users className="w-5 h-5" />, title: '🎨 ③ 人物画像', desc: '文字起こしから人物を自動抽出→アニメ風イラストをAI生成。最大5人', color: 'text-yellow-500' },
            { icon: <Image className="w-5 h-5" />, title: '🖼️ ④ サムネイル', desc: 'クリック率を意識した3パターンのサムネイル案。16:9のYouTube最適サイズ', color: 'text-green-500' },
            { icon: <Type className="w-5 h-5" />, title: '✏️ ⑤ タイトル', desc: 'SEO最適化タイトル+代替4案+タグ15個+説明文。クリック率を最大化', color: 'text-blue-500' },
            { icon: <Music className="w-5 h-5" />, title: '🎵 ⑥ BGM作成', desc: '文字起こしの雰囲気をAI分析→最適なBGMプロンプトを自動生成', color: 'text-purple-500' },
          ].map((f, i) => (
            <Link key={i} href="/products/youtube-producer/app" className="bg-card border rounded-xl p-5 hover:shadow-md hover:border-red-500/30 transition-all group block">
              <div className={`${f.color} mb-2`}>{f.icon}</div>
              <h3 className="font-bold mb-1 flex items-center gap-2">{f.title}<ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" /></h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">10ジャンル対応</h2>
          <p className="text-center text-sm text-muted-foreground mb-8">チャンネルのジャンルに合わせた台本・タイトル・サムネを生成</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              '🎭 エンタメ', '📚 教育・解説', '📷 Vlog', '💻 テック・IT', '💼 ビジネス',
              '🎮 ゲーム実況', '🍳 料理', '✈️ 旅行', '📰 ニュース', '🎤 対談・インタビュー',
            ].map(g => (
              <div key={g} className="bg-card border rounded-lg px-3 py-2 text-sm text-center">{g}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Input formats */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">対応ファイル形式</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { emoji: '🎬', title: '動画ファイル', items: ['MP4', 'MOV', 'AVI', 'WebM'] },
            { emoji: '🎧', title: '音声ファイル', items: ['MP3', 'WAV', 'M4A', 'OGG'] },
            { emoji: '📄', title: 'テキスト', items: ['TXT', 'MD', 'SRT（字幕）', 'URL（Webページ）'] },
          ].map((g, i) => (
            <div key={i} className="bg-card border rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">{g.emoji}</div>
              <h3 className="font-bold mb-3">{g.title}</h3>
              <ul className="space-y-1">
                {g.items.map((item, j) => (
                  <li key={j} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">料金</h2>
          <div className="max-w-md mx-auto">
            <Card className="border-violet-500/30">
              <CardContent className="pt-8 pb-8 text-center">
                <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">プレミアムプラン限定</Badge>
                <div className="text-3xl font-bold mb-2">¥1,980<span className="text-base font-normal text-muted-foreground">/月</span></div>
                <p className="text-muted-foreground mb-6">Gmail AI Accelerator を含む上位プラン</p>
                <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white" asChild>
                  <a href="/pricing">プレミアムプランを見る →</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: 'YouTube以外にも使えますか？', a: '台本やサムネイルはInstagram Reels、TikTok、Podcastなど他のプラットフォームにも応用できます。' },
            { q: '文字起こしの精度は？', a: 'OpenAI Whisper APIを使用しており、日本語の認識精度は非常に高いです。結果は手動で編集もできます。' },
            { q: '人物画像は実在の人物に似せられますか？', a: 'テキストの描写をもとにアニメ風イラストを生成します。写真のような実在人物の再現ではなく、キャラクターイラストです。' },
            { q: 'BGMの著作権は？', a: 'AI生成BGMのプロンプトを提供します。実際の音源生成にはSuno AI等の外部サービスを使用し、各サービスの利用規約に従います。' },
            { q: '1回の処理にどのくらい時間がかかりますか？', a: '文字起こし: 1〜3分、台本/タイトル: 10〜30秒、画像生成: 20〜60秒/枚。全ステップで約5〜10分です。' },
          ].map((faq, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <h3 className="font-bold mb-2">Q. {faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
