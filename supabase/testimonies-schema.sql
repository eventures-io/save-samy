-- Save-Samy — Testimonies (visitor-submitted experiences)
-- Run AFTER signatures schema.sql, in the same Supabase project (eu-central-1).
-- =============================================================

create table if not exists public.testimonies (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  first_name      text not null check (char_length(first_name) between 1 and 60),
  last_name       text not null check (char_length(last_name) between 1 and 80),
  email           text not null check (char_length(email) between 5 and 150),
  city            text          check (city is null or char_length(city) <= 80),
  text            text not null check (char_length(text) between 20 and 2000),
  locale          text not null check (locale in ('fr','nl')),
  consent_rgpd    boolean not null default false,
  consent_display boolean not null default false,
  ip_hash         text,
  user_agent      text,
  is_approved     boolean not null default false, -- moderation gate
  is_hidden       boolean not null default false, -- admin override
  moderated_at    timestamptz,
  moderation_note text,
  email_lower     text generated always as (lower(email)) stored
);

create index if not exists testimonies_created_at_idx on public.testimonies(created_at desc);
create index if not exists testimonies_pending_idx on public.testimonies(created_at desc)
  where is_approved = false and is_hidden = false;
create index if not exists testimonies_public_idx on public.testimonies(created_at desc)
  where is_approved = true and is_hidden = false and consent_display = true;

alter table public.testimonies enable row level security;
-- No policies: fully locked down from anon. Writes/reads via service role only.

-- =============================================================
-- Public view: approved + display-consented only. Served by the server.
-- =============================================================
create or replace view public.testimonies_public as
  select
    id,
    created_at,
    first_name,
    city,
    text,
    locale
  from public.testimonies
  where is_approved = true
    and is_hidden = false
    and consent_display = true;

-- =============================================================
-- Count function
-- =============================================================
create or replace function public.testimonies_count()
returns integer
language sql
stable
security definer
as $$
  select count(*)::int from public.testimonies
  where is_approved = true and is_hidden = false;
$$;

revoke all on function public.testimonies_count() from public;
grant execute on function public.testimonies_count() to service_role;

-- =============================================================
-- Moderation workflow:
--   1. New row inserted with is_approved = false.
--   2. Admin opens Supabase dashboard → testimonies table.
--   3. Review the `text`, `first_name`, `email`.
--   4. If OK: set is_approved = true, moderated_at = now().
--   5. If problematic: leave is_approved = false (or set is_hidden = true
--      to also exclude from the moderation queue).
-- Only is_approved = true AND is_hidden = false AND consent_display = true
-- rows are shown on /testimonials.
-- =============================================================
