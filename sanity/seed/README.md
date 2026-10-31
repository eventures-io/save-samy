# Reviews seed

`reviews.ndjson` contains the transcribed public Google Maps reviews of the
Veeweyde shelter. Each line is a Sanity `review` document.

**Posture notes:**
- Author first names only (or initials when the display name was a handle).
- No avatars, no surnames.
- Full text as published by the author on Google.
- Each review carries a `sourceUrl` back to the original Google Maps shortlink.
- One document (`review-robert`) has `isPublished: false` because its source
  URL was not visible in the PDF screenshots — fill it in from the studio and
  flip `isPublished` on.

## Import into Sanity

```bash
# From the project root, with Node 24 active:
nvm use 24

# One-time install of the sanity CLI (if not already there):
#   npm i -g sanity@latest    # optional
# Otherwise use npx below.

# Import. Will add to the dataset, keeping existing documents.
npx sanity@latest dataset import ./sanity/seed/reviews.ndjson production

# To overwrite existing docs with the same _id:
npx sanity@latest dataset import ./sanity/seed/reviews.ndjson production --replace
```

After import, open the studio (`https://save-samy.sanity.studio`) → **Google
Review** list → spot-check a few. Each one can be unpublished from Sanity by
toggling the `isPublished` field off.

## When the lawyer greenlights going public

Set `NEXT_PUBLIC_SHOW_TESTIMONIALS=1` in Vercel → redeploy. That flips on:
- the nav link to `/testimonials`
- indexing by search engines (robots meta is `noindex` until then)

The page itself (`/fr/testimonials`, `/nl/testimonials`) is already reachable
at the URL even without the flag, so you can share the link with the lawyer
for review.
