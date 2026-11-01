import { defineType, defineField } from "sanity";

export const petitionType = defineType({
  name: "petition",
  title: "Pétition / Petitie",
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
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: "addressees",
      title: "Addressees (À l'attention de… / Ter attentie van…)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      description:
        "Full petition text. Use H2 for the section titles (Un schéma récurrent, Nos revendications), bullet lists for the revendications, italics for the closing statement.",
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
