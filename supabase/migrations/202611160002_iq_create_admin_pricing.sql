-- supabase/migrations/202611160002_iq_create_admin_pricing.sql
-- IQ Create: admin-editable pricing + admin access to inquiries.
-- Admin = Meckury AI admin, i.e. public.is_admin() (profiles.role = 'admin').
-- Only adds new tables/policies; existing Meckury AI objects are untouched.

create table if not exists public.iq_create_pricing_settings (
  id boolean primary key default true check (id),
  minimum_monthly_usd integer not null default 100 check (minimum_monthly_usd between 0 and 100000),
  fallback_rate_usd_per_minute numeric(10,2) not null default 2.50 check (fallback_rate_usd_per_minute between 0 and 100),
  max_episodes_per_week integer not null default 7 check (max_episodes_per_week between 1 and 20),
  max_minutes_per_episode integer not null default 60 check (max_minutes_per_episode between 1 and 240),
  max_weeks_per_month integer not null default 5 check (max_weeks_per_month between 1 and 5),
  default_content_type text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.iq_create_pricing_settings (id, default_content_type)
values (true, 'Drama / series / film')
on conflict (id) do nothing;

create table if not exists public.iq_create_pricing_rates (
  id uuid primary key default gen_random_uuid(),
  content_type text not null unique check (length(trim(content_type)) between 2 and 120),
  rate_usd_per_minute numeric(10,2) not null check (rate_usd_per_minute between 0 and 100),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.iq_create_pricing_rates (content_type, rate_usd_per_minute, sort_order) values
  ('Podcast / audio-led', 1.35, 10),
  ('Talking-head / visual podcast', 1.75, 20),
  ('Animation / illustrated stories', 2.40, 30),
  ('Drama / series / film', 3.50, 40),
  ('Advertising / branded content', 3.00, 50),
  ('Music video', 3.80, 60),
  ('Not sure yet', 2.50, 70)
on conflict (content_type) do nothing;

create or replace function public.iq_create_touch_updated()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists iq_create_pricing_settings_touch on public.iq_create_pricing_settings;
create trigger iq_create_pricing_settings_touch before insert or update on public.iq_create_pricing_settings
  for each row execute function public.iq_create_touch_updated();

drop trigger if exists iq_create_pricing_rates_touch on public.iq_create_pricing_rates;
create trigger iq_create_pricing_rates_touch before insert or update on public.iq_create_pricing_rates
  for each row execute function public.iq_create_touch_updated();

alter table public.iq_create_pricing_settings enable row level security;
alter table public.iq_create_pricing_rates enable row level security;

revoke all on table public.iq_create_pricing_settings from anon, authenticated;
revoke all on table public.iq_create_pricing_rates from anon, authenticated;
grant select on table public.iq_create_pricing_settings to anon, authenticated;
grant select on table public.iq_create_pricing_rates to anon, authenticated;
grant update on table public.iq_create_pricing_settings to authenticated;
grant insert, update, delete on table public.iq_create_pricing_rates to authenticated;

-- Everyone can read the live pricing (the website estimator needs it). Inactive rates are admin-only.
drop policy if exists "Public can read IQ Create pricing settings" on public.iq_create_pricing_settings;
create policy "Public can read IQ Create pricing settings" on public.iq_create_pricing_settings
  for select to anon, authenticated using (true);

drop policy if exists "Public can read active IQ Create rates" on public.iq_create_pricing_rates;
create policy "Public can read active IQ Create rates" on public.iq_create_pricing_rates
  for select to anon, authenticated using (is_active or (select public.is_admin()));

-- Only Meckury AI admins can change pricing.
drop policy if exists "Admins update IQ Create pricing settings" on public.iq_create_pricing_settings;
create policy "Admins update IQ Create pricing settings" on public.iq_create_pricing_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins insert IQ Create rates" on public.iq_create_pricing_rates;
create policy "Admins insert IQ Create rates" on public.iq_create_pricing_rates
  for insert to authenticated with check ((select public.is_admin()));

drop policy if exists "Admins update IQ Create rates" on public.iq_create_pricing_rates;
create policy "Admins update IQ Create rates" on public.iq_create_pricing_rates
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins delete IQ Create rates" on public.iq_create_pricing_rates;
create policy "Admins delete IQ Create rates" on public.iq_create_pricing_rates
  for delete to authenticated using ((select public.is_admin()));

-- Admins can read inquiries and change their status (nothing else).
grant select on table public.iq_create_inquiries to authenticated;
grant update (status) on table public.iq_create_inquiries to authenticated;

drop policy if exists "Admins read IQ Create inquiries" on public.iq_create_inquiries;
create policy "Admins read IQ Create inquiries" on public.iq_create_inquiries
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins update IQ Create inquiry status" on public.iq_create_inquiries;
create policy "Admins update IQ Create inquiry status" on public.iq_create_inquiries
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
