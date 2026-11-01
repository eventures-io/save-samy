import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tMeta = useTranslations("meta");

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
        <div className="max-w-md">
          <div className="flex items-center gap-2 font-semibold text-white mb-3">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full bg-accent"
            />
            {tMeta("siteName")}
          </div>
          <p className="text-sm leading-relaxed">{t("tagline")}</p>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-3 text-sm">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/legal"
              className="hover:text-white transition-colors"
            >
              {t("legal")}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              {t("privacy")}
            </Link>
            <a
              href="mailto:contact@save-samy.be"
              className="hover:text-white transition-colors"
            >
              {t("contact")}
            </a>
          </nav>
          <span className="text-stone-500">{t("credits")}</span>
        </div>
      </div>
    </footer>
  );
}
