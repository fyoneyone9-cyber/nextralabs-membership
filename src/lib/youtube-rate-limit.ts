import { createServerSupabaseClient } from '@/lib/supabase/server'

const TOOL_ID = 'youtube-producer'
const DAILY_LIMIT = 1

/**
 * YouTubeプロデューサーの1日1回制限チェック
 * - 未ログイン → 401
 * - 上限超過 → 429
 * - OK → null（通過）
 */
export async function checkYoutubeLimit(): Promise<{ error: string; status: number } | null> {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です。', status: 401 }
  }

  // 管理者（Ninja）チェック：管理者は制限をバイパス
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role === 'admin' || profile?.role === 'Ninja' || user.email === 'f.yoneyone9@gmail.com') {
    return null; // 無制限
  }

  // JSTで今日の日付（YYYY-MM-DD）
  const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const startOfDay = `${todayJST}T00:00:00+09:00`
  const endOfDay   = `${todayJST}T23:59:59+09:00`

  const { count } = await supabase
    .from('tool_usage_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('tool_id', TOOL_ID)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  if ((count ?? 0) >= DAILY_LIMIT) {
    return {
      error: `YouTubeプロデューサーは1日${DAILY_LIMIT}回までご利用いただけます。明日またお試しください。`,
      status: 429,
    }
  }

  return null
}

/**
 * 使用ログを記録する（制限チェック通過後に呼び出す）
 */
export async function recordYoutubeUsage(): Promise<void> {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('tool_usage_logs').insert({
    user_id: user.id,
    tool_id: TOOL_ID,
  })
}
