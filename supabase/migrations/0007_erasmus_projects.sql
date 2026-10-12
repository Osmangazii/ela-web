-- =====================================================================
-- ELA Erasmus+ Projects
-- Idempotent: safe to run on a fresh DB *or* to patch a partial table.
-- Run once in the Supabase SQL Editor (or via supabase db push).
-- =====================================================================

-- 1) Create the table if it does not exist -----------------------------
create table if not exists public.erasmus_projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  project_code      text,
  action_type       text,
  status            text default 'Active',
  summary           text,
  priorities        text,
  partner_countries text,
  start_date        date,
  end_date          date,
  results_summary   text,
  attachment_url    text,
  order_index       integer default 0,
  created_at        timestamptz default now()
);

-- 2) Patch a pre-existing / partial table: add any missing columns -----
alter table public.erasmus_projects add column if not exists project_code      text;
alter table public.erasmus_projects add column if not exists action_type       text;
alter table public.erasmus_projects add column if not exists status            text default 'Active';
alter table public.erasmus_projects add column if not exists summary           text;
alter table public.erasmus_projects add column if not exists priorities        text;
alter table public.erasmus_projects add column if not exists partner_countries text;
alter table public.erasmus_projects add column if not exists start_date        date;
alter table public.erasmus_projects add column if not exists end_date          date;
alter table public.erasmus_projects add column if not exists results_summary   text;
alter table public.erasmus_projects add column if not exists attachment_url    text;
alter table public.erasmus_projects add column if not exists order_index       integer default 0;

-- 3) Row Level Security (public read, authenticated write) -------------
alter table public.erasmus_projects enable row level security;

-- Clear any pre-existing policies so we never leave a permissive one behind.
do $$
declare p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'erasmus_projects'
  loop
    execute format('drop policy %I on public.erasmus_projects', p.policyname);
  end loop;
end $$;

create policy "erasmus_projects_read_public"
  on public.erasmus_projects
  for select
  using (true);

create policy "erasmus_projects_insert_authenticated"
  on public.erasmus_projects
  for insert
  to authenticated
  with check (true);

create policy "erasmus_projects_update_authenticated"
  on public.erasmus_projects
  for update
  to authenticated
  using (true)
  with check (true);

create policy "erasmus_projects_delete_authenticated"
  on public.erasmus_projects
  for delete
  to authenticated
  using (true);

-- 4) Force PostgREST to rebuild its schema cache -----------------------
notify pgrst, 'reload schema';

-- 5) Verify ------------------------------------------------------------
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'erasmus_projects'
order by ordinal_position;
