-- =====================================================================
-- ELA Supabase Initial Schema & RLS Migration
-- Run once in the Supabase SQL Editor (or via supabase db push).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. events table
-- ---------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title_en    text not null,
  title_el    text not null,
  date_en     text not null,
  date_el     text not null,
  location_en text not null,
  location_el text not null,
  theme_color text default '#165823',
  images      text[] default '{}',
  col1_en     text,
  col1_el     text,
  col2_en     text,
  col2_el     text,
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 2. schools table
-- ---------------------------------------------------------------------
create table if not exists public.schools (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  city         text not null,
  founder_info text,
  image_url    text,
  order_index  integer default 0,
  created_at   timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------
alter table public.events  enable row level security;
alter table public.schools enable row level security;

-- Public read access (anon + authenticated)
create policy "events_read_public"
  on public.events
  for select
  using (true);

create policy "schools_read_public"
  on public.schools
  for select
  using (true);

-- Authenticated write access
create policy "events_insert_authenticated"
  on public.events
  for insert
  to authenticated
  with check (true);

create policy "events_update_authenticated"
  on public.events
  for update
  to authenticated
  using (true)
  with check (true);

create policy "events_delete_authenticated"
  on public.events
  for delete
  to authenticated
  using (true);

create policy "schools_insert_authenticated"
  on public.schools
  for insert
  to authenticated
  with check (true);

create policy "schools_update_authenticated"
  on public.schools
  for update
  to authenticated
  using (true)
  with check (true);

create policy "schools_delete_authenticated"
  on public.schools
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 4. Storage: public 'media' bucket
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read
create policy "media_read_public"
  on storage.objects
  for select
  using (bucket_id = 'media');

-- Authenticated insert/update/delete
create policy "media_insert_authenticated"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "media_update_authenticated"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "media_delete_authenticated"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');
