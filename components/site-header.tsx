import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tMeta = useTranslations("meta");

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span
            aria-hidden="true"
            className="inline-block h-7 w-7 rounded-full bg-accent"
          />
          <span>{tMeta("siteName")}</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/#story" className="hover:text-accent">
            {t("story")}
          </Link>
          <Link href="/#petition" className="hover:text-accent">
            {t("petition")}
          </Link>
          <Link href="/testimonials" className="hover:text-accent">
            {t("testimonials")}
          </Link>
          {process.env.NEXT_PUBLIC_SHOW_GOOGLE_REVIEWS === "1" && (
            <Link href="/google-reviews" className="hover:text-accent">
              {t("googleReviews")}
            </Link>
          )}
          <Link href="/#share" className="hover:text-accent">
            {t("share")}
          </Link>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
