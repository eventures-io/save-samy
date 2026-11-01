"use client";

import { useTranslations } from "next-intl";

export function PrintButton() {
  const t = useTranslations("petitionPage");
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center px-5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity print:hidden"
    >
      {t("print")}
    </button>
  );
}
