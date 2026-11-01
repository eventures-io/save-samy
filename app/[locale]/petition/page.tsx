import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { Link } from "@/i18n/navigation";
import { getPetition } from "@/lib/sanity/queries";
import { storyPortableTextComponents } from "@/components/portable-text-components";
import { PrintButton } from "@/components/print-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "petitionPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PetitionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("petitionPage");
  const current = (await getLocale()) as "fr" | "nl";
  const petition = await getPetition(current);

  if (!petition) {
    return (
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <p className="text-muted italic">{t("empty")}</p>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 print:py-6 print:max-w-none print:px-0">
      <header className="mb-10 print:mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight uppercase leading-tight print:text-2xl">
          {petition.title}
        </h1>

        {petition.addressees?.length ? (
          <aside className="mt-8 border border-border rounded-xl px-5 py-4 bg-card/60 print:bg-transparent print:border print:border-black">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted mb-2">
              {t("addresseesLabel")} :
            </p>
            <ul className="space-y-1">
              {petition.addressees.map((a, i) => (
                <li key={i} className="text-foreground">
                  {a}
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </header>

      <div className="text-foreground/90 print:text-black">
        {petition.body ? (
          <PortableText
            value={petition.body}
            components={storyPortableTextComponents}
          />
        ) : null}
      </div>

      <footer className="mt-14 flex flex-wrap gap-3 print:hidden">
        <Link
          href="/#petition"
          className="inline-flex h-11 items-center px-5 rounded-full bg-accent text-white font-medium shadow-sm hover:bg-accent-dark transition-colors"
        >
          {t("signOnline")}
        </Link>
        <PrintButton />
        <Link
          href="/"
          className="inline-flex h-11 items-center px-5 rounded-full border border-border bg-card hover:border-accent transition-colors"
        >
          {t("backToHome")}
        </Link>
      </footer>
    </article>
  );
}
