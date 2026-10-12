-- =====================================================================
-- ELA Events: catalog fields (categories, archiving, audiences, CTA)
-- Run once in the Supabase SQL Editor (or via supabase db push).
-- =====================================================================

-- Archived events move to the "Past / Archive" tab on /events.
alter table public.events add column if not exists is_archived boolean not null default false;

-- Universal (non-bilingual) catalogue fields.
alter table public.events add column if not exists event_date        date;
alter table public.events add column if not exists location_or_online text;
alter table public.events add column if not exists target_audience    text;
alter table public.events add column if not exists language           text;
alter table public.events add column if not exists educational_purpose text;
alter table public.events add column if not exists category           text;
alter table public.events add column if not exists registration_url   text;

-- Helpful index for the archive/upcoming split.
create index if not exists events_is_archived_idx on public.events (is_archived);

-- RLS policies from 0001 already cover read (public) and write
-- (authenticated) for this table; the new columns inherit them.

-- ---------------------------------------------------------------------
-- Force PostgREST to rebuild its schema cache so the REST/admin clients
-- immediately recognise the new columns. Without this you get errors like:
--   Could not find the 'category' column of 'events' in the schema cache
-- ---------------------------------------------------------------------
notify pgrst, 'reload schema';
