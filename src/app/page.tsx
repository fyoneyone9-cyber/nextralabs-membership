import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Zap, Code, Download, Bot, Search, FileText, Infinity, PawPrint, Building2, Shirt, Hotel, Key, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const featuredProduct = {
  id: 'vintage-hunter',
  title: '古着ハンター',
  subtitle: 'AI搭載メルカリ自動監視ボット',
  description:
    'メルカリの新着出品を24時間自動監視し、AIが「お買い得」と判断した瞬間にDiscordへ通知。寝てる間にお宝古着を見逃さない。',
  price: '¥9,800',
  priceNote: '買い切り・税込',
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
            マーケティング、データ分析、業務効率化——あらゆる分野のAI自動化ツールのソースコードを販売。
            有料プランならすべて使い放題。買い切りも選べます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8">
                ツールを見る
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8">
                有料プランを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ホテル・民泊オーナー様向けジャンル */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hotel className="h-8 w-8 text-blue-200" />
            <h2 className="text-3xl font-bold text-center">ホテル・民泊オーナー様向け</h2>
          </div>
          <p className="text-center text-blue-100 mb-12 max-w-2xl mx-auto">
            宿泊施設のオペレーションを劇的に効率化するAIソリューション。
            人手不足の解消と、おもてなしの質の向上を同時に実現します。
          </p>
          
          <div className="max-w-4xl mx-auto">
            <Link href="/products/staysee-ai-finder">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 bg-white text-slate-900 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-slate-100 flex items-center justify-center p-12 group-hover:bg-blue-50 transition-colors">
                      <div className="relative">
                        <Building2 className="h-24 w-24 text-blue-600" />
                        <Search className="h-10 w-10 text-amber-500 absolute -bottom-2 -right-2 bg-white rounded-full p-1" />
                      </div>
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">Staysee 連携ツール</Badge>
                        <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                          <Zap className="h-4 w-4 fill-current" /> 人気急上昇
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Staysee AI Finder</h3>
                      <p className="text-slate-600 mb-6">
                        忘れ物管理の革命。拾得物を撮影するだけで、AIが宿泊台帳から持ち主を自動特定。
                        フロントの電話対応と確認作業をわずか数秒に短縮します。
                      </p>
                      <div className="flex items-center text-blue-600 font-bold">
                        詳細・デモを試す <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-800">注目のツール</h2>
          <p className="text-muted-foreground text-center mb-10">個人・副業・小規模ビジネスに最適</p>
          <div className="max-w-3xl mx-auto">
            <Link href={`/products/${featuredProduct.id}`}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-amber-500/50">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                      <Search className="h-7 w-7" />
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
                  <div className="flex items-end justify-between pt-4 border-t text-slate-900">
                    <div>
                      <span className="text-3xl font-bold">{featuredProduct.price}</span>
                      <span className="text-sm text-muted-foreground ml-2">{featuredProduct.priceNote}</span>
                    </div>
                    <Button variant="default" className="gap-1 group-hover:bg-amber-500 group-hover:text-white transition-colors bg-slate-900">
                      詳しく見る →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">開発中のツール</h2>
          <p className="text-muted-foreground mb-10">さらに便利なAIツールを準備中です</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-slate-800">
            <Link href="/products/ai-stylist-scope">
              <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-dashed hover:border-violet-500/50 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
                    <Shirt className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-violet-500 transition-colors text-slate-900">AIスタイリスト</h3>
                  <p className="text-sm text-muted-foreground">個人のクローゼットと天気を連動。Geminiによるファッション提案モデル。</p>
                  <Badge variant="outline" className="mt-3 border-violet-500 text-violet-500">2026年5月 登場予定</Badge>
                </CardContent>
              </Card>
            </Link>
            <Card className="opacity-70 border-dashed bg-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">SNSオートポスター</h3>
                <p className="text-sm text-muted-foreground">X/Instagram/Threadsへの投稿を一括管理・自動化するツール。</p>
                <Badge variant="outline" className="mt-3">Coming Soon</Badge>
              </CardContent>
            </Card>
            <Card className="opacity-70 border-dashed bg-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">AIレポートジェネレーター</h3>
                <p className="text-sm text-muted-foreground">データを投げるだけで分析レポートをAIが自動生成。</p>
                <Badge variant="outline" className="mt-3">Coming Soon</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めよう</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-slate-700">
            有料プランに登録して、すべてのAIツールを使い放題に。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8 bg-slate-900 text-white hover:bg-slate-800">ツール一覧を見る</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 border-slate-300">有料プランに登録</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
