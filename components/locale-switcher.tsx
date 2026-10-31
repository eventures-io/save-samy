"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="flex items-center gap-1 text-xs rounded-full border border-border overflow-hidden"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            disabled={isPending || active}
            onClick={() =>
              startTransition(() => {
                router.replace(
                  // @ts-expect-error dynamic params typing
                  { pathname, params },
                  { locale: loc },
                );
              })
            }
            className={`px-3 py-1.5 uppercase tracking-wider font-medium transition-colors ${
              active
                ? "bg-foreground text-background"
                : "hover:bg-border/50"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
