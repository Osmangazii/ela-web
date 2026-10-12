-- =====================================================================
-- ELA Board of Directors
-- Run once in the Supabase SQL Editor (or via supabase db push).
-- =====================================================================

create table if not exists public.board_members (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  position         text,
  photo_url        text,
  school_name      text,
  city             text,
  profile_text     text,
  ela_contribution text,
  order_index      integer default 0,
  created_at       timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.board_members enable row level security;

-- Public read access (anon + authenticated)
create policy "board_members_read_public"
  on public.board_members
  for select
  using (true);

-- Authenticated write access
create policy "board_members_insert_authenticated"
  on public.board_members
  for insert
  to authenticated
  with check (true);

create policy "board_members_update_authenticated"
  on public.board_members
  for update
  to authenticated
  using (true)
  with check (true);

create policy "board_members_delete_authenticated"
  on public.board_members
  for delete
  to authenticated
  using (true);
