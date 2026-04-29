import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PurchaseButton } from '@/components/PurchaseButton'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  Inbox,
  Filter,
  FileText,
  Calendar,
  BarChart3,
  CheckSquare,
  Mail,
} from 'lucide-react'

const features = [
  {
    icon: Filter,
    title: 'Gmailフィルタールール集',
    description: 'ニュースレター自動アーカイブ、ECサイト通知、SNS通知、請求書分類……8種類のフィルタールールをコピペで即適用。受信トレイのノイズを8割カット。',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    icon: FileText,
    title: '返信テンプレート30種',
    description: 'お礼・お断り・日程調整・催促・お詫び・紹介の6カテゴリ。{{変数}}を置き換えるだけで、丁寧なビジネスメールが1分で完成。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: BarChart3,
    title: 'タスク整理（緊急×重要マトリクス）',
    description: 'メールの件名と要約を入力するだけで、AIがアイゼンハワーマトリクスに自動分類。「今すぐ対応」「計画して対応」「委任」「アーカイブ」を一目で判断。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Calendar,
    title: '日程調整メール自動生成',
    description: '相手の名前・候補日3つ・場所を入力するだけで、シーン別（社内/クライアント/面接/ランチ/カジュアル）の丁寧な日程調整メールが完成。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: CheckSquare,
    title: 'Inbox Zeroチェックリスト',
    description: 'GTD式×Inbox Zeroの12ステップ。全件スキャン→即処理→仕分け→削減→完了→習慣化。毎日のルーティンとして使えるインタラクティブチェックリスト。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: BarChart3,
    title: 'メール習慣診断',
    description: '受信数・未読数・処理時間・返信速度・チェック回数・購読数の6指標でスコア化。具体的な改善アドバイス付き。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
]

const faqs = [
  { q: 'Gmailアカウントの連携は必要ですか？', a: '不要です。フィルタールールのテキストをコピーして、Gmailの設定画面で手動で適用します。メールデータがサーバーに送信されることはありません。' },
  { q: 'Outlook / Yahoo!メールでも使えますか？', a: 'テンプレートや日程調整メール、チェックリスト、習慣診断はメールサービスに依存しません。フィルタールールはGmail形式ですが、考え方は他サービスにも応用できます。' },
  { q: '返信テンプレートはカスタマイズできますか？', a: 'コピー後に自由に編集できます。{{変数}}部分を実際の内容に置き換えてください。' },
  { q: 'タスク整理のデータはどこに保存されますか？', a: 'ブラウザのlocalStorageに保存されます。サーバーには一切送信されません。ブラウザのデータを消去すると削除されます。' },
  { q: '買い切りですか？月額ですか？', a: '¥4,980の買い切りです。一度購入すれば追加料金なしでずっと使えます。全ツール使い放題プラン（¥980/月）でも利用可能です。' },
]

export default function InboxOrganizerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />全ツール一覧に戻る
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">ビジネス効率化</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Gmail Inbox AI秘書</h1>
              <p className="text-xl text-muted-foreground mb-2">Gmail連携 × 自動分類 × AI返信 × ゴミ箱整理</p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                メール処理に毎日1時間以上かけていませんか？<span className="text-foreground font-medium">AIがメールを分類・返信・整理</span>して、
                <br />3分でInbox Zeroを実現します。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">🔗 Gmail連携</Badge>
                <Badge variant="outline" className="text-sm py-1">🤖 AI返信生成</Badge>
                <Badge variant="outline" className="text-sm py-1">📋 自動分類</Badge>
                <Badge variant="outline" className="text-sm py-1">🔒 完全ローカル処理</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <PurchaseButton productId="inbox-organizer" />
                <ToolLaunchButton productId="inbox-organizer" />
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />セキュリティ重視設計</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl p-8 border border-teal-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Inbox className="h-5 w-5 text-teal-500" />
                    <span className="font-semibold">Inbox Zero ダッシュボード</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                      <span className="text-sm">🔴 緊急×重要</span>
                      <span className="text-sm font-bold text-red-500">3件</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                      <span className="text-sm">🟡 計画対応</span>
                      <span className="text-sm font-bold text-amber-500">7件</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                      <span className="text-sm">✅ アーカイブ済み</span>
                      <span className="text-sm font-bold text-green-500">42件</span>
                    </div>
                    <div className="text-center pt-2">
                      <span className="text-2xl font-bold text-teal-500">85</span>
                      <span className="text-sm text-muted-foreground">/100 スコア</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">6つの機能</h2>
          <p className="text-center text-muted-foreground mb-12">メール管理のすべてをカバー</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <Link key={i} href="/products/inbox-organizer/app">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className={`${f.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                      <f.icon className={`h-6 w-6 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-teal-500 transition-colors">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">🔒 安全設計</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Gmail連携不要</h3>
                  <p className="text-sm text-muted-foreground">OAuth認証やAPI接続は一切行いません。フィルタールールはテキストとしてコピーし、Gmailの設定画面で手動適用します。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">メール本文を送信しない</h3>
                  <p className="text-sm text-muted-foreground">タスク整理で入力するのは件名と要約のみ。メール全文をサーバーに送る必要はありません。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">自動返信しない</h3>
                  <p className="text-sm text-muted-foreground">テンプレートをコピーして自分で送信。AIが勝手にメールを送ることはありません。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">ブラウザ内完結</h3>
                  <p className="text-sm text-muted-foreground">チェックリストやタスクデータはブラウザのlocalStorageに保存。クラウドに一切送信しません。</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">料金</h2>
          <div className="max-w-md mx-auto">
            <Card className="border-teal-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">買い切り</Badge>
                <div className="text-5xl font-bold mb-2">¥4,980<span className="text-lg font-normal text-muted-foreground">（税込）</span></div>
                <p className="text-muted-foreground mb-6">一度の購入でずっと使える</p>
                <PurchaseButton productId="inbox-organizer" />
                <p className="text-xs text-muted-foreground mt-4">全ツール使い放題プラン（¥980/月）なら全ツール使い放題</p>
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
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>
    </div>
  )
}
