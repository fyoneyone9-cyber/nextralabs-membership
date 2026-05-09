import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Edit, Crown } from 'lucide-react'

export default async function ProfilePage() {
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

  const isPremium = !!subscription

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">プロフィール</h1>
        <Link href="/profile/edit">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            編集
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold">{profile?.display_name || '名前未設定'}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={isPremium ? 'premium' : 'free'}>
                  {isPremium ? (
                    <><Crown className="h-3 w-3 mr-1" />プレミアム会員</>
                  ) : '無料会員'}
                </Badge>
                {profile?.role === 'admin' && <Badge variant="secondary">管理者</Badge>}
              </div>
              {profile?.bio && (
                <p className="mt-3 text-sm text-muted-foreground">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">アカウント情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">メールアドレス</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">プラン</span>
            <span className="text-sm">{isPremium ? 'プレミアム' : '無料'}</span>
          </div>
          {subscription && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">次回更新日</span>
              <span className="text-sm">
                {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString('ja-JP')
                  : '-'}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">登録日</span>
            <span className="text-sm">
              {new Date(user.created_at).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
