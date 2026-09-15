-- Add bilingual columns to the schools table.
-- Existing `name`, `city`, `founder_info` are kept for backward compatibility.

alter table public.schools add column if not exists name_en text;
alter table public.schools add column if not exists name_el text;

alter table public.schools add column if not exists subtitle_en text;
alter table public.schools add column if not exists subtitle_el text;

alter table public.schools add column if not exists city_en text;
alter table public.schools add column if not exists city_el text;

alter table public.schools add column if not exists member_status_en text;
alter table public.schools add column if not exists member_status_el text;

alter table public.schools add column if not exists description_en text;
alter table public.schools add column if not exists description_el text;
