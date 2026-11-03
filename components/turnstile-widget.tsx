"use client";

import { useLocale } from "next-intl";
import { Turnstile } from "@marsidev/react-turnstile";

export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = useLocale();
  if (!siteKey) return null;

  return (
    <div className="my-1">
      <Turnstile
        siteKey={siteKey}
        options={{
          theme: "light",
          size: "flexible",
          language: locale,
        }}
      />
    </div>
  );
}
