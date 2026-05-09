'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, 
  ClipboardCheck, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, 
  Sprout, Zap, Droplets, Utensils, Building2, Youtube, Hotel, Key, Lock, CreditCard, Coins, Sparkles, Archive, UserPlus, Table, Sofa, Play, TrendingUp, LineChart, Scale, Crown, Gift, HeartHandshake, Smartphone
} from 'lucide-react'

const TOOL_DIRECTORY = [
  { id: 'staysee-ai-finder', name: 'Nextra AI', desc: '宿泊予約・鍵発行を完全同期。人の手を介さない次世代フロント体験。', icon: Building2, Youtube, color: 'text-emerald-500' },
  { id: 'sns-auto-poster', name: 'AI SNSオートポスター', desc: 'トレンド×戦略でバズを量産する、最強のマルチSNS投稿エンジン。', icon: Share2, color: 'text-rose-500' },
  { id: 'trend-stock', name: 'SNSトレンドAI分析', desc: 'バズ予測×楽天在庫同期。流行を即座に収益（仕入れ）へ変換。', icon: TrendingUp, color: 'text-emerald-500' },
  { id: 'ai-konkatsu', name: 'AI婚活コーチ', desc: '上級心理カウンセラーの知見を統合。データと心理で成婚を支援。', icon: HeartHandshake, color: 'text-pink-400' },
  { id: 'inbox-organizer', name: 'Gmail AI Accelerator', desc: '未読ゼロを最速で実現。AIがメール要約と返信案作成を代行。', icon: Mail, color: 'text-emerald-500' },
  { id: 'expense-sync', name: 'Expense AI Sync', desc: 'レシート画像をAI解析し、スプレッドシートへ全自動で記帳。', icon: Table, color: 'text-emerald-400' },
  { id: 'contact-sync', name: 'Contact Sync', desc: '名刺をAIスキャンし、スマホ連絡先へ全自動で1行登録。', icon: UserPlus, color: 'text-blue-400' },
  { id: 'ai-select-shop', name: 'AIセレクトショップ', desc: '流行をAI分析し、在庫リスクゼロでShopifyへ自動出品。', icon: Store, color: 'text-teal-500' },
  { id: 'interior-coordinator', name: 'Interior Sync', desc: '空間分析×楽天一括購入。部屋に調和する家具をAIが提案。', icon: Sofa, color: 'text-emerald-500' },
  { id: 'youtube-coordinator', name: 'YouTube AI Sync', desc: '動画内の服を特定。楽天市場から類似品を即座に提案。', icon: Play, color: 'text-red-500' },
  { id: 'evidence-manager', name: 'エビデンスAIマネージャー', desc: '制作実績をAIが自動選別。Shopify等の証拠を美しくアーカイブ。', icon: Archive, color: 'text-emerald-400' },
  { id: 'office-politics-graph', name: '社内政治 AI相関図', desc: '組織内のパワーバランスと人間関係の暗部をAIが可視化。', icon: Network, color: 'text-emerald-400' },
  { id: 'moving-checker', name: 'AI引越し安心チェッカー', desc: '住所だけで周辺治安・物件リスクをAIが精密スコアリング。', icon: Home, color: 'text-emerald-400' },
  { id: 'buy-smart-nav', name: '中古・新品AI比較ナビ', desc: '市場価格をAIが比較。今、新品と中古どちらを買うべきか判定。', icon: Scale, color: 'text-emerald-400' },
  { id: 'kdp-guide', name: 'Kindle出版AI完全ナビ', desc: '執筆から申請まで。最短距離で作家デビューをAIがサポート。', icon: BookOpen, color: 'text-emerald-400' },
  { id: 'ai-report-generator', name: 'AIレポートジェネレーター', desc: '箇条書きからプロ級のビジネス文書を瞬時に自動構成。', icon: FileText, color: 'text-slate-400' },
  { id: 'shopping-stopper', name: 'AI買い物依存ストッパー', desc: '散財の鎖を断ち切る。AIが購買行動を健全な方向へガイド。', icon: ShieldAlert, color: 'text-rose-400' },
  { id: 'scam-defender', name: 'AI詐欺ディフェンダー', desc: '詐欺・悪意のある連絡を即座に判定し、デジタル資産を保護。', icon: ShieldCheck, color: 'text-red-400' },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', desc: '衝動買いの心理を抑止。支出の致命傷を未然に防ぐ。', icon: Wallet, color: 'text-emerald-400' },
  { id: 'disaster-guard', name: 'AI防災パーソナルガイド', desc: '現在地のハザードマップに基づき、AIが生存戦略を立案。', icon: Shield, color: 'text-sky-400' },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', desc: '最新ニュースから全自動で台本、サムネイル設計まで完結。', icon: Youtube, color: 'text-red-400' },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', desc: '適性診断から収益化まで、AI副業の最短ロードマップを提示。', icon: Briefcase, color: 'text-emerald-400' },
  { id: 'prompt-master', name: 'AI画像プロンプトマスター', desc: '1000以上のパーツから究極の画像生成プロンプトを錬成。', icon: Wand2, color: 'text-emerald-400' }
];

const ToolGuideContent = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#050507]" />;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 text-[10px] font-bold text-emerald-500 border-emerald-500/20 uppercase tracking-tight">Master Directory</Badge>
          <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter uppercase leading-none">ツール説明</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg font-bold leading-relaxed">
            Nextra AILabsが提供する全24の特化型AIエンジン。その機能と戦略的価値を網羅した公式ディレクトリ。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
          {TOOL_DIRECTORY.map((tool) => (
            <Link key={tool.id} href={"/products/" + tool.id}>
              <Card className="bg-[#13141f] transition-all duration-300 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-xl relative border-2 border-emerald-500/50 hover:border-emerald-400">
                <CardContent className="p-6 flex items-center gap-6 h-full">
                  <div className={"w-16 h-12 bg-white/5 " + tool.color + " rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-inner flex-shrink-0"}>
                    <tool.icon size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-white uppercase mb-1 truncate group-hover:text-emerald-400 transition-colors">{tool.name}</h3>
                    <p className="text-slate-400 text-[11px] md:text-xs font-bold leading-relaxed line-clamp-2 ">{tool.desc}</p>
                    <div className="flex items-center gap-2 mt-3 text-emerald-500 text-[9px] font-bold uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">
                      解説ページを開く ?
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div className="text-center opacity-10 mt-12 font-bold uppercase tracking-[0.3em] text-[8px]">Nextra AILabs MASTERMODEL ? 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(ToolGuideContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function ToolGuidePage() {
  return <NoSSRWrapper />
}
