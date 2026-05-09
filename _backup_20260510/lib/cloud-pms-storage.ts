import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * PMS設定（連携リスト）をSupabaseから取得・保存するためのユーティリティ
 */

export const CloudPmsStorage = {
  // PMSリストを取得
  async fetchList() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('pms_config')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Cloud storage fetch error:', error);
      return null;
    }

    return data?.pms_config || [];
  },

  // PMSリストを保存
  async saveList(list: any[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update({ pms_config: list })
      .eq('id', user.id);

    if (error) {
      console.error('Cloud storage save error:', error);
      return false;
    }

    return true;
  }
};
