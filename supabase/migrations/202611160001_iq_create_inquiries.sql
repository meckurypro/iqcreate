-- IQ Create inquiry intake table.
-- This migration adds one isolated table to the existing shared IQ Supabase project.
-- It does not alter existing IQ application tables.

create table if not exists public.iq_create_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null default '',
  country text not null default '',
  company text not null default '',
  content_type text not null,
  project_summary text not null,
  episodes_per_week integer not null default 0 check (episodes_per_week between 0 and 20),
  minutes_per_episode integer not null default 0 check (minutes_per_episode between 0 and 240),
  weeks_per_month integer not null default 0 check (weeks_per_month between 0 and 5),
  monthly_minutes integer not null default 0 check (monthly_minutes between 0 and 20000),
  estimated_monthly_usd integer not null default 0 check (estimated_monthly_usd between 0 and 1000000),
  preferred_contact text not null default 'WhatsApp',
  inquiry_type text not null default 'Production inquiry',
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'in_progress', 'closed', 'spam'))
);

alter table public.iq_create_inquiries enable row level security;

-- Public visitors may submit inquiries, but cannot read, update or delete submissions.
drop policy if exists "Public can submit IQ Create inquiries" on public.iq_create_inquiries;
create policy "Public can submit IQ Create inquiries"
  on public.iq_create_inquiries
  for insert
  to anon, authenticated
  with check (
    length(trim(name)) between 2 and 160
    and length(trim(email)) between 5 and 320
    and position('@' in email) > 1
    and length(trim(content_type)) between 2 and 120
    and length(trim(project_summary)) between 5 and 10000
    and status = 'new'
  );

-- Explicit grants are required for newly-created public tables in this project.
grant usage on schema public to anon, authenticated;
revoke all on table public.iq_create_inquiries from anon, authenticated;
grant insert on table public.iq_create_inquiries to anon, authenticated;

create index if not exists iq_create_inquiries_created_at_idx on public.iq_create_inquiries (created_at desc);
create index if not exists iq_create_inquiries_status_idx on public.iq_create_inquiries (status);

-- Do not grant SELECT to anon/authenticated. Read inquiries from a trusted admin
-- environment or a server-side function using a server-only service role key.
