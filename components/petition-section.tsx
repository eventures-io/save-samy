import { getTranslations } from "next-intl/server";
import { getPetitionStats } from "@/lib/petition/actions";
import { PetitionForm } from "./petition-form";
import { PetitionCountProvider } from "./petition-count-context";
import { SignatureCounter } from "./signature-counter";

const SIGNATURE_GOAL = 100;

export async function PetitionSection() {
  const t = await getTranslations("petition");
  const stats = await getPetitionStats();

  return (
    <section id="petition" className="py-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[2rem] bg-card/70 ring-1 ring-border shadow-sm p-6 sm:p-10 lg:p-14">
          <PetitionCountProvider
            initialCount={stats.count}
            goal={SIGNATURE_GOAL}
          >
            <div className="grid gap-10 lg:gap-14 md:grid-cols-2 md:items-stretch">
              <div className="flex flex-col h-full">
                <span className="inline-flex self-start items-center text-xs font-semibold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-full mb-6">
                  {t("kicker")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-6">
                  {t("sectionTitle")}
                </h2>
                <p className="text-lg text-muted leading-relaxed mb-8">
                  {t("intro")}
                </p>
                <ul className="space-y-4 mb-10">
                  {(["demand1", "demand2", "demand3"] as const).map((k) => (
                    <li key={k} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-2 w-2 flex-shrink-0 bg-accent rotate-45"
                      />
                      <span className="text-foreground leading-relaxed">
                        {t(k)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <SignatureCounter />
                </div>
              </div>
              <div className="bg-background/60 rounded-3xl ring-1 ring-border p-6 sm:p-8">
                <PetitionForm />
              </div>
            </div>
          </PetitionCountProvider>
        </div>
      </div>
    </section>
  );
}
