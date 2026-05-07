'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, ArrowRight, Sparkles, Mail, Briefcase, Wallet, Shield, Building2, Youtube,
  Terminal, Search, Code, CheckCircle2, Cpu, Rocket, HeartHandshake, LineChart, Camera, Bot,
  Globe, Languages, Database, Layout, Presentation, FileText, Share2, Mic, Video, MessageSquare, Headphones,
  Monitor, Keyboard, MousePointer2, GitBranch, TerminalSquare, Boxes, HardDrive, Gauge
} from 'lucide-react'

const IDENTITY = {
  name: "米山 文貴",
  alias: "代表 / NextraLabs (Ninja3)",
  motto: "「指示したら、あとは全部やってくれる人」",
  description: "大手ITグループ企業での実務経験と、Claw Engine（MCP / Computer Use / Auto-Coding）を完全同期。GUIの自動操作、APIのフルスクラッチ構築、大規模リサーチからコンテンツ量産まで。私の背後にはNextraLabsの全AIリソースが常駐しており、アイデアを現実化する速度において他者の追随を許さない。",
  base: "神奈川県 海老名市"
};

const STATS = [
  { label: "IT実務経験", value: "20年+" },
  { label: "稼働中のAIマスタ機", value: "22基" },
  { label: "操作・開発機動力", value: "INFINITE" }
];

const SKILLS = [
  { icon: Monitor, title: "Computer Use (GUI)", desc: "デスクトップOSを直接操作。ネイティブアプリの自動化、Webを介さない業務フローの構築。" },
  { icon: Code, title: "MCP / Auto-Coding", desc: "Clawエンジンによる超速コーディング。API、DB、フロントエンドを自動生成し、即時デプロイ。" },
  { icon: TerminalSquare, title: "エージェント指揮", desc: "複数の自律型エージェントを並列稼働。複雑な大規模プロジェクトを自律的に完結。" },
  { icon: Search, title: "全方位リサーチ", desc: "GenSpark / Webを横断した深層調査。市場動向から競合分析まで、根拠のあるデータを即座に抽出。" },
  { icon: Video, title: "マルチメディア生成", desc: "Kling V3 / Suno等を統制。動画、音楽、ビジュアル制作をAIパイプラインで自動化。" },
  { icon: GitBranch, title: "システム自動統合", desc: "GitHub、Stripe、Gmail、Slack等をAPIで完全同期。人手を介さない自律型ビジネスを構築。" },
  { icon: Shield, title: "セキュア・インフラ", desc: "Security+に裏打ちされた堅牢な設計。OAuth検証の突破やAPIキーの秘匿管理を徹底。" },
  { icon: Rocket, title: "スーパーエージェント", desc: "「指示」を「成果物」へ。企画から実装まで、全工程をAI武装で一人で完結。" }
];

const WORKS = [
  { 
    title: "AI MASTERMODEL OS Ecosystem", 
    desc: "Gemini 2.5 Flashをエンジンとした13種の業務自動化ツールをフルスクラッチ開発。決済・認証・RAGを統合した独自プラットフォーム。", 
    tag: "CLAW / FULL-STACK",
    icon: Bot
  },
  { 
    title: "自律型マーケット・インテリジェンス", 
    desc: "GNews & Google Trendsを秒単位で解析。楽天・Amazon在庫との同期を実現し、収益機会を自動特定するアルゴリズムを構築。", 
    tag: "DATA INTELLIGENCE",
    icon: LineChart
  },
  { 
    title: "物理・デジタル同期システム", 
    desc: "PythonによるIoT制御。宿泊施設のスマートキー（Staysee連携）など、デスクトップ操作とAPIを組み合わせた物理世界の制御。", 
    tag: "COMPUTER USE / IoT",
    icon: Cpu
  },
  { 
    title: "AI コミュニケーション・インフラ", 
    desc: "Gmail API & Slackを高度に自動化。AIによる重要度判定、返信案作成、スケジュール同期により、レスポンス速度を「即時」へ。", 
    tag: "AUTO-COMMUNICATION",
    icon: Mail
  }
];

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32 overflow-x-hidden text-left selection:bg-emerald-500/30">
      {/* 🌌 Hero */}
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)]" />
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <Badge className="bg-emerald-600 text-white font-black italic px-8 py-2 rounded-full uppercase text-xs tracking-[0.4em] shadow-lg animate-pulse">Master Portfolio v4.0 FINAL (CLAW)</Badge>
          <div className="space-y-4 text-center">
             <h1 className="text-7xl md:text-[9rem] font-black text-white italic tracking-tighter leading-none">{IDENTITY.name}</h1>
             <p className="text-xl md:text-3xl font-bold text-emerald-400 italic tracking-widest">{IDENTITY.alias}</p>
          </div>
          <div className="space-y-8">
            <p className="text-2xl md:text-5xl font-black text-white italic leading-tight tracking-tight">{IDENTITY.motto}</p>
            <p className="text-lg md:text-xl text-slate-400 font-bold max-w-4xl mx-auto leading-relaxed border-l-4 border-emerald-500 pl-8 text-left py-4 bg-white/5 rounded-r-3xl italic">
              {IDENTITY.description}
            </p>
          </div>
        </div>
      </section>

      {/* 📊 Stats */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] text-center shadow-2xl group hover:border-emerald-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-20" />
            <p className="text-7xl font-black text-white italic mb-2 tracking-tighter group-hover:text-emerald-400 transition-colors">{s.value}</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </section>

      {/* 🛠️ Claw & MCP Skills */}
      <section className="max-w-7xl mx-auto px-4 space-y-16 mb-48 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[16px] border-emerald-500 pl-10">
           <div className="space-y-2">
              <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Core Claw Engine</h2>
              <p className="text-emerald-500 font-black italic text-sm">OS操作から自動開発まで、私が直接「実行」する能力</p>
           </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map(s => (
            <Card key={s.title} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/50 transition-all group flex flex-col h-full">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border-2 border-white/5 group-hover:scale-110 transition-transform shadow-inner text-emerald-500"><s.icon size={28} /></div>
              <h3 className="text-xl font-black text-white italic mb-4 uppercase leading-tight group-hover:text-emerald-400 transition-colors">{s.title}</h3>
              <p className="text-slate-500 font-bold text-xs leading-relaxed flex-1 italic">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 💼 Mission Archive */}
      <section className="max-w-6xl mx-auto px-4 space-y-16 mb-48 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[16px] border-amber-500 pl-10">
           <div className="space-y-2 text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter text-left leading-none">Mission Archive</h2>
              <p className="text-amber-500 font-black italic text-sm text-left">Clawエンジンを駆使し、私が直接「実装・完結」させた実戦実績</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {WORKS.map(w => (
             <div key={w.title} className="bg-[#13141f] p-12 rounded-[4rem] border-2 border-white/5 shadow-2xl hover:border-amber-500/50 transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform"><w.icon size={32} /></div>
                  <Badge className="bg-amber-600/10 text-amber-500 border-amber-500/20 uppercase font-black italic px-4 py-1 text-xs tracking-widest"># {w.tag}</Badge>
                </div>
                <h3 className="text-3xl font-black text-white italic mb-6 leading-tight text-left">{w.title}</h3>
                <p className="text-slate-400 font-bold leading-relaxed text-lg italic flex-1 text-left">{w.desc}</p>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest italic text-left">
                  <Zap size={12} className="text-amber-500" /> Claw Synchronized
                </div>
             </div>
           ))}
        </div>
      </section>

      <div className="text-center opacity-10 mt-24 font-black uppercase tracking-[0.5em] italic text-[10px]">
        {IDENTITY.name} • NEXTRALABS CLAW MASTER • 2026
      </div>
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function PortPage() { return <NoSSR />; }
