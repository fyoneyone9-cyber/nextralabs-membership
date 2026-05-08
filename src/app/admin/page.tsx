import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CreditCard, ShieldCheck, TrendingUp, MessageSquare } from 'lucide-react'

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') redirect('/dashboard')

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

  // 購入一覧
  const { data: purchases, count: purchaseCount } = await supabase
    .from('purchases')
    .select('*', { count: 'exact' })
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(50)

  // お問い合わせ一覧
  const { data: contacts, count: contactCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20)

  const newContactCount = (contacts || []).filter((c: any) => c.status === 'new').length

  // サブスク中のuser_idセット
  const activeSubUserIds = new Set(
    (subscriptions || []).map((s: any) => s.user_id)
  )

  // 購入のuser_id → product_idマップ
  const purchaseMap = new Map<string, string[]>()
  for (const p of purchases || []) {
    const list = purchaseMap.get(p.user_id) || []
    list.push(p.product_id)
    purchaseMap.set(p.user_id, list)
  }

  const productNames: Record<string, string> = {
    'vintage-hunter': '古着ハンター',
    'pet-translator': 'ペット翻訳',
    'office-politics-graph': '社内政治相関図',
  }

  // ツール利用統計 (api_usage)
  const { data: usageData } = await supabase
    .from('api_usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // ツールIDごとの合計利用回数集計
  const usageStats = (usageData || []).reduce((acc: any, curr: any) => {
    acc[curr.tool_id] = (acc[curr.tool_id] || 0) + 1
    return acc
  }, {})

  const toolDisplayNames: Record<string, string> = {
    'universal-converter': '究極AIマルチコンバーター',
    'staysee-ai-finder': 'Staysee AI Finder',
    'inbox-organizer': 'Gmail AI Accelerator',
    'ai-exam-generator': 'AI問題生成 & 苦手分析',
    ...productNames
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Nextra Admin Central</h1>
          <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs italic">Management Dashboard • MASTERMODEL Quality</p>
        </div>
        <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 font-black italic px-4 py-1">ADMIN ONLY</Badge>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: '総会員数', val: userCount || 0, icon: Users, color: 'text-blue-400' },
          { label: 'プレミアム会員', val: subCount || 0, icon: ShieldCheck, color: 'text-emerald-400' },
          { label: 'ツール総稼働数', val: (usageData || []).length, icon: TrendingUp, color: 'text-orange-400' },
          { label: '未対応連絡', val: newContactCount, icon: MessageSquare, color: newContactCount > 0 ? 'text-red-400' : 'text-slate-400' }
        ].map((s, i) => (
          <Card key={i} className="bg-[#13141f] border-2 border-white/5 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-3xl font-black italic text-white">{s.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* User List */}
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="text-lg font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" /> 最新の会員登録
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-black/20 text-slate-500 border-b border-white/5">
                      <th className="text-left py-4 px-6 font-black uppercase text-[10px] tracking-widest">Name / ID</th>
                      <th className="text-left py-4 px-6 font-black uppercase text-[10px] tracking-widest">Plan</th>
                      <th className="text-left py-4 px-6 font-black uppercase text-[10px] tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(profiles || []).map((p: any) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">{p.display_name || 'Anonymous User'}</div>
                          <div className="text-[10px] text-slate-500 font-mono tracking-tighter">{p.user_id}</div>
                        </td>
                        <td className="py-4 px-6">
                          {activeSubUserIds.has(p.user_id) ? (
                            <Badge className="bg-emerald-500 text-slate-950 border-0 font-black italic px-2 py-0.5 text-[10px]">PREMIUM</Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-500 border-slate-700 font-bold px-2 py-0.5 text-[10px]">FREE</Badge>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-xs font-bold italic">
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

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Tool Usage Stats */}
          <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-emerald-500/5">
              <CardTitle className="text-lg font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> ツール利用統計
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(usageStats).length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-10 font-bold italic">データ未蓄積</p>
                ) : (
                  Object.entries(usageStats).sort((a: any, b: any) => b[1] - a[1]).map(([tid, count]: any) => (
                    <div key={tid} className="group">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-black text-slate-300 uppercase italic group-hover:text-emerald-400 transition-colors">
                          {toolDisplayNames[tid] || tid}
                        </span>
                        <span className="text-sm font-black text-white italic">{count}回</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                          style={{ width: `${Math.min(100, (count / (usageData || []).length) * 500)}%` }} 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* New Contacts Alert */}
          {newContactCount > 0 && (
            <Card className="bg-red-500/10 border-2 border-red-500 rounded-[2rem] overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <MessageSquare className="h-10 w-10 text-red-500 mb-4 animate-bounce" />
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">未対応の連絡</h3>
                <p className="text-red-500 font-bold italic text-sm mb-6">{newContactCount}件のメッセージが届いています</p>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-black italic uppercase rounded-xl">
                  内容を確認する
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
