import { useTranslations } from "next-intl";

export function WhySection() {
  const t = useTranslations("why");

  const points = [
    { title: t("point1Title"), body: t("point1Body") },
    { title: t("point2Title"), body: t("point2Body") },
    { title: t("point3Title"), body: t("point3Body") },
  ];

  return (
    <section className="py-20 bg-card/50 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-lg text-muted leading-relaxed">{t("intro")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {points.map((p, i) => (
            <article
              key={i}
              className="bg-background rounded-2xl p-6 ring-1 ring-border"
            >
              <div className="h-10 w-10 rounded-full bg-accent/10 text-accent font-semibold flex items-center justify-center mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-muted leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
        {process.env.NEXT_PUBLIC_VEEWEYDE_REVIEWS_URL && (
          <a
            href={process.env.NEXT_PUBLIC_VEEWEYDE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-accent hover:text-accent-dark font-medium underline underline-offset-4"
          >
            {t("reviewsLink")} →
          </a>
        )}
        <p className="mt-10 text-sm text-muted italic max-w-3xl">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
