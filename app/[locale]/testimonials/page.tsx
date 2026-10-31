import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { getReviews, type Review } from "@/lib/sanity/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "testimonials" });
  const indexable = process.env.NEXT_PUBLIC_SHOW_TESTIMONIALS === "1";
  return {
    title: t("title"),
    description: t("subtitle"),
    robots: indexable
      ? undefined
      : { index: false, follow: false, nocache: true },
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
  const currentLocale = (await getLocale()) as "fr" | "nl";
  const reviews = await getReviews();

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

      {reviews.length === 0 ? (
        <p className="text-muted italic">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-5">
          {reviews.map((r) => (
            <ReviewCard key={r._id} review={r} openLabel={t("openOriginal")} />
          ))}
        </ul>
      )}

      <aside className="mt-16 bg-card/70 border border-border rounded-2xl p-6">
        <h2 className="font-semibold mb-2">{t("noteTitle")}</h2>
        <p className="text-sm text-muted leading-relaxed">{t("noteBody")}</p>
      </aside>
    </article>
  );
}

function ReviewCard({
  review,
  openLabel,
}: {
  review: Review;
  openLabel: string;
}) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  return (
    <li className="bg-background rounded-2xl ring-1 ring-border p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-accent/10 text-accent font-semibold flex items-center justify-center">
          {review.authorFirstName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-foreground">
            {review.authorFirstName}
          </div>
          <div className="text-xs text-muted">
            {review.originalDateLabel ?? ""}
          </div>
        </div>
        <div
          className="ml-auto text-accent text-sm"
          aria-label={`${review.rating} / 5`}
          title={`${review.rating} / 5`}
        >
          {stars}
        </div>
      </div>
      <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
        {review.text}
      </p>
      <div className="mt-4">
        <a
          href={review.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm text-accent hover:text-accent-dark underline underline-offset-4"
        >
          {openLabel} ↗
        </a>
      </div>
    </li>
  );
}
