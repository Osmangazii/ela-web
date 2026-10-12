-- =====================================================================
-- ELA — Sample Erasmus+ projects (one per status)
-- Run in the Supabase SQL Editor. Inserts are skipped if a project with
-- the same project_code already exists.
-- =====================================================================

insert into public.erasmus_projects
  (title, project_code, action_type, status, summary, priorities,
   partner_countries, start_date, end_date, results_summary, order_index)
select * from (values
  (
    'ELA: Promoting Sustainable and Innovative Environments in Adult Education',
    '2022-1-EL01-KA122-ADU-000071519',
    'KA1 Mobility (KA122-ADU)',
    'Active',
    'A flagship mobility initiative fostering an entrepreneurial mindset in adult education. Core educators completed specialised training abroad and transferred innovative pedagogical methods to around 250 educators across Greece.',
    'Teacher Professional Development, Digital Literacy',
    'Greece, Spain, Italy',
    date '2022-09-01',
    date '2024-08-31',
    '250+ educators trained; methods transferred across Greece.',
    0
  ),
  (
    'Green & Inclusive Classrooms: A KA2 Strategic Partnership',
    '2025-1-EL01-KA220-SCH-000123456',
    'KA2 Strategic Partnerships',
    'Call for Partners',
    'We are assembling a consortium of schools across Europe to co-develop inclusive, sustainability-focused language curricula and joint teacher training.',
    'Green Transition, Inclusion, Digital Literacy',
    'Greece, Portugal, Romania, Turkey',
    date '2025-09-01',
    date '2027-08-31',
    null,
    1
  ),
  (
    'TED-Ed DARE: Youth Voices Across Europe',
    '2021-1-EL01-KA201-000078901',
    'KA2 Strategic Partnerships',
    'Completed',
    'A student-centred project in which young learners wrote, rehearsed and delivered short talks on citizenship, science and culture for an international audience.',
    'Inclusion, Citizenship, Digital Literacy',
    'Greece, Bulgaria, Cyprus',
    date '2021-09-01',
    date '2023-08-31',
    'Three international student conferences and a reusable debate-and-presentation toolkit.',
    2
  )
) as v(
  title, project_code, action_type, status, summary, priorities,
  partner_countries, start_date, end_date, results_summary, order_index
)
where not exists (
  select 1 from public.erasmus_projects e
  where e.project_code = v.project_code
);

-- Verify
select status, title, project_code from public.erasmus_projects order by order_index;
