import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'AIレポートジェネレーター',
  description: '箇条書きのメモからプロフェッショナルなビジネスレポートを自動生成。週次・月次・プロジェクト報告に対応。無料。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/ai-report-generator' },
  openGraph: { title: 'AIレポートジェネレーター | NextraLabs', description: '箇条書きのメモからプロフェッショナルなビジネスレポートを自動生成。週次・月次・プロジェクト報告に対応。', url: 'https://membership-site-nextralabos.vercel.app/products/ai-report-generator', type: 'website' },
}

import {
  ArrowLeft,
  Code2,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  FileText,
  ClipboardList,
  Download,
  Copy,
  BarChart3,
  Zap,
  Layers,
  BookOpen,
  Briefcase,
  Users,
  GraduationCap,
} from 'lucide-react'

const features = [
  {
    icon: ClipboardList,
    title: '箇条書き→レポート変換',
    description:
      '箇条書きのメモやキーワードを入力するだけで、プロフェッショナルなビジネスレポートを自動生成。構成・文体も自動で最適化。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Layers,
    title: '4つのテンプレート',
    description:
      '週次報告・月次報告・プロジェクト報告・調査レポートの4種類から選択。目的に合わせた構成で自動生成。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BookOpen,
    title: '自動セクション構成',
    description:
      '背景・現状分析・提案・まとめなど、レポートに必要なセクションを自動構成。論理的な流れのドキュメントを生成。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BarChart3,
    title: 'Markdownプレビュー',
    description:
      '生成されたレポートをリアルタイムでMarkdownプレビュー。見出し・箇条書き・太字が整形された状態で確認可能。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Copy,
    title: 'コピー＆ダウンロード',
    description:
      'ワンクリックでクリップボードにコピー、またはテキストファイルとしてダウンロード。そのままSlackやメールに貼り付けOK。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: '完全クライアント処理',
    description:
      'すべての生成処理はブラウザ内で完了。入力内容がサーバーに送信されることはなく、機密情報も安心。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: '生成ロジック', value: 'テンプレートベース × 構造化展開' },
  { category: 'プレビュー', value: 'Markdown → HTML リアルタイム変換' },
  { category: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { category: 'セキュリティ', value: 'サーバー送信なし・完全クライアント側処理' },
]

const setupSteps = [
  { step: '1', title: 'テンプレートを選択', desc: '週次 / 月次 / プロジェクト / 調査から選択', time: '3秒' },
  { step: '2', title: 'タイトル＆箇条書き入力', desc: 'レポートのタイトルと要点を箇条書きで入力', time: '1分' },
  { step: '3', title: '生成＆コピー', desc: 'レポートを生成してコピーまたはダウンロード', time: '即時' },
]

const targets = [
  {
    icon: Briefcase,
    title: '営業・マーケ担当者',
    description: '週次・月次の報告書作成を効率化。データやメモから整ったレポートを自動生成。',
  },
  {
    icon: Users,
    title: 'プロジェクトマネージャー',
    description: 'プロジェクト進捗レポートを素早く作成。ステークホルダーへの報告がスムーズに。',
  },
  {
    icon: GraduationCap,
    title: '学生・研究者',
    description: '調査レポートや研究報告の下書きを自動生成。構成で悩む時間を大幅カット。',
  },
]

const faqs = [
  { q: 'どんなレポートが生成できますか？', a: '週次報告、月次報告、プロジェクト報告、調査レポートの4種類に対応しています。各テンプレートに合わせた構成（背景・現状分析・提案・まとめなど）で自動生成されます。' },
  { q: '入力した内容は外部に送信されますか？', a: 'いいえ。すべてブラウザ内で処理されるため、入力内容がサーバーや外部サービスに送信されることは一切ありません。機密情報を含むレポートも安心して作成できます。' },
  { q: '生成されたレポートの編集はできますか？', a: 'テキストエリアで直接編集可能です。生成結果をベースに、お好みの内容に微調整してからコピーやダウンロードができます。' },
  { q: 'どのファイル形式でダウンロードできますか？', a: 'テキストファイル（.txt）としてダウンロードできます。Markdownフォーマットなので、NotionやSlack、GitHubなどにそのまま貼り付けても綺麗に表示されます。' },
]

export default function AiReportGeneratorPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />ツール一覧に戻る
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">📄 無料ツール</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AIレポートジェネレーター</h1>
              <p className="text-xl text-muted-foreground mb-2">箇条書き → ビジネスレポート自動生成</p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                箇条書きのメモを入力するだけで、<span className="text-foreground font-medium">プロフェッショナルなビジネスレポートを自動生成。</span>
                <br />週次報告・月次報告・プロジェクト報告・調査レポートに対応。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">📋 4テンプレート</Badge>
                <Badge variant="outline" className="text-sm py-1">📝 Markdownプレビュー</Badge>
                <Badge variant="outline" className="text-sm py-1">📥 ダウンロード対応</Badge>
                <Badge variant="outline" className="text-sm py-1">🔒 完全ローカル処理</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/products/ai-report-generator/app">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8">🆓 無料で使う</Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />登録不要</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">AIレポートジェネレーター</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <div className="text-xs text-green-400 mb-1">📝 入力（箇条書き）</div>
                      <p className="text-sm text-muted-foreground">・売上前月比115%達成</p>
                      <p className="text-sm text-muted-foreground">・新規顧客30件獲得</p>
                      <p className="text-sm text-muted-foreground">・来月はセミナー開催予定</p>
                    </div>
                    <div className="flex justify-center"><ChevronRight className="h-5 w-5 text-green-500 rotate-90" /></div>
                    <div className="bg-emerald-500/10 rounded-lg p-3">
                      <div className="text-xs text-emerald-400 mb-1">📄 生成レポート</div>
                      <p className="text-xs font-bold text-foreground">## 現状分析</p>
                      <p className="text-xs text-muted-foreground">当月の売上は前月比115%を達成し、目標を上回る結果となりました...</p>
                      <p className="text-xs font-bold text-foreground mt-2">## 提案</p>
                      <p className="text-xs text-muted-foreground">来月のセミナー開催を通じて、さらなる顧客基盤の拡大を...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">6つの機能でレポート作成を効率化</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">箇条書きを入力するだけで、構成の整ったビジネスレポートを自動生成。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.bg} mb-4`}><f.icon className={`h-6 w-6 ${f.color}`} /></div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">3ステップでレポート完成</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-green-500">{s.step}</span></div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                <Badge variant="outline" className="mt-3">{s.time}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">こんな方におすすめ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targets.map((t, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"><t.icon className="h-8 w-8 text-green-500" /></div>
                  <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4"><Code2 className="inline h-8 w-8 mr-2" />技術スタック</h2>
          <div className="max-w-2xl mx-auto">
            <Card><CardContent className="pt-6"><div className="space-y-3">{techStack.map((t, i) => (<div key={i} className="flex items-center justify-between py-2 border-b last:border-0"><span className="text-sm font-medium">{t.category}</span><span className="text-sm text-muted-foreground">{t.value}</span></div>))}</div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">料金</h2>
          <div className="max-w-md mx-auto">
            <Card className="border-green-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">無料ツール</Badge>
                <div className="text-5xl font-bold mb-2">¥0</div>
                <p className="text-muted-foreground mb-6">登録不要で今すぐ使えます</p>
                <Link href="/products/ai-report-generator/app">
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">🆓 無料で使う</Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-4">他の有料ツールも使うなら → スタンダードプラン（¥980/月）</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4"><HelpCircle className="inline h-8 w-8 mr-2" />よくある質問</h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>

      {/* Amazon アソシエイト */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 ビジネス・レポート本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E3%83%93%E3%82%B8%E3%83%8D%E3%82%B9%20%E3%83%AC%E3%83%9D%E3%83%BC%E3%83%88&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors"
        >
          Amazonで見る →
        </a>
      </div>
    </div>
  )
}
