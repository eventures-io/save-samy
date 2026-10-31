import { getLocale, getTranslations } from "next-intl/server";
import { ShareButtons } from "./share-buttons";

export async function ShareSection() {
  const t = await getTranslations("share");
  const locale = await getLocale();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sauvons-samy.be";
  const url = `${siteUrl}/${locale}`;

  return (
    <section id="share" className="py-20 bg-card/50 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          {t("sectionTitle")}
        </h2>
        <p className="text-lg text-muted leading-relaxed mb-8 max-w-xl mx-auto">
          {t("intro")}
        </p>
        <ShareButtons url={url} />
      </div>
    </section>
  );
}
