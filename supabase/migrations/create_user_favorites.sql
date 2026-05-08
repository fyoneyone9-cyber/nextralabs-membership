-- ユーザーお気に入りテーブル
CREATE TABLE IF NOT EXISTS user_favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, tool_id)
);

-- RLS有効化
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- 自分のデータだけ読み書き可能
CREATE POLICY "user_favorites_select" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_favorites_insert" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_favorites_delete" ON user_favorites FOR DELETE USING (auth.uid() = user_id);
