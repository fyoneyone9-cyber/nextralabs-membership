import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, ShieldCheck, TrendingUp, MessageSquare, Zap, Cpu, Activity, Bell } from 'lucide-react'
import ApiStatusBoard from '@/components/admin/ApiStatusBoard'
import AnalyticsPanel from '@/components/admin/AnalyticsPanel'
import AdminNotifications from '@/components/admin/AdminNotifications'
import SitesMonitorPanel from '@/components/admin/SitesMonitorPanel'

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

  // 未読通知数
  const { count: unreadNotifCount } = await supabase
    .from('admin_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)

  const { data: usageData } = await supabase
    .from('api_usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)

  const totalCalls = usageData?.length || 0
  const localAISavingsPerCall = 5.0 
  const totalSavings = Math.floor(totalCalls * localAISavingsPerCall)

  const activeSubUserIds = new Set((subscriptions || []).map((s: any) => s.user_id))

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-20 font-sans">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex justify-between items-end mb-10 border-b border-emerald-500/20 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">管理者ダッシュボード</h1>
            <p className="text-emerald-400 font-semibold text-xs mt-2">NextraLabs 管理者専用ページ</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/products/vercel-monitor/app">
              <Button variant="outline" className="h-9 gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 text-sm font-semibold rounded-lg transition-all">
                <Activity className="h-4 w-4" /> Vercel Fleet Monitor
              </Button>
            </Link>
            {(unreadNotifCount || 0) > 0 && (
              <div className="relative">
                <Bell className="h-6 w-6 text-emerald-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              </div>
            )}
            <Badge className="bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]">管理者専用</Badge>
          </div>
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
            <AnalyticsPanel />

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
            {/* 🌐 3大サイト監視パネル */}
            <SitesMonitorPanel />
            {/* 🔔 管理者通知パネル */}
            <AdminNotifications />
            {/* 🚀 API実稼働ステータスボード (完全見える化) */}
            <ApiStatusBoard />
          </div>
        </div>
      </div>
    </div>
  )
}
