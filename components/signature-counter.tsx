"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePetitionCount } from "./petition-count-context";

export function SignatureCounter() {
  const { count, goal } = usePetitionCount();
  const t = useTranslations("petition");
  const locale = useLocale();
  const formattedCount = count.toLocaleString(locale);
  const formattedGoal = goal.toLocaleString(locale);
  const pct = Math.min(100, Math.round((count / goal) * 100));

  return (
    <div className="rounded-2xl ring-1 ring-border bg-background/60 px-6 py-5">
      <div className="flex items-start gap-5">
        <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-accent leading-none tabular-nums transition-colors">
          {formattedCount}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
            {t("counterLabel")}
          </p>
          <p className="text-sm text-muted mt-0.5">
            {t("counterGoal", { goal: formattedGoal })}
          </p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={goal}
        className="mt-4 h-2 rounded-full bg-stone-200 overflow-hidden"
      >
        <div
          className="h-full bg-accent transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
