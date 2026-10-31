import type { PublishedTestimony } from "@/lib/testimony/actions";

export function TestimonyList({
  testimonies,
  emptyLabel,
}: {
  testimonies: PublishedTestimony[];
  emptyLabel: string;
}) {
  if (testimonies.length === 0) {
    return <p className="text-muted italic">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-5">
      {testimonies.map((t) => (
        <li
          key={t.id}
          className="bg-background rounded-2xl ring-1 ring-border p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-accent/10 text-accent font-semibold flex items-center justify-center">
              {t.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-foreground">{t.firstName}</div>
              <div className="text-xs text-muted">
                {t.city ?? ""}
              </div>
            </div>
          </div>
          <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
            {t.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
