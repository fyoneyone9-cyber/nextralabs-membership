-- ============================================================
-- 003_user_shop_settings.sql
-- ユーザー毎のShopify/Printful接続設定テーブル
-- Supabase SQLエディタで実行してください
-- URL: https://supabase.com/dashboard/project/jidaseiiyamrhyvukasch/sql/new
-- ============================================================

CREATE TABLE IF NOT EXISTS user_shop_settings (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  -- Shopify設定
  shopify_domain        text,   -- 例: yourshop.myshopify.com
  shopify_client_id     text,
  shopify_client_secret text,
  -- Printful設定
  printful_api_key  text,
  printful_store_id text,
  -- タイムスタンプ
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_shop_settings_updated ON user_shop_settings;
CREATE TRIGGER trg_user_shop_settings_updated
  BEFORE UPDATE ON user_shop_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS（Row Level Security）: 本人のデータのみ読み書き可
ALTER TABLE user_shop_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_shop_settings_own_only" ON user_shop_settings;
CREATE POLICY "user_shop_settings_own_only"
  ON user_shop_settings
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
