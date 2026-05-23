import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ALLOWED_EMAIL = 'f.yoneyone9@gmail.com'

export default async function MangaLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 未ログインはログインページへ
  if (!user) redirect('/login')

  // 自分以外はダッシュボードトップへ
  if (user.email !== ALLOWED_EMAIL) redirect('/dashboard')

  return <>{children}</>
}
