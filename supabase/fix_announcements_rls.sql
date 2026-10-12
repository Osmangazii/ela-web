-- =====================================================================
-- ELA — Announcements RLS hardening (bulletproof version)
-- ---------------------------------------------------------------------
-- Live probe (with the public anon key) just showed that `announcements`
-- still allows INSERT (201), UPDATE and DELETE, while `events` and `schools`
-- correctly return 401 / 42501 (row-level security violation).
--
-- The previous version only dropped the *known* policy names; a permissive
-- policy or RLS-disabled table was left in place. This version drops EVERY
-- policy on the table and recreates the intended set. Run in the SQL Editor.
-- =====================================================================

-- 1) DIAGNOSE — see what is actually there (share this output if unsure) ----
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'announcements'
order by cmd, policyname;

-- Also confirm whether RLS is even enabled (relrowsecurity = true is required)
select relname, relrowsecurity, relforcerowsecurity
from pg_class
where oid = 'public.announcements'::regclass;

-- 2) ENABLE RLS ------------------------------------------------------------
alter table public.announcements enable row level security;

-- 3) DROP *EVERY* EXISTING POLICY on the table -----------------------------
do $$
declare p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'announcements'
  loop
    execute format('drop policy %I on public.announcements', p.policyname);
  end loop;
end $$;

-- 4) RECREATE the intended policies ---------------------------------------
create policy "announcements_read_public"
  on public.announcements for select
  using (true);

create policy "announcements_insert_authenticated"
  on public.announcements for insert
  to authenticated
  with check (true);

create policy "announcements_update_authenticated"
  on public.announcements for update
  to authenticated
  using (true)
  with check (true);

create policy "announcements_delete_authenticated"
  on public.announcements for delete
  to authenticated
  using (true);

-- 5) VERIFY ---------------------------------------------------------------
-- Expect EXACTLY four rows: read_public (SELECT) + three authenticated writes.
select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'announcements'
order by cmd, policyname;
