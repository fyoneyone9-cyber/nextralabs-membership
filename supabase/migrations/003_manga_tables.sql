-- manga_projects: 台本・プロジェクト管理
create table if not exists manga_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  script text not null,
  page_prefix text not null,
  panels_per_page integer default 3,
  status text default 'draft',  -- draft | generating | done | error
  pdf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- manga_pages: 各ページのプロンプト管理
create table if not exists manga_pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references manga_projects(id) on delete cascade,
  page_name text not null,
  panel integer not null,
  speaker text,
  speaker_side text,
  dialogue text,
  prompt text,
  image_path text,
  updated_at timestamptz default now()
);

-- RLS
alter table manga_projects enable row level security;
alter table manga_pages enable row level security;

create policy "users can access own projects" on manga_projects
  for all using (auth.uid() = user_id);

create policy "users can access own pages via project" on manga_pages
  for all using (
    exists (
      select 1 from manga_projects
      where manga_projects.id = manga_pages.project_id
      and manga_projects.user_id = auth.uid()
    )
  );
