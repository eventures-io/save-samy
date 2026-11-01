import { getLocale, getTranslations } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { getStory } from "@/lib/sanity/queries";
import { storyPortableTextComponents } from "./portable-text-components";

export async function StorySection() {
  const t = await getTranslations("story");
  const locale = (await getLocale()) as "fr" | "nl";
  const story = await getStory(locale);

  return (
    <section id="story" className="py-20 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
          {story?.title?.trim() || t("sectionTitle")}
        </h2>
        <div className="text-foreground/90">
          {story?.body ? (
            <PortableText
              value={story.body}
              components={storyPortableTextComponents}
            />
          ) : (
            <p className="text-lg text-muted italic">{t("placeholder")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
