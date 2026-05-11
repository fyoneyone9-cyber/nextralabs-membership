-- ============================================================
-- NextraLabs アフィリエイトクリック計測テーブル
-- Supabase Dashboard > SQL Editor で実行
-- ============================================================

create table if not exists affiliate_clicks (
  id         bigserial primary key,
  link_id    text not null,        -- 識別キー（例: ai-recipe-cooking）
  tool_id    text not null,        -- ツールID（例: ai-recipe）
  label      text not null,        -- 表示名（例: 🍳 調理器具・キッチン用品）
  url        text not null,        -- 実際のAmazonリンク
  clicked_at timestamptz not null default now()
);

-- インデックス（集計高速化）
create index if not exists idx_affiliate_clicks_link_id   on affiliate_clicks (link_id);
create index if not exists idx_affiliate_clicks_tool_id   on affiliate_clicks (tool_id);
create index if not exists idx_affiliate_clicks_clicked_at on affiliate_clicks (clicked_at desc);

-- RLS
alter table affiliate_clicks enable row level security;

-- 誰でもINSERT可（クリック記録）
create policy "anyone_can_insert_click" on affiliate_clicks
  for insert with check (true);

-- service_roleのみSELECT可（管理者が集計）
