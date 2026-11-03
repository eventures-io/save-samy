# Security & data protection — what's in place

Last reviewed: 2026-11-01.

Snapshot of controls currently applied to save-samy.be. Code references in
parentheses so you can jump straight to the implementation.

---

## 1. What personal data we collect

### Petition signatures (`public.signatures`)
*(schema: `supabase/schema.sql`, server action: `lib/petition/actions.ts`)*

| Column | Stored | Shown publicly | Notes |
|---|---|---|---|
| `id` | uuid | no | auto |
| `created_at` | timestamptz | no | auto `now()` on insert |
| `first_name` | plain | **yes** (via `signatures_public` view) | validated 1–60 chars |
| `last_name` | plain | **no** | validated 1–80 chars |
| `email` | plain + `email_lower` (unique) | **no** | used for de-duplication |
| `city` | plain, optional | **yes** | ≤ 80 chars |
| `comment` | plain, optional | **no** in v1 | kept for later review |
| `consent_rgpd` | boolean | — | forced to `true` on insert (signing acts as consent) |
| `consent_display` | boolean | — | forced to `true` (signatories are expected on the public list) |
| `locale` | `'fr'` or `'nl'` | — | enum via `check` |
| `ip_hash` | SHA-256(salt + ip)[0:32] | **no** | salt in `IP_HASH_SALT`; raw IP never stored |
| `user_agent` | plain, truncated to 300 chars | **no** | abuse diagnostics only |
| `is_approved` | boolean, default `true` | — | admin can flip to hide |
| `is_hidden` | boolean, default `false` | — | hard-hide override |

### Visitor testimonies (`public.testimonies`)
*(schema: `supabase/testimonies-schema.sql`, server action: `lib/testimony/actions.ts`)*

Same structure as signatures plus:

- `text` — the testimony itself, validated 20–2000 chars
- `is_approved` defaults to **`false`** — nothing appears until a human
  moderator flips it in the Supabase dashboard
- `moderated_at`, `moderation_note` — optional moderator metadata

### What we do **not** collect anywhere

- Raw IP (we only ever store the salted hash)
- Browser fingerprint, device ID, tracking cookies
- Analytics cookies — Plausible is set up but currently disabled; when
  on, it does not use cookies

---

## 2. Where the data lives

- **Supabase project `bgrsljohqutdkmyzsaxf`**, region **West EU
  (Frankfurt, `eu-central-1`)**. Personal data of EU residents stays in
  the EU — GDPR-friendly.
- **Site hosting**: Vercel (edge-cached static + serverless functions in
  the user's nearest region).
- **DNS + email forwarding**: Cloudflare (`save-samy.be` zone).
- **Site copy + reviews + petition text**: Sanity (project `nwirc1r0`,
  `production` dataset). No personal data in Sanity.

---

## 3. SQL injection

- All DB access goes through `@supabase/supabase-js` — queries are
  parameterised internally. Our code never concatenates strings into
  SQL.
- Every form field is validated by **Zod** schemas before reaching the
  DB layer (`SignSchema` in `lib/petition/actions.ts`, `TestimonySchema`
  in `lib/testimony/actions.ts`): length limits, email format, type
  coercion, honeypot must be empty.
- Column-level `check` constraints in Postgres enforce the same limits
  again (defense in depth).
- `email_lower` is a generated column with a `unique` index — the DB
  itself refuses duplicate signatures.

---

## 4. Access controls

- **Row-level security (RLS) is enabled** on `signatures` and
  `testimonies`, with **no anon policies**. The browser cannot read or
  write these tables directly — any attempt returns 0 rows / permission
  error.
- All DB reads and writes happen inside **server actions** that run on
  Vercel's serverless infrastructure, using the
  `SUPABASE_SERVICE_ROLE_KEY` env var. That key is marked **Sensitive**
  in Vercel and never shipped to the browser.
- Public counters are fetched via security-definer views
  (`signatures_public`, `testimonies_public`) and the `signatures_count`
  RPC. These views expose only `first_name`, `city`, and
  (for testimonies) the moderated `text` — never `email`, `last_name`,
  `ip_hash`, `user_agent`, or `comment`.

---

## 5. Bot and abuse protection

### Cloudflare Turnstile (invisible CAPTCHA)
*(`lib/turnstile.ts`, `components/turnstile-widget.tsx`)*

- Widget mounted on both forms via `@marsidev/react-turnstile`.
- Server actions call Cloudflare's `siteverify` endpoint before any DB
  write.
- When `TURNSTILE_SECRET_KEY` is unset the server lets requests through
  (so dev / preview environments work without configuring Turnstile).
- Site key is `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public, safe in client).

### Honeypot field
*(all form components)*

- Hidden `website` field; bots that fill every input are silently
  rejected (we respond "success" but never persist, so bots don't retry).

### Per-IP rate limit
*(`rateLimit()` in both actions)*

- In-memory map keyed by the salted IP hash.
- Petition: 5 submissions / 60 seconds.
- Testimony: 3 submissions / 60 seconds.
- **Caveat**: in-memory limiter is per-serverless-instance. Vercel can
  spin up multiple instances in parallel; a determined attacker could
  bypass by hitting enough cold starts. Current layer is sufficient for
  casual spam. If abuse becomes real, move the limiter into Supabase
  (`SELECT count(*) FROM signatures WHERE ip_hash = $1 AND created_at >
  now() - interval '1 minute'`).

---

## 6. Transport and browser security

### HTTPS

- Vercel + Cloudflare — TLS everywhere, auto-renewed.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains;
  preload` — 2 years, applies to all subdomains, eligible for the HSTS
  preload list.

### Headers
*(set in `next.config.ts`)*

Applied to every route except `/studio/*`:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Content-Security-Policy` | self + Sanity + Supabase + Turnstile only; blocks arbitrary third-party scripts and framing |

`/studio/*` has a looser policy (no CSP, no X-Frame-Options) because
Sanity Studio needs to load its own bundle, workers, and iframes.

### CSP caveat

The script-src allows `'unsafe-inline'` and `'unsafe-eval'` because
Next.js's runtime currently needs them. This weakens XSS protection in
depth. Tightening to a nonce- or hash-based CSP is a non-trivial change;
scheduled for a later hardening pass.

---

## 7. Consent, transparency, user rights

- **Privacy policy** at `/privacy` describes what's collected, legal
  basis, retention, and the user's GDPR rights
  (`messages/fr.json#privacy`, `app/[locale]/privacy/page.tsx`).
- **Legal mentions** at `/legal`.
- **Signing acts as consent** for the petition — the processing is
  intrinsic to the service the user requests. An informative line
  appears above the submit button; no checkbox is required.
- **Testimonies require explicit consent** on the free-text content
  before display.
- **Right to access / rectification / erasure**: handled manually by
  emailing `contact@save-samy.be`. The maintainer deletes the row from
  the Supabase dashboard. There is no self-serve delete UI (planned, but
  not v1).
- **Right to object / portability**: same manual process.
- The site serves EU users; Supabase and Vercel standard DPAs cover
  Article 28 obligations. If the project becomes commercial or hires
  staff, formalise these.

---

## 8. Known gaps / non-goals

Documented so the lawyer and future contributors can see the risk
posture at a glance.

1. **CAPTCHA fallback is Turnstile only** — fine for 99% of bots, but a
   determined human-plus-headless-browser can defeat it.
2. **Rate limit is per-instance** (see § 5).
3. **No email verification** — anyone can enter any email. The `unique`
   constraint on `email_lower` prevents double-signatures but doesn't
   prevent one signer entering someone else's address. Low practical
   impact for a petition.
4. **No audit log** on moderation actions.
5. **CSP relaxed** on scripts (see § 6).
6. **No automated purge** of `ip_hash` / `user_agent` after a given
   retention window. Rows carry those fields for the lifetime of the
   row. Current retention: until the petition closes, then rows are
   deleted within 12 months (per the privacy policy).
7. **Service-role key** bypasses RLS entirely. If a future code path
   lets user input influence a dynamic query under service-role, the
   whole DB is exposed. Current code never does this — keep it that
   way; code review should flag it.

---

## 9. Operational notes

### Rotating `IP_HASH_SALT`

If the salt leaks:
1. Generate a new random salt (`node -e
   "console.log(require('crypto').randomBytes(32).toString('base64'))"`).
2. Update the env var in Vercel (`vercel env rm IP_HASH_SALT`, then add
   with the new value, for each environment).
3. Redeploy.
4. Previous `ip_hash` values will no longer match newly-hashed IPs; this
   is expected. Historical rows aren't re-hashed.

### Deleting a signer or testimony

```sql
-- example: delete by email
delete from public.signatures where email_lower = lower('user@example.com');
delete from public.testimonies where email_lower = lower('user@example.com');
```

Run from the Supabase SQL editor (acts as service_role, bypasses RLS).

### Hiding instead of deleting

Flip `is_hidden = true` to pull a row from the public view without
removing it from the DB (preserves the signature count baseline but hides
the display).

---

## 10. Change log

- 2026-11-01: Initial write-up.
