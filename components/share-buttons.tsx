"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ShareButtons({ url }: { url: string }) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);
  const text = t("shareText");
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const targets = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent("Samy")}&body=${encodedText}%20${encodedUrl}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-3">
      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center px-5 rounded-full bg-background ring-1 ring-border hover:ring-accent hover:text-accent transition-colors font-medium"
        >
          {t("shareOn")} {target.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-11 items-center px-5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
      >
        {copied ? t("copied") : t("copyLink")}
      </button>
    </div>
  );
}
