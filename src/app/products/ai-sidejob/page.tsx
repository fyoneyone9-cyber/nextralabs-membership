import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Rocket, CheckCircle2, Star, Zap, BarChart3, FileText, Wrench, BookOpen } from 'lucide-react'


export const metadata = {
  title: 'AI副業スタートダッシュ | NextraLabs',
  description: '13カテゴリのAI副業を適性診断→ロードマップ→収益シミュレーション→テンプレート→AIツール辞典→活動ログまで完全サポート',
}

export default function AiSidejobPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
            <Rocket className="w-3 h-3 mr-1" /> ビジネス・副業シリーズ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            AI副業スタートダッシュ
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            13カテゴリ × 適性診断 × ロードマップ × 収益シミュレーター
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            「何から始めればいい？」から「月10万円達成」まで完全サポート
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/pricing">
              <Button>プランを見る →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-500">13</div>
            <div className="text-xs text-muted-foreground">副業カテゴリ</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">50+</div>
            <div className="text-xs text-muted-foreground">AIツール収録</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">10問</div>
            <div className="text-xs text-muted-foreground">適性診断</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-500">5種</div>
            <div className="text-xs text-muted-foreground">テンプレート</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">6つの機能</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, title: '🧭 適性診断', desc: '10問の質問→あなたに合うAI副業TOP3を提案。初心者9選＋経験者4選', color: 'text-orange-500' },
            { icon: <BarChart3 className="w-5 h-5" />, title: '📋 ロードマップ', desc: 'カテゴリ別「0→収益化」6ステップ。目安収入・初期費用・難易度つき', color: 'text-green-500' },
            { icon: <Star className="w-5 h-5" />, title: '💰 収益シミュレーター', desc: '案件数×単価×時間→月収/年収/時給を瞬時計算。相場データ内蔵', color: 'text-yellow-500' },
            { icon: <FileText className="w-5 h-5" />, title: '✍️ テンプレート集', desc: '応募文/ポートフォリオ/料金表/請求書/営業DMのひな形をコピペ', color: 'text-blue-500' },
            { icon: <Wrench className="w-5 h-5" />, title: '🛠️ AIツール辞典', desc: '50以上のAIツールをカテゴリ別に整理。無料/有料表示+リンク付き', color: 'text-purple-500' },
            { icon: <BookOpen className="w-5 h-5" />, title: '📊 活動ログ', desc: '案件記録/売上管理/経費/時給換算。確定申告にも役立つ', color: 'text-red-500' },
          ].map((f, i) => (
            <div key={i} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className={`${f.color} mb-2`}>{f.icon}</div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">13カテゴリ完全収録</h2>
          <p className="text-center text-sm text-muted-foreground mb-8">初心者向け9選＋経験者向け4選</p>

          <h3 className="text-sm font-bold text-green-600 dark:text-green-400 mb-3">🟢 初心者向け（9カテゴリ）</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {[
              '🖼️ 画像制作・バナー',
              '✍️ ライティング・記事',
              '📱 SNS運用',
              '🌐 Web制作',
              '📝 note・電子書籍',
              '🎬 動画制作・編集',
              '💬 LINEスタンプ販売',
              '🎧 耳学（音声）',
              '📊 資料作成',
            ].map(c => (
              <div key={c} className="bg-card border rounded-lg px-3 py-2 text-sm">{c}</div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-3">🟣 経験者向け（4カテゴリ）</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              '📚 オンライン教材販売',
              '🤖 AIプロンプト販売',
              '💬 AIチャットボット構築',
              '🎓 AI活用コンサル',
            ].map(c => (
              <div key={c} className="bg-card border rounded-lg px-3 py-2 text-sm">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Target */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">こんな人におすすめ</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { emoji: '🔰', title: '副業初心者', items: ['何から始めればいいかわからない', 'リスクの低い副業を知りたい', 'AIツールを活用したい'] },
            { emoji: '📈', title: '収入アップしたい人', items: ['本業＋月3〜10万円稼ぎたい', '在宅ワークで時間を有効活用', 'スキルを身につけながら稼ぎたい'] },
            { emoji: '🚀', title: '独立を目指す人', items: ['フリーランスへの第一歩', '複数の収入源を作りたい', '将来的に法人化も視野に'] },
          ].map((g, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <div className="text-3xl mb-3 text-center">{g.emoji}</div>
              <h3 className="font-bold text-center mb-3">{g.title}</h3>
              <ul className="space-y-1">
                {g.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{item}
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
          <div className="inline-block bg-card border rounded-2xl p-8">
            <Badge className="mb-4">プレミアムプラン限定</Badge>
            <div className="text-3xl font-bold mb-2">¥980<span className="text-base font-normal text-muted-foreground">/月</span></div>
            <p className="text-sm text-muted-foreground mb-6">プレミアムプラン限定ツール</p>
            <Link href="/pricing">
              <Button className="w-full">プランを見る →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: '本当に初心者でも大丈夫？', a: '大丈夫です。適性診断で自分に合ったカテゴリを見つけ、ロードマップの6ステップに沿って進めるだけ。PCの基本操作ができれば始められます。' },
            { q: 'AIを使った副業は怪しくないですか？', a: '本ツールで紹介するのはすべて合法的なスキルベースの仕事です。AIは作業効率化のツールであり、詐欺的な「楽して稼げる」系ではありません。' },
            { q: '個人情報は安全？', a: 'すべてのデータはブラウザ内（localStorage）に保存されます。サーバーへのデータ送信は一切ありません。' },
            { q: '確定申告が必要？', a: '副業所得が年間20万円を超える場合は確定申告が必要です。活動ログ機能で売上・経費を記録しておくと確定申告がスムーズです。' },
            { q: '途中で副業カテゴリを変えられる？', a: 'もちろんです。13カテゴリすべてのロードマップ・ツール情報を自由に閲覧できます。複数カテゴリの掛け持ちもOKです。' },
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
