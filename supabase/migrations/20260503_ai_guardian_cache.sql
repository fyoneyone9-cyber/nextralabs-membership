-- AI回答キャッシュテーブルの作成
CREATE TABLE IF NOT EXISTS ai_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL,
    system_instruction TEXT,
    response TEXT NOT NULL,
    model TEXT NOT NULL,
    tool_id TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 検索を高速化するためのインデックス
CREATE INDEX IF NOT EXISTS idx_ai_cache_prompt ON ai_cache (prompt);

-- 開発者用の消費ログテーブル（将来の可視化用）
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    tool_id TEXT,
    model TEXT,
    cached BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
