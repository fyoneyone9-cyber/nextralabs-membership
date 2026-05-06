'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
// 外部UIパーツのインポートを最小限にする
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, ArrowRight, Sparkles, Mail, 
  Briefcase, Wallet, Shield, Building2, Youtube,
  Terminal, UserCheck, Target, Search, Code, CheckCircle2, 
  Phone, Archive, Spreadsheet, Network, MessageSquare, Video,
  Sofa, Play, Scissors, Icons, MapPin, Globe
} from 'lucide-react'

// 各マスタツールのリスト
const MASTER_MODELS = [
  { id: 'staysee-ai-finder', name: 'Staysee AI Finder', version: 'v3.4', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Building2 },
  { id: 'inbox-organizer', name: 'Gmail AI Accelerator', version: 'v5.0', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Mail },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', version: 'v2.0', color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Briefcase },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', version: 'v7.0', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Wallet },
  { id: 'disaster-guard', name: 'AI防災パーソナルガイド', version: 'v6.0', color: 'text-sky-500', bg: 'bg-sky-500/10', icon: Shield },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', version: 'v2.1', color: 'text-red-500', bg: 'bg-red-500/10', icon: Youtube },
  { id: 'expense-sync', name: 'Expense Sync', version: 'v1.0', color: 'text-teal-500', bg: 'bg-teal-500/10', icon: Zap },
  { id: 'contact-sync', name: 'Contact Sync', version: 'v1.0', color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: UserCheck },
  { id: 'interior-coordinator', name: 'Interior Sync', version: 'v1.0', color: 'text-teal-400', bg: 'bg-teal-400/10', icon: Sofa },
  { id: 'youtube-coordinator', name: 'YouTube Sync', version: 'v1.0', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: Play },
];

const STATS = [
  { label: "対応可能な業務種", value: "15+" },
  { label: "最速納品実績", value: "24h" },
  { label: "自動化できる業務", value: "∞" }
];

const SKILLS = [
  { icon: Search, title: "情報収集・リサーチ", desc: "競合分析・市場調査・ファクトチェック。", tags: ["Web検索", "競合分析", "深層調査"] },
  { icon: Code, title: "Web開発・本番デプロイ", desc: "API設計・構築・独自ドメイン公開。", tags: ["HTML/JS", "Python", "Node.js"] },
  { icon: Sparkles, title: "AIコンテンツ制作", desc: "画像・動画・音声・スライドの高品質制作。", tags: ["DALL-E", "Kling", "Suno"] },
  { icon: Zap, title: "業務自動化・定期実行", desc: "レポート生成・通知・データ収集の全自動化。", tags: ["Slack通知", "Webhook", "Cron"] },
];

const WORKS = [
  { title: "毎朝のニュース要約・配信", desc: "指定テーマのニュースを毎朝収集・まとめて、Slack等で定期配信。", tag: "リサーチ" },
  { title: "競合調査・分析レポート", desc: "競合他社のWebサイト・SNS・ニュースを調査・分析。", tag: "分析" },
  { title: "AI画像・動画・音声制作", desc: "AIを活用してプロ品質のマルチメディアコンテンツを生成。", tag: "AI生成" },
  { title: "SNSアイデア自動発掘", desc: "XやTikTokから「あったらいいな」を自動収集しスコアリング。", tag: "SaaS発掘" },
];

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32 overflow-x-hidden text-left">
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)]" />
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <Badge className="bg-emerald-600 text-white font-black italic px-6 py-1.5 rounded-full uppercase text-xs tracking-[0.3em] shadow-lg animate-pulse">Master Portfolio v2.0</Badge>
          <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter leading-none">米山 文貴</h1>
          <p className="text-xl md:text-2xl font-bold text-slate-400 italic max-w-3xl mx-auto leading-relaxed">「指示したら、あとは全部やってくれる人」</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] text-center shadow-xl group hover:border-emerald-500/30 transition-all">
            <p className="text-6xl font-black text-white italic mb-2 tracking-tighter group-hover:text-emerald-400">{s.value}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 space-y-16 mb-40">
        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase border-l-8 border-emerald-500 pl-8">Core Skills</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {SKILLS.map(s => (
            <Card key={s.title} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl hover:border-emerald-500/50 transition-all group">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border-2 border-white/5 group-hover:scale-110 transition-transform">
                <s.icon className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white italic mb-4 uppercase">{s.title}</h3>
              <p className="text-slate-400 font-bold leading-relaxed mb-8">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map(t => <Badge key={t} variant="secondary" className="bg-black/40 text-slate-500 border-0">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 space-y-16 mb-40">
        <div className="flex items-center justify-between">
           <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase border-l-8 border-blue-600 pl-8">Master Models</h2>
           <Link href="/products" className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest italic">View Catalog ➔</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASTER_MODELS.map((model) => (
            <Link key={model.id} href={`/products/${model.id}/app`}>
              <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[2.5rem] p-8 hover:scale-[1.03] hover:border-emerald-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-52 flex flex-col justify-center">
                <div className="absolute top-0 right-8 bg-emerald-500 text-slate-950 text-[8px] font-black px-3 py-0.5 rounded-b-lg uppercase tracking-tighter shadow-lg">Verified</div>
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 ${model.bg} ${model.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <model.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic leading-tight group-hover:text-emerald-400 transition-colors uppercase">{model.name}</h3>
                    <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest italic text-left">Node Status: v.MASTER</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 space-y-16 mb-40 text-left">
        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase border-l-8 border-amber-500 pl-8">Past Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {WORKS.map(w => (
             <div key={w.title} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-inner hover:bg-white/10 transition-all group">
                <Badge className="bg-amber-600/10 text-amber-500 border-amber-500/20 mb-6 uppercase font-black italic">{w.tag}</Badge>
                <h3 className="text-2xl font-black text-white italic mb-4 leading-tight">{w.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed">{w.desc}</p>
             </div>
           ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 text-center">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Terminal size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Ready to Automate?</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4">あなたのアイデアに、AIの知能と実行力を。</p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
               <a href="mailto:f.yoneyone9@gmail.com" className="h-16 px-10 bg-white text-emerald-700 font-black rounded-xl flex items-center gap-3 hover:bg-emerald-50 transition-all uppercase italic shadow-xl">Email Admin</a>
               <a href="https://x.com/0022_sougo" target="_blank" className="h-16 px-10 bg-black/30 text-white font-black rounded-xl flex items-center gap-3 hover:bg-black/50 border-2 border-white/20 transition-all uppercase italic">Direct Command (𝕏)</a>
            </div>
          </div>
        </Card>
      </section>

      <div className="text-center opacity-10 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">米山 文貴 • NextraLabs MASTERMODEL • 2026</div>
    </div>
  );
};

const PortPageWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Master Port...</div>
})

export default function PortPage() {
  return <PortPageWithNoSSR />;
}
