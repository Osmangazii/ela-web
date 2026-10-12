-- =====================================================================
-- ELA — Fix PostgREST schema cache for the new `events` catalogue columns
-- ---------------------------------------------------------------------
-- Use this when the admin panel reports errors such as:
--   "Could not find the 'category' column of 'events' in the schema cache"
--   "Could not find the 'is_archived' column ..."
--
-- It is fully idempotent: it re-applies every ALTER TABLE ... IF NOT EXISTS
-- and then reloads PostgREST's schema cache. Paste the whole file into the
-- Supabase SQL Editor and run it once.
-- =====================================================================

-- 1. Ensure all new columns exist -------------------------------------
alter table public.events add column if not exists is_archived         boolean not null default false;
alter table public.events add column if not exists event_date          date;
alter table public.events add column if not exists location_or_online  text;
alter table public.events add column if not exists target_audience     text;
alter table public.events add column if not exists language            text;
alter table public.events add column if not exists educational_purpose text;
alter table public.events add column if not exists category            text;
alter table public.events add column if not exists registration_url    text;

create index if not exists events_is_archived_idx on public.events (is_archived);

-- 1b. Announcements: optional deadline + target audience columns ------
alter table public.announcements add column if not exists deadline_date   text;
alter table public.announcements add column if not exists target_audience text;
alter table public.announcements add column if not exists order_index     integer default 0;

update public.announcements
   set category = 'Institutional News'
 where category in ('Official Notice', 'General Assembly', 'News');

-- 1c. Erasmus+ projects table (idempotent; patches a partial table too) --
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
alter table public.erasmus_projects add column if not exists action_type     text;
alter table public.erasmus_projects add column if not exists status          text default 'Active';
alter table public.erasmus_projects add column if not exists summary         text;
alter table public.erasmus_projects add column if not exists priorities      text;
alter table public.erasmus_projects add column if not exists results_summary text;
alter table public.erasmus_projects add column if not exists attachment_url  text;
alter table public.erasmus_projects add column if not exists order_index     integer default 0;
alter table public.erasmus_projects enable row level security;
-- (RLS policies for this table are created in migrations/0007_erasmus_projects.sql.)

-- 2. Reload the API schema cache --------------------------------------
notify pgrst, 'reload schema';

-- 3. Sanity check (optional) — list the columns PostgREST will see
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name in ('events', 'announcements')
order by table_name, ordinal_position;
