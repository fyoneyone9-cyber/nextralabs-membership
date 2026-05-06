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
  Cpu, Rocket, Database, Lock, Layers, BarChart3, Users, HeartHandshake
} from 'lucide-react'

// --- データ定義：米山文貴の「真の実績とスキル」 ---

const IDENTITY = {
  name: "米山 文貴",
  alias: "Ninja3 / NextraLabs 代表",
  motto: "「指示したら、あとは全部やってくれる人」",
  description: "ITエンジニア、経営者、心理カウンセラーの3つの視点を統合。Pythonによる高度な自動化から、AIを活用したクリエイティブ、結婚相談所の運営まで。「アイデアを実行可能な形へ」を最速で具現化します。",
  base: "神奈川県 海老名市"
};

const STATS = [
  { label: "IT業界・実務経験", value: "20y+" },
  { label: "構築したAIツール", value: "22件" },
  { label: "自動化による工数削減", value: "90%" }
];

const CORE_VALUE = [
  { 
    title: "ビジネス × 開発の一気通貫", 
    desc: "15年以上の組織実務と、IoTエンジニアとしてのPython開発経験を融合。経営者の悩みを技術で解決します。",
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
    title: "Python / IoT システム開発", 
    desc: "API連携、IoTソリューション導入、業務効率化スクリプトの構築。複雑なバックエンドを安定稼働させます。", 
    tags: ["Python", "API連携", "IoT導入", "データベース設計"] 
  },
  { 
    icon: Sparkles, 
    title: "次世代 AI コンテンツ制作", 
    desc: "DALL-E 3、Kling V3、ElevenLabs、Suno等を駆使。動画台本から映像・音声まで一貫制作。", 
    tags: ["AI動画制作", "プロンプト工学", "音声合成"] 
  },
  { 
    icon: Zap, 
    title: "業務プロセスの完全自動化", 
    desc: "Google Workspace、Slack、各種Webツールを連携。毎日のルーチンワークをゼロに変える仕組み作り。", 
    tags: ["RPA", "Webhook", "Cron自動化", "業務フロー改善"] 
  },
  { 
    icon: Users, 
    title: "婚活・カウンセリング支援", 
    desc: "マリッジロードジャパン（IBJ正規加盟店）の運営知見を活かした、成婚戦略と心理サポートシステムの構築。", 
    tags: ["婚活戦略", "心理カウンセリング", "NPS向上"] 
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
  { year: "2008 - 2023", company: "PFUクオリティサービス(株)", role: "PCキッティングリーダー・営業事務（15年勤務）" },
  { year: "2023 - 2024", company: "(株)デバイスエージェンシー", role: "IoT導入支援エンジニア（Python / API連携）" },
  { year: "2024 - 現在", company: "NextraLabs / マリッジロードジャパン", role: "代表（AI開発・結婚相談所運営）" },
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
          <Badge className="bg-emerald-600 text-white font-black italic px-6 py-1.5 rounded-full uppercase text-xs tracking-[0.3em] shadow-lg animate-pulse">Master Portfolio v2.5</Badge>
          <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter leading-none">
            {IDENTITY.name}
          </h1>
          <p className="text-xl md:text-3xl font-black text-emerald-400 italic uppercase tracking-widest">{IDENTITY.alias}</p>
          <p className="text-xl md:text-2xl font-bold text-slate-300 italic max-w-3xl mx-auto leading-relaxed">
            {IDENTITY.motto}<br/>
            <span className="text-lg text-slate-500 not-italic">{IDENTITY.description}</span>
          </p>
        </div>
      </section>

      {/* 📊 Stats Grid */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] text-center shadow-xl group hover:border-emerald-500/30 transition-all">
            <p className="text-6xl font-black text-white italic mb-2 tracking-tighter group-hover:text-emerald-400">{s.value}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
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

      {/* 🛠️ Skills Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-16 mb-40">
        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase border-l-8 border-emerald-500 pl-8">Expertise</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {SKILLS.map(s => (
            <Card key={s.title} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl hover:border-emerald-500/50 transition-all group">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border-2 border-white/5 group-hover:scale-110 transition-transform">
                <s.icon className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white italic mb-4 uppercase">{s.title}</h3>
              <p className="text-slate-400 font-bold leading-relaxed mb-8">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map(t => <Badge key={t} variant="secondary" className="bg-black border border-white/5 text-slate-500">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 💼 Career Timeline */}
      <section className="max-w-4xl mx-auto px-4 space-y-16 mb-40">
         <h2 className="text-4xl font-black text-white italic uppercase text-center">Career Journey</h2>
         <div className="space-y-6">
            {CAREER.map((c, i) => (
              <div key={i} className="flex gap-8 items-start group">
                 <p className="text-lg font-black text-emerald-500 italic w-32 shrink-0">{c.year}</p>
                 <div className="flex-1 pb-8 border-l border-white/10 pl-8 group-last:border-l-0">
                    <h3 className="text-xl font-black text-white uppercase italic">{c.company}</h3>
                    <p className="text-slate-500 font-bold mt-1">{c.role}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 💎 MASTER MODELS */}
      <section id="tools" className="max-w-6xl mx-auto px-4 space-y-16 mb-40">
        <div className="flex items-center justify-between">
           <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase border-l-8 border-blue-600 pl-8">Current Assets</h2>
           <Link href="/products" className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest italic">Open Hub ➔</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASTER_MODELS.map((model) => (
            <Link key={model.id} href={`/products/${model.id}/app`}>
              <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[2.5rem] p-8 hover:scale-[1.03] hover:border-emerald-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-52 flex flex-col justify-center">
                <div className="absolute top-0 right-8 bg-emerald-500 text-slate-950 text-[8px] font-black px-3 py-0.5 rounded-b-lg uppercase tracking-tighter shadow-lg">Verified Node</div>
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 ${model.bg} ${model.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <model.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic leading-tight group-hover:text-emerald-400 transition-colors uppercase">{model.name}</h3>
                    <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest italic text-left pl-0">Status: v.MASTER</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 📬 Contact */}
      <section id="contact" className="max-w-4xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Terminal size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-8 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Command the Future</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              あなたのビジネス課題を、Nextra AIの実行力でマスタ化します。<br/>初回の壁打ちは無料です。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
               <a href="mailto:f.yoneyone9@gmail.com" className="h-16 px-10 bg-white text-emerald-700 font-black rounded-xl flex items-center gap-3 hover:bg-emerald-50 transition-all uppercase italic shadow-xl">Email Admin</a>
               <a href="https://x.com/0022_sougo" target="_blank" className="h-16 px-10 bg-black/30 text-white font-black rounded-xl flex items-center gap-3 hover:bg-black/50 border-2 border-white/20 transition-all uppercase italic">𝕏 Command</a>
            </div>
          </div>
        </Card>
      </section>

      <div className="text-center opacity-10 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">
        {IDENTITY.name} • NEXTRALABS MASTERMODEL • 2026
      </div>
    </div>
  );
};

const PortPageWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Syncing Master Port...</div>
})

export default function PortPage() {
  return <PortPageWithNoSSR />;
}
