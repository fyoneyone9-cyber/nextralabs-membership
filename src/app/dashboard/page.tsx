import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, Crown, User, ArrowRight, Rocket, Search, Network, 
  ShieldAlert, Store, Mail, Briefcase, Wallet, Shield, Building2, 
  Zap, Sparkles, Youtube, CheckCircle2
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const plan = subscription?.plan
  const planDisplay = plan === 'premium' ? 'プレミアム会員' : plan === 'standard' ? 'スタンダード会員' : plan === 'light' ? 'ライト会員' : '無料会員'
  const toolCount = plan === 'premium' ? 19 : plan === 'standard' ? 12 : plan === 'light' ? 4 : 2
  const isPremium = plan === 'premium'

  // 5大マスタツール + 特選ツール
  const quickTools = [
    { id: 'staysee-ai-finder', name: 'Staysee AI Finder', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', isModel: true },
    { id: 'comp-price-monitor', name: '競合価格AI監視', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', isModel: true },
    { id: 'sns-auto-poster', name: 'AI SNSオートポスター', icon: Share2, color: 'text-rose-500', bg: 'bg-rose-500/10', isModel: true },
    { id: 'evidence-manager', name: 'AI エビデンス・マネージャー', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', isModel: true },
    { id: 'hotel-affiliate', name: 'アフィリエイトAI連携', icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-400/10', isModel: true },
    { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', isModel: true },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <Badge variant="outline" className="px-4 py-1 text-xs font-black uppercase tracking-widest text-emerald-500 border-emerald-500/20">ダッシュボード</Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              Welcome, {profile?.display_name || 'ゲスト様'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${isPremium ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'} px-6 py-2 font-black italic uppercase rounded-xl shadow-lg border-0`}>
              {planDisplay}
            </Badge>
            {profile?.role === 'admin' && (
              <Badge variant="secondary" className="bg-blue-600 text-white font-black italic px-4 py-2 rounded-xl">管理者</Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] shadow-xl overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">利用可能なツール</CardTitle>
              <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white italic leading-none">{toolCount} <span className="text-sm not-italic opacity-30 tracking-widest">機起動中</span></div>
            </CardContent>
          </Card>

          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">現在のプラン</CardTitle>
              <Crown className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white italic uppercase leading-none">{planDisplay}</div>
              {!isPremium && (
                <Link href="/pricing" className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 underline mt-2 inline-block uppercase tracking-widest italic">プランをアップグレード →</Link>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">ログインアカウント</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-white truncate">{user.email}</div>
              <Link href="/profile" className="text-[10px] font-black text-slate-600 hover:text-white underline mt-2 inline-block uppercase tracking-widest italic">プロフィール編集 →</Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Tools */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="font-black italic uppercase tracking-tighter text-2xl flex items-center gap-3">
               <Rocket className="h-6 w-6 text-emerald-500" />
               マスタツール・アクセス
             </h3>
             <Link href="/products" className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest italic">全ツールを見る ➔</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={`/products/${tool.id}/app`}>
                  <div className={`relative h-32 p-6 rounded-[2rem] border-2 transition-all group overflow-hidden ${tool.isModel ? 'bg-black border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:scale-[1.03] hover:border-emerald-500' : 'bg-[#13141f] border-white/5 hover:border-white/10'}`}>
                    {tool.isModel && (
                      <div className="absolute top-0 right-6 bg-emerald-500 text-slate-950 text-[8px] font-black px-3 py-0.5 rounded-b-lg uppercase tracking-tighter shadow-lg">Master</div>
                    )}
                    <div className="flex items-start gap-4 h-full">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tool.bg} flex-shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-lg font-black text-white italic leading-tight group-hover:text-emerald-400 transition-colors uppercase truncate">{tool.name}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 italic">ツールを起動する ➔</p>
                      </div>
                    </div>
                    {/* Background Decorative Icon */}
                    <Icon className={`absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0`} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-emerald-500/50 transition-all">
                  <BookOpen className="h-10 w-10 text-slate-500 group-hover:text-emerald-400 transition-colors" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">使い方ガイド</h3>
                 <p className="text-xs font-bold text-slate-500 italic max-w-xs mx-auto">
                   NextraLabsの全ての機能を使いこなすための完全マニュアル。
                 </p>
               </div>
               <Link href="/guide" className="w-full">
                 <Button className="w-full h-16 bg-white text-slate-950 font-black italic rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest">
                   ガイドを開く ↗
                 </Button>
               </Link>
            </div>
          </Card>

          {!isPremium ? (
            <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 border-0 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 text-white"><Sparkles className="h-40 w-40" /></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                 <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                    <Crown className="h-10 w-10 text-white animate-bounce" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">マスタアクセス</h3>
                   <p className="text-xs font-bold text-emerald-100/70 italic max-w-xs mx-auto">
                     全ての制限を解除し、マスタモデルの真価を解放しましょう。
                   </p>
                 </div>
                 <Link href="/pricing" className="w-full">
                   <Button className="w-full h-16 bg-white text-emerald-700 font-black italic rounded-2xl shadow-xl hover:bg-emerald-100 transition-all active:scale-95 uppercase tracking-widest border-0">
                     プランをアップグレード ➔
                   </Button>
                 </Link>
              </div>
            </Card>
          ) : (
            <Card className="bg-emerald-600/5 border-4 border-emerald-500/30 rounded-[3rem] p-10 shadow-inner relative overflow-hidden">
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">稼働ステータス</h3>
                    <p className="text-xs font-bold text-emerald-400 italic uppercase tracking-[0.2em]">
                      すべてのマスタノードが同期中
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold italic mt-4 uppercase">
                      NextraLabs Premium Intelligence Service
                    </p>
                  </div>
               </div>
            </Card>
          )}
        </div>

        <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px]">
           Operational OS • NextraLabs MASTERMODEL • 2026
        </div>
      </div>
    </div>
  )
}
