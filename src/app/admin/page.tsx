import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, CreditCard, ShieldCheck, TrendingUp, MessageSquare, Zap, Cpu } from 'lucide-react'

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  // ユーザー一覧
  const { data: profiles, count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  // サブスク一覧
  const { data: subscriptions, count: subCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  // お問い合わせ一覧
  const { data: contacts, count: contactCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20)

  const newContactCount = (contacts || []).filter((c: any) => c.status === 'new').length

  // ツール利用統計 (api_usage)
  const { data: usageData } = await supabase
    .from('api_usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  // ⚡ ローカルAI省エネ計算ロジック
  const totalCalls = usageData?.length || 0
  
  // クラウドAPIを使わずローカルAI（Edge処理）で実行したことによるコスト回避額
  // 1処理あたり、クラウドAPI(GPT-4等)比で平均「5円」のコストを浮かせていると定義
  const localAISavingsPerCall = 5.0 
  const totalSavings = Math.floor(totalCalls * localAISavingsPerCall)

  // ツールIDごとの合計利用回数集計
  const usageStats = (usageData || []).reduce((acc: any, curr: any) => {
    acc[curr.tool_id] = (acc[curr.tool_id] || 0) + 1
    return acc
  }, {})

  const activeSubUserIds = new Set((subscriptions || []).map((s: any) => s.user_id))

  const toolDisplayNames: Record<string, string> = {
    'universal-converter': '究極AIマルチコンバーター',
    'staysee-ai-finder': 'Staysee AI Finder',
    'inbox-organizer': 'Gmail AI Accelerator',
    'ai-exam-generator': 'AI問題生成 & 苦手分析'
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-20 font-sans">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex justify-between items-end mb-10 border-b border-emerald-500/20 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Nextra Admin Central</h1>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs italic mt-2">Management Dashboard • Master Quality Control</p>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]">ADMIN ONLY</Badge>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#13141f] border-2 border-white/10 rounded-3xl shadow-xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">総会員数</p>
                <div className="p-2 rounded-xl bg-blue-500/10"><Users className="h-5 w-5 text-blue-400" /></div>
              </div>
              <div className="text-4xl font-black italic text-white tracking-tighter">{userCount || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#13141f] border-2 border-white/10 rounded-3xl shadow-xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">プレミアム会員</p>
                <div className="p-2 rounded-xl bg-emerald-500/10"><ShieldCheck className="h-5 w-5 text-emerald-400" /></div>
              </div>
              <div className="text-4xl font-black italic text-white tracking-tighter">{subCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/10 border-2 border-emerald-500 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20"><Cpu className="h-20 w-20 text-emerald-500" /></div>
              <div className="flex justify-center mb-4 relative z-10">
                <div className="p-3 bg-emerald-500 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)]"><Zap className="h-6 w-6 text-slate-950" /></div>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-1 italic relative z-10">ローカルAI省エネ節約総額</p>
              <div className="text-4xl font-black italic text-white tracking-tighter relative z-10">¥{totalSavings.toLocaleString()}</div>
              <p className="text-[10px] text-emerald-500/60 font-bold uppercase mt-2 tracking-widest italic relative z-10">Local Edge AI Efficiency</p>
            </CardContent>
          </Card>

          <Card className="bg-[#13141f] border-2 border-white/10 rounded-3xl shadow-xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">未対応連絡</p>
                <div className={`p-2 rounded-xl ${newContactCount > 0 ? 'bg-red-500/10' : 'bg-white/5'}`}>
                  <MessageSquare className={`h-5 w-5 ${newContactCount > 0 ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
              </div>
              <div className="text-4xl font-black italic text-white tracking-tighter">{newContactCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5 p-8">
                <CardTitle className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
                  <Users className="h-6 w-6 text-emerald-400" /> 最新の会員登録
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-black/40 text-slate-400 border-b border-white/5">
                        <th className="text-left py-5 px-8 font-black uppercase text-xs tracking-widest">User Details</th>
                        <th className="text-left py-5 px-8 font-black uppercase text-xs tracking-widest">Plan</th>
                        <th className="text-left py-5 px-8 font-black uppercase text-xs tracking-widest">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(profiles || []).map((p: any) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-6 px-8">
                            <div className="font-black text-white text-base">{p.display_name || 'Anonymous User'}</div>
                            <div className="text-[10px] text-slate-500 font-mono tracking-tighter mt-1">{p.user_id}</div>
                          </td>
                          <td className="py-6 px-8">
                            {activeSubUserIds.has(p.user_id) ? (
                              <Badge className="bg-emerald-500 text-slate-950 border-0 font-black italic px-3 py-1 text-[10px] tracking-widest">PREMIUM</Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-400 border-slate-700 font-black px-3 py-1 text-[10px] tracking-widest">FREE</Badge>
                            )}
                          </td>
                          <td className="py-6 px-8 text-white font-black italic text-sm">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString('ja-JP') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-emerald-500/5 p-8">
                <CardTitle className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-emerald-400" /> ツール稼働状況
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {Object.entries(usageStats).length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-10 font-black italic uppercase">No Activity</p>
                  ) : (
                    Object.entries(usageStats).sort((a: any, b: any) => b[1] - a[1]).map(([tid, count]: any) => (
                      <div key={tid} className="group">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-black text-slate-400 uppercase italic group-hover:text-emerald-400 transition-colors">
                            {toolDisplayNames[tid] || tid}
                          </span>
                          <span className="text-base font-black text-white italic">{count} <span className="text-[10px] text-slate-500 uppercase">Calls</span></span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                            style={{ width: `${Math.min(100, (count / (usageData || []).length) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
