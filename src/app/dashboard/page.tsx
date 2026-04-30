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

  // 繝・・繝ｫ謨ｰ縺ｯ蝗ｺ螳・譛ｬ・亥商逹繝上Φ繧ｿ繝ｼ縲、I繝壹ャ繝育ｿｻ險ｳ繝｢繝九ち繝ｼ縲∫､ｾ蜀・帆豐ｻ 逶ｸ髢｢蝗ｳ縲、I雋ｷ縺・黄萓晏ｭ倥せ繝医ャ繝代・縲、I繧ｻ繝ｬ繧ｯ繝医す繝ｧ繝・・・・  const toolCount = 5

  const isPremium = !!subscription

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          繧医≧縺薙◎縲＋profile?.display_name || '繝ｦ繝ｼ繧ｶ繝ｼ'}縺輔ｓ
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant={isPremium ? 'premium' : 'free'}>
            {isPremium ? '繝励Ξ繝溘い繝莨壼藤' : '辟｡譁吩ｼ壼藤'}
          </Badge>
          {profile?.role === 'admin' && (
            <Badge variant="secondary">邂｡逅・・/Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              蛻ｩ逕ｨ蜿ｯ閭ｽ繝・・繝ｫ
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toolCount}譛ｬ</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              繝励Λ繝ｳ
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isPremium ? '繝励Ξ繝溘い繝' : '辟｡譁・}</div>
            {!isPremium && (
              <Link href="/pricing" className="text-xs text-primary hover:underline">
                繧｢繝・・繧ｰ繝ｬ繝ｼ繝・竊・              </Link>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              繧｢繧ｫ繧ｦ繝ｳ繝・            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm truncate">{user.email}</div>
            <Link href="/profile" className="text-xs text-primary hover:underline">
              繝励Ο繝輔ぅ繝ｼ繝ｫ邱ｨ髮・竊・            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Tools */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-emerald-500" />
            繝・・繝ｫ縺ｫ繧｢繧ｯ繧ｻ繧ｹ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'vintage-hunter', name: '蜿､逹繝上Φ繧ｿ繝ｼ', icon: Search, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { id: 'office-politics-graph', name: '遉ｾ蜀・帆豐ｻ 逶ｸ髢｢蝗ｳ', icon: Network, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { id: 'pet-translator', name: 'AI繝壹ャ繝育ｿｻ險ｳ繝｢繝九ち繝ｼ', icon: PawPrint, color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { id: 'shopping-stopper', name: 'AI雋ｷ縺・黄萓晏ｭ倥せ繝医ャ繝代・', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
              { id: 'ai-select-shop', name: 'AI繧ｻ繝ｬ繧ｯ繝医す繝ｧ繝・・', icon: Store, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
                      <p className="text-xs text-muted-foreground">繝・・繝ｫ繧帝幕縺・竊・/p>
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
            <h3 className="font-semibold mb-2">繝・・繝ｫ荳隕ｧ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI繝・・繝ｫ縺ｮ隧ｳ邏ｰ諠・ｱ繝ｻ雉ｼ蜈･繝壹・繧ｸ縺ｯ縺薙■繧峨・            </p>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                繝・・繝ｫ荳隕ｧ <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        {!isPremium && (
          <Card className="border-primary/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                繝励Ξ繝溘い繝縺ｫ繧｢繝・・繧ｰ繝ｬ繝ｼ繝・              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                縺吶∋縺ｦ縺ｮ繧ｳ繝ｳ繝・Φ繝・↓繧｢繧ｯ繧ｻ繧ｹ縺ｧ縺阪ｋ繧医≧縺ｫ縺ｪ繧翫∪縺吶・              </p>
              <Link href="/pricing">
                <Button className="gap-2">
                  繝励Λ繝ｳ繧定ｦ九ｋ <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
