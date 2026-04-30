-- tool_usage_logs テーブル（ツール使用回数管理）
CREATE TABLE IF NOT EXISTS tool_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス（1日1回チェック用）
CREATE INDEX IF NOT EXISTS idx_tool_usage_logs_user_tool_date
  ON tool_usage_logs (user_id, tool_id, created_at);

-- RLS有効化
ALTER TABLE tool_usage_logs ENABLE ROW LEVEL SECURITY;

-- サービスロールのみ書き込み可（APIルートから使用）
CREATE POLICY "Service role can insert" ON tool_usage_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own logs" ON tool_usage_logs
  FOR SELECT USING (auth.uid() = user_id);
