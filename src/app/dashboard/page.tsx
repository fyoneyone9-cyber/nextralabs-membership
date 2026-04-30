import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Crown, User, ArrowRight, Rocket, Search, PawPrint, Network, ShieldAlert, Store } from 'lucide-react'

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

  // ツール数は固定5本（古着ハンター、AIペット翻訳モニター、社内政治 相関図、AI買い物依存ストッパー、AIセレクトショップ）
  const toolCount = 5

  const isPremium = !!subscription

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          ようこそ、{profile?.display_name || 'ユーザー'}さん
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant={isPremium ? 'premium' : 'free'}>
            {isPremium ? 'プレミアム会員' : '無料会員'}
          </Badge>
          {profile?.role === 'admin' && (
            <Badge variant="secondary">管理者</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              利用可能ツール
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toolCount}本</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              プラン
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isPremium ? 'プレミアム' : '無料'}</div>
            {!isPremium && (
              <Link href="/pricing" className="text-xs text-primary hover:underline">
                アップグレード →
              </Link>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              アカウント
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm truncate">{user.email}</div>
            <Link href="/profile" className="text-xs text-primary hover:underline">
              プロフィール編集 →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Tools */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-emerald-500" />
            ツールにアクセス
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'vintage-hunter', name: '古着ハンター', icon: Search, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { id: 'office-politics-graph', name: '社内政治 相関図', icon: Network, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { id: 'pet-translator', name: 'AIペット翻訳モニター', icon: PawPrint, color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { id: 'shopping-stopper', name: 'AI買い物依存ストッパー', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
              { id: 'ai-select-shop', name: 'AIセレクトショップ', icon: Store, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={`/products/${tool.id}/app`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tool.bg} flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${tool.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">ツールを開く →</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">ツール一覧</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AIツールの詳細情報・購入ページはこちら。
            </p>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                ツール一覧 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        {!isPremium && (
          <Card className="border-primary/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                プレミアムにアップグレード
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                すべてのコンテンツにアクセスできるようになります。
              </p>
              <Link href="/pricing">
                <Button className="gap-2">
                  プランを見る <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
