"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SiFacebook, SiX, SiWhatsapp, SiInstagram } from "react-icons/si";
import { FiLink } from "react-icons/fi";

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
      Icon: SiFacebook,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      Icon: SiX,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      Icon: SiWhatsapp,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/",
      Icon: SiInstagram,
      onClick: () => {
        navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {});
      },
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
      {targets.map(({ label, href, Icon, onClick }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-background ring-1 ring-border hover:ring-foreground hover:bg-stone-200 transition-colors font-medium"
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
          {t("shareOn")} {label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
      >
        <FiLink aria-hidden="true" className="h-4 w-4" />
        {copied ? t("copied") : t("copyLink")}
      </button>
    </div>
  );
}
