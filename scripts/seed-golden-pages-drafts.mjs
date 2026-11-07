// Seed the two Golden Pages reviews into Sanity as DRAFTS.
// Prerequisites in .env.local:
//   NEXT_PUBLIC_SANITY_PROJECT_ID   (same as the app uses)
//   NEXT_PUBLIC_SANITY_DATASET      (e.g. "production")
//   SANITY_WRITE_TOKEN              (Editor role — see README notes below)
//
// Run: node --env-file=.env.local scripts/seed-golden-pages-drafts.mjs
//
// Drafts live at `drafts.<id>` in Sanity. They are invisible to the public
// site (which queries with `perspective: "published"`) but visible to local
// dev when SANITY_READ_TOKEN is set in .env.local. Publish them from Sanity
// Studio when you're ready to put them on the live page.

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ndjsonPath = resolve(__dirname, "..", "sanity", "seed", "reviews.ndjson");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Create one with Editor role at " +
      "https://www.sanity.io/manage → API → Tokens, add it to .env.local, " +
      "then re-run this script.",
  );
  process.exit(1);
}

const TARGET_IDS = new Set(["review-philippine-gp", "review-clau392624"]);

const docs = readFileSync(ndjsonPath, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((doc) => TARGET_IDS.has(doc._id));

if (docs.length !== TARGET_IDS.size) {
  console.error(
    `Expected ${TARGET_IDS.size} target docs in NDJSON, found ${docs.length}.`,
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

for (const doc of docs) {
  const draftId = `drafts.${doc._id}`;
  const payload = { ...doc, _id: draftId };
  console.log(`Creating draft: ${draftId} (${doc.authorFirstName})`);
  await client.createOrReplace(payload);
}

console.log(`\nDone. ${docs.length} draft(s) written to dataset "${dataset}".`);
console.log(
  "Open Sanity Studio to review. Local dev (with SANITY_READ_TOKEN set) " +
    "will see them in /public-reviews immediately.",
);
