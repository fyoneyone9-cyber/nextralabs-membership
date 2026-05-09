import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * NextraLabs クレジット保護ガード
 * 1日あたりの利用回数をチェックし、制限を超えている場合はエラーを投げる
 */
export async function checkApiLimit(toolId: string, limit: number = 20) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return { allowed: true, userId: null }; // 未ログイン時は別の制限ロジックが必要だが、一旦パス

  const userId = session.user.id;
  const today = new Date().toISOString().split('T')[0];

  // api_usage テーブルから本日の利用回数を取得
  const { data: usage, error } = await supabase
    .from('api_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 はデータなし（初回利用）
    console.error('API Limit Check Error:', error);
    return { allowed: true, userId }; // エラー時は止断せず通すがログに残す
  }

  const currentCount = usage?.count || 0;

  if (currentCount >= limit) {
    return { allowed: false, userId, count: currentCount };
  }

  // カウントアップ（既存があれば更新、なければ挿入）
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
