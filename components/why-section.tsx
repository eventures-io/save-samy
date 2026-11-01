import { useTranslations } from "next-intl";

const CARD_BLOBS = [
  { color: "bg-orange-200", position: "-top-14 -left-14" },
  { color: "bg-orange-300", position: "-top-24 left-1/2 -translate-x-1/2" },
  { color: "bg-orange-400", position: "-top-14 -right-14" },
] as const;

export function WhySection() {
  const t = useTranslations("why");

  const points = [
    { title: t("point1Title"), body: t("point1Body") },
    { title: t("point2Title"), body: t("point2Body") },
    { title: t("point3Title"), body: t("point3Body") },
  ];

  return (
    <section className="py-24 bg-card/50 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
            {t("kicker")}
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-6">
            {t("sectionTitle")}
          </h2>
          <p className="text-lg text-muted leading-relaxed">{t("intro")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {points.map((p, i) => (
            <article
              key={i}
              className="relative overflow-hidden bg-background rounded-3xl p-8 ring-1 ring-border shadow-sm"
            >
              <div
                aria-hidden="true"
                className={`absolute h-40 w-40 rounded-full opacity-60 ${CARD_BLOBS[i].color} ${CARD_BLOBS[i].position}`}
              />
              <div className="relative pt-[4.75rem]">
                <h3 className="font-semibold text-xl sm:text-2xl mb-4 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-muted leading-relaxed">{p.body}</p>
              </div>
            </article>
          ))}
        </div>
        {process.env.NEXT_PUBLIC_VEEWEYDE_REVIEWS_URL && (
          <a
            href={process.env.NEXT_PUBLIC_VEEWEYDE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 text-accent hover:text-accent-dark font-medium underline underline-offset-4"
          >
            {t("reviewsLink")} →
          </a>
        )}
      </div>
    </section>
  );
}
