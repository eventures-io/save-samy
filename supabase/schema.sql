-- Save-Samy — Supabase schema
-- Run this in the Supabase SQL editor on a fresh project (region: Frankfurt).

-- =============================================================
-- 1. Signatures table
-- =============================================================
create table if not exists public.signatures (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  first_name      text not null check (char_length(first_name) between 1 and 60),
  last_name       text not null check (char_length(last_name) between 1 and 80),
  email           text not null check (char_length(email) between 5 and 150),
  city            text          check (city is null or char_length(city) <= 80),
  comment         text          check (comment is null or char_length(comment) <= 1000),
  consent_rgpd    boolean not null default false,
  consent_display boolean not null default false,
  locale          text not null check (locale in ('fr','nl')),
  ip_hash         text,
  user_agent      text,
  is_approved     boolean not null default true,  -- v1: auto-approve; set to false in v2 for moderation
  is_hidden       boolean not null default false, -- admin override
  email_lower     text generated always as (lower(email)) stored
);

create unique index if not exists signatures_email_unique on public.signatures(email_lower);
create index if not exists signatures_created_at_idx on public.signatures(created_at desc);
create index if not exists signatures_display_idx on public.signatures(created_at desc)
  where is_approved = true and is_hidden = false and consent_display = true;

-- =============================================================
-- 2. RLS: nothing readable or writable by anon directly.
--    All writes/reads go through server-side service role.
-- =============================================================
alter table public.signatures enable row level security;
-- No policies for anon → fully locked down from the browser.

-- =============================================================
-- 3. Public counter view (used by server action to return count only)
--    Exposed only through server-side fetch; no RLS policy needed on view
--    because we only query it with the service role key.
-- =============================================================
create or replace view public.signatures_public as
  select
    id,
    created_at,
    first_name,
    city,
    locale
  from public.signatures
  where is_approved = true
    and is_hidden   = false
    and consent_display = true;

-- =============================================================
-- 4. Count function callable by server
-- =============================================================
create or replace function public.signatures_count()
returns integer
language sql
stable
security definer
as $$
  select count(*)::int from public.signatures
  where is_approved = true and is_hidden = false;
$$;

revoke all on function public.signatures_count() from public;
grant execute on function public.signatures_count() to service_role;

-- =============================================================
-- Notes
-- =============================================================
-- • Service role key stays on the server (Next.js server actions / API routes).
-- • Anon key is NOT used for signatures to avoid any client-side writes.
-- • Email is stored for signature uniqueness and anti-fraud; it is never displayed publicly.
-- • `is_approved` defaults to true so v1 is open-signing; flip to false and add
--   moderation UI in v2 once the lawyer greenlights the overall approach.
