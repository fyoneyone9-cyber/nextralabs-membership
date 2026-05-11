-- admin_notifications テーブル
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,           -- 'new_subscription' | 'new_user' など
  title text not null,
  message text not null,
  metadata jsonb default '{}',
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS: 管理者のみ読み取り可
alter table public.admin_notifications enable row level security;

-- service_role（webhook）は全操作OK（RLSバイパス）
-- 認証ユーザーは自分がオーナーなら読める
create policy "admin can read notifications"
  on public.admin_notifications
  for select
  using (auth.jwt() ->> 'email' = 'f.yoneyone9@gmail.com');

create policy "admin can update notifications"
  on public.admin_notifications
  for update
  using (auth.jwt() ->> 'email' = 'f.yoneyone9@gmail.com');

-- リアルタイム有効化
alter publication supabase_realtime add table public.admin_notifications;
