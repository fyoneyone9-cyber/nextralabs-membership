import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * NextraLabs クレジット保護ガード
 * 【憲法8条準拠】APIを1回でも呼び出すツールは会員登録必須。
 * 未ログインユーザーは一切のAPIアクセスを拒否する。
 * 1日あたりの利用回数をチェックし、制限を超えている場合はエラーを返す。
 */
export async function checkApiLimit(toolId: string, limit: number = 20) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 【憲法8条】未ログインは全APIアクセス拒否（allowed: true → false に修正）
  if (!session) {
    return { allowed: false, userId: null, reason: 'unauthenticated' };
  }

  const userId = session.user.id;

  // 管理者・オーナーは無制限
  if (session.user.email === 'f.yoneyone9@gmail.com') {
    return { allowed: true, userId };
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: usage, error } = await supabase
    .from('api_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('API Limit Check Error:', error);
    return { allowed: true, userId };
  }

  const currentCount = usage?.count || 0;

  if (currentCount >= limit) {
    return { allowed: false, userId, count: currentCount, reason: 'limit_exceeded' };
  }

  if (!usage) {
    await supabase.from('api_usage').insert({
      user_id: userId,
      tool_id: toolId,
      date: today,
      count: 1
    });
  } else {
    await supabase.from('api_usage')
      .update({ count: currentCount + 1 })
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .eq('date', today);
  }

  return { allowed: true, userId, count: currentCount + 1 };
}
