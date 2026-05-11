-- ============================================================
-- NextraLabs メルマガ システム — Supabase テーブル定義
-- Supabase Dashboard > SQL Editor で実行してください
-- ============================================================

-- 1. 読者テーブル
create table if not exists newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text,
  tags          text[] default '{}',
  status        text not null default 'active', -- active | unsubscribed
  source        text default 'web',             -- web | import | manual
  subscribed_at timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2. テンプレートテーブル
create table if not exists newsletter_templates (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  subject    text not null,
  body       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. 送信キャンペーン履歴
create table if not exists newsletter_campaigns (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  body            text not null,
  tag_filter      text,           -- null = 全員
  sent_count      int default 0,
  failed_count    int default 0,
  status          text default 'sent',  -- sent | failed | partial
  sent_at         timestamptz not null default now()
);

-- RLS: 購読者は自分の行のみ参照可能（管理者はservice_roleで操作）
alter table newsletter_subscribers enable row level security;
alter table newsletter_templates   enable row level security;
alter table newsletter_campaigns   enable row level security;

-- 匿名ユーザーは subscribe API 経由で INSERT のみ（メアド重複は upsert で吸収）
create policy "anon_insert_subscriber" on newsletter_subscribers
  for insert with check (true);

-- service_role はフルアクセス（API Route から使用）
