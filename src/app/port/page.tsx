'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, ArrowRight, Sparkles, Mail, Briefcase, Wallet, Shield, Building2, Youtube,
  Terminal, Search, Code, CheckCircle2, Cpu, Rocket, HeartHandshake, LineChart, Camera, Bot
} from 'lucide-react'

const IDENTITY = {
  name: "米山 文貴",
  alias: "代表 / NextraLabs (Ninja3)",
  motto: "「指示したら、あとは全部やってくれる人」",
  description: "大手ITグループ企業での15年に及ぶ実務経験と、最先端の生成AI知能を融合。Pythonによるシステム開発、IoT導入支援、AIによるメディア制作から、心理戦略に基づいた事業運営まで。NextraLabsのAIリソースを駆使し、企画・開発・運用を一人で完結させる圧倒的な機動力を提供します。",
  base: "神奈川県 海老名市"
};

const STATS = [
  { label: "IT業界実務経験", value: "20年+" },
  { label: "稼働中のAIマスタ機", value: "22基" },
  { label: "開発・制作速度", value: "10倍速" }
];

const SKILLS = [
  { icon: Code, title: "超速フルスタック開発", desc: "Python/Node.jsを主軸に、API設計からDB構築、デプロイまでを数日で完結。" },
  { icon: Zap, title: "業務自動化・RPA", desc: "15年の組織実務をAIで自動化。Slack、Google WorkspaceをAPIで繋ぎ資産化。" },
  { icon: Sparkles, title: "AIマルチメディア", desc: "動画、3D映像、プロ級画像、楽曲生成。制作会社1社分のアウトプットを量産。" },
  { icon: LineChart, title: "市場分析・バズ予測", desc: "トレンドから「明日売れるもの」を予測。時系列解析AIでEC在庫と連動。" }
];

const WORKS = [
  { 
    title: "AIマスタツール群の構築", 
    desc: "Gemini 2.5 Flashをエンジンとした13種の業務自動化ツールをフルスクラッチ開発。決済・認証・RAGを統合した独自プラットフォーム。", 
    tag: "フルスタックAI",
    icon: Bot
  },
  { 
    title: "リアルタイム市場解析", 
    desc: "GNews API & Google Trendsを解析し、収益機会を自動特定するアルゴリズムを構築。楽天・Amazon在庫との同期を実現。", 
    tag: "データ分析",
    icon: LineChart
  },
  { 
    title: "IoT / スマートシステム", 
    desc: "PythonによるIoTデバイス制御とクラウド連携。宿泊施設のスマートキー（Staysee連携）など、物理世界のAPI制御を実装。", 
    tag: "エンジニアリング",
    icon: Cpu
  },
  { 
    title: "AIコミュニケーション代行", 
    desc: "Gmail APIを高度に自動化。AIによる重要度判定、返信案作成、スケジュール同期により、レスポンス速度を極限化。", 
    tag: "自動化インフラ",
    icon: Mail
  }
];

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32 overflow-x-hidden text-left selection:bg-emerald-500/30">
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)]" />
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <Badge className="bg-emerald-600 text-white font-black italic px-8 py-2 rounded-full uppercase text-xs tracking-widest shadow-lg">Master Portfolio v3.0</Badge>
          <div className="space-y-4 text-center">
             <h1 className="text-7xl md:text-[9rem] font-black text-white italic tracking-tighter leading-none">{IDENTITY.name}</h1>
             <p className="text-xl md:text-3xl font-bold text-emerald-400 italic tracking-widest">{IDENTITY.alias}</p>
          </div>
          <div className="space-y-8">
            <p className="text-2xl md:text-5xl font-black text-white italic leading-tight tracking-tight">{IDENTITY.motto}</p>
            <p className="text-lg md:text-xl text-slate-400 font-bold max-w-4xl mx-auto leading-relaxed border-l-4 border-emerald-500 pl-8 text-left py-4 bg-white/5 rounded-r-3xl">
              {IDENTITY.description}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] text-center shadow-2xl group hover:border-emerald-500/30 transition-all">
            <p className="text-7xl font-black text-white italic mb-2 tracking-tighter group-hover:text-emerald-400">{s.value}</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 space-y-16 mb-48 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[16px] border-emerald-500 pl-10">
           <div className="space-y-2">
              <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Full-Stack Intelligence</h2>
              <p className="text-emerald-500 font-black italic text-sm">私が「AIと共に」完結させる専門領域</p>
           </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map(s => (
            <Card key={s.title} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/50 transition-all group flex flex-col h-full">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border-2 border-white/5 group-hover:scale-110 transition-transform shadow-inner text-emerald-500"><s.icon size={28} /></div>
              <h3 className="text-xl font-black text-white italic mb-4 uppercase leading-tight">{s.title}</h3>
              <p className="text-slate-500 font-bold text-xs leading-relaxed flex-1">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 space-y-16 mb-48 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[16px] border-amber-500 pl-10">
           <div className="space-y-2 text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter text-left">Mission Archive</h2>
              <p className="text-amber-500 font-black italic text-sm text-left">理論ではなく「実装」された実績群</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {WORKS.map(w => (
             <div key={w.title} className="bg-[#13141f] p-12 rounded-[4rem] border-2 border-white/5 shadow-2xl hover:border-amber-500/50 transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform"><w.icon size={32} /></div>
                  <Badge className="bg-amber-600/10 text-amber-500 border-amber-500/20 uppercase font-black italic px-4 py-1 text-xs"># {w.tag}</Badge>
                </div>
                <h3 className="text-3xl font-black text-white italic mb-6 leading-tight text-left">{w.title}</h3>
                <p className="text-slate-400 font-bold leading-relaxed text-lg italic flex-1 text-left">{w.desc}</p>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest italic text-left">
                  <Zap size={12} className="text-amber-500" /> System Active & Verified
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function PortPage() { return <NoSSR />; }
