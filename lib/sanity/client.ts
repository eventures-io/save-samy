import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2025-01-01";

// When SANITY_READ_TOKEN is set (local dev only — never commit, never set in
// prod), the client reads with the `drafts` perspective so unpublished
// documents are visible alongside published ones. Without the token we fall
// back to `published` + CDN, which is what prod uses.
const readToken = process.env.SANITY_READ_TOKEN;

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: !readToken,
      perspective: readToken ? "drafts" : "published",
      token: readToken,
    })
  : null;
