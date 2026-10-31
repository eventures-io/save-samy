import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tMeta = useTranslations("meta");

  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between items-start gap-6 text-sm text-muted">
        <div>
          <div className="font-semibold text-foreground mb-1">
            {tMeta("siteName")}
          </div>
          <p className="max-w-md">{t("tagline")}</p>
        </div>
        <nav className="flex flex-col gap-2 sm:items-end">
          <Link href="/legal" className="hover:text-accent">
            {t("legal")}
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            {t("privacy")}
          </Link>
          <a href="mailto:contact@save-samy.be" className="hover:text-accent">
            {t("contact")}
          </a>
          <span className="opacity-70">{t("credits")}</span>
        </nav>
      </div>
    </footer>
  );
}
