'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Zap, Code, Download, Bot, Search, FileText, Infinity, PawPrint, Building2, Shirt, Hotel, Key, ArrowRight, Smartphone, Share, PlusSquare, DownloadCloud, ExternalLink, Coffee, Grid, Network, Home, Share2 } from 'lucide-react'
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選択してください。");
    }
  };

  return (
    <div className="animate-in fade-in duration-700 bg-[#0f1115] text-slate-200">
      {/* 🚀 QUICK NAV - ツール一覧への爆速リンク */}
      <div className="fixed bottom-8 right-8 z-50 animate-bounce">
        <Link href="/products">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full h-16 w-16 shadow-2xl p-0 flex items-center justify-center">
            <Grid className="h-8 w-8" />
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-40 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0 mb-6 font-bold">NEXTRALABS AI PLATFORM</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
            AIツールで
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              業務を自動化
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            20種類以上の厳選されたAIツールが、あなたの日常とビジネスを劇的に変えます。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/products">
              <Button size="lg" className="text-xl px-12 h-20 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 transition-all hover:scale-105">
                🔥 全ツール一覧を見る
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-xl px-12 h-20 border-slate-700 text-white rounded-[1.5rem] hover:bg-white/5 font-bold transition-all">
                有料プランを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 🆓 FREE TOOLS FIRST - 鉄の掟 */}
      <section className="py-24 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Badge className="bg-emerald-500 text-slate-950 font-black px-4 py-1">🆓 登録不要</Badge>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Free AI Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/products/office-politics-graph/app" className="block group">
              <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Network className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">社内政治 相関図</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Slackから組織の力関係を可視化。</p>
                  <Button variant="link" className="mt-4 text-emerald-400 font-bold p-0">無料で使う →</Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products/moving-checker/app" className="block group">
              <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Home className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">引っ越し安心AI</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">物件の治安や騒音をAIがスコア化。</p>
                  <Button variant="link" className="mt-4 text-emerald-400 font-bold p-0">無料で使う →</Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products/sns-auto-poster/app" className="block group">
              <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <Share2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">SNSオートポスター</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">マルチSNS投稿文を全自動生成。</p>
                  <Button variant="link" className="mt-4 text-emerald-400 font-bold p-0">無料で使う →</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ホテル・民泊オーナー様向け */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hotel className="h-10 w-10 text-blue-200" />
            <h2 className="text-4xl font-bold">ホテル・民泊オーナー様向け</h2>
          </div>
          <p className="text-blue-100 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
            宿泊施設のオペレーションを劇的に効率化。AI×宿泊管理システム連携で、人手不足の解消を実現します。
          </p>
          
          <div className="max-w-4xl mx-auto text-left">
            <Link href="/products/staysee-ai-finder">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 bg-white text-slate-950 overflow-hidden rounded-[2rem] shadow-blue-900/30">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-slate-100 flex items-center justify-center p-14 group-hover:bg-blue-50 transition-colors">
                      <div className="relative text-blue-600 scale-125">
                        <Building2 className="h-24 w-24" />
                        <Search className="h-10 w-10 text-amber-500 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg" />
                      </div>
                    </div>
                    <div className="p-12 md:w-2/3">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1 font-bold">Staysee 連携</Badge>
                        <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                          <Zap className="h-4 w-4 fill-current animate-pulse" /> NEW
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors">Staysee AI Finder</h3>
                      <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                        画像認識で忘れ物を解析し、宿泊台帳から持ち主を自動特定。
                        フロントの電話対応をわずか数秒に短縮する、最強のホテルDXツール。
                      </p>
                      <div className="flex items-center text-blue-600 font-bold text-xl">
                        詳細を見る <ArrowRight className="ml-2 h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* PWA Section */}
      <section className="py-12 bg-indigo-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl mx-auto">
            <Smartphone className="h-20 w-20 text-indigo-400" />
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold mb-3">スマホでもっと快適に。</h2>
              <p className="text-indigo-200 text-sm mb-6">
                NextraLabs をホーム画面に追加して、全画面でスムーズなAI体験を。
              </p>
              <Button onClick={handleInstallClick} className="bg-white text-indigo-950 font-bold px-8 py-6 h-auto rounded-2xl shadow-xl transition-transform hover:scale-105">
                アプリをインストール
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#0a0a0f] relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight italic uppercase">Explore All Tools</h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto text-xl leading-relaxed">
            NextraLabsが提供する20以上のAIツール一覧へ。<br/>
            あなたの日常に、魔法のような効率を。
          </p>
          <Link href="/products">
            <Button size="lg" className="text-2xl px-16 h-24 bg-emerald-500 text-slate-950 font-black rounded-[2rem] hover:bg-emerald-400 transition-all hover:scale-105 shadow-2xl shadow-emerald-500/20">
              🔥 ツール一覧ページへ
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
