'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Zap, Code, Download, Bot, Search, FileText, Infinity, PawPrint, Building2, Shirt, Hotel, Key, ArrowRight, Smartphone, Share, PlusSquare, DownloadCloud } from 'lucide-react'
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
    <div className="animate-in fade-in duration-700 bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-40 bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-amber-500/20" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            AIツールで
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              業務を自動化
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            マーケティング、データ分析、業務効率化——あらゆる分野のAI自動化ツールのソースコードを販売。
            有料プランならすべて使い放題。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <Button size="lg" className="text-lg px-12 h-16 bg-white hover:bg-slate-200 text-black font-bold rounded-2xl shadow-2xl shadow-white/10 transition-all hover:scale-105">
                ツールを見る
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-12 h-16 border-white/20 hover:bg-white/10 text-white rounded-2xl transition-all">
                有料プランを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PWA Installation Section */}
      <section className="py-12 bg-indigo-950 text-white border-y border-indigo-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl mx-auto">
            <div className="hidden md:block">
              <div className="relative">
                <Smartphone className="h-20 w-20 text-indigo-400" />
                <DownloadCloud className="h-8 w-8 text-amber-400 absolute -bottom-2 -right-2 animate-bounce" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold mb-3">スマホでもっと快適に。</h2>
              <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                NextraLabs をホーム画面に追加して、全画面でスムーズなAI体験を。
                最新のAI自動化ツールへ、いつでもワンタップでアクセスできます。
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  onClick={handleInstallClick}
                  className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-6 py-6 h-auto rounded-2xl flex flex-col items-center gap-1 shadow-xl transition-transform hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    <span>アプリをインストール</span>
                  </div>
                  <span className="text-[10px] opacity-60 font-normal">Android / PC Chrome 用</span>
                </Button>

                <div className="bg-indigo-900/50 border border-indigo-700 p-4 rounded-2xl flex flex-col gap-2 min-w-[200px]">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Badge className="bg-pink-600 text-white border-0">iPhone</Badge>
                    <span>インストール方法</span>
                  </div>
                  <p className="text-[11px] text-indigo-300">
                    Safariの共有ボタン <Share className="inline h-3 w-3 mx-1" /> を押し、<br/>
                    「ホーム画面に追加」 <PlusSquare className="inline h-3 w-3 mx-1" /> をタップ
                  </p>
                </div>
              </div>
            </div>
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
          <p className="text-blue-100 mb-16 max-w-2xl mx-auto text-lg">
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
                        <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1">Staysee 連携</Badge>
                        <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                          <Zap className="h-4 w-4 fill-current animate-pulse" /> 人気
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors">Staysee AI Finder</h3>
                      <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                        画像認識で忘れ物を解析し、宿泊台帳から持ち主を自動特定。
                        フロントの電話対応をわずか数秒に短縮する、最強のホテルDXツール。
                      </p>
                      <div className="flex items-center text-blue-600 font-bold text-xl">
                        詳細・デモを試す <ArrowRight className="ml-2 h-6 w-6" />
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
      <section className="py-24 bg-slate-950 text-white border-t border-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">注目のツール</h2>
          <div className="max-w-3xl mx-auto">
            <Link href={`/products/${featuredProduct.id}`}>
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-slate-800 bg-slate-900 text-white rounded-[2rem] overflow-hidden hover:border-amber-500/50">
                <CardContent className="p-12">
                  <div className="flex items-start justify-between mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                      <Search className="h-8 w-8" />
                    </div>
                    <Badge className="bg-green-500 text-white border-0 py-1 px-4 text-sm">販売中</Badge>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-amber-500 transition-colors">
                    {featuredProduct.title}
                  </h3>
                  <p className="text-slate-400 mb-10 leading-relaxed text-lg">{featuredProduct.description}</p>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {featuredProduct.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-300 border-0 px-4 py-1 text-sm font-medium">#{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-end justify-between pt-8 border-t border-slate-800">
                    <div>
                      <span className="text-4xl font-bold">{featuredProduct.price}</span>
                      <span className="text-sm text-slate-500 ml-3">{featuredProduct.priceNote}</span>
                    </div>
                    <Button variant="default" className="gap-1 bg-white text-black hover:bg-slate-200 px-8 h-14 rounded-2xl font-bold">
                      詳しく見る →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon - Fixed Contrast & Removed Links */}
      <section className="py-24 bg-slate-900 text-white border-y border-slate-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">開発中のツール</h2>
          <p className="text-slate-500 mb-16">さらに便利なAIツールを準備中です</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            {/* NO Link for coming soon tools */}
            <Card className="border-2 border-dashed border-slate-800 bg-slate-800/50 rounded-[2rem] cursor-default">
              <CardContent className="p-10 text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                  <Shirt className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AIスタイリスト</h3>
                <p className="text-sm text-slate-400 leading-relaxed">個人のクローゼットと天気を連動。Geminiによるファッション提案モデル。</p>
                <Badge variant="outline" className="mt-6 border-violet-500 text-violet-400 px-6 py-1">2026年5月 登場予定</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-slate-800 bg-slate-950/30 rounded-[2rem] cursor-default opacity-50">
              <CardContent className="p-10 text-center text-slate-500">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 text-slate-600">
                  <Bot className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">SNSオートポスター</h3>
                <p className="text-sm">X/Instagramへの投稿を一括管理・自動化するツール。</p>
                <Badge variant="outline" className="mt-6 border-slate-800">Coming Soon</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-slate-800 bg-slate-950/30 rounded-[2rem] cursor-default opacity-50">
              <CardContent className="p-10 text-center text-slate-500">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 text-slate-600">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">AIレポート作成</h3>
                <p className="text-sm">データを投げるだけで分析レポートをAIが自動生成。</p>
                <Badge variant="outline" className="mt-6 border-slate-800">Coming Soon</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA - Fixed Visibility */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">今すぐ始めよう</h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
            有料プランに登録して、すべてのAIツールを使い放題に。
            あなたの業務にAIの力を。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-xl px-12 h-18 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all hover:scale-105">
                ツール一覧を見る
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-xl px-12 h-18 border-slate-700 text-white rounded-2xl hover:bg-white/5 transition-all">
                有料プランに登録
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
