import { defineType, defineField } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Google Review",
  type: "document",
  fields: [
    defineField({
      name: "authorFirstName",
      title: "Author (first name only, no surname)",
      type: "string",
      validation: (r) =>
        r.required().max(40).warning("Keep to first name or initials only"),
    }),
    defineField({
      name: "rating",
      title: "Rating (1–5 stars)",
      type: "number",
      options: {
        list: [
          { title: "★☆☆☆☆ (1)", value: 1 },
          { title: "★★☆☆☆ (2)", value: 2 },
          { title: "★★★☆☆ (3)", value: 3 },
          { title: "★★★★☆ (4)", value: 4 },
          { title: "★★★★★ (5)", value: 5 },
        ],
        layout: "radio",
      },
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: "text",
      title: "Review text (as published)",
      type: "text",
      rows: 6,
      validation: (r) => r.required().max(2000),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "Français", value: "fr" },
          { title: "Nederlands", value: "nl" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "originalDateLabel",
      title: "Date as shown on Google (e.g. 'a month ago', 'il y a 3 mois')",
      type: "string",
    }),
    defineField({
      name: "capturedAt",
      title: "Date we captured the review",
      type: "date",
    }),
    defineField({
      name: "sourceUrl",
      title: "Google Maps direct link to this review",
      description: "The maps.app.goo.gl/... shortlink shown on the screenshot.",
      type: "url",
      validation: (r) =>
        r
          .required()
          .uri({ scheme: ["http", "https"] })
          .custom((value) => {
            if (!value) return true;
            return value.includes("maps.app.goo.gl") ||
              value.includes("google.com/maps")
              ? true
              : "URL must point to Google Maps";
          }),
    }),
    defineField({
      name: "isPublished",
      title: "Published on site",
      description:
        "Uncheck to keep this review in Sanity but hide it from the public page.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Most recent capture",
      name: "capturedDesc",
      by: [{ field: "capturedAt", direction: "desc" }],
    },
    {
      title: "Lowest rating",
      name: "ratingAsc",
      by: [{ field: "rating", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "authorFirstName",
      subtitle: "text",
      rating: "rating",
      language: "language",
      published: "isPublished",
    },
    prepare({ title, subtitle, rating, language, published }) {
      const stars = "★".repeat(rating ?? 0) + "☆".repeat(5 - (rating ?? 0));
      const flag =
        language === "fr" ? "🇫🇷" : language === "nl" ? "🇳🇱" : "🇬🇧";
      const hidden = published === false ? " (hidden)" : "";
      return {
        title: `${title} — ${stars}${hidden}`,
        subtitle: `${flag} ${subtitle?.slice(0, 80) ?? ""}`,
      };
    },
  },
});
