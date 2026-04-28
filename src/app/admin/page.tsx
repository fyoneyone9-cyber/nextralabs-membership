import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CreditCard, ShieldCheck, TrendingUp } from 'lucide-react'

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">管理画面</h1>
        <p className="text-muted-foreground">NextraLabs ストア管理ダッシュボード</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">総ユーザー数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">有料会員数</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">単品購入数</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">販売中ツール</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ユーザー一覧（最新50件）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">名前</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">ユーザーID</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">ロール</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">プラン</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">購入済み</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">登録日</th>
                </tr>
              </thead>
              <tbody>
                {(profiles || []).map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{p.display_name || '—'}</td>
                    <td className="py-3 px-2 text-muted-foreground font-mono text-xs">{p.user_id?.slice(0, 12)}...</td>
                    <td className="py-3 px-2">
                      {p.role === 'admin' ? (
                        <Badge variant="destructive" className="text-xs">管理者</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">一般</Badge>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {activeSubUserIds.has(p.user_id) ? (
                        <Badge className="bg-green-500 text-white border-0 text-xs">プレミアム</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">無料</Badge>
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
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('ja-JP') : '—'}
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
          <CardTitle>購入履歴（最新50件）</CardTitle>
        </CardHeader>
        <CardContent>
          {(purchases || []).length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">まだ購入履歴がありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">ツール</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">ユーザーID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">ステータス</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">購入日</th>
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
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('ja-JP') : '—'}
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
