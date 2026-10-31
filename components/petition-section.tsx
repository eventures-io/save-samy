import { getTranslations } from "next-intl/server";
import { getPetitionStats } from "@/lib/petition/actions";
import { PetitionForm } from "./petition-form";
import { SignatureCounter } from "./signature-counter";

export async function PetitionSection() {
  const t = await getTranslations("petition");
  const stats = await getPetitionStats();

  return (
    <section id="petition" className="py-20 border-t border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 grid gap-12 md:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-8">
            {t("intro")}
          </p>
          <SignatureCounter count={stats.count} recent={stats.recent} />
        </div>
        <div className="bg-card rounded-3xl ring-1 ring-border p-6 sm:p-8 shadow-sm">
          <PetitionForm />
        </div>
      </div>
    </section>
  );
}
