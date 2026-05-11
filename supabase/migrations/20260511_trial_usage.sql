-- 無料会員のトライアル使用回数管理
create table if not exists public.trial_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  used_count integer default 1,
  last_used_at timestamptz default now(),
  reset_at timestamptz default (date_trunc('month', now()) + interval '1 month'),
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- RLS
alter table public.trial_usage enable row level security;

create policy "users can read own trial usage"
  on public.trial_usage for select
  using (auth.uid() = user_id);

create policy "users can insert own trial usage"
  on public.trial_usage for insert
  with check (auth.uid() = user_id);

create policy "users can update own trial usage"
  on public.trial_usage for update
  using (auth.uid() = user_id);
