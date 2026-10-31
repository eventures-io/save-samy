import { defineType, defineField } from "sanity";

export const pressMentionType = defineType({
  name: "pressMention",
  title: "Press mention",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "outlet", type: "string" }),
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "locale", type: "string", options: { list: ["fr", "nl", "en"] } }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "title", outlet: "outlet" },
    prepare({ title, outlet }) {
      return { title, subtitle: outlet };
    },
  },
});
