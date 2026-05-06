import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Mail, Briefcase, Wallet, Shield, Building2, Youtube, Table, UserPlus, Sofa, Play, Zap } from 'lucide-react'

export const metadata = {
  title: 'AIツール説明・ディレクトリ | NextraLabs',
  description: 'NextraLabsが提供する最新AIツールの詳細解説。あなたのビジネスと生活を革新するマスタモデルを紹介します。',
}

const TOOL_DIRECTORY = [
  { id: 'staysee-ai-finder', name: 'Staysee AI Finder', desc: 'ホテル・民泊の忘れ物対応をAIで完全自動化。', icon: Building2, color: 'text-emerald-500' },
  { id: 'inbox-organizer', name: 'Gmail AI Accelerator', desc: 'Gmailの未読をAIが爆速で整理・返信案作成。', icon: Mail, color: 'text-blue-500' },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', desc: 'あなたに最適なAI副業を診断し、成功への地図を作成。', icon: Briefcase, color: 'text-indigo-500' },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', desc: 'カメラ解析で衝動買いを物理的に阻止する最強の盾。', icon: Wallet, color: 'text-amber-500' },
  { id: 'disaster-guard', name: 'AI防災パーソナルガイド', desc: 'GPSと連動し、今この場所の生存戦略をAIが立案。', icon: Shield, color: 'text-sky-500' },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', desc: 'トレンドと戦略からバズる動画台本を全自動生成。', icon: Youtube, color: 'text-red-500' },
];

export default function ToolGuidePage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <div className="max-w-6xl mx-auto px-4 py-20 space-y-16">
        <div className="text-center space-y-6">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-xs">Directory</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">ツール説明</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-bold italic">
            NextraLabsが誇る「本物」のAIマスタモデル群。その詳細な機能と革新的な価値を解説します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TOOL_DIRECTORY.map((tool) => (
            <Link key={tool.id} href={`/products/${tool.id}`}>
              <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-8 hover:border-emerald-500/50 transition-all group shadow-2xl relative overflow-hidden h-64 flex flex-col justify-center">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 bg-white/5 ${tool.color} rounded-[2rem] flex items-center justify-center border-2 border-white/5 group-hover:scale-110 transition-transform shadow-inner`}>
                    <tool.icon size={40} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white italic uppercase mb-2 group-hover:text-emerald-400 transition-colors">{tool.name}</h3>
                    <p className="text-slate-400 text-sm font-bold leading-relaxed">{tool.desc}</p>
                    <div className="flex items-center gap-2 mt-4 text-emerald-500 text-[10px] font-black uppercase tracking-widest italic">
                      View Detailed LP <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
