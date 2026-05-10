-- ページビュー記録テーブル
CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL PRIMARY KEY,
  path        TEXT NOT NULL,
  referrer    TEXT,
  user_agent  TEXT,
  country     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- パス別集計を高速化するインデックス
CREATE INDEX IF NOT EXISTS idx_page_views_path       ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path_date  ON page_views(path, created_at DESC);

-- RLS: 書き込みは anon/authenticated どちらも OK（記録用）
--      読み取りは service_role のみ（管理API経由）
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert pageview"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "service role can select pageview"
  ON page_views FOR SELECT
  TO service_role
  USING (true);
