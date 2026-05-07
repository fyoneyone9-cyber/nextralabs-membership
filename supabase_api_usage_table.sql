-- api_usage テーブル（サーバー側レート制限用）
-- Supabase SQL Editor で実行してください

CREATE TABLE IF NOT EXISTS api_usage (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id     text NOT NULL,
  date        date NOT NULL DEFAULT CURRENT_DATE,
  count       integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, tool_id, date)
);

-- インデックス（高速検索用）
CREATE INDEX IF NOT EXISTS idx_api_usage_user_tool_date ON api_usage(user_id, tool_id, date);

-- RLS（Row Level Security）有効化
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- サービスロールキーのみ読み書き可能（フロントから直接アクセス不可）
CREATE POLICY "service_role_only" ON api_usage
  USING (auth.role() = 'service_role');

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER api_usage_updated_at
  BEFORE UPDATE ON api_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
