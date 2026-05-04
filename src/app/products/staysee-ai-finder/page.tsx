import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Search, Mail, Database, Building2, BellRing, ArrowRight, ShieldCheck, CheckCircle2, PlayCircle } from 'lucide-react'

export default function StayseeAiFinderPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-500 text-white border-0">B2B SaaS / Hotel Tech</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Staysee AI Finder
              <br />
              <span className="text-blue-400">忘れ物管理を、AIで自動化。</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              拾得物をスマホで撮るだけ。AIがStayseeの宿泊データと照合し、
              該当ゲストの特定から写真付き連絡メールの作成まで、わずか数秒で完了。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products/staysee-ai-finder/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 w-full sm:w-auto shadow-lg shadow-blue-500/20">
                  今すぐ解析を試す <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 border-white/20 hover:bg-white/10 w-full sm:w-auto">
                <PlayCircle className="mr-2 h-5 w-5" /> デモ動画
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">なぜ、忘れ物対応に時間をかけるのですか？</h2>
              <ul className="space-y-4">
                {[
                  '手書きノートやExcelへの転記作業',
                  '「傘」「充電器」など、特徴のない大量の在庫管理',
                  'ゲストからの問い合わせ電話への照合作業',
                  '持ち主不明による長期保管コストの増大',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-red-400 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 shadow-inner">
              <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">AI Finder が解決します</h3>
              <p className="text-blue-800 text-center mb-6 font-medium">
                拾得物の「画像」と「場所」をキーに、AIが宿泊台帳から持ち主を予測。
                フロント業務の時間を **80% 削減** します。
              </p>
              <div className="flex justify-center">
                 <Link href="/products/staysee-ai-finder/app">
                  <Button variant="link" className="text-blue-600 font-bold">実際の解析画面を見る →</Button>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">自動化のフロー</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Camera, title: "1. 撮影", desc: "スマホで拾得物を撮影" },
              { icon: Search, title: "2. 解析", desc: "AIが特徴を自動抽出" },
              { icon: Database, title: "3. 照合", desc: "Stayseeデータと突合" },
              { icon: Mail, title: "4. 通知", desc: "ゲストへ自動連絡" },
            ].map((step, i) => (
              <div key={i} className="relative p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <step.icon className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {i < 3 && <ArrowRight className="hidden md:block absolute top-14 -right-2 text-slate-300 h-5 w-5" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staysee Integration */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-slate-50 border-2 border-dashed border-slate-200">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">宿泊管理システム「Staysee」公式連携</h3>
              <p className="max-w-2xl mx-auto text-slate-600 mb-8">
                Staysee APIを利用して、リアルタイムの客室状況・顧客情報を取得します。
                既存のワークフローを壊すことなく、AIの利便性だけを追加可能です。
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary">API連携</Badge>
                <Badge variant="secondary">リアルタイム同期</Badge>
                <Badge variant="secondary">セキュア通信</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">NextraLabs メンバーシップ限定提供</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            このシステムのソースコード、およびStaysee連携用スクリプトは、
            AIツールメンバーシップ会員向けに公開されます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="secondary" className="text-lg px-8 text-blue-600 font-bold">
                メンバーシップに参加
              </Button>
            </Link>
            <Link href="/products/staysee-ai-finder/app">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white text-white hover:bg-white/20">
                デモを試す
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
