import { useTranslations } from "next-intl";

type RecentSignature = {
  firstName: string;
  city: string | null;
  createdAt: string;
};

export function SignatureCounter({
  count,
  recent,
}: {
  count: number;
  recent: RecentSignature[];
}) {
  const t = useTranslations("petition");

  return (
    <div className="rounded-3xl ring-1 ring-border bg-background p-6">
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-semibold tracking-tight text-accent">
          {count.toLocaleString()}
        </span>
        <span className="text-muted">{t("counter", { count })}</span>
      </div>
      {recent.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {recent.map((s, i) => (
            <li
              key={i}
              className="text-sm rounded-full bg-card ring-1 ring-border px-3 py-1 text-muted"
            >
              {s.firstName}
              {s.city && <span className="opacity-60">, {s.city}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
