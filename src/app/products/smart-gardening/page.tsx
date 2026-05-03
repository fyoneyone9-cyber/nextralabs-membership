import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sprout, Droplets, Sun, Wind, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'スマート・ガーデニング | NextraLabs',
  description: 'AIがあなたの植物を診断。葉の状態や置き場所から、最適な育て方をアドバイスします。',
}

export default function SmartGardeningDetailPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <Sprout className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <Badge className="mb-2 bg-emerald-500 hover:bg-emerald-600">スタンダードプラン</Badge>
            <h1 className="text-4xl font-bold">スマート・ガーデニング</h1>
          </div>
        </div>

        <p className="text-xl text-muted-foreground mb-12">
          「最近元気がない」「水やりのタイミングがわからない」
          そんな悩み、AIに相談してみませんか？写真（準備中）や状況から、プロのアドバイスを即座に提供します。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <Droplets className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="font-bold mb-2">水やり診断</h3>
              <p className="text-sm text-muted-foreground">季節や環境に合わせた最適なタイミングを提案。</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Sun className="h-8 w-8 text-amber-500 mb-4" />
              <h3 className="font-bold mb-2">環境最適化</h3>
              <p className="text-sm text-muted-foreground">日当たり、温度、湿度の改善点をAIが指摘。</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Wind className="h-8 w-8 text-emerald-500 mb-4" />
              <h3 className="font-bold mb-2">トラブル解決</h3>
              <p className="text-sm text-muted-foreground">病害虫や根腐れの兆候を早期発見・対策。</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-8 rounded-3xl mb-12">
          <h2 className="text-2xl font-bold mb-6">主な機能</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'AIチャット診断',
              '育て方ガイド自動生成',
              'リマインダー設定 (カレンダー連携)',
              '環境スコア判定',
              'プロ仕様のトラブルシューティング',
              '複数プラント管理 (マイページ連動)',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link href="/products/smart-gardening/app">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-lg gap-2">
              今すぐ診断を始める
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
