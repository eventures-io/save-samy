import { useTranslations } from "next-intl";
import Image from "next/image";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-50 via-background to-background" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
            {t("kicker")}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-balance">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#petition"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-accent text-white font-medium shadow-sm hover:bg-accent-dark transition-colors"
            >
              {t("cta")}
            </a>
            <a
              href="#story"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-border bg-card hover:border-accent transition-colors"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-card shadow-xl ring-1 ring-border">
          <Image
            src="/samy.jpeg"
            alt="Samy"
            fill
            priority
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
