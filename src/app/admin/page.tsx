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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">管理画面</h1>
        <p className="text-muted-foreground">NextraLabs ストア管理ダッシュボード</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">お問い合わせ</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactCount || 0}</div>
            {newContactCount > 0 && (
              <p className="text-xs text-orange-500 font-medium mt-1">🔴 未対応 {newContactCount}件</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">販売中ツール</CardTitle>
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
            📩 お問い合わせ（最新20件）
            {newContactCount > 0 && (
              <Badge className="bg-orange-500 text-white border-0 text-xs">{newContactCount}件 未対応</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(contacts || []).length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">まだお問い合わせがありません</p>
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
                        <Badge className="bg-orange-500 text-white border-0 text-xs">未対応</Badge>
                      ) : c.status === 'replied' ? (
                        <Badge className="bg-green-500 text-white border-0 text-xs">返信済</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">クローズ</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{c.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {c.created_at ? new Date(c.created_at).toLocaleString('ja-JP') : '—'}
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
