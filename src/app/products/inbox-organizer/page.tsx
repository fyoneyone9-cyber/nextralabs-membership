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
    title: 'Gmailフィルタールール雁E,
    description: 'ニュースレター自動アーカイブ、ECサイト通知、SNS通知、請求書刁E��……8種類�Eフィルタールールをコピ�Eで即適用。受信トレイのノイズめE割カチE��、E,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    icon: FileText,
    title: '返信チE��プレーチE0種',
    description: 'お礼・お断り�E日程調整・催俁E�Eお詫び・紹介�E6カチE��リ、E{変数}}を置き換えるだけで、丁寧なビジネスメールぁE刁E��完�E、E,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: BarChart3,
    title: 'タスク整琁E��緊急×重要�Eトリクス�E�E,
    description: 'メールの件名と要紁E��入力するだけで、AIがアイゼンハワーマトリクスに自動�E類。「今すぐ対応」「計画して対応」「委任」「アーカイブ」を一目で判断、E,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Calendar,
    title: '日程調整メール自動生戁E,
    description: '相手�E名前・候補日3つ・場所を�E力するだけで、シーン別�E�社冁EクライアンチE面接/ランチEカジュアル�E��E丁寧な日程調整メールが完�E、E,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: CheckSquare,
    title: 'Inbox ZeroチェチE��リスチE,
    description: 'GTD式×Inbox Zeroの12スチE��プ。�E件スキャン→即処琁E�E仕�Eけ�E削減�E完亁E�E習�E化。毎日のルーチE��ンとして使えるインタラクチE��ブチェチE��リスト、E,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: BarChart3,
    title: 'メール習�E診断',
    description: '受信数・未読数・処琁E��間�E返信速度・チェチE��回数・購読数の6持E��でスコア化。�E体的な改喁E��ドバイス付き、E,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
]

const faqs = [
  { q: 'Gmailアカウント�E連携は忁E��ですか�E�E, a: '不要です。フィルタールールのチE��ストをコピ�Eして、Gmailの設定画面で手動で適用します。メールチE�Eタがサーバ�Eに送信されることはありません、E },
  { q: 'Outlook / Yahoo!メールでも使えますか�E�E, a: 'チE��プレートや日程調整メール、チェチE��リスト、習�E診断はメールサービスに依存しません。フィルタールールはGmail形式ですが、老E��方は他サービスにも応用できます、E },
  { q: '返信チE��プレート�Eカスタマイズできますか�E�E, a: 'コピ�E後に自由に編雁E��きます、E{変数}}部刁E��実際の冁E��に置き換えてください、E },
  { q: 'タスク整琁E�EチE�Eタはどこに保存されますか�E�E, a: 'ブラウザのlocalStorageに保存されます。サーバ�Eには一刁E��信されません。ブラウザのチE�Eタを消去すると削除されます、E },
  { q: '買ぁE�Eりですか�E�月額ですか�E�E, a: '¥4,980の買ぁE�Eりです。一度購入すれば追加料��なしでずっと使えます。�EチE�Eル使ぁE��題�Eラン�E�¥980/月）でも利用可能です、E },
]

export default function InboxOrganizerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />全チE�Eル一覧に戻めE          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">ビジネス効玁E��</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Gmail AI Accelerator</h1>
              <p className="text-xl text-muted-foreground mb-2">Gmail連携 ÁE自動�E顁EÁEAI返信 ÁEゴミ箱整琁E/p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                メール処琁E��毎日1時間以上かけてぁE��せんか！Espan className="text-foreground font-medium">AIがメールを�E類�E返信・整琁E/span>して、E                <br />3刁E��Inbox Zeroを実現します、E              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">🔗 Gmail連携</Badge>
                <Badge variant="outline" className="text-sm py-1">🤁EAI返信生�E</Badge>
                <Badge variant="outline" className="text-sm py-1">📋 自動�E顁E/Badge>
                <Badge variant="outline" className="text-sm py-1">🔒 完�Eローカル処琁E/Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <PurchaseButton productId="inbox-organizer" />
                <ToolLaunchButton productId="inbox-organizer" />
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />セキュリチE��重視設訁E/span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl p-8 border border-teal-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Inbox className="h-5 w-5 text-teal-500" />
                    <span className="font-semibold">Inbox Zero ダチE��ュボ�EチE/span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                      <span className="text-sm">🔴 緊急×重要E/span>
                      <span className="text-sm font-bold text-red-500">3件</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                      <span className="text-sm">🟡 計画対忁E/span>
                      <span className="text-sm font-bold text-amber-500">7件</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                      <span className="text-sm">✁Eアーカイブ済み</span>
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
          <h2 className="text-3xl font-bold text-center mb-4">6つの機�E</h2>
          <p className="text-center text-muted-foreground mb-12">メール管琁E�Eすべてをカバ�E</p>
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
            <h2 className="text-3xl font-bold text-center mb-8">🔒 安�E設訁E/h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Gmail連携不要E/h3>
                  <p className="text-sm text-muted-foreground">OAuth認証やAPI接続�E一刁E��いません。フィルタールールはチE��ストとしてコピ�Eし、Gmailの設定画面で手動適用します、E/p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">メール本斁E��送信しなぁE/h3>
                  <p className="text-sm text-muted-foreground">タスク整琁E��入力する�Eは件名と要紁E�Eみ。メール全斁E��サーバ�Eに送る忁E���Eありません、E/p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">自動返信しなぁE/h3>
                  <p className="text-sm text-muted-foreground">チE��プレートをコピ�Eして自刁E��送信、EIが勝手にメールを送ることはありません、E/p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">ブラウザ冁E��絁E/h3>
                  <p className="text-sm text-muted-foreground">チェチE��リストやタスクチE�EタはブラウザのlocalStorageに保存。クラウドに一刁E��信しません、E/p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">料��</h2>
          <div className="max-w-md mx-auto">
            <Card className="border-teal-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">買ぁE�EめE/Badge>
                <div className="text-5xl font-bold mb-2">¥4,980<span className="text-lg font-normal text-muted-foreground">�E�税込�E�E/span></div>
                <p className="text-muted-foreground mb-6">一度の購入でずっと使える</p>
                <PurchaseButton productId="inbox-organizer" />
                <p className="text-xs text-muted-foreground mt-4">全チE�Eル使ぁE��題�Eラン�E�¥980/月）なら�EチE�Eル使ぁE��顁E/p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4"><HelpCircle className="inline h-8 w-8 mr-2" />よくある質啁E/h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>
    </div>
  )
}
