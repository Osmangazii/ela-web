-- =====================================================================
-- ELA Announcements: optional deadline + target audience fields and the
-- official ELA category set.
-- Run once in the Supabase SQL Editor (or via supabase db push).
-- =====================================================================

-- Optional per-announcement fields (shown as badges on the list/detail pages).
alter table public.announcements add column if not exists deadline_date   text;
alter table public.announcements add column if not exists target_audience text;

-- 0003 declared order_index; make sure this instance actually has it.
alter table public.announcements add column if not exists order_index     integer default 0;

-- Remap legacy category values onto the new official ELA set.
--   Official Notice / General Assembly / News -> Institutional News
-- ('Article' has no direct equivalent; re-tag it manually in the admin if needed.)
update public.announcements
   set category = 'Institutional News'
 where category in ('Official Notice', 'General Assembly', 'News');

-- Force PostgREST to rebuild its schema cache so the new columns are visible.
notify pgrst, 'reload schema';
