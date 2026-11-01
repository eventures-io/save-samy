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

export type Review = {
  _id: string;
  authorFirstName: string;
  rating: number;
  text: string;
  language: "fr" | "nl" | "en";
  originalDateLabel?: string;
  capturedAt?: string;
  sourceUrl: string;
};

export async function getReviews(
  filter?: { language?: "fr" | "nl" | "en" },
): Promise<Review[]> {
  if (!sanityClient) return [];
  try {
    const query = `*[_type == "review" && isPublished == true ${
      filter?.language ? "&& language == $language" : ""
    }] | order(capturedAt desc, _createdAt asc){
      _id, authorFirstName, rating, text, language, originalDateLabel, capturedAt, sourceUrl
    }`;
    return await sanityClient.fetch<Review[]>(
      query,
      filter ?? {},
      { next: { revalidate: 300, tags: ["reviews"] } },
    );
  } catch {
    return [];
  }
}
