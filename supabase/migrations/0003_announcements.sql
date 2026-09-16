-- =====================================================================
-- ELA Announcements: table + RLS + public storage bucket
-- Run once in the Supabase SQL Editor (or via supabase db push).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. announcements table (block-based vertical content builder)
-- ---------------------------------------------------------------------
create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  title_en    text not null,
  title_el    text not null,
  category    text,
  date        text,
  blocks      jsonb default '[]'::jsonb,
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------
alter table public.announcements enable row level security;

-- Public read access (anon + authenticated)
create policy "announcements_read_public"
  on public.announcements
  for select
  using (true);

-- Authenticated write access
create policy "announcements_insert_authenticated"
  on public.announcements
  for insert
  to authenticated
  with check (true);

create policy "announcements_update_authenticated"
  on public.announcements
  for update
  to authenticated
  using (true)
  with check (true);

create policy "announcements_delete_authenticated"
  on public.announcements
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 3. Storage: public 'announcements' bucket
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('announcements', 'announcements', true)
on conflict (id) do nothing;

-- Public read
create policy "announcements_bucket_read_public"
  on storage.objects
  for select
  using (bucket_id = 'announcements');

-- Authenticated insert/update/delete
create policy "announcements_bucket_insert_authenticated"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'announcements');

create policy "announcements_bucket_update_authenticated"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'announcements')
  with check (bucket_id = 'announcements');

create policy "announcements_bucket_delete_authenticated"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'announcements');
