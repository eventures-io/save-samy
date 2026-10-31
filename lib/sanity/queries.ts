import type { PortableTextBlock } from "@portabletext/react";
import { sanityClient } from "./client";

type Locale = "fr" | "nl";

export type Story = {
  title?: string;
  body?: PortableTextBlock[];
};

export async function getStory(locale: Locale): Promise<Story | null> {
  if (!sanityClient) return null;
  try {
    const query = `*[_type == "story" && locale == $locale][0]{title, body}`;
    return await sanityClient.fetch<Story | null>(
      query,
      { locale },
      { next: { revalidate: 60, tags: ["story"] } },
    );
  } catch {
    return null;
  }
}
