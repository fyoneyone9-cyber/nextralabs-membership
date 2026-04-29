import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Zap, Code, Download, Bot, Search, FileText, Infinity, PawPrint, Network, ShieldAlert, Store, Rocket, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const featuredProduct = {
  id: 'vintage-hunter',
  title: '古着ハンター',
  subtitle: 'AI搭載メルカリ自動監視ボット',
  description:
    'メルカリの新着出品を24時間自動監視し、AIが「お買い得」と判断した瞬間にDiscordへ通知。寝てる間にお宝古着を見逃さない。',
  price: '¥980/月',
  priceNote: 'スタンダードプラン',
  tags: ['Python', 'AWS Lambda', 'AI', 'Discord'],
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-500/5" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            AIツールで
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              業務を自動化
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            マーケティング、データ分析、業務効率化——あらゆる分野のAIツールが使い放題。スタンダードプラン（¥980/月）で全ツール利用可能。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8">
                ツールを見る
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8">
                全ツール使い放題プランを見る
              </Button>
            </Link>
            <Link href="/guide">
              <Button variant="outline" size="lg" className="text-lg px-8">
                📖 ご利用ガイド
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">選ばれる理由</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                  <Code className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-semibold mb-2">すぐ使える</h3>
                <p className="text-sm text-muted-foreground">
                  全ツールのソースコードを提供。自由にカスタマイズできます。
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Infinity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">使い放題プラン</h3>
                <p className="text-sm text-muted-foreground">
                  全ツール使い放題プラン会員はすべてのツールを無制限に利用可能。
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">安全な決済</h3>
                <p className="text-sm text-muted-foreground">
                  Stripeによるセキュアな決済。安心してお買い物できます。
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <Download className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">即ダウンロード</h3>
                <p className="text-sm text-muted-foreground">
                  購入・登録後すぐにソースコードをダウンロードできます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">注目のツール</h2>
          <p className="text-muted-foreground text-center mb-10">今一番売れているAIツール</p>
          <div className="max-w-3xl mx-auto">
            <Link href={`/products/${featuredProduct.id}`}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-amber-500/50">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10">
                      <Search className="h-7 w-7 text-amber-500" />
                    </div>
                    <Badge className="bg-green-500 text-white border-0 text-sm">販売中</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-amber-500 transition-colors">
                    {featuredProduct.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">{featuredProduct.subtitle}</p>
                  <p className="text-muted-foreground mb-6">{featuredProduct.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProduct.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-end justify-between pt-4 border-t">
                    <div>
                      <span className="text-3xl font-bold">{featuredProduct.price}</span>
                      <span className="text-sm text-muted-foreground ml-2">{featuredProduct.priceNote}</span>
                    </div>
                    <Button variant="default" className="gap-1 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      詳しく見る →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* New Product: Office Politics Graph */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">🆕 新着ツール</h2>
          <p className="text-muted-foreground text-center mb-10">組織の隠れた関係性を可視化</p>
          <div className="max-w-3xl mx-auto">
            <Link href="/products/office-politics-graph">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-indigo-500/50">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10">
                      <Network className="h-7 w-7 text-indigo-500" />
                    </div>
                    <Badge className="bg-green-500 text-white border-0 text-sm">販売中</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-indigo-500 transition-colors">
                    社内政治 相関図
                  </h3>
                  <p className="text-muted-foreground mb-3">Slack × カレンダー関係性可視化ツール</p>
                  <p className="text-muted-foreground mb-6">
                    組織図には載らない「本当の人間関係」を可視化。Slackメンション傾向とカレンダー会議データから、
                    隠れたキーマンやブリッジ役を自動検出するインタラクティブ相関図ツール。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">D3.js</Badge>
                    <Badge variant="secondary">JavaScript</Badge>
                    <Badge variant="secondary">データ分析</Badge>
                    <Badge variant="secondary">Slack API</Badge>
                  </div>
                  <div className="flex items-end justify-between pt-4 border-t">
                    <div>
                      <span className="text-3xl font-bold">無料</span>
                      <span className="text-sm text-muted-foreground ml-2">アカウント不要</span>
                    </div>
                    <Button variant="default" className="gap-1 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      詳しく見る →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* All Tools Quick Access */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">🚀 人気ツールをチェック</h2>
          <p className="text-muted-foreground text-center mb-10">スタンダード・プレミアムプラン会員はツールに直接アクセス。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { id: 'vintage-hunter', name: 'AI古着お買い得ハンター', desc: '楽天APIで実データ検索・3サイト比較', icon: 'Search', price: '¥1,980/月', color: 'amber', iconEl: Search },
              { id: 'office-politics-graph', name: '社内政治 相関図', desc: 'Slack × カレンダー関係性可視化ツール', icon: 'Network', price: '¥980/月', color: 'indigo', iconEl: Network },
              { id: 'pet-translator', name: 'AIペット翻訳モニター', desc: '留守中のペットの感情をAIが翻訳', icon: 'PawPrint', price: '¥1,980/月', color: 'violet', iconEl: PawPrint },
              { id: 'shopping-stopper', name: 'AI買い物依存ストッパー', desc: 'カメラ表情解析 × 衝動買い防止AI', icon: 'ShieldAlert', price: '¥980/月', color: 'red', iconEl: ShieldAlert },
              { id: 'ai-select-shop', name: '「在庫ゼロ」AIセレクトショップ', desc: 'トレンド分析 × AI自動デザイン × オンデマンド出品', icon: 'Store', price: '¥1,980/月', color: 'emerald', iconEl: Store },
            ].map((tool) => {
              const Icon = tool.iconEl
              return (
                <Card key={tool.id} className={`hover:shadow-lg transition-all group border-2 hover:border-${tool.color}-500/50`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${tool.color}-500/10`}>
                        <Icon className={`h-6 w-6 text-${tool.color}-500`} />
                      </div>
                      <Badge className="bg-green-500 text-white border-0 text-xs">{tool.price}</Badge>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.desc}</p>
                    <div className="flex gap-2">
                      <Link href={`/products/${tool.id}/app`} className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90">
                          <Rocket className="h-3.5 w-3.5" />
                          ツールを使う
                        </Button>
                      </Link>
                      <Link href={`/products/${tool.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          詳細
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めよう</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            プランに登録するして、すべてのAIツールを使い放題に。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8">ツール一覧を見る</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8">全ツール使い放題プランに登録</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
