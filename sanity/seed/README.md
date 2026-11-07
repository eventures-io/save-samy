# Reviews seed

`reviews.ndjson` contains transcribed public reviews of the Veeweyde shelter
sourced from Google Maps and Golden Pages. Each line is a Sanity `review`
document.

**Posture notes:**
- Author first names only (or initials when the display name was a handle).
- No avatars, no surnames.
- Full text as published by the author on the source platform.
- Each review carries a `sourceUrl` back to its public source (Google Maps
  shortlink or Golden Pages company page).
- Don't cross-publish: if a review is already in the seed from Google Maps,
  do NOT also add it from Golden Pages (or vice-versa). One entry per real
  review.
- `review-robert` has `isPublished: false` because no public source URL was
  available at capture time — fill it in from the studio and flip
  `isPublished` on once a valid link is found.

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

After import, open the studio (`https://save-samy.sanity.studio`) → **Public
Review** list → spot-check a few. Each one can be unpublished from Sanity by
toggling the `isPublished` field off.

## When the lawyer greenlights going public

Set `NEXT_PUBLIC_SHOW_PUBLIC_REVIEWS=1` in Vercel → redeploy. That flips on:
- the nav link to `/public-reviews`
- indexing by search engines (robots meta is `noindex` until then)

The page itself (`/fr/public-reviews`, `/nl/public-reviews`) is already
reachable at the URL even without the flag, so you can share the link with
the lawyer for review.
