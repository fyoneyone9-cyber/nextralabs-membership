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

  // 繝ｦ繝ｼ繧ｶ繝ｼ荳隕ｧ
  const { data: profiles, count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  // 繧ｵ繝悶せ繧ｯ荳隕ｧ
  const { data: subscriptions, count: subCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  // 雉ｼ蜈･荳隕ｧ
  const { data: purchases, count: purchaseCount } = await supabase
    .from('purchases')
    .select('*', { count: 'exact' })
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(50)

  // 縺雁撫縺・粋繧上○荳隕ｧ
  const { data: contacts, count: contactCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20)

  const newContactCount = (contacts || []).filter((c: any) => c.status === 'new').length

  // 繧ｵ繝悶せ繧ｯ荳ｭ縺ｮuser_id繧ｻ繝・ヨ
  const activeSubUserIds = new Set(
    (subscriptions || []).map((s: any) => s.user_id)
  )

  // 雉ｼ蜈･縺ｮuser_id 竊・product_id繝槭ャ繝・  const purchaseMap = new Map<string, string[]>()
  for (const p of purchases || []) {
    const list = purchaseMap.get(p.user_id) || []
    list.push(p.product_id)
    purchaseMap.set(p.user_id, list)
  }

  const productNames: Record<string, string> = {
    'vintage-hunter': '蜿､逹繝上Φ繧ｿ繝ｼ',
    'pet-translator': '繝壹ャ繝育ｿｻ險ｳ',
    'office-politics-graph': '遉ｾ蜀・帆豐ｻ逶ｸ髢｢蝗ｳ',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">邂｡逅・判髱｢</h1>
        <p className="text-muted-foreground">NextraLabs 繧ｹ繝医い邂｡逅・ム繝・す繝･繝懊・繝・/p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">邱上Θ繝ｼ繧ｶ繝ｼ謨ｰ</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">譛画侭莨壼藤謨ｰ</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">蜊伜刀雉ｼ蜈･謨ｰ</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">縺雁撫縺・粋繧上○</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactCount || 0}</div>
            {newContactCount > 0 && (
              <p className="text-xs text-orange-500 font-medium mt-1">閥 譛ｪ蟇ｾ蠢・{newContactCount}莉ｶ</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">雋ｩ螢ｲ荳ｭ繝・・繝ｫ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
          </CardContent>
        </Card>
      </div>

      {/* Contact List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            陶 縺雁撫縺・粋繧上○・域怙譁ｰ20莉ｶ・・            {newContactCount > 0 && (
              <Badge className="bg-orange-500 text-white border-0 text-xs">{newContactCount}莉ｶ 譛ｪ蟇ｾ蠢・/Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(contacts || []).length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">縺ｾ縺縺雁撫縺・粋繧上○縺後≠繧翫∪縺帙ｓ</p>
          ) : (
            <div className="space-y-4">
              {(contacts || []).map((c: any) => (
                <div key={c.id} className={`border rounded-xl p-4 ${c.status === 'new' ? 'border-orange-300 bg-orange-50/50 dark:bg-orange-950/10' : 'border-border'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{c.name}</span>
                      <a href={`mailto:${c.email}`} className="text-sm text-blue-500 hover:underline">{c.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{c.category_label || c.category}</Badge>
                      {c.status === 'new' ? (
                        <Badge className="bg-orange-500 text-white border-0 text-xs">譛ｪ蟇ｾ蠢・/Badge>
                      ) : c.status === 'replied' ? (
                        <Badge className="bg-green-500 text-white border-0 text-xs">霑比ｿ｡貂・/Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">繧ｯ繝ｭ繝ｼ繧ｺ</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{c.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {c.created_at ? new Date(c.created_at).toLocaleString('ja-JP') : '窶・}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>繝ｦ繝ｼ繧ｶ繝ｼ荳隕ｧ・域怙譁ｰ50莉ｶ・・/CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">蜷榊燕</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">繝ｦ繝ｼ繧ｶ繝ｼID</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">繝ｭ繝ｼ繝ｫ</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">繝励Λ繝ｳ</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">雉ｼ蜈･貂医∩</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">逋ｻ骭ｲ譌･</th>
                </tr>
              </thead>
              <tbody>
                {(profiles || []).map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{p.display_name || '窶・}</td>
                    <td className="py-3 px-2 text-muted-foreground font-mono text-xs">{p.user_id?.slice(0, 12)}...</td>
                    <td className="py-3 px-2">
                      {p.role === 'admin' ? (
                        <Badge variant="destructive" className="text-xs">邂｡逅・・/Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">荳闊ｬ</Badge>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {activeSubUserIds.has(p.user_id) ? (
                        <Badge className="bg-green-500 text-white border-0 text-xs">繝励Ξ繝溘い繝</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">辟｡譁・/Badge>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex flex-wrap gap-1">
                        {(purchaseMap.get(p.user_id) || []).map((pid: string) => (
                          <Badge key={pid} variant="secondary" className="text-xs">
                            {productNames[pid] || pid}
                          </Badge>
                        ))}
                        {!(purchaseMap.get(p.user_id) || []).length && (
                          <span className="text-muted-foreground">窶・/span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('ja-JP') : '窶・}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>雉ｼ蜈･螻･豁ｴ・域怙譁ｰ50莉ｶ・・/CardTitle>
        </CardHeader>
        <CardContent>
          {(purchases || []).length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">縺ｾ縺雉ｼ蜈･螻･豁ｴ縺後≠繧翫∪縺帙ｓ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">繝・・繝ｫ</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">繝ｦ繝ｼ繧ｶ繝ｼID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">繧ｹ繝・・繧ｿ繧ｹ</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">雉ｼ蜈･譌･</th>
                  </tr>
                </thead>
                <tbody>
                  {(purchases || []).map((p: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">
                        {productNames[p.product_id] || p.product_id}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground font-mono text-xs">
                        {p.user_id?.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-2">
                        <Badge className="bg-green-500 text-white border-0 text-xs">
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('ja-JP') : '窶・}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
