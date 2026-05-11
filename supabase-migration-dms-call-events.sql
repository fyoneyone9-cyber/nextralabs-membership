-- DMS通話イベントテーブル（フロント呼び出しのリアルタイム通知用）
CREATE TABLE IF NOT EXISTS dms_call_events (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  room_name   text NOT NULL,
  room_url    text NOT NULL,
  property_name text NOT NULL DEFAULT 'フロント',
  status      text NOT NULL DEFAULT 'active',  -- 'active' | 'ended'
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Realtime有効化
ALTER TABLE dms_call_events REPLICA IDENTITY FULL;

-- RLS（誰でも読み書き可能 ※ anon keyでアクセスするため）
ALTER TABLE dms_call_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_insert" ON dms_call_events FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_select" ON dms_call_events FOR SELECT USING (true);
CREATE POLICY "allow_all_update" ON dms_call_events FOR UPDATE USING (true);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_dms_call_events_created_at ON dms_call_events(created_at DESC);
