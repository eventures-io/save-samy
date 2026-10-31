import { defineType, defineField } from "sanity";

export const storyType = defineType({
  name: "story",
  title: "Samy's Story",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "Français", value: "fr" },
          { title: "Nederlands", value: "nl" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "title", locale: "locale" },
    prepare({ title, locale }) {
      return {
        title: title || "(no title)",
        subtitle: locale ? locale.toUpperCase() : "",
      };
    },
  },
});
