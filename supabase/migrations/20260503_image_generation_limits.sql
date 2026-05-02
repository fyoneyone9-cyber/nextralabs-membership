-- image_generation_limits テーブル
-- ユーザーごとの1日あたり画像生成数を管理する

create table if not exists public.image_generation_limits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,                        -- JST日付 (YYYY-MM-DD)
  count       integer not null default 0,
  updated_at  timestamptz not null default now(),
  unique (user_id, date)
);

-- RLS有効化
alter table public.image_generation_limits enable row level security;

-- ユーザーは自分のレコードのみ読み書き可能
create policy "users_own_limits" on public.image_generation_limits
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- サービスロールは全件アクセス可能（管理用）
create policy "service_role_all" on public.image_generation_limits
  for all
  to service_role
  using (true)
  with check (true);

-- インデックス
create index if not exists idx_image_generation_limits_user_date
  on public.image_generation_limits (user_id, date);
