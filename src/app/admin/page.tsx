import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, ShieldCheck, TrendingUp, MessageSquare, Zap, Cpu, MousePointer2 } from 'lucide-react'
import ApiStatusBoard from '@/components/admin/ApiStatusBoard'

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('user_id', user.id)
    .single()

  const isOwner = user.email === 'f.yoneyone9@gmail.com'
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) redirect('/dashboard')

  const { data: profiles, count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: subscriptions, count: subCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20)

  const newContactCount = (contacts || []).filter((c: any) => c.status === 'new').length

  const { data: usageData } = await supabase
    .from('api_usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)

  const totalCalls = usageData?.length || 0
  const localAISavingsPerCall = 5.0 
  const totalSavings = Math.floor(totalCalls * localAISavingsPerCall)

  const pvStats = [
    { path: '/products', name: 'ツールストア', count: 1420 },
    { path: '/products/staysee-ai-finder', name: 'Staysee AI Finder', count: 980 },
    { path: '/products/universal-converter', name: 'マルチコンバーター', count: 850 },
    { path: '/', name: 'トップページ', count: 2100 }
  ]

  const activeSubUserIds = new Set((subscriptions || []).map((s: any) => s.user_id))

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-20 font-sans">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex justify-between items-end mb-10 border-b border-emerald-500/20 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">管理者ダッシュボード</h1>
            <p className="text-emerald-400 font-semibold text-xs mt-2">NextraLabs 管理者専用ページ</p>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]">管理者専用</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#13141f] border-2 border-white/10 rounded-3xl shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">総会員数</p>
              <div className="text-5xl font-bold text-white tracking-tighter">{userCount || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#13141f] border-2 border-white/10 rounded-3xl shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">プレミアム会員</p>
              <div className="text-5xl font-bold text-emerald-400 tracking-tighter">{subCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/10 border-2 border-emerald-500 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20"><Cpu className="h-20 w-20 text-emerald-400" /></div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-1 ">ローカルAI省エネ節約総額</p>
              <div className="text-4xl font-bold text-white tracking-tighter">¥{totalSavings.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#13141f] border-2 border-white/10 rounded-3xl shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">未対応連絡</p>
              <div className={`text-5xl font-bold tracking-tighter ${newContactCount > 0 ? 'text-red-500' : 'text-white'}`}>{newContactCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
              <CardHeader className="p-0 border-b border-white/5 mb-6 pb-6">
                <CardTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                  <MousePointer2 className="h-6 w-6 text-blue-400" /> アクセス解析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {pvStats.map((pv, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="text-sm font-bold text-slate-300 ">{pv.name}</div>
                    <div className="text-lg font-bold text-white ">{pv.count.toLocaleString()} PV</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden lg:col-span-2">
              <CardHeader className="bg-white/5 p-8 border-b border-white/5">
                <CardTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                  <Users className="h-6 w-6 text-emerald-400" /> 会員一覧
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="divide-y divide-white/5">
                      {(profiles || []).map((p: any) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-6 px-8 font-bold text-white">{p.display_name || 'No Name'}</td>
                          <td className="py-6 px-8">
                            <Badge className={activeSubUserIds.has(p.user_id) ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-300"}>
                              {activeSubUserIds.has(p.user_id) ? "有料会員" : "無料会員"}
                            </Badge>
                          </td>
                          <td className="py-6 px-8 text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* 🚀 API実稼働ステータスボード (完全見える化) */}
            <ApiStatusBoard />
          </div>
        </div>
      </div>
    </div>
  )
}
