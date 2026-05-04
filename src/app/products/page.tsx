import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'AIツール一覧',
  description: '資格試験スケジューラー・AIペット翻訳・古着ハンターなど20以上のAIツール。',
}

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon } from 'lucide-react'

interface Product {
  id: string
  title: string
  subtitle: string
  description: string
  priceNote: string
  tags: string[]
  icon: LucideIcon
  bgColor: string
  iconColor: string
  status: string
}

// 🏨 Hotel category data
const hotelTools: Product[] = [
  {
    id: 'staysee-ai-finder',
    title: 'Staysee AI Finder',
    subtitle: '画像解析 × 宿泊者照合 AI',
    description: '拾得物を撮影するだけでAIが宿泊データから持ち主を特定。フロント業務を劇的に効率化します。',
    priceNote: 'プレミアムプラン',
    tags: ['ホテルDX', 'Staysee連携', '効率化'],
    icon: Building2,
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    status: 'B2B',
  },
]

// 🆓 Free tools data
const freeTools: Product[] = [
  {
    id: 'office-politics-graph',
    title: '社内政治 相関図',
    subtitle: '人間関係の可視化ツール',
    description: 'Slackやカレンダーから組織のキーマンを自動検出。本当の人間関係を可視化します。',
    priceNote: '無料',
    tags: ['データ分析', 'PageRank'],
    icon: Network,
    bgColor: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    status: 'FREE',
  },
  {
    id: 'moving-checker',
    title: '引っ越し安心チェッカー',
    subtitle: 'エリア安全度スコア化',
    description: '物件の騒音リスクや周辺の治安をAIが分析。失敗しない引っ越しをサポート。',
    priceNote: '無料',
    tags: ['物件選び', '治安'],
    icon: Home,
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    status: 'FREE',
  },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/40 transition-all duration-300 rounded-[2rem] overflow-hidden group shadow-xl">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform`}>
            <Icon className="h-8 w-8" />
          </div>
          <Badge className="bg-slate-800 text-slate-400 border-0 px-3 py-1">{product.status}</Badge>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
          <p className="text-emerald-400/80 text-sm font-medium mb-4">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-slate-500">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Access Level</span>
            <span className="text-sm font-black text-slate-200">{product.priceNote}</span>
          </div>
          
          {/* 🚀 HIGHLY CLICKABLE "USE" BUTTON */}
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group/btn">
              <span>このツールを使う</span>
              <Rocket className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="text-center mb-20 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold">NextraLabs Catalog</Badge>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">AIツールを、<br/>もっと身近に。</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">心理学に基づいた落ち着きのある空間で、あなたの業務に最適なAIをお探しください。</p>
        </div>

        {/* Categories */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10 border-l-4 border-blue-500 pl-6">
            <h2 className="text-3xl font-bold text-white">🏨 ホテル・民泊オーナー向け</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotelTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-10 border-l-4 border-emerald-500 pl-6">
            <h2 className="text-3xl font-bold text-white">🆓 無料ツール</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freeTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
