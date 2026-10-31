# Save-Samy

Bilingual (FR/NL) advocacy website for Samy — a young Belgian malinois who was
abandoned, tied to a tree in a forest, and is currently held in a government
shelter that has refused serious adoption candidates.

The site collects petition signatures and will grow to document a pattern of
mistreatment, help people file formal complaints, and reach the press.

---

## v1 scope

- Landing page: hero, story (editable from Sanity), "why this matters", petition, share.
- Bilingual FR/NL with a language switcher.
- Petition form writing to Supabase, with GDPR consent, honeypot, IP rate-limit.
- Public signature counter + first-name display (only if the signer consents).
- Legal + privacy pages.
- Deployable to Vercel.

## v2 ideas (not yet built)

- Public comments display (gated behind lawyer greenlight).
- Press mentions carousel.
- Pre-filled complaint template to the responsible minister (Walloon or Flemish
  animal-welfare minister depending on shelter region).
- Multi-step moderation workflow.

---

## Stack

- Next.js 16 (App Router, React 19) + Tailwind 4.
- `next-intl` for FR/NL routing.
- **Sanity** (free US tier) for *editable site copy only*. **No personal data.**
- **Supabase** (free, region: Frankfurt) for petition signatures. All personal
  data stays in the EU.
- Vercel for hosting.
- Plausible for analytics (no cookies → no consent banner).

---

## Local setup

```bash
# 1. install deps
npm install

# 2. copy env file
cp .env.example .env.local
# edit .env.local — leave Sanity/Supabase values blank for now, the site
# will render with placeholder content.

# 3. run
npm run dev
# → http://localhost:3000
```

Routes:
- `/` → redirects to `/fr`
- `/fr`, `/nl` → landing
- `/fr/privacy`, `/nl/privacy` → privacy
- `/fr/legal`, `/nl/legal` → legal mentions
- `/studio` → embedded Sanity Studio (requires `NEXT_PUBLIC_SANITY_PROJECT_ID`)

---

## Supabase (Frankfurt) setup

1. Create account → <https://supabase.com>
2. **Create project** → region **West EU (Frankfurt)** (eu-central-1).
3. In the SQL editor, paste the contents of `supabase/schema.sql` and run it.
4. Copy project URL and service role key into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=...` (⚠ **server-only**, never commit)
5. Generate a random salt for `IP_HASH_SALT` and set it.
6. Restart `npm run dev`.

## Sanity setup

1. Create account → <https://www.sanity.io/manage>
2. Create a new project (any name). Note the **projectId**.
3. In `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
4. Visit `/studio` locally and sign in with the Sanity account. You can now
   create a "Samy's Story" document (one per language).
5. Add CORS origins in Sanity management for `http://localhost:3000` and your
   production domain.

## Vercel deploy

1. `git init && git add . && git commit -m "initial"` and push to GitHub.
2. Import the repo in Vercel.
3. Set the same env vars in **Project → Settings → Environment Variables**.
4. Deploy.

---

## Legal checklist (before publishing claims)

- [ ] Lawyer reviewed Samy's-story text (first-person testimony only).
- [ ] Lawyer reviewed the "why this matters" copy (no individuals named).
- [ ] `contact@sauvons-samy.be` is a working inbox.
- [ ] GDPR data-handling flow (export + delete) is tested with a real email.
- [ ] IP salt rotated from the dev default.
- [ ] Robots indexing left as default until the lawyer greenlights going public.

---

## Attribution

Site built as a civic/volunteer project.
