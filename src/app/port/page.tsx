'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, ArrowRight, Sparkles, Mail, 
  Briefcase, Wallet, Shield, Building2, Youtube,
  Terminal, Search, Code, CheckCircle2, 
  Phone, Archive, Spreadsheet, Network, MessageSquare, Video,
  Sofa, Play, Scissors, MapPin, Globe, UserCheck, 
  Cpu, Rocket, Database, Lock, Layers, BarChart3, Users, HeartHandshake,
  LineChart, Smartphone, Icons, Mic, Camera, Languages, Bot, Layout, Presentation
} from 'lucide-react'

// --- データ定義：米山文貴の「真の実績と圧倒的なAI武装スキル」 ---

const IDENTITY = {
  name: "米山 文貴",
  alias: "Ninja3 / NextraLabs 代表",
  motto: "「指示したら、あとは全部やってくれる人」",
  description: "大手ITグループ企業での15年以上の重厚な実務経験と、最新の生成AI知能を完全同期。Pythonによるバックエンド構築から、AIを駆使したクリエイティブ制作、IoT導入、心理戦略に基づいた結婚相談所運営まで。私は一人で『戦略・開発・運用』のすべてを完結させる。私の背後にはNextraLabsの全AIリソースが常駐しており、アイデアを現実化する速度において他者の追随を許さない。",
  base: "神奈川県 海老名市"
};

const STATS = [
  { label: "IT業界・実務経験", value: "20y+" },
  { label: "稼働中のAIマスタ機", value: "22基" },
  { label: "開発・制作スピード", value: "10x" }
];

const CORE_VALUE = [
  { 
    title: "ビジネス × 開発の一気通貫", 
    desc: "15年以上の大手IT企業実務と、エンジニアとしてのPython開発経験を融合。経営者の悩みを技術で解決します。",
    icon: Cpu 
  },
  { 
    title: "AI 活用・コンテンツ量産", 
    desc: "最新の生成AI（LLM, Vision, Video, Audio）を使いこなし、一人で制作会社1社分の成果物を量産します。",
    icon: Rocket 
  },
  { 
    title: "心理カウンセリング × 解決力", 
    desc: "上級心理カウンセラーの知見を活かし、人間関係や婚活、組織の「本質的な不満」を汲み取ったシステムを設計します。",
    icon: HeartHandshake 
  }
];

const SKILLS = [
  { 
    icon: Code, 
    title: "超速フルスタック開発", 
    desc: "Python/Node.jsを主軸に、API設計からDB構築、本番デプロイまでをAI武装により数日で完結。IoTデバイスとクラウドの連携、カスタム業務ツールの開発を得意とする。", 
    tags: ["Python", "API連携", "IoT", "Next.js", "DB構築"] 
  },
  { 
    icon: Zap, 
    title: "業務自動化・RPA構築", 
    desc: "大手IT企業での15年の組織実務知見をAIで自動化。Slack、Google Workspace、各種WebツールをAPIで繋ぎ、毎日のルーチンワークやデータ収集を工数ゼロの資産へ変える。", 
    tags: ["RPA", "Webhook", "Cron自動化", "業務フロー改善"] 
  },
  { 
    icon: Sparkles, 
    title: "AIマルチメディア制作", 
    desc: "動画台本、3D映像生成、プロ級の画像、合成音声、BGMまでを一貫制作。AIプロンプト工学の極致を使いこなし、ブランドに合わせたコンテンツを無限に量産する。", 
    tags: ["Kling V3", "DALL-E 3", "Suno", "動画プロデュース"] 
  },
  { 
    icon: LineChart, 
    title: "市場分析・バズ予測", 
    desc: "Google TrendsやSNSから「明日売れるもの」を予測。時系列解析AIを用いて底値を特定し、楽天等のEC在庫と連動させる物販・リサーチ戦略を展開。", 
    tags: ["トレンド解析", "価格予測", "競合調査", "市場プロファイリング"] 
  },
  { 
    icon: Shield, 
    title: "セキュリティ・インフラ管理", 
    desc: "CompTIA Security+等に裏打ちされた堅牢なシステム設計。独自ドメインのSSL化、APIキーの秘匿管理、Google公式OAuth検証の突破など、プロの信頼を提供。", 
    tags: ["Security+", "Network+", "OAuth検証", "サーバー保守"] 
  },
  { 
    icon: Users, 
    title: "心理戦略・婚活コンサル", 
    desc: "上級心理カウンセラーとして、人間関係の深層心理を分析。マリッジロードジャパン（IBJ加盟）の運営を通じて、データと心理を融合させた成婚戦略を立案する。", 
    tags: ["心理カウンセリング", "婚活戦略", "NPS向上", "コーチング"] 
  },
  { 
    icon: Mail, 
    title: "AIコミュニケーション代行", 
    desc: "数千通のメールやDMをAIが精密解析。相手のトーンに合わせた最適な返信案の作成、重要度の自動判定、下書き同期までを完全自動化。レスポンス速度を極限化。", 
    tags: ["Gmail自動化", "Slack連携", "カスタマーサクセス"] 
  },
  { 
    icon: Smartphone, 
    title: "モバイル・AR体験設計", 
    desc: "空間をスマホでスキャンし、AIがリアルタイムに情報を付与。インテリアARや拾得物のAI鑑定など、物理世界とデジタルを融合させた「本物」のUXを構築。", 
    tags: ["ARCore連携", "モバイル最適化", "ビジュアル鑑定"] 
  },
];

const MASTER_MODELS = [
  { id: 'staysee-ai-finder', name: 'Staysee AI Finder', version: 'v3.4', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Building2 },
  { id: 'inbox-organizer', name: 'Gmail AI Accelerator', version: 'v5.0', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Mail },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', version: 'v2.0', color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Briefcase },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', version: 'v7.0', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Wallet },
  { id: 'disaster-guard', name: 'AI防災パーソナルガイド', version: 'v6.0', color: 'text-sky-500', bg: 'bg-sky-500/10', icon: Shield },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', version: 'v2.1', color: 'text-red-500', bg: 'bg-red-500/10', icon: Youtube },
];

const CAREER = [
  { year: "2008 - 2023", company: "大手ITグループ企業（富士通系列）", role: "PCキッティングリーダー・営業事務（15年勤務）" },
  { year: "2023 - 2024", company: "ITソリューション開発企業", role: "IoT導入支援エンジニア（Python / API連携 / システム構築）" },
  { year: "2024 - 現在", company: "NextraLabs / マリッジロードジャパン", role: "代表（AIマスタツール開発・結婚相談所運営）" },
];

// --- コンポーネント ---

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32 overflow-x-hidden text-left selection:bg-emerald-500/30">
      
      {/* 🌌 Hero: Identity Node */}
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)]" />
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <Badge className="bg-emerald-600 text-white font-black italic px-8 py-2 rounded-full uppercase text-xs tracking-[0.4em] shadow-lg animate-pulse">Master Portfolio v2.6</Badge>
          <div className="space-y-4">
             <h1 className="text-7xl md:text-[10rem] font-black text-white italic tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
               {IDENTITY.name}
             </h1>
             <p className="text-xl md:text-4xl font-black text-emerald-400 italic uppercase tracking-widest pl-2">{IDENTITY.alias}</p>
          </div>
          <div className="space-y-8">
            <p className="text-2xl md:text-5xl font-black text-white italic leading-tight tracking-tighter">
              {IDENTITY.motto}
            </p>
            <p className="text-lg md:text-xl text-slate-400 font-bold max-w-4xl mx-auto leading-relaxed border-l-4 border-emerald-500 pl-8 text-left py-4 bg-white/5 rounded-r-3xl">
              {IDENTITY.description}
            </p>
          </div>
        </div>
      </section>

      {/* 📊 Stats Grid */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#13141f] border-4 border-white/5 p-10 rounded-[3rem] text-center shadow-2xl group hover:border-emerald-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-20" />
            <p className="text-7xl font-black text-white italic mb-2 tracking-tighter group-hover:text-emerald-400 transition-colors">{s.value}</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">{s.label}</p>
          </div>
        ))}
      </section>

      {/* 🎯 Core Values */}
      <section className="max-w-6xl mx-auto px-4 mb-40">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {CORE_VALUE.map(v => (
              <div key={v.title} className="space-y-4">
                 <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500"><v.icon /></div>
                 <h3 className="text-xl font-black text-white italic uppercase">{v.title}</h3>
                 <p className="text-sm text-slate-500 font-bold leading-relaxed">{v.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 🛠️ Skills Section: Core Expertise */}
      <section className="max-w-7xl mx-auto px-4 space-y-16 mb-48">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[16px] border-emerald-500 pl-10">
           <div className="space-y-2">
              <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">Full-Stack Intelligence</h2>
              <p className="text-emerald-500 font-black uppercase tracking-widest italic text-sm">私が「AIと共に」完結させる専門領域</p>
           </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map(s => (
            <Card key={s.title} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/50 transition-all group flex flex-col h-full">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border-2 border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                <s.icon className="text-emerald-500" size={28} />
              </div>
              <h3 className="text-xl font-black text-white italic mb-4 uppercase leading-tight group-hover:text-emerald-400 transition-colors">{s.title}</h3>
              <p className="text-slate-500 font-bold text-xs leading-relaxed mb-8 flex-1">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => <Badge key={t} variant="secondary" className="bg-black text-[9px] font-black text-slate-400 border border-white/5 py-1">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 💼 Career Timeline */}
      <section className="max-w-4xl mx-auto px-4 space-y-16 mb-48">
         <h2 className="text-4xl font-black text-white italic uppercase text-center tracking-tighter">Career Journey</h2>
         <div className="space-y-10 relative">
            <div className="absolute left-[23px] top-4 bottom-0 w-0.5 bg-white/5 md:left-[135px]" />
            {CAREER.map((c, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-16 items-start group relative">
                 <p className="text-xl font-black text-emerald-500 italic w-40 shrink-0 md:text-right pt-1">{c.year}</p>
                 <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-emerald-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <div className="w-2 bg-emerald-500 h-2 rounded-full" />
                 </div>
                 <div className="flex-1 pb-4">
                    <h3 className="text-2xl font-black text-white uppercase italic leading-none">{c.company}</h3>
                    <p className="text-slate-400 font-bold mt-3 leading-relaxed border-l-2 border-white/10 pl-6">{c.role}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 💎 MASTER MODELS */}
      <section id="tools" className="max-w-6xl mx-auto px-4 space-y-16 mb-48">
        <div className="flex items-center justify-between px-4">
           <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase border-l-8 border-blue-600 pl-8 tracking-tighter leading-none">Command Assets</h2>
           <Link href="/products" className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-[0.3em] italic">Enter Intelligence Hub ➔</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASTER_MODELS.map((model) => (
            <Link key={model.id} href={`/products/${model.id}/app`}>
              <Card className="bg-black border-4 border-emerald-500/50 rounded-[2.5rem] p-10 hover:scale-[1.03] hover:border-emerald-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-56 flex flex-col justify-center text-left">
                <div className="absolute top-0 right-10 bg-emerald-500 text-slate-950 text-[8px] font-black px-3 py-0.5 rounded-b-xl uppercase tracking-tighter shadow-lg">Verified Node</div>
                <div className="flex items-center gap-8 text-left">
                  <div className={`w-20 h-20 ${model.bg} ${model.color} rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform border-2 border-white/5`}>
                    <model.icon size={40} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-white italic leading-tight group-hover:text-emerald-400 transition-colors uppercase">{model.name}</h3>
                    <p className="text-[11px] font-bold text-slate-600 mt-2 uppercase tracking-widest italic text-left pl-0">Status: ONLINE (v.MASTER)</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 💼 Real Works (Combined AI Output) */}
      <section className="max-w-6xl mx-auto px-4 space-y-16 mb-48 text-left text-left">
        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase border-l-8 border-amber-500 pl-8 tracking-tighter">Mission Archive</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {WORKS.map(w => (
             <div key={w.title} className="bg-[#13141f] p-12 rounded-[3rem] border border-white/5 shadow-inner hover:bg-white/5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-30 group-hover:opacity-100 transition-opacity" />
                <Badge className="bg-amber-600/10 text-amber-500 border-amber-500/20 mb-8 uppercase font-black italic px-4 py-1 text-xs"># {w.tag}</Badge>
                <h3 className="text-3xl font-black text-white italic mb-4 leading-tight">{w.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed text-lg italic pl-4 border-l border-white/10">{w.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 📬 Contact */}
      <section id="contact" className="max-w-4xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Terminal size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-8 text-center">
            <h3 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">Execute Your Idea</h3>
            <p className="text-emerald-100 text-lg md:text-2xl font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center italic">
              「指示したら、あとは全部やる」<br/>その実行力を、あなたのビジネスに。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
               <a href="mailto:f.yoneyone9@gmail.com" className="h-16 px-10 bg-white text-emerald-700 font-black rounded-2xl flex items-center gap-4 hover:bg-emerald-50 transition-all uppercase italic shadow-xl text-xl">
                 <Mail size={28} /> Email Admin
               </a>
               <a href="https://x.com/0022_sougo" target="_blank" className="h-16 px-10 bg-black/30 text-white font-black rounded-2xl flex items-center gap-4 hover:bg-black/50 border-4 border-white/10 transition-all uppercase italic text-xl">
                 <Zap size={28} /> 𝕏 Command
               </a>
            </div>
          </div>
        </Card>
      </section>

      <div className="text-center opacity-10 mt-24 font-black uppercase tracking-[0.5em] italic text-[10px]">
        {IDENTITY.name} • NEXTRALABS MASTERMODEL • 2026
      </div>
    </div>
  );
};

const PortPageWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Syncing Master Identity...</div>
})

export default function PortPage() {
  return <PortPageWithNoSSR />;
}
