import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedTestimonies } from "@/lib/testimony/actions";
import { TestimonyForm } from "@/components/testimony-form";
import { TestimonyList } from "@/components/testimony-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("testimonials");
  const testimonies = await getPublishedTestimonies();

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
          {t("title")}
        </h1>
        <p className="text-lg text-muted leading-relaxed">{t("subtitle")}</p>
        <p className="mt-4 text-sm text-muted max-w-3xl leading-relaxed">
          {t("intro")}
        </p>
      </header>

      <section className="bg-card rounded-3xl ring-1 ring-border p-6 sm:p-8 shadow-sm mb-16">
        <h2 className="font-semibold text-xl mb-5">{t("formTitle")}</h2>
        <TestimonyForm />
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">
          {t("listTitle")}
        </h2>
        <TestimonyList testimonies={testimonies} emptyLabel={t("empty")} />
      </section>

      <aside className="mt-16 bg-card/70 border border-border rounded-2xl p-6">
        <h2 className="font-semibold mb-2">{t("noteTitle")}</h2>
        <p className="text-sm text-muted leading-relaxed">{t("noteBody")}</p>
      </aside>
    </article>
  );
}
